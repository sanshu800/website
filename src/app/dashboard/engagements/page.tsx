import type { Metadata } from "next";
import Link from "next/link";
import { dashboard } from "@/lib/queries";
import { Card, StagePill, StatCard } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Engagements" };

const COLUMNS = ["Discovery", "Qualified", "Proposal", "Negotiation", "Onboarding", "Won"];

export default async function EngagementsPage() {
  const engagements = dashboard.engagements();
  const pipeline = dashboard.pipeline();
  const totals = dashboard.totals();

  const won = engagements.filter((engagement) => engagement.stage === "Won");
  const open = engagements.filter(
    (engagement) => engagement.stage !== "Won" && engagement.stage !== "Lost",
  );
  const weighted = open.reduce(
    (sum, engagement) => sum + (engagement.value * engagement.probability) / 100,
    0,
  );
  const winRate =
    won.length + engagements.filter((engagement) => engagement.stage === "Lost").length > 0
      ? Math.round(
          (won.length /
            (won.length +
              engagements.filter((engagement) => engagement.stage === "Lost").length)) *
            100,
        )
      : 100;

  return (
    <>
      <DashboardHeader
        eyebrow="Revenue"
        title="Engagements"
        summary="Every open and closed piece of work, grouped by stage. Probabilities are per-engagement, so the weighted forecast is computed rather than typed in."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open pipeline" value={formatCurrency(totals.pipeline)} tone="accent" />
        <StatCard label="Weighted forecast" value={formatCurrency(weighted)} />
        <StatCard label="Won" value={formatCurrency(totals.wonValue)} detail={`${won.length} engagements`} />
        <StatCard label="Win rate" value={`${winRate}%`} detail="Closed won vs closed lost" />
      </div>

      <Card title="Board" className="mt-4" padded={false}>
        <div className="overflow-x-auto p-5">
          <div className="flex min-w-[980px] gap-4">
            {COLUMNS.map((column) => {
              const items = engagements.filter((engagement) => engagement.stage === column);
              const columnValue = items.reduce((sum, item) => sum + item.value, 0);
              return (
                <div key={column} className="w-[190px] shrink-0">
                  <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2.5">
                    <h3 className="text-[0.8125rem] font-medium text-ink">{column}</h3>
                    <span className="font-mono text-[0.625rem] text-fog-2">{items.length}</span>
                  </div>
                  <p className="mt-2.5 font-mono text-[0.6875rem] text-fog">
                    {formatCurrency(columnValue)}
                  </p>

                  <ul className="mt-3 space-y-2.5">
                    {items.map((engagement) => (
                      <li key={engagement.id}>
                        <Link
                          href={`/dashboard/companies/${engagement.company_id}`}
                          className="block rounded-xl border border-line bg-paper p-3.5 transition-colors hover:border-accent/40"
                        >
                          <span className="block text-[0.8125rem] font-medium text-ink">
                            {engagement.company}
                          </span>
                          <span className="mt-1 block text-[0.6875rem] leading-snug text-fog">
                            {engagement.title}
                          </span>
                          <span className="mt-3 flex items-center justify-between">
                            <span className="font-mono text-[0.6875rem] text-ink">
                              {formatCurrency(engagement.value)}
                            </span>
                            <span className="font-mono text-[0.625rem] text-fog-2">
                              {engagement.probability}%
                            </span>
                          </span>
                          <span className="mt-2 block font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                            closes {formatDate(engagement.close_date)}
                          </span>
                        </Link>
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="rounded-xl border border-dashed border-line px-3 py-5 text-center text-[0.6875rem] text-fog-2">
                        Empty
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Stage summary" className="mt-4" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-mist/70">
                {["Stage", "Engagements", "Value", "Share of open"].map((heading) => (
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
              {pipeline.map((stage) => (
                <tr key={stage.stage} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-3.5 text-left">
                    <StagePill stage={stage.stage} />
                  </th>
                  <td className="px-5 py-3.5 font-mono text-[0.8125rem] text-fog">
                    {stage.deals}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[0.8125rem] text-ink">
                    {formatCurrency(stage.value)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-32 overflow-hidden rounded-full bg-mist-2">
                        <span
                          className="block h-full rounded-full bg-accent"
                          style={{
                            width: `${totals.pipeline > 0 ? (stage.value / totals.pipeline) * 100 : 0}%`,
                          }}
                        />
                      </span>
                      <span className="font-mono text-[0.6875rem] text-fog-2">
                        {totals.pipeline > 0
                          ? `${Math.round((stage.value / totals.pipeline) * 100)}%`
                          : "0%"}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
