## Overview

**coqu** (Code Query) is a centralized knowledge layer for software projects that allows developers and AI agents to query and explore codebases through a structured interface. It provides both a web-based Chat UI for human developers and a REST API/MCP (Model Context Protocol) interface for AI agents, enabling cross-repository intelligence and seamless code navigation.

## Why it exists

In modern development environments with numerous microservices and repositories, developers and AI agents often lack the necessary context when working across different projects. **coqu** addresses this "context gap" by providing a programmable way to query codebases for architecture, logic, dependencies, and bugs. It allows an agent working in one repository to fetch context from another and helps developers quickly understand unfamiliar parts of an organization's code without manual deep dives.

## How it works

1. **Query Interface** — Users can interact with codebases via a clean Chat UI, while external tools and agents connect through a standard REST API or the Model Context Protocol (MCP).
2. **Project Targeting** — Each query is scoped to a specific project and agent, allowing for fine-grained control over the context retrieved.
3. **Flexible Modes** — Supports various query modes, from quick one-line answers to exhaustive architectural analysis, depending on the user's needs.
4. **Deployment** — Designed for easy setup, **coqu** can run locally for individual developers or be deployed via Docker for teams, with support for secure internet exposure using Cloudflare Tunnels.

## Technical details

| Aspect | Detail |
| --- | --- |
| Frontend | React SPA built with Vite and TypeScript |
| API | Express.js with Prisma ORM |
| Database | PostgreSQL |
| Interface | REST API and MCP (Model Context Protocol) |
| Deployment | Docker-ready, Cloudflare Tunnel compatible |

## Links

- [Repository](https://github.com/Flopsstuff/coqu)
- [Live site](https://coqu.aimost.pl)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
