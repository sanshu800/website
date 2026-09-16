/**
 * Brand, navigation and shared marketing content.
 *
 * NOTE ON PLACEHOLDER DATA: the client names, logos and testimonials in this
 * file are invented placeholders shaped for Reygent AI's market (owner-run
 * businesses across professional services, property, e-commerce and health).
 * They are not real customers and no real company's mark is reproduced. Swap
 * them for real names and quotes before this site is published — see
 * `PLACEHOLDERS` below.
 */

export const PLACEHOLDERS = {
  clients: true,
  testimonials: true,
} as const;

export const site = {
  name: "Reygent AI",
  wordmark: "Reygent AI",
  productName: "Reygent AI",
  tagline: "We take the manual work out of running a business.",
  /*
   * The one-sentence answer to "who are you and what do you do". It leads with
   * the work a visitor recognises rather than the category we belong to: an
   * owner knows whether "answering enquiries, processing paperwork and chasing
   * numbers" is their week. "AI agency" told them nothing they could check.
   */
  description:
    "Reygent AI takes the routine work off owner-run businesses: enquiries answered, paperwork handled, systems kept up to date, numbers always current. We build it around the tools you already use, run it, and you own it.",
  // PLACEHOLDER: confirm the production domain and monitored inbox.
  url: "https://reygent.ai",
  email: "hello@reygent.ai",
  phone: "+1 (415) 555-0142",
  locale: "en_US",
} as const;

/**
 * Hero film.
 *
 * Served from the CDN the asset is hosted on because it is several megabytes —
 * for production, download it into `public/video/hero.mp4` and switch `src` to
 * `/video/hero.mp4` so the hero does not depend on a third-party host.
 * `/images/hero-poster.jpg` is the fallback frame and is in this repository.
 */
export const heroVideo = {
  src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4",
  poster: "/images/hero-poster.jpg",
} as const;

export type NavChild = { label: string; href: string; blurb: string };
export type NavGroup = {
  label: string;
  href?: string;
  children?: NavChild[];
  columns?: { title: string; items: NavChild[] }[];
};

export const primaryNav: NavGroup[] = [
  {
    label: "Services",
    children: [
      {
        label: "Answer every enquiry",
        href: "/services/ai-agents",
        blurb: "Assistants that answer, qualify, book and follow up for you",
      },
      {
        label: "Remove the manual admin",
        href: "/services/workflow-automation",
        blurb: "The copying, chasing and re-typing between your systems, gone",
      },
      {
        label: "Process the paperwork",
        href: "/services/document-ai",
        blurb: "Invoices, contracts and forms read, checked and filed for you",
      },
      {
        label: "Report on the business",
        href: "/services/ai-insights",
        blurb: "Ask about your own numbers in plain English, get a straight answer",
      },
      {
        label: "Keep it running",
        href: "/services/managed-ai",
        blurb: "We watch it, fix it and improve it after launch",
      },
    ],
  },
  {
    label: "Solutions",
    children: [
      {
        label: "Professional services",
        href: "/solutions/professional-services",
        blurb: "Firms that bill by the hour and live on response time",
      },
      {
        label: "Property & real estate",
        href: "/solutions/property",
        blurb: "Listings, viewings, applications and tenant comms",
      },
      {
        label: "E-commerce & retail",
        href: "/solutions/ecommerce",
        blurb: "Support, order admin and product data at volume",
      },
      {
        label: "Clinics & health",
        href: "/solutions/clinics",
        blurb: "Bookings, reminders, intake forms and follow-up care",
      },
    ],
  },
  {
    label: "Why us",
    children: [
      {
        label: "vs. doing it yourself",
        href: "/compare/diy-tools",
        blurb: "Why most home-built automations quietly rot",
      },
      {
        label: "vs. hiring in-house",
        href: "/compare/hiring-in-house",
        blurb: "One hire versus a team that has done it before",
      },
      {
        label: "vs. a dev shop",
        href: "/compare/offshore-dev-shop",
        blurb: "Why AI projects need process knowledge, not tickets",
      },
      {
        label: "vs. another SaaS tool",
        href: "/compare/another-saas",
        blurb: "You do not need another dashboard to log into",
      },
      {
        label: "vs. a big consultancy",
        href: "/compare/big-consultancy",
        blurb: "Slides and strategy versus something that runs",
      },
      {
        label: "vs. doing nothing",
        href: "/compare/status-quo",
        blurb: "What the manual work actually costs you",
      },
    ],
  },
  {
    label: "Work",
    children: [
      {
        label: "Case studies",
        href: "/customers",
        blurb: "What we built and what changed afterwards",
      },
      {
        label: "How we work",
        href: "/how-we-work",
        blurb: "Audit to live system, in fixed stages",
      },
      {
        label: "Build log",
        href: "/build-log",
        blurb: "What we shipped and what we learned",
      },
      {
        label: "Playbooks",
        href: "/guides",
        blurb: "Step-by-step guides you can use without us",
      },
      {
        label: "Blog",
        href: "/blog",
        blurb: "Practical writing on AI in real businesses",
      },
      {
        label: "Newsletter",
        href: "/newsletter",
        blurb: "One useful idea a fortnight",
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        label: "About",
        href: "/about",
        blurb: "Who we are and how we think about this work",
      },
      {
        label: "Careers",
        href: "/careers",
        blurb: "Open roles, and what working here is like",
      },
      {
        label: "Security",
        href: "/security",
        blurb: "How we handle your data and your access",
      },
      {
        label: "Contact",
        href: "/contact",
        blurb: "Ask us something specific",
      },
    ],
  },
];

