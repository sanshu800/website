import { cn } from "@/lib/utils";

/**
 * One selected-state language for every content switcher on the site.
 *
 * There are two tab sets within a scroll of each other — the services, as
 * horizontal cards, and the "see it working" examples, as a vertical list — and
 * they had grown different accents for the same job: one a grey fill with a
 * darker border, the other a border-colour change. Whichever one a person met
 * second, they had to relearn what "selected" looks like.
 *
 * So both use this, and the signal is a solid bar down the leading edge plus a
 * fill: the bar is the unmissable part (only one card can have it), the fill
 * confirms it, and the label strengthens. The bar is drawn as a border on every
 * card — transparent when inactive — so selecting one never shifts the layout by
 * a pixel.
 *
 * The bar is `accent` on light surfaces and `accent-3` on night, because the
 * brand accent is near-black: on the dark section the same bar would be
 * invisible, and `accent-3` is the token that already means "accent, for an ink
 * surface".
 */
export function tabCard({ active, tone }: { active: boolean; tone: "light" | "dark" }) {
  return cn(
    "relative rounded-xl border border-l-[3px] text-left transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    tone === "dark"
      ? active
        ? "border-white/15 border-l-accent-3 bg-white/[0.07]"
        : "border-white/10 border-l-transparent hover:border-white/25 hover:bg-white/[0.03]"
      : active
        ? "border-line-strong border-l-accent bg-accent-soft-2"
        : "border-line border-l-transparent bg-paper hover:border-line-strong hover:bg-mist",
  );
}

/** The index number inside a tab: quiet when inactive, part of the signal when live. */
export function tabIndex({ active, tone }: { active: boolean; tone: "light" | "dark" }) {
  return cn(
    "font-mono text-label",
    tone === "dark"
      ? active
        ? "text-accent-3"
        : "text-on-night-3"
      : active
        ? "text-accent"
        : "text-fog",
  );
}

/** The tab's own label — the item a person is choosing between. */
export function tabLabel({ active, tone }: { active: boolean; tone: "light" | "dark" }) {
  return cn(
    "block font-medium",
    tone === "dark"
      ? active
        ? "text-on-night"
        : "text-on-night-2"
      : active
        ? "text-ink"
        : "text-fg-2",
  );
}

/** Supporting line under the label. Not part of the selected signal. */
export function tabHint({ tone }: { tone: "light" | "dark" }) {
  return cn("mt-1 block text-small", tone === "dark" ? "text-on-night-2" : "text-fog");
}
