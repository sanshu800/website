import { blogCategories, posts } from "@/lib/content/blog";

/** Default copy for `/blog` and every article. */
export function blogDoc() {
  return {
    posts,
    categories: blogCategories,
    index: {
      eyebrow: "Blog",
      title: "Writing about how firms actually operate.",
      summary:
        "No thought leadership. Practical measurement, process design and honest notes on where automation helps and where it does not.",
      emptyState: "Nothing published in this category yet.",
    },
  };
}

export type BlogDoc = ReturnType<typeof blogDoc>;
