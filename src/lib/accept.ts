export type Representation = 'html' | 'markdown' | 'none';

interface AcceptRange {
  type: string;
  subtype: string;
  q: number;
}

function parseAccept(header: string | null): AcceptRange[] {
  if (!header || header.trim() === '') {
    return [{ type: 'text', subtype: 'html', q: 1 }];
  }

  const ranges: AcceptRange[] = [];
  for (const part of header.split(',')) {
    const [rawType, ...params] = part.trim().split(';');
    const [type, subtype] = rawType.trim().toLowerCase().split('/');
    if (!type || !subtype) continue;
    let q = 1;
    for (const param of params) {
      const [rawKey, rawValue] = param.split('=');
      const key = rawKey?.trim();
      const value = rawValue?.trim();
      if (key === 'q' && value) {
        const parsed = Number.parseFloat(value);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }
    ranges.push({ type, subtype, q });
  }

  return ranges;
}

function specificity(range: AcceptRange, type: string, subtype: string): number | null {
  if (range.q <= 0) return null;
  if (range.type === type && range.subtype === subtype) return 2;
  if (range.type === type && range.subtype === '*') return 1;
  if (range.type === '*' && range.subtype === '*') return 0;
  return null;
}

interface Candidate {
  q: number;
  spec: number;
  index: number;
}

function bestMatch(ranges: AcceptRange[], type: string, subtype: string): Candidate | null {
  let best: Candidate | null = null;
  for (const [index, range] of ranges.entries()) {
    const spec = specificity(range, type, subtype);
    if (spec === null) continue;
    const next = { q: range.q, spec, index };
    if (
      !best ||
      next.q > best.q ||
      (next.q === best.q && (next.spec > best.spec || (next.spec === best.spec && next.index < best.index)))
    ) {
      best = next;
    }
  }
  return best;
}

export function preferredRepresentation(acceptHeader: string | null): Representation {
  const ranges = parseAccept(acceptHeader);
  if (ranges.length === 0) return 'html';

  const html = bestMatch(ranges, 'text', 'html');
  const markdown = bestMatch(ranges, 'text', 'markdown');
  if (!html && !markdown) return 'none';
  if (!html) return 'markdown';
  if (!markdown) return 'html';
  if (html.q !== markdown.q) return html.q > markdown.q ? 'html' : 'markdown';
  if (html.spec !== markdown.spec) return html.spec > markdown.spec ? 'html' : 'markdown';
  if (html.index !== markdown.index) return html.index < markdown.index ? 'html' : 'markdown';
  return 'html';
}

export function notAcceptableBody(markdownUrl: string | null): string {
  const lines = ['Not Acceptable', '', 'Available representations:', '- text/html'];
  if (markdownUrl) lines.push(`- text/markdown: ${markdownUrl}`);
  return `${lines.join('\n')}\n`;
}

export function markdownTokenCount(text: string): string {
  return String(Math.ceil(text.length / 4));
}

export function discoveryLinkHeader(markdownUrl: string | null): string {
  const parts = [
    '</content-index.json>; rel="describedby"',
    '</.well-known/agent-discovery.json>; rel="service-desc"; type="application/json"; title="Usuba agent discovery"',
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  ];
  if (markdownUrl) {
    parts.unshift(`<${markdownUrl}>; rel="alternate"; type="text/markdown"`);
  }
  return parts.join(', ');
}
