import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plug, RefreshCw, Shield, Webhook } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages, getShared } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

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
  const capabilities = copy.capabilities.map((capability, index) => ({
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
            <Link
              href={copy.heroActions.primary.href}
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              {copy.heroActions.primary.label}
            </Link>
            <Link
              href={copy.heroActions.secondary.href}
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              {copy.heroActions.secondary.label}
            </Link>
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
            {integrations.map((group) => (
              <RevealItem key={group.category}>
                <div className="flex h-full flex-col rounded-2xl border border-line p-6">
                  <h3 className="font-display text-[1.125rem] text-ink">{group.category}</h3>
                  <p className="mt-3 flex-1 text-micro text-fog">{group.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.surfaces.map((surface) => (
                      <li
                        key={surface}
                        className="rounded-full border border-line bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
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
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <RevealItem key={capability.title}>
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-[1.0625rem] font-medium text-ink">
                    {capability.title}
                  </h3>
                  <p className="mt-2.5 text-micro text-fog">{capability.body}</p>
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
              <p className="mt-4 text-body-lg text-on-night-2">{copy.api.body}</p>
              <Link
                href="/contact"
                className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent-3"
              >
                {copy.api.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-night-2 p-5 font-mono text-[0.75rem] leading-relaxed text-on-night-2">
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
