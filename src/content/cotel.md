## Overview

**cotel** (Claude Code OpenTelemetry) is a single-container observability stack
for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). It exposes an
OTLP-compatible ingest endpoint that Claude Code can emit telemetry to, stores
that telemetry locally, and serves an interactive dashboard that breaks your
usage down by session, model, tool, cost, and timing — all from one
`docker run`.

## Why it exists

Claude Code already emits standard OpenTelemetry (OTLP) metrics and logs, but on
its own that data has nowhere to go. The usual answer — stand up a full
Prometheus + Grafana + collector pipeline — is far too heavy for a single
developer who just wants to see *where their tokens and time are going*.

cotel exists to make that answer trivial: point Claude Code at one endpoint, open
one dashboard, and get immediate, high-signal usage exploration without running a
multi-service monitoring platform.

## How it works

1. **Ingest** — cotel listens on the OTLP HTTP port (`4318`) and accepts the
   metrics and logs Claude Code exports. Payloads are validated at the OTLP edge
   against the documented schema, then trusted internally.
2. **Store** — telemetry is written to a local analytical store persisted in a
   single named Docker volume, so the deployment story stays "one container, one
   volume." Retention and down-sampling keep that volume honest under sustained
   use.
3. **Explore** — a built-in dashboard (port `8080`) reads the analytics layer and
   renders breakdowns: per-session activity, model mix, tool call frequency,
   cost, and latency/timing distributions.

```bash
docker run -p 4318:4318 -p 8080:8080 -v cotel:/data cotel:latest
# then point Claude Code at http://localhost:4318 and open http://localhost:8080
```

## Technical details

| Aspect       | Detail                                                        |
| ------------ | ------------------------------------------------------------- |
| Deployment   | Single Docker image; one-service `docker-compose.yml` for dev |
| Ingest       | OTLP/HTTP on `:4318`, reusing upstream OTLP conventions       |
| Dashboard    | Interactive usage explorer served on `:8080`                  |
| Storage      | Local analytical store on a single named volume               |
| Retention    | First-class down-sampling so the volume stays bounded         |

Designed around a few hard constraints: trivial self-host (one container, one
volume), OTLP fidelity (reuse standard parsers, never reinvent the schema), and
dashboard query latency that stays responsive over a year of data.

## Links

- [Repository](https://github.com/Flopsstuff/cotel)
- [Claude Code monitoring docs](https://docs.anthropic.com/en/docs/claude-code/monitoring-usage)
- [OpenTelemetry OTLP specification](https://opentelemetry.io/docs/specs/otlp/)
