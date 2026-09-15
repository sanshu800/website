"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FormError,
  FormSuccess,
  SelectField,
  TextArea,
  TextField,
} from "./Fields";

const TOPICS = [
  { value: "sales", label: "New business / pricing" },
  { value: "support", label: "Support for an existing account" },
  { value: "partnership", label: "Partnership programme" },
  { value: "security", label: "Security review or DPA" },
  { value: "careers", label: "Careers" },
  { value: "press", label: "Press or analyst enquiry" },
  { value: "something-else", label: "Something else" },
];

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    topic: "sales",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function set(key: keyof typeof values) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFields({});
    setFormError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
    } catch {
      setStatus("error");
      setFormError("We could not reach the server. Check your connection and retry.");
    }
  }

  if (status === "done") {
    return (
      <FormSuccess title="Message received">
        <p>
          A person replies to every enquiry, normally within one working day. We have
          your message and your address — no auto-responder loop.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && <FormError>{formError}</FormError>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Priya Raman"
          value={values.name}
          onChange={set("name")}
          error={fields.name}
          required
        />
        <TextField
          label="Work email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="priya@yourfirm.com"
          value={values.email}
          onChange={set("email")}
          error={fields.email}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Business"
          name="organization"
          autoComplete="organization"
          placeholder="Ramsey & Doyle"
          value={values.company}
          onChange={set("company")}
          error={fields.company}
        />
        <SelectField
          label="Topic"
          name="topic"
          options={TOPICS}
          value={values.topic}
          onChange={set("topic")}
          error={fields.topic}
        />
      </div>

      <TextArea
        label="How can we help?"
        name="message"
        placeholder="Tell us what you are trying to fix. Specifics make the first reply useful."
        value={values.message}
        onChange={set("message")}
        error={fields.message}
        rows={6}
        required
      />

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        iconRight={
          status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {status === "sending" ? "Sending" : "Send message"}
      </Button>

      <p className="text-[0.6875rem] leading-relaxed text-fog-2">
        By sending this you agree we may contact you about your enquiry. Messages are
        stored in our own database, not a third-party form service.
      </p>
    </form>
  );
}
