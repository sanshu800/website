import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getResources } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/build-log", {
    title: "Build log",
    description:
      "Real automations that went into production for clients, with what each one replaced and what it taught us.",
    alternates: { canonical: "/build-log" },
  });
}

const KIND_STYLE: Record<string, string> = {
  Shipped: "border-jade-line bg-jade-soft text-jade-ink",
  Learned: "border-azure-line bg-azure-soft text-azure-ink",
  Fixed: "border-line bg-mist text-fog",
};

export default function BuildLogPage() {
  const { releaseNotes: log } = getResources();
  const [latest, ...rest] = log.items;

  return (
    <>
      <PageHero
        title={log.hero.title}
        summary={log.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          {latest && (
            <Reveal>
              <article className="rounded-2xl border border-accent/30 bg-accent-soft p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-on-accent">
                    {log.latestBadge}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-accent">
                    {latest.issue}
                  </span>
                  <time className="font-mono text-[0.6875rem] text-fog">
                    {latest.date}
                  </time>
                </div>
                <h2 className="mt-5 font-display text-[1.75rem] text-ink">
                  {latest.title}
                </h2>
                <p className="mt-3 max-w-[42rem] text-body-lg text-fog">
                  {latest.summary}
                </p>
                <ul className="mt-7 space-y-3 border-t border-accent/20 pt-6">
                  {latest.items.map((item) => (
                    <li key={item.text} className="flex flex-wrap items-baseline gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wide",
                          KIND_STYLE[item.kind],
                        )}
                      >
                        {item.kind}
                      </span>
                      <span className="text-body text-fg-2">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )}

          <div className="mt-16 border-t border-line">
            {rest.map((note) => (
              <Reveal
                key={note.issue}
                className="grid gap-6 border-b border-line py-9 lg:grid-cols-12"
              >
                <div className="lg:col-span-3">
                  <p className="font-mono text-[0.75rem] text-ink">{note.issue}</p>
                  <time className="mt-1.5 block font-mono text-[0.6875rem] text-fog">
                    {note.date}
                  </time>
                </div>
                <div className="lg:col-span-9">
                  <h2 className="font-display text-[1.25rem] text-ink">{note.title}</h2>
                  <p className="mt-2.5 max-w-[40rem] text-micro text-fog">
                    {note.summary}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {note.items.map((item) => (
                      <li key={item.text} className="flex flex-wrap items-baseline gap-3">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wide",
                            KIND_STYLE[item.kind],
                          )}
                        >
                          {item.kind}
                        </span>
                        <span className="text-micro text-fg-2">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-micro text-fog">
            {log.digest.before}{" "}
            <Link href="/newsletter" className="text-accent underline underline-offset-2">
              {log.digest.linkLabel}
            </Link>
            .
          </p>
        </Container>
      </section>

      <PageCTA
        title={log.cta.title}
        summary={log.cta.summary}
        primary={log.cta.primary}
        secondary={log.cta.secondary}
      />
    </>
  );
}
