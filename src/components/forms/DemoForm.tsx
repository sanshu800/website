"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChipGroup, FormError, FormSuccess, SelectField, TextArea, TextField } from "./Fields";
import { cn } from "@/lib/utils";

const SECTORS = [
  { value: "legal", label: "Legal" },
  { value: "accounting", label: "Accounting & audit" },
  { value: "consulting", label: "Consulting" },
  { value: "advisory", label: "Wealth & advisory" },
  { value: "other", label: "Other professional services" },
];

const SIZES = [
  { value: "2-10", label: "2–10 people" },
  { value: "11-25", label: "11–25 people" },
  { value: "26-75", label: "26–75 people" },
  { value: "76-200", label: "76–200 people" },
  { value: "200+", label: "200+ people" },
];

const SYSTEMS = [
  "Shared inboxes",
  "Spreadsheets",
  "Practice management",
  "CRM",
  "Document storage",
  "E-signature",
  "Accounting ledger",
  "Scheduling",
  "Project tracking",
  "Data warehouse",
];

const SLOTS = ["08:30", "10:00", "11:30", "13:00", "14:30", "16:00"];

export function DemoForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    sector: "legal",
    teamSize: "11-25",
    notes: "",
  });
  const [systems, setSystems] = useState<string[]>(["Shared inboxes", "Spreadsheets"]);
  const [slot, setSlot] = useState("10:00");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const steps = ["Your firm", "What you run today", "Pick a time"];

  function set(key: keyof typeof values) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function next() {
    setFields({});
    setFormError(null);
    if (step === 0) {
      const errors: Record<string, string> = {};
      if (values.name.trim().length < 2) errors.name = "Tell us who we are meeting.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
        errors.email = "A working email address, please.";
      if (values.company.trim().length < 2) errors.company = "Which firm are you with?";
      if (Object.keys(errors).length > 0) {
        setFields(errors);
        return;
      }
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setFormError(null);
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, systems, preferredTime: slot }),
      });
      const data = (await response.json()) as { fields?: Record<string, string> };
      if (!response.ok) {
        setFields(data.fields ?? {});
        setFormError("Please check the highlighted fields.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setFormError("We could not reach the server. Try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <FormSuccess title="Demo request received">
        <p>
          {values.name.split(" ")[0]}, we have your request for a 30-minute session on{" "}
          <strong className="text-ink">{values.company}</strong> at{" "}
          <strong className="text-ink">{slot}</strong> (your local time, subject to
          confirmation).
        </p>
        <p className="mt-3">
          On this build no calendar provider is connected, so nothing has been booked
          automatically — the request is stored and would be confirmed by a human.
          Connecting Google Calendar or Cal.com is the one change needed to make
          booking real.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <ol className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        {steps.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[0.625rem]",
                index <= step ? "bg-violet text-white" : "bg-mist-2 text-fog",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "font-mono text-[0.625rem] uppercase tracking-wide",
                index === step ? "text-ink" : "text-fog-2",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="hidden h-px w-8 bg-line-strong sm:block" />
            )}
          </li>
        ))}
      </ol>

      {formError && (
        <div className="mb-5">
          <FormError>{formError}</FormError>
        </div>
      )}

      {step === 0 && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Name"
              autoComplete="name"
              placeholder="Priya Raman"
              value={values.name}
              onChange={set("name")}
              error={fields.name}
              required
            />
            <TextField
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="priya@yourfirm.com"
              value={values.email}
              onChange={set("email")}
              error={fields.email}
              required
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="Firm"
              autoComplete="organization"
              placeholder="Ramsey & Doyle"
              value={values.company}
              onChange={set("company")}
              error={fields.company}
              required
              className="sm:col-span-1"
            />
            <SelectField
              label="Practice"
              options={SECTORS}
              value={values.sector}
              onChange={set("sector")}
            />
            <SelectField
              label="Firm size"
              options={SIZES}
              value={values.teamSize}
              onChange={set("teamSize")}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <ChipGroup
            label="Which systems hold client work today?"
            options={SYSTEMS}
            value={systems}
            onChange={setSystems}
          />
          <TextArea
            label="What should we look at first?"
            placeholder="e.g. enquiries sit in a shared inbox for days; onboarding documents get chased by hand; month-end reporting is rebuilt in spreadsheets."
            value={values.notes}
            onChange={set("notes")}
            rows={5}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <fieldset>
            <legend className="font-mono text-[0.625rem] uppercase tracking-wide text-fog">
              Preferred start time (your local time)
            </legend>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {SLOTS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={slot === option}
                  onClick={() => setSlot(option)}
                  className={cn(
                    "rounded-lg border py-2.5 font-mono text-[0.8125rem] transition-colors",
                    slot === option
                      ? "border-violet bg-violet-soft text-violet"
                      : "border-line-strong text-fog hover:border-ink/25 hover:text-ink",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-4 rounded-xl border border-line bg-mist p-5">
            <CalendarClock className="h-5 w-5 shrink-0 text-violet" aria-hidden="true" />
            <p className="text-micro text-fog">
              Thirty minutes, screenshare, no slides. Bring one live process and we will
              map it with you — you keep the map whether or not you become a customer.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          disabled={step === 0}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>

        {step < steps.length - 1 ? (
          <Button type="button" onClick={next} iconRight={<ArrowRight className="h-4 w-4" />}>
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={status === "sending"}
            iconRight={
              status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )
            }
          >
            {status === "sending" ? "Sending" : "Request demo"}
          </Button>
        )}
      </div>
    </form>
  );
}
