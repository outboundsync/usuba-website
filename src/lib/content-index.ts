import { agentCapabilities } from '../data/agent-discovery';
import { SITE } from '../data/site';
import { markdownUrlFor } from './urls';

export interface IndexedPage {
  url: string;
  markdownUrl: string;
  title: string;
  description: string;
  type: 'marketing' | 'docs';
  sourceKind: 'rendered-html' | 'source-mdx';
  lastUpdated: string | null;
  indexable: boolean;
}

export interface ContentIndex {
  description: string;
  site: string;
  lastUpdated: string;
  agentCapabilities: ReturnType<typeof agentCapabilities>;
  pages: Array<Pick<IndexedPage, 'url' | 'markdownUrl' | 'title' | 'description' | 'type'>>;
  docs: Array<Pick<IndexedPage, 'url' | 'markdownUrl' | 'title' | 'description'>>;
  allPages: IndexedPage[];
}

export function pageTypeFor(pathname: string): IndexedPage['type'] {
  return pathname === '/docs' || pathname.startsWith('/docs/') ? 'docs' : 'marketing';
}

export function buildContentIndex(pages: IndexedPage[], now = new Date()): ContentIndex {
  const marketing = pages.filter((page) => page.type === 'marketing' && page.indexable);
  const docs = pages.filter((page) => page.type === 'docs');
  return {
    description: 'Machine-readable manifest of canonical Usuba pages, including mirrored Markdown URLs and agent capabilities.',
    site: SITE.origin,
    lastUpdated: now.toISOString(),
    agentCapabilities: agentCapabilities(),
    pages: marketing.map(({ url, markdownUrl, title, description, type }) => ({ url, markdownUrl, title, description, type })),
    docs: docs.map(({ url, markdownUrl, title, description }) => ({ url, markdownUrl, title, description })),
    allPages: pages,
  };
}

export function indexedPage(pathname: string, title: string, description: string, indexable: boolean): IndexedPage {
  const clean = pathname.endsWith('/') || pathname === '/' ? pathname : `${pathname}/`;
  const urlPath = clean === '/404/' ? '/404/' : clean;
  return {
    url: new URL(urlPath, SITE.origin).href,
    markdownUrl: new URL(markdownUrlFor(pathname), SITE.origin).href,
    title,
    description,
    type: pageTypeFor(pathname),
    sourceKind: 'rendered-html',
    lastUpdated: null,
    indexable,
  };
}

export function emptyDocsIndex() {
  return { items: [] as ContentIndex['docs'] };
}
