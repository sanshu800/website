import { getDoc, type BlogDoc, type CompareDoc, type LegalDoc, type PricingDoc, type ServicesDoc, type SolutionsDoc } from "@/lib/cms/documents";
import type { Service } from "@/lib/content/services";
import type { Comparison, Solution } from "@/lib/content/compare";
import type { Post } from "@/lib/content/blog";
import type {
  ChromeDoc,
  CompanyDoc,
  HomeDoc,
  PagesDoc,
  ResourcesDoc,
  SharedDoc,
} from "@/lib/cms/documents";

/**
 * Typed access to the merged content documents.
 *
 * Pages call these instead of importing content modules directly. Everything
 * below is synchronous on purpose: the store is an in-process SQLite read, and
 * keeping it sync means server components do not have to become async and
 * props do not have to change shape.
 *
 * Derived values (lookups by slug, the service lists) are
 * computed *after* the merge, so an edited slug-driven list stays consistent.
 */

export type PricingContent = PricingDoc;

export function getPricing(): PricingContent {
  return getDoc<PricingContent>("pricing");
}

export function getServices(): ServicesDoc & {
  bySlug: Record<string, Service>;
  /** The four build-and-run services. */
  core: Service[];
  /** The retainer that keeps the other four working. */
  managed: Service;
} {
  const { items, ...rest } = getDoc<ServicesDoc>("services");
  return {
    ...rest,
    items,
    bySlug: Object.fromEntries(items.map((item) => [item.slug, item])),
    core: items.filter((item) => item.slug !== "managed-ai"),
    managed: items.find((item) => item.slug === "managed-ai") ?? items[0]!,
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

export function getHome(): HomeDoc {
  return getDoc<HomeDoc>("home");
}

export function getShared(): SharedDoc {
  return getDoc<SharedDoc>("shared");
}

export function getChrome(): ChromeDoc {
  return getDoc<ChromeDoc>("chrome");
}

export function getCompany(): CompanyDoc {
  return getDoc<CompanyDoc>("company");
}

export function getResources(): ResourcesDoc {
  return getDoc<ResourcesDoc>("resources");
}

export function getPages(): PagesDoc {
  return getDoc<PagesDoc>("pages");
}
