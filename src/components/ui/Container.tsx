import { cn } from "@/lib/utils";

const widths = {
  narrow: "max-w-[var(--container-narrow)]",
  page: "max-w-[var(--container-page)]",
  wide: "max-w-[var(--container-wide)]",
} as const;

export function Container({
  children,
  className,
  width = "page",
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  width?: keyof typeof widths;
  as?: React.ElementType;
}) {
  return (
    <As className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[width], className)}>
      {children}
    </As>
  );
}

export function Section({
  children,
  className,
  width = "page",
  tone = "paper",
  id,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: keyof typeof widths;
  tone?: "paper" | "mist" | "ink" | "accent";
  id?: string;
  size?: "default" | "sm" | "none";
}) {
  const tones = {
    paper: "bg-paper text-fg",
    mist: "bg-mist text-fg",
    ink: "bg-night text-on-night",
    accent: "bg-accent text-on-accent",
  } as const;

  const sizes = {
    default: "section",
    sm: "section-sm",
    none: "",
  } as const;

  return (
    <section id={id} className={cn("relative", tones[tone], sizes[size], className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}

/**
 * A small monospace label above a heading.
 *
 * Used **three times on the whole site**, and the bar for a fourth is high: the
 * label has to name something the heading cannot — a proper noun or a date.
 *
 * - `Compare · Big consultancy` — which comparison you are reading
 * - `Solutions · Property, trades & field service` — which industry
 * - `Last updated 2026-08-01` — when the policy changed
 *
 * Everywhere else the pattern was removed. A label that only restates the
 * heading or its category ("What we do" over "Pick the one that hurts most",
 * "How we work" over "Audit first, then build only what pays for itself") asks
 * the reader to read the same idea twice before reaching the sentence that
 * matters. The heading carries its own weight; let it.
 *
 * A heading *set in* this style is a different thing and is fine — the footer
 * column headings and the "Keep reading" rail do that, and they are headings,
 * not labels on a heading. So are the `404` and `403` codes on the error
 * screens, which state a fact the heading does not.
 */
export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "ink" | "on-ink" | "fog";
}) {
  const tones = {
    accent: "text-accent",
    ink: "text-ink",
    "on-ink": "text-on-night-2",
    fog: "text-fog",
  } as const;
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-eyebrow uppercase",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  lede,
  align = "left",
  tone = "paper",
  className,
  titleClassName,
  action,
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  tone?: "paper" | "ink";
  className?: string;
  titleClassName?: string;
  action?: React.ReactNode;
}) {
  const onInk = tone === "ink";
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-[46rem] text-center" : "max-w-[46rem]",
        className,
      )}
    >
      <h2
        className={cn(
          "text-display-l",
          onInk ? "text-on-night" : "text-ink",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-lead",
            onInk ? "text-on-night-2" : "text-fog",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
