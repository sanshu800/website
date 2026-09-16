import type { MetadataRoute } from "next";
import { site } from "@/lib/content/marketing";

/**
 * Web app manifest. Nothing here makes the site installable as a full app —
 * there is no offline story and no reason to pretend otherwise — but it does
 * stop an Android or iOS home-screen shortcut from appearing as a blank tile,
 * and it gives the browser a theme colour for the toolbar.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reygent AI — the routine work, handled",
    short_name: "Reygent AI",
    description:
      "We take the routine work off owner-run businesses: enquiries, paperwork, admin between systems and reporting. We build it, connect it to the tools you already use, and keep it running.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    /* Matches the viewport's `themeColor`: one theme, stated once in each place
       the browser looks for it. A black toolbar over a white page was an old
       inconsistency, not a decision. */
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    ...(site.url ? { scope: "/" } : {}),
  };
}
