import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPricing } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

/**
 * The engagement block on the homepage. Reads the same `pricing` document as
 * `/pricing`, so a price, a deliverable or an inclusion is edited once and
 * changes in both places.
 */
export function PricingPreview() {
  const { plans, engagementsList, preview } = getPricing();

  return (
    <section className="section bg-paper" id="pricing">
      <Container width="wide">
        <SectionHeading
          align="center"
          eyebrow={preview.eyebrow}
          title={preview.title}
          lede={preview.lede}
        />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {engagementsList.map((tier) => (
            <RevealItem key={tier.slug}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-7",
                  tier.highlight
                    ? "border-accent bg-accent-soft shadow-md"
                    : "border-line bg-paper",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[1.125rem] text-ink">{tier.name}</h3>
                  {tier.highlight && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-white">
                      {plans.popularBadge}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-[2.5rem] leading-none tracking-[-0.03em] text-ink">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-micro text-fog">{plans.unit}</span>
                  )}
                </div>
                <p className="mt-2 text-[0.75rem] text-fog-2">{tier.priceNote}</p>

                <p className="mt-5 text-micro text-fog">{tier.summary}</p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-line/70 pt-6">
                  {tier.includes.slice(0, 5).map((item, index) => (
                    <li
                      key={`${tier.slug}-${index}`}
                      className="flex items-start gap-2.5 text-small text-fg-2"
                    >
                      <Check className="mt-[4px] h-3.5 w-3.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={tier.href}
                  variant={tier.highlight ? "primary" : "secondary"}
                  className="mt-7"
                  full
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
          >
            {preview.compareLink}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <span className="text-micro text-fog-2">{preview.footnote}</span>
        </div>
      </Container>
    </section>
  );
}
