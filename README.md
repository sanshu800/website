# Reygent — operations platform for professional-services firms

A production-shaped marketing site **and** a working application: the public pages a
prospective firm reads, plus the authenticated workspace where their client records
actually live.

Built as a reference implementation of a premium SaaS product site — marketing
surface, real form capture, real authentication, real database, real mutations.

---

## What is actually functional

| Area | Status |
| --- | --- |
| 30+ marketing routes (products, solutions, comparisons, blog, legal, pricing, tour) | Static-rendered, all live |
| Inbound forms (contact, demo, trial request, newsletter, job application) | POST → validated with Zod → written to SQLite |
| Authentication | Sign-up, sign-in, sign-out, session guard on `/dashboard/**` |
| Dashboard workspace | Overview, companies (+ detail), contacts, engagements, tasks, submissions, Ask Reygent |
| Mutations | Task create / complete / reopen via server actions **and** JSON API, with an append-only activity trail |
| Search, filtering, pagination, sort | URL-driven on companies and contacts; saved views |
| "Ask Reygent" | Deterministic query engine over the firm's records — every answer cites its rows |
| Charts, tabs, marquees, reveals | Server-rendered markup + CSS/motion animation, reduced-motion aware |
| Website content admin | Edit copy on pricing, products, solutions, comparisons, blog and legal pages from `/dashboard/content` — validated writes, audit log, one-click restore, no deploy |
| Sitemap, robots, 404 | Present |
| Payments | **Not wired** — see "Needs real credentials" |
| Email delivery | **Not wired** — submissions are stored, not sent |

---

## Running it

```bash
npm install
npm run db:reset     # creates + seeds data/reygent.db, then prints a summary
npm run build
npm start            # http://localhost:3000
```

Development: `npm run dev`. Checks: `npm run typecheck && npm run lint`.

### Demo accounts

| Email | Password | Role |
| --- | --- | --- |
| `demo@reygent.ai` | `demo1234` | owner |
| `ops@reygent.ai` | `demo1234` | admin |

Sign-up also works and creates a real account with a scrypt-hashed password.

**If sign-in appears to do nothing**, the browser dropped the session cookie. The
session cookie is set `SameSite=None; Secure; Partitioned` precisely so that it
survives being viewed inside an embedded preview frame, where the app's own
origin counts as cross-site — a `Lax` cookie is withheld there and the dashboard
guard sends you straight back to the login form. The form now checks the session
immediately after signing in and tells you if the browser refused it; opening the
preview in its own tab always works.

---

## Design system

- **Black is the brand.** The wordmark is plain type, the mark is a black square
  with three white rules (favicon and app chrome only), and every interactive
  element is black or grey. Colour is *reserved for data* — status pills, health
  flags, charts — so it always means something rather than decorating.
- **Geist / Space Grotesk / Geist Mono**, self-hosted. Body and hero copy are
  Geist; section headlines are Space Grotesk; labels are Geist Mono.
- **Radii:** 8px on buttons and inputs, 12–28px on cards and surfaces, full on
  filters, chips, avatars and dots. Squared controls, soft surfaces.
- **Motion:** a staggered `fadeSlideUp` on the hero, a marquee strip, reveal-on-
  scroll sections and a scroll-progress rail. All of it collapses under
  `prefers-reduced-motion`, where the hero falls back to a still frame.

### The hero film

The homepage opens with a full-bleed looping video behind the headline, with a
gradient scrim for legibility and a poster frame committed at
`public/images/hero-poster.jpg` so the hero is never a black rectangle while the
video loads. The clip is referenced from its CDN because it is several megabytes:
for production, download it to `public/video/hero.mp4` and point `heroVideo.src`
in `src/lib/content/marketing.ts` at that local path.

## Stack decisions (made, not asked)

- **Next.js 16 App Router + React 19 + TypeScript (strict)** — one framework for the
  marketing site, the app surface and the API. Server Components keep the marketing
  pages static; the dashboard streams from SQLite per request.
- **Tailwind v4, CSS-first tokens** — the whole design system is in
  `src/app/globals.css` under `@theme static`. No `tailwind.config.js` to drift.
