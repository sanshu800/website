"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FormError,
  FormSuccess,
  HoneypotField,
  SelectField,
  TextArea,
  TextField,
} from "./Fields";
import { track } from "@/lib/track";

/**
 * The one qualification form on the site.
 *
 * Both lead paths use it: the "Book a free AI audit" CTA on `/get-started` and
 * the contact page. It is deliberately longer than a "name, email, message"
 * box — company size, revenue, role and budget are the fields that make a first
 * reply useful instead of a request for more information, and asking them once
 * here saves three emails later. Everything except the phone number and the
 * referral source is required, and the browser is told so (the form is
 * `noValidate`, and the same rules are enforced by `enquirySchema` on the
 * server).
 *
 * Values are slugs; labels are for humans. The server accepts only the slugs
 * this file ships, against the same lists in `src/lib/submissions.ts`.
 */

const COMPANY_SIZES = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-40", label: "16–40 people" },
  { value: "41-120", label: "41–120 people" },
  { value: "120-plus", label: "120+ people" },
];

const REVENUE = [
  { value: "pre-revenue", label: "Not trading yet" },
  { value: "under-250k", label: "Under $250k" },
  { value: "250k-1m", label: "$250k – $1m" },
  { value: "1m-5m", label: "$1m – $5m" },
  { value: "5m-20m", label: "$5m – $20m" },
  { value: "20m-plus", label: "$20m+" },
  { value: "undisclosed", label: "Prefer not to say" },
];

