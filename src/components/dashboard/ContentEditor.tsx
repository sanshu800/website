"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ContentField, type EditableField } from "@/components/dashboard/ContentField";
import { cn } from "@/lib/utils";

/**
 * The editor surface for one content document: a search box over every field,
 * a filter for fields an editor has already changed, and the fields themselves
 * grouped the way they appear on the page.
 */
export function ContentEditor({
  doc,
  fields,
  readOnly,
}: {
  doc: string;
  fields: EditableField[];
  readOnly: boolean;
}) {
  const [query, setQuery] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);

  const editedCount = useMemo(() => fields.filter((field) => field.edited).length, [fields]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return fields.filter((field) => {
      if (onlyEdited && !field.edited) return false;
      if (!needle) return true;
      return (
        field.label.toLowerCase().includes(needle) ||
        field.group.toLowerCase().includes(needle) ||
        field.current.toLowerCase().includes(needle) ||
        field.fallback.toLowerCase().includes(needle) ||
        field.key.toLowerCase().includes(needle)
      );
    });
  }, [fields, onlyEdited, query]);

  const groups = useMemo(() => {
    const map = new Map<string, EditableField[]>();
    for (const field of visible) {
      const list = map.get(field.group) ?? [];
      list.push(field);
      map.set(field.group, list);
    }
    return [...map.entries()];
  }, [visible]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-6 flex flex-wrap items-center gap-3 border-b border-line bg-paper/95 px-1 py-4 backdrop-blur">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search every field on this surface…"
            aria-label="Search fields"
            className="h-11 w-full rounded-lg border border-line-strong bg-paper pl-9 pr-3 text-[0.9375rem] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <button
          type="button"
          onClick={() => setOnlyEdited((current) => !current)}
          aria-pressed={onlyEdited}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-[0.8125rem] font-medium transition-colors",
            onlyEdited
              ? "border-accent bg-accent text-white"
              : "border-line-strong text-fog hover:bg-mist hover:text-ink",
          )}
        >
          Edited only
          <span className="font-mono text-[0.6875rem] opacity-80">{editedCount}</span>
        </button>

        <p className="text-[0.75rem] text-fog-2">
          <span className="font-mono text-ink">{visible.length}</span> of {fields.length} fields
        </p>
      </div>

      {groups.length === 0 && (
        <p className="rounded-xl border border-dashed border-line-strong px-6 py-12 text-center text-micro text-fog">
          Nothing matches “{query}”. Try the section name, the words on the page, or the field key.
        </p>
      )}

      <div className="space-y-8">
        {groups.map(([group, groupFields]) => (
          <section key={group}>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[1.0625rem] text-ink">{group}</h2>
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[0.6875rem] text-fog-2">
                {groupFields.length} field{groupFields.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-1">
              {groupFields.map((field) => (
                <ContentField key={field.key} field={field} doc={doc} readOnly={readOnly} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 rounded-xl border border-line bg-mist px-5 py-4 text-[0.75rem] leading-relaxed text-fog">
        Field keys are stable across edits, so renaming copy in code does not move anyone&apos;s work.
        If a key disappears from the page it came from, the admin reports it as an orphan under{" "}
        <Link href="/dashboard/content/history" className="text-accent underline underline-offset-2">
          history
        </Link>
        , where it can be dropped or restored.
      </p>
    </div>
  );
}
