## Overview

**ShaRiki** turns a [Żabka Triki](/projects/triki) - the collectible BLE token shaped like a
bottle cap - into a shaker. Hold the token, shake it, and your computer plays maracas, a
cabasa, a shekere, an egg shaker, a ganzá or a rainstick. The sound is synthesised in real
time rather than played from samples, so it answers the gesture: shake harder and it gets
denser, stop sharply and it clicks, sweep slowly and the beads trickle.

It is a Rust workspace with a single CLI, `shariki`, for macOS and Linux.

## Why it exists

The Triki token already carries a 6-axis IMU and talks BLE, and the
[triki](/projects/triki) project worked out how to read it. A shaker is the most direct
thing to do with a motion sensor you hold in your fist: the instrument *is* the gesture, so
there is no mapping to learn. The interesting part is making it feel like one - a sample
triggered on each shake sounds like a drum machine, not like beads in a gourd.

## How it works

```
token ──BLE──▶ triki-ble ──ImuFrame──▶ shariki-motion ──MotionState──▶ shariki-engine ──▶ audio out
```

1. **BLE.** `triki-ble` scans for the token, connects and streams accelerometer and
   gyroscope frames, at 416 Hz by default (`--rate` from 26 to 416).
2. **Motion.** `shariki-motion` tracks gravity with a complementary filter, subtracts it,
   and derives two signals: a continuous shake *energy* and discrete *impulses* - the
   moment the beads would hit the wall, detected as a reversal of acceleration along the
   axis you are shaking on. An impulse is as loud as the stop was sharp. A token at rest
   reads exactly zero.
3. **Sound.** `shariki-engine` runs PhISEM, Perry Cook's physically informed stochastic
   model from the STK `Shakers` class. Energy sets how often beads collide; each collision
   is a burst of noise run through a few resonators and a body filter. Impulses add an
   accented "chk" on top. The audio path does not allocate, and a test enforces that.

## Presets

Every instrument is a preset in JSON: the model's resonances, click decay, body filter and
level, plus default values for six parameters - `beads`, `decay`, `damping`, `size`,
`sensitivity` and `gain`. New instruments need no recompiling. Edit `presets.json` while
`play` is running and press **r** to hear the change; **↑ / ↓** switch preset with a 30 ms
crossfade. A broken file is rejected with the line and field at fault.

```sh
shariki play                     # first token nearby, first preset
shariki play cabasa -p size=1.4  # a given preset, one parameter overridden
shariki play --demo              # no token: a synthetic gesture
shariki render ganza -o ganza.wav
```

## Technical details

| Aspect | Detail |
| --- | --- |
| Language | Rust, a Cargo workspace of five crates: `core`, `triki` (BLE driver on btleplug), `motion`, `engine`, and the `shariki` CLI |
| Controller | Żabka Triki BLE token (nRF52810 + LSM6DSL IMU) |
| Synthesis | PhISEM shakers ported from the Synthesis ToolKit (STK) by Perry R. Cook and Gary P. Scavone |
| Audio | cpal; `render` writes a WAV with no audio device |
| Platforms | macOS (the binary embeds its own Info.plist and re-spawns itself so macOS grants Bluetooth to shariki, not to the terminal) and Linux (BlueZ, ALSA) |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/ShaRiki)
- [triki - the token, reverse-engineered](https://github.com/Flopsstuff/triki)
- [Third-party notices: the STK port](https://github.com/Flopsstuff/ShaRiki/blob/main/THIRD_PARTY_NOTICES.md)
- [The Synthesis ToolKit (STK)](https://ccrma.stanford.edu/software/stk/)
