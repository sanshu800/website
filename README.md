# Reygent — AI agency site with a private content admin

The public pages a business owner reads when they are deciding whether to let an
agency automate part of their operation, plus a private admin at `/admin` where
whoever writes the copy edits it without a deploy.

Reygent is an **AI agency**, not a software product. The site sells work, not
licences: a fixed-fee audit, a fixed-price build, and a monthly retainer. So there
are no pricing tiers, no per-seat plans, no free trial and no product tour — and
**no customer accounts and no user dashboard**. This build is the marketing site
and its CMS. The only authentication is the admin, and it is never linked from the
public pages.

---

## What is actually functional

| Area | Status |
| --- | --- |
| 33 marketing routes (services, industries, comparisons, blog, legal, engagements, how we work, build log) | Static-rendered, all live |
| Inbound forms (contact, audit request, newsletter, job application) | POST → validated with Zod → written to SQLite, with an optional CRM webhook. The contact form is the full qualification form — name, company, size, revenue, role, phone, topic, budget, message, referral |
| Content admin at `/admin` | Edit every string on the marketing site. Validated writes, audit log, one-click restore, no deploy |
| Authentication | Sign-in and sign-out for admin accounts only. **No public sign-up** — accounts come from `npm run admin:create` |
| Access control | Session guard on every `/admin/**` page; `owner`/`admin` role required to publish, others see a 403 |
| CSRF | Mutating API calls from another origin are rejected (`Sec-Fetch-Site`) |
| Search, filtering | Client-side search across every field of a content surface, plus an "edited only" filter |
| Charts, tabs, marquees, reveals | Server-rendered markup + CSS/motion animation, reduced-motion aware |
| Sitemap, robots, 404 | Present; `/admin` and `/api/` are disallowed for crawlers |
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

### Admin accounts

The dev seed creates two accounts so you can look around immediately:

| Email | Password | Role |
| --- | --- | --- |
| `demo@reygent.ai` | `demo1234` | owner |
| `ops@reygent.ai` | `demo1234` | admin |

Sign in at **`/admin`** — the URL is the only way in, by design.

For a real deployment, do **not** run the demo seed. Create your own account instead:

```bash
npm run admin:create -- --email you@yourfirm.com --name "Your Name"
# prompts for a password (never passed as an argument, so it stays out of shell history)
```

Running it again for an existing email resets that account's password.

**If sign-in appears to do nothing**, the browser dropped the session cookie. The
session cookie is set `SameSite=None; Secure; Partitioned` precisely so that it
survives being viewed inside an embedded preview frame, where the app's own
origin counts as cross-site — a `Lax` cookie is withheld there and the admin guard
sends you straight back to the sign-in form. The form checks the session immediately
after signing in and tells you if the browser refused it; opening the admin in its
own tab always works.

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
  marketing site, the admin and the API. Server Components keep the marketing
  pages static; admin pages stream from SQLite per request.
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
src/app/            routes (marketing, admin, api)
src/components/     ui · brand · layout · marketing · screens · motion · forms · admin
src/lib/            db · auth · submissions · validation
src/lib/cms/        the content admin: documents, paths, store, accessors
src/lib/content/    all copy and sample data, typed
scripts/seed.ts     dev seed: creates the database and two admin accounts
scripts/admin.ts    admin:create — the only way an account is created
data/reygent.db     local database (gitignored; recreate with npm run db:reset)
archive/            the previous rejected design, kept for reference, excluded from build
```

Form capture lives in `src/lib/submissions.ts`, so every public form — and the
optional CRM webhook — shares one definition of what an inbound lead is. The
contact form's dropdowns are enums on both sides: the browser sends a slug, the
server accepts only the slugs it shipped, and the messages the schema returns are
written as instructions because they are the ones a person reads under the field.
The two field-label treatments (`mono` for chrome and compact forms, `text` for
the long qualification form) live in `src/components/forms/Fields.tsx`.

---

## API

Session-authenticated unless noted. All JSON.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/submissions` | Generic inbound capture (`kind` + payload) — public |
| `POST` | `/api/contact` · `/api/newsletter` · `/api/careers` | Form-specific endpoints — public |
| `GET` | `/api/submissions` | List inbound submissions (admin session required) |
| `POST` | `/api/auth/login` · `/api/auth/logout` | Admin session lifecycle |
| `GET` | `/api/auth/session` | Who the server can see, so the form can report a dropped cookie |
| `POST` | `/api/content` | Write site copy (`set`, `reset`, `revert`, `drop`). Owner/admin only |
| `POST` | `/api/media` | Upload the hero film (opt-in, token-gated) |

