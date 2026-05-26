## Overview

**huemcp** is a Model Context Protocol (MCP) server that enables AI assistants—such as Claude Desktop or Cursor—to control Philips Hue smart lighting systems. It acts as a bridge between high-level natural language instructions and the physical Hue ecosystem, allowing AI agents to "see" your home's lighting layout and interact with it directly over your local network.

## Why it exists

While smart home integration is common, it usually requires platform-specific apps or heavy automation suites like Home Assistant. For developers and users working within AI-augmented environments, these extra layers are often overkill.

**huemcp** exists to make smart home control a first-class citizen for LLMs. By exposing Philips Hue controls as standardized MCP tools, it allows you to say "dim the office lights to 20%" or "set the living room to a warm sunset color" and have the AI execute it immediately. It eliminates the manual friction of bridge discovery and API key management by automating the local pairing process.

## How it works

1. **Automatic Discovery** — The server utilizes **mDNS (Multicast DNS)** to scan the local network for Philips Hue Bridges. This removes the need for users to manually identify and provide bridge IP addresses.
2. **Secure Pairing** — It implements the standard Hue authentication flow through two dedicated tools: `discover_bridge` to find available hardware, and `complete_bridge_setup` to finalize the API key generation once the physical link button on the bridge is pressed.
3. **MCP Tool Exposure** — Once authorized, the server registers a suite of tools with the host AI client. These tools allow for toggling power, adjusting brightness, and setting XY or RGB colors across individual bulbs, rooms, zones, or grouped lights.
4. **Local Execution** — All commands are translated into local HTTP requests sent directly to the Hue Bridge API. This ensures low-latency response times and keeps your smart home data private within your local network.

## Technical details

| Aspect       | Detail                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Language     | TypeScript                                                             |
| Runtime      | Node.js                                                                |
| Hue API      | Direct HTTP implementation of Hue API v1                               |
| Discovery    | mDNS (Multicast DNS) via `bonjour-service`                             |
| Distribution | Optimized for `mcpb` (MCP Bundle) for one-click Claude Desktop install |

The project is structured for stability, with a focus on core lighting primitives. The future roadmap includes a transition to the `node-hue-api` library to leverage **Hue API v2**, which will enable faster state updates and support for advanced features like Entertainment zones and dynamic scenes.

## Links

- [Repository](https://github.com/Flopsstuff/huemcp)
- [Philips Hue Developer Portal](https://developers.meethue.com/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
