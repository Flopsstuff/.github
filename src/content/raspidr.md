## Overview

**raspidr** is a smart speaker built from a Raspberry Pi Zero 2 W. It sits in the room,
listens for its own wake phrase entirely on the device, then records your question,
transcribes it, sends it to an LLM agent running on the local network, and speaks the
answer back. A seven-LED NeoPixel ring shows which stage the loop is in, and a rotary
encoder on top handles volume, muting and interrupting.

It is a complete appliance rather than a demo: two systemd services, a deploy script,
hardware documentation down to the pin, and the training pipeline for the wake word model
it runs on.

## Why it exists

Commercial smart speakers send every word they hear to a vendor, answer with whatever
assistant the vendor ships, and cannot be pointed at your own agent. raspidr is the
opposite arrangement. The wake word runs locally, so nothing leaves the room until you
have actually addressed the speaker; the brain is a self-hosted [Hermes
Agent](https://github.com/NousResearch/hermes-agent) on the LAN, which means the assistant
has the memory and tools of that agent rather than a fixed feature list; and every moving
part, down to the wake word model, is something you can retrain or swap.

The second reason is the `/say` endpoint. Because the box is yours, other agents can speak
through it: a build finishing, a heartbeat noticing something, a reminder landing.

## How it works

```
mic -> openWakeWord (on device) -> greeting
    -> Silero VAD records the utterance
    -> Groq STT -> Hermes agent (streamed)
    -> Groq TTS (xAI fallback) -> speakers
```

The wake word is a custom [openWakeWord](https://github.com/dscripka/openWakeWord) model
trained for this speaker: openWakeWord's tflite feature extractor feeds a small numpy MLP,
and detection fires on two consecutive frames above threshold. Recording ends when
[Silero VAD](https://github.com/snakers4/silero-vad) sees 0.9 s of silence, capped at 12 s.
The answer is streamed sentence by sentence, so the first chunk is already being spoken
while the agent is still generating the rest; end of utterance to first sound is about 3 to
4 seconds for a simple question. After an answer the speaker keeps listening for 5 seconds,
so a follow-up needs no wake word.

Continuous wake word detection is the expensive part on a Pi Zero: roughly 27 ms of CPU per
80 ms frame. Two changes cut that. A trimmed feature buffer replaces the stock one, which
copied ten seconds of audio into a Python list every frame, and a noise gate only runs the
models on sound above an adaptive floor, with pre-roll so the phrase is never clipped.
Together they take the assistant from 53% of a core to 34% while idle, with detection
measured unchanged.

The encoder lives in its own process that owns the ring, the volume and the battery gauge,
and talks to the assistant over a unix socket. Volume and lights therefore keep working
while the assistant restarts. A long press closes the microphone outright: `arecord` exits
and a dim red dot stays lit until you press again.

## Technical details

| Aspect | Detail |
| --- | --- |
| Board | Raspberry Pi Zero 2 W, Debian 12 arm64, Python 3.11, 416 MB RAM |
| Audio | WM8960 codec HAT over I2S plus a TPA3118 amplifier; ALSA `dsnoop`/`dmix` so mic and players coexist |
| Indicators | 7 x WS2812B NeoPixel ring over SPI, rotary encoder and button via `pigpiod` |
| Power | UPS-Lite V1.3 with a CW2015 fuel gauge on I2C, charge shown on the ring |
| On-device models | openWakeWord features (tflite) with a custom numpy classifier, Silero VAD (onnxruntime) |
| Cloud speech | Groq `whisper-large-v3-turbo` for STT and Orpheus for TTS, with xAI TTS as the rate-limit fallback |
| Brain | Hermes Agent over an OpenAI-compatible streaming API on the LAN |
| Agent API | `POST /say` with a bearer token, so other agents can speak through the speaker |
| Deployment | `deploy.sh` rsyncs from the workstation; two systemd units with memory caps of 320 MB and 48 MB |
| Configuration | a single gitignored `.env`; no hosts, keys or addresses anywhere in the source |
| Licence | MIT for code and docs. The shipped wake word model inherits openWakeWord's CC BY-NC-SA terms, so it is non-commercial; retrain for anything else |

## Links

- [Repository](https://github.com/Flopsstuff/raspidr)
- [Documentation](https://flopsstuff.github.io/raspidr/)
- [Architecture](https://github.com/Flopsstuff/raspidr/blob/main/docs/architecture.md) - the loop, modules, audio stack and measurements
- [Hardware](https://github.com/Flopsstuff/raspidr/blob/main/docs/hardware.md) - pinout, components and known issues
- [Wake word training](https://github.com/Flopsstuff/raspidr/blob/main/docs/wakeword_training.md) - how to train your own phrase
- [openWakeWord](https://github.com/dscripka/openWakeWord) and [Silero VAD](https://github.com/snakers4/silero-vad) - the on-device models
