## Overview

`ksef-docs` is a maintained translation mirror of documentation for Poland's KSeF 2.0 e-invoicing system. The project publishes the original Polish docs together with translated versions in English, Russian, and Ukrainian, then serves everything as a static VitePress site. Instead of being a one-off translation dump, it is structured as a repeatable sync-and-translate pipeline that can keep pace with upstream updates.

## Why it exists

The upstream KSeF documentation is primarily Polish, which creates friction for developers and integration teams working in other languages. `ksef-docs` exists to lower that barrier by keeping non-Polish docs continuously available and close to the current upstream state.

It also solves maintenance pain: upstream docs and OpenAPI content change over time, and manually re-translating every update across multiple languages is hard to sustain. This repo turns that work into an automated workflow with tracked translation state and scheduled refreshes.

## How it works

1. The upstream documentation is tracked via the `original/` git submodule (`CIRFMF/ksef-docs`).
2. Sync scripts detect changed upstream files and identify what is outdated.
3. Translation scripts call a configured LLM provider (Anthropic, OpenRouter, or Bedrock) to translate docs and OpenAPI while preserving markdown structure.
4. Per-language outputs are written under `translations/<lang>/`, and `translation.lock.json` records source commit/hash metadata.
5. Build scripts prepare a VitePress-ready tree in `site/<lang>/`, normalize markdown/frontmatter, copy assets, and generate an API reference page.
6. GitHub Actions deploy the built site to GitHub Pages, and a scheduled workflow runs translation updates on Mondays and Thursdays at 08:00 UTC.

## Technical details

| Aspect | Detail |
| --- | --- |
| Stack | TypeScript + Node scripts, VitePress |
| Package tooling | Yarn 4 (`packageManager: yarn@4.11.0`) |
| Core deps | `openai`, `@anthropic-ai/sdk`, `@anthropic-ai/bedrock-sdk`, `gray-matter`, `dotenv` |
| Source model | Upstream docs via git submodule (`original/`) |
| Output | Static multilingual docs site on GitHub Pages |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/ksef-docs)
- [Live site](https://flopsstuff.github.io/ksef-docs/)
- [Upstream source docs (CIRFMF/ksef-docs)](https://github.com/CIRFMF/ksef-docs)
