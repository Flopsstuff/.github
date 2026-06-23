## Overview

**korovany** is a 3D action game that runs entirely in the browser. You play a raider in a forest whose objective is simple — *raid 3 caravans* — while a running score tracks your kills and loot. The whole game renders into a full-window 3D canvas with React overlays for the HUD, main menu, and pause screen.

## Why it exists

It's a from-scratch playground for building a real-time 3D game on the modern web stack — no game engine binary, no native build, just TypeScript and a browser. It exists to see how far a strictly-typed React + Babylon.js SPA can be pushed toward a playable action game: a proper engine lifecycle, a save system, a world map with fast-travel, and a win/lose loop that's modelled as testable game logic rather than scattered UI state.

## How it works

1. **Engine lifecycle** — The Babylon.js `Engine`/`Scene` lifecycle lives in its own module (`src/engine/`), not inline in a component. It owns engine + scene creation, a high-DPI resize handler so the canvas stays crisp on retina, the render loop, and disposal. A thin React wrapper (`src/scenes/GameCanvas.tsx`) mounts the engine against a ref'd canvas and disposes it on unmount.
2. **Full-window canvas + React HUD** — The document never scrolls; `html/body/#root` are reset and overflow hidden so the 3D canvas fills the window, with React overlays sitting above it. The app boots into a main menu — **New Game** enters play, **Continue** resumes the latest save.
3. **Controls & systems** — `ESC` toggles `playing ⇄ paused`, `M` (or the HUD **Travel** button) opens the world map for fast-travel, and `B` spends a carried bandage to stop bleeding from a severed limb — part of a dismemberment-based health system.
4. **Objective loop** — Raiding all three caravans shows a **win** screen; dying shows a **lose** screen. The decision is a pure, unit-tested state machine (`src/game/objective/objectiveMachine.ts`) rather than ad-hoc UI checks, so the win/lose logic is verified independently of rendering.

## Technical details

| Aspect       | Detail                                                           |
| ------------ | ---------------------------------------------------------------- |
| Language     | TypeScript (`strict`, no `any`)                                  |
| UI           | React 19 (function components, named exports)                    |
| 3D engine    | Babylon.js                                                       |
| State        | Redux Toolkit slices (`src/store/`)                              |
| Build        | Vite 6                                                           |
| Testing      | Vitest (tests are mandatory and run in CI)                       |
| Docs         | VitePress → GitHub Pages                                         |
| Assets       | Binary assets via Git LFS                                        |
| Hosting      | App on Cloudflare Pages; docs on GitHub Pages, both via GitHub Actions |
| License      | MIT                                                              |

## Links

- [Repository](https://github.com/Flopsstuff/korovany)
- [Live app](https://korovany.aimost.pl/)
- [Docs](https://flopsstuff.github.io/korovany/)
