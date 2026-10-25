const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isValidHex, isValidHandle, validateBrandInputs } = require('../../src/utils/validators');
test('missing and malformed inputs return validation errors without crashing', () => {
  assert.ok(validateBrandInputs().length > 0);
  for (const value of [undefined, null, {}, 42, 'a b', '<script>']) assert.equal(isValidHandle(value), false);
  for (const value of [undefined, null, {}, '#ggg']) assert.equal(isValidHex(value), false);
});
test('valid brand inputs are accepted', () => {
  assert.deepEqual(validateBrandInputs({ brandName: 'Acme', handle: '@acme', primaryColor: '#FF5733', fontStyle: 'modern', tone: 'professional' }), []);
});
