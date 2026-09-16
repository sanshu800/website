import type { Metadata } from "next";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { ExternalLink, FileVideo } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { Card, EmptyState } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Media" };

/**
 * What has actually been uploaded, and the path to paste into a field.
 *
 * The upload route writes files into `public/` and returns a path, but until now
 * nothing listed them — so an editor who had just uploaded a film had no way to
 * find out what to type into the CMS. This page reads the two folders the route
 * writes to and shows each file with its path, size and upload time. Read-only
 * on purpose: deleting an asset that a live page points at is a decision, not a
 * button.
 */

const FOLDERS = [
  {
    dir: "video",
    label: "Film",
    note: "Long-form video used by a hero. Newest first.",
  },
  {
    dir: "uploads",
    label: "Images and other media",
    note: "Stills, share images and anything else intake accepted.",
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

async function listFolder(dir: string) {
  const absolute = path.join(process.cwd(), "public", dir);
  const entries = await readdir(absolute, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
      .map(async (entry) => {
        const info = await stat(path.join(absolute, entry.name));
        return {
          name: entry.name,
          href: `/${dir}/${entry.name}`,
          bytes: info.size,
          updatedAt: info.mtime,
        };
      }),
  );
  return files.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export default async function MediaPage() {
  const folders = await Promise.all(
    FOLDERS.map(async (folder) => ({ ...folder, files: await listFolder(folder.dir) })),
  );

  return (
    <>
      <AdminHeader
        title="Media"
        summary="Every file this deployment is serving, with the path to paste into a content field. Uploads arrive through the intake URL; nothing here is editable from this page."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {folders.map((folder) => (
          <Card key={folder.dir} title={folder.label}>
            <p className="text-micro text-fog">{folder.note}</p>
            {folder.files.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title={`Nothing in /${folder.dir} yet`}
                  body="Uploads land here once the intake route accepts a file. Until then the site falls back to what it ships with."
                />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {folder.files.map((file) => (
                  <li key={file.name} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-mist">
                      <FileVideo className="h-4 w-4 text-fog" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-micro text-ink">{file.name}</p>
                      <p className="mt-0.5 text-label text-fog">
                        {formatBytes(file.bytes)} · {file.updatedAt.toISOString().slice(0, 10)}
                      </p>
                    </div>
                    <code className="hidden rounded-md border border-line bg-mist px-2 py-1 font-mono text-eyebrow text-fog sm:block">
                      {file.href}
                    </code>
                    <Link
                      href={file.href}
                      target="_blank"
                      className="rounded-lg border border-line p-2 text-fog transition-colors hover:border-line-strong hover:text-ink"
                      aria-label={`Open ${file.name}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <Card title="Pointing a page at a file" className="mt-4">
        <p className="text-micro leading-relaxed text-fog">
          Copy the path above into the field it belongs to — the hero film and poster are on the{" "}
          <Link href="/admin/edit/assets" className="font-medium text-accent hover:underline">
            Hero film and poster
          </Link>{" "}
          surface, and a page&rsquo;s share image is on{" "}
          <Link href="/admin/edit/seo" className="font-medium text-accent hover:underline">
            Search &amp; sharing
          </Link>
          . Publishing re-renders the affected pages immediately, so a swap is visible on the next
          request.
        </p>
      </Card>
    </>
  );
}
