import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { heroVideo } from "@/lib/content/marketing";

/**
 * Home hero — full-bleed motion, one message, two ways forward.
 *
 * The film runs edge to edge behind everything (no z-index, per the reference
 * treatment), with two scrims layered over it: one vertical for the headline
 * block, one horizontal so the left column stays legible whichever part of the
 * frame is behind it. If the video never loads — slow network, blocked host,
 * reduced data — the poster is already a finished composition, so the hero is
 * never a black rectangle.
 */
/**
 * Resolution order for the film: a file dropped into the project wins, so the
 * hero can be self-hosted by copying one file into `public/video/` — see the
 * note in `lib/content/marketing.ts`. Otherwise the CDN reference is used.
 */
function resolveHeroVideo(): { src: string; type: string } {
  const candidates = [
    { name: "hero.mp4", type: "video/mp4" },
    { name: "hero.webm", type: "video/webm" },
    { name: "hero.mov", type: "video/quicktime" },
  ];
  for (const candidate of candidates) {
    if (existsSync(path.join(process.cwd(), "public", "video", candidate.name))) {
      return { src: `/video/${candidate.name}`, type: candidate.type };
    }
  }
  return { src: heroVideo.src, type: "video/mp4" };
}

export function Hero() {
  const video = resolveHeroVideo();

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink">
      {/* 1. Film */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] motion-reduce:hidden"
      >
        <source src={video.src} type={video.type} />
      </video>

      {/* Poster stays put underneath, and carries the hero when motion is off. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[url('/images/hero-poster.jpg')] bg-cover bg-[70%_center] motion-reduce:block"
      />

      {/* 2. Scrims — legibility, not decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent lg:from-ink/80"
      />

      {/* 3. Content */}
      <div className="relative flex h-full flex-col justify-between pb-10 pt-24 sm:pb-12 sm:pt-28 md:pb-14 lg:px-0">
        {/* Top: badge + headline */}
        <Container width="wide">
          <div className="max-w-[46rem]">
            <p className="animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-[0.75rem] text-on-ink/90 sm:text-[0.875rem]">
              <span className="inline-flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-on-ink/70"
                />
                AI-native operations for professional-service firms
              </span>
            </p>

            <h1 className="mt-5 animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-[2rem] font-medium leading-[1.08] tracking-[-0.035em] text-on-ink sm:mt-6 sm:text-[3rem] md:text-[3.75rem] lg:text-[4.25rem]">
              Your whole client
              <br />
              operation, on one
              <br />
              shared record.
            </h1>
          </div>
        </Container>

        {/* Bottom: the promise, and the two ways forward */}
        <Container width="wide">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[26rem] sm:max-w-[32rem]">
              <p className="mb-5 animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-[0.875rem] leading-relaxed text-on-ink/60 sm:mb-6 sm:text-[1rem] md:text-[1.125rem]">
                Intake, onboarding, follow-through and reporting in one place — so work
                stops falling into the gaps between the tools your firm already uses.
              </p>

              <div className="animate-[fadeSlideUp_0.8s_ease_0.9s_both]">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/get-started"
                    className="inline-flex items-center gap-2 rounded-lg bg-on-ink px-5 py-2.5 text-[0.875rem] font-medium text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:px-6 sm:py-3"
                  >
                    Start free trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/product-tour"
                    className="inline-flex items-center gap-2 rounded-lg border border-on-ink/25 px-5 py-2.5 text-[0.875rem] font-medium text-on-ink backdrop-blur-sm transition-colors duration-300 hover:border-on-ink/50 hover:bg-on-ink/10 sm:px-6 sm:py-3"
                  >
                    <Play className="h-3.5 w-3.5" />
                    See the product tour
                  </Link>
                </div>

                <p className="mt-4 text-[0.75rem] text-on-ink/45 sm:text-[0.8125rem]">
                  14 days free · No card required · Runs alongside your current tools
                </p>
              </div>
            </div>

            {/* Live proof, so the bottom right of the frame is not empty */}
            <dl className="hidden gap-10 lg:flex">
              {[
                { value: "38m", label: "Median first reply" },
                { value: "99.95%", label: "Platform availability" },
                { value: "30 days", label: "Typical time to value" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="animate-[fadeSlideUp_0.8s_ease_1.05s_both]"
                >
                  <dd className="font-display text-[1.5rem] leading-none tracking-[-0.03em] text-on-ink">
                    {fact.value}
                  </dd>
                  <dt className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-ink/45">
                    {fact.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>

      {/* 4. Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="block h-14 w-px bg-gradient-to-b from-transparent to-on-ink/35" />
      </div>
    </section>
  );
}
