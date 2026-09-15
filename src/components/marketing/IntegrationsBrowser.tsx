"use client";

import { useMemo, useState } from "react";
import { Plug, Search } from "lucide-react";
import { integrations } from "@/lib/content/marketing";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", ...integrations.map((i) => i.category)];

/**
 * Filterable connector directory. Search matches the category, the blurb and
 * every surface name, so typing "signature" finds documents & e-signature.
 */
export function IntegrationsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return integrations
      .filter((item) => category === "All" || item.category === category)
      .map((item) => {
        if (!q) return { item, hits: item.surfaces };
        const hits = item.surfaces.filter((s) => s.toLowerCase().includes(q));
        const match =
          hits.length > 0 ||
          item.category.toLowerCase().includes(q) ||
          item.blurb.toLowerCase().includes(q);
        return match ? { item, hits: hits.length ? hits : item.surfaces } : null;
      })
      .filter((row): row is { item: (typeof integrations)[number]; hits: string[] } => row !== null);
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                category === item
                  ? "border-violet bg-violet text-white"
                  : "border-line-strong bg-paper text-ink-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <label htmlFor="integration-search" className="sr-only">
            Search connectors
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden="true"
          />
          <input
            id="integration-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 40+ connectors"
            className="w-full rounded-full border border-line-strong bg-paper py-2.5 pr-4 pl-10 text-sm text-ink placeholder:text-ink-subtle focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/15"
          />
        </div>
      </div>

      <p className="mt-5 font-mono text-xs tracking-wide text-ink-subtle uppercase" aria-live="polite">
        {results.length} {results.length === 1 ? "group" : "groups"} shown
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map(({ item, hits }) => (
          <li
            key={item.category}
            className="flex flex-col rounded-2xl border border-line bg-paper-raised p-6 transition hover:border-violet/30 hover:shadow-[0_18px_40px_-28px_rgba(16,12,32,0.35)]"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-soft text-violet">
              <Plug className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-ink">
              {item.category}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {hits.map((surface) => (
                <li key={surface}>
                  <Badge accent="violet">{surface}</Badge>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line-strong bg-mist/60 p-8 text-center text-sm text-ink-muted">
          Nothing matches &ldquo;{query}&rdquo;. Tell us what you need and we will
          tell you honestly whether it connects today.
        </p>
      ) : null}
    </div>
  );
}
