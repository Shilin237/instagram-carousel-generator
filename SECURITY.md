# Security & Privacy Guidelines

## Overview
This tool uses a **client + serverless** architecture. The frontend (`public/index.html`) runs in the browser; AI content generation runs through a Vercel serverless function (`api/generate.js`) that holds the API key server-side. No API key is ever sent to or stored in the browser.

---

## Architecture

```
Browser (public/index.html)
  │  POST { topic, tone }
  ▼
Vercel Serverless (api/generate.js)   ← API key lives here only
  │  Anthropic API call
  ▼
Claude Haiku → structured JSON slides → browser
```

---

## Security Controls (v1.2.0)

| Control | Where | Detail |
|---------|-------|--------|
| API key isolation | Server | Stored in `ANTHROPIC_API_KEY` env var; never sent to browser |
| Rate limiting | Server | 10 requests / 60 seconds per IP (in-memory, sliding window) |
| CORS restriction | Server | Only `ALLOWED_ORIGIN` env var value is allowed; no wildcard |
| Input validation | Server | `topic` max 500 chars; `tone` whitelisted to 5 allowed values |
| XSS prevention | Browser | All AI-generated and user-supplied text escaped via `escapeHtml()` before `innerHTML` injection |
| SRI hashes | Browser | Both CDN scripts (`html2canvas`, `jsPDF`) have `integrity=` attributes |
| Security headers | Vercel | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy` |
| Content Security Policy | Vercel | Scripts: `cdnjs.cloudflare.com` only; no `unsafe-inline`; no `unsafe-eval` |
| Error handling | Server | Generic error messages to client; detailed errors logged server-side only |
| JSON validation | Server | AI response structure validated before returning to browser |

---

## Data Handling

### What the server receives per request
- `topic` (string, max 500 chars) — your carousel subject
- `tone` (string, one of: professional, casual, playful, bold, minimal)
- IP address (for rate limiting, not logged or stored)

### What is never sent to the server
- Brand name, Instagram handle, hex color, font selection — all local
- Exported images — generated client-side via html2canvas
- PDF files — assembled client-side via jsPDF

### Third-party services
| Service | Data sent | Purpose |
|---------|-----------|---------|
| Anthropic API | topic + tone | AI slide content generation |
| Google Fonts | None (CSS request) | Typography loading |
| Cloudflare CDN | None (script fetch) | html2canvas + jsPDF libraries |

---

## What Is Safe To Share With Claude (Project Mode)
- Brand name and Instagram handle (public information)
- Hex color codes and font preferences
- Topic / content brief
- Public website URLs

## What To Avoid Sharing
- Private API keys or tokens
- Customer PII (names, emails, phone numbers)
- Unreleased product details under NDA
- Internal pricing or financial data

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key — never commit to git |
| `ALLOWED_ORIGIN` | Yes | Your deployed URL (e.g. `https://yourapp.vercel.app`) |

The `.env` file is listed in `.gitignore` and must never be committed. Use `.env.example` as a reference template.

---

## Dependency Security

| Dependency | Source | SRI Hash | Purpose |
|------------|--------|----------|---------|
| html2canvas 1.4.1 | cdnjs.cloudflare.com | ✓ | Slide PNG export |
| jsPDF 2.5.1 | cdnjs.cloudflare.com | ✓ | LinkedIn PDF export |
| Google Fonts | fonts.googleapis.com | N/A (CSS) | Typography |
| @anthropic-ai/sdk | npm | — | Serverless API calls |

For air-gapped environments: download and self-host html2canvas and jsPDF, update the CSP in `vercel.json` accordingly.

---

## Reporting Issues
If you find a security issue, log it in `HISTORY.md` under a `Security` change type and address it before the next release.
