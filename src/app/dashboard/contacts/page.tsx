import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { all } from "@/lib/db";
import { Card, EmptyState, Pill, StatCard } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { formatDate, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Contacts" };

type Row = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string | null;
  seniority: string;
  status: string;
  created_at: string;
  company: string;
  company_id: string;
  sector: string;
};

type SearchParams = Promise<{ q?: string; seniority?: string; page?: string }>;

const SENIORITIES = ["All", "Partner", "Director", "Manager", "Associate", "Operations"];

export default async function ContactsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const seniority = params.seniority ?? "All";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const perPage = 20;

  const where: string[] = [];
  const args: unknown[] = [];
  if (q) {
    where.push(`(lower(ct.name) LIKE ? OR lower(ct.email) LIKE ? OR lower(c.name) LIKE ?)`);
    args.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (seniority !== "All") {
    where.push(`ct.seniority = ?`);
    args.push(seniority);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = all<Row>(
    `SELECT ct.*, c.name AS company, c.id AS company_id, c.sector
       FROM contacts ct JOIN companies c ON c.id = ct.company_id
       ${clause}
      ORDER BY c.name ASC, ct.seniority ASC
      LIMIT ? OFFSET ?`,
    [...args, perPage, (page - 1) * perPage],
  );

  const totalRow = all<{ n: number }>(
    `SELECT COUNT(*) AS n FROM contacts ct JOIN companies c ON c.id = ct.company_id ${clause}`,
    args,
  )[0];
  const total = totalRow?.n ?? 0;
  const pages = Math.max(1, Math.ceil(total / perPage));

  const champions = all<{ n: number }>(
    `SELECT COUNT(*) AS n FROM contacts WHERE status = 'champion'`,
  )[0]?.n ?? 0;
  const companies = all<{ n: number }>(
    `SELECT COUNT(DISTINCT company_id) AS n FROM contacts`,
  )[0]?.n ?? 0;

  return (
    <>
      <DashboardHeader
        eyebrow="Records"
        title="Contacts"
        summary="Everyone we have a name for, across every client firm, with the relationship status that decides who gets called first."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Contacts" value={String(total)} />
        <StatCard label="Champions" value={String(champions)} tone="violet" />
        <StatCard label="Firms covered" value={String(companies)} />
      </div>

      <form method="get" className="mt-4 rounded-2xl border border-line bg-paper p-5">
        <div className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <label
              htmlFor="contact-search"
              className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
            >
              Search
            </label>
            <input
              id="contact-search"
              name="q"
              type="search"
              defaultValue={params.q ?? ""}
              placeholder="Name, email or firm"
              className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3.5 text-[0.875rem] outline-none focus-visible:border-violet"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="seniority"
              className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
            >
              Seniority
            </label>
            <select
              id="seniority"
              name="seniority"
              defaultValue={seniority}
              className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3 text-[0.875rem] outline-none focus-visible:border-violet"
            >
              {SENIORITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:col-span-2">
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-violet text-[0.8125rem] font-medium text-white transition-colors hover:bg-violet-2"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No contacts match"
            body="Clear the filters to see the full contact book, or search for a firm name instead."
          />
        </div>
      ) : (
        <Card className="mt-4" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-mist/70">
                  {["Contact", "Firm", "Seniority", "Status", "Added"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((contact) => (
                  <tr key={contact.id} className="border-b border-line last:border-0 hover:bg-mist/50">
                    <th scope="row" className="px-5 py-3.5 text-left font-normal">
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-2 font-mono text-[0.625rem] text-fog">
                          {initials(contact.name)}
                        </span>
                        <span>
                          <span className="block text-[0.875rem] font-medium text-ink">
                            {contact.name}
                          </span>
                          <span className="block text-[0.6875rem] text-fog">
                            {contact.title}
                          </span>
                        </span>
                      </span>
                    </th>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/companies/${contact.company_id}`}
                        className="text-[0.8125rem] text-ink hover:text-violet"
                      >
                        {contact.company}
                      </Link>
                      <span className="mt-0.5 block text-[0.6875rem] text-fog-2">
                        {contact.sector}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[0.8125rem] text-fog">
                      {contact.seniority}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill tone={contact.status === "champion" ? "violet" : "neutral"}>
                        {contact.status}
                      </Pill>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[0.75rem] text-fog">
                      {formatDate(contact.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            aria-label="Pagination"
            className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4"
          >
            <p className="text-[0.75rem] text-fog">
              Page <span className="font-medium text-ink">{page}</span> of {pages} · {total}{" "}
              contacts
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/contacts?${new URLSearchParams({ ...(q ? { q } : {}), seniority, page: String(page - 1) }).toString()}`}
                  className="flex h-8 items-center rounded-lg border border-line px-3 text-[0.75rem] text-fog hover:bg-mist hover:text-ink"
                >
                  Previous
                </Link>
              )}
              {page < pages && (
                <Link
                  href={`/dashboard/contacts?${new URLSearchParams({ ...(q ? { q } : {}), seniority, page: String(page + 1) }).toString()}`}
                  className="flex h-8 items-center rounded-lg border border-line px-3 text-[0.75rem] text-fog hover:bg-mist hover:text-ink"
                >
                  Next
                </Link>
              )}
            </div>
          </nav>
        </Card>
      )}

      <p className="mt-4 flex items-center gap-2 text-[0.75rem] text-fog-2">
        <Mail className="h-3.5 w-3.5" />
        Email addresses are invented for the sample workspace and will not deliver.
      </p>
    </>
  );
}
