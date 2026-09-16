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
      seoTitle: "Reygent AI — we take the manual work out of running your business",
      ogTitle: "Reygent AI — the routine work, handled",
      description: site.description,
      email: site.email,
      copyright: "All rights reserved.",
    },

    header: {
      /** The mega menu: groups with children, plus flat links. */
      nav: primaryNav,
      actions: {
        /* Deliberately one action. There is no customer sign-in on this site —
           the admin lives at /admin and is never linked from the public pages. */
        primary: { label: "Book a free audit", href: "/get-started" },
      },
    },

    footer: {
      columns: [
        { title: "Services", items: footerNav.services },
        { title: "Solutions", items: footerNav.solutions },
        { title: "Why us", items: footerNav.compare },
        { title: "Resources", items: footerNav.resources },
        { title: "Company", items: footerNav.company },
      ],
      actions: {
        primary: { label: "Book a free audit", href: "/get-started" },
        secondary: { label: "See how we work", href: "/how-we-work" },
      },
      builtFor: "Automation and AI for owner-run businesses",
      legalLinks: {
        privacy: { label: "Privacy", href: "/legal/privacy" },
        terms: { label: "Terms", href: "/legal/terms" },
        security: { label: "Security", href: "/security" },
      },
      disclosure:
        "Client names, marks and testimonials on this site are placeholders shaped to our market. They are not real customers. Replace before publishing.",
    },
  };
}

export type ChromeDoc = ReturnType<typeof chromeDoc>;
