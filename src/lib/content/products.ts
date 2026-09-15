/**
 * The five-module product architecture.
 * Intake → Engage → Deliver → Insight, on top of one Foundation layer.
 */

export type ProductFeature = {
  title: string;
  body: string;
  /** Lucide icon name resolved in the UI layer. */
  icon: string;
};

export type ProductTab = {
  index: string;
  title: string;
  body: string;
  /** Rendered as a mock interface panel. */
  panel: "alerts" | "brief" | "answer";
};

export type Product = {
  slug: "intake" | "engage" | "deliver" | "insight" | "foundation";
  name: string;
  kicker: string;
  headline: string;
  /** One sentence that survives being read alone. */
  summary: string;
  /** Product-page hero paragraph. */
  intro: string;
  accent: "ink" | "tangerine" | "jade" | "azure" | "magenta";
  icon: string;
  features: ProductFeature[];
  flow: { step: string; detail: string }[];
  outcomes: string[];
  panelCaption: string;
  tabs?: ProductTab[];
  /** Shown on the homepage product strip. */
  home: {
    title: string;
    body: string;
    bullets: string[];
    screen: "intake" | "engage" | "deliver" | "insight";
  };
};

export const products: Product[] = [
  {
    slug: "intake",
    name: "Intake",
    kicker: "Capture · Qualify · Route",
    headline: "Every enquiry becomes one record, with an owner and a next step.",
    summary:
      "Enquiries from every channel land in one place, are qualified the same way each time, and reach the right person with context attached.",
    intro:
      "Firms rarely lose work because nobody cared. They lose it in the gap between an enquiry arriving and somebody owning it. Intake closes that gap: one record per opportunity, one qualification standard, one owner, one next step.",
    accent: "ink",
    icon: "Inbox",
    features: [
      {
        title: "One front door",
        body: "Web forms, shared inboxes, referral emails, phone notes and existing-client requests all create the same structured record.",
        icon: "DoorOpen",
      },
      {
        title: "Consistent qualification",
        body: "Fit, matter type, urgency, conflict flags and budget are assessed against your own criteria, not an individual's memory.",
        icon: "ListChecks",
      },
      {
        title: "Routing with context",
        body: "Assignment follows your rules — practice area, seniority, capacity, geography — with the full enquiry attached.",
        icon: "Route",
      },
      {
        title: "Nothing unowned",
        body: "A record cannot sit without an owner or a dated next step. Ageing work surfaces itself before it becomes a complaint.",
        icon: "ShieldCheck",
      },
      {
        title: "Enrichment on arrival",
        body: "Company size, sector, website and any prior relationship are filled in automatically so nobody researches twice.",
        icon: "Sparkles",
      },
      {
        title: "Source attribution",
        body: "Every channel is measured, so you learn which referral source actually converts rather than which one feels busiest.",
        icon: "PieChart",
      },
    ],
    flow: [
      { step: "Capture", detail: "All channels to one record" },
      { step: "Qualify", detail: "Fit, urgency, conflict" },
      { step: "Route", detail: "Owner + seniority rules" },
      { step: "Respond", detail: "First reply, on brand" },
    ],
    outcomes: [
      "Nothing unowned or unanswered",
      "One definition of a qualified enquiry",
      "Response time you can measure",
    ],
    panelCaption: "Intake queue — every enquiry with owner, source and ageing",
    home: {
      title: "Generate more of the work worth having.",
      body: "One record for every enquiry, qualified against your own criteria and routed to the right person with the full context attached.",
      bullets: ["Multi-channel capture", "Qualification rules", "Owner assignment"],
      screen: "intake",
    },
  },
  {
    slug: "engage",
    name: "Engage",
    kicker: "Trigger · Personalise · Escalate",
    headline: "Follow-through that runs until there is a decision.",
    summary:
      "Sequences triggered by real events, written in your firm's voice, that escalate when something has genuinely gone quiet.",
    intro:
      "Follow-up fails quietly. A partner means to reply, a week passes, the prospect engages someone else. Engage runs the cadence on triggers and dates rather than memory — and tells you when a sequence needs a human.",
    accent: "tangerine",
    icon: "Send",
    features: [
      {
        title: "Event triggers",
        body: "A document opened, a proposal sent, a matter closed, an anniversary reached — the sequence starts on the event, not a reminder list.",
        icon: "Zap",
      },
      {
        title: "Contextual drafts",
        body: "Messages are drafted from the record: what was discussed, what was promised, what happens next. Partners edit rather than compose.",
        icon: "PenLine",
      },
      {
        title: "Firm-wide cadence",
        body: "Standard sequences for enquiries, proposals, dormant clients and referrals, so every relationship gets the same discipline.",
        icon: "CalendarClock",
      },
      {
        title: "Escalation",
        body: "Silence past a threshold raises a task for a named person and shows what was already tried, so nobody repeats a touch.",
        icon: "BellRing",
      },
      {
        title: "Quiet-hours control",
        body: "Send windows, working days and per-contact preferences are respected without anyone tracking time zones by hand.",
        icon: "Moon",
      },
      {
        title: "Reply intelligence",
        body: "Replies stop the sequence, capture the intent, and create the next task or appointment automatically.",
        icon: "MessageSquareReply",
      },
    ],
    flow: [
      { step: "Trigger", detail: "Event or elapsed time" },
      { step: "Draft", detail: "From the record, not a template" },
      { step: "Remind", detail: "Cadence holds" },
      { step: "Escalate", detail: "When it stalls" },
    ],
    outcomes: [
      "No relationship goes cold silently",
      "Partners send, not compose",
      "Escalation instead of hope",
    ],
    panelCaption: "Engage — live sequences, reply state and escalation queue",
    home: {
      title: "More conversations, less manual outreach.",
      body: "Sequences triggered by what actually happened, drafted from the record, escalating when a prospect goes quiet.",
      bullets: ["Event triggers", "Contextual drafts", "Escalation rules"],
      screen: "engage",
    },
  },
  {
    slug: "deliver",
    name: "Deliver",
    kicker: "Collect · Assign · Activate",
    headline: "From signed to productive in days, not weeks.",
    summary:
      "Onboarding, document collection, task assignment and engagement delivery run as a defined path instead of a scramble.",
    intro:
      "Week one sets the tone for a client relationship, and it is usually where firms improvise. Collect the right documents once, assign the work, and make progress visible to the client without anyone composing a status email.",
    accent: "jade",
    icon: "FolderCheck",
    features: [
      {
        title: "Onboarding paths",
        body: "Different engagement types get different checklists — audit, advisory, retainer, litigation — with owners and due dates attached.",
        icon: "ListTree",
      },
      {
        title: "Document collection",
        body: "Requests go out with a status per item, chase themselves, and validate before they reach a person.",
        icon: "FileStack",
      },
      {
        title: "Task assignment",
        body: "Work lands with the right person and the right deadline, with dependencies visible rather than assumed.",
        icon: "UserCheck",
      },
      {
        title: "Client portal",
        body: "A branded space where clients upload, approve and track status without emailing to ask where things stand.",
        icon: "LayoutPanelTop",
      },
      {
        title: "Handover records",
        body: "Every engagement carries its own history, so cover for absence and handover do not depend on a conversation.",
        icon: "ArrowLeftRight",
      },
      {
        title: "Delivery signals",
        body: "Budget burn, deadline risk and scope change flag early, while there is still room to do something about them.",
        icon: "Activity",
      },
    ],
    flow: [
      { step: "Collect", detail: "Documents + data" },
      { step: "Validate", detail: "Before it reaches a human" },
      { step: "Assign", detail: "Tasks + owners" },
      { step: "Activate", detail: "Kickoff scheduled" },
    ],
    outcomes: [
      "A repeatable week one",
      "Documents collected once",
      "Clients who can self-serve status",
    ],
    panelCaption: "Deliver — onboarding checklist across active engagements",
    home: {
      title: "Win the work, then run it properly.",
      body: "Onboarding paths, document collection and task assignment that hold their shape under pressure, plus a portal your clients can check themselves.",
      bullets: ["Onboarding paths", "Document chasing", "Client portal"],
      screen: "deliver",
    },
  },
  {
    slug: "insight",
    name: "Insight",
    kicker: "Collect · Reconcile · Deliver",
    headline: "Numbers you can act on, produced before the meeting.",
    summary:
      "Operational reporting assembled from live data on a schedule, with forecasting and review grounded in what actually happened.",
    intro:
      "Most firm reporting is reconstruction: someone exports, cleans and re-types numbers until they agree. Insight builds the report from the operating record, so the number in the deck is the number in the system.",
    accent: "azure",
    icon: "ChartNoAxesCombined",
    features: [
      {
        title: "Scheduled reports",
        body: "Weekly pipeline, monthly utilisation, matter profitability and referral performance delivered without anyone assembling them.",
        icon: "CalendarCheck",
      },
      {
        title: "One definition per metric",
        body: "Agreed metric definitions live in the platform, so two teams cannot report the same word with two numbers.",
        icon: "Ruler",
      },
      {
        title: "Forecast on evidence",
        body: "Pipeline forecasts weight by stage behaviour and actual conversion, not by optimism in the review meeting.",
        icon: "TrendingUp",
      },
      {
        title: "Risk surfacing",
        body: "Stalled engagements, ageing enquiries, at-risk clients and margin slippage are named, with the reason attached.",
        icon: "TriangleAlert",
      },
      {
        title: "Review context",
        body: "Each review pack arrives with the calls, emails and records behind the numbers, so the discussion is about decisions.",
        icon: "MessagesSquare",
      },
      {
        title: "Where the team spends time",
        body: "See which work is genuinely profitable and which is quietly subsidised by the people doing it.",
        icon: "Clock",
      },
    ],
    flow: [
      { step: "Collect", detail: "From the memory layer" },
      { step: "Reconcile", detail: "One definition per metric" },
      { step: "Summarise", detail: "Written for decisions" },
      { step: "Deliver", detail: "On schedule" },
    ],
    outcomes: [
      "Reports that arrive by themselves",
      "Forecasts grounded in behaviour",
      "Margin you can actually see",
    ],
    panelCaption: "Insight — pipeline, utilisation and risk in one review pack",
    home: {
      title: "Numbers you can actually trust.",
      body: "Reporting, forecasting and review packs assembled from the operating record, so the meeting is about decisions rather than data collection.",
      bullets: ["Scheduled packs", "Evidence-based forecast", "Risk surfacing"],
      screen: "insight",
    },
  },
  {
    slug: "foundation",
    name: "Foundation",
    kicker: "One memory layer",
    headline: "One source of truth, where context compounds.",
    summary:
      "Every interaction, document and record lives in a single memory layer, so the platform reasons over the whole relationship instead of a fragment.",
    intro:
      "Point tools each see a slice: the CRM sees fields, the inbox sees threads, the document store sees files. Foundation is the layer underneath all of them, so context accumulates on the client rather than scattering across five systems.",
    accent: "magenta",
    icon: "Layers",
    features: [
      {
        title: "Client memory",
        body: "Emails, meetings, documents, tasks, notes and billing attach to one record and stay there, whoever leaves.",
        icon: "BrainCircuit",
      },
      {
        title: "Ask Reygent",
        body: "Ask a question in plain language about a client, an engagement or the whole book. Answers cite the email or call they came from.",
        icon: "Sparkles",
      },
      {
        title: "Runs where you work",
        body: "The same cited answers in the web app and in your messaging tool, so people do not have to change habits to benefit.",
        icon: "Slack",
      },
      {
        title: "Custom records",
        body: "Model the things your firm actually tracks — matters, trusts, filings, retainers — without a six-month configuration project.",
        icon: "Blocks",
      },
      {
        title: "Workflow automation",
        body: "Describe the rule in plain language; the platform builds it, and you can read it back later when someone asks why it fired.",
        icon: "Workflow",
      },
      {
        title: "Migration that holds",
        body: "Import from spreadsheets, a previous CRM or a practice system, with relationships and history intact.",
        icon: "Upload",
      },
    ],
    flow: [
      { step: "Connect", detail: "Tools you already run" },
      { step: "Unify", detail: "One record per client" },
      { step: "Reason", detail: "Across the whole history" },
      { step: "Act", detail: "With citations" },
    ],
    outcomes: [
      "Context that compounds",
      "Answers with sources attached",
      "One system of record, not five",
    ],
    panelCaption: "Foundation — the memory layer behind every module",
    tabs: [
      {
        index: "01",
        title: "Ask across the book",
        body: "Which engagements are at risk this quarter, and why? Reygent names them, with the reason and the record it came from.",
        panel: "alerts",
      },
      {
        index: "02",
        title: "Get the brief before the call",
        body: "A client brief assembled from every thread, document and matter — pricing history, open issues, what was promised and by whom.",
        panel: "brief",
      },
      {
        index: "03",
        title: "Learn from what worked",
        body: "Ask which approach won similar engagements and get the actual steps a colleague used, not a best-practice platitude.",
        panel: "answer",
      },
    ],
    home: {
      title: "Built on one source of truth.",
      body: "Every interaction, workflow and record lives in a single memory layer, so context compounds instead of scattering across tools.",
      bullets: ["Client memory", "Ask Reygent", "Custom records"],
      screen: "intake",
    },
  },
];

export const productBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product]),
) as Record<Product["slug"], Product>;

/** The four connected modules, in operational order. */
export const modules = products.filter((product) => product.slug !== "foundation");
export const foundation = products.find((product) => product.slug === "foundation")!;
