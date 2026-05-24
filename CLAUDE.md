# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the **Flopsstuff** organization `.github` repo (`github.com/Flopsstuff/.github`). It holds two independent things:

1. **The org profile** (`profile/`) — static assets GitHub renders on the org landing page. No build.
2. **The landing site** (repo root) — a static site deployed to Cloudflare Workers at **https://fs.aignite.pl**, ported from the sibling `aignite` project's stack.

These are unrelated to each other; a change to one rarely touches the other.

## Org profile (`profile/`)

- `profile/README.md` — the org landing page on GitHub. A curated, grouped table of public projects (AI & developer tooling, Polish e-Invoicing/KSeF, hardware, and forks/contributions). Each row has a one-line description and **Repo** / optional **Web** links. First line embeds the logo via `<img src="logo.svg" width="80">`.
- `profile/logo.svg` — hand-built 7-segment LED display spelling the "FS" monogram in red (`#ff2d2d` lit, `#3a0c0c` dark) on a dark rounded rect. Segments are individual `<polygon>`s tagged `class="seg seg-<a-g> on|off"` + `data-seg`; the two digit groups are positioned with `transform="translate(...)"`. Toggling a segment = flip both its fill and the `on`/`off` class. No generator script — edit the SVG directly.
- `profile/logo.png` — raster export of the SVG; keep in sync when the SVG changes.

## Landing site (repo root)

Static site, no framework — just `static/index.html` + `static/favicon.svg`, served by Cloudflare Workers' static-assets handler.

- `static/` — what gets deployed (`wrangler.json` → `assets.directory`). Currently a placeholder `<h1>Flopsstuff</h1>`.
- `docs/flopsstuff.md` — content source for the landing copy (mirrors `aignite`'s `Docs/aignite.md`); placeholder for now. Build the real page in `static/` from this.
- `README.md` (root) — a generic Cloudflare "Next.js Framework Starter" template readme carried over verbatim from `aignite`. **It is inaccurate** (this repo has no Next.js, just static files) — treat the section below as the source of truth, not that README.

### Tooling & commands

- Package manager: **Yarn 4.6.0** via Corepack (`corepack enable`), pinned by `.yarnrc.yml` (`yarnPath: .yarn/releases/yarn-4.6.0.cjs`). That release binary and `yarn.lock` are committed on purpose — CI breaks without them.
- `yarn install --immutable` — install (`wrangler` is the only dep).
- `yarn preview` — `wrangler dev`, local server.
- `yarn deploy` — `wrangler deploy`. The script sources `.env` first (`set -a; . ./.env`), so local deploys pick up credentials from there automatically.

### Deploy & domain

- `wrangler.json`: worker name `flopsstuff`, `assets.directory: ./static`, SPA not-found handling, and a route `fs.aignite.pl` with `custom_domain: true`.
- `fs.aignite.pl` is a **subdomain** of the existing `aignite.pl` zone (same Cloudflare account) — not a separately registered domain. `custom_domain: true` makes wrangler create the DNS record + TLS cert on first deploy.
- Cloudflare account: `serg.flop@gmail.com`, account ID `42548ca95c85a68b4ce20ad79b805334`.

### CI

- `.github/workflows/deploy.yml` deploys on push to `main` (and `workflow_dispatch`): Node 22 → Corepack → `yarn install --immutable` → `cloudflare/wrangler-action@v3` with `command: deploy`.
- CI auth uses two repo secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Both are already set.
- The API token needs: **Account › Workers Scripts: Edit**, **Account › Account Settings: Read**, **Zone › Workers Routes: Edit**, and **Zone › DNS: Edit** on `aignite.pl` (DNS Edit is required whenever the custom domain is (re)created).

### Credentials

- Local: `.env` (gitignored) holds `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. `.env.example` is the committed template documenting both.
- CI: the same two vars live as GitHub Actions secrets. Actions does not read `.env`, so the two stores are maintained separately (e.g. `gh secret set --env-file .env`).

## Validation

No automated tests. Verify: `yarn deploy --dry-run` for config/asset sanity; `curl -I https://fs.aignite.pl` after a deploy; preview the profile README's Markdown and open the SVG in a browser.
