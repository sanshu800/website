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

const email = z.string().trim().email().max(200).toLowerCase();

export const newsletterSchema = z.object({
  email,
  source: z.string().max(80).optional(),
  role: z.string().max(80).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  company: z.string().trim().max(160).optional(),
  topic: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(4000),
});

/** The audit request on `/get-started` — the only funnel a service business needs. */
export const auditSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  company: z.string().trim().min(2).max(160),
  teamSize: z.string().max(40).optional(),
  sector: z.string().max(60).optional(),
  systems: z.array(z.string().max(60)).max(12).optional(),
  preferredTime: z.string().max(20).optional(),
  notes: z.string().trim().max(2000).optional(),
});

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
