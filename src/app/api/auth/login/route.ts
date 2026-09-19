import { NextResponse } from "next/server";
import {
  createSession,
  findUserByEmail,
  pruneSessions,
  userCount,
  verifyPassword,
} from "@/lib/auth";
import { fieldErrors, loginSchema } from "@/lib/validation";
import { callerKey, clearLimit, rateLimit, tooManySignIns } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Two locks on the same door.
 *
 * The password is the only thing standing between the open internet and the
 * ability to rewrite every word on the site, and the endpoint used to answer an
 * unlimited number of guesses — a single-instance, unauthenticated account with
 * no lockout is the cheapest possible way in.
 *
 * The address limit stops one machine working through a list. The account limit
 * stops a distributed attempt from concentrating on one inbox.
 *
 * **Only failures count towards either of them, and a sign-in that works clears
 * both.** That distinction is the whole design. An earlier version counted every
 * attempt, including successful ones, so signing in repeatedly — an operator
 * checking which password is right, or a person signing in on several devices —
 * locked that address out of its own admin with an error about attacks. The
 * limit was aimed at the wrong caller. Counting failures still stops guessing,
 * because a guess that is wrong is the only kind that matters; a guess that is
 * right needs no stopping.
 *
 * The address check runs *before* the password is verified, and a correct
 * password does not bypass it — deliberately, because the alternative is doing
 * scrypt work for a caller who is already blocked, which is the denial of
 * service this gate exists to prevent. The counter rises with every attempt and
 * a success resets it, so an address reaches that gate by making ten attempts
 * with no successful one among them.
 *
 * Scope, stated honestly: like the rest of the limiter this state is in the Node
 * process, so a multi-instance deployment wants a shared counter. It raises the
 * cost of guessing from nothing to twenty minutes of work per five guesses,
 * which is the point.
 */
const ADDRESS_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };
const ACCOUNT_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

/**
 * A scrypt hash of nothing in particular, verified against when the address does
 * not belong to an account. Without it, an unknown email skips the expensive
 * part and answers in a millisecond while a known one takes a hundred — which
 * tells an attacker which of the two they found, for free. The hash is a real
 * one so the same work happens either way.
 */
const ABSENT_ACCOUNT_HASH =
  "scrypt$9b0e42079cd0b9f0dba57f66b7a851bf$72f884dfb4f80541c8ad96d40a603523b4758fcec3aa3d3f50a0ad5a4180e64c307f4af03587d29752b95fea568dd7b6f49ed61d2b34e51569dc89a09dfad432";

export async function POST(request: Request) {
  const addressKey = callerKey(request, "auth");

  /**
   * The pre-check, before any password work. It only reflects *failures* — a
   * sign-in that succeeds clears the counter — so no amount of signing in
   * correctly can lock anyone out of their own admin.
   */
  const address = rateLimit({ key: addressKey, ...ADDRESS_LIMIT });
  if (!address.ok) return tooManySignIns(address.retryAfterSeconds);


  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const accountKey = `auth-account:${parsed.data.email.trim().toLowerCase()}`;

  const user = await findUserByEmail(parsed.data.email);

  /**
   * One message for both failure modes, and the same work done either way:
   * telling an attacker which half of the credential pair was wrong is free
   * reconnaissance. An unknown address is verified against a throwaway hash
   * rather than skipped, so `known` and `unknown` take the same time.
   */
  const matches = await verifyPassword(
    parsed.data.password,
    user?.password_hash ?? ABSENT_ACCOUNT_HASH,
  );

  if (!user || !matches) {
    /**
     * A password that arrives with a space on either end is a paste or an
     * autofilled newline, and it is invisible in the field: the person sees the
     * password they meant and is told the credentials are wrong. It is worth
     * naming, because it is the one failure the person cannot see — and the
     * answer is derived from what was *submitted*, never from what is stored, so
     * it says nothing about whether an account exists.
     */
    const padded = parsed.data.password !== parsed.data.password.trim();

    /**
     * Logged for the operator, never returned: the address that was tried and
     * whether it has an account. The length is not the secret and it is the
     * detail that answers "but I typed it right" — the password itself is never
     * recorded. `console.warn` because this is a security event, not chatter.
     */
    console.warn(
      `[auth] refused sign-in for ${parsed.data.email} — account ${
        user ? "exists" : "not found"
      }, password ${
        padded
          ? "has surrounding whitespace"
          : `${parsed.data.password.length} character${parsed.data.password.length === 1 ? "" : "s"}`
      }`,
    );

    const failures = rateLimit({ key: accountKey, ...ACCOUNT_LIMIT });
    if (!failures.ok) return tooManySignIns(failures.retryAfterSeconds);

    /**
     * A database with no accounts at all is a different problem with a different
     * fix, and it is the normal state of a fresh deployment: the seed that
     * creates the demo logins is a development tool. Checked only here, on the
     * failure path, so a successful sign-in pays nothing for it.
     *
     * Safe to say out loud: it reports that the install has no accounts, which
     * is not something an attacker can use — there is nothing to guess — and it
     * is exactly what the person running a brand new deployment needs to know.
     */
    const noneExist = !user && userCount() === 0;

    return NextResponse.json(
      {
        error: noneExist
          ? "This site has no admin accounts yet. Create one on the server with `npm run admin:create` and sign in with that."
          : padded
            ? "That password has a space at the start or end. Remove it and try again."
            : "Those credentials do not match an account.",
      },
      { status: 401 },
    );
  }

  /* A sign-in that worked forgives the attempts that did not — for this address
   * and for this account. */
  clearLimit(addressKey);
  clearLimit(accountKey);
  await pruneSessions();
  await createSession(user.id, request.headers.get("user-agent") ?? undefined);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      orgName: user.org_name,
    },
  });
}
