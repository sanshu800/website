import { footerNav, primaryNav, site } from "@/lib/content/marketing";

/**
 * Default copy for the site chrome: the header navigation, the footer and the
 * brand strings that appear in metadata.
 *
 * The nav trees themselves are the content — labels, hrefs and the blurbs in
 * the mega menu are all editable, which is the difference between a CMS that
 * covers a site and one that covers most of it.
 */
export function chromeDoc() {
  return {
    brand: {
      name: site.name,
      tagline: site.tagline,
      /** Used as the default page title and in social cards. */
      seoTitle: "Reygent — The AI-native operations platform for professional-service firms",
      ogTitle: "Reygent — The AI-native operations platform",
      description: site.description,
      email: site.email,
      copyright: "All rights reserved.",
    },

    header: {
      /** The mega menu: groups with children, plus flat links. */
      nav: primaryNav,
      actions: {
        signIn: { label: "Log in", href: "/login" },
        primary: { label: "Get started", href: "/get-started" },
      },
    },

    footer: {
      columns: [
        { title: "Product", items: footerNav.product },
        { title: "Solutions", items: footerNav.solutions },
        { title: "Compare", items: footerNav.compare },
        { title: "Resources", items: footerNav.resources },
        { title: "Company", items: footerNav.company },
      ],
      actions: {
        primary: { label: "Start free trial", href: "/get-started" },
        secondary: { label: "Book a demo", href: "/demo" },
      },
      builtFor: "Built for professional-service firms",
      legalLinks: {
        privacy: { label: "Privacy", href: "/legal/privacy" },
        terms: { label: "Terms", href: "/legal/terms" },
        security: { label: "Security", href: "/security" },
      },
      disclosure:
        "Client names, marks and testimonials shown on this site are placeholders shaped to our target market and do not represent real customers. Replace before publishing.",
    },
  };
}

export type ChromeDoc = ReturnType<typeof chromeDoc>;
