"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  CheckboxField,
  FormError,
  FormSuccess,
  SelectField,
  TextArea,
  TextField,
} from "./Fields";
import { cn } from "@/lib/utils";
import { tiers } from "@/lib/content/company";

const SECTORS = [
  { value: "legal", label: "Legal" },
  { value: "accounting", label: "Accounting & audit" },
  { value: "consulting", label: "Consulting" },
  { value: "advisory", label: "Wealth & advisory" },
  { value: "other", label: "Other professional services" },
];

const SIZES = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-40", label: "16–40 people" },
  { value: "41-120", label: "41–120 people" },
  { value: "120+", label: "120+ people" },
];

const INTENTS = [
  { value: "replace-spreadsheets", label: "Replace spreadsheets and shared inboxes" },
  { value: "consolidate", label: "Consolidate several disconnected tools" },
  { value: "reporting", label: "Get reliable practice-wide reporting" },
  { value: "onboarding", label: "Fix client onboarding and document chasing" },
  { value: "ai", label: "Use AI on our own client records safely" },
];

export function GetStartedForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    sector: "legal",
    teamSize: "6-15",
    plan: "pro",
    intent: "replace-spreadsheets",
  });
  const [startup, setStartup] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const steps = ["Your firm", "What you need", "Confirm"];

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
      if (values.name.trim().length < 2) errors.name = "Your name, please.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
        errors.email = "We need a working email for the trial link.";
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
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "get-started",
          payload: { ...values, startup, notes },
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
      <FormSuccess
        title="Trial request received"
        secondary={
          <ButtonLink href="/signup" size="md">
            Create your account
          </ButtonLink>
        }
      >
        <p>
          We have your details for <strong className="text-ink">{values.company}</strong>{" "}
          on the {values.plan === "enterprise" ? "Enterprise" : values.plan} tier
          {startup ? " with the startup discount noted" : ""}.
        </p>
        <p className="mt-3">
          On this build the next step is a real account: sign up with the same email and
          you land in the dashboard immediately, with the sample firm loaded.
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
              label="Firm"
              autoComplete="organization"
              placeholder="Ramsey & Doyle"
              value={values.company}
              onChange={set("company")}
              error={fields.company}
              required
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
          <SelectField
            label="What matters most in the first ninety days?"
            options={INTENTS}
            value={values.intent}
            onChange={set("intent")}
          />
          <TextArea
            label="Anything else we should know?"
            placeholder="Optional. Current tools, deadlines, constraints, or the thing that annoys your team most."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <fieldset>
            <legend className="font-mono text-[0.625rem] uppercase tracking-wide text-fog">
              Plan
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {tiers.map((tier) => {
                const value = tier.name.toLowerCase();
                const active = values.plan === value;
                return (
                  <button
                    key={tier.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setValues((prev) => ({ ...prev, plan: value }))
                    }
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-line-strong hover:border-ink/25",
                    )}
                  >
                    <span className="block text-[0.9375rem] font-medium text-ink">
                      {tier.name}
                    </span>
                    <span className="mt-1 block text-[0.75rem] text-fog">
                      {tier.price}
                      {tier.price !== "Custom" && " / user / mo"}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <CheckboxField
            checked={startup}
            onChange={(event) => setStartup(event.target.checked)}
            label={
              <>
                Our firm is under three years old — check eligibility for the{" "}
                <Link href="/startups" className="text-accent underline underline-offset-2">
                  startup programme
                </Link>
                .
              </>
            }
          />

          <div className="rounded-xl border border-line bg-mist p-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
              Summary
            </p>
            <dl className="mt-3 space-y-2 text-micro">
              {[
                ["Firm", values.company || "—"],
                ["Practice", SECTORS.find((s) => s.value === values.sector)?.label ?? "—"],
                ["Size", SIZES.find((s) => s.value === values.teamSize)?.label ?? "—"],
                ["Plan", values.plan === "enterprise" ? "Enterprise" : values.plan],
                ["Priority", INTENTS.find((i) => i.value === values.intent)?.label ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-fog-2">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
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
            {status === "sending" ? "Sending" : "Start free trial"}
          </Button>
        )}
      </div>
    </form>
  );
}
