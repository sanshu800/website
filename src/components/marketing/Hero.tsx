import { existsSync } from "node:fs";
import path from "node:path";
import { ArrowRight, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroFilm } from "./HeroFilm";
import { heroVideo } from "@/lib/content/marketing";
import { getAssets, getHome } from "@/lib/cms/content";
import { withText } from "@/lib/cms/paths";

/**
 * Home hero — full-bleed motion, one message, two ways forward.
 *
 * The film runs edge to edge behind everything (no z-index, per the reference
 * treatment), with two scrims layered over it: one vertical for the headline
 * block, one horizontal so the left column stays legible whichever part of the
 * frame is behind it. If the video never loads — slow network, blocked host,
 * reduced data — the poster is already a finished composition, so the hero is
 * never a black rectangle. On a metered connection the film steps aside too —
 * `HeroFilm` handles that, and `prefers-reduced-data` handles it in CSS.
 */
/**
 * Resolution order for the film. The CMS wins outright when it has been given a
 * path; otherwise a file dropped into `public/video/` wins, so the hero can be
 * self-hosted by copying one file in — see the note in `lib/content/marketing.ts`.
 * The CDN reference is the last resort, which is what ships today.
 */
function resolveHeroVideo(override?: string): { src: string; type: string } {
  const chosen = override?.trim();
  if (chosen) {
    const extension = chosen.split(".").pop()?.toLowerCase();
    const type =
      extension === "webm" ? "video/webm" : extension === "mov" ? "video/quicktime" : "video/mp4";
    return { src: chosen, type };
  }
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
  const media = getAssets();
  const video = resolveHeroVideo(media.heroFilm);
  const { hero } = getHome();

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-night">
      {/* 1. Film — see HeroFilm for the data-saver behaviour. */}
      <HeroFilm
        src={video.src}
        type={video.type}
        poster={media.heroPoster.trim() || "/images/hero-poster.jpg"}
        className="hero-film absolute inset-0 h-full w-full object-cover object-[70%_center] motion-reduce:hidden"
      />

      {/* Poster stays put underneath, and carries the hero when motion is off. */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url('${media.heroPoster.trim() || "/images/hero-poster.jpg"}')` }}
        className="absolute inset-0 hidden bg-cover bg-[70%_center] motion-reduce:block"
      />

      {/* 2. Scrims — legibility, not decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/40 to-transparent lg:from-night/80"
      />

      {/* 3. Content */}
      <div className="relative flex h-full flex-col justify-between pb-10 pt-24 sm:pb-12 sm:pt-28 md:pb-14 lg:px-0">
        {/* Top: badge + headline */}
        <Container width="wide">
          <div className="max-w-[46rem]">
            <p className="animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-label text-on-night sm:text-small">
              <span className="inline-flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-on-ink/70"
                />
                {hero.badge}
              </span>
            </p>

            <h1 className="mt-5 animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-display-2xl font-medium text-on-night sm:mt-6">
              {withText(hero.titleLines).map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </Container>

        {/* Bottom: the promise, and the two ways forward */}
        <Container width="wide">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[26rem] sm:max-w-[32rem]">
              <p className="mb-5 animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-small leading-relaxed text-on-night-2 sm:mb-6 sm:text-body md:text-display-s">
                {hero.summary}
              </p>

              <div className="animate-[fadeSlideUp_0.8s_ease_0.9s_both]">
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink
                    href={hero.primaryCta.href}
                    variant="inverse"
                    className="hover:scale-[1.03] active:scale-95"
                    iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    {hero.primaryCta.label}
                  </ButtonLink>
                  <ButtonLink
                    href={hero.secondaryCta.href}
                    variant="onNight"
                    icon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    {hero.secondaryCta.label}
                  </ButtonLink>
                </div>

                <p className="mt-4 text-label text-on-night-3 sm:text-small">
                  {hero.footnote}
                </p>
              </div>
            </div>

            {/* Live proof, so the bottom right of the frame is not empty */}
            <dl className="hidden gap-10 lg:flex">
              {withText(hero.stats).map((fact) => (
                <div
                  key={fact.label}
                  className="animate-[fadeSlideUp_0.8s_ease_1.05s_both]"
                >
                  <dd className="tabular font-display text-display-m leading-none tracking-[-0.03em] text-on-night">
                    {fact.value}
                  </dd>
                  <dt className="mt-2 font-mono text-label uppercase tracking-[0.14em] text-on-night-3">
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
