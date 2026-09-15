import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { clients, testimonials } from "@/lib/content/marketing";
import { ClientWordmark } from "@/components/brand/Logo";
import { solutions } from "@/lib/content/compare";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "How professional-services firms run intake, onboarding, follow-through and reporting on Reygent.",
  alternates: { canonical: "/customers" },
};

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="Firms that stopped losing work between the tools."
        summary="Case studies are being written up with named firms and published numbers. Until they are, this page shows the operational shape of the work and the quotes we have permission to use."
      />

      <section className="border-b border-line bg-paper py-10">
        <Container width="wide">
          <div className="marquee-mask relative overflow-hidden">
            <div className="marquee-track items-center gap-12">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center gap-12"
                  aria-hidden={copy === 1}
                >
                  {clients.map((client) => (
                    <ClientWordmark key={`${copy}-${client.name}`} client={client} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow="Featured"
            title="“The last piece of software our practice needed.”"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="rounded-2xl bg-ink p-8 text-on-ink sm:p-10">
                <Quote className="h-7 w-7 text-violet-3" aria-hidden="true" />
                <blockquote className="mt-6 font-display text-[1.5rem] leading-snug text-on-ink">
                  “{testimonials[0]!.quote}”
                </blockquote>
                <p className="mt-7 border-t border-white/10 pt-6 text-micro text-on-ink-2">
                  {testimonials[0]!.name}, {testimonials[0]!.role},{" "}
                  {testimonials[0]!.company}
                </p>
              </div>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {[
                { label: "Before", value: "3 shared inboxes and a spreadsheet" },
                { label: "After", value: "One intake record with owners" },
                { label: "First change", value: "Median first reply, 22h to 38m" },
                { label: "Time to value", value: "Measured inside 3 weeks" },
              ].map((item) => (
                <Reveal key={item.label}>
                  <div className="rounded-2xl border border-line p-6">
                    <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                      {item.label}
                    </p>
                    <p className="mt-2 text-body-lg font-medium text-ink">{item.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <p className="mt-6 font-mono text-[0.6875rem] text-fog-2">
            Placeholder narrative — illustrative of the pattern, not a verified client
            result. Replace before publishing.
          </p>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow="In their words" title="What partners tell us." />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <RevealItem key={item.name}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
                  <blockquote className="flex-1 text-body text-fg-2">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <span className="block text-[0.875rem] font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-[0.75rem] text-fog">
                      {item.role}, {item.company} · {item.sector}
                    </span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-6 font-mono text-[0.6875rem] text-fog-2">
            Placeholder testimonials — invented for design purposes.
          </p>
        </Container>
      </section>

      <section className="section-sm bg-paper">
        <Container width="wide">
          <h2 className="font-mono text-eyebrow uppercase text-fog-2">By practice</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="group flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:bg-mist"
              >
                <span className="text-[0.9375rem] font-medium text-ink">{solution.name}</span>
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
