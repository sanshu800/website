/**
 * Brand, navigation and shared marketing content.
 *
 * NOTE ON PLACEHOLDER DATA: the client names, logos and testimonials in this
 * file are invented placeholders shaped for Reygent's ICP (professional-service
 * firms). They are not real customers. Swap them for real names and quotes
 * before this site is published — see `PLACEHOLDERS` below.
 */

export const PLACEHOLDERS = {
  clients: true,
  testimonials: true,
} as const;

export const site = {
  name: "Reygent",
  wordmark: "Reygent",
  productName: "Reygent Platform",
  tagline: "The AI-native operations platform for professional-service firms.",
  description:
    "Reygent runs intake, client onboarding, follow-through and reporting on one shared memory layer, so a professional-services firm stops losing work between the tools.",
  // PLACEHOLDER: confirm the production domain and monitored inbox.
  url: "https://reygent.ai",
  email: "hello@reygent.ai",
  phone: "+1 (415) 555-0142",
  locale: "en_US",
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
    label: "Product",
    children: [
      {
        label: "Intake",
        href: "/products/intake",
        blurb: "Capture, qualify and route every enquiry",
      },
      {
        label: "Engage",
        href: "/products/engage",
        blurb: "Follow-up that runs until there is a decision",
      },
      {
        label: "Deliver",
        href: "/products/deliver",
        blurb: "Onboard clients and run the engagement",
      },
      {
        label: "Insight",
        href: "/products/insight",
        blurb: "Reporting, forecasting and review",
      },
      {
        label: "Foundation",
        href: "/products/foundation",
        blurb: "One memory layer where context compounds",
      },
    ],
    columns: [
      {
        title: "More",
        items: [
          { label: "Product tour", href: "/product-tour", blurb: "" },
          { label: "Pricing", href: "/pricing", blurb: "" },
          { label: "Integrations", href: "/integrations", blurb: "" },
          { label: "Release notes", href: "/release-notes", blurb: "" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    children: [
      {
        label: "For legal firms",
        href: "/solutions/legal",
        blurb: "Intake and matter management",
      },
      {
        label: "For accounting",
        href: "/solutions/accounting",
        blurb: "Seasonal volume, clean handoffs",
      },
      {
        label: "For consulting",
        href: "/solutions/consulting",
        blurb: "Pipeline to engagement, in one place",
      },
      {
        label: "For advisory",
        href: "/solutions/advisory",
        blurb: "Recurring reviews, delivered on time",
      },
    ],
    columns: [
      {
        title: "Compare",
        items: [
          { label: "vs. spreadsheets", href: "/compare/spreadsheets", blurb: "" },
          { label: "vs. a traditional CRM", href: "/compare/traditional-crm", blurb: "" },
          { label: "vs. point solutions", href: "/compare/point-solutions", blurb: "" },
          { label: "vs. hiring an ops manager", href: "/compare/ops-hire", blurb: "" },
          { label: "vs. building in-house", href: "/compare/in-house-build", blurb: "" },
          { label: "vs. doing nothing", href: "/compare/status-quo", blurb: "" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  {
    label: "Resources",
    children: [
      {
        label: "Blog",
        href: "/blog",
        blurb: "Operations writing for firm leaders",
      },
      {
        label: "Operating guides",
        href: "/guides",
        blurb: "Playbooks you can run this quarter",
      },
      {
        label: "Startup programme",
        href: "/startups",
        blurb: "For firms under three years old",
      },
      {
        label: "Partners",
        href: "/partners",
        blurb: "Deliver Reygent to your clients",
      },
    ],
    columns: [
      {
        title: "Company",
        items: [
          { label: "About", href: "/about", blurb: "" },
          { label: "Careers", href: "/careers", blurb: "" },
          { label: "Newsletter", href: "/newsletter", blurb: "" },
          { label: "Contact", href: "/contact", blurb: "" },
        ],
      },
    ],
  },
];

export const footerNav = {
  product: [
    { label: "Intake", href: "/products/intake" },
    { label: "Engage", href: "/products/engage" },
    { label: "Deliver", href: "/products/deliver" },
    { label: "Insight", href: "/products/insight" },
    { label: "Foundation", href: "/products/foundation" },
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
    { label: "Release notes", href: "/release-notes" },
  ],
  solutions: [
    { label: "Legal", href: "/solutions/legal" },
    { label: "Accounting", href: "/solutions/accounting" },
    { label: "Consulting", href: "/solutions/consulting" },
    { label: "Advisory", href: "/solutions/advisory" },
  ],
  compare: [
    { label: "vs. spreadsheets", href: "/compare/spreadsheets" },
    { label: "vs. a traditional CRM", href: "/compare/traditional-crm" },
    { label: "vs. point solutions", href: "/compare/point-solutions" },
    { label: "vs. hiring an ops manager", href: "/compare/ops-hire" },
    { label: "vs. building in-house", href: "/compare/in-house-build" },
    { label: "vs. doing nothing", href: "/compare/status-quo" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Operating guides", href: "/guides" },
    { label: "Product tour", href: "/product-tour" },
    { label: "Customers", href: "/customers" },
    { label: "Startup programme", href: "/startups" },
    { label: "Partners", href: "/partners" },
    { label: "Newsletter", href: "/newsletter" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Security", href: "/security" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Client logos — invented placeholder firms shaped to the ICP        */
/* ------------------------------------------------------------------ */

export type ClientLogo = {
  name: string;
  sector: string;
  /** Which geometric mark the wordmark uses. */
  mark: "arc" | "block" | "chevron" | "orbit" | "prism" | "wave" | "grid" | "spark";
};

export const clients: ClientLogo[] = [
  { name: "Halloran & Vance", sector: "Legal", mark: "arc" },
  { name: "Marlowe Advisory", sector: "Advisory", mark: "orbit" },
  { name: "Brightwell", sector: "Accounting", mark: "block" },
  { name: "Kessler Partners", sector: "Legal", mark: "chevron" },
  { name: "Northgate", sector: "Consulting", mark: "prism" },
  { name: "Pell & Rowe", sector: "Accounting", mark: "grid" },
  { name: "Ashford Legal", sector: "Legal", mark: "spark" },
  { name: "Verity Advisors", sector: "Advisory", mark: "wave" },
  { name: "Lumen Tax Group", sector: "Accounting", mark: "orbit" },
  { name: "Sterling Hoyt", sector: "Legal", mark: "block" },
  { name: "Oakhill Consulting", sector: "Consulting", mark: "arc" },
  { name: "Ferrand & Co", sector: "Advisory", mark: "chevron" },
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
      "The last piece of software our practice actually needed. Everything about a client lives in one record now, instead of across four inboxes and a spreadsheet nobody trusted.",
    name: "Marguerite Halloran",
    role: "Managing Partner",
    company: "Halloran & Vance",
    sector: "Legal",
    featured: true,
  },
  {
    quote:
      "We stopped losing enquiries in the gap between the web form and somebody remembering to reply. That alone paid for the year.",
    name: "Daniel Kessler",
    role: "Partner",
    company: "Kessler Partners",
    sector: "Legal",
  },
  {
    quote:
      "Month-end used to take three days of rebuilding the same numbers. It is now a report that arrives before the meeting.",
    name: "Priya Raghavan",
    role: "Operations Director",
    company: "Brightwell",
    sector: "Accounting",
    featured: true,
  },
  {
    quote:
      "Every associate works the same intake process, whether they have been here nine years or nine weeks. That consistency is worth more than the time saved.",
    name: "Tomas Verity",
    role: "Founder",
    company: "Verity Advisors",
    sector: "Advisory",
  },
  {
    quote:
      "Coming from a CRM nobody updated, the difference is that the record writes itself. My partners actually look at it now.",
    name: "Eleanor Sterling",
    role: "Chief Operating Officer",
    company: "Sterling Hoyt",
    sector: "Legal",
    featured: true,
  },
  {
    quote:
      "Onboarding a new client went from a fortnight of chasing documents to something that runs itself. Clients notice the difference.",
    name: "Marcus Pell",
    role: "Director",
    company: "Pell & Rowe",
    sector: "Accounting",
  },
];

/* ------------------------------------------------------------------ */
/* Integrations — described by category, not by partner brand.         */
/* ------------------------------------------------------------------ */

export type Integration = {
  category: string;
  blurb: string;
  surfaces: string[];
};

export const integrations: Integration[] = [
  {
    category: "Email & calendar",
    blurb: "Two-way sync on mailboxes and calendars, so threads and meetings attach themselves to the right record.",
    surfaces: ["Inbox sync", "Calendar sync", "Meeting notes", "Shared mailboxes"],
  },
  {
    category: "Documents & e-signature",
    blurb: "Engagement letters, contracts and onboarding packs move through a defined path with status tracked per client.",
    surfaces: ["Templates", "Signature status", "Document collection", "Version history"],
  },
  {
    category: "Accounting & billing",
    blurb: "Time, budgets and invoicing reconciled against the engagement record instead of retyped at month end.",
    surfaces: ["Ledger sync", "Time capture", "Budget tracking", "Invoice status"],
  },
  {
    category: "Messaging & alerts",
    blurb: "Risk, slippage and stalled work surfaced where the team already talks, not in a dashboard nobody opens.",
    surfaces: ["Channel alerts", "Deal risk", "Stalled work", "Digest"],
  },
  {
    category: "Practice management",
    blurb: "Matters, engagements and projects stay in step with the operational record, whichever system holds the file.",
    surfaces: ["Matter sync", "Task handoff", "Status mapping", "Bulk import"],
  },
  {
    category: "Data & reporting",
    blurb: "Warehouse and BI pipelines read from the same memory layer, so the reported number is the operating number.",
    surfaces: ["Warehouse sync", "Custom metrics", "Scheduled exports", "API"],
  },
];

/* ------------------------------------------------------------------ */
/* Headline metrics — count of what the product does, not a claim.     */
/* ------------------------------------------------------------------ */

export const platformFacts = [
  { value: "5", label: "Connected modules", detail: "Intake, Engage, Deliver, Insight, Foundation" },
  { value: "1", label: "Memory layer", detail: "Every record, thread and document in one place" },
  { value: "40+", label: "Integration surfaces", detail: "Email, calendar, documents, ledger, messaging" },
  { value: "0", label: "Data migrations", detail: "Runs alongside the tools you already have" },
];
