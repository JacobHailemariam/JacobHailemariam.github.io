# Jacob Hailemariam — Portfolio

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion.
Static site, deployed to GitHub Pages.

---

## Run it locally

Requires Node 18.17 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build      # production build — run this before deploying
npm run start      # serve the production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```

---

## The three files you'll actually edit

Almost nothing about this site requires touching a component.

| File | What it controls |
| --- | --- |
| `lib/site-content.ts` | **All copy, projects, experience, skills, links, and images.** Adding a project means adding an object here. |
| `lib/palette.ts` | Every colour on the site, including the hero canvas. |
| `tailwind.config.ts` | Type scale, fonts, spacing, easing. Imports the palette. |

The palette lives in its own module rather than inside the Tailwind config because
the hero canvas paints with the 2D context and needs literal colour strings at
runtime — it can't read Tailwind classes. Defining the hexes once and importing
them into both places means retuning the accent can't leave the canvas behind on
the old colour.

### Retuning the accents

Open `lib/palette.ts` and change `volt` (electric violet, the signature) or
`ember` (warm gold). Names describe **role**, not hue, so swapping violet for
teal doesn't turn every class name in the codebase into a lie.

One rule worth keeping: `ember` is reserved for hover, focus, and the contact
email. If it starts appearing elsewhere the hover states stop reading as
interactive, because nothing distinguishes them any more.

---

## Images

### Already in place

These five are your real files, already sized and wired up:

| File | Used by |
| --- | --- |
| `public/images/jacob.jpg` | About |
| `public/images/gsil-hyperspectral.webp` | GSIL research (the wide strip) |
| `public/images/altium-layout.png` | Simon Says |
| `public/images/enginquire-cohort.jpg` | EngInQuire |
| `public/images/enginquire-teaching.jpg` | EngInQuire |

### Still to supply

Anywhere an image is missing, the site renders a dashed **"asset pending"** frame
describing what belongs there. Nothing 404s and nothing shows a broken-image
icon, so you can ship today and fill these in as they become available.

To add one: drop the file into `public/images/`, then set the matching `src` in
`lib/site-content.ts` from `null` to the path.

| Drop the file at | Then set | Notes |
| --- | --- | --- |
| `public/images/gsil-architecture.png` | `featuredProject.images[1].src` | **Needs a citation** — see below |
| `public/images/gsil-code-1.png` | `featuredProject.images[2].src` | Model / training code screenshot |
| `public/images/vit-accuracy.png` | `projects → "vit" → images[0].src` | Script below fetches this |
| `public/images/vit-confusion.png` | `projects → "vit" → images[1].src` | Script below fetches this |
| `public/images/url-shortener-docs.png` | `projects → "url-shortener" → images[0].src` | Script below fetches this |
| `public/images/altium-schematic.png` | `projects → "simon-says" → images[1].src` | Schematic capture |

### Fetching the three that live in your own repos

```bash
./scripts/fetch-project-assets.sh
```

Pulls your training curves, confusion matrix, and Swagger screenshot straight
from `raw.githubusercontent.com` into `public/images/`, then prints the exact
lines to change. No cloning, no dragging files around.

### Other placeholders (not images)

| Where | What's needed |
| --- | --- |
| `lib/site-content.ts` → `projects → "enginquire"` | The **First-Year Blueprint Generator** URL. Currently only `enginquire.com` is linked. Add a second `ActionLink` in `ProjectCard`, or replace `liveUrl`. |
| `lib/site-content.ts` → `projects → "url-shortener"` | `liveUrl` is `null` — no demo is deployed yet. See below. |
| `app/layout.tsx` → `metadataBase` | Update to your real domain after the first deploy, so link previews resolve correctly. |

---

## Two things to check before you publish

### 1. The hyperspectral image caption

You described this as `trento_pca`, but the image doesn't look like the Trento
scene. Trento is rural — forest, vineyards, apple orchards, roughly 600×166.
Your file is 1330×284 and shows a dense street grid, a stadium with a running
track, a cloverleaf highway interchange, and a shadowed region on the right.
That's the signature of the **Houston 2013 GRSS Data Fusion Contest** scene
(University of Houston campus).

You know your own pipeline and I may be wrong. So the caption as written names
no dataset at all — it says "a benchmark hyperspectral scene," which is true
either way. **Confirm which file you ran PCA on and name it explicitly**, because
naming the right dataset is a small, checkable signal of care that the kind of
person reading this page will notice.

