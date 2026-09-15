import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { releaseNotes, guides } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The Operations Briefing — one email a month on professional-services operations, with a new playbook each issue.",
  alternates: { canonical: "/newsletter" },
};

const ISSUES = [
  { number: "024", title: "The three-week absence test", summary: "What breaks when a partner goes on leave, and the handover checklist that fixes it." },
  { number: "023", title: "Measuring intake without a new dashboard", summary: "Four numbers you can pull from systems you already have, this week." },
  { number: "022", title: "AI on client records, without the risk", summary: "Where model access is defensible in a professional-services firm, and where it is not." },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="The Operations Briefing."
        summary="One email a month for the people who run professional-services firms. A real problem, the measurement that exposes it, and a playbook you can run without buying software."
        actions={undefined}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-line bg-mist p-7 sm:p-8">
                <Mail className="h-5 w-5 text-violet" aria-hidden="true" />
                <h2 className="mt-5 font-display text-[1.5rem] text-ink">
                  Subscribe
                </h2>
                <p className="mt-3 text-micro text-fog">
                  Work email only — we do not accept gmail addresses for the briefing,
                  because the content assumes you run a firm.
                </p>
                <div className="mt-7">
                  <NewsletterForm source="newsletter-page" />
                </div>
              </div>

              <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Frequency", value: "Monthly" },
                  { label: "Length", value: "5 minutes" },
                  { label: "Unsubscribe", value: "One click" },
                ].map((item) => (
                  <RevealItem key={item.label}>
                    <div className="rounded-xl border border-line px-4 py-3">
                      <p className="font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-[0.875rem] font-medium text-ink">
                        {item.value}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                Recent issues
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {ISSUES.map((issue) => (
                  <li key={issue.number} className="flex gap-5 py-6">
                    <span className="font-mono text-[0.75rem] text-violet">
                      {issue.number}
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium text-ink">
                        {issue.title}
                      </h3>
                      <p className="mt-1.5 text-micro text-fog">{issue.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                Included with the briefing
              </h2>
              <ul className="mt-5 space-y-3">
                {guides.slice(0, 4).map((guide) => (
                  <li key={guide.slug} className="flex items-baseline justify-between gap-4">
                    <span className="text-micro text-fg-2">{guide.title}</span>
                    <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                      {guide.format}
                    </span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                Shipped recently
              </h2>
              <ul className="mt-5 space-y-4">
                {releaseNotes.slice(0, 3).map((note) => (
                  <li key={note.version} className="flex gap-4">
                    <span className="font-mono text-[0.6875rem] text-fog-2">
                      v{note.version}
                    </span>
                    <span className="text-micro text-fg-2">{note.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
