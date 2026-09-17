"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { track } from "@/lib/track";

/**
 * Route-level boundary.
 *
 * Renders inside the root layout, so the header, footer and the visitor's
 * context survive: the failure looks like one section going wrong rather than
 * the site disappearing. Retry is the primary action because most of these are
 * transient (a dropped connection mid-navigation, a cold database read).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure visible in the server/edge log rather than swallowing it.
    console.error("Unhandled route error", { message: error.message, digest: error.digest });
    /* And record it where the operator actually looks — the server log of a
       failed render is easy to miss when nobody is watching it. A digest is a
       hash, not the message, so nothing a visitor was working on travels. */
    track("exception", `route error ${error.digest ?? "without digest"}`);
  }, [error]);

  return (
    <section className="border-b border-line bg-paper pb-20 pt-32 sm:pt-36">
      <Container width="wide">
        <h1 className="max-w-[36rem] text-display-xl text-ink">
          That did not load. It is us, not you.
        </h1>
        <p className="mt-5 max-w-[40rem] text-lead text-fog">
          Nothing you typed has been lost, and no enquiry was dropped. Try again — and if it keeps
          happening, tell us and we will look at it properly.
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-eyebrow text-fog">
            Reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button type="button" onClick={reset} size="lg">
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" size="lg">
            Report a problem
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
