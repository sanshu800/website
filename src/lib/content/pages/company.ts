import { companyValues, roles, timeline } from "@/lib/content/company";

/** Default copy for `/about` and `/careers` (index and role pages). */
export function companyDoc() {
  return {
    about: {
      hero: {
        eyebrow: "About",
        title: "We build the layer between the tools.",
        summary:
          "Reygent started as an operations consultancy. After mapping the same four bottlenecks in firm after firm, we stopped writing reports and started building the system that removes them.",
      },
      story: {
        eyebrow: "Why we exist",
        title: "Most firms do not need better software. They need one system.",
        body1:
          "Every engagement we ran started the same way: a partner describing a problem they assumed was inevitable. Enquiries answered late. Documents chased for weeks. Reports rebuilt by hand at month end.",
        body2:
          "None of it was inevitable. It was the predictable result of work crossing between systems that could not see each other. So we built the layer that sits underneath, and then we built the four applications that run on it.",
        imageAlt:
          "Three colleagues reviewing printed process diagrams on a wall during a working session",
      },
      values: {
        eyebrow: "How we work",
        title: "Six principles that decide what we build.",
        lede: "These are not values on a wall. Each one has killed a feature or a deal, and we can tell you which.",
      },
      valuesList: companyValues,
      history: { eyebrow: "History", title: "From audits to a platform." },
      timeline,
      proof: {
        heading: "What firms say",
        note: "Placeholder testimonials on this build — the layout is real, the people are not.",
        cta: "All customer stories",
      },
      cta: {
        title: "Want to see how we think?",
        summary:
          "The first call is a working session on your operation, not a product tour. Bring a real process and we will map it.",
        primary: { href: "/careers", label: "We are hiring" },
        secondary: { href: "/demo", label: "Book a demo" },
      },
    },

    careers: {
      hero: {
        eyebrow: "Careers",
        title: "Build systems that outlive the person who built them.",
        summary:
          "We are a small team building operational infrastructure for firms that cannot afford to guess. If you like problems with a measurable answer, this is the right place.",
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
          title: "Every engineer talks to customers",
          body: "Implementation calls are open to the whole team. You should see the problem, not a ticket about it.",
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
          "Tell us what you would build and why it matters for a firm that runs on client relationships. We read everything.",
        primary: { href: "/contact", label: "Get in touch" },
        secondary: { href: "/about", label: "About Reygent" },
      },
      roleCta: {
        title: "Not the right role?",
        summary:
          "Send us a note describing the role you would create for yourself here. Several of our positions started that way.",
        primary: { href: "/contact", label: "Get in touch" },
        secondary: { href: "/about", label: "About Reygent" },
      },
    },
  };
}

export type CompanyDoc = ReturnType<typeof companyDoc>;
