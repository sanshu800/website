"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { HomeDoc } from "@/lib/content/pages/home";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Conversation = HomeDoc["agents"]["conversation"];

/**
 * "See it working" — three examples of an agent doing a real job, rendered as
 * conversation UI with the sources attached.
 *
 * The tabs use the same semantics as the service tabs above: keyboard
 * navigable, correct ARIA, present without animation. Every string — the tab
 * list and the three conversations — lives in the home document, so the whole
 * section is editable from the admin without a deploy.
 */

function AlertAnswer({ copy }: { copy: Conversation["alerts"] }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-on-ink px-4 py-2.5 text-[0.8125rem] text-ink">
          {copy.question}
        </p>
      </div>
      <div className="flex gap-2.5">
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-3.5 w-3.5 text-on-ink" />
        </span>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-paper p-4">
          <p className="text-[0.8125rem] text-fg-2">{copy.intro}</p>
          <ul className="mt-3 space-y-3">
            {copy.items.map((row) => (
              <li key={row.name} className="border-l-2 border-danger/40 pl-3">
                <p className="text-[0.8125rem] font-medium text-ink">{row.name}</p>
                <p className="mt-0.5 text-[0.75rem] text-fog">{row.why}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {copy.sources.map((source) => (
              <span
                key={source}
                className="rounded-full bg-mist px-2 py-0.5 font-mono text-[0.625rem] text-fog"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefAnswer({ copy }: { copy: Conversation["brief"] }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-[0.8125rem] font-semibold text-accent-2">
            {copy.initials}
          </span>
          <div>
            <p className="text-[0.875rem] font-medium text-ink">{copy.title}</p>
            <p className="font-mono text-[0.6875rem] text-fog-2">{copy.meta}</p>
          </div>
        </div>
        <Badge accent="ink">{copy.badge}</Badge>
      </div>

      <div className="mt-5 space-y-4">
        {copy.blocks.map((block) => (
          <div key={block.label}>
            <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
              {block.label}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-fg-2">{block.body}</p>
          </div>
        ))}
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
            {copy.promisesLabel}
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {copy.promises.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[0.8125rem] text-fg-2">
                <Check className="mt-[5px] h-3.5 w-3.5 shrink-0 text-jade" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-caution-soft p-3">
          <p className="text-[0.8125rem] text-caution">{copy.risk}</p>
        </div>
      </div>
    </div>
  );
}

function AnswerAnswer({ copy }: { copy: Conversation["answer"] }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-[0.8125rem] text-fog">{copy.question}</p>
      <div className="mt-4 rounded-xl bg-mist p-4">
        <p className="font-mono text-[0.625rem] uppercase tracking-wide text-accent">
          {copy.finding}
        </p>
        <ol className="mt-3 space-y-3">
          {copy.steps.map((row, index) => (
            <li key={row.step} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-on-ink text-[0.625rem] font-semibold text-ink">
                {index + 1}
              </span>
              <span>
                <span className="text-[0.8125rem] font-medium text-ink">{row.step}</span>
                <span className="mt-0.5 block text-[0.75rem] text-fog">{row.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 text-[0.75rem] text-fog-2">{copy.note}</p>
    </div>
  );
}

export function AgentSection({ copy }: { copy: HomeDoc["agents"] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  /* both the tab list and the panel copy live in the home document */
  const tabs = copy.tabs;
  const current = tabs[Math.min(active, tabs.length - 1)]!;
  /* the panel key is not editable, but never trust it blindly: fall back to alerts */
  const panel = current.panel in copy.conversation ? current.panel : "alerts";

  return (
    <section className="section bg-ink text-on-ink" id="agents">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="ink"
              eyebrow={copy.eyebrow}
              title={<>{copy.title}</>}
              lede={copy.lede}
            />

            <div
              role="tablist"
              aria-label={`${copy.statusLabel} examples`}
              aria-orientation="vertical"
              className="mt-10 space-y-2"
              onKeyDown={(event) => {
                const last = tabs.length - 1;
                let next: number | null = null;
                if (event.key === "ArrowDown") next = active === last ? 0 : active + 1;
                if (event.key === "ArrowUp") next = active === 0 ? last : active - 1;
                if (next === null) return;
                event.preventDefault();
                setActive(next);
                document.getElementById(`ask-${next}`)?.focus();
              }}
            >
              {tabs.map((tab, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={tab.index}
                    id={`ask-${index}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls="ask-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(index)}
                    className={cn(
                      "flex w-full gap-4 rounded-xl border p-4 text-left transition-all duration-300",
                      isActive
                        ? "border-accent-3/50 bg-white/[0.06]"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem]",
                        isActive ? "text-accent-3" : "text-on-ink-2/60",
                      )}
                    >
                      {tab.index}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-[0.9375rem] font-medium",
                          isActive ? "text-on-ink" : "text-on-ink-2",
                        )}
                      >
                        {tab.title}
                      </span>
                      <span className="mt-1 block text-micro text-on-ink-2">
                        {tab.body}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Link
              href="/services/ai-agents"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent-3"
            >
              {copy.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div
              id="ask-panel"
              role="tabpanel"
              aria-labelledby={`ask-${active}`}
              tabIndex={-1}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl bg-[radial-gradient(60%_60%_at_50%_20%,rgba(10,10,11,0.16),transparent_70%)] blur-xl"
              />
              <div className="relative rounded-2xl border border-white/10 bg-ink-2 p-4 shadow-xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-on-ink-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-jade" />
                    {copy.statusLabel}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-on-ink-2/70">
                    {copy.statusNote}
                  </span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.index}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {panel === "brief" ? (
                      <BriefAnswer copy={copy.conversation.brief} />
                    ) : panel === "answer" ? (
                      <AnswerAnswer copy={copy.conversation.answer} />
                    ) : (
                      <AlertAnswer copy={copy.conversation.alerts} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
