import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { agentDiscovery, apiCatalog, mcpServerCard } from '../data/agent-discovery';
import { PRODUCT } from '../data/product';
import { DISCOVERY } from '../data/site';
import { webmcpToolsManifest } from '../data/webmcp-tools';
import { preferredRepresentation } from '../lib/accept';
import { buildContentIndex, emptyDocsIndex, type IndexedPage, indexedPage } from '../lib/content-index';
import { llmsFullTxt, llmsTxt } from '../lib/llms-txt';
import { htmlToMarkdown } from '../lib/raw-content';
import { handleRuntimeRequest } from '../lib/runtime';
import { htmlUrlFor, markdownUrlFor } from '../lib/urls';

const PASSTHROUGH = 'x-usuba-passthrough';

function isMarkdownAsset(pathname: string): boolean {
  return pathname === '/content.md' || pathname === '/content.md/' || (pathname.startsWith('/content/') && pathname.includes('.md'));
}

async function walkHtml(root: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_astro' || entry.name === 'assets' || entry.name === 'pagefind') continue;
      out.push(...(await walkHtml(full)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function pathnameFromFile(dist: string, file: string): string {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/')}`;
}

async function write(dist: string, filePath: string, body: string): Promise<void> {
  const dest = path.join(dist, filePath);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, body);
}

function discoveryFiles(
  docsIndex: ReturnType<typeof emptyDocsIndex>,
  homepageMarkdown: string,
  pages: IndexedPage[],
  docsMarkdown: string[] = [],
): Record<string, string> {
  return {
    [DISCOVERY.webmcpTools.replace(/^\//, '')]: `${JSON.stringify(webmcpToolsManifest(), null, 2)}\n`,
    [DISCOVERY.agentDiscovery.replace(/^\//, '')]: `${JSON.stringify(agentDiscovery(), null, 2)}\n`,
    [DISCOVERY.apiCatalog.replace(/^\//, '')]: `${JSON.stringify(apiCatalog(), null, 2)}\n`,
    [DISCOVERY.mcpServerCard.replace(/^\//, '')]: `${JSON.stringify(mcpServerCard(), null, 2)}\n`,
    [DISCOVERY.product.replace(/^\//, '')]: `${JSON.stringify(PRODUCT, null, 2)}\n`,
    [DISCOVERY.docsIndex.replace(/^\//, '')]: `${JSON.stringify(docsIndex, null, 2)}\n`,
    [DISCOVERY.contentIndex.replace(/^\//, '')]: `${JSON.stringify(buildContentIndex(pages), null, 2)}\n`,
    [DISCOVERY.llms.replace(/^\//, '')]: llmsTxt(),
    [DISCOVERY.llmsFull.replace(/^\//, '')]: llmsFullTxt(homepageMarkdown, docsMarkdown),
  };
}

async function generateFromDist(dist: string): Promise<void> {
  const files = await walkHtml(dist);
  const pages: IndexedPage[] = [];
  let homepageMarkdown = '';

  for (const file of files) {
    const pathname = pathnameFromFile(dist, file);
    const html = await readFile(file, 'utf8');
    const indexable = pathname !== '/404/' && !html.includes('name="robots" content="noindex"');
    if (!indexable) continue;
    const rendered = htmlToMarkdown(html);
    const markdownPath = markdownUrlFor(pathname);
    await write(dist, markdownPath.replace(/^\//, ''), rendered.markdown);
    pages.push(indexedPage(pathname, rendered.title, rendered.description, indexable));
    if (pathname === '/') homepageMarkdown = rendered.markdown;
  }

  const docs = pages.filter((page) => page.type === 'docs');
  const docsIndex = {
    items: docs.map(({ url, markdownUrl, title, description }) => ({ url, markdownUrl, title, description })),
  };
  const docsMarkdown: string[] = [];
  for (const page of docs) {
    const rel = new URL(page.markdownUrl).pathname.replace(/^\//, '');
    try {
      docsMarkdown.push(await readFile(path.join(dist, rel), 'utf8'));
    } catch {
      // Mirror missing for this page; llms-full still ships the rest.
    }
  }

  const generated = discoveryFiles(docsIndex, homepageMarkdown, pages, docsMarkdown);
  for (const [filePath, body] of Object.entries(generated)) {
    await write(dist, filePath, body);
  }
}

function memoryAssets(generated: Record<string, string>): (request: Request) => Promise<Response> {
  return async (request) => {
    const url = new URL(request.url);
    const file = url.pathname.replace(/^\//, '').replace(/\/$/, '');
    const body = generated[file] ?? generated[`${file}/index.html`];
    if (body === undefined) return new Response('Not found', { status: 404 });
    const type = file.endsWith('api-catalog')
      ? 'application/linkset+json'
      : file.endsWith('.json')
        ? 'application/json; charset=utf-8'
        : file.endsWith('.txt') || file.endsWith('.md')
          ? 'text/plain; charset=utf-8'
          : 'text/html; charset=utf-8';
    return new Response(body, { headers: { 'content-type': type } });
  };
}

function isAgentPath(pathname: string, accept: string | null): boolean {
  return (
    pathname.startsWith('/api/mcp') ||
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/content') ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/content-index.json' ||
    preferredRepresentation(accept) !== 'html'
  );
}

export function agentSurfaces(): AstroIntegration {
  return {
    name: 'usuba-agent-surfaces',
    hooks: {
      'astro:server:setup': ({ server }) => {
        const generated = discoveryFiles(emptyDocsIndex(), '', []);
        const fetchGenerated = memoryAssets(generated);
        server.middlewares.use((req, res, next) => {
          if (req.headers[PASSTHROUGH] === '1') {
            next();
            return;
          }

          const host = req.headers.host ?? 'localhost:4321';
          const url = new URL(req.url ?? '/', `http://${host}`);
          const accept = typeof req.headers.accept === 'string' ? req.headers.accept : null;
          if (!isAgentPath(url.pathname, accept)) {
            next();
            return;
          }

          const fetchAsset = async (assetRequest: Request): Promise<Response> => {
            const fromMemory = await fetchGenerated(assetRequest);
            if (fromMemory.ok) return fromMemory;

            const assetUrl = new URL(assetRequest.url);
            const htmlPath = isMarkdownAsset(assetUrl.pathname) ? htmlUrlFor(assetUrl.pathname) : assetUrl.pathname;
            const viteRes = await fetch(new URL(htmlPath, `http://${host}`), {
              headers: { [PASSTHROUGH]: '1', accept: 'text/html' },
            });
            if (!viteRes.ok) return fromMemory;
            if (!isMarkdownAsset(assetUrl.pathname)) return viteRes;

            const rendered = htmlToMarkdown(await viteRes.text());
            return new Response(rendered.markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
          };

          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk as Buffer));
          req.on('end', () => {
            const body = Buffer.concat(chunks);
            const request = new Request(url, {
              method: req.method,
              headers: req.headers as HeadersInit,
              body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
            });
            handleRuntimeRequest(request, { fetchAsset })
              .then(async (response) => {
                res.statusCode = response.status;
                response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                res.end(await response.text());
              })
              .catch(next);
          });
        });
      },
      'astro:build:done': async ({ dir }) => {
        await generateFromDist(fileURLToPath(dir));
      },
    },
  };
}
