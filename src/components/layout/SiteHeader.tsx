"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ReygentWordmark } from "@/components/brand/Logo";
import type { ChromeDoc } from "@/lib/content/pages/chrome";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Header.
 *
 * On the homepage the bar floats over the hero film with white type, then
 * becomes a solid paper bar the moment the page moves or a menu opens — the
 * same pattern as the hero reference, implemented without a scroll library.
 */
export function SiteHeader({
  brand,
  header,
}: {
  brand: ChromeDoc["brand"];
  header: ChromeDoc["header"];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every navigation surface closes itself from its own handlers, so no
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

  // Mobile sheet: lock scroll, trap focus, close on escape.
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
      const inside = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const toggle = document.getElementById("mobile-nav-close");
      const focusable = toggle ? [...inside, toggle] : inside;
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

  const activeMenu = header.nav.find((item) => item.label === openMenu);

  /**
   * Dark treatment: floating over the hero film at rest on the homepage, or
   * sitting above the black mobile sheet.
   */
  const overlay = mobileOpen || (pathname === "/" && !scrolled && !openMenu);

  const linkTone = overlay
    ? "text-on-ink/75 hover:text-on-ink"
    : "text-fg-2 hover:text-ink";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          overlay
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-paper/85 backdrop-blur-xl",
        )}
      >
        <Container width="wide">
          <div className="flex h-16 items-center justify-between gap-6">
            <Link
              href="/"
              aria-label={`${brand.name} — home`}
              className="shrink-0 transition-transform duration-300 hover:opacity-70"
            >
              <ReygentWordmark tone={overlay ? "on-ink" : "ink"} />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
              {header.nav.map((item) =>
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
                        "flex items-center gap-1 rounded-lg px-3.5 py-2 text-small transition-colors duration-200",
                        openMenu === item.label ? "text-ink" : linkTone,
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
                      "rounded-lg px-3.5 py-2 text-small transition-colors duration-200",
                      isActive(item.href) && !overlay ? "text-ink" : linkTone,
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href={header.actions.primary.href}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg px-4 text-[0.8125rem] font-medium transition-transform duration-300 hover:scale-[1.03] active:scale-95",
                  overlay ? "bg-on-ink text-ink" : "bg-accent text-white",
                )}
              >
                {header.actions.primary.label}
              </Link>
            </div>

            {/* Mobile: icon-only toggle, Menu rotating out as X rotates in. */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              id="mobile-nav-close"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-lg border transition-transform duration-300 active:scale-90 lg:hidden",
                overlay
                  ? "border-on-ink/25 text-on-ink"
                  : "border-line-strong text-ink",
              )}
            >
              <Menu
                className={cn(
                  "absolute h-5 w-5 transition-all duration-300",
                  mobileOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
                )}
              />
              <X
                className={cn(
                  "absolute h-5 w-5 transition-all duration-300",
                  mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
                )}
              />
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
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col gap-1 rounded-lg p-3 transition-colors duration-200 hover:bg-mist"
                      >
                        <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                          {child.label}
                          <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
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
                              onClick={() => setOpenMenu(null)}
                              className="text-small text-fg-2 transition-colors duration-200 hover:text-ink"
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

      {/* Mobile sheet — black, full height, one link per line. */}
      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-x-0 top-0 z-[45] overflow-hidden bg-ink/98 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          mobileOpen
            ? "pointer-events-auto h-[100svh] opacity-100"
            : "pointer-events-none h-0 opacity-0",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex h-[100svh] flex-col overflow-y-auto px-6 pb-16 pt-16 transition-all delay-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8",
            mobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <div className="my-auto w-full">
          <ul className="border-t border-white/10">
            {header.nav.map((item) => {
              const expanded = mobileSection === item.label;
              return (
                <li key={item.label} className="border-b border-white/10">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileSection(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className="text-[1.75rem] font-medium tracking-[-0.02em] text-on-ink/90">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-on-ink/50 transition-transform duration-300",
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
                            {[
                              ...item.children,
                              ...(item.columns?.flatMap((column) => column.items) ?? []),
                            ].map((child) => (
                              <li key={child.href + child.label}>
                                <Link
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-baseline justify-between gap-4 py-3 pl-4 text-[0.9375rem] text-on-ink/60 transition-colors hover:text-on-ink"
                                >
                                  {child.label}
                                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-on-ink/30" />
                                </Link>
                              </li>
                            ))}
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
                      <span className="text-[1.75rem] font-medium tracking-[-0.02em] text-on-ink/90">
                        {item.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-on-ink/30" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:max-w-[24rem]">
            <Link
              href={header.actions.primary.href}
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-on-ink text-[1rem] font-medium text-ink transition-transform duration-300 hover:scale-[1.02] active:scale-95"
            >
              {header.actions.primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          </div>
        </nav>
      </div>
    </>
  );
}
