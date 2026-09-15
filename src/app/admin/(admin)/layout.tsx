import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { overrideStats } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/**
 * Every page in this group requires a session, and the check lives in the
 * layout so a new page cannot accidentally ship unauthenticated. Sign-in itself
 * sits outside the group, which is what keeps this from redirecting in a loop.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  if (session.role !== "owner" && session.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[40rem] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-eyebrow uppercase text-fog-2">403</p>
        <h1 className="mt-4 text-display-m text-ink">This account cannot edit the site.</h1>
        <p className="mt-4 text-body-lg text-fog">
          You are signed in as {session.email}, which has the role “{session.role}”. Editing
          requires the owner or admin role.
        </p>
      </div>
    );
  }

  const stats = overrideStats();

  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      editedCount={stats.total}
    >
      {children}
    </AdminShell>
  );
}