There is deliberately no sign-up route. `POST /api/auth/signup` was removed: it
created accounts with the `owner` role, which would have handed the admin panel to
anyone who found it.

---

## Editing the site (content admin)

`/admin` is a real CMS, not a mock screen. Whoever writes the copy can change it
without a deploy, and every change is attributed and reversible.

**How to reach it:** go to `/admin` and sign in. It is not linked from anywhere on
the public site and is disallowed in `robots.txt`. Three screens:

| Screen | What it does |
| --- | --- |
| `/admin` | Every editable surface, how many fields each has, what has been changed, and the latest edits |
| `/admin/edit/<surface>` | The editor: search across every field, filter to edited ones, edit / save / reset per field |
| `/admin/history` | The full audit log — before and after values, who changed what, restore any version |

**How it works.** Each surface is a *content document*: one JSON tree holding the
complete default copy for that part of the site, assembled from the content modules
(engagements, services, industries, posts, legal pages) plus the page copy that used to
sit inline in the components. Every string leaf in it has a stable dotted path —
`hero.title`, `engagementsList.build.includes.2`, `items.ai-agents.kicker`. Saving a
field writes one row to
`content_overrides` keyed `<doc>#<path>` and appends a row to `content_revisions`.

At render time the page asks for the merged document (`getPricing()`, `getServices()`,
…): the tree is deep-cloned and overridden values are layered on top. Typing the
shipped value back in clears the override rather than freezing a copy of it, which is
what the **Reset** button does too — so code stays the source of truth for anything
nobody has deliberately changed.

Array items that carry a `slug` are addressed by it (`items.ai-agents`, `posts.<slug>`)
rather than by index, so reordering the source array does not move anyone's edits.

**Publishing.** Saves call `revalidatePath("/", "layout")`. The marketing pages are
prerendered, so without that a change would sit invisible until the next build; with
it, the next request regenerates the page. Verified: editing an engagement price, a
service headline or an industry name changes the served HTML of `/pricing`,
`/services/ai-agents` and the industry pages, and **Reset** restores the shipped copy.

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
| Homepage | Hero headline lines, badge, summary, both CTAs, the footnote and the three hero stats; the proof band; the problem section (all three problems, their stats and image alt text); the five-service heading; the agent walkthrough (tab list *and* the three sample conversations with their sources); the "how we work" stages; the testimonial and integrations headings; the closing block |
| Engagements & pricing | Hero, all three engagements (audit, build, retainer) with prices and inclusions, the side-by-side matrix, the FAQ, the CTA — and the homepage preview and the summary on `/get-started` read the same document |
| Services | Index hero and the five service pages: name, kicker, headline, summary, intro, flow, six capabilities, outcomes and the shared detail headings |
| Solutions | Index and the four industry pages |
| Comparisons | Index and all six approach-by-approach pages |
| Blog | Index, categories, and every article's title, dek, category, byline, reading time and body blocks |
| Legal | Privacy, terms, data handling |
| Shared content | Client marks, testimonials, integration surfaces, capability counts, the company statistics and the placeholder disclosures — edited once, applied on the homepage, `/customers`, `/about`, `/integrations`, `/startups` and the industry pages |
| Navigation and footer | Site name, tagline, SEO title, social title, description, contact address, copyright; the five primary nav menus with their dropdown blurbs; the footer columns, the built-for line, the legal links and the placeholder disclosure |
| About and careers | The about hero, story, six principles, company timeline and proof band; the careers hero, every open role's summary, responsibilities and requirements, the "working here" list, the perks and both closing blocks |
| Playbooks and build log | The playbook library, every playbook's description, the build log with what each project taught us, and the newsletter page including recent issues |
| Standalone pages | Get started (the audit funnel), contact, case studies, what we connect, security, founders programme, partners and how we work: hero copy, section headings, checklists, direct channels, security posture rows, eligibility criteria, partner types and every closing block |

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
- **Console panels** (the enquiry queue, follow-up sequences, job checklist and
  weekly review) are rendered from real components with illustrative data, and are
  captioned as such.
