# Flopsstuff — Brand & Design System

Foundation for the landing site at **https://fs.aignite.pl** (React SPA, plain CSS
with design tokens — see [ADR 0001](../decisions/0001-landing-spa-architecture.md)).

- **Tokens:** [`tokens.css`](./tokens.css) — copy to `src/styles/tokens.css`, import once at the app root.
- **Preview:** [`preview.html`](./preview.html) — open in a browser to see the palette, type, and screen mocks live (toggle light/dark).
- **Audience:** Wayland implements directly from this; Daedalus signs off on feasibility.

---

## 1. Brand idea

The anchor is the existing logo: a **7-segment LED display** spelling `FS` in red phosphor
on a near-black panel (`profile/logo.svg`). The whole system extends that one object.

- **Dark-first.** The monogram's native habitat is the dark panel, so the site *is* that panel.
  Dark is the canonical theme; light is a faithful, high-contrast alternate.
- **Display, not decoration.** Type, color, and the focus glow all read as a precise instrument
  readout — calm, technical, legible. "Clear, modern, beautiful" = restraint, not ornament.

**Voice:** plain, confident, engineer-to-engineer. Short lines. No marketing inflation.

---

## 2. Color

### The red rule (hard constraint)

> **`#ff2d2d` is the logo color.** It may also appear as a *sparing* accent — a single live-status
> dot, a hover hairline, a focus garnish. It must **never** be the primary brand color, never fill a
> button or large surface, never mark body links. If you're reaching for red for emphasis, you're
> wrong — reach for cyan (`--color-primary`) or weight/space instead.

### Primary: electric cyan

Cyan is the **complement of the reserved red** — the red/cyan pairing is literally the relationship
between channels on an RGB display, so the palette reinforces the LED-display idea while staying
unmistakably *not red* (and not generic-AI-blue). Cyan carries all interactivity: links, primary
buttons, focus, active states.

### Palette

| Token | Hex | Role |
| --- | --- | --- |
| `--color-bg` (dark) | `#0a0a0b` | Page canvas — the panel. Tuned to the logo's `#0c0c0e`. |
| `--color-surface` | `#141417` | Cards, header. |
| `--color-surface-raised` | `#1a1a1f` | Hover / elevated card. |
| `--color-border` | `#26262c` | Hairlines, card edges. |
| `--color-text` | `#f4f4f5` | Primary text (~17:1 on bg). |
| `--color-text-muted` | `#a1a1aa` | Secondary copy (~7:1 on bg). |
| `--color-text-subtle` | `#71717a` | Meta, mono labels. |
| **`--color-primary` (dark)** | **`#34d3ee`** | **Links, primary CTA, focus, active.** |
| `--color-primary` (light) | `#0e7490` | Same role on white (AA text, ~4.8:1). |
| `--color-accent` | `#ff2d2d` | Logo + sparing accent **only**. |
| `--color-status-active` | `#34d399` | "active" project badge. |
| `--color-status-experimental` | `#fbbf24` | "experimental" badge. |
| `--color-status-fork` | `#a78bfa` | "fork" badge. |

Status colors are **muted and semantic**, never brand — they distinguish badge meaning without
competing with cyan or stealing red.

### Contrast (WCAG 2.1)

All body and UI text pairs meet **AA**; primary text pairs exceed **AAA**. On dark, cyan `#34d3ee`
on `#0a0a0b` is ~11:1. On light, cyan `#0e7490` on white is ~4.8:1 (AA) — this is why the light
theme darkens the primary; **do not** use the bright dark-theme cyan for text on white.

---

## 3. Typography

Three families, all free & self-hostable (subset and `font-display: swap`):

| Role | Family | Use |
| --- | --- | --- |
| **Display** | **Space Grotesk** | Hero, page & section headings. Techy, geometric — echoes the digital readout. |
| **Body** | **Inter** | Paragraphs, card copy, UI. Workhorse; highly legible at small sizes. |
| **Mono** | **JetBrains Mono** | Category labels, status chips, code, the "FS" wordmark fallback. The segmented-display callback. |

**Pairing rule:** Space Grotesk for anything ≥ `--text-2xl`; Inter for everything readable; mono
**only** for short uppercase labels (`--tracking-wide`), counts, and code. Never set paragraphs in mono.

### Scale (base 16px, ~1.25)

`--text-xs 12` · `sm 14` · `base 16` · `lg 18` · `xl 22` · `2xl 28` · `3xl 36` · `4xl 48` · `5xl 60`

