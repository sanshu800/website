import { getChrome, getPricing, getServices } from "@/lib/cms/content";
import { site } from "@/lib/content/marketing";

/**
 * Structured data.
 *
 * The site had none, which meant Google had to infer what this business is,
 * what it sells and where it operates from prose alone. Schema is how you stop
 * it guessing: an organisation node for the agency itself, a node per service,
 * and the real FAQ set marked up so an answer can surface directly.
 *
 * Two rules kept this honest:
 *
 *  - It is generated from the same CMS documents the pages render, so an edited
 *    service name or FAQ appears in the markup as well as in the copy — no
 *    second, drifting description of the business.
 *  - Nothing is claimed that the site does not already say out loud. No ratings,
 *    no client names, no founding date, no address. Incomplete schema is
 *    harmless; invented schema is a liability.
 */

type Node = Record<string, unknown>;

const ORG_ID = `${site.url}#organization`;
const SITE_ID = `${site.url}#website`;

/** The agency itself. One node, referenced by `@id` from everything else. */
export function organizationSchema(): Node {
  const brand = getChrome().brand;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: brand.name,
    url: site.url,
    description: brand.description,
    email: site.email,
    telephone: site.phone,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/apple-icon`,
      width: 180,
      height: 180,
    },
    image: `${site.url}/opengraph-image`,
    slogan: site.tagline,
    /* Sold worldwide, delivered on UK hours — the same promise the site makes
       in copy. `areaServed` is a claim about reach, not a registered address. */
    areaServed: { "@type": "Place", name: "Worldwide" },
    knowsAbout: [
      "business process automation",
      "AI assistants for customer enquiries",
      "document processing",
      "operations reporting",
      "AI adoption for small business",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        telephone: site.phone,
        areaServed: "Worldwide",
        availableLanguage: ["en"],
      },
    ],
  };
}

/** The site itself, so the organisation is the publisher of every page. */
export function websiteSchema(): Node {
  const brand = getChrome().brand;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: brand.name,
    url: site.url,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** One service, for `/services/<slug>`. */
export function serviceSchema(item: {
  slug: string;
  name: string;
  summary: string;
}): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.name,
    serviceType: item.name,
    description: item.summary,
    url: `${site.url}/services/${item.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Place", name: "Worldwide" },
  };
}

/** The service range, for `/services`. */
export function serviceListSchema(): Node {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services",
    itemListElement: getServices().items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${site.url}/services/${item.slug}`,
    })),
  };
}

/**
 * The engagement FAQ. Generated from the same array the page renders, so the
 * marked-up answer and the visible answer can never disagree — which is the one
 * way FAQ schema actually gets you in trouble.
 */
export function faqSchema(): Node {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getPricing().faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** An article, for `/blog/<slug>`. */
export function articleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: { name: string; role: string };
}): Node {
  const url = `${site.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** The trail a reader actually walked, for the detail pages under a hub. */
export function breadcrumbSchema(trail: { name: string; path: string }[]): Node {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}
