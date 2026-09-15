import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages, getShared } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/startups", {
    title: "Founders programme",
    description:
      "A fixed-price first automation for businesses under three years old: one process, scoped small, live in three weeks for $6,000.",
    alternates: { canonical: "/startups" },
  });
}

export default function StartupsPage() {
  const { startups: copy } = getPages();
  const { program } = copy;
  const { siteStats } = getShared();

  return (
    <>
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={program.headline}
        summary={program.summary}
        actions={
          <>
            <Link
              href={copy.hero.actions.primary.href}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-2"
            >
              {copy.hero.actions.primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={copy.hero.actions.secondary.href}
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              {copy.hero.actions.secondary.label}
            </Link>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow={copy.included.eyebrow} title={copy.included.title} />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {program.benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex h-full gap-4 rounded-2xl border border-line p-6">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-[1.0625rem] font-medium text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-micro text-fog">{benefit.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12">
            <div className="rounded-2xl bg-mist p-7 sm:p-9">
              <h2 className="font-display text-[1.25rem] text-ink">
                {copy.eligibility.heading}
              </h2>
              <ul className="mt-5 grid gap-3 text-body-lg text-fog sm:grid-cols-2">
                {copy.eligibility.criteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
              <p className="mt-6 text-micro text-fog-2">{copy.eligibility.note}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {siteStats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[2rem] leading-none text-ink">
                  {stat.value}
                </dd>
                <dt className="mt-2 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-[0.75rem] text-fog">{stat.detail}</dd>
              </div>
            ))}
          </dl>
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
