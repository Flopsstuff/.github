## Overview

**cotel** (Claude Code Telemetry) is self-hosted telemetry for coding agents. It
exposes an OTLP ingest endpoint, stores what arrives locally, and serves a
dashboard that shows sessions, models, tokens and spend for every sender -
people, AI agents and hosts alike. It started with
[Claude Code](https://docs.anthropic.com/en/docs/claude-code) and now also reads
the spans of the Codex and Grok CLI agents. All of it is one Docker container,
with no cloud dependencies and no sign-up.

## Why it exists

Coding agents already emit standard OpenTelemetry, but on its own that data has
nowhere to go. The usual answer - a full Prometheus + Grafana + collector
pipeline - is far too heavy for one person or a small team that just wants to see
*who is spending what, on which model, in which session*.

The question also changed once the senders stopped being only people. A fleet of
agents shares one set of OTLP headers, runs on more than one CLI, and still has
to be told apart on the bill. cotel answers that from one endpoint and one
dashboard, without a multi-service monitoring platform.

## How it works

1. **Ingest** - cotel listens for OTLP/HTTP on port `4318`. Claude Code spans are
   read as they are; Codex and Grok CLI spans go through a small adapter per
   harness that pulls out their session, model, tokens and tool calls without
   counting the same event twice.
2. **Attribute** - every sender that identifies itself is an **actor** with its
   own page and spend; only senders that do not land together on Anonymous. An
   **actor token** says who is sending. For a fleet that shares its headers, an
   **ingest key** (`cotel_ik_...`) authorizes ingest while each sender still names
   itself with its own actor token. Paperclip agents are attributed by their
   `paperclip.agent.id`: one Agent observability setting with an ingest key, no
   per-agent configuration.
3. **Price** - each span gets a cost from a built-in price table that covers
   Claude 5.5 and 5.2 as well as the Codex and Grok models. Stored spans can be
   repriced after the fact (`--backfill-cost` previews, `--backfill-cost-apply`
   writes).
4. **Explore** - the dashboard on port `8080` has Overview, Sessions, History,
   Costs, Tools, Models and Actors pages, scoped by a range switcher, plus a
   Setup guide with copy-paste settings and a full export / import.

```bash
docker run -d --name cotel -p 4318:4318 -p 8080:8080 \
  -v cotel-data:/data ghcr.io/flopsstuff/cotel:latest
# then open http://localhost:8080 -> Setup
```

## Technical details

| Aspect       | Detail                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| Deployment   | Single Docker image (`ghcr.io/flopsstuff/cotel`), one data volume      |
| Ingest       | OTLP/HTTP on `:4318`, JSON or protobuf; no gRPC listener               |
| Senders      | Claude Code, Codex, Grok CLI                                           |
| Identity     | Actor tokens, shared ingest keys, Paperclip agent ids                  |
| Dashboard    | Usage explorer on `:8080`                                              |
| Storage      | DuckDB file on the data volume                                         |
| Retention    | Raw spans 30 days, daily totals 90 days (both configurable)            |
| Snapshots    | One a day into a second volume, fourteen kept, restored with `--db-import` |
| Publishing   | Optional Cloudflare Tunnel; Zero Trust for the dashboard               |

Designed around a few hard constraints: trivial self-host (one container),
OTLP fidelity (reuse the standard schema, never reinvent it), and a dashboard
that stays responsive over a long history.

## Links

- [Repository](https://github.com/Flopsstuff/cotel)
- [Documentation](https://flopsstuff.github.io/cotel/)
- [Actors and authentication](https://github.com/Flopsstuff/cotel/blob/main/docs/operations/actors-and-auth.md)
- [Claude Code monitoring docs](https://docs.anthropic.com/en/docs/claude-code/monitoring-usage)
- [OpenTelemetry OTLP specification](https://opentelemetry.io/docs/specs/otlp/)
