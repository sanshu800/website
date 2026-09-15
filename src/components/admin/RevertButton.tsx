"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Restores a previous value from the audit log, or drops an orphaned override. */
export function RevertButton({
  revisionId,
  keyName,
  label = "Restore",
  disabled,
}: {
  revisionId?: string;
  keyName?: string;
  label?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        revisionId ? { action: "revert", id: revisionId } : { action: "drop", key: keyName },
      ),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "That did not work.");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void run()}
        disabled={disabled || pending}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong px-2.5 text-[0.75rem] font-medium text-fog transition-colors",
          "hover:bg-mist hover:text-ink disabled:opacity-40",
        )}
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Undo2 className="h-3 w-3" />}
        {label}
      </button>
      {error && <span className="text-[0.6875rem] text-magenta">{error}</span>}
    </span>
  );
}
