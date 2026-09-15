import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell, LoginForm } from "@/components/forms/AuthForms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Reygent workspace.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { next } = await searchParams;
  const target = next && next.startsWith("/") ? next : "/dashboard";

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back."
      summary="Your workspace, the records that moved since you were last here, and whatever the team escalated overnight."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="text-violet underline underline-offset-2">
            Create one
          </Link>{" "}
          ·{" "}
          <Link href="/pricing" className="text-violet underline underline-offset-2">
            See pricing
          </Link>
        </>
      }
    >
      <LoginForm next={target} />
    </AuthShell>
  );
}
