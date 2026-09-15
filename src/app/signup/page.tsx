import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { AuthShell, SignupForm } from "@/components/forms/AuthForms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Start a 14-day Reygent trial — full product, no card required.",
  robots: { index: false },
};

const INCLUDED = [
  "Full platform for 14 days, every module",
  "Sample firm loaded so nothing is empty on first sign-in",
  "No card, no discovery call, cancel by doing nothing",
];

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account."
      summary="Four fields and you are inside. The dashboard is seeded with a sample firm, so you can see the whole model before importing anything of your own."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-violet underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <ul className="mb-8 space-y-2.5 border-b border-line pb-7">
        {INCLUDED.map((item) => (
          <li key={item} className="flex items-start gap-3 text-micro text-fog">
            <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-violet" />
            {item}
          </li>
        ))}
      </ul>
      <SignupForm />
    </AuthShell>
  );
}
