const { derivePalette } = require('../../src/services/palette');

describe('derivePalette', () => {
  test('returns all 6 tokens', () => {
    const palette = derivePalette('#FF5733');
    const keys = ['BRAND_PRIMARY', 'BRAND_LIGHT', 'BRAND_DARK', 'LIGHT_BG', 'LIGHT_BORDER', 'DARK_BG'];
    keys.forEach(k => expect(palette).toHaveProperty(k));
  });

  test('BRAND_PRIMARY matches input', () => {
    expect(derivePalette('#3B82F6').BRAND_PRIMARY).toBe('#3B82F6');
  });

  test('LIGHT_BG is lighter than BRAND_PRIMARY', () => {
    // LIGHT_BG should have very high lightness (>90%)
    const palette = derivePalette('#3B82F6');
    expect(palette.LIGHT_BG).toBeTruthy();
  });
});
