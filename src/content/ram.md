## Overview

**ram** - "Random Agents Memories" - is one always-on shared "second brain" for AI agents
running on different machines, plus a wiki in the browser for the person who owns it. Agents
read and write a Markdown vault through a single
[`markdown-vault-mcp`](https://github.com/pvliesdonk/markdown-vault-mcp) server. The vault lives
on a Docker volume; a git remote, where every write is committed and pushed, and a backup copy
in an S3-compatible bucket are both optional. You browse and edit the same notes in
[SilverBullet](https://silverbullet.md/), and your edits reach the agents' search within one
pull interval with git, within seconds without it. Everything is served from one hostname,
behind one Cloudflare Tunnel and one [Authelia](https://www.authelia.com/) login.

## Why it exists

Agents are stateless between sessions, and agents on separate machines cannot see each other's
context at all. Durable facts kept in a local file only help the one agent on the one box that
holds it.

ram makes that memory central and shared: one vault, one index, so a headless coding agent, a
browser assistant and a phone client all read and write the same knowledge. With git or a bucket
the memory is versioned and recoverable instead of living in an opaque store - and because the
notes stay plain Markdown, a human can read and edit them in a wiki rather than query a
database.

## How it works

![Agents on many machines feed one shared memory; a person reads it by the window](https://raw.githubusercontent.com/Flopsstuff/ram/main/assets/hero.jpg)

One `docker compose` stack on one Docker host, published through a single tunnel:

| Service | What it does |
| --- | --- |
| `markdown-vault-mcp` | The MCP server: notes, links, conventions, semantic and keyword search. With git: auto-commit, push, periodic rebase pull. Without: a file watcher that indexes what the wiki writes |
| `authelia` | OIDC provider for MCP OAuth, and the login in front of the wiki. Its user file is the allowlist |
| `cloudflared` | The tunnel: hands every request for the one hostname to `proxy`, no published ports |
| `proxy` | nginx: routes the hostname by path, asks Authelia about every wiki request, rate-limits each client |
| `wiki` | SilverBullet: with git on its own clone of the vault, without git on the server's volume |
| `wiki-sync` | With git: pushes your edits and pulls the agents'. Without: copies the wiki settings in and idles |
| `vault-mirror` | rclone: mirrors the vault to an S3-compatible bucket and keeps replaced and deleted files as history |
| `okf-maintenance` | Once a day: keeps the vault in Open Knowledge Format and reports broken notes and links |

![Agents and a browser reach one hostname through Cloudflare; nginx routes by path to the MCP server, Authelia and the wiki; the vault lives on a volume, with optional git and bucket copies](https://raw.githubusercontent.com/Flopsstuff/ram/main/assets/architecture.jpg)

### One hostname

An install needs one name and one DNS record. nginx behind the tunnel decides by path: `/wiki/`
goes to SilverBullet, `/sso/` to the Authelia login portal, and everything else - `/mcp`, the
OAuth endpoints and `/.well-known/...` - to the MCP server, which keeps the root because MCP
clients look for the OAuth metadata there. Opening the bare hostname redirects to the wiki.
nginx also limits requests per client address, using the real address Cloudflare passes on, so
a runaway client gets `429` instead of flooding the server.

### Storage modes

The vault is always a Docker volume. A git remote and a bucket are independent add-ons, each
switched on in `.env`, and an instance with neither still works:

| Mode | What you get |
| --- | --- |
| Volume only | The simplest install. No history, last write wins |
| Git | Full history (`get_history`, `get_diff`), an off-host copy, and a merge when an agent and the browser edit the same note |
| Bucket | A backup with automatic restore: a new or wiped volume is filled from the bucket at start |
| Git + bucket | Both; the bucket is a second copy, never restored from |

The bucket is a one-way mirror, not two-way sync. Every five minutes by default the vault is
copied to the bucket, and a file that a pass replaces or deletes is kept aside under a dated
`history/` folder for 30 days (or forever). The mirror marks the volume it has seen, so a wiped
or swapped volume is never mirrored over the good copy. It works with Google Cloud Storage,
AWS S3, Cloudflare R2, DigitalOcean Spaces and MinIO.

### Search

Each section is embedded with Google's `gemini-embedding-2`, through AI Studio's
OpenAI-compatible endpoint, together with its note title and heading. The model was chosen and
tuned on the real vault with a bench in the repo (`bench/`): paraphrased Russian and English
questions with known answers. The deployed search puts the right note first 98% of the time.
Search is semantic by default, so a question asked in your own words finds the note; keyword
mode stays for exact identifiers such as ticket numbers and file names.

### The wiki

With git, SilverBullet runs on its **own clone** of the vault and syncs through git on the
server's timings: your edits are pushed once you stop typing, the agents' edits arrive on a pull
interval, and the server reindexes what it pulls. Without git, the wiki writes straight into the
server's folder and the server's file watcher makes the edit searchable about two seconds later.
Either way agents find your changes without a manual reindex. The same Authelia login guards
both the wiki and MCP OAuth, so there is no second user system, and a log-out button in the
wiki's top bar ends that session. The wiki's own settings - the page tree, the fonts, a wider
text column - live in the infra repo and are copied in on every start.

### What agents are told

The vault follows the
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
(OKF) v0.2: every note carries a `type` and a one-line `description`, `status` marks it `draft`,
`stable` or `deprecated`, and search ranks deprecated and stale notes lower. Links are Markdown
links from the vault root, and a copy of the spec is itself a note, so agents can read the rules
over MCP. Per-folder `_conventions.md` files say which `type` goes where and how to name things;
agents fetch them before writing, and every write result repeats them. A daily service inside
the stack keeps the format honest: it turns the wikilinks the wiki leaves behind into OKF links, regenerates
every folder's `index.md`, and reports notes that break the format and links that lead
nowhere. Two lines of
instance configuration carry the remaining house rules, such as which language to write notes
in, or offering to save lasting knowledge at the end of a task.

## Technical details

| Aspect | Detail |
| --- | --- |
| Core | `markdown-vault-mcp` over a git-backed Markdown vault |
| Endpoint | `https://<MCP_DOMAIN>/mcp`, streamable HTTP |
| Auth | Multi-auth: a static bearer token (headless agents) or OAuth 2.1 / OIDC through Authelia (GUI clients) |
| Embeddings | `gemini-embedding-2` via Google AI Studio |
| Vault | A Docker volume. Optional: a private GitHub repo managed read-write by the server, and an S3-compatible bucket mirror |
| Ingress | Cloudflare Tunnel, one hostname routed by path through nginx, no published ports, no Cloudflare Access |
| Run | `docker compose up -d`; everything scheduled (git sync, bucket mirror, OKF upkeep) runs inside the stack |
| Deploy | Optional: push to `main` → GitHub Actions → self-hosted runner → `docker compose` |
| License | Apache 2.0 |

An install is three configuration files - `.env` and the two Authelia files - filled in once
from their templates. With the optional GitHub Actions deploy, each is rebuilt from a GitHub
secret on every run, so no real hostname, token or key is ever in the repo.

## Install your own

[INSTALL.md](https://github.com/Flopsstuff/ram/blob/main/INSTALL.md) is the step-by-step recipe
from an empty host to connected agents: the vault and its conventions, `.env`, Authelia's keys
and users, a Cloudflare Tunnel, optionally git, a bucket and a self-hosted runner, and the single
`claude mcp add` line that connects an agent. It needs an always-on Docker host, a domain on
Cloudflare and
a Google AI Studio key, and takes about an hour, most of it spent waiting for DNS and the first
deploy.

## Links

- [Repository](https://github.com/Flopsstuff/ram)
- [INSTALL.md - stand up your own instance](https://github.com/Flopsstuff/ram/blob/main/INSTALL.md)
- [markdown-vault-mcp (upstream)](https://github.com/pvliesdonk/markdown-vault-mcp)
- [SilverBullet](https://silverbullet.md/)
- [rclone](https://rclone.org/)
- [Authelia](https://www.authelia.com/)
- [Open Knowledge Format v0.2 spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
