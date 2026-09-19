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
  const row = all<SubmissionRow>(`SELECT * FROM submissions WHERE id = ?`, [id])[0];
  if (row) forwardToCrm(row);
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
  /** null = no webhook configured; otherwise pending | sent | failed. */
  crm_status: string | null;
  crm_attempted_at: string | null;
  crm_error: string | null;
};

/**
 * Leads in the last `days`, for the nav badge.
 *
 * Counts assessment and contact enquiries only — a newsletter subscription is
 * not somebody waiting on a reply, and a badge that includes them stops meaning
 * "there is a person to answer".
 */
export function recentLeadCount(days = 7): number {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  return count(
    `SELECT COUNT(*) AS n FROM submissions WHERE kind IN ('audit', 'contact') AND created_at >= ?`,
    [since],
  );
}

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

/* ------------------------------------------------------------------ */
/* CRM hand-off                                                       */
/* ------------------------------------------------------------------ */

/** Attempts before giving up. One retry covers a cold or briefly-upset endpoint. */
const CRM_ATTEMPTS = 2;
/** A slow CRM must not hold a socket open indefinitely. */
const CRM_TIMEOUT_MS = 8000;

/**
 * Which submission kinds are worth waking the sales team for.
 *
 * A newsletter signup is not a lead and a job application is not a lead, so
 * neither goes to the CRM by default — the inbox on `/admin/enquiries` still
 * keeps them. Set `CRM_WEBHOOK_KINDS=all` to forward everything, or name the
 * kinds you want (`audit,contact,careers`).
 */
function crmKinds(): string[] {
  const raw = process.env.CRM_WEBHOOK_KINDS?.trim();
  if (!raw) return ["audit", "contact"];
  if (raw.toLowerCase() === "all") return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The body a CRM or automation tool receives.
 *
 * `fields` is the validated payload as an object — the qualification answers
 * (industry, size, budget, message) arrive as keys, not as a JSON string that
 * the receiving side has to parse twice. The local row stays the source of
 * truth: if this call fails, the lead is still on `/admin/enquiries` and the
 * failure is recorded on the row rather than swallowed.
 */
export type CrmPayload = {
  id: string;
  kind: string;
  receivedAt: string;
  name: string | null;
  email: string | null;
  company: string | null;
  fields: Record<string, unknown>;
};

function setCrmStatus(id: string, status: string, error?: string): void {
  run(`UPDATE submissions SET crm_status = ?, crm_attempted_at = ?, crm_error = ? WHERE id = ?`, [
    status,
    new Date().toISOString(),
    error ?? null,
    id,
  ]);
}

async function deliver(payload: CrmPayload, url: string, token?: string): Promise<void> {
  let lastError = "endpoint did not accept the delivery";

  for (let attempt = 1; attempt <= CRM_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
      });
      if (response.ok) {
        setCrmStatus(payload.id, "sent");
        return;
      }
      lastError = `endpoint replied ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "request failed";
    }
    if (attempt < CRM_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }

  setCrmStatus(payload.id, "failed", lastError);
}

/**
 * Mirrors a submission to the CRM, off the request path.
 *
 * Never awaited and never throws: a form post must succeed even when the
 * downstream tool is down. What changes is that the outcome is now *recorded*
 * — `crm_status` is `sent` or `failed` on the row, and both are shown on
 * `/admin/enquiries`, so a broken webhook is a thing you can see rather than a
 * thing you find out about from a customer who never got a reply.
 */
function forwardToCrm(row: SubmissionRow): void {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const kinds = crmKinds();
  if (kinds.length > 0 && !kinds.includes(row.kind.toLowerCase())) return;

  let fields: Record<string, unknown> = {};
  try {
    fields = JSON.parse(row.payload) as Record<string, unknown>;
  } catch {
    fields = { raw: row.payload };
  }

  setCrmStatus(row.id, "pending");
  const payload: CrmPayload = {
    id: row.id,
    kind: row.kind,
    receivedAt: row.created_at,
    name: row.name,
    email: row.email,
    company: row.company,
    fields,
  };
  void deliver(payload, url, process.env.CRM_WEBHOOK_TOKEN);
}
