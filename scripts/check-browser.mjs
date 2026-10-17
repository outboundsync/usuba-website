// Serves dist/ and inspects the built pages in Chromium: console errors, horizontal
// overflow at every target width, the skip link, and the code-window copy button.
// Screenshots land in tmp/ for eyeballing against reference/homepage.html.
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = path.join(root, 'dist');
const shots = path.join(root, 'tmp');
const widths = [1440, 1024, 768, 390, 320];
const failures = [];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [clean, `${clean.replace(/\/$/, '')}/index.html`, `${clean}.html`];
  for (const candidate of candidates) {
    const file = path.join(dist, candidate);
    if (!file.startsWith(dist)) continue;
    try {
      if ((await stat(file)).isFile()) return file;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const file = (await resolveFile(pathname)) ?? (await resolveFile('/404.html'));
  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found');
    return;
  }
  const missing = file.endsWith('404.html') && pathname !== '/404.html';
  response.writeHead(missing ? 404 : 200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(4322, '127.0.0.1', resolve));
await mkdir(shots, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext();
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4322' });
const pages = [
  { name: 'home', path: '/' },
  { name: 'docs', path: '/docs/' },
  { name: 'methodology', path: '/methodology/' },
  { name: 'model', path: '/docs/model/' },
  { name: '404', path: '/does-not-exist' },
];

for (const target of pages) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));

  const response = await page.goto(`http://127.0.0.1:4322${target.path}`, { waitUntil: 'load' });
  if (target.name !== '404') {
    if (response?.status() !== 200) failures.push(`${target.path} returned ${response?.status()}`);
    if (consoleErrors.length > 0) failures.push(`${target.path} logged console errors: ${consoleErrors.join(' | ')}`);
  } else if (!consoleErrors.every((message) => message.includes('404'))) {
    failures.push(`${target.path} logged unexpected console errors: ${consoleErrors.join(' | ')}`);
  }

  // Keyboard route in: the skip link must land on the main content.
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('href'));
  // Starlight ships its own skip link to #_top on docs pages; marketing pages use #main.
  const expectedFocus = target.name === 'docs' || target.name === 'model' ? '#_top' : '#main';
  if (focused !== expectedFocus) failures.push(`${target.path} first tab stop is ${focused}, expected ${expectedFocus}`);

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) failures.push(`${target.path} scrolls sideways by ${overflow}px at ${width}px`);
    if (target.name === 'home') {
      await page.screenshot({ path: path.join(shots, `home-${width}.png`), fullPage: false });
    }
    if (target.name === 'methodology') {
      await page.screenshot({ path: path.join(shots, `methodology-${width}.png`), fullPage: false });
    }
    if (target.name === 'docs' && width === 1440) {
      await page.screenshot({ path: path.join(shots, 'docs-1440.png'), fullPage: false });
    }
  }

  if (target.name === 'methodology') {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1200 });
      await page.screenshot({ path: path.join(shots, `methodology-full-${width}.png`), fullPage: true });
    }
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
    );
    if (broken.length) failures.push(`/methodology/ has images that did not load: ${broken.join(', ')}`);
  }

  if (target.name === 'home') {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.screenshot({ path: path.join(shots, 'home-full.png'), fullPage: true });

    // The compact nav only exists below 820px, where the reference's wrap would be noisy.
    await page.setViewportSize({ width: 390, height: 900 });
    const toggle = page.locator('[data-nav-toggle]');
    if (!(await toggle.isVisible())) failures.push('the compact nav toggle is not visible at 390px');
    const navHidden = await page.locator('[data-site-nav]').isHidden();
    if (!navHidden) failures.push('the full nav should be collapsed at 390px until the toggle is used');
    await toggle.click();
    await page.waitForTimeout(50);
    if (!(await page.locator('[data-site-nav]').isVisible())) failures.push('the compact nav did not open');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') failures.push('the compact nav did not report aria-expanded');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(50);
    if (!(await page.locator('[data-site-nav]').isHidden())) failures.push('the compact nav did not close on Escape');

    await page.setViewportSize({ width: 1440, height: 1200 });

    const copy = page.locator('[data-copy-output]').first();
    await copy.scrollIntoViewIfNeeded();
    await copy.click();
    const confirmed = await page
      .waitForFunction(() => document.querySelector('[data-copy-label]')?.textContent === 'Copied', null, { timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!confirmed) failures.push('the copy button did not confirm with "Copied"');

    const heroInline = await page.locator('svg.hero__mascot text').count();
    if (heroInline !== 1) failures.push('the hero mascot must be inlined so the bubble text renders in the brand font');

    const font = await page.evaluate(() => {
      const heading = document.querySelector('.hero h1');
      return heading ? getComputedStyle(heading).fontFamily : '';
    });
    if (!font.includes('M PLUS Rounded 1c')) failures.push(`the hero heading is not using the brand font: ${font}`);

    const headingCount = await page.locator('h1').count();
    if (headingCount !== 1) failures.push(`the homepage must have exactly one h1, found ${headingCount}`);
  }

  await page.close();
}

