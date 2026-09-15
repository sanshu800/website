import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { answer, askSuggestions } from "@/lib/ask";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ question: z.string().trim().min(3).max(400) });

export async function GET() {
  return NextResponse.json({ suggestions: askSuggestions() });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ask a full question — at least a few words." },
      { status: 422 },
    );
  }

  return NextResponse.json({ answer: answer(parsed.data.question) });
}
