import { legalPages } from "@/lib/content/company";

/** Default copy for the legal pages — privacy, terms, DPA, sub-processors. */
export function legalDoc() {
  return { pages: legalPages };
}

export type LegalDoc = ReturnType<typeof legalDoc>;
