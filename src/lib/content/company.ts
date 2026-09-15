/** Company, engagement pricing, careers, build log, FAQ and legal content. */

export type Engagement = {
  /** Stable identity for content overrides; not user-facing and not editable. */
  slug: string;
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  cta: string;
  href: string;
  highlight?: boolean;
  includes: string[];
  /** Shown as a small facts table under each engagement. */
  limits: { label: string; value: string }[];
};

export const engagements: Engagement[] = [
  {
    slug: "audit",
    name: "AI audit",
    price: "£2,400",
    priceNote: "one week, fixed fee, credited against your build",
    summary:
      "We spend a week inside your business, find every repetitive task worth automating, and give you a ranked plan with realistic savings against each one.",
    cta: "Book the audit",
    href: "/get-started",
    includes: [
      "Interviews with whoever does the work today",
      "Every candidate process written up and costed",
      "A ranked list: what to automate first, and why",
      "What we would not touch, and the honest reason",
      "A priced proposal for the first build",
      "The document is yours, whether or not you proceed",
    ],
    limits: [
      { label: "Takes", value: "One week of our time" },
      { label: "Needs from you", value: "4–5 hours of your team" },
      { label: "You get", value: "A ranked automation plan" },
      { label: "Commitment", value: "None after it is delivered" },
    ],
  },
  {
    slug: "build",
    name: "Build project",
    price: "from £9,000",
    priceNote: "fixed scope, fixed price, 4–8 weeks",
    summary:
      "We build the first automation, run it alongside your current process, and switch it on once the numbers prove it works.",
    cta: "Scope a build",
    href: "/get-started",
    highlight: true,
    includes: [
      "Everything in the audit",
      "The agreed process built end to end",
      "Connected to the systems you already use",
      "Tested against real cases from your history",
      "Run in parallel before go-live",
      "Your team trained, everything documented",
      "You own the code, prompts and accounts",
    ],
    limits: [
      { label: "Takes", value: "4–8 weeks, depending on scope" },
      { label: "Pricing", value: "Fixed, agreed before we start" },
      { label: "Payment", value: "Milestone-based, not upfront" },
      { label: "After launch", value: "Handover, or a retainer" },
    ],
  },
  {
    slug: "managed",
    name: "Managed AI",
    price: "from £950",
    priceNote: "per month, cancellable with 30 days' notice",
    summary:
      "We monitor what we built, keep it accurate as your business changes, and come back every month with what to fix next.",
    cta: "Talk about the retainer",
    href: "/contact",
    includes: [
      "Monitoring: failures reach us before they reach your customers",
      "Knowledge and rules updated as your business changes",
      "A named person who knows your setup",
      "Monthly review: what went wrong, what is next",
      "Model upgrades tested against your own cases",
      "Priority access when something urgent happens",
    ],
    limits: [
      { label: "Response", value: "Same working day, urgent same hour" },
      { label: "Review", value: "Monthly, with your team" },
      { label: "Minimum", value: "Three months, then rolling" },
      { label: "Leaving", value: "30 days' notice, keep everything" },
    ],
  },
];

export const pricingFaqs = [
  {
    q: "Why is there no free trial?",
    a: "Because we are not selling software you log into. Every engagement starts with a paid, fixed-fee audit, and it is credited against your build if you continue. If the audit finds nothing worth automating, we will tell you that and charge you for a week's work rather than a year's licence.",
  },
  {
    q: "What does the project actually cost all in?",
    a: "Most first builds land between £9,000 and £25,000, depending on how many systems are involved and how tidy your data is. You get a fixed price before anything starts, and we hold it unless you change the scope in writing.",
  },
  {
    q: "What do you need from our side?",
    a: "Between four and ten hours of your team's time in the first fortnight, mostly from the people who do the work today, and about an hour a week during the build. Businesses that cannot spare that are not ready for this yet, and we will say so.",
  },
  {
    q: "Do we have to replace our current systems?",
    a: "No, and we would rather you did not. The agents connect to the CRM, inbox, calendar, accounting package and industry systems you already pay for. Replacing software is a migration project; automating the work between it is what you are buying here.",
  },
  {
    q: "What happens to our data?",
    a: "It stays in your systems. We connect with scoped, revocable credentials rather than copying your database, we do not train models on your data, and everything we build runs in accounts you own.",
  },
  {
    q: "What if it does not work?",
    a: "Every build runs in parallel with your existing process for two weeks before anything is switched on, measured against an agreed baseline. If it does not clear that baseline, you do not pay for the failed stage and we say so plainly rather than continuing to bill.",
  },
];

