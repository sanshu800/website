# Reygent AI — agency site with a private content admin

The public pages a business owner reads when they are deciding whether to let an
agency automate part of their operation, plus a private admin at `/admin` where
whoever writes the copy edits it without a deploy.

Reygent AI sells **work, not licences**: a fixed-fee audit, a fixed-price build,
and a monthly support retainer. The copy therefore leads with the routine jobs a
business owner recognises — enquiries, paperwork, admin between systems,
reporting — rather than with the category. "AI agency" was the old
self-description and it earned its way out: it narrowed the company to a label
and told a visitor nothing they could check. Service routes keep their slugs
(`/services/ai-agents` and friends) because those URLs are live; only the names
they display changed. So there
are no pricing tiers, no per-seat plans, no free trial and no product tour — and
**no customer accounts and no user dashboard**. This build is the marketing site
and its CMS. The only authentication is the admin, and it is never linked from the
public pages.

---

## What is actually functional

| Area | Status |
| --- | --- |
| 33 marketing routes (services, industries, comparisons, blog, legal, engagements, how we work, build log) | Static-rendered, all live |
| Inbound forms (enquiry, newsletter, job application) | POST → validated with Zod → written to SQLite, with an optional CRM webhook. The enquiry form is the full qualification form — full name, work email, company, size, revenue, role, phone, topic, budget, message, referral (one name field, not two: splitting a name is a Western convention) — and it is the same component behind the "Book a free AI audit" CTA and the contact page |
| Content admin at `/admin` | Edit every string on the marketing site. Validated writes, audit log, one-click restore, no deploy |
| Authentication | Sign-in and sign-out for admin accounts only. **No public sign-up** — accounts come from `npm run admin:create` |
| Access control | Session guard on every `/admin/**` page; `owner`/`admin` role required to publish, others see a 403 |
| CSRF | Mutating API calls from another origin are rejected (`Sec-Fetch-Site`) |
| Search, filtering | Client-side search across every field of a content surface, plus an "edited only" filter |
| Charts, tabs, marquees, reveals | Server-rendered markup + CSS/motion animation, reduced-motion aware |
| Sitemap, robots, 404 | Present; `/admin` and `/api/` are disallowed for crawlers |
| Share cards and install icons | `opengraph-image.tsx` (1200×630) + `twitter-image.tsx` + `apple-icon.tsx` (180×180) + `manifest.ts`, all generated from the brand |
| Abuse control | Per-caller sliding window on the three public POST routes (8/hr enquiry, 10/hr generic, 5/hr newsletter) + a honeypot that answers bots with a success and stores nothing |
| Error and loading states | `error.tsx`, `global-error.tsx`, and skeletons scoped to the two routes that actually wait (`/upload`, `/admin`) |
| Currency | **USD primary**, GBP/EUR by arrangement — see below |
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

## Type

Three faces, all self-hosted as variable WOFF2 (SIL OFL, licences alongside the
files in `src/assets/fonts/`), 74 KB total, all three preloaded, no third-party
request and no build-time network dependency:

| Face | Where | Weights shipped |
| --- | --- | --- |
| **Space Grotesk** | display — headlines, hero, section titles | 500 |
| **Geist** | body — everything you read | 400, 500 for UI labels |
| **Geist Mono** | micro-labels, eyebrows, code, figures in tables | 500 |

**Why these.** Space Grotesk is a grotesque with ink traps and a genuine
technical character; Geist is a neutral, tightly-drawn UI face with a large
x-height and open apertures; Geist Mono belongs to the same family as the body
face, so a mono label reads as the same voice rather than a third one. The
combination is the standard pairing of a characterful display face over a neutral
text face, which is what a craft-conscious product site does rather than using
one face at five sizes.

Two rules the system enforces, both because the alternative reads as unfinished:

- **All-caps micro-labels share one tracking value.** `--text-eyebrow`
  (0.14em) and the `.tracking-label` utility (0.1em) exist so that the ~70
  uppercase mono labels on the site cannot drift into three different
  letter-spacings for the same kind of element. Upper-case text has no ascenders
  or descenders to separate its letters, so it needs tracking at small sizes;
  the value was 0.025em in places, which set the letters nearly touching.
