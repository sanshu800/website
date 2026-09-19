/* eslint-disable no-console */
/**
 * Deploy guard: refuse to build for a public domain while the site is still
 * showing invented clients and testimonials.
 *
 *   node --experimental-strip-types scripts/check-placeholders.ts
 *
 * The footer discloses the placeholder names, and the README says so in plain
 * words — but a disclosure is a mitigation, not a fix, and "we told them in the
 * footer" is not what you want a first customer to read. This script is the
 * version that cannot be forgotten: it runs before `next build`, and if the build
 * is aimed at a real host it fails while the flags are still on.
 *
 * It is deliberately quiet on a developer's machine. `REYGENT_LIVE_HOST` is the
 * signal that a build is for the public internet; without it there is nothing to
 * protect against, so the check passes and says why. Vercel sets `VERCEL_URL`
 * automatically, which means the first deploy of this repo fails until the
 * placeholders are swapped — that is the intended behaviour, not a bug.
 *
 * To ship placeholders on purpose (a staging site on a real domain, say), set
 * `ALLOW_PLACEHOLDERS=1` and the guard stands down.
 */
import { PLACEHOLDERS } from "../src/lib/content/marketing.ts";

const liveHost = process.env.REYGENT_LIVE_HOST?.trim() || process.env.VERCEL_URL?.trim() || "";

const isLocal = (host: string) =>
  host === "" ||
  host.startsWith("localhost") ||
  host.startsWith("127.0.0.1") ||
  host.startsWith("0.0.0.0") ||
  host.endsWith(".local") ||
  host.endsWith(".e2b.app") ||
  host.endsWith(".arena.ai");

if (process.env.ALLOW_PLACEHOLDERS === "1") {
  console.log("· placeholder guard: stood down by ALLOW_PLACEHOLDERS=1");
  process.exit(0);
}

if (!liveHost || isLocal(liveHost)) {
  console.log(
    `· placeholder guard: no public host configured (REYGENT_LIVE_HOST unset or local), so there is nothing to protect. Set it to your domain to arm this check.`,
  );
  process.exit(0);
}

const stillPlaceholder = Object.entries(PLACEHOLDERS)
  .filter(([, isPlaceholder]) => isPlaceholder)
  .map(([name]) => name);

if (stillPlaceholder.length === 0) {
  console.log(`· placeholder guard: clean for ${liveHost}`);
  process.exit(0);
}

console.error(`
✗ Refusing to build for ${liveHost} with placeholder content still in the site.

  Still flagged: ${stillPlaceholder.join(", ")}

  The footer of every page currently tells visitors that the client names, marks
  and testimonials are invented. That is honest and it is not shippable.

  Two ways forward:

    1. Swap them. Real clients go in src/lib/content/marketing.ts (and the
       testimonial wall), then set:

         PLACEHOLDERS = { clients: false, testimonials: false }

    2. Ship anyway, knowingly, with ALLOW_PLACEHOLDERS=1 — for a staging site on
       a real domain, not for a launch.
`);
process.exit(1);
