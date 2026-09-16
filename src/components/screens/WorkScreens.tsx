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
 * Console replicas.
 *
 * These are the screens our agents and automations run inside — the enquiry
 * queue, the follow-up sequences, the document checklist, the weekly review.
 * They are rendered as real components rather than screenshots, so the marketing
 * pages show the same density your team gets. Data below is illustrative.
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
          dark ? "border-white/10 bg-night-3" : "border-line bg-mist",
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
            "flex flex-1 items-center gap-2 rounded-md px-2.5 py-1 font-mono text-eyebrow",
            dark ? "bg-white/5 text-on-night-2" : "bg-paper text-fog",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-jade" : "bg-jade")} />
          {title}
        </div>
      </div>
      <div className={cn("flex-1", dark ? "bg-night-2" : "bg-paper")}>{children}</div>
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
    "bg-tangerine-soft text-tangerine-ink",
    "bg-jade-soft text-jade-ink",
    "bg-azure-soft text-azure-ink",
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label font-semibold",
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
  { ref: "EN-4218", client: "Carrow Property", matter: "Boiler replacement, 3 flats", source: "Web form", owner: "Agent", age: "12s", status: "new" },
  { ref: "EN-4217", client: "Verdant Clinic", matter: "New patient, evening slots", source: "Phone call", owner: "Agent", age: "1m", status: "qualified" },
  { ref: "EN-4214", client: "Lumen Home", matter: "Bulk order, 240 units", source: "Shared inbox", owner: "—", age: "4h", status: "stalled" },
  { ref: "EN-4211", client: "Oakhill Group", matter: "Roof survey, two sites", source: "WhatsApp", owner: "D. Kessler", age: "1h", status: "engaged" },
  { ref: "EN-4208", client: "Northgate Supply", matter: "Account application", source: "Web form", owner: "Agent", age: "2m", status: "qualified" },
];

