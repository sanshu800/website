import { NextResponse, type NextRequest } from "next/server";

/**
 * CSRF guard for state-changing requests.
 *
 * The session cookie is `SameSite=None; Secure; Partitioned` so that signing in
 * survives being viewed inside an embedded frame, where this origin counts as
 * cross-site (see `src/lib/auth.ts`). Relaxing SameSite re-opens the classic
 * cross-site request vector, so every mutating call to the API must come from a
 * page on this origin.
 *
 * The signal is `Sec-Fetch-Site`, which every current browser sends and which is
 * computed from the initiating document — so a fetch from inside an embedded
 * frame to its own origin still reads `same-origin`, while a request started by
 * a page on another site reads `cross-site`. It is also immune to a proxy
 * rewriting `Host`, which a naive Origin comparison would not be.
 *
 * Requests with no `Sec-Fetch-Site` at all (curl, scripts, server-to-server) are
 * left alone: they are not browsers, and they never carry a victim's cookie from
 * another site.
 */
export function middleware(request: NextRequest) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return NextResponse.json({ error: "cross-site request blocked" }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  /* Only mutating API calls need the check; pages and assets are read-only. */
  matcher: ["/api/:path*"],
};
