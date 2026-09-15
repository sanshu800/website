import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { site } from "@/lib/content/marketing";
import { getChrome } from "@/lib/cms/content";
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
  return {
  metadataBase: new URL(site.url),
  title: {
    default: brand.seoTitle,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "professional services automation",
    "legal firm intake software",
    "accounting practice management",
    "client onboarding automation",
    "AI operations platform",
    "consulting firm CRM",
  ],
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
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  };
}

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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-small focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader brand={chrome.brand} header={chrome.header} />
        <main id="main">{children}</main>
        <SiteFooter brand={chrome.brand} footer={chrome.footer} />
      </body>
    </html>
  );
}
