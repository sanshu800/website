import { engagements, pricingFaqs } from "@/lib/content/company";

/**
 * Copy for the engagement/pricing surface: `/pricing`, the homepage preview and
 * the enquiry form on `/get-started`.
 *
 * We sell work, not seats, so there are no per-seat plans here — there are three ways
 * of working with us: a fixed-fee audit, a fixed-price build, and the monthly
 * retainer that keeps it running. Everything on this surface is editable from
 * the admin panel, and the list itself is carried into the document so one edit
 * changes `/pricing`, the homepage and the form together.
 */
export const pricingCopy = {
  hero: {
    title: "Fixed prices, agreed before we start.",
    summary:
      "You are buying work, not a licence. Every engagement is scoped in writing, priced up front, and paid against milestones — starting with a one-week audit that is credited against your build if you continue.",
  },

  plans: {
    popularBadge: "Most start here",
    unit: "",
    footnoteBefore: "Business under three years old? Our founders programme builds one process for a fixed",
    footnoteLink: "$6,000",
    quoteCta: "Not sure which one you need?",
    /* Read by anyone outside the US or UK: names the currency, the currency we
       will contract in, and that geography is not a filter. */
    currencyNote:
      "Prices are in USD. We work with clients worldwide and will contract in GBP or EUR if that suits your books better.",
  },

  engagementsList: engagements,

  /** The same engagements as a compact block on the homepage. */
  preview: {
    title: "Three ways to work with us.",
    lede:
      "Start with the audit. Most businesses go on to a build, and the ones that want us to stay on afterwards keep a retainer. You are never locked in — the code and the accounts are yours from day one.",
    compareLink: "What is included in each",
    footnote: "Fixed scope · Milestone payments · You own everything we build",
    currencyNote:
      "Prices in USD · we work with clients worldwide, in your timezone and your currency",
  },

  comparison: {
    title: "Exactly what is included.",
    featureColumn: "Included",
    columnNames: ["Audit", "Build project", "Ongoing support"],
    rows: [
      { row: "Who it is for", core: "Before you commit to anything", pro: "You know the process to fix", ent: "You want it looked after" },
      { row: "Typical price", core: "$3,000 fixed", pro: "$12,000 – $32,000 fixed", ent: "From $1,200 / month" },
      { row: "Time involved", core: "One week", pro: "Four to eight weeks", ent: "Ongoing" },
      { row: "Your team's time", core: "4–5 hours", pro: "About an hour a week", ent: "One monthly review" },
      { row: "Ranked automation plan", core: "Included", pro: "Included", ent: "Kept current" },
      { row: "The process built", core: "—", pro: "One, end to end", ent: "As agreed each quarter" },
      { row: "Connected to your systems", core: "—", pro: "Included", ent: "Maintained" },
      { row: "Run in parallel before go-live", core: "—", pro: "Two weeks", ent: "Continuous" },
      { row: "Team training and documentation", core: "—", pro: "Included", ent: "Updated as you change" },
      { row: "Monitoring and alerting", core: "—", pro: "30 days included", ent: "Included" },
      { row: "Model upgrades tested on your cases", core: "—", pro: "—", ent: "Included" },
      { row: "Named person who knows your setup", core: "—", pro: "Your build team", ent: "Included" },
      { row: "Who owns the build", core: "You — the document is yours", pro: "You", ent: "You" },
      { row: "Coming out of it", core: "No obligation", pro: "Handover, or a retainer", ent: "30 days' notice" },
    ],
  },

  faq: {
    title: "Questions owners ask us",
    summary:
      "Including what happens if it does not work, which we would rather answer now than in a contract negotiation.",
  },
  faqs: pricingFaqs,

  cta: {
    title: "Not sure which one you need?",
    summary:
      "That is normal. Tell us the one job that annoys you most and we will tell you whether it is worth automating, what it would cost, and which engagement makes sense — including if the answer is none of them yet.",
  },
};

export type PricingCopy = typeof pricingCopy;
