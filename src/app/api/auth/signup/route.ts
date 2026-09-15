import { NextResponse } from "next/server";
import { createSession, createUser, findUserByEmail } from "@/lib/auth";
import { fieldErrors, signupSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json(
      { error: "conflict", fields: { email: "An account already exists for this address." } },
      { status: 409 },
    );
  }

  const userId = await createUser(parsed.data);
  await createSession(userId, request.headers.get("user-agent") ?? undefined);

  return NextResponse.json({ ok: true, userId }, { status: 201 });
}
