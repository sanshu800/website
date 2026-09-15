import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MousePointerClick } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { modules, foundation } from "@/lib/content/products";
import { TourStage } from "@/components/marketing/TourStage";

export const metadata: Metadata = {
  title: "Product tour",
  description:
    "Walk through Reygent stage by stage — intake, engagement, delivery, reporting and the Foundation layer underneath all four.",
  alternates: { canonical: "/product-tour" },
};

const STAGES = modules.map((module) => ({
  slug: module.slug,
  name: module.name,
  title: module.headline,
  body: module.intro,
  screen: module.home.screen,
  caption: module.panelCaption,
  bullets: module.features.slice(0, 4).map((feature) => feature.title),
  href: `/products/${module.slug}`,
  accent: module.accent,
}));

export default function ProductTourPage() {
  return (
    <>
      <PageHero
        eyebrow="Product tour"
        title="Five stops. Ten minutes. No sales call."
        summary="The same walkthrough we give on a demo, laid out so you can take it at your own pace — and stop wherever the answer stops being relevant to your firm."
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
            >
              Start the real thing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Take it with a person
            </Link>
          </>
        }
      />

      <section className="border-b border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-8 py-10 sm:grid-cols-3">
            {[
              { icon: Clock, label: "Time", value: "About ten minutes" },
              { icon: MousePointerClick, label: "Format", value: "Interactive, five stops" },
              { icon: ArrowRight, label: "Shortcut", value: "Sign in with the demo account" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
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
            eyebrow="Walkthrough"
            title="Pick a stop, or work through them in order."
            lede="Each panel is rendered from the same interface components the platform uses, so what you see here is the density you get after signing in — not a marketing illustration."
          />
          <div className="mt-12">
            <TourStage
              stages={STAGES.map((stage) => ({
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
                Underneath it all
              </p>
              <h2 className="mt-5 text-display-l text-on-ink">{foundation.name}</h2>
              <p className="mt-5 max-w-[36rem] text-body-lg text-on-ink-2">
                {foundation.summary}
              </p>
              <Link
                href="/products/foundation"
                className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet-3"
              >
                See how the memory layer works
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <RevealGroup className="grid gap-5 sm:grid-cols-2">
                {foundation.features.slice(0, 4).map((capability) => (
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

      <section className="section-sm bg-paper">
        <Container width="wide">
          <Reveal>
            <div className="rounded-2xl border border-line bg-mist p-7 sm:p-9">
              <h2 className="font-display text-[1.25rem] text-ink">
                Want to click around for real?
              </h2>
              <p className="mt-3 max-w-[42rem] text-micro text-fog">
                The workspace on this build is a working application: sign in and the
                sample firm is loaded, with real filters, real pagination, real server
                actions and an audit trail that records what you change.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
                >
                  Sign in to the demo
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
                >
                  Create your own workspace
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <PageCTA
        title="Seen enough to talk specifics?"
        summary="Bring one process to a thirty-minute session and we will map it against the same five stages on this page."
      />
    </>
  );
}
