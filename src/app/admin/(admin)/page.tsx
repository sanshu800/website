import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, StatCard } from "@/components/admin/Bits";
import { RevertButton } from "@/components/admin/RevertButton";
import { DOCS, docFields, orphanedOverrides } from "@/lib/cms/documents";
import { contentVersionCount, overrideStats, recentRevisions } from "@/lib/cms/store";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Content" };

/**
 * Honest coverage note. Everything a visitor reads is editable; what remains is
 * deliberately out of scope: assets, and the per-page SEO metadata that is
 * derived from the copy rather than typed twice.
 */
const NOT_WIRED = [
  "Site structure, layout and components (engineering, not copy)",
  "The colour tokens, and the share card Next generates from the brand strings",
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
      <AdminHeader
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
                    <p className="text-body font-medium text-ink">{doc.title}</p>
                    <p className="mt-0.5 text-label leading-relaxed text-fog">{doc.blurb}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-eyebrow text-fog">
                      <span className="font-mono">{total} fields</span>
                      {edited > 0 && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-accent">
                          {edited} edited
                        </span>
                      )}
                      {orphans > 0 && (
                        <span className="rounded-full bg-magenta-soft px-2 py-0.5 font-mono text-magenta-ink">
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
                    href={`/admin/edit/${doc.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-night px-3.5 text-micro font-medium text-on-night transition-colors hover:bg-accent-2"
                  >
                    Edit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Deliberately not editable" className="mt-4">
            <p className="text-micro leading-relaxed text-fog">
              Every word a visitor reads is editable, along with the search metadata and the hero
              assets. What stays in code is structure: layout, components and the design tokens
              behind them.
            </p>
            <ul className="mt-4 grid gap-2 text-micro text-fog sm:grid-cols-2">
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
                href="/admin/history"
                className="text-label font-medium text-accent underline underline-offset-2"
              >
                Full history
              </Link>
            }
          >
            {revisions.length === 0 ? (
              <p className="text-micro text-fog">
                No edits yet. Everything on the site is the copy that shipped with the code.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {revisions.map((revision) => (
                  <li key={revision.id} className="py-3.5 first:pt-0">
                    <p className="font-mono text-eyebrow text-fog">{revision.key}</p>
                    <p className="mt-1 line-clamp-2 text-micro text-ink">
                      {revision.action === "reset"
                        ? "reset to shipped copy"
                        : (revision.new_value ?? "—")}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-eyebrow text-fog">
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
