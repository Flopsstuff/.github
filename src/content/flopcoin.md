## Overview

**FlopCoin** is a physical silver coin - a single issuance of around 100 unique
pieces. It is two things at once: an art object you can hold, and a token that
carries a promise. Holding a FlopCoin is a public claim on **one hour of Flop's
time**, spent on whatever the owner asks for.

![A FlopCoin silver coin](https://flopcoin.art/s1.jpg)

The site at [flopcoin.art](https://flopcoin.art) is the canonical explainer: what
a FlopCoin is, how to redeem one, worked examples, the limits, and the current
list of owners.

## Why it exists

Attention and time are the scarcest things a person has, and they are almost
impossible to represent as an object. FlopCoin makes that abstraction concrete:
it turns "an hour of Flop's time" into a scarce, transferable, collectible thing
you can keep on a shelf or pass to someone else.

Because the issuance is capped and each coin is unique, it is as much a
collectible and art piece as it is a favour token. The point is the tension
between the two - a beautiful object whose real value is a human promise.

## How it works

- **Issuance.** One minting of ~100 unique silver pieces. There will not be
  another run, so the supply is fixed.
- **Redemption.** The holder redeems a coin for one hour of Flop's time, on a
  request of their choosing, within the limits spelled out on the site.
- **Transfer.** The only way to acquire a coin is from someone who already holds
  one - it is not sold from a shop. Ownership therefore moves peer to peer.
- **Owners list.** Current owners are shown on the site's *Owners* page. That
  list is data, not a database: it is maintained by editing a single
  `owners.json` file in the repository, and each entry's "last updated" date is
  derived from the git history of that file at build time.

## Technical details

The website is a small, static content site - there is no backend, no database,
and no user input at runtime.

| Aspect      | Detail                                                              |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19 + TypeScript                     |
| Styling     | Tailwind CSS 3                                                       |
| Output      | Static export (`output: 'export'`) - no server, ISR, or middleware  |
| Hosting     | Cloudflare Pages, custom domain `flopcoin.art`                      |
| Owners data | `public/owners.json`, read at build time; photos tracked in Git LFS |
| Repository  | `github.com/Flopsstuff/flop.hr` (the domain and repo names differ)  |

Because the coin photos are stored in Git LFS - which Cloudflare Pages' own build
system does not support - the production build runs in GitHub Actions and pushes
the finished static export to Pages on every commit to `main`.

## Links

- [flopcoin.art](https://flopcoin.art) - what it is, how to redeem, and owners
- [Repository](https://github.com/Flopsstuff/flop.hr)
