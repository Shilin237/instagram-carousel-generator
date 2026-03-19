# Project History & Changelog

## v1.2.0 — 2026-03-20
### Security (15 issues resolved)

**CRITICAL**
- SEC #1  — Rate limiting: in-memory Map-based sliding window (10 req/60s per IP) added to `api/generate.js`
- SEC #2  — CORS: replaced wildcard `Access-Control-Allow-Origin: *` with strict `ALLOWED_ORIGIN` env var check
- SEC #3  — Architecture: API key moved from browser to Vercel serverless function; frontend now calls `/api/generate`

**HIGH**
- SEC #4  — XSS: `escapeHtml()` added and applied to every `innerHTML` injection point — slide headlines, body text, points, quotes, features, pills, step numbers/titles/descs, CTA text, icons, brand name, handle, and IG frame caption
- SEC #5  — Input validation: `topic` capped at 500 chars; `tone` whitelisted against `VALID_TONES` set (rejects arbitrary values)
- SEC #6  — Error messages: all API errors now return generic client message; detail logged server-side only

**MEDIUM**
- SEC #7  — SRI hashes: `integrity=` attribute added to both CDN `<script>` tags (html2canvas, jsPDF)
- SEC #8  — Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy` set in `vercel.json`
- SEC #9  — CSP: `Content-Security-Policy` header restricts scripts to `cdnjs.cloudflare.com`, fonts to `fonts.googleapis.com`/`fonts.gstatic.com`, no inline scripts
- SEC #10 — Deep JSON validation: server validates slide structure before responding; rejects malformed AI output

**LOW**
- SEC #11 — `.env` added to `.gitignore`; `.env.example` template committed instead
- SEC #12 — `rateLimitMap` cleanup interval prevents memory leak in long-running instances
- SEC #13 — `Vary: Origin` header set to prevent cache poisoning on CORS responses

**Added**
- `api/generate.js` — Vercel serverless function (Node 18+)
- `vercel.json` — routing, security headers, CSP
- `.env` / `.env.example` — API key configuration
- `package.json` — `@anthropic-ai/sdk` dependency, `vercel dev` script
- AI badge in sidebar indicating Claude Haiku content generation

---

## v1.1.0 — 2026-03-20
### Bug Fixes (25 issues resolved)

**CRITICAL**
- FIX #1  — Slider width: `min-width:100%` on flex children had no explicit reference. Now uses `measureAndSetSlideWidths()` which reads `igViewport.offsetWidth` after DOM paint and sets explicit px widths on all `.ig-slide-wrap` elements
- FIX #2  — Transform: was `translateX(-${n*100}%)` (% of ig-track = wrong). Now `translateX(-${n * slideWidth}px)` with measured pixel value
- FIX #3  — All inner slide divs now have `overflow:hidden` via shared `wrapStyle()` helper
- FIX #4  — Progress bar clearance: replaced hardcoded `56px` with `PB_HEIGHT` constant (50px) + computed `CONTENT_PAD` applied consistently to all slides
- FIX #11 — Font loading: `loadFont()` now polls `document.fonts.check()` with 1500ms timeout before rendering slides
- FIX #13 — Responsive: `ig-frame` now uses `clamp(300px, calc(100vw - 440px), 380px)` instead of fixed 380px

**HIGH**
- FIX #6  — Progress bar height unified as `PB_HEIGHT = 50` constant
- FIX #8  — Drag: switched to Pointer Events + `setPointerCapture()` — drag now works even when pointer leaves the viewport boundary
- FIX #12 — Re-entry guard `isGenerating` flag prevents race condition on double-click
- FIX #15 — All headings and body text now have `overflow-wrap:break-word;word-break:break-word`
- FIX #20 — Touch: switched to pointer events (touchstart reset issue eliminated entirely)

**MEDIUM**
- FIX #7  — `pointermove` now applies live transform during drag (visual drag feedback)
- FIX #9  — `user-select:none; -webkit-user-select:none` on `.ig-viewport` prevents text selection during drag
- FIX #10 — Color input height unified: `height:42px` with consistent border/bg styling
- FIX #14 — Media query now also adjusts frame width via `min(380px, calc(100vw - 32px))`
- FIX #16 — Caption uses `.ig-caption-text` with `-webkit-line-clamp:3` and `text-overflow:ellipsis`
- FIX #18 — Last feature row and last step row no longer have `border-bottom`
- FIX #22 — `.ig-viewport` background changed to `transparent` (slides control their own bg)

**LOW**
- FIX #17 — Removed unused `topicLower` variable
- FIX #23 — Progress bar counter font-size corrected to `10px` (consistent with tag labels)
- FIX #25 — `exportAllSlides()` now uses promise chain (`.reduce()`) — exports are sequential, no race conditions

**BONUS**
- Added keyboard navigation (← → arrow keys)
- Added window resize handler that re-measures slide widths
- Added status bar with success/error feedback
- `generateCarousel()` converted to `async/await`
- Snap-back animation if drag distance < 20% of slide width
- Swipe threshold changed from fixed 40px to 20% of slide width (proportional)
- Handle auto-prefixed with `@` if user forgets
- `no-transition` class for instant position resets without animation flash

---

## v1.0.0 — 2026-03-20
### Initial Release
- Project scaffolded with full file structure
- CLAUDE.md written with complete system prompt and brand derivation logic
- WORKFLOW.md written covering end-to-end usage
- SECURITY.md written covering data privacy guidelines
- index.html built — interactive carousel generator UI with:
  - Brand input form (name, handle, color, font, tone)
  - Live color palette preview
  - 7-slide carousel output with Instagram preview frame
  - Swipe/drag interaction
  - Per-slide export buttons
- generator.html built — standalone output template

---

## How To Log Changes
When making updates to this project, add an entry at the top of this file in the format:

```
## v{version} — {date}
### {Change Type}
- {What changed and why}
```

Change types: `Added`, `Changed`, `Fixed`, `Removed`, `Security`
