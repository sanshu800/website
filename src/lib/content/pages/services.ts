import { services } from "@/lib/content/services";

/** Default copy for `/services` and every service detail page. */
export function servicesDoc() {
  return {
    items: services,
    index: {
      title: "Five ways we take work off your team.",
      summary:
        "Most businesses start with the one that hurts most. Agents that answer, automation that connects, documents that process themselves, numbers you can question — and a retainer that keeps all of it working.",
      cardCta: "Explore",
    },
    detail: {
      captionSuffix: "illustrative interface",
      capabilities: {
        /** `{name}` is replaced with the service's name at render time. */
        titleTemplate: "Six jobs {name} takes off your team.",
        lede:
          "Each of these is work somebody in your business is doing by hand right now, usually late on a Friday.",
      },
      outcomes: {
        heading: "What changes for the business",
        note:
          "Written as outcomes an owner would actually notice, rather than features to be impressed by.",
      },
      fits: {
        title: "It joins up with everything else we build.",
        lede:
          "Start with one service. They share the same connections and the same record, so the second one is always faster and cheaper than the first.",
        alongside: "Runs alongside your CRM, inbox, calendar, ledger and storage",
      },
    },
  };
}

export type ServicesDoc = ReturnType<typeof servicesDoc>;
