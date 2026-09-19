import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Who is signed in, according to the cookie the server can actually see.
 *
 * The sign-in form calls this immediately after a successful login. Without it,
 * a browser that drops the session cookie would navigate to `/admin`, be
 * redirected back to `/admin/login`, and the person would be told nothing —
 * which looks exactly like "sign in is broken".
 */
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { status: 401 });
  }
  return NextResponse.json({ signedIn: true, user });
}