export type Role = {
  slug: string;
  title: string;
  team: "AI engineering" | "Delivery" | "Design" | "Growth" | "Operations";
  location: string;
  type: "Full-time" | "Contract";
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const roles: Role[] = [
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    team: "AI engineering",
    location: "Remote (UK / EU)",
    type: "Full-time",
    salary: "£75k – £105k",
    summary:
      "Build agents that answer real customers, on real data, for businesses where a wrong answer costs money. You will see them running in production within weeks, not quarters.",
    responsibilities: [
      "Design and build voice, email and chat agents end to end",
      "Write the evaluation suites that decide whether an agent is good enough to ship",
      "Connect systems you have never heard of, and document them so the next person can",
      "Work directly with the business owner whose process you are automating",
    ],
    requirements: [
      "Production experience with LLM applications, including the boring parts: prompts under version control, cost and latency budgets, failure handling",
      "Strong Python or TypeScript, and comfort with APIs and webhooks",
      "Judgement about when a rule beats a model, and the honesty to say so",
      "Clear writing — most of what we hand over is documentation",
    ],
  },
  {
    slug: "automation-engineer",
    title: "Automation Engineer",
    team: "AI engineering",
    location: "Remote (UK / EU)",
    type: "Full-time",
    salary: "£65k – £90k",
    summary:
      "Own the plumbing: integrations, workflows, sync, error handling and the monitoring that tells us when something has quietly stopped working.",
    responsibilities: [
      "Build and maintain integrations across CRMs, accounting packages and industry software",
      "Design workflows with sane failure modes: retries, alerts, and clear owners",
      "Instrument everything so a broken step is noticed before a customer notices",
      "Improve the internal patterns the whole team builds on",
    ],
    requirements: [
      "Deep experience with integration work and third-party APIs, including their bad days",
      "Comfortable with queues, jobs, idempotency and observability",
      "Careful with money-adjacent data: you test the numbers, not just the flow",
      "Willing to talk to the client whose process you are automating",
    ],
  },
  {
    slug: "process-analyst",
    title: "Process Analyst",
    team: "Delivery",
    location: "Remote (UK), some travel",
    type: "Full-time",
    salary: "£55k – £75k",
    summary:
      "You run our audits. Watch how a business really works, find what is worth automating, and cost it honestly enough that the owner can decide.",
    responsibilities: [
      "Run audits: shadow the work, interview the team, measure the real timings",
      "Write up findings so an owner can read them in fifteen minutes and act",
      "Cost each opportunity, including the ones we should not touch",
      "Stay involved through the build so the intent survives contact with reality",
    ],
    requirements: [
      "Experience in operations, consulting or a business you have actually run",
      "Ability to watch a process and spot the exception nobody mentioned",
      "Strong spreadsheet and SQL literacy; you measure rather than estimate",
      "You can disagree with a client politely and hold the position",
    ],
  },
  {
    slug: "solutions-lead",
    title: "Solutions Lead",
    team: "Growth",
    location: "Hybrid (London) or remote UK",
    type: "Full-time",
    salary: "£70k – £95k + commission",
    summary:
      "Talk to owners who have been sold AI badly and can smell it. Your job is a straight conversation about what is worth automating, and what is not.",
    responsibilities: [
      "Run first calls that map a real process rather than pitching a feature list",
      "Build a business case in the client's own numbers, including payback",
      "Work with delivery so nothing is promised that cannot be built",
      "Turn down work that will not pay for itself, and explain why",
    ],
    requirements: [
      "Experience selling professional services or technical work to owner-run businesses",
      "Genuine curiosity about how a business works underneath the org chart",
      "Comfortable quoting a price and defending it",
      "Writes follow-ups people actually reply to",
    ],
  },
  {
    slug: "designer",
    title: "Product Designer",
    team: "Design",
    location: "Remote (UK / EU)",
    type: "Full-time",
    salary: "£60k – £85k",
    summary:
      "Design the interfaces our agents live inside: inboxes, queues, review screens and the monthly reports a business owner actually reads.",
    responsibilities: [
      "Design agent-facing and human-facing interfaces end to end",
      "Prototype in code when that answers a question faster than a mockup",
      "Set the patterns for queues, approvals, exceptions and review screens",
      "Watch real users work, including the ones who are not technical",
    ],
    requirements: [
      "A portfolio of complex interface work, not landing pages",
      "Fluency in HTML and CSS; you can build your own prototypes",
      "Understanding that most of our users are busy and unimpressed",
      "Opinions about information density, held loosely",
    ],
  },
  {
    slug: "delivery-manager",
    title: "Delivery Manager",
    team: "Operations",
    location: "Remote (UK)",
    type: "Full-time",
    salary: "£50k – £70k",
    summary:
      "Keep every build on its promise: fixed scope, agreed dates, and clients who always know where things stand.",
    responsibilities: [
      "Run builds to plan across several clients at once",
      "Own the schedule, the risks and the honest status report",
      "Coordinate client teams, third-party suppliers and access requests",
      "Turn every project's lessons into a change in how we work",
    ],
    requirements: [
      "Experience delivering technical projects where the client is a business, not a product team",
      "Ruthless about scope and kind about saying no",
      "Comfortable with the unglamorous work: chasing, tracking, following up",
      "Written clarity: status should never need a meeting",
    ],
  },
];

