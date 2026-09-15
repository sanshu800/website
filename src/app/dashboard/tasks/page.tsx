import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { dashboard } from "@/lib/queries";
import { Card, EmptyState, Pill, PriorityText, StatCard } from "@/components/dashboard/Bits";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { TaskToggle } from "@/components/dashboard/TaskToggle";
import { createTask } from "./actions";
import { cn, daysUntil, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Tasks" };

const FILTERS = [
  { value: "open", label: "Open" },
  { value: "done", label: "Completed" },
  { value: "all", label: "Everything" },
];

const PRIORITIES = ["urgent", "high", "normal", "low"];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "open" } = await searchParams;
  const active = FILTERS.some((filter) => filter.value === status) ? status : "open";
  const tasks = dashboard.tasks(active);
  const all = dashboard.tasks("all");

  const overdue = all.filter(
    (task) => task.status !== "done" && daysUntil(task.due_at) < 0,
  ).length;
  const unassigned = all.filter((task) => !task.assignee && task.status !== "done").length;

  const grouped = PRIORITIES.map((priority) => ({
    priority,
    items: tasks.filter((task) => task.priority === priority),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <DashboardHeader
        eyebrow="Work"
        title="Tasks"
        summary="Ticking a box writes to the database, logs an activity and revalidates the dashboard. Reload and the change is still there."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overdue" value={String(overdue)} tone={overdue > 0 ? "accent" : "paper"} />
        <StatCard label="Unassigned and open" value={String(unassigned)} />
        <StatCard label="Total tracked" value={String(all.length)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <Link
                key={filter.value}
                href={`/dashboard/tasks?status=${filter.value}`}
                aria-current={active === filter.value ? "page" : undefined}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                  active === filter.value
                    ? "border-ink bg-ink text-on-ink"
                    : "border-line text-fog hover:bg-mist hover:text-ink",
                )}
              >
                {filter.label}
                <span className="ml-2 font-mono text-[0.625rem] opacity-70">
                  {filter.value === "all" ? all.length : dashboard.tasks(filter.value).length}
                </span>
              </Link>
            ))}
          </div>

          {grouped.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Nothing in this view"
                body="Either the work is finished or the filter is too narrow. Try Everything to see the full history."
              />
            </div>
          ) : (
            grouped.map((group) => (
              <Card
                key={group.priority}
                title={`${group.priority} · ${group.items.length}`}
                className="mt-4"
                padded={false}
              >
                <ul className="divide-y divide-line">
                  {group.items.map((task) => {
                    const late = task.status !== "done" && daysUntil(task.due_at) < 0;
                    return (
                      <li key={task.id} className="flex items-start gap-4 px-5 py-4">
                        <TaskToggle id={task.id} status={task.status} size="md" />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-[0.9375rem]",
                              task.status === "done"
                                ? "text-fog line-through"
                                : "font-medium text-ink",
                            )}
                          >
                            {task.title}
                          </p>
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-fog-2">
                            <PriorityText priority={task.priority} />
                            <span>·</span>
                            <span>{task.kind}</span>
                            <span>·</span>
                            <span>{task.assignee || "No owner"}</span>
                            <span>·</span>
                            <span className={late ? "text-danger" : undefined}>
                              {task.status === "done"
                                ? `completed ${relativeTime(task.due_at)}`
                                : late
                                  ? `${Math.abs(daysUntil(task.due_at))} days overdue`
                                  : `due ${relativeTime(task.due_at)}`}
                            </span>
                          </p>
                          {task.company &&
                            (task.company_id ? (
                              <Link
                                href={`/dashboard/companies/${task.company_id}`}
                                className="mt-1.5 inline-block text-[0.75rem] text-accent hover:underline"
                              >
                                {task.company}
                              </Link>
                            ) : (
                              <span className="mt-1.5 inline-block text-[0.75rem] text-fog">
                                {task.company}
                              </span>
                            ))}
                        </div>
                        <Pill
                          tone={
                            task.status === "done"
                              ? "jade"
                              : task.priority === "urgent"
                                ? "danger"
                                : "neutral"
                          }
                        >
                          {task.status}
                        </Pill>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-4">
          <Card title="Add a task" className="lg:sticky lg:top-24">
            <form action={createTask} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                >
                  Task
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  minLength={3}
                  placeholder="Send the redlined engagement letter"
                  className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3.5 text-[0.875rem] outline-none focus-visible:border-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="assignee"
                  className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                >
                  Owner
                </label>
                <input
                  id="assignee"
                  name="assignee"
                  placeholder="Whoever owns it"
                  className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3.5 text-[0.875rem] outline-none focus-visible:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="priority"
                    className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue="normal"
                    className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3 text-[0.875rem] outline-none focus-visible:border-accent"
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="dueAt"
                    className="font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                  >
                    Due
                  </label>
                  <input
                    id="dueAt"
                    name="dueAt"
                    type="date"
                    className="mt-2 h-11 w-full rounded-lg border border-line-strong bg-paper px-3 text-[0.875rem] outline-none focus-visible:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-[0.875rem] font-medium text-white transition-colors hover:bg-accent-2"
              >
                <Plus className="h-4 w-4" />
                Create task
              </button>
              <p className="text-[0.6875rem] leading-relaxed text-fog-2">
                Server action, real INSERT. New tasks start unassigned to a client, which
                is why they appear under “Unassigned and open” until they are linked.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
