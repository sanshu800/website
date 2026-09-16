"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormError, TextField } from "@/components/forms/Fields";

/**
 * The only way into the admin.
 *
 * There is no sign-up on purpose: this site has no customer accounts. Accounts
 * are created out of band by `npm run admin:create`, so the public surface has
 * nothing to attack and nothing to advertise.
 */
export function AdminSignInForm({ next = "/admin" }: { next?: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [reveal, setReveal] = useState(false);

  /**
   * Counts down the wait the server asked for. Without this the form happily
   * accepts the next submission and answers with the same refusal, which reads
   * as "it is broken" rather than "wait" — and the fastest way to be told you
   * are submitting too often is to submit again and find out.
   */
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setTimeout(() => setLockSeconds((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockSeconds]);

  function set(key: keyof typeof values) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lockSeconds > 0) return;
    setFormError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        /* A refusal that names a wait is a refusal to retry immediately. */
        const retryAfter = Number(response.headers.get("Retry-After") ?? "");
        if (response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0) {
          setLockSeconds(retryAfter);
        }
        setFormError(data.error ?? "Those credentials did not work.");
        setStatus("error");
        return;
      }

      /**
       * The cookie is set, but did the browser keep it? In an embedded frame a
       * refused cookie would otherwise bounce straight back to this form with no
       * explanation. Ask the server what it can see before navigating away.
       */
      const session = await fetch("/api/auth/session", { cache: "no-store" });
      if (!session.ok) {
        setFormError(
          "The credentials were accepted, but this browser did not keep the session cookie. Open the admin in its own browser tab and sign in there.",
        );
        setStatus("error");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setStatus("error");
      setFormError("Could not reach the server. Try again.");
    }
  }

  const locked = lockSeconds > 0;
  const minutes = Math.floor(lockSeconds / 60);
  const seconds = String(lockSeconds % 60).padStart(2, "0");

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="username"
        value={values.email}
        onChange={set("email")}
        placeholder="you@yourfirm.com"
        required
      />

      <TextField
        label="Password"
        type={reveal ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={set("password")}
        required
        trailing={
          <button
            type="button"
            onClick={() => setReveal((shown) => !shown)}
            aria-pressed={reveal}
            className="rounded-md px-2 py-1 font-mono text-label uppercase tracking-label text-fog transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {reveal ? "Hide" : "Show"}
          </button>
        }
      />

      <Button
        type="submit"
        size="lg"
        full
        disabled={status === "sending" || locked}
        iconRight={
          status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {status === "sending" ? "Signing in" : locked ? "Locked" : "Sign in"}
      </Button>

      {locked && (
        <p aria-live="polite" className="text-center text-label text-fog">
          Too many failed attempts from this connection. Sign-in unlocks in{" "}
          {minutes}:{seconds}.
        </p>
      )}
    </form>
  );
}
