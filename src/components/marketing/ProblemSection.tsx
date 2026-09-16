import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getHome } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

/**
 * The problem.
 *
 * Three concrete operational failures rather than an abstract argument, each
 * paired with a drawn image under a saturated colour field — the same treatment
 * our product pages use for product surfaces, applied here to the problem to
 * keep one visual language across the site.
 *
 * The images are abstract by design. The house language is the hero film: thin
 * luminous threads in smoke on near-black. Stock office photography — a desk of
 * paper, a person on a headset — says "small business software, 2014", and it
 * dates a page that is otherwise about current work. A drawing only ever needs
 * to carry luminance: the field supplies the colour and `mix-blend-luminosity`
 * turns the drawing into light. The sources are in `scripts/artwork/`, so any of
 * these can be adjusted by changing a number and re-running it.
 */

/* The three problems are content: they live in the `home` document so the copy,
   the stats and the image alt text are editable. */

export function ProblemSection() {
  const { problem: copy } = getHome();

  return (
    <section className="relative bg-night py-24 text-on-night sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <Container width="wide" className="relative">
        <SectionHeading
          tone="ink"
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
          className="max-w-[54rem]"
        />

        <div className="mt-16 space-y-6 sm:mt-20 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {copy.items.map((problem, index) => (
            <Reveal
              key={problem.title}
              delay={index * 0.08 }
              className="group h-full"
              variant="up"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-night-2">
                <div className={cn("relative aspect-[16/11] overflow-hidden", problem.field)}>
                  <Image
                    src={problem.image}
                    alt={problem.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-90 mix-blend-luminosity transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-display-s text-on-night">{problem.title}</h3>
                  <p className="mt-3 text-small text-on-night-2">{problem.body}</p>

                  <div className="mt-6 flex items-baseline gap-3 border-t border-white/10 pt-5">
                    <span className="tabular font-display text-display-m leading-none text-on-night">
                      {problem.stat.value}
                    </span>
                    <span className="text-label leading-snug text-on-night-2">
                      {problem.stat.label}
                    </span>
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-white/5 p-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-3"
                    />
                    <p className="text-micro leading-snug text-on-night">
                      {problem.fix}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 max-w-[46rem] border-t border-white/10 pt-8 text-body-lg text-on-night-2">
          {copy.closing}
        </p>
      </Container>
    </section>
  );
}
