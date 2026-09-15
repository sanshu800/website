"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormError, FormSuccess } from "./Fields";
import { cn } from "@/lib/utils";

/** Inline subscribe form used on /newsletter, /guides and the footer band. */
export function NewsletterForm({
  source = "newsletter-page",
  variant = "stacked",
}: {
  source?: string;
  variant?: "stacked" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      setError("That email address does not look right.");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Subscription failed. Try again, or email hello@reygent.ai.");
    }
  }

  if (status === "done") {
    return (
      <FormSuccess title="You are on the list">
        We will confirm from a real address, and every issue carries a one-click
        unsubscribe. Address used: <strong className="text-ink">{email}</strong>.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div
        className={cn(
          "flex gap-2",
          variant === "inline" ? "flex-col sm:flex-row" : "flex-col",
        )}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Work email
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@yourfirm.com"
          className={cn(
            "h-11 w-full rounded-full border bg-paper px-5 text-[0.9375rem] outline-none transition-[border-color,box-shadow] focus-visible:border-violet focus-visible:shadow-[0_0_0_3px_rgba(91,52,242,0.14)]",
            status === "error" ? "border-danger" : "border-line-strong",
          )}
        />
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className={variant === "inline" ? "shrink-0" : "w-full"}
          iconRight={
            status === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )
          }
        >
          {status === "sending" ? "Subscribing" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <div className="mt-3">
          <FormError>{error}</FormError>
        </div>
      )}
      <p className="mt-3 text-[0.6875rem] text-fog-2">
        One email a month. No newsletter platform is connected on this build, so
        addresses are stored in our own database and nothing is sent yet.
      </p>
    </form>
  );
}