- **`node:sqlite` (Node 22+ built-in)** — real, durable SQL with no native build step
  and no service to run. Every query goes through `src/lib/db.ts`, so moving to
  Postgres is a single-file change.
- **Hand-rolled auth in `src/lib/auth.ts`** — scrypt password hashing, opaque session
  tokens stored as SHA-256 hashes, `httpOnly` cookies. No identity vendor, no
  third-party script on the login page.
- **Zod** for one validation vocabulary shared by API routes and server actions.
- **`motion`** for animation, **`lucide-react`** for icons, **self-hosted fonts**
  (Geist, Space Grotesk, Geist Mono) — no external font or icon CDN at runtime.

### Layout of the code

```
src/app/            routes (marketing, dashboard, api)
src/components/     ui · brand · layout · marketing · screens · motion · forms · dashboard
src/lib/            db · auth · queries (read model) · mutations (write model) · ask · content
src/lib/content/    all copy and sample data, typed
scripts/seed.ts     idempotent seed (--reset to rebuild)
data/reygent.db     local database (gitignored; recreate with npm run db:reset)
archive/            the previous rejected design, kept for reference, excluded from build
```

Writes live in `src/lib/mutations.ts` and reads in `src/lib/queries.ts`, so server
actions, API routes and pages share one definition of what the data means.

---

## API

Session-authenticated unless noted. All JSON.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/submissions` | Generic inbound capture (`kind` + payload) |
| `POST` | `/api/contact` · `/api/demo` · `/api/newsletter` · `/api/careers` | Form-specific endpoints |
| `GET` | `/api/submissions` | List inbound submissions (operator) |
| `POST` | `/api/auth/signup` · `/api/auth/login` · `/api/auth/logout` | Session lifecycle (public) |
| `GET` `POST` `PATCH` | `/api/tasks` | List, create, toggle/delete tasks |
| `GET` `POST` | `/api/ask` | Suggested questions; ask a question over the records |
| `POST` | `/api/content` | Write site copy (`set`, `reset`, `revert`, `drop`). Owner/admin only |

---

## Editing the site (content admin)

`/dashboard/content` is a real CMS, not a mock screen. Whoever writes the copy can
change it without a deploy, and every change is attributed and reversible.

**How to reach it:** sign in (`demo@reygent.ai` / `demo1234`) → **Website content**
in the sidebar. Three screens:

| Screen | What it does |
| --- | --- |
| `/dashboard/content` | Every editable surface, how many fields each has, what has been changed, and the latest edits |
| `/dashboard/content/<surface>` | The editor: search across every field, filter to edited ones, edit / save / reset per field |
| `/dashboard/content/history` | The full audit log — before and after values, who changed what, restore any version |

**How it works.** Each surface is a *content document*: one JSON tree holding the
complete default copy for that part of the site, assembled from the content modules
(plans, products, posts, legal pages) plus the page copy that used to sit inline in the
components. Every string leaf in it has a stable dotted path — `hero.title`,
`items.engage.kicker`, `plans.core.includes.2`. Saving a field writes one row to
`content_overrides` keyed `<doc>#<path>` and appends a row to `content_revisions`.

At render time the page asks for the merged document (`getPricing()`, `getProducts()`,
…): the tree is deep-cloned and overridden values are layered on top. Typing the
shipped value back in clears the override rather than freezing a copy of it, which is
what the **Reset** button does too — so code stays the source of truth for anything
nobody has deliberately changed.

Array items that carry a `slug` are addressed by it (`items.engage`, `posts.<slug>`)
rather than by index, so reordering the source array does not move anyone's edits.

**Publishing.** Saves call `revalidatePath("/", "layout")`. The marketing pages are
prerendered, so without that a change would sit invisible until the next build; with
it, the next request regenerates the page. Verified: editing a price, a plan name or a
product name changes the served HTML of `/pricing`, `/products`, `/products/engage`
and the homepage preview, and **Reset** restores the shipped copy.

**Guarantees the admin gives you**

- **Roles.** `owner` and `admin` can publish; any other role sees the editor with
  writes disabled, and the API answers `403`.
- **Validated writes.** The endpoint checks the path against the document's own field
  list, so a request cannot invent a key or edit something that is not copy. Slugs,
  asset paths and icon names are not editable by construction.
