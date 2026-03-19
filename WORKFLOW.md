# Workflow Guide — Instagram Carousel Generator

## Overview
This tool generates fully designed Instagram carousels from a brand color and topic. Each slide is export-ready as an individual image.

---

## End-to-End Workflow

### 1. Open the Generator
Open `index.html` in any modern browser (Chrome recommended for best font rendering and screenshot export).

### 2. Fill In Brand Details
| Field | Example | Notes |
|-------|---------|-------|
| Brand Name | Shilin Studio | Shown on slide 1 and 7 |
| Instagram Handle | @shilin.studio | Shown in IG frame header |
| Primary Color | #6C5CE7 | Hex code — full palette derived from this |
| Font Style | Modern / Editorial / Bold | Selects Google Font pairing |
| Tone | Professional / Playful / Bold | Affects copy style |
| Topic | "5 productivity habits" | What the carousel is about |

### 3. Generate the Carousel
Click **Generate Carousel** — the tool builds all 7 slides with:
- Derived color palette (6 tokens from your primary)
- Typography pairing loaded from Google Fonts
- Progress bar + swipe arrow on each slide
- Instagram preview frame with drag-to-swipe

### 4. Preview & Adjust
- **Drag or swipe** through slides in the preview frame
- If a slide needs changes, edit the topic or adjust brand settings and regenerate
- Dots below the frame show current position

### 5. Export Slides
Two options:

**Option A — Screenshot each slide manually**
1. Navigate to the slide
2. Use browser screenshot tool or Cmd/Ctrl + Shift + S
3. Crop to the 4:5 slide area

**Option B — Use the Export button (per slide)**
1. Click the **Export** button on any slide
2. The slide downloads as a PNG (uses html2canvas)
3. Repeat for each slide

### 6. Post to Instagram
Upload the exported images as a carousel post in this order:
- Slide 1 first (hook/hero)
- Slides 2–6 (content)
- Slide 7 last (CTA)

---

## Using With Claude (claude.ai)

### Setup
1. Go to claude.ai → Projects → New Project
2. Name it "Instagram Carousels"
3. Click "Set project instructions"
4. Paste the full contents of `CLAUDE.md`
5. Save

### Generating in Claude
Example prompts:
- `"Create a carousel about the top 5 mistakes when starting a business"`
- `"Generate a carousel explaining what Claude AI can do for marketers"`
- `"Make a carousel for my product launch — here's our website: [url]"`
- `"Turn this blog post into a carousel: [paste post]"`

### Iterating
- `"Redo slide 3 with a darker background"`
- `"Make the headline on slide 1 shorter"`
- `"Change the tone to more playful"`
- `"Add a sixth slide about pricing"`

---

## Deploying to Vercel

### Prerequisites
- Node 18+ installed
- Vercel CLI: `npm i -g vercel`
- Anthropic API key from console.anthropic.com

### Setup
```bash
cd instagram-carousel-generator
npm install
cp .env.example .env
# Edit .env — add your real ANTHROPIC_API_KEY
```

### Local Development
```bash
npm run dev   # runs: vercel dev
# Open http://localhost:3000
```

### Deploy to Production
```bash
npm run deploy   # runs: vercel --prod
```

### Set Environment Variables on Vercel
After your first deploy, go to your Vercel project dashboard:
1. **Settings → Environment Variables**
2. Add `ANTHROPIC_API_KEY` — paste your key
3. Add `ALLOWED_ORIGIN` — paste your Vercel URL (e.g. `https://yourapp.vercel.app`)
4. Redeploy for the variables to take effect

> `ALLOWED_ORIGIN` must exactly match your deployed URL (no trailing slash).
> During local dev it defaults to `http://localhost:3000` from your `.env` file.

---

## Tips
- Always provide your exact hex code — even rough ones work
- Providing your website URL lets Claude auto-derive your brand style
- 7 slides is the sweet spot — fewer feels incomplete, more loses attention
- The gradient slide (3 and 7) is the most visually striking — put your best content there
- Set a monthly spend limit on your Anthropic API key to cap costs
