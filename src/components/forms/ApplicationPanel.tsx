"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/track";

/**
 * Application entry point.
 *
 * Submissions POST to /api/careers, which stores them in SQLite. There is no
 * ATS integration yet — an application form that silently discards data would
 * be worse than one that says where it goes.
 */
export function ApplicationPanel({ roleTitle, slug }: { roleTitle: string; slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      setMessage("Please give us a name and a working email address.");
      return;
    }
    setStatus("sending");
    setMessage(null);
    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: slug, roleTitle, name, email, portfolio, note }),
      });
      if (!response.ok) throw new Error("failed");
      setStatus("sent");
      track("application_submitted");
    } catch {
      setStatus("error");
      setMessage("That did not go through. Email us instead and we will pick it up.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-jade/30 bg-jade-soft p-7">
        <Check className="h-6 w-6 text-jade" />
        <h2 className="mt-4 font-display text-display-s text-ink">
          Application received
        </h2>
        <p className="mt-2.5 text-small text-fg-2">
          Thanks {name.split(" ")[0]}. A person reads every application for this role,
          and you will hear back either way within ten working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line p-7">
      <h2 className="font-display text-display-s text-ink">Apply for this role</h2>
      <p className="mt-2 text-small text-fog">
        Two fields and a note. We ask for the work sample later, not now.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="font-mono text-label uppercase tracking-label text-fog">
            Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            className="mt-2 w-full rounded-lg border border-field bg-paper px-3.5 py-2.5 text-body transition-colors focus-visible:border-accent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-label uppercase tracking-label text-fog">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border border-field bg-paper px-3.5 py-2.5 text-body transition-colors focus-visible:border-accent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-label uppercase tracking-label text-fog">
            Portfolio or profile
          </span>
          <input
            value={portfolio}
            onChange={(event) => setPortfolio(event.target.value)}
            placeholder="github.com, site, or a doc"
            className="mt-2 w-full rounded-lg border border-field bg-paper px-3.5 py-2.5 text-body transition-colors focus-visible:border-accent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-label uppercase tracking-label text-fog">
            Why this role
          </span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            placeholder="A few sentences. Specific beats polished."
            className="mt-2 w-full resize-y rounded-lg border border-field bg-paper px-3.5 py-2.5 text-body transition-colors focus-visible:border-accent"
          />
        </label>
      </div>

      {message && <p className="mt-4 text-small text-danger-ink">{message}</p>}

      <Button type="submit" className="mt-6" full disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            Send application <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="mt-4 text-eyebrow leading-relaxed text-fog">
        Applications are stored in our own database and read by the hiring manager for
        this role. No third-party ATS is involved.
      </p>
    </form>
  );
}

/** Privacy affordance: candidates can withdraw without emailing. */
export function CancelApplication() {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-line bg-mist px-4 py-3">
      <p className="text-label text-fog">
        Already applied and changed your mind?
      </p>
      <ButtonLink href="/contact" variant="ghost" size="sm">
        Withdraw
      </ButtonLink>
    </div>
  );
}
