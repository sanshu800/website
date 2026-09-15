import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPricing } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = getPricing();
  const prices = content.engagementsList
    .map((item) => `${item.name} ${item.price}`)
    .join(", ");
  return withSeo("/pricing", {
    title: "Engagements & pricing",
    description: `How we price AI work: a fixed-fee audit, a fixed-price build, and a monthly retainer. ${prices}.`,
    alternates: { canonical: "/pricing" },
  });
}

/**
 * Every string below comes from the `pricing` content document, so the whole
 * page is editable from the admin panel without a deploy.
 */
export default function PricingPage() {
  const content = getPricing();
  const { hero, plans, engagementsList, comparison, faq, faqs, cta } = content;

  return (
    <>
      <JsonLd data={faqSchema()} />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} summary={hero.summary} />

      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-6 lg:grid-cols-3">
            {engagementsList.map((tier) => (
              <RevealItem key={tier.slug ?? tier.name}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border p-7 sm:p-8",
                    tier.highlight ? "border-accent bg-accent-soft shadow-md" : "border-line",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[1.25rem] text-ink">{tier.name}</h2>
                    {tier.highlight && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-white">
                        {plans.popularBadge}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-micro text-fog">{plans.unit}</span>
                    )}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-fog-2">{tier.priceNote}</p>
                  <p className="mt-5 text-micro text-fog">{tier.summary}</p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-line/70 pt-6">
                    {tier.includes.map((item, index) => (
                      <li
                        key={`${tier.name}-${index}`}
                        className="flex items-start gap-2.5 text-small text-fg-2"
                      >
                        <Check className="mt-[4px] h-3.5 w-3.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={cn(
                      "mt-7 inline-flex h-11 items-center justify-center rounded-lg text-[0.9375rem] font-medium transition-colors",
                      tier.highlight
                        ? "bg-accent text-white hover:bg-accent-2"
                        : "border border-line-strong text-ink hover:bg-mist",
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-6 text-center text-micro text-fog">
            {plans.footnoteBefore}{" "}
            <Link href="/startups" className="text-accent underline underline-offset-2">
              {plans.footnoteLink}
            </Link>
            .
          </p>
          <p className="mt-3 text-center text-micro text-fog">{plans.currencyNote}</p>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow={comparison.eyebrow} title={comparison.title} />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  <th
                    scope="col"
                    className="py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide text-fog-2"
                  >
                    {comparison.featureColumn}
                  </th>
                  {comparison.columnNames.map((name, index) => (
                    <th
                      key={`${name}-${index}`}
                      scope="col"
                      className={cn(
                        "py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide",
                        index === 1 ? "text-accent" : "text-fog-2",
                      )}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, index) => (
                  <tr
                    key={`${row.row}-${index}`}
                    className={index % 2 === 1 ? "bg-paper/60" : undefined}
                  >
                    <th scope="row" className="py-3.5 pr-6 text-[0.875rem] font-medium text-ink">
                      {row.row}
                    </th>
                    <td className="py-3.5 pr-6 text-[0.875rem] text-fog">{row.core}</td>
                    <td className="py-3.5 pr-6 text-[0.875rem] text-fg-2">{row.pro}</td>
                    <td className="py-3.5 pr-6 text-[0.875rem] text-fog">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-display-m text-ink">{faq.title}</h2>
              <p className="mt-4 text-body-lg text-fog">{faq.summary}</p>
            </div>
            <div className="lg:col-span-8">
              <dl className="divide-y divide-line border-t border-line">
                {faqs.map((item, index) => (
                  <div key={`${item.q}-${index}`} className="py-6">
                    <dt className="text-[1.0625rem] font-medium text-ink">{item.q}</dt>
                    <dd className="mt-2.5 text-body-lg text-fog">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA title={cta.title} summary={cta.summary} />
    </>
  );
}