- **Limits.** Short fields 240 characters, prose 4,000, links 300 — and a link must
  look like a link (`/`, `https://`, `mailto:`, `tel:`).
- **No markup.** Values are stored and rendered as plain text; there is no path from
  the editor to injected HTML. React escapes everything.
- **Empty is not allowed.** A field cannot be blanked — use Reset to go back to the
  shipped copy.
- **Audit and undo.** Every set, reset and revert is logged with the previous value,
  the actor and the timestamp. Restoring an old value is itself logged.
- **Orphans are surfaced.** If a field is renamed or deleted in code, its stored value
  is reported under *History → Orphaned edits* and can be dropped or restored, rather
  than silently hanging around.

**Wired today** — 12 surfaces, **1,955 fields**. Every string a visitor reads on the
marketing site is editable, including the header navigation and the footer.

| Surface | Includes |
| --- | --- |
| Homepage | Hero headline lines, badge, summary, both CTAs, the footnote and the three hero stats; the proof band; the problem section (all three problems, their stats and image alt text); how it works (all four stages); the Foundation blurb *and the three sample Ask Reygent conversations with their citations*; the testimonial and integrations headings; the closing block |
| Pricing | Hero, all three plans, the comparison matrix, the FAQ, the CTA — and the homepage preview and `/get-started` plan picker read the same document |
| Products | Index hero and the five module pages: name, kicker, headline, intro, flow, features, outcomes and the shared detail headings |
| Solutions | Index and the four practice pages |
| Comparisons | Index and all six approach-by-approach pages |
| Blog | Index, categories, and every article's title, dek, category, byline, reading time and body blocks |
| Legal | Privacy, terms, DPA, sub-processors |
| Shared content | Client marks, testimonials, integration surfaces, capability counts, the company statistics and the placeholder disclosures — edited once, applied on the homepage, `/customers`, `/about`, `/integrations`, `/startups` and `/demo` |
| Header, footer and brand | Site name, tagline, SEO title, social title, description, contact address, copyright; the three primary nav menus with their dropdown blurbs; the footer columns, the built-for line, the legal links and the placeholder disclosure |
| About and careers | The about hero, story, six principles, company timeline and proof band; the careers hero, every open role's summary, responsibilities and requirements, the "working here" list, the perks and both closing blocks |
| Guides and release notes | The guide library, every guide's description, the changelog with the reasoning behind each release, and the newsletter page including recent issues |
| Standalone pages | Get started, contact, demo, customers, integrations, security, startups, partners and the product tour: hero copy, section headings, checklists, direct channels, security posture rows, eligibility criteria, partner types and every closing block |

**Deliberately not editable:** the per-page SEO metadata (titles and descriptions are
derived from the copy above rather than typed twice) and the artwork itself. Both are
listed on the admin screen so the coverage claim stays honest.

## Environment variables

Everything works with none set. Optional:

| Variable | Effect |
| --- | --- |
| `REYGENT_DATA_DIR` / `REYGENT_DB_PATH` | Where the SQLite file lives (default `./data`) |
| `CRM_WEBHOOK_URL` | Mirrors every submission to a CRM/automation endpoint |
| `CRM_WEBHOOK_TOKEN` | Bearer token for that webhook |

Copy `.env.example` if you want to set them.

---

## What is placeholder, and clearly labelled as such

- **Client names, logos and testimonials** in `src/lib/content/marketing.ts` are
  invented and shaped to the ICP (legal, accounting, consulting, advisory). The site
  footer discloses this, and `TestimonialWall` prints its own disclosure line.
  `PLACEHOLDERS = { clients: true, testimonials: true }` is exported so a build-time
  guard can fail the deploy if the flags are still set on a live domain.
- **Product interface panels** are rendered from real components with illustrative
  data, and are captioned as such.
- **Integrations** are listed as capability surfaces rather than third-party logos, to
  avoid implying endorsements that do not exist.
- **Contact addresses** (`hello@`, `support@`, `security@`) are placeholders.
- **Sample workspace data** — 24 firms, 69 contacts, 20 engagements, tasks and
  activities — is invented. The queries over it are real.

## Needs real credentials before go-live

