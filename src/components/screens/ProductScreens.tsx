import {
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock,
  FileText,
  Inbox,
  Mail,
  Phone,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/ui/Badge";

/**
 * Product interface replicas.
 *
 * Rather than shipping screenshots that go stale, the marketing pages render
 * the real interface language of the platform — same density, same components,
 * same vocabulary a firm sees after they log in. Data below is illustrative.
 */

function Chrome({
  title,
  children,
  className,
  dark = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center gap-3 border-b px-4 py-2.5",
          dark ? "border-white/10 bg-ink-3" : "border-line bg-mist",
        )}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                dark ? "bg-white/15" : "bg-line-strong",
              )}
            />
          ))}
        </div>
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-md px-2.5 py-1 font-mono text-[0.6875rem]",
            dark ? "bg-white/5 text-on-ink-2" : "bg-paper text-fog",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-jade" : "bg-jade")} />
          {title}
        </div>
      </div>
      <div className={cn("flex-1", dark ? "bg-ink-2" : "bg-paper")}>{children}</div>
    </div>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  // Deterministic tint so avatars are stable between server and client render.
  const palette = [
    "bg-accent-soft text-accent-2",
    "bg-tangerine-soft text-[#a83c05]",
    "bg-jade-soft text-[#0a6b45]",
    "bg-azure-soft text-[#0f4bb0]",
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-semibold",
        palette[idx],
        className,
      )}
    >
      {letters}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Intake                                                             */
/* ------------------------------------------------------------------ */

const INTAKE_ROWS = [
  { ref: "IN-4218", client: "Ashford Legal", matter: "Commercial dispute", source: "Web form", owner: "N. Okafor", age: "12m", status: "new" },
  { ref: "IN-4217", client: "Brightwell", matter: "Year-end review", source: "Referral", owner: "P. Raghavan", age: "1h", status: "qualified" },
  { ref: "IN-4214", client: "Marlowe Advisory", matter: "Restructure advice", source: "Shared inbox", owner: "—", age: "4h", status: "stalled" },
  { ref: "IN-4211", client: "Pell & Rowe", matter: "VAT enquiry", source: "Phone note", owner: "M. Pell", age: "6h", status: "engaged" },
  { ref: "IN-4208", client: "Kessler Partners", matter: "Employment matter", source: "Web form", owner: "D. Kessler", age: "9h", status: "qualified" },
];

