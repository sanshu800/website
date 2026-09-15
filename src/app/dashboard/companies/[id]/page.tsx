import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Mail, MapPin, Phone, Users } from "lucide-react";
import { dashboard } from "@/lib/queries";
import { Card, HealthPill, Pill, PriorityText, StagePill, StatCard } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { TaskToggle } from "@/components/dashboard/TaskToggle";
import { formatCurrency, formatDate, relativeTime, daysUntil, initials } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const record = dashboard.company(id);
  return { title: record?.company.name ?? "Company" };
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = dashboard.company(id);
  if (!record) notFound();

  const { company, contacts, engagements, tasks, activities } = record;
  const openValue = engagements
    .filter((engagement) => engagement.stage !== "Won" && engagement.stage !== "Lost")
    .reduce((sum, engagement) => sum + engagement.value, 0);

  return (
    <>
      <Link
        href="/dashboard/companies"
        className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wide text-fog transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Companies
      </Link>

      <div className="mt-6">
        <DashboardHeader
          eyebrow={`${company.sector} · ${company.size}`}
          title={company.name}
          summary={`${company.city}, ${company.country} · owner ${company.owner || "unassigned"} · client since ${formatDate(company.created_at)}`}
          action={
            <div className="flex items-center gap-2">
              <StagePill stage={company.stage} />
              <HealthPill health={company.health} />
            </div>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Annual value" value={formatCurrency(company.arr)} />
        <StatCard label="Open pipeline" value={formatCurrency(openValue)} tone="violet" />
        <StatCard
          label="Contacts"
          value={String(contacts.length)}
          detail={`${contacts.filter((contact) => contact.status === "champion").length} champion(s)`}
        />
        <StatCard
          label="Last touch"
          value={relativeTime(company.last_touch)}
          detail={
            company.website_intent > 0
              ? `${company.website_intent} visits from this domain`
              : "No website activity"
          }
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card title="Engagements" className="lg:col-span-7" padded={false}>
          <ul className="divide-y divide-line">
            {engagements.map((engagement) => (
              <li key={engagement.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.9375rem] font-medium text-ink">{engagement.title}</p>
                    <p className="mt-1 text-[0.75rem] text-fog">
                      {engagement.owner} · source {engagement.source} · closes{" "}
                      {formatDate(engagement.close_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.8125rem] text-ink">
                      {formatCurrency(engagement.value)}
                    </span>
                    <StagePill stage={engagement.stage} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-2">
                    <span
                      className="block h-full rounded-full bg-violet"
                      style={{ width: `${engagement.probability}%` }}
                    />
                  </span>
                  <span className="font-mono text-[0.6875rem] text-fog-2">
                    {engagement.probability}% likely
                  </span>
                </div>
              </li>
            ))}
            {engagements.length === 0 && (
              <li className="px-5 py-6 text-micro text-fog">
                No engagements recorded for this company yet.
              </li>
            )}
          </ul>
        </Card>

        <Card title="Contacts" className="lg:col-span-5" padded={false}>
          <ul className="divide-y divide-line">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex gap-4 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-2 font-mono text-[0.6875rem] text-fog">
                  {initials(contact.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[0.875rem] font-medium text-ink">
                      {contact.name}
                    </p>
                    <Pill tone={contact.status === "champion" ? "violet" : "neutral"}>
                      {contact.status}
                    </Pill>
                  </div>
                  <p className="mt-0.5 truncate text-[0.75rem] text-fog">{contact.title}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[0.6875rem] text-fog-2">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-violet"
                    >
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {contacts.length === 0 && (
              <li className="px-5 py-6 text-micro text-fog">
                No contacts recorded for this company.
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Card title="Open work" className="lg:col-span-5" padded={false}>
          <ul className="divide-y divide-line">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-4 px-5 py-4">
                <TaskToggle id={task.id} status={task.status} />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[0.875rem] ${
                      task.status === "done" ? "text-fog line-through" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[0.6875rem] text-fog-2">
                    <PriorityText priority={task.priority} />
                    <span>·</span>
                    <span>{task.assignee || "No owner"}</span>
                    <span>·</span>
                    <span className={daysUntil(task.due_at) < 0 ? "text-danger" : undefined}>
                      {daysUntil(task.due_at) < 0
                        ? `${Math.abs(daysUntil(task.due_at))} days overdue`
                        : `due ${relativeTime(task.due_at)}`}
                    </span>
                  </p>
                </div>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="px-5 py-6 text-micro text-fog">No tasks on this company.</li>
            )}
          </ul>
        </Card>

        <Card title="Timeline" className="lg:col-span-7" padded={false}>
          <ol className="px-5 py-2">
            {activities.map((activity) => (
              <li key={activity.id} className="flex gap-4 py-3.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8125rem] text-fg-2">{activity.summary}</p>
                  <p className="mt-1 text-[0.6875rem] text-fog-2">
                    {activity.actor} · {activity.source} · {relativeTime(activity.at)}
                  </p>
                </div>
                <Pill tone="neutral" className="shrink-0">
                  {activity.kind}
                </Pill>
              </li>
            ))}
            {activities.length === 0 && (
              <li className="py-6 text-micro text-fog">No activity recorded yet.</li>
            )}
          </ol>
        </Card>
      </div>

      <Card title="Connection detail" className="mt-4">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe, label: "Domain", value: company.domain },
            { icon: MapPin, label: "Location", value: `${company.city}, ${company.country}` },
            { icon: Users, label: "Size", value: company.size },
            { icon: Mail, label: "Primary owner", value: company.owner || "Unassigned" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <dt className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </dt>
                <dd className="mt-2 text-[0.875rem] text-ink">{item.value}</dd>
              </div>
            );
          })}
        </dl>
      </Card>
    </>
  );
}
