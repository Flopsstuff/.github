## Overview

**flugins** is a curated marketplace and repository for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugins. It provides a centralized hub where developers can find, share, and install extensions that enhance Claude Code's native capabilities with specialized tools for documentation, version control, and workflow automation.

## Why it exists

While Claude Code is powerful out of the box, developers often need specific tools tailored to their stack or workflow. Standardizing the distribution of these extensions was previously a manual process of copying scripts or managing local aliases. 

flugins exists to bridge this gap by providing a "marketplace" experience. It allows the community to contribute plugins that are easily discoverable and installable through a single command, making it trivial to extend Claude Code without polluting the core product.

## How it works

flugins leverages Claude Code's built-in plugin architecture. Users register the repository as a trusted marketplace source, after which plugins can be installed by their scoped name.

1. **Register** — add the marketplace to your local Claude Code configuration:
   ```bash
   claude plugin marketplace add Flopsstuff/flugins
   ```
2. **Install** — install specific plugins from the repository using the `@flugins` scope:
   ```bash
   claude plugin install docs@flugins
   claude plugin install git@flugins
   ```
3. **Execute** — once installed, Claude Code automatically recognizes the new tools and can use them to perform enhanced tasks like searching indexed documentation or managing complex Git operations.

## Available Plugins

| Plugin | Description |
| ------ | ----------- |
| `docs` | Enhanced documentation search and indexing for local and remote sources. |
| `git` | Advanced Git workflow tools and repository analysis. |
| `resolve-coderabbit` | Integration for managing and resolving CodeRabbit reviews directly from the CLI. |

## Technical details

| Aspect | Detail |
| ------ | ------ |
| Format | Plugins are defined as Markdown command/skill specs with JSON manifests; shell scripts back the `resolve-coderabbit` plugin |
| Architecture | Built on the native Claude Code plugin system |
| Documentation | Hosted via MkDocs on GitHub Pages |
| Distribution | GitHub-based marketplace registry |

Each plugin is designed to be minimal and focused, following the Unix philosophy of doing one thing well while integrating seamlessly into the Claude Code agent's decision-making loop.

## Links

- [Repository](https://github.com/Flopsstuff/flugins)
- [Documentation](https://flopsstuff.github.io/flugins/)
- [Claude Code Plugins Guide](https://docs.anthropic.com/en/docs/claude-code/plugins)
