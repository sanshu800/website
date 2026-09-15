import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { getLegal } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";

export function generateStaticParams() {
  return Object.keys(getLegal().pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { pages } = getLegal();
  const page = pages[slug as keyof typeof pages];
  if (!page) return { title: "Not found" };
  return withSeo(`/legal/${slug}`, {
      title: page.title,
      description: page.intro,
      alternates: { canonical: `/legal/${slug}` },
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { pages } = getLegal();
  const page = pages[slug as keyof typeof pages];
  if (!page) notFound();

  const slugs = Object.keys(pages);

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
              {slugs.filter((item) => item !== slug).map((item) => (
                <li key={item}>
                  <Link
                    href={`/legal/${item}`}
                    className="inline-flex items-center rounded-lg border border-line px-3.5 py-1.5 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist"
                  >
                    {pages[item as keyof typeof pages].title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/security"
                  className="inline-flex items-center rounded-lg border border-line px-3.5 py-1.5 text-[0.8125rem] text-fg-2 transition-colors hover:bg-mist"
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
