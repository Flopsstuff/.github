## Overview

**Telaius** gives an AI agent a telephone: a small piece of hardware and the software that drives
it, sitting on your own desk. You hand it an errand in plain words - book a haircut on Saturday
after 12:00, ask whether the part is in stock, find out when they close - and it dials a real
number, talks to whoever picks up, and comes back with the answer.

The conversation is held by a realtime voice model, not by a menu tree or a recording. The call
itself goes out over an ordinary SIM in your own device, so the numbers you dial and the words
spoken on them never pass through anyone else's service. The name is *telephone* plus *Aius
Locutius*, the Roman disembodied voice that warned of the Gauls.

## Why it exists

An agent can read, write and book anything that has a web form. It cannot ring the barbershop that
only takes bookings by phone, or the private seller who answers a call but never an email. That is
a large part of the real world, and it is closed to an agent that has no voice.

The usual way to open it is a cloud telephony API, which means a third party sees every number you
dial and hears every call you make, billed by the minute. Telaius takes the other road: the
telephony is yours, physically. A modem, a SIM and a small Linux host - a Raspberry Pi is enough -
make an ordinary mobile call from an ordinary number.

## How it works

You give the agent's call a goal and the context it needs, and the system does the rest:

```bash
python -m telaius.voicebridge +48XXXXXXXXX --lang pl \
    --task "Book a haircut on Saturday after 12:00" \
    --callee "Brzytwa barbershop"
```

It dials, waits for an answer, and introduces itself as an AI assistant calling on your behalf -
it does not pretend to be a person. From there the voice model carries the conversation: it
pursues the goal, answers questions, handles being interrupted, and recognises a refusal, a
voicemail or a busy line for what it is. It decides when the errand is finished and hangs up.

Every call leaves a folder behind:

- the recording of both sides;
- a readable transcript;
- a structured result - the outcome (done, partial, failed, nothing asked), a short summary written
  for you, and why the call ended.

What the agent says is configuration, not code: each language is a text file with its own
introductions, task template and rules, so adding a language is adding a file. Russian and Polish
ship today.

## Status

Placing a real call and holding a live conversation on it both work, and are driven from the
command line. The next step is the interface that lets another agent delegate a call on its own
and collect the report without touching telephony at all - that part is not built yet.

The hardware side is honest about what is proven and what depends on your carrier: the repository
keeps those notes next to the code, including which network features were verified on real calls
and which are still open.

## Technical details

| Aspect | Detail |
| --- | --- |
| What you need | A 4G modem with a registered SIM, plugged into a Linux host (a Raspberry Pi is enough) |
| Software | Python 3.11+, installed as a package |
| Voice | A realtime speech-to-speech model, about 0.6-0.9 s from the end of your sentence to its first word |
| Interface | Command line today; agent-facing interface planned |
| Audio | Handled digitally over the modem itself - no microphone, no speaker, nothing in the room to overhear |

Recordings, transcripts and credentials stay on your machine and out of the repository. The
project's rule on use is short: call only numbers whose owners have agreed to be called by an AI
assistant, and the assistant says what it is.

## Links

- [Repository](https://github.com/Flopsstuff/telaius)
- [Concept and milestones](https://github.com/Flopsstuff/telaius/blob/main/docs/TELAIUS_CONCEPT.md)
- [Hardware notes: proven vs. open](https://github.com/Flopsstuff/telaius/blob/main/docs/HARDWARE_NOTES.md)
