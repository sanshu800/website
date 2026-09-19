"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type EditableField = {
  key: string;
  label: string;
  /** Optional guidance written by the document itself. */
  hint?: string;
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
    if (!dirty) return;
    const ok = await post({ action: "set", path: field.key, value });
    if (ok) {
      const trimmed = value.trim();
      setValue(trimmed);
      setEdited(trimmed !== field.fallback);
      setStatus({
        tone: "saved",
        message: trimmed === "" ? "Removed from the page" : "Published",
      });
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
    "w-full rounded-lg border bg-paper px-3.5 py-2.5 text-body text-ink transition-colors",
    "focus-visible:border-accent disabled:opacity-60 disabled:cursor-not-allowed",
    dirty ? "border-accent" : "border-field",
  );

  /*
   * An empty box is a removal, not a mistake, so the button says what will
   * happen rather than staying greyed out. The consequence is spelled out
   * underneath for the two shapes it can take: a line that leaves a gap on a
   * page versus an item that closes the list up.
   */
  const isClearing = dirty && value.trim() === "";

  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={field.key}
          className="flex items-center gap-2 text-small font-medium text-ink"
        >
          {field.label}
          {edited && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-label uppercase tracking-label text-accent">
              edited
            </span>
          )}
        </label>
        {field.hint && (
          <p className="mt-1 text-label text-fog">{field.hint}</p>
        )}
        <div className="flex items-center gap-3 text-eyebrow text-fog">
          {status.tone === "saving" && (
            <span className="inline-flex items-center gap-1 text-fog">
              <Loader2 className="h-3 w-3 animate-spin" /> saving
            </span>
          )}
          {status.tone === "saved" && (
            <span className="inline-flex items-center gap-1 text-jade-ink">
              <Check className="h-3 w-3" /> {status.message}
            </span>
          )}
          {status.tone === "error" && (
            <span className="inline-flex items-center gap-1 text-magenta-ink">
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
          <Button
            type="button"
            onClick={() => void save()}
            disabled={readOnly || busy || !dirty}
          >
            {isClearing ? "Remove from page" : "Save"}
          </Button>
          {edited && (
            <Button
              type="button"
              onClick={() => void reset()}
              disabled={readOnly || busy}
              title={`Restore the shipped copy: “${field.fallback.slice(0, 60)}${
                field.fallback.length > 60 ? "…" : ""
              }”`}
              variant="secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {isClearing && (
        <p className="mt-2 text-eyebrow leading-relaxed text-fog">
          {field.kind === "link"
            ? "A link needs a destination. To take this link off the page, clear its label instead."
            : "This line will come off the page. Reset brings the shipped copy back."}
        </p>
      )}

      {edited && !dirty && (
        <p className="mt-2 text-eyebrow leading-relaxed text-fog">
          {field.current === "" ? (
            <span className="text-fog">
              Removed from the page. Reset brings the shipped copy back.
            </span>
          ) : null}
          Shipped copy: <span className="text-fog">{field.fallback.slice(0, 160)}</span>
          {field.fallback.length > 160 ? "…" : ""}
        </p>
      )}
    </div>
  );
}
