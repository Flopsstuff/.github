## Overview

**ram** — "Random Agents Memories" — is a central, always-on **shared "second
brain"** for AI agents running across different machines. It is a deployment
recipe around a single [`markdown-vault-mcp`](https://github.com/pvliesdonk/markdown-vault-mcp)
server that owns one git-backed Markdown vault and exposes it on the public
internet as a Model Context Protocol (MCP) endpoint. Every agent that connects
sees the same notes and can read and write knowledge that outlives a single
session.

## Why it exists

Individual AI agents are stateless between sessions, and agents on separate
machines can't see each other's context at all. Keeping durable facts,
decisions, and project state in a local file only helps the one agent on the one
box that holds it.

ram makes that memory **central and shared**: one vault, one working tree, so a
headless coding agent, a browser-based assistant, and a phone client all read
and write the same knowledge in real time. It is git-backed, so the memory is
versioned, auditable, and recoverable rather than living in an opaque store.

## How it works

```
agents ─HTTPS─► Cloudflare edge ─► cloudflared ─┬─► markdown-vault-mcp ─► /vault (git)
  │  (bearer OR OAuth)                           │        └────────────► /data (index, embeddings)
  └─ OAuth login ───────────────────────────────┴─► authelia (OIDC IdP)
```

- **One central server.** A single `markdown-vault-mcp` instance owns the vault
  and auto-commits, pushes, and periodically fast-forward-pulls to a private git
  repo, so writes propagate to every agent.
- **Public but private.** A **Cloudflare Tunnel** publishes the MCP endpoint with
  no open ports; TLS terminates at the edge and the real hostnames stay out of
  git.
- **Multi-auth, two client shapes.** Headless agents authenticate with a static
  **bearer token**; GUI clients (ChatGPT Developer mode, Claude web/mobile) run
  the browser **OAuth 2.1** (DCR + PKCE) flow against a self-hosted
  [Authelia](https://www.authelia.com/) identity provider. The server accepts
  either credential against the same single-tenant vault.
- **Search built in.** The vault is served with hybrid semantic + full-text
  search and a wikilink graph, backed by local FastEmbed embeddings — index and
  session state live in a separate `/data` volume, never committed into the vault.

Agents stay out of each other's way by folder convention (`agents/<id>/…`
private, `shared/…` append-preferred), not server-enforced tenancy.

## Technical details

| Aspect        | Detail                                                              |
| ------------- | ------------------------------------------------------------------- |
| Core          | `markdown-vault-mcp` over a git-backed Markdown vault               |
| Deployment    | Docker Compose: `markdown-vault-mcp`, `cloudflared`, `authelia`     |
| Ingress       | Cloudflare Tunnel (streamable HTTP), no published ports, no Access  |
| Auth          | Multi-auth — static bearer **or** OAuth 2.1 / OIDC via Authelia     |
| Embeddings    | Local FastEmbed; hybrid vector + full-text search                   |
| Persistence   | Private git repo for the vault; `/data` volume for index & sessions |

Configuration and secrets (bearer token, OIDC keys, git PAT, tunnel credentials)
are kept out of git and materialized from GitHub Actions secrets on deploy; a
self-hosted-runner workflow redeploys on push to `main`.

## Links

- [Repository](https://github.com/Flopsstuff/ram)
- [markdown-vault-mcp (upstream)](https://github.com/pvliesdonk/markdown-vault-mcp)
- [Authelia](https://www.authelia.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
