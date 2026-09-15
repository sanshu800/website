import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { legalPages } from "@/lib/content/company";

type Slug = keyof typeof legalPages;
const SLUGS = Object.keys(legalPages) as Slug[];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug as Slug];
  if (!page) return { title: "Not found" };
  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = legalPages[slug as Slug];
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Last updated ${page.updated}`}
        crumbs={[{ label: page.title }]}
        title={page.title}
        summary={page.intro}
      />
      <section className="section bg-paper">
        <Container width="narrow">
          <div className="space-y-10">
            {page.sections.map((section) => (
              <div key={section.h}>
                <h2 className="font-display text-[1.25rem] text-ink">{section.h}</h2>
                <p className="mt-3 text-body-lg text-fog">{section.p}</p>
              </div>
            ))}
          </div>

          <nav className="mt-14 border-t border-line pt-8">
            <p className="font-mono text-eyebrow uppercase text-fog-2">Other policies</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SLUGS.filter((item) => item !== slug).map((item) => (
                <li key={item}>
                  <Link
                    href={`/legal/${item}`}
                    className="inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist"
                  >
                    {legalPages[item].title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/security"
                  className="inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist"
                >
                  Security
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </>
  );
}
