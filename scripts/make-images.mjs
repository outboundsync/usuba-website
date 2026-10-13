// Renders the social preview (1200x630) and the apple-touch-icon (180x180) from
// the Kawaii tokens and the build pack's mascot SVGs.
// Run after npm install: node scripts/make-images.mjs
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const template = `file://${path.join(root, 'scripts', 'og-template.html')}`;

const browser = await chromium.launch();

// ---- Open Graph card ----
const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await og.goto(template);
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: path.join(root, 'public', 'og.png') });
await og.close();

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
console.log('wrote public/og.png and public/apple-touch-icon.png');
