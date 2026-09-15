import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getServices, getSolutions } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/solutions", {
    title: "Solutions",
    description:
      "How we help professional services firms, property and trades businesses, online retailers and clinics automate the repetitive work behind their day.",
    alternates: { canonical: "/solutions" },
  });
}

export default function SolutionsPage() {
  const { items: solutions, index: copy } = getSolutions();
  const { core } = getServices();

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow={copy.sectorEyebrow} title={copy.sectorTitle} />
          <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2">
            {solutions.map((solution, index) => (
              <RevealItem key={solution.slug}>
                <Link
                  href={`/solutions/${solution.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-colors hover:bg-mist/60 sm:p-8"
                >
                  <span className="font-mono text-[0.6875rem] text-fog-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-[1.5rem] text-ink">
                    {solution.name}
                  </h2>
                  <p className="mt-3 text-body-lg text-fog">{solution.summary}</p>

                  <ul className="mt-6 flex flex-1 flex-wrap gap-1.5">
                    {solution.moduleFit.map((fit) => (
                      <li
                        key={fit.module}
                        className="rounded-full border border-line bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                      >
                        {fit.module}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent">
                    See how it works
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <h2 className="font-mono text-eyebrow uppercase text-fog-2">{copy.modulesTitle}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {core.map((module) => (
              <Link
                key={module.slug}
                href={`/services/${module.slug}`}
                className="group rounded-xl border border-line bg-paper px-5 py-4 transition-colors hover:border-accent/40"
              >
                <span className="block text-[0.9375rem] font-medium text-ink">
                  {module.name}
                </span>
                <span className="mt-1.5 block text-[0.75rem] text-fog">
                  {module.kicker}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
