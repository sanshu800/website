/** Default copy for the homepage sections. Data shared with other pages lives in `shared.ts`. */
export function homeDoc() {
  return {
    hero: {
      badge: "AI agents and automation for owner-run businesses",
      titleLines: ["The work nobody", "wants to do,", "done by AI."],
      summary:
        "We are an AI agency. We find the repetitive work costing your business the most, build the agents and automations that do it, and stay on to keep them running — connected to the systems you already use.",
      primaryCta: { label: "Book a free AI audit", href: "/get-started" },
      secondaryCta: { label: "See how we work", href: "/how-we-work" },
      footnote: "Free 30-minute audit · Fixed-scope pricing · You own everything we build",
      stats: [
        { value: "Free", label: "Initial AI audit, no obligation" },
        { value: "4–6 wks", label: "Typical first automation in production" },
        { value: "100%", label: "Of the build is yours, documented" },
      ],
    },

    proof: {
      label: "Owner-run businesses we have built for",
      disclosure: "Placeholder client marks — invented for design purposes, not real customers.",
    },

    modules: {
      eyebrow: "What we do",
      titleLines: ["Find the work worth", "automating. Then build it."],
      lede:
        "Five services. Most clients start with the one that is costing them the most this quarter, then expand once it is running and paying for itself.",
    },

    /** Headline for the tabbed walkthrough of the five services. */
    services: {
      eyebrow: "The five services",
      title: "Pick the one that hurts most. Start there.",
      lede:
        "Each service solves a different kind of repetitive work, and they share the same connections to your systems — so the second one you take is always faster and cheaper than the first.",
    },

    problem: {
      eyebrow: "The problem",
      titleLines: ["You are not short of tools.", "You are short of hands."],
      lede:
        "Every system you bought was supposed to save time. Instead your team spends its day moving information between them, chasing people, and assembling reports from four places. That work is invisible on any invoice and it grows with the business.",
      items: [
        {
          title: "Enquiries sit unanswered",
          body:
            "A form nobody owns, a shared inbox and a phone nobody can answer during a job. By the time someone replies, the customer has already asked two other businesses.",
          image: "/images/problem-scattered.png",
          alt: "An overhead view of a desk buried in scattered printed spreadsheets, folders and paper notes",
          field: "bg-magenta",
          fix: "An agent that answers every channel in seconds and books the job.",
          stat: { value: "7x", label: "more likely to qualify a lead by replying within the hour" },
        },
        {
          title: "Skilled people doing unskilled work",
          body:
            "Copying invoice lines, retyping order details, chasing the same document twice, moving a job from one system to the next. Expensive people, cheap work, every single day.",
          image: "/images/problem-chasing.png",
          alt: "A professional at an office desk on a headset, surrounded by open folders and paperwork",
          field: "bg-tangerine",
          fix: "Automations that carry the work between systems on their own.",
          stat: { value: "Hours", label: "a week per person lost to work a system should do" },
        },
        {
          title: "No clear picture until month end",
          body:
            "You find out how the month went weeks after it finished, from numbers somebody assembled by hand. By then, the decisions it should have informed are already made.",
          image: "/images/problem-reporting.png",
          alt: "Hands at a keyboard in a dim office with spreadsheet grids visible on monitors behind",
          field: "bg-azure",
          fix: "Numbers that are current, and a summary in your inbox every morning.",
          stat: { value: "Days", label: "to assemble month-end numbers by hand in a typical business" },
        },
      ],
      closing:
        "None of this is a people problem. It is a design problem — and it is exactly the design problem we are paid to solve.",
    },

    /**
     * The dark "see it working" section: three short examples of an agent doing
     * a real job, rendered as conversation UI. The panels are components keyed
     * by `panel`; the words are all editable here.
     */
    agents: {
      eyebrow: "See it working",
      title: "What an agent does before your first coffee.",
      lede:
        "These are the three things owners tell us they want first: everything needing a decision in one place, context before a meeting, and an answer about the business without opening a spreadsheet.",
      cta: "How we build and run them",
      statusLabel: "Agent activity",
      statusNote: "every action cites its source",
      tabs: [
        {
          index: "01",
          title: "Triage the overnight enquiries",
          body: "Every call, form and message from the last twelve hours, answered, qualified and ranked by what needs you.",
          panel: "alerts" as const,
        },
        {
          index: "02",
          title: "Brief you before the 9am",
          body: "One page on the job you are walking into: what was agreed, what changed, what is still outstanding.",
          panel: "brief" as const,
        },
        {
          index: "03",
          title: "Answer a question about the business",
          body: "Which quotes we win, which customers have gone quiet, what that job actually made — in plain language.",
          panel: "answer" as const,
        },
      ],
      conversation: {
        alerts: {
          question: "What needs me this morning?",
          intro: "Four things, ranked by what they cost you if they wait:",
          items: [
            {
              name: "Carrow Property — survey request",
              why: "Qualified, budget confirmed, wants Thursday. Booked pending your approval.",
            },
            {
              name: "Northgate Supply — invoice query",
              why: "Queried £4,180 against order 88-412. Two line items do not match the PO.",
            },
            {
              name: "Halloran & Vance — renewal",
              why: "Contract ends in 21 days. No contact since March; usage is down 40%.",
            },
            {
              name: "Verdant Clinic — new enquiry",
              why: "Out of area but willing to travel. Asked for a price you have not published.",
            },
          ],
          sources: ["Call log · 07:12", "Order 88-412", "Contract register", "Website form"],
        },
        brief: {
          initials: "CP",
          title: "Before your 09:00 — Carrow Property",
          meta: "assembled from 34 records · 2 documents · 1 call",
          badge: "Brief",
          blocks: [
            {
              label: "Where it stands",
              body:
                "Second survey for the same landlord. First job finished 11 days late; they mentioned it once, politely, and it has not come up since.",
            },
          ],
          promisesLabel: "What you promised",
          promises: [
            "A fixed price for the full portfolio by Friday — not sent",
            "Photos of the completed roof repair — sent last Tuesday",
          ],
          risk:
            "They asked twice about timing. Lead with the schedule rather than the price, and bring the portfolio rate with you.",
        },
        answer: {
          question: "How did we win the last three jobs like this one?",
          finding: "Pattern found across 3 similar jobs",
          steps: [
            {
              step: "Same-day quote",
              detail:
                "All three were quoted within four hours of the survey. Jobs quoted the next day went to a competitor in four of five cases.",
            },
            {
              step: "One point of contact",
              detail:
                "Each was handled end to end by one person, named in the first message. No handover mentioned anywhere in the thread.",
            },
            {
              step: "Photographs before and after",
              detail:
                "Two of the three asked for proof after completion, and both referred somebody within a month.",
            },
          ],
          note: "Derived from 3 completed jobs, 14 messages and 2 call transcripts. Every claim links to the record behind it.",
        },
      },
    },

    howItWorks: {
      eyebrow: "How we work",
      title: "Audit first. Then build only what pays for itself.",
      lede:
        "The order matters. Most AI projects fail because somebody buys a tool before anyone has mapped the process. We start with four weeks of finding out, and you can stop after the first one.",
      stages: [
        {
          index: "01",
          title: "Audit",
          duration: "Week 1",
          body:
            "We spend time with the people doing the work and find every repetitive, rules-based task worth automating. You get a ranked list with realistic time and cost savings against each one.",
          detail: ["Where the time actually goes", "What is worth automating", "What we would not touch"],
        },
        {
          index: "02",
          title: "Blueprint",
          duration: "Week 2",
          body:
            "We agree the first process to fix, how the agent should behave, what it must never do, and how we will both know it is working. Fixed scope, fixed price, in writing.",
          detail: ["Process map and exceptions", "Agent rules and guardrails", "Success measures agreed"],
        },
        {
          index: "03",
          title: "Build",
          duration: "Week 3–6",
          body:
            "We build it, test it against real cases from your history, and run it alongside your team before switching it on. Training is part of the build, not an afterthought.",
          detail: ["Built on your real data", "Tested before go-live", "Your team trained"],
        },
        {
          index: "04",
          title: "Run and improve",
          duration: "Ongoing",
          body:
            "We monitor it, fix what drifts, and come back each month with what went wrong and what to automate next. If you would rather run it yourself, we document everything and hand it over.",
          detail: ["Monitored and supported", "Monthly review", "Handover whenever you want"],
        },
      ],
    },

    testimonials: {
      eyebrow: "In their words",
      titleLines: ["Owners who got their", "evenings back."],
      cta: "All case studies",
      disclosure:
        "Placeholder testimonials — invented for design purposes, not real customers. Replace before publishing.",
    },

    industries: {
      eyebrow: "Who we work with",
      title: "Businesses that run on repeat work.",
      lede:
        "We work best with owner-run businesses between roughly five and two hundred people, where the same jobs happen every week and the processes live in people's heads rather than in software.",
    },

    integrations: {
      eyebrow: "Connections",
      title: "We connect what you already pay for.",
      lede:
        "No migration, no rip-and-replace, no retraining week. Agents work inside your existing CRM, inbox, calendar, accounting package and industry systems.",
      cta: "See what we connect",
    },

    finalCta: {
      eyebrow: "Start here",
      titleLead: "Thirty minutes to find out",
      titleAccent: "what is worth automating.",
      summary:
        "Bring one process that annoys you. We will map it live, give you an honest view of whether AI should touch it, and tell you what it would take. No slides, no obligation, and the process map is yours either way.",
      primaryCta: { label: "Book a free AI audit", href: "/get-started" },
      secondaryCta: { label: "Talk to us first", href: "/contact" },
      proofLabel: "Businesses we have built for",
    },
  };
}

export type HomeDoc = ReturnType<typeof homeDoc>;
