/**
 * Media the CMS can point at.
 *
 * The one thing the admin panel could not touch was the artwork: the hero film
 * was resolved by probing `public/video/` and falling back to a hardcoded CDN
 * URL, and the poster was a literal path in `Hero.tsx`. "Swap the hero film" is
 * one of the two most-requested edits in any CMS, so both are fields now.
 *
 * Blank means "keep doing what the code does" rather than "render nothing":
 * an empty `heroFilm` uses the built-in resolution order, an empty `heroPoster`
 * uses the shipped fallback frame. Paths are relative to the site root
 * (`/video/hero.mp4`) or absolute URLs for a host that is not this one —
 * `/admin/media` lists what has actually been uploaded and its path.
 */

export const assets = {
  heroFilm: "",
  /** Editor-facing note; the leading underscore keeps it out of the field list. */
  _heroFilmHint:
    "Shown behind the homepage headline. Leave blank to use the built-in film.",
  heroPoster:
    "/images/hero-poster.jpg",
  _heroPosterHint:
    "The still frame shown while the film loads, and instead of it when a visitor has asked for less data.",
};

export type Assets = typeof assets;
