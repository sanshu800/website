/**
 * What we build.
 *
 * Five services. Four of them are things a business buys once and runs; the
 * fifth is the ongoing relationship that keeps the other four working.
 */

export type ServiceFeature = {
  title: string;
  body: string;
  /** Lucide icon name resolved in the UI layer. */
  icon: string;
};

export type Service = {
  slug:
    | "ai-agents"
    | "workflow-automation"
    | "document-ai"
    | "ai-insights"
    | "managed-ai";
  name: string;
  kicker: string;
  headline: string;
  /** One sentence that survives being read alone. */
  summary: string;
  /** Service-page hero paragraph. */
  intro: string;
  accent: "ink" | "tangerine" | "jade" | "azure" | "magenta";
  icon: string;
  features: ServiceFeature[];
  flow: { step: string; detail: string }[];
  outcomes: string[];
  panelCaption: string;
  /** Shown on the homepage service strip. */
  home: {
    title: string;
    body: string;
    bullets: string[];
    screen: "intake" | "engage" | "deliver" | "insight";
  };
};

export const services: Service[] = [
  {
    slug: "ai-agents",
    name: "Answer every enquiry",
    kicker: "Answer · Qualify · Book · Follow up",
    headline: "An assistant that answers every enquiry like your best member of staff.",
    summary:
      "Answers on voice, email, chat and message in seconds, asks the right questions, books the appointment and passes it to a person when it matters.",
    intro:
      "Most businesses do not lose work because nobody cared. They lose it in the gap between an enquiry arriving and somebody replying. We close that gap permanently: every enquiry answered instantly, in your voice, following your rules, with a real appointment in the diary instead of a promise to call back.",
    accent: "ink",
    icon: "Bot",
    features: [
      {
        title: "Answers in seconds, not days",
        body: "Every channel — phone, web form, email, WhatsApp, chat — gets a reply immediately, including nights and weekends. The person enquiring is still at their desk.",
        icon: "Zap",
      },
      {
        title: "Qualifies against your criteria",
        body: "Budget, timing, location, job type, urgency: your questions, asked in the same order every time, with the lead scored and the reason given.",
        icon: "ListChecks",
      },
      {
        title: "Books real appointments",
        body: "It reads your live calendar, offers slots that actually exist, confirms, and sends the reminder. No double bookings, no diary admin.",
        icon: "CalendarCheck",
      },
      {
        title: "Sounds like your business",
        body: "Trained on your website, price list, service terms and past messages. It uses your language, and it never invents a price you have not approved.",
        icon: "MessageSquareQuote",
      },
      {
        title: "Escalates to a human properly",
        body: "Complaints, legal questions, a frustrated tone, or a request it is not confident about go straight to a named person with the whole conversation attached.",
        icon: "UserCheck",
      },
      {
        title: "Every conversation on the record",
        body: "Full transcript, what was promised, and what happens next. Nothing lives in someone's memory or a personal phone.",
        icon: "NotebookText",
      },
    ],
    flow: [
      { step: "Enquiry", detail: "Any channel, any hour" },
      { step: "Qualify", detail: "Your questions, your rules" },
      { step: "Book", detail: "Live calendar, real slots" },
      { step: "Handover", detail: "A person, with full context" },
    ],
    outcomes: [
      "Every enquiry answered, including out of hours",
      "Appointments confirmed while the interest is warm",
      "Your team only speaks to people worth speaking to",
    ],
    panelCaption: "Enquiry inbox — every conversation with status, owner and next step",
    home: {
      title: "Never lose another enquiry to a slow reply.",
      body: "Every channel answered instantly, your qualifying questions asked, the appointment booked, and the good ones handed to a person with the transcript attached.",
      bullets: ["Voice, email and chat", "Qualification rules", "Calendar booking"],
      screen: "intake",
    },
  },
  {
    slug: "workflow-automation",
    name: "Remove the manual admin",
    kicker: "Connect · Move · Approve · Notify",
    headline: "The copying and pasting between your systems, gone.",
    summary:
      "We map how work actually moves through your business, then automate the handovers — so information flows between the tools you already pay for without anyone retyping it.",
    intro:
      "Nobody joins a business to move data from an inbox into a spreadsheet. That work is invisible on any report, it grows as you grow, and it is where mistakes get made. We automate the handovers rather than replacing the systems, so your team keeps the tools they know and stops being the integration between them.",
    accent: "tangerine",
    icon: "Workflow",
    features: [
      {
        title: "We map it before we automate it",
        body: "Two weeks with the people who actually do the work, including the exceptions nobody wrote down. Automating a broken process just makes it faster.",
        icon: "Map",
      },
      {
        title: "Your systems stay as they are",
        body: "No migration, no rip-and-replace, no retraining week. We connect the CRM, inbox, ledger, spreadsheets and portals you already run.",
        icon: "Plug",
      },
      {
        title: "Handovers that cannot be dropped",
        body: "A job moves to the next step only when the previous one is actually complete, with an owner and a deadline stamped on it.",
        icon: "ArrowLeftRight",
      },
      {
        title: "Approvals where they belong",
        body: "Spend over a threshold, a discount, a contract going out: routed to the right person with the numbers already attached.",
        icon: "Stamp",
      },
      {
        title: "Failure is loud, not silent",
        body: "If a step fails, the person responsible is told the same minute, with what to do about it. No more discovering a month later that nothing synced.",
        icon: "Siren",
      },
      {
        title: "Reporting that writes itself",
        body: "Because the work now moves through a system, the weekly numbers are a by-product rather than a Friday afternoon.",
        icon: "FileSpreadsheet",
      },
    ],
    flow: [
      { step: "Shadow", detail: "Watch the real process" },
      { step: "Map", detail: "Steps, owners, exceptions" },
      { step: "Automate", detail: "Handovers and approvals" },
      { step: "Measure", detail: "Hours saved, weekly" },
    ],
    outcomes: [
      "Hours back every week, counted rather than guessed",
      "Fewer mistakes from retyped data",
      "A process that still works when someone is on holiday",
    ],
    panelCaption: "Automation runs — every step, its owner and where it is stuck",
    home: {
      title: "Stop paying people to be your integration.",
      body: "We map the real process — including the exceptions — then automate the handovers between the systems you already use, with approvals and alerts built in.",
      bullets: ["Process mapping", "Two-way sync", "Approvals and alerts"],
      screen: "engage",
    },
  },
  {
    slug: "document-ai",
    name: "Process the paperwork",
    kicker: "Read · Extract · File · Find",
    headline: "Every invoice, contract and form read and filed before you get to it.",
    summary:
      "Documents arrive in every format and every state of tidiness. We build systems that read them, pull out the numbers that matter, file them correctly and make the whole archive searchable.",
    intro:
      "If your business runs on paperwork, the paperwork is the bottleneck. Somebody has to open it, work out what it is, find the reference number, type it into the right field and put it where it can be found again. That is exactly the kind of work AI does reliably now — with a person checking the exceptions rather than the routine.",
    accent: "jade",
    icon: "FileScan",
    features: [
      {
        title: "Any format, however it arrives",
        body: "PDFs, scans, photographs of paper, email attachments, supplier portals. If a person can read it, the system can read it.",
        icon: "Files",
      },
      {
        title: "The fields you actually need",
        body: "Supplier, date, line items, totals, tax, contract dates, renewal terms. Validated against the reference data and flagged when something does not add up.",
        icon: "TableProperties",
      },
      {
        title: "Filed where it belongs",
        body: "Named and stored according to your convention, attached to the right record, and sent to the right person or ledger.",
        icon: "FolderTree",
      },
      {
        title: "Searchable for the first time",
        body: "Ask a question in plain language and get the document, the page and the clause — across years of archive nobody could search before.",
        icon: "SearchCheck",
      },
      {
        title: "A person checks exceptions, not everything",
        body: "Confidence thresholds are yours. Anything below them goes to a review queue with the uncertainty highlighted instead of hidden.",
        icon: "CircleAlert",
      },
      {
        title: "Audit trail by default",
        body: "Every extraction keeps the source page and the value it produced, so the number on the report can always be traced back to the paper.",
        icon: "History",
      },
    ],
    flow: [
      { step: "Arrive", detail: "Email, scan, portal, upload" },
      { step: "Read", detail: "Extract the real fields" },
      { step: "Check", detail: "Only the exceptions" },
      { step: "File", detail: "Named, linked, searchable" },
    ],
    outcomes: [
      "Days of admin a month turned into minutes of checking",
      "Numbers you can trace back to the source document",
      "An archive you can actually search",
    ],
    panelCaption: "Document queue — what was read, what needs a human eye",
    home: {
      title: "Paperwork that processes itself.",
      body: "Invoices, contracts, forms and scans read automatically, the important fields extracted and validated, and anything unusual queued for a person to check.",
      bullets: ["Extraction", "Validation", "Filing and search"],
      screen: "deliver",
    },
  },
  {
    slug: "ai-insights",
    name: "Report on the business",
    kicker: "Ask · Understand · Predict · Report",
    headline: "Ask your business a question in plain English and get a straight answer.",
    summary:
      "We pull your numbers into one place and put language on top of it — so you can ask what is happening, why, and what to do next without waiting for a report.",
    intro:
      "Most owners have plenty of data and no time to read it. The information that would change a decision is usually spread across an accounting package, a CRM, a spreadsheet and somebody's head. We join it up, then give you one place to ask questions and get answers you can act on — with the workings shown.",
    accent: "azure",
    icon: "BarChart3",
    features: [
      {
        title: "One honest version of the numbers",
        body: "Revenue, margin, pipeline, utilisation, stock, churn — defined once and agreed, rather than a different figure in every meeting.",
        icon: "Scale",
      },
      {
        title: "Ask in your own words",
        body: "\"Which customers have gone quiet?\" \"What did we make on that job?\" Type it, get the answer and the rows behind it.",
        icon: "MessageCircleQuestion",
      },
      {
        title: "Told before you ask",
        body: "A short morning summary and a weekly review: what moved, what stalled, what needs a decision today.",
        icon: "BellRing",
      },
      {
        title: "Forecasts with the assumptions visible",
        body: "Cash, demand and capacity projections that show what they assume, so you can change an assumption and see the effect.",
        icon: "TrendingUp",
      },
      {
        title: "Cost per job, per client, per person",
        body: "The profitability question most businesses cannot answer accurately, answered from the records rather than a rough recollection.",
        icon: "Calculator",
      },
      {
        title: "Reports that go out on their own",
        body: "The board pack, the investor update, the client summary: generated on schedule, formatted, and sent to the people expecting them.",
        icon: "Send",
      },
    ],
    flow: [
      { step: "Connect", detail: "Ledger, CRM, ops, sheets" },
      { step: "Define", detail: "One agreed set of metrics" },
      { step: "Ask", detail: "Plain questions, cited answers" },
      { step: "Decide", detail: "Alerts and scheduled reports" },
    ],
    outcomes: [
      "Decisions made in the morning, not next month",
      "One definition of profit everyone accepts",
      "Reports that arrive without anyone assembling them",
    ],
    panelCaption: "Insight — pipeline, margin and risk in one review pack",
    home: {
      title: "Know what is going on, without reading a dashboard.",
      body: "Your systems joined into one set of numbers you can question in plain English, with alerts when something important moves and reports that send themselves.",
      bullets: ["One set of metrics", "Plain-language questions", "Scheduled reporting"],
      screen: "insight",
    },
  },
  {
    slug: "managed-ai",
    name: "Keep it running",
    kicker: "Run · Monitor · Improve · Support",
    headline: "We stay on after launch, so it keeps working when your business changes.",
    summary:
      "Price lists change, suppliers change, staff change, and the tools underneath us change too. Our support retainer is what keeps everything we built accurate, monitored and supported.",
    intro:
      "Most automation does not fail dramatically. It drifts: a price goes stale, a supplier changes format, a new starter is not in the routing rules, and one day the thing that used to save a day a week is quietly wrong. We monitor what we build, fix it before you notice, and keep improving it as the business moves.",
    accent: "magenta",
    icon: "LifeBuoy",
    features: [
      {
        title: "Monitored, not assumed",
        body: "Everything we build reports its own health. Failures, slowdowns and odd outputs reach us before they reach your customers.",
        icon: "Activity",
      },
      {
        title: "Kept accurate as you change",
        body: "New price list, new services, new staff, new location: we update the knowledge and rules as part of the retainer, not as a change request.",
        icon: "RefreshCw",
      },
      {
        title: "Continuously improved",
        body: "A monthly review of what went wrong and what your team is still doing by hand, with a short list of what to fix next.",
        icon: "TrendingUp",
      },
      {
        title: "Support your team will actually use",
        body: "A named person who knows your setup, a shared channel, and an agreed response time. Not a ticket number in a queue.",
        icon: "Headphones",
      },
      {
        title: "Model changes without drama",
        body: "New models arrive constantly. We test them against your real cases and move you when the answer is better — not on a vendor's timetable.",
        icon: "TestTubes",
      },
      {
        title: "You own everything, always",
        body: "Code, prompts, documentation and accounts are yours. The retainer is for expertise and attention, never as a hostage.",
        icon: "KeyRound",
      },
    ],
    flow: [
      { step: "Monitor", detail: "Health, accuracy, uptime" },
      { step: "Tune", detail: "Knowledge and rules" },
      { step: "Review", detail: "Monthly, with your team" },
      { step: "Extend", detail: "The next process worth doing" },
    ],
    outcomes: [
      "Something that still works a year later",
      "One person who knows your setup",
      "A clear view of what to automate next",
    ],
    panelCaption: "Support — what is running, what needs attention, and what is next",
    home: {
      title: "A partner, not a handover.",
      body: "We monitor what we build, keep it accurate as your business changes, and meet your team every month with what went wrong and what to do next.",
      bullets: ["Monitoring", "Monthly review", "Named support"],
      screen: "intake",
    },
  },
];
