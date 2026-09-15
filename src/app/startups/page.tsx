import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { startupsProgram, siteStats } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Startup programme",
  description:
    "Firms under three years old get 50% off Reygent Core or Pro for twelve months, implementation included.",
  alternates: { canonical: "/startups" },
};

export default function StartupsPage() {
  return (
    <>
      <PageHero
        eyebrow="Startup programme"
        title={startupsProgram.headline}
        summary={startupsProgram.summary}
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Ask about eligibility
            </Link>
          </>
        }
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading eyebrow="What is included" title="Four things, no asterisks." />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {startupsProgram.benefits.map((benefit) => (
              <RevealItem key={benefit.title}>
                <div className="flex h-full gap-4 rounded-2xl border border-line p-6">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <div>
                    <h3 className="text-[1.0625rem] font-medium text-ink">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-micro text-fog">{benefit.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12">
            <div className="rounded-2xl bg-mist p-7 sm:p-9">
              <h2 className="font-display text-[1.25rem] text-ink">Eligibility</h2>
              <ul className="mt-5 grid gap-3 text-body-lg text-fog sm:grid-cols-2">
                <li>Firm incorporated within the last 36 months.</li>
                <li>Between 2 and 25 people, including founders.</li>
                <li>Trading and serving clients — not pre-revenue.</li>
                <li>Not currently on a Reygent paid plan.</li>
              </ul>
              <p className="mt-6 text-micro text-fog-2">
                One programme enrolment per firm. If you are near the boundary in
                either direction, apply anyway and we will use our judgement rather
                than the spreadsheet.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {siteStats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[2rem] leading-none text-ink">
                  {stat.value}
                </dd>
                <dt className="mt-2 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-[0.75rem] text-fog">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <PageCTA
        title="Ready to apply?"
        summary="Six questions, two minutes. We confirm eligibility within one working day and start the discount from your first paid month."
        primary={{ href: "/get-started", label: "Apply now" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
