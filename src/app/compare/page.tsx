import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getComparisons } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/compare", {
    title: "Compare",
    description:
      "How Reygent AI compares to spreadsheets, a traditional CRM, separate point tools, hiring an operations manager, building in-house, and doing nothing.",
    alternates: { canonical: "/compare" },
  });
}

export default function CompareIndex() {
  const { items: comparisons, index: copy } = getComparisons();

  return (
    <>
      <PageHero title={copy.title} summary={copy.summary} />
      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {comparisons.map((comparison) => (
              <RevealItem key={comparison.slug}>
                <Link
                  href={`/compare/${comparison.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                >
                  <span className="font-mono text-eyebrow uppercase tracking-label text-accent">
                    {comparison.short}
                  </span>
                  <h2 className="mt-4 font-display text-display-s text-ink">
                    {comparison.headline}
                  </h2>
                  <p className="mt-3 flex-1 text-small text-fog">{comparison.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-small font-medium text-accent">
                    {copy.cardCta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
      <PageCTA />
    </>
  );
}
