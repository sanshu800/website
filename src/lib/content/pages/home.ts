import { platformFacts } from "@/lib/content/marketing";

/** Default copy for the homepage sections. Data shared with other pages lives in `shared.ts`. */
export function homeDoc() {
  return {
    hero: {
      badge: "AI-native operations for professional-service firms",
      titleLines: ["Your whole client", "operation, on one", "shared record."],
      summary:
        "Intake, onboarding, follow-through and reporting in one place — so work stops falling into the gaps between the tools your firm already uses.",
      primaryCta: { label: "Start free trial", href: "/get-started" },
      secondaryCta: { label: "See the product tour", href: "/product-tour" },
      footnote: "14 days free · No card required · Runs alongside your current tools",
      stats: [
        { value: "38m", label: "Median first reply" },
        { value: "99.95%", label: "Platform availability" },
        { value: "30 days", label: "Typical time to value" },
      ],
    },

    proof: {
      label: "Operations teams at firms like these",
      disclosure: "Placeholder client marks — invented for design purposes.",
    },

    metrics: { facts: platformFacts },

    modules: {
      eyebrow: "How it fits together",
      titleLines: ["One operation, four jobs,", "handed over cleanly."],
      lede:
        "Most firms run these as separate processes with a person in between. Each handover is where time is lost and context is dropped.",
    },

    problem: {
      eyebrow: "The problem",
      titleLines: ["Your tools each see a fragment.", "None of them sees the client."],
      lede:
        "An inbox sees threads. A CRM sees fields. A document store sees files. The work that holds a firm together happens between them — where an enquiry becomes a client, and where most of it goes missing.",
      items: [
        {
          title: "Enquiries sit in somebody's inbox",
          body: "A web form nobody owns, a shared mailbox and a partner's phone notes. Nobody can say how many enquiries arrived this month, or how many were answered.",
          image: "/images/problem-scattered.png",
          alt: "An overhead view of a desk buried in scattered printed spreadsheets, folders and paper notes",
          field: "bg-magenta",
          fix: "One record per enquiry, with an owner and a dated next step.",
          stat: { value: "38m", label: "typical discovery: slowest firm replies in 22 hours" },
        },
        {
          title: "The chasing never stops",
          body: "Half of client correspondence is asking for something again — a document, an approval, a signature. It is invisible work that consumes senior time every week.",
          image: "/images/problem-chasing.png",
          alt: "A professional at an office desk on a headset, surrounded by open folders and paperwork",
          field: "bg-tangerine",
          fix: "Requests that carry their own status and chase themselves.",
          stat: { value: "1 in 3", label: "client emails in a typical firm are chasing something" },
        },
        {
          title: "Reporting is a reconstruction",
          body: "Month-end means exports, cleanup and a manual join. Two people produce two numbers, and the review meeting spends its first twenty minutes agreeing on which one is right.",
          image: "/images/problem-reporting.png",
          alt: "Hands at a keyboard in a dim office with spreadsheet grids visible on monitors behind",
          field: "bg-azure",
          fix: "Reports assembled from the operating record, on a schedule.",
          stat: { value: "3 days", label: "average month-end reporting effort, per firm" },
        },
      ],
    },

    foundation: {
      eyebrow: "Foundation",
      title: "Meet Ask Reygent.",
      lede:
        "Type a question about a client, an engagement or the whole book. Reygent reasons across everything the firm knows and cites the exact email, document or call behind every answer — in the app, and in your messaging tool.",
    },

    howItWorks: {
      eyebrow: "How it works",
      title: "Live in days. Measurably better within a quarter.",
      lede:
        "The order matters. Most automation fails because rules are written before the operation has been mapped — so we do not skip stage two.",
      stages: [
        {
          index: "01",
          title: "Connect",
          duration: "Day 1",
          body: "Point Reygent at the tools your firm already runs — mailboxes, calendar, documents, ledger. Nothing is migrated, nothing is replaced.",
          detail: ["Email and calendar sync", "Document and ledger access", "Existing records imported"],
        },
        {
          index: "02",
          title: "Map the operation",
          duration: "Week 1",
          body: "We map how work actually moves through your firm, including the exceptions nobody wrote down. This is the step most software skips.",
          detail: ["Intake channels and criteria", "Ownership rules", "The handoffs that currently fail"],
        },
        {
          index: "03",
          title: "Run one process properly",
          duration: "Week 2–4",
          body: "Pick the seam that costs the most — usually intake or document collection — and run it through the platform until it is measurably better.",
          detail: [
            "One process live end to end",
            "Team trained on the real workflow",
            "Baseline measured before and after",
          ],
        },
        {
          index: "04",
          title: "Expand and hand over",
          duration: "Ongoing",
          body: "Add the next module once the first one holds. The system is documented and owned by your firm, not by a consultant who has to be present.",
          detail: [
            "Further modules at your pace",
            "Documentation your team owns",
            "Quarterly operational review",
          ],
        },
      ],
    },

    testimonials: {
      eyebrow: "Customers",
      titleLines: ["Firms that stopped losing", "work between the tools."],
      cta: "All customer stories",
      disclosure:
        "Placeholder testimonials — invented for design purposes, not real customers. Replace before publishing.",
    },

    industries: {
      eyebrow: "Built for your practice",
      title: "The same operation, different vocabulary.",
      lede:
        "A brief in a law firm is an engagement in a consultancy and a client in an accountancy. The underlying operation is identical: work arrives, must be qualified, delivered and reported on.",
    },

    integrations: {
      eyebrow: "Integrations",
      title: "Runs alongside what you already use.",
      lede:
        "Forty-plus integration surfaces across the systems a professional-services firm already depends on. Nothing needs to be ripped out to start.",
      cta: "All integrations",
    },

    finalCta: {
      eyebrow: "Get started",
      titleLead: "Your operation already has a system.",
      titleAccent: "Let us make it a good one.",
      summary:
        "Start a free trial with your own data, or book 30 minutes and we will map your intake process live and show you what it is costing. Either way you leave with something useful.",
      primaryCta: { label: "Start free trial", href: "/get-started" },
      secondaryCta: { label: "Book a demo", href: "/demo" },
      proofLabel: "Trusted by operations teams at",
    },
  };
}

export type HomeDoc = ReturnType<typeof homeDoc>;