const TITLES = [
  { value: "owner", label: "Owner / Managing Director" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales & marketing" },
  { value: "service", label: "Customer service" },
  { value: "it", label: "IT & systems" },
  { value: "other", label: "Something else" },
];

const TOPICS = [
  { value: "audit", label: "Book an AI audit" },
  { value: "project", label: "Automation or agent project" },
  { value: "client", label: "Support for existing work" },
  { value: "partnership", label: "Partnership or referral" },
  { value: "security", label: "Security and data handling" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Something else" },
];

const BUDGETS = [
  { value: "not-sure", label: "Not sure yet — tell me what it takes" },
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "discuss", label: "Prefer to discuss it on a call" },
];

export type EnquiryFormProps = {
  /**
   * Which lead path this is. Stored with the submission so the two funnels can
   * be told apart in the data without guessing from the payload.
   */
  kind: "audit" | "contact";
  /** Pre-selects a topic — used on `/get-started`, where the ask is the audit. */
  defaultTopic?: string;
  submitLabel?: string;
  successTitle?: string;
};

export function EnquiryForm({
  kind,
  defaultTopic = "",
  submitLabel = "Submit enquiry",
  successTitle,
}: EnquiryFormProps) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    company: "",
    companySize: "",
    revenue: "",
    title: "",
    phone: "",
    topic: defaultTopic,
    budget: "",
    message: "",
    referral: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  /** Never seen by a person; only a bot fills it in. */
  const [hp, setHp] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  function set(key: keyof typeof values) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      /* One `form_start` per visit to the form, on the first real edit: the gap
         between "opened the page" and "began typing" is what explains an
         abandoned funnel, and it is the only reason to record it at all. */
      if (!started) {
        setStarted(true);
        track("form_start", kind);
      }
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
    };
  }

  /** Required selects, checked here so the answer is instant and local. */
  function firstProblem(): Record<string, string> {
    const problems: Record<string, string> = {};
    if (values.fullName.trim().length < 2) problems.fullName = "Your name, please";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
      problems.email = "A working email address, so we can reply";
    if (values.company.trim().length < 2)
      problems.company = "Which company are you with?";
    if (!values.companySize) problems.companySize = "Choose a company size";
    if (!values.revenue) problems.revenue = "Choose a revenue range";
    if (!values.title) problems.title = "Choose your role";
    if (!values.topic) problems.topic = "Choose a topic";
    if (!values.budget) problems.budget = "Choose a budget range, or pick “prefer to discuss”";
    if (values.message.trim().length < 10)
      problems.message = "A sentence or two, so the first reply is useful";
    return problems;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFields({});
    setFormError(null);

    const problems = firstProblem();
    if (Object.keys(problems).length > 0) {
      setFields(problems);
      setFormError("Please check the highlighted fields.");
      setStatus("error");
      // Send focus to the first field with a problem.
      const first = document.getElementById(Object.keys(problems)[0]!);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind, company_website: hp }),
      });
      const data = (await response.json()) as { fields?: Record<string, string> };
      if (!response.ok) {
        setFields(data.fields ?? {});
        setFormError(
          response.status === 422
            ? "Please check the highlighted fields."
            : "Something went wrong on our side. Try again in a moment.",
        );
        setStatus("error");
        return;
      }
      setStatus("done");
      track("enquiry_submitted", kind);
    } catch {
      setStatus("error");
      setFormError("We could not reach the server. Check your connection and retry.");
    }
  }

  if (status === "done") {
    return (
      <FormSuccess title={successTitle ?? "Enquiry received"}>
        <p>
          Thank you — {values.fullName.split(" ")[0] || "we have your message"}. A person reads
          every enquiry, and you will have a reply within one working day (UK hours, GMT/BST),
          with either a straight answer or a short list of what we would need to look at.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <HoneypotField value={hp} onChange={setHp} />
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="Full name"
        labelVariant="text"
        name="fullName"
        autoComplete="name"
        placeholder="Priya Raman"
        value={values.fullName}
        onChange={set("fullName")}
        error={fields.fullName}
        required
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Work email"
          labelVariant="text"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@yourcompany.com"
          value={values.email}
          onChange={set("email")}
          error={fields.email}
          required
        />
        <TextField
          label="Company"
          labelVariant="text"
          name="company"
          autoComplete="organization"
          placeholder="Carrow Property"
          value={values.company}
          onChange={set("company")}
          error={fields.company}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Company size"
          labelVariant="text"
          name="companySize"
          options={COMPANY_SIZES}
          placeholder="Select company size"
          value={values.companySize}
          onChange={set("companySize")}
          error={fields.companySize}
          required
        />
        <SelectField
          label="Company revenue"
          labelVariant="text"
          name="revenue"
          options={REVENUE}
          placeholder="Select revenue range"
          value={values.revenue}
          onChange={set("revenue")}
          error={fields.revenue}
          required
        />
      </div>

      <SelectField
        label="Your title"
        labelVariant="text"
        name="title"
        options={TITLES}
        placeholder="Select your role"
        value={values.title}
        onChange={set("title")}
        error={fields.title}
        required
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Phone"
          labelVariant="text"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 415 555 0132"
          hint="Optional · any country, include the dialling code"
          value={values.phone}
          onChange={set("phone")}
          error={fields.phone}
        />
        <SelectField
          label="How can we help?"
          labelVariant="text"
          name="topic"
          options={TOPICS}
          placeholder="Select topic"
          value={values.topic}
          onChange={set("topic")}
          error={fields.topic}
          required
        />
      </div>

      <SelectField
        label="Budget"
        labelVariant="text"
        name="budget"
        options={BUDGETS}
        placeholder="Select budget range"
        value={values.budget}
        onChange={set("budget")}
        error={fields.budget}
        required
      />

      <TextArea
        label="Message"
        labelVariant="text"
        name="message"
        placeholder="Tell us about the work that eats your week, and what you would like to change. Specifics make the first reply useful."
        value={values.message}
        onChange={set("message")}
        error={fields.message}
        rows={7}
        required
      />

      <TextField
        label="How did you hear about us?"
        labelVariant="text"
        name="referral"
        placeholder="Google, referral, event, etc."
        hint="optional"
        value={values.referral}
        onChange={set("referral")}
        error={fields.referral}
      />

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          full
          disabled={status === "sending"}
          iconRight={status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
        >
          {status === "sending" ? "Sending" : submitLabel}
        </Button>
      </div>

      <p className="text-[0.75rem] leading-relaxed text-fog">
        We use these details to answer your enquiry and nothing else. No
        auto-responder loop, no list you did not ask for. Messages are stored in our own
        database, not a third-party form service.
      </p>
    </form>
  );
}
