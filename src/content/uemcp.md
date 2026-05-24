## Overview

**uemcp** is a [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server that gives AI assistants direct, structured access to Unreal Engine 5. It pairs a Node.js/TypeScript MCP server with a native C++ Automation Bridge plugin compiled into the engine, exposing 36 tools across 10 categories — from asset management and actor spawning to audio authoring and multiplayer replication — all callable by an AI client like Claude Desktop or Cursor.

## Why it exists

Unreal Engine 5 is powerful but dense: most complex operations require deep familiarity with the editor's UI, Blueprint graph, and C++ API. AI coding assistants can help with that complexity, but without a structured bridge they can only suggest code — they cannot act on it. uemcp closes that gap by making the engine a first-class MCP tool server. Instead of typing an action into the chat and then manually executing it in the editor, an AI client can call a tool directly, observe the result, and iterate — all without human hand-holding at every step.

## How it works

The system has three layers that work together:

1. **MCP server (TypeScript)** — runs as a local Node.js process and speaks the Model Context Protocol. AI clients (Claude Desktop, Cursor) connect to it and discover its tools. The server translates incoming tool calls into JSON payloads and forwards them to Unreal.
2. **Automation Bridge plugin (C++)** — a native UE5 plugin compiled alongside the project. It listens for the server's messages and dispatches them through Unreal's runtime APIs: spawning actors, modifying materials, loading levels, triggering sequencer, and more. It supports dynamic type discovery so it can introspect engine classes at runtime rather than requiring a rigid fixed schema.
3. **Action-based dispatch** — every tool call names an action and passes parameters. The bridge resolves the action, executes the corresponding engine operation, and returns a structured result. The server relays that back to the AI client as the tool output.

The server starts and stays up regardless of whether an Unreal Editor instance is running — it retries the connection with exponential backoff when the engine isn't available, so the AI client always has a stable endpoint to talk to.

**Safety** is built in: dangerous console commands are rejected by pattern validation before they reach the engine, the metrics endpoint is rate-limited to 60 requests per minute per IP, and the server binds to `127.0.0.1` by default so it is not exposed on the LAN without explicit opt-in.

## Technical details

| Aspect | Detail |
|---|---|
| Languages | C++ (72 %) — the UE plugin; TypeScript (24 %) — the MCP server |
| Runtime | Node.js 18+, MCP SDK |
| Engine support | Unreal Engine 5.0 – 5.7 |
| Tool surface | 36 tools: assets, actors, levels, animation, physics, VFX, sequencer, audio, gameplay systems, editor control |
| Connection | Local loopback only by default; opt-in LAN access |
| Optional features | GraphQL API (disabled by default), Docker packaging |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/uemcp)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
- [Upstream project (ChiR24/Unreal_mcp)](https://github.com/ChiR24/Unreal_mcp)
