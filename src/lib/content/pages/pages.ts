import { partnersProgram, startupsProgram } from "@/lib/content/company";

/**
 * Default copy for the remaining standalone pages: get started, contact,
 * customers, integrations, security, startups, partners and how we work.
 *
 * Icons stay in code — a content document is JSON, so it holds text and the
 * pages pair entries with their icon by position.
 */
export function pagesDoc() {
  return {
    getStarted: {
      hero: {
        eyebrow: "Book a free AI audit",
        title: "Thirty minutes to find out what is worth automating.",
        summary:
          "Tell us the one job that eats your week. We will map it live, say whether AI should touch it, and give you a straight answer on cost and timeframe. No slides, no obligation, and you keep the notes.",
      },
      includedHeading: "What you get out of it",
      included: [
        "Your process mapped, including the exceptions nobody documented",
        "An honest verdict: worth automating, not yet, or never",
        "The hours a week it is currently costing, as a number",
        "What we would build first, and roughly what it costs",
        "The three things we would not touch, and why",
        "The notes are yours, whether or not we work together",
      ],
      nextSteps: {
        heading: "What happens after you submit",
        steps: [
          "You get a reply from a person within one working day — not an autoresponder.",
          "We book a thirty-minute call, screen-shared, at a time that suits your week.",
          "If it looks worth pursuing, we follow up with a written scope and a fixed price.",
        ],
      },
      billingNote:
        "Nothing here is a subscription. If we go further than the call, it starts with a fixed-fee audit week, and that fee is credited against your build if you continue. There is no card to enter and no trial to cancel.",
    },

    contact: {
      hero: {
        eyebrow: "Contact",
        title: "Ask us something specific.",
        summary:
          "Every message is read by a person who can actually answer it. If your question is technical, expect a technical reply rather than a brochure.",
      },
      formHeading: "Send a message",
      formNote:
        "Required fields are marked by their labels being visible. Everything is validated on the server as well as here.",
      channelsHeading: "Direct channels",
      channels: [
        {
          label: "New enquiries",
          value: "hello@reygent.ai",
          note: "Audits, projects, retainers and anything that does not fit elsewhere.",
        },
        {
          label: "Existing clients",
          value: "support@reygent.ai",
          note: "Something broken or something to change. Urgent items get a same-hour response.",
        },
        {
          label: "Security & data",
          value: "security@reygent.ai",
          note: "Vulnerability reports, questionnaires and data processing questions.",
        },
        {
          label: "Registered office",
          value: "1 Fitzwilliam Square, Dublin 2, Ireland",
          note: "Postal enquiries. We are remote-first; no drop-ins, please.",
        },
      ],
      evaluating: {
        heading: "Already deciding between agencies?",
        body: "Ask us the awkward questions: what happens if it fails, who owns the build, what you need to contribute, and what you will be paying in year two. There is a playbook on this site with twelve of them, and we answer all twelve the same way in a call.",
        note: "Addresses on this page are placeholders. Point them at a real mailbox before going live.",
      },
    },

    customers: {
      hero: {
        eyebrow: "Case studies",
        title: "Businesses that got the repetitive work off their team.",
        summary:
          "Written up as what changed, in what order, and what it cost — including the parts that took longer than we expected. Client names are withheld until each one has signed off the write-up.",
      },
      featured: {
        eyebrow: "Featured",
        title: "“We stopped hiring for the job we should never have had.”",
      },
      narrative: [
        { label: "Before", value: "Two people, most of the day, on enquiries and quotes" },
        { label: "After", value: "An agent answers in seconds; they handle the exceptions" },
        { label: "First change", value: "Every enquiry answered, including weekends" },
        { label: "Time to value", value: "Six weeks from first call to live" },
      ],
      narrativeNote:
        "Placeholder narrative — illustrative of the pattern, not a verified client result. Replace before publishing.",
      quotes: { eyebrow: "In their words", title: "What owners tell us." },
    },

    integrations: {
      hero: {
        eyebrow: "What we connect",
        title: "We connect what you already pay for.",
        summary:
          "Agents sit on top of your existing CRM, inbox, calendar, accounting package, telephony, storage and industry software. Nothing gets ripped out, nothing gets migrated, and your team keeps the tools they already know.",
      },
      heroActions: {
        primary: { href: "/get-started", label: "Book a free AI audit" },
        secondary: { href: "/security", label: "How we handle access" },
      },
      categories: {
        eyebrow: "By category",
        title: "Described by what it does, not whose logo it is.",
        lede:
          "We list capabilities rather than partner marks, because displaying another company's trademark implies an endorsement neither of us has signed. If you use something unusual, ask — we have connected stranger things.",
      },
      capabilities: [
        {
          title: "Read and write, both ways",
          body: "The agent reads the record it needs and writes back the outcome, so your system of record stays the system of record. Nobody re-types anything.",
        },
        {
          title: "The access you grant, no more",
          body: "Scoped credentials per client, revocable by you at any time, held in a managed secret store. We never ask for a password to your account.",
        },
        {
          title: "Built to cope with bad days",
          body: "Third-party APIs go down and formats change. Every connection retries safely, fails loudly to a named person, and never silently drops work.",
        },
        {
          title: "Nothing is copied unless it has to be",
          body: "Where a provider allows it, the data stays in your systems and we pass it through. Where it has to be stored, it is yours, documented, and deletable on request.",
        },
      ],
      api: {
        heading: "Old and awkward systems welcome",
        body: "The systems that hold most small businesses together are rarely modern: an on-premise accounts package, a supplier portal, a spreadsheet somebody maintains. If a person can get data in or out of it, we can automate it.",
        cta: "Ask about your setup",
      },
    },

    security: {
      hero: {
        eyebrow: "Security & data",
        title: "You are handing us access to your business. Here is how we treat that.",
        primary: { href: "/legal/security", label: "Full data handling notes" },
        secondary: { href: "/contact", label: "Request our DPA" },
      },
      posture: [
        { label: "Access", value: "Scoped and revocable" },
        { label: "In transit", value: "TLS 1.2+" },
        { label: "At rest", value: "AES-256" },
        { label: "Audit trail", value: "Every action, append-only" },
        { label: "Model providers", value: "No training on your data" },
        { label: "Penetration test", value: "Annual, third party" },
      ],
      controls: {
        eyebrow: "In practice",
        title: "The six things that actually protect you.",
      },
      disclosure: {
        heading: "Report a vulnerability",
        body: "We run a coordinated disclosure process and will not pursue legal action against researchers who follow it. Send a description and reproduction steps; we acknowledge within two working days and keep you updated until the fix ships.",
        mailbox: "security@reygent.ai",
        pgp: "PGP key available on request",
        placeholderNote: "Placeholder address — point this at a real mailbox before publishing.",
      },
      cta: {
        title: "Need our security pack?",
        summary:
          "Questionnaire responses, sub-processor list, penetration test summary under NDA and a draft data processing agreement are available for any business in evaluation.",
        primary: { href: "/contact", label: "Request the pack" },
        secondary: { href: "/legal/privacy", label: "Privacy notice" },
      },
    },

    startups: {
      hero: {
        eyebrow: "Founders programme",
        actions: {
          primary: { href: "/get-started", label: "Book a free AI audit" },
          secondary: { href: "/contact", label: "Ask about eligibility" },
        },
      },
      program: startupsProgram,
      included: { eyebrow: "What is included", title: "Four things, no asterisks." },
      eligibility: {
        heading: "Who it is for",
        criteria: [
          "Business trading for less than 36 months.",
          "Between two and twenty-five people, founders included.",
          "Turning over money — not pre-revenue.",
          "Owner-run: the person who decides is the person who does the work.",
        ],
        note: "One place per business. If you are near the boundary in either direction, ask anyway — we use judgement rather than a spreadsheet.",
      },
      cta: {
        title: "Want to start there?",
        summary:
          "Tell us the one process you would automate first. We will confirm it qualifies within a working day and send a written scope for the fixed price.",
        primary: { href: "/get-started", label: "Book a free AI audit" },
        secondary: { href: "/pricing", label: "See engagements" },
      },
    },

    partners: {
      hero: {
        eyebrow: "Partners",
        actions: {
          primary: { href: "/contact", label: "Become a partner" },
          secondary: { href: "/pricing", label: "See engagements" },
        },
      },
      program: partnersProgram,
      types: {
        eyebrow: "Who partners with us",
        title: "You already do the diagnosis.",
        items: [
          {
            title: "Accountancy practices",
            body: "You see the client's books and know exactly where the admin is. We automate it, and you keep the relationship.",
          },
          {
            title: "IT support and MSPs",
            body: "You already look after the systems. We add the automation layer that makes them worth what the client pays.",
          },
          {
            title: "Business advisers and fractional COOs",
            body: "You are paid to improve operations. This is the part most advisers cannot build themselves — so we build it and stay behind you.",
          },
          {
            title: "Industry consultants",
            body: "If you advise trades, property, clinics or retail, the six processes we automate most are probably the six you keep recommending.",
          },
        ],
      },
      commercial: { eyebrow: "The commercial part", title: "What you get." },
      steps: { eyebrow: "How it works", title: "Four steps, about a month." },
      cta: {
        title: "Become a partner",
        summary:
          "Tell us about your clients, the systems they run and where automation keeps coming up. We reply to every application with a real answer, including when the fit is not there.",
        primary: { href: "/contact", label: "Start the conversation" },
        secondary: { href: "/about", label: "About Reygent" },
      },
    },

    productTour: {
      hero: {
        eyebrow: "How we work",
        title: "Audit, blueprint, build, run. In that order, always.",
        summary:
          "Most AI projects fail before anybody writes code, because the process was never understood. This is the method we run on every engagement, what you get at each stage, and when you can walk away.",
        actions: {
          primary: { href: "/get-started", label: "Book a free AI audit" },
          secondary: { href: "/pricing", label: "See what it costs" },
        },
      },
      walkthrough: {
        eyebrow: "The method",
        title: "Four stages. No stage you cannot stop at.",
        lede:
          "Each panel below is the interface our agents run in — inboxes, queues, review screens and reports. What you see is the density your team actually gets, not a marketing illustration.",
      },
      managed: {
        eyebrow: "Still with you afterwards",
        cta: "See how the retainer works",
      },
      cta: {
        title: "Seen enough to talk specifics?",
        summary:
          "Bring one process to a thirty-minute session and we will map it against these same four stages, then tell you honestly whether it is worth doing.",
      },
    },
  };
}

export type PagesDoc = ReturnType<typeof pagesDoc>;
