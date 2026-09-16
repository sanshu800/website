import { comparisons } from "@/lib/content/compare";

/** Default copy for `/compare` and every comparison page. */
export function compareDoc() {
  return {
    items: comparisons,
    index: {
      title: "Honest comparisons, including the ones we lose.",
      summary:
        "We compare approaches rather than named competitors — partly because it is fairer, and partly because the category argument is the one that actually decides the purchase.",
      cardCta: "Read the comparison",
    },
    detail: {
      table: {
        title: "The differences that show up in week three.",
        lede:
          "Feature lists are easy to match. These are the operational differences that decide whether a system survives contact with a busy quarter.",
      },
      goodFitHeading: "This is a good fit if",
      otherHeading: "Other comparisons",
    },
  };
}

export type CompareDoc = ReturnType<typeof compareDoc>;
