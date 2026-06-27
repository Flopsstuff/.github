## Overview

**otp** is a simple, private TOTP (Time-based One-Time Password) generator that
runs entirely in your browser. It produces the same rotating 6–10 digit codes
that authenticator apps show, but with no account, no install, and no network:
every code is computed locally from a shared secret using the browser's native
Web Crypto API.

## Why it exists

Two-factor codes and shared verification secrets are usually trapped inside a
phone app. otp exists for the cases where you want that math in a plain web page
you control — to check a TOTP secret, to keep a backup generator that works
offline, or to run a lightweight **identity-verification channel** with someone
you trust: both sides hold the same secret, and comparing the current codes
confirms you're talking to the real person (useful in an age of deepfakes and
AI-generated impersonation).

Because nothing is transmitted or persisted, the secret never leaves your
device, which is the whole point of a second factor.

## How it works

1. **Enter or generate a secret** — paste a Base32 secret or roll a random one.
2. **Configure parameters** — algorithm (SHA-1/256/512), code length (6–10
   digits), and period (10–60s); defaults match the standard 6-digit/30s/SHA-1.
3. **Compute locally** — the page runs the RFC 6238 TOTP algorithm via the Web
   Crypto API (HMAC over the time counter), refreshing the code each period.
4. **Use it** — copy the current code, or scan the generated `otpauth://` QR
   into Google Authenticator, Authy, 1Password, Microsoft Authenticator, etc.

No data is sent to any server and nothing is stored; after the first load it
works fully offline.

## Technical details

| Aspect      | Detail                                                       |
| ----------- | ------------------------------------------------------------ |
| Stack       | HTML5 + CSS3 (Grid) + vanilla JavaScript, no framework       |
| Crypto      | Native Web Crypto API (HMAC-SHA-1/256/512) — no crypto deps  |
| Standard    | [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) TOTP, Key Uri `otpauth://` format |
| QR codes    | [QRious](https://github.com/neocotic/qrious) (CDN, self-hostable) |
| Privacy     | Offline, client-only; no analytics, tracking, or storage     |
| Hosting     | Static site on GitHub Pages                                  |
| License     | MIT                                                          |

## Links

- [Repository](https://github.com/Flopsstuff/otp)
- [Live site](https://flopsstuff.github.io/otp/)
- [RFC 6238 — TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- [Key Uri Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)
