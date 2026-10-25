## Overview

**Telaius** gives an AI agent a telephone. A SIMCom SIM7600G-H modem hanging off a USB port
places an ordinary outbound call with a regular SIM card, and the xAI Realtime voice API
holds the conversation that follows. Nothing in the loop is a cloud telephony service: no
Twilio, no SIP trunk, no rented number, and no microphone or speaker either, because the
call's audio travels as raw PCM over one of the modem's own USB interfaces. The name is
*telephone* plus *Aius Locutius*, the Roman disembodied voice that warned of the Gauls.

## Why it exists

Agents can read and write; they cannot ring a barbershop that only takes bookings by phone,
or a private seller who will answer a call but never an email. The usual way to close that
gap is a cloud telephony API, which means handing a third party every number you dial and
every word of every call, and paying per minute for the privilege.

The project's one load-bearing decision is to treat cellular telephony as **local hardware
instead of a cloud API**. A modem, a SIM and a Raspberry Pi sit in the room; the calls are
plain mobile calls from a plain number. That decision is also the hard part, because
dialling and talking turn out to be different capabilities: an `ATD` command that reports a
connected call proves nothing about whether audio can reach it. Most of the work so far has
gone into proving the audio path on real hardware against a real carrier.

## How it works

A call runs through four pieces: the modem adapter driving AT commands, a digital audio
bridge moving 20 ms PCM frames in both directions, a voice session talking to xAI, and an
orchestrator that holds the lifecycle and writes the result.

```bash
# let the AI run a call with a goal, in Polish
python -m telaius.voicebridge +48XXXXXXXXX --lang pl --audio relay \
    --task "Book a haircut on Saturday after 12:00" \
    --callee "Brzytwa barbershop"
```

The modem exposes several USB interfaces and Telaius uses three of them: `if2` for AT
commands, `if4` for call audio, `if5` for QMI, which is the only place IMS registration
state is visible. Audio only switches to USB once the call is up - `AT+CPCMREG=1` is sent
*after* `VOICE CALL: BEGIN`, and until it is, the far end hears the board's own microphone.
On Linux the kernel's `option` and `qmi_wwan` drivers stay attached and the stable
`/dev/serial/by-id/*SimTech*` links are used; on macOS, where no driver claims the device, a
raw libusb path does the same job.

Every call leaves a folder behind: `call.mp3` with both sides, a readable `transcript.txt`,
and a `result.json` carrying the outcome (`done`, `partial`, `failed`, `no_task`,
`unknown`), a summary written for the owner, and why the call ended - the bot said goodbye,
the callee hung up, or the duration cap hit. The bot reports through an `end_call` tool it
can invoke itself; if the callee hangs up first, it is asked for the result afterwards.

What the bot says is configuration, not code. Each language is a TOML file under `prompts/`
holding its introductions, task template, rules and recording disclosure, so adding
`prompts/<lang>.toml` adds a language. Russian and Polish ship today.

Telephony is a place where "it works on my unit" is the default failure, so the repo keeps
what is proven separate from what is hardware-dependent. VoLTE is the clearest example: an
unregistered IMS falls back to 2G CSFB, and carrying USB audio on a VoLTE call needed a
specific SIMCom firmware before it worked reliably in both directions. Those findings live
in the repo rather than in the code's assumptions.

## Status

M0 (a real call with simultaneous two-way USB audio, no microphone or speaker) and M1 (a
live AI conversation in Russian and Polish, with barge-in and model-initiated hangup) work
as CLI prototypes. M2, the MCP interface that will let another agent delegate a call and
collect the report, is not started. Open items are listed honestly in the hardware notes:
one carrier's VoLTE is still unresolved, long-term USB power margin is unproven, and a call
cut by the duration cap ends abruptly rather than wrapping up.

## Technical details

| Aspect | Detail |
| --- | --- |
| Language | Python 3.11+, installed as a package (`pip install -e .`) |
| Dependencies | `pyusb`, `websockets`; `ffmpeg` optional, for the MP3 of each call |
| Hardware | DFRobot TEL0162 board carrying a SIMCom SIM7600G-H, USB `1e0e:9001`, plus a registered SIM |
| Voice | xAI Realtime (`grok-voice-latest`), server-side VAD, ~0.6-0.9 s to first audio |
| Host | Raspberry Pi or any Linux box (`dialout` group, a udev rule, ModemManager kept away); macOS via libusb |
| Interface | CLI today (`telaius.at`, `telaius.qmi`, `telaius.calltest`, `telaius.voicebridge`); MCP planned |
| Version | 0.1.0 |

Calls, recordings and the `.env` holding the xAI key are all gitignored - none of it belongs
in a repository. The project's own rule on use is short: only call numbers whose owners have
agreed to be called by an AI assistant, and the bot introduces itself as one.

## Links

- [Repository](https://github.com/Flopsstuff/telaius)
- [Concept and milestones](https://github.com/Flopsstuff/telaius/blob/main/docs/TELAIUS_CONCEPT.md)
- [Hardware notes: proven vs. open](https://github.com/Flopsstuff/telaius/blob/main/docs/HARDWARE_NOTES.md)
- [VoLTE and IMS findings](https://github.com/Flopsstuff/telaius/blob/main/docs/VOLTE_NOTES.md)
- [SIM7600X-H module (SIMCom)](https://www.simcom.com/product/SIM7600X-H.html)
- [TEL0162 carrier board (DFRobot wiki)](https://wiki.dfrobot.com/tel0162/)
