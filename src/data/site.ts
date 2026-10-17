// Single source for the strings and links the site has.
// Every unconfirmed value is marked [TBD] with the matching BRIEF.md open question; numbers live in results.json.
export const SITE = {
  name: 'Usuba',
  // Required headline (BRIEF.md > Required headline).
  title: 'Usuba: a native Omarchy model that runs locally',
  description:
    'Usuba is a small AI model trained on Omarchy plugin data that runs locally. The Usuba Checker Scripts are available now; the Usuba Checker Model is in training.',
  // Live on Cloudflare (the usuba-runtime Worker), apex plus a www redirect.
  origin: 'https://usuba.dev',
  // The site's own repo is private, so the header points at the org; the two public repos are below.
  githubHref: 'https://github.com/outboundsync',
  scriptsRepoHref: 'https://github.com/outboundsync/usuba-checker-scripts',
  modelsRepoHref: 'https://github.com/outboundsync/usuba-checker-models',
  adaptersHref: 'https://huggingface.co/osiharris/usuba-checker-adapters',
  datasetHref: 'https://huggingface.co/datasets/osiharris/usuba-checker-data',
  contactHref: 'mailto:harris@outboundsync.com',
  // Omarchy is named descriptively; Usuba claims no official status (BRIEF.md open question 8).
  omarchyHref: 'https://omarchy.org',
  checkerHref: '/docs/checker/install/',
  standardHref: '/docs/standard/',
  modelHref: '/docs/model/',
  resultsHref: '/docs/results/',
  methodologyHref: '/methodology/',
  docsHref: '/docs/',
  footerNote:
    'Usuba is open source (MIT for the code, Apache-2.0 for the model weights). Created by Harris Kenny. Sponsored by OutboundSync.',
} as const;

export const DISCOVERY = {
  contentIndex: '/content-index.json',
  agentDiscovery: '/.well-known/agent-discovery.json',
  apiCatalog: '/.well-known/api-catalog',
  webmcpTools: '/.well-known/webmcp/tools.json',
  mcpServerCard: '/.well-known/mcp/server-card.json',
  siteMcp: '/api/mcp/',
  llms: '/llms.txt',
  llmsFull: '/llms-full.txt',
  sitemapIndex: '/sitemap-index.xml',
  product: '/data/product.json',
  docsIndex: '/data/docs-index.json',
  homepageMarkdown: '/content.md',
} as const;

// The names, and what each one means. Use them exactly like this, always:
//   Usuba                  the whole project: the scripts and the model, together.
//   Usuba Checker Scripts  the tests. Plain Python, not AI. Available now. Short: "the scripts".
//   Usuba Checker Model    the reviewer. Small, local, In Training. Short: "the model". Latest run: "Usuba run 2"
//                          (never "Usuba v2", which was an older, superseded adapter).
//   Usuba Standard         the rulebook the scripts enforce, v0.2. Available now.
// The Usuba Builder Model (the writer) is coming later; it is not on the site yet.
// Never use bare "Checker": say "the Checker Scripts" or "the Checker Model".
export const NAV = [
  { label: 'How it’s built', href: SITE.methodologyHref },
  { label: 'Docs', href: SITE.docsHref },
  { label: 'Standard', href: SITE.standardHref },
  { label: 'GitHub', href: SITE.githubHref },
] as const;

// The docs sidebar (Starlight). It lives here beside the header nav so both menus
// are edited in one place; astro.config.mjs imports it.
export const DOCS_SIDEBAR = [
  { label: 'Start here', items: [{ label: 'What Usuba is', slug: 'docs' }] },
  {
    label: 'Usuba Checker Scripts',
    items: [
      { label: 'Install', slug: 'docs/checker/install' },
      { label: 'Run a check', slug: 'docs/checker/run-a-check' },
      { label: 'Reading results', slug: 'docs/checker/reading-results' },
    ],
  },
  { label: 'Usuba Standard', items: [{ label: 'Standard v0.2', slug: 'docs/standard' }] },
  {
    label: 'Usuba Checker Model',
    items: [
      { label: 'Model status', slug: 'docs/model' },
      { label: 'Results and methodology', slug: 'docs/results' },
    ],
  },
  { label: 'Contributing', items: [{ label: 'Contributing', slug: 'docs/contributing' }] },
];

export function navIsCurrent(href: string, pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const target = href.replace(/\/+$/, '') || '/';
  if (target === '/') return clean === '/';
  return clean === target || clean.startsWith(`${target}/`);
}
