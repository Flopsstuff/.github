## Overview

**ram** - "Random Agents Memories" - is one always-on shared "second brain" for AI agents
running on different machines, plus a wiki in the browser for the person who owns it. Agents
read and write a git-backed Markdown vault through a single
[`markdown-vault-mcp`](https://github.com/pvliesdonk/markdown-vault-mcp) server, and every write
is committed and pushed. You browse and edit the same notes in
[SilverBullet](https://silverbullet.md/), and your edits reach the agents' search within one
pull interval. The whole thing sits behind one Cloudflare Tunnel and one
[Authelia](https://www.authelia.com/) login.

![Agents on many machines feed one shared memory; a person reads it by the window](https://raw.githubusercontent.com/Flopsstuff/ram/main/assets/hero.jpg)

## Why it exists

Agents are stateless between sessions, and agents on separate machines cannot see each other's
context at all. Durable facts kept in a local file only help the one agent on the one box that
holds it.

ram makes that memory central and shared: one vault, one index, so a headless coding agent, a
browser assistant and a phone client all read and write the same knowledge. It is git-backed, so
the memory is versioned and recoverable instead of living in an opaque store - and because the
notes stay plain Markdown, a human can read and edit them in a wiki rather than query a
database.

## How it works

Six containers on one Docker host, published through a single tunnel:

| Service | What it does |
| --- | --- |
| `markdown-vault-mcp` | The MCP server: notes, links, conventions, semantic and keyword search, managed git (auto-commit, push, periodic rebase pull) |
| `authelia` | OIDC provider for MCP OAuth, and forward-auth for the wiki. Its user file is the allowlist |
| `cloudflared` | The tunnel: three hostnames, no published ports |
| `wiki` | SilverBullet, on its own clone of the vault |
| `wiki-sync` | Git for that clone: pushes your edits, pulls the agents' |
| `wiki-proxy` | Caddy: asks Authelia about every wiki request |

### Search

Each section is embedded with Google's `gemini-embedding-2`, through AI Studio's
OpenAI-compatible endpoint, together with its note title and heading. The model was chosen and
tuned on the real vault with a bench in the repo (`bench/`): paraphrased Russian and English
questions with known answers. The deployed search puts the right note first 98% of the time.
Search is semantic by default, so a question asked in your own words finds the note; keyword
mode stays for exact identifiers such as ticket numbers and file names.

### The wiki

SilverBullet runs on its **own clone** of the vault and syncs through git on the server's
timings: your edits are pushed once you stop typing, the agents' edits arrive on a pull
interval, and the server reindexes what it pulls, so agents find your changes without a manual
reindex. The same Authelia login guards both the wiki and MCP OAuth, so there is no second user
system. The wiki's own settings, the page tree and the fonts, live in the infra repo and are
copied in on every start.

### What agents are told

The vault follows the
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
(OKF) v0.2: every note carries a `type` and a one-line `description`, `status` marks it `draft`,
`stable` or `deprecated`, and search ranks deprecated and stale notes lower. Links are Markdown
links from the vault root, and a copy of the spec is itself a note, so agents can read the rules
over MCP. Per-folder `_conventions.md` files say which `type` goes where and how to name things;
agents fetch them before writing, and every write result repeats them. A nightly CI job keeps
the format honest: it turns the wikilinks the wiki leaves behind into OKF links, regenerates
every folder's `index.md`, and fails if a note breaks the format or a link breaks. Two lines of
instance configuration carry the remaining house rules, such as which language to write notes
in, or offering to save lasting knowledge at the end of a task.

## Technical details

| Aspect | Detail |
| --- | --- |
| Core | `markdown-vault-mcp` over a git-backed Markdown vault |
| Endpoint | `https://<MCP_DOMAIN>/mcp`, streamable HTTP |
| Auth | Multi-auth: a static bearer token (headless agents) or OAuth 2.1 / OIDC through Authelia (GUI clients) |
| Embeddings | `gemini-embedding-2` via Google AI Studio |
| Vault | A private GitHub repo, cloned and managed read-write by the server |
| Ingress | Cloudflare Tunnel, three hostnames, no published ports, no Cloudflare Access |
| Deploy | Push to `main` → GitHub Actions → self-hosted runner → `docker compose` |
| License | Apache 2.0 |

Every gitignored config file - `.env`, the tunnel config, the two Authelia files - is rebuilt
from a GitHub secret on each deploy, so no real hostname, token or key is ever in the repo. Git
itself is optional: without it the vault is a plain folder on a volume, at the cost of history,
an off-host copy and the wiki.

## Install your own

[INSTALL.md](https://github.com/Flopsstuff/ram/blob/main/INSTALL.md) is the step-by-step recipe
from an empty GitHub account to connected agents: the vault repo and its conventions, `.env`,
Authelia's keys and users, a Cloudflare Tunnel, a self-hosted runner, and the single
`claude mcp add` line that connects an agent. It needs an always-on Docker host, a domain on
Cloudflare and
a Google AI Studio key, and takes about an hour, most of it spent waiting for DNS and the first
deploy.

## Links

- [Repository](https://github.com/Flopsstuff/ram)
- [INSTALL.md - stand up your own instance](https://github.com/Flopsstuff/ram/blob/main/INSTALL.md)
- [markdown-vault-mcp (upstream)](https://github.com/pvliesdonk/markdown-vault-mcp)
- [SilverBullet](https://silverbullet.md/)
- [Authelia](https://www.authelia.com/)
- [Open Knowledge Format v0.2 spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
