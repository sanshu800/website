import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { companyValues, timeline, siteStats } from "@/lib/content/company";
import { getShared } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reygent builds operational systems for professional-service firms. We map the process before writing a rule, and we measure whether it worked.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { testimonials } = getShared();

  return (
    <>
      <PageHero
        eyebrow="About"
        title="We build the layer between the tools."
        summary="Reygent started as an operations consultancy. After mapping the same four bottlenecks in firm after firm, we stopped writing reports and started building the system that removes them."
      />

      <section className="border-b border-line bg-paper">
        <Container width="wide">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:col-span-6 lg:aspect-auto lg:min-h-[420px]">
              <div className="absolute inset-0 bg-accent">
                <Image
                  src="/images/about-team.png"
                  alt="Three colleagues reviewing printed process diagrams on a wall during a working session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover mix-blend-luminosity"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:p-10 xl:p-14">
              <RevealGroup>
                <RevealItem>
                  <p className="font-mono text-eyebrow uppercase text-accent">Why we exist</p>
                  <h2 className="mt-5 text-display-m text-ink">
                    Most firms do not need better software. They need one system.
                  </h2>
                  <p className="mt-5 text-body-lg text-fog">
                    Every engagement we ran started the same way: a partner describing
                    a problem they assumed was inevitable. Enquiries answered late.
                    Documents chased for weeks. Reports rebuilt by hand at month end.
                  </p>
                  <p className="mt-4 text-body-lg text-fog">
                    None of it was inevitable. It was the predictable result of work
                    crossing between systems that could not see each other. So we
                    built the layer that sits underneath, and then we built the four
                    applications that run on it.
                  </p>
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
            eyebrow="How we work"
            title="Six principles that decide what we build."
            lede="These are not values on a wall. Each one has killed a feature or a deal, and we can tell you which."
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {companyValues.map((value) => (
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
          <SectionHeading eyebrow="History" title="From audits to a platform." />
          <ol className="mt-12 border-t border-line">
            {timeline.map((item) => (
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
              <h2 className="text-display-m text-ink">What firms say</h2>
              <p className="mt-4 text-body-lg text-fog">
                Placeholder testimonials on this build — the layout is real, the people
                are not.
              </p>
              <Link
                href="/customers"
                className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
              >
                All customer stories
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
        title="Want to see how we think?"
        summary="The first call is a working session on your operation, not a product tour. Bring a real process and we will map it."
        primary={{ href: "/careers", label: "We are hiring" }}
        secondary={{ href: "/demo", label: "Book a demo" }}
      />
    </>
  );
}