export const footerNav = {
  services: [
    { label: "Answer every enquiry", href: "/services/ai-agents" },
    { label: "Remove the manual admin", href: "/services/workflow-automation" },
    { label: "Process the paperwork", href: "/services/document-ai" },
    { label: "Report on the business", href: "/services/ai-insights" },
    { label: "Keep it running", href: "/services/managed-ai" },
    { label: "What we connect", href: "/integrations" },
    { label: "Engagement & pricing", href: "/pricing" },
    { label: "Build log", href: "/build-log" },
  ],
  solutions: [
    { label: "Professional services", href: "/solutions/professional-services" },
    { label: "Property & real estate", href: "/solutions/property" },
    { label: "E-commerce & retail", href: "/solutions/ecommerce" },
    { label: "Clinics & health", href: "/solutions/clinics" },
  ],
  compare: [
    { label: "vs. doing it yourself", href: "/compare/diy-tools" },
    { label: "vs. hiring in-house", href: "/compare/hiring-in-house" },
    { label: "vs. a dev shop", href: "/compare/offshore-dev-shop" },
    { label: "vs. another SaaS tool", href: "/compare/another-saas" },
    { label: "vs. a big consultancy", href: "/compare/big-consultancy" },
    { label: "vs. doing nothing", href: "/compare/status-quo" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Playbooks", href: "/guides" },
    { label: "How we work", href: "/how-we-work" },
    { label: "Case studies", href: "/customers" },
    { label: "Startups", href: "/startups" },
    { label: "Partners", href: "/partners" },
    { label: "Newsletter", href: "/newsletter" },
  ],
  /*
   * Legal pages are absent here on purpose. Security, Privacy and Terms each
   * appeared twice in the footer — once in this column and again in the utility
   * bar at the bottom, where readers expect them — which is noise, not
   * reassurance. The utility bar renders `footer.legalLinks`, so removing them
   * here leaves every one of those pages linked exactly once.
   */
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Client logos — invented placeholder businesses shaped to the market */
/* ------------------------------------------------------------------ */

export type ClientLogo = {
  name: string;
  sector: string;
  /** Which geometric mark the wordmark uses. */
  mark: "arc" | "block" | "chevron" | "orbit" | "prism" | "wave" | "grid" | "spark";
};

export const clients: ClientLogo[] = [
  { name: "Halloran & Vance", sector: "Legal", mark: "arc" },
  { name: "Brightwell", sector: "Accounting", mark: "block" },
  { name: "Carrow Property", sector: "Property", mark: "chevron" },
  { name: "Northgate Supply", sector: "Distribution", mark: "prism" },
  { name: "Pell & Rowe", sector: "Accounting", mark: "grid" },
  { name: "Marlowe Advisory", sector: "Consulting", mark: "orbit" },
  { name: "Verdant Clinic", sector: "Health", mark: "wave" },
  { name: "Ashford Legal", sector: "Legal", mark: "spark" },
  { name: "Lumen Home", sector: "E-commerce", mark: "orbit" },
  { name: "Sterling Hoyt", sector: "Recruitment", mark: "block" },
  { name: "Oakhill Group", sector: "Construction", mark: "arc" },
  { name: "Ferrand & Co", sector: "Financial services", mark: "chevron" },
];

/* ------------------------------------------------------------------ */
/* Testimonials — PLACEHOLDER, invented. Replace before publishing.    */
/* ------------------------------------------------------------------ */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  /** Long-form quotes used in the featured slot. */
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We were drowning in quote requests and answering them the next day. It replies in about a minute and books the survey while the customer is still on the page. Our win rate on quoted work has never been higher.",
    name: "Marguerite Halloran",
    role: "Managing Director",
    company: "Halloran & Vance",
    sector: "Legal",
    featured: true,
  },
  {
    quote:
      "Invoicing used to be two days a month of copying numbers between systems. It now runs overnight and somebody checks the exceptions in twenty minutes.",
    name: "Priya Raman",
    role: "Finance Director",
    company: "Northgate Supply",
    sector: "Distribution",
    featured: true,
  },
  {
    quote:
      "I expected a big IT project. What we got was two weeks of somebody sensible asking how we actually work, then a system that does the parts nobody wanted to do.",
    name: "Daniel Kessler",
    role: "Owner",
    company: "Ashford Legal",
    sector: "Legal",
  },
  {
    quote:
      "The follow-up gap was costing us viewings. Every enquiry now gets an answer within minutes, at ten at night, on a Sunday, and it sounds like us.",
    name: "Sophie Carrow",
    role: "Director",
    company: "Carrow Property",
    sector: "Property",
  },
  {
    quote:
      "Support tickets dropped by roughly a third in the first month, mostly the same six questions answered properly and instantly. My team now handles the ones that need a human.",
    name: "Owen Lumen",
    role: "Founder",
    company: "Lumen Home",
    sector: "E-commerce",
  },
  {
    quote:
      "They were honest that two of the four things I wanted were not worth automating. That is why I trusted the rest of it.",
    name: "Dr Amelia Ward",
    role: "Practice Principal",
    company: "Verdant Clinic",
    sector: "Health",
  },
];

