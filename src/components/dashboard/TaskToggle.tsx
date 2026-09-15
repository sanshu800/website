"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toggleTask } from "@/app/dashboard/tasks/actions";
import { cn } from "@/lib/utils";

/** Optimistic checkbox backed by a server action. */
export function TaskToggle({
  id,
  status,
  size = "sm",
}: {
  id: string;
  status: string;
  size?: "sm" | "md";
}) {
  const [done, setDone] = useState(status === "done");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function toggle() {
    const next = !done;
    setDone(next);
    setError(false);
    startTransition(async () => {
      const result = await toggleTask(id);
      if (!result.ok) {
        setDone(!next);
        setError(true);
        return;
      }
      setDone(result.status === "done");
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      aria-label={done ? "Mark task as open" : "Mark task as done"}
      title={error ? "Could not save — try again" : undefined}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border transition-colors",
        size === "md" ? "mt-0.5 h-5 w-5" : "mt-0.5 h-4.5 w-4.5",
        done
          ? "border-accent bg-accent text-white"
          : "border-line-strong text-transparent hover:border-accent hover:text-accent/40",
        error && "border-danger",
      )}
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin text-fog" />
      ) : (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </button>
  );
}
