# API Reference

## `derivePalette(primaryHex: string): BrandPalette`
Derives a 6-token palette from a single primary hex color.

**Input:** `#FF5733`
**Output:**
```json
{
  "BRAND_PRIMARY": "#FF5733",
  "BRAND_LIGHT": "#FF8A72",
  "BRAND_DARK": "#B32400",
  "LIGHT_BG": "#FFF8F7",
  "LIGHT_BORDER": "#FFD6CF",
  "DARK_BG": "#1A0800"
}
```

## `getFontPairing(style: string): { heading, body, weights }`
Returns font family names and weights for a given pairing style.

**Styles:** `editorial` | `modern` | `warm` | `technical` | `bold`

## `validateBrandInputs(inputs: BrandConfig): string[]`
Returns an array of validation error messages. Empty array = valid.
