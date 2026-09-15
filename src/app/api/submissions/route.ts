import { NextResponse } from "next/server";
import { z } from "zod";
import {
  enquirySchema,
  newsletterSchema,
  recordSubmission,
  listSubmissions,
} from "@/lib/submissions";
import { fieldErrors } from "@/lib/validation";
import { callerKey, isHoneypotFilled, rateLimit, tooManyRequests } from "@/lib/ratelimit";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET is operator-only: it exposes inbound leads. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  return NextResponse.json({ data: listSubmissions() });
}

const body = z.object({
  kind: z.enum(["newsletter", "contact", "audit"]),
  payload: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const limit = rateLimit({
    key: callerKey(request, "submissions"),
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) return tooManyRequests(limit);

  /* Honeypot first: a filled field means a bot, and a bot should be told it
     succeeded. Nothing is stored. */
  if (isHoneypotFilled(json)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid payload", fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { kind, payload } = parsed.data;
  /* Both lead paths share the qualification schema; `kind` is what separates
     them in the table. */
  const schema = kind === "newsletter" ? newsletterSchema : enquirySchema;

  const validated = schema.safeParse(payload);
  if (!validated.success) {
    return NextResponse.json(
      { error: "validation failed", fields: fieldErrors(validated.error) },
      { status: 422 },
    );
  }

  const data = validated.data as Record<string, unknown>;
  const id = recordSubmission({
    kind,
    name: typeof data.name === "string" ? data.name : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    company: typeof data.company === "string" ? data.company : undefined,
    payload: data,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