- **Integrations** are listed as capability surfaces rather than third-party logos, to
  avoid implying endorsements that do not exist.
- **Contact addresses** (`hello@`, `support@`, `security@`) are placeholders.
- **Interface panels** on the service pages are rendered from real components with
  illustrative data, and captioned as such. The sample CRM dataset that used to back a
  demo dashboard has been removed along with the screens.

## Needs real credentials before go-live

1. **Payments** — an agency bills against milestones, not cards. When invoices need
   to be raised automatically, connect Stripe Invoicing or your accounting package;
   the audit request is already captured with the industry, size and preferred time.
2. **Transactional email** — a provider (Postmark/Resend/SES) plus verified domain, so
   submissions send confirmations and the newsletter actually sends.
3. **CRM / routing** — set `CRM_WEBHOOK_URL` to push inbound to the sales tool.
4. **Calendar** — Google Calendar or Cal.com to turn fetched audit requests into
   self-service booked slots.
5. **Admin authentication hardening** — the admin is a single password-protected
   account. Real deployment wants SSO or 2FA, plus rate limiting on `/api/auth/login`.
   (There are no customer accounts and no SSO story, because there is no product to
   log into — the admin is the only authenticated surface.)
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

Verified: production build (72 routes), TypeScript strict, ESLint, every marketing
route returning 200 (retired routes 404, unknown routes 404), every form endpoint
accepting valid input and rejecting invalid input, and — for the admin and the
content loop — the whole thing end to end over HTTP:

- `/admin`, `/admin/edit/<surface>` and `/admin/history` return 200 for a signed-in
  operator and redirect to `/admin/login` when signed out; `/admin/login` redirects
  back to `/admin` when a session is already valid;
- a signed-in account with a non-editing role sees the 403 screen and
  `POST /api/content` answers **403** for it;
- `POST /api/content` returns 401 unauthenticated, 422 for a field that does not
  exist, an over-long value or a blank value, and 200 for a valid write;
- a saved edit changes the **served HTML** of a prerendered page — plan name, hero
  headline, nav label, footer heading, product name and blog title were each verified
  on more than one route at once;
- **Reset** restores the shipped copy everywhere it was changed, and every write left
  a revision row with the before and after values;
- signing out clears the session cookie with matching attributes and `/admin`
  redirects again;
- `robots.txt` disallows `/admin` and `/api/`, and the sitemap contains neither;
- no public page renders a link to `/admin`, `/login` or `/signup` — checked on the
  homepage, `/pricing`, `/how-we-work`, `/about`, `/contact`, `/get-started` and
  `/careers`;
- the public forms still capture: an audit request returns 201 and writes its row.

**Retired, all returning 404:** `/login`, `/signup`, the whole `/dashboard` tree,
`POST /api/auth/signup`, `/api/ask`, `/api/tasks` and the sample CRM screens behind
them; then, in the agency repositioning, `/products/*`, `/product-tour`,
`/release-notes` and `/demo` (with `/api/demo` and the plan-picker form). The database
is users, sessions, submissions and the two CMS tables — nothing else.

**Not verified here:** there is no browser in this environment, so the admin's
client-side interactions (per-keystroke state, the search filter, the sticky toolbar,
the save/reset buttons repainting), responsive behaviour, animation timing and
rendered pixels were **not** exercised. The checks above are build- and HTTP-level.
