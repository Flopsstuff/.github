# Flopsstuff Landing

The landing site at **https://stuff.flopbut.pl** — a React SPA deployed on Cloudflare Workers.

## Stack

- **Vite + React 19 + React Router v7** — SPA, client-side routing.
- **Plain CSS with design tokens** — `src/styles/tokens.css` is the single source of truth for color, typography, spacing, radius, shadows, and motion. Components consume only semantic tokens (`--color-primary`, not `--cyan-400`).
- **Cloudflare Workers static assets** — served via `wrangler.json`; SPA not-found handling re-routes all 404s to `index.html`.
- **Domain** — `stuff.flopbut.pl` (subdomain of `flopbut.pl`, same CF account). Moved here from `fs.aignite.pl`.

## Adding a project

All projects live in **`src/data/projects.ts`**. Add a new entry to the `projects` array:

```ts
{
  slug: "my-project",          // URL slug — must be unique
  name: "my-project",          // display name
  category: "ai-dev-tooling",  // "ai-dev-tooling" | "ksef" | "hardware" | "forks"
  tagline: "One sentence.",    // shown on the card (clamped to 2 lines)
  description: "Longer…",      // shown on the detail page
  repoUrl: "https://github.com/Flopsstuff/my-project",
  webUrl: "https://optional.example.com",   // omit if none
  status: "active",            // "active" | "experimental" | "fork" — omit if unknown
}
```

The home page and detail pages pick it up automatically — no other changes needed.

## Commands

| Command | Action |
| --- | --- |
| `yarn install --immutable` | Install dependencies (pinned Yarn 4.6.0 via Corepack) |
| `yarn build` | TypeScript check + Vite production build → `dist/` |
| `yarn preview` | `wrangler dev` — serve the `dist/` build locally at `http://localhost:8787` |
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
- `docs/brand/README.md` — palette, typography, spacing, logo usage, do/don't.

Primary palette: electric cyan (`--color-primary`). Red (`#ff2d2d`) is the logo/accent color only — never a primary CTA or body link color.

## File structure

```
src/
  components/     Header, Footer, ProjectCard
  pages/          Home, ProjectDetail (includes in-app 404 state)
  data/           projects.ts — the project registry
  styles/         tokens.css — design tokens (import once at root)
  index.css       global resets + token import
  main.tsx        router + Layout (Header + Outlet + Footer)
docs/
  brand/          Design system (Iris)
  decisions/      Architecture Decision Records
public/           logo.svg, favicon.svg
```
