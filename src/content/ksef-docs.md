## Overview

`ksef-docs` is a translation mirror for documentation of Poland's KSeF 2.0 e-invoicing system. The project publishes the original Polish materials together with translated versions in English, Russian, and Ukrainian, then serves them as a static VitePress documentation site. It is built as a repeatable pipeline rather than a one-off translation dump, so content can be refreshed when upstream docs change.

## Why it exists

KSeF documentation is primarily published in Polish, which is a barrier for many developers, integrators, and teams outside Poland. `ksef-docs` exists to make those materials easier to consume in other languages while preserving the same source structure and technical context.

It also addresses maintenance overhead. Upstream documentation and OpenAPI definitions evolve over time; manually translating updates across multiple languages is difficult to sustain. This repository turns that into an automated process with tracked translation state and scheduled update runs.

## How it works

1. Upstream documentation is tracked through the `original/` git submodule, pointing to `CIRFMF/ksef-docs`.
2. Sync scripts detect what changed upstream and mark translated files that are now outdated.
3. Translation scripts run against a configured provider (Anthropic, OpenRouter, or Bedrock) and translate both markdown docs and OpenAPI content.
4. Outputs are stored in `translations/<lang>/`, while `translation.lock.json` records source commit/hash metadata per file.
5. Site build scripts prepare `site/<lang>/` for VitePress, normalize markdown/frontmatter, copy assets, and generate API reference pages.
6. GitHub Actions deploy the static site to GitHub Pages; a scheduled workflow runs translation updates on Mondays and Thursdays at 08:00 UTC.

## Technical details

| Aspect | Detail |
| --- | --- |
| Stack | TypeScript + Node scripts + VitePress |
| Tooling | Yarn 4 (`packageManager: yarn@4.11.0`) |
| Key dependencies | `openai`, `@anthropic-ai/sdk`, `@anthropic-ai/bedrock-sdk`, `gray-matter`, `dotenv` |
| Source model | Upstream docs via `original/` submodule |
| Output | Static multilingual docs site on GitHub Pages |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/ksef-docs)
- [Live site](https://flopsstuff.github.io/ksef-docs/)
- [Upstream source docs (CIRFMF/ksef-docs)](https://github.com/CIRFMF/ksef-docs)
