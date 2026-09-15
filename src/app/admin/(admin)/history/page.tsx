import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/Bits";
import { RevertButton } from "@/components/admin/RevertButton";
import { DOCS, docById, orphanedOverrides } from "@/lib/cms/documents";
import { recentRevisions } from "@/lib/cms/store";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Content history" };

const ACTION_LABEL: Record<string, string> = {
  set: "Edited",
  reset: "Reset to shipped copy",
  revert: "Restored an earlier value",
};

function titleForPath(path: string): string {
  const leaf = path.split(".").pop() ?? path;
  const scope = path.split(".").slice(0, -1).filter((part) => part !== "items").join(" · ");
  const pretty = `${scope ? `${scope} · ` : ""}${leaf}`.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return pretty;
}

/**
 * The audit trail. Every write the content admin makes lands here with its
 * before and after value, so a mistake is one click from being undone — which
 * is the difference between a CMS someone trusts and one they are afraid of.
 */
export default function ContentHistoryPage() {
  const revisions = recentRevisions(60);
  const orphans = DOCS.flatMap((doc) =>
    orphanedOverrides(doc.id).map((orphan) => ({ ...orphan, doc })),
  );

  return (
    <>
      <AdminHeader
        eyebrow="Website"
        title="Change history"
        summary="Every content change, by whom and when, with the value it replaced. Restore any of them — restoring is itself logged."
      />

      {orphans.length > 0 && (
        <Card title="Orphaned edits" className="mb-4">
          <p className="text-[0.8125rem] leading-relaxed text-fog">
            These stored values no longer match a field in the document — the copy they belonged to
            was renamed or deleted in code. Nothing is rendering them.
          </p>
          <ul className="mt-4 divide-y divide-line">
            {orphans.map((orphan) => (
              <li key={orphan.key} className="flex flex-wrap items-center gap-3 py-3">
                <span className="rounded-full bg-mist px-2 py-0.5 font-mono text-[0.6875rem] text-fog">
                  {orphan.doc.title}
                </span>
                <span className="font-mono text-[0.6875rem] text-fog-2">{orphan.path}</span>
                <span className="flex-1 text-[0.8125rem] text-fog">“{orphan.value.slice(0, 80)}”</span>
                <RevertButton keyName={orphan.key} label="Drop" />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title={`${revisions.length} most recent changes`}>
        {revisions.length === 0 ? (
          <p className="text-[0.8125rem] text-fog">
            Nothing has been edited yet — the site is running on the copy in code.{" "}
            <Link href="/admin" className="text-accent underline underline-offset-2">
              Start with a surface
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {revisions.map((revision) => {
              const doc = docById(revision.doc);
              return (
                <li key={revision.id} className="py-4 first:pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-mist px-2 py-0.5 font-mono text-[0.6875rem] text-fog">
                      {doc?.title ?? revision.doc}
                    </span>
                    <span className="text-[0.8125rem] font-medium text-ink">
                      {titleForPath(revision.path)}
                    </span>
                    <span className="text-[0.75rem] text-fog-2">
                      {ACTION_LABEL[revision.action] ?? revision.action}
                    </span>
                  </div>

                  <div className="mt-2 grid gap-2 text-[0.8125rem] sm:grid-cols-2">
                    <p className="rounded-lg bg-mist px-3 py-2 text-fog">
                      <span className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                        before
                      </span>
                      <br />
                      {revision.old_value ? revision.old_value : "— shipped copy —"}
                    </p>
                    <p className="rounded-lg bg-paper px-3 py-2 text-ink ring-1 ring-inset ring-line">
                      <span className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                        after
                      </span>
                      <br />
                      {revision.new_value ?? "— back to shipped copy —"}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[0.6875rem] text-fog-2">
                      {revision.actor ?? "unknown"}
                      {revision.actor_email ? ` · ${revision.actor_email}` : ""} ·{" "}
                      {relativeTime(revision.at)}
                    </span>
                    <RevertButton revisionId={revision.id} label="Restore this value" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
