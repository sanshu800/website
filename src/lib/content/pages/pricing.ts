import { pricingFaqs, tiers } from "@/lib/content/company";

/**
 * Copy for the pricing surface: `/pricing`, the homepage plan preview and the
 * plan picker on `/get-started`.
 *
 * These strings used to live inline in the page components, which meant only a
 * developer could change them. They live here now, and the admin panel resolves
 * them through `getPricing()` so an editor's value wins over this object.
 *
 * The plan list and FAQ entries are the same objects `/pricing` always used —
 * they are carried into the document so the whole surface is editable in one
 * place instead of half here and half in a page file.
 */
export const pricingCopy = {
  hero: {
    eyebrow: "Pricing",
    title: "Priced per user, so growth is not punished.",
    summary:
      "You are not charged per client record, per call or per automation run on a metered basis. Add the whole firm to the record, because that is the point of having one.",
  },

  plans: {
    popularBadge: "Most popular",
    unit: "/ user / mo",
    footnoteBefore: "Education and non-profit discounts available. Firms under three years old may qualify for the",
    footnoteLink: "startup programme",
    quoteCta: "Talk to us before you buy",
  },

  plansList: tiers,

  /** The same plans as a compact block on the homepage. */
  preview: {
    eyebrow: "Pricing",
    title: "Per user. Not per client, not per call.",
    lede:
      "You are not penalised for growing your client base, and we are not incentivised to make you ration access to the record.",
    compareLink: "Compare every plan limit",
    footnote: "14-day trial · no card · full data export if you leave",
  },

  comparison: {
    eyebrow: "Full comparison",
    title: "Every limit, on one page.",
    featureColumn: "Feature",
    columnNames: ["Core", "Pro", "Enterprise"],
    rows: [
      { row: "Modules included", core: "Intake, Engage, Deliver, Insight", pro: "All four", ent: "All four" },
      { row: "Foundation memory layer", core: "Included", pro: "Included", ent: "Included" },
      { row: "Active client records", core: "2,500", pro: "25,000", ent: "Unlimited" },
      { row: "Automation runs / month", core: "25,000", pro: "250,000", ent: "Negotiated" },
      { row: "Ask Reygent", core: "Included", pro: "Unlimited", ent: "Unlimited, private routing" },
      { row: "Custom record types", core: "—", pro: "Included", ent: "Included" },
      { row: "Workflow builder", core: "—", pro: "Included", ent: "Included" },
      { row: "Cross-practice reporting", core: "—", pro: "Included", ent: "Included" },
      { row: "SSO / SCIM", core: "—", pro: "—", ent: "Included" },
      { row: "Audit log export", core: "—", pro: "—", ent: "Included" },
      { row: "Data residency options", core: "—", pro: "—", ent: "Included" },
      { row: "Support", core: "Email, next business day", pro: "Priority, 4-hour", ent: "Named contact, SLA" },
      { row: "Implementation", core: "Guided self-serve", pro: "Assisted", ent: "Named lead" },
    ],
  },

  faq: {
    title: "Questions firms ask us",
    summary:
      "Including the ones about leaving, which we answer the same way in conversation as we do here.",
  },
  faqs: pricingFaqs,

  cta: {
    title: "Not sure which plan fits?",
    summary:
      "Tell us how many people handle intake, how many client relationships are live, and whether you have an IT function. We will tell you honestly — including if Core is enough.",
  },
};

export type PricingCopy = typeof pricingCopy;
