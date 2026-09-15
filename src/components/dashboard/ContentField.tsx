"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditableField = {
  key: string;
  label: string;
  group: string;
  kind: "text" | "prose" | "link";
  current: string;
  fallback: string;
  edited: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

type Status = { tone: "idle" | "saving" | "saved" | "error"; message?: string };

/**
 * One editable string.
 *
 * Saves are explicit — an editor can see what they are about to publish, and
 * the same control resets the field to the copy that ships in code. Every
 * keystroke stays local until Save, so a half-typed headline never reaches the
 * live site.
 */
export function ContentField({
  field,
  doc,
  readOnly,
}: {
  field: EditableField;
  doc: string;
  readOnly: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(field.current);
  const [edited, setEdited] = useState(field.edited);
  const [status, setStatus] = useState<Status>({ tone: "idle" });
  const [pending, startTransition] = useTransition();

  const dirty = value !== field.current;
  const busy = status.tone === "saving" || pending;

  async function post(body: Record<string, unknown>): Promise<boolean> {
    setStatus({ tone: "saving", message: "Saving…" });
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ doc, ...body }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string; value?: string };
    if (!response.ok) {
      setStatus({ tone: "error", message: data.error ?? "That did not save." });
      return false;
    }
    setStatus({ tone: "saved", message: "Published" });
    startTransition(() => router.refresh());
    setTimeout(() => setStatus({ tone: "idle" }), 2500);
    return true;
  }

  async function save() {
    if (!dirty || value.trim() === "") return;
    const ok = await post({ action: "set", path: field.key, value });
    if (ok) {
      const trimmed = value.trim();
      setValue(trimmed);
      setEdited(trimmed !== field.fallback);
      setStatus({ tone: "saved", message: "Published" });
    }
  }

  async function reset() {
    const ok = await post({ action: "reset", path: field.key });
    if (ok) {
      setValue(field.fallback);
      setEdited(false);
    }
  }

  const inputClass = cn(
    "w-full rounded-lg border bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors",
    "focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:opacity-60",
    dirty ? "border-accent" : "border-line-strong",
  );

  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={field.key}
          className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink"
        >
          {field.label}
          {edited && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-accent">
              edited
            </span>
          )}
        </label>
        <div className="flex items-center gap-3 text-[0.6875rem] text-fog-2">
          {status.tone === "saving" && (
            <span className="inline-flex items-center gap-1 text-fog">
              <Loader2 className="h-3 w-3 animate-spin" /> saving
            </span>
          )}
          {status.tone === "saved" && (
            <span className="inline-flex items-center gap-1 text-jade">
              <Check className="h-3 w-3" /> {status.message}
            </span>
          )}
          {status.tone === "error" && (
            <span className="inline-flex items-center gap-1 text-magenta">
              <TriangleAlert className="h-3 w-3" /> {status.message}
            </span>
          )}
          {edited && field.updatedAt && (
            <span title={field.updatedBy ?? undefined}>
              changed {new Date(field.updatedAt).toLocaleDateString()}
            </span>
          )}
          <span className="font-mono">{field.key}</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-start gap-2">
        {field.kind === "prose" ? (
          <textarea
            id={field.key}
            value={value}
            disabled={readOnly}
            rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void save();
            }}
            className={cn(inputClass, "leading-relaxed")}
          />
        ) : (
          <input
            id={field.key}
            type="text"
            value={value}
            disabled={readOnly}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void save();
              }
            }}
            className={inputClass}
          />
        )}

        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => void save()}
            disabled={readOnly || busy || !dirty || value.trim() === ""}
            className="inline-flex h-10 items-center rounded-lg bg-ink px-3.5 text-[0.8125rem] font-medium text-on-ink transition-colors hover:bg-accent-2 disabled:opacity-40"
          >
            Save
          </button>
          {edited && (
            <button
              type="button"
              onClick={() => void reset()}
              disabled={readOnly || busy}
              title={`Restore the shipped copy: “${field.fallback.slice(0, 60)}${
                field.fallback.length > 60 ? "…" : ""
              }”`}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-[0.8125rem] font-medium text-fog transition-colors hover:bg-mist hover:text-ink disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {edited && !dirty && (
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-fog-2">
          Shipped copy: <span className="text-fog">{field.fallback.slice(0, 160)}</span>
          {field.fallback.length > 160 ? "…" : ""}
        </p>
      )}
    </div>
  );
}
