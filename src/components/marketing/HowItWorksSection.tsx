"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const STAGES = [
  {
    index: "01",
    title: "Connect",
    duration: "Day 1",
    body: "Point Reygent at the tools your firm already runs — mailboxes, calendar, documents, ledger. Nothing is migrated, nothing is replaced.",
    detail: ["Email and calendar sync", "Document and ledger access", "Existing records imported"],
  },
  {
    index: "02",
    title: "Map the operation",
    duration: "Week 1",
    body: "We map how work actually moves through your firm, including the exceptions nobody wrote down. This is the step most software skips.",
    detail: ["Intake channels and criteria", "Ownership rules", "The handoffs that currently fail"],
  },
  {
    index: "03",
    title: "Run one process properly",
    duration: "Week 2–4",
    body: "Pick the seam that costs the most — usually intake or document collection — and run it through the platform until it is measurably better.",
    detail: ["One process live end to end", "Team trained on the real workflow", "Baseline measured before and after"],
  },
  {
    index: "04",
    title: "Expand and hand over",
    duration: "Ongoing",
    body: "Add the next module once the first one holds. The system is documented and owned by your firm, not by a consultant who has to be present.",
    detail: ["Further modules at your pace", "Documentation your team owns", "Quarterly operational review"],
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section className="section bg-mist">
      <Container width="wide">
        <SectionHeading
          eyebrow="How it works"
          title="Live in days. Measurably better within a quarter."
          lede="The order matters. Most automation fails because rules are written before the operation has been mapped — so we do not skip stage two."
        />

        <ol ref={ref} className="relative mt-14">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[15px] top-2 w-px bg-line-strong"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : smoothed }}
            className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-violet"
          />

          {STAGES.map((stage) => (
            <StageRow key={stage.index} stage={stage} reduce={!!reduce} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function StageRow({
  stage,
  reduce,
}: {
  stage: (typeof STAGES)[number];
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 55%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <li
      ref={ref}
      className="relative grid gap-6 pb-14 pl-12 last:pb-0 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pl-16"
    >
      <motion.span
        aria-hidden="true"
        style={reduce ? undefined : { scale: dotScale, opacity }}
        className="absolute left-[9px] top-[6px] flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 border-violet bg-paper"
      >
        <span className="h-[5px] w-[5px] rounded-full bg-violet" />
      </motion.span>

      <motion.div style={reduce ? undefined : { opacity }} className="lg:col-span-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-violet">
            {stage.index}
          </span>
          <Badge accent="neutral">{stage.duration}</Badge>
        </div>
        <h3 className="mt-3 text-display-m text-ink">{stage.title}</h3>
        <p className="mt-4 max-w-[32rem] text-body-lg text-fog">{stage.body}</p>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity }}
        className="lg:col-span-4 lg:col-start-9 lg:pt-12"
      >
        <ul className="space-y-2.5">
          {stage.detail.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-line pb-2.5 text-small text-fg-2"
            >
              <span
                aria-hidden="true"
                className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-violet"
              />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}