Line height: `--leading-tight 1.1` (display) · `snug 1.25` (headings) · `normal 1.5` (UI) ·
`relaxed 1.65` (long body). Weights: 400 / 500 / 600 / 700. Display headings use `--tracking-tight`;
uppercase mono labels use `--tracking-wide`.

---

## 4. Spacing, radius, elevation, motion

- **Spacing** — 4px base, tokens `--space-1`…`--space-10` (4→128). Use the scale, nothing else.
  No stray `7px` gaps; whitespace is a design element.
- **Radius** — `sm 6` (chips/inputs) · `md 10` (buttons) · `lg 16` (cards) · `xl 24` (hero panels) ·
  `full` (pills/dots). Mirrors the logo panel's soft `rx≈6.6%`.
- **Shadows** — `sm/md/lg`; dark theme leans on borders + faint shadow, light theme on shadow.
- **Glow** — `--glow-focus` (cyan) is the **only** UI reuse of the LED-glow filter; it's the focus
  ring. `--glow-logo` (red) is decoration for the monogram only.
- **Motion** — `--duration-fast/base/slow` with `--ease-standard`/`--ease-out`. Hover ≤ `fast`,
  view transitions ≤ `base`. All gated by `prefers-reduced-motion` (tokens collapse to `0ms`).

---

## 5. Logo usage

| Do | Don't |
| --- | --- |
| Keep the monogram on a dark panel (its `#0c0c0e` rounded rect). | Recolor the lit segments anything but `#ff2d2d`. |
| Use it as the header mark + favicon, small. | Stretch, rotate, or add a second glow. |
| Give it clear space ≥ the height of one segment on all sides. | Place it on a busy/low-contrast background or pure white without its panel. |
| Pair the wordmark "Flopsstuff" in Space Grotesk beside it. | Re-typeset "FS" in another font as a substitute mark. |

Minimum size: 24px panel height in the header; 16px favicon export. The red lives **in the logo**;
the surrounding UI stays cyan/neutral so the mark always wins the eye.

---

## 6. Visual direction — Home (`/`)

Business card + grouped project grid. **Overview → scan → drill in** (Shneiderman): hero states who
we are; grouped grid lets a visitor self-select by interest; each card is a clear scent trail to a
detail page.

```
┌────────────────────────────────────────────────────────────────────┐
│  [▦ FS]  Flopsstuff                              Projects   GitHub  ◐│  ← sticky header, surface
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Open-source experiments and tools.                    ░ hero ░     │  ← Space Grotesk 5xl,
│   AI developer tooling, agent orchestration,            ░ faint ░    │    text near-white;
│   and a few hardware side quests.                       ░ LED   ░    │    one cyan keyword.
│                                                         ░ panel ░    │    Optional: enlarged
│   [ Browse projects → ]   [ GitHub ↗ ]                                │    dim logo motif right.
│     ^cyan fill            ^ghost/outline                              │
│                                                                      │
├──────────────────────────────────────────────────────────────────  │
│   ▍AI & DEVELOPER TOOLING            (mono label, tracking-wide)      │  ← section = Common Region
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│   │ cotel    ●act│ │ flugins      │ │ soulgrep     │                 │  ← card grid, auto-fit
│   │ Claude Code  │ │ Plugin       │ │ grep the     │                 │    minmax(280px,1fr)
│   │ OpenTelemetry│ │ marketplace… │ │ human signal…│                 │    title: Space Grotesk xl
│   │ ─────────────│ │ ─────────────│ │ ─────────────│                 │    tagline: Inter sm muted
│   │ Repo ↗       │ │ Repo ↗       │ │ Repo ↗       │                 │    footer links: cyan
│   └──────────────┘ └──────────────┘ └──────────────┘                 │
│   ┌──────────────┐ ┌──────────────┐                                  │
│   │ coqu         │ │ chaiba       │                                  │
│   └──────────────┘ └──────────────┘                                  │
│                                                                      │
│   ▍POLISH e-INVOICING (KSeF)                                         │
│   ┌──────────────┐ ┌──────────────┐                                  │
│   │ ksef-client  │ │ ksef-docs    │                                  │
│   └──────────────┘ └──────────────┘                                  │
│                                                                      │
│   ▍HARDWARE & SYSTEMS        ▍FORKS & CONTRIBUTIONS                  │
│   …                                                                  │
├──────────────────────────────────────────────────────────────────  │
│   [▦ FS] Flopsstuff · GitHub · © 2026          (quiet mono footer)   │
└──────────────────────────────────────────────────────────────────┘
```

