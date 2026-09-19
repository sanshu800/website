"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { tabCard, tabHint, tabIndex, tabLabel } from "@/components/ui/tabs";
import { Screen } from "@/components/screens/WorkScreens";
import type { Service } from "@/lib/content/services";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The five services, as a real tablist.
 *
 * Implemented as a real WAI-ARIA tablist: arrow-key navigation, correct
 * `aria-selected` / `aria-controls` wiring, and a panel that is present in the
 * DOM for screen readers and with motion disabled.
 */
export function ServiceTabs({
  services,
  copy,
}: {
  services: Service[];
  copy: { title: string; lede: string };
}) {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const reduce = useReducedMotion();
  const baseId = useId();

  const tabs = services;
  const current = tabs[Math.min(active, tabs.length - 1)]!;

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setInteracted(true);
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <section className="section bg-paper" id="services">
      <Container width="wide">
        <SectionHeading title={copy.title} lede={copy.lede} />

        <div
          role="tablist"
          aria-label="Services"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="mt-12 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:mt-14 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
        >
          {tabs.map((tab, index) => {
            const isActive = index === active;
            return (
              <button
                key={tab.slug}
                id={`${baseId}-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  setActive(index);
                  setInteracted(true);
                }}
                className={cn(
                  "group flex shrink-0 flex-col px-4 py-3.5 lg:shrink",
                  tabCard({ active: isActive, tone: "light" }),
                )}
              >
                <span className={tabIndex({ active: isActive, tone: "light" })}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-2 font-display text-body",
                    tabLabel({ active: isActive, tone: "light" }),
                  )}
                >
                  {tab.name}
                </span>
                <span className={tabHint({ tone: "light" })}>{tab.kicker}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={-1}
          className="mt-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: interacted ? 0.3 : 0.45, ease: EASE }}
              className="grid gap-10 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <h3 className="text-display-m text-ink">{current.headline}</h3>
                <p className="mt-4 text-body text-fog">{current.summary}</p>

                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {current.features.slice(0, 4).map((feature) => (
                    <li key={feature.title} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>
                        <span className="text-body font-medium text-ink">
                          {feature.title}
                        </span>
                        <span className="mt-0.5 block text-small text-fog">
                          {feature.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={`/services/${current.slug}`}
                  variant="secondary"
                  className="mt-8"
                  iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Explore {current.name}
                </ButtonLink>
              </div>

              <div className="lg:col-span-7">
                <div className="app-frame">
                  <div className="h-[360px] sm:h-[420px]">
                    <Screen name={current.home.screen} />
                  </div>
                </div>
                <p className="mt-3 font-mono text-eyebrow text-fog">
                  {current.panelCaption} · illustrative interface
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
