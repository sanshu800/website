import type { MetadataRoute } from "next";
import { products } from "@/lib/content/products";
import { solutions, comparisons } from "@/lib/content/compare";
import { posts } from "@/lib/content/blog";
import { roles } from "@/lib/content/company";
import { site } from "@/lib/content/marketing";

const BASE = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/products`, priority: 0.9 },
    { url: `${BASE}/solutions`, priority: 0.9 },
    { url: `${BASE}/pricing`, priority: 0.9 },
    { url: `${BASE}/product-tour`, priority: 0.8 },
    { url: `${BASE}/compare`, priority: 0.8 },
    { url: `${BASE}/customers`, priority: 0.8 },
    { url: `${BASE}/integrations`, priority: 0.7 },
    { url: `${BASE}/blog`, priority: 0.8 },
    { url: `${BASE}/guides`, priority: 0.7 },
    { url: `${BASE}/release-notes`, priority: 0.6 },
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/careers`, priority: 0.6 },
    { url: `${BASE}/startups`, priority: 0.6 },
    { url: `${BASE}/partners`, priority: 0.6 },
    { url: `${BASE}/newsletter`, priority: 0.5 },
    { url: `${BASE}/security`, priority: 0.6 },
    { url: `${BASE}/contact`, priority: 0.7 },
    { url: `${BASE}/demo`, priority: 0.8 },
    { url: `${BASE}/get-started`, priority: 0.9 },
    { url: `${BASE}/legal/privacy`, priority: 0.3 },
    { url: `${BASE}/legal/terms`, priority: 0.3 },
    { url: `${BASE}/legal/security`, priority: 0.4 },
  ].map((entry) => ({ ...entry, lastModified: now, changeFrequency: "weekly" }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((solution) => ({
    url: `${BASE}/solutions/${solution.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
    url: `${BASE}/compare/${comparison.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const roleRoutes: MetadataRoute.Sitemap = roles.map((role) => ({
    url: `${BASE}/careers/${role.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...solutionRoutes,
    ...comparisonRoutes,
    ...postRoutes,
    ...roleRoutes,
  ];
}
