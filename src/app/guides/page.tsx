import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getResources } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/guides", {
    title: "Guides & playbooks",
    description:
      "Downloadable implementation plans, scorecards and templates for professional-services operations teams.",
    alternates: { canonical: "/guides" },
  });
}

export default function GuidesPage() {
  const { guides } = getResources();
  const { items, ...copy } = guides;

  return (
    <>
      <PageHero
        title={copy.hero.title}
        summary={copy.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            title={copy.library.titleTemplate.replace("{count}", String(items.length))}
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((guide) => (
              <RevealItem key={guide.slug}>
                <Link
                  href="/newsletter"
                  className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-colors hover:bg-mist/60"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="h-5 w-5 text-accent" aria-hidden="true" />
                    <ArrowUpRight className="h-4 w-4 text-fog transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-wide text-fog">
                    {guide.category}
                  </p>
                  <h2 className="mt-3 font-display text-[1.25rem] text-ink">
                    {guide.title}
                  </h2>
                  <p className="mt-3 flex-1 text-micro text-fog">{guide.summary}</p>
                  <p className="mt-6 border-t border-line pt-4 font-mono text-[0.625rem] uppercase tracking-wide text-fog">
                    {guide.format}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-8 rounded-xl border border-line bg-mist px-5 py-4 text-micro text-fog">
            {copy.note}
          </p>
        </Container>
      </section>

      <PageCTA
        title={copy.cta.title}
        summary={copy.cta.summary}
        primary={copy.cta.primary}
        secondary={copy.cta.secondary}
      />
    </>
  );
}
