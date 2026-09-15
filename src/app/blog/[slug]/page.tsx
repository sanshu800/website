import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageCTA } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getBlog } from "@/lib/cms/content";
import { type Block } from "@/lib/content/blog";
import { formatDate, initials } from "@/lib/utils";
import { site } from "@/lib/content/marketing";

export function generateStaticParams() {
  return getBlog().posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog().bySlug[slug];
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
    },
  };
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote>
          {block.text}
          {block.attribution && (
            <footer className="mt-3 font-mono text-[0.75rem] not-italic text-fog">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <aside className="rounded-xl border-l-2 border-accent bg-accent-soft/60 p-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
            {block.title}
          </p>
          <p className="mt-2 text-[1rem] text-fg-2">{block.text}</p>
        </aside>
      );
    case "p":
    default:
      return <p>{block.text}</p>;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { posts, bySlug } = getBlog();
  const post = bySlug[slug];
  if (!post) notFound();

  const related = posts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 2);
  const fallback = posts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const suggestions = related.length ? related : fallback;

  return (
    <>
      <article>
        <header className="border-b border-line bg-paper pb-12 pt-28 sm:pt-32 lg:pt-36">
          <Container width="narrow">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wide text-fog transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </Link>
            <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
              {post.category}
            </p>
            <h1 className="mt-4 text-display-l text-ink">{post.title}</h1>
            <p className="mt-5 text-lead text-fog">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-[0.75rem] font-semibold text-accent-2">
                  {initials(post.author.name)}
                </span>
                <span>
                  <span className="block text-[0.875rem] font-medium text-ink">
                    {post.author.name}
                  </span>
                  <span className="block text-[0.75rem] text-fog">{post.author.role}</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-fog">
                <Clock className="h-3.5 w-3.5" />
                {post.readingMinutes} min read
              </span>
              <time
                dateTime={post.publishedAt}
                className="font-mono text-[0.6875rem] text-fog"
              >
                {formatDate(post.publishedAt, "long")}
              </time>
            </div>
          </Container>
        </header>

        <div className="bg-paper py-14 sm:py-16">
          <Container width="narrow">
            <div className="prose-reygent">
              {post.body.map((block, index) => (
                <BlockView key={index} block={block} />
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-line bg-mist p-6 sm:p-7">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog">
                Run this on your own firm
              </p>
              <p className="mt-3 text-body-lg text-fg-2">
                The intake scorecard in this article is free, and takes an afternoon.
                If you would rather we ran it with you, that is what the first call is
                for.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/guides"
                  className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-[0.875rem] font-medium text-white transition-colors hover:bg-accent-2"
                >
                  Get the scorecard
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-10 items-center rounded-full border border-line-strong bg-paper px-4 text-[0.875rem] font-medium text-ink transition-colors hover:bg-mist"
                >
                  Book a demo
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </article>

      <section className="border-t border-line bg-paper py-12 sm:py-14">
        <Container width="narrow">
          <h2 className="font-mono text-eyebrow uppercase text-fog-2">Keep reading</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {suggestions.map((item) => (
              <Reveal key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-line p-5 transition-all duration-300 hover:border-line-strong hover:shadow-sm"
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-wide text-accent">
                    {item.category}
                  </span>
                  <span className="mt-2 flex-1 font-display text-[1.0625rem] leading-snug text-ink">
                    {item.title}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] text-fog">
                    {item.readingMinutes} min read
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <PageCTA />
    </>
  );
}
