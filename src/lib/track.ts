"use client";

import type { EventName } from "@/lib/events";

/**
 * The client half of first-party measurement.
 *
 * Three rules, in order of importance:
 *
 *  1. **Nothing leaves the browser without consent.** `track()` returns early
 *     unless the visitor has actively allowed measurement. "Essential only"
 *     stores the refusal and stops here.
 *  2. **Nothing identifies anyone.** The session id is random and lives in
 *     `sessionStorage`, so it dies with the tab. Referrers are reduced to a host
 *     name, never a full URL with query strings.
 *  3. **Nothing is allowed to break the page.** Every call is fire-and-forget
 *     with `keepalive`, wrapped so a blocked or failed request is invisible.
 */

export const CONSENT_EVENT = "reygent:consent";

const CONSENT_KEY = "reygent.measurement";
const SESSION_KEY = "reygent.visit";

/**
 * `unresolved` exists only on the server: it means "the browser has not told us
 * yet". The consent bar renders for `unset` and hides for anything else, so
 * starting from `unresolved` keeps it out of the server HTML and off the screen
 * of a visitor who has already answered — the bar appears a moment after
 * hydration for first-time visitors instead of flashing at everybody.
 */
export type Consent = "granted" | "essential" | "unset" | "unresolved";

export function readConsent(): Consent {
  if (typeof window === "undefined") return "unset";
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "essential" ? stored : "unset";
  } catch {
    // Private mode or blocked storage: treat as no consent rather than guess.
    return "unset";
  }
}

export function writeConsent(value: Exclude<Consent, "unset">): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* nothing to do — the choice simply will not persist */
  }
  // Let the banner and any listener react without a reload.
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4);
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return "unknown";
  }
}

/** The host a visitor arrived from, or "direct". Query strings are dropped. */
export function arrivalSource(): string {
  try {
    const referrer = document.referrer;
    if (!referrer) return "direct";
    const host = new URL(referrer).hostname;
    if (host === window.location.hostname) return "internal";
    return host;
  } catch {
    return "direct";
  }
}

export function track(name: EventName, detail?: string): void {
  if (readConsent() !== "granted") return;
  const body = JSON.stringify({
    name,
    path: window.location.pathname,
    detail: detail?.slice(0, 200),
    session: sessionId(),
  });

  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* measurement must never surface an error to a visitor */
    });
  } catch {
    /* same */
  }
}
