const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGenerateHandler, createRateLimiter } = require('../../src/server/generate-handler');
const fixture = require('../fixtures/slides.json');
function response() {
  return { code: 200, headers: {}, setHeader(k,v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(value) { this.body = value; return this; }, end() {} };
}
const request = body => ({ method: 'POST', headers: {}, socket: { remoteAddress: 'test' }, body });
test('generation returns validated provider slides', async () => {
  let calls = 0;
  const handler = createGenerateHandler({ configured: () => true, generate: async (topic, tone) => { calls++; assert.equal(topic, 'Habits'); assert.equal(tone, 'professional'); return fixture; } });
  const res = response(); await handler(request({ topic: ' Habits ' }), res);
  assert.equal(res.code, 200); assert.equal(calls, 1); assert.deepEqual(res.body.slides, fixture.slides);
});
test('bad input and unsupported methods cannot call the provider', async () => {
  const handler = createGenerateHandler({ configured: () => true, generate: async () => { throw new Error('Must not call'); } });
  for (const body of [{}, { topic: {} }, { topic: 'x'.repeat(501) }, { topic: 'x', tone: 'unsupported' }]) {
    const res = response(); await handler(request(body), res); assert.equal(res.code, 400);
  }
  const res = response(); await handler({ ...request({}), method: 'GET' }, res); assert.equal(res.code, 405);
});
test('malformed nested model output is rejected and provider errors stay private', async () => {
  const invalid = structuredClone(fixture); invalid.slides[1].points = '<script>';
  for (const generate of [async () => invalid, async () => { throw new Error('private provider detail'); }]) {
    const handler = createGenerateHandler({ configured: () => true, generate });
    const res = response(); await handler(request({ topic: 'Habits' }), res); assert.equal(res.code, 502); assert.ok(!JSON.stringify(res.body).includes('private provider'));
  }
});
test('limiter blocks requests then recovers after its window', async () => {
  let time = 0; let calls = 0;
  const handler = createGenerateHandler({ configured: () => true, generate: async () => { calls++; return fixture; }, rateLimit: createRateLimiter({ limit: 1, windowMs: 1000, now: () => time }) });
  let res = response(); await handler(request({ topic: 'Habits' }), res); assert.equal(res.code, 200);
  res = response(); await handler(request({ topic: 'Habits' }), res); assert.equal(res.code, 429); assert.equal(calls, 1);
  time = 1001; res = response(); await handler(request({ topic: 'Habits' }), res); assert.equal(res.code, 200);
});
