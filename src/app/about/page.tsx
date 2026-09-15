import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getCompany, getShared } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reygent AI is an AI agency for owner-run businesses. We map the process before writing a rule, build the agent that removes it, and measure whether it actually worked.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { about } = getCompany();
  const { valuesList, timeline: history } = about;
  const { testimonials, siteStats } = getShared();

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        summary={about.hero.summary}
      />

      <section className="border-b border-line bg-paper">
        <Container width="wide">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:col-span-6 lg:aspect-auto lg:min-h-[420px]">
              <div className="absolute inset-0 bg-accent">
                <Image
                  src="/images/about-team.png"
                  alt={about.story.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover mix-blend-luminosity"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:p-10 xl:p-14">
              <RevealGroup>
                <RevealItem>
                  <p className="font-mono text-eyebrow uppercase text-accent">
                    {about.story.eyebrow}
                  </p>
                  <h2 className="mt-5 text-display-m text-ink">{about.story.title}</h2>
                  <p className="mt-5 text-body-lg text-fog">{about.story.body1}</p>
                  <p className="mt-4 text-body-lg text-fog">{about.story.body2}</p>
                </RevealItem>
                <RevealItem>
                  <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
                    {siteStats.slice(0, 4).map((stat) => (
                      <div key={stat.label}>
                        <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                          {stat.label}
                        </dt>
                        <dd className="mt-2 font-display text-[1.5rem] leading-none text-ink">
                          {stat.value}
                        </dd>
                        <dd className="mt-1 text-[0.75rem] text-fog">{stat.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </RevealItem>
              </RevealGroup>
            </div>
          </div>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow={about.values.eyebrow}
            title={about.values.title}
            lede={about.values.lede}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {valuesList.map((value) => (
              <RevealItem key={value.title}>
                <div className="border-t border-line pt-5">
                  <h3 className="text-[1.0625rem] font-medium text-ink">{value.title}</h3>
                  <p className="mt-2.5 text-micro text-fog">{value.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading eyebrow={about.history.eyebrow} title={about.history.title} />
          <ol className="mt-12 border-t border-line">
            {history.map((item) => (
              <Reveal
                key={item.year}
                as="li"
                className="grid gap-4 border-b border-line py-7 lg:grid-cols-12 lg:items-baseline"
              >
                <span className="font-mono text-[0.875rem] text-accent lg:col-span-2">
                  {item.year}
                </span>
                <h3 className="font-display text-[1.25rem] text-ink lg:col-span-4">
                  {item.title}
                </h3>
                <p className="text-body-lg text-fog lg:col-span-6">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section-sm bg-paper">
        <Container width="wide">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-ink">{about.proof.heading}</h2>
              <p className="mt-4 text-body-lg text-fog">{about.proof.note}</p>
              <Link
                href="/customers"
                className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
              >
                {about.proof.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {testimonials.slice(2, 6).map((item) => (
                <figure key={item.name} className="rounded-2xl border border-line p-6">
                  <blockquote className="text-[0.9375rem] text-fg-2">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <span className="block text-[0.875rem] font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-[0.75rem] text-fog">
                      {item.role}, {item.company}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <PageCTA
        title={about.cta.title}
        summary={about.cta.summary}
        primary={about.cta.primary}
        secondary={about.cta.secondary}
      />
    </>
  );
}
