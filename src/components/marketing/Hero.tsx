import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { IntakeScreen } from "@/components/screens/ProductScreens";
import { LogoMarquee } from "./LogoMarquee";

/**
 * Home hero: the four questions answered above the fold — what it is, who it
 * is for, what it replaces, and what to do next — with the real interface
 * visible immediately rather than behind a scroll.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40">
      {/* Ambient field: soft violet wash + hairline grid, both static. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(91,52,242,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
      />

      <Container width="wide" className="relative">
        <div className="mx-auto max-w-[52rem] text-center">
          <Reveal variant="fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-line bg-violet-soft px-3.5 py-1.5 text-[0.8125rem] font-medium text-violet-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI-native operations for professional-service firms
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-7 text-display-2xl text-ink">
              One platform for your
              <br className="hidden sm:block" /> entire client operation.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-[38rem] text-lead text-fog">
              Reygent runs intake, client onboarding, follow-through and reporting
              on one shared memory layer — so work stops falling into the gaps
              between the tools your firm already uses.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/get-started" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start free trial
              </ButtonLink>
              <ButtonLink href="/demo" variant="secondary" size="lg">
                Book a demo
              </ButtonLink>
            </div>
            <p className="mt-4 text-micro text-fog-2">
              14 days free · No card required · Runs alongside your current tools
            </p>
          </Reveal>
        </div>

        {/* Product surface */}
        <Reveal delay={0.24} variant="scale" duration={0.9} amount={0.05}>
          <div className="relative mx-auto mt-14 max-w-[68rem] sm:mt-16">
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -bottom-8 top-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_100%,rgba(91,52,242,0.16),transparent_70%)] blur-2xl"
            />
            <div className="app-frame relative">
              <div className="h-[340px] sm:h-[420px] lg:h-[480px]">
                <IntakeScreen />
              </div>
            </div>

            {/* Floating annotations — real interface facts, not decoration. */}
            <div className="absolute -left-3 top-1/4 hidden w-[186px] rounded-xl border border-line bg-paper p-3.5 shadow-lg lg:block">
              <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                First reply
              </p>
              <p className="mt-1 font-display text-[1.5rem] leading-none text-ink">38m</p>
              <p className="mt-1 text-[0.6875rem] text-fog">median, last 30 days</p>
            </div>

            <div className="absolute -right-3 top-[38%] hidden w-[196px] rounded-xl border border-line bg-paper p-3.5 shadow-lg lg:block">
              <p className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-wide text-violet">
                <Sparkles className="h-3 w-3" /> Ask Reygent
              </p>
              <p className="mt-1.5 text-[0.75rem] leading-snug text-fg-2">
                “Which engagements are at risk this quarter?”
              </p>
              <p className="mt-1.5 text-[0.6875rem] text-fog">
                3 named, with reasons and sources
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 sm:mt-24">
          <LogoMarquee />
        </div>
      </Container>
    </section>
  );
}
