## Overview

**soulgrep** is an AI-powered analyzer for chat history, specifically designed to infer psychological profiles (psychotypes) from Telegram exports. It transforms thousands of fragmented messages into a structured behavioral portrait, allowing users to "grep the human signal" from the noise of digital communication.

## Why it exists

Modern chat logs are voluminous and messy, making it difficult to maintain a high-level understanding of a person's communication style or personality traits over time. While LLMs are capable of this analysis, most tools require uploading sensitive, private chat logs to a third-party cloud.

soulgrep was built with a **privacy-first** mandate. It performs all data parsing and chunking locally in the browser, ensuring that raw chat logs never leave the user's machine. Data is only sent to the user's chosen LLM provider (OpenAI, Anthropic, or OpenRouter) using their own API keys, providing full control over data sovereignty.

## How it works

The analysis workflow is divided into three distinct phases:

1.  **Ingestion & Parsing** — The user uploads a Telegram `result.json` export. A background Web Worker parses the file locally to extract message history and build a "persona corpus" for the target speaker.
2.  **Signal Extraction** — The application splits the corpus into manageable chunks and executes parallel LLM calls. Each call identifies specific behavioral signals, linguistic patterns, and psychological markers within that chunk.
3.  **Synthesis** — A final LLM pass aggregates the extracted signals into a cohesive psychological profile, covering communication style, cognitive patterns, and interpersonal dynamics.

The resulting "psychotype" can be explored in the dashboard or exported as a structured JSON/Markdown report.

## Technical details

| Aspect       | Detail                                                        |
| ------------ | ------------------------------------------------------------- |
| Frontend     | React 19, TypeScript, Vite 8                                  |
| Styling      | Tailwind CSS v4                                               |
| Routing      | React Router v7 (data-router mode)                            |
| Processing   | Browser Web Workers for non-blocking local parsing            |
| Deployment   | Cloudflare Workers (SPA)                                      |
| Tooling      | Biome (linting/formatting), Vitest (testing)                  |

The application is a pure SPA, leveraging the browser's capabilities to handle large JSON exports without a backend, which reinforces its privacy-centric design.

## Links

- [Repository](https://github.com/Flopsstuff/soulgrep)
- [Live Application](https://soulgrep.aignite.pl)
- [Telegram: Exporting Your Data](https://telegram.org/blog/export-and-more)
