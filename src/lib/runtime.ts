import { DISCOVERY, SITE } from '../data/site';
import { discoveryLinkHeader, markdownTokenCount, notAcceptableBody, preferredRepresentation } from './accept';
import { handleSiteMcp, type SiteMcpContext } from './site-mcp';
import { isExtensionPath, markdownUrlFor } from './urls';

export interface RuntimeEnv {
  fetchAsset: (request: Request) => Promise<Response>;
}

const HSTS = 'max-age=31536000; includeSubDomains';
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

const SECURITY: Record<string, string> = {
  'content-security-policy': CSP,
  'permissions-policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
};

function appendVary(headers: Headers, value: string): void {
  const current = headers.get('vary');
  if (!current) {
    headers.set('vary', value);
    return;
  }
  const parts = current.split(',').map((part) => part.trim().toLowerCase());
  if (!parts.includes(value.toLowerCase())) headers.set('vary', `${current}, ${value}`);
}

function withHeaders(response: Response, extra: HeadersInit = {}, https = false): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  if (https && !headers.has('strict-transport-security')) {
    headers.set('strict-transport-security', HSTS);
  }
  for (const [key, value] of new Headers(extra).entries()) {
    if (key.toLowerCase() === 'vary') appendVary(headers, value);
    else headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function pathnameOf(url: URL): string {
  if (url.pathname === '' || url.pathname === '/') return '/';
  return url.pathname;
}

function isMcp(pathname: string): boolean {
  return pathname === '/api/mcp' || pathname === '/api/mcp/';
}

function isMarkdownPath(pathname: string): boolean {
  return pathname === '/content.md' || pathname === '/content.md/' || (pathname.startsWith('/content/') && pathname.includes('.md'));
}

function isHtmlPagePath(pathname: string): boolean {
  if (
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/pagefind/') ||
    pathname.startsWith('/content') ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap-index.xml' ||
    pathname === '/content-index.json' ||
    isExtensionPath(pathname)
  ) {
    return false;
  }
  return true;
}

function pageMarkdownUrl(pathname: string): string | null {
  if (!isHtmlPagePath(pathname)) return null;
  return markdownUrlFor(pathname);
}

function maybeHead(request: Request, response: Response): Response {
  if (request.method !== 'HEAD') return response;
  return new Response(null, { status: response.status, statusText: response.statusText, headers: response.headers });
}

async function markdownFor(url: URL, env: RuntimeEnv): Promise<Response | null> {
  const path = markdownUrlFor(pathnameOf(url));
  const asset = await env.fetchAsset(new Request(new URL(path, url.origin)));
  if (!asset.ok) return null;
  const text = await asset.text();
  return new Response(text, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600',
      'x-markdown-tokens': markdownTokenCount(text),
      'x-robots-tag': 'noindex, follow',
      vary: 'Accept',
      link: discoveryLinkHeader(path),
    },
  });
}

async function docsLoader(env: RuntimeEnv, origin: string): Promise<SiteMcpContext> {
  return {
    loadDocsIndex: async () => {
      const asset = await env.fetchAsset(new Request(new URL(DISCOVERY.docsIndex, origin)));
      if (!asset.ok) return null;
      return (await asset.json()) as { items: Array<{ url: string; markdownUrl: string; title: string; description: string }> };
    },
  };
}

export async function handleRuntimeRequest(request: Request, env: RuntimeEnv): Promise<Response> {
  const url = new URL(request.url);
  const pathname = pathnameOf(url);
  const https = url.protocol === 'https:';
  const secure = (response: Response, extra: HeadersInit = {}) => withHeaders(response, extra, https);

  if (isMcp(pathname)) {
    return secure(await handleSiteMcp(request, await docsLoader(env, url.origin)));
  }

  if (pathname === '/content.md/' || (pathname.endsWith('.md/') && pathname.startsWith('/content/'))) {
    return secure(Response.redirect(new URL(pathname.replace(/\/$/, ''), url.origin), 301));
  }

  if (isMarkdownPath(pathname)) {
    const asset = await env.fetchAsset(new Request(new URL(pathname.replace(/\/$/, ''), url.origin)));
    if (!asset.ok) return maybeHead(request, secure(asset));
    const text = await asset.text();
    return maybeHead(
      request,
      secure(
        new Response(text, {
          status: 200,
          headers: {
            'content-type': 'text/markdown; charset=utf-8',
            'cache-control': 'public, max-age=3600',
            'x-markdown-tokens': markdownTokenCount(text),
            'x-robots-tag': 'noindex, follow',
            vary: 'Accept',
            link: discoveryLinkHeader(pathname.replace(/\/$/, '')),
          },
        }),
      ),
    );
  }

  const negotiate = isHtmlPagePath(pathname);
  const markdownPath = pageMarkdownUrl(pathname);

  if (negotiate) {
    const representation = preferredRepresentation(request.headers.get('accept'));
    if (representation === 'none') {
      return maybeHead(
        request,
        secure(
          new Response(notAcceptableBody(markdownPath ? new URL(markdownPath, SITE.origin).href : null), {
            status: 406,
            headers: {
              'content-type': 'text/plain; charset=utf-8',
              vary: 'Accept',
              link: discoveryLinkHeader(markdownPath),
            },
          }),
        ),
      );
    }

    if (representation === 'markdown' && (request.method === 'GET' || request.method === 'HEAD') && markdownPath) {
      const markdown = await markdownFor(url, env);
      if (markdown) return maybeHead(request, secure(markdown));
    }
  }

  const asset = await env.fetchAsset(request);
  const extra: Record<string, string> = {};
  if (negotiate) {
    extra.vary = 'Accept';
    extra.link = discoveryLinkHeader(markdownPath);
  }
  return maybeHead(request, secure(asset, extra));
}
