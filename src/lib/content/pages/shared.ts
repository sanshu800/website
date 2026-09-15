import {
  clients,
  integrations,
  platformFacts,
  testimonials,
} from "@/lib/content/marketing";

/**
 * Default copy shared across pages: the client marks, the testimonial wall, the
 * integration surfaces and the capability counts. These used to be reachable
 * only by editing `marketing.ts`, and they appear on the homepage, `/customers`,
 * `/about`, `/integrations`, `/demo` and the practice pages — so they live in
 * one document that every one of those surfaces reads.
 */
export function sharedDoc() {
  return {
    clients,
    testimonials,
    integrations,
    platformFacts,
    disclosures: {
      clients: "Placeholder client marks — invented for design purposes.",
      testimonials:
        "Placeholder testimonials — invented for design purposes, not real customers. Replace before publishing.",
      customersPage: "Placeholder testimonials — invented for design purposes.",
    },
  };
}

export type SharedDoc = ReturnType<typeof sharedDoc>;
