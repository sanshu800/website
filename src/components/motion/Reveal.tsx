"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "up" | "fade" | "scale";

const EASE = [0.16, 1, 0.3, 1] as const;

const offsets: Record<Variant, { y?: number; scale?: number }> = {
  up: { y: 18 },
  fade: {},
  scale: { scale: 0.985 },
};

/**
 * Single scroll-reveal primitive. One vocabulary for the whole site so
 * sections differ in composition rather than in motion personality.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  duration = 0.75,
  amount = 0.2,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  duration?: number;
  amount?: number;
  as?: "div" | "span" | "li" | "section" | "article" | "header" | "figure";
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, ...offsets[variant] }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

/** Staggered group: children must be `<RevealItem>`s. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0.04,
  amount = 0.15,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "figure" | "span";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </Component>
  );
}
