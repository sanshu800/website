import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { collectLeaves } from "@/lib/cms/paths";
import { getDocDefaults, docById } from "@/lib/cms/documents";
import {
  MAX_LENGTH,
  normalise,
  resetOverride,
  revertRevision,
  revisionById,
  setOverride,
  deleteOverrideByKey,
} from "@/lib/cms/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Write endpoint for the content admin.
 *
 * Session-authenticated and role-checked: only `owner` and `admin` may change
 * site copy. Bodies are validated against the document's own field list, so a
 * request cannot invent a key or write something that is not copy (a slug, an
 * asset path). Values are stored and rendered as text — never as markup.
 *
 * After a successful write every cached route is invalidated, so the marketing
 * pages — which are prerendered — serve the new copy on the next request
 * without a redeploy.
 */

type Body = {
  action?: "set" | "reset" | "revert" | "drop";
  doc?: string;
  path?: string;
  key?: string;
  id?: string;
  value?: string;
};

function canEdit(role: string | undefined): boolean {
  return role === "owner" || role === "admin";
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "authentication required" }, { status: 401 });
  }
  if (!canEdit(user.role)) {
    return NextResponse.json(
      { error: "your role can view the admin but not publish changes" },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body || !body.action) {
    return NextResponse.json({ error: "expected an action" }, { status: 400 });
  }

  const actor = { id: user.id, name: user.name, email: user.email };

  if (body.action === "revert") {
    if (!body.id) return NextResponse.json({ error: "missing revision id" }, { status: 400 });
    const revision = revisionById(body.id);
    if (!revision) return NextResponse.json({ error: "revision not found" }, { status: 404 });
    const revertedDef = docById(revision.doc);
    const shippedValue = revertedDef
      ? collectLeaves(getDocDefaults<unknown>(revertedDef.id)).find(
          (leaf) => leaf.key === revision.path,
        )?.value
      : undefined;
    const result = revertRevision({ id: body.id, actor, shippedValue });
    if (!result.ok) return NextResponse.json({ error: "revision not found" }, { status: 404 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, action: "revert" });
  }

  if (body.action === "drop") {
    if (!body.key) return NextResponse.json({ error: "missing key" }, { status: 400 });
    const dropped = deleteOverrideByKey(body.key, actor);
    if (!dropped) return NextResponse.json({ error: "not found" }, { status: 404 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, action: "reset" });
  }

  const def = body.doc ? docById(body.doc) : undefined;
  if (!def) return NextResponse.json({ error: "unknown document" }, { status: 400 });
  if (!body.path) return NextResponse.json({ error: "missing field path" }, { status: 400 });

  const leaves = collectLeaves(getDocDefaults<unknown>(def.id));
  const field = leaves.find((leaf) => leaf.key === body.path);
  if (!field) {
    // Either a typo or a field that was renamed in code — refuse rather than
    // storing an override nothing will ever read.
    return NextResponse.json(
      { error: `"${body.path}" is not an editable field in ${def.id} anymore` },
      { status: 422 },
    );
  }

  if (body.action === "reset") {
    const result = resetOverride({ doc: def.id, path: field.key, actor });
    if (!result.ok) return NextResponse.json({ error: "nothing to reset" }, { status: 404 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, action: "reset", value: field.value });
  }

  const value = normalise(body.value ?? "", field.kind);
  if (value === null) {
    return NextResponse.json(
      {
        error: `Too long — ${field.kind} fields are limited to ${MAX_LENGTH[field.kind]} characters.`,
      },
      { status: 422 },
    );
  }
  /*
   * Clearing a text or prose field is allowed: an empty line is how an editor
   * removes a line from a page. A link is the exception — an empty destination
   * is a control that goes nowhere, which is a fault rather than a removal. To
   * take a link off a page, clear its label.
   */
  if (value === "" && field.kind === "link") {
    return NextResponse.json(
      { error: "A link needs a destination. Clear its label to take the link off the page." },
      { status: 422 },
    );
  }
  if (value !== "" && field.kind === "link" && !/^(\/|https?:\/\/|#|mailto:|tel:)/.test(value)) {
    return NextResponse.json(
      { error: "Links must start with / , https:// , mailto: or tel:" },
      { status: 422 },
    );
  }

  const result = setOverride({
    doc: def.id,
    path: field.key,
    value,
    kind: field.kind,
    actor,
    fallback: field.value,
  });

  if (!result.ok) {
    if (result.reason === "unchanged") {
      return NextResponse.json({ ok: true, unchanged: true, value: field.value });
    }
    return NextResponse.json({ error: "That value could not be saved." }, { status: 422 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, action: "set", value: result.value });
}
