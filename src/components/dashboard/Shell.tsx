"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  ChevronDown,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  Sparkles,
  LogOut,
  Users,
} from "lucide-react";
import { ReygentMark } from "@/components/brand/Logo";
import { cn, initials } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: number };

export function DashboardShell({
  children,
  user,
  counts,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; orgName: string; role: string };
  counts: { tasks: number; submissions: number };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/companies", label: "Companies", icon: Building2 },
    { href: "/dashboard/contacts", label: "Contacts", icon: Users },
    { href: "/dashboard/engagements", label: "Engagements", icon: BarChart3 },
    { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks, badge: counts.tasks },
    { href: "/dashboard/submissions", label: "Inbound", icon: Inbox, badge: counts.submissions },
    { href: "/dashboard/ask", label: "Ask Reygent", icon: Sparkles },
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <ReygentMark className="h-6 w-6 text-violet" />
        <span className="font-display text-[1.0625rem] tracking-[-0.02em] text-ink">
          Reygent
        </span>
      </Link>

      <nav aria-label="Dashboard" className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.875rem] transition-colors",
                    active
                      ? "bg-violet-soft font-medium text-violet"
                      : "text-fg-2 hover:bg-mist hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 font-mono text-[0.625rem]",
                        active ? "bg-violet text-white" : "bg-mist-2 text-fog",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-xl border border-line bg-mist p-4">
          <p className="font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
            Sample workspace
          </p>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-fog">
            Every figure here is computed from the seeded database in real time. Change a
            task and the totals move.
          </p>
        </div>
      </nav>

      <div className="border-t border-line p-3">
        <UserMenu user={user} />
      </div>
    </div>
  );

  return (
    <div className="min-h-[100svh] bg-mist">
      <div className="mx-auto flex w-full max-w-[var(--container-wide)]">
        <aside className="sticky top-0 hidden h-[100svh] w-[264px] shrink-0 border-r border-line bg-paper lg:block">
          {sidebar}
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-ink/40"
            />
            <div className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-paper">
              {sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              <DashboardSearch />

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/"
                  className="hidden rounded-full border border-line px-3.5 py-2 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist hover:text-ink sm:inline-flex"
                >
                  Marketing site
                </Link>
                <Link
                  href="/dashboard/ask"
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet px-3.5 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-violet-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function DashboardSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/dashboard/companies?q=${encodeURIComponent(value)}`);
      }}
      className="relative hidden flex-1 max-w-[420px] sm:block"
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-2" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search companies by name, domain or city"
        aria-label="Search companies"
        className="h-10 w-full rounded-full border border-line bg-mist pl-10 pr-4 text-[0.875rem] outline-none transition-[border-color,box-shadow] focus-visible:border-violet focus-visible:bg-paper focus-visible:shadow-[0_0_0_3px_rgba(91,52,242,0.14)]"
      />
    </form>
  );
}

function UserMenu({
  user,
}: {
  user: { name: string; email: string; orgName: string; role: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-mist"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[0.6875rem] text-on-ink">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] font-medium text-ink">
            {user.name}
          </span>
          <span className="block truncate text-[0.6875rem] text-fog">{user.orgName}</span>
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-fog-2 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-line bg-paper shadow-md">
          <div className="border-b border-line px-3.5 py-3">
            <p className="truncate text-[0.75rem] text-fog">{user.email}</p>
            <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
              {user.role}
            </p>
          </div>
          <Link
            href="/dashboard/companies"
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2.5 text-[0.8125rem] text-fg-2 hover:bg-mist"
          >
            Records
          </Link>
          <Link
            href="/legal/privacy"
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2.5 text-[0.8125rem] text-fg-2 hover:bg-mist"
          >
            Privacy
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="flex w-full items-center gap-2 border-t border-line px-3.5 py-2.5 text-left text-[0.8125rem] text-danger hover:bg-mist"
          >
            <LogOut className="h-3.5 w-3.5" />
            {busy ? "Signing out" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}

/** Page header used inside the dashboard — keeps every screen starting the same way. */
export function DashboardHeader({
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
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow && (
          <p className="font-mono text-[0.625rem] uppercase tracking-wide text-violet">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2.5 font-display text-[1.75rem] tracking-[-0.025em] text-ink sm:text-[2rem]">
          {title}
        </h1>
        {summary && <p className="mt-2 max-w-[46rem] text-micro text-fog">{summary}</p>}
      </div>
      {action}
    </div>
  );
}
