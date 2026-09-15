import type { Metadata } from "next";
import { AskPanel } from "@/components/dashboard/AskPanel";
import { DashboardHeader } from "@/components/dashboard/Shell";
import { askSuggestions } from "@/lib/ask";

export const metadata: Metadata = { title: "Ask Reygent" };

export default function AskPage() {
  return (
    <>
      <DashboardHeader
        eyebrow="Foundation"
        title="Ask Reygent"
        summary="Question the workspace in plain language and get an answer with the rows behind it. Deterministic, auditable, and it says when it does not know."
      />
      <AskPanel suggestions={askSuggestions()} />
    </>
  );
}
