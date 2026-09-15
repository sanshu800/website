import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getCompany } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/careers", {
    title: "Careers",
    description:
      "Open roles at Reygent AI across engineering, product, design, operations research and go-to-market.",
    alternates: { canonical: "/careers" },
  });
}

export default function CareersPage() {
  const { about, careers } = getCompany();
  const valuesList = about.valuesList;
  const { roles } = careers;
  const teams = [...new Set(roles.map((role) => role.team))];

  return (
    <>
      <PageHero
        eyebrow={careers.hero.eyebrow}
        title={careers.hero.title}
        summary={careers.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow={careers.openRoles.eyebrow}
            title={careers.openRoles.titleTemplate
              .replace("{roles}", String(roles.length))
              .replace("{teams}", String(teams.length))}
            lede={careers.openRoles.lede}
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
          <SectionHeading
            eyebrow={careers.workingHere.eyebrow}
            title={careers.workingHere.title}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {careers.perks.map((perk) => (
              <RevealItem key={perk.title}>
                <h3 className="text-[1.0625rem] font-medium text-ink">{perk.title}</h3>
                <p className="mt-2.5 text-micro text-fog">{perk.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16">
            <h2 className="font-mono text-eyebrow uppercase text-fog-2">
              {careers.workingHere.lookingFor}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {valuesList.map((value) => (
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
        title={careers.cta.title}
        summary={careers.cta.summary}
        primary={careers.cta.primary}
        secondary={careers.cta.secondary}
      />
    </>
  );
}
