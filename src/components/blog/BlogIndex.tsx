"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { blogCategories, type Post } from "@/lib/content/blog";
import { formatDate, cn } from "@/lib/utils";

const PAGE_SIZE = 6;

/**
 * Blog index with real search, category filtering and pagination.
 * All client-side because the corpus is small and static — no round trip for
 * a filter change, and the full list is in the DOM for crawlers on first load.
 */
export function BlogIndex({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function reset(next: () => void) {
    next();
    setPage(1);
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {blogCategories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => reset(() => setCategory(item))}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-200",
                category === item
                  ? "border-ink bg-ink text-white"
                  : "border-line text-fg-2 hover:border-line-strong hover:text-ink",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative lg:w-[280px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-2"
            aria-hidden="true"
          />
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => reset(() => setQuery(event.target.value))}
            placeholder="Search articles…"
            className="h-10 w-full rounded-full border border-line bg-mist pl-9 pr-9 text-small text-ink placeholder:text-fog-2 focus:border-violet focus:bg-paper focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => reset(() => setQuery(""))}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fog-2 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-micro text-fog">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {category !== "All" && ` in ${category}`}
        {query && ` matching “${query}”`}
      </p>

      {/* Results */}
      {visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-mist p-10 text-center">
          <p className="text-display-s text-ink">Nothing matches that.</p>
          <p className="mt-2 text-small text-fog">
            Try a broader search, or clear the filters.
          </p>
          <button
            type="button"
            onClick={() =>
              reset(() => {
                setQuery("");
                setCategory("All");
              })
            }
            className="mt-5 rounded-full border border-line-strong bg-paper px-4 py-2 text-small text-ink"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.slug} className="group">
              <a href={`/blog/${post.slug}`} className="block">
                <Badge accent="neutral">{post.category}</Badge>
                <h3 className="mt-3.5 text-[1.125rem] font-medium leading-snug text-ink transition-colors group-hover:text-violet">
                  {post.title}
                </h3>
                <p className="mt-2.5 line-clamp-3 text-micro text-fog">{post.excerpt}</p>
                <p className="mt-4 font-mono text-[0.6875rem] text-fog-2">
                  {formatDate(post.publishedAt)} · {post.readingMinutes} min
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-12 flex items-center justify-between border-t border-line pt-6"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded-full border border-line px-4 py-2 text-small text-fg-2 transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-[0.75rem] text-fog">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded-full border border-line px-4 py-2 text-small text-fg-2 transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