export function IntakeScreen({ className }: { className?: string }) {
  return (
    <Chrome title="agent console · enquiries" className={cn("h-full", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-accent" />
          <span className="text-micro font-medium text-ink">New enquiries</span>
          <span className="rounded-full bg-mist-2 px-2 py-[1px] font-mono text-label text-fg-2">
            18 open
          </span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {["All", "Unowned", "Ageing"].map((filter, i) => (
            <span
              key={filter}
              className={cn(
                "rounded-full px-2.5 py-1 text-eyebrow",
                i === 0
                  ? "bg-night text-on-night"
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
                <span className="truncate text-micro font-medium text-ink">
                  {row.client}
                </span>
                <span className="font-mono text-label text-fog">{row.ref}</span>
              </div>
              <span className="truncate text-label text-fog">{row.matter}</span>
            </div>
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              {row.source === "Shared inbox" ? (
                <Mail className="h-3.5 w-3.5 shrink-0 text-fog" />
              ) : row.source === "Phone call" || row.source === "WhatsApp" ? (
                <Phone className="h-3.5 w-3.5 shrink-0 text-fog" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-fog" />
              )}
              <span className="truncate text-label text-fog">{row.source}</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              {row.owner === "—" ? (
                <span className="flex items-center gap-1 text-label text-danger-ink">
                  <TriangleAlert className="h-3.5 w-3.5" /> Unassigned
                </span>
              ) : (
                <>
                  <Avatar name={row.owner} />
                  <span className="text-label text-fg-2">{row.owner}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-eyebrow text-fog sm:inline">
                {row.age}
              </span>
              <StatusPill status={row.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line bg-mist px-4 py-2.5">
        <span className="flex items-center gap-1.5 font-mono text-eyebrow text-fog">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          The agent answered 4 enquiries and booked 2 visits
        </span>
        <span className="font-mono text-eyebrow text-fog">median first reply 9s</span>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ */
/* Engage                                                             */
/* ------------------------------------------------------------------ */

const SEQUENCES = [
  { name: "Quote follow-up", stage: "Day 3 of 16", sent: 248, replied: 71, live: true },
  { name: "Survey booking reminder", stage: "Day 8 of 21", sent: 96, replied: 34, live: true },
  { name: "Invoice chase", stage: "Day 1 of 30", sent: 412, replied: 88, live: true },
  { name: "Review request after the job", stage: "Complete", sent: 61, replied: 22, live: false },
];

export function EngageScreen({ className }: { className?: string }) {
  return (
    <Chrome title="agent console · follow-up" className={cn("h-full", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-micro font-medium text-ink">Active sequences</span>
        <span className="flex items-center gap-1.5 font-mono text-eyebrow text-fog">
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
                <span className="truncate text-micro font-medium text-ink">
                  {seq.name}
                </span>
              </div>
              <span className="shrink-0 font-mono text-eyebrow text-fog">
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
              <span className="shrink-0 font-mono text-eyebrow text-fog">
                {seq.sent} sent · {seq.replied} replied
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line bg-accent-soft/60 px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent" />
          <p className="text-label leading-relaxed text-accent-2">
            <strong className="font-semibold">Escalation:</strong> Oakhill Group has not
            replied to 3 touches. Assigned to D. Kessler with the whole thread attached.
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
  { label: "Order confirmed and deposit invoice raised", state: "done" },
  { label: "Site survey booked into the diary", state: "done" },
  { label: "Access and parking requirements recorded", state: "done" },
  { label: "Public liability certificate received", state: "waiting" },
  { label: "Materials ordered from supplier", state: "waiting" },
  { label: "Customer given the install window", state: "done" },
  { label: "Aftercare instructions scheduled", state: "todo" },
];

export function DeliverScreen({ className }: { className?: string }) {
  return (
    <Chrome title="agent console · documents" className={cn("h-full", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="text-micro font-medium text-ink">Oakhill Group — roof replacement</p>
          <p className="font-mono text-eyebrow text-fog">
            job 88-412 · day 4 · owner D. Kessler
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-caution-soft px-2.5 py-1 text-eyebrow font-medium text-caution-ink">
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
              <CircleDashed className="h-4 w-4 shrink-0 text-fog" />
            )}
            <span
              className={cn(
                "flex-1 text-micro",
                item.state === "todo" ? "text-fog" : "text-fg-2",
              )}
            >
              {item.label}
            </span>
            {item.state === "waiting" && (
              <span className="font-mono text-eyebrow text-caution-ink">chased 2×</span>
            )}
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between border-t border-line bg-mist px-4 py-2.5">
        <span className="font-mono text-eyebrow text-fog">
          5 of 7 complete · everything filed against the job
        </span>
        <span className="flex items-center gap-1 font-mono text-eyebrow text-accent">
          open job record <ArrowUpRight className="h-3 w-3" />
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
    <Chrome title="agent console · weekly review" className={cn("h-full", className)}>
      <div className="border-b border-line px-4 py-3">
        <p className="text-micro font-medium text-ink">Weekly review pack</p>
        <p className="font-mono text-eyebrow text-fog">
          assembled 06:00 · sent to you and your bookkeeper
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {[
          { label: "Confirmed work", value: "$236k", delta: "+8.2%" },
          { label: "Quotes outstanding", value: "$94k", delta: "+3.1%" },
          { label: "Gross margin", value: "41%", delta: "-1.4%" },
        ].map((metric) => (
          <div key={metric.label} className="px-4 py-3">
            <p className="font-mono text-label uppercase tracking-label text-fog">
              {metric.label}
            </p>
            <p className="mt-1 font-display text-display-s text-ink">{metric.value}</p>
            <p
              className={cn(
                "font-mono text-label",
                metric.delta.startsWith("-") ? "text-danger-ink" : "text-jade-ink",
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
        <div className="mt-2 flex justify-between font-mono text-label text-fog">
          <span>Q1</span>
          <span>Q4</span>
        </div>
      </div>

      <div className="border-t border-line px-4 py-3">
        <p className="flex items-center gap-2 text-label font-medium text-ink">
          <TriangleAlert className="h-3.5 w-3.5 text-danger" />
          Needs attention
        </p>
        <ul className="mt-2 space-y-1.5">
          {[
            "Oakhill Group — 2 jobs below quoted margin",
            "Sterling Hoyt — no contact in 41 days",
          ].map((line) => (
            <li key={line} className="text-label text-fog">
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
