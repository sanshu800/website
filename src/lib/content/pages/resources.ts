import { buildLog, guides } from "@/lib/content/company";

/** Default copy for `/guides`, `/build-log` and `/newsletter`. */
export function resourcesDoc() {
  return {
    guides: {
      hero: {
        title: "What we know, written down.",
        summary:
          "Every one of these came out of work we were paid to do. Take them, use them, and if you never speak to us they were still worth your afternoon.",
      },
      library: {
        /** `{count}` is replaced with the number of guides. */
        titleTemplate: "{count} resources",
      },
      items: guides,
      note: "On this build, resources are delivered by email rather than as hosted files — the download flow is wired to the newsletter endpoint so you can see the hand-off. Attach real PDFs to make it live.",
      cta: {
        title: "Want them as they land?",
        summary:
          "One email a month with the new playbook and two notes from live builds. No news roundups, no thought leadership.",
        primary: { href: "/newsletter", label: "Subscribe" },
        secondary: { href: "/blog", label: "Read the blog" },
      },
    },

    releaseNotes: {
      hero: {
        title: "What we built, and what it taught us.",
        summary:
          "We do not ship software, so this is not a changelog. Each entry is a real automation that went into production for a client, what it replaced, and the thing that turned out to be harder than expected. Clients are described by type, never by name.",
      },
      latestBadge: "Latest",
      digest: {
        before: "Prefer it in your inbox?",
        linkLabel: "Subscribe to the monthly briefing",
      },
      items: buildLog,
      cta: {
        title: "Want your process in the next entry?",
        summary:
          "The audit is where every one of these started. Bring the job that annoys you most and we will tell you honestly whether it is worth automating.",
        primary: { href: "/get-started", label: "Book a free audit" },
        secondary: { href: "/how-we-work", label: "See how we work" },
      },
    },

    newsletter: {
      hero: {
        title: "The Automation Briefing.",
        summary:
          "One email a month for business owners. A real problem we have solved, the numbers behind it, and something you can do this week without hiring anybody.",
      },
      subscribe: {
        heading: "Subscribe",
        note: "Work email only — the content assumes you run a business, and it keeps the list honest.",
        facts: [
          { label: "Frequency", value: "Monthly" },
          { label: "Length", value: "5 minutes" },
          { label: "Unsubscribe", value: "One click" },
        ],
      },
      issuesHeading: "Recent issues",
      issues: [
        {
          number: "024",
          title: "What a missed call actually costs",
          summary:
            "Fourteen trades and property businesses measured for a month. The number surprised most of them.",
        },
        {
          number: "023",
          title: "The three-week absence test",
          summary:
            "What breaks when the owner goes on holiday, and the checklist that finds it before your customers do.",
        },
        {
          number: "022",
          title: "Twelve questions to ask before you hire an automation company",
          summary:
            "Including the four most agencies cannot answer, and what a good answer sounds like.",
        },
      ],
      includedHeading: "Included with the briefing",
      shippedHeading: "Built recently",
    },
  };
}

export type ResourcesDoc = ReturnType<typeof resourcesDoc>;
