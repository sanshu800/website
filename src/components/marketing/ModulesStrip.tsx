import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { modules } from "@/lib/content/products";
import { cn } from "@/lib/utils";

const ACCENT_FIELD: Record<string, string> = {
  violet: "bg-violet",
  tangerine: "bg-tangerine",
  jade: "bg-jade",
  azure: "bg-azure",
};

/**
 * The four modules as connected operations rather than four separated cards:
 * each tile names where the work arrives and where it leaves, so the handover
 * between modules is the point of the layout.
 */
export function ModulesStrip() {
  return (
    <section className="section-sm bg-paper pt-0">
      <Container width="wide">
        <SectionHeading
          eyebrow="How it fits together"
          title={
            <>
              One operation, four jobs,
              <br className="hidden sm:block" /> handed over cleanly.
            </>
          }
          lede="Most firms run these as separate processes with a person in between. Each handover is where time is lost and context is dropped."
        />

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, index) => (
            <RevealItem key={module.slug}>
              <Link
                href={`/products/${module.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg font-mono text-[0.6875rem] font-medium text-white",
                      ACCENT_FIELD[module.accent],
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight className="h-4 w-4 text-fog-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>

                <h3 className="mt-5 font-display text-[1.125rem] text-ink">
                  {module.name}
                </h3>
                <p className="mt-2 flex-1 text-micro text-fog">{module.summary}</p>

                {/* The handover: what this job consumes and produces. */}
                <dl className="mt-5 space-y-2 border-t border-line pt-4">
                  {module.flow.slice(0, 2).map((step) => (
                    <div key={step.step} className="flex items-baseline gap-3">
                      <dt className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                        {step.step}
                      </dt>
                      <dd className="text-[0.75rem] text-fg-2">{step.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-mist p-5 sm:p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink font-mono text-[0.6875rem] font-medium text-white">
              05
            </span>
            <p className="flex-1 text-[0.9375rem] text-fg-2">
              <span className="font-medium text-ink">Foundation</span> sits underneath
              all four — one memory layer so context accumulates on the client instead
              of scattering across modules.
            </p>
            <Link
              href="/products/foundation"
              className="group inline-flex items-center gap-2 text-[0.875rem] font-medium text-violet"
            >
              How it works
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
