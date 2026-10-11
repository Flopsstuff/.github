## Overview

**Keryx** is a voice speaker for the [Hermes agent](https://github.com/NousResearch/hermes-agent).
A [XIAO ESP32S3](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/) riding on a
[Seeed reSpeaker Flex XVF3800](https://wiki.seeedstudio.com/respeaker_flex_introduction/)
four-microphone array listens for "Hey Keryx" on the device itself; once it hears the wake
word, the request goes over Wi-Fi to a small voice bridge running next to Hermes, and the
answer comes back as speech out of the speaker. The first unit is built into an Edifier R1100,
with an LED-ring clock behind the grille and a knob on the back. *Keryx* (κῆρυξ) is Greek for
a herald, the one who speaks aloud for Hermes.

![The Keryx prototype: the reSpeaker Flex core board with the XIAO ESP32S3 underneath, its circular four-microphone array and the Wi-Fi antenna](https://media.githubusercontent.com/media/Flopsstuff/keryx/main/docs/images/keryx-prototype.jpg)

## Why it exists

Hermes is a capable agent with its own tools, memory, and skills, reached through an
OpenAI-compatible API. Keryx gives it a mouth and ears in the room: no phone, no laptop, no
app. The design puts the wake word on the board rather than in the cloud, so nothing leaves
the room until "Hey Keryx" is actually said, and it keeps the heavy speech models off the
Raspberry Pi next to Hermes by calling cloud speech-to-text and text-to-speech instead.
It is also a conversation rather than a command line: after the wake word a follow-up needs
no wake word, talking over an answer stops it, and a few seconds of silence end the exchange.
Hermes can also speak first, which is what makes reminders and timers work.

## How it works

The board handles audio and the wake word; the bridge handles speech and Hermes.

- **On the board.** The XVF3800 does the acoustic work in hardware: it cancels Keryx's own
  playback from the microphones (its output line is the echo reference), beam-forms towards
  the talker, and suppresses noise. Its ASR channel is decimated from 48 to 16 kHz with the
  same filter the training audio went through, fed into the TFLite Micro micro_speech
  frontend and a streaming wake-word model written out as plain float C. Each 30 ms only the
  newest outputs of every layer are recomputed, which costs roughly 0.5 ms per 5 ms block of
  audio. The same firmware is also a USB Audio Class sound card, which is how the training
  recordings were captured.
- **Over Wi-Fi.** The board holds a WebSocket to the bridge and streams the microphone there
  after a detection.
- **On the bridge.** A Python service turns the stream into text with xAI's streaming
  speech-to-text, asks Hermes over its OpenAI-compatible API, reads the answer with xAI
  text-to-speech, and streams the audio back for playback. It also hands Hermes `say.sh` and
  `set_volume.sh`, so the agent can start a conversation of its own.

End of sentence to first sound is about a second, plus Hermes' own thinking time. Speech runs
around **$0.004 per exchange**.

Installation is one script on the machine that will run the bridge, with the board on USB:

```bash
git clone https://github.com/Flopsstuff/keryx.git && cd keryx
./setup.sh
```

`setup.sh` installs the bridge as a systemd service, asks for the keys, flashes the board, and
pairs it over Wi-Fi. After that the board runs off any USB power supply. The XVF3800 needs
Seeed's I2S firmware flashed once before any of this.

## Technical details

| Aspect | Detail |
| --- | --- |
| Hardware | reSpeaker Flex XVF3800 + XIAO ESP32S3, U.FL Wi-Fi antenna; 3.5 mm output, or a 4 Ohm speaker on the JST amplifier output with 12 V in |
| Firmware | ESP-IDF, C/C++ - wake word, USB Audio Class sound card, Wi-Fi link, OTA, LED panel, serial console |
| Wake word | microWakeWord-style streaming model trained mostly on xAI-synthesized speech (28 voices, accents, speech tags) plus real takes through the board; exported to C weights |
| Bridge | Python 3.10+, installed into its own venv as `keryx-bridge` with a systemd user service |
| Speech | xAI streaming STT and WebSocket TTS - chosen on measured latency (STT ~0.9-1.2 s, TTS ~360 ms to first audio with the socket already open) and cost |
| Agent | Hermes with its API server enabled, reached over its OpenAI-compatible API |
| Enclosure | Built into an Edifier R1100; printed mic hat and encoder knob as parametric Onshape features with STLs |
| License | Apache-2.0; vendored `micro_frontend` (Apache-2.0, with KISS FFT BSD-3-Clause) and `usb_device_uac` (Espressif, Apache-2.0) keep their own |

Status: work in progress.

## Links

- [Repository](https://github.com/Flopsstuff/keryx)
- [Documentation map](https://github.com/Flopsstuff/keryx/blob/main/docs/index.md)
- [Assembly into the Edifier R1100](https://github.com/Flopsstuff/keryx/blob/main/docs/assembly.md)
- [Speech providers: what was measured and why xAI](https://github.com/Flopsstuff/keryx/blob/main/docs/speech-providers.md)
- [Hermes agent](https://github.com/NousResearch/hermes-agent)
- [reSpeaker Flex XVF3800](https://wiki.seeedstudio.com/respeaker_flex_introduction/)
