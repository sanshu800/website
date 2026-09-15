"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CornerDownLeft, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Citation = { label: string; detail: string; href: string };
type Answer = {
  intent: string;
  headline: string;
  detail: string;
  facts: { label: string; value: string }[];
  citations: Citation[];
  followUps: string[];
};

type Turn = { question: string; answer: Answer };

export function AskPanel({ suggestions }: { suggestions: string[] }) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<"idle" | "asking" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  async function ask(value: string) {
    const text = value.trim();
    if (text.length < 3) {
      setStatus("error");
      setError("Ask a full question — at least a few words.");
      return;
    }

    setStatus("asking");
    setError(null);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = (await response.json()) as { answer?: Answer; error?: string };
      if (!response.ok || !data.answer) {
        setStatus("error");
        setError(data.error ?? "That question could not be answered. Try rephrasing.");
        return;
      }
      setTurns((current) => [...current, { question: text, answer: data.answer! }]);
      setQuestion("");
      setStatus("idle");
      requestAnimationFrame(() => bottom.current?.scrollIntoView({ block: "end" }));
    } catch {
      setStatus("error");
      setError("Could not reach the server. Try again.");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Ask Reygent
            </h2>
          </div>

          <div className="space-y-6 p-5">
            {turns.length === 0 && (
              <div className="rounded-xl border border-dashed border-line-strong px-5 py-8 text-center">
                <p className="font-display text-[1.0625rem] text-ink">
                  Ask a question about the book.
                </p>
                <p className="mx-auto mt-2 max-w-[38rem] text-micro text-fog">
                  Answers are produced by running a real query against the workspace
                  database and returning the rows behind the number — so you can check
                  the working, and so can an auditor.
                </p>
              </div>
            )}

            {turns.map((turn, index) => (
              <div key={`${turn.question}-${index}`} className="space-y-4">
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-mist px-4 py-2.5 text-[0.875rem] text-ink">
                  {turn.question}
                </p>

                <div className="rounded-2xl border border-line">
                  <div className="border-b border-line px-5 py-4">
                    <p className="font-display text-[1.125rem] leading-snug text-ink">
                      {turn.answer.headline}
                    </p>
                    <p className="mt-2.5 text-micro text-fog">{turn.answer.detail}</p>
                  </div>

                  {turn.answer.facts.length > 0 && (
                    <dl className="grid gap-x-6 gap-y-4 border-b border-line px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
                      {turn.answer.facts.map((fact) => (
                        <div key={`${fact.label}-${fact.value}`}>
                          <dt className="font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                            {fact.label}
                          </dt>
                          <dd className="mt-1 text-[0.875rem] font-medium text-ink">
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="px-5 py-4">
                    <p className="font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                      Sources · {turn.answer.citations.length} row
                      {turn.answer.citations.length === 1 ? "" : "s"}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {turn.answer.citations.map((citation) => (
                        <li key={citation.label + citation.detail}>
                          <Link
                            href={citation.href}
                            className="flex flex-wrap items-baseline gap-x-3 rounded-lg border border-line px-3.5 py-2.5 transition-colors hover:bg-mist"
                          >
                            <span className="text-[0.8125rem] font-medium text-ink">
                              {citation.label}
                            </span>
                            <span className="text-[0.75rem] text-fog">{citation.detail}</span>
                          </Link>
                        </li>
                      ))}
                      {turn.answer.citations.length === 0 && (
                        <li className="text-[0.75rem] text-fog">
                          No rows matched — the answer is a zero, not a guess.
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4">
                    {turn.answer.followUps.map((followUp) => (
                      <button
                        key={followUp}
                        type="button"
                        onClick={() => ask(followUp)}
                        className="rounded-full border border-line px-3.5 py-1.5 text-[0.75rem] text-fg-2 transition-colors hover:bg-mist hover:text-ink"
                      >
                        {followUp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div ref={bottom} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(question);
            }}
            className="border-t border-line p-4"
          >
            <div className="flex items-end gap-3">
              <label className="sr-only" htmlFor="ask-input">
                Your question
              </label>
              <textarea
                id="ask-input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void ask(question);
                  }
                }}
                rows={2}
                placeholder="e.g. Which clients have gone quiet?"
                className="min-h-[52px] w-full resize-y rounded-xl border border-line-strong bg-paper px-3.5 py-3 text-[0.875rem] outline-none focus-visible:border-accent"
              />
              <button
                type="submit"
                disabled={status === "asking"}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-accent px-4 text-[0.8125rem] font-medium text-white transition-colors hover:bg-accent-2 disabled:opacity-60"
              >
                {status === "asking" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CornerDownLeft className="h-3.5 w-3.5" />
                )}
                Ask
              </button>
            </div>
            {error && <p className="mt-2.5 text-[0.75rem] text-danger">{error}</p>}
          </form>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
            Questions this can answer
          </h2>
          <ul className="mt-4 space-y-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => ask(suggestion)}
                  className={cn(
                    "w-full rounded-lg border border-line px-3.5 py-2.5 text-left text-[0.8125rem] text-fg-2 transition-colors",
                    "hover:border-accent/40 hover:bg-accent-soft/50 hover:text-ink",
                  )}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-mist p-5">
          <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
            How this works
          </h2>
          <ul className="mt-4 space-y-3 text-[0.75rem] leading-relaxed text-fog">
            <li>
              The question is matched to a known query. No language model is called, and
              no client data leaves the deployment.
            </li>
            <li>
              Every answer returns the rows it used, each linking to the record it came
              from.
            </li>
            <li>
              Unmatched questions say so and fall back to the workspace summary rather
              than inventing an answer — which is the failure mode that matters in a
              firm.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
