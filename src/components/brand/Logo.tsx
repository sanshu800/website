import { cn } from "@/lib/utils";
import type { ClientLogo } from "@/lib/content/marketing";

/**
 * The mark: a black square with three white rules inside it — one record, three
 * moving surfaces. Simple enough to read at 16px in a tab, monochrome so it
 * never fights the interface, and drawn rather than imported so it stays sharp.
 */
export function ReygentMark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "on-ink";
}) {
  const dark = tone === "ink";
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect
        width="28"
        height="28"
        rx="7"
        className={dark ? "fill-ink" : "fill-on-ink"}
      />
      <rect
        x="7.5"
        y="9.5"
        width="13"
        height="2.6"
        rx="1.3"
        className={dark ? "fill-on-ink" : "fill-ink"}
      />
      <rect
        x="7.5"
        y="14"
        width="9"
        height="2.6"
        rx="1.3"
        className={dark ? "fill-on-ink" : "fill-ink"}
        opacity="0.72"
      />
      <rect
        x="7.5"
        y="18.5"
        width="5.4"
        height="2.6"
        rx="1.3"
        className={dark ? "fill-on-ink" : "fill-ink"}
        opacity="0.45"
      />
    </svg>
  );
}

/**
 * Wordmark. Text only — the mark is reserved for the favicon and the tab bar so
 * the header stays quiet, which is the whole point of a black logo.
 */
export function ReygentWordmark({
  className,
  tone = "ink",
  withMark = false,
  label = "Reygent AI",
}: {
  className?: string;
  tone?: "ink" | "on-ink";
  withMark?: boolean;
  /** Comes from the `chrome` content document, so the brand reads from the CMS. */
  label?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {withMark && <ReygentMark className="h-6 w-6 shrink-0" tone={tone} />}
      <span
        className={cn(
          "font-display text-[1.25rem] font-semibold leading-none tracking-[-0.035em]",
          tone === "on-ink" ? "text-on-night" : "text-ink",
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Client marks — invented placeholder firms, drawn as geometric marks */
/* so no third-party logo asset is used.                               */
/* ------------------------------------------------------------------ */

function Mark({ kind }: { kind: ClientLogo["mark"] }) {
  const common = {
    className: "h-[18px] w-[18px] shrink-0",
    viewBox: "0 0 20 20",
    fill: "none",
    "aria-hidden": true as const,
  };
  switch (kind) {
    case "arc":
      return (
        <svg {...common}>
          <path d="M3 15a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "block":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="9" height="9" rx="1.5" fill="currentColor" />
          <rect x="8" y="8" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M5 5l5 5-5 5M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "orbit":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="10" cy="10" r="2.2" fill="currentColor" />
          <circle cx="16" cy="10" r="1.6" fill="currentColor" />
        </svg>
      );
    case "prism":
      return (
        <svg {...common}>
          <path d="M10 3l7 12H3l7-12z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <path d="M2 13c2.5-6 5.5-6 8 0s5.5 6 8 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M10 2.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5L2.5 10l5.5-2 2-5.5z" fill="currentColor" />
        </svg>
      );
  }
}

export function ClientWordmark({
  client,
  className,
  tone = "ink",
}: {
  client: ClientLogo;
  className?: string;
  tone?: "ink" | "on-ink";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 whitespace-nowrap transition-colors duration-300",
        tone === "on-ink"
          ? "text-white/65 hover:text-white"
          : "text-ink/55 hover:text-ink",
        className,
      )}
      title={`${client.name} — ${client.sector}`}
    >
      <Mark kind={client.mark} />
      <span className="font-display text-[0.9375rem] font-medium tracking-[-0.015em]">
        {client.name}
      </span>
    </span>
  );
}
