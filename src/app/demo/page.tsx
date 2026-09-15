import type { Metadata } from "next";
import { CalendarClock, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { DemoForm } from "@/components/forms/DemoForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getPages, getShared } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Thirty minutes, screenshare, one live process. See Reygent running on a firm like yours.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  const { testimonials } = getShared();
  const { demo: copy } = getPages();

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
              <DemoForm />
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-display text-[1.0625rem] text-ink">
                    {copy.agendaHeading}
                  </h2>
                  <ol className="mt-6 space-y-5">
                    {copy.agenda.map((item) => (
                      <li key={item.title} className="flex gap-4">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        <div>
                          <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                            {item.title}
                          </p>
                          <p className="mt-1.5 text-micro text-fg-2">{item.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 flex gap-4 rounded-2xl border border-line p-6">
                  <Users className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <h2 className="text-[0.9375rem] font-medium text-ink">
                      {copy.whoHeading}
                    </h2>
                    <p className="mt-2 text-micro text-fog">{copy.whoBody}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <figure className="mt-6 rounded-2xl border border-line p-6">
                  <blockquote className="text-body text-fg-2">
                    “{testimonials[1]!.quote}”
                  </blockquote>
                  <figcaption className="mt-4 border-t border-line pt-4 text-[0.75rem] text-fog">
                    {testimonials[1]!.name}, {testimonials[1]!.role},{" "}
                    {testimonials[1]!.company}
                  </figcaption>
                </figure>
                <p className="mt-3 font-mono text-[0.6875rem] text-fog-2">
                  {copy.quoteNote}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-6 flex gap-4 rounded-2xl border border-line bg-mist p-6">
                  <CalendarClock className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-micro text-fog">{copy.calendarNote}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-sm border-t border-line bg-mist">
        <Container width="wide">
          <RevealGroup className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Trial length", value: "14 days, full product" },
              { label: "Card required", value: "No" },
              { label: "Implementation", value: "Included on Pro and above" },
            ].map((item) => (
              <RevealItem key={item.label}>
                <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-[1.25rem] text-ink">{item.value}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
