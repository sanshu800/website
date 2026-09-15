"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { History, LogOut, PenLine } from "lucide-react";
import { ReygentMark } from "@/components/brand/Logo";
import { cn, initials } from "@/lib/utils";

/**
 * Shell for the admin area.
 *
 * Deliberately not linked from the public site — the only way in is the URL and
 * the only way through is a session (see `../layout.tsx`). The nav is short
 * because the admin does one job: editing what the marketing site says.
 */

type NavItem = { href: string; label: string; icon: React.ElementType };

export function AdminShell({
  children,
  user,
  editedCount,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; role: string };
  editedCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const nav: NavItem[] = [
    { href: "/admin", label: "Website content", icon: PenLine },
    { href: "/admin/history", label: "History", icon: History },
  ];

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/edit") : pathname === href;

  return (
    <div className="min-h-[100svh] bg-mist">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <ReygentMark className="h-6 w-6 text-accent" />
              <span className="font-display text-[1.0625rem] tracking-[-0.02em] text-ink">
                Reygent AI
              </span>
            </Link>
            <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
              Admin
            </span>
          </div>

          <nav aria-label="Admin" className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[0.875rem] font-medium transition-colors",
                  isActive(item.href) ? "bg-ink text-on-ink" : "text-fog hover:bg-mist hover:text-ink",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {editedCount > 0 && (
              <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[0.6875rem] text-accent sm:inline">
                {editedCount} live {editedCount === 1 ? "edit" : "edits"}
              </span>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-[0.8125rem] font-medium leading-tight text-ink">{user.name}</p>
              <p className="font-mono text-[0.6875rem] leading-tight text-fog-2">{user.role}</p>
            </div>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-[0.6875rem] text-on-ink"
            >
              {initials(user.name)}
            </span>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-mist disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{signingOut ? "Signing out" : "Sign out"}</span>
            </button>
          </div>
        </div>

        {/* Small screens: the same two destinations, as a second row. */}
        <nav aria-label="Admin" className="border-t border-line px-5 sm:hidden">
          <div className="flex gap-1 py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-[0.875rem] font-medium transition-colors",
                  isActive(item.href) ? "bg-ink text-on-ink" : "text-fog hover:bg-mist hover:text-ink",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-5 py-8 sm:px-6">{children}</main>

      <footer className="mx-auto w-full max-w-[1240px] px-5 pb-10 sm:px-6">
        <p className="text-[0.6875rem] leading-relaxed text-fog-2">
          Private admin. Not linked from the public site and excluded from search engines.
          Every save is validated, attributed and reversible from the History screen.
        </p>
      </footer>
    </div>
  );
}

export function AdminHeader({
  eyebrow,
  title,
  summary,
  action,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-5">
      <div>
        {eyebrow && (
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog-2">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-display-m text-ink">{title}</h1>
        {summary && <p className="mt-3 max-w-[44rem] text-body-lg text-fog">{summary}</p>}
      </div>
      {action}
    </div>
  );
}
