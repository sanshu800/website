import "server-only";
import { newId, one, run } from "./db";

/**
 * Write model.
 *
 * Every mutation lives here rather than in a route or an action, so the same
 * logic backs the UI's server actions and the JSON API. One place to reason
 * about what a write does to the audit trail.
 */

export type MutationResult =
  | { ok: true; status?: string; id?: string }
  | { ok: false; reason: "missing" | "invalid" };

type TaskRow = {
  id: string;
  title: string;
  status: string;
  assignee: string;
};

export function toggleTaskStatus(taskId: string, actor: string): MutationResult {
  const task = one<TaskRow>(`SELECT id, title, status, assignee FROM tasks WHERE id = ?`, [
    taskId,
  ]);
  if (!task) return { ok: false, reason: "missing" };

  const next = task.status === "done" ? "open" : "done";
  run(`UPDATE tasks SET status = ? WHERE id = ?`, [next, taskId]);

  run(
    `INSERT INTO activities (id, company_id, kind, summary, actor, source, at)
     SELECT ?, company_id, ?, ?, ?, 'app', ?
       FROM tasks WHERE id = ?`,
    [
      newId("act"),
      next === "done" ? "task-completed" : "task-reopened",
      `${next === "done" ? "Completed" : "Reopened"} “${task.title}”`,
      actor,
      new Date().toISOString(),
      taskId,
    ],
  );

  return { ok: true, status: next };
}

export type NewTask = {
  title: string;
  assignee?: string;
  priority?: string;
  dueAt?: string;
  companyId?: string;
};

export function createTaskRecord(input: NewTask, actor: string): MutationResult {
  const title = input.title.trim();
  if (title.length < 3) return { ok: false, reason: "invalid" };

  const priority = ["urgent", "high", "normal", "low"].includes(input.priority ?? "")
    ? (input.priority as string)
    : "normal";

  const dueAt = input.dueAt
    ? new Date(input.dueAt).toISOString()
    : new Date(Date.now() + 7 * 86_400_000).toISOString();

  const id = newId("tsk");

  run(
    `INSERT INTO tasks (id, company_id, title, kind, priority, status, assignee, due_at, created_at)
     VALUES (?, ?, ?, 'follow-up', ?, 'open', ?, ?, ?)`,
    [
      id,
      input.companyId ?? null,
      title,
      priority,
      input.assignee?.trim() ?? "",
      dueAt,
      new Date().toISOString(),
    ],
  );

  run(
    `INSERT INTO activities (id, company_id, kind, summary, actor, source, at)
     VALUES (?, ?, 'task-created', ?, ?, 'app', ?)`,
    [newId("act"), input.companyId ?? null, `Created “${title}”`, actor, new Date().toISOString()],
  );

  return { ok: true, id };
}

export function deleteTaskRecord(taskId: string): MutationResult {
  const task = one<TaskRow>(`SELECT id, title, status, assignee FROM tasks WHERE id = ?`, [
    taskId,
  ]);
  if (!task) return { ok: false, reason: "missing" };
  run(`DELETE FROM tasks WHERE id = ?`, [taskId]);
  return { ok: true };
}
