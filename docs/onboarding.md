# Onboarding Guide

## Quick Start

1. Open Claude Code in this project directory
2. Review `CLAUDE.md` for the full generation workflow
3. Use `/generate` to create your first carousel

## Slash Commands
| Command | Description |
|---------|-------------|
| `/generate [topic]` | Generate a new carousel |
| `/preview` | Review the latest generated carousel |
| `/export [file]` | Prepare slides for export |
| `/brand-audit [file]` | Check brand consistency |

## File Structure
- `skills/` — Claude skill definitions for carousel tasks
- `agents/` — Specialized Claude agents
- `src/` — Core generation logic (palette, fonts, validation)
- `tests/` — Unit, integration, and E2E tests
- `docs/` — Architecture and API reference

## Workflow
See `WORKFLOW.md` for the complete end-to-end usage guide.
