# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The **Flopsstuff** GitHub organization profile. It has no build, no tests, and no application code — just static assets that GitHub renders on the org landing page.

- `profile/README.md` — the org landing page. A curated, grouped table of the org's public projects (AI & developer tooling, Polish e-Invoicing/KSeF, hardware, and forks/contributions). Each row has a one-line description and **Repo** / optional **Web** links.
- `profile/logo.svg` — the org logo: a hand-built 7-segment LED display spelling the "FS" monogram in red (`#ff2d2d` on lit segments, `#3a0c0c` on dark ones), on a dark rounded rect. Segments are individual `<polygon>` elements tagged with `class="seg seg-<a-g> on|off"` and `data-seg`, lit/unlit via fill + a `glow` Gaussian-blur filter.
- `profile/logo.png` — a raster export of the SVG, referenced nowhere; keep it in sync when the SVG changes.

The README's first line embeds the logo with `<img src="logo.svg" width="80">`.

## Working notes

- **Editing the project list:** keep the grouped-table structure and the `[Repo](...) · [Web](...)` link pattern. Web links point to a hosted version/package/upstream home; omit when none exists.
- **Editing the logo:** the SVG is hand-crafted (see commit history — multiple deliberate design iterations). The two digit groups are positioned by `transform="translate(...)"`; each digit is the same 7 polygon definitions with different `on`/`off` states and fills. Toggling a segment means flipping both its fill color and the `on`/`off` class. There is no generator script — edit the SVG directly, then re-export `logo.png` to match.
- **Validation:** no automated checks exist. Verify changes by previewing the rendered Markdown and opening the SVG in a browser.
