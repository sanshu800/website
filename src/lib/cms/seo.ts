import type { Metadata } from "next";
import { getChrome, getSeo } from "@/lib/cms/content";
import { site } from "@/lib/content/marketing";
import type { SeoEntry } from "@/lib/content/seo";

/** `og:locale` uses underscores, not hyphens. */
function siteLocale(): string {
  return site.locale;
}

/*
 * How long a title or description may be before a search engine cuts it off.
 *
 * These are the practical limits, not round numbers picked for symmetry: Google
 * truncates a title somewhere around 580px — roughly 60 characters of the
 * lowercase prose this site uses — and a description around 160. Past that the
 * sentence does not get shorter, it gets replaced by an ellipsis, and the part
 * that survives is chosen by the search engine rather than by us.
 */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** Boundaries a sentence can be cut on without reading as broken. */
const SENTENCE_END = /(?<=[.!?])\s+/g;
const CLAUSE_END = [" — ", " · ", ": ", "; ", ", ", " – "];

/**
 * Longest prefix of `text` that fits `max`, preferring to end on a boundary a
 * reader would accept rather than mid-word.
 *
 * Three attempts, in order of how good the result reads:
 *
 *  1. **A sentence.** "Reygent AI takes the routine work off owner-run
 *     businesses: enquiries answered, paperwork handled." cuts cleanly.
 *  2. **A clause** — after a comma, colon, semicolon or the em dash this copy
 *     uses for asides. This is what saves a page titled `Service — How it
 *     works, in detail`: dropping the aside leaves the service name, which is
 *     the actual title, instead of a chopped sentence carrying half an aside.
 *  3. **A word.** The fallback, marked with an ellipsis so a reader can see the
 *     text continues rather than wondering why it stops.
 *
 * Returns the text unchanged when it already fits, so the common case does not
 * go through any of this.
 */
export function fitForSearch(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const tidy = (s: string) => s.replace(/[\s—–\-·:;,]+$/, "").trim();

  // 1. sentence boundaries
  const sentences: string[] = [];
  for (const match of clean.matchAll(SENTENCE_END)) {
    sentences.push(clean.slice(0, match.index + match[0].length - 1));
  }
  const bestSentence = sentences.filter((s) => s.length <= max).pop();
  if (bestSentence && bestSentence.length >= max * 0.5) return tidy(bestSentence);

  // 2. clause boundaries
  let bestClause = "";
  for (const separator of CLAUSE_END) {
    let index = clean.indexOf(separator);
    while (index !== -1) {
      const candidate = clean.slice(0, index);
      if (candidate.length <= max && candidate.length > bestClause.length) {
        bestClause = candidate;
      }
      index = clean.indexOf(separator, index + 1);
    }
  }
  if (bestClause.length >= max * 0.4) return tidy(bestClause);

  // 3. word boundary
  const words = clean.slice(0, max - 1).split(" ");
  words.pop();
  return `${tidy(words.join(" "))}…`;
}

/**
 * Page metadata, with the admin panel in the loop.
 *
 * Every marketing page used to hardcode its own `<title>` and description in a
 * `metadata` export, which made the one thing an owner most often wants to
 * change — how the page reads in Google, in a Slack unfurl, in a WhatsApp
 * preview — the one thing the CMS could not reach. Pages now declare their
 * shipped copy and hand it here; this layers the `seo` document on top.
 *
 * Four rules it enforces centrally, because getting any of them wrong once is
 * enough:
 *
 *  - **The brand suffix, only when it fits.** The root layout sets `title.template
 *    = "%s — Reygent AI"`, so a page whose title already names the agency renders
 *    it twice ("Reygent AI vs. doing it yourself — Reygent AI"). A title that
 *    mentions the brand is emitted as `absolute`; so is one that needs the whole
 *    line for itself. The suffix is what gives way, never the headline.
 *  - **Length.** Copy is written for a person, and a page is free to have a long
 *    headline — the assessment above the fold answers differently from a result
 *    listing. Titles are therefore measured at the point they are emitted rather
 *    than trimmed in the CMS: 18 of 51 pages shipped truncated titles before this,
 *    which is a layout truth about search results, not an editorial opinion.
 *  - **An override is an instruction.** Copy typed into the admin is emitted
 *    exactly as typed, however long, because somebody chose those words on
 *    purpose and silently shortening them is the behaviour that makes an owner
 *    stop trusting the panel. Fitting applies to derived copy — where the length
 *    came from a template rather than from a decision.
 *  - **The social card, always, and rebuilt from what the title resolved to.** A
 *    link preview has no tab strip around it, so the brand belongs in the title
 *    itself. Until this default existed, exactly one page carried an `og:image`
 *    (whichever route owned the generated file) and the other fifty shared a bare
 *    link — on a site whose traffic arrives as pasted links.
 *
 * A page's other metadata keys (`robots`, extra icons, `keywords`) are carried
 * through untouched.
 */