export const companyValues = [
  {
    title: "Understand before building",
    body: "We map the real process, including the exceptions nobody documented, before writing a rule. Most failed AI projects are understanding failures wearing a technology costume.",
    icon: "Compass",
  },
  {
    title: "Automate the repetitive layer",
    body: "Filling in, copying over, chasing up, checking and reporting are the work software should own. Judgement, relationships and accountability are the work people should own.",
    icon: "Repeat",
  },
  {
    title: "Keep humans on the decisions",
    body: "Anything that touches money, a customer or a legal commitment gets a person's name on it, unless the owner has explicitly chosen otherwise and understands the risk.",
    icon: "Scale",
  },
  {
    title: "Build between the tools, not instead of them",
    body: "Replacing a business's entire stack is a migration project, not an operational gain. We earn trust by connecting what already works.",
    icon: "Plug",
  },
  {
    title: "Systems that outlive the consultant",
    body: "If it only works while somebody is watching it, it is not finished. Documented, legible, and owned by the business that paid for it.",
    icon: "BookOpenCheck",
  },
  {
    title: "Measured in outcomes",
    body: "Hours returned, enquiries answered, invoices processed, reports that arrive on their own. Never how advanced the model sounds.",
    icon: "Target",
  },
];

export const timeline = [
  {
    year: "2022",
    title: "Started as an operations consultancy",
    body: "Mapping how owner-run businesses actually work. The same six bottlenecks appeared in almost every engagement, which was the first clue that the fix would be repeatable.",
  },
  {
    year: "2023",
    title: "From reports to systems",
    body: "Clients kept asking us to stay and fix the problems we had documented. We started building the automations instead of recommending tools that would never be bought.",
  },
  {
    year: "2024",
    title: "The agent era",
    body: "Language models got good enough to answer real customers. We built our first voice agent for a property firm, and it has not missed a call since.",
  },
  {
    year: "2026",
    title: "An agency, deliberately",
    body: "Around forty businesses later, we are still an agency rather than a software company. We build for the business in front of us and hand it over; we do not sell licences.",
  },
];

