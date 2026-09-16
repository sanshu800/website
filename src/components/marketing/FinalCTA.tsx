import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LogoMarquee } from "./LogoMarquee";
import { getHome } from "@/lib/cms/content";

/**
 * Closing conversion block. One primary action, one supporting action, a clear
 * statement of what the next step costs the reader (nothing but time).
 */
export function FinalCTA() {
  const { finalCta: copy } = getHome();

  return (
    <section className="relative overflow-hidden bg-accent py-24 text-on-accent sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="dot-field-dark pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.22),transparent_70%)]"
      />

      <Container width="wide" className="relative">
        <div className="mx-auto max-w-[46rem] text-center">
          <Reveal>
            <h2 className="text-display-xl text-white">
              {copy.titleLead}
              <br className="hidden sm:block" />{" "}
              <span className="text-white/70">{copy.titleAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[34rem] text-lead text-white/80">
              {copy.summary}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href={copy.primaryCta.href}
                variant="inverse"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                {copy.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={copy.secondaryCta.href}
                size="lg"
                className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                {copy.secondaryCta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <LogoMarquee label={copy.proofLabel} tone="on-ink" />
        </div>
      </Container>
    </section>
  );
}
