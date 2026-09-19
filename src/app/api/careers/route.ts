import { NextResponse } from "next/server";
import { careersSchema, recordSubmission } from "@/lib/submissions";
import { fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = careersSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { role, roleTitle, name, email } = parsed.data;
  const id = recordSubmission({
    kind: "careers",
    name,
    email,
    company: roleTitle,
    payload: { ...parsed.data, role },
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
