import { applyOverrides, collectLeaves, groupFor, labelFor, readPath, type Leaf } from "@/lib/cms/paths";
import { overrideRowsFor } from "@/lib/cms/store";
import { pricingCopy } from "@/lib/content/pages/pricing";
import { servicesDoc } from "@/lib/content/pages/services";
import { solutionsDoc } from "@/lib/content/pages/solutions";
import { compareDoc } from "@/lib/content/pages/compare";
import { blogDoc } from "@/lib/content/pages/blog";
import { legalDoc } from "@/lib/content/pages/legal";
import { homeDoc } from "@/lib/content/pages/home";
import { sharedDoc } from "@/lib/content/pages/shared";
import { chromeDoc } from "@/lib/content/pages/chrome";
import { companyDoc } from "@/lib/content/pages/company";
import { resourcesDoc } from "@/lib/content/pages/resources";
import { pagesDoc } from "@/lib/content/pages/pages";
import { seoDefaults } from "@/lib/content/seo";
import { assets } from "@/lib/content/assets";

/**
 * The content documents an editor can change, and the bridge between them and
 * the pages.
 *
 * A document is the *complete* default copy for one surface — assembled from
 * the content modules where the data already lived, plus the page copy that
 * used to be inline in the components. `getDoc` clones it, layers the stored
 * overrides on top, and hands the result to the page. A page that renders from
 * a document is editable end to end; a page that still imports a module
 * directly is not, which is why the registry grows one surface at a time.
 */

export type DocDef = {
  id: string;
  title: string;
  /** Where this copy appears, for the admin's "view live" links. */
  where: { label: string; href: string }[];
  blurb: string;
  build: () => unknown;
};

/**
 * Search and sharing metadata is a flat list rather than a nested object: one
 * row per route, addressed by its slug, so the admin can render it as a table
 * of title/description pairs and reordering the source never moves an edit.
 */
export type SeoDoc = { pages: typeof seoDefaults };

function seoDoc(): SeoDoc {
  return { pages: seoDefaults };
}

export type AssetsDoc = typeof assets;

function assetsDoc(): AssetsDoc {
  return assets;
}

export const DOCS: DocDef[] = [
  {
    id: "chrome",
    title: "Navigation and footer",
    where: [
      { label: "Every page", href: "/" },
      { label: "Footer", href: "/#footer" },
    ],
    blurb:
      "The header mega menu, the flat links, the booking button, the footer columns, the legal links and the brand strings used in page titles and social cards.",
    build: chromeDoc,
  },
  {
    id: "home",
    title: "Homepage",
    where: [{ label: "/", href: "/" }],
    blurb:
      "Hero headline and calls to action, the proof band, the problem section, the five services, the agent walkthrough, how we work, and the closing block.",
    build: homeDoc,
  },
  {
    id: "shared",
    title: "Shared content",
    where: [
      { label: "/", href: "/" },
      { label: "/customers", href: "/customers" },
      { label: "/integrations", href: "/integrations" },
      { label: "/about", href: "/about" },
    ],
    blurb:
      "Content used on more than one page: client marks, testimonials, integration surfaces and the capability counts. Placeholder disclosures are here too.",
    build: sharedDoc,
  },
  {
    id: "company",
    title: "About and careers",
    where: [
      { label: "/about", href: "/about" },
      { label: "/careers", href: "/careers" },
      { label: "Each role", href: "/careers/senior-product-engineer" },
    ],
    blurb:
      "The about page, the careers page, every open role's description and requirements, the six principles and the company timeline.",
    build: companyDoc,
  },
  {
    id: "resources",
    title: "Playbooks and build log",
    where: [
      { label: "/guides", href: "/guides" },
      { label: "/build-log", href: "/build-log" },
      { label: "/newsletter", href: "/newsletter" },
    ],
    blurb:
      "The playbook library, the build log with what each project taught us, and the newsletter page including recent issues.",
    build: resourcesDoc,
  },
  {
    id: "pages",
    title: "Standalone pages",
    where: [
      { label: "/get-started", href: "/get-started" },
      { label: "/contact", href: "/contact" },
      { label: "/customers", href: "/customers" },
      { label: "/integrations", href: "/integrations" },
      { label: "/security", href: "/security" },
      { label: "/startups", href: "/startups" },
      { label: "/partners", href: "/partners" },
      { label: "/how-we-work", href: "/how-we-work" },
    ],
    blurb:
      "Get started, contact, case studies, what we connect, security, founders programme, partners and how we work — hero copy, section headings, checklists and closing blocks.",
    build: pagesDoc,
  },
  {
    id: "pricing",
    title: "Engagements & pricing",
    where: [
      { label: "/pricing", href: "/pricing" },
      { label: "Homepage engagement preview", href: "/#pricing" },
      { label: "/get-started", href: "/get-started" },
    ],
    blurb:
      "Hero copy, all three engagements (audit, build, retainer) with their prices and inclusions, the side-by-side matrix, the FAQ and the closing block.",
    build: () => pricingCopy,
  },
  {
    id: "services",
    title: "Services",
    where: [
      { label: "/services", href: "/services" },
      { label: "Service detail pages", href: "/services/ai-agents" },
    ],
    blurb:
      "Index hero, every service's name, headline, intro, feature list, outcomes and call-to-action labels, plus the headings shared by all detail pages.",
    build: servicesDoc,
  },
  {
    id: "solutions",
    title: "Solutions",
    where: [
      { label: "/solutions", href: "/solutions" },
      { label: "Industry detail pages", href: "/solutions/professional-services" },
    ],
    blurb:
      "The industry index, plus each industry's headline, pressure points, which services fit and the copy shared across detail pages.",
    build: solutionsDoc,
  },
  {
    id: "compare",
    title: "Comparisons",
    where: [
      { label: "/compare", href: "/compare" },
      { label: "Each comparison", href: "/compare/spreadsheets" },
    ],
    blurb:
      "Six approach-by-approach comparisons: the argument, the dimension table, where we lose and where we win.",
    build: compareDoc,
  },
  {
    id: "blog",
    title: "Blog",
    where: [
      { label: "/blog", href: "/blog" },
      { label: "Each article", href: "/blog" },
    ],
    blurb:
      "Titles, dek, category, author byline, reading time and every body block of every article, plus the index copy.",
    build: blogDoc,
  },
  {
    id: "legal",
    title: "Legal pages",
    where: [{ label: "Privacy, terms, DPA, sub-processors", href: "/legal/privacy" }],
    blurb:
      "Privacy notice, service terms and the data handling notes. This is reviewed copy — treat edits here as legal changes.",
    build: legalDoc,
  },
  {
    id: "seo",
    title: "Search & sharing",
    where: [
      { label: "Every page", href: "/" },
      { label: "Search results", href: "/" },
    ],
    blurb:
      "The title and description each page shows in Google and in a shared link, plus an optional share image. Leave a field blank to fall back to the copy that ships with the page.",
    build: seoDoc,
  },
  {
    id: "assets",
    title: "Hero film and poster",
    where: [{ label: "/", href: "/" }],
    blurb:
      "The film behind the homepage headline and the still frame shown while it loads. Upload first, then paste the path from the media list.",
    build: assetsDoc,
  },
];

