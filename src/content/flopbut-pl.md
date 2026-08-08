## Overview

**flopbut.pl** is the personal site of Flop Butylkin - the hub the rest of Flop's
Stuff hangs off. It introduces the person behind the projects (twenty years in
software: AI agent orchestration and developer tooling now, iOS/Android/React
Native delivery behind it) and the crew of AI agents that run the shop. It is a
trilingual Astro site - English at the root, Russian under `/ru/`, Polish under
`/pl/` - served from Cloudflare Workers, and this very catalogue lives on its
`stuff.` subdomain.

## Why it exists

Every one of these experiments needed a front door: a single place that says who
Flop is, links out to the work, and can be handed to a client, a collaborator, or
a hiring manager without a résumé attached. It doubles as the canonical home the
catalogue at [stuff.flopbut.pl](https://stuff.flopbut.pl) branches off, so the
personal brand and the project index share one roof and one look.

Keeping it **static by default** is deliberate - a portfolio should be cheap to
run, impossible to knock over, and fast everywhere. Nothing dynamic runs unless a
page explicitly opts in.

## How it works

- **Static-first Astro.** Every page is prerendered at build time and served
  straight from Workers Static Assets. The worker only executes for routes that
  opt out of prerendering - today that is just the contact endpoint.
- **Typed i18n.** All copy lives in `src/i18n/ui.ts`. The English dictionary
  defines the shape and the Russian and Polish dictionaries are typed against it,
  so a missing translation is a build error rather than a blank line on the page.
- **Self-hosted fonts.** Geologica, Golos Text, and IBM Plex Mono are subset at
  build time and self-hosted - no third-party font requests at runtime.
- **A dormant contact form.** `src/pages/api/contact.ts` is written but answers
  `503` until its secrets exist. When enabled, the pipeline runs
  validation → honeypot → Cloudflare Turnstile siteverify → Telegram, so a
  submission lands as a Telegram message with no database or mail server to run.

Pushes to `main` build and deploy through GitHub Actions.

## Technical details

| Aspect     | Detail                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Astro 7, static output with a per-route SSR escape hatch               |
| Hosting    | Cloudflare Workers (`@astrojs/cloudflare`)                             |
| Styling    | Tailwind 4 tokens over hand-written component CSS                      |
| Fonts      | Geologica, Golos Text, IBM Plex Mono - self-hosted, subset at build    |
| Languages  | English (root), Russian (`/ru/`), Polish (`/pl/`)                      |
| Serverless | One dormant endpoint - Turnstile-guarded contact form → Telegram       |
| Tooling    | TypeScript strict, Biome, GitHub Actions                              |
| Licence    | MIT                                                                    |

## Links

- [Repository](https://github.com/Flopsstuff/flopbut.pl)
- [Live site](https://flopbut.pl)
