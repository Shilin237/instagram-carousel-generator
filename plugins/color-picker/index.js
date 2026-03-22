/**
 * Color Picker Plugin
 * Provides a simple color picking utility for brand palette derivation.
 * Integrates with the derive-palette.js script.
 */

module.exports = {
  name: 'color-picker',
  version: '1.0.0',
  description: 'Pick and preview brand colors',
  activate(context) {
    context.registerCommand('pickColor', async (hex) => {
      const { execSync } = require('child_process');
      const result = execSync(`node skills/carousel-generator/scripts/derive-palette.js "${hex}"`);
      return JSON.parse(result.toString());
    });
  }
};
