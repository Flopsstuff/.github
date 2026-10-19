## Overview

**otomoto-mcp** is an MCP server that lets an AI agent search used-car listings on
[Otomoto.pl](https://www.otomoto.pl), Poland's largest car marketplace, and read individual
offers. One Node process, stdio transport, no API key and no headless browser. It is an
unofficial research project, not made, endorsed or supported by Otomoto or OLX Group: it
exists so that one buyer can go through offers with an assistant doing the reading, not to
collect data.

## Why it exists

Buying a used car in Poland means reading hundreds of near-identical adverts, and a good
part of them are not a car for sale at all. Some are lease transfers, where the advertised
price is a monthly instalment and a 2022 Corolla appears to cost 1 784 PLN. Others are
brokers advertising a car they do not have and would source to order. Otomoto marks neither
kind, so both sit in the results and both distort any sense of what a car costs.

Handing that job to an agent runs into a second problem: Otomoto has no public API, and the
site answers a question it did not understand with HTTP 200 and a plausible page of the
wrong cars. An unrecognised filter is silently ignored, a misspelt city quietly becomes the
whole country, and a model URL can be redirected to a narrower variant. An agent cannot tell
any of that from a good answer, so the server has to.

## How it works

Three ways into the site were measured. Rendered markup uses build-hashed class names that
change on every deploy; the site's own GraphQL endpoint has introspection switched off; the
Next.js SSR payload (`__NEXT_DATA__`) embedded in ordinary search and listing pages carries
everything, including filters, sort, radius and deep pagination. The server fetches the same
public pages a browser would and parses that payload. All network access lives in one
module, serialized, paced and capped.

Four tools sit on top:

| Tool | Returns |
| --- | --- |
| `otomoto_search` | One page of results, 32 per page, screened, with the full normalised listing shape |
| `otomoto_listing` | One advert in full, by URL, base62 id or numeric id |
| `otomoto_price_stats` | Price and mileage min/p25/median/p75/max over a bounded sample of 1 to 3 pages |
| `otomoto_filter_options` | The filter vocabulary with Otomoto's own Polish labels, answered offline |

Three properties follow from the site's silence:

- **Nothing fails quietly.** Filters are validated against a vocabulary generated from
  Otomoto's own search page before any request is made, the answer is then checked against
  what Otomoto reports it applied, and a structural change in the payload fails every tool
  with `PARSER_CONTRACT_ERROR` rather than reporting "no cars found".
- **Screening is evidence-bearing.** Lease transfers are caught from title, teaser and
  instalment-shaped price; import-to-order brokers only give themselves away in a full
  description, and not in every one, so the server reads up to four adverts per dealer and
  applies the verdict across that dealer's rows. Every row carries the text that produced its
  verdict, and the response lists what was excluded, why, and which dealers went unchecked.
- **Nothing crawls.** A call fetches at most three pages, and only when statistics are asked
  for. No copy of Otomoto's listings is kept.

Seller-written contact details are passed through as the seller typed them, since they are
there for buyers to use; `OTOMOTO_MCP_REDACT_CONTACTS=1` strips them for deployments whose
output should carry none. Otomoto's own encrypted phone, VIN and plate tokens are never
returned.

## Technical details

| Aspect | Detail |
| --- | --- |
| Language | TypeScript, ESM, Node 20+ to run (22.18+/23.6+ to develop, tests run `.ts` through Node's type stripping) |
| Dependencies | `@modelcontextprotocol/sdk`, `zod` |
| Transport | stdio; attach with `claude mcp add otomoto -- node /path/to/dist/index.js`, or an `mcpServers` block in any MCP client |
| Install | `git clone`, `npm ci`, `npm run build`. Not published to npm |
| Tests | Fixture-based and offline (gzipped real pages), plus `npm run smoke`, which speaks MCP over real stdio and makes exactly one live request |
| Configuration | `OTOMOTO_MCP_MIN_DELAY_MS` (1000, floor 500), `OTOMOTO_MCP_TIMEOUT_MS`, `OTOMOTO_MCP_USER_AGENT`, `OTOMOTO_MCP_REDACT_CONTACTS` |
| Version | 0.1.0 |
| License | MIT, covering the code only and not Otomoto's content |

Known limits are documented rather than hidden: model families are split into variants
(`a4-avant`, not `a4`), the filter vocabulary is a snapshot that has to be regenerated when
Otomoto adds a value, statistics are asking prices from a page or three rather than market
values, and `__NEXT_DATA__` is an undocumented internal contract that can change on any
deploy.

## Links

- [Repository](https://github.com/Flopsstuff/otomoto-mcp)
- [Architecture](https://github.com/Flopsstuff/otomoto-mcp/blob/main/docs/architecture.md)
- [Measured Otomoto behaviour](https://github.com/Flopsstuff/otomoto-mcp/blob/main/docs/otomoto-behaviour.md)
- [Install with a coding agent](https://github.com/Flopsstuff/otomoto-mcp/blob/main/docs/install-with-an-agent.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
