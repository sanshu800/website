import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getLegal, getPages } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/security", {
    title: "Security",
    description:
      "How Reygent AI protects client data: encryption, tenant isolation, access control, audit logging, testing and incident response.",
    alternates: { canonical: "/security" },
  });
}

export default function SecurityPage() {
  const { security: copy } = getPages();
  const page = getLegal().pages.security;

  return (
    <>
      <PageHero
        title={copy.hero.title}
        summary={page.intro}
        actions={
          <>
            <Link
              href={copy.hero.primary.href}
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-body font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              {copy.hero.primary.label}
            </Link>
            <Link
              href={copy.hero.secondary.href}
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-body font-medium text-ink transition-colors hover:bg-mist"
            >
              {copy.hero.secondary.label}
            </Link>
          </>
        }
      />

      <section className="section-sm border-b border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {copy.posture.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <dt className="font-mono text-eyebrow uppercase tracking-label text-fog">
                  {item.label}
                </dt>
                <dd className="text-body font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            title={copy.controls.title}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {page.sections.map((section, index) => (
              <RevealItem key={section.h}>
                <div className="flex gap-5 border-t border-line pt-5">
                  <span className="font-mono text-eyebrow text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-body-lg font-medium text-ink">{section.h}</h2>
                    <p className="mt-2.5 text-micro text-fog">{section.p}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-night text-on-night">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <ShieldCheck className="h-6 w-6 text-accent-3" aria-hidden="true" />
              <h2 className="mt-5 text-display-m text-on-night">
                {copy.disclosure.heading}
              </h2>
              <p className="mt-4 max-w-[38rem] text-body-lg text-on-night-2">
                {copy.disclosure.body}
              </p>
            </div>
            <div className="lg:col-span-5">
              <a
                href={`mailto:${copy.disclosure.mailbox}`}
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-night-2 px-6 py-5 transition-colors hover:border-accent-3/40"
              >
                <Lock className="h-5 w-5 text-accent-3" aria-hidden="true" />
                <span className="text-body text-on-night">
                  {copy.disclosure.mailbox}
                  <span className="mt-0.5 block text-label text-on-night-2">
                    {copy.disclosure.pgp}
                  </span>
                </span>
              </a>
              <p className="mt-4 text-label text-on-night-2">
                {copy.disclosure.placeholderNote}
              </p>
            </div>
          </div>
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
