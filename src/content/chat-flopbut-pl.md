## Overview

**chat.flopbut.pl** is a private chat with an AI assistant that knows about Flop Butylkin. It is
meant mostly for recruiters, hiring managers and founders who want to know whether Flop fits a
role, and it is open by invitation only: anyone can sign in with Google, but only an invite link
lets them into the chat.

The code is public under MIT. The knowledge base the bot answers from - notes about Flop and
their photos - is not in the repository and is not public.

## Why it exists

A CV answers the questions its author thought of. A recruiter's questions are more specific:
years with a given technology, what a project actually involved, whether a relocation or a type
of contract would work. The assistant answers those from a curated set of notes, in the
visitor's language, and is told never to invent an employer, a date or a figure the notes do
not give.

## How it works

1. **Invite.** The owner creates invite links, each with a limited number of places and an
   expiry. An account's first join takes one place; signing in again does not. Anyone without a
   valid link sees the same "You're on the list" screen and can be invited later.
2. **About you.** Once, before the chat, a member can say who they are, their company, the roles
   they have in mind and the language to talk in. Every field is optional and the form can be
   skipped.
3. **The bot speaks first.** It greets the member in their language and answers each question
   from the knowledge base, which it reads with three tools: read a note, grep across notes, list
   them. The candidate's card, the index of every note and the skills list are preloaded, so
   common questions need no tool call.
4. **Asking Flop.** When the notes have no answer and it matters, the bot puts the question to
   Flop in Telegram with a few suggested answers. If he replies within 50 seconds, the bot goes
   on with it; otherwise it says the answer will come and posts it in the chat when it does.
5. **Allowance.** Every answer is priced, and each chat has a budget. When a chat runs out of
   budget or context, it says so.

One conversation per account; the owner can read every chat, manage members and invites, and
see what each answer cost.

## Technical details

| Aspect | Detail |
| --- | --- |
| Server | Node, Hono, TypeScript, Firebase Admin SDK; answers streamed as server-sent events |
| Client | Vite, React, TypeScript, served by the same container |
| Hosting | Google Cloud Run (`europe-west1`) |
| Auth | Firebase Authentication with Google sign-in, proxied on the site's own domain so Safari and in-app browsers can finish it |
| Data | Firebase Realtime Database, written only by the server; the knowledge base in a private Cloud Storage bucket |
| Model | Through OpenRouter with the Vercel AI SDK by default (Claude Haiku), with Anthropic and OpenAI backends; prompt caching on the knowledge base |
| Tooling | pnpm, Biome, Vitest against the Firebase emulators, GitHub Actions |
| Design | Follows [flopbut.pl](https://flopbut.pl): patina on ink, Geologica, Golos Text and IBM Plex Mono |
| License | MIT for the code; the name, the brand and the knowledge base are not covered |

## Links

- [chat.flopbut.pl](https://chat.flopbut.pl) - by invitation
- [Repository](https://github.com/Flopsstuff/chat.flopbut.pl)
- [flopbut.pl](https://flopbut.pl) - Flop Butylkin's personal site
