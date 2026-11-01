## Overview

**voistic** is a physical Wi-Fi button for voice input. Hold it and speak: the audio
streams to a server on your LAN, gets transcribed, and is typed into whatever window
has focus. Short presses do something else entirely - one, two or three clicks run
whatever you bind to them, Enter, Tab and Esc out of the box. The button is a Seeed
XIAO ESP32-S3 with an Adafruit IoT Button and a MEMS microphone on a 150 mAh LiPo; the
server is a single Go binary for macOS and Linux.

The image at the top of this page is a **concept render** of an enclosure that does not
exist yet. The thing that works today is a stack of boards wrapped in white tape:

![The voistic prototype held in a hand, a small stack of boards wrapped in white tape with its button showing](https://media.githubusercontent.com/media/Flopsstuff/voistic/main/docs/images/3.jpg)

## Why it exists

Dictation on a computer is usually a key combination, which means the computer has to be
the thing you are already touching, and the shortcut has to survive whatever app is in
front. A button on the desk is a dedicated control: you pick it up, hold it, talk, and
let go. Because it is its own device it also carries three more gestures, so the same
object that dictates can press Enter on whatever is listening, or fire an HTTP request
at something else on the network.

The constraint that shapes the whole design is battery life. The board is in deep sleep
between presses, so there is no way to reach it while it sleeps and no long-running
loop to hang a feature on: every press is one short cycle - wake, connect, do the job,
sleep.

## How it works

1. A press wakes the board. Wi-Fi and the microphone both start immediately, **before**
   the firmware knows which gesture this is, and audio goes into a 6 MB ring buffer in
   PSRAM. That is what keeps the first half-second of speech from being lost while the
   network comes up.
2. A gesture state machine classifies the press: `single` / `double` / `triple` up to
   350 ms apart, or `long` from 0.4 s, held for as long as you speak.
3. A hold streams 16 kHz mono PCM to the server over chunked HTTP for the length of the
   press. The server writes a WAV, sends it to Groq for speech-to-text, drops the
   transcript next to it, and pastes it into the active window (macOS, which needs
   Accessibility permission for the key presses).
4. A short press just runs its bound action - an `exec` command or an `http` call - from
   the YAML config, which is re-read on every press.
5. A NeoPixel reports the whole thing in colour: press count, recording, accepted,
   failed.

Requests are signed with HMAC-SHA256 under a per-device key with a growing counter
against replays. There is no TLS, so the audio crosses your own LAN in the clear and
goes to Groq for transcription - the README says so plainly rather than claiming
otherwise.

Five short presses ask the server for a new firmware; the board fetches it, checks the
SHA-256 and restarts, and the bootloader rolls back if the new image never reports in.

![The prototype's boards before taping: the SPH0645 microphone board and the IoT Button stacked on the XIAO, next to the LiPo and the Wi-Fi antenna](https://media.githubusercontent.com/media/Flopsstuff/voistic/main/docs/images/2.jpg)

## Technical details

| Aspect | Detail |
| --- | --- |
| Board | Seeed XIAO ESP32-S3 Plus (16 MB flash, 8 MB PSRAM) + Adafruit IoT Button with NeoPixel BFF, SPH0645 I2S microphone, 150 mAh LiPo |
| Firmware | C++ on PlatformIO / Arduino-ESP32; gesture logic is Arduino-free and unit-tested natively (`pio test -e native`) |
| Server | A single Go binary for macOS and Linux; `voistic install` registers it as a launchd agent on macOS. Config in `~/.config/voistic/config.yaml`, re-read on every press |
| Transcription | Groq Whisper (`whisper-large-v3` by default), with a configurable language and a list of phrases to drop |
| Protocol | JSON over HTTP on port 8787, HMAC-SHA256 signed both ways, mDNS `_voistic._tcp` discovery |
| Enclosure | Parametric tube and cap modelled in FeatureScript, STLs in `cad/` - designed, not yet printed |
| License | MIT |

Status: a working prototype, one unit, built and used by its author.

## Links

- [Repository](https://github.com/Flopsstuff/voistic)
- [Hardware notes: parts, wiring, power, quirks](https://github.com/Flopsstuff/voistic/blob/main/docs/hardware.md)
- [Architecture notes for contributors](https://github.com/Flopsstuff/voistic/blob/main/AGENTS.md)
- [Seeed XIAO ESP32-S3](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- [Groq speech-to-text](https://console.groq.com/docs/speech-to-text)
