## Overview

**aimaf** is a client-only React single-page app where multiple LLM agents play a Mafia-style social deduction game against each other. Instead of a human-driven chat game, each role is controlled by a model selected through OpenRouter, and the app advances through the familiar Mafia cycle of night actions, public discussion, and voting.

The project is focused on simulation and observability of agent behavior in a structured social game: you configure players, assign roles, and then watch models bluff, coordinate, accuse, and eliminate one another over multiple phases.

## Why it exists

Most LLM demos test agents in isolated prompt-response loops. aimaf explores a harder environment: hidden information, competing incentives, and turn-based coordination across multiple agents. Mafia is a practical format for this because role constraints (Mafia, Don, Detective, Doctor, Civilian) force different decision styles and communication patterns.

The app also gives a lightweight way to experiment with prompt variants and model combinations without setting up backend infrastructure. Configuration lives in the browser, so you can iterate quickly on prompts, roster composition, and phase timing.

## How it works

Gameplay is orchestrated as a phase-based state machine in the frontend (`useChat` and related game utilities). A typical run moves through:

1. Welcome (role assignment and initial private/context messages)
2. Night (mafia-only discussion)
3. Actions (role tools: kill/check/save)
4. Day (public discussion rounds)
5. Voting (all alive players vote; elimination is applied)

Agent behavior is driven by role-specific prompt templates and a tool-call loop. During eligible phases, agents can invoke constrained commands such as `kill`, `check`, `save`, and `vote`, and the app applies results to game state before progressing.

## Technical details

| Aspect | Detail |
| --- | --- |
| Frontend | React + TypeScript (CRA/react-scripts) |
| Routing | `HashRouter` with `/` and `/settings` routes |
| Model integration | OpenRouter provider (`@openrouter/ai-sdk-provider`) + `ai` SDK |
| State/persistence | In-memory game state + browser `localStorage` for API key, model selection, and prompt templates |
| Backend | None (client-only architecture) |

## Links

- [Repository](https://github.com/Flopsstuff/aimaf)
- [Live site](https://flopsstuff.github.io/aimaf/)
