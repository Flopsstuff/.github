## Overview

**ksef-client-ts** is a TypeScript client library and CLI for the Polish National e-Invoice System (KSeF) API v2. It covers the full KSeF interface — issuing, querying, and managing e-invoices in both online and offline modes — with a typed API that stays aligned with the official OpenAPI spec. It is published to NPM as `ksef-client-ts` and works in any Node.js 18+ project.

## Why it exists

KSeF (Krajowy System e-Faktur) is Poland's mandatory electronic invoicing infrastructure. The official KSeF API is complex: it requires cryptographic authentication, session management, structured XML documents in multiple schemas (FA2, FA3, PEF, PEF_KOR), and specific flows for batch uploads and offline invoicing. The official reference clients are in C# and Java.

`ksef-client-ts` exists to give TypeScript and JavaScript developers a first-class client that covers the same surface — including the harder parts like offline mode, built-in XAdES-B signing, and HSM/EPUAP authentication — without pulling in any HTTP framework or reinventing Node.js crypto.

## How it works

The library exposes a `KSeFClient` class whose methods map to the full KSeF API v2.6.0. The common online flow looks like this:

```ts
import { KSeFClient } from 'ksef-client-ts';

const client = new KSeFClient({ environment: 'TEST' });
await client.crypto.init();

const challenge = await client.auth.getChallenge();
// authenticate → open session → send invoices → close session
```

Alternatively, the bundled `ksef` CLI exposes the same pipeline in the terminal:

```bash
ksef auth login --token "$KSEF_TOKEN" --nip "$KSEF_NIP"
ksef session open
ksef invoice send invoice.xml
ksef session invoices   # poll status
ksef session close
```

Key subsystems:

- **AuthManager** — handles token injection and 401 refresh with request deduplication, so callers never manage token lifetimes by hand.
- **Crypto module** — built on Node's `crypto`: AES-256-CBC, RSA-OAEP, ECDH, XAdES-B XML signatures, and self-signed certificate generation. External signing (HSM, EPUAP, smart cards) is supported via a callback-based interface.
- **Offline mode** — full lifecycle for all four KSeF offline modes, including QR KOD I + KOD II signing, deadline tracking, and local storage.
- **Invoice XML builder** — constructs XSD-compliant FA2/FA3/PEF/PEF_KOR XML from typed TypeScript objects with correct element ordering, namespace injection, and three-level client-side validation (well-formedness → XSD/Zod → NIP/PESEL checksums).
- **Streaming batch upload** — constant-memory upload via the Web Streams API with ZIP bomb protection.
- **Incremental export** — high-watermark paginated export with file-based state persistence for resumable long-running exports.
- **Circuit breaker** — opt-in cooldown window after consecutive upstream failures.

## Technical details

| Aspect        | Detail                                                                 |
| ------------- | ---------------------------------------------------------------------- |
| Language      | TypeScript (ES2022 target)                                             |
| Runtime       | Node.js 18+ (native `fetch`, `crypto`)                                 |
| Build         | tsup — dual ESM + CJS output with `.d.ts`                              |
| HTTP          | Zero dependencies — native `fetch` only                                |
| Tests         | Vitest — unit + E2E covering HTTP, crypto, services, and workflows     |
| Package       | `npm i ksef-client-ts` or `npm i -g ksef-client-ts` for the CLI       |
| CLI           | `ksef` with 15 command groups (auth, session, invoice, offline, …)     |
| License       | MIT                                                                    |

## Links

- [Documentation](https://flopsstuff.github.io/ksef-client-ts)
- [NPM package](https://www.npmjs.com/package/ksef-client-ts)
- [Repository](https://github.com/Flopsstuff/ksef-client-ts)
- [KSeF official docs (translated)](https://flopsstuff.github.io/ksef-docs/) — companion translation project
- [KSeF Web Portal](https://ap.ksef.mf.gov.pl/web/) — official token management and invoice portal