export type BuildLogEntry = {
  /** Issue label, e.g. "No. 14". */
  issue: string;
  date: string;
  title: string;
  summary: string;
  items: { kind: "Shipped" | "Learned" | "Fixed"; text: string }[];
};

/**
 * What we built for clients, anonymised. Published as a build log rather than a
 * changelog because there is no product to release — only the next piece of
 * work that went into production.
 */
export const buildLog: BuildLogEntry[] = [
  {
    issue: "No. 18",
    date: "2026-09-02",
    title: "A voice agent that books jobs for a 14-van plumbing firm",
    summary:
      "Calls answered in under two seconds, jobs qualified against the owner's own rules, and the office no longer rings anyone back at 9pm.",
    items: [
      { kind: "Shipped", text: "Voice agent answering after-hours calls, with emergency triage and postcode-based routing" },
      { kind: "Shipped", text: "Booking straight into the same diary the office uses, with a text confirmation" },
      { kind: "Learned", text: "The hardest part was not the voice, it was the owner trusting it with the emergency criteria" },
      { kind: "Fixed", text: "Two early versions booked jobs outside the service radius — now checked against postcode before confirmation" },
    ],
  },
  {
    issue: "No. 17",
    date: "2026-08-06",
    title: "Invoice processing for an accountancy practice, down to exceptions only",
    summary:
      "Around 600 supplier invoices a month read, coded and filed. A person now checks eleven on a bad day instead of all of them.",
    items: [
      { kind: "Shipped", text: "Extraction of supplier, date, totals, VAT and line items from PDFs, scans and photographs" },
      { kind: "Shipped", text: "Coding against the practice's own nominal ledger rules, with a review queue" },
      { kind: "Learned", text: "Photographed invoices from phones were the real quality test — not the tidy PDFs" },
      { kind: "Fixed", text: "Duplicate detection now catches the same invoice arriving by email and by post" },
    ],
  },
  {
    issue: "No. 16",
    date: "2026-07-09",
    title: "Quote-to-job automation for a commercial fit-out contractor",
    summary:
      "Eleven handovers between the estimate, the job sheet, the supplier order and the invoice, replaced by one flow with an owner on each step.",
    items: [
      { kind: "Shipped", text: "Quote approval routing to the right director based on value and margin" },
      { kind: "Shipped", text: "Accepted quotes raise the job, the purchase orders and the deposit invoice automatically" },
      { kind: "Learned", text: "The stage before the build (mapping the exceptions) took longer than the build itself" },
      { kind: "Fixed", text: "Variations are now recorded against the job rather than lost in email threads" },
    ],
  },
  {
    issue: "No. 15",
    date: "2026-06-11",
    title: "Morning brief for the owner of a veterinary group",
    summary:
      "One message at 7am: yesterday's takings, the diary for today, the four clients who need a decision, and anything that has gone quiet.",
    items: [
      { kind: "Shipped", text: "Numbers joined from the practice system, the accounts package and the card terminal" },
      { kind: "Shipped", text: "Plain-language summary with each figure traceable to its source system" },
      { kind: "Learned", text: "He reads the first three lines and nothing else — so the ordering of those lines is the product" },
      { kind: "Fixed", text: "Early version reported takings before the overnight settlement; now confirms the batch has closed" },
    ],
  },
];

