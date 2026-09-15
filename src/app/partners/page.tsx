import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/partners", {
    title: "Partner programme",
    description:
      "Introduce the businesses you already advise, share in the work that follows, and keep the relationship. Contractual, not a promise.",
    alternates: { canonical: "/partners" },
  });
}

export default function PartnersPage() {
  const { partners: copy } = getPages();
  const { program } = copy;

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
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-2"
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
          <SectionHeading eyebrow={copy.types.eyebrow} title={copy.types.title} />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {copy.types.items.map((type) => (
              <RevealItem key={type.title}>
                <h3 className="text-[1.0625rem] font-medium text-ink">{type.title}</h3>
                <p className="mt-2.5 text-micro text-fog">{type.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow={copy.commercial.eyebrow} title={copy.commercial.title} />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {program.benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
                  <h3 className="font-display text-[1.0625rem] text-ink">{benefit.title}</h3>
                  <p className="mt-2.5 flex-1 text-micro text-fog">{benefit.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow={copy.steps.eyebrow} title={copy.steps.title} />
          <ol className="mt-12 grid gap-6 lg:grid-cols-4">
            {program.steps.map((step, index) => (
              <li key={step.title} className="border-t border-line-strong pt-5">
                <span className="font-mono text-[0.6875rem] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.125rem] text-ink">{step.title}</h3>
                <p className="mt-2 text-micro text-fog">{step.body}</p>
              </li>
            ))}
          </ol>
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
