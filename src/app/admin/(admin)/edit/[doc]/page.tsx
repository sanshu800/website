import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/Bits";
import { ContentEditor } from "@/components/admin/ContentEditor";
import type { EditableField } from "@/components/admin/ContentField";
import { RevertButton } from "@/components/admin/RevertButton";
import { getSession } from "@/lib/auth";
import { DOCS, docById, docFields, editedFields, orphanedOverrides } from "@/lib/cms/documents";

export function generateStaticParams() {
  return DOCS.map((doc) => ({ doc: doc.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc: id } = await params;
  const doc = docById(id);
  return { title: doc ? `Edit ${doc.title}` : "Content" };
}

export default async function ContentDocPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc: id } = await params;
  const def = docById(id);
  if (!def) notFound();

  const session = await getSession();
  const readOnly = !(session?.role === "owner" || session?.role === "admin");

  const fields: EditableField[] = docFields(def.id).map((field) => ({
    key: field.key,
    label: field.label,
    ...(field.hint ? { hint: field.hint } : {}),
    group: field.group,
    kind: field.kind,
    current: field.current,
    fallback: field.fallback,
    edited: field.edited,
    updatedAt: field.updatedAt,
    updatedBy: field.updatedBy,
  }));

  const changed = editedFields(def.id);
  const orphans = orphanedOverrides(def.id);

  return (
    <>
      <AdminHeader
        title={def.title}
        summary={def.blurb}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3 text-label text-fog">
        <span className="font-mono text-ink">{fields.length}</span> editable strings ·
        <span className="font-mono text-ink">{changed.length}</span> changed from the shipped copy
        <span className="h-4 w-px bg-line-strong" />
        {def.where.map((place) => (
          <a
            key={place.href}
            href={place.href}
            className="inline-flex items-center gap-1 text-accent underline underline-offset-2"
          >
            {place.label}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>

      {readOnly && (
        <p className="mb-5 rounded-xl border border-magenta/30 bg-magenta-soft px-4 py-3 text-small text-ink">
          Your role can read the content admin but not publish. Ask an owner or admin in this
          workspace to make the change.
        </p>
      )}

      {orphans.length > 0 && (
        <Card className="mb-5 border-magenta/30">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-magenta" />
            <div className="flex-1">
              <p className="text-small font-medium text-ink">
                {orphans.length} stored {orphans.length === 1 ? "edit" : "edits"} no longer match a
                field
              </p>
              <p className="mt-1 text-small leading-relaxed text-fog">
                The copy was renamed or removed in code, so these values are not rendered anywhere.
                Drop them, or restore the field in code to bring the text back.
              </p>
              <ul className="mt-3 space-y-2">
                {orphans.map((orphan) => (
                  <li key={orphan.key} className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-eyebrow text-fog">{orphan.path}</span>
                    <span className="text-label text-fog">“{orphan.value.slice(0, 60)}”</span>
                    <RevertButton keyName={orphan.key} label="Drop" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <ContentEditor doc={def.id} fields={fields} readOnly={readOnly} />

      <p className="mt-8 text-label text-fog">
        Looking for a different surface?{" "}
        <Link href="/admin" className="text-accent underline underline-offset-2">
          All content
        </Link>{" "}
        ·{" "}
        <Link
          href="/admin/history"
          className="text-accent underline underline-offset-2"
        >
          Change history
        </Link>
      </p>
    </>
  );
}
