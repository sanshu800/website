/**
 * Per-page search and sharing metadata.
 *
 * Until now every page hardcoded its own `<title>` and description in
 * `generateMetadata`, which meant the one thing a business owner most often
 * wants to change — how the page reads in Google and in a WhatsApp preview —
 * was the one thing the admin panel could not touch.
 *
 * The values here are the shipped defaults, extracted from the pages
 * themselves, so this table starts out identical to what the site already
 * serves. `withSeo()` (in `src/lib/cms/seo.ts`) looks up the row for a route and
 * lets the admin override it; a blank field falls back to the page's own copy,
 * which keeps the built-in text as a safety net rather than making an empty
 * field render an empty title.
 *
 * `ogImage` is deliberately a plain path (`/uploads/card.png`) rather than an
 * upload widget: the media library already writes files into `public/`, and the
 * admin's upload panel shows the path to paste here.
 */

export type SeoEntry = {
  slug: string;
  title: string;
  description: string;
  ogImage: string;
};

export const seoDefaults: SeoEntry[] = [
  { slug: "about", title: "About", description: "Reygent AI takes the routine work off owner-run businesses: enquiries, paperwork, admin between systems and reporting. We build it, we run it, and you own it.", ogImage: "" },
  { slug: "blog", title: "Blog", description: "Practical writing for business owners: which processes are worth automating, what it costs, what breaks, and where AI genuinely helps.", ogImage: "" },
  { slug: "build-log", title: "Build log", description: "Real automations that went into production for clients, with what each one replaced and what it taught us.", ogImage: "" },
  { slug: "careers", title: "Careers", description: "Open roles at Reygent AI across engineering, product, design, operations research and go-to-market.", ogImage: "" },
  { slug: "compare", title: "Compare", description: "How Reygent AI compares to spreadsheets, a traditional CRM, separate point tools, hiring an operations manager, building in-house, and doing nothing.", ogImage: "" },
  { slug: "contact", title: "Contact", description: "Tell us what is eating your team's time and what it costs you. A person replies to every enquiry within one working day.", ogImage: "" },
  { slug: "customers", title: "Customers", description: "Real automations, what they replaced and what changed — written up honestly, including the parts that were harder than expected.", ogImage: "" },
  { slug: "get-started", title: "Book a free audit", description: "Thirty minutes with us. Bring one process that wastes your team's time; we map it, say honestly whether it is worth automating, and tell you what it would take.", ogImage: "" },
  { slug: "guides", title: "Guides & playbooks", description: "Downloadable implementation plans, scorecards and templates for professional-services operations teams.", ogImage: "" },
  { slug: "how-we-work", title: "How we work", description: "How a Reygent AI engagement runs: an audit of what is worth automating, a written blueprint, a fixed-price build, then a retainer that keeps it working.", ogImage: "" },
  { slug: "integrations", title: "Integrations", description: "The CRM, inbox, calendar, accounting, telephony and industry systems we connect to — so the work happens inside the tools your business already uses.", ogImage: "" },
  { slug: "newsletter", title: "Newsletter", description: "The Operations Briefing — one email a month on professional-services operations, with a new playbook each issue.", ogImage: "" },
  { slug: "partners", title: "Partner programme", description: "Introduce the businesses you already advise, share in the work that follows, and keep the relationship. Contractual, not a promise.", ogImage: "" },
  { slug: "pricing", title: "Engagements & pricing", description: "How we price AI work: a fixed-fee audit, a fixed-price build, and a monthly retainer. ${prices}.", ogImage: "" },
  { slug: "security", title: "Security", description: "How Reygent AI protects client data: encryption, tenant isolation, access control, audit logging, testing and incident response.", ogImage: "" },
  { slug: "services", title: "Services", description: "Five ways we take work off your team: answering enquiries, removing the manual admin, processing paperwork, reporting on the business, and keeping it running.", ogImage: "" },
  { slug: "solutions", title: "Solutions", description: "How we help professional services firms, property and trades businesses, online retailers and clinics automate the repetitive work behind their day.", ogImage: "" },
  { slug: "startups", title: "Founders programme", description: "A fixed-price first automation for businesses under three years old: one process, scoped small, live in three weeks for $6,000.", ogImage: "" },
];
