import { companyValues, roles, timeline } from "@/lib/content/company";

/** Default copy for `/about` and `/careers` (index and role pages). */
export function companyDoc() {
  return {
    about: {
      hero: {
        eyebrow: "About",
        title: "We are an AI agency, not a software company.",
        summary:
          "We started by mapping how owner-run businesses actually work. The same six bottlenecks turned up everywhere, so we stopped writing reports about them and started building the agents that remove them — one business at a time.",
      },
      story: {
        eyebrow: "Why we exist",
        title: "Most businesses do not need another tool. They need the work done.",
        body1:
          "Every audit we run starts the same way: an owner describing a problem they have quietly accepted as the cost of doing business. Enquiries answered late. Quotes never followed up. Invoices keyed in by hand. The same questions answered forty times a week.",
        body2:
          "None of that is inevitable and none of it needs a new platform to fix. It needs someone to understand the process, build the agent or automation that removes the repetitive part, and stay around long enough to prove it works. That is what we do, and it is all we do.",
        imageAlt:
          "Three colleagues reviewing printed process diagrams on a wall during a working session",
      },
      values: {
        eyebrow: "How we work",
        title: "Six principles that decide what we build.",
        lede: "Each one has killed a project or lost us a deal at some point. That is usually what makes a principle worth having.",
      },
      valuesList: companyValues,
      history: { eyebrow: "History", title: "From audits to agents." },
      timeline,
      proof: {
        heading: "What owners say",
        note: "Placeholder testimonials on this build — the layout is real, the people are not.",
        cta: "All case studies",
      },
      cta: {
        title: "Want to see how we think?",
        summary:
          "The first call is a working session on your business, not a pitch. Bring one real process and we will map it on the call.",
        primary: { href: "/careers", label: "We are hiring" },
        secondary: { href: "/get-started", label: "Book a free AI audit" },
      },
    },

    careers: {
      hero: {
        eyebrow: "Careers",
        title: "Build things that keep working after you have moved on.",
        summary:
          "We are a small agency building automation for businesses that cannot afford to guess. You will meet the client, see the work running, and know whether it actually helped.",
      },
      openRoles: {
        eyebrow: "Open roles",
        /** `{roles}` and `{teams}` are replaced with the live counts. */
        titleTemplate: "{roles} positions across {teams} teams.",
        lede:
          "Every role below is live, with a real hiring manager and a defined process. If it is listed, we are reading applications.",
      },
      roles,
      workingHere: {
        eyebrow: "Working here",
        title: "What we actually offer.",
        lookingFor: "What we look for",
      },
      perks: [
        {
          title: "Remote-first, with real async habits",
          body: "Written-first by default. Meetings are for decisions, not for status.",
        },
        {
          title: "You meet the business you are building for",
          body: "No handing requirements over a fence. If you build it, you sit in the meeting where it is explained and the one where it is signed off.",
        },
        {
          title: "Time to think",
          body: "A protected day each month with no meetings, for reading and for the work that never fits anywhere else.",
        },
        {
          title: "Equipment and learning budget",
          body: "Your setup, your choice, plus an annual budget with no approval theatre.",
        },
      ],
      cta: {
        title: "Nothing fits, but you think you should be here?",
        summary:
          "Tell us what you would build and why it matters for a business where every hour is somebody's wages. We read everything.",
        primary: { href: "/contact", label: "Get in touch" },
        secondary: { href: "/about", label: "About Reygent AI" },
      },
      roleCta: {
        title: "Not the right role?",
        summary:
          "Send us a note describing the role you would create for yourself here. Several of our positions started that way.",
        primary: { href: "/contact", label: "Get in touch" },
        secondary: { href: "/about", label: "About Reygent AI" },
      },
    },
  };
}

export type CompanyDoc = ReturnType<typeof companyDoc>;
