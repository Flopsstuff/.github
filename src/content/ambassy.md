## Overview

**Ambassy** lets one agent delegate a task to another that lives somewhere else - on its
own machine, under its own credentials, inside limits that neither of them can widen. It
takes a coding agent that normally runs as a child process on a pipe (Claude Code via
`claude-agent-acp`, or `codex-acp`), gives it a network address and a task that outlives
the call, and publishes it to a calling agent as four MCP tools. It is written in
TypeScript and is, by its own description, a sandbox for the **A2A Protocol v1.0** first
and a working bridge second: what is documented in it was checked against live traffic
rather than inferred from the specification.

![One agent hands a task through Ambassy to a coding agent running on its own machine: MCP, A2A and ACP stacked in the bridge, with the permission decision made inside it](https://media.githubusercontent.com/media/Flopsstuff/ambassy/main/docs/assets/ambassy-overview.jpg)

## Why it exists

**ACP** (Agent Client Protocol) is built for an editor sitting next to the coding agent,
and what it leaves out is exactly what delegation needs:

- **No address.** Nothing outside the process that spawned the agent can reach it - not
  another program, not another machine.
- **No task.** A call is either in flight or lost. You cannot walk away and collect the
  answer later, cancel a turn that went wrong, or answer a question the agent asked an
  hour ago.
- **No boundary.** Whoever launches the agent approves its actions. When the launcher is
  itself an agent doing what it was told, that approval checks nothing.

**A2A** answers the first two: an agent publishes a card at a well-known URL, and a task
is an addressable thing with a lifecycle (`SUBMITTED` to `WORKING` to `INPUT_REQUIRED` to
`COMPLETED`) that lives on the agent, so a client that drops off can come back by id.

The third is a design decision rather than a protocol feature, and Ambassy's answer is
that **the bridge decides and the caller is never asked** - the A2A client is the party
that wants the work done, so making it the supervisor would be a loop, not a check.

## How it works

Three protocols stack inside the bridge. MCP faces the calling agent, A2A carries the
task over HTTP/SSE, and ACP drives the coding agent over stdio:

```
your Claude Code      Ambassy            the worker machine
  a2a_ask   --MCP-->  src/mcp/  --A2A->  src/acp/agent.ts
  a2a_task            an A2A    HTTP/SSE an A2A server
  a2a_cancel          client            permissions.ts
  a2a_card                              (decides here,
                                         never upstream)
                                               |
                                            ACP, stdio
                                               |
                                        claude-agent-acp
                                          or codex-acp
```

The three are easy to confuse, and the first two are both JSON-RPC:

| | Direction | The agent is | Carries |
| --- | --- | --- | --- |
| **A2A** | between peers, over HTTP | the server | a task with an identity and a lifecycle |
| **ACP** | editor to coding agent, over a pipe | a subprocess | one turn, streamed as it happens |
| **MCP** | calling agent to tools | a tool endpoint | a call that blocks until the task is terminal |

A stub executor with no model behind it runs the same interface, so the protocol can be
exercised on its own, then swapped for a real coding agent without the client noticing:

```bash
yarn agent          # A2A server on :41241, placeholder executor
yarn client         # SDK client: discovery, streaming, resuming a task
yarn raw            # the same exchange in bare curl, no SDK

yarn agent:claude   # same port, same card, claude-agent-acp behind it
yarn mcp            # MCP endpoint on :41243, prints the token and connect command
yarn tap            # proxy :41242 -> :41241, prints every frame
```

Both servers bind `127.0.0.1` by default: the A2A side runs with no authentication, so a
wider bind would hand a coding agent to the network. The MCP endpoint is the side meant to
face one, and it carries a bearer token.

## Technical details

| Aspect | Detail |
| --- | --- |
| Language | TypeScript |
| Protocols | A2A v1.0.0, ACP, MCP `2025-06-18` |
| Version | 0.1 - an MVP: tasks are in memory, the A2A side has no auth, the permission classifier is a placeholder for a real external channel |
| Agents supported | `claude-agent-acp` (Claude Code) and `codex-acp` |
| Ports | A2A `:41241`, tap proxy `:41242`, MCP `:41243`, all bound to `127.0.0.1` by default |
| Running as a service | `yarn service install --with-mcp` - LaunchAgents on macOS, systemd `--user` units on Linux |
| Configuration | `.env` (from `.env.example`): working directory, `AGENT_NAME`, idle conversation lifetime; each conversation gets its own directory under `.acp-sandboxes/` |
| License | Apache-2.0 |

The repository also records what live traffic revealed and the spec did not: wire method
names are PascalCase (`SendMessage`, `GetTask`, `CancelTask`), the `A2A-Version: 1.0`
header is mandatory or the server answers `-32009 VERSION_NOT_SUPPORTED`, a `Part` is a
discriminated union in TypeScript but flat JSON on the wire, an executor's first event
must be `task` or `message`, each SSE frame is a complete JSON-RPC response, and
cancelling means actually ending up `CANCELED` rather than merely being told.

## Links

- [Repository](https://github.com/Flopsstuff/ambassy)
- [Documentation](https://flopsstuff.github.io/ambassy/)
- [A2A Protocol v1.0.0 specification](https://a2a-protocol.org/v1.0.0/specification/)
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/protocol/overview)
- [Model Context Protocol 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)
