"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ReygentWordmark } from "@/components/brand/Logo";
import { primaryNav, site } from "@/lib/content/marketing";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every navigation surface closes itself from its own link handlers, so no
  // route-change effect is needed (and none is wanted — see react-hooks).

  const openWithDelay = useCallback((label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  const closeWithDelay = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Mobile: lock scroll, trap focus, close on escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(`${href}/`) : false;

  const activeMenu = primaryNav.find((item) => item.label === openMenu);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent bg-paper/0",
        )}
      >
        <Container width="wide">
          <div className="flex h-16 items-center justify-between gap-6">
            <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
              <ReygentWordmark />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
              {primaryNav.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openWithDelay(item.label)}
                    onMouseLeave={closeWithDelay}
                  >
                    <button
                      type="button"
                      aria-expanded={openMenu === item.label}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenMenu(openMenu === item.label ? null : item.label)
                      }
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3.5 py-2 text-small transition-colors duration-200",
                        openMenu === item.label
                          ? "text-ink"
                          : "text-fg-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          openMenu === item.label && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href ?? "/"}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-small transition-colors duration-200",
                      isActive(item.href) ? "text-ink" : "text-fg-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/get-started" size="sm">
                Get started
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="flex h-9 items-center gap-2 rounded-full border border-line-strong px-3 text-fg-2 lg:hidden"
            >
              <Menu className="h-4 w-4" />
              <span className="text-small">Menu</span>
            </button>
          </div>
        </Container>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
              onMouseEnter={() => openWithDelay(activeMenu.label)}
              onMouseLeave={closeWithDelay}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-paper shadow-lg lg:block"
            >
              <Container width="wide" className="py-7">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-1">
                    {activeMenu.children?.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        className="group flex flex-col gap-1 rounded-lg p-3 transition-colors duration-200 hover:bg-mist"
                      >
                        <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                          {child.label}
                          <span className="h-px w-0 bg-violet transition-all duration-300 group-hover:w-4" />
                        </span>
                        <span className="text-micro text-fog">{child.blurb}</span>
                      </Link>
                    ))}
                  </div>
                  {activeMenu.columns?.map((column) => (
                    <div key={column.title} className="col-span-4 border-l border-line pl-8">
                      <p className="font-mono text-eyebrow uppercase text-fog-2">
                        {column.title}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {column.items.map((item) => (
                          <li key={item.href + item.label}>
                            <Link
                              href={item.href}
                              className="text-small text-fg-2 transition-colors duration-200 hover:text-violet"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-6">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <ReygentWordmark />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 items-center gap-2 rounded-full border border-line-strong px-3 text-fg-2"
              >
                <X className="h-4 w-4" />
                <span className="text-small">Close</span>
              </button>
            </div>

            <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 pb-8 sm:px-6">
              <ul className="border-t border-line">
                {primaryNav.map((item) => {
                  const expanded = mobileSection === item.label;
                  return (
                    <li key={item.label} className="border-b border-line">
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileSection(expanded ? null : item.label)
                            }
                            aria-expanded={expanded}
                            className="flex w-full items-center justify-between py-4 text-left"
                          >
                            <span className="font-display text-[1.25rem] text-ink">
                              {item.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-fog transition-transform duration-300",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: EASE }}
                                className="overflow-hidden"
                              >
                                {[...item.children, ...(item.columns?.flatMap((c) => c.items) ?? [])].map(
                                  (child) => (
                                    <li key={child.href + child.label}>
                                      <Link
                                        href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-baseline justify-between gap-4 py-3 pl-4 text-[0.9375rem] text-fg-2"
                                      >
                                        {child.label}
                                        <span className="h-px w-4 shrink-0 bg-line-strong" />
                                      </Link>
                                    </li>
                                  ),
                                )}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href ?? "/"}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between py-4"
                        >
                          <span className="font-display text-[1.25rem] text-ink">
                            {item.label}
                          </span>
                          <span className="h-px w-5 bg-line-strong" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href="/get-started" size="lg" full>
                  Get started
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary" size="lg" full>
                  Log in
                </ButtonLink>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 text-center text-micro text-fog"
                >
                  {site.email}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
