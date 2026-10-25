const VALID_TONES = new Set(['professional', 'casual', 'playful', 'bold', 'minimal']);
const VALID_TYPES = new Set(['hero', 'problem', 'solution', 'features', 'details', 'howto', 'cta']);
const shortText = value => typeof value === 'string' && value.length <= 2000;

function validateSlides(slides) {
  if (!Array.isArray(slides) || slides.length < 5 || slides.length > 10) return false;
  return slides.every(slide => {
    if (!slide || !VALID_TYPES.has(slide.type) || !shortText(slide.headline) || !shortText(slide.tag)) return false;
    if (slide.type === 'hero') return shortText(slide.sub);
    if (slide.type === 'problem') return Array.isArray(slide.points) && slide.points.length <= 8 && slide.points.every(shortText);
    if (slide.type === 'solution') return shortText(slide.quote);
    if (slide.type === 'features') return Array.isArray(slide.features) && slide.features.length <= 8 && slide.features.every(x => x && shortText(x.icon) && shortText(x.label) && shortText(x.desc));
    if (slide.type === 'details') return Array.isArray(slide.pills) && slide.pills.length <= 8 && slide.pills.every(shortText);
    if (slide.type === 'howto') return Array.isArray(slide.steps) && slide.steps.length <= 8 && slide.steps.every(x => x && shortText(x.n) && shortText(x.title) && shortText(x.desc));
    return shortText(slide.cta);
  });
}

function createRateLimiter({ limit = 10, windowMs = 60000, now = Date.now } = {}) {
  const buckets = new Map();
  return key => {
    const time = now();
    for (const [id, entry] of buckets) if (entry.expires <= time) buckets.delete(id);
    const entry = buckets.get(key) || { count: 0, expires: time + windowMs };
    if (entry.count >= limit || (buckets.size >= 10000 && !buckets.has(key))) return false;
    entry.count += 1;
    buckets.set(key, entry);
    return true;
  };
}

function createGenerateHandler({ generate, configured = () => !!process.env.ANTHROPIC_API_KEY, rateLimit = createRateLimiter() }) {
  return async (req, res) => {
    const origin = process.env.ALLOWED_ORIGIN || 'http://localhost:3200';
    if (req.headers.origin === origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST, OPTIONS'); return res.status(405).json({ error: 'Method not allowed' }); }
    if (!rateLimit(req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown')) {
      res.setHeader('Retry-After', '60');
      return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
    }
    const { topic, tone = 'professional' } = req.body || {};
    if (typeof topic !== 'string' || !topic.trim() || topic.length > 500 || !VALID_TONES.has(tone)) return res.status(400).json({ error: 'Provide a topic of 1 to 500 characters and a supported tone.' });
    if (!configured()) return res.status(503).json({ error: 'AI generation is not configured.' });
    try {
      const result = await generate(topic.trim(), tone);
      if (!validateSlides(result?.slides)) return res.status(502).json({ error: 'The provider returned invalid slide content. Try again.' });
      return res.json({ slides: result.slides });
    } catch {
      return res.status(502).json({ error: 'Content generation failed. Try again.' });
    }
  };
}

module.exports = { createGenerateHandler, createRateLimiter, validateSlides };
