# Project page content — authoring guide

Every project on the landing site (https://fs.aignite.pl) has a detail page at
`/projects/<slug>`. The short tagline + one-paragraph description come from
`src/data/projects.ts`. The **long-form body** below the description is authored
as Markdown, one file per project:

```
src/content/<slug>.md
```

Files are loaded at build time (`src/content/index.ts`). If a project has no
`.md` file, the page just shows the tagline + description — no error. So you can
add pages incrementally, one PR per project, with zero merge conflicts because
each project is its own file.

## How to research a project

Do not invent facts. Before writing, actually look at the source:

1. Open the project's GitHub repo (`repoUrl` in `src/data/projects.ts`) and read
   its README, and the live `webUrl` if it has one.
2. Skim the code/structure enough to describe **what it is, why it exists, and
   how it works** accurately. Note the real language/stack, not a guess.
3. If you cannot verify a claim, leave it out. A shorter honest page beats a
   padded one. Never fabricate benchmarks, users, or features.

## Required structure

Write the body in this order. Start with an `## Overview` H2 (the page already
renders the project name as the H1 and the tagline above your content — do **not**
repeat the title as an H1).

```markdown
## Overview

2–4 sentences: what this project is, in plain language, for someone who has
never heard of it.

## Why it exists

The problem it solves and who it's for. What was painful or missing before it.

## How it works

The mechanism. Architecture, the main flow, key components. Use a short list or
a small fenced code block / command example where it helps. Be concrete.

## Technical details

Language(s), framework(s), notable dependencies, how it's run or installed,
licensing if relevant. A table is fine here. Keep it factual.

## Links

- [README / docs](…)
- [Live site](…)   ← only if real
- any genuinely useful external reference (spec, upstream project, package page)
```

Sections that genuinely don't apply to a project can be dropped, but `Overview`,
`Why it exists`, and `How it works` are mandatory. Aim for ~200–500 words of
substance — detailed, not padded.

## Formatting rules

- Use `##` for top-level sections, `###` for sub-sections. No `#` (H1).
- Links open in a new tab automatically — just write normal Markdown links.
- Inline code with backticks; multi-line with triple-fenced blocks. GFM tables
  and task lists are supported (remark-gfm).
- **Images** are optional. Only use an image you can actually link to: hot-link
  a diagram or screenshot from the project's own repo
  (`https://raw.githubusercontent.com/Flopsstuff/<repo>/<branch>/<path>`) or its
  live site. Always include alt text: `![alt](url)`. Do not commit large binary
  assets into this repo for this.

## Verify before you open the PR

```bash
yarn install --immutable
yarn build           # must pass (tsc + vite)
yarn dev             # open http://localhost:5173/projects/<slug> and read your page
```

Check that the page renders, links work, and there are no console errors. One
project = one branch (`flo-<issue>-content-<slug>`) = one PR. Put a screenshot
or a note of what you verified in the PR description.

See `src/content/cotel.md` for a reference example that meets this bar.
