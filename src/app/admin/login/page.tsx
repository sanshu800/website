import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { AdminSignInForm } from "@/components/admin/SignInForm";
import { ReygentWordmark } from "@/components/brand/Logo";
import { getSession, userCount } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * The admin sign-in.
 *
 * Unlinked from the public site and marked `noindex`: the only way here is the
 * URL. A session that is already valid skips the form entirely.
 *
 * When the database has no accounts, this says so *before* anyone types a
 * password. That state is the normal one on a fresh deployment — the seed that
 * creates the demo logins is a development tool — and the credential failure it
 * causes reads as a wrong password, which sends people looking for a typo that
 * is not there. Telling them up front costs one count on a page only an
 * administrator ever loads, and it is safe to say: a site with no accounts has
 * nothing to guess.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const params = await searchParams;
  const target = params.next && params.next.startsWith("/admin") ? params.next : "/admin";
  const noAccounts = userCount() === 0;

  return (
    <section className="relative flex min-h-[100svh] items-center border-b border-line bg-paper pb-16 pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(10,10,11,0.07),transparent_72%)]"
      />
      <div className="relative mx-auto w-full max-w-[26rem] px-5 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <ReygentWordmark tone="ink" />
        </Link>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-7 sm:p-8">
          <h1 className="text-display-m text-ink">Sign in to edit the site.</h1>
          <p className="mt-3 text-small text-fog">
            Accounts for this site are created from the command line, not from a public
            form. There is no sign-up here.
          </p>

          {noAccounts && (
            <div
              role="status"
              className="mt-6 rounded-lg border border-line bg-mist px-4 py-3 text-small text-ink"
            >
              <p className="font-medium">This site has no admin accounts yet.</p>
              <p className="mt-1.5 leading-relaxed text-fog">
                A new deployment starts empty — the demo logins come from a development
                seed. Create your account on the server:
              </p>
              <code className="mt-2 block rounded-md bg-paper px-2.5 py-1.5 font-mono text-eyebrow text-ink">
                npm run admin:create
              </code>
            </div>
          )}

          <div className="mt-7">
            <AdminSignInForm next={target} />
          </div>

          <div className="mt-6 flex items-start gap-3 border-t border-line pt-5">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fog" aria-hidden="true" />
            <p className="text-eyebrow leading-relaxed text-fog">
              Passwords are hashed with scrypt. Sessions are opaque tokens stored as
              SHA-256 hashes and sent in an httpOnly cookie; no third-party identity
              provider is involved.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-eyebrow text-fog">
          Not an administrator?{" "}
          <Link href="/" className="text-accent underline underline-offset-2">
            Back to the site
          </Link>
        </p>
      </div>
    </section>
  );
}
