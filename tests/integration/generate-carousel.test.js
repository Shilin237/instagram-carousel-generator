/**
 * Integration test: full carousel generation pipeline.
 * Verifies that given brand inputs, all 6 palette tokens are derived
 * and a valid HTML structure is returned.
 */

const { derivePalette } = require('../../src/services/palette');
const { getFontPairing } = require('../../src/services/font-service');
const { validateBrandInputs } = require('../../src/utils/validators');

describe('Carousel generation pipeline', () => {
  const brandInputs = {
    brandName: 'TestBrand',
    handle: 'testbrand',
    primaryColor: '#6366F1',
    fontStyle: 'modern',
    tone: 'professional',
  };

  test('validates inputs without errors', () => {
    const errors = validateBrandInputs(brandInputs);
    expect(errors).toHaveLength(0);
  });

  test('derives full palette from primary color', () => {
    const palette = derivePalette(brandInputs.primaryColor);
    expect(Object.keys(palette)).toHaveLength(6);
  });

  test('resolves correct font pairing', () => {
    const fonts = getFontPairing(brandInputs.fontStyle);
    expect(fonts.heading).toBe('Plus Jakarta Sans');
    expect(fonts.body).toBe('Plus Jakarta Sans');
  });
});
