import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { tiers, pricingFaqs } from "@/lib/content/company";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Per-user pricing for professional-services firms. Core from $89, Pro from $149, Enterprise on request. 14-day trial, no card, full data export.",
  alternates: { canonical: "/pricing" },
};

const MATRIX = [
  { row: "Modules included", core: "Intake, Engage, Deliver, Insight", pro: "All four", ent: "All four" },
  { row: "Foundation memory layer", core: "Included", pro: "Included", ent: "Included" },
  { row: "Active client records", core: "2,500", pro: "25,000", ent: "Unlimited" },
  { row: "Automation runs / month", core: "25,000", pro: "250,000", ent: "Negotiated" },
  { row: "Ask Reygent", core: "Included", pro: "Unlimited", ent: "Unlimited, private routing" },
  { row: "Custom record types", core: "—", pro: "Included", ent: "Included" },
  { row: "Workflow builder", core: "—", pro: "Included", ent: "Included" },
  { row: "Cross-practice reporting", core: "—", pro: "Included", ent: "Included" },
  { row: "SSO / SCIM", core: "—", pro: "—", ent: "Included" },
  { row: "Audit log export", core: "—", pro: "—", ent: "Included" },
  { row: "Data residency options", core: "—", pro: "—", ent: "Included" },
  { row: "Support", core: "Email, next business day", pro: "Priority, 4-hour", ent: "Named contact, SLA" },
  { row: "Implementation", core: "Guided self-serve", pro: "Assisted", ent: "Named lead" },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Priced per user, so growth is not punished."
        summary="You are not charged per client record, per call or per automation run on a metered basis. Add the whole firm to the record, because that is the point of having one."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <RevealItem key={tier.name}>
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
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-micro text-fog">/ user / mo</span>
                    )}
                  </p>
                  <p className="mt-2 text-[0.75rem] text-fog-2">{tier.priceNote}</p>
                  <p className="mt-5 text-micro text-fog">{tier.summary}</p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-line/70 pt-6">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-small text-fg-2">
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

          <p className="mt-6 text-center text-micro text-fog-2">
            Education and non-profit discounts available. Firms under three years old
            may qualify for the{" "}
            <Link href="/startups" className="text-accent underline underline-offset-2">
              startup programme
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow="Full comparison" title="Every limit, on one page." />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide text-fog-2">
                    Feature
                  </th>
                  {["Core", "Pro", "Enterprise"].map((name) => (
                    <th
                      key={name}
                      scope="col"
                      className={cn(
                        "py-3 pr-6 font-mono text-[0.6875rem] uppercase tracking-wide",
                        name === "Pro" ? "text-accent" : "text-fog-2",
                      )}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, index) => (
                  <tr key={row.row} className={index % 2 === 1 ? "bg-paper/60" : undefined}>
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
              <h2 className="text-display-m text-ink">Questions firms ask us</h2>
              <p className="mt-4 text-body-lg text-fog">
                Including the ones about leaving, which we answer the same way in
                conversation as we do here.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="divide-y divide-line border-t border-line">
                {pricingFaqs.map((faq) => (
                  <div key={faq.q} className="py-6">
                    <dt className="text-[1.0625rem] font-medium text-ink">{faq.q}</dt>
                    <dd className="mt-2.5 text-body-lg text-fog">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA
        title="Not sure which plan fits?"
        summary="Tell us how many people handle intake, how many client relationships are live, and whether you have an IT function. We will tell you honestly — including if Core is enough."
      />
    </>
  );
}
