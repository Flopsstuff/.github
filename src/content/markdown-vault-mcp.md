## Overview

**markdown-vault-mcp** is an [MCP](https://modelcontextprotocol.io) server that gives Claude, or
any other MCP client, a folder of Markdown notes to search, read and write. An Obsidian vault
works as it is. The project is written and maintained by
[Peter van Liesdonk](https://github.com/pvliesdonk/markdown-vault-mcp); this repository is our
fork of it. We did not build the server - we run it, and we send fixes back.

It is the memory server inside [ram](/projects/ram), the shared "second brain" our agents on
different machines read and write.

## Why it exists

An agent forgets everything between sessions, and agents on different machines never see each
other's context. A folder of plain Markdown is the simplest durable memory there is: a person can
read it, git can version it, and nothing about it is tied to one vendor. What is missing is a way
for an agent to work with that folder well - find a note by what it means rather than by its
exact words, follow the links between notes, and write back without clobbering an edit someone
else just made. markdown-vault-mcp is that layer.

### Why a fork

We keep the fork so that fixes found while running ram have a branch to live on and a place to
open upstream pull requests from. On `main` the fork carries nothing of its own - it is behind
upstream, with no commits ahead. The divergence is two branches, each the source of an open
pull request to upstream:

- **`fix/openai-compat-missing-index`**
  ([upstream PR #2085](https://github.com/pvliesdonk/markdown-vault-mcp/pull/2085)).
  Gemini's OpenAI-compatible embeddings endpoint leaves `index` out of the first item of a
  response, which the openai SDK reads as `None`. Sorting the batch then compared `None` with `1`
  and every batch of two or more texts failed, so no vectors were saved. The fix reads a missing
  index as 0 and documents the response shape. ram runs on `gemini-embedding-2`, so until this
  lands ram carries a small startup patch for the same bug against the upstream image.
- **`feat/okf-spec-resource`**
  ([upstream PR #2094](https://github.com/pvliesdonk/markdown-vault-mcp/pull/2094)).
  The server asks agents to follow the Open Knowledge Format, but an agent that reaches the vault
  only over MCP had no way to read that specification. The branch ships the OKF spec as package
  data, with its Apache-2.0 license and provenance, and serves it as the `okf://spec` resource.

ram itself runs the upstream image (`ghcr.io/pvliesdonk/markdown-vault-mcp`), not a build of
this fork.

## How it works

- **Hybrid search.** Keyword search on SQLite FTS5 and, once an embedding provider is set
  (OpenAI or any OpenAI-compatible endpoint, Voyage, Ollama or local FastEmbed), search by
  meaning. The two result lists are fused with Reciprocal Rank Fusion. Long notes are split at
  their headings, results come back as short snippets, and `read` fetches the whole section.
- **Frontmatter as data.** YAML frontmatter fields become search filters, and exact queries
  (`query_documents`, `count_documents`, `aggregate_documents`) page through or group the whole
  index.
- **Careful writes.** `write`, `edit`, `append`, `rename`, `delete` and friends follow the same
  patterns as Claude Code's own file tools. Replacing an existing file needs the etag from
  reading it, so a blind overwrite is refused. One switch makes the whole server read-only.
- **Links.** Backlinks, outlinks, broken links and the shortest path between two notes, for
  wikilinks and Markdown links alike.
- **Git.** Optionally a commit per write with a delayed push, a pull loop or webhook sync, and
  history and diffs - an overwritten note can be read back at the revision it replaced.
- **Open Knowledge Format.** OKF bundles are recognised, and every result carries the note's
  type, status and trust tier.

Indexing is hash-based: an unchanged file is never parsed twice. The same engine is also a
synchronous Python library; the MCP layer wraps it in `asyncio.to_thread()`.

## Technical details

| Aspect | Detail |
| --- | --- |
| Language | Python, built on [FastMCP](https://gofastmcp.com) |
| Storage | SQLite (FTS5 index, vectors), or vectors in files or PostgreSQL |
| Transports | stdio and streamable HTTP, with authentication and OIDC for remote clients |
| Distribution | PyPI (`markdown-vault-mcp`), Docker (`ghcr.io/pvliesdonk/markdown-vault-mcp`), a `.mcpb` bundle for Claude Desktop, a Claude Code plugin |
| Configuration | environment variables with the `MARKDOWN_VAULT_MCP_` prefix |
| License | MIT |

## Links

- [Our fork](https://github.com/Flopsstuff/markdown-vault-mcp)
- [Upstream repository](https://github.com/pvliesdonk/markdown-vault-mcp)
- [Documentation](https://pvliesdonk.github.io/markdown-vault-mcp/) and its
  [llms.txt](https://pvliesdonk.github.io/markdown-vault-mcp/latest/llms.txt)
- [ram](/projects/ram) - the shared agent memory that runs on it
