import { all, count, newId, one, run } from "@/lib/db";

/**
 * First-party measurement.
 *
 * The site could not learn anything from its own traffic: a visitor arrived, read
 * a page, filled in a form or didn't, and there was no record either way. This is
 * the smallest honest layer that fixes that, and it is deliberately not Google
 * Analytics:
 *
 *   - **No cookies, no third party.** Nothing is loaded from another origin, so
 *     there is no consent string to pass around and no data processor to list.
 *   - **No IP addresses, no user agents, no identifiers that survive a tab.**
 *     The session id lives in `sessionStorage`, which the browser clears when the
 *     tab closes. It counts visits; it cannot follow anyone.
 *   - **Nothing is sent until the visitor says yes.** The client checks the
 *     stored choice before every request (see `src/lib/track.ts`). "Essential
 *     only" means the feature is off, not "off except for the useful bits".
 *   - **Retention is bounded.** Rows older than 90 days are swept on write.
 *
 * What the numbers are for: knowing whether a page is read, whether a form is
 * started and abandoned, and whether real visitors are hitting errors. That is
 * it — this is an operator's instrument, not an advertising surface.
 */

export const EVENT_NAMES = [
  "page_view",
  "form_start",
  "enquiry_submitted",
  "newsletter_subscribed",
  "application_submitted",
  "exception",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

const RETENTION_DAYS = 90;

export function recordEvent(input: {
  name: EventName;
  path?: string | null;
  detail?: string | null;
  sessionId?: string | null;
}): void {
  run(
    "INSERT INTO events (id, name, path, detail, session_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      newId("evt"),
      input.name,
      input.path?.slice(0, 200) ?? null,
      input.detail?.slice(0, 200) ?? null,
      input.sessionId?.slice(0, 64) ?? null,
      new Date().toISOString(),
    ],
  );
  pruneEvents();
}

/** Bounded retention: anything past the window is deleted, not archived. */
export function pruneEvents(): void {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();
  run("DELETE FROM events WHERE created_at < ?", [cutoff]);
}

function sinceDays(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export type FunnelStep = { name: EventName; label: string; count: number; ofPrevious: number };

/**
 * The funnel, in the order a visitor walks it. Each step is reported against the
 * one before it, because "how many people who started a form finished it" is the
 * only number on this page that changes a decision.
 */
export function funnel(days = 30): FunnelStep[] {
  const from = sinceDays(days);
  const steps: { name: EventName; label: string }[] = [
    { name: "page_view", label: "Visited a page" },
    { name: "form_start", label: "Started a form" },
    { name: "enquiry_submitted", label: "Sent an enquiry" },
  ];

  let previous = 0;
  return steps.map((step) => {
    const total = count(
      "SELECT COUNT(*) AS n FROM events WHERE name = ? AND created_at >= ?",
      [step.name, from],
    );
    const ofPrevious = previous === 0 ? total : Math.round((total / previous) * 100);
    previous = total;
    return { ...step, count: total, ofPrevious };
  });
}

export function windowStats(days = 30): {
  pageViews: number;
  visits: number;
  enquiries: number;
  newsletter: number;
  errors: number;
} {
  const from = sinceDays(days);
  return {
    pageViews: count(
      "SELECT COUNT(*) AS n FROM events WHERE name = 'page_view' AND created_at >= ?",
      [from],
    ),
    visits: count(
      "SELECT COUNT(DISTINCT session_id) AS n FROM events WHERE created_at >= ? AND session_id IS NOT NULL",
      [from],
    ),
    enquiries: count("SELECT COUNT(*) AS n FROM submissions WHERE created_at >= ?", [from]),
    newsletter: count(
      "SELECT COUNT(*) AS n FROM submissions WHERE kind = 'newsletter' AND created_at >= ?",
      [from],
    ),
    errors: count(
      "SELECT COUNT(*) AS n FROM events WHERE name = 'exception' AND created_at >= ?",
      [from],
    ),
  };
}

export function topPages(days = 30, limit = 8): { path: string; views: number }[] {
  return all<{ path: string; views: number }>(
    `SELECT path, COUNT(*) AS views FROM events
     WHERE name = 'page_view' AND created_at >= ? AND path IS NOT NULL
     GROUP BY path ORDER BY views DESC LIMIT ?`,
    [sinceDays(days), limit],
  );
}

export function arrivalSources(days = 30, limit = 6): { source: string; visits: number }[] {
  return all<{ source: string; visits: number }>(
    `SELECT COALESCE(detail, 'direct') AS source, COUNT(*) AS visits FROM events
     WHERE name = 'page_view' AND created_at >= ?
     GROUP BY source ORDER BY visits DESC LIMIT ?`,
    [sinceDays(days), limit],
  );
}

export type CaughtException = {
  id: string;
  path: string | null;
  detail: string | null;
  created_at: string;
};

export function recentExceptions(limit = 8): CaughtException[] {
  return all<CaughtException>(
    `SELECT id, path, detail, created_at FROM events
     WHERE name = 'exception' ORDER BY created_at DESC LIMIT ?`,
    [limit],
  );
}

export function firstRecordedAt(): string | null {
  return one<{ at: string }>("SELECT MIN(created_at) AS at FROM events")?.at ?? null;
}