export function IntakeScreen({ className }: { className?: string }) {
  return (
    <Chrome title="app.reygent.ai/intake" className={cn("h-full", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-accent" />
          <span className="text-[0.8125rem] font-medium text-ink">Intake queue</span>
          <span className="rounded-full bg-mist-2 px-2 py-[1px] font-mono text-[0.625rem] text-fg-2">
            18 open
          </span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {["All", "Unowned", "Ageing"].map((filter, i) => (
            <span
              key={filter}
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.6875rem]",
                i === 0
                  ? "bg-ink text-white"
                  : "border border-line text-fog",
              )}
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-line">
        {INTAKE_ROWS.map((row) => (
          <div
            key={row.ref}
            className={cn(
              "grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto]",
              row.owner === "—" && "bg-danger-soft/40",
            )}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-[0.8125rem] font-medium text-ink">
                  {row.client}
                </span>
                <span className="font-mono text-[0.625rem] text-fog-2">{row.ref}</span>
              </div>
              <span className="truncate text-[0.75rem] text-fog">{row.matter}</span>
            </div>
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              {row.source === "Shared inbox" ? (
                <Mail className="h-3.5 w-3.5 shrink-0 text-fog-2" />
              ) : row.source === "Phone note" ? (
                <Phone className="h-3.5 w-3.5 shrink-0 text-fog-2" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-fog-2" />
              )}
              <span className="truncate text-[0.75rem] text-fog">{row.source}</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              {row.owner === "—" ? (
                <span className="flex items-center gap-1 text-[0.75rem] text-danger">
                  <TriangleAlert className="h-3.5 w-3.5" /> Unassigned
                </span>
              ) : (
                <>
                  <Avatar name={row.owner} />
                  <span className="text-[0.75rem] text-fg-2">{row.owner}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[0.6875rem] text-fog-2 sm:inline">
                {row.age}
              </span>
              <StatusPill status={row.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line bg-mist px-4 py-2.5">
        <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-fog">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Reygent routed 3 new enquiries to owners automatically
        </span>
        <span className="font-mono text-[0.6875rem] text-fog-2">median first reply 38m</span>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Engage                                                             */
/* ------------------------------------------------------------------ */

const SEQUENCES = [
  { name: "New enquiry follow-up", stage: "Day 3 of 16", sent: 248, replied: 71, live: true },
  { name: "Proposal nurture", stage: "Day 8 of 21", sent: 96, replied: 34, live: true },
  { name: "Dormant client re-engage", stage: "Day 1 of 30", sent: 412, replied: 88, live: true },
  { name: "Referral thank-you", stage: "Complete", sent: 61, replied: 22, live: false },
];

export function EngageScreen({ className }: { className?: string }) {
  return (
    <Chrome title="app.reygent.ai/engage" className={cn("h-full", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-[0.8125rem] font-medium text-ink">Active sequences</span>
        <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-fog">
          <span className="h-1.5 w-1.5 rounded-full bg-jade" /> sending
        </span>
      </div>

      <div className="divide-y divide-line">
        {SEQUENCES.map((seq) => (
          <div key={seq.name} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    seq.live ? "bg-jade" : "bg-line-strong",
                  )}
                />
                <span className="truncate text-[0.8125rem] font-medium text-ink">
                  {seq.name}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[0.6875rem] text-fog-2">
                {seq.stage}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-4">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-2">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round((seq.replied / seq.sent) * 100)}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[0.6875rem] text-fog">
                {seq.sent} sent · {seq.replied} replied
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line bg-accent-soft/60 px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent" />
          <p className="text-[0.75rem] leading-relaxed text-accent-2">
            <strong className="font-semibold">Escalation:</strong> Marlow Advisory has
            not replied to 3 touches. Assigned to P. Raghavan with the thread attached.
          </p>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Deliver                                                            */
/* ------------------------------------------------------------------ */

const ONBOARDING = [
  { label: "Engagement letter signed", state: "done" },
  { label: "Company details validated", state: "done" },
  { label: "Prior-year accounts received", state: "done" },
  { label: "Director ID documents", state: "waiting" },
  { label: "Access to accounting ledger", state: "waiting" },
  { label: "Kickoff call scheduled", state: "done" },
  { label: "Delivery team introduced", state: "todo" },
];

export function DeliverScreen({ className }: { className?: string }) {
  return (
    <Chrome title="app.reygent.ai/deliver" className={cn("h-full", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="text-[0.8125rem] font-medium text-ink">Brightwell — FY26 audit</p>
          <p className="font-mono text-[0.6875rem] text-fog">
            onboarding · day 4 of 10 · owner P. Raghavan
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-caution-soft px-2.5 py-1 text-[0.6875rem] font-medium text-caution">
          2 outstanding
        </span>
      </div>

      <ol className="divide-y divide-line">
        {ONBOARDING.map((item) => (
          <li key={item.label} className="flex items-center gap-3 px-4 py-2.5">
            {item.state === "done" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-jade" />
            ) : item.state === "waiting" ? (
              <Clock className="h-4 w-4 shrink-0 text-caution" />
            ) : (
              <CircleDashed className="h-4 w-4 shrink-0 text-fog-2" />
            )}
            <span
              className={cn(
                "flex-1 text-[0.8125rem]",
                item.state === "todo" ? "text-fog-2" : "text-fg-2",
              )}
            >
              {item.label}
            </span>
            {item.state === "waiting" && (
              <span className="font-mono text-[0.6875rem] text-caution">chased 2×</span>
            )}
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between border-t border-line bg-mist px-4 py-2.5">
        <span className="font-mono text-[0.6875rem] text-fog">
          5 of 7 complete · client portal up to date
        </span>
        <span className="flex items-center gap-1 font-mono text-[0.6875rem] text-accent">
          open portal <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Insight                                                            */
/* ------------------------------------------------------------------ */

const BARS = [42, 58, 51, 67, 74, 69, 88, 96];

export function InsightScreen({ className }: { className?: string }) {
  return (
    <Chrome title="app.reygent.ai/insight" className={cn("h-full", className)}>
      <div className="border-b border-line px-4 py-3">
        <p className="text-[0.8125rem] font-medium text-ink">Quarterly review pack</p>
        <p className="font-mono text-[0.6875rem] text-fog">
          generated 06:00 · delivered to 4 partners
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {[
          { label: "Pipeline", value: "$1.24m", delta: "+8.2%" },
          { label: "Utilisation", value: "78%", delta: "+3.1%" },
          { label: "Matter margin", value: "41%", delta: "-1.4%" },
        ].map((metric) => (
          <div key={metric.label} className="px-4 py-3">
            <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
              {metric.label}
            </p>
            <p className="mt-1 font-display text-[1.125rem] text-ink">{metric.value}</p>
            <p
              className={cn(
                "font-mono text-[0.625rem]",
                metric.delta.startsWith("-") ? "text-danger" : "text-jade",
              )}
            >
              {metric.delta} vs last quarter
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <div className="flex h-[92px] items-end gap-2">
          {BARS.map((height, i) => (
            <div key={i} className="flex-1">
              <div
                className={cn(
                  "w-full rounded-t-[3px]",
                  i === BARS.length - 1 ? "bg-accent" : "bg-accent-soft-2",
                )}
                style={{ height: `${height}px` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.625rem] text-fog-2">
          <span>Q1</span>
          <span>Q4</span>
        </div>
      </div>

      <div className="border-t border-line px-4 py-3">
        <p className="flex items-center gap-2 text-[0.75rem] font-medium text-ink">
          <TriangleAlert className="h-3.5 w-3.5 text-danger" />
          Needs attention
        </p>
        <ul className="mt-2 space-y-1.5">
          {[
            "Marlowe Advisory — 2 engagements below budget",
            "Sterling Hoyt — no contact in 41 days",
          ].map((line) => (
            <li key={line} className="text-[0.75rem] text-fog">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </Chrome>
  );
}

export const screens = {
  intake: IntakeScreen,
  engage: EngageScreen,
  deliver: DeliverScreen,
  insight: InsightScreen,
} as const;

export type ScreenName = keyof typeof screens;

export function Screen({ name, className }: { name: ScreenName; className?: string }) {
  const Component = screens[name];
  return <Component className={className} />;
}
