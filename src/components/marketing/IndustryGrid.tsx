import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { solutions } from "@/lib/content/compare";
import { cn } from "@/lib/utils";

const FIELD: Record<string, string> = {
  legal: "bg-violet",
  accounting: "bg-jade",
  consulting: "bg-tangerine",
  advisory: "bg-azure",
};

export function IndustryGrid() {
  return (
    <section className="section bg-paper">
      <Container width="wide">
        <SectionHeading
          eyebrow="Built for your practice"
          title="The same operation, different vocabulary."
          lede="A brief in a law firm is an engagement in a consultancy and a client in an accountancy. The underlying operation is identical: work arrives, must be qualified, delivered and reported on."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
          {solutions.map((solution) => (
            <RevealItem key={solution.slug}>
              <Link
                href={`/solutions/${solution.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:border-line-strong hover:shadow-md"
              >
                <div className={cn("h-1.5 w-full", FIELD[solution.slug])} />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[1.25rem] text-ink">
                      {solution.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-fog-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                  <p className="mt-3 text-small text-fog">{solution.summary}</p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {solution.metrics.slice(0, 3).map((metric) => (
                      <li
                        key={metric.label}
                        className="rounded-full bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                      >
                        {metric.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
