import { cn } from "@/lib/utils";

export type Accent = "violet" | "tangerine" | "jade" | "azure" | "magenta" | "neutral";

const accentChip: Record<Accent, string> = {
  violet: "bg-violet-soft text-violet-2 border-violet-line",
  tangerine: "bg-tangerine-soft text-[#a83c05] border-[#ffc9a8]",
  jade: "bg-jade-soft text-[#0a6b45] border-[#a9e2c8]",
  azure: "bg-azure-soft text-[#0f4bb0] border-[#b9d0fb]",
  magenta: "bg-magenta-soft text-[#9c1770] border-[#f5bde0]",
  neutral: "bg-mist text-fg-2 border-line",
};

const accentSolid: Record<Accent, string> = {
  violet: "bg-violet text-white",
  tangerine: "bg-tangerine text-white",
  jade: "bg-jade text-white",
  azure: "bg-azure text-white",
  magenta: "bg-magenta text-white",
  neutral: "bg-ink text-white",
};

const accentDot: Record<Accent, string> = {
  violet: "bg-violet",
  tangerine: "bg-tangerine",
  jade: "bg-jade",
  azure: "bg-azure",
  magenta: "bg-magenta",
  neutral: "bg-fog-2",
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
    new: "bg-azure-soft text-[#0f4bb0] border-[#b9d0fb]",
    qualified: "bg-violet-soft text-violet-2 border-violet-line",
    engaged: "bg-jade-soft text-[#0a6b45] border-[#a9e2c8]",
    proposal: "bg-caution-soft text-caution border-[#f0d3a0]",
    won: "bg-jade text-white border-transparent",
    lost: "bg-mist-2 text-fog border-line",
    stalled: "bg-danger-soft text-danger border-[#f3c4c4]",
    dormant: "bg-mist-2 text-fog border-line",
    active: "bg-jade-soft text-[#0a6b45] border-[#a9e2c8]",
    risk: "bg-danger-soft text-danger border-[#f3c4c4]",
    healthy: "bg-jade-soft text-[#0a6b45] border-[#a9e2c8]",
    watch: "bg-caution-soft text-caution border-[#f0d3a0]",
    onboarding: "bg-violet-soft text-violet-2 border-violet-line",
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
