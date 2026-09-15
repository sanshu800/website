import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, EmptyState, StatCard } from "@/components/admin/Bits";
import {
  arrivalSources,
  firstRecordedAt,
  funnel,
  recentExceptions,
  topPages,
  windowStats,
} from "@/lib/events";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Traffic" };

/**
 * What the site has actually seen.
 *
 * The point of this page is to answer three questions and stop: is anyone
 * reading, where does the funnel lose people, and is anything broken for real
 * visitors. It is first-party data with a 90-day retention window, so the numbers
 * are small by design — and when there is nothing to show, it says so instead of
 * drawing a flat line and implying a trend.
 */

export default function AnalyticsPage() {
  const stats = windowStats(30);
  const steps = funnel(30);
  const pages = topPages(30, 8);
  const sources = arrivalSources(30, 6);
  const exceptions = recentExceptions(6);
  const first = firstRecordedAt();

  return (
    <>
      <AdminHeader
        eyebrow="Website"
        title="Traffic"
        summary="First-party measurement, last 30 days. No cookies, no third parties, no IP addresses — and nothing is recorded at all until a visitor allows it."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page views" value={String(stats.pageViews)} />
        <StatCard label="Visits" value={String(stats.visits)} detail="distinct tabs" />
        <StatCard
          label="Enquiries"
          value={String(stats.enquiries)}
          tone={stats.enquiries > 0 ? "accent" : "paper"}
        />
        <StatCard
          label="Errors caught"
          value={String(stats.errors)}
          tone={stats.errors > 0 ? "accent" : "paper"}
          detail="client-side exceptions"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Funnel">
          {stats.pageViews === 0 ? (
            <EmptyState
              title="Nothing recorded yet"
              body="Measurement is off until a visitor allows it, so an empty table is the honest outcome for a site with no consented traffic. It fills in from the moment someone says yes."
            />
          ) : (
            <ul className="divide-y divide-line">
              {steps.map((step) => (
                <li key={step.name} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="text-[0.875rem] text-ink">{step.label}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.875rem] text-ink">{step.count}</span>
                    <span className="w-14 text-right text-[0.75rem] text-fog">
                      {step.ofPrevious}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[0.75rem] leading-relaxed text-fog">
            Each step is shown as a share of the one above it, because &ldquo;how many who started a
            form finished it&rdquo; is the number worth acting on.
          </p>
        </Card>

        <Card title="Most-read pages">
          {pages.length === 0 ? (
            <EmptyState title="No page views yet" body="Pages appear here as they are read." />
          ) : (
            <ul className="divide-y divide-line">
              {pages.map((page) => (
                <li key={page.path} className="flex items-center justify-between gap-4 py-3">
                  <Link
                    href={page.path}
                    className="truncate font-mono text-[0.8125rem] text-ink hover:text-accent"
                  >
                    {page.path}
                  </Link>
                  <span className="font-mono text-[0.8125rem] text-fog">{page.views}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Where visits come from">
          {sources.length === 0 ? (
            <EmptyState title="No arrivals recorded" body="Referrer hosts appear here." />
          ) : (
            <ul className="divide-y divide-line">
              {sources.map((source) => (
                <li key={source.source} className="flex items-center justify-between gap-4 py-3">
                  <span className="truncate text-[0.875rem] text-ink">{source.source}</span>
                  <span className="font-mono text-[0.8125rem] text-fog">{source.visits}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[0.75rem] leading-relaxed text-fog">
            Only the host a visit arrived from is kept — never the full link, so campaign tracking
            parameters stay out of this database.
          </p>
        </Card>

        <Card
          title="Caught errors"
          action={
            exceptions.length > 0 ? (
              <span className="inline-flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-wide text-magenta-ink">
                <TriangleAlert className="h-3 w-3" /> {stats.errors} in 30 days
              </span>
            ) : undefined
          }
        >
          {exceptions.length === 0 ? (
            <EmptyState
              title="No client errors reported"
              body="Visitor-side exceptions land here with the page they happened on — including the digest of a failed render."
            />
          ) : (
            <ul className="divide-y divide-line">
              {exceptions.map((entry) => (
                <li key={entry.id} className="py-3">
                  <p className="truncate text-[0.8125rem] text-ink">
                    {entry.detail ?? "exception without a message"}
                  </p>
                  <p className="mt-1 font-mono text-[0.6875rem] text-fog">
                    {entry.path ?? "unknown page"} · {relativeTime(entry.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="What this is not" className="mt-4">
        <p className="text-[0.8125rem] leading-relaxed text-fog">
          Not an analytics platform. There are no cookies, no user identifiers beyond the tab, no
          cross-site anything, and rows are deleted 90 days after they are written
          {first ? ` (the earliest row here is from ${first.slice(0, 10)})` : ""}. It exists so the
          operator can see whether a page is read and whether anything is broken — and it is off for
          any visitor who has not actively allowed it.
        </p>
        <Link
          href="/admin/edit/legal"
          className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent hover:underline"
        >
          Edit the privacy notice that describes it
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </>
  );
}
