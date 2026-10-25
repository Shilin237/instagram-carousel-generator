const { mkdirSync, copyFileSync } = require('node:fs');
const { join } = require('node:path');
const root = join(__dirname, '..');
mkdirSync(join(root, 'public/vendor'), { recursive: true });
for (const [source, target] of [
  ['html2canvas/dist/html2canvas.min.js', 'html2canvas.min.js'],
  ['html2canvas/LICENSE', 'html2canvas.LICENSE'],
  ['jspdf/dist/jspdf.umd.min.js', 'jspdf.umd.min.js'],
  ['jspdf/LICENSE', 'jspdf.LICENSE'],
]) copyFileSync(join(root, 'node_modules', source), join(root, 'public/vendor', target));
