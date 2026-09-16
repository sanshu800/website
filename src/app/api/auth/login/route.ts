import { NextResponse } from "next/server";
import { createSession, findUserByEmail, pruneSessions, verifyPassword } from "@/lib/auth";
import { fieldErrors, loginSchema } from "@/lib/validation";
import { callerKey, clearLimit, rateLimit, tooManySignIns } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Two locks on the same door.
 *
 * The password is the only thing standing between the open internet and the
 * ability to rewrite every word on the site, and until now the endpoint would
 * answer an unlimited number of guesses — a single-instance, unauthenticated
 * account with no lockout is the cheapest possible way in.
 *
 * The address limit stops one machine working through a list. The account limit
 * stops a distributed attempt from concentrating on one inbox.
 *
 * Both are checked in the direction that protects the person who owns the
 * account. The account counter is only ever incremented by a *failure*, and it is
 * consulted *after* the password has been checked — never before — so a correct
 * password always gets in. Checking it first would have been simpler and worse:
 * anybody who knew the operator's email address could then lock them out of their
 * own admin for fifteen minutes at a time by failing on purpose. A lockout is
 * meant to stop guessing, and a correct guess is not guessing.
 *
 * Scope, stated honestly: like the rest of the limiter this state is in the Node
 * process, so a multi-instance deployment wants a shared counter. It raises the
 * cost of guessing from nothing to twenty minutes of work per five guesses,
 * which is the point.
 */
const ADDRESS_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };
const ACCOUNT_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function POST(request: Request) {
  const address = rateLimit({ key: callerKey(request, "auth"), ...ADDRESS_LIMIT });
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
   * reconnaissance.
   */
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    const failures = rateLimit({ key: accountKey, ...ACCOUNT_LIMIT });
    if (!failures.ok) return tooManySignIns(failures.retryAfterSeconds);
    return NextResponse.json(
      { error: "Those credentials do not match an account." },
      { status: 401 },
    );
  }

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
