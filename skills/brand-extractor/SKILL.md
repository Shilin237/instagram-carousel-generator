---
name: brand-extractor
description: Extracts brand colors, fonts, and tone from a website URL or uploaded screenshot
version: 1.0.0
---

# Brand Extractor Skill

## Purpose
Given a brand website URL or screenshot, derive the brand palette, font choices, and tone to pre-fill carousel generation inputs.

## Inputs
- Website URL or screenshot path

## Outputs
- Suggested BRAND_PRIMARY hex
- Suggested font pairing style
- Suggested tone descriptor
- Notes on logo treatment

## Process
1. Fetch page HTML/CSS (or analyze screenshot visually)
2. Extract dominant colors from CSS custom properties or inline styles
3. Identify heading and body font families from Google Fonts imports or font-face declarations
4. Infer tone from copy style and visual density
