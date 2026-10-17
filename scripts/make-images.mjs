// Renders the social cards (1200x630: the site's og.png and the post's og-post.png) and the
// apple-touch-icon (180x180) from the Kawaii tokens and the build pack's mascot SVGs.
// The post card's numbers come from src/data/results.json, like every number on the site.
// Run after npm install: node scripts/make-images.mjs
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const template = (name) => `file://${path.join(root, 'scripts', name)}`;
const results = JSON.parse(await readFile(path.join(root, 'src', 'data', 'results.json'), 'utf8'));
const run2 = results.model.comparison.metrics.find((m) => m.label === 'Verdict accuracy' && m.exam === 'Dell 75');

const browser = await chromium.launch();

async function card(file, out, fill = {}) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(template(file));
  await page.evaluate((values) => {
    for (const [key, text] of Object.entries(values)) {
      for (const el of document.querySelectorAll(`[data-k="${key}"]`)) el.textContent = text;
    }
  }, fill);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public', out) });
  await page.close();
}

// ---- Open Graph cards ----
await card('og-template.html', 'og.png');
await card('og-post-template.html', 'og-post.png', {
  meta: 'Harris Kenny · October 17, 2026',
  title: 'How Usuba was built and tested',
  s1v: results.scripts.dell75.accuracy.value.toFixed(3),
  s1t: 'Checker Scripts on the Dell 75, no model',
  s2v: run2.run2.value.toFixed(2),
  s2t: `Usuba run 2, same exam (stock: ${run2.stock.value.toFixed(2)})`,
  s3v: results.sweep.total.toLocaleString('en-US'),
  s3t: `plugin runs on a ${results.hardware.name}`,
  url: 'usuba.dev/methodology',
  label: results.benchmark.preliminaryLabel,
});

// ---- Apple touch icon ----
const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
const favicon = await readFile(path.join(root, 'public', 'favicon.svg'), 'utf8');
await icon.setContent(
  `<body style="margin:0;background:transparent"><div style="width:180px;height:180px">${favicon.replace(
    '<svg ',
    '<svg width="180" height="180" ',
  )}</div></body>`,
);
await icon.screenshot({ path: path.join(root, 'public', 'apple-touch-icon.png'), omitBackground: true });
await icon.close();

await browser.close();
console.log('wrote public/og.png, public/og-post.png and public/apple-touch-icon.png');
