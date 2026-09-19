import { solutions } from "@/lib/content/compare";

/** Default copy for `/solutions` and every industry detail page. */
export function solutionsDoc() {
  return {
    items: solutions,
    index: {
      title: "Different businesses. The same six processes.",
      summary:
        "A letting agent loses money on a missed call. A clinic loses it on an empty chair. An online shop loses it on a support queue. The work behind all three is repetitive and rules-based, so the fix looks remarkably similar. Find yours and see what it looks like.",
      sectorEyebrow: "Who we work with",
      sectorTitle: "Four kinds of business we know well.",
      modulesTitle: "The services behind every solution",
    },
    detail: {
      pressure: {
        title: "Where the money actually leaks.",
        lede:
          "None of these are unusual, and none of them are a people problem. They are what happens when a process has no owner and no system behind it.",
      },
      fits: {
        title: "Which service fixes which part.",
        lede:
          "You do not have to take all four. Most businesses start with the service that removes the most expensive problem first, then expand once it is paying for itself.",
      },
    },
  };
}

export type SolutionsDoc = ReturnType<typeof solutionsDoc>;
