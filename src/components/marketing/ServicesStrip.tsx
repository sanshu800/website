import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getHome, getServices } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

const ACCENT_FIELD: Record<string, { fill: string; on: string }> = {
  ink: { fill: "bg-accent", on: "text-on-accent" },
  tangerine: { fill: "bg-tangerine-ink", on: "text-on-tangerine" },
  jade: { fill: "bg-jade-ink", on: "text-on-jade" },
  azure: { fill: "bg-azure-ink", on: "text-on-azure" },
};

/**
 * Four services as connected work rather than four separated cards: each tile
 * names what the agent takes on and what it hands back, so the handover is the
 * point of the layout.
 */
export function ServicesStrip() {
  const { core, managed } = getServices();
  const { modules: copy } = getHome();

  return (
    <section className="section-sm bg-paper">
      <Container width="wide">
        <SectionHeading
          title={
            <>
              {copy.titleLines.map((line, index) => (
                <span key={line}>
                  {index > 0 && <br className="hidden sm:block" />}
                  {index > 0 ? ` ${line}` : line}
                </span>
              ))}
            </>
          }
          lede={copy.lede}
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {core.map((module, index) => (
            <RevealItem key={module.slug}>
              <Link
                href={`/services/${module.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg font-mono text-eyebrow font-medium",
                      ACCENT_FIELD[module.accent]?.fill,
                      ACCENT_FIELD[module.accent]?.on,
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight className="h-4 w-4 text-fog transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>

                <h3 className="mt-5 font-display text-display-s text-ink">
                  {module.name}
                </h3>
                <p className="mt-2 flex-1 text-micro text-fog">{module.summary}</p>

                {/* The handover: what this job consumes and produces. */}
                <dl className="mt-5 space-y-2 border-t border-line pt-4">
                  {module.flow.slice(0, 2).map((step) => (
                    <div key={step.step} className="flex items-baseline gap-3">
                      <dt className="font-mono text-label uppercase tracking-label text-fog">
                        {step.step}
                      </dt>
                      <dd className="text-label text-fg-2">{step.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-mist p-5 sm:p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-night font-mono text-eyebrow font-medium text-on-night">
              05
            </span>
            <p className="flex-1 text-body text-fg-2">
              <span className="font-medium text-ink">{managed.name}</span> is the one you
              keep: monitoring, tuning and support for everything we built, so it still
              works when your business changes.
            </p>
            <ButtonLink
              href={`/services/${managed.slug}`}
              variant="secondary"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Explore {managed.name}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
