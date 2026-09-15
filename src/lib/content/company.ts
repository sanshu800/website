/** Company, pricing, careers, release notes, FAQ and legal content. */

export type Tier = {
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  cta: string;
  href: string;
  highlight?: boolean;
  includes: string[];
  limits: { label: string; value: string }[];
};

export const tiers: Tier[] = [
  {
    name: "Core",
    price: "$89",
    priceNote: "per user / month, billed annually",
    summary: "For a single practice running intake, follow-up and onboarding on one record.",
    cta: "Start free trial",
    href: "/get-started",
    includes: [
      "Intake, Engage, Deliver and Insight",
      "One shared memory layer",
      "Email, calendar and document sync",
      "Client portal",
      "Scheduled reports",
      "Up to 2,500 active client records",
    ],
    limits: [
      { label: "Active records", value: "2,500" },
      { label: "Automation runs", value: "25,000 / month" },
      { label: "Ask Reygent", value: "Included" },
      { label: "Support", value: "Email, next business day" },
    ],
  },
  {
    name: "Pro",
    price: "$149",
    priceNote: "per user / month, billed annually",
    summary: "For multi-practice firms that need custom records, governance and deeper reporting.",
    cta: "Start free trial",
    href: "/get-started",
    highlight: true,
    includes: [
      "Everything in Core",
      "Custom record types and relationships",
      "Workflow builder",
      "Cross-practice reporting and forecasting",
      "Messaging and channel alerts",
      "Migration support from your current system",
      "Up to 25,000 active client records",
    ],
    limits: [
      { label: "Active records", value: "25,000" },
      { label: "Automation runs", value: "250,000 / month" },
      { label: "Ask Reygent", value: "Unlimited" },
      { label: "Support", value: "Priority, 4-hour response" },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "annual agreement",
    summary: "For firms with regulatory constraints, multiple entities or an in-house IT function.",
    cta: "Talk to sales",
    href: "/contact",
    includes: [
      "Everything in Pro",
      "SSO / SCIM provisioning",
      "Audit logs and data residency options",
      "Role-based access at record level",
      "Custom retention and export policy",
      "Named implementation lead",
      "Unlimited active records",
    ],
    limits: [
      { label: "Active records", value: "Unlimited" },
      { label: "Automation runs", value: "Negotiated" },
      { label: "Ask Reygent", value: "Unlimited, private model routing" },
      { label: "Support", value: "Named contact, SLA" },
    ],
  },
];

export const pricingFaqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — 14 days on Core or Pro, no card required. Bring real data: the trial is far more useful with a live inbox than a sample dataset.",
  },
  {
    q: "What does implementation actually cost us?",
    a: "Two to four hours of a practice manager's time in week one, and about an hour a week for the first month. The honest answer is that firms who cannot give it that time should not start yet.",
  },
  {
    q: "Do we have to move off our current tools?",
    a: "No. Reygent sits alongside email, calendar, documents, accounting and practice management. Most firms replace the coordination layer first and decide about the rest later.",
  },
  {
    q: "How is our data separated from other firms'?",
    a: "Each firm is a separate tenant with its own encryption keys and storage boundary. Enterprise plans can pin data residency to a region. Security documentation is available under NDA.",
  },
  {
    q: "What happens if we leave?",
    a: "Full export of every record, document reference and activity in open formats, including history. No exit fee, no data hostage-taking. This is stated in the contract, not just on a pricing page.",
  },
  {
    q: "Do you charge per client or per user?",
    a: "Per user. You are not penalised for growing your client base, and we are not incentivised to make you restrict access to the record.",
  },
];

