import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getResources } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The Operations Briefing — one email a month on professional-services operations, with a new playbook each issue.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  const { newsletter, guides, releaseNotes } = getResources();

  return (
    <>
      <PageHero
        eyebrow={newsletter.hero.eyebrow}
        title={newsletter.hero.title}
        summary={newsletter.hero.summary}
        actions={undefined}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-line bg-mist p-7 sm:p-8">
                <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
                <h2 className="mt-5 font-display text-[1.5rem] text-ink">
                  {newsletter.subscribe.heading}
                </h2>
                <p className="mt-3 text-micro text-fog">{newsletter.subscribe.note}</p>
                <div className="mt-7">
                  <NewsletterForm source="newsletter-page" />
                </div>
              </div>

              <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-3">
                {newsletter.subscribe.facts.map((item) => (
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
                {newsletter.issuesHeading}
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {newsletter.issues.map((issue) => (
                  <li key={issue.number} className="flex gap-5 py-6">
                    <span className="font-mono text-[0.75rem] text-accent">
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
                {newsletter.includedHeading}
              </h2>
              <ul className="mt-5 space-y-3">
                {guides.items.slice(0, 4).map((guide) => (
                  <li key={guide.slug} className="flex items-baseline justify-between gap-4">
                    <span className="text-micro text-fg-2">{guide.title}</span>
                    <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wide text-fog-2">
                      {guide.format}
                    </span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                {newsletter.shippedHeading}
              </h2>
              <ul className="mt-5 space-y-4">
                {releaseNotes.items.slice(0, 3).map((note) => (
                  <li key={note.issue} className="flex gap-4">
                    <span className="font-mono text-[0.6875rem] text-fog-2">
                      {note.issue}
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
