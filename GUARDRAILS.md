# Project Guardrails — Instagram Carousel Generator

> A validation checklist for both humans and automated agents.
> Run through this before every commit, PR, and deploy.
> Items marked [AGENT] can be checked programmatically. Items marked [HUMAN] require manual review.

---

## 1. Secret & Credential Safety

| # | Check | Who | How to verify |
|---|-------|-----|---------------|
| 1.1 | `.env` is in `.gitignore` | [AGENT] | `grep -q "^\.env$" .gitignore && echo PASS` |
| 1.2 | `.env` is NOT staged for commit | [AGENT] | `git diff --staged --name-only \| grep -v "^\.env$"` |
| 1.3 | `settings.local.json` is NOT staged | [AGENT] | `git diff --staged --name-only \| grep -v "settings.local.json"` |
| 1.4 | No `*.key`, `*.pem`, `*.p12` files tracked | [AGENT] | `git ls-files \| grep -E "\.(key\|pem\|p12)$" \| wc -l` should be 0 |
| 1.5 | No hardcoded API keys in staged files | [AGENT] | `git diff --staged \| grep -iE "(api_key\|secret\|password\|token)\s*=\s*['\"][^'\"]{8,}"` should return nothing |
| 1.6 | `.env.example` contains only placeholder values (no real secrets) | [HUMAN] | Open `.env.example` and confirm all values are empty or obviously fake |
| 1.7 | No secrets in `CLAUDE.md`, `HISTORY.md`, or any `.md` file | [HUMAN] | Scan docs for copied credentials |

---

## 2. Git Hygiene

| # | Check | Who | How to verify |
|---|-------|-----|---------------|
| 2.1 | Files staged individually, not with `git add -A` | [HUMAN] | Run `git diff --staged --name-only` and confirm only intended files are listed |
| 2.2 | Commit message describes the "why", not just the "what" | [HUMAN] | Read the draft commit message before confirming |
| 2.3 | Not pushing directly to `main` or `master` | [AGENT] | `git branch --show-current` should not be `main` or `master` for feature work |
| 2.4 | `node_modules/` is not tracked | [AGENT] | `git ls-files node_modules/ \| wc -l` should be 0 |
| 2.5 | `exports/` and `dist/` are not tracked | [AGENT] | `git ls-files exports/ dist/ \| wc -l` should be 0 |
| 2.6 | No `.DS_Store` or OS junk files tracked | [AGENT] | `git ls-files \| grep -E "\.DS_Store\|Thumbs\.db"` should return nothing |

---

## 3. Code Quality

| # | Check | Who | How to verify |
|---|-------|-----|---------------|
| 3.1 | No `console.log` left in production paths | [AGENT] | `grep -r "console\.log" src/ --include="*.js"` should return nothing (or review each hit) |
| 3.2 | All input validation runs before processing | [HUMAN] | Trace the call path for each public-facing function in `src/services/` |
| 3.3 | No inline `eval()` or `innerHTML` with user input | [AGENT] | `grep -r "eval(\|innerHTML" src/` — review any hits for XSS risk |
| 3.4 | Palette tokens used for all colors (no raw hex in slide HTML) | [HUMAN] | Search generated HTML for hardcoded hex values outside the palette object |
| 3.5 | New functions have at least one unit test | [HUMAN] | For each new function in `src/`, confirm a corresponding test exists in `tests/unit/` |

---

## 4. Output Quality (Carousel-Specific)

| # | Check | Who | How to verify |
|---|-------|-----|---------------|
| 4.1 | All 7 slides present | [AGENT] | `grep -c "class=\"slide" generated-file.html` should be ≥ 7 |
| 4.2 | Progress bar on slides 1–6 | [HUMAN] | Open carousel in browser, check each slide |
| 4.3 | No swipe arrow on last slide | [HUMAN] | Inspect slide 7 in browser DevTools |
| 4.4 | Progress bar at 100% on last slide | [HUMAN] | Inspect slide 7 progress bar width |
| 4.5 | Brand name and handle on first and last slides | [AGENT] | `grep -c "BRAND_NAME\|@HANDLE" generated-file.html` should be 0 (placeholders replaced) |
| 4.6 | No body text overlapping progress bar (min 48px bottom padding) | [HUMAN] | Check each slide at mobile viewport in browser |
| 4.7 | Correct aspect ratio (4:5) | [AGENT] | `grep "aspect-ratio: 4/5\|aspect-ratio: 0.8" generated-file.html` should match |
| 4.8 | Google Fonts load correctly (no 404s) | [HUMAN] | Open browser DevTools Network tab, filter for fonts |

---

## 5. Security (OWASP Top 10 relevant to this project)

| # | Check | Who | Risk |
|---|-------|-----|------|
| 5.1 | User-supplied brand name sanitized before embedding in HTML | [HUMAN] | XSS — `<script>` in brand name would execute in carousel |
| 5.2 | Hex color input validated against `/^#[0-9A-Fa-f]{6}$/` before use | [AGENT] | CSS injection — malformed color could break slide layout |
| 5.3 | Instagram handle stripped of special chars before embedding | [AGENT] | XSS — handle appears in HTML |
| 5.4 | Uploaded images validated as actual image files (if feature exists) | [AGENT] | File injection — only accept `image/png`, `image/jpeg`, `image/webp` |
| 5.5 | API endpoint (`api/generate.js`) has rate limiting | [HUMAN] | DoS — unthrottled generation requests could exhaust server |

---

## 6. Pre-Deploy Checklist

| # | Check | Who |
|---|-------|-----|
| 6.1 | All guardrail checks above pass | Both |
| 6.2 | `scripts/setup.sh` runs cleanly on a fresh clone | [HUMAN] |
| 6.3 | Generated carousel opens correctly in Chrome, Firefox, Safari | [HUMAN] |
| 6.4 | `HISTORY.md` updated with session decisions | [AGENT] |
| 6.5 | `CLAUDE.md` still accurately reflects how the project works | [HUMAN] |

---

## How Automated Agents Should Use This File

An agent validating a commit or PR should:

1. Run every check marked `[AGENT]` using `Bash`
2. For each check, output: `PASS`, `FAIL: <detail>`, or `SKIP: <reason>`
3. If any check returns `FAIL` → block the commit/deploy and report which check failed and why
4. Output a final summary: `X passed, Y failed, Z skipped`
5. Checks marked `[HUMAN]` should be listed as reminders in the PR description

---

## Agent Validation Prompt

To run all agent-checkable guardrails on a specific file, pass this to an agent:

```
Read GUARDRAILS.md. Run every check marked [AGENT] on the file: [filename].
For each check output PASS, FAIL, or SKIP with a reason.
At the end output a summary: X passed, Y failed, Z skipped.
If any FAIL, list exactly what needs to be fixed before this can be committed.
```
