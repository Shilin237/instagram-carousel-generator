/**
 * Input validators for brand details.
 */

function isValidHex(hex) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

function isValidHandle(handle) {
  // Strip leading @ if present, then validate
  const clean = handle.startsWith('@') ? handle.slice(1) : handle;
  return /^[a-zA-Z0-9._]{1,30}$/.test(clean);
}

function validateBrandInputs({ brandName, handle, primaryColor, fontStyle, tone }) {
  const errors = [];
  if (!brandName || brandName.trim().length < 1) errors.push('Brand name is required');
  if (!isValidHandle(handle)) errors.push('Invalid Instagram handle');
  if (!isValidHex(primaryColor)) errors.push('Primary color must be a valid hex (e.g. #FF5733)');
  const validFonts = ['editorial', 'modern', 'warm', 'technical', 'bold'];
  if (!validFonts.includes(fontStyle)) errors.push(`Font style must be one of: ${validFonts.join(', ')}`);
  const validTones = ['professional', 'casual', 'playful', 'bold', 'minimal'];
  if (!validTones.includes(tone)) errors.push(`Tone must be one of: ${validTones.join(', ')}`);
  return errors;
}

module.exports = { isValidHex, isValidHandle, validateBrandInputs };
