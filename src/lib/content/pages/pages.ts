import { partnersProgram, startupsProgram } from "@/lib/content/company";

/**
 * Default copy for the remaining standalone pages: get started, contact, demo,
 * customers, integrations, security, startups, partners and the product tour.
 *
 * Icons stay in code — a content document is JSON, so it holds text and the
 * pages pair entries with their icon by position.
 */
export function pagesDoc() {
  return {
    getStarted: {
      hero: {
        eyebrow: "Get started",
        title: "Fourteen days, full product, no card.",
        summary:
          "Most firms see whether this fits inside a week. You should be able to decide that without talking to us first, so the trial is not gated behind a discovery call.",
      },
      includedHeading: "What the trial includes",
      included: [
        "All four modules — intake, engage, deliver and insight — live from day one",
        "Foundation: the shared memory layer every module reads and writes to",
        "Two sample workflows and the seed data model to copy from",
        "Import from a spreadsheet in under ten minutes",
        "Guided onboarding session on Pro and above",
        "Full export in open formats, whenever you want it",
      ],
      nextSteps: {
        heading: "What happens after you submit",
        steps: [
          "The request is stored and acknowledged — no silent submission.",
          "A person replies within one working day with your workspace details.",
          "We import a slice of your real records together, or you book an onboarding session and we do it with you.",
        ],
      },
      billingNote:
        "No payment provider is wired into this build. Selecting a plan records your intent so the flow is complete end to end; real billing needs a Stripe account and price IDs.",
    },

    contact: {
      hero: {
        eyebrow: "Contact",
        title: "Ask us something specific.",
        summary:
          "Every message is read by a person on the team that can actually answer it. If your question is about the platform, expect a technical reply rather than a brochure.",
      },
      formHeading: "Send a message",
      formNote:
        "Required fields are marked by their labels being visible. Everything is validated on the server as well as here.",
      channelsHeading: "Direct channels",
      channels: [
        {
          label: "General",
          value: "hello@reygent.ai",
          note: "Sales, trials and anything that does not fit elsewhere.",
        },
        {
          label: "Support",
          value: "support@reygent.ai",
          note: "Existing customers. Pro and Enterprise include a priority queue.",
        },
        {
          label: "Security",
          value: "security@reygent.ai",
          note: "Vulnerability reports and security questionnaires.",
        },
        {
          label: "Registered office",
          value: "1 Fitzwilliam Square, Dublin 2, Ireland",
          note: "Postal enquiries. We are remote-first; no drop-ins, please.",
        },
      ],
      evaluating: {
        heading: "Already evaluating?",
        body: "Ask for the security pack and a sandbox with your own data model. We would rather answer a hundred questions before you sign than ten after.",
        note: "Addresses on this page are placeholders. Point them at a real mailbox (or a shared inbox integration) before going live.",
      },
    },

    demo: {
      hero: {
        eyebrow: "Book a demo",
        title: "Bring one real process.",
        summary:
          "Thirty minutes with someone who has mapped this before. No slides, no qualification script, and you keep the process map afterwards whether or not you buy.",
      },
      agendaHeading: "How the thirty minutes runs",
      agenda: [
        {
          title: "Minutes 0–8",
          body: "You describe one process that is currently painful. We map it on screen as you talk.",
        },
        {
          title: "Minutes 8–20",
          body: "We take the same process through the platform live — intake, handover, chase, report — using the record rather than slides.",
        },
        {
          title: "Minutes 20–27",
          body: "Honest assessment: what the platform fixes, what it does not, and what it would take to implement.",
        },
        {
          title: "Minutes 27–30",
          body: "Pricing, next steps, and the implementation shape if you want to proceed.",
        },
      ],
      whoHeading: "Who should join",
      whoBody:
        "The person who owns operations, plus whoever owns the systems. Two people is ideal; six is a committee.",
      quoteNote: "Placeholder testimonial — invented for design purposes.",
      calendarNote:
        "Calendar booking is not connected on this build. Requests land in the platform database and would be confirmed by email; wiring Google Calendar or Cal.com is the only change required.",
    },

    customers: {
      hero: {
        eyebrow: "Customers",
        title: "Firms that stopped losing work between the tools.",
        summary:
          "Case studies are being written up with named firms and published numbers. Until they are, this page shows the operational shape of the work and the quotes we have permission to use.",
      },
      featured: {
        eyebrow: "Featured",
        title: "“The last piece of software our practice needed.”",
      },
      narrative: [
        { label: "Before", value: "3 shared inboxes and a spreadsheet" },
        { label: "After", value: "One intake record with owners" },
        { label: "First change", value: "Median first reply, 22h to 38m" },
        { label: "Time to value", value: "Measured inside 3 weeks" },
      ],
      narrativeNote:
        "Placeholder narrative — illustrative of the pattern, not a verified client result. Replace before publishing.",
      quotes: { eyebrow: "In their words", title: "What partners tell us." },
    },

    integrations: {
      hero: {
        eyebrow: "Integrations",
        title: "Runs alongside what you already use.",
        summary:
          "Forty-plus integration surfaces across the systems a professional-services firm already depends on. Nothing needs to be ripped out to start — the coordination layer is what we replace.",
      },
      heroActions: {
        primary: { href: "/get-started", label: "Start free trial" },
        secondary: { href: "/security", label: "How we handle data" },
      },
      categories: {
        eyebrow: "By category",
        title: "Described by what it does, not whose logo it is.",
        lede: "We list capabilities rather than partner marks, because displaying another company's trademark implies an endorsement neither of us has signed.",
      },
      capabilities: [
        {
          title: "Two-way sync",
          body: "Read and write on every connected surface. Replies logged where they happened, records updated without anyone typing.",
        },
        {
          title: "Idempotent by default",
          body: "Every sync is safe to retry. A misbehaving third-party API degrades one surface rather than the record.",
        },
        {
          title: "Open API and webhooks",
          body: "Every object is addressable, every event is publishable. Build on the memory layer rather than beside it.",
        },
        {
          title: "Scoped permissions",
          body: "Connect a mailbox without granting full account access. Credentials are encrypted per tenant and revocable in one click.",
        },
      ],
      api: {
        heading: "Building on Reygent",
        body: "The API exposes the same objects the interface uses, so an integration cannot drift from what your team sees. Authentication is per-tenant and scoped to the records you grant.",
        cta: "Request API access",
      },
    },

    security: {
      hero: {
        eyebrow: "Security",
        title: "Specifics, not adjectives.",
        primary: { href: "/legal/security", label: "Full security documentation" },
        secondary: { href: "/contact", label: "Request our DPA" },
      },
      posture: [
        { label: "Encryption in transit", value: "TLS 1.2+" },
        { label: "Encryption at rest", value: "AES-256" },
        { label: "Tenant isolation", value: "Per-firm boundary" },
        { label: "Audit trail", value: "Append-only" },
        { label: "Penetration test", value: "Annual, third party" },
        { label: "SOC 2 Type II", value: "In progress" },
      ],
      controls: { eyebrow: "Controls", title: "What we do, in the order it matters." },
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
          "Questionnaire responses, sub-processor list, penetration test summary under NDA and a draft DPA are available for firms in evaluation.",
        primary: { href: "/contact", label: "Request the pack" },
        secondary: { href: "/legal/privacy", label: "Privacy notice" },
      },
    },

    startups: {
      hero: {
        eyebrow: "Startup programme",
        actions: {
          primary: { href: "/get-started", label: "Start free trial" },
          secondary: { href: "/contact", label: "Ask about eligibility" },
        },
      },
      program: startupsProgram,
      included: { eyebrow: "What is included", title: "Four things, no asterisks." },
      eligibility: {
        heading: "Eligibility",
        criteria: [
          "Firm incorporated within the last 36 months.",
          "Between 2 and 25 people, including founders.",
          "Trading and serving clients — not pre-revenue.",
          "Not currently on a Reygent paid plan.",
        ],
        note: "One programme enrolment per firm. If you are near the boundary in either direction, apply anyway and we will use our judgement rather than the spreadsheet.",
      },
      cta: {
        title: "Ready to apply?",
        summary:
          "Six questions, two minutes. We confirm eligibility within one working day and start the discount from your first paid month.",
        primary: { href: "/get-started", label: "Apply now" },
        secondary: { href: "/pricing", label: "See pricing" },
      },
    },

    partners: {
      hero: {
        eyebrow: "Partners",
        actions: {
          primary: { href: "/contact", label: "Apply to partner" },
          secondary: { href: "/contact", label: "Talk to partnerships" },
        },
      },
      program: partnersProgram,
      types: {
        eyebrow: "Who partners with us",
        title: "You already do the diagnosis.",
        items: [
          {
            title: "Operations consultants",
            body: "You are already mapping intake and delivery. Reygent becomes the system you hand over rather than a slide about one.",
          },
          {
            title: "Accountancy practices",
            body: "Advise clients on their own operations and configuration, with the platform implemented under your brand.",
          },
          {
            title: "Systems integrators",
            body: "You own the technical programme: migrations, data model design and integration work.",
          },
          {
            title: "Fractional COOs",
            body: "Run the operating cadence across several firms, with one platform underneath all of them.",
          },
        ],
      },
      commercial: { eyebrow: "The commercial part", title: "What you get." },
      steps: { eyebrow: "How it works", title: "Four steps, about a month." },
      cta: {
        title: "Apply to the programme",
        summary:
          "Tell us about your practice, the firms you advise, and where you think the platform fits. We reply to every application with a real answer.",
        primary: { href: "/contact", label: "Start application" },
        secondary: { href: "/about", label: "About Reygent" },
      },
    },

    productTour: {
      hero: {
        eyebrow: "Product tour",
        title: "Five stops. Ten minutes. No sales call.",
        summary:
          "The same walkthrough we give on a demo, laid out so you can take it at your own pace — and stop wherever the answer stops being relevant to your firm.",
        actions: {
          primary: { href: "/get-started", label: "Start the real thing" },
          secondary: { href: "/demo", label: "Book a demo instead" },
        },
      },
      walkthrough: {
        eyebrow: "Walkthrough",
        title: "Pick a stop, or work through them in order.",
        lede: "Each panel is rendered from the same interface components the platform uses, so what you see here is the density you get after signing in — not a marketing illustration.",
      },
      foundation: {
        eyebrow: "Underneath it all",
        cta: "See how the memory layer works",
      },
      cta: {
        title: "Seen enough to talk specifics?",
        summary:
          "Bring one process to a thirty-minute session and we will map it against the same five stages on this page.",
      },
    },
  };
}

export type PagesDoc = ReturnType<typeof pagesDoc>;
