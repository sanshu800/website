import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Presentation pieces for the admin area — no data, no state.
 *
 * Deliberately small: the admin is a content editor, so it needs a card, a
 * statistic tile and an empty state, and nothing else.
 */

export function StatCard({
  label,
  value,
  detail,
  tone = "paper",
  href,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "paper" | "accent" | "ink";
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-5",
        tone === "accent" && "border-accent/25 bg-accent-soft",
        tone === "ink" && "border-ink bg-night text-on-night",
        tone === "paper" && "border-line bg-paper",
      )}
    >
      <p
        className={cn(
          "font-mono text-[0.625rem] uppercase tracking-wide",
          tone === "ink" ? "text-on-night-2" : tone === "accent" ? "text-accent" : "text-fog",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-[1.75rem] leading-none tracking-[-0.03em]",
          tone === "ink" ? "text-on-night" : "text-ink",
        )}
      >
        {value}
      </p>
      {detail && (
        <p className={cn("mt-2.5 text-[0.75rem]", tone === "ink" ? "text-on-night-2" : "text-fog")}>
          {detail}
        </p>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full transition-transform duration-300 hover:-translate-y-0.5">
      {body}
    </Link>
  ) : (
    body
  );
}

export function Card({
  children,
  className,
  title,
  action,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-line bg-paper", className)}
      aria-label={title}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog">
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : undefined}>{children}</div>
    </section>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-paper px-6 py-12 text-center">
      <p className="font-display text-[1.0625rem] text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[34rem] text-micro text-fog">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
