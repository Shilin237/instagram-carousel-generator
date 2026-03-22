/**
 * Font Service
 * Returns Google Fonts import URL and CSS variables for a given pairing style.
 */

const FONT_PAIRINGS = {
  editorial:  { heading: 'Playfair Display', body: 'DM Sans',           weights: '700|400;500' },
  modern:     { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', weights: '700|400' },
  warm:       { heading: 'Lora',             body: 'Nunito Sans',        weights: '700|400;600' },
  technical:  { heading: 'Space Grotesk',    body: 'Space Grotesk',      weights: '700|400' },
  bold:       { heading: 'Fraunces',         body: 'Outfit',             weights: '700|400;500' },
};

function getFontPairing(style) {
  return FONT_PAIRINGS[style] || FONT_PAIRINGS.modern;
}

module.exports = { getFontPairing };
