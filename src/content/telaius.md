## Overview

Three parts make a call. A 4G modem with an ordinary registered SIM, plugged into a small Linux
host - a Raspberry Pi is enough. The software on that host, which dials, supervises the call and
writes the result. And a realtime voice model, which does the talking.

The telephony is yours, physically: the call is a normal mobile call from a normal number, with no
cloud telephony provider between the host and the network. The audio of the conversation is
streamed to the voice model you configure - that model is the one external service in the path,
and swapping it is a configuration change, not a rewrite.

What it can do today: place an outbound call with a goal and the context around it, talk in Russian
or Polish, be interrupted mid-sentence and carry on, tell a refusal from a voicemail from a busy
line, decide for itself that the errand is finished and hang up, and leave a per-call record behind.
The name is *telephone* plus *Aius Locutius*, the Roman disembodied voice that warned of the Gauls.

## Why it exists

An agent can read, write and book anything that has a web form. It cannot ring the barbershop that
only takes bookings by phone, or the private seller who answers a call but never an email. That is
a large part of the real world, and it is closed to an agent that has no voice.

The usual way to open it is a cloud telephony API: a third party provisions the number, carries
every call and bills it by the minute, and your call records live in their account. Telaius takes
the other road - the line is your own SIM in your own device, and the only thing that leaves the
host is the call audio going to the voice model that holds the conversation.

## How it works

You give the agent's call a goal and the context it needs, and the system does the rest:

```bash
python -m telaius.voicebridge +48XXXXXXXXX --lang pl \
    --task "Book a haircut on Saturday after 12:00" \
    --callee "Brzytwa barbershop"
```

It dials, waits for an answer, and introduces itself as an AI assistant calling on your behalf -
it does not pretend to be a person. From there the voice model has the floor: it hears the far
side and speaks back over the same live call. When the errand is finished it says goodbye and
reports the outcome through a tool call of its own; if the callee hangs up first, it is asked for
the result afterwards instead.

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
