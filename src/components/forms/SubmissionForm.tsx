"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  help?: string;
  width?: "full" | "half";
  rows?: number;
};

type Status = "idle" | "sending" | "sent" | "error";

/**
 * One form component for every marketing surface (contact, demo, get-started,
 * newsletter, careers, partner and startup applications). Same validation, same
 * transport, same accessible status handling, different field spec.
 *
 * Posts to `/api/submissions`, which stores the payload in SQLite and returns a
 * reference id. A real deployment would forward to the CRM and send the
 * confirmation email — see the note in the API route.
 */
export function SubmissionForm({
  kind,
  fields,
  submitLabel = "Send",
  successTitle = "Received.",
  successBody = "We reply to every enquiry within one working day.",
  variant = "panel",
  footnote,
  className,
}: {
  kind: string;
  fields: Field[];
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  variant?: "panel" | "inline";
  footnote?: string;
  className?: string;
}) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: Record<string, string> = {};
    for (const field of fields) {
      const value = data.get(field.name);
      payload[field.name] =
        field.type === "checkbox"
          ? value === "on"
            ? "yes"
            : ""
          : String(value ?? "").trim();
    }

    const missing = fields.find(
      (field) => field.required && !payload[field.name],
    );
    if (missing) {
      setStatus("error");
      setMessage(`${missing.label} is required.`);
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          name: payload.name ?? payload.fullName ?? "",
          email: payload.email ?? "",
          company: payload.company ?? payload.firm ?? "",
          payload,
        }),
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const detail =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "Something went wrong.";
        throw new Error(detail);
      }
      if (body && typeof body === "object" && "id" in body) {
        setReference(String((body as { id: unknown }).id));
      }
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not send the form. Try again.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-jade/25 bg-jade-soft/60 p-6",
          className,
        )}
        role="status"
      >
        <Check className="size-5 text-jade" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-semibold text-ink">
          {successTitle}
        </p>
        <p className="mt-1.5 text-sm text-ink-muted">{successBody}</p>
        {reference ? (
          <p className="mt-3 font-mono text-xs text-ink-subtle">
            Reference {reference}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-violet-strong underline underline-offset-4 hover:text-violet"
        >
          Send another
        </button>
      </div>
    );
  }

  const inline = variant === "inline";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        inline
          ? "flex w-full flex-col gap-2 sm:flex-row"
          : "rounded-2xl border border-line bg-paper-raised p-6 shadow-[0_1px_2px_rgba(16,12,32,0.04)] sm:p-7",
        className,
      )}
    >
      {!inline ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          {fields.map((field) => (
            <FieldControl key={field.name} field={field} uid={uid} />
          ))}
        </div>
      ) : (
        fields.map((field) => (
          <div key={field.name} className="flex-1">
            <label htmlFor={`${uid}-${field.name}`} className="sr-only">
              {field.label}
            </label>
            <input
              id={`${uid}-${field.name}`}
              name={field.name}
              type={field.type === "email" ? "email" : "text"}
              required={field.required}
              placeholder={field.placeholder ?? field.label}
              className="w-full rounded-full border border-line-strong bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15"
            />
          </div>
        ))
      )}

      {!inline && footnote ? (
        <p className="mt-4 text-xs leading-relaxed text-ink-subtle">{footnote}</p>
      ) : null}

      <div
        className={cn(
          inline
            ? "shrink-0"
            : "mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5",
        )}
      >
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full font-medium transition",
            "bg-violet text-white shadow-[0_1px_2px_rgba(16,12,32,0.16)] hover:bg-violet-strong",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
            "disabled:cursor-not-allowed disabled:opacity-60",
            inline ? "w-full px-5 py-2.5 text-sm sm:w-auto" : "px-5 py-3 text-sm",
          )}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
        {!inline ? (
          <p className="text-xs text-ink-subtle">
            {fields.some((f) => f.type === "checkbox")
              ? "No newsletter unless you ask for it."
              : "No marketing sequences. One reply from a person."}
          </p>
        ) : null}
      </div>

      <p
        aria-live="polite"
        className={cn(
          "text-sm",
          !inline && "mt-3",
          status === "error" ? "text-magenta" : "sr-only",
        )}
      >
        {status === "error" ? (
          <span className="inline-flex items-center gap-2">
            <TriangleAlert className="size-4" aria-hidden="true" />
            {message}
          </span>
        ) : status === "sending" ? (
          "Sending…"
        ) : (
          ""
        )}
      </p>
    </form>
  );
}

function FieldControl({ field, uid }: { field: Field; uid: string }) {
  const id = `${uid}-${field.name}`;
  const describedBy = field.help ? `${id}-help` : undefined;
  const base =
    "w-full rounded-xl border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle transition focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15";
  const span = field.width === "half" ? "sm:col-span-1" : "sm:col-span-2";

  if (field.type === "checkbox") {
    return (
      <div className={cn("flex items-start gap-3", span)}>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 rounded border-line-strong text-violet focus:ring-violet/25"
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink-muted">
          {field.label}
        </label>
      </div>
    );
  }

  return (
    <div className={cn(field.width === "half" ? "sm:col-span-1" : "sm:col-span-2")}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium tracking-wide text-ink-muted uppercase"
      >
        {field.label}
        {field.required ? (
          <span className="ml-1 text-violet" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          className={cn(base, "resize-y")}
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue=""
          aria-describedby={describedBy}
          className={base}
        >
          <option value="" disabled>
            Select…
          </option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type ?? "text"}
          required={field.required}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          className={base}
        />
      )}
      {field.help ? (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-ink-subtle">
          {field.help}
        </p>
      ) : null}
    </div>
  );
}
