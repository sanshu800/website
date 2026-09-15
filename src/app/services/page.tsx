import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getServices } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Five ways an AI agency takes work off your team: agents that answer and book, automation that connects your systems, document processing, business insight and a retainer that keeps it all running.",
  alternates: { canonical: "/services" },
};

const FIELD: Record<string, string> = {
  ink: "bg-accent",
  tangerine: "bg-tangerine",
  jade: "bg-jade",
  azure: "bg-azure",
  magenta: "bg-magenta",
};

export default function ProductsIndex() {
  const { items: services, index: copy } = getServices();

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} summary={copy.summary} />

      <section className="section bg-paper">
        <Container width="wide">
          <RevealGroup className="grid gap-5">
            {services.map((service, cardIndex) => (
              <RevealItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-6 rounded-2xl border border-line p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md sm:p-8 lg:grid-cols-12 lg:items-center"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[0.6875rem] font-medium text-white",
                          FIELD[service.accent],
                        )}
                      >
                        {String(cardIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                        {service.kicker}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-[1.5rem] tracking-[-0.02em] text-ink">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-micro text-accent">{service.headline}</p>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="text-body-lg text-fog">{service.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {service.flow.map((step) => (
                        <li
                          key={step.step}
                          className="rounded-full bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                        >
                          {step.step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent">
                      {copy.cardCta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
