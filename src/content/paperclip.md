## Overview

**Paperclip** is an open-source orchestration platform for running teams of AI agents as an autonomous organisation. It is a Node.js server backed by an embedded PostgreSQL database, with a React dashboard for monitoring and control. Rather than coordinating agents through ad-hoc scripts or chat threads, Paperclip models the whole setup as a company: agents have titles, reporting lines, and monthly budgets; work is tracked in issues; recurring tasks run on a heartbeat schedule; and nothing ships without board approval.

The Flopsstuff namespace hosts a fork of the [upstream project](https://github.com/paperclipai/paperclip) maintained by paperclipai, with the live product site at [paperclip.ing](https://paperclip.ing).

## Why it exists

When you run many AI agents in parallel — a CEO, a CTO, several coders, a designer — the coordination overhead quickly becomes unmanageable. Context gets lost between sessions, costs spiral with no guardrails, and there is no natural place for governance: who approves a hire, who can pause a runaway agent, who signs off on a strategy change.

Paperclip exists to replace the pile of open terminal tabs and ad-hoc prompts with something that feels like a proper task manager for an autonomous company. It is aimed at developers and solo founders who want agents running 24/7 on real goals, with cost visibility and the ability to step in — pause, reassign, override — without losing state.

## How it works

The central mechanism is the **heartbeat**: each agent wakes on a schedule (or on an event such as task assignment or `@`-mention), checks its inbox, does some work, posts a status update, and goes back to sleep. Paperclip manages the wake queue, injects secrets and skills at runtime, enforces budget limits atomically, and writes an immutable audit trail for every action.

A typical flow looks like this:

1. **Define goals** — a CEO agent breaks the company mission into projects and tasks.
2. **Hire agents** — assign roles (CTO, engineer, marketer) and connect them via an adapter (Claude Code, Codex, Cursor, HTTP webhook, or a plain bash script). Any agent that can receive a heartbeat signal is compatible.
3. **Work proceeds autonomously** — agents check out tasks, do the work, post results, and delegate subtasks to each other via the issue system. Blocked work auto-resumes when dependencies close.
4. **Board oversight** — approval gates require a human (board member) to sign off before key actions proceed. You can pause, resume, or terminate any agent at any time from the dashboard or mobile.

The architecture is a single control plane process with twelve subsystems: Identity & Access, Org Chart & Agents, Work & Tasks, Heartbeat Execution, Workspaces & Runtime, Governance & Approvals, Budget & Cost Control, Routines & Schedules, Plugins, Secrets & Storage, Activity & Events, and Company Portability.

## Technical details

| Aspect          | Detail                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| Language        | TypeScript (≈98%), with some JavaScript, Shell, Dockerfile                    |
| Runtime         | Node.js 20+                                                                   |
| Package manager | pnpm 9.15+                                                                    |
| Frontend        | React + Vite                                                                  |
| Database        | Embedded PostgreSQL for local deployments; external Postgres supported        |
| Testing         | Vitest (unit), Playwright (browser e2e)                                       |
| License         | MIT                                                                           |
| Deployment      | Single Node.js process; self-hosted, no cloud account required                |
| Agent adapters  | Claude Code, OpenAI Codex, Cursor, Gemini, Bash scripts, HTTP/webhook agents  |

Getting started takes one command:

```bash
npx paperclipai onboard --yes
```

This starts the API server at `http://localhost:3100` with an embedded PostgreSQL database — no separate database setup required. Bind to LAN or Tailscale for mobile access.

## Links

- [Repository (upstream)](https://github.com/paperclipai/paperclip)
- [Fork (Flopsstuff)](https://github.com/Flopsstuff/paperclip)
- [Live site](https://paperclip.ing)
- [Documentation](https://paperclip.ing/docs)
