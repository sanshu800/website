import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MousePointerClick } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages, getServices } from "@/lib/cms/content";
import { TourStage } from "@/components/marketing/TourStage";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "How a Reygent AI engagement runs: an audit of what is worth automating, a written blueprint, a fixed-price build, then a retainer that keeps it working.",
  alternates: { canonical: "/how-we-work" },
};

export default function HowWeWorkPage() {
  const { core, managed } = getServices();
  const { productTour: copy } = getPages();

  const stages = core.map((module) => ({
    slug: module.slug,
    name: module.name,
    title: module.headline,
    body: module.intro,
    screen: module.home.screen,
    caption: module.panelCaption,
    bullets: module.features.slice(0, 4).map((feature) => feature.title),
    href: `/services/${module.slug}`,
  }));

  return (
    <>
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        summary={copy.hero.summary}
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

      <section className="border-b border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-8 py-10 sm:grid-cols-3">
            {[
              { icon: Clock, label: "First stage", value: "One week, fixed fee" },
              { icon: MousePointerClick, label: "First build", value: "Four to eight weeks" },
              { icon: ArrowRight, label: "Your commitment", value: "Nothing until a scope is signed" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">
                      {item.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow={copy.walkthrough.eyebrow}
            title={copy.walkthrough.title}
            lede={copy.walkthrough.lede}
          />
          <div className="mt-12">
            <TourStage
              stages={stages.map((stage) => ({
                slug: stage.slug,
                name: stage.name,
                title: stage.title,
                body: stage.body,
                screen: stage.screen,
                caption: stage.caption,
                bullets: stage.bullets,
                href: stage.href,
              }))}
            />
          </div>
        </Container>
      </section>

      <section className="section bg-ink text-on-ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-eyebrow uppercase text-on-ink-2">
                {copy.managed.eyebrow}
              </p>
              <h2 className="mt-5 text-display-l text-on-ink">{managed.name}</h2>
              <p className="mt-5 max-w-[36rem] text-body-lg text-on-ink-2">
                {managed.summary}
              </p>
              <Link
                href={`/services/${managed.slug}`}
                className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent-3"
              >
                {copy.managed.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <RevealGroup className="grid gap-5 sm:grid-cols-2">
                {managed.features.slice(0, 4).map((capability) => (
                  <RevealItem key={capability.title}>
                    <div className="rounded-2xl border border-white/12 bg-ink-2 p-5">
                      <h3 className="text-[0.9375rem] font-medium text-on-ink">
                        {capability.title}
                      </h3>
                      <p className="mt-2 text-micro text-on-ink-2">{capability.body}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA title={copy.cta.title} summary={copy.cta.summary} />
    </>
  );
}
