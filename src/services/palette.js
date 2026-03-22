/**
 * Palette Service
 * Derives the 6-token brand palette from a single primary hex color.
 */

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function derivePalette(primaryHex) {
  const [h, s, l] = hexToHsl(primaryHex);
  return {
    BRAND_PRIMARY: primaryHex,
    BRAND_LIGHT:   hslToHex(h, s, Math.min(l + 20, 95)),
    BRAND_DARK:    hslToHex(h, s, Math.max(l - 30, 5)),
    LIGHT_BG:      hslToHex(h, Math.max(s - 60, 5), 97),
    LIGHT_BORDER:  hslToHex(h, Math.max(s - 50, 5), 88),
    DARK_BG:       hslToHex(h, Math.min(s, 30), 8),
  };
}

module.exports = { derivePalette };
