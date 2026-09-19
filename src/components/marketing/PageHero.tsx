import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Shared page hero. Every inner page opens the same way — breadcrumb,
 * display heading, single-sentence summary — so the site reads as one product
 * rather than a set of landing pages.
 */
export function PageHero({
  eyebrow,
  title,
  summary,
  crumbs = [],
  actions,
  align = "left",
  tone = "paper",
  aside,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  summary?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  align?: "left" | "center";
  tone?: "paper" | "ink";
  aside?: React.ReactNode;
  className?: string;
}) {
  const onInk = tone === "ink";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36",
        onInk ? "border-white/10 bg-night" : "border-line bg-paper",
        className,
      )}
    >
      {onInk ? (
        /* A plain surface: the dark band already separates itself from the page
           either side of it, and a hairline grid on top of that is decoration
           that reads as generated rather than drawn. */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(10,10,11,0.07),transparent_70%)]"
        />
      )}

      <Container width="wide" className="relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-eyebrow uppercase tracking-label">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight
                      className={cn("h-3 w-3", onInk ? "text-on-night-3" : "text-fog")}
                    />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className={cn(
                        "transition-colors",
                        onInk ? "text-on-night-2 hover:text-on-night" : "text-fog hover:text-ink",
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={onInk ? "text-on-night" : "text-ink"}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className={cn(
            "grid gap-10",
            aside ? "lg:grid-cols-12 lg:gap-12" : undefined,
          )}
        >
          <div
            className={cn(
              aside ? "lg:col-span-7" : "max-w-[52rem]",
              align === "center" && !aside && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <Reveal variant="fade">
                <Eyebrow
                  tone={onInk ? "on-ink" : "accent"}
                  className={align === "center" && !aside ? "justify-center" : undefined}
                >
                  {eyebrow}
                </Eyebrow>
              </Reveal>
            )}
            <Reveal delay={0.05}>
              <h1
                className={cn(
                  eyebrow ? "mt-5" : "mt-0",
                  "text-display-xl",
                  onInk ? "text-on-night" : "text-ink",
                )}
              >
                {title}
              </h1>
            </Reveal>
            {summary && (
              <Reveal delay={0.1}>
                <p
                  className={cn(
                    "mt-6 text-lead",
                    onInk ? "text-on-night-2" : "text-fog",
                    align === "center" && !aside ? "mx-auto max-w-[40rem]" : "max-w-[42rem]",
                  )}
                >
                  {summary}
                </p>
              </Reveal>
            )}
            {actions && (
              <Reveal delay={0.15}>
                <div
                  className={cn(
                    "mt-8 flex flex-wrap gap-3",
                    align === "center" && !aside && "justify-center",
                  )}
                >
                  {actions}
                </div>
              </Reveal>
            )}
          </div>

          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}

/** Small consistent CTA used at the foot of inner pages. */
export function PageCTA({
  title = "Find out what is worth automating first",
  summary = "Book a free thirty-minute audit. We map the process costing you the most time and tell you honestly whether AI should touch it — the notes are yours either way.",
  primary = { href: "/get-started", label: "Book a free audit" },
  secondary = { href: "/how-we-work", label: "See how we work" },
}: {
  title?: string;
  summary?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="border-t border-line bg-mist py-16 sm:py-20">
      <Container width="wide">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-[34rem]">
            <h2 className="text-display-m text-ink">{title}</h2>
            <p className="mt-3 text-body text-fog">{summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="secondary" size="lg">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
