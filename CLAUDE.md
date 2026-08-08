# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the **Flopsstuff** organization `.github` repo (`github.com/Flopsstuff/.github`). It holds two independent things:

1. **The org profile** (`profile/`) - static assets GitHub renders on the org landing page. No build.
2. **The landing site** (repo root) - a static site deployed to Cloudflare Workers at **https://stuff.flopbut.pl**, ported from the sibling `aignite` project's stack.

These are unrelated to each other; a change to one rarely touches the other.

## Writing conventions

**No em dashes.** Write a plain ASCII hyphen `-`, never `—` (U+2014) or `–` (U+2013). This holds for
everything authored here: site copy (`src/content/*.md`, `src/data/projects.ts`), page titles and meta
descriptions, both READMEs, the brand guide, and these docs. The repo is currently clean of both
characters, so `grep -rn "—\|–"` over a change should come back empty before you commit.

## Org profile (`profile/`)

- `profile/README.md` - the org landing page on GitHub. A curated, grouped table of public projects (AI & developer tooling, Polish e-Invoicing/KSeF, hardware, and forks/contributions). Each row has a one-line description and **Repo** / optional **Web** links. First line embeds the logo via `<img src="logo.svg" width="80">`.
- `profile/logo.svg` - hand-built 7-segment LED display spelling the "FS" monogram in red (`#ff2d2d` lit, `#3a0c0c` dark) on a dark rounded rect. Segments are individual `<polygon>`s tagged `class="seg seg-<a-g> on|off"` + `data-seg`; the two digit groups are positioned with `transform="translate(...)"`. Toggling a segment = flip both its fill and the `on`/`off` class. No generator script - edit the SVG directly.
- `profile/logo.png` - raster export of the SVG; keep in sync when the SVG changes.

## Landing site (repo root)

A **Vite + React 19 + React Router** single-page app (`src/`), built to `dist/` and served by Cloudflare Workers' static-assets handler with SPA not-found fallback. See [ADR 0001](docs/decisions/0001-landing-spa-architecture.md) for why. Plain CSS with design tokens - no CSS framework.

- `index.html` (repo root) - Vite entry; mounts `src/main.tsx` into `#root`.
- `src/data/projects.ts` - **the project catalogue** (the source of truth for cards + links). One `Project` per public org repo: `slug`, `name`, `category`, `tagline`, `description`, `repoUrl`, optional `webUrl`/`npmUrl`, `status`. Grouped into four categories (AI & dev tooling, KSeF, hardware, forks). Keep this in sync with the org's public repos and with `profile/README.md`.
- `src/content/<slug>.md` - long-form detail-page body per project, loaded eagerly as raw strings via `import.meta.glob` (`src/content/index.ts`). A project with no `.md` (or an empty one) simply renders without a long body. Authoring structure: `docs/content-authoring.md`.
- `src/pages/` (`Home`, `ProjectDetail`), `src/components/` (`Header`, `Footer`, `ProjectCard`, `NotFound`), `src/styles/tokens.css` - the UI. Detail pages live at `/project/<slug>`.
- `dist/` - Vite build output; this is what `wrangler.json` deploys (`assets.directory: ./dist`). Gitignored (`.gitignore`: `/dist`), so run `yarn build` before any local `yarn deploy` - wrangler ships whatever happens to be on disk.
- `docs/flopsstuff.md` - narrative content source for the landing copy; `docs/brand/` holds the brand/design-system reference.
- `README.md` (root) - a generic Cloudflare "Next.js Framework Starter" template readme carried over verbatim from `aignite`. **It is inaccurate** (this repo is Vite + React, not Next.js) - treat the section below as the source of truth, not that README.

### Tooling & commands

- Package manager: **Yarn 4.6.0** via Corepack (`corepack enable`), pinned by `.yarnrc.yml` (`yarnPath: .yarn/releases/yarn-4.6.0.cjs`). That release binary and `yarn.lock` are committed on purpose - CI breaks without them.
- `yarn install --immutable` - install (React, React Router, react-markdown, Vite, wrangler).
- `yarn dev` - Vite dev server with HMR (day-to-day local work).
- `yarn build` - `tsc -b && vite build` → `dist/` (typecheck + production bundle).
- `yarn preview` - `wrangler dev`, serves the built `dist/` the way Workers will.
- `yarn deploy` - `wrangler deploy`. The script sources `.env` first (`set -a; . ./.env`), so local deploys pick up credentials from there automatically. Run `yarn build` first - `deploy` ships whatever is in `dist/`.

### Deploy & domain

- `wrangler.json`: worker name `flopsstuff`, `assets.directory: ./dist`, SPA not-found handling, and a route `stuff.flopbut.pl` with `custom_domain: true`.
- `stuff.flopbut.pl` is a **subdomain** of the `flopbut.pl` zone (same Cloudflare account) - not a separately registered domain. `custom_domain: true` makes wrangler create the DNS record + TLS cert on first deploy.
- The site previously lived at `fs.aignite.pl` (zone `aignite.pl`). Dropping it from `routes` and redeploying was enough: wrangler unbound the custom domain **and** deleted its DNS record.
- `fs.aignite.pl` now **301-redirects** here, preserving path and query. Two pieces on the `aignite.pl` zone: a proxied `AAAA fs → 100::` record (a discard address - it only has to resolve and hit Cloudflare's edge) plus a Redirect Rule matching `hostname eq fs.aignite.pl`, action `concat("https://stuff.flopbut.pl", http.request.uri.path)`, status 301, preserve query string. The hostname filter matters: without it the rule would swallow `aignite.pl` and `soulgrep.aignite.pl` too.
- The deploy token is scoped to `flopbut.pl` only, so anything touching the `aignite.pl` zone (that redirect included) has to go through the dashboard.
- Cloudflare account: `serg.flop@gmail.com`, account ID `42548ca95c85a68b4ce20ad79b805334`.

### CI

- `.github/workflows/deploy.yml` deploys on push to `main` (and `workflow_dispatch`): Node 22 → Corepack → `yarn install --immutable` → `yarn build` → `cloudflare/wrangler-action@v3` with `command: deploy`. CI builds `dist/` itself - it is not in the repo.
- CI auth uses two repo secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Both are already set.
- The API token needs: **Account › Workers Scripts: Edit**, **Account › Account Settings: Read**, **Zone › Workers Routes: Edit**, and **Zone › DNS: Edit** on `flopbut.pl` (DNS Edit is required whenever the custom domain is (re)created).

### Credentials

- Local: `.env` (gitignored) holds `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. `.env.example` is the committed template documenting both.
- CI: the same two vars live as GitHub Actions secrets. Actions does not read `.env`, so the two stores are maintained separately (e.g. `gh secret set --env-file .env`).

## Validation

No automated tests. Verify: `yarn build` (typecheck + bundle) is the primary gate; `yarn dev` to eyeball changes locally, or `yarn deploy --dry-run` for config/asset sanity; `curl -I https://stuff.flopbut.pl` after a deploy; preview the profile README's Markdown and open the SVG in a browser. When adding/removing a project, update `src/data/projects.ts`, `profile/README.md`, and (optionally) `src/content/<slug>.md` together.
