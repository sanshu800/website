import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Screen } from "@/components/screens/WorkScreens";
import { getServices } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export function generateStaticParams() {
  return getServices().items.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServices().bySlug[slug];
  if (!service) return { title: "Not found" };
  return withSeo(`/services/${service.slug}`, {
      title: service.name,
      description: service.summary,
      alternates: { canonical: `/services/${service.slug}` },
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { bySlug, core, detail } = getServices();
  const service = bySlug[slug];
  if (!service) notFound();

  const related = core.filter((item) => item.slug !== service.slug);
  /* The console each service demos, declared on the service itself. */
  const screenName = service.home.screen;

  return (
    <>
      <JsonLd data={[serviceSchema(service), breadcrumbSchema([
        { name: "Services", path: "/services" },
        { name: service.name, path: `/services/${service.slug}` },
      ])]} />
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: service.name }]}
        title={service.headline}
        summary={service.intro}
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-body font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              Book a free audit
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong bg-paper px-5 text-body font-medium text-ink transition-colors hover:bg-mist"
            >
              Talk to us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
        aside={
          <Reveal variant="scale" duration={0.9}>
            <div className="app-frame">
              <div className="h-[300px] sm:h-[340px]">
                <Screen name={screenName} />
              </div>
            </div>
            <p className="mt-3 font-mono text-eyebrow text-fog">
              {service.panelCaption} · {detail.captionSuffix}
            </p>
          </Reveal>
        }
      />

      {/* Flow */}
      <section className="border-b border-line bg-mist py-12 sm:py-14">
        <Container width="wide">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.flow.map((step, index) => (
              <RevealItem key={step.step} className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-eyebrow uppercase tracking-label text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                </div>
                <p className="mt-3 font-display text-body-lg text-ink">{step.step}</p>
                <p className="mt-1 text-micro text-fog">{step.detail}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            title={detail.capabilities.titleTemplate.replace("{name}", service.name)}
            lede={detail.capabilities.lede}
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <RevealItem key={feature.title}>
                <div className="flex h-full flex-col border-t border-line pt-5">
                  <h3 className="text-body-lg font-medium text-ink">{feature.title}</h3>
                  <p className="mt-2.5 text-micro text-fog">{feature.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Outcomes */}
      <section className="section-sm border-y border-line bg-paper">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-display-m text-ink">{detail.outcomes.heading}</h2>
              <p className="mt-4 text-body-lg text-fog">{detail.outcomes.note}</p>
            </div>
            <ul className="lg:col-span-6 lg:col-start-7">
              {service.outcomes.map((outcome) => (
                <Reveal as="li" key={outcome} className="flex items-start gap-3 border-b border-line py-4">
                  <Check className="mt-[5px] h-4 w-4 shrink-0 text-accent" />
                  <span className="text-body-lg text-fg-2">{outcome}</span>
                </Reveal>
              ))}
              <li className="pt-5">
                <Badge accent="neutral">{detail.fits.alongside}</Badge>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Works with */}
      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading
            title={detail.fits.title}
            lede={detail.fits.lede}
          />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
            {related.map((module) => (
              <RevealItem key={module.slug}>
                <Link
                  href={`/services/${module.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                >
                  <span className="font-mono text-eyebrow uppercase tracking-label text-fog">
                    {module.kicker}
                  </span>
                  <span className="mt-2 flex items-center justify-between font-display text-display-s text-ink">
                    {module.name}
                    <ArrowRight className="h-4 w-4 text-fog transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 text-micro text-fog">{module.summary}</span>
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
