import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, CircleCheck, Clock, Mail } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, EmptyState, StatCard } from "@/components/admin/Bits";
import { listSubmissions, recentLeadCount, type SubmissionRow } from "@/lib/submissions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Enquiries" };

/**
 * Every inbound submission, in one place.
 *
 * This is the page that makes the site answerable. Before it existed, a lead
 * arriving from the site was a row in a SQLite file: the dashboard showed a
 * count of `1` and there was no screen that could tell you who it was, what they
 * asked for, or whether the hand-off to the CRM worked. The forms promise a
 * reply within one working day, and a promise needs somewhere to be read.
 *
 * It is ordered newest first because the only thing that matters about a lead is
 * how long it has been sitting there. Filtering is a query string, so a filtered
 * view is a URL you can bookmark or refresh without losing your place.
 */

const FILTERS = [
  { key: "leads", label: "Leads", hint: "assessment and contact enquiries" },
  { key: "all", label: "Everything", hint: "including newsletter and applications" },
  { key: "newsletter", label: "Newsletter", hint: "subscriptions" },
  { key: "careers", label: "Applications", hint: "job applications" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Newsletter signups are not leads, so the default view hides them. */
const LEAD_KINDS = ["audit", "contact"];

function parseRow(row: SubmissionRow): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(row.payload);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Field labels, because `companySize` is a database key and not English. */
const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  email: "Email",
  company: "Company",
  companySize: "Company size",
  revenue: "Revenue",
  title: "Role",
  phone: "Phone",
  topic: "Topic",
  budget: "Budget",
  message: "Message",
  referral: "Heard about us via",
  portfolio: "Portfolio",
  note: "Note",
  role: "Role applied for",
  honeypot: "Honeypot",
  kind: "Funnel",
};

const KIND_LABELS: Record<string, string> = {
  audit: "Assessment",
  contact: "Contact",
  newsletter: "Newsletter",
  careers: "Application",
};

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function CrmBadge({ row, configured }: { row: SubmissionRow; configured: boolean }) {
  if (!configured) return null;

  if (row.crm_status === "sent") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-soft px-2.5 py-1 text-[0.6875rem] font-medium text-jade-ink">
        <CircleCheck className="h-3 w-3" aria-hidden="true" />
        Sent to CRM
      </span>
    );
  }
  if (row.crm_status === "failed") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-[0.6875rem] font-medium text-danger-ink"
        title={row.crm_error ?? undefined}
      >
        <CircleAlert className="h-3 w-3" aria-hidden="true" />
        CRM delivery failed
      </span>
    );
  }
  if (row.crm_status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[0.6875rem] font-medium text-fog">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Sending to CRM
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-mist px-2.5 py-1 text-[0.6875rem] font-medium text-fog">
      Not sent to CRM
    </span>
  );
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const active: FilterKey = FILTERS.some((f) => f.key === filter)
    ? (filter as FilterKey)
    : "leads";

  const all = listSubmissions();
  const rows =
    active === "all"
      ? all
      : active === "leads"
        ? all.filter((row) => LEAD_KINDS.includes(row.kind))
        : all.filter((row) => row.kind === active);

  const leads = all.filter((row) => LEAD_KINDS.includes(row.kind));
  const webhook = process.env.CRM_WEBHOOK_URL;
  const webhookKinds = process.env.CRM_WEBHOOK_KINDS?.trim() || "audit,contact";
  const failed = leads.filter((row) => row.crm_status === "failed");

  return (
    <>
      <AdminHeader
        title="Enquiries"
        summary="Every message the site has taken, newest first. The site promises a reply within one working day, so treat the top of this list as the to-do list."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads"
          value={String(leads.length)}
          detail={leads.length === 1 ? "one enquiry" : "assessment + contact"}
          tone={leads.length > 0 ? "accent" : "paper"}
        />
        {/* Same source as the nav badge, so the two can never disagree. */}
        <StatCard label="Last 7 days" value={String(recentLeadCount(7))} />
        <StatCard
          label="Newsletter"
          value={String(all.filter((row) => row.kind === "newsletter").length)}
        />
        <StatCard
          label="CRM failures"
          value={String(failed.length)}
          detail={failed.length > 0 ? "needs attention" : "all delivered"}
          tone={failed.length > 0 ? "accent" : "paper"}
        />
      </div>

      {/* Stated plainly, because "is the CRM connected?" is the one question this
          page cannot answer from the data alone. */}
      <div
        className={cn(
          "mt-4 rounded-2xl border px-5 py-4 text-[0.8125rem] leading-relaxed",
          webhook ? "border-jade/30 bg-jade-soft text-jade-ink" : "border-line bg-mist text-fg-2",
        )}
      >
        {webhook ? (
          <p>
            <strong className="font-medium">CRM hand-off is on.</strong> Leads matching{" "}
            <code className="font-mono text-[0.75rem]">{webhookKinds}</code> are posted to your
            webhook as they arrive, and the delivery result is shown against each one below. The
            record here is still the source of truth — the webhook is a copy.
          </p>
        ) : (
          <p>
            <strong className="font-medium">No CRM webhook is configured.</strong> Enquiries are
            saved here and nowhere else, so this page is the only place they appear. To push them
            to your CRM or automation tool, set <code className="font-mono text-[0.75rem]">CRM_WEBHOOK_URL</code>{" "}
            (and <code className="font-mono text-[0.75rem]">CRM_WEBHOOK_TOKEN</code> if it needs a
            bearer token). See the README for the exact payload shape.
          </p>
        )}
      </div>

      <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filter enquiries">
        {FILTERS.map((option) => {
          const count =
            option.key === "all"
              ? all.length
              : option.key === "leads"
                ? leads.length
                : all.filter((row) => row.kind === option.key).length;
          const isActive = option.key === active;
          return (
            <Link
              key={option.key}
              href={`/admin/enquiries?filter=${option.key}`}
              title={option.hint}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                isActive
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line bg-paper text-fg-2 hover:bg-mist",
              )}
            >
              {option.label}
              <span className={cn("font-mono text-[0.6875rem]", isActive ? undefined : "text-fog")}>
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4">
        {rows.length === 0 ? (
          <EmptyState
            title={all.length === 0 ? "No enquiries yet" : "Nothing in this filter"}
            body={
              all.length === 0
                ? "When somebody sends the enquiry form, or asks for an assessment, it lands here with everything they told us — and the delivery status if a CRM webhook is set."
                : "Try a different filter — this one is empty."
            }
          />
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => {
              const fields = parseRow(row);
              const entries = Object.entries(fields).filter(
                ([key]) => key !== "honeypot" && FIELD_LABELS[key] !== undefined,
              );
              return (
                <li key={row.id}>
                  <Card padded={false}>
                    <details className="group">
                      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium text-ink">
                            {row.name ?? "No name given"}
                            <span className="rounded-full bg-mist px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-fog">
                              {KIND_LABELS[row.kind] ?? row.kind}
                            </span>
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-fog">
                            {row.email && (
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                                <a
                                  href={`mailto:${row.email}`}
                                  className="text-fg-2 underline-offset-2 hover:text-ink hover:underline"
                                >
                                  {row.email}
                                </a>
                              </span>
                            )}
                            {row.company && <span>{row.company}</span>}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <CrmBadge row={row} configured={Boolean(webhook)} />
                          <span className="font-mono text-[0.6875rem] text-fog">
                            {when(row.created_at)}
                          </span>
                        </div>
                      </summary>

                      <div className="border-t border-line px-5 py-4">
                        {entries.length === 0 ? (
                          <p className="text-[0.8125rem] text-fog">
                            This one arrived without readable content.
                          </p>
                        ) : (
                          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                            {entries.map(([key, value]) => (
                              <div key={key} className={key === "message" ? "sm:col-span-2" : undefined}>
                                <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-fog">
                                  {FIELD_LABELS[key]}
                                </dt>
                                <dd className="mt-1 whitespace-pre-wrap break-words text-[0.8125rem] text-fg-2">
                                  {typeof value === "string" || typeof value === "number"
                                    ? String(value)
                                    : JSON.stringify(value)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {row.crm_status === "failed" && row.crm_error && (
                          <p className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-[0.8125rem] text-danger-ink">
                            The CRM hand-off failed: {row.crm_error}. The lead is safe here — use
                            the details above, and check the webhook URL and token.
                          </p>
                        )}
                      </div>
                    </details>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