export const guides = [
  {
    slug: "automation-audit-checklist",
    title: "The one-page automation audit",
    summary:
      "A single sheet that takes an hour to fill in and tells you which of your repetitive tasks is worth automating first.",
    format: "Worksheet · 2 pages",
    category: "Getting started",
  },
  {
    slug: "cost-of-manual-work",
    title: "What the manual work actually costs you",
    summary:
      "How to put a number on the copying, chasing and retyping your team does every week, in a way your accountant would accept.",
    format: "Guide · 14 pages",
    category: "Business case",
  },
  {
    slug: "choosing-an-ai-agency",
    title: "Ten questions to ask an AI agency",
    summary:
      "Including the four that most agencies cannot answer, and what a good answer sounds like.",
    format: "Checklist · 6 pages",
    category: "Buying",
  },
  {
    slug: "ai-policy-for-small-business",
    title: "An AI policy for a business without a compliance team",
    summary:
      "Two pages your team will actually read: what the tools may touch, what they may never touch, and who to ask.",
    format: "Template · 3 pages",
    category: "Risk",
  },
  {
    slug: "customer-reply-playbook",
    title: "The reply playbook for enquiries",
    summary:
      "The twelve messages that cover most customer questions, written out properly, so an agent can learn them and a person can improve them.",
    format: "Playbook · 9 pages",
    category: "Customers",
  },
  {
    slug: "handover-checklist",
    title: "The three-week absence test",
    summary:
      "A checklist that proves your business still runs when you are not answering your phone.",
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
      {
        h: "What we collect",
        p: "Contact details you give us (name, business, email), the project information you share during an audit, and technical logs from the systems we are given access to in order to build and monitor your automations.",
      },
      {
        h: "Why we process it",
        p: "To deliver the work you engaged us for, to secure it, to answer you when you contact us, and to meet our legal obligations. We do not sell personal data and we do not use your business data to train models.",
      },
      {
        h: "Your customers' data",
        p: "Where an automation touches information about your customers, you remain the controller and Reygent is the processor. We act only on your documented instructions, under a data processing agreement, and we delete working copies when the engagement ends.",
      },
      {
        h: "Where the data lives",
        p: "Automations run in accounts and infrastructure you control wherever practical. Where we host a component ourselves, it runs in the UK or EU, and the region is agreed with you in writing before the build starts.",
      },
      {
        h: "Retention",
        p: "Project documentation is kept for the life of the relationship and for six years afterwards, which is what our insurers and accountants require. Operational data flowing through your automations is retained in your own systems, not ours.",
      },
      {
        h: "Your rights",
        p: "Access, correction, deletion, portability and objection. Requests to privacy@reygent.ai are answered within 30 days, and usually much sooner.",
      },
    ],
  },
  terms: {
    title: "Terms of service",
    updated: "2026-08-01",
    intro:
      "The agreement between your business and Reygent covering audits, build projects and the managed retainer. Plain-language summary first, full terms below.",
    sections: [
      {
        h: "What we are engaged to do",
        p: "Each engagement is defined by a written scope: the process, the systems involved, the deliverables and the fixed price. Anything not in that scope is a change, agreed in writing before it is built.",
      },
      {
        h: "Our commitments",
        p: "We deliver the agreed scope to the agreed standard, keep you informed of progress and risk, monitor what we build, and tell you promptly when something is wrong — including when the fault is ours.",
      },
      {
        h: "Fees and billing",
        p: "Audits are billed on delivery. Build projects are billed against milestones, with the final stage invoiced after acceptance testing. Managed AI retainers are billed monthly in advance and cancellable with 30 days' notice.",
      },
      {
        h: "Who owns what",
        p: "You own the automations, the prompts, the documentation and the accounts they run in. We retain the right to reuse generic patterns and know-how, but never your data, your processes as documented for you, or anything client-specific.",
      },
      {
        h: "Access and cooperation",
        p: "We need timely access to the systems in scope and a named person on your side who can make decisions. Delays in either affect the schedule, and we will flag that in writing rather than absorbing it silently.",
      },
      {
        h: "Liability",
        p: "Our aggregate liability is limited to the fees paid for the engagement in question. Nothing limits liability for gross negligence, wilful misconduct or breach of confidentiality. We are insured, and the certificate is available on request.",
      },
    ],
  },
  security: {
    title: "Security & data handling",
    updated: "2026-08-01",
    intro:
      "You are handing an outside party access to the systems your business runs on. That deserves specifics rather than adjectives.",
    sections: [
      {
        h: "Least privilege, always",
        p: "We request the narrowest scopes an integration needs, use separate credentials per client, never share credentials between engagements, and you can revoke our access at any point without asking us.",
      },
      {
        h: "Encryption",
        p: "TLS in transit and encryption at rest for anything we host. Secrets are held in a managed secret store, never in code, tickets or chat, and are rotated when a project ends.",
      },
      {
        h: "Model providers",
        p: "Where a hosted model is used, we use providers with data-processing terms that exclude training on your content, and we tell you which provider is in the path of any given automation. Where data cannot leave your environment, we build that way instead.",
      },
      {
        h: "Human oversight",
        p: "Agents operate inside rules agreed with you, escalate anything outside them, and keep a full audit trail: what was received, what was decided, what was sent, and which record it came from.",
      },
      {
        h: "Monitoring and incident response",
        p: "Every automation reports its own health. You hear from us about a failure before you would have noticed it, and we have a documented response plan with defined severities and a named contact.",
      },
      {
        h: "Our own housekeeping",
        p: "Multi-factor authentication on every account we use, access reviewed when people leave, dependency scanning in our builds, and a documented patch policy with severity-based timelines.",
      },
      {
        h: "Testing and disclosure",
        p: "Annual third-party penetration test of anything we host, a security contact for researchers, and a coordinated disclosure policy. Reports available under NDA.",
      },
      {
        h: "Compliance paperwork",
        p: "A GDPR-aligned data processing agreement, a sub-processor list and questionnaire responses are available now. Certification work for our hosted components is in progress with a published timeline.",
      },
    ],
  },
};

