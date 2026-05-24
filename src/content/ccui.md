## Overview

**ccui** is the project page entry for CloudCLI (also described as Claude Code UI), an open-source web interface for running and managing CLI coding agents from a browser on desktop or mobile. The repository is maintained as a fork of `siteboon/claudecodeui`, with additional deployment and provider integrations documented in its README. The same codebase powers local self-hosted usage and the hosted CloudCLI offering linked from `cloudcli.ai`.

## Why it exists

Terminal-first tools like Claude Code, Cursor CLI, Codex, and Gemini CLI are powerful, but they are not ideal when you need remote or mobile access, quick session switching, or a shared visual workflow. CloudCLI exists to make those CLI sessions easier to operate through a web UI: discover and resume sessions, work with files and Git, and manage tool settings from one place.

The project also targets self-hosting and portability. The README emphasizes Docker-first setup, optional cloud tunnel access, and support for AWS Bedrock authentication, so users can run it in local or enterprise-style environments without changing the core UI workflow.

## How it works

CloudCLI combines a React/Vite frontend with a Node.js backend. At a high level:

1. The backend (`server/`) starts and manages agent CLIs, session state, and integrations.
2. The frontend (`src/`) renders the chat/workspace UI, project and session navigation, file/Git views, and settings.
3. Packaging options expose the same app in different ways: local npm (`npx @cloudcli-ai/cloudcli`), Docker Compose for self-hosting, or the managed cloud service.

The repository also documents plugin support, where additional tabs/services can be installed to extend the core UI behavior.

## Technical details

| Aspect | Detail |
| --- | --- |
| Upstream base | Fork of `siteboon/claudecodeui` |
| Runtime | Node.js app with React 18 + Vite frontend |
| Package | `@cloudcli-ai/cloudcli` |
| CLI coverage (documented) | Claude Code, Cursor CLI, Codex, Gemini CLI |
| Deployment options | npm (`npx`), Docker Compose, managed CloudCLI |
| Notable integrations | AWS Bedrock mode, Cloudflare tunnel guidance, plugin system |
| License | MIT (`LICENSE` in repo) |

## Links

- [Repository](https://github.com/Flopsstuff/ccui)
- [README](https://github.com/Flopsstuff/ccui/blob/main/README.md)
- [Live site](https://cloudcli.ai)
- [Upstream project](https://github.com/siteboon/claudecodeui)
