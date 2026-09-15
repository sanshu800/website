import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { roles, companyValues } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Reygent across engineering, product, design, operations research and go-to-market.",
  alternates: { canonical: "/careers" },
};

const PERKS = [
  { title: "Remote-first, with real async habits", body: "Written-first by default. Meetings are for decisions, not for status." },
  { title: "Every engineer talks to customers", body: "Implementation calls are open to the whole team. You should see the problem, not a ticket about it." },
  { title: "Time to think", body: "A protected day each month with no meetings, for reading and for the work that never fits anywhere else." },
  { title: "Equipment and learning budget", body: "Your setup, your choice, plus an annual budget with no approval theatre." },
];

export default function CareersPage() {
  const teams = [...new Set(roles.map((role) => role.team))];

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build systems that outlive the person who built them."
        summary="We are a small team building operational infrastructure for firms that cannot afford to guess. If you like problems with a measurable answer, this is the right place."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow="Open roles"
            title={`${roles.length} positions across ${teams.length} teams.`}
            lede="Every role below is live, with a real hiring manager and a defined process. If it is listed, we are reading applications."
          />
          <RevealGroup className="mt-12 border-t border-line">
            {roles.map((role) => (
              <RevealItem key={role.slug}>
                <Link
                  href={`/careers/${role.slug}`}
                  className="group grid gap-4 border-b border-line py-7 transition-colors hover:bg-mist/60 lg:grid-cols-12 lg:items-center"
                >
                  <div className="lg:col-span-5">
                    <h2 className="font-display text-[1.25rem] text-ink">{role.title}</h2>
                    <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
                      {role.team}
                    </p>
                  </div>
                  <p className="text-micro text-fog lg:col-span-4">{role.summary}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-3 lg:justify-end">
                    <span className="flex items-center gap-1.5 text-[0.75rem] text-fog">
                      <MapPin className="h-3.5 w-3.5" />
                      {role.location}
                    </span>
                    <ArrowRight className="h-4 w-4 text-fog-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow="Working here" title="What we actually offer." />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {PERKS.map((perk) => (
              <RevealItem key={perk.title}>
                <h3 className="text-[1.0625rem] font-medium text-ink">{perk.title}</h3>
                <p className="mt-2.5 text-micro text-fog">{perk.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16">
            <h2 className="font-mono text-eyebrow uppercase text-fog-2">
              What we look for
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {companyValues.map((value) => (
                <li
                  key={value.title}
                  className="rounded-xl border border-line bg-paper px-5 py-4 text-[0.875rem] text-fg-2"
                >
                  {value.title}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <PageCTA
        title="Nothing fits, but you think you should be here?"
        summary="Tell us what you would build and why it matters for a firm that runs on client relationships. We read everything."
        primary={{ href: "/contact", label: "Get in touch" }}
        secondary={{ href: "/about", label: "About Reygent" }}
      />
    </>
  );
}
