import type { Metadata } from "next";
import { getChrome, getSeo } from "@/lib/cms/content";
import type { SeoEntry } from "@/lib/content/seo";

/**
 * Page metadata, with the admin panel in the loop.
 *
 * Every marketing page used to hardcode its own `<title>` and description in a
 * `metadata` export, which made the one thing an owner most often wants to
 * change — how the page reads in Google, in a Slack unfurl, in a WhatsApp
 * preview — the one thing the CMS could not reach. Pages now declare their
 * shipped copy and hand it here; this layers the `seo` document on top.
 *
 * Two rules it enforces centrally, because getting either wrong once is enough:
 *
 *  - **The brand suffix.** The root layout sets `title.template = "%s — Reygent
 *    AI"`, so a page whose title already names the agency renders it twice
 *    ("Reygent AI vs. doing it yourself — Reygent AI"). A title that mentions
 *    the brand is emitted as `absolute` instead.
 *  - **The social card.** `openGraph` and `twitter` are rebuilt from whatever
 *    the title and description resolved to, so an edited title can never leave
 *    a link preview advertising the old one — the classic half-renamed page.
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
  const title = override?.title?.trim() || declaredTitle;
  const description = override?.description?.trim() || declaredDescription;
  const image = override?.ogImage?.trim();

  // Everything the page set itself, minus the keys this function owns.
  const { title: _t, description: _d, alternates: _a, openGraph: _og, twitter: _tw, ...rest } = page;
  void _t;
  void _d;
  void _a;
  void _og;
  void _tw;

  return {
    ...rest,
    ...(title
      ? { title: title.includes(brand.name) ? { absolute: title } : title }
      : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    ...(title || description
      ? {
          openGraph: {
            type: "website",
            url: path,
            siteName: brand.name,
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(image ? { images: [{ url: image, alt: brand.name }] } : {}),
          },
          twitter: {
            card: "summary_large_image",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(image ? { images: [image] } : {}),
          },
        }
      : {}),
  };
}
