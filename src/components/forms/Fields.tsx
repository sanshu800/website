"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * One visual language for every field on the site: 44px control height, accent
 * focus ring, error text wired with aria-describedby so screen readers hear the
 * same thing sighted users see.
 *
 * Labels come in two variants. `mono` is the compact uppercase label used in
 * chrome — newsletters, job applications, the audit stepper. `text` is the
 * sentence-case label used on the long qualification form on `/contact`, where
 * a dozen fields in a row need to be scannable and every required field carries
 * a visible asterisk.
 */

const control =
  /* Focus is the site-wide accent outline (see :focus-visible in globals.css),
     not a bespoke shadow halo, so a focused field looks like every other
     focused control. The border darkens underneath it for a second cue. */
  "w-full rounded-lg border bg-paper px-3.5 text-body text-ink placeholder:text-fog transition-[border-color] duration-200 focus-visible:border-accent disabled:opacity-60 disabled:cursor-not-allowed";

export function Label({
  children,
  htmlFor,
  hint,
  variant = "mono",
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
  variant?: LabelVariant;
  required?: boolean;
}) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className={
          variant === "text"
            ? "text-body font-medium text-ink"
            : "font-mono text-label uppercase tracking-label text-fog"
        }
      >
        {children}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && <span className="text-eyebrow text-fog">{hint}</span>}
    </span>
  );
}

type LabelVariant = "mono" | "text";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  /** Label treatment. Defaults to the compact mono label used across the site. */
  labelVariant?: LabelVariant;
  /** Renders the asterisk on the label; the attribute is passed through to the control. */
  required?: boolean;
};

export function TextField({
  label,
  error,
  hint,
  className,
  labelVariant,
  required,
  trailing,
  ...rest
}: BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    /** Rendered inside the field's right edge, e.g. a Show/Hide control. */
    trailing?: React.ReactNode;
  }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint} variant={labelVariant} required={required}>
        {label}
      </Label>
      <div className="relative mt-2">
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          /* The right padding reserves the space the adornment sits in, so typed
             text never runs underneath it. */
          className={cn(
            control,
            "h-11",
            trailing ? "pr-16" : undefined,
            error ? "border-danger" : "border-field",
          )}
          {...rest}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-label text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  className,
  labelVariant,
  required,
  rows = 5,
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint} variant={labelVariant} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          "mt-2 resize-y py-3 leading-relaxed",
          error ? "border-danger" : "border-field",
        )}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-label text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  labelVariant,
  required,
  ...rest
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint} variant={labelVariant} required={required}>
        {label}
      </Label>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          "mt-2 h-11 appearance-none bg-[length:1rem] pr-9",
          error ? "border-danger" : "border-field",
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6a79' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
        }}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1.5 text-label text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  error,
  className,
  ...rest
}: { label: React.ReactNode; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-field accent-ink"
          {...rest}
        />
        <label htmlFor={id} className="text-micro leading-relaxed text-fog">
          {label}
        </label>
      </div>
      {error && <p className="mt-1.5 text-label text-danger-ink">{error}</p>}
    </div>
  );
}

/** Multi-select rendered as toggle chips — used for "systems you run today". */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const fieldsetId = useId();
  return (
    <fieldset>
      <legend
        id={fieldsetId}
        className="font-mono text-label uppercase tracking-label text-fog"
      >
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange(
                  active
                    ? value.filter((item) => item !== option)
                    : [...value, option],
                )
              }
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-micro transition-colors",
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-field text-fog hover:border-ink/25 hover:text-ink",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Shared success panel so every form ends the same way. */
export function FormSuccess({
  title,
  children,
  secondary,
}: {
  title: string;
  children: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-jade/30 bg-jade-soft p-7 sm:p-8"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-jade text-on-jade">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="mt-5 font-display text-display-s text-ink">{title}</h2>
      <div className="mt-3 text-micro text-fg-2">{children}</div>
      {secondary && <div className="mt-6">{secondary}</div>}
    </div>
  );
}

/** Non-blocking error banner used at the top of forms. */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger-line bg-danger-soft px-4 py-3 text-micro text-danger-ink"
    >
      {children}
    </div>
  );
}

/**
 * Spam trap.
 *
 * Hidden from people three ways — off-screen, out of the tab order, and
 * `aria-hidden` — so no keyboard or screen-reader user ever meets it, and no
 * autofill heuristic can mistake it for a real field. Address harvesters and
 * naive form bots fill it anyway, and the server answers them with a success.
 */
export function HoneypotField({
  value,
  onChange,
  id = "company_website",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
    >
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export { control as fieldControl };
