import { getDoc, type BlogDoc, type CompareDoc, type LegalDoc, type PricingDoc, type ProductsDoc, type SolutionsDoc } from "@/lib/cms/documents";
import type { Product } from "@/lib/content/products";
import type { Comparison, Solution } from "@/lib/content/compare";
import type { Post } from "@/lib/content/blog";

/**
 * Typed access to the merged content documents.
 *
 * Pages call these instead of importing content modules directly. Everything
 * below is synchronous on purpose: the store is an in-process SQLite read, and
 * keeping it sync means server components do not have to become async and
 * props do not have to change shape.
 *
 * Derived values (lookups by slug, the module list, the foundation layer) are
 * computed *after* the merge, so an edited slug-driven list stays consistent.
 */

export type PricingContent = PricingDoc;

export function getPricing(): PricingContent {
  return getDoc<PricingContent>("pricing");
}

export function getProducts(): ProductsDoc & {
  bySlug: Record<string, Product>;
  modules: Product[];
  foundation: Product;
} {
  const { items, ...rest } = getDoc<ProductsDoc>("products");
  return {
    ...rest,
    items,
    bySlug: Object.fromEntries(items.map((item) => [item.slug, item])),
    modules: items.filter((item) => item.slug !== "foundation"),
    foundation: items.find((item) => item.slug === "foundation") ?? items[0]!,
  };
}

export function getSolutions(): SolutionsDoc & { bySlug: Record<string, Solution> } {
  const { items, ...rest } = getDoc<SolutionsDoc>("solutions");
  return { ...rest, items, bySlug: Object.fromEntries(items.map((item) => [item.slug, item])) };
}

export function getComparisons(): CompareDoc & { bySlug: Record<string, Comparison> } {
  const { items, ...rest } = getDoc<CompareDoc>("compare");
  return { ...rest, items, bySlug: Object.fromEntries(items.map((item) => [item.slug, item])) };
}

export function getBlog(): BlogDoc & { bySlug: Record<string, Post> } {
  const { posts, ...rest } = getDoc<BlogDoc>("blog");
  return { ...rest, posts, bySlug: Object.fromEntries(posts.map((post) => [post.slug, post])) };
}

export function getLegal(): LegalDoc {
  return getDoc<LegalDoc>("legal");
}
