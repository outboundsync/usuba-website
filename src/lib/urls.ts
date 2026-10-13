export function markdownUrlFor(pathname: string): string {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (clean === '/' || clean === '') return '/content.md';
  const withoutSlash = clean.replace(/\/$/, '');
  return `/content${withoutSlash}.md`;
}

export function htmlUrlFor(markdownPath: string): string {
  const clean = markdownPath.replace(/\/$/, '');
  if (clean === '/content.md') return '/';
  if (clean.startsWith('/content/') && clean.endsWith('.md')) {
    return `${clean.slice('/content'.length, -'.md'.length)}/`;
  }
  return markdownPath;
}

export function isExtensionPath(pathname: string): boolean {
  const last = pathname.split('/').pop() ?? '';
  return last.includes('.') && !last.endsWith('.html');
}
