"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CheckboxField, FormError, TextField } from "./Fields";

/** Shared shell: one column, product summary alongside, consistent heading. */
export function AuthShell({
  eyebrow,
  title,
  summary,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center border-b border-line bg-paper pb-16 pt-28 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(10,10,11,0.07),transparent_72%)]"
      />
      <div className="relative mx-auto w-full max-w-[var(--container-narrow)] px-5 sm:px-6">
        <p className="font-mono text-eyebrow uppercase text-accent">{eyebrow}</p>
        <h1 className="mt-5 text-display-l text-ink">{title}</h1>
        <p className="mt-4 text-lead text-fog">{summary}</p>
        <div className="mt-10 rounded-2xl border border-line p-7 sm:p-8">{children}</div>
        <div className="mt-6 text-center text-micro text-fog">{footer}</div>
      </div>
    </section>
  );
}

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function set(key: keyof typeof values) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFields({});
    setFormError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setFields(data.fields ?? {});
        setFormError(data.fields ? "Check the highlighted fields." : (data.error ?? "Sign-in failed."));
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

  function useDemo() {
    setValues({ email: "demo@reygent.ai", password: "demo1234" });
    setFormError(null);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="demo@reygent.ai"
        value={values.email}
        onChange={set("email")}
        error={fields.email}
        required
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        onChange={set("password")}
        error={fields.password}
        required
      />

      <div className="flex items-center justify-between gap-4">
        <CheckboxField label="Keep me signed in for 30 days" defaultChecked />
        <Link href="/contact" className="text-[0.75rem] text-accent underline underline-offset-2">
          Forgotten password?
        </Link>
      </div>

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

      <div className="rounded-xl border border-line bg-mist px-4 py-3.5">
        <p className="text-[0.75rem] text-fog">
          Demonstration account:{" "}
          <span className="font-mono text-ink">demo@reygent.ai</span> /{" "}
          <span className="font-mono text-ink">demo1234</span>
        </p>
        <button
          type="button"
          onClick={useDemo}
          className="mt-2 text-[0.75rem] font-medium text-accent underline underline-offset-2"
        >
          Fill the demo credentials
        </button>
      </div>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    orgName: "",
    password: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function set(key: keyof typeof values) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
  }

  const strength = passwordStrength(values.password);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFields({});
    setFormError(null);

    if (!acceptTerms) {
      setFormError("Please accept the terms to create an account.");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, acceptTerms: true }),
      });
      const data = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setFields(data.fields ?? {});
        setFormError(
          data.fields ? "Check the highlighted fields." : (data.error ?? "Sign-up failed."),
        );
        setStatus("error");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setFormError("Could not reach the server. Try again.");
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && <FormError>{formError}</FormError>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Your name"
          autoComplete="name"
          placeholder="Priya Raman"
          value={values.name}
          onChange={set("name")}
          error={fields.name}
          required
        />
        <TextField
          label="Firm name"
          autoComplete="organization"
          placeholder="Ramsey & Doyle"
          value={values.orgName}
          onChange={set("orgName")}
          error={fields.orgName}
          required
        />
      </div>

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

      <div>
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 10 characters"
          value={values.password}
          onChange={set("password")}
          error={fields.password}
          required
        />
        {values.password.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-1.5 flex-1 gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((segment) => (
                <span
                  key={segment}
                  className={`h-full flex-1 rounded-full ${
                    segment < strength.score
                      ? strength.score >= 4
                        ? "bg-jade"
                        : strength.score >= 3
                          ? "bg-caution"
                          : "bg-danger"
                      : "bg-mist-2"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[0.625rem] uppercase tracking-wide text-fog">
              {strength.label}
            </span>
          </div>
        )}
      </div>

      <CheckboxField
        checked={acceptTerms}
        onChange={(event) => setAcceptTerms(event.target.checked)}
        label={
          <>
            I agree to the{" "}
            <Link href="/legal/terms" className="text-accent underline underline-offset-2">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-accent underline underline-offset-2">
              privacy notice
            </Link>
            .
          </>
        }
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
        {status === "sending" ? "Creating account" : "Create account"}
      </Button>

      <p className="text-[0.6875rem] leading-relaxed text-fog-2">
        Passwords are hashed with scrypt before storage. Sessions are opaque tokens
        stored as SHA-256 hashes and sent in an httpOnly cookie. No third-party
        identity provider is involved.
      </p>
    </form>
  );
}

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={logout}
      disabled={busy}
      className={className}
    >
      {busy ? "Signing out" : "Sign out"}
    </Button>
  );
}

function passwordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const capped = Math.min(score, 4);
  const labels = ["Too short", "Weak", "Fair", "Strong", "Excellent"] as const;
  return { score: capped, label: labels[capped] ?? "Weak" };
}
