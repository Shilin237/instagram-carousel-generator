# Instagram Carousel Generator — Claude Project Instructions

## Project Overview
This project generates fully designed, brand-consistent Instagram carousels as self-contained HTML files where every slide is export-ready as an individual image.

## How Claude Should Behave In This Project

### Step 1: Collect Brand Details
Before generating any carousel, always ask for:
1. **Brand name** — shown on first and last slides
2. **Instagram handle** — shown in the IG frame header
3. **Primary brand color** — hex code or description
4. **Logo** — SVG path, brand initial, or skip
5. **Font preference** — serif+sans (editorial), all sans (modern), or specific Google Fonts
6. **Tone** — professional, casual, playful, bold, minimal
7. **Images** — any images to embed in the carousel

If the user provides a website URL, derive colors and style from it.
Never assume defaults — always ask before generating.

### Step 2: Derive Color System
From a single primary color, generate the full 6-token palette:
- `BRAND_PRIMARY` — main accent
- `BRAND_LIGHT` — primary lightened ~20%
- `BRAND_DARK` — primary darkened ~30%
- `LIGHT_BG` — warm/cool off-white (never pure #fff)
- `LIGHT_BORDER` — slightly darker than LIGHT_BG
- `DARK_BG` — near-black with brand tint

### Step 3: Typography Pairings
| Style | Heading | Body |
|-------|---------|------|
| Editorial | Playfair Display | DM Sans |
| Modern | Plus Jakarta Sans 700 | Plus Jakarta Sans 400 |
| Warm | Lora | Nunito Sans |
| Technical | Space Grotesk | Space Grotesk |
| Bold | Fraunces | Outfit |

Font scale: Headings 28–34px / Body 14px / Tags 10px uppercase / Steps 26px

### Slide Architecture
- Aspect ratio: **4:5**
- 7 slides ideal (5–10 range)
- Alternate LIGHT_BG and DARK_BG
- Every slide has: progress bar + swipe arrow (except last)

| # | Type | Background |
|---|------|------------|
| 1 | Hero | LIGHT_BG |
| 2 | Problem | DARK_BG |
| 3 | Solution | Brand gradient |
| 4 | Features | LIGHT_BG |
| 5 | Details | DARK_BG |
| 6 | How-to | LIGHT_BG |
| 7 | CTA | Brand gradient |

### Output Format
- Single self-contained HTML file
- Wrapped in Instagram preview frame with swipe interaction
- All slides export-ready as individual images

## File Structure
```
instagram-carousel-generator/
├── CLAUDE.md          ← this file (project instructions)
├── HISTORY.md         ← changelog and version history
├── WORKFLOW.md        ← how to use this tool end-to-end
├── SECURITY.md        ← security and privacy guidelines
├── index.html         ← main carousel generator UI
├── generator.html     ← standalone carousel output template
└── assets/
    └── fonts.css      ← Google Fonts imports
```

## Rules
- Never hardcode colors — always derive from brand palette
- Never overlap body text with progress bar (clear bottom padding)
- Last slide: no swipe arrow, progress bar at 100%, clear CTA
- Every component must work on both light and dark backgrounds