1. **Payments** — pick a provider (Stripe is the obvious fit), create three prices
   matching Core/Pro/Enterprise, and wire checkout to `/get-started`. The plan intent
   is already captured; only the checkout session is missing.
2. **Transactional email** — a provider (Postmark/Resend/SES) plus verified domain, so
   submissions send confirmations and the newsletter actually sends.
3. **CRM / routing** — set `CRM_WEBHOOK_URL` to push inbound to the sales tool.
4. **Calendar** — Google Calendar or Cal.com to turn demo requests into booked slots.
5. **SSO / SAML + SCIM** — required by the Enterprise tier as sold on `/pricing`.
6. **Postgres + object storage** — once there is more than one node, or document
   uploads are needed.
7. **Domain and DNS** — `reygent.ai` appears in metadata, robots and sitemap.

## Hero film and other uploaded media

The homepage hero plays a full-bleed looping video. Resolution happens at request
time, in this order:

1. `public/video/hero.mp4` / `hero.webm` / `hero.mov` — a file present in the
   project always wins, and the hero picks it up **without a rebuild**.
2. `heroVideo.src` in `src/lib/content/marketing.ts` — the remote CDN reference.

`public/images/hero-poster.jpg` is the poster frame and the fallback shown when the
visitor has `prefers-reduced-motion` set.

**Moving a file in.** When this project runs somewhere that cannot reach the source
of a clip (a locked-down sandbox, an air-gapped CI), start the server with the upload
channel enabled and post the file from a browser:

```bash
ALLOW_MEDIA_UPLOAD=1 UPLOAD_TOKEN=<random-string> npm start
# then open /upload?token=<random-string>
```

`POST /api/media` (and the page that drives it) returns **404 unless
`ALLOW_MEDIA_UPLOAD=1`**, so the surface does not exist in a normal deployment. With
the flag on it also requires the matching `UPLOAD_TOKEN`. Accepted: mp4, webm, mov,
jpeg, png, webp up to 80MB; `target=hero` writes into `public/video/`, any other
target into `public/uploads/`. Files written this way are **gitignored** — they are
deployment assets, not source. Copy the clip into `public/video/` (or commit it with
`git add -f`) when you want it to travel with the repository.

## Verified vs not verified

Verified: production build (74 pages), TypeScript strict, ESLint, all marketing routes
returning 200 (unknown routes 404), every form endpoint accepting valid input and
rejecting invalid input, the full auth lifecycle including the `/dashboard` guard, task
create/toggle through the API with the audit trail confirmed in SQLite, Ask Reygent
returning cited answers for matched and unmatched questions, and — for the content
admin — the whole loop end to end over HTTP:

- `/dashboard/content`, `/dashboard/content/<surface>` and `/dashboard/content/history`
  return 200 for a signed-in operator and redirect when signed out;
- `POST /api/content` returns 401 unauthenticated, 403 for a role that cannot publish,
  422 for a field that does not exist, an over-long value or a blank value, and 200 for
  a valid write;
- a saved edit changes the **served HTML** of a prerendered page — plan name, hero
  headline, product name and blog title were each verified on more than one route at
  once (a plan edit shows on `/pricing`, the homepage preview and `/get-started`; a
  product edit shows on `/products`, the detail page and the homepage tabs);
- the derived `<meta name="description">` on `/pricing` follows edited plan prices;
- **Reset** restores the shipped copy everywhere it was changed, and every write left a
  revision row with the before and after values;
- an edit to shared content lands on every page that uses it — a testimonial quote
  changed on the homepage and `/customers`, an integration blurb on the homepage and
  `/integrations`, a module name on `/products`, the detail page and the homepage tabs.

**Not verified here:** the admin's client-side interactions (per-keystroke state, the
search filter, the sticky toolbar, the save/reset buttons repainting) were exercised
through their API contract and by rendering the pages, not by clicking them in a
browser — there is no browser binary in this environment.

**Not verified:** pixel-level visual review in a real browser. No browser binary is
available in this environment, so rendering, responsive breakpoints, animation timing
and reduced-motion behaviour have not been eyeballed. Layout was authored against the
token system and checked structurally (markup, typecheck, build), not visually.
