/**
 * Content addressing.
 *
 * Every editable string on the site lives somewhere inside a content document
 * (see `documents.ts`). A document is a plain JSON tree, and every string leaf
 * in it has a stable dotted path — `hero.title`, `items.engage.kicker`,
 * `plans.2.features.0`. Those paths are the identity of an editable field:
 * the override store is keyed on `<doc>#<path>`, and merging a document with
 * its overrides is a single walk that recomputes the same paths.
 *
 * Two rules make the paths stable rather than positional:
 *
 *   - array items that carry a `slug` are addressed by it (`items.engage`), so
 *     reordering the source array does not move anyone's edits;
 *   - everything else falls back to its index.
 */

/** Keys that are machine, not copy: editing them would break routing or assets. */
const READONLY_KEYS = new Set([
  "slug",
  "id",
  "src",
  "poster",
  "screen",
  "icon",
  "accent",
  "tone",
  "category",
  "kind",
  "image",
  "field",
  "panel",
]);

/** Long-form gets a textarea in the admin; short-form gets an input. */
export function fieldKind(path: string, value: string): "text" | "prose" | "link" {
  const leaf = path.split(".").pop() ?? path;
  if (leaf === "href" || leaf === "url") return "link";
  if (value.includes("\n") || value.length > 110) return "prose";
  return "text";
}

export function isEditableKey(key: string): boolean {
  const leaf = key.split(".").pop() ?? key;
  return !READONLY_KEYS.has(leaf) && !leaf.startsWith("_");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The path segment used to address an array item. */
function segmentFor(item: unknown, index: number): string {
  if (isPlainObject(item) && typeof item.slug === "string" && item.slug) return item.slug;
  return String(index);
}

/** Resolves a dotted path against a document. Returns undefined when absent. */
export function readPath(doc: unknown, path: string): unknown {
  let current: unknown = doc;
  for (const segment of path.split(".")) {
    if (Array.isArray(current)) {
      const bySlug = current.find(
        (item) => isPlainObject(item) && typeof item.slug === "string" && item.slug === segment,
      );
      current = bySlug ?? current[Number(segment)];
    } else if (isPlainObject(current)) {
      current = current[segment];
    } else {
      return undefined;
    }
    if (current === undefined) return undefined;
  }
  return current;
}

export type Leaf = { key: string; value: string; kind: "text" | "prose" | "link" };

/**
 * Every editable string in a document, in document order.
 * Non-string leaves (numbers, booleans, media paths) are skipped deliberately —
 * this CMS edits copy, not structure.
 */
export function collectLeaves(doc: unknown, prefix = ""): Leaf[] {
  const out: Leaf[] = [];
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") {
      if (!path || !isEditableKey(path)) return;
      out.push({ key: path, value: node, kind: fieldKind(path, node) });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, path ? `${path}.${segmentFor(item, index)}` : segmentFor(item, index)));
      return;
    }
    if (isPlainObject(node)) {
      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith("_")) continue;
        walk(value, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(doc, prefix);
  return out;
}

/**
 * Applies overrides onto a copy of the document. One walk computes the path of
 * every leaf, so a stored key is matched exactly the way `collectLeaves` wrote
 * it. Unknown keys are ignored here and reported as orphans by the admin.
 */
export function applyOverrides<T>(doc: T, overrides: Map<string, string>): T {
  const clone = structuredClone(doc);
  if (overrides.size === 0) return clone;

  const walk = (node: unknown, path: string): unknown => {
    if (typeof node === "string") {
      const replacement = path ? overrides.get(path) : undefined;
      return replacement === undefined ? node : replacement;
    }
    if (Array.isArray(node)) {
      return node.map((item, index) =>
        walk(item, path ? `${path}.${segmentFor(item, index)}` : segmentFor(item, index)),
      );
    }
    if (isPlainObject(node)) {
      const next: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(node)) {
        next[key] = key.startsWith("_") ? value : walk(value, path ? `${path}.${key}` : key);
      }
      return next;
    }
    return node;
  };

  return walk(clone, "") as T;
}

/** `heroTitle` / `hero-title` / `hero.title` → `Hero title` for admin labels. */
export function humanise(segment: string): string {
  const spaced = segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Where a field sits in the page, e.g. `items.engage.hero.title` → `Engage · Hero`. */
export function groupFor(path: string): string {
  const segments = path.split(".");
  const leaf = segments.pop() ?? "";
  void leaf;
  const withoutLeaf = segments.filter((segment) => segment !== "items");
  if (withoutLeaf.length === 0) return "Page copy";
  return withoutLeaf.map(humanise).join(" · ");
}

export function labelFor(path: string): string {
  const leaf = path.split(".").pop() ?? path;
  return humanise(leaf);
}
