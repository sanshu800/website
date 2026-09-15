import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { Card, StatCard } from "@/components/dashboard/Bits";
import { RevertButton } from "@/components/dashboard/RevertButton";
import { DOCS, docFields, orphanedOverrides } from "@/lib/cms/documents";
import { contentVersionCount, overrideStats, recentRevisions } from "@/lib/cms/store";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Content" };

const NOT_WIRED = [
  "Homepage sections — hero, proof band, metrics, testimonials",
  "Header and footer navigation",
  "Get started, about, careers, customers, integrations and the other standalone pages",
  "Page titles and meta descriptions",
];

/**
 * The content admin's front door: what can be edited today, what has been
 * changed, and the audit trail. Everything is read from the override store, so
 * this doubles as a deployment's change log.
 */
export default function ContentAdminPage() {
  const stats = overrideStats();
  const revisions = recentRevisions(8);
  const versions = contentVersionCount();

  const docs = DOCS.map((doc) => {
    const fields = docFields(doc.id);
    return {
      doc,
      total: fields.length,
      edited: fields.filter((field) => field.edited).length,
      orphans: orphanedOverrides(doc.id).length,
    };
  });

  const totalFields = docs.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <>
      <DashboardHeader
        eyebrow="Website"
        title="Content"
        summary="Edit the words on the marketing site without a deploy. Saves are validated, logged and published immediately — every change is attributable and reversible from this screen."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Fields under management" value={String(totalFields)} />
        <StatCard
          label="Live edits"
          value={String(stats.total)}
          tone={stats.total > 0 ? "accent" : "paper"}
          detail={stats.lastEdit ? `last ${relativeTime(stats.lastEdit.at)}` : "nothing changed yet"}
        />
        <StatCard
          label="Revision log"
          value={String(versions)}
          detail="every change kept"
        />
        <StatCard
          label="Surfaces wired"
          value={`${DOCS.length}`}
          detail={`${NOT_WIRED.length} still to come`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Card title="Editable surfaces">
            <ul className="divide-y divide-line">
              {docs.map(({ doc, total, edited, orphans }) => (
                <li key={doc.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist text-fog">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-[180px] flex-1">
                    <p className="text-[0.9375rem] font-medium text-ink">{doc.title}</p>
                    <p className="mt-0.5 text-[0.75rem] leading-relaxed text-fog">{doc.blurb}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.6875rem] text-fog-2">
                      <span className="font-mono">{total} fields</span>
                      {edited > 0 && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-accent">
                          {edited} edited
                        </span>
                      )}
                      {orphans > 0 && (
                        <span className="rounded-full bg-magenta-soft px-2 py-0.5 font-mono text-magenta">
                          {orphans} orphaned
                        </span>
                      )}
                      {doc.where.map((place) => (
                        <a
                          key={place.href}
                          href={place.href}
                          className="text-accent underline underline-offset-2"
                        >
                          {place.label}
                        </a>
                      ))}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/content/${doc.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-[0.8125rem] font-medium text-on-ink transition-colors hover:bg-accent-2"
                  >
                    Edit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Not editable yet" className="mt-4">
            <p className="text-[0.8125rem] leading-relaxed text-fog">
              These surfaces still render straight from the content modules, so changes there
              need a developer. Each one is added to the list above as it is wired through the
              same store.
            </p>
            <ul className="mt-4 grid gap-2 text-[0.8125rem] text-fog-2 sm:grid-cols-2">
              {NOT_WIRED.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card
            title="Latest changes"
            action={
              <Link
                href="/dashboard/content/history"
                className="text-[0.75rem] font-medium text-accent underline underline-offset-2"
              >
                Full history
              </Link>
            }
          >
            {revisions.length === 0 ? (
              <p className="text-[0.8125rem] text-fog">
                No edits yet. Everything on the site is the copy that shipped with the code.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {revisions.map((revision) => (
                  <li key={revision.id} className="py-3.5 first:pt-0">
                    <p className="font-mono text-[0.6875rem] text-fog-2">{revision.key}</p>
                    <p className="mt-1 line-clamp-2 text-[0.8125rem] text-ink">
                      {revision.action === "reset"
                        ? "reset to shipped copy"
                        : (revision.new_value ?? "—")}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[0.6875rem] text-fog-2">
                        {revision.actor ?? "unknown"} · {relativeTime(revision.at)}
                      </span>
                      <RevertButton revisionId={revision.id} label="Undo" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
