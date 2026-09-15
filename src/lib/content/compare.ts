/**
 * Comparison pages and industry solution pages.
 *
 * Comparisons are written against *approaches* (spreadsheets, a traditional
 * CRM, point tools, hiring, building in-house, the status quo) rather than
 * named competitors. Naming a real company and attributing behaviour to it on
 * a marketing page is a legal risk and reads as insecurity; the category
 * argument is the honest version and the more persuasive one.
 */

export type CompareRow = { dimension: string; them: string; us: string };
export type ComparePoint = { title: string; body: string };

export type Comparison = {
  slug: string;
  /** Short label used in nav and cards. */
  short: string;
  name: string;
  headline: string;
  summary: string;
  /** What the alternative is actually good at — credibility requires this. */
  theirStrength: string;
  theirWeakness: string;
  rows: CompareRow[];
  points: ComparePoint[];
  bestFor: string[];
};

export const comparisons: Comparison[] = [
  {
    slug: "spreadsheets",
    short: "vs. spreadsheets",
    name: "Spreadsheets",
    headline: "Spreadsheets are a fine ledger and a poor operating system.",
    summary:
      "A spreadsheet holds a list. It does not assign work, chase documents, send follow-ups or tell anyone that something has gone quiet. The moment two people need it at once, you are maintaining software by hand.",
    theirStrength:
      "Instant to start, infinitely flexible, and everyone already knows how to use one. For genuinely one-off analysis, nothing beats it.",
    theirWeakness:
      "No triggers, no ownership, no audit trail, and every change is manual. It is a snapshot that starts decaying the moment it is saved.",
    rows: [
      { dimension: "Assignment", them: "A name typed in a cell", us: "Ownership enforced by the record" },
      { dimension: "Follow-up", them: "Conditional formatting and hope", us: "Sequences triggered by events" },
      { dimension: "Documents", them: "Links to a shared drive", us: "Collection, validation and status" },
      { dimension: "History", them: "Overwritten every week", us: "Every interaction retained" },
      { dimension: "Reporting", them: "Rebuilt by hand each period", us: "Scheduled from live data" },
      { dimension: "Handover", them: "Lives with the author", us: "Lives in the record" },
    ],
    points: [
      {
        title: "The spreadsheet is not the problem",
        body: "It is the honest answer to a bad tool market: it does what a practice system will not, for free. The problem is that it becomes the operating system by accident, and then nobody can change the process without breaking the numbers.",
      },
      {
        title: "What you gain in the first month",
        body: "One record per client that every person works from, follow-ups that happen because a rule fired rather than because someone remembered, and a report that is ready before the meeting starts.",
      },
      {
        title: "You do not have to abandon it",
        body: "Import the sheet you already have. Keep read-only exports going wherever an accountant or a regulator expects them. Reygent replaces the workflow, not the audit trail.",
      },
    ],
    bestFor: [
      "Firms where the operational truth lives in three shared workbooks",
      "Anyone who has rebuilt the same report twice this quarter",
      "Practice managers who are the only person who knows how the sheet works",
    ],
  },
  {
    slug: "traditional-crm",
    short: "vs. a traditional CRM",
    name: "A traditional CRM",
    headline: "A CRM asks your team to do data entry. Yours will not.",
    summary:
      "Traditional CRMs are systems of record that depend on people recording. If the record is a chore, the record decays — and every report built on it becomes a negotiation about who actually updated what.",
    theirStrength:
      "Mature, deeply configurable and comfortable for a sales team whose job is measured in pipeline stages. For high-volume transactional sales, they fit.",
    theirWeakness:
      "Professional-services firms do not run transactional sales. Relationships span years, the work is the engagement, and the people who own the relationship are the same people delivering it — they will not stop to type.",
    rows: [
      { dimension: "Data entry", them: "Reps update the record", us: "The record updates itself from email, calls and documents" },
      { dimension: "Shape of the deal", them: "Fixed pipeline stages", us: "Engagements, matters and retainers as your firm defines them" },
      { dimension: "After the sale", them: "Ends at won", us: "Continues through delivery, billing and renewal" },
      { dimension: "Reporting", them: "Pipeline activity", us: "Margin, utilisation and delivery risk" },
      { dimension: "Adoption", them: "A mandate from the top", us: "Useful on day one without a rollout programme" },
      { dimension: "Time to value", them: "A configuration project", us: "Import and work" },
    ],
    points: [
      {
        title: "The adoption problem is the whole problem",
        body: "Every CRM failure in a professional-services firm is the same failure: the system asks for effort that the fee-earner does not have to spare. Machine-captured records remove the incentive to leave it empty.",
      },
      {
        title: "Your pipeline is not a funnel",
        body: "Referral relationships, panel approvals, seasonal compliance work and multi-year retainers do not map onto five tidy stages. Model the thing you actually run.",
      },
      {
        title: "One record from enquiry to invoice",
        body: "The information gathered at intake is the information the delivery team needs, is the basis of the invoice, and is what the review pack reports on. Retyping it three times is the cost you are removing.",
      },
    ],
    bestFor: [
      "Firms with a CRM that the partners describe as 'out of date'",
      "Anyone paying for software that fewer than half the team opens",
      "Operations leads who spend the first week of every month reconciling",
    ],
  },
  {
    slug: "point-solutions",
    short: "vs. point solutions",
    name: "Separate point solutions",
    headline: "A stack of specialists, none of whom can see the client.",
    summary:
      "An intake tool, a scheduler, an e-signature product, a document portal and a reporting add-on. Each is competent. Together they cannot answer the simplest question a partner asks: what is happening with this client?",
    theirStrength:
      "Best-in-class depth in one narrow job, and easy to buy one at a time without a procurement conversation.",
    theirWeakness:
      "Every boundary between two tools is a place where context is lost and a person is doing integration work by hand. The seams are where the work goes missing.",
    rows: [
      { dimension: "Context", them: "One fragment per tool", us: "The whole relationship in one layer" },
      { dimension: "Integration cost", them: "Connectors, webhooks, upkeep", us: "Shared memory layer" },
      { dimension: "Question answering", them: "Search across five systems", us: "Ask once, with citations" },
      { dimension: "Process change", them: "Rebuilt in every tool", us: "Defined once, applied everywhere" },
      { dimension: "Vendors", them: "Five renewals, five roadmaps", us: "One" },
      { dimension: "Ownership", them: "Nobody owns the seams", us: "The platform owns them" },
    ],
    points: [
      {
        title: "Depth is real, coordination is the bottleneck",
        body: "The value of five good tools is capped by the coordination between them — which is a tax paid in partner time, every week, forever.",
      },
      {
        title: "You can keep the tools",
        body: "Reygent runs alongside the systems you already trust, reading and writing to them. Replace the coordination layer first and decide about the rest later.",
      },
      {
        title: "One place the answer lives",
        body: "When someone leaves, or takes parental leave, or covers a matter, the answer should not be 'ask Priya'.",
      },
    ],
    bestFor: [
      "Firms with six subscriptions and no single source of truth",
      "Teams who have tried to automate a handoff and given up",
      "Anyone who has explained the same client history twice in a week",
    ],
  },
  {
    slug: "ops-hire",
    short: "vs. hiring an ops manager",
    name: "Hiring an operations manager",
    headline: "You need the system, not only the person who remembers it.",
    summary:
      "Hiring an operations manager is a good idea. Hiring one to be your process — to remember the follow-ups, chase the documents and assemble the reports — is a single point of failure with a notice period.",
    theirStrength:
      "Judgement, relationships and the ability to handle things no rule anticipated. A good ops manager is transformative.",
    theirWeakness:
      "The repetitive layer consumes their week, so the improvement work never starts. And the knowledge walks out of the building when they do.",
    rows: [
      { dimension: "Repetitive work", them: "Absorbed by one person", us: "Automated and monitored" },
      { dimension: "Judgement work", them: "Squeezed into what is left", us: "Where the role spends its time" },
      { dimension: "Documentation", them: "In their head or a stale wiki", us: "In the process itself" },
      { dimension: "Cover for absence", them: "A difficult week", us: "Nothing changes" },
      { dimension: "Cost", them: "A salary, from day one", us: "A subscription" },
      { dimension: "Departure risk", them: "The process leaves with them", us: "The process stays" },
    ],
    points: [
      {
        title: "Automate the layer, then hire into the role you wanted",
        body: "Firms that automate first hire operations people to improve systems and manage exceptions. Firms that hire first ask that person to be the system.",
      },
      {
        title: "The handover test",
        body: "Ask what happens if your best operations person is unavailable for three weeks. If the honest answer is 'we would cope badly', the process is in the wrong place.",
      },
      {
        title: "This is not an argument against people",
        body: "It is an argument against spending a salary on work software should be doing, and then calling the result a process.",
      },
    ],
    bestFor: [
      "Firms where one person is quietly holding operations together",
      "Anyone who has lost an operations manager and felt the drop",
      "Leaders who want to grow headcount in fee-earning roles instead",
    ],
  },
  {
    slug: "in-house-build",
    short: "vs. building in-house",
    name: "Building it in-house",
    headline: "Your team should not be maintaining your operations platform.",
    summary:
      "You can build this. Some firms should. But the build is the cheap part — the years of upkeep, integration drift, security patches and onboarding documentation are what you are actually buying.",
    theirStrength:
      "Exactly your process, complete control, and no per-seat fee. Genuinely right for firms with unusual regulatory constraints or real engineering capability.",
    theirWeakness:
      "The people who understood it leave. The integrations break when a vendor changes an API. The roadmap becomes maintenance, and improvement stops.",
    rows: [
      { dimension: "Time to first value", them: "Quarters", us: "Days" },
      { dimension: "Ongoing cost", them: "Engineering salaries, permanently", us: "Subscription" },
      { dimension: "Integrations", them: "Built and maintained by you", us: "Maintained by us" },
      { dimension: "Security", them: "Your problem", us: "Our problem, evidenced" },
      { dimension: "Improvement", them: "Competes with maintenance", us: "Continuous" },
      { dimension: "Continuity", them: "Depends on two engineers", us: "Depends on nobody in particular" },
    ],
    points: [
      {
        title: "The honest case for building",
        body: "If your process is a genuine competitive advantage that cannot be expressed in configuration, and you have the team to sustain it, building is rational. Most firms are describing a standard intake and delivery flow with a distinctive vocabulary.",
      },
      {
        title: "Cost is a running number, not a project number",
        body: "A competent internal build costs a fraction of a full-time engineer to maintain, every year, forever — plus the revenue you did not earn while your best people were building software.",
      },
      {
        title: "Start from the process, not the platform",
        body: "If you do build, document the operational model first. That document survives whichever way you decide.",
      },
    ],
    bestFor: [
      "Firms who want to reach for a keyboard before a process map",
      "Boards weighing an internal build against a subscription",
      "Anyone who has maintained a homegrown tool through two staff changes",
    ],
  },
  {
    slug: "status-quo",
    short: "vs. doing nothing",
    name: "Doing nothing",
    headline: "The status quo is not free. It is just invoiced in a different currency.",
    summary:
      "Nothing breaks loudly. Enquiries are slower than they were, senior people spend evenings on admin, and the operating knowledge concentrates in fewer heads each year. Nobody sends you a bill for it.",
    theirStrength:
      "Zero switching cost, zero risk of a bad rollout, and no learning curve. If your firm is genuinely at capacity with ideal clients, waiting is defensible.",
    theirWeakness:
      "The cost arrives as lost work, slower response, rising admin overhead and key-person risk — and it compounds quietly until a departure or a growth push exposes it.",
    rows: [
      { dimension: "Response time", them: "Whatever the week allows", us: "Measured, and improving" },
      { dimension: "Admin load", them: "Grows with headcount", us: "Flat per client" },
      { dimension: "Key-person risk", them: "Increases yearly", us: "Reduced by design" },
      { dimension: "Lost work", them: "Invisible", us: "Attributed to a source" },
      { dimension: "Reporting", them: "Reconstruction", us: "Automated" },
      { dimension: "Growth cost", them: "More people, same process", us: "Same people, better process" },
    ],
    points: [
      {
        title: "Measure it before you change it",
        body: "Time the gap between an enquiry arriving and the first reply. Count how many documents were chased twice last month. The number is usually worse than the partners expect, which is why the conversation is useful even if you never buy anything.",
      },
      {
        title: "Wait for the right reason",
        body: "There are good reasons to wait: a forthcoming merger, a system review in progress, a firm genuinely at capacity. Waiting because the problem is invisible is not one of them.",
      },
      {
        title: "You are already the system",
        body: "Nothing here is a criticism of how the firm copes. It is a case for making the system explicit, so it stops living in the heads of the most conscientious people you employ.",
      },
    ],
    bestFor: [
      "Firms who suspect the friction but have not quantified it",
      "Leaders deciding where the next hire should go",
      "Anyone being asked 'why are we doing it this way?' and not knowing",
    ],
  },
];

