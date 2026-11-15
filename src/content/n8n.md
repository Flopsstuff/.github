## Overview

This repository is the deployment for one self-hosted [n8n](https://n8n.io) instance, the
workflow automation platform. There is no application code in it: a Docker Compose file, a
cloudflared config template, two shell scripts and a CI pipeline. Together they run n8n on a
machine at home and publish it on a public hostname through a Cloudflare Tunnel, without
forwarding a single port on the router.

## Why it exists

n8n is most useful when the outside world can reach it: webhooks from other services, OAuth
callbacks, the editor from a phone. The usual way to get that from a home server is a port
forward and a certificate to look after. A Cloudflare Tunnel turns that around - the
`cloudflared` container dials out to Cloudflare, and Cloudflare sends the hostname's traffic
back down that connection. Nothing listens on the router, and TLS ends at Cloudflare's edge.

The rest of the repo exists to make that instance boring to keep running: one command to start
it, one to stop it, deploys that happen on push and updates that happen on a schedule.

## How it works

```
https://$N8N_HOST -> Cloudflare edge -> cloudflared container
                  -> n8n:5678 -> PostgreSQL 15
```

- **`start.sh`** reads the tunnel's UUID out of `cloudflared/credentials.json`, renders
  `cloudflared/config.yml` from the template so the hostname and the tunnel always match, pulls
  images and brings the stack up with `docker compose up -d`.
- **n8n is told it sits behind two proxies** (`N8N_PROXY_HOPS=2`: the Cloudflare edge, then
  cloudflared), so it trusts their `X-Forwarded-For` and rate limiting sees real clients. Its
  public URL is set explicitly, so OAuth callbacks and invite links point at the hostname rather
  than the container address.
- **A push to `master` deploys.** CI runs on a self-hosted GitHub Actions runner that is the
  production host. It writes `.env` and the tunnel credentials from repository secrets, pulls the
  new images while the old stack is still serving, dumps the database with `pg_dump` (the eight
  most recent dumps are kept), then runs `stop.sh` and `start.sh`. The pull comes first on
  purpose: when a pull once hung after the stack had already been stopped, n8n stayed down for
  five days.
- **A weekly update.** The n8n image is pinned to `:latest`, so a redeploy is an upgrade. A
  Saturday cron reuses the same pipeline to pick up new n8n releases, which is also why every
  deploy dumps the database first: n8n's migrations do not roll back.

### What is not set up

Redis is in the compose file and starts with an append-only volume, but nothing connects to
it. There is no worker service and no `EXECUTIONS_MODE=queue`, so queue mode is not configured
and executions run in regular mode inside the main n8n container. The README says this plainly
and leaves the choice open: add queue mode and a worker, or drop Redis. The `N8N_BASIC_AUTH_*`
variables are leftovers too - basic auth was removed in n8n 1.x, and access is governed by
n8n's own user management.

## Technical details

| Aspect | Detail |
| --- | --- |
| Services | `n8nio/n8n:latest`, `postgres:15`, `redis:7-alpine` (idle), `cloudflare/cloudflared:latest` |
| Data | Docker named volumes `n8n_data`, `postgres_data`, `redis_data` |
| Exposure | Cloudflare Tunnel ingress for one hostname, everything else answers 404 |
| Configuration | a gitignored `.env` (template in `.env.example`) and the tunnel's `credentials.json` |
| Deploy | GitHub Actions on a self-hosted runner: pull, `pg_dump`, `stop.sh`, `start.sh`, prune old images |
| Updates | weekly cron calling the same pipeline |
| Backups | manual volume tarballs documented in the README, plus the automatic pre-deploy database dumps |

## Links

- [Repository](https://github.com/Flopsstuff/n8n)
- [n8n](https://n8n.io) and its [documentation](https://docs.n8n.io)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
