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
    name: "Reygent AI — AI agency",
    short_name: "Reygent AI",
    description:
      "An AI agency for business owners. We find the work worth automating, build the agents that do it, and keep them running.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    ...(site.url ? { scope: "/" } : {}),
  };
}
