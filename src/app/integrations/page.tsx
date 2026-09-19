import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Plug, RefreshCw, Shield, Webhook } from "lucide-react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages, getShared } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { withText } from "@/lib/cms/paths";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/integrations", {
    title: "Integrations",
    description:
      "The CRM, inbox, calendar, accounting, telephony and industry systems we connect to — so agents work inside the tools your business already runs on.",
    alternates: { canonical: "/integrations" },
  });
}

/** Icons are code, not content: the document supplies the text, position pairs them. */
const CAPABILITY_ICONS = [Plug, RefreshCw, Webhook, Shield];

export default function IntegrationsPage() {
  const { integrations } = getShared();
  const { integrations: copy } = getPages();
  const capabilities = withText(copy.capabilities).map((capability, index) => ({
    ...capability,
    icon: CAPABILITY_ICONS[index] ?? Plug,
  }));

  return (
    <>
      <PageHero
        title={copy.hero.title}
        summary={copy.hero.summary}
        actions={
          <>
            <ButtonLink href={copy.heroActions.primary.href} variant="primary" size="md" className="h-11">
              {copy.heroActions.primary.label}
            </ButtonLink>
            <ButtonLink href={copy.heroActions.secondary.href} variant="secondary" size="md" className="h-11">
              {copy.heroActions.secondary.label}
            </ButtonLink>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            title={copy.categories.title}
            lede={copy.categories.lede}
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {withText(integrations).map((group) => (
              <RevealItem key={group.category}>
                <div className="flex h-full flex-col rounded-2xl border border-line p-6">
                  <h3 className="font-display text-display-s text-ink">{group.category}</h3>
                  <p className="mt-3 flex-1 text-small text-fog">{group.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {withText(group.surfaces).map((surface) => (
                      <li
                        key={surface}
                        className="rounded-full border border-line bg-mist px-2.5 py-1 font-mono text-label uppercase tracking-label text-fog"
                      >
                        {surface}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {withText(capabilities).map((capability) => {
              const Icon = capability.icon;
              return (
                <RevealItem key={capability.title}>
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-body font-medium text-ink">
                    {capability.title}
                  </h3>
                  <p className="mt-2.5 text-small text-fog">{capability.body}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-10 rounded-2xl border border-line bg-night p-8 text-on-night sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-on-night">{copy.api.heading}</h2>
              <p className="mt-4 text-body text-on-night-2">{copy.api.body}</p>
              <ArrowLink href="/contact" tone="dark">
                {copy.api.cta}
              </ArrowLink>
            </div>
            <div className="lg:col-span-7">
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-night-2 p-5 font-mono text-label leading-relaxed text-on-night-2">
{`GET /v1/companies?stage=Onboarding&limit=2

{
  "data": [
    {
      "id": "cmp_001",
      "name": "Halloran & Vance",
      "sector": "Legal",
      "stage": "Onboarding",
      "health": "healthy",
      "owner": "N. Okafor",
      "last_touch": "2026-09-12T09:14:00Z",
      "open_tasks": 2
    }
  ],
  "meta": { "total": 24, "page": 1 }
}`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
