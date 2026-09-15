import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { GetStartedForm } from "@/components/forms/GetStartedForm";
import { getPages, getPricing } from "@/lib/cms/content";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Start a 14-day Reygent trial — full product, no card, your data exportable at any time.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  const { getStarted: copy } = getPages();

  return (
    <>
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        summary={copy.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <GetStartedForm plans={getPricing().plansList} />
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-display text-[1.0625rem] text-ink">
                    {copy.includedHeading}
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {copy.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-micro text-fog">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="text-[0.9375rem] font-medium text-ink">
                    {copy.nextSteps.heading}
                  </h2>
                  <ol className="mt-5 space-y-4 text-micro text-fog">
                    {copy.nextSteps.steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="font-mono text-[0.625rem] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 rounded-xl border border-line bg-mist px-5 py-4 text-[0.75rem] leading-relaxed text-fog">
                  {copy.billingNote}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
