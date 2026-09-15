import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { dashboard } from "@/lib/queries";
import { Card, EmptyState, Pill, StatCard } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { cn, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Inbound" };

const KINDS = [
  { value: "all", label: "Everything" },
  { value: "newsletter", label: "Newsletter" },
  { value: "contact", label: "Contact" },
  { value: "demo", label: "Demo requests" },
  { value: "get-started", label: "Trial requests" },
  { value: "careers", label: "Applications" },
];

const TONE: Record<string, "accent" | "jade" | "azure" | "caution" | "neutral"> = {
  "get-started": "accent",
  demo: "azure",
  contact: "caution",
  newsletter: "neutral",
  careers: "jade",
};

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind = "all" } = await searchParams;
  const active = KINDS.some((option) => option.value === kind) ? kind : "all";
  const rows = dashboard.submissions(active);

  const stats = dashboard.submissionStats();
  const counts = KINDS.map((option) => ({
    ...option,
    count:
      option.value === "all"
        ? stats.total
        : (stats.byKind.find((entry) => entry.kind === option.value)?.n ?? 0),
  }));

  const last24h = stats.recent;

  return (
    <>
      <DashboardHeader
        eyebrow="Marketing"
        title="Inbound"
        summary="Every form on the public site writes here — newsletter, contact, demo, trial requests and job applications — in one queue."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total captured" value={String(stats.total)} />
        <StatCard label="Last 24 hours" value={String(last24h)} tone={last24h > 0 ? "accent" : "paper"} />
        <StatCard
          label="Trial requests"
          value={String(stats.byKind.find((entry) => entry.kind === "get-started")?.n ?? 0)}
          detail="Highest intent form on the site"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {counts.map((option) => (
          <Link
            key={option.value}
            href={`/dashboard/submissions?kind=${option.value}`}
            aria-current={active === option.value ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
              active === option.value
                ? "border-ink bg-ink text-on-ink"
                : "border-line text-fog hover:bg-mist hover:text-ink",
            )}
          >
            {option.label}
            <span className="ml-2 font-mono text-[0.625rem] opacity-70">{option.count}</span>
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Nothing in this queue"
            body="Submit one of the forms on the marketing site — contact, demo, newsletter or a job application — and it will appear here immediately."
            action={
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-[0.8125rem] font-medium text-white"
              >
                Open the contact form
              </Link>
            }
          />
        </div>
      ) : (
        <Card className="mt-4" padded={false}>
          <ul className="divide-y divide-line">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start gap-x-6 gap-y-3 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-2">
                  <Inbox className="h-4 w-4 text-fog" />
                </span>
                <div className="min-w-[180px] flex-1">
                  <p className="text-[0.875rem] font-medium text-ink">
                    {row.name ?? row.email ?? "Anonymous"}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-fog">
                    {row.company ?? "No firm given"}
                  </p>
                  {row.email && (
                    <a
                      href={`mailto:${row.email}`}
                      className="mt-1 inline-block text-[0.75rem] text-accent hover:underline"
                    >
                      {row.email}
                    </a>
                  )}
                </div>

                <PayloadSummary payload={row.payload} />

                <div className="ml-auto flex items-center gap-3">
                  <Pill tone={TONE[row.kind] ?? "neutral"}>{row.kind}</Pill>
                  <span className="font-mono text-[0.6875rem] text-fog-2">
                    {relativeTime(row.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="mt-4 text-[0.75rem] leading-relaxed text-fog-2">
        Set <span className="font-mono text-ink">CRM_WEBHOOK_URL</span> (and optionally{" "}
        <span className="font-mono text-ink">CRM_WEBHOOK_TOKEN</span>) to mirror every
        submission to a CRM or automation platform. Without it, records stay in the
        platform database and nothing is silently discarded.
      </p>
    </>
  );
}

/** Renders the interesting parts of a submission payload without dumping raw JSON. */
function PayloadSummary({ payload }: { payload: string }) {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }

  const hidden = new Set(["name", "email", "company", "source", "role", "roleTitle"]);
  const entries = Object.entries(parsed).filter(
    ([key, value]) =>
      !hidden.has(key) && value !== null && value !== "" && value !== undefined,
  );

  if (entries.length === 0) return null;

  return (
    <dl className="min-w-[220px] flex-1 space-y-1.5">
      {entries.slice(0, 3).map(([key, value]) => (
        <div key={key} className="flex gap-2 text-[0.75rem]">
          <dt className="shrink-0 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
            {key}
          </dt>
          <dd className="truncate text-fog">
            {Array.isArray(value) ? value.join(", ") : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
