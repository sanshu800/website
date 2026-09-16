import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { site } from "@/lib/content/marketing";
import { getChrome } from "@/lib/cms/content";
import { fitForSearch } from "@/lib/cms/seo";
import { Measurement } from "@/components/analytics/Measurement";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

/**
 * Type is self-hosted (SIL OFL, licences in src/assets/fonts): no build-time
 * network dependency, no third-party request from the visitor's browser, and
 * metric-matched fallbacks so nothing shifts on swap.
 */
const geist = localFont({
  src: "../assets/fonts/geist-latin-variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const spaceGrotesk = localFont({
  src: "../assets/fonts/space-grotesk-latin-variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-space-grotesk",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "../assets/fonts/geist-mono-latin-variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

/**
 * The header, footer and social metadata all read the `chrome` content
 * document, so nav labels, the footer and the site description are editable
 * from the admin panel. The canonical host and locale stay in code — those are
 * deployment facts, not copy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { brand } = getChrome();
  /*
   * The site-wide description is also the homepage's, and it is written for a
   * person rather than for a result listing — two sentences where a result shows
   * about 160 characters. It goes through the same fitter the per-page copy does,
   * so the homepage gets a whole sentence instead of a cut-off one. The full text
   * still reaches `Organization` structured data, where there is no limit.
   */
  return {
  metadataBase: new URL(site.url),
  title: {
    default: brand.seoTitle,
    template: `%s — ${brand.name}`,
  },
  description: fitForSearch(brand.description, 160),
  applicationName: brand.name,
  /* No `keywords` tag: Google has ignored it for years, and the list still
     advertised the retired "AI operations platform" positioning. */
  authors: [{ name: brand.name }],
  creator: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: brand.name,
    title: brand.ogTitle,
    description: brand.description,
  },
  twitter: {
    card: "summary_large_image",
    title: brand.ogTitle,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  };
}

/**
 * The browser's own chrome — the part of the page a stylesheet does not draw:
 * form controls, scrollbars, the mobile toolbar.
 *
 * `colorScheme: "light"` is deliberate and load-bearing. Without it, a visitor
 * whose operating system is set to dark gets *browser-drawn* dark furniture on a
 * light page: dark `<select>` menus, a dark scrollbar, dark autofill. Declaring
 * light is what keeps native controls matching the design when the site itself
 * has one theme.
 */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const chrome = getChrome();

  return (
    <html
      lang="en"
      className={`${geist.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-night focus:px-4 focus:py-2 focus:text-small focus:text-white"
        >
          Skip to content
        </a>
        {/* Who the business is and what this site is, stated once for every page. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SiteHeader brand={chrome.brand} header={chrome.header} />
        <main id="main">{children}</main>
        <SiteFooter brand={chrome.brand} footer={chrome.footer} />
        {/* Asks once, then measures only if the visitor allowed it. */}
        <Measurement />
      </body>
    </html>
  );
}
