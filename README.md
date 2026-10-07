# Jacob Hailemariam — Portfolio

Personal portfolio site: [jacobhailemariam.github.io](https://jacobhailemariam.github.io)

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.
Exported as a static site and deployed to GitHub Pages.

## Running locally

Requires Node 18.17 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (static export to `out/`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

## Editing content

| File | Controls |
| --- | --- |
| `lib/site-content.ts` | All copy, projects, experience, skills, links, and images |
| `lib/palette.ts` | Every colour on the site, including the hero canvas |
| `tailwind.config.ts` | Type scale, fonts, spacing, easing |

The palette is a standalone module because the hero canvas paints with the 2D
context and needs literal colour strings at runtime. Both Tailwind and the
canvas import from it, so the colours stay in sync.

### Images

Images live in `public/images/` and are referenced from `lib/site-content.ts`.
Any image whose `src` is `null` renders as a labelled placeholder frame instead
of a broken image.

`scripts/fetch-project-assets.sh` pulls project figures (training curves,
confusion matrix, API screenshots) directly from the source repositories.

### Image credits

- The hyperspectral and ground-truth figures use the **Houston 2013** scene
  (2013 IEEE GRSS Data Fusion Contest).
- The architecture diagram is **DAHGMN**: Xie et al., IEEE TGRS vol. 63, 2025,
  doi:10.1109/TGRS.2025.3605373.

## Deployment

`next.config.mjs` uses `output: "export"` with `images.unoptimized: true`, and
`.github/workflows/deploy.yml` builds and publishes the site on every push to
`main`. GitHub Pages is set to **Source: GitHub Actions**.

The workflow writes a `.nojekyll` file so GitHub Pages serves the `_next/`
directory.

## Structure

```
app/
  layout.tsx          Root layout, metadata, fonts, skip link
  page.tsx            Section composition and ordering
  fonts.ts            next/font setup
  globals.css         Base styles, focus rings, reduced-motion fallback
components/
  layout/             SiteHeader (scroll spy), SiteFooter, SectionShell
  hero/               HeroSection, SensorField (canvas animation)
  projects/           ProjectsSection, FeaturedProject, ProjectCard, FusionExplorer
  experience/  skills/  about/  contact/
  ui/                 Reveal, AssetImage, Primitives
lib/
  site-content.ts     All content
  palette.ts          All colour
  motion.ts           Shared easing curve
  fusion-sim.ts       Simulation behind the interactive fusion explorer
scripts/
  fetch-project-assets.sh
```

Most sections are Server Components rendered to static HTML. Client JavaScript
is limited to the header scroll spy, the hero canvas, the reveal animations,
and the interactive fusion explorer.

## Hero canvas

The hero is a lattice of points with a band of light sweeping across it,
modelled on how hyperspectral and LiDAR sensors scan a scene.

- Node positions are computed on resize only, so the render loop allocates nothing.
- The sweep is time-based, so it runs at the same speed on 60 Hz and 144 Hz displays.
- `devicePixelRatio` is capped at 2.
- An `IntersectionObserver` stops the animation loop when the hero is off-screen.
- With `prefers-reduced-motion`, the lattice is painted once and never animated.

## Accessibility and performance

- Semantic landmarks; each section is labelled by its own `<h2>`.
- Skip link as the first tab stop, and visible focus rings throughout.
- `prefers-reduced-motion` is respected by Framer components, the canvas, and CSS.
- Images use `next/image` with intrinsic dimensions to avoid layout shift.
- Fonts are self-hosted via `next/font`.
- External links use `rel="noopener noreferrer"` and announce that they open in a new tab.
