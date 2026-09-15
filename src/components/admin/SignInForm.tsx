"use client";

import { useState } from "react";
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

  function set(key: keyof typeof values) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
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
        type="password"
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={set("password")}
        required
      />

      <Button
        type="submit"
        size="lg"
        full
        disabled={status === "sending"}
        iconRight={
          status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )
        }
      >
        {status === "sending" ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
