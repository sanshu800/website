import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPages, getPricing } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/get-started", {
    title: "Book a free audit",
    description:
      "Thirty minutes with us. Bring one process that wastes your team's time; we map it, say honestly whether it is worth automating, and tell you what it would take.",
    alternates: { canonical: "/get-started" },
  });
}

export default function GetStartedPage() {
  const { getStarted: copy } = getPages();
  const { engagementsList } = getPricing();

  return (
    <>
      <PageHero
        title={copy.hero.title}
        summary={copy.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <h2 className="font-display text-display-m text-ink">{copy.formHeading}</h2>
              <p className="mt-3 text-body text-fog">{copy.formNote}</p>
              <div className="mt-8">
                {/* The CTA and the contact page open the same form; the topic is
                    pre-set because on this page the ask is specifically the audit. */}
                <EnquiryForm
                  kind="audit"
                  defaultTopic="audit"
                  submitLabel="Request the free audit"
                  successTitle="Audit request received"
                />
              </div>
            </div>

            <div className="lg:col-span-4">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-display text-body text-ink">
                    {copy.includedHeading}
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {copy.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-small text-fog">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="text-body font-medium text-ink">
                    {copy.nextSteps.heading}
                  </h2>
                  <ol className="mt-5 space-y-4 text-small text-fog">
                    {copy.nextSteps.steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="font-mono text-label text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 rounded-xl border border-line bg-mist px-5 py-4 text-label leading-relaxed text-fog">
                  {copy.billingNote}
                </p>
              </Reveal>

              {/* What the work looks like after the call, so nobody has to ask
                  what happens next or what it costs. */}
              <Reveal delay={0.15}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="font-display text-body text-ink">
                    If it is worth doing, here is how we would start
                  </h2>
                  <ul className="mt-5 divide-y divide-line">
                    {engagementsList.map((engagement) => (
                      <li key={engagement.slug} className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
                        <span className="text-small text-fog">{engagement.name}</span>
                        <span className="shrink-0 font-mono text-eyebrow text-ink">
                          {engagement.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-label leading-relaxed text-fog">
                    The audit fee is credited against your build if you continue, and you own
                    everything we produce either way.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