export type Role = {
  slug: string;
  title: string;
  team: "Engineering" | "Product" | "Design" | "Go-to-market" | "Operations" | "Research";
  location: string;
  type: "Full-time" | "Contract";
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const roles: Role[] = [
  {
    slug: "senior-product-engineer",
    title: "Senior Product Engineer",
    team: "Engineering",
    location: "Remote (EU / UK / US East)",
    type: "Full-time",
    salary: "$170k – $215k + equity",
    summary:
      "Own whole surfaces of the platform, from the memory layer through to the interface a practice manager uses at 8am on a Monday.",
    responsibilities: [
      "Design and ship features end to end, in TypeScript and SQL",
      "Work directly with firms during implementation and watch them use what you built",
      "Improve the reliability of the automation runner and integration sync",
      "Review others' work with a bias toward clarity over cleverness",
    ],
    requirements: [
      "Five or more years building production web applications",
      "Strong instinct for data modelling and where state should live",
      "Comfort with ambiguity and direct contact with users",
      "Interest in operational systems rather than consumer products",
    ],
  },
  {
    slug: "implementation-lead",
    title: "Implementation Lead",
    team: "Operations",
    location: "Remote (US East preferred)",
    type: "Full-time",
    salary: "$120k – $155k + equity",
    summary:
      "Run the first ninety days for new firms: map the operation, configure the platform, and make sure the change actually holds after launch.",
    responsibilities: [
      "Lead discovery workshops with partners, practice managers and fee-earners",
      "Translate the mapped process into platform configuration",
      "Train teams and design the internal adoption plan",
      "Feed everything you learn back into the product roadmap",
    ],
    requirements: [
      "Experience operating inside or consulting to a professional-services firm",
      "Ability to run a workshop with a sceptical partner and leave with a decision",
      "Systems thinking: you see the handoff, not just the task",
      "Clear writing; most of this job is documentation other people rely on",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    team: "Design",
    location: "Remote (EU / UK)",
    type: "Full-time",
    salary: "$130k – $165k + equity",
    summary:
      "Design dense operational interfaces that remain legible under real workload — queues, tables, records and the moments where something has gone wrong.",
    responsibilities: [
      "Design the interface layer of the platform end to end",
      "Prototype in code where it answers a question faster than a mockup",
      "Establish patterns for tables, filters, bulk actions and empty states",
      "Test designs with firms on implementation calls",
    ],
    requirements: [
      "A portfolio of genuinely complex product work, not landing pages",
      "Fluency in HTML and CSS; you can build your own prototypes",
      "Strong opinions about information density, held loosely",
      "Interest in how professional-services work actually happens",
    ],
  },
  {
    slug: "operations-research-analyst",
    title: "Operations Research Analyst",
    team: "Research",
    location: "Remote",
    type: "Full-time",
    salary: "$95k – $125k + equity",
    summary:
      "Benchmark how firms actually run: intake, follow-through, delivery and reporting across sectors, and turn that into the evidence the product is built on.",
    responsibilities: [
      "Design and run operational benchmarks across client firms",
      "Build the datasets and internal tools the benchmarks depend on",
      "Publish findings that firms find useful even when they never buy",
      "Give the product team evidence instead of opinion",
    ],
    requirements: [
      "Quantitative background: economics, statistics, operations or similar",
      "Comfortable with SQL and a scripting language",
      "Ability to write for a busy partner and hold their attention",
      "Careful with numbers, and precise about what they do not show",
    ],
  },
  {
    slug: "account-executive",
    title: "Account Executive",
    team: "Go-to-market",
    location: "Hybrid (New York or London)",
    type: "Full-time",
    salary: "$110k base + commission",
    summary:
      "Sell to managing partners and operations directors who have been sold to badly for a decade and can tell immediately.",
    responsibilities: [
      "Run discovery that maps a firm's operation rather than pitching a feature list",
      "Build the business case in the firm's own numbers",
      "Work with implementation to make sure what is promised is deliverable",
      "Refuse deals that will not hold, and say so",
    ],
    requirements: [
      "Three or more years in complex B2B software sales",
      "Genuine curiosity about how a business operates underneath the org chart",
      "Comfortable with a long, relationship-led cycle",
      "Consultative rather than scripted",
    ],
  },
  {
    slug: "reliability-engineer",
    title: "Platform Reliability Engineer",
    team: "Engineering",
    location: "Remote (EU)",
    type: "Full-time",
    salary: "$145k – $185k + equity",
    summary:
      "Keep the automation runner, integration sync and memory layer honest — firms make client commitments based on what this system says.",
    responsibilities: [
      "Own observability across ingestion, automation and sync pipelines",
      "Design for graceful degradation when a third-party API misbehaves",
      "Build the tooling that makes incidents legible to non-engineers",
      "Set and defend the reliability targets the product commits to",
    ],
    requirements: [
      "Production experience with queues, scheduling and idempotent workflows",
      "Strong debugging instinct across distributed boundaries",
      "Care about correctness in the specific way that data about clients demands",
      "Willingness to write the postmortem properly",
    ],
  },
];

export const companyValues = [
  {
    title: "Understand before building",
    body: "We map the real process, including the exceptions nobody documented, before writing a rule. Most automation failures are understanding failures wearing a technology costume.",
    icon: "Compass",
  },
  {
    title: "Automate the repetitive layer",
    body: "Assembly, chasing, reminder-setting and report construction are the work software should own. Judgement and relationships are the work people should own.",
    icon: "Repeat",
  },
  {
    title: "Keep humans on decisions",
    body: "Every automated output must be inspectable and reversible by the person accountable for it. If you cannot see where an answer came from, you cannot sign the work.",
    icon: "Scale",
  },
  {
    title: "Build between the tools",
    body: "Replacing a firm's entire stack is a migration project, not an operational gain. We earn trust by connecting what already works.",
    icon: "Plug",
  },
  {
    title: "Systems that outlive the consultant",
    body: "If the system only works while somebody is watching it, it is not finished. Documented, legible, and owned by the firm.",
    icon: "BookOpenCheck",
  },
  {
    title: "Measured in outcomes",
    body: "Response time, work recovered, hours returned, margin made visible. Not how advanced the model sounds.",
    icon: "Target",
  },
];

export const timeline = [
  { year: "2022", title: "The audit habit", body: "Started as a consultancy mapping operations for legal and accounting firms. The same four bottlenecks appeared in almost every engagement." },
  { year: "2023", title: "Building the layer", body: "Started building the memory layer that would become Foundation, initially to avoid re-interviewing clients on every project." },
  { year: "2024", title: "Four modules, one record", body: "Intake, Engage, Deliver and Insight shipped as one product rather than four tools, because the seams between them were the whole problem." },
  { year: "2026", title: "Platform, not project", body: "Reygent now runs as the operating layer for firms across four sectors, with an in-house implementation team and a public benchmark programme." },
];

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  summary: string;
  items: { kind: "New" | "Improved" | "Fixed"; text: string }[];
};

export const releaseNotes: ReleaseNote[] = [
  {
    version: "4.2",
    date: "2026-09-02",
    title: "Workflow builder, readable rules",
    summary: "Build automations in plain language and read them back months later when someone asks why one fired.",
    items: [
      { kind: "New", text: "Workflow builder with a plain-language condition editor and dry-run preview" },
      { kind: "New", text: "Version history on every workflow, with the reason for each change" },
      { kind: "Improved", text: "Escalation rules now inherit quiet-hours settings from the sequence" },
      { kind: "Fixed", text: "Calendar sync no longer duplicates all-day events across time zones" },
    ],
  },
  {
    version: "4.1",
    date: "2026-08-06",
    title: "Cross-practice reporting",
    summary: "One review pack across multiple practice areas, with per-practice drill-down.",
    items: [
      { kind: "New", text: "Combined pipeline and utilisation reports across practices" },
      { kind: "New", text: "Scheduled delivery to email and messaging channels" },
      { kind: "Improved", text: "Metric definitions are now editable without engineering support" },
      { kind: "Fixed", text: "Budget burn calculation corrected for mid-month scope changes" },
    ],
  },
  {
    version: "4.0",
    date: "2026-06-18",
    title: "Foundation and Ask Reygent",
    summary: "The memory layer became a product surface: ask questions across the whole book and get cited answers.",
    items: [
      { kind: "New", text: "Ask Reygent across records, correspondence and documents" },
      { kind: "New", text: "Source citations on every generated answer" },
      { kind: "New", text: "Custom record types with relationships" },
      { kind: "Improved", text: "Search latency reduced substantially on large books" },
    ],
  },
  {
    version: "3.8",
    date: "2026-05-07",
    title: "Client portal",
    summary: "A client-facing space for document collection and status, without an account being required.",
    items: [
      { kind: "New", text: "Branded document collection with per-item status" },
      { kind: "New", text: "Proactive status updates pushed to clients" },
      { kind: "Improved", text: "Reminder cadence now respects per-contact preferences" },
      { kind: "Fixed", text: "Large exports no longer time out on books over 10,000 records" },
    ],
  },
];

export const guides = [
  {
    slug: "first-ninety-days",
    title: "The first ninety days",
    summary: "An implementation plan for firms rolling out an operations platform without pausing the practice.",
    format: "PDF · 18 pages",
    category: "Implementation",
  },
  {
    slug: "intake-scorecard",
    title: "The intake scorecard",
    summary: "Four measurements, one page, run them this quarter. The audit from our most-read article, as a scorecard.",
    format: "Worksheet · 2 pages",
    category: "Intake",
  },
  {
    slug: "document-collection-playbook",
    title: "Document collection playbook",
    summary: "Templates, chase cadence and escalation thresholds that get onboarding documents in without a phone call.",
    format: "Playbook · 24 pages",
    category: "Delivery",
  },
  {
    slug: "reporting-metric-definitions",
    title: "Metric definitions for professional-services firms",
    summary: "The sentences that end arguments: utilisation, realisation, matter margin and pipeline coverage, precisely defined.",
    format: "Reference · 12 pages",
    category: "Reporting",
  },
  {
    slug: "ai-policy-template",
    title: "AI policy template for client work",
    summary: "A starting point for firms that need an internal policy covering what AI may and may not touch in client engagements.",
    format: "Template · 9 pages",
    category: "AI",
  },
  {
    slug: "handover-checklist",
    title: "The three-week absence test",
    summary: "A handover checklist that survives a colleague being unavailable, built around the record rather than the person.",
    format: "Checklist · 4 pages",
    category: "Operations",
  },
];

export const legalPages = {
  privacy: {
    title: "Privacy notice",
    updated: "2026-08-01",
    intro:
      "This notice explains what Reygent collects, why, and what control you have over it. It is written to be read, not to be survived.",
    sections: [
      { h: "What we collect", p: "Account details (name, email, firm), the operational records you create in the platform, correspondence and documents you connect, and technical logs needed to operate the service." },
      { h: "Why we process it", p: "To provide the platform, to secure it, to support you when you ask, and to meet our legal obligations. We do not sell personal data, and we do not use client records to train external models." },
      { h: "Your firm's client data", p: "Where you store information about your own clients, your firm is the controller and Reygent is the processor. We act only on your instructions, under a data processing agreement." },
      { h: "Retention", p: "Operational records are retained while your account is active. On termination, everything is exportable for 30 days, then deleted from production and backups within a documented window." },
      { h: "Sub-processors", p: "A current list of sub-processors, with purpose and location, is available on request and included in the DPA. You are notified before any change." },
      { h: "Your rights", p: "Access, correction, deletion, portability and objection. Requests to privacy@reygent.ai are answered within 30 days, and usually much sooner." },
    ],
  },
  terms: {
    title: "Terms of service",
    updated: "2026-08-01",
    intro:
      "The agreement between your firm and Reygent covering use of the platform. Plain-language summary first, full terms below.",
    sections: [
      { h: "Using the platform", p: "You may use Reygent for your firm's internal operations and for delivering services to your clients. You are responsible for the accuracy of the data you put in and for who you give access." },
      { h: "Our commitments", p: "We provide the service with the availability target published in your order form, maintain security controls described in our documentation, and notify you of incidents affecting your data." },
      { h: "Fees and billing", p: "Subscriptions are billed in advance, monthly or annually. Annual commitments are non-refundable except where we fail to meet the availability target, in which case service credits apply." },
      { h: "Your data", p: "You own your data. We claim no rights over it beyond what is needed to run the service. Export is available at any time in open formats." },
      { h: "Termination", p: "Either party may terminate for material breach with 30 days' notice to remedy. On termination you receive a full export, and we delete per the retention policy." },
      { h: "Liability", p: "Our aggregate liability is limited to fees paid in the preceding twelve months. Nothing limits liability for gross negligence, wilful misconduct or breach of confidentiality." },
    ],
  },
  security: {
    title: "Security",
    updated: "2026-08-01",
    intro:
      "Firms hand us information about their clients. That deserves specifics rather than adjectives.",
    sections: [
      { h: "Encryption", p: "TLS 1.2+ in transit, AES-256 at rest, with per-tenant key separation. Backups are encrypted with separate keys." },
      { h: "Access control", p: "Role-based access with record-level restrictions available. Enterprise plans add SSO, SCIM provisioning and enforced MFA for all users." },
      { h: "Tenant isolation", p: "Each firm is a separate tenant with its own storage boundary. Cross-tenant access is not possible through any application path and is tested for in every release." },
      { h: "Monitoring", p: "All administrative and data actions are logged in an append-only audit trail, exportable to your own SIEM on Enterprise plans." },
      { h: "Development practice", p: "Peer-reviewed changes, automated dependency scanning, secrets managed outside the codebase, and a documented patch policy with severity-based SLAs." },
      { h: "Testing", p: "Annual third-party penetration test, a public security contact, and a coordinated disclosure policy. Reports available under NDA." },
      { h: "Incident response", p: "A documented plan with defined severities. Affected firms are notified within 24 hours of confirmation, with what we know and what we are doing." },
      { h: "Certifications", p: "SOC 2 Type II in progress with a published report expected in the current year. GDPR-aligned data processing agreements are available now." },
    ],
  },
};

export const startupsProgram = {
  headline: "Half price for firms under three years old",
  summary:
    "New firms have an advantage: no legacy process to unpick. They also have no operations budget. The Reygent Startup Programme gives firms under three years old 50% off Core or Pro for the first twelve months, plus implementation at no charge.",
  benefits: [
    { title: "50% off for 12 months", body: "Applied to Core or Pro, from your first paid month." },
    { title: "Implementation included", body: "The same onboarding a full-price firm gets, at no charge." },
    { title: "Founder access", body: "Direct line to the product team for the first year, including roadmap previews." },
    { title: "Room to grow", body: "Locked pricing as you add users during the programme year." },
  ],
};

export const partnersProgram = {
  headline: "For consultants, accountants and systems integrators",
  summary:
    "If you already advise professional-services firms on their operations, you are diagnosing the same problems we build for. Partners implement Reygent for their clients, with revenue share and implementation support from us.",
  benefits: [
    { title: "20% recurring revenue share", body: "For the lifetime of the client relationship you introduce." },
    { title: "Certification", body: "Two-day certification on operational mapping and platform configuration." },
    { title: "Deal support", body: "We join technical discovery and implementation design calls with your client." },
    { title: "Co-marketing", body: "Joint benchmarks and guides published under both brands." },
  ],
  steps: [
    { title: "Apply", body: "Tell us about your practice and the firms you currently advise." },
    { title: "Certify", body: "Two days, remote, covering operational mapping and platform configuration." },
    { title: "Introduce", body: "We run discovery together and scope the implementation jointly." },
    { title: "Deliver", body: "You lead the change; we handle the platform and second-line support." },
  ],
};

export const siteStats = [
  { value: "4", label: "Sectors in production", detail: "Legal, accounting, consulting, advisory" },
  { value: "12", label: "Countries", detail: "Firms operating across EU, UK, US and APAC" },
  { value: "30 days", label: "Typical time to value", detail: "From kickoff to first measured improvement" },
  { value: "99.95%", label: "Platform availability", detail: "Trailing twelve-month average" },
];
