import { NextResponse } from "next/server";
import { z } from "zod";
import { EVENT_NAMES, recordEvent } from "@/lib/events";
import { callerKey, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Measurement intake.
 *
 * Public and unauthenticated by necessity — it is called from the visitor's
 * browser — so it is treated as hostile input throughout: a closed set of event
 * names, hard length caps, no free-form object graph, and a rate limit. The IP
 * address is used to *count* requests and then discarded; it is never stored.
 *
 * A rejected event returns 204 rather than an error, because a visitor should
 * never see anything about this. The failure is silent by design.
 */

const bodySchema = z.object({
  name: z.enum(EVENT_NAMES),
  path: z.string().max(200).optional(),
  detail: z.string().max(200).optional(),
  session: z.string().max(64).optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit({
    key: callerKey(request, "events"),
    // A visitor can legitimately view a few dozen pages in an hour; a bot will
    // blow past this immediately.
    limit: 240,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) return new NextResponse(null, { status: 204 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  recordEvent({
    name: parsed.data.name,
    path: parsed.data.path ?? null,
    detail: parsed.data.detail ?? null,
    sessionId: parsed.data.session ?? null,
  });

  return new NextResponse(null, { status: 204 });
}
