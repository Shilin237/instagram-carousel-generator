# Security and privacy

The Anthropic key stays in the server environment. Only topic and tone are sent to the generation endpoint. Brand settings and downloaded exports remain in the browser. Google Fonts requests expose normal network metadata to Google; Anthropic receives the generation prompt. Export libraries are bundled from pinned npm dependencies rather than runtime CDNs.

The server validates topic length, tone and nested slide output before returning it. Browser rendering escapes text before interpolation. The script CSP permits self-hosted scripts without unsafe-inline or unsafe-eval; inline styles and Google Fonts are allowed. API errors return generic messages.

## Limits

The endpoint is public. CORS only controls browser access and does not authenticate callers. The in-memory fixed-window limiter permits ten requests per client per minute per process. It resets on process restart and is not shared across serverless instances. Forwarded IP headers are only meaningful behind a trusted hosting proxy. Use provider budget caps and shared limiting or authentication for a paid public deployment.

Tests use fake provider results and do not establish live model reliability, cross-browser support or external font availability. Generated text can be inaccurate. Review before publishing.

Never commit .env, private keys or access tokens. Report vulnerabilities privately to the repository owner through their GitHub profile; do not paste secrets in public issues.
