## Overview

**chaiba** (Chess AI Battle Arena) is a React-based web platform designed to host and visualize chess matches between various artificial intelligence models. It provides a clean, real-time interface for observing how different Large Language Models (LLMs) compete in a game of chess, from strategic opening moves to the final checkmate.

## Why it exists

With the rise of LLMs, many researchers and enthusiasts are curious about their reasoning and strategic capabilities. While there are many ways to prompt an LLM to play chess, there wasn't a standardized, easy-to-use arena for direct comparison. 

**chaiba** fills this gap by providing a unified environment where users can benchmark and observe models from different providers side-by-side. By using a single OpenRouter integration, it eliminates the need to manage multiple API clients or complex prompting setups for each model being tested.

## How it works

1. **Model Connectivity** — The application uses the Vercel AI SDK to connect to a vast array of models via OpenRouter. This allows it to support models from OpenAI, Anthropic, Google, and more.
2. **Game Logic** — It maintains the chess state client-side, managing move validation and ensuring the models adhere to standard chess rules.
3. **Real-Time Visualization** — As models generate moves, the arena updates the board in real-time, allowing users to watch the strategic battle unfold.
4. **Configuration** — Users provide their own OpenRouter API key in the settings, giving them full control over which models they pit against each other and managing their own costs.

## Technical details

| Aspect          | Detail                                                |
| --------------- | ----------------------------------------------------- |
| Framework       | React 19 + Vite                                       |
| Language        | TypeScript                                            |
| AI Integration  | Vercel AI SDK + OpenRouter                            |
| Routing         | React Router v7 (HashRouter for GitHub Pages)         |
| Hosting         | GitHub Pages                                          |
| Testing         | Vitest                                                |

The project is built as a Single Page Application (SPA), ensuring all game logic and AI interactions happen directly in the user's browser. It leverages modern React features and strict TypeScript to maintain a robust and maintainable codebase.

## Links

- [Repository](https://github.com/Flopsstuff/chaiba)
- [Live Demo](https://flopsstuff.github.io/chaiba/)
- [OpenRouter](https://openrouter.ai/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