- **Figures that get compared use tabular digits.** Both faces ship proportional
  figures with a `tnum` feature, so `table` and `.tabular` swap in real tabular
  digits — every digit on one advance — rather than faking alignment. Applied to
  prices, stats and counts, and deliberately **not** to figures inside prose,
  where tabular makes `1` as wide as `8` (Geist: 384 → 600 units) and spaces a
  number out for no reason.

**The constraint worth knowing:** this environment has no outbound network, so
the type could not be changed to a different face even if a different face were
better — the three files in the repository are the whole available palette.
The audit was therefore about how the shipped faces are *used*: usage, tracking,
figures, measure, weights and loading. If you want a different display face, it
has to be dropped into `src/assets/fonts/` first.

**Measure.** Body copy is set so a line lands in the readable band: `prose-reygent`
is 17px with a 1.75 line-height, and the narrow container is 40rem — about 70
characters a line. At 44rem it was about 79, which is past the point where the eye
starts losing its place on the return sweep.

**Italics are not synthesised.** No italic file is loaded and no rule makes text
italic, so nothing is being slanted by the browser — which would be a fake
italic, worse than none. Blockquotes are marked by a rule and the display face
instead. Blog prose is Markdown paragraphs; if emphasis is added to the body copy
later, it needs a real italic file or a deliberate alternative (weight, colour,
or the display face) rather than `font-style: italic`.

### The mobile action bar

Below `lg` the header's primary call to action lives inside the menu sheet: two
taps from anywhere past the hero, to reach the single action the site exists to
produce. `SiteHeader` therefore renders a small floating bar at the bottom of the
screen on small viewports, carrying the same CTA — one tap, from anywhere.

It is deliberately conditional, because a permanent banner has its own cost:

| Condition | Why |
| --- | --- |
| Only past the hero (`scrollY > 0.9 × innerHeight`) | The hero has its own two CTAs; the bar would be a third |
| Not within 720px of the page bottom | Every page already ends with the same link in the footer, and two copies on screen at once reads as pressure |
| Not on `/get-started` or `/contact` | Those *are* the destination — and on `/get-started` it would sit over the submit button of the form it points at |
| Not while the menu sheet is open | The sheet has its own copy of the same link |

Two implementation notes worth keeping:

- **It is mounted only while visible**, not hidden with opacity. An invisible link
  is still a focus stop for a keyboard user, and `aria-hidden` on a focusable
  element is worse than either.
- **The trigger is measured in viewport heights, not pixels.** The hero is a full
  screen on a phone and a fraction of one on a tablet, so a fixed pixel threshold
  would fire halfway through the hero on one and long past it on the other.
  Resize is listened to as well, so rotating a phone re-evaluates without a scroll.

## Design system

- **Black is the brand.** The wordmark is plain type, the mark is a black square
  with three white rules (favicon and app chrome only), and every interactive
  element is black or grey. Colour is *reserved for data* — status pills, health
  flags, charts — so it always means something rather than decorating.
- **Geist / Space Grotesk / Geist Mono**, self-hosted. Body and hero copy are
  Geist; section headlines are Space Grotesk; labels are Geist Mono.
- **Radii:** 8px on buttons and inputs, 12–28px on cards and surfaces, full on
  filters, chips, avatars and dots. Squared controls, soft surfaces.
- **Colour is two-tier, and the tiers are not interchangeable.** The base tokens
  (`--color-jade`, `--color-caution`, …) are *graphic* colours: they carry icons,
  rules and fills, and they measure 2.9:1–5.1:1 against paper, so none of them may
  hold a sentence. Text uses the `-ink` set (worst case 5.3:1 on paper, 5.4:1 on
  its own soft tint) and chips pair them with a `-line` hairline. Control borders
  use `--color-field` (3.36:1) rather than the decorative `line-strong` (1.56:1),
  because a field's border is the only thing identifying it. Nothing outside
  `globals.css` contains a colour literal.
- **Motion:** a staggered `fadeSlideUp` on the hero, a marquee strip, reveal-on-
  scroll sections and a scroll-progress rail. All of it collapses under
  `prefers-reduced-motion`, where the hero falls back to a still frame.
- **No label above a heading.** A small monospace label sitting on top of a
  heading, on every section, is the house style of generated pages and the
  reader pays for it in time: they read the category, then the heading, and the
  heading was the point. The pattern was removed from 68 places — 57 component
  pass-sites, 6 hand-rolled ones, 5 admin headers. Three remain, and each names
  something the heading cannot: `Compare · <name>`, `Solutions · <industry>`,
  `Last updated <date>`. A label *above a heading* is what is out; a heading
  set in this style (the footer columns) or a status code (`404`, `403`) is
  not the same thing. The rule is repeated on the `Eyebrow` component.

