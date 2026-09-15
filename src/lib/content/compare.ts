/**
 * Industry pages and approach comparisons.
 *
 * Comparisons are written against *approaches* (doing it yourself, hiring,
 * a dev shop, another platform, a big consultancy, the status quo) rather than
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
    slug: "diy-tools",
    short: "vs. doing it yourself",
    name: "Doing it yourself",
    headline: "You could build it yourself. The question is what it costs you to maintain.",
    summary:
      "No-code platforms and an AI subscription will get you a long way, and for one simple job they are genuinely the right answer. The trouble starts at the second job, when nobody remembers how the first one works.",
    theirStrength:
      "Cheap to start, no procurement, and you learn what your process actually is. For a single, stable, low-risk task, building it yourself is often correct.",
    theirWeakness:
      "The work is not the building, it is the keeping. Every change to a price, a supplier or a form is now your job. When it breaks quietly, nobody notices until a customer does.",
    rows: [
      { dimension: "Time to first result", them: "Weeks of evenings", us: "Four to six weeks, done with you" },
      { dimension: "Who maintains it", them: "Whoever built it, forever", us: "We do, on a retainer" },
      { dimension: "When something breaks", them: "Discovered by a customer", us: "Alerted, usually before you notice" },
      { dimension: "Knowledge", them: "In one person's head", us: "Documented and handed over" },
      { dimension: "Cost over a year", them: "Subscription fees plus your time", us: "Fixed scope, known monthly" },
      { dimension: "Scales to the next process", them: "Starts again from scratch", us: "Reuses the same connections" },
    ],
    points: [
      {
        title: "The 80% that goes well",
        body:
          "A form that notifies a channel, an invoice that gets filed, a summary that lands in your inbox. You will get these working, and they will genuinely save time for a while.",
      },
      {
        title: "The 20% nobody warns you about",
        body:
          "Errors are silent, permissions drift, a supplier changes their invoice format, and the person who built it changes job. Most home-built automation is quietly wrong within six months, and the business never finds out.",
      },
      {
        title: "Where we draw the line",
        body:
          "If your idea is one simple job with low downside, we will tell you to do it yourself and send you the playbook for free. We would rather be the right answer than every answer.",
      },
    ],
    bestFor: [
      "Anyone who has already built a first automation and felt it start to fray",
      "Owner-run businesses where nobody has spare evenings",
      "Processes touching money, customers or compliance",
    ],
  },
  {
    slug: "hiring-in-house",
    short: "vs. hiring in-house",
    name: "Hiring in-house",
    headline: "One hire is not a team, and AI is not a one-person job.",
    summary:
      "A good AI engineer costs a senior salary, takes months to hire, and still needs a designer of processes, someone to own the integrations, and a plan for when they take a holiday.",
    theirStrength:
      "Full-time focus, deep context over time, and total control. If AI is central to your product rather than your operations, building a team is the right long-term move.",
    theirWeakness:
      "You are hiring for a market that has been in shortage for years, and the first project is the hardest one they will ever do. Most of what you pay for is learning that has already been done elsewhere.",
    rows: [
      { dimension: "Time to first result", them: "Three to six months of hiring", us: "First build live in weeks" },
      { dimension: "Annual cost", them: "One senior salary, plus tools", us: "A fraction of that, per project" },
      { dimension: "Coverage", them: "One person's skills and holidays", us: "Engineer, process and support" },
      { dimension: "Risk", them: "They leave with the knowledge", us: "Documented, and we hand over" },
      { dimension: "Breadth", them: "One stack, learned on your budget", us: "Patterns from many businesses" },
      { dimension: "Best for", them: "AI inside your product", us: "AI inside your operations" },
    ],
    points: [
      {
        title: "Hire when AI is your product",
        body:
          "If you sell software, you need engineers who own it forever. We are not that and we will not pretend to be — we build the operations layer and hand it over documented.",
      },
      {
        title: "The hidden second and third hire",
        body:
          "Production AI needs someone watching accuracy, someone maintaining integrations and somebody accountable to the business. That is a team, not a role, and probably not your first operational hire.",
      },
      {
        title: "We can work alongside them",
        body:
          "Several clients have an internal developer who takes over what we build. We document everything, record the handover sessions, and stay available on retainer for as long as it is useful.",
      },
    ],
    bestFor: [
      "Businesses that need results this quarter, not next year",
      "Owners who do not want to manage an engineering team",
      "Firms where an internal hire would be a team of one",
    ],
  },
  {
    slug: "offshore-dev-shop",
    short: "vs. a dev shop",
    name: "A general dev shop",
    headline: "A ticket queue will build what you specify. It will not tell you what is worth building.",
    summary:
      "A development agency will happily implement a spec. The hard part of AI is not the code — it is knowing which process is worth automating, what the agent must never do, and how to prove it works.",
    theirStrength:
      "Competitive rates, flexible capacity, and a clear commercial relationship. For well-specified software with a known design, a good shop is efficient and professional.",
    theirWeakness:
      "They build what the brief says. If the brief is wrong — and on a first AI project it usually is — you pay twice: once for the build and once for the rewrite.",
    rows: [
      { dimension: "Starting point", them: "A specification you write", us: "An audit we do with you" },
      { dimension: "Process knowledge", them: "Learned during the build", us: "Assumed before it starts" },
      { dimension: "Scope", them: "Change requests and re-quotes", us: "Fixed scope, agreed in writing" },
      { dimension: "After launch", them: "Support contract, billed hourly", us: "Monitored and tuned on retainer" },
      { dimension: "When AI is the wrong tool", them: "They build it anyway", us: "We say so and refund the difference" },
      { dimension: "Handover", them: "Code in a repository", us: "Code, prompts, docs and training" },
    ],
    points: [
      {
        title: "The spec is the product",
        body:
          "Most failed AI projects were built correctly against a brief that described the wrong process. Two weeks of process mapping before a line of code is written is not overhead, it is the work.",
      },
      {
        title: "Judgement, not capacity",
        body:
          "You are not buying developers by the hour. You are buying somebody who has watched twenty businesses automate the same six processes and can tell you which one pays back first.",
      },
      {
        title: "Proof before scale",
        body:
          "Every build runs in parallel with your existing process and is measured against it. If the numbers are not there in the first month, we stop and tell you.",
      },
    ],
    bestFor: [
      "Businesses that have been quoted for a build and want a second opinion",
      "Anyone whose last project was technically delivered and commercially useless",
      "Owners who want a fixed price and a fixed scope",
    ],
  },
  {
    slug: "another-saas",
    short: "vs. another platform",
    name: "Buying another platform",
    headline: "You do not need another dashboard. You need the work to happen without one.",
    summary:
      "There is a subscription for every problem now, and each one arrives with onboarding, a migration and a monthly fee per user. Most end up as another place your team forgets to update.",
    theirStrength:
      "Mature software, real support, a predictable monthly cost, and someone else maintaining it. Where a category is genuinely solved, buying is nearly always right.",
    theirWeakness:
      "The tool does not do the work — it gives your team somewhere to do the work. That is the part that costs you money, and no subscription removes it.",
    rows: [
      { dimension: "What you buy", them: "Software your team operates", us: "Work that happens without them" },
      { dimension: "Migration", them: "Weeks of setup and import", us: "None — we connect what you have" },
      { dimension: "Pricing", them: "Per user, per month, forever", us: "Per project, then a small retainer" },
      { dimension: "Fit", them: "Their idea of your process", us: "Your process, as it actually runs" },
      { dimension: "Adoption", them: "Depends on training and discipline", us: "Runs whether or not anyone logs in" },
      { dimension: "Exit", them: "Export your data, somehow", us: "You own the code and leave any time" },
    ],
    points: [
      {
        title: "Tools do not do work",
        body:
          "If your team is still the one copying, chasing, checking and filing, a new subscription has changed the interface rather than the outcome. That is the honest test of any purchase.",
      },
      {
        title: "We are not anti-software",
        body:
          "Most of what we build sits on top of systems you already pay for, and we frequently recommend keeping them. Automation is what makes the tools you own worth what you are paying.",
      },
      {
        title: "No lock-in, by design",
        body:
          "The agents we build run on your infrastructure with your accounts. If you leave us, everything keeps working — it just gets less attention.",
      },
    ],
    bestFor: [
      "Businesses with more subscriptions than they have adopted",
      "Teams already paying for a CRM nobody updates",
      "Owners who want fewer logins, not more",
    ],
  },
  {
    slug: "big-consultancy",
    short: "vs. a big consultancy",
    name: "A big consultancy",
    headline: "You will get a strategy deck. You may not get anything that runs.",
    summary:
      "Large firms do governance, roadmaps and change programmes well, and they are built for organisations of thousands. A business your size usually needs one thing working, not a ninety-page report.",
    theirStrength:
      "Depth of expertise, formal governance, and the credibility to move a large organisation. For complex, regulated, multi-department transformation, that is genuinely worth paying for.",
    theirWeakness:
      "The business model rewards discovery and strategy. Implementation is handed down to junior teams, margins get thin, and the deck rarely turns into something running in your business.",
    rows: [
      { dimension: "Deliverable", them: "A strategy and a roadmap", us: "A working agent in production" },
      { dimension: "Who does the work", them: "Analysts, then a delivery team", us: "The people who scoped it" },
      { dimension: "Time to value", them: "A quarter, minimum", us: "Weeks" },
      { dimension: "Cost", them: "Day rates and programme fees", us: "Fixed project price" },
      { dimension: "Definition of done", them: "Workshop sign-off", us: "The process runs without you" },
      { dimension: "If it fails", them: "Another phase begins", us: "You stop paying" },
    ],
    points: [
      {
        title: "Strategy without build is a library",
        body:
          "We have been shown beautiful AI roadmaps that nobody ever executed. A roadmap is only useful if the next step is obvious and funded, which is why ours comes with a priced first project.",
      },
      {
        title: "Right-sized for a business, not an enterprise",
        body:
          "You do not need a governance committee to automate invoice processing. You need somebody who has done it before to do it properly, and to be honest about what it is not worth doing.",
      },
      {
        title: "When a big firm is the right answer",
        body:
          "If you are regulated to the point of needing formal assurance, or rolling this out across thousands of staff, buy the programme. We will tell you that in the first meeting.",
      },
    ],
    bestFor: [
      "Businesses between five and two hundred people",
      "Owners who want to see something working before committing to more",
      "Anyone who has already paid for a strategy and got nothing live",
    ],
  },
  {
    slug: "status-quo",
    short: "vs. doing nothing",
    name: "Doing nothing",
    headline: "The manual work is not free. You are just paying for it in a different currency.",
    summary:
      "Doing nothing is a legitimate choice, and for some businesses it is correct. It becomes expensive when the same hours are spent on the same tasks every week, and the cost lands on the people you least want to lose.",
    theirStrength:
      "No project risk, no change to manage, no money spent. If your margins are healthy and your team is happy, there is no problem to solve.",
    theirWeakness:
      "The cost is paid daily in wages, mistakes, slow response and people leaving to do less tedious work somewhere else. It never appears on a line item, which is exactly why it is easy to ignore.",
    rows: [
      { dimension: "Cost", them: "Invisible, spread across wages", us: "A fixed price you approve first" },
      { dimension: "Response speed", them: "As fast as someone is free", us: "Seconds, every time" },
      { dimension: "Growth", them: "Hire more people for the same work", us: "Take on more without adding admin" },
      { dimension: "Staff turnover", them: "Good people leave the boring parts", us: "They do the work they trained for" },
      { dimension: "Risk", them: "Key-person dependency", us: "Documented and transferable" },
      { dimension: "Reversibility", them: "Not applicable", us: "Stop whenever; you keep the build" },
    ],
    points: [
      {
        title: "Count it before you dismiss it",
        body:
          "Take the task you dislike most, multiply the minutes by how often it happens by the hourly cost of the person doing it. Most owners are surprised once it is a number rather than a feeling.",
      },
      {
        title: "The hidden cost is people",
        body:
          "The strongest people do not stay where the work is repetitive. Every business we work with has lost somebody to a role that removed the tedious part of their day.",
      },
      {
        title: "Waiting is a strategy",
        body:
          "Models get cheaper and better every quarter, and doing nothing for six months is not reckless. What is reckless is doing nothing for three years and calling it patience.",
      },
    ],
    bestFor: [
      "Businesses where the owner is still doing the admin at 9pm",
      "Anyone whose growth plan involves hiring for repetitive roles",
      "Teams that have quietly stopped suggesting improvements",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Industries                                                          */
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
    slug: "professional-services",
    name: "Professional services",
    headline: "For firms that bill by the hour and win work on response time.",
    summary:
      "Solicitors, accountants, consultants, recruiters and agencies all sell expertise by the hour. Which means every hour spent on admin is an hour not billed — and the firm that replies first usually gets the work.",
    pressurePoints: [
      { title: "Enquiries arrive faster than anyone can answer", body: "Partner inboxes, a web form nobody owns, calls taken during meetings. The enquiry that waits until tomorrow is somebody else's client." },
      { title: "Onboarding is a hand-carried process", body: "Engagement letters, identity checks, document requests and system setup, each one chased by a different person from memory." },
      { title: "Qualified people do unqualified work", body: "Reformatting documents, retyping details between the CRM and the billing system, writing the same follow-up email for the fourth time." },
      { title: "Nobody knows the numbers until month end", body: "Utilisation, realisation and profitability assembled by hand, weeks after the decisions they should have informed." },
    ],
    moduleFit: [
      { module: "AI agents", href: "/services/ai-agents", line: "Answers every enquiry in minutes, qualifies it, and books the consultation." },
      { module: "Workflow automation", href: "/services/workflow-automation", line: "Onboarding runs itself: letter, ID, documents and setup, chased automatically." },
      { module: "Document AI", href: "/services/document-ai", line: "Client documents read, classified and filed, with a searchable archive." },
      { module: "AI insights", href: "/services/ai-insights", line: "Utilisation and margin per client, current, not reconstructed at month end." },
    ],
    metrics: [
      { label: "First response", value: "Minutes, not hours" },
      { label: "Onboarding admin", value: "Handled automatically" },
      { label: "Hours freed", value: "The repetitive third of the week" },
      { label: "Utilisation", value: "Visible and current" },
    ],
    proof:
      "Every firm we have worked with started with the same request: make sure we never miss another enquiry. It is the cheapest win in the business.",
  },
  {
    slug: "property",
    name: "Property, trades & field service",
    headline: "For businesses whose day is bookings, quotes and people on the road.",
    summary:
      "Letting agents, estate agents, property managers, trades and maintenance firms run on diaries and job sheets. The money is lost in missed calls, unquoted enquiries and jobs nobody followed up.",
    pressurePoints: [
      { title: "The phone rings while you are on a job", body: "Missed calls are missed work, and by the evening the caller has rung somebody else. Callback lists never get called back." },
      { title: "Quotes go out and vanish", body: "A price sent on Tuesday, no reply, nobody follows up because nobody is sure whose job it was to chase." },
      { title: "Scheduling is a human spreadsheet", body: "Jobs, travel, access windows and emergencies reconciled by one person, usually on a phone, usually under pressure." },
      { title: "Tenant and client comms never stop", body: "Maintenance reports, updates and paperwork handled by whoever picks up the phone, with no record of what was promised." },
    ],
    moduleFit: [
      { module: "AI agents", href: "/services/ai-agents", line: "A voice agent that answers when you cannot, qualifies the job and books the visit." },
      { module: "Workflow automation", href: "/services/workflow-automation", line: "Quote, acceptance, scheduling, job sheet and invoice as one continuous flow." },
      { module: "Document AI", href: "/services/document-ai", line: "Certificates, invoices and compliance documents filed against the right property." },
      { module: "AI insights", href: "/services/ai-insights", line: "Which jobs make money, which clients cost you, and where the pipeline went quiet." },
    ],
    metrics: [
      { label: "Calls answered", value: "Every one, day or night" },
      { label: "Quote follow-up", value: "Automatic until a decision" },
      { label: "Scheduling admin", value: "Hours a day back" },
      { label: "Pipeline visibility", value: "Live, not remembered" },
    ],
    proof:
      "For a business that lives on the phone, an agent that never misses a call is usually the single highest-value thing we build.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce & retail",
    headline: "For shops where volume is high, margins are thin and support never sleeps.",
    summary:
      "Online retail runs on repetition at scale: the same six questions, the same order admin, the same supplier data, thousands of times a month. It is the best possible case for automation.",
    pressurePoints: [
      { title: "Support is mostly the same six questions", body: "\"Where is my order?\", \"can I change it?\", \"do you ship here?\" — answered by hand, at cost, for hours every day." },
      { title: "Order admin eats the team", body: "Address fixes, payment queries, returns, courier escalations and manual reconciliation between the shop and the accounts." },
      { title: "Product data is always slightly wrong", body: "Titles, sizes, descriptions and stock spread across a supplier's spreadsheet, the shop and the marketplace listing." },
      { title: "Peak season breaks everything", body: "The system that copes in June falls over in November, and the team absorbs it by working longer hours." },
    ],
    moduleFit: [
      { module: "AI agents", href: "/services/ai-agents", line: "Support that answers instantly on chat and email, and escalates the ones that matter." },
      { module: "Workflow automation", href: "/services/workflow-automation", line: "Orders, returns, refunds and reconciliation moving without anyone touching them." },
      { module: "Document AI", href: "/services/document-ai", line: "Supplier invoices and packing slips read into your systems automatically." },
      { module: "AI insights", href: "/services/ai-insights", line: "Margin per product, per channel, per cohort — updated daily." },
    ],
    metrics: [
      { label: "Support volume", value: "Routine tickets answered instantly" },
      { label: "Order admin", value: "Exceptions only" },
      { label: "Product data", value: "Normalised automatically" },
      { label: "Peak readiness", value: "Scales without hiring" },
    ],
    proof:
      "The businesses that benefit most are the ones where one person is holding the operational side together by working late every night.",
  },
  {
    slug: "clinics",
    name: "Clinics & health practices",
    headline: "For practices where the diary is the business and no-shows are the leak.",
    summary:
      "Dental, veterinary, physio, aesthetics and private practices lose money in empty slots and spend their receptionist's day on the phone. Both are solvable without replacing your practice system.",
    pressurePoints: [
      { title: "The phone never stops", body: "Bookings, changes, results and questions, all through one receptionist who cannot leave the desk." },
      { title: "No-shows and late cancellations", body: "Empty slots cost a clinician's time, and the reminder process is somebody remembering to send a text." },
      { title: "Intake forms by clipboard", body: "Patients fill in the same details repeatedly, and someone types them into the system afterwards." },
      { title: "Recall and follow-up drifts", body: "Six-month check-ups, treatment plans and aftercare that depend on the patient remembering, not the practice following up." },
    ],
    moduleFit: [
      { module: "AI agents", href: "/services/ai-agents", line: "Booking, rescheduling and answering routine questions by voice, chat and message." },
      { module: "Workflow automation", href: "/services/workflow-automation", line: "Reminders, confirmations and recalls running by rule, not by memory." },
      { module: "Document AI", href: "/services/document-ai", line: "Intake forms and consents read into your records before the appointment." },
      { module: "AI insights", href: "/services/ai-insights", line: "Chair utilisation, no-show patterns and treatment revenue in one view." },
    ],
    metrics: [
      { label: "Reception load", value: "Routine calls handled" },
      { label: "No-shows", value: "Chased automatically" },
      { label: "Intake admin", value: "Done before arrival" },
      { label: "Recall", value: "Runs itself" },
    ],
    proof:
      "We do not touch clinical decisions. Everything we build handles the admin around the appointment so the clinician's time is spent on patients.",
  },
];
