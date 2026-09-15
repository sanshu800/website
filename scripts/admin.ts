/* eslint-disable no-console */
/**
 * Creates or updates an admin account.
 *
 *   npm run admin:create -- --email you@yourfirm.com --name "Your Name"
 *   npm run admin:create -- --email you@yourfirm.com --role admin
 *
 * There is no public sign-up on this site, so this is the only way an account
 * comes into existence. The password is prompted for and hashed with scrypt —
 * it is never passed as an argument, so it does not land in your shell history.
 */
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

const email = (arg("email") ?? "").trim().toLowerCase();
const name = (arg("name") ?? "").trim();
const role = (arg("role") ?? "owner").trim();

if (!email || !email.includes("@")) {
  console.error("A valid --email is required, e.g. --email you@yourfirm.com");
  process.exit(1);
}
if (!["owner", "admin"].includes(role)) {
  console.error(`--role must be "owner" or "admin" (got "${role}").`);
  process.exit(1);
}

mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'owner',
    org_name      TEXT NOT NULL DEFAULT 'Reygent',
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );
`);

const existing = db.prepare(`SELECT id FROM users WHERE lower(email) = ?`).get(email) as
  | { id: string }
  | undefined;

const rl = createInterface({ input: stdin, output: stdout });
const password = await rl.question(
  existing ? `New password for ${email}: ` : `Password for ${email}: `,
);
rl.close();

if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

const displayName = name || email.split("@")[0] || email;
const hash = hashPassword(password);

if (existing) {
  db.prepare(`UPDATE users SET password_hash = ?, name = ?, role = ? WHERE id = ?`).run(
    hash,
    displayName,
    role,
    existing.id,
  );
  console.log(`Updated ${email} (role: ${role}).`);
} else {
  const id = `usr_${randomBytes(8).toString("hex")}`;
  db.prepare(
    `INSERT INTO users (id, email, name, role, org_name, password_hash, created_at)
     VALUES (?, ?, ?, ?, 'Reygent', ?, ?)`,
  ).run(id, email, displayName, role, hash, new Date().toISOString());
  console.log(`Created ${email} (role: ${role}).`);
}

console.log("Sign in at /admin");
