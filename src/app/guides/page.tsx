import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { guides } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Guides & playbooks",
  description:
    "Downloadable implementation plans, scorecards and templates for professional-services operations teams.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="The work, written down."
        summary="Everything here comes from implementations we have run. Take them, use them, and if you never buy the platform they were still worth your afternoon."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow="Library" title={`${guides.length} resources`} />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <RevealItem key={guide.slug}>
                <Link
                  href="/newsletter"
                  className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-colors hover:bg-mist/60"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="h-5 w-5 text-violet" aria-hidden="true" />
                    <ArrowUpRight className="h-4 w-4 text-fog-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                    {guide.category}
                  </p>
                  <h2 className="mt-3 font-display text-[1.25rem] text-ink">
                    {guide.title}
                  </h2>
                  <p className="mt-3 flex-1 text-micro text-fog">{guide.summary}</p>
                  <p className="mt-6 border-t border-line pt-4 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                    {guide.format}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-8 rounded-xl border border-line bg-mist px-5 py-4 text-micro text-fog">
            On this build, resources are delivered by email rather than as hosted files —
            the download flow is wired to the newsletter endpoint so you can see the
            hand-off. Attach real PDFs to make it live.
          </p>
        </Container>
      </section>

      <PageCTA
        title="Want these as they land?"
        summary="One email a month with the new playbook and two operational notes from live implementations."
        primary={{ href: "/newsletter", label: "Subscribe" }}
        secondary={{ href: "/blog", label: "Read the blog" }}
      />
    </>
  );
}
