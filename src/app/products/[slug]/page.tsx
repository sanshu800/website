import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Screen } from "@/components/screens/ProductScreens";
import { products, productBySlug, modules } from "@/lib/content/products";
import { site } from "@/lib/content/marketing";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug[slug as keyof typeof productBySlug];
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} — ${product.kicker}`,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `Reygent ${product.name}`,
      description: product.summary,
      url: `${site.url}/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug[slug as keyof typeof productBySlug];
  if (!product) notFound();

  const related = modules.filter((module) => module.slug !== product.slug);
  const screenName =
    product.slug === "foundation" ? "intake" : (product.slug as "intake" | "engage" | "deliver" | "insight");

  return (
    <>
      <PageHero
        eyebrow={product.kicker}
        crumbs={[{ label: "Products", href: "/products" }, { label: product.name }]}
        title={product.headline}
        summary={product.intro}
        actions={
          <>
            <Link
              href="/get-started"
              className="inline-flex h-11 items-center rounded-full bg-violet px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-violet-2"
            >
              Start free trial
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Book a demo
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
            <p className="mt-3 font-mono text-[0.6875rem] text-fog-2">
              {product.panelCaption} · illustrative interface
            </p>
          </Reveal>
        }
      />

      {/* Flow */}
      <section className="border-b border-line bg-mist py-12 sm:py-14">
        <Container width="wide">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.flow.map((step, index) => (
              <RevealItem key={step.step} className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-violet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                </div>
                <p className="mt-3 font-display text-[1.0625rem] text-ink">{step.step}</p>
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
            eyebrow="What it does"
            title={`Six jobs ${product.name} takes off your team.`}
            lede="Each of these is work a firm currently does by hand, badly, on the weeks when it is busiest."
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <RevealItem key={feature.title}>
                <div className="flex h-full flex-col border-t border-line pt-5">
                  <h3 className="text-[1.0625rem] font-medium text-ink">{feature.title}</h3>
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
              <h2 className="text-display-m text-ink">What changes for the firm</h2>
              <p className="mt-4 text-body-lg text-fog">
                Stated as operational outcomes rather than features, because this is
                what a partner meeting actually asks about.
              </p>
            </div>
            <ul className="lg:col-span-6 lg:col-start-7">
              {product.outcomes.map((outcome) => (
                <Reveal as="li" key={outcome} className="flex items-start gap-3 border-b border-line py-4">
                  <Check className="mt-[5px] h-4 w-4 shrink-0 text-violet" />
                  <span className="text-body-lg text-fg-2">{outcome}</span>
                </Reveal>
              ))}
              <li className="pt-5">
                <Badge accent="neutral">
                  Runs alongside email, calendar, documents and your ledger
                </Badge>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Works with */}
      <section className="section bg-mist">
        <Container width="wide">
          <SectionHeading
            eyebrow="Where it fits"
            title="Pairs with the rest of the platform."
            lede="Reygent modules share one record. Context gathered in one is available in the others, with no integration work between them."
          />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
            {related.map((module) => (
              <RevealItem key={module.slug}>
                <Link
                  href={`/products/${module.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                >
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog-2">
                    {module.kicker}
                  </span>
                  <span className="mt-2 flex items-center justify-between font-display text-[1.125rem] text-ink">
                    {module.name}
                    <ArrowRight className="h-4 w-4 text-fog-2 transition-transform duration-300 group-hover:translate-x-0.5" />
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
