import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { dashboard } from "@/lib/queries";
import { Card, HealthPill, Pagination, StagePill, StatCard, EmptyState } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Companies" };

const STAGES = ["All", "Discovery", "Qualified", "Proposal", "Negotiation", "Onboarding", "Won"];
const HEALTHS = ["All", "healthy", "watch", "risk"];
const SORTS = [
  { value: "recent", label: "Newest first" },
  { value: "value", label: "Highest ARR" },
  { value: "name", label: "Name A–Z" },
  { value: "touch", label: "Stalest first" },
];

type SearchParams = Promise<{
  q?: string;
  sector?: string;
  health?: string;
  stage?: string;
  sort?: string;
  page?: string;
}>;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const result = dashboard.companies({
    q: params.q,
    sector: params.sector,
    health: params.health,
    stage: params.stage,
    sort: params.sort,
    page,
    perPage: 12,
  });

  const filtered = Boolean(
    params.q ||
      (params.sector && params.sector !== "All") ||
      (params.health && params.health !== "All") ||
      (params.stage && params.stage !== "All"),
  );

  const totalArr = result.rows.reduce((sum, row) => sum + row.arr, 0);

  return (
    <>
      <DashboardHeader
        eyebrow="Records"
        title="Companies"
        summary="Search, filter and page through the client book. Filters are part of the URL, so any view can be shared or bookmarked."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Matching records" value={String(result.total)} />
        <StatCard label="Sum of ARR on this page" value={formatCurrency(totalArr)} />
        <StatCard label="Pages" value={`${result.page} / ${result.pages}`} />
      </div>

      <form
        method="get"
        className="mt-4 rounded-2xl border border-line bg-paper p-5"
        aria-label="Filter companies"
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label
              htmlFor="company-search"
              className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
            >
              Search
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-2" />
              <input
                id="company-search"
                name="q"
                type="search"
                defaultValue={params.q ?? ""}
                placeholder="Name, domain or city"
                className="h-11 w-full rounded-lg border border-line-strong bg-paper pl-10 pr-4 text-[0.875rem] outline-none focus-visible:border-violet"
              />
            </div>
          </div>

          <FilterSelect
            id="sector"
            label="Practice"
            value={params.sector ?? "All"}
            options={["All", ...result.sectors.map((sector) => sector.sector)]}
          />
          <FilterSelect
            id="stage"
            label="Stage"
            value={params.stage ?? "All"}
            options={STAGES}
          />
          <FilterSelect
            id="health"
            label="Health"
            value={params.health ?? "All"}
            options={HEALTHS}
          />

          <div className="lg:col-span-2">
            <label
              htmlFor="sort"
              className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
            >
              Sort
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={params.sort ?? "recent"}
              className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3 text-[0.875rem] outline-none focus-visible:border-violet"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-violet px-4 text-[0.8125rem] font-medium text-white transition-colors hover:bg-violet-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Apply filters
          </button>
          {filtered && (
            <Link
              href="/dashboard/companies"
              className="text-[0.8125rem] text-fog underline underline-offset-2"
            >
              Clear
            </Link>
          )}
          <span className="ml-auto font-mono text-[0.6875rem] text-fog-2">
            {result.total} record{result.total === 1 ? "" : "s"}
          </span>
        </div>
      </form>

      {result.rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No companies match those filters"
            body="Try a broader search term, or clear the filters and browse the whole book."
          />
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-mist/70">
                  {["Company", "Practice", "Stage", "Health", "ARR", "Owner", "Last touch", ""].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-3 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((company) => (
                  <tr key={company.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <th scope="row" className="px-5 py-3.5 text-left">
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        className="text-[0.875rem] font-medium text-ink hover:text-violet"
                      >
                        {company.name}
                      </Link>
                      <span className="mt-0.5 block font-mono text-[0.6875rem] text-fog-2">
                        {company.domain}
                      </span>
                    </th>
                    <td className="px-5 py-3.5 text-[0.8125rem] text-fog">{company.sector}</td>
                    <td className="px-5 py-3.5">
                      <StagePill stage={company.stage} />
                    </td>
                    <td className="px-5 py-3.5">
                      <HealthPill health={company.health} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[0.8125rem] text-ink">
                      {formatCurrency(company.arr)}
                    </td>
                    <td className="px-5 py-3.5 text-[0.8125rem] text-fog">
                      {company.owner || "—"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[0.75rem] text-fog">
                      {formatDate(company.last_touch)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        aria-label={`Open ${company.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-fog transition-colors hover:bg-mist hover:text-ink"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={result.page}
            pages={result.pages}
            total={result.total}
            perPage={result.perPage}
            basePath="/dashboard/companies"
            query={{
              q: params.q,
              sector: params.sector,
              health: params.health,
              stage: params.stage,
              sort: params.sort,
            }}
          />
        </div>
      )}

      <Card title="Saved views" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "At risk", href: "/dashboard/companies?health=risk" },
            { label: "Onboarding", href: "/dashboard/companies?stage=Onboarding" },
            { label: "Legal practices", href: "/dashboard/companies?sector=Legal" },
            { label: "Highest ARR", href: "/dashboard/companies?sort=value" },
            { label: "Needs contact", href: "/dashboard/companies?sort=touch" },
          ].map((view) => (
            <Link
              key={view.label}
              href={view.href}
              className="rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist hover:text-ink"
            >
              {view.label}
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div className="lg:col-span-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        defaultValue={value}
        className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3 text-[0.875rem] capitalize outline-none focus-visible:border-violet"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
