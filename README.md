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

Verified: production build, TypeScript strict, ESLint, all marketing routes returning
200 (unknown routes 404), every form endpoint accepting valid input and rejecting
invalid input, the full auth lifecycle including the `/dashboard` guard, task
create/toggle through the API with the audit trail confirmed in SQLite, and
Ask Reygent returning cited answers for matched and unmatched questions.

**Not verified:** pixel-level visual review in a real browser. No browser binary is
available in this environment, so rendering, responsive breakpoints, animation timing
and reduced-motion behaviour have not been eyeballed. Layout was authored against the
token system and checked structurally (markup, typecheck, build), not visually.
