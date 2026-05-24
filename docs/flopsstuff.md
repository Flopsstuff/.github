# Flopsstuff

Open-source experiments and tools — AI developer tooling, agent orchestration, and a few hardware side quests.

## Projects

### AI & Developer Tooling

**cotel** — Claude Code OpenTelemetry. A single-container OTLP ingest endpoint plus an interactive dashboard for Claude Code usage: sessions, models, tools, cost, and timings. Drop it next to your Claude Code setup and get immediate observability.

**flugins** — Claude Code plugin marketplace. A curated plugins repository you can point your Claude Code install at. Browse, install, and manage community plugins.

**soulgrep** — Surface what actually matters in large bodies of text. grep the human signal from the noise.

**coqu** — Code Query. Query and explore codebases with a structured query interface. Designed for fast, targeted code navigation.

**chaiba** — Chess AI Battle Arena. Pit chess engines and AIs against each other and watch them play. A playground for evaluating chess AI performance.

### Polish e-Invoicing (KSeF)

**ksef-client-ts** — A TypeScript client for the Polish National e-Invoice System (KSeF) API. Covers the full KSeF interface for issuing, querying, and managing e-invoices.

**ksef-docs** — English translations of the official KSeF documentation. Makes the Polish National e-Invoice System accessible to non-Polish-speaking developers.

### Hardware & Systems

**neonka** — An IBM Wheelwriter electric typewriter hacking project written in embedded C++. Connects classic electromechanical hardware to modern interfaces.

### Forks & Contributions

**ccui** — CloudCLI: a free, open-source web UI for managing Claude Code, Cursor CLI, or Codex sessions remotely from mobile or web.

**paperclip** — Open-source orchestration for zero-human companies. Paperclip lets AI agents coordinate, plan, and execute complex multi-step work autonomously.

**mcp-md** — A headless semantic MCP server for Obsidian, Logseq, Dendron, and any markdown vault. AST-based editing, hybrid vector + TF-IDF search.

**uemcp** — An MCP server that lets AI assistants control Unreal Engine via a native C++ automation bridge.

**wetty** — Terminal in the browser over HTTP/HTTPS — an Ajaxterm/Anyterm alternative.

## Site

The landing at **https://fs.aignite.pl** is a React SPA (Vite + React Router) deployed on Cloudflare Workers. See the root `README.md` for development and deployment instructions.

To add a project: add one entry to `src/data/projects.ts`. The home and detail pages pick it up automatically.
