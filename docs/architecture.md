# Architecture Overview

## Data Flow

```
User Input (brand details + topic)
        ↓
validateBrandInputs()       ← src/utils/validators.js
        ↓
derivePalette(primaryColor) ← src/services/palette.js
getFontPairing(fontStyle)   ← src/services/font-service.js
        ↓
Slide Content Generation    ← content-writer agent
        ↓
HTML Assembly               ← slide-templates + generator.html
        ↓
Output: carousel-[brand]-[topic].html
```

## Key Constraints
- All styles must be inline (no external CSS files at runtime)
- Fonts loaded via Google Fonts CDN only
- Aspect ratio: 4:5 (1080×1350px) — enforced via CSS aspect-ratio
- No JavaScript frameworks — vanilla JS only for swipe interaction
