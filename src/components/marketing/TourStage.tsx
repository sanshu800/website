"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Screen, type ScreenName } from "@/components/screens/WorkScreens";
import { cn } from "@/lib/utils";

export type TourStageData = {
  slug: string;
  name: string;
  title: string;
  body: string;
  screen: ScreenName;
  caption: string;
  bullets: string[];
  href: string;
};

/**
 * The product tour.
 *
 * A vertical tablist: choosing a stage swaps the interface panel beside it.
 * Keyboard behaviour matches the ARIA tabs pattern (arrows, Home, End), and
 * every stage is reachable without JavaScript because the copy is rendered for
 * all stages and the panel is the only thing that changes.
 */
export function TourStage({ stages }: { stages: TourStageData[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = stages[active] ?? stages[0];
  if (!current) return null;

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = stages.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Product tour stages"
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {stages.map((stage, index) => {
            const selected = index === active;
            return (
              <button
                key={stage.slug}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                id={`tour-tab-${stage.slug}`}
                aria-selected={selected}
                aria-controls={`tour-panel-${stage.slug}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "shrink-0 rounded-xl border px-4 py-3.5 text-left transition-colors lg:w-full",
                  selected
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-ink/20 hover:bg-mist/60",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.625rem]",
                    selected ? "text-accent" : "text-fog-2",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block whitespace-nowrap font-display text-[1.0625rem] lg:whitespace-normal",
                    selected ? "text-ink" : "text-fg-2",
                  )}
                >
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8">
        <div
          role="tabpanel"
          id={`tour-panel-${current.slug}`}
          aria-labelledby={`tour-tab-${current.slug}`}
          tabIndex={0}
          className="rounded-2xl border border-line bg-paper p-6 sm:p-8"
        >
          <h3 className="text-display-s text-ink">{current.title}</h3>
          <p className="mt-3 text-body-lg text-fog">{current.body}</p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {current.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-micro text-fg-2">
                <Check className="h-3.5 w-3.5 text-accent" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <figure className="mt-6">
          <div className="app-frame overflow-hidden rounded-2xl">
            <Screen name={current.screen} />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[0.75rem] text-fog">{current.caption}</span>
            <Link
              href={current.href}
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-accent"
            >
              Learn more about {current.name}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
