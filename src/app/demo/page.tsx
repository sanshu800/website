import type { Metadata } from "next";
import { CalendarClock, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { DemoForm } from "@/components/forms/DemoForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { testimonials } from "@/lib/content/marketing";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Thirty minutes, screenshare, one live process. See Reygent running on a firm like yours.",
  alternates: { canonical: "/demo" },
};

const AGENDA = [
  { title: "Minutes 0–8", body: "You describe one process that is currently painful. We map it on screen as you talk." },
  { title: "Minutes 8–20", body: "We take the same process through the platform live — intake, handover, chase, report — using the record rather than slides." },
  { title: "Minutes 20–27", body: "Honest assessment: what the platform fixes, what it does not, and what it would take to implement." },
  { title: "Minutes 27–30", body: "Pricing, next steps, and the implementation shape if you want to proceed." },
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a demo"
        title="Bring one real process."
        summary="Thirty minutes with someone who has mapped this before. No slides, no qualification script, and you keep the process map afterwards whether or not you buy."
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
                    How the thirty minutes runs
                  </h2>
                  <ol className="mt-6 space-y-5">
                    {AGENDA.map((item) => (
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
                      Who should join
                    </h2>
                    <p className="mt-2 text-micro text-fog">
                      The person who owns operations, plus whoever owns the systems. Two
                      people is ideal; six is a committee.
                    </p>
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
                  Placeholder testimonial — invented for design purposes.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-6 flex gap-4 rounded-2xl border border-line bg-mist p-6">
                  <CalendarClock className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-micro text-fog">
                    Calendar booking is not connected on this build. Requests land in the
                    platform database and would be confirmed by email; wiring Google
                    Calendar or Cal.com is the only change required.
                  </p>
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
