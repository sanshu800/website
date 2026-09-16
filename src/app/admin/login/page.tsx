import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { AdminSignInForm } from "@/components/admin/SignInForm";
import { ReygentWordmark } from "@/components/brand/Logo";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * The admin sign-in.
 *
 * Unlinked from the public site and marked `noindex`: the only way here is the
 * URL. A session that is already valid skips the form entirely.
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
          <p className="mt-3 text-micro text-fog">
            Accounts for this site are created from the command line, not from a public
            form. There is no sign-up here.
          </p>

          <div className="mt-7">
            <AdminSignInForm next={target} />
          </div>

          <div className="mt-6 flex items-start gap-3 border-t border-line pt-5">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fog" aria-hidden="true" />
            <p className="text-[0.6875rem] leading-relaxed text-fog">
              Passwords are hashed with scrypt. Sessions are opaque tokens stored as
              SHA-256 hashes and sent in an httpOnly cookie; no third-party identity
              provider is involved.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.6875rem] text-fog">
          Not an administrator?{" "}
          <Link href="/" className="text-accent underline underline-offset-2">
            Back to the site
          </Link>
        </p>
      </div>
    </section>
  );
}
