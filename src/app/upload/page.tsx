import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { UploadPanel } from "@/components/forms/UploadPanel";

// Must be evaluated per request: the page only exists while the opt-in
// environment flags are set on the running server.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media upload",
  robots: { index: false, follow: false },
};

/**
 * Temporary utility page, present only when the server runs with
 * `ALLOW_MEDIA_UPLOAD=1`. It exists so the hero film can be moved from a
 * machine that can reach Google Drive into this workspace, which cannot.
 */
export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (process.env.ALLOW_MEDIA_UPLOAD !== "1") notFound();

  const { token = "" } = await searchParams;
  const expected = process.env.UPLOAD_TOKEN ?? "";
  if (!expected || token !== expected) notFound();

  return (
    <section className="border-b border-line bg-paper pb-20 pt-32">
      <Container width="narrow">
        <p className="font-mono text-eyebrow uppercase text-fog-2">Utility</p>
        <h1 className="mt-5 text-display-l text-ink">Send the hero file</h1>
        <p className="mt-4 text-lead text-fog">
          This deployment has no outbound access to Drive or CDNs, so the file has to
          come from your browser. Pick it below and it lands in the project at{" "}
          <span className="font-mono text-ink">public/video/hero.mp4</span>.
        </p>
        <div className="mt-10">
          <UploadPanel token={token} />
        </div>
      </Container>
    </section>
  );
}
