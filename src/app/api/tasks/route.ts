import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createTaskRecord, deleteTaskRecord, toggleTaskStatus } from "@/lib/mutations";
import { dashboard } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tasks over JSON.
 *
 * The same write model the dashboard's server actions use, exposed so an
 * integration or a script can drive the workspace without a browser. Auth is
 * the session cookie — an API-key scheme is the next step, and it belongs in
 * `src/lib/auth.ts` rather than here.
 */

const createSchema = z.object({
  title: z.string().trim().min(3).max(200),
  assignee: z.string().trim().max(120).optional(),
  priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
  dueAt: z.string().optional(),
  companyId: z.string().max(60).optional(),
});

const patchSchema = z.object({ id: z.string().min(1), action: z.enum(["toggle", "delete"]) });

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const status = new URL(request.url).searchParams.get("status") ?? "open";
  return NextResponse.json({ data: dashboard.tasks(status) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation failed" }, { status: 422 });
  }

  const result = createTaskRecord(parsed.data, session.name);
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 400 });

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation failed" }, { status: 422 });
  }

  const result =
    parsed.data.action === "delete"
      ? deleteTaskRecord(parsed.data.id)
      : toggleTaskStatus(parsed.data.id, session.name);

  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 404 });

  return NextResponse.json({ ok: true, status: result.status });
}
