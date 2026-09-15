"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createTaskRecord, deleteTaskRecord, toggleTaskStatus } from "@/lib/mutations";

/**
 * Server actions for the dashboard.
 *
 * Thin wrappers: authenticate, delegate to the write model, then revalidate the
 * affected screens. The write model is shared with `/api/tasks`, so the two
 * entry points cannot drift apart.
 */

function revalidateTaskSurfaces() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/companies");
}

export async function toggleTask(taskId: string): Promise<{ ok: boolean; status: string }> {
  const session = await getSession();
  if (!session) return { ok: false, status: "unauthorised" };

  const result = toggleTaskStatus(taskId, session.name);
  if (!result.ok) return { ok: false, status: result.reason };

  revalidateTaskSurfaces();
  return { ok: true, status: result.status ?? "open" };
}

export async function createTask(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const result = createTaskRecord(
    {
      title: String(formData.get("title") ?? ""),
      assignee: String(formData.get("assignee") ?? ""),
      priority: String(formData.get("priority") ?? "normal"),
      dueAt: String(formData.get("dueAt") ?? ""),
    },
    session.name,
  );

  if (!result.ok) return;
  revalidateTaskSurfaces();
}

export async function deleteTask(taskId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  deleteTaskRecord(taskId);
  revalidateTaskSurfaces();
}
