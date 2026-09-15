import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getBlog } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/blog", {
    title: "Blog",
    description:
      "Practical writing for business owners: which processes are worth automating, what it costs, what breaks, and where AI genuinely helps.",
    alternates: { canonical: "/blog" },
  });
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "All" } = await searchParams;
  const { posts, categories, index: copy } = getBlog();
  const active = categories.includes(category as (typeof categories)[number])
    ? category
    : "All";
  const filtered =
    active === "All" ? posts : posts.filter((post) => post.category === active);
  const featured = filtered.find((post) => post.featured) ?? filtered[0];
  const rest = filtered.filter((post) => post !== featured);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        summary={copy.summary}
      />

      <section className="border-b border-line bg-paper py-5">
        <Container width="wide">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <Link
                key={item}
                href={item === "All" ? "/blog" : `/blog?category=${encodeURIComponent(item)}`}
                aria-current={item === active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                  item === active
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line text-fg-2 hover:bg-mist",
                )}
              >
                {item}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          {filtered.length === 0 && (
            <p className="text-body-lg text-fog">
              {copy.emptyState}
            </p>
          )}

          {featured && (
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid gap-8 rounded-2xl border border-line p-7 transition-all duration-300 hover:border-line-strong hover:shadow-md sm:p-9 lg:grid-cols-12"
              >
                <div className="lg:col-span-7">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
                    Featured · {featured.category}
                  </span>
                  <h2 className="mt-4 font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-ink">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-body-lg text-fog">{featured.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-medium text-accent">
                    Read the article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-line lg:pl-8">
                  <p className="text-[0.875rem] font-medium text-ink">
                    {featured.author.name}
                  </p>
                  <p className="text-[0.75rem] text-fog">{featured.author.role}</p>
                  <div className="mt-4 flex items-center gap-3 font-mono text-[0.6875rem] text-fog">
                    <time dateTime={featured.publishedAt}>
                      {formatDate(featured.publishedAt)}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {featured.readingMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <RevealItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md"
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-wide text-accent">
                    {post.category}
                  </span>
                  <h3 className="mt-3 font-display text-[1.125rem] leading-snug text-ink">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-micro text-fog">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4 font-mono text-[0.6875rem] text-fog">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    <span>{post.readingMinutes} min</span>
                  </div>
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