### Voice

Four rules, learned by getting them wrong first:

1. **Lead with the work, not the category.** "We take the routine work off your
   team" beats "we are an AI agency" — one is checkable against a visitor's own
   week, the other asks them to know our industry first. The category can appear
   later, if at all.
2. **Name services by what the buyer gets.** "Remove the manual admin", not
   "workflow automation". The mechanics go in the kicker underneath, where they
   are useful rather than required reading.
3. **Ten seconds, one idea.** The homepage hero answers who, what, for whom and
   what next, in a headline plus one paragraph of 30 words at roughly grade 6.
   Anything longer is a second paragraph on a different page.
4. **No word a business owner would have to look up.** "Agent", "orchestration",
   "platform", "solution", "digital transformation" all came out. Where the
   technology matters to the decision — whether AI should touch a process at all
   — the copy says so plainly instead of gesturing at it.

The CMS makes all of this editable, which is the point: the voice rules are for
new copy, not a lock on what ships.
- **One theme, and it is light.** There is deliberately no `prefers-color-scheme`
  palette. A dark theme was built and removed: it was verified by measured
  contrast but could not be *looked at* in this environment, and a dark-mode
  visitor getting a worse experience than a light-mode visitor is worse than
  everyone getting the same one. Two things that look as if they belong to that
  work are unrelated and stay: `--color-fog-2` was merged into `fog` because it
  failed AA on the `mist` surface at 4.17:1 across 113 small labels, and the
  solid colour chips sit on the `-ink` tone of their colour because white on
  `--color-tangerine` measures 2.86:1. Both were light-mode defects.
  `colorScheme: "light"` in `layout.tsx` is load-bearing: without it a visitor
  whose OS is set to dark gets browser-drawn dark `<select>` menus, scrollbars
  and autofill on a light page.
- **`night` is not a dark-mode token.** The `--color-night` ramp and
  `--color-on-night` are the site's high-contrast blocks — hero, screenshot
  frames, dark CTA panels, footer. They are named separately from `ink` because
  they are dark *by purpose* rather than by position; `ink` is the text colour.
  The values are identical today, and that is fine: the names carry the
  distinction, not the values.

### The hero film

The homepage opens with a full-bleed looping video behind the headline, with a
gradient scrim for legibility and a poster frame committed at
`public/images/hero-poster.jpg` so the hero is never a black rectangle while the
video loads. The clip is referenced from its CDN because it is several megabytes:
for production, download it to `public/video/hero.mp4` and point `heroVideo.src`
in `src/lib/content/marketing.ts` at that local path — the resolution order
already prefers a local file. `HeroFilm` pauses the film when the browser reports
a data-saver preference or a 2G-class connection, and `prefers-reduced-data`
hides it in CSS; the poster underneath is a finished composition either way.

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
enquiry form's dropdowns are enums on both sides: the browser sends a slug, the
server accepts only the slugs it shipped, and the messages the schema returns are
written as instructions because they are the ones a person reads under the field.

