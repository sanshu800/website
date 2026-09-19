import { OG_CONTENT_TYPE, shareCard } from "@/lib/og/card";

/**
 * The share card, at a URL a page can predict.
 *
 * `app/opengraph-image.tsx` generates the same image, but Next serves it from a
 * content-hashed path (`/opengraph-image?68a5cf4c…`) that a page cannot know in
 * advance — which is exactly why only the homepage ever carried an `og:image`.
 * This route gives every page one stable address to reference.
 *
 * Deliberately takes no parameters. A card that rendered any `?title=` it was
 * handed would be an unbounded set of images behind one public, unauthenticated
 * URL — a rendering cost any crawler could choose to spend. The image is a
 * constant, so only one is ever produced and every later request is a cache hit.
 */
export const revalidate = false;

export function GET() {
  return shareCard();
}

export const contentType = OG_CONTENT_TYPE;
