const { test, expect } = require('@playwright/test');
const { readFile } = require('node:fs/promises');
const fixture = require('../fixtures/slides.json');

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('**/api/generate', route => route.fulfill({ json: fixture }));
  await page.goto('/');
  await page.locator('#brandName').fill('Test Studio');
  await page.locator('#igHandle').fill('@teststudio');
  await page.locator('#topic').fill('Build reliable habits');
  await page.getByRole('button', { name: 'Generate Carousel', exact: false }).click();
  await expect(page.locator('.ig-slide-wrap')).toHaveCount(7);
  await expect(page.locator('#generateBtn')).toBeEnabled();
});

test('actual slide export downloads a 1080 by 1350 PNG', async ({ page }) => {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Current Slide/ }).click();
  const file = await download;
  const bytes = await readFile(await file.path());
  expect(file.suggestedFilename()).toBe('slide-1.png');
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  expect(bytes.readUInt32BE(16)).toBe(1080);
  expect(bytes.readUInt32BE(20)).toBe(1350);
  if (process.env.UPDATE_SCREENSHOTS) await page.screenshot({ path: 'docs/screenshots/carousel.png' });
});

test('all slides export and the final slide stops navigation', async ({ page }) => {
  const downloads = [];
  page.on('download', file => downloads.push(file));
  await page.getByRole('button', { name: /All 7 Slides/ }).click();
  await expect(page.getByRole('status')).toContainText('All 7 slides exported', { timeout: 30000 });
  expect(downloads).toHaveLength(7);
  for (const [i, file] of downloads.entries()) expect(file.suggestedFilename()).toBe(`slide-${i + 1}.png`);
  for (let i = 0; i < 8; i++) await page.getByTitle('Next slide', { exact: true }).click();
  await expect(page.locator('#slideCounter')).toHaveText('7 / 7');
  const last = page.locator('.ig-slide-wrap').last();
  await expect(last).not.toContainText('Swipe');
});

test('PDF export contains seven pages', async ({ page }) => {
  const download = page.waitForEvent('download', { timeout: 30000 });
  await page.locator('#linkedinBtn').click();
  const file = await download;
  const contents = await readFile(await file.path(), 'latin1');
  expect(contents.startsWith('%PDF-')).toBe(true);
  expect((contents.match(/\/Type \/Page\b/g) || []).length).toBe(7);
});

test('provider failure remains clearly labelled as sample content', async ({ page }) => {
  await page.route('**/api/generate', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Unavailable' }) }));
  await page.getByRole('button', { name: /Generate Carousel/ }).click();
  await expect(page.getByRole('status')).toContainText('sample slides shown');
});
