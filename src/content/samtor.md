## Overview

**samtor** is a set of custom web applications for **Samsung Tizen TV** devices,
developed and measured on a **Smart Monitor M8** (Tizen 6.5, Chromium 85, Mali-G31
GPU). Three apps ship in the repo: **DinoJump**, a Canvas 2D runner driven by the
remote's arrow keys; **Bench**, a CPU/graphics/memory/codec benchmark that doubles as
a live demo surface; and **Doom**, doomgeneric with sound via SDL2_mixer. Around them
sits everything the work needed - pairing and remote control over the Samsung
WebSocket API, Developer Mode and `sdb` helpers, and on-device profiling probes.

## Why it exists

A Smart Monitor is a capable computer that ships as an appliance, and almost nothing
public says what it can actually do once you sideload your own code onto it. This
project answers that empirically: get an app onto the device, drive it from a script
instead of a remote, profile it over Chrome DevTools Protocol, and write down the
result. What comes out is a set of hard numbers and a list of platform walls - the
kind of thing you otherwise only learn by hitting them.

The findings are blunt. The panel is 4K but web apps render at **1920x1080**. Canvas
2D is barely accelerated (~176 sprites at 60 fps, fill rate ~55 Mpx/s) while WebGL
manages ~28,397 triangles at the same frame rate, so heavy drawing belongs on the
GPU. WASM runs ~371 M ops/s against JavaScript's ~23 M on the same micro-benchmark,
roughly **16x**. Raising Doom's canvas backing store to 1440x1080 dropped it from 60
fps to ~32. On the platform side: dictation is impossible (`getUserMedia` fails,
`webapis.microphone` and `tizen.stt` are absent), though `webapis.voiceinteraction`
does work for a sideloaded app.

## How it works

Apps are ordinary HTML/Canvas projects packaged as `.wgt` bundles with the Tizen CLI
and installed over `sdb`, signed with a Samsung Author + Distributor certificate
carrying the target device's DUID. Remote control runs over the **Samsung WebSocket
API on TLS port 8002**: a one-time on-screen approval yields a token, after which
`tools/tvctl.py` can send keys and launch apps unattended. Debugging attaches CDP to
a closed app and forwards the port to the workstation.

```bash
"$SDB" connect "${MONITOR_IP}:${SDB_PORT}"

# one-time on-screen approval, then the token is saved
.venv/bin/python tools/tvctl.py pair
.venv/bin/python tools/tvctl.py open BenchApp00.Bench

# prints the CDP port; the app must be closed first
"$SDB" shell 0 debug BenchApp00.Bench
```

The most interesting piece is `pairing/`. A TV web app cannot open a listening
socket, the phone shares no account or network with the TV, and Web Bluetooth is a
dead end on iOS - so there is no direct route for handing an app a long credential.
The solution takes the shape of [RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628):
a Cloudflare Worker both sides reach outbound. The app shows a QR and an
eight-character code, the user opens it on a phone, and values arrive over a
WebSocket that stays open, so a mistake can be corrected without starting over.
Sessions are single-device, expire after 120 seconds unclaimed, and hard-cap at one
hour. A second mode mirrors a form that is *already on screen*, so every keystroke
crosses in both directions while both screens are up.

## Technical details

| Aspect | Detail |
| --- | --- |
| Target device | Samsung Smart Monitor M8 - Tizen 6.5, Chromium 85, Mali-G31 GPU |
| Applications | DinoJump (Canvas 2D), Bench (benchmarks + demos), Doom (WASM + SDL2_mixer) |
| Packaging | Tizen CLI `build-web` / `package -t wgt`, installed via `sdb`; package ID is exactly 10 alphanumeric characters |
| Signing | Samsung Author + Distributor profile with the device DUID, via Tizen Certificate Manager |
| Tooling | Python 3 + [`samsungtvws`](https://github.com/xchwarze/samsung-tv-ws-api) - pairing, remote control, Developer Mode and sdb watchers |
| Remote protocol | WebSocket over TLS port 8002 with a saved token; ~0.6 s between key presses |
| Profiling | Chrome DevTools Protocol over the network; JSON captures in `results/` |
| Remote config | Cloudflare Worker rendezvous - QR + 8-character code, `RemoteConfig` and `RemoteMirror` clients |
| Assets | Icons in Git LFS; Doom engine, WAD, and Timidity patches are built locally from pinned, checksum-verified upstream archives |
| License | MIT (dependencies and generated Doom artifacts keep their own - see `THIRD_PARTY_NOTICES.md`) |

Nothing device-identifying is published: documentation examples use RFC 5737
addresses, the pairing token is gitignored, and local device notes stay out of the
repo.

## Links

- [Repository](https://github.com/Flopsstuff/samtor)
- [Remote configuration service](https://github.com/Flopsstuff/samtor/blob/main/pairing/README.md)
- [Third-party notices](https://github.com/Flopsstuff/samtor/blob/main/THIRD_PARTY_NOTICES.md)
- [Samsung TV SDK setup](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html)
- [doomgeneric](https://github.com/ozkl/doomgeneric)