/* ------------------------------------------------------------------ */
/* What we connect                                                     */
/* ------------------------------------------------------------------ */

export type Integration = {
  category: string;
  blurb: string;
  surfaces: string[];
};

export const integrations: Integration[] = [
  {
    category: "CRM & sales pipeline",
    blurb: "Agents read and write your pipeline, so leads are qualified, updated and followed up without anyone retyping a thing.",
    surfaces: ["Record sync", "Lead scoring", "Sequence triggers", "Pipeline updates"],
  },
  {
    category: "Email & calendar",
    blurb: "Shared inboxes and calendars become things we can act on — drafting, booking, chasing and confirming.",
    surfaces: ["Inbox triage", "Draft replies", "Calendar booking", "Reminders"],
  },
  {
    category: "Accounting & invoicing",
    blurb: "Bills, invoices and reconciliation matched against the record, with anything unusual pulled out for a person to check.",
    surfaces: ["Invoice capture", "Ledger sync", "Reconciliation", "Approval routing"],
  },
  {
    category: "Documents & storage",
    blurb: "Contracts, forms and onboarding packs read, classified, filed and made searchable — wherever they currently live.",
    surfaces: ["Extraction", "Classification", "Filing rules", "Search"],
  },
  {
    category: "Messaging & telephony",
    blurb: "Voice and messages answered, qualified, and escalated to a person with the context already gathered.",
    surfaces: ["Voice calls", "WhatsApp & SMS", "Live chat", "Call summaries"],
  },
  {
    category: "Operations & industry systems",
    blurb: "The systems that actually run your business — job boards, practice management, property portals, e-commerce, logistics.",
    surfaces: ["Two-way sync", "Webhooks", "Custom API", "Legacy bridging"],
  },
  {
    category: "Data & reporting",
    blurb: "One place to ask questions across all of it, and scheduled reporting that writes itself.",
    surfaces: ["Warehouse sync", "Custom metrics", "Scheduled reports", "Ask your data"],
  },
];

/* ------------------------------------------------------------------ */
/* Headline facts — what the offer is, not a claim about results.      */
/* ------------------------------------------------------------------ */

export const platformFacts = [
  { value: "5", label: "Ways we help", detail: "Agents, automation, documents, insight, managed AI" },
  { value: "0", label: "Systems replaced", detail: "We connect what you already run" },
  { value: "100%", label: "Of the build is yours", detail: "Code, prompts and documentation handed over" },
  { value: "40+", label: "Tools we connect", detail: "CRM, inbox, calendar, ledger, storage, telephony, API" },
];
