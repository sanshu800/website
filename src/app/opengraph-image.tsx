/**
 * The homepage's share card, via the file convention.
 *
 * The artwork lives in `@/lib/og/card` so that this route and `/og` cannot
 * drift: `/og` is what every other page references, and two renderers for one
 * image is two images the day somebody edits one of them.
 */
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, shareCard } from "@/lib/og/card";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return shareCard();
}
