"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  arrivalSource,
  readConsent,
  track,
  writeConsent,
  type Consent,
} from "@/lib/track";

/**
 * The consent bar, and the two things that only run after a yes.
 *
 * The bar is small and honest because the alternative — a modal that dims the
 * page and lists four hundred vendors — is theatre for a site that loads nothing
 * from anyone else. It offers a real choice ("essential only" genuinely turns
 * measurement off) and it does not nag once the visitor has chosen.
 *
 * The stored choice is read through `useSyncExternalStore` rather than an effect:
 * the server snapshot is "unset", so the bar is absent from the server-rendered
 * HTML (no flash for visitors who already answered, nothing for crawlers to
 * index) and appears only once the browser value is genuinely known — with no
 * hydration mismatch, because React uses that same server snapshot for the first
 * client render.
 */

const SERVER_SNAPSHOT: Consent = "unset";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function Measurement() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribe, readConsent, () => SERVER_SNAPSHOT);

  /* A page view per navigation, carrying the arrival source on the first one. */
  useEffect(() => {
    if (consent !== "granted") return;
    track("page_view", arrivalSource());
  }, [consent, pathname]);

  /* The half of error reporting a server log cannot see: a failed interaction, a
     component that threw after hydration. */
  useEffect(() => {
    if (consent !== "granted") return;

    const onError = (event: ErrorEvent) => {
      track("exception", `${event.message}`.slice(0, 180));
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { message?: string } | undefined;
      track("exception", `unhandled rejection: ${reason?.message ?? "unknown"}`);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [consent]);

  if (consent !== "unset") return null;

  return (
    <div
      role="region"
      aria-label="Measurement"
      className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-line bg-paper p-4 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md"
    >
      <p className="text-[0.8125rem] font-medium text-ink">Can we measure how the site is used?</p>
      <p className="mt-1.5 text-[0.75rem] leading-relaxed text-fog">
        First-party only: page views, where you arrived from and errors, stored on our own server.
        No cookies, no third-party scripts, no IP addresses, nothing that follows you off this
        site.{" "}
        <Link href="/legal/privacy" className="text-accent hover:underline">
          Privacy notice
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="inline-flex h-9 items-center rounded-lg bg-night px-3.5 text-[0.8125rem] font-medium text-on-accent transition-colors pointer-coarse:min-h-11 hover:bg-accent-2"
        >
          Allow measurement
        </button>
        <button
          type="button"
          onClick={() => writeConsent("essential")}
          className="inline-flex h-9 items-center rounded-lg border border-line px-3.5 text-[0.8125rem] font-medium text-fg-2 transition-colors pointer-coarse:min-h-11 hover:border-line-strong hover:text-ink"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
