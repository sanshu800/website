import { solutions } from "@/lib/content/compare";

/** Default copy for `/solutions` and every practice detail page. */
export function solutionsDoc() {
  return {
    items: solutions,
    index: {
      eyebrow: "Solutions",
      title: "The same foundation, shaped to your practice.",
      summary:
        "A legal firm's intake is a conflict check. An accountancy practice's is a scope conversation. The coordination problem is identical; the record is not. Pick your practice and we will show you the configured version.",
      sectorEyebrow: "By practice",
      sectorTitle: "Four sectors, in production.",
      modulesTitle: "The modules behind every solution",
    },
    detail: {
      pressure: {
        eyebrow: "Where the pressure shows up",
        title: "Four problems we see in almost every firm.",
        lede:
          "None of these are unusual, and none of them are a people problem. They are what happens when a process has no owner and no system.",
      },
      fits: {
        eyebrow: "How Reygent fits",
        title: "Which module solves which part.",
        lede:
          "You do not have to adopt all of it. Most firms start with the module that removes the most expensive seam first.",
      },
    },
  };
}

export type SolutionsDoc = ReturnType<typeof solutionsDoc>;
