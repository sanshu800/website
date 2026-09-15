import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { partnersProgram } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Partner programme",
  description:
    "Implement Reygent for the firms you advise. 20% recurring revenue share, certification, deal support and co-marketing.",
  alternates: { canonical: "/partners" },
};

const PARTNER_TYPES = [
  { title: "Operations consultants", body: "You are already mapping intake and delivery. Reygent becomes the system you hand over rather than a slide about one." },
  { title: "Accountancy practices", body: "Advise clients on their own operations and configuration, with the platform implemented under your brand." },
  { title: "Systems integrators", body: "You own the technical programme: migrations, data model design and integration work." },
  { title: "Fractional COOs", body: "Run the operating cadence across several firms, with one platform underneath all of them." },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={partnersProgram.headline}
        summary={partnersProgram.summary}
        actions={
          <>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
            >
              Apply to partner <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Talk to partnerships
            </Link>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow="Who partners with us" title="You already do the diagnosis." />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {PARTNER_TYPES.map((type) => (
              <RevealItem key={type.title}>
                <h3 className="text-[1.0625rem] font-medium text-ink">{type.title}</h3>
                <p className="mt-2.5 text-micro text-fog">{type.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow="The commercial part" title="What you get." />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partnersProgram.benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
                  <h3 className="font-display text-[1.0625rem] text-ink">{benefit.title}</h3>
                  <p className="mt-2.5 flex-1 text-micro text-fog">{benefit.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow="How it works" title="Four steps, about a month." />
          <ol className="mt-12 grid gap-6 lg:grid-cols-4">
            {partnersProgram.steps.map((step, index) => (
              <li key={step.title} className="border-t border-line-strong pt-5">
                <span className="font-mono text-[0.6875rem] text-violet">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[1.125rem] text-ink">{step.title}</h3>
                <p className="mt-2 text-micro text-fog">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <PageCTA
        title="Apply to the programme"
        summary="Tell us about your practice, the firms you advise, and where you think the platform fits. We reply to every application with a real answer."
        primary={{ href: "/contact", label: "Start application" }}
        secondary={{ href: "/about", label: "About Reygent" }}
      />
    </>
  );
}
