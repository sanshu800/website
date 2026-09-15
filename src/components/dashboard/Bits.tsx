import Link from "next/link";
import { cn } from "@/lib/utils";

/** Shared dashboard presentation pieces — no data, no state. */

const HEALTH_STYLE: Record<string, string> = {
  healthy: "bg-jade-soft text-jade border-jade/25",
  watch: "bg-caution-soft text-caution border-caution/25",
  risk: "bg-danger-soft text-danger border-danger/25",
};

const STAGE_STYLE: Record<string, string> = {
  Discovery: "bg-mist text-fog",
  Qualified: "bg-azure-soft text-azure",
  Proposal: "bg-violet-soft text-violet",
  Negotiation: "bg-tangerine-soft text-tangerine",
  Onboarding: "bg-jade-soft text-jade",
  Won: "bg-ink text-on-ink",
  Lost: "bg-mist-2 text-fog-2",
};

const PRIORITY_STYLE: Record<string, string> = {
  urgent: "text-danger",
  high: "text-tangerine",
  normal: "text-fog",
  low: "text-fog-2",
};

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "violet" | "jade" | "azure" | "caution" | "danger" | "ink";
  className?: string;
}) {
  const tones = {
    neutral: "bg-mist text-fog",
    violet: "bg-violet-soft text-violet",
    jade: "bg-jade-soft text-jade",
    azure: "bg-azure-soft text-azure",
    caution: "bg-caution-soft text-caution",
    danger: "bg-danger-soft text-danger",
    ink: "bg-ink text-on-ink",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function HealthPill({ health }: { health: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium capitalize",
        HEALTH_STYLE[health] ?? HEALTH_STYLE.healthy,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {health}
    </span>
  );
}

export function StagePill({ stage }: { stage: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium",
        STAGE_STYLE[stage] ?? "bg-mist text-fog",
      )}
    >
      {stage}
    </span>
  );
}

export function PriorityText({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[0.625rem] uppercase tracking-wide",
        PRIORITY_STYLE[priority] ?? "text-fog",
      )}
    >
      {priority}
    </span>
  );
}

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
  tone?: "paper" | "violet" | "ink";
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-5",
        tone === "violet" && "border-violet/25 bg-violet-soft",
        tone === "ink" && "border-ink bg-ink text-on-ink",
        tone === "paper" && "border-line bg-paper",
      )}
    >
      <p
        className={cn(
          "font-mono text-[0.625rem] uppercase tracking-wide",
          tone === "ink" ? "text-on-ink-2" : tone === "violet" ? "text-violet" : "text-fog-2",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-[1.75rem] leading-none tracking-[-0.03em]",
          tone === "ink" ? "text-on-ink" : "text-ink",
        )}
      >
        {value}
      </p>
      {detail && (
        <p
          className={cn(
            "mt-2.5 text-[0.75rem]",
            tone === "ink" ? "text-on-ink-2" : "text-fog",
          )}
        >
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
          <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
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

/**
 * Dependency-free bar/line chart. Renders as an SVG so it inherits the design
 * tokens and stays readable in forced-colours modes.
 */
export function TrendChart({
  data,
  height = 160,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((point) => point.value));
  return (
    <div>
      <div
        className="flex items-end gap-2"
        style={{ height }}
        role="img"
        aria-label={`Won value by month: ${data
          .map((point) => `${point.label} ${point.value}`)
          .join(", ")}`}
      >
        {data.map((point) => (
          <div key={point.label} className="group flex flex-1 flex-col items-center justify-end gap-2">
            <span className="font-mono text-[0.5625rem] text-fog-2 opacity-0 transition-opacity group-hover:opacity-100">
              {point.value > 0 ? point.value.toLocaleString() : ""}
            </span>
            <div
              className="w-full rounded-t-[4px] bg-violet/85 transition-colors group-hover:bg-violet"
              style={{ height: `${Math.max(3, (point.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((point) => (
          <span
            key={point.label}
            className="flex-1 text-center font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2"
          >
            {point.label.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Pagination({
  page,
  pages,
  total,
  perPage,
  basePath,
  query,
}: {
  page: number;
  pages: number;
  total: number;
  perPage: number;
  basePath: string;
  query: Record<string, string | undefined>;
}) {
  const build = (next: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value && key !== "page") params.set(key, value);
    }
    params.set("page", String(next));
    return `${basePath}?${params.toString()}`;
  };

  const first = total === 0 ? 0 : (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4"
    >
      <p className="text-[0.75rem] text-fog">
        Showing <span className="font-medium text-ink">{first}</span>–
        <span className="font-medium text-ink">{last}</span> of{" "}
        <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <PaginationLink href={page > 1 ? build(page - 1) : null} label="Previous" />
        {Array.from({ length: pages }, (_, index) => index + 1)
          .filter(
            (candidate) =>
              candidate === 1 ||
              candidate === pages ||
              Math.abs(candidate - page) <= 1,
          )
          .map((candidate, index, list) => (
            <span key={candidate} className="flex items-center gap-1.5">
              {index > 0 && candidate - (list[index - 1] ?? 0) > 1 && (
                <span className="px-1 text-fog-2">…</span>
              )}
              <Link
                href={build(candidate)}
                aria-current={candidate === page ? "page" : undefined}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-mono text-[0.75rem] transition-colors",
                  candidate === page
                    ? "bg-ink text-on-ink"
                    : "border border-line text-fog hover:bg-mist hover:text-ink",
                )}
              >
                {candidate}
              </Link>
            </span>
          ))}
        <PaginationLink href={page < pages ? build(page + 1) : null} label="Next" />
      </div>
    </nav>
  );
}

function PaginationLink({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return (
      <span className="flex h-8 items-center rounded-lg border border-line px-3 text-[0.75rem] text-fog-2/60">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex h-8 items-center rounded-lg border border-line px-3 text-[0.75rem] text-fog transition-colors hover:bg-mist hover:text-ink"
    >
      {label}
    </Link>
  );
}
