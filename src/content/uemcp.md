## Overview

**uemcp** is a fork of [ChiR24/Unreal_mcp](https://github.com/ChiR24/Unreal_mcp)
that turns Unreal Engine 5 itself into a
[Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server. Its
defining change: the MCP server runs **directly inside the engine**, as native
C++ in the Automation Bridge plugin. An AI client like Claude or Cursor connects
straight to Unreal over HTTP — there is no separate Node.js/TypeScript process
sitting in front of it.

## Why it exists

The upstream project ships its MCP server as a TypeScript/Node process that
relays calls to a C++ "automation bridge" plugin inside Unreal. That works, but
it means two moving parts to install and keep in sync — a Node server *and* the
engine plugin — with every tool call making an extra hop between them.

This fork exists to remove that TypeScript shim. By moving the MCP server into
the plugin's native C++, Unreal speaks MCP itself: no Node.js, no npm, no bridge
process. The result is one component to install, one fewer translation layer, and
a tool call that goes straight from the AI client into the engine.

## How it works

The plugin embeds a built-in **MCP Streamable HTTP server**. Once it loads, the
editor logs the endpoint it is serving:

```
LogMcpNativeTransport: Native MCP server started on http://localhost:3000/mcp
```

and any MCP client points at that endpoint directly:

```bash
claude mcp add unreal-engine --transport http http://localhost:3000/mcp
```

- **Native transport (C++)** — a Streamable HTTP + SSE endpoint (`/mcp`)
  implemented in the plugin handles the protocol's JSON-RPC in-process. A
  persistent `GET /mcp` SSE stream carries server-to-client notifications.
- **Self-describing tools** — each tool is a C++ class that declares its own
  schema, so the tool list is generated at runtime from the engine itself. This
  replaced the JSON schema file the TypeScript server used to load.
- **Action-based dispatch** — every tool call names an action; the plugin
  resolves it, runs the corresponding engine operation, and returns a structured
  result. Tools span assets, actors, levels, blueprints, materials, effects,
  sequencer, audio, AI, and gameplay systems, plus editor control.
- **TypeScript bridge (optional)** — the original Node transport is still
  available as a fallback for setups that prefer it, but it is no longer
  required.

Tool discovery is dynamic: a client calls `manage_tools` to list categories and
enable the ones it needs; the `core` tools (`manage_tools`, `inspect`) are always
on. Console-command safety, runtime type discovery, and the C++ automation layer
are inherited from upstream.

## Technical details

| Aspect | Detail |
|---|---|
| Fork of | [ChiR24/Unreal_mcp](https://github.com/ChiR24/Unreal_mcp) |
| Native server | MCP Streamable HTTP + SSE, served in-engine from the C++ plugin at `http://localhost:3000/mcp` |
| Language | C++ for the plugin and native MCP server; TypeScript only for the optional legacy bridge |
| Engine support | Unreal Engine 5.0 – 5.7 |
| Install | Plugin from source (a code project) or pre-built per-UE-version binaries — no Node.js needed in native mode |
| Tooling | Dynamic, self-describing tool classes; `manage_tools` enables/disables categories at runtime |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/uemcp)
- [Upstream project (ChiR24/Unreal_mcp)](https://github.com/ChiR24/Unreal_mcp)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
