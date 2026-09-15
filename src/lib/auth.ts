import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { all, newId, one, run } from "./db";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Authentication.
 *
 * Self-contained: scrypt password hashing (Node crypto, no native deps), and
 * opaque session tokens stored as SHA-256 hashes in SQLite. The raw token only
 * ever exists in the user's httpOnly cookie.
 *
 * The boundary is deliberately narrow — `createSession`, `getSession`,
 * `destroySession` — so swapping in an external identity provider later means
 * rewriting this file and nothing else.
 */

export const SESSION_COOKIE = "reygent_session";
const SESSION_DAYS = 30;
const SCRYPT_KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), SCRYPT_KEYLEN);
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  orgName: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  org_name: string;
  password_hash: string;
};

/**
 * Cookie attributes for the session.
 *
 * This app is routinely opened inside an embedded preview frame, where its own
 * origin counts as **cross-site** relative to the top-level page. A `SameSite=Lax`
 * cookie is withheld on every request made from that frame — including the one
 * that follows a successful sign-in — so the dashboard guard sees no session and
 * bounces straight back to `/login`. `SameSite=None` allows the cookie in that
 * context, and `Partitioned` (CHIPS, RFC 9578) keeps it working in browsers that
 * block third-party cookies outright.
 *
 * Those attributes are illegal over plain http, so local development falls back
 * to the ordinary Lax cookie. Both shapes are first-party-safe: on a normal
 * https deployment the partitioned cookie is stored in its own partition and
 * sent as usual.
 */
function sessionCookieOptions(expires?: Date) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: secure ? ("none" as const) : ("lax" as const),
    secure,
    partitioned: secure,
    path: "/",
    ...(expires ? { expires } : { maxAge: 0 }),
  };
}

export async function createSession(
  userId: string,
  userAgent?: string,
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);

  run(
    `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at, user_agent)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      newId("ses"),
      userId,
      hashToken(token),
      now.toISOString(),
      expires.toISOString(),
      userAgent ?? null,
    ],
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(expires));

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = one<UserRow & { expires_at: string }>(
    `SELECT u.id, u.email, u.name, u.role, u.org_name, u.password_hash, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?`,
    [hashToken(token)],
  );

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    run(`DELETE FROM sessions WHERE token_hash = ?`, [hashToken(token)]);
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    orgName: row.org_name,
  };
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    run(`DELETE FROM sessions WHERE token_hash = ?`, [hashToken(token)]);
  }
  /* Clearing with the same attributes, so the partitioned cookie goes too. */
  store.set(SESSION_COOKIE, "", sessionCookieOptions());
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return one<UserRow>(
    `SELECT id, email, name, role, org_name, password_hash FROM users WHERE lower(email) = lower(?)`,
    [email],
  );
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  orgName: string;
}): Promise<string> {
  const id = newId("usr");
  run(
    `INSERT INTO users (id, email, name, role, org_name, password_hash, created_at)
     VALUES (?, ?, ?, 'owner', ?, ?, ?)`,
    [
      id,
      input.email.toLowerCase(),
      input.name,
      input.orgName,
      await hashPassword(input.password),
      new Date().toISOString(),
    ],
  );
  return id;
}

/** Housekeeping for expired sessions. Called opportunistically. */
export async function pruneSessions(): Promise<void> {
  run(`DELETE FROM sessions WHERE expires_at < ?`, [new Date().toISOString()]);
}

export function sessionCount(): number {
  const rows = all<{ n: number }>(`SELECT COUNT(*) AS n FROM sessions`);
  return rows[0]?.n ?? 0;
}
