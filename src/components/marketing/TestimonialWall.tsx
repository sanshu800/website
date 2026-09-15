import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/lib/content/marketing";
import { cn } from "@/lib/utils";

/**
 * Customer proof.
 *
 * PLACEHOLDER CONTENT: the people and firms quoted here are invented, shaped to
 * Reygent's ICP. The layout is real — swap `testimonials` in
 * `src/lib/content/marketing.ts` for verified quotes and this section needs no
 * other change. The disclosure line below the grid must be removed at the same
 * time.
 */
export function TestimonialWall() {
  const featured = testimonials.find((item) => item.featured) ?? testimonials[0]!;
  const rest = testimonials.filter((item) => item !== featured).slice(0, 4);

  return (
    <section className="section bg-mist" id="customers">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Customers"
            title={
              <>
                Firms that stopped losing
                <br className="hidden sm:block" /> work between the tools.
              </>
            }
            className="max-w-[38rem]"
          />
          <Link
            href="/customers"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet"
          >
            All customer stories
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Featured quote */}
          <Reveal className="lg:col-span-5" variant="up">
            <figure className="flex h-full flex-col rounded-2xl bg-ink p-7 text-on-ink sm:p-9">
              <Quote className="h-7 w-7 text-violet-3" aria-hidden="true" />
              <blockquote className="mt-6 flex-1 font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-on-ink">
                “{featured.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-[0.8125rem] font-semibold text-on-ink">
                  {featured.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-on-ink">
                    {featured.name}
                  </span>
                  <span className="block text-micro text-on-ink-2">
                    {featured.role}, {featured.company} · {featured.sector}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Supporting quotes */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {rest.map((item, index) => (
              <Reveal key={item.name} delay={0.06 + index * 0.06}>
                <figure
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-line bg-paper p-6",
                  )}
                >
                  <blockquote className="flex-1 text-body-lg text-fg-2">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <span className="block text-[0.875rem] font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="block text-[0.75rem] text-fog">
                      {item.role}, {item.company}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-6 font-mono text-[0.6875rem] text-fog-2">
          Placeholder testimonials — invented for design purposes, not real customers.
          Replace before publishing.
        </p>
      </Container>
    </section>
  );
}
