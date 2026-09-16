import { blogCategories, posts } from "@/lib/content/blog";

/** Default copy for `/blog` and every article. */
export function blogDoc() {
  return {
    posts,
    categories: blogCategories,
    index: {
      title: "Writing for owners, not for buyers.",
      summary:
        "No thought leadership. Practical methods, real numbers, and honest notes on where automation or AI helps and where it does not.",
      emptyState: "Nothing published in this category yet.",
    },
  };
}

export type BlogDoc = ReturnType<typeof blogDoc>;
