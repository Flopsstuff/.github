# Flop's Stuff Landing

The landing site at **https://stuff.flopbut.pl** - a React SPA deployed on Cloudflare Workers.

## Stack

- **Vite + React 19 + React Router v7** - SPA, client-side routing.
- **Plain CSS with design tokens** - `src/styles/tokens.css` is the single source of truth for color, typography, spacing, radius, shadows, and motion. Components consume only semantic tokens (`--color-primary`, not `--cyan-400`).
- **Cloudflare Workers static assets** - served via `wrangler.json`; SPA not-found handling re-routes all 404s to `index.html`.
- **Domain** - `stuff.flopbut.pl` (subdomain of `flopbut.pl`, same CF account). Moved here from `fs.aignite.pl`.

## Adding a project

All projects live in **`src/data/projects.ts`**. Add a new entry to the `projects` array -
**at the top of its category block, never at the end**:

```ts
{
  slug: "my-project",          // URL slug - must be unique
  name: "my-project",          // display name
  category: "ai-dev-tooling",  // "ai-dev-tooling" | "ksef" | "hardware" | "forks"
  tagline: "One sentence.",    // shown on the card (clamped to 2 lines)
  description: "Longer…",      // shown on the detail page
  image: "/projects/my-project.jpg",        // card + detail hero, see below
  repoUrl: "https://github.com/Flopsstuff/my-project",
  webUrl: "https://optional.example.com",   // omit if none
  status: "active",            // "active" | "experimental" | "fork" - omit if unknown
}
```

The home page and detail pages pick it up automatically.

### Newest first (house rule)

A new project goes **first in its section** on https://stuff.flopbut.pl and everything else
shifts down. The home page renders each category straight from this array's order
(`getProjectsByCategory` only filters, it does not sort), so position in the file *is* position
on the page: put the new entry directly above the first existing entry of the same `category`.

The same rule applies to the org profile list in **`profile/README.md`** - a new row goes at the
top of its table, not appended to the bottom. Adding a project means touching both files, plus
an optional detail page in `src/content/<slug>.md`.

### Card images

Every project carries one image, used both on its card and as the hero on its detail page:

```
public/projects/<slug>.jpg     1200x675 (16:9), JPEG q82, ideally under ~150 KB
```

`image` in `projects.ts` points at it (`/projects/<slug>.jpg`). The field is optional and the
card degrades to no image, but the grid only looks right when every project has one - the frame
is a fixed 16:9 rectangle with `object-fit: cover`, so whatever you put in is cropped to the same
shape as everything else.

One image language: dark, low-key, a single accent, no legible text. There are two ways to produce
it, and picking between them is a judgement about the image, not about what the repo happened to
ship.

**Tier A - generated art.** The default. Near-black background, matte materials, volumetric haze, a
single accent light, isometric or low-angle hero framing, no lettering. Match the existing set
rather than inventing a style.

**Tier B - a product shot.** Allowed when the product has a dark UI *and* a region that still reads
as shape at card size. Shoot its own dark theme, crop to one region, and strip every frame around
it: no browser chrome, no OS chrome, no tab bars, URL bars or bookmarks, and no hero headline (the
card prints the project's title directly underneath, so a headline in the image just says it
twice). Source from the project's repo or its live site at 1600x900; copy the file in rather than
hot-linking, because hot-linking GitHub costs a 2 MB download per card and anything LFS-tracked
needs `media.githubusercontent.com` (`raw.` serves the pointer file, not the image).

There is no third option. Centring a square logo on a blurred, darkened copy of itself used to be
the fallback for projects with no imagery; it reads as an apology for not having a picture, and it
is the one treatment that looks worse the larger it gets. Generate a Tier A image instead.

#### The art direction, measurably

New generated art is checked with:

```
python3 scripts/check-card-images.py public/projects/<slug>.jpg
```

The thresholds are derived from the accepted set, not invented: mean sRGB luma under 25%, 95th
percentile luma at least 10%, under 1.5% of pixels above 90% luma, and bright saturated red under
5% of the frame. Run it over the whole directory - images that are deliberately out of direction
are listed in the script and report as `KNOWN` rather than failing.

Why those and not a tidy band: the grid is dark by default and light under
`prefers-color-scheme: light`, and the thing that breaks in both directions at once is a blown-out
region, which flashbangs on a dark card and dissolves into a light one. That is the highlight
threshold, and it is the sharp one. There is deliberately **no floor on mean luma** - nothing in
the set has ever failed for being too dark, and a mean floor rejects correct frames that are mostly
shadow. The 95th-percentile check is the real floor: it asks whether the frame has a subject at
all, not whether it is bright on average.

The red threshold is the brand rule applied to imagery. `#ff2d2d` is the logo's and the UI keeps
its hands off it, but the art direction is built on red, so imagery gets an explicit carve-out:
use the darker end of the ramp, never `#ff2d2d` itself, and keep bright saturated red under 5% of
the frame so no card out-shouts the 28px header mark.

Two things the script cannot check, and they matter more than the numbers:

- **The card-size read.** Downscale to 342x192 - the real card at a 1440 viewport - and look. One
  recognisable subject, or it fails no matter what it measures.
- **No legible or pseudo-legible text**, checked at full size: lettering that reads as texture on
  the card resolves into garbled fake words on the detail-page hero.

## Commands

| Command | Action |
| --- | --- |
| `yarn install --immutable` | Install dependencies (pinned Yarn 4.6.0 via Corepack) |
| `yarn build` | TypeScript check + Vite production build → `dist/` |
| `yarn preview` | `wrangler dev` - serve the `dist/` build locally at `http://localhost:8787` |
| `yarn deploy` | Deploy to Cloudflare Workers (sources `.env` for credentials) |
| `yarn deploy --dry-run` | Validate config and asset bundle without actually deploying |

## Local credentials

Copy `.env.example` to `.env` and fill in:

```
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=42548ca95c85a68b4ce20ad79b805334
```

`yarn deploy` sources `.env` automatically. The file is gitignored.

## CI / Deploy on push

`.github/workflows/deploy.yml` deploys on every push to `main`:
Node 22 → Corepack → `yarn install --immutable` → `wrangler deploy` (via `cloudflare/wrangler-action@v3`).

Required GitHub Actions secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (both already set).

## Design system

The brand guide and design tokens live in `docs/brand/`:

- `docs/brand/tokens.css` → copied to `src/styles/tokens.css` (Iris owns this file).
- `docs/brand/README.md` - palette, typography, spacing, logo usage, do/don't.

Primary palette: electric cyan (`--color-primary`). Red (`#ff2d2d`) is the logo/accent color only - never a primary CTA or body link color.

## File structure

```
src/
  components/     Header, Footer, ProjectCard
  pages/          Home, ProjectDetail (includes in-app 404 state)
  data/           projects.ts - the project registry
  styles/         tokens.css - design tokens (import once at root)
  index.css       global resets + token import
  main.tsx        router + Layout (Header + Outlet + Footer)
docs/
  brand/          Design system (Iris)
  decisions/      Architecture Decision Records
public/           logo.svg, favicon.svg
```