export const startupsProgram = {
  headline: "A fixed-price first automation for businesses under three years old",
  summary:
    "New businesses have an advantage: no inherited process, no legacy systems, and no committee. What they do not have is a spare £20,000. The Founders Programme is a smaller, fixed-scope version of our first build, priced for a business that is still proving itself.",
  benefits: [
    {
      title: "One process, fixed price",
      body: "Pick the one thing taking the most time this quarter. We scope it small, price it at £4,500, and build it in three weeks.",
    },
    {
      title: "The audit is included",
      body: "A shortened version of our full audit, so you still get the ranked list of what to automate second and third.",
    },
    {
      title: "Built to hand over",
      body: "Documented and running in your own accounts, so it grows with you rather than becoming a dependency on us.",
    },
    {
      title: "Room to expand",
      body: "Upgrade to a full build at any point and we credit the programme fee against it.",
    },
  ],
};

export const partnersProgram = {
  headline: "For accountants, IT providers and business advisers",
  summary:
    "You already sit in front of business owners describing the same problems we automate. Partners introduce an audit, we deliver it under our own name or yours, and you share in the work that follows.",
  benefits: [
    {
      title: "15% of the first project",
      body: "Paid when the build is signed, with an ongoing share on any retainer that follows it.",
    },
    {
      title: "An audit you can put your name to",
      body: "We run it, you receive the document and can present it to your client yourselves.",
    },
    {
      title: "We never poach your client",
      body: "Everything after the automation goes back through you. That is contractual, not a promise.",
    },
    {
      title: "Plain-language collateral",
      body: "Explanations of what is worth automating, written so you can forward them without rewriting them.",
    },
  ],
  steps: [
    { title: "Talk", body: "Thirty minutes about the clients you advise and where automation comes up." },
    { title: "Introduce", body: "You introduce us, or we work under your brand — your choice, per client." },
    { title: "Deliver together", body: "We run the audit and build; you keep the relationship and the credit." },
    { title: "Share", body: "You are paid on signature, and on the retainer for as long as it runs." },
  ],
};

export const siteStats = [
  { value: "40+", label: "Businesses built for", detail: "Owner-run, between 5 and 200 people" },
  { value: "6", label: "Processes we automate most", detail: "Enquiries, quotes, invoices, onboarding, scheduling, reporting" },
  { value: "4–6 wks", label: "Audit to live agent", detail: "Typical time from first call to production" },
  { value: "100%", label: "Of the build is yours", detail: "Code, prompts, documentation and accounts" },
];
