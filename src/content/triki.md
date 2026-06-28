## Overview

**triki** turns the **Żabka Triki** (a.k.a. *Tiki*) — a collectible Bluetooth Low
Energy token shaped like a bottle cap (crown cap), given away as a Polish retail
promo — into a usable motion controller. The token is built around a Nordic
**nRF52810** BLE SoC and an **LSM6DSL** accelerometer/gyroscope, and this project
documents how to talk to it over BLE, stream its motion sensors, and drive a live
3D orientation visualisation straight from a browser.

## Why it exists

The Triki ships as a closed promotional gadget with no public protocol. It has a
perfectly good 6-axis IMU inside, so the obvious question is: can you read it and
reuse the hardware for something fun instead of letting it gather dust? This
project answers that by reverse-engineering the token's BLE interface — the GATT
layout, the control register that toggles its LED, and the request/response
command that starts the accelerometer/gyroscope stream — and packaging the result
so anyone with the same token can pick it up as a motion input device. It is a
personal project on the author's own device; no device-identifying values (serial,
BLE MAC) are published.

## How it works

The token communicates over the **Nordic UART Service (NUS)**. A host writes a
command to the RX characteristic and the token answers via notifications on TX:

```
Nordic UART Service  6e400001-b5a3-f393-e0a9-e50e24dcca9e
  RX   …0002  [write]    commands host → token
  TX   …0003  [notify]   responses token → host
  ctrl …0004  [read/write]  control register (green LED)
Battery 0x180F → 0x2A19  (battery level)
```

A short start command puts the token into streaming mode, after which it emits
**14-byte motion frames** carrying the accelerometer and gyroscope samples. Live
decoding is verified at roughly **104 Hz**. On top of the raw stream sits a
**Madgwick** sensor-fusion core that turns the accel/gyro samples into an
orientation quaternion, which the browser demo renders as a live 3D model.

The repo is organised as:

- `tools/` — Python BLE tooling on top of **bleak**: a scanner, a GATT dumper, an
  interactive NUS console, and the accel/gyro stream decoder.
- `packages/triki-controller/` — the reusable Web Bluetooth client, published to npm.
- `docs/` — a VitePress documentation site covering the hardware, BLE protocol, and
  IMU streaming format.

## Technical details

| Aspect          | Detail                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Target hardware | Żabka Triki token — **nRF52810** BLE SoC (Cortex-M4) + **LSM6DSL** IMU |
| Other silicon   | Macronix MX25R8035F SPI NOR flash (8 Mbit), 32 MHz crystal, LED, button |
| BLE transport   | Nordic UART Service; request/response protocol, 14-byte motion frames   |
| Sample rate     | ~104 Hz accelerometer + gyroscope                                      |
| Tooling         | Python 3 + **bleak 3.0.2** scripts (scan, GATT dump, NUS console, stream) |
| Client package  | `triki-controller` — dependency-free TypeScript, Web Bluetooth + Madgwick fusion |
| Browser demo    | Web Bluetooth + glTF `model-viewer` orientation visualiser (Chromium browsers) |
| License         | MIT                                                                    |

## Links

- [Repository](https://github.com/Flopsstuff/triki)
- [Documentation site](https://flopsstuff.github.io/triki/)
- [Live Web Bluetooth controller](https://flopsstuff.github.io/triki/controller/) (Chrome/Edge)
- [`triki-controller` on npm](https://www.npmjs.com/package/triki-controller)