export type {
  PricingCopy as PricingDoc,
} from "@/lib/content/pages/pricing";
export type { ServicesDoc } from "@/lib/content/pages/services";
export type { SolutionsDoc } from "@/lib/content/pages/solutions";
export type { CompareDoc } from "@/lib/content/pages/compare";
export type { BlogDoc } from "@/lib/content/pages/blog";
export type { LegalDoc } from "@/lib/content/pages/legal";
export type { HomeDoc } from "@/lib/content/pages/home";
export type { SharedDoc } from "@/lib/content/pages/shared";
export type { ChromeDoc } from "@/lib/content/pages/chrome";
export type { CompanyDoc } from "@/lib/content/pages/company";
export type { ResourcesDoc } from "@/lib/content/pages/resources";
export type { PagesDoc } from "@/lib/content/pages/pages";


export const DOC_BY_ID = new Map(DOCS.map((doc) => [doc.id, doc]));

export function docById(id: string): DocDef | undefined {
  return DOC_BY_ID.get(id);
}

/** The shipped copy for a document, untouched by any override. */
export function getDocDefaults<T>(id: string): T {
  const def = DOC_BY_ID.get(id);
  if (!def) throw new Error(`Unknown content document: ${id}`);
  return def.build() as T;
}

/** The copy the site renders: shipped defaults with stored overrides applied. */
export function getDoc<T>(id: string): T {
  const rows = overrideRowsFor(id);
  return applyOverrides(
    getDocDefaults<unknown>(id),
    new Map(rows.map((row) => [row.path, row.value])),
  ) as T;
}

export type DocField = Leaf & {
  /** Editor-facing note pulled from the document's own `_<field>Hint` key. */
  hint?: string;
  /** Display name for the input, e.g. `Title`. */
  label: string;
  /** Where it sits on the page, e.g. `Engage · Hero`. */
  group: string;
  /** True when an editor has changed this field from the shipped copy. */
  edited: boolean;
  /** What the site shows with no override. */
  fallback: string;
  /** What the site shows right now. */
  current: string;
  updatedAt: string | null;
  updatedBy: string | null;
};

/** Every editable field in a document, with its override state. */
export function docFields(id: string): DocField[] {
  const rows = overrideRowsFor(id);
  const byPath = new Map(rows.map((row) => [row.path, row]));
  const leaves = collectLeaves(getDocDefaults<unknown>(id));

  const defaults = getDocDefaults<unknown>(id);

  return leaves.map((leaf) => {
    const override = byPath.get(leaf.key);
    /* A document can document itself: any `_<field>Hint` string sitting beside a
       field is shown to the editor as guidance. The underscore prefix already
       means "machine key" everywhere else in this CMS, so this costs no schema. */
    const segments = leaf.key.split(".");
    const hintKey = [...segments.slice(0, -1), `_${segments[segments.length - 1]}Hint`].join(".");
    const hint = readPath(defaults, hintKey);
    return {
      ...leaf,
      ...(typeof hint === "string" ? { hint } : {}),
      label: labelFor(leaf.key),
      group: groupFor(leaf.key),
      edited: override !== undefined,
      fallback: leaf.value,
      current: override?.value ?? leaf.value,
      updatedAt: override?.updated_at ?? null,
      updatedBy: override?.updated_by ?? null,
    };
  });
}

/** Fields an editor has changed, newest first — the "what is live" list. */
export function editedFields(id: string): DocField[] {
  return docFields(id)
    .filter((field) => field.edited)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

/** Overrides whose path no longer exists in the document (copy was renamed). */
export function orphanedOverrides(id: string): { key: string; path: string; value: string }[] {
  const known = new Set(collectLeaves(getDocDefaults<unknown>(id)).map((leaf) => leaf.key));
  return overrideRowsFor(id)
    .filter((row) => !known.has(row.path))
    .map((row) => ({ key: row.key, path: row.path, value: row.value }));
}
