import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plug, RefreshCw, Shield, Webhook } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { integrations } from "@/lib/content/marketing";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Reygent connects to email, calendar, documents, e-signature, accounting, messaging, practice management and your data warehouse.",
  alternates: { canonical: "/integrations" },
};

const CAPABILITIES = [
  {
    icon: Plug,
    title: "Two-way sync",
    body: "Read and write on every connected surface. Replies logged where they happened, records updated without anyone typing.",
  },
  {
    icon: RefreshCw,
    title: "Idempotent by default",
    body: "Every sync is safe to retry. A misbehaving third-party API degrades one surface rather than the record.",
  },
  {
    icon: Webhook,
    title: "Open API and webhooks",
    body: "Every object is addressable, every event is publishable. Build on the memory layer rather than beside it.",
  },
  {
    icon: Shield,
    title: "Scoped permissions",
    body: "Connect a mailbox without granting full account access. Credentials are encrypted per tenant and revocable in one click.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title="Runs alongside what you already use."
        summary="Forty-plus integration surfaces across the systems a professional-services firm already depends on. Nothing needs to be ripped out to start — the coordination layer is what we replace."
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-2"
            >
              Start free trial
            </Link>
            <Link
              href="/security"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              How we handle data
            </Link>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow="By category"
            title="Described by what it does, not whose logo it is."
            lede="We list capabilities rather than partner marks, because displaying another company's trademark implies an endorsement neither of us has signed."
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
            {CAPABILITIES.map((capability) => {
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
          <div className="grid gap-10 rounded-2xl border border-line bg-ink p-8 text-on-ink sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-on-ink">Building on Reygent</h2>
              <p className="mt-4 text-body-lg text-on-ink-2">
                The API exposes the same objects the interface uses, so an integration
                cannot drift from what your team sees. Authentication is per-tenant and
                scoped to the records you grant.
              </p>
              <Link
                href="/contact"
                className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent-3"
              >
                Request API access
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-ink-2 p-5 font-mono text-[0.75rem] leading-relaxed text-on-ink-2">
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
