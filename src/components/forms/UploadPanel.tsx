"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Upload } from "lucide-react";

type Result = { file: string; bytes: number; type: string };

/**
 * Drop-in upload page for the deployment preview. Posts straight to
 * `/api/media`, which writes the file into `public/` in this workspace.
 * The endpoint 404s unless the server was started with the opt-in flags.
 */
export function UploadPanel({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function send() {
    if (!file) {
      setStatus("error");
      setMessage("Choose a file first.");
      return;
    }
    setStatus("sending");
    setMessage(null);

    const body = new FormData();
    body.set("token", token);
    body.set("target", "hero");
    body.set("file", file);

    try {
      const response = await fetch("/api/media", { method: "POST", body });
      const data = (await response.json()) as Result & { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Upload failed.");
        return;
      }
      setResult({ file: data.file, bytes: data.bytes, type: data.type });
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("The upload did not complete. Check the file size and try again.");
    }
  }

  if (status === "done" && result) {
    return (
      <div className="rounded-2xl border border-jade/30 bg-jade-soft p-7">
        <Check className="h-6 w-6 text-jade" />
        <h2 className="mt-4 font-display text-[1.25rem] text-ink">File received</h2>
        <p className="mt-2 text-micro text-fg-2">
          Saved to <span className="font-mono text-ink">{result.file}</span> (
          {(result.bytes / 1048576).toFixed(1)}MB, {result.type}). Tell me in chat and I
          will wire it into the hero and rebuild.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-ink px-5 text-[0.9375rem] font-medium text-on-ink"
        >
          Back to the site
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void send();
      }}
      className="rounded-2xl border border-line p-7"
    >
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const dropped = event.dataTransfer.files[0];
          if (dropped) setFile(dropped);
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragging ? "border-accent bg-accent-soft" : "border-line-strong hover:bg-mist"
        }`}
      >
        <Upload className="h-6 w-6 text-fog" />
        <span className="text-[0.9375rem] font-medium text-ink">
          {file ? file.name : "Choose the video, or drop it here"}
        </span>
        <span className="text-[0.75rem] text-fog">
          {file
            ? `${(file.size / 1048576).toFixed(1)}MB · ${file.type || "unknown type"}`
            : "MP4, WebM or MOV · up to 80MB"}
        </span>
      </button>

      <input
        ref={input}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />

      {message && <p className="mt-4 text-[0.8125rem] text-danger">{message}</p>}

      <button
        type="submit"
        disabled={status === "sending" || !file}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-[0.9375rem] font-medium text-on-ink transition-colors hover:bg-accent-2 disabled:opacity-45"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading
          </>
        ) : (
          "Upload into the workspace"
        )}
      </button>

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-fog-2">
        The file is written to <span className="font-mono">public/video/hero.*</span> in the
        project. Nothing is sent anywhere else.
      </p>
    </form>
  );
}
