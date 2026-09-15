import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { comparisons } from "@/lib/content/compare";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "How Reygent compares to spreadsheets, a traditional CRM, separate point tools, hiring an operations manager, building in-house, and doing nothing.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndex() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Honest comparisons, including the ones we lose."
        summary="We compare approaches rather than named competitors — partly because it is fairer, and partly because the category argument is the one that actually decides the purchase."
      />
      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {comparisons.map((comparison) => (
              <RevealItem key={comparison.slug}>
                <Link
                  href={`/compare/${comparison.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                >
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
                    {comparison.short}
                  </span>
                  <h2 className="mt-4 font-display text-[1.25rem] text-ink">
                    {comparison.headline}
                  </h2>
                  <p className="mt-3 flex-1 text-micro text-fog">{comparison.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-medium text-accent">
                    Read the comparison
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