**Card anatomy** (the workhorse component): surface bg, `radius-lg`, `border`, `space-5` padding.
Title (Space Grotesk `xl`) + optional status dot, tagline (Inter `sm`, muted, 2 lines clamped),
hairline, then `Repo ↗` / `Web ↗` links in cyan. Whole card is clickable → detail; the external
links stop propagation. Hover: border → `border-strong`, lift `shadow-md`, `fast`. Grid is
`repeat(auto-fit, minmax(280px, 1fr))` with `--space-5` gap; 1 col mobile → 2 → 3.

## 7. Visual direction — Project detail (`/projects/:slug`)

Single, focused column. Answers "what is this, is it live, where do I get it" above the fold.

```
┌────────────────────────────────────────────────────────────────────┐
│  [▦ FS] Flopsstuff                               Projects   GitHub  ◐│
├────────────────────────────────────────────────────────────────────┤
│   ← All projects                              (cyan back-link, sm)   │
│                                                                      │
│   AI & DEVELOPER TOOLING        (mono label, subtle)                 │
│   cotel                                          ● active            │  ← title 3xl/4xl display,
│   Claude Code OpenTelemetry — one-container OTLP ingest + dashboard. │    status chip right
│                                                                      │
│   [ View repo ↗ ]   [ Website ↗ ]                                    │  ← primary + ghost button
│     ^cyan fill        ^only if webUrl                                │
│   ──────────────────────────────────────────────────────────────    │
│                                                                      │
│   A single-container OTLP endpoint plus an interactive dashboard     │  ← long description,
│   for Claude Code usage: sessions, models, tools, cost, timings.     │    Inter base, ~65ch,
│   …                                                                  │    leading-relaxed.
│                                                                      │
│   ▍More in AI & Developer Tooling                                    │  ← related = same-category
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                            │    cards (reuse Card),
│   │ flugins  │ │ soulgrep │ │ coqu     │                            │    keeps people moving.
│   └──────────┘ └──────────┘ └──────────┘                            │
├──────────────────────────────────────────────────────────────────  │
│   quiet footer                                                       │
└──────────────────────────────────────────────────────────────────┘
```

Reuses the same primitives (header, Card, Button, status chip). Content column max ~720px /
`--container-max` for the grid; body measure ~65ch. Unknown slug → friendly empty state
(see §8), not a blank screen.

## 8. States (not optional)

- **Loading** — skeleton cards (surface + shimmer gated by reduced-motion). Doherty: render the
  shell instantly; SPA data is local so this is mostly a non-issue, but the skeleton covers font swap.
- **Empty / 404** — unknown `/projects/:slug`: centered panel, dim logo, "No such project (yet)."
  + `← Back to all projects` (cyan). Recovery, not a dead end (Nielsen #9).
- **Focus** — every interactive element shows `--glow-focus`. Keyboard order follows visual order.
- **Hover** — borders/lift only; never introduce red on hover.

---

## 9. Do / Don't (system-level)

| Do | Don't |
| --- | --- |
| Drive emphasis with **weight, size, space, and one cyan**. | Add a second accent hue or use red for emphasis. |
| Use semantic tokens (`--color-primary`) in components. | Reference primitives (`--cyan-400`) or inline hex. |
| Keep the grid honest — everything on the 4px scale. | Stray gaps, elements touching edges, off-grid nudges. |
| Set labels in mono uppercase with `--tracking-wide`. | Set paragraphs in mono. |
| Respect `prefers-reduced-motion` and `prefers-color-scheme`. | Animate unconditionally or force a theme. |

---

## 10. Handoff checklist for Wayland

- [ ] `tokens.css` → `src/styles/tokens.css`, imported once at root before component CSS.
- [ ] Self-host the three fonts (Space Grotesk, Inter, JetBrains Mono), `display: swap`, subset latin.
- [ ] Build primitives in token terms: **Header, Button (primary/ghost), Card, StatusChip, SectionLabel, Footer, Skeleton, EmptyState**.
- [ ] `Project.status` → StatusChip color via `--color-status-*`.
- [ ] Theme toggle (◐) writes `data-theme` on `<html>`; default = unset (follows OS, dark-canonical).
- [ ] Verify focus ring, keyboard nav, and AA contrast in both themes before PR; attach 1440×900 + 390×844 screenshots for UX review.
