/**
 * General-purpose helpers for carousel generation.
 */

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatHandle(handle) {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function progressPercent(slideIndex, totalSlides) {
  return Math.round((slideIndex / totalSlides) * 100);
}

module.exports = { slugify, formatHandle, clamp, progressPercent };
