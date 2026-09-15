import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createWriteStream } from "node:fs";
import { mkdir, readdir, unlink } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Media intake for this deployment environment.
 *
 * The build sandbox has no outbound network access to media hosts (Drive,
 * CDNs), so a large asset can only arrive one way: the user's browser posting it
 * here. The route is deliberately opt-in and off by default —
 *
 *   ALLOW_MEDIA_UPLOAD=1 UPLOAD_TOKEN=<secret> npm start
 *
 * Without both variables it returns 404 in every environment, production
 * included. With them it writes video and image files into `public/` so the
 * site can serve them directly from the same origin.
 */

const MAX_BYTES = 80 * 1024 * 1024;
const ALLOWED = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  if (process.env.ALLOW_MEDIA_UPLOAD !== "1") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "expected multipart form data" }, { status: 400 });
  }

  const token = String(form.get("token") ?? "");
  if (!process.env.UPLOAD_TOKEN || token !== process.env.UPLOAD_TOKEN) {
    return NextResponse.json({ error: "bad token" }, { status: 403 });
  }

  const file = form.get("file");
  const target = String(form.get("target") ?? "hero").replace(/[^a-z0-9-]/gi, "") || "hero";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "no file supplied" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File is ${Math.round(file.size / 1048576)}MB; the limit is ${
          MAX_BYTES / 1048576
        }MB. Compress it or send a shorter clip.`,
      },
      { status: 413 },
    );
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: `Unsupported type: ${type}` }, { status: 415 });
  }

  const extension =
    type === "video/quicktime"
      ? "mov"
      : (type.split("/")[1] ?? "bin").replace("jpeg", "jpg");

  const folder = target === "hero" ? "video" : "uploads";
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });

  // One file per slot: clear previous attempts so `hero.*` stays unambiguous.
  for (const entry of await readdir(dir)) {
    if (entry.startsWith(`${target}.`)) await unlink(path.join(dir, entry));
  }

  const filename = `${target}.${extension}`;
  await pipeline(
    Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]),
    createWriteStream(path.join(dir, filename)),
  );

  // The homepage resolves its film by looking for a file in `public/video/`, so
  // a new upload has to purge the prerendered page — otherwise the swap would
  // not appear until the next deploy. Same mechanism as /api/content, which is
  // what lets every other marketing page stay statically rendered and still be
  // editable from the admin panel.
  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    file: `/${folder}/${filename}`,
    bytes: file.size,
    type,
  });
}
