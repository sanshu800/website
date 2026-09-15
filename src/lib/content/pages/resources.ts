import { guides, releaseNotes } from "@/lib/content/company";

/** Default copy for `/guides`, `/release-notes` and `/newsletter`. */
export function resourcesDoc() {
  return {
    guides: {
      hero: {
        eyebrow: "Guides",
        title: "The work, written down.",
        summary:
          "Everything here comes from implementations we have run. Take them, use them, and if you never buy the platform they were still worth your afternoon.",
      },
      library: {
        eyebrow: "Library",
        /** `{count}` is replaced with the number of guides. */
        titleTemplate: "{count} resources",
      },
      items: guides,
      note: "On this build, resources are delivered by email rather than as hosted files — the download flow is wired to the newsletter endpoint so you can see the hand-off. Attach real PDFs to make it live.",
      cta: {
        title: "Want these as they land?",
        summary:
          "One email a month with the new playbook and two operational notes from live implementations.",
        primary: { href: "/newsletter", label: "Subscribe" },
        secondary: { href: "/blog", label: "Read the blog" },
      },
    },

    releaseNotes: {
      hero: {
        eyebrow: "Release notes",
        title: "Every change, and why it exists.",
        summary:
          "We publish the reasoning alongside the changelog. If a release does not improve a measurement we track for customers, it is worth explaining why we shipped it.",
      },
      latestBadge: "Latest",
      digest: {
        before: "Prefer it in your inbox?",
        linkLabel: "Subscribe to the release digest",
      },
      items: releaseNotes,
      cta: {
        title: "Want to influence the next one?",
        summary:
          "Pro customers get a monthly roadmap review, and Foundation requests are triaged in public view of the requesting firm.",
        primary: { href: "/demo", label: "Book a demo" },
        secondary: { href: "/contact", label: "Send feedback" },
      },
    },

    newsletter: {
      hero: {
        eyebrow: "Newsletter",
        title: "The Operations Briefing.",
        summary:
          "One email a month for the people who run professional-services firms. A real problem, the measurement that exposes it, and a playbook you can run without buying software.",
      },
      subscribe: {
        heading: "Subscribe",
        note: "Work email only — we do not accept gmail addresses for the briefing, because the content assumes you run a firm.",
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
          title: "The three-week absence test",
          summary: "What breaks when a partner goes on leave, and the handover checklist that fixes it.",
        },
        {
          number: "023",
          title: "Measuring intake without a new dashboard",
          summary: "Four numbers you can pull from systems you already have, this week.",
        },
        {
          number: "022",
          title: "AI on client records, without the risk",
          summary: "Where model access is defensible in a professional-services firm, and where it is not.",
        },
      ],
      includedHeading: "Included with the briefing",
      shippedHeading: "Shipped recently",
    },
  };
}

export type ResourcesDoc = ReturnType<typeof resourcesDoc>;
