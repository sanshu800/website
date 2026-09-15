"use client";

/**
 * Last-resort boundary.
 *
 * This one only runs when the *root layout itself* has failed, so it cannot
 * rely on the app's CSS having loaded and it must render its own `<html>` and
 * `<body>`. Everything here is therefore inline and framework-free — a visitor
 * who hits this has already had one thing go wrong, and a white screen on top
 * of that is the worst possible outcome.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#101010",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main style={{ maxWidth: "34rem", padding: "2rem" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b6b6b",
            }}
          >
            Something went wrong
          </p>
          <h1 style={{ margin: "1rem 0 0", fontSize: "1.75rem", lineHeight: 1.15 }}>
            This page did not load.
          </h1>
          <p style={{ margin: "0.75rem 0 0", fontSize: "1rem", lineHeight: 1.6, color: "#3a3a3a" }}>
            The problem is on our side, not yours. Nothing you entered was lost, and no enquiry is
            affected — email{" "}
            <a href="mailto:hello@reygent.ai" style={{ color: "#101010", textDecoration: "underline" }}>
              hello@reygent.ai
            </a>{" "}
            and a person will pick it up.
          </p>
          {error.digest ? (
            <p style={{ margin: "0.75rem 0 0", fontSize: "0.8125rem", color: "#6b6b6b" }}>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
          <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                border: "1px solid #0a0a0a",
                borderRadius: "0.5rem",
                background: "#0a0a0a",
                color: "#ffffff",
                padding: "0.75rem 1.25rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the root fallback stays
                dependency-free on purpose: if the layout has already crashed, the less it imports the better. */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #8c8c8c",
                borderRadius: "0.5rem",
                background: "#ffffff",
                color: "#0a0a0a",
                padding: "0.75rem 1.25rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back to the homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
