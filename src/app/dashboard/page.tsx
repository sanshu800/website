import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { dashboard } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { Card, HealthPill, Pill, StagePill, StatCard, TrendChart } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { formatCurrency, formatDate, relativeTime, daysUntil } from "@/lib/utils";

export default async function DashboardOverview() {
  const session = await getSession();
  const totals = dashboard.totals();
  const pipeline = dashboard.pipeline();
  const companies = dashboard.companies({ perPage: 6, sort: "touch" });
  const tasks = dashboard.tasks("open").slice(0, 5);
  const activity = dashboard.activities(8);
  const revenue = dashboard.revenueByMonth().map((row) => ({
    label: row.month,
    value: row.value,
  }));
  const sectors = dashboard.sectors();

  const maxStage = Math.max(1, ...pipeline.map((stage) => stage.value));

  return (
    <>
      <DashboardHeader
        eyebrow="Overview"
        title={`Good to see you, ${session?.name.split(" ")[0] ?? "there"}.`}
        summary="Everything below is read from the platform database on each request — the same tables the modules write to."
        action={
          <Link
            href="/dashboard/ask"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-mist"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            Ask about the book
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open pipeline"
          value={formatCurrency(totals.pipeline)}
          detail={`${totals.engagements} engagements across ${pipeline.filter((s) => s.deals > 0).length} stages`}
          tone="violet"
        />
        <StatCard
          label="Won to date"
          value={formatCurrency(totals.wonValue)}
          detail={`Across ${totals.companies} client records`}
        />
        <StatCard
          label="Accounts at risk"
          value={String(totals.atRisk)}
          detail="Health flagged watch or risk"
          href="/dashboard/companies?health=watch"
        />
        <StatCard
          label="Open tasks"
          value={String(totals.openTasks)}
          detail={`${totals.submissions} inbound submission${totals.submissions === 1 ? "" : "s"} unread`}
          href="/dashboard/tasks"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card
          title="Pipeline by stage"
          className="lg:col-span-7"
          padded={false}
          action={
            <Link
              href="/dashboard/engagements"
              className="text-[0.75rem] font-medium text-violet"
            >
              Open board
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {pipeline.map((stage) => (
              <li key={stage.stage} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-[104px] shrink-0 text-[0.8125rem] text-ink">
                  {stage.stage}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist-2">
                  <span
                    className="block h-full rounded-full bg-violet"
                    style={{ width: `${(stage.value / maxStage) * 100}%` }}
                  />
                </span>
                <span className="w-[92px] shrink-0 text-right font-mono text-[0.75rem] text-fog">
                  {formatCurrency(stage.value)}
                </span>
                <span className="w-[46px] shrink-0 text-right font-mono text-[0.6875rem] text-fog-2">
                  {stage.deals}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Won value by month" className="lg:col-span-5">
          {revenue.length > 0 ? (
            <TrendChart data={revenue} />
          ) : (
            <p className="text-micro text-fog">No won engagements yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card
          title="Needs attention"
          className="lg:col-span-5"
          padded={false}
          action={
            <Link href="/dashboard/tasks" className="text-[0.75rem] font-medium text-violet">
              All tasks
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {tasks.map((task) => {
              const overdue = daysUntil(task.due_at) < 0;
              return (
                <li key={task.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[0.8125rem] font-medium text-ink">{task.title}</p>
                    <span
                      className={`shrink-0 font-mono text-[0.625rem] ${
                        overdue ? "text-danger" : "text-fog-2"
                      }`}
                    >
                      {overdue ? "overdue" : relativeTime(task.due_at)}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.75rem] text-fog">
                    {task.company ?? "Unassigned to a client"} · {task.assignee || "No owner"}
                  </p>
                </li>
              );
            })}
            {tasks.length === 0 && (
              <li className="px-5 py-6 text-micro text-fog">Nothing open. Enjoy it.</li>
            )}
          </ul>
        </Card>

        <Card title="Recent activity" className="lg:col-span-7" padded={false}>
          <ul className="divide-y divide-line">
            {activity.map((item) => (
              <li key={item.id} className="flex gap-4 px-5 py-3.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8125rem] text-fg-2">{item.summary}</p>
                  <p className="mt-1 text-[0.6875rem] text-fog-2">
                    {item.actor} · {item.source} · {relativeTime(item.at)}
                  </p>
                </div>
                <Pill tone="neutral" className="shrink-0">
                  {item.kind}
                </Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card
          title="Stalest relationships"
          className="lg:col-span-7"
          padded={false}
          action={
            <Link
              href="/dashboard/companies"
              className="text-[0.75rem] font-medium text-violet"
            >
              All records
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {companies.rows.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/dashboard/companies/${company.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-mist/60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.875rem] font-medium text-ink">
                      {company.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.6875rem] text-fog">
                      {company.sector} · {company.city}, {company.country} ·{" "}
                      {company.owner || "No owner"}
                    </span>
                  </span>
                  <StagePill stage={company.stage} />
                  <HealthPill health={company.health} />
                  <span className="hidden w-[92px] shrink-0 text-right font-mono text-[0.75rem] text-fog sm:block">
                    {formatDate(company.last_touch)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-fog-2" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Book by practice" className="lg:col-span-5" padded={false}>
          <ul className="divide-y divide-line">
            {sectors.map((sector) => (
              <li key={sector.sector} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <span className="text-[0.8125rem] text-ink">{sector.sector}</span>
                <span className="flex items-center gap-4">
                  <span className="font-mono text-[0.6875rem] text-fog-2">
                    {sector.companies} firms
                  </span>
                  <span className="font-mono text-[0.75rem] text-fog">
                    {formatCurrency(sector.value)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-fog-2">
        Sample workspace — the records are invented, the queries are real. Login
        demo@reygent.ai / demo1234.
      </p>
    </>
  );
}
