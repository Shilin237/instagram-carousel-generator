const { test } = require('node:test');
const assert = require('node:assert/strict');
const { derivePalette } = require('../../src/services/palette');
test('palette supports short and full hex without invalid CSS tokens', () => {
  for (const input of ['#F53', '#000000', '#ffffff', '#3B82F6']) {
    const palette = derivePalette(input);
    assert.equal(Object.keys(palette).length, 6);
    assert.equal(palette.BRAND_PRIMARY, input);
    for (const color of Object.values(palette)) assert.match(color, /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
  }
});
test('invalid colors are rejected before rendering', () => {
  for (const value of [null, {}, '#xyz', 'red;display:none']) assert.throws(() => derivePalette(value), TypeError);
});
