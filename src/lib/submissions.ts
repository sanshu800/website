import "server-only";
import { z } from "zod";
import { newId, run, all, count } from "./db";

/**
 * Inbound form capture.
 *
 * Every public form on the marketing site lands in one table with a `kind`
 * discriminator, so an operator can read all of it in the dashboard without a
 * CRM. Swapping in HubSpot / Pipedrive / a webhook is a change to this file —
 * `forwardToCrm` below is the seam.
 */

const email = z
  .string({ error: "Which email should we reply to?" })
  .trim()
  .email({ error: "That email address does not look right" })
  .max(200)
  .toLowerCase();

export const newsletterSchema = z.object({
  email,
  source: z.string().max(80).optional(),
  role: z.string().max(80).optional(),
});

/**
 * The qualification form used by both lead paths — the audit CTA on
 * `/get-started` and the contact page.
 *
 * Selects are enums rather than free text: the value has to be one we can route
 * on, and the browser sends the slug we shipped rather than a label somebody
 * retyped. `kind` says which funnel produced the row, and is not user-editable
 * copy — it is set by the form.
 */
export const enquirySchema = z.object({
  /* One field, not two. Splitting a name into first and last is a Western
     convention: plenty of visitors have a single name, or put the family name
     first, and a required second box turns that into a validation error. */
  fullName: z
    .string({ error: "Your name, please" })
    .trim()
    .min(2, { error: "Your name, please" })
    .max(120),
  email,
  company: z
    .string({ error: "Which company are you with?" })
    .trim()
    .min(2, { error: "Which company are you with?" })
    .max(160),
  /* The enum messages are the ones a person sees under the field, so they are
     written as instructions rather than as schema diagnostics. */
  companySize: z.enum(["1-5", "6-15", "16-40", "41-120", "120-plus"], {
    error: "Choose a company size",
  }),
  revenue: z.enum(
    [
      "pre-revenue",
      "under-250k",
      "250k-1m",
      "1m-5m",
      "5m-20m",
      "20m-plus",
      "undisclosed",
    ],
    { error: "Choose a revenue range" },
  ),
  title: z.enum(["owner", "operations", "finance", "sales", "service", "it", "other"], {
    error: "Choose your role",
  }),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.enum(
    ["audit", "project", "client", "partnership", "security", "careers", "other"],
    { error: "Choose a topic" },
  ),
  budget: z.enum(["not-sure", "under-5k", "5k-15k", "15k-50k", "50k-plus", "discuss"], {
    error: "Choose a budget range, or pick “prefer to discuss”",
  }),
  message: z
    .string({ error: "A sentence or two, so the first reply is useful" })
    .trim()
    .min(10, { error: "A sentence or two, so the first reply is useful" })
    .max(4000),
  referral: z.string().trim().max(120).optional().or(z.literal("")),
  /** Which funnel this came from. Defaults to the contact page. */
  kind: z.enum(["audit", "contact"]).default("contact"),
});

/** The row is stored under one display name, so the inbox reads like a person. */
export function contactDisplayName(data: { fullName: string }): string {
  return data.fullName.trim();
}

export const careersSchema = z.object({
  role: z.string().trim().max(80),
  roleTitle: z.string().trim().max(160),
  name: z.string().trim().min(2).max(120),
  email,
  portfolio: z.string().trim().max(300).optional(),
  note: z.string().trim().max(4000).optional(),
});

export type SubmissionKind =
  | "newsletter"
  | "contact"
  | "audit"
  | "careers";

export function recordSubmission(input: {
  kind: SubmissionKind;
  name?: string;
  email?: string;
  company?: string;
  payload: Record<string, unknown>;
}): string {
  const id = newId("sub");
  run(
    `INSERT INTO submissions (id, kind, name, email, company, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.kind,
      input.name ?? null,
      input.email ?? null,
      input.company ?? null,
      JSON.stringify(input.payload),
      new Date().toISOString(),
    ],
  );
  forwardToCrm(id);
  return id;
}

export type SubmissionRow = {
  id: string;
  kind: string;
  name: string | null;
  email: string | null;
  company: string | null;
  payload: string;
  created_at: string;
};

export function listSubmissions(kind?: string): SubmissionRow[] {
  return kind
    ? all<SubmissionRow>(
        `SELECT * FROM submissions WHERE kind = ? ORDER BY created_at DESC`,
        [kind],
      )
    : all<SubmissionRow>(`SELECT * FROM submissions ORDER BY created_at DESC`);
}

export function submissionCount(kind?: string): number {
  return kind
    ? count(`SELECT COUNT(*) AS n FROM submissions WHERE kind = ?`, [kind])
    : count(`SELECT COUNT(*) AS n FROM submissions`);
}

/**
 * CRM hand-off seam.
 *
 * With `CRM_WEBHOOK_URL` set, every submission is mirrored to that endpoint.
 * Without it, the record still exists locally — nothing is lost, and the demo
 * does not pretend to have sent an email it could not send.
 */
function forwardToCrm(id: string): void {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const row = all<SubmissionRow>(`SELECT * FROM submissions WHERE id = ?`, [id])[0];
  if (!row) return;

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(row),
  }).catch(() => {
    /* Never fail a form post because a downstream CRM is unreachable. */
  });
}
