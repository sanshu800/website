import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { dashboard } from "@/lib/queries";
import { DashboardShell } from "@/components/dashboard/Shell";

export const metadata: Metadata = {
  title: { default: "Workspace", template: "%s · Reygent" },
  robots: { index: false, follow: false },
};

/**
 * Every route under /dashboard requires a session. The check lives in the
 * layout so a new page cannot accidentally ship unauthenticated.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  const totals = dashboard.totals();

  return (
    <DashboardShell
      user={{
        name: session.name,
        email: session.email,
        orgName: session.orgName,
        role: session.role,
      }}
      counts={{ tasks: totals.openTasks, submissions: totals.submissions }}
    >
      {children}
    </DashboardShell>
  );
}
