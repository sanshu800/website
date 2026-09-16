import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getComparisons } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export function generateStaticParams() {
  return getComparisons().items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisons().bySlug[slug];
  if (!comparison) return { title: "Not found" };
  /* The brand is part of the phrase ("Reygent AI vs. doing it yourself").
     `withSeo` spots that and skips the layout's `%s — Reygent AI` suffix, which
     is what used to produce "… — Reygent AI — Reygent AI" in a tab title. */
  return withSeo(`/compare/${comparison.slug}`, {
    title: `Reygent AI ${comparison.short}`,
    description: comparison.summary,
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { bySlug, items, detail } = getComparisons();
  const comparison = bySlug[slug];
  if (!comparison) notFound();

  const others = items.filter((item) => item.slug !== comparison.slug);

  return (
    <>
      <PageHero
        eyebrow={`Compare · ${comparison.name}`}
        crumbs={[{ label: "Compare" }, { label: comparison.short }]}
        title={comparison.headline}
        summary={comparison.summary}
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              Book a free audit
            </Link>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Talk to us
            </Link>
          </>
        }
      />

      {/* Fair assessment first — credibility before argument. */}
      <section className="section-sm border-b border-line bg-paper">
        <Container width="wide">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-2xl border border-line p-6 sm:p-7">
              <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                <Check className="h-4 w-4 text-jade" /> What {comparison.name.toLowerCase()} does well
              </p>
              <p className="mt-4 text-body-lg text-fg-2">{comparison.theirStrength}</p>
            </Reveal>
            <Reveal
              delay={0.06}
              className="rounded-2xl border border-line bg-mist p-6 sm:p-7"
            >
              <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                <X className="h-4 w-4 text-danger" /> Where it stops working
              </p>
              <p className="mt-4 text-body-lg text-fg-2">{comparison.theirWeakness}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            title={detail.table.title}
            lede={detail.table.lede}
          />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                    Dimension
                  </th>
                  <th scope="col" className="py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                    {comparison.name}
                  </th>
                  <th scope="col" className="py-3 font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
                    Reygent AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, index) => (
                  <tr
                    key={row.dimension}
                    className={index % 2 === 1 ? "bg-mist/60" : undefined}
                  >
                    <th
                      scope="row"
                      className="py-4 pr-6 text-[0.875rem] font-medium text-ink align-top"
                    >
                      {row.dimension}
                    </th>
                    <td className="py-4 pr-6 text-[0.875rem] text-fog align-top">{row.them}</td>
                    <td className="py-4 text-[0.875rem] font-medium text-fg-2 align-top">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Arguments */}
      <section className="section-sm bg-mist">
        <Container width="wide">
          <RevealGroup className="grid gap-x-10 gap-y-8 lg:grid-cols-3">
            {comparison.points.map((point) => (
              <RevealItem key={point.title}>
                <h3 className="text-[1.0625rem] font-medium text-ink">{point.title}</h3>
                <p className="mt-3 text-micro text-fog">{point.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section-sm bg-paper">
        <Container width="wide">
          <div className="grid gap-8 rounded-2xl border border-line bg-mist p-7 sm:p-9 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-display text-[1.25rem] text-ink">{detail.goodFitHeading}</h2>
            </div>
            <ul className="space-y-3 lg:col-span-8">
              {comparison.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-lg text-fg-2">
                  <Check className="mt-[5px] h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <h2 className="mt-12 font-mono text-eyebrow uppercase text-fog">{detail.otherHeading}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="group flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:bg-mist"
              >
                <span className="text-[0.9375rem] font-medium text-ink">{item.short}</span>
                <ArrowRight className="h-4 w-4 text-fog transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
