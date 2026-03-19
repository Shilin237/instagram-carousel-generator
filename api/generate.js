const Anthropic = require('@anthropic-ai/sdk');

/* ═══════════════════════════════════════════════
   RATE LIMITER
   In-memory per serverless instance. Good enough
   for personal/small-team use. For high-traffic
   production, replace with Upstash Redis:
   https://vercel.com/integrations/upstash
═══════════════════════════════════════════════ */
const rateLimitMap = new Map();
const RATE_LIMIT  = 10;           // max requests
const RATE_WINDOW = 60 * 1000;    // per 60 seconds

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leak in long-running instances
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_WINDOW) rateLimitMap.delete(ip);
  }
}, RATE_WINDOW);

/* ═══════════════════════════════════════════════
   INPUT VALIDATION
═══════════════════════════════════════════════ */
const VALID_TONES    = new Set(['professional', 'casual', 'playful', 'bold', 'minimal']);
const MAX_TOPIC_LEN  = 500;
const VALID_TYPES    = new Set(['hero', 'problem', 'solution', 'features', 'details', 'howto', 'cta']);

function validateSlides(slides) {
  if (!Array.isArray(slides) || slides.length < 5 || slides.length > 10) return false;
  return slides.every(s => s && VALID_TYPES.has(s.type));
}

/* ═══════════════════════════════════════════════
   PROMPTS
═══════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are a social media content expert specializing in Instagram carousel posts. Generate compelling, specific slide content based on the user's topic and tone. Always respond with valid JSON only — no markdown, no code blocks, no explanation. Every piece of text must be directly relevant to the topic provided.`;

function buildUserPrompt(topic, tone) {
  return `Create content for a 7-slide Instagram carousel.

Topic: "${topic}"
Tone: ${tone}

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "slides": [
    { "type": "hero", "tag": "2-3 WORD TAG", "headline": "Hook headline (max 50 chars)", "sub": "Swipe teaser (max 40 chars)" },
    { "type": "problem", "tag": "THE PROBLEM", "headline": "Pain point (max 45 chars)", "points": ["Point 1 (max 38 chars)", "Point 2", "Point 3"] },
    { "type": "solution", "tag": "THE SOLUTION", "headline": "Solution (max 45 chars)", "quote": "Insight (max 85 chars)" },
    { "type": "features", "tag": "BENEFIT TAG", "headline": "Benefits (max 45 chars)", "features": [
      { "icon": "✦", "label": "Benefit 1", "desc": "Description (max 35 chars)" },
      { "icon": "◈", "label": "Benefit 2", "desc": "Description (max 35 chars)" },
      { "icon": "◉", "label": "Benefit 3", "desc": "Description (max 35 chars)" },
      { "icon": "◆", "label": "Benefit 4", "desc": "Description (max 35 chars)" }
    ]},
    { "type": "details", "tag": "HOW IT WORKS", "headline": "Framework (max 45 chars)", "pills": ["Phase 1", "Phase 2", "Phase 3", "Phase 4"] },
    { "type": "howto", "tag": "YOUR ROADMAP", "headline": "Action headline (max 45 chars)", "steps": [
      { "n": "01", "title": "Step (max 22 chars)", "desc": "Description (max 48 chars)" },
      { "n": "02", "title": "Step (max 22 chars)", "desc": "Description (max 48 chars)" },
      { "n": "03", "title": "Step (max 22 chars)", "desc": "Description (max 48 chars)" }
    ]},
    { "type": "cta", "tag": "TAKE ACTION", "headline": "CTA line (max 45 chars)", "cta": "Button text (max 18 chars)" }
  ]
}

Make every word specific to "${topic}". Never use generic filler text.`;
}

/* ═══════════════════════════════════════════════
   HANDLER
═══════════════════════════════════════════════ */
module.exports = async (req, res) => {
  // ── CORS: restrict to own domain only ──
  // FIX #2: no more wildcard — only allow configured origin
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
  const requestOrigin = req.headers.origin;
  if (requestOrigin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // ── Security headers ──
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting (FIX #1) ──
  const ip = (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown'
  ).trim();

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  // ── Input validation (FIX #3) ──
  const body = req.body || {};

  // Sanitize and cap topic length
  const topic = String(body.topic || '').trim().slice(0, MAX_TOPIC_LEN);
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  // Whitelist tone — reject anything not in the allowed set
  const tone = VALID_TONES.has(body.tone) ? body.tone : 'professional';

  // ── Server config check (FIX #4: generic message, no internals) ──
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[generate] ANTHROPIC_API_KEY is not configured');
    return res.status(500).json({ error: 'Service is not configured. Contact the administrator.' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(topic, tone) }]
    });

    const raw     = message.content?.[0]?.text?.trim() || '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    // ── JSON parse with safe error (FIX #4, #9) ──
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[generate] JSON parse failed. Raw output (truncated):', cleaned.slice(0, 300));
      return res.status(500).json({ error: 'Failed to generate content. Please try again.' });
    }

    // ── Deep structure validation (FIX #9) ──
    if (!validateSlides(parsed?.slides)) {
      console.error('[generate] Invalid slide structure:', JSON.stringify(parsed).slice(0, 300));
      return res.status(500).json({ error: 'Failed to generate content. Please try again.' });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    // FIX #4: log detail server-side, return generic message to client
    console.error('[generate] Anthropic API error:', err.message);
    return res.status(500).json({ error: 'Failed to generate content. Please try again.' });
  }
};
