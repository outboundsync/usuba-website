// Post-build gate for the Usuba site: agent surfaces, the acceptance criteria in
// TASKS.md, and the honesty rules in BRIEF.md > Tone and hard limits.
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { emptyDocsIndex } from '../src/lib/content-index.ts';
import { handleRuntimeRequest } from '../src/lib/runtime.ts';
import { handleSiteMcp } from '../src/lib/site-mcp.ts';

const dist = path.join(process.cwd(), 'dist');
const failures = [];

function fail(message) {
  failures.push(message);
}

async function read(rel) {
  return readFile(path.join(dist, rel), 'utf8');
}

async function mustExist(rel) {
  try {
    await access(path.join(dist, rel));
  } catch {
    fail(`missing built file: ${rel}`);
    return '';
  }
  return read(rel);
}

function rpc(method, params, id = 1) {
  return new Request('https://usuba.dev/api/mcp/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
}

async function walk(root) {
  const out = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

// ---- 1. Agent surfaces exist and parse ----
const jsonFiles = [
  'content-index.json',
  'llms.txt',
  'llms-full.txt',
  'robots.txt',
  'sitemap-index.xml',
  'content.md',
  '.well-known/agent-discovery.json',
  '.well-known/api-catalog',
  '.well-known/webmcp/tools.json',
  '.well-known/mcp/server-card.json',
  'data/product.json',
  'data/docs-index.json',
];
for (const file of jsonFiles) {
  const body = await mustExist(file);
  if (!body) continue;
  if (file.endsWith('.json') || file.endsWith('api-catalog')) {
    try {
      JSON.parse(body);
    } catch {
      fail(`not valid JSON: ${file}`);
    }
  }
}

const docsIndex = JSON.parse((await mustExist('data/docs-index.json')) || '{"items":[]}');
if (!docsIndex.items || docsIndex.items.length < 6) fail('docs index must list the shipped docs pages');
for (const item of docsIndex.items) {
  if (!item.markdownUrl?.startsWith('https://usuba.dev/content/docs')) {
    fail(`docs index item missing a Markdown mirror: ${item.url}`);
  } else {
    await mustExist(new URL(item.markdownUrl).pathname.replace(/^\//, ''));
  }
}

// ---- 2. Markdown mirrors ----
await mustExist('content.md');
await mustExist('content/docs.md');
await mustExist('content/docs/model.md');
const homepageMarkdown = await read('content.md');
if (!homepageMarkdown.startsWith('---')) fail('content.md must carry frontmatter');
if (!homepageMarkdown.includes('canonical: "https://usuba.dev/"')) fail('content.md must carry the canonical URL');

// ---- 3. Fonts are self-hosted (never Google Fonts) ----
const allFiles = await walk(dist);
const textFiles = allFiles.filter((file) => /\.(html|css|js|txt|xml|json)$/.test(file));
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
for (const file of textFiles) {
  const body = await readFile(file, 'utf8');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(body)) {
    fail(`remote Google Font is referenced in ${path.relative(dist, file)}`);
  }
}
const fontFiles = allFiles.filter((file) => /\.woff2?$/.test(file));
if (fontFiles.length < 4) fail(`expected self-hosted M PLUS Rounded 1c + M PLUS 1 Code woff2 files, found ${fontFiles.length}`);

// ---- 4. Homepage acceptance criteria ----
const homepage = await mustExist('index.html');
const homepageChecks = [
  ['class="skip-link"', 'homepage must include a skip link'],
  ['href="#main"', 'skip link must point at #main'],
  ['id="main"', 'homepage must expose id="main"'],
  ['The Usuba Checker Scripts are available now. The Usuba Checker Model is in training.', 'homepage must keep the hero status pill copy'],
  ["let's check!", 'homepage must inline the hero mascot so the bubble uses the brand font'],
  ['badge--now', 'homepage must show the Available now badge'],
  ['badge--training', 'homepage must show the In Training badge'],
  ['Usuba is a local model trained on, and built for, Omarchy.', 'homepage must keep the hero headline'],
  ['AI can struggle building Omarchy plugins', 'homepage must keep the problem heading'],
  ['Plugins passing checks, out of 49', 'homepage must keep the benchmark chart caption'],
  ['outcome-chart', 'homepage must render the outcome chart'],
  ['The Checker Scripts still make the call.', 'homepage must keep the model honest note'],
  ['In Training', 'homepage must label the model In Training'],
  ['href="/methodology/', 'homepage must link the methodology page'],
  ['data-copy-output', 'homepage must offer the code-window copy button'],
  ['Built for Omarchy plugin builders', 'homepage must keep the closing CTA band'],
  ['data-theme-switch', 'homepage must show the light / dark / system switcher'],
  ['usuba-theme', 'homepage must ship the pre-paint theme script'],
  ['Sponsored by OutboundSync', 'homepage must keep the sponsor line'],
  ['Created by Harris Kenny', 'homepage must keep the author line'],
  ['open source (MIT for the code, Apache-2.0 for the model weights)', 'homepage must state the licences'],
  ['Preliminary results, October 2026.', 'preliminary numbers must carry their label'],
  ['the trusty knife for the omakase chef', 'homepage must explain where the name comes from'],
  ['This website is hosted by Cloudflare', 'homepage must credit Cloudflare for hosting'],
  ['Hardware smoke testing was done on a Dell Latitude 7430 laptop', 'homepage must credit the smoke-test hardware'],
  ['Agent work on this project is managed using Fizzy', 'homepage must credit Fizzy'],
  ['brian_armstrong/status/2109412046244913643', 'homepage must link the Coinbase post that inspired the project'],
  ['not affiliated with, or endorsed by, the Omacom Foundation', 'homepage must state that Usuba is independent of the Omacom Foundation'],
  ['property="og:image" content="https://usuba.dev/og.png"', 'homepage must carry the social card'],
  ['summary_large_image', 'homepage must use the large social card'],
  ['btn--action', 'action buttons must use the green action style'],
  ['btn--info', 'FYI buttons must use the steel info style'],
];
for (const [needle, message] of homepageChecks) {
  if (!homepage.includes(needle)) fail(message);
}
if (homepage.includes('/assets/mascot/usu-chan-hero.svg')) {
  fail('the hero mascot must be inlined, not loaded as an <img>');
}
if (/btn--(?:primary|secondary|highlight)\b/.test(homepage)) {
  fail('buttons must use the action / info / control hierarchy, not the old variant names');
}
if (homepage.includes('starlight-theme-select')) fail('docs must keep the empty ThemeSelect override');

// ---- 4b. Methodology page: the long-form account of the work ----
const methodology = await mustExist('methodology/index.html');
const methodologyChecks = [
  ['How Usuba was built and tested', 'methodology page must keep its headline'],
  ['Preliminary results, October 2026.', 'methodology numbers must carry the preliminary label'],
  ['In Training', 'methodology page must label the model In Training'],
  ['The Checker Scripts still make the call.', 'methodology page must say who makes the call'],
  ['has not yet met', 'methodology page must say the model has not met its full-release targets'],
  ['Usuba run 1', 'the review screenshots must say they show run 1'],
  ['checker-review-3-verdict', 'methodology page must show the real review screenshots'],
  ['interval-board', 'methodology page must render the Dell 75 scoreboard'],
  ['paired-metrics', 'methodology page must render run 2 against its base'],
  ['content="https://usuba.dev/og-post.png"', 'the post must carry its own social card'],
  ['property="og:type" content="article"', 'the post must be marked as an article'],
];
for (const [needle, message] of methodologyChecks) {
  if (!methodology.includes(needle)) fail(message);
}
if ((methodology.match(/usu-chan-/g) ?? []).length > 3) fail('methodology page: mascots are for punctuation, keep to three at most');
const standard = await mustExist('docs/standard/index.html');
if (!standard.includes('Usuba Standard v0.2')) fail('the Standard page must name its version, v0.2');

// ---- 5. 404 ----
const notFound = await mustExist('404.html');
if (!notFound.includes('This page wandered off')) fail('404 must use the approved heading');
if (!notFound.includes('usu-chan-oops.svg')) fail('404 must use the oops pose');
if (!notFound.includes('Go home') || !notFound.includes('Try the Checker')) fail('404 must offer Go home and Try the Checker');
if (!notFound.includes('name="robots" content="noindex"')) fail('404 must be noindex');
if (notFound.includes('/content/docs/404')) fail('404 must not be mirrored as Markdown');

// ---- 6. Honesty rules (BRIEF.md > Tone and hard limits) ----
const corpus = (await Promise.all([...textFiles.map((file) => readFile(file, 'utf8'))])).join('\n');
const banned = [
  [/\bbitter\b/i, 'the word "bitter" must never appear'],
  [/\bbeats (?:the |all |every |frontier)/i, 'never claim the model beats frontier models'],
  [/\bstate-of-the-art\b/i, 'no hype adjectives'],
  [/\boutperform/i, 'never claim the model outperforms anything; show the measured numbers'],
  [/\bUsuba v2\b/, '"Run 2" is never "Usuba v2"; say "Usuba run 2"'],
  [/\b(?:Oct(?:ober)?\.? 19|2026-10-19)\b/, 'no release or announcement dates on the site'],
  [/no published model results/i, 'model results are published now; this line is stale'],
];
for (const [pattern, message] of banned) {
  if (pattern.test(corpus)) fail(message);
}
if (/the Usuba (?:app|plugin|tool)/i.test(corpus)) fail('Usuba is a model; never call it an app, plugin or tool');
if (/an AI checker/i.test(corpus)) fail('the Checker is an open test, not "an AI checker"');
// Naming contract (src/data/site.ts): never bare "the Checker", and the Builder
// Model is not on the site yet.
if (/\bthe Checker\b(?!\s*(?:Scripts|Model))/.test(corpus))
  fail('never use bare "the Checker"; say "the Checker Scripts" or "the Checker Model"');
if (/\bBuilder\b/.test(corpus)) fail('the Usuba Builder Model must not appear on the site yet');
if (/writes Omarchy plugins and reviews them/i.test(corpus)) fail('the Checker Model does not write plugins; keep the two jobs apart');
// Model numbers are allowed only with their label: every page that shows run 2's numbers carries the preliminary label.
for (const file of htmlFiles) {
  const body = await readFile(file, 'utf8');
  if (/Usuba run 2/.test(body) && /\b0\.\d{2,3}\b/.test(body) && !body.includes('Preliminary')) {
    fail(`${path.relative(dist, file)} shows model numbers without the preliminary label`);
  }
}

// ---- 7. Tokens only: no raw hex outside tokens.css ----
for (const file of await readdir(path.join(process.cwd(), 'src', 'styles'))) {
  if (file === 'tokens.css') continue;
  const body = await readFile(path.join(process.cwd(), 'src', 'styles', file), 'utf8');
  const hex = body.match(/#[0-9a-fA-F]{3,8}\b/g);
  if (hex) fail(`raw hex in src/styles/${file}: ${[...new Set(hex)].join(', ')} — use a token`);
}

// ---- 8. The runtime answers ----
const init = await handleSiteMcp(rpc('initialize', {}), { docsIndex });
if (init.status !== 200) fail('MCP initialize must answer 200');
const tools = await handleSiteMcp(rpc('tools/list', {}), { docsIndex });
const listed = JSON.parse(await tools.text()).result.tools.map((tool) => tool.name);
for (const name of ['get_product', 'search_docs']) {
  if (!listed.includes(name)) fail(`remote MCP is missing the ${name} tool`);
}

const runtime = await handleRuntimeRequest(new Request('https://usuba.dev/llms.txt'), {
  fetchAsset: async (request) =>
    new Response(await readFile(path.join(dist, new URL(request.url).pathname.replace(/^\//, ''))), { status: 200 }),
});
if (runtime.status !== 200) fail('/llms.txt must be served by the runtime');

const negotiate = await handleRuntimeRequest(new Request('https://usuba.dev/', { headers: { accept: 'text/markdown' } }), {
  fetchAsset: async (request) => {
    const rel = new URL(request.url).pathname.replace(/^\//, '') || 'index.html';
    try {
      return new Response(await readFile(path.join(dist, rel)), { status: 200 });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  },
});
if (negotiate.headers.get('content-type')?.includes('text/markdown') !== true) {
  fail('the homepage must negotiate text/markdown via Accept');
}
if (emptyDocsIndex().items.length !== 0) fail('emptyDocsIndex must start empty');

if (failures.length > 0) {
  for (const message of failures) console.error(`check-site: ${message}`);
  process.exit(1);
}
console.log('site surfaces ok');
