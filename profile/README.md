# Flop's Stuff

Open-source experiments and tools, mostly around **AI developer tooling**, **agent orchestration**, and a few hardware/integration side quests.

Everything below is public. 

The **Repo** link takes you to the source; where a hosted version or package exists, the **Web** link points to it.

🌐 **Browse it all at [stuff.flopbut.pl](https://stuff.flopbut.pl)** - the same projects with a card per project and detail pages.

---

## 🎨 Art & Experiments

| Project | What it is | Links |
| --- | --- | --- |
| **FlopCoin** | A physical silver coin (single issuance of ~100 unique pieces) that redeems for one hour of Flop's time - an art object and collectible whose only way in is from an existing holder. | [Repo](https://github.com/Flopsstuff/flop.hr) · [Web](https://flopcoin.art) |
| **korovany** | 3D caravan-raiding action game in the browser - a Babylon.js + React SPA with a full-window canvas, world map fast-travel, and a unit-tested win/lose loop. | [Repo](https://github.com/Flopsstuff/korovany) · [Web](https://korovany.aimost.pl/) |
| **flopbut.pl** | Flop Butylkin's personal site and the hub the rest of Flop's Stuff hangs off - a trilingual (EN/RU/PL) Astro site on Cloudflare Workers, static by default with a dormant serverless contact endpoint. | [Repo](https://github.com/Flopsstuff/flopbut.pl) · [Web](https://flopbut.pl) |

## 🤖 AI & Developer Tooling

| Project | What it is | Links |
| --- | --- | --- |
| **Ambassy** | MCP/A2A/ACP bridge for delegating a task to a coding agent on another machine - wraps Claude Code or codex-acp in an A2A v1.0 server and publishes it to the calling agent as four MCP tools, with the permission decision made inside the bridge. | [Repo](https://github.com/Flopsstuff/ambassy) · [Web](https://flopsstuff.github.io/ambassy/) |
| **cotel** | Claude Code OpenTelemetry - a single-container OTLP ingest endpoint plus an interactive dashboard for Claude Code usage (sessions, models, tools, cost, timings). | [Repo](https://github.com/Flopsstuff/cotel) |
| **flugins** | Claude Code plugin marketplace - a curated plugins repository you can point your Claude Code install at. | [Repo](https://github.com/Flopsstuff/flugins) |
| **soulgrep** | `grep` the human signal from the noise - a tool for surfacing what actually matters in large bodies of text. | [Repo](https://github.com/Flopsstuff/soulgrep) · [Web](https://soulgrep.aignite.pl) |
| **coqu** | Code Query - query and explore codebases. | [Repo](https://github.com/Flopsstuff/coqu) · [Web](https://coqu.aimost.pl) |
| **chaiba** | Chess AI Battle Arena - pit chess engines/AIs against each other and watch them play. | [Repo](https://github.com/Flopsstuff/chaiba) · [Web](https://flopsstuff.github.io/chaiba/) |
| **aimaf** | AI Mafia - a client-only React SPA that runs a Mafia-style social deduction game between multiple LLM "players" via OpenRouter. | [Repo](https://github.com/Flopsstuff/aimaf) · [Web](https://flopsstuff.github.io/aimaf/) |
| **huemcp** | MCP server for controlling Philips Hue smart lights - mDNS bridge discovery, API-key setup, and control of lights, rooms, zones and grouped lights. | [Repo](https://github.com/Flopsstuff/huemcp) |
| **otp** | Offline, private TOTP (2FA) code generator - computes codes locally in the browser via the Web Crypto API, nothing sent or stored. | [Repo](https://github.com/Flopsstuff/otp) · [Web](https://flopsstuff.github.io/otp/) |
| **ram** | Random Agents Memories - a shared, always-on "second brain" for AI agents: a `markdown-vault-mcp` server over a git-backed vault, exposed via Cloudflare Tunnel with bearer + OAuth (Authelia) multi-auth. | [Repo](https://github.com/Flopsstuff/ram) |

## 🧾 Polish e-Invoicing (KSeF)

| Project | What it is | Links |
| --- | --- | --- |
| **ksef-client-ts** | TypeScript client for the Polish National e-Invoice System (KSeF) API. | [Repo](https://github.com/Flopsstuff/ksef-client-ts) · [npm](https://www.npmjs.com/package/ksef-client-ts) |
| **ksef-docs** | English translations of the KSeF documentation. | [Repo](https://github.com/Flopsstuff/ksef-docs) |

## 🔧 Hardware & Systems

| Project | What it is | Links |
| --- | --- | --- |
| **raspidr** | Self-hosted voice assistant on a Raspberry Pi Zero 2 W - a custom openWakeWord model listens on the device, then Groq STT, a Hermes LLM agent on the LAN and Groq/xAI TTS answer out loud, with each stage animated on a NeoPixel ring and a rotary encoder for volume, mute and interrupt. | [Repo](https://github.com/Flopsstuff/raspidr) · [Web](https://flopsstuff.github.io/raspidr/) |
| **neonka** | IBM Wheelwriter electric typewriter hacking project (embedded C++). | [Repo](https://github.com/Flopsstuff/neonka) |
| **triki** | Reverse-engineering the Żabka Triki BLE token (nRF52810 + LSM6DSL) and reusing it as a motion controller - hardware notes, BLE protocol docs, Python tooling, and a Web Bluetooth client with a live 3D orientation demo. | [Repo](https://github.com/Flopsstuff/triki) · [npm](https://www.npmjs.com/package/triki-controller) · [Web](https://flopsstuff.github.io/triki/) |
| **lg** | Liquid Glass - an iOS app implementing a realistic magnifying-glass lens effect with Metal shaders and CoreImage (displacement maps, chromatic aberration). | [Repo](https://github.com/Flopsstuff/lg) |
| **samtor** | Sideloaded Tizen web apps and device research for a Samsung Smart Monitor (M8, Tizen 6.5) - a Canvas 2D runner, a DOOM port, and a benchmark app, plus Python pairing/remote-control tooling and a Cloudflare Worker that lets a phone fill in a TV app's settings. | [Repo](https://github.com/Flopsstuff/samtor) |

## 🍴 Forks & Contributions

Projects we maintain forks of or contribute to. Each **Web** link points to the upstream project home.

| Project | What it is | Links |
| --- | --- | --- |
| **ccui** | CloudCLI - a free, open-source web UI for managing Claude Code, Cursor CLI or Codex sessions remotely from mobile or web. | [Repo](https://github.com/Flopsstuff/ccui) · [Web](https://cloudcli.ai) |
| **paperclip** | Open-source orchestration for zero-human companies. | [Repo](https://github.com/Flopsstuff/paperclip) · [Web](https://paperclip.ing) |
| **mcp-md** | Headless semantic MCP server for Obsidian, Logseq, Dendron and any markdown vault - AST-based editing, hybrid vector + TF-IDF search, zero-setup local embeddings. | [Repo](https://github.com/Flopsstuff/mcp-md) · [Web](https://www.npmjs.com/package/@wirux/mcp-markdown-vault) |
| **uemcp** | MCP server that lets AI assistants control Unreal Engine via a native C++ automation bridge. | [Repo](https://github.com/Flopsstuff/uemcp) |
| **wetty** | Terminal in the browser over HTTP/HTTPS (an Ajaxterm/Anyterm alternative). | [Repo](https://github.com/Flopsstuff/wetty) · [Web](https://butlerx.github.io/wetty) |
