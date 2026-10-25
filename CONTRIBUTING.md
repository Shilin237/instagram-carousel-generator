# Contributing

Work on a feature branch and follow GUARDRAILS.md. Use Node.js 22 or later, `npm ci`, `npm run build` and `npm run dev`. Keep keys in .env only.

Run `npm test` and `npm run test:e2e` after installing Chromium. Include checks and remaining manual validation in the PR. Browser tests should exercise the deployed public/ code and inspect real exports. Do not replace assertions with TODOs or use paid provider calls in CI.

Preserve the brand palette, 4:5 slide ratio, navigation bounds and final-slide CTA. Update HISTORY.md for behaviour changes. Review escaping at every HTML insertion point. public/vendor is generated and must not be committed.
