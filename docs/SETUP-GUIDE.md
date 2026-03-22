# Claude Code Project Bootstrap — Definitive Setup Guide

> Everything you need. Nothing missing. Read once, refer back as needed.

**Last updated:** 2026-03-22 | **Reference project:** `instagram-carousel-generator`
**Global config:** `~/.claude/` | **Scripts:** `~/scripts/`

---

## Table of Contents

1. [What This System Is](#1-what-this-system-is)
2. [How It All Fits Together](#2-how-it-all-fits-together)
3. [Global Files — Full Content and Purpose](#3-global-files--full-content-and-purpose)
4. [The Project Structure — Every File Explained](#4-the-project-structure--every-file-explained)
5. [Session Memory — CLAUDE-HISTORY.md](#5-session-memory--claude-historymd)
6. [Security Guardrails — Two Layers](#6-security-guardrails--two-layers)
7. [Starting a New Project — All Three Ways](#7-starting-a-new-project--all-three-ways)
8. [Using With an Automated Agent](#8-using-with-an-automated-agent)
9. [Global Slash Commands](#9-global-slash-commands)
10. [Project-Level Slash Commands](#10-project-level-slash-commands)
11. [The Shell Script — Full Reference](#11-the-shell-script--full-reference)
12. [Agents — Format and Usage](#12-agents--format-and-usage)
13. [MCP Servers — Configuration](#13-mcp-servers--configuration)
14. [GUARDRAILS.md — Full Generic Checklist](#14-guardrailsmd--full-generic-checklist)
15. [Customising For Different Project Types](#15-customising-for-different-project-types)
16. [Updating the Template](#16-updating-the-template)
17. [Troubleshooting](#17-troubleshooting)
18. [Quick Reference Card](#18-quick-reference-card)

---

## 1. What This System Is

A **reusable project scaffolding system** for Claude Code. Solves three problems:

**Problem 1 — Every project starts from scratch.**
Claude doesn't know where your code lives, what conventions you use, or what it can run. You spend the first 10 minutes re-explaining.

**Problem 2 — Every session starts blank.**
Claude has no memory between sessions. You re-explain what you built, why, what broke. You become Claude's memory.

**Problem 3 — No guardrails by default.**
Nothing stops you committing a `.env`, hardcoding a token, or pushing to `main`.

**This system fixes all three:**
- Standard structure Claude understands immediately
- `CLAUDE-HISTORY.md` — session memory Claude reads and writes automatically
- `GUARDRAILS.md` + global rules — 100+ checks built into every project

---

## 2. How It All Fits Together

```
GLOBAL  (every project, every session — set up once)
─────────────────────────────────────────────────────────────────────
~/.claude/CLAUDE.md                 ← global behaviour + security rules
~/.claude/commands/bootstrap.md    ← /bootstrap slash command
~/.claude/commands/save-session.md ← /save-session slash command
~/.claude/skills/project-bootstrap/
  ├── SKILL.md                      ← source of truth for project structure
  ├── GUARDRAILS-BASE.md            ← 100+ check generic template
  └── AGENT-INSTRUCTIONS.md         ← 24-step spec for automated agents
~/scripts/claude-init.sh            ← shell script (no Claude needed)
~/.claude/PROJECT-BOOTSTRAP-GUIDE.md ← global copy of this guide

PER PROJECT  (created by /bootstrap or shell script)
─────────────────────────────────────────────────────────────────────
CLAUDE.md            ← Claude's instructions for THIS project
CLAUDE-HISTORY.md    ← session memory (auto read at start, written at end)
GUARDRAILS.md        ← validation checklist (human + agent)
.claude/settings.json / settings.local.json
.claude/commands/    ← project slash commands
skills/<slug>/SKILL.md
agents/              ← sub-agents
src/ tests/ docs/ scripts/
```

**Single source of truth:** `~/.claude/skills/project-bootstrap/SKILL.md`
`/bootstrap` reads it at runtime. Shell script mirrors it manually. Change the skill first, then sync the script.

---

## 3. Global Files — Full Content and Purpose

### `~/.claude/CLAUDE.md` — Global behaviour rules

Applied by Claude in **every session, every project**. Full current content:

```markdown
# Global Claude Instructions — <Your Name>

These instructions apply to every project, every session.

## Session Memory (CLAUDE-HISTORY.md)

At the start of EVERY session:
1. Check if CLAUDE-HISTORY.md exists in the project root
2. If it exists — read it in full before doing anything else
3. Acknowledge what you learned
4. If it does not exist — create it

Before the session ends:
1. Proactively append a new entry — do NOT wait for the user to ask
2. Use today's date
3. Be specific — vague entries are useless in future sessions

Named CLAUDE-HISTORY.md (not HISTORY.md) to avoid conflicts with changelogs.

## Security Guardrails (Every Project)

Never do these:
- Never read/print/log .env file contents
- Never include API keys, tokens, passwords in any committed file
- Never suggest git add . or git add -A — always stage by name
- Never commit .env, .env.local, .env.production, *.key, *.pem, *.p12
- Never hardcode credentials — use environment variable references
- Never push to main or master directly

Always do these:
- Check git diff --staged before confirming a commit
- Confirm .gitignore includes .env and settings.local.json before first commit
- Use process.env.VAR_NAME (JS) or os.environ['VAR_NAME'] (Python) for secrets
- Remind user to fill in .env from .env.example — never fill it yourself

## General Behavior
- Responses concise — lead with action, skip preamble
- Reference code with file path and line number
- Prefer editing existing files over creating new ones
- Do not add comments unless logic is non-obvious
- Do not refactor code outside the scope of the request
```

---

### `~/.claude/skills/project-bootstrap/SKILL.md`

Master template. Contains the full folder structure and file templates. Claude reads this every time `/bootstrap` is run. Not project-specific — lives globally, always available.

---

### `~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md`

The generic 19-category, 100+ check guardrails template. Copied into every new project as `GUARDRAILS.md`. Full content is in [Section 14](#14-guardrailsmd--full-generic-checklist).

---

### `~/.claude/skills/project-bootstrap/AGENT-INSTRUCTIONS.md`

A 24-step specification for automated agents using the Anthropic API. Steps cover: directory check → folder creation → writing all 24 files with placeholders replaced → git init → verification → completion report. Used when you want an API agent to scaffold a project without a human Claude Code session.

---

### `~/.claude/commands/bootstrap.md`

Makes `/bootstrap` available globally. Claude reads the SKILL.md at runtime — changes to SKILL.md take effect immediately without updating this file.

---

### `~/.claude/commands/save-session.md`

Makes `/save-session` available globally. Also defines trigger phrases that make Claude save automatically: "done", "bye", "closing", "wrap up", "that's all", "see you".

---

### `~/scripts/claude-init.sh`

Standalone bash script. Creates the full project structure without Claude. Runs `git init` and makes the first commit. Full reference in [Section 11](#11-the-shell-script--full-reference).

---

### `~/.claude/PROJECT-BOOTSTRAP-GUIDE.md`

A global copy of this file. Synced manually with:
```bash
cp docs/SETUP-GUIDE.md ~/.claude/PROJECT-BOOTSTRAP-GUIDE.md
```
Lets you reference this guide from any project, not just the carousel generator.

---

## 4. The Project Structure — Every File Explained

```
<project-root>/
│
├── CLAUDE.md                     ← Claude's instructions for this project
├── CLAUDE-HISTORY.md             ← Session memory — auto read and written
├── GUARDRAILS.md                 ← 100+ checks for commit/PR/deploy
├── .env.example                  ← Env var template — committed
├── .env                          ← Real secrets — NEVER committed
├── .gitignore                    ← Hardened — covers .env*, *.key, *.pem, etc.
├── .mcp.json                     ← MCP server config
│
├── .claude/
│   ├── settings.json             ← Permissions, hooks, env overrides
│   ├── settings.local.json       ← Your API keys — gitignored
│   └── commands/
│       ├── generate.md           ← /generate
│       ├── preview.md            ← /preview
│       ├── export.md             ← /export
│       └── brand-audit.md        ← /brand-audit
│
├── skills/
│   └── <project-slug>/
│       ├── SKILL.md              ← Core skill: inputs, outputs, process, rules
│       ├── scripts/              ← Helper scripts the skill uses
│       ├── references/           ← Reference docs Claude loads on demand
│       └── assets/               ← Static files (CSS, templates, prompts)
│
├── agents/
│   ├── content-writer.yml        ← Writes content matching project tone
│   └── reviewer.yml              ← Reviews outputs against GUARDRAILS.md
│
├── plugins/
│   └── manifest.json             ← Plugin registry
│
├── src/
│   ├── components/               ← UI or output components
│   ├── services/                 ← Core business logic
│   ├── utils/                    ← Shared utilities
│   └── types/                    ← Type definitions / schemas
│
├── tests/
│   ├── unit/                     ← Isolated — one function at a time
│   ├── integration/              ← Multi-module pipeline tests
│   └── e2e/                      ← Full output tests
│
├── docs/
│   ├── architecture.md           ← Data flow, constraints, components
│   ├── api-reference.md          ← Public functions, inputs, outputs
│   ├── onboarding.md             ← Quick start for new contributors
│   └── SETUP-GUIDE.md            ← This file
│
└── scripts/
    ├── setup.sh                  ← Install deps, copy .env
    └── deploy.sh                 ← Deploy to staging/production
```

### Key file responsibilities

| File | Written by | Read by | Controls |
|------|-----------|---------|---------|
| `CLAUDE.md` | You + Claude | Claude every session | Behaviour, conventions, rules |
| `CLAUDE-HISTORY.md` | Claude (auto) | Claude on session start | Session memory |
| `GUARDRAILS.md` | Bootstrap | You + agents | Pre-commit/deploy validation |
| `.claude/settings.json` | Bootstrap | Claude Code | Allowed/denied commands, hooks |
| `.claude/settings.local.json` | You | Claude Code | Personal API keys — never committed |
| `.mcp.json` | Bootstrap | Claude Code | MCP server connections |
| `skills/<slug>/SKILL.md` | You + Claude | Claude | How to perform the core task |
| `agents/*.yml` | Bootstrap | Claude | Sub-agent prompts and tool access |

### `.claude/settings.json` — annotated

> **Note:** JSON does not support comments. The annotations below are for documentation only — the actual file must not contain `//` lines.

```json
{
  "permissions": {
    "allow": [
      "Bash(node:*)",
      "Bash(npm:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git status:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{ "type": "command", "command": "echo '[hook] File written'" }]
    }]
  },
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
```

| Key | What it controls |
|-----|-----------------|
| `permissions.allow` | Commands Claude can run without asking — read-only git, node, npm |
| `permissions.deny` | Commands Claude can never run even if asked — destructive delete, outbound HTTP |
| `hooks` | Shell commands that fire on Claude tool events: `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, `PreCommit` |
| `env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Compact the context window when it reaches 50% full (default is higher) |

---

## 5. Session Memory — CLAUDE-HISTORY.md

**The problem:** Every new Claude Code session starts blank. You re-explain everything. You become Claude's memory.

**The fix:** `CLAUDE-HISTORY.md` per project + global instructions in `~/.claude/CLAUDE.md`.

### Flow

```
Session opens
     ↓
Claude reads CLAUDE-HISTORY.md      (global instruction — automatic)
Claude says: "Last session we X, decided Y because Z, blocked by W."
     ↓
You work together
     ↓
You say "done" / "bye" / stops responding
     ↓
Claude appends entry to CLAUDE-HISTORY.md  (without being asked)
```

### Why CLAUDE-HISTORY.md not HISTORY.md

Projects often already have a `HISTORY.md` as a changelog. Using a different name avoids conflict. The global `~/.claude/CLAUDE.md` specifically looks for `CLAUDE-HISTORY.md`.

### Entry format

```markdown
## 2026-03-22 — Built palette derivation service

### What we did
- Created src/services/palette.js with HSL-based 6-token derivation
- Added unit tests in tests/unit/palette.test.js

### Decisions made
- Used HSL math instead of a colour library — **Why:** zero runtime dependencies

### Mistakes & fixes
- DARK_BG wrong on low-saturation inputs → clamped saturation before conversion

### Pivots
- Planned to use an external API for colour — switched to local math for speed

### Blockers
- Tests not wired to a test runner yet (no package.json test script)

### Context for next session
- Wire font-service.js to the slide template generator
- package.json needs a `test` script
```

### Rules for useful entries

| Write this | Not this |
|-----------|---------|
| "Used HSL — zero dependencies" | "Made some changes" |
| "DARK_BG broke on low saturation → clamped" | "Fixed a bug" |
| "Decided against Redis — overkill at this scale" | "Discussed architecture" |
| "Next: wire font-service to template" | "Some things left to do" |

### Manual save

```
/save-session
```

Claude also saves automatically on session-ending phrases. You should never need to remember.

---

## 6. Security Guardrails — Two Layers

### Layer 1 — Global rules (`~/.claude/CLAUDE.md`)

Applies to every session, every project. Claude cannot be instructed to override these.

| Rule | Why |
|------|-----|
| Never read/print `.env` | Prevents accidental secret exposure in Claude output |
| Never `git add -A` or `git add .` | Prevents accidentally staging `.env` or keys |
| Never hardcode credentials | All secrets via env vars |
| Scan `git diff --staged` before committing | Catches secrets before they enter git history |
| Never push to `main`/`master` | Forces branch workflow |

### Layer 2 — Per-project `GUARDRAILS.md`

Every bootstrapped project gets a `GUARDRAILS.md` based on the generic template. Contains 19 categories, 100+ checks. Full content in [Section 14](#14-guardrailsmd--full-generic-checklist).

**Important:** The shell script creates a condensed version of GUARDRAILS.md inline. For the full 349-line base template, copy from `~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md`:
```bash
cp ~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md GUARDRAILS.md
```

### Hardened `.gitignore`

Every project gets:
```
# Secrets — NEVER commit these
.env
.env.local
.env.production
.env.*.local
*.key
*.pem
*.p12
*.pfx

# Claude local
.claude/settings.local.json

# Build output
node_modules/
dist/
build/
exports/

# OS junk
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### Agent guardrail prompt

```
Read GUARDRAILS.md. Run every check marked [AGENT] against staged files.
For each: PASS, FAIL: <detail>, or SKIP: <reason>.
Final line: "Result: X passed, Y failed, Z skipped."
If any FAIL — list what must be fixed before proceeding.
```

---

## 7. Starting a New Project — All Three Ways

### Option A — Shell Script (fastest, most reliable)

```bash
bash ~/scripts/claude-init.sh "My Project Name"

# Custom location
bash ~/scripts/claude-init.sh "My Project Name" /path/to/parent
```

Creates `~/Projects/my-project-name/`, builds the full structure, `git init`, first commit, prints the tree. Then:
```bash
cd ~/Projects/my-project-name
claude
```

---

### Option B — `/bootstrap` inside Claude Code

```
/bootstrap
/bootstrap "My Project Name"
```

Claude reads the global SKILL.md, asks for name and purpose, creates all files (skips existing), confirms with a tree. Safe on existing projects.

---

### Option C — Hybrid (recommended)

```bash
# 1. Structure in seconds
bash ~/scripts/claude-init.sh "My App"

# 2. Open Claude Code
cd ~/Projects/my-app && claude

# 3. Tell Claude about the project
# "This project does X. Fill in CLAUDE.md and skills/my-app/SKILL.md"
```

---

### First 5 minutes after bootstrapping

1. **Fill `CLAUDE.md`** — purpose, tech stack, conventions
2. **Fill `skills/<slug>/SKILL.md`** — inputs, outputs, process
3. **Fill `.env`** — copy from `.env.example`, add real keys
4. **Run `bash scripts/setup.sh`** — install deps, confirm setup
5. **First real commit** — `git add CLAUDE.md skills/ && git commit -m "Add project context"`

---

## 8. Using With an Automated Agent

`/bootstrap` and `/save-session` are Claude Code CLI commands — interactive only. An API agent cannot use slash commands.

For agents, use `AGENT-INSTRUCTIONS.md`.

### Scaffold a project with an agent

```python
import anthropic

client = anthropic.Anthropic()

import os

instructions_path = os.path.expanduser(
    "~/.claude/skills/project-bootstrap/AGENT-INSTRUCTIONS.md"
)
with open(instructions_path) as f:
    instructions = f.read()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8096,
    system="""You are a project scaffolding agent.
You have access to Write, Bash, and Read tools.
Execute the instructions exactly — do not skip steps.""",
    messages=[{
        "role": "user",
        "content": f"""
Execute the following project bootstrap instructions.

PROJECT_NAME    = "My New App"
PROJECT_PURPOSE = "Generates weekly newsletters from RSS feeds."
TECH_STACK      = "Python / FastAPI / PostgreSQL"
PARENT_DIR      = os.path.expanduser("~/Projects")

{instructions}
"""
    }]
)
```

### Run guardrails with an agent

```python
import anthropic, pathlib

client = anthropic.Anthropic()
guardrails = pathlib.Path("GUARDRAILS.md").read_text()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    system="You are a code review agent with Bash and Read tools.",
    messages=[{
        "role": "user",
        "content": f"""
{guardrails}

Run every [AGENT] check against staged files using git diff --staged and grep.
Output PASS, FAIL, or SKIP per check.
Final line: "Result: X passed, Y failed, Z skipped."
"""
    }]
)
```

---

## 9. Global Slash Commands

Available in **every** project, **every** session — no setup required per project.

### `/bootstrap`

Scaffolds the full workspace structure.

```
/bootstrap
/bootstrap "My App Name"
```

Creates: `.claude/` (settings + 4 commands), `skills/`, `agents/`, `plugins/`, `src/`, `tests/`, `docs/`, `scripts/`, `CLAUDE.md`, `CLAUDE-HISTORY.md`, `GUARDRAILS.md`, `.mcp.json`, `.env.example`, `.gitignore`. Never overwrites existing files.

---

### `/save-session`

Appends session summary to `CLAUDE-HISTORY.md`.

```
/save-session
```

Also fires automatically on: "done", "bye", "closing", "wrap up", "that's all", "see you".

Saves: what we did, decisions + why, mistakes + fixes, pivots, blockers, context for next session.

---

## 10. Project-Level Slash Commands

Created per project in `.claude/commands/`. Only available in that project.

| Command | What it does |
|---------|-------------|
| `/generate [topic]` | Collect inputs → validate → run skill pipeline → write output |
| `/preview` | Find latest output → summarise → flag issues |
| `/export [file]` | Run export pipeline → confirm output paths |
| `/brand-audit [file]` | Read GUARDRAILS.md → run checks → return PASS/FAIL list |

---

## 11. The Shell Script — Full Reference

**File:** `~/scripts/claude-init.sh`

### Syntax
```bash
bash ~/scripts/claude-init.sh <project-name> [parent-directory]
```

### Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `project-name` | Yes | `my-project` | Spaces OK — auto kebab-cased |
| `parent-directory` | No | `~/Projects` | Full path |

### Examples

```bash
bash ~/scripts/claude-init.sh "my app"              # → ~/Projects/my-app/
bash ~/scripts/claude-init.sh "Design System"       # → ~/Projects/design-system/
bash ~/scripts/claude-init.sh "Acme" /work/clients  # → /work/clients/acme/
```

### What it creates

| # | File/Folder | Notes |
|---|------------|-------|
| 1 | Full folder structure | `.claude/`, `skills/`, `agents/`, `src/`, `tests/`, `docs/`, `scripts/`, `plugins/` |
| 2 | `.claude/settings.json` | Permissions + hooks |
| 3 | `.claude/settings.local.json` | Empty API key placeholder |
| 4 | `.claude/commands/` | 4 slash commands |
| 5 | `skills/<slug>/SKILL.md` | Core skill stub |
| 6 | `agents/` | content-writer.yml, reviewer.yml |
| 7 | `plugins/manifest.json` | Empty plugin registry |
| 8 | `.mcp.json` | Filesystem MCP server |
| 9 | `.env.example` | `ANTHROPIC_API_KEY=` |
| 10 | `.gitignore` | Hardened — covers secrets, build, OS junk |
| 11 | `docs/` | architecture.md, api-reference.md, onboarding.md |
| 12 | `scripts/setup.sh` + `deploy.sh` | chmod +x applied |
| 13 | `CLAUDE.md` | Project name filled in |
| 14 | `CLAUDE-HISTORY.md` | First entry written with today's date |
| 15 | `GUARDRAILS.md` | Condensed version — replace with GUARDRAILS-BASE.md for full 100+ checks |
| 16 | `git init` + first commit | All files staged and committed |

### What it does NOT do

- Does not run `npm install`
- Does not fill in `CLAUDE.md` or `SKILL.md` project-specific content (Claude does that)
- Does not push to a remote
- Will NOT overwrite an existing directory — exits with error

### Replacing the condensed GUARDRAILS with the full base

```bash
cd ~/Projects/my-new-project
cp ~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md GUARDRAILS.md
```

### Error cases

| Situation | Behaviour |
|-----------|-----------|
| Directory already exists | Exits immediately, no changes |
| `git` not installed | Creates files, skips git init, notes it |
| `chmod` unavailable (Windows) | Skips chmod, notes it |
| Missing project name | Uses `my-project` as default |

---

## 12. Agents — Format and Usage

Agents are specialised sub-Claude instances with their own system prompt and tool access. They live in `agents/*.yml`.

### YAML format

```yaml
name: content-writer                    # identifier
description: Writes slide copy          # shown in Claude's agent list
model: claude-sonnet-4-6               # which model this agent uses
tools:                                  # tools available to this agent
  - Read                               # can read files
  - Write                              # can write files
  - Bash                               # can run shell commands
system: |                              # system prompt — what the agent is
  You are a content writer for [project].
  Write concise copy matching the project tone defined in CLAUDE.md.
  Keep headlines under 8 words. Body text under 40 words per slide.
```

### Available models

| Model ID | Use for |
|----------|---------|
| `claude-sonnet-4-6` | Most tasks — best balance of quality and speed |
| `claude-opus-4-6` | Complex reasoning, long documents |
| `claude-haiku-4-5-20251001` | Fast, simple tasks — classification, formatting |

### Available tools

| Tool | What it gives the agent |
|------|------------------------|
| `Read` | Read files from the project |
| `Write` | Create or overwrite files |
| `Bash` | Run shell commands |
| `WebFetch` | Fetch a URL |
| `WebSearch` | Search the web |
| `Glob` | Find files by pattern |
| `Grep` | Search file contents |

### Starter agents created by bootstrap

**`agents/content-writer.yml`** — writes content matching project tone, no tools (uses its training knowledge only).

**`agents/reviewer.yml`** — reviews outputs against GUARDRAILS.md, has `Read` to inspect files.

### Adding a new agent

Create `agents/my-agent.yml` following the format above. Be specific in the system prompt — the narrower the role, the better the output.

---

## 13. MCP Servers — Configuration

MCP (Model Context Protocol) servers extend Claude with external capabilities. Configured in `.mcp.json`.

### Filesystem (default — already configured)

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem"],
      "env": { "ALLOWED_DIRS": "./,./assets,./skills,./agents" }
    }
  }
}
```

### GitHub — read/write issues, PRs, repos

```json
"github": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@anthropic-ai/mcp-server-github"],
  "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
}
```

### PostgreSQL — query your database directly

```json
"postgres": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
  "env": { "DATABASE_URL": "${DATABASE_URL}" }
}
```

### Slack — send messages, search channels

```json
"slack": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@anthropic-ai/mcp-server-slack"],
  "env": { "SLACK_TOKEN": "${SLACK_TOKEN}" }
}
```

### Playwright — browser automation

```json
"playwright": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@anthropic-ai/mcp-server-playwright"]
}
```

Add any of these to `.mcp.json` under `mcpServers`. All env vars reference `${VAR}` — actual values come from `.env` (never hardcoded).

---

## 14. GUARDRAILS.md — Full Generic Checklist

> This is the full content of `~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md`.
> Copy it into any project as `GUARDRAILS.md` and add project-specific checks in Section 19.
> [AGENT] = programmatically verifiable | [HUMAN] = requires manual review

---

### How to Use

- **Before every commit:** run sections 1–4
- **Before every PR:** run sections 1–6, reviewer covers [HUMAN] items
- **Before every deploy:** run all sections

---

### 1. Secret & Credential Safety

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 1.1 | `.env` in `.gitignore` | [AGENT] | `grep -qE "^\.env$" .gitignore && echo PASS \|\| echo FAIL` |
| 1.2 | `.env` NOT staged | [AGENT] | `git diff --staged --name-only \| grep "^\.env" \| wc -l` → 0 |
| 1.3 | `*.local.json` not staged | [AGENT] | `git diff --staged --name-only \| grep "local\.json"` → empty |
| 1.4 | No `*.key`, `*.pem`, `*.p12`, `*.pfx` tracked | [AGENT] | `git ls-files \| grep -E "\.(key\|pem\|p12\|pfx\|crt\|cer)$"` → empty |
| 1.5 | No hardcoded secrets in staged diff | [AGENT] | `git diff --staged \| grep -iE "(api_key\|api_secret\|password\|token\|secret\|private_key)\s*[:=]\s*['\"][^'\"]{8,}"` → empty |
| 1.6 | No secrets in any `.md` doc | [AGENT] | `grep -riE "(api_key\|password\|token\|secret)\s*[:=]\s*[A-Za-z0-9+/]{20,}" docs/ *.md` → empty |
| 1.7 | `.env.example` placeholder values only | [HUMAN] | All values empty or `your-value-here` style |
| 1.8 | No credentials in commit messages | [AGENT] | `git log --oneline -20 \| grep -iE "(password\|secret\|token\|api_key)"` → empty |
| 1.9 | Production uses secrets manager, not `.env` | [HUMAN] | AWS Secrets Manager / GCP Secret Manager / Vault / equivalent |
| 1.10 | All secrets via env vars in code | [AGENT] | `grep -rE "(api_key\|secret\|password)\s*=\s*['\"][A-Za-z0-9]{10,}" src/` → empty |

---

### 2. Git Hygiene

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 2.1 | Files staged by name, not `git add -A` | [HUMAN] | `git diff --staged --name-only` — only intended files |
| 2.2 | Commit message answers WHY | [HUMAN] | "fix bug" = FAIL, "fix null deref when handle missing" = PASS |
| 2.3 | Not pushing to `main`/`master` | [AGENT] | `git branch --show-current` must not be main/master for features |
| 2.4 | Branch up to date with base | [AGENT] | `git fetch origin && git log HEAD..origin/main --oneline \| wc -l` → 0 |
| 2.5 | `node_modules/`, `vendor/`, `__pycache__/` not tracked | [AGENT] | `git ls-files node_modules/ vendor/ __pycache__/ \| wc -l` → 0 |
| 2.6 | `dist/`, `build/`, `exports/` not tracked | [AGENT] | `git ls-files dist/ build/ exports/ \| wc -l` → 0 |
| 2.7 | No OS/IDE junk tracked | [AGENT] | `git ls-files \| grep -E "(\.DS_Store\|Thumbs\.db\|\.idea)"` → empty |
| 2.8 | No large binary files (>1MB) | [AGENT] | `git diff --staged --stat \| grep -E "[0-9]{4,} insertions"` → flag |
| 2.9 | No merge conflict markers | [AGENT] | `git diff --staged \| grep -E "^[+](<<<<<<\|=======\|>>>>>>>)"` → empty |
| 2.10 | `.gitignore` covers all generated/local files | [HUMAN] | `git status` untracked should be minimal |

---

### 3. Code Quality

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 3.1 | No debug statements in production paths | [AGENT] | `grep -rn "console\.log\|print(\|debugger\|binding\.pry\|dd(" src/` |
| 3.2 | No commented-out code blocks (>3 lines) | [HUMAN] | Delete or create a ticket |
| 3.3 | No new TODO/FIXME/HACK in this diff | [AGENT] | `git diff --staged \| grep -E "^\+(.*)(TODO\|FIXME\|HACK\|XXX)"` |
| 3.4 | No `eval()` | [AGENT] | `grep -rn "\beval(" src/` → empty |
| 3.5 | No `innerHTML`/`dangerouslySetInnerHTML` with user input | [HUMAN] | No user-controlled data flows into these |
| 3.6 | All user inputs validated before use | [HUMAN] | Trace each public function |
| 3.7 | No hardcoded URLs/IPs/ports | [AGENT] | `grep -rE "https?://[^'\"]+" src/` → review hits |
| 3.8 | No magic numbers without named constants | [HUMAN] | Review bare numeric literals in logic |
| 3.9 | Error paths handled — no silent failures | [HUMAN] | Every catch/except must log or rethrow |
| 3.10 | New public functions have at least one test | [HUMAN] | Check `tests/` for corresponding test |
| 3.11 | No circular dependencies | [AGENT] | `npx madge --circular src/` or language equivalent |
| 3.12 | No unused imports or dead exports | [AGENT] | Run linter: `eslint --rule "no-unused-vars"` or equivalent |
| 3.13 | Functions under 50 lines | [HUMAN] | Flag longer functions for decomposition |
| 3.14 | Consistent naming conventions | [HUMAN] | Match existing camelCase/snake_case/PascalCase |

---

### 4. Security — OWASP Top 10

| # | Vulnerability | Check | Who |
|---|--------------|-------|-----|
| 4.1 | **Injection** | Parameterised queries/ORM — no string concat with user input | [HUMAN] |
| 4.2 | **Injection** | `grep -rn "exec(\|system(\|shell_exec\|subprocess\.call\|os\.system" src/` | [AGENT] |
| 4.3 | **Broken Auth** | Passwords never logged or stored plain | [HUMAN] |
| 4.4 | **Broken Auth** | Session tokens random, ≥128 bits, expire appropriately | [HUMAN] |
| 4.5 | **Sensitive Data** | PII/financial data encrypted at rest and in transit | [HUMAN] |
| 4.6 | **Sensitive Data** | HTTPS enforced — no HTTP in production | [HUMAN] |
| 4.7 | **XSS** | All user output escaped before HTML rendering | [HUMAN] |
| 4.8 | **XSS** | CSP header set | [AGENT] `grep -r "Content-Security-Policy" src/` |
| 4.9 | **IDOR** | Resource access checked against authenticated user | [HUMAN] |
| 4.10 | **Misconfiguration** | No debug mode, no default creds, no stack traces to client | [HUMAN] |
| 4.11 | **Vulnerable Deps** | `npm audit` / `pip-audit` / `trivy fs .` | [AGENT] |
| 4.12 | **Broken Access** | Auth checked per request, not just on login | [HUMAN] |
| 4.13 | **CSRF** | POST/PUT/DELETE require CSRF token or SameSite cookie | [HUMAN] |
| 4.14 | **Clickjacking** | `X-Frame-Options: DENY` or CSP frame-ancestors set | [AGENT] |
| 4.15 | **SSRF** | Outbound HTTP does not use user-supplied URLs | [HUMAN] |

---

### 5. API Security

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 5.1 | Rate limiting on public endpoints | [HUMAN] | Middleware enforces request limits |
| 5.2 | Auth required on all non-public endpoints | [HUMAN] | No unprotected routes |
| 5.3 | Keys in headers, never query strings | [AGENT] | `grep -rn "?.*token=\|?.*api_key=" src/` → empty |
| 5.4 | Responses exclude unnecessary sensitive fields | [HUMAN] | No password hashes, full card numbers, internal IDs |
| 5.5 | CORS origin whitelist — not `*` in production | [AGENT] | `grep -rn "Access-Control-Allow-Origin: \*" src/` → empty in prod |
| 5.6 | Request body size limits set | [HUMAN] | Server has payload size cap |
| 5.7 | API versioning in place | [HUMAN] | Breaking changes get a new version |
| 5.8 | Errors return generic messages — no stack traces | [HUMAN] | Test an intentional error |
| 5.9 | Webhooks verify HMAC signature | [HUMAN] | Handler validates `X-Signature` |
| 5.10 | Idempotency keys on critical mutations | [HUMAN] | Charge/order/record creation endpoints |

---

### 6. Dependency Security

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 6.1 | No high/critical CVEs | [AGENT] | `npm audit --audit-level=high` / `pip-audit` / `trivy fs .` |
| 6.2 | Versions pinned — no `*` or `latest` | [AGENT] | `grep -E '"[*]"\|"latest"' package.json` → empty |
| 6.3 | Lock file committed | [AGENT] | `git ls-files \| grep -E "package-lock\|yarn\.lock\|poetry\.lock"` → exists |
| 6.4 | No global deps that should be local | [HUMAN] | All deps in `dependencies` or `devDependencies` |
| 6.5 | Licences compatible | [HUMAN] | No GPL in proprietary projects |
| 6.6 | Packages from official registries only | [HUMAN] | No forks or unknown sources |
| 6.7 | `devDependencies` excluded from production build | [AGENT] | Review build config |

---

### 7. Environment & Infrastructure

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 7.1 | dev / staging / production clearly separated | [HUMAN] | `NODE_ENV` / `APP_ENV` drives behaviour |
| 7.2 | Prod secrets from secrets manager, not `.env` | [HUMAN] | Never copy-paste `.env` to servers |
| 7.3 | Infrastructure-as-code — no manual console changes | [HUMAN] | Terraform/Pulumi/CDK used |
| 7.4 | No hardcoded ARNs/account IDs/regions | [AGENT] | `grep -rE "arn:aws\|projects/[a-z]+-[0-9]+" src/` → empty |
| 7.5 | Least-privilege IAM/service account | [HUMAN] | Not admin — only needed permissions |
| 7.6 | Logging enabled in production | [HUMAN] | CloudWatch/Stackdriver/Datadog active |
| 7.7 | Alerting on errors and latency spikes | [HUMAN] | On-call alert at error rate threshold |
| 7.8 | Backups configured and restore tested | [HUMAN] | Auto backups + restore verified |
| 7.9 | Health check endpoint exists | [AGENT] | `grep -rn "health\|ping\|readyz" src/` → returns 200, no auth |
| 7.10 | Graceful shutdown on SIGTERM | [HUMAN] | Drains in-flight requests before exit |

---

### 8. Authentication & Authorisation

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 8.1 | Passwords hashed with bcrypt/Argon2/scrypt | [AGENT] | `grep -rn "md5\|sha1\|sha256.*password" src/` → empty |
| 8.2 | JWT access tokens expire ≤60 min | [HUMAN] | Review JWT config |
| 8.3 | Refresh tokens rotated on use, invalidated on logout | [HUMAN] | Old token revoked on exchange |
| 8.4 | MFA for admin accounts | [HUMAN] | Admin panel supports TOTP |
| 8.5 | Account lockout after N failed logins | [HUMAN] | Brute-force protection exists |
| 8.6 | Password reset links single-use, expire <1h | [HUMAN] | Token marked used on first click |
| 8.7 | Authorisation at data layer, not just route | [HUMAN] | Can't access other user's data by changing ID |
| 8.8 | RBAC documented and enforced | [HUMAN] | Roles/permissions consistent throughout |

---

### 9. Data Privacy & Compliance

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 9.1 | PII not logged | [AGENT] | `grep -rn "log.*email\|log.*phone\|print.*ssn" src/` → empty |
| 9.2 | Data retention policy enforced | [HUMAN] | Old records purged/anonymised per policy |
| 9.3 | Right to erasure implemented | [HUMAN] | Delete-account removes/anonymises all PII |
| 9.4 | Cookie consent for tracking cookies | [HUMAN] | Non-essential cookies need explicit consent |
| 9.5 | Privacy policy current | [HUMAN] | Updated before each new data collection |
| 9.6 | Data encrypted in transit (TLS 1.2+) | [HUMAN] | HTTPS only — no HTTP fallback |
| 9.7 | Sensitive data encrypted at rest | [HUMAN] | DB encryption + S3 SSE enabled |
| 9.8 | Third-party SDKs reviewed for data sharing | [HUMAN] | Every new SDK reviewed |

---

### 10. Performance

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 10.1 | No N+1 query patterns | [HUMAN] | Loops calling DB must use eager loading |
| 10.2 | Indexes on slow queries | [HUMAN] | `EXPLAIN ANALYZE` — no full table scans |
| 10.3 | Caching for expensive operations | [HUMAN] | Redis/memcached/in-memory for repeated reads |
| 10.4 | No blocking in async paths | [HUMAN] | No `sleep()`, blocking I/O, CPU work on event loop |
| 10.5 | Images optimised | [HUMAN] | WebP/AVIF, compressed, `loading="lazy"` |
| 10.6 | Bundle size within budget | [AGENT] | `npm run build -- --stats` — check size |
| 10.7 | No memory leaks | [HUMAN] | Event listeners removed, closures released |
| 10.8 | Pagination on all list endpoints | [HUMAN] | No unbounded result sets |
| 10.9 | Timeouts on all outbound calls | [AGENT] | `grep -rn "timeout" src/` — every fetch has one |

---

### 11. Accessibility (UI/Frontend Projects)

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 11.1 | All images have `alt` text | [AGENT] | `grep -rn "<img" src/ \| grep -v "alt="` → empty |
| 11.2 | Colour contrast ≥ 4.5:1 (WCAG AA) | [HUMAN] | DevTools or axe extension |
| 11.3 | Keyboard navigable | [HUMAN] | Tab through every button, link, field |
| 11.4 | Forms have `<label>` elements | [AGENT] | `grep -rn "<input" src/ \| grep -v "aria-label\|id="` |
| 11.5 | Focus indicators visible | [HUMAN] | Focus ring clearly visible on tab |
| 11.6 | No colour-only communication | [HUMAN] | Errors use text/icon, not just colour |
| 11.7 | ARIA used correctly | [HUMAN] | Supplements HTML semantics, not replaces |
| 11.8 | Automated a11y scan | [AGENT] | `npx axe-cli http://localhost:3000 --exit` → 0 violations |

---

### 12. Testing

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 12.1 | Tests pass locally | [AGENT] | `npm test` / `pytest` / `go test ./...` → exit 0 |
| 12.2 | New features have unit + integration tests | [HUMAN] | PR diff has corresponding test code |
| 12.3 | Tests use mocks — no real external services | [HUMAN] | No prod API/DB hits in test suite |
| 12.4 | Coverage not decreased | [AGENT] | Run coverage tool, compare with baseline |
| 12.5 | No skipped tests without a ticket | [AGENT] | `grep -rn "\.skip\|xfail\|pytest.mark.skip" tests/` → each has ticket |
| 12.6 | Edge cases tested | [HUMAN] | Empty input, null, max length, special chars |
| 12.7 | E2E covers critical path | [HUMAN] | Most important user journey has passing E2E |

---

### 13. Logging & Monitoring

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 13.1 | Structured logging (JSON) | [AGENT] | `grep -rn "console\.log\|print(" src/` → use structured logger |
| 13.2 | Log levels correct | [HUMAN] | Noise at debug, not info; errors only for errors |
| 13.3 | No PII in logs | [AGENT] | `grep -rn "log.*email\|log.*password\|log.*phone" src/` → empty |
| 13.4 | Request/trace IDs in all logs | [HUMAN] | Correlation ID in every request log |
| 13.5 | Error monitoring configured | [HUMAN] | Sentry/Bugsnag/Rollbar active |
| 13.6 | Key business events logged | [HUMAN] | Signup, purchase, deletion — audit trail |
| 13.7 | Log retention policy defined | [HUMAN] | Not kept longer than necessary |

---

### 14. Error Handling

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 14.1 | No empty catch blocks | [AGENT] | `grep -rn "catch.*{\s*}" src/` → empty |
| 14.2 | Errors logged with context | [HUMAN] | Every catch logs or rethrows |
| 14.3 | User-facing messages are actionable | [HUMAN] | "Try again" not "NullPointerException line 42" |
| 14.4 | Global error handler registered | [AGENT] | `grep -rn "uncaughtException\|app.use.*error" src/` → exists |
| 14.5 | Retries with exponential backoff | [HUMAN] | Network/queue retry with backoff, not tight loop |
| 14.6 | Circuit breaker for external deps | [HUMAN] | App degrades gracefully when third-party is down |

---

### 15. Documentation

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| 15.1 | `CLAUDE.md` reflects current state | [HUMAN] | Does it still describe how the project works? |
| 15.2 | `CLAUDE-HISTORY.md` updated today | [AGENT] | Last entry date matches today |
| 15.3 | `README.md` has setup/run/test instructions | [HUMAN] | New dev can run project from README alone |
| 15.4 | API docs updated for changes | [HUMAN] | Every new/changed endpoint documented |
| 15.5 | Breaking changes communicated | [HUMAN] | In CHANGELOG or HISTORY if behaviour changes |
| 15.6 | `.env.example` vars have comments | [AGENT] | Every var has a comment explaining its purpose |
| 15.7 | Architecture diagram current | [HUMAN] | `docs/architecture.md` updated if structure changed |

---

### 16. Pre-Commit Checklist

```
[ ] 1.  git diff --staged: no .env or secret files staged
[ ] 2.  git diff --staged: scan for hardcoded secrets
[ ] 3.  No merge conflict markers (<<<, ===, >>>) in staged files
[ ] 4.  Tests pass: run test suite locally
[ ] 5.  Linter passes: no new lint errors
[ ] 6.  No console.log / debug statements in staged files
[ ] 7.  Commit message explains WHY, not just WHAT
[ ] 8.  Correct branch — not committing directly to main/master
```

---

### 17. Pre-Deploy Checklist

```
[ ] 1.  All pre-commit checks passed
[ ] 2.  Full test suite passes in CI
[ ] 3.  Security scan clean (npm audit / pip-audit / trivy)
[ ] 4.  Environment variables set in target environment
[ ] 5.  Database migrations tested on staging clone
[ ] 6.  Rollback plan documented and tested
[ ] 7.  Feature flags / kill switches in place for risky changes
[ ] 8.  Runbook updated if operational procedures changed
[ ] 9.  On-call person notified
[ ] 10. CLAUDE-HISTORY.md updated with deploy decision
```

---

### 18. Incident Response

```
[ ] 1.  Revert or feature-flag immediately
[ ] 2.  Assess blast radius: how many users affected?
[ ] 3.  Check logs for root cause (not assumptions)
[ ] 4.  Communicate status to stakeholders within 30 minutes
[ ] 5.  Write timeline while memory is fresh
[ ] 6.  Document in CLAUDE-HISTORY.md: what broke, why, how fixed
[ ] 7.  Schedule post-mortem within 48 hours
[ ] 8.  Add a test that would have caught this
[ ] 9.  Add the check to GUARDRAILS.md
```

---

### 19. Project-Specific Checks

> Add checks unique to this project here. Same format: [AGENT] or [HUMAN].

| # | Check | Who | Command / Method |
|---|-------|-----|-----------------|
| P.1 | *(add project-specific check)* | [HUMAN] | *(how to verify)* |

---

### Agent Validation Prompt

```
Read GUARDRAILS.md in this project.
Run every check marked [AGENT] against the current staged files and codebase.
For each output exactly one of:
  PASS – check #X.Y: [description]
  FAIL – check #X.Y: [description] — [specific detail]
  SKIP – check #X.Y: [description] — [reason]
Final line: "Result: X passed, Y failed, Z skipped."
If any FAIL — list what must be fixed before proceeding.
```

---

## 15. Customising For Different Project Types

Add these to `CLAUDE.md` and `GUARDRAILS.md` Section 19 per project type.

### Web App (React / Vue / Next.js)

```markdown
# Add to CLAUDE.md
## Tech Stack
Next.js 14, TypeScript, Tailwind, Prisma, PostgreSQL
## Conventions
- Pages: src/app/ (App Router)
- Components: src/components/ (PascalCase)
- API routes: src/app/api/
```
```markdown
# Add to GUARDRAILS.md Section 19
| P.1 | No `any` TypeScript types | [AGENT] | `git diff --staged \| grep ": any"` |
| P.2 | No client components where server components work | [HUMAN] | Review 'use client' |
| P.3 | Images use next/image | [AGENT] | `grep -rn "<img " src/` |
| P.4 | fetch() always has error handling | [HUMAN] | .catch() or try/catch |
```

### Python API (FastAPI / Django / Flask)

```markdown
# Add to CLAUDE.md
## Tech Stack
Python 3.12, FastAPI, SQLAlchemy, Alembic, PostgreSQL
## Conventions
- Type hints on all functions
- Pydantic models for all request/response schemas
- Alembic for migrations — never modify DB directly
```
```markdown
# Add to GUARDRAILS.md Section 19
| P.1 | Pydantic models on all endpoints | [HUMAN] | Check route definitions |
| P.2 | No raw SQL — use ORM or text() with params | [AGENT] | `grep -rn "execute(f" src/` |
| P.3 | Alembic migration for DB changes | [HUMAN] | New models need migration file |
| P.4 | pytest passes | [AGENT] | `pytest tests/` exit 0 |
```

### CLI Tool

```markdown
# Add to CLAUDE.md
## Conventions
- All commands in src/commands/
- Shared utilities in src/utils/
- Config file: ~/.config/<tool-name>/config.json
- Never write to filesystem without explicit user confirmation
- Non-interactive mode must be supported via --yes flag
```
```markdown
# Add to GUARDRAILS.md Section 19
| P.1 | --help works for every command | [AGENT] | Run `<tool> --help` and each subcommand |
| P.2 | Non-interactive mode supported | [HUMAN] | --yes flag skips all prompts for scripting |
| P.3 | No filesystem writes without confirmation | [HUMAN] | Destructive ops must ask first |
| P.4 | Exit codes correct: 0=success, 1=error | [AGENT] | Test error paths |
```

### Data / ML

```markdown
# Add to CLAUDE.md
## Conventions
- data/ never committed (in .gitignore)
- notebooks/ for exploration only — not production
- src/ for clean production code
- MLflow/W&B for experiment tracking
```
```markdown
# Add to GUARDRAILS.md Section 19
| P.1 | data/ in .gitignore | [AGENT] | `grep "^data/" .gitignore` |
| P.2 | No hardcoded dataset paths | [AGENT] | `grep -rn "open('" src/` |
| P.3 | Model artefacts not committed | [AGENT] | `git ls-files \| xargs ls -la \| awk '$5 > 100000000'` |
| P.4 | Random seeds set | [HUMAN] | `np.random.seed()` in training scripts |
```

---

## 16. Updating the Template

| What to change | Where to update | Auto-applies? |
|---------------|----------------|---------------|
| Project structure, file templates | `~/.claude/skills/project-bootstrap/SKILL.md` | Yes — `/bootstrap` reads it at runtime |
| Shell script output | `~/scripts/claude-init.sh` | Manual — script doesn't read SKILL.md |
| Generic guardrails | `~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md` | New projects only — existing keep theirs |
| Agent step-by-step | `~/.claude/skills/project-bootstrap/AGENT-INSTRUCTIONS.md` | Manual — pass to API each time |
| This guide | `docs/SETUP-GUIDE.md` | Sync manually: `cp docs/SETUP-GUIDE.md ~/.claude/PROJECT-BOOTSTRAP-GUIDE.md` |

### To update existing projects

1. Run `/bootstrap` — creates missing files, skips existing
2. Copy new guardrail sections manually from `GUARDRAILS-BASE.md`

---

## 17. Troubleshooting

**`/bootstrap` creates files but doesn't fill in project content**
After running, explicitly say: `"Fill in CLAUDE.md and skills/<slug>/SKILL.md — this project does X."`

---

**`CLAUDE-HISTORY.md` not being read at session start**
Check `~/.claude/CLAUDE.md` exists and says `CLAUDE-HISTORY.md` (not `HISTORY.md`). Then ask: `"Read CLAUDE-HISTORY.md and tell me what you learned."`

---

**Shell script exits "directory already exists"**
Use `/bootstrap` inside Claude Code instead — it skips existing files safely.

---

**`.env` showing in `git status`**
It was tracked before `.gitignore` was added:
```bash
git rm --cached .env
git add .gitignore
git commit -m "Stop tracking .env"
```

---

**Agent leaves placeholder strings like `PROJECT_NAME` in files**
The agent didn't replace all variables. Check for remaining placeholders:
```bash
grep -rn "PROJECT_NAME\|PROJECT_SLUG\|PROJECT_PURPOSE" .
```
The AGENT-INSTRUCTIONS.md error table flags this as a hard failure.

---

**MCP server not connecting**
```bash
npx @anthropic-ai/mcp-server-filesystem --version
# If missing:
npm install -g @anthropic-ai/mcp-server-filesystem
```

---

**Condensed GUARDRAILS.md missing categories**
The shell script generates a short version. Replace with the full base:
```bash
cp ~/.claude/skills/project-bootstrap/GUARDRAILS-BASE.md GUARDRAILS.md
```

---

## 18. Quick Reference Card

```
╔══════════════════════════════════════════════════════════════════════╗
║           Claude Code Bootstrap — Quick Reference Card               ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  START A NEW PROJECT                                                 ║
║  ──────────────────────────────────────────────────────────────────  ║
║  Shell:   bash ~/scripts/claude-init.sh "Project Name"              ║
║  Claude:  /bootstrap "Project Name"                                 ║
║  Agent:   pass AGENT-INSTRUCTIONS.md + inputs to Anthropic API      ║
║                                                                      ║
║  GLOBAL FILES  (set up once — apply everywhere)                     ║
║  ──────────────────────────────────────────────────────────────────  ║
║  ~/.claude/CLAUDE.md                 Global rules + session memory  ║
║  ~/.claude/commands/bootstrap.md     /bootstrap                     ║
║  ~/.claude/commands/save-session.md  /save-session                  ║
║  ~/.claude/skills/project-bootstrap/                                ║
║    SKILL.md               Template source of truth                  ║
║    GUARDRAILS-BASE.md     Full 100+ check template                  ║
║    AGENT-INSTRUCTIONS.md  24-step agent spec                        ║
║  ~/scripts/claude-init.sh            Shell script                   ║
║  ~/.claude/PROJECT-BOOTSTRAP-GUIDE.md  Global copy of this guide   ║
║                                                                      ║
║  GLOBAL SLASH COMMANDS  (no setup — available everywhere)           ║
║  ──────────────────────────────────────────────────────────────────  ║
║  /bootstrap [name]    Scaffold full project structure               ║
║  /save-session        Append session summary to CLAUDE-HISTORY.md   ║
║                                                                      ║
║  PROJECT SLASH COMMANDS  (per project, in .claude/commands/)        ║
║  ──────────────────────────────────────────────────────────────────  ║
║  /generate [topic]    Run core generation pipeline                  ║
║  /preview             Review latest output                          ║
║  /export [file]       Export for distribution                       ║
║  /brand-audit [file]  Run GUARDRAILS checks                         ║
║                                                                      ║
║  KEY PROJECT FILES                                                  ║
║  ──────────────────────────────────────────────────────────────────  ║
║  CLAUDE.md                 Claude's project instructions            ║
║  CLAUDE-HISTORY.md         Session memory — auto read/written       ║
║  GUARDRAILS.md             100+ checks — commit/PR/deploy           ║
║  .claude/settings.json     Permissions (allow/deny) + hooks         ║
║  .claude/settings.local.json  API keys — gitignored                 ║
║  .mcp.json                 MCP server connections                   ║
║  skills/<slug>/SKILL.md    Core project skill                       ║
║                                                                      ║
║  SESSION MEMORY                                                     ║
║  ──────────────────────────────────────────────────────────────────  ║
║  Open  → Claude reads CLAUDE-HISTORY.md automatically              ║
║  Close → Claude writes session summary automatically                ║
║  Now   → /save-session                                              ║
║                                                                      ║
║  SECURITY (global — cannot be overridden)                           ║
║  ──────────────────────────────────────────────────────────────────  ║
║  Never commit .env / *.key / *.pem / *.p12                         ║
║  Never git add -A — stage files by name                             ║
║  Never hardcode secrets — use process.env.VAR                       ║
║  Always scan git diff --staged before committing                    ║
║  Never push directly to main or master                              ║
║                                                                      ║
║  PRE-COMMIT (8)              PRE-DEPLOY (10)                        ║
║  ────────────────────────    ──────────────────────────────────     ║
║  1. No .env staged           1. All pre-commit checks pass          ║
║  2. No secrets in diff       2. CI tests pass                       ║
║  3. No conflict markers      3. Security scan clean                 ║
║  4. Tests pass               4. Env vars set in target              ║
║  5. Linter passes            5. Migrations tested on staging        ║
║  6. No debug logs            6. Rollback plan ready                 ║
║  7. Commit msg is WHY        7. Feature flags in place              ║
║  8. Correct branch           8. Runbook updated                     ║
║                              9. On-call notified                    ║
║                              10. CLAUDE-HISTORY.md updated          ║
║                                                                      ║
║  UPDATE THE TEMPLATE                                                ║
║  ──────────────────────────────────────────────────────────────────  ║
║  1. SKILL.md → /bootstrap picks up automatically                   ║
║  2. claude-init.sh → manual sync required                          ║
║  3. GUARDRAILS-BASE.md → new projects only                         ║
║  4. AGENT-INSTRUCTIONS.md → manual sync                            ║
║  5. SETUP-GUIDE.md → cp to ~/.claude/PROJECT-BOOTSTRAP-GUIDE.md   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

*Set up: 2026-03-22 | Ref: `instagram-carousel-generator`*
*Bug fixed 2026-03-22: global CLAUDE.md now correctly reads `CLAUDE-HISTORY.md` (not `HISTORY.md`)*