### 2. The architecture diagram citation

The caption in `lib/site-content.ts` currently reads:

> Baseline architecture this work builds on. Source: **[ADD CITATION]**. Diagram
> reproduced for reference — not my design. My modifications are labelled
> separately.

Replace `[ADD CITATION]` with the real paper (authors, year, venue) before this
image goes live. If you end up marking your own modifications on the diagram,
split it into two figures rather than editing this caption — one showing the
baseline as published, one showing your changes — so there's no ambiguity about
which parts are yours.

---

## Deploying the live API demo

The URL shortener's `liveUrl` is `null`, so the "Visit site" button simply isn't
rendered — better than a button pointing at `#`. To light it up you need the
FastAPI service running somewhere with a Postgres and a Redis attached.

The free-tier path that works today:

1. **Postgres** — create a database at [Neon](https://neon.tech). Copy the
   connection string.
2. **Redis** — create a database at [Upstash](https://upstash.com). Copy its
   Redis URL.
3. **The API** — deploy the `url-shortener` repo to
   [Railway](https://railway.app) or [Render](https://render.com). Both detect
   the Dockerfile / `requirements.txt` automatically. Set `DATABASE_URL` and
   `REDIS_URL` to the two strings above.
4. Run the table creation step from that repo's README once against the new
   database.
5. Set `liveUrl` in `lib/site-content.ts` to the deployed URL, ideally pointing
   straight at `/docs` so a visitor lands on the interactive Swagger page rather
   than a bare health check.

Two things worth doing before you link it publicly: tighten the rate limit (a
public demo will get scraped), and confirm the free tier doesn't cold-start so
slowly that a recruiter clicking the link sees a spinner for fifteen seconds. A
slow demo is worse than no demo.

---

## Deploying the site to GitHub Pages

**This project is already configured for it.** `next.config.mjs` has
`output: "export"` and `images.unoptimized: true`, and
`.github/workflows/deploy.yml` handles the build and publish automatically.

The repository **must** be named `JacobHailemariam.github.io`. That name serves
the site at `https://jacobhailemariam.github.io` with no extra configuration.
Any other name serves at `/repo-name/` and would require `basePath` and
`assetPrefix` set to match, or every CSS, JS, and image path 404s — and it would
also invalidate the QR code on the printed business card, which encodes the
`github.io` URL.

**First deploy:**

```powershell
npm install
npm run build          # confirm an `out` folder appears

git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/JacobHailemariam/JacobHailemariam.github.io.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source →
GitHub Actions**. Not "Deploy from a branch". This is the step people miss, and
skipping it produces a 404 with no error message anywhere.

Every push to `main` after that redeploys automatically. Watch progress in the
repository's **Actions** tab; a run takes two to four minutes.

**If the site loads as unstyled text**, the `.nojekyll` step didn't run or the
Source setting is still on "Deploy from a branch". GitHub Pages runs Jekyll by
default, and Jekyll ignores directories beginning with an underscore — which is
where Next.js puts all of its CSS and JavaScript.

## Structure

```
app/
  layout.tsx          Root layout, metadata, fonts, skip link
  page.tsx            Section composition and ordering
  fonts.ts            next/font setup for all three typefaces
  globals.css         Base styles, focus rings, reduced-motion fallback
components/
  layout/             SiteHeader (scroll spy), SiteFooter, SectionShell
  hero/               HeroSection, SensorField (the canvas)
  projects/           ProjectsSection, FeaturedProject, ProjectCard
  experience/  skills/  about/  contact/
  ui/                 Reveal, AssetImage, Primitives
lib/
  site-content.ts     All content
  palette.ts          All colour
  motion.ts           Shared easing curve
scripts/
  fetch-project-assets.sh
```

Only four files ship client JavaScript: `SiteHeader`, `HeroSection`,
`SensorField`, and `Reveal`. Everything else is a Server Component rendered to
static HTML.

---

## Design decisions, and why

Recorded here so you can defend them in an interview, or overrule them on
purpose rather than by accident.

**The hero canvas.** A lattice of points with a band of light sweeping across it,
leaving a decaying trail; points near the cursor light amber. The bet is that
the most eye-catching element on the page should also be the most on-subject
one — a hyperspectral sensor and a LiDAR unit both work by sweeping a scene and
reading a return per sample point, so the hero is an instrument acquiring a
frame. It's decorative and it's a statement of what you do.

Implementation notes, since this is the one non-obvious piece of code:

- Node positions are computed once per resize, never per frame — no allocation
  in the render loop, so no GC stutter.
- The sweep is driven by elapsed **time**, not a frame counter, so it runs at
  the same speed on a 60 Hz and a 144 Hz display.
- The trail is one line: `node.energy *= ENERGY_DECAY`. No trail buffer, no
  second canvas.
- `devicePixelRatio` is capped at 2. On a 3× phone the extra fill rate is the
  difference between 60 fps and 40, for pixels nobody can resolve.
- An `IntersectionObserver` cancels the animation frame loop entirely once the
  hero scrolls away. No reason to drain a battery animating something six
  sections above the viewport.
- Pointer tracking listens on `window`, not the canvas — the canvas sits at
  `z-index: -10` behind the text column and never receives events of its own.
  The bounding rect is cached rather than read per event, because
  `getBoundingClientRect()` forces a layout flush.

**Motion is spent in one place.** The hero gets an orchestrated load sequence.
Everything else gets a 14px rise and a fade, once. Scattering distinct entrance
effects across every section is the most reliable way to make a page read as
generated.

**Hierarchy through structure, not badges.** The GSIL block uses a layout that
appears exactly once on the page. That's how "this is the most important thing
here" gets communicated — not a FEATURED label on an otherwise identical card.
Project cards then alternate sides and use a 5/7 split rather than 6/6, so the
eye zig-zags instead of scanning three identical columns.

**Work before About.** Inverts the usual portfolio order, on the assumption that
a recruiter with two minutes wants evidence before biography.

**Numbers are set in monospace, and nothing else is.** Mono signals measured
output. Using it for decorative labels too would dilute exactly the signal it's
there to carry.

**Hover is almost nothing** — a colour shift and a border lightening. No lift, no
shadow, no scale. Those effects are fine individually; applying all of them to
every card is what makes a page feel like it came out of a kit.

**Numbered markers appear only on Experience**, because roles over time are
genuinely a sequence. A skills list has no first and last, so it doesn't get a
rail.

---

## Assumptions I made

- **No tech logos in Skills.** The brief allowed them, but a logo grid injects
  twenty foreign brand colours into a palette built on two accents, and reads as
  a badge collection rather than a claim about capability. Skills are set as
  words in the site's own type instead, each group carrying one line of context
  — which is what lets the hardware group say "schematic to fabricated board,"
  the differentiator the ML tags can't carry. If you want logos, add an `icon`
  field to `SkillGroup` and render it in `SkillsSection`.
- **Contact is a `mailto:`, not a form.** A form needs a backend, an anti-spam
  story, and a delivery guarantee, and it puts a step between the visitor and
  your inbox. Recruiters generally prefer the raw address anyway, so it threads
  in their own client.
- **"Open to Summer 2027 internships"** in the contact heading. Change it in
  `ContactSection.tsx` if the timing is wrong.
- **Zeus Electric Motorsport dated 2025 — present.** You didn't give dates;
  correct it in `lib/site-content.ts`.
- **The site claims no metrics you didn't provide.** Everything numeric came
  either from your brief or from your own repository READMEs — including the
  p95/p99 latencies and the 0/2000 failure count, which I pulled from the
  url-shortener README because they're stronger than the rounded figures.

---

## Accessibility and performance

- Semantic landmarks throughout; every section labelled by its own `<h2>`, so a
  screen-reader user can navigate by landmark.
- Skip link as the first tab stop.
- Focus rings are amber and never removed — amber specifically because violet is
  doing structural work everywhere else, so a violet focus ring would be
  camouflage.
- `prefers-reduced-motion` is honoured at three levels: Framer components render
  their final state directly, the canvas paints once and never starts its loop
  or attaches listeners, and a CSS block catches anything else.
- All images go through `next/image` with intrinsic dimensions from the content
  file, so the browser reserves the right box and the page doesn't reflow.
- Fonts are self-hosted by `next/font` — no runtime request to Google, and
  automatic size-adjusted fallbacks so text doesn't jump on load.
- External links carry `rel="noopener noreferrer"` and a screen-reader-only
  "opens in a new tab".

---

## A note on verification

This project was written without a network connection available to install
dependencies, so `npm run build` has not been executed against it. The source
was type-checked in isolation and reviewed by hand, but **run `npm install &&
npm run build` first** — before pushing anything to GitHub. If something does
fail, it will almost certainly be a font name or a dependency version, both of
which are in `app/fonts.ts` and `package.json` respectively.