export const comparisonBySlug = Object.fromEntries(
  comparisons.map((item) => [item.slug, item]),
) as Record<string, Comparison>;

/* ------------------------------------------------------------------ */
/* Industry solution pages                                            */
/* ------------------------------------------------------------------ */

export type Solution = {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  pressurePoints: { title: string; body: string }[];
  moduleFit: { module: string; href: string; line: string }[];
  metrics: { label: string; value: string }[];
  proof: string;
};

export const solutions: Solution[] = [
  {
    slug: "legal",
    name: "Legal",
    headline: "Intake and matter management for firms where response time wins the work.",
    summary:
      "A firm that replies first usually wins the matter. That makes intake a revenue function, not an admin one — and it means conflict checks, fee arrangements and matter opening cannot be a separate hand-carried process.",
    pressurePoints: [
      { title: "Enquiries arrive faster than they can be triaged", body: "Partner inboxes, a web form nobody owns, and phone notes on paper. The enquiry that is slowest to answer is the one that went elsewhere." },
      { title: "Conflict and intake checks are manual", body: "A search through the client list, a recollection of a former matter, and a decision nobody documents." },
      { title: "Matters open before the admin finishes", body: "Work starts, the file is incomplete, and the engagement letter arrives after the third meeting." },
      { title: "Fee-earners do the chasing", body: "Document requests, reminders and status replies consume hours that should be billable." },
    ],
    moduleFit: [
      { module: "Intake", href: "/products/intake", line: "Every enquiry with owner and ageing, conflict flags before the first call." },
      { module: "Engage", href: "/products/engage", line: "Prospect cadence that does not depend on a partner remembering to follow up." },
      { module: "Deliver", href: "/products/deliver", line: "Matter opening checklists, document collection and a client-facing portal." },
      { module: "Insight", href: "/products/insight", line: "Matter profitability, source conversion and realisation in one pack." },
    ],
    metrics: [
      { label: "Time to first reply", value: "Measured per source" },
      { label: "Conflicts", value: "Flagged at intake" },
      { label: "Matter opening", value: "Checklist-enforced" },
      { label: "Realisation", value: "Reported per matter" },
    ],
    proof: "See how Halloran & Vance replaced three shared inboxes and a spreadsheet with one intake record.",
  },
  {
    slug: "accounting",
    name: "Accounting",
    headline: "Seasonal volume without seasonal chaos.",
    summary:
      "Every firm has a peak where the same requests are made of hundreds of clients at once. The difference between a hard quarter and a bad one is whether that work is a campaign or a manual effort.",
    pressurePoints: [
      { title: "Peak load is a campaign, run warily", body: "The same document request, sent individually, tracked in a spreadsheet, chased by phone." },
      { title: "Chasing consumes the team", body: "Half the client correspondence in any busy period is 'please can you send us…'." },
      { title: "Onboarding restarts every time", body: "A new client relationship begins with the same unanswered questions as the last one." },
      { title: "Margin is invisible until too late", body: "Time overruns on the fixed-fee work nobody flagged in week two." },
    ],
    moduleFit: [
      { module: "Deliver", href: "/products/deliver", line: "Document collection with per-item status and automatic chasing." },
      { module: "Engage", href: "/products/engage", line: "Seasonal campaigns triggered by rules, not by a reminder list." },
      { module: "Intake", href: "/products/intake", line: "New client onboarding that starts consistent and stays consistent." },
      { module: "Insight", href: "/products/insight", line: "Fee recovery and budget burn per engagement, weekly." },
    ],
    metrics: [
      { label: "Documents outstanding", value: "Visible per client" },
      { label: "Chasing", value: "Automated" },
      { label: "Peak load", value: "Scheduled, not survived" },
      { label: "Fixed-fee margin", value: "Flagged mid-engagement" },
    ],
    proof: "See how Brightwell turned month-end from a three-day reconstruction into a scheduled report.",
  },
  {
    slug: "consulting",
    name: "Consulting",
    headline: "Pipeline to engagement, on one record.",
    summary:
      "Consulting firms sell the same capability twice: once to win the work, then again to deliver it. When the two halves live in different tools, the proposal promises something delivery has to rediscover.",
    pressurePoints: [
      { title: "Proposals forget what was promised", body: "The scope agreed on the call, the assumptions made, the results the client expects — reconstructed from memory at the kickoff." },
      { title: "Bench and utilisation are guesses", body: "Who is available in six weeks is answered from three calendars and a conversation." },
      { title: "Delivery knowledge is not reused", body: "Every engagement reinvents a framework the firm has used eleven times before." },
      { title: "Revenue is lumpy and unpredicted", body: "Pipeline is tracked in a document that is edited the morning of the partner meeting." },
    ],
    moduleFit: [
      { module: "Intake", href: "/products/intake", line: "Opportunities qualified against capability and capacity, not enthusiasm." },
      { module: "Engage", href: "/products/engage", line: "Proposal follow-up that runs until there is a decision." },
      { module: "Deliver", href: "/products/deliver", line: "Kickoff from the proposal, with commitments already captured." },
      { module: "Insight", href: "/products/insight", line: "Utilisation, pipeline coverage and margin on one page." },
    ],
    metrics: [
      { label: "Proposal follow-up", value: "Until decision" },
      { label: "Kickoff prep", value: "From the record" },
      { label: "Utilisation", value: "Forward-looking" },
      { label: "Pipeline", value: "Live, not retyped" },
    ],
    proof: "See how Northgate cut kickoff preparation from three days to an hour.",
  },
  {
    slug: "advisory",
    name: "Advisory",
    headline: "Recurring reviews, delivered without the scramble.",
    summary:
      "Advisory work is a promise of rhythm: the quarterly review arrives, with the numbers ready and the client's situation understood. When that promise depends on the week going well, it eventually slips.",
    pressurePoints: [
      { title: "Review prep restarts each cycle", body: "The same numbers pulled from the same places, re-explained from scratch by whoever has time." },
      { title: "Client context lives in one adviser's head", body: "The reason for last quarter's decision is a recollection, not a record." },
      { title: "Value is hard to demonstrate", body: "Time spent is visible; the advice that changed an outcome is not." },
      { title: "Retention depends on the relationship", body: "Which is a problem when the relationship is a single person with a full calendar." },
    ],
    moduleFit: [
      { module: "Engage", href: "/products/engage", line: "Review cycles triggered on schedule, with prep work assigned ahead." },
      { module: "Insight", href: "/products/insight", line: "Client packs assembled from the record before the meeting." },
      { module: "Deliver", href: "/products/deliver", line: "Recommendations tracked to completion, not just delivered." },
      { module: "Foundation", href: "/products/foundation", line: "Every prior conversation available to whoever covers the review." },
    ],
    metrics: [
      { label: "Review prep", value: "Assembled automatically" },
      { label: "Client history", value: "Available to any adviser" },
      { label: "Recommendations", value: "Tracked to completion" },
      { label: "Retention risk", value: "Surfaced early" },
    ],
    proof: "See how Verity Advisors keeps quarterly reviews on schedule across a doubled client base.",
  },
];

export const solutionBySlug = Object.fromEntries(
  solutions.map((solution) => [solution.slug, solution]),
) as Record<string, Solution>;
