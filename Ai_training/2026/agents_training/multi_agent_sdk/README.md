# Multi-Agent SDK Example

Demonstrates a simple multi-agent orchestration pattern using the Anthropic Claude Agent SDK.

## Architecture

```
Orchestrator
  ├── researcher   → searches the web and gathers information
  └── summariser   → condenses findings into bullet points
```

The orchestrator receives the user's task, delegates to subagents, and returns the final result.

## Prerequisites

- Node.js 22+
- Claude Code CLI installed (`npm install -g @anthropic/claude-code`)
- `ANTHROPIC_API_KEY` environment variable set

## Setup

```bash
npm install
```

## Usage

```bash
# Default task
npm start

# Custom task
npm start "Explain what RAG is in AI"
```

## How it works

The Agent SDK runs agents as subprocesses of the Claude Code CLI. Each agent:
- Has a focused `prompt` defining its role
- Has an `allowedTools` list restricting what it can do
- Is invoked by the orchestrator via the `Agent` tool

The orchestrator coordinates the subagents and synthesises the final answer.
