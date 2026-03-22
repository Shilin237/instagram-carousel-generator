const { isValidHex, isValidHandle, validateBrandInputs } = require('../../src/utils/validators');

describe('isValidHex', () => {
  test('valid 6-digit hex', () => expect(isValidHex('#FF5733')).toBe(true));
  test('valid 3-digit hex', () => expect(isValidHex('#F53')).toBe(true));
  test('invalid hex', () => expect(isValidHex('not-a-color')).toBe(false));
});

describe('isValidHandle', () => {
  test('valid handle without @', () => expect(isValidHandle('myBrand')).toBe(true));
  test('valid handle with @', () => expect(isValidHandle('@myBrand')).toBe(true));
  test('invalid handle with spaces', () => expect(isValidHandle('my brand')).toBe(false));
});

describe('validateBrandInputs', () => {
  test('valid inputs return no errors', () => {
    const errors = validateBrandInputs({
      brandName: 'Acme', handle: 'acme', primaryColor: '#FF5733',
      fontStyle: 'modern', tone: 'professional'
    });
    expect(errors).toHaveLength(0);
  });
});
