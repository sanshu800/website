import { ImageResponse } from "next/og";

/**
 * The share card.
 *
 * Most referral traffic in every market arrives as a link pasted into WhatsApp,
 * LinkedIn, Slack or X, and this site promises a large image card
 * (`twitter:card: summary_large_image`). One renderer, two routes: the file
 * convention in `app/opengraph-image.tsx` serves the homepage, and `/og` gives
 * every other page a stable URL to point at. Both must produce the same image,
 * so neither owns the artwork — this module does.
 *
 * The design is the site's own: ink panel, paper type, one orange rule. Text is
 * sized for a thumbnail rather than for the full 1200×630, because that is how
 * it is almost always seen.
 *
 * Deliberately not per-page. A card carrying the page's own headline would have
 * to be rendered per request or prerendered 51 times, and it would put every
 * page title into an image where none of them can be edited from the admin. One
 * card, one URL, cached hard.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Reygent AI — the work nobody wants to do, done by AI";

export function shareCard() {
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
          We take the routine work off owner-run businesses: enquiries,
          paperwork, admin between systems and reporting.
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