// ---- Theme switcher: light / dark / system ----
{
  const themeCtx = await browser.newContext({ colorScheme: 'dark' });
  const page = await themeCtx.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));

  await page.goto('http://127.0.0.1:4322/', { waitUntil: 'load' });

  const state = () =>
    page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      choice: document.documentElement.dataset.themeChoice,
    }));

  // Default is system: it follows the emulated dark OS.
  let now = await state();
  if (now.choice !== 'system') failures.push(`theme should default to system, got ${now.choice}`);
  if (now.theme !== 'dark') failures.push(`system theme should follow the dark OS, got ${now.theme}`);

  const switcher = page.locator('[data-theme-switch]');
  if (!(await switcher.isVisible())) failures.push('the theme switcher is not visible in the header');

  // Choosing Light wins over the dark OS and persists across reloads.
  await page.locator('[data-theme-option="light"]').click();
  await page.waitForTimeout(60);
  now = await state();
  if (now.theme !== 'light') failures.push(`choosing Light did not apply light, got ${now.theme}`);
  if ((await page.locator('[data-theme-option="light"]').getAttribute('aria-pressed')) !== 'true') {
    failures.push('the Light option did not report aria-pressed');
  }
  await page.screenshot({ path: path.join(shots, 'home-light.png') });
  await page.reload({ waitUntil: 'load' });
  now = await state();
  if (now.choice !== 'light' || now.theme !== 'light') failures.push('the Light choice did not persist across reload');

  // Back to system: follows the OS again, including a live change.
  await page.locator('[data-theme-option="system"]').click();
  await page.waitForTimeout(60);
  now = await state();
  if (now.theme !== 'dark') failures.push(`System did not return to the dark OS, got ${now.theme}`);
  await page.screenshot({ path: path.join(shots, 'home-dark.png') });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForTimeout(80);
  now = await state();
  if (now.theme !== 'light') failures.push(`System did not follow a live OS change, got ${now.theme}`);

  // The docs share the same switcher.
  await page.goto('http://127.0.0.1:4322/docs/', { waitUntil: 'load' });
  if (!(await page.locator('[data-theme-switch]').isVisible())) failures.push('the theme switcher is not visible on docs pages');

  // The switcher must not push the header sideways on narrow screens.
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) failures.push(`docs scrolls sideways by ${overflow}px at ${width}px with the switcher`);
  }

  if (errors.length > 0) failures.push(`theme pages logged console errors: ${errors.join(' | ')}`);
  await themeCtx.close();
}

await browser.close();
server.close();
if (failures.length > 0) {
  for (const message of failures) console.error(`check-browser: ${message}`);
  process.exit(1);
}
console.log(`browser checks ok — screenshots in ${path.relative(root, shots)}`);
