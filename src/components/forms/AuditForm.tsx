"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChipGroup, FormError, FormSuccess, SelectField, TextArea, TextField } from "./Fields";
import { cn } from "@/lib/utils";

const SECTORS = [
  { value: "professional-services", label: "Professional services" },
  { value: "property", label: "Property & trades" },
  { value: "ecommerce", label: "E-commerce & retail" },
  { value: "clinics", label: "Clinics & health" },
  { value: "other", label: "Something else" },
];

const SIZES = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-40", label: "16–40 people" },
  { value: "41-120", label: "41–120 people" },
  { value: "120+", label: "120+ people" },
];

const SYSTEMS = [
  "Shared inboxes",
  "Spreadsheets",
  "CRM",
  "Accounting software",
  "Quoting & invoicing",
  "Job or order management",
  "Scheduling & diaries",
  "Documents & storage",
  "Phone system",
  "Supplier portals",
];

const SLOTS = ["08:30", "10:00", "11:30", "13:00", "14:30", "16:00"];

export function AuditForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    sector: "professional-services",
    teamSize: "6-15",
    notes: "",
  });
  const [systems, setSystems] = useState<string[]>(["Shared inboxes", "Spreadsheets"]);
  const [slot, setSlot] = useState("10:00");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const steps = ["Your business", "What you run today", "Pick a time"];

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
      if (values.company.trim().length < 2) errors.company = "Which business are you with?";
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
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "audit",
          payload: { ...values, systems, preferredTime: slot },
        }),
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
      <FormSuccess title="Audit request received">
        <p>
          {values.name.split(" ")[0]}, we have your request for a 30-minute session about{" "}
          <strong className="text-ink">{values.company}</strong> at{" "}
          <strong className="text-ink">{slot}</strong> (your local time, subject to
          confirmation).
        </p>
        <p className="mt-3">
          On this build no calendar provider is connected, so nothing has been booked
          automatically — the request is stored and a person confirms the time. Wiring
          Google Calendar or Cal.com is the one change needed to make the slot
          self-service.
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
                index <= step ? "bg-accent text-white" : "bg-mist-2 text-fog",
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
              label="Business"
              autoComplete="organization"
              placeholder="Carrow Property"
              value={values.company}
              onChange={set("company")}
              error={fields.company}
              required
              className="sm:col-span-1"
            />
            <SelectField
              label="Industry"
              options={SECTORS}
              value={values.sector}
              onChange={set("sector")}
            />
            <SelectField
              label="Business size"
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
            label="What holds your work together today?"
            options={SYSTEMS}
            value={systems}
            onChange={setSystems}
          />
          <TextArea
            label="What should we look at first?"
            placeholder="e.g. every enquiry goes to a shared inbox and sits there; invoices are keyed in by hand; quotes never get followed up; the month-end numbers take three days to assemble."
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
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line-strong text-fog hover:border-ink/25 hover:text-ink",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex gap-4 rounded-xl border border-line bg-mist p-5">
            <CalendarClock className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-micro text-fog">
              Thirty minutes, screenshare, no slides. Bring the process that annoys you
              most and we will map it with you. You keep the notes whether or not we ever
              work together.
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
            {status === "sending" ? "Sending" : "Request the audit"}
          </Button>
        )}
      </div>
    </form>
  );
}
