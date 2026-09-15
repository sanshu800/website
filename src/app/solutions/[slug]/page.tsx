import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Factory, TrendingUp } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Screen } from "@/components/screens/WorkScreens";
import { getShared, getSolutions } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export function generateStaticParams() {
  return getSolutions().items.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutions().bySlug[slug];
  if (!solution) return { title: "Not found" };
  return withSeo(`/solutions/${solution.slug}`, {
      title: `${solution.name} — ${solution.headline}`,
      description: solution.summary,
      alternates: { canonical: `/solutions/${solution.slug}` },
  });
}

const SCREENS = ["intake", "engage", "deliver", "insight"] as const;

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { bySlug, items, detail } = getSolutions();
  const solution = bySlug[slug];
  if (!solution) notFound();

  const others = items.filter((item) => item.slug !== solution.slug);
  const { testimonials } = getShared();
  const proof = testimonials.filter(
    (item) => item.sector.toLowerCase() === solution.name.toLowerCase(),
  );

  return (
    <>
      <PageHero
        eyebrow={`Solutions · ${solution.name}`}
        crumbs={[{ label: "Solutions" }, { label: solution.name }]}
        title={solution.headline}
        summary={solution.summary}
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-2"
            >
              Book a free AI audit
            </Link>
            <Link
              href="/how-we-work"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              See how we work
            </Link>
          </>
        }
        aside={
          <Reveal variant="scale" duration={0.9}>
            <div className="app-frame">
              <div className="h-[300px] sm:h-[340px]">
                <Screen name={SCREENS[items.indexOf(solution) % SCREENS.length]!} />
              </div>
            </div>
            <p className="mt-3 font-mono text-[0.6875rem] text-fog-2">
              Illustrative interface · your configuration will differ
            </p>
          </Reveal>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow={detail.pressure.eyebrow}
            title={detail.pressure.title}
            lede={detail.pressure.lede}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {solution.pressurePoints.map((point) => (
              <RevealItem key={point.title}>
                <div className="border-t border-line pt-5">
                  <Factory className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-[1.0625rem] font-medium text-ink">{point.title}</h3>
                  <p className="mt-2.5 text-micro text-fog">{point.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading
            eyebrow={detail.fits.eyebrow}
            title={detail.fits.title}
            lede={detail.fits.lede}
          />
          <div className="mt-12 divide-y divide-line border-t border-line">
            {solution.moduleFit.map((fit) => (
              <Reveal key={fit.module} className="grid gap-4 py-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-3">
                  <Link
                    href={fit.href}
                    className="group inline-flex items-center gap-2 font-display text-[1.25rem] text-ink"
                  >
                    {fit.module}
                    <ArrowRight className="h-4 w-4 text-fog-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <p className="text-body-lg text-fog lg:col-span-7">{fit.line}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
              {solution.metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-[0.9375rem] font-medium text-ink">{metric.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {proof.length > 0 && (
        <section className="section-sm bg-paper">
          <Container width="wide">
            <div className="flex items-start gap-6 rounded-2xl bg-ink p-7 text-on-ink sm:p-9">
              <TrendingUp className="mt-1 h-6 w-6 shrink-0 text-accent-3" aria-hidden="true" />
              <div>
                <blockquote className="font-display text-[1.25rem] leading-snug text-on-ink">
                  “{proof[0]!.quote}”
                </blockquote>
                <p className="mt-4 text-micro text-on-ink-2">
                  {proof[0]!.name}, {proof[0]!.role}, {proof[0]!.company}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="section bg-paper pt-0">
        <Container width="wide">
          <h2 className="font-mono text-eyebrow uppercase text-fog-2">Other industries</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/solutions/${item.slug}`}
                className="group flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:bg-mist"
              >
                <span className="text-[0.9375rem] font-medium text-ink">{item.name}</span>
                <ArrowRight className="h-4 w-4 text-fog-2 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
