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
  tone?: "paper" | "mist" | "ink" | "violet";
  id?: string;
  size?: "default" | "sm" | "none";
}) {
  const tones = {
    paper: "bg-paper text-fg",
    mist: "bg-mist text-fg",
    ink: "bg-ink text-on-ink",
    violet: "bg-violet text-white",
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

export function Eyebrow({
  children,
  className,
  tone = "violet",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "violet" | "ink" | "on-ink" | "fog";
}) {
  const tones = {
    violet: "text-violet",
    ink: "text-ink",
    "on-ink": "text-on-ink-2",
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
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "paper",
  className,
  titleClassName,
  action,
}: {
  eyebrow?: string;
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
      {eyebrow && (
        <Eyebrow
          tone={onInk ? "on-ink" : "violet"}
          className={align === "center" ? "justify-center" : undefined}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "mt-5 text-display-l",
          onInk ? "text-on-ink" : "text-ink",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-lead",
            onInk ? "text-on-ink-2" : "text-fog",
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
