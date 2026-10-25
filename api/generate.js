const Anthropic = require('@anthropic-ai/sdk');
const { createGenerateHandler } = require('../src/server/generate-handler');

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


module.exports = createGenerateHandler({
  generate: async (topic, tone) => {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000, maxRetries: 0 });
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: 1800,
      system: SYSTEM_PROMPT, messages: [{ role: 'user', content: buildUserPrompt(topic, tone) }]
    });
    const raw = message.content?.find(x => x.type === 'text')?.text?.trim() || '';
    return JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  }
});
