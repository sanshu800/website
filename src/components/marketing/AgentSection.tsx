"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { tabCard, tabHint, tabIndex, tabLabel } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/Badge";
import type { HomeDoc } from "@/lib/content/pages/home";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Conversation = HomeDoc["walkthrough"]["conversation"];

/**
 * "See it working" — three examples of a real job being handled, rendered as
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
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-on-ink px-4 py-2.5 text-small text-ink">
          {copy.question}
        </p>
      </div>
      <div className="flex gap-2.5">
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-3.5 w-3.5 text-on-night" />
        </span>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line bg-paper p-4">
          <p className="text-small text-fg-2">{copy.intro}</p>
          <ul className="mt-3 space-y-3">
            {copy.items.map((row) => (
              <li key={row.name} className="rounded-lg border border-line bg-mist/60 px-3 py-2.5">
                <p className="flex items-center gap-2 text-small font-medium text-ink">
                  {/* The one row that needs a decision is marked by a dot, which
                      says the same thing as a thick red rule without shouting. */}
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
                    aria-hidden="true"
                  />
                  {row.name}
                </p>
                <p className="mt-0.5 pl-3.5 text-label text-fog">{row.why}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {copy.sources.map((source) => (
              <span
                key={source}
                className="rounded-full bg-mist px-2 py-0.5 font-mono text-label text-fog"
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-small font-semibold text-fg-2">
            {copy.initials}
          </span>
          <div>
            <p className="text-small font-medium text-ink">{copy.title}</p>
            <p className="font-mono text-eyebrow text-fog">{copy.meta}</p>
          </div>
        </div>
        <Badge accent="ink">{copy.badge}</Badge>
      </div>

      <div className="mt-5 space-y-4">
        {copy.blocks.map((block) => (
          <div key={block.label}>
            <p className="font-mono text-label uppercase tracking-label text-fog">
              {block.label}
            </p>
            <p className="mt-1.5 text-small text-fg-2">{block.body}</p>
          </div>
        ))}
        <div>
          <p className="font-mono text-label uppercase tracking-label text-fog">
            {copy.promisesLabel}
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {copy.promises.map((item) => (
              <li key={item} className="flex items-start gap-2 text-small text-fg-2">
                <Check className="mt-[5px] h-3.5 w-3.5 shrink-0 text-jade" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-caution-soft p-3">
          <p className="text-small text-caution-ink">{copy.risk}</p>
        </div>
      </div>
    </div>
  );
}

function AnswerAnswer({ copy }: { copy: Conversation["answer"] }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-small text-fog">{copy.question}</p>
      <div className="mt-4 rounded-xl bg-mist p-4">
        <p className="font-mono text-label uppercase tracking-label text-accent">
          {copy.finding}
        </p>
        <ol className="mt-3 space-y-3">
          {copy.steps.map((row, index) => (
            <li key={row.step} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-on-ink text-label font-semibold text-ink">
                {index + 1}
              </span>
              <span>
                <span className="text-small font-medium text-ink">{row.step}</span>
                <span className="mt-0.5 block text-label text-fog">{row.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 text-label text-fog">{copy.note}</p>
    </div>
  );
}

export function AgentSection({ copy }: { copy: HomeDoc["walkthrough"] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  /* both the tab list and the panel copy live in the home document */
  const tabs = copy.tabs;
  const current = tabs[Math.min(active, tabs.length - 1)]!;
  /* the panel key is not editable, but never trust it blindly: fall back to alerts */
  const panel = current.panel in copy.conversation ? current.panel : "alerts";

  return (
    <section className="section bg-night text-on-night" id="walkthrough">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="ink"
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
                      "flex w-full gap-4 p-4",
                      tabCard({ active: isActive, tone: "dark" }),
                    )}
                  >
                    <span className={tabIndex({ active: isActive, tone: "dark" })}>
                      {tab.index}
                    </span>
                    <span className="min-w-0">
                      <span className={tabLabel({ active: isActive, tone: "dark" })}>
                        {tab.title}
                      </span>
                      <span className={tabHint({ tone: "dark" })}>{tab.body}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <ArrowLink href="/services/ai-agents" tone="dark" className="mt-8">
              {copy.cta}
            </ArrowLink>
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
              <div className="relative rounded-2xl border border-white/10 bg-night-2 p-4 shadow-xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-eyebrow text-on-night-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-jade" />
                    {copy.statusLabel}
                  </span>
                  <span className="font-mono text-eyebrow text-on-night-3">
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
