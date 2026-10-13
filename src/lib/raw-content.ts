import TurndownService from 'turndown';

export interface RenderedMarkdown {
  title: string;
  description: string;
  canonical: string;
  markdown: string;
  body: string;
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndown.remove(['script', 'style', 'noscript', 'canvas']);
turndown.addRule('ariaHidden', {
  filter: (node) => typeof node.getAttribute === 'function' && node.getAttribute('aria-hidden') === 'true',
  replacement: () => '',
});

function canonicalHref(html: string): string {
  return (
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ??
    html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1] ??
    ''
  );
}

function meta(html: string, key: string, value: string): string {
  const pattern = new RegExp(`<meta[^>]+${key}="${value}"[^>]*>`, 'i');
  const tag = html.match(pattern)?.[0] ?? '';
  return tag.match(/content="([^"]*)"/i)?.[1] ?? '';
}

function strip(html: string, tag: string): string {
  return html.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '');
}

export function htmlToMarkdown(html: string): RenderedMarkdown {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
  const description = meta(html, 'name', 'description');
  const canonical = canonicalHref(html);

  let fragment = html;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1];
  if (main) {
    fragment = `${main}${footer ? `\n<footer>${footer}</footer>` : ''}`;
  } else {
    fragment = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  }

  fragment = strip(fragment, 'script');
  fragment = strip(fragment, 'style');
  fragment = fragment.replace(/<canvas\b[^>]*>[\s\S]*?<\/canvas>/gi, '');

  const body = turndown
    .turndown(fragment)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical: ${JSON.stringify(canonical)}`,
    'sourceKind: "rendered-html"',
    '---',
    '',
    body,
    '',
  ].join('\n');

  return { title, description, canonical, markdown: frontmatter, body };
}