export function withSeo(path: string, page: Metadata): Metadata {
  const brand = getChrome().brand;
  const slug = path.replace(/^\/+|\/+$/g, "");
  const override = getSeo().pages.find((entry: SeoEntry) => entry.slug === slug);

  const declaredTitle = typeof page.title === "string" ? page.title : undefined;
  const declaredDescription = typeof page.description === "string" ? page.description : undefined;

  /*
   * A blank override means "use the copy that ships with the page" rather than
   * "render nothing": clearing a field in the admin restores the default, which
   * is far friendlier than a page whose title is an empty string.
   */
  const overriddenTitle = override?.title?.trim();
  const overriddenDescription = override?.description?.trim();
  const image = override?.ogImage?.trim();

  // What the layout will append for a title that does not name the brand.
  const brandSuffix = ` — ${brand.name}`;

  /*
   * Three bands, because the suffix is optional and the headline is not.
   *
   *  1. Short enough to share the line with the brand — the layout appends it.
   *  2. Fits on its own, but not with the brand — emitted `absolute` without the
   *     suffix. "Twelve questions to ask before you hire an automation company"
   *     is 57 characters and perfectly good; mangling it to "…before you hire
   *     an…" so that "— Reygent AI" can fit would be trading a real headline for
   *     a brand name the domain already shows.
   *  3. Too long either way — fitted to the limit, on a clause `fitForSearch`
   *     can find, and emitted without the suffix.
   */
  const title = overriddenTitle
    ? overriddenTitle
    : declaredTitle === undefined
      ? undefined
      : fitForSearch(declaredTitle, TITLE_MAX);

  const titleFitsWithBrand = title
    ? title.length + brandSuffix.length <= TITLE_MAX
    : false;

  const description =
    overriddenDescription ??
    (declaredDescription === undefined ? undefined : fitForSearch(declaredDescription, DESCRIPTION_MAX));

  // Everything the page set itself, minus the keys this function owns.
  const { title: _t, description: _d, alternates: _a, openGraph: _og, twitter: _tw, ...rest } = page;
  void _t;
  void _d;
  void _a;
  void _og;
  void _tw;

  /* A link preview has no tab strip around it, so the brand belongs in the title
     itself; in the browser it comes from the layout's template instead. */
  const socialTitle = title
    ? fitForSearch(title.includes(brand.name) ? title : `${title}${brandSuffix}`, 70)
    : undefined;

  const shareImage = image || "/og";

  return {
    ...rest,
    ...(title
      ? {
          title:
            title.includes(brand.name) || !titleFitsWithBrand ? { absolute: title } : title,
        }
      : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: path,
      /*
       * One English URL serving every market, declared rather than implied.
       * `x-default` is the honest value for a site with no regional variants —
       * pointing en-GB and en-US at the same page would be inventing a
       * distinction that does not exist.
       */
      languages: { en: path, "x-default": path },
    },
    ...(socialTitle || description
      ? {
          openGraph: {
            type: "website",
            url: path,
            siteName: brand.name,
            locale: siteLocale(),
            ...(socialTitle ? { title: socialTitle } : {}),
            ...(description ? { description } : {}),
            images: [{ url: shareImage, width: 1200, height: 630, alt: brand.name }],
          },
          twitter: {
            card: "summary_large_image",
            ...(socialTitle ? { title: socialTitle } : {}),
            ...(description ? { description } : {}),
            images: [shareImage],
          },
        }
      : {}),
  };
}
