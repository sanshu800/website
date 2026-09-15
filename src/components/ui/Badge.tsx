import { cn } from "@/lib/utils";

export type Accent = "ink" | "tangerine" | "jade" | "azure" | "magenta" | "neutral";

const accentChip: Record<Accent, string> = {
  ink: "bg-accent-soft text-accent-2 border-accent-line",
  tangerine: "bg-tangerine-soft text-tangerine-ink border-tangerine-line",
  jade: "bg-jade-soft text-jade-ink border-jade-line",
  azure: "bg-azure-soft text-azure-ink border-azure-line",
  magenta: "bg-magenta-soft text-magenta-ink border-magenta-line",
  neutral: "bg-mist text-fg-2 border-line",
};

const accentSolid: Record<Accent, string> = {
  ink: "bg-accent text-on-accent",
  tangerine: "bg-tangerine-ink text-on-tangerine",
  jade: "bg-jade-ink text-on-jade",
  azure: "bg-azure-ink text-on-azure",
  magenta: "bg-magenta-ink text-on-magenta",
  neutral: "bg-night text-white",
};

const accentDot: Record<Accent, string> = {
  ink: "bg-accent",
  tangerine: "bg-tangerine",
  jade: "bg-jade",
  azure: "bg-azure",
  magenta: "bg-magenta",
  neutral: "bg-fog",
};

export function Badge({
  children,
  accent = "neutral",
  className,
  variant = "chip",
}: {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
  variant?: "chip" | "solid" | "dot";
}) {
  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", accentDot[accent])} />
        {children}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium",
        variant === "solid"
          ? cn("border-transparent", accentSolid[accent])
          : accentChip[accent],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status pill for records — semantically meaningful, not decorative. */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-azure-soft text-azure-ink border-azure-line",
    qualified: "bg-accent-soft text-accent-2 border-accent-line",
    engaged: "bg-jade-soft text-jade-ink border-jade-line",
    proposal: "bg-caution-soft text-caution-ink border-caution-line",
    won: "bg-jade text-white border-transparent",
    lost: "bg-mist-2 text-fog border-line",
    stalled: "bg-danger-soft text-danger-ink border-danger-line",
    dormant: "bg-mist-2 text-fog border-line",
    active: "bg-jade-soft text-jade-ink border-jade-line",
    risk: "bg-danger-soft text-danger-ink border-danger-line",
    healthy: "bg-jade-soft text-jade-ink border-jade-line",
    watch: "bg-caution-soft text-caution-ink border-caution-line",
    onboarding: "bg-accent-soft text-accent-2 border-accent-line",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-[2px] text-[0.6875rem] font-medium capitalize",
        map[status.toLowerCase()] ?? "bg-mist text-fg-2 border-line",
      )}
    >
      {status}
    </span>
  );
}
