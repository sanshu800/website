import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { withText } from "@/lib/cms/paths";

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
        title={program.headline}
        summary={program.summary}
        actions={
          <>
            <ButtonLink href={copy.hero.actions.primary.href} variant="primary" size="md" className="h-11">
              {copy.hero.actions.primary.label} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={copy.hero.actions.secondary.href} variant="secondary" size="md" className="h-11">
              {copy.hero.actions.secondary.label}
            </ButtonLink>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading title={copy.types.title} />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {withText(copy.types.items).map((type) => (
              <RevealItem key={type.title}>
                <h3 className="text-body font-medium text-ink">{type.title}</h3>
                <p className="mt-2.5 text-small text-fog">{type.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading title={copy.commercial.title} />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {withText(program.benefits).map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
                  <h3 className="font-display text-body text-ink">{benefit.title}</h3>
                  <p className="mt-2.5 flex-1 text-small text-fog">{benefit.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading title={copy.steps.title} />
          <ol className="mt-12 grid gap-6 lg:grid-cols-4">
            {withText(program.steps).map((step, index) => (
              <li key={step.title} className="border-t border-line-strong pt-5">
                <span className="font-mono text-eyebrow text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-display-s text-ink">{step.title}</h3>
                <p className="mt-2 text-small text-fog">{step.body}</p>
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
