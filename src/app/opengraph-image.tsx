import { ImageResponse } from "next/og";

/**
 * The share card.
 *
 * Most referral traffic in every market arrives as a link pasted into WhatsApp,
 * LinkedIn, Slack or X, and until now the site promised a large image card
 * (`twitter:card: summary_large_image`) with no image to fill it — so every
 * share rendered as bare text, with the blog and guides being the pages most
 * likely to be shared.
 *
 * The design is the site's own: ink panel, paper type, one orange rule. Text is
 * sized for a thumbnail rather than for the full 1200×630, because that is how
 * it is almost always seen.
 */
export const alt = "Reygent AI — the work nobody wants to do, done by AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f7f7f7",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#f7f7f7",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ fontSize: "30px", letterSpacing: "-0.02em", fontWeight: 600 }}>Reygent AI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              width: "96px",
              height: "6px",
              background: "#ff6a2b",
              borderRadius: "999px",
            }}
          />
          <div
            style={{
              fontSize: "68px",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 600,
              maxWidth: "900px",
            }}
          >
            The work nobody wants to do, done by AI.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#a9a9a9",
            letterSpacing: "-0.01em",
          }}
        >
          An AI agency that builds the agents doing your team&apos;s repetitive work.
        </div>
      </div>
    ),
    size,
  );
}
