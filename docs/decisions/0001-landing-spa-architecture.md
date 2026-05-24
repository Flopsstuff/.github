# 0001 — Landing site: React SPA on Cloudflare Workers

- **Status:** Accepted
- **Date:** 2026-05-24
- **Decider:** Daedalus (CTO)
- **Issue:** FLO-175

## Context

The landing site at **https://fs.aignite.pl** is currently a placeholder (`static/index.html` →
single `<h1>Flopsstuff</h1>`). FLO-175 asks for a real landing: a "business card" that lists all
Flopsstuff projects, with a dedicated page per project, built so we can keep adding projects and
sections cheaply over time. It must stay **static + serverless**, deployed exactly as today
(Cloudflare Workers static assets via `wrangler`, custom domain `fs.aignite.pl`).

The canonical project list already exists in `profile/README.md` (the GitHub org profile), grouped
into: AI & Developer Tooling, Polish e-Invoicing (KSeF), Hardware & Systems, Forks & Contributions.
That grouping is the source content for the landing.

Brand constraint from the issue: **red (`#ff2d2d`) is reserved for the logo and as a sparing accent
only.** The primary palette must NOT be red. Branding/design system is owned by Iris.

## Options considered

1. **Hand-written multi-page static HTML.** Cheapest to deploy, but every new project means
   copy-pasting HTML; no shared layout/component model; poor fit for "lay out the architecture for
   expansion." Rejected.
2. **A framework with SSR/edge rendering (Next.js on Workers, Astro SSR).** More moving parts than a
   pure-static card site needs; changes the deploy story. Over-engineered for content that is
   effectively a static catalogue. Rejected for now.
3. **Vite + React + React Router SPA, built to static assets, served by the existing Workers
   static-assets handler.** Boring, standard, debuggable; keeps deploy identical (still just static
   files behind `wrangler deploy`); data-driven so adding a project is a one-line registry edit.
   **Chosen.**

## Decision

Build a **client-rendered React SPA with Vite + TypeScript**, output to static assets and served by
the same Cloudflare Workers static-assets handler we use today.

### Stack
- **Vite + React + TypeScript.** Standard, well-documented, fast builds.
- **React Router (data router)** for client-side routing. The Workers config already has
  `not_found_handling: "single-page-application"`, so deep links to `/projects/:slug` resolve to
  `index.html` and the router takes over. No server code.
- **Styling: CSS custom properties (design tokens) + CSS Modules.** No Tailwind, no CSS-in-JS
  runtime — plain CSS a maintainer can read at 2am. Iris's design system lands as a tokens file
  (CSS custom properties) plus brand guidance; components consume the tokens.

### Project data architecture (built for expansion)
- A single **typed project registry** is the source of truth: `src/data/projects.ts` exporting an
  array of `Project` objects. Shape (minimum):
  ```ts
  type ProjectCategory = "ai-dev-tooling" | "ksef" | "hardware" | "forks";
  interface Project {
    slug: string;          // URL segment, e.g. "cotel"
    name: string;
    category: ProjectCategory;
    tagline: string;       // one line for the card
    description: string;   // longer copy for the detail page
    repoUrl: string;
    webUrl?: string;
    status?: "active" | "experimental" | "fork";
    // optional richer detail content added later (markdown/TSX) without schema churn
  }
  ```
- **Home (`/`)** renders the business card: hero + projects grouped by category (mirroring
  `profile/README.md`).
- **Project detail (`/projects/:slug`)** resolves the project from the registry by slug and renders
  a template. Adding a project = appending one registry entry; a detail page exists automatically.
- Categories are data, not hard-coded layout — new sections are additive.

### Deploy (unchanged story)
- `yarn build` runs Vite → emits to `dist/`.
- `wrangler.json` `assets.directory` changes from `./static` to `./dist`. Everything else
  (worker name, route `fs.aignite.pl`, SPA fallback, observability) stays.
- CI (`.github/workflows/deploy.yml`) gains a `yarn build` step before
  `cloudflare/wrangler-action@v3`. Yarn 4 immutable install is preserved.
- Still one worker, no server runtime, no new infrastructure.

## Consequences

- **Good:** Adding projects/sections is a registry edit; shared layout and components; deploy and
  hosting model are unchanged (static assets on Workers); zero server code to operate.
- **Cost:** Introduces a build step (Vite) — CI and local deploy must build before `wrangler deploy`.
  This is the only material change to the workflow.
- **Reversible enough:** framework/styling choices are two-way doors; the hosting model (static on
  Workers) is the part we are committing to, and it matches what already runs.
- **Brand:** the non-red primary palette is a hard constraint handed to Iris; implementation
  consumes her tokens rather than inventing colors.

## Decision lenses applied
- **Boring tech beats clever tech** — Vite + React + plain CSS over SSR/edge frameworks.
- **One container, one volume** (here: one worker, static assets) — no new runtime or service.
- **Reversibility** — committing only to the static-on-Workers hosting model; framework is swappable.
- **Small-team discipline** — a stack Wayland can implement and I can review without specialist edge-runtime knowledge.
