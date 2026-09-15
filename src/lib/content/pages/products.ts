import { products } from "@/lib/content/products";

/** Default copy for `/products` and every product detail page. */
export function productsDoc() {
  return {
    items: products,
    index: {
      eyebrow: "Products",
      title: "Four jobs. One record. No seams.",
      summary:
        "Every professional-services firm runs the same four operations. Reygent gives each one a proper system, and puts all of them on a single memory layer so nothing is retyped between stages.",
      cardCta: "Explore",
    },
    detail: {
      captionSuffix: "illustrative interface",
      capabilities: {
        eyebrow: "What it does",
        /** `{name}` is replaced with the product's name at render time. */
        titleTemplate: "Six jobs {name} takes off your team.",
        lede:
          "Each of these is work a firm currently does by hand, badly, on the weeks when it is busiest.",
      },
      outcomes: {
        heading: "What changes for the firm",
        note:
          "Stated as operational outcomes rather than features, because this is what a partner meeting actually asks about.",
      },
      fits: {
        eyebrow: "Where it fits",
        title: "Pairs with the rest of the platform.",
        lede:
          "Reygent modules share one record. Context gathered in one is available in the others, with no integration work between them.",
        alongside: "Runs alongside email, calendar, documents and your ledger",
      },
    },
  };
}

export type ProductsDoc = ReturnType<typeof productsDoc>;
