#!/usr/bin/env bash
# Export all slides from a carousel HTML as individual PNGs using Playwright
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/export-slides.sh <carousel-filename.html>"
  exit 1
fi

FILE="$1"
OUTPUT_DIR="exports/$(basename "$FILE" .html)"
mkdir -p "$OUTPUT_DIR"

echo "Exporting slides from $FILE to $OUTPUT_DIR..."
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });
  await page.goto('file://' + require('path').resolve('$FILE'));
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: '$OUTPUT_DIR/slide-' + String(i+1).padStart(2,'0') + '.png' });
    console.log('Exported slide ' + (i+1));
  }
  await browser.close();
})();
"

echo "Export complete: $OUTPUT_DIR"
