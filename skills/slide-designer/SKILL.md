---
name: slide-designer
description: Designs individual carousel slides given content, palette, and slide type
version: 1.0.0
---

# Slide Designer Skill

## Purpose
Given a slide type, content, and palette, generate the HTML+CSS for a single carousel slide that is export-ready at 1080×1350px.

## Inputs
- Slide type (hero / problem / solution / features / details / how-to / cta)
- Headline text
- Body text or bullet points
- Brand palette tokens
- Font pairing

## Outputs
- Self-contained `<div>` block for the slide
- Inline styles only (no external dependencies)