Both lead paths render `src/components/forms/EnquiryForm.tsx`: the audit CTA on
`/get-started` (`kind="audit"`, topic pre-set to the audit, button reads "Request
the free audit") and the contact page (`kind="contact"`). `kind` is set by the
component, validated as part of `enquirySchema`, and stored on the row, so the two
funnels can be counted separately without guessing from the payload. The two
field-label treatments (`mono` for chrome and compact forms, `text` for the long
qualification form) live in `src/components/forms/Fields.tsx`.

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

Every public POST route is rate-limited per caller (sliding window, in-process —
single-instance coverage, documented in `src/lib/ratelimit.ts`) and checks a
honeypot field first, answering a caught bot with `{ "ok": true }` and storing
nothing.

There is deliberately no sign-up route. `POST /api/auth/signup` was removed: it
created accounts with the `owner` role, which would have handed the admin panel to
anyone who found it.

---

## Where enquiries go

Two places, and they are deliberately independent:

1. **The inbox — `/admin/enquiries`.** Every submission the site has taken, newest
   first, with the full qualification detail for each one. This is the source of
   truth. It is behind the admin session like everything else in `/admin`, and the
   nav carries a count of leads from the last seven days so an unanswered one is
   visible from any admin screen. The site promises a reply within one working day,
   which is only a promise if somebody is looking at this page.
2. **Your CRM, over a webhook — optional.** Set `CRM_WEBHOOK_URL` and each lead is
   posted to it as it arrives. `CRM_WEBHOOK_TOKEN` adds an `Authorization: Bearer`
   header. `CRM_WEBHOOK_KINDS` chooses what is forwarded and defaults to
   `audit,contact` — a newsletter signup and a job application are not sales leads,
   and they stay in the inbox either way. Use `all` to forward everything.

The webhook is a **copy, never the only record**. The POST is fire-and-forget with
an 8-second timeout and one retry, so a slow or broken CRM can never cost a visitor
their form submission; the outcome is written back to the row as
`crm_status` (`pending` / `sent` / `failed`) and shown against the enquiry in the
inbox, so a webhook that has silently been failing for a week is something you can
see rather than something you learn from a customer.

The body is designed to be consumed directly by a CRM or an automation tool —
`fields` is an object, not a JSON string that the receiving side has to parse twice:

```json
{
  "id": "sub_mu3phemme2el4deo",
  "kind": "audit",
  "receivedAt": "2026-09-16T06:14:41.230Z",
  "name": "Priya Raman",
  "email": "priya@carrowproperty.co.uk",
  "company": "Carrow Property",
  "fields": {
    "fullName": "Priya Raman",
    "email": "priya@carrowproperty.co.uk",
    "company": "Carrow Property",
    "companySize": "16-40",
    "revenue": "1m-5m",
    "title": "operations",
    "topic": "audit",
    "budget": "15k-50k",
    "message": "We miss enquiries at weekends and quotes go out late.",
    "kind": "audit"
  }
}
```

What the visitor sees when they press send is the acknowledgement box
(`FormSuccess` in `src/components/forms/Fields.tsx`) — a green check on a jade
surface, `role="status"` so a screen reader announces it, and a sentence that names
the person and states when a reply is coming. It is deliberately a status message
and not a silent form reset: the promise in it is the thing the inbox above exists
to keep.

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

**Deliberately not editable:** the artwork itself, listed on the admin screen so the
coverage claim stays honest. The per-page SEO titles and descriptions are edited on
their own screen (`/admin/edit/seo`), and they are emitted exactly as typed.

Metadata that is *derived* rather than typed — a page's title from its headline, a
description from its summary — goes through a fitter in `src/lib/cms/seo.ts` before it
is emitted, because a search result cuts a title at about 60 characters and a
description at about 160. It prefers to cut on a sentence, then on a clause (so
"Property, trades & field service — For businesses whose day is bookings…" becomes
just the service name), and only then mid-word with an ellipsis. The brand suffix is
dropped rather than added when the title is already long. An override typed into the
admin is never touched: somebody chose those words on purpose, and silently shortening
them is the behaviour that makes an owner stop trusting the panel.

Re-run the audit against a running server with `python3 scripts/seo-audit.py`.

## Currency and geography

The commercial surface is priced in **USD** — $3,000 for the audit week, builds
from $12,000, the retainer from $1,200/month, and $6,000 for the founders
programme — because most of the audience is not British. GBP and EUR are offered
as contracting currencies in the same breath (`pricingCopy.plans.currencyNote`),
and the form's revenue and budget bands are in dollars to match. Salaries on
`/careers` stay in GBP on purpose: those roles are advertised as remote UK/EU or
hybrid London, so the employment market, not the sales market, sets the currency.

Response-time promises say "UK hours (GMT/BST)" so a reader in another timezone
can tell which clock is meant.

---

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
  `PLACEHOLDERS = { clients: true, testimonials: true }` feeds a real build-time
  guard: `npm run placeholders:check` runs before `next build` and **fails the
  build** when `REYGENT_LIVE_HOST` (or Vercel's `VERCEL_URL`) names a public host
  and either flag is still set. On a developer machine there is no host to protect
  and it passes with a note saying so. Ship placeholders on purpose with
  `ALLOW_PLACEHOLDERS=1`.
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

1. **Payments** — work like this bills against milestones, not cards. When invoices need
   to be raised automatically, connect Stripe Invoicing or your accounting package;
   the audit request is already captured with the industry, size and preferred time.
2. **Transactional email** — a provider (Postmark/Resend/SES) plus verified domain, so
   submissions send confirmations and the newsletter actually sends.
3. **CRM / routing** — set `CRM_WEBHOOK_URL` to push inbound to the sales tool.
4. **Calendar** — Google Calendar or Cal.com to turn fetched audit requests into
   self-service booked slots.
5. **Admin authentication hardening** — rate limiting is now in place on
   `/api/auth/login` (10 attempts per address per 15 minutes, plus 5 failures per
   account). The remaining gap is that the admin is still a single password: a real
   deployment wants SSO or 2FA on top. The limiter's state is in-process, so a
   multi-instance deployment should move it to a shared counter.
6. **CRM routing is wired, and optional** — see "Where enquiries go" below. Without
   `CRM_WEBHOOK_URL` set, enquiries live only in the admin inbox, which is a
   supported way to run it as long as somebody opens that page.
   (There are no customer accounts and no SSO story, because there is no product to
   log into — the admin is the only authenticated surface.)
7. **Postgres + object storage** — once there is more than one node, or document
   uploads are needed.
8. **Domain and DNS** — `reygent.ai` appears in metadata, robots and sitemap.

## Hero film and other uploaded media

The homepage hero plays a full-bleed looping video. Resolution happens when the
page is rendered — at build, and again on every cache purge — in this order:

1. `public/video/hero.mp4` / `hero.webm` / `hero.mov` — a file present in the
   project always wins, and the hero picks it up **without a rebuild**: the
   homepage is statically rendered, and `POST /api/media` purges it after writing
   a file (the same `revalidatePath` mechanism `/api/content` uses for copy
   edits).
2. `heroVideo.src` in `src/lib/content/marketing.ts` — the remote CDN reference.

`public/images/hero-poster.jpg` is the poster frame and the fallback shown when the
visitor has `prefers-reduced-motion` set.

### The other artwork

The images behind the three problem cards and the about-page story block are drawn,
not photographed — thin luminous threads on near-black, which is the same language as
the hero film. The source is `scripts/artwork/gen.mjs` and the JPEGs in
`public/images/` are its committed output, so the artwork has a readable origin
instead of being binaries nobody can adjust: change a number, run
`node scripts/artwork/gen.mjs`, and the file changes with it. It is deterministic and
it is **not** part of the build.

The reason is not style for its own sake. The cards render their image under
`mix-blend-luminosity` on a saturated field, so the field supplies all of the colour
and the image only supplies light — a drawing of threads becomes a glowing neon
shape, while a photograph of a tidy office stays a photograph of a tidy office. Stock
photography also dates a page immediately, and "a desk buried in paper" is the visual
cliché of small-business software. Two stock photographs weighed 2.2 MB each; these
are 30–62 KB.

If you replace them, keep two rules: the drawing must carry luminance only (it is
blended, not overlaid) and it should stay abstract, because every concrete claim on
this site is a placeholder until you supply the real one.

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

Verified: production build (80 routes), TypeScript strict, ESLint, every marketing
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

Then, for the international/production pass:

- the homepage is prerendered (`x-nextjs-prerender: 1`, `s-maxage=31536000`) where
  it was previously `private, no-cache, no-store`; the other marketing routes were
  already cached and CMS writes still change served HTML;
- all six security headers are present on `/`; `/images/*` is immutable for a year
  and uploaded media for a week; the image optimiser negotiates AVIF (33.9 KB where
  the source PNG is 2.3 MB);
- the limiter refuses the 9th enquiry in an hour with **429 + `Retry-After: 3600`**,
  a filled honeypot returns **200 `{"ok":true}`** and writes nothing, and a missing
  required field returns a human message rather than Zod's diagnostic;
- `error.tsx` renders on a route that throws — verified by adding a temporary route
  that throws, confirming the 500 response carries a digest plus `noindex`, and then
  confirming the fallback copy ships in the chunk referenced by that response before
  deleting the route (no browser is available, so this is bundle-level, not visual);
- a root-level `loading.tsx` leaked a skeleton into every prerendered page's first
  paint (`/pricing` shipped 16 `animate-pulse` divs before its real `<h1>`), so
  loading states are scoped to `/upload` and `/admin`;
- `og:image` (1200×630), `twitter:image`, `apple-touch-icon` (180×180) and
  `/manifest.webmanifest` all return 200 with the right content types, and the
  share card itself was rendered and reviewed;
- **search and sharing, audited page by page** (`scripts/seo-audit.py`, all 51
  sitemap URLs): every page returns 200 with one `<h1>`, a unique title and
  description, a canonical on `https://reygent.ai`, `index, follow`, `lang="en"`,
  no image without alt text and no malformed structured data. Fixes this audit
  produced: `og:image` and `twitter:image` were present on **one page of 51** — a
  custom `openGraph` block on every other page silently replaced the inherited card,
  so the fix serves the same 1200×630 card from `/og` and every page points at it;
  **18 titles exceeded 60 characters** (the worst at 120, built by gluing a hero
  headline onto a service name) and **18 descriptions exceeded 160**, now 0 and 0,
  through the fitter above plus removing the concatenation at its source; and
  `/solutions` and `/compare` were **orphans** — in the sitemap, linked from nowhere,
  because their child pages' breadcrumbs passed a label without an `href` while the
  services breadcrumb passed one. Both are now linked from every child page;
- **the mobile action bar's logic was verified in the compiled bundle** rather
  than by eye, since there is no browser here: the shipped chunk contains
  `scrollY > 0.9 * innerHeight`, `scrollY + innerHeight > scrollHeight - 720`,
  the `/get-started` // `/contact` exclusion and the four-way gate
  `pastHero && !nearBottom && !mobileOpen && !funnelPage`, and the bar is absent
  from the server HTML (so it cannot flash before hydration). What a build cannot
  confirm is how it feels to scroll into — that needs a phone;
- the split between the two defects above is worth noting: the missing `og:image` was
  invisible on the site and only visible in a link preview, which is exactly the kind
  of thing an audit has to check for rather than assume;
- the enquiry form posts `fullName` and returns 201; the retired `firstName`/
  `lastName` payload returns 422;
- 51 sitemap routes and every internal link in the rendered site return 200.

Then, for the lead-capture pass:

- **the acknowledgement is real, not assumed** — the success panel renders through the
  actual component with `role="status"`, a jade circle and a jade-on-jade check, and
  the name entered by the visitor interpolated into the copy. Rendered markup, not
  source-reading; clicking the button itself still needs a browser;
- **the CRM webhook, both directions.** With a receiver listening: the audit enquiry
  returns 201, exactly one POST arrives, carrying `Authorization: Bearer <token>` and
  `fields` as a parsed object with `name`, `email` and `company` populated; the row is
  marked `sent`. With the receiver killed: the visitor still gets **201**, and the row
  is marked `failed` with `fetch failed` attached. A newsletter signup posts nothing,
  as `CRM_WEBHOOK_KINDS` intends, and lands in the inbox anyway;
- **the lockout protects the owner.** Ten attempts per address per fifteen minutes,
  five failures per account, and the account check runs *after* password verification —
  so the sixth wrong guess answers **429 + `Retry-After: 900`** while the *correct*
  password at the same moment still answers **200**;
- **the placeholder guard fails the way it claims to.** `npm run placeholders:check`
  passes with no public host configured and exits **1** naming `clients, testimonials`
  when `REYGENT_LIVE_HOST=reygent.ai`; it runs first in `npm run build`;
- **the inbox** filters, counts and empty-states verified over HTTP, and the nav badge
  reads the same seven-day count.

Then, for the artwork pass: every image on the site is served from `public/images/`
(200 with the right content type), no page references the four stock photographs that
were deleted (404), and the treatment was simulated pixel-exactly — CSS `luminosity`
implemented from the spec, since neither sharp nor libvips ships it — before the
images were accepted. The 9 MB of stock photography is now 316 KB.

**Retired, all returning 404:** `/login`, `/signup`, the whole `/dashboard` tree,
`POST /api/auth/signup`, `/api/ask`, `/api/tasks` and the sample CRM screens behind
them; then, in the agency repositioning, `/products/*`, `/product-tour`,
`/release-notes` and `/demo` (with `/api/demo` and the plan-picker form). The database
is users, sessions, submissions and the two CMS tables — nothing else.

**Not verified here:** there is no browser in this environment, so the admin's
client-side interactions (per-keystroke state, the search filter, the sticky toolbar,
the save/reset buttons repainting), responsive behaviour, animation timing and
rendered pixels were **not** exercised. The checks above are build- and HTTP-level.
