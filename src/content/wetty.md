## Overview

**WeTTY** (Web + TTY) exposes a terminal session in a browser over HTTP/HTTPS. It gives operators and developers a web URL for shell access without requiring users to install a local SSH client. The project is positioned as a modern replacement for older browser-terminal tools, with terminal emulation handled by xterm.js and real-time transport handled over WebSockets.

Out of the box, WeTTY serves a web UI (default path `/wetty`) and starts a shell session behind it. In common deployments it runs as a Node.js service directly or as a Docker container behind a reverse proxy.

## Why it exists

Many teams need terminal access in environments where installing or using native SSH clients is inconvenient: managed lab machines, browser-only devices, onboarding sandboxes, and internal support workflows. WeTTY exists to bridge that gap by putting a familiar terminal experience in the browser while still connecting to standard shell/SSH backends.

The project also targets responsiveness and compatibility. Instead of polling or Ajax-style terminal updates, it uses Socket.IO/WebSocket messaging, and instead of a minimal text area it uses xterm.js for full terminal emulation behavior.

## How it works

At startup, the CLI entry point parses configuration and flags (for host/port, SSH target, SSL files, command override, and auth-related options), then starts the server.

1. The server layer runs on Express, adds metrics/logging middleware, and exposes the web client.
2. A Socket.IO connection is opened per browser session.
3. On connect, WeTTY resolves the command to run (for example `/bin/login` when running as root, or `ssh` to a configured host/user).
4. The backend spawns a PTY-backed process and streams terminal I/O through the socket.
5. The browser client renders output with xterm.js and sends keyboard input/resize events back to the server.

This keeps the architecture simple: browser terminal frontend + WebSocket bridge + spawned shell/SSH process.

## Technical details

| Aspect | Detail |
| --- | --- |
| Runtime | Node.js (`>=18`) |
| Language | TypeScript (compiled to `build/`) |
| Server stack | Express + Socket.IO |
| Terminal emulation | xterm.js (`xterm`) |
| Process bridge | `node-pty` |
| Packaging | npm package (`wetty`) and Docker image (`wettyoss/wetty`) |
| License | MIT |

## Links

- [Repository](https://github.com/Flopsstuff/wetty)
- [Live docs/site](https://butlerx.github.io/wetty)
- [Flags reference](https://butlerx.github.io/wetty/flags)
- [Docker image](https://hub.docker.com/r/wettyoss/wetty)
