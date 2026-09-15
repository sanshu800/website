import { NextResponse } from "next/server";
import { createSession, findUserByEmail, pruneSessions, verifyPassword } from "@/lib/auth";
import { fieldErrors, loginSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

  const user = await findUserByEmail(parsed.data.email);

  /**
   * One message for both failure modes, and the same work done either way:
   * telling an attacker which half of the credential pair was wrong is free
   * reconnaissance.
   */
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return NextResponse.json(
      { error: "Those credentials do not match an account." },
      { status: 401 },
    );
  }

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
