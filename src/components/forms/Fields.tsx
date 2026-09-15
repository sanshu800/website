"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * One visual language for every field on the site: mono uppercase label, 44px
 * control height, accent focus ring, error text wired with aria-describedby so
 * screen readers hear the same thing sighted users see.
 */

const control =
  "w-full rounded-lg border bg-paper px-3.5 text-[0.9375rem] text-ink placeholder:text-fog-2/80 outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgba(10,10,11,0.10)] disabled:opacity-60";

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
      >
        {children}
      </label>
      {hint && <span className="text-[0.6875rem] text-fog-2">{hint}</span>}
    </span>
  );
}

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function TextField({
  label,
  error,
  hint,
  className,
  ...rest
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(control, "mt-2 h-11", error ? "border-danger" : "border-line-strong")}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.75rem] text-danger">
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
  rows = 5,
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          "mt-2 resize-y py-3 leading-relaxed",
          error ? "border-danger" : "border-line-strong",
        )}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.75rem] text-danger">
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
  ...rest
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          control,
          "mt-2 h-11 appearance-none bg-[length:1rem] pr-9",
          error ? "border-danger" : "border-line-strong",
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
        <p id={errorId} className="mt-1.5 text-[0.75rem] text-danger">
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
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong accent-ink"
          {...rest}
        />
        <label htmlFor={id} className="text-[0.8125rem] leading-relaxed text-fog">
          {label}
        </label>
      </div>
      {error && <p className="mt-1.5 text-[0.75rem] text-danger">{error}</p>}
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
        className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
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
                "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line-strong text-fog hover:border-ink/25 hover:text-ink",
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
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-jade text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="mt-5 font-display text-[1.25rem] text-ink">{title}</h2>
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
      className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-[0.8125rem] text-danger"
    >
      {children}
    </div>
  );
}

export { control as fieldControl };
