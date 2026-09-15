import { NextResponse } from "next/server";
import { contactDisplayName, enquirySchema, recordSubmission } from "@/lib/submissions";
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

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const id = recordSubmission({
    /* Set by the form, not the visitor: an audit request from the CTA lands as
       `audit`, everything from the contact page lands as `contact`. */
    kind: parsed.data.kind,
    name: contactDisplayName(parsed.data),
    email: parsed.data.email,
    company: parsed.data.company,
    payload: parsed.data,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
