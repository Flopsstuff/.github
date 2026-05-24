## Overview

**mcp-md** (published as [`@wirux/mcp-markdown-vault`](https://www.npmjs.com/package/@wirux/mcp-markdown-vault)) is
a headless [Model Context Protocol](https://modelcontextprotocol.io/) server that
gives LLMs full read/write access to any folder of Markdown files — Obsidian
vaults, Logseq graphs, Dendron workspaces, Foam, or plain directories. One
`npx` command, no running app, no API keys, no extra infrastructure.

## Why it exists

Most Obsidian MCP integrations require the Obsidian desktop app to be open with a
Local REST API plugin installed. That works on a laptop but breaks in Docker, on a
server, or whenever Obsidian is closed. More fundamentally, Markdown files are
just files — there is no reason an LLM needs to talk to a GUI app to read them.

mcp-md solves this by talking directly to the filesystem. It also ships
built-in semantic search from day one: existing alternatives either skip search
entirely or offload it to an external service like ChromaDB. Here, local
embeddings (`all-MiniLM-L6-v2` via `@huggingface/transformers`) are bundled and
download automatically on first run — no account, no API key, no sidecar process.

## How it works

The server exposes five groups of MCP tools:

- **`vault`** — create, read, update, delete, and stat notes; create from templates
- **`edit`** — AST-based patching of specific headings or block IDs via a `remark`
  pipeline; freeform line-range and string-replace as fallback; frontmatter updates; batch edit with dry-run diff preview
- **`view`** — hybrid search (vector + TF-IDF + word proximity), read by heading,
  bulk read, backlinks index, vault structure overview
- **`workflow`** — Petri net state machine that tracks task progress and injects
  contextual hints into every tool response
- **`system`** — server health, reindex trigger, vault overview

On startup, the server auto-generates `meta/overview.md` in the vault — a
structural map (directories, file counts, top headings) that connected agents read
to understand the vault's scope without being told. This self-orienting context
layer is delivered via the MCP `instructions` field, MCP Resources, and first-call
priming, so it degrades gracefully across clients that support different MCP
feature sets.

Embeddings default to a local HuggingFace model; point `OLLAMA_URL` at a running
Ollama instance to upgrade to `nomic-embed-text`. For larger deployments, set
`VECTOR_STORE_URL` to use Qdrant instead of the built-in flat store.

```bash
# run against a vault over stdio
npx @wirux/mcp-markdown-vault

# or SSE mode (multi-client, Docker-friendly)
MCP_TRANSPORT_TYPE=sse PORT=3000 VAULT_PATH=/path/to/vault \
  npx @wirux/mcp-markdown-vault
```

## Technical details

| Aspect        | Detail                                                                     |
| ------------- | -------------------------------------------------------------------------- |
| Language      | TypeScript 5.x, Node.js ≥ 22                                               |
| Transport     | Stdio (single client) or SSE over HTTP (multi-client)                      |
| Editing       | `remark` AST pipeline; Levenshtein fuzzy matching for heading lookups      |
| Embeddings    | Local `@huggingface/transformers` (`all-MiniLM-L6-v2`, 384d); Ollama optional |
| Vector store  | Built-in persisted flat store (`.markdown_vault_mcp/`); Qdrant optional    |
| Architecture  | Clean Architecture — domain / use-cases / infrastructure / presentation     |
| Tests         | 516 tests across 46 files (Vitest); real temp directories, no mocks        |
| Distribution  | NPM (`@wirux/mcp-markdown-vault`); Docker (`ghcr.io/wirux/mcp-markdown-vault`) |
| License       | MIT                                                                        |

## Links

- [Repository](https://github.com/Flopsstuff/mcp-md)
- [npm package — @wirux/mcp-markdown-vault](https://www.npmjs.com/package/@wirux/mcp-markdown-vault)
- [Docker image](https://github.com/Wirux/mcp-obsidian/pkgs/container/mcp-markdown-vault)
- [Model Context Protocol specification](https://modelcontextprotocol.io/)
