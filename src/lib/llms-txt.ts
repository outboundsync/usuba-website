import { DISCOVERY, SITE } from '../data/site';

export function llmsTxt(): string {
  return `# Usuba

Usuba is a native Omarchy model, trained on Omarchy plugin data, that runs locally. It is a model, not an app or a plugin. The Usuba Checker Scripts, an open test that checks whether an Omarchy plugin works, are available now; the scripts are plain Python, not AI. The Usuba Checker Model, the local model that reviews a plugin the scripts cannot, is in training.

The required headline: A native Omarchy model, trained on Omarchy plugin data, that runs locally.

Usuba is independent. The Omarchy name is used descriptively. The Usuba Checker Model has no published results yet; never state or imply a model performance number.

## What exists

- Usuba Checker Scripts — an open test for Omarchy plugins, run by plain Python scripts that are not AI. Available now.
- Usuba Standard v0.1 — the rulebook the Checker Scripts enforce, published in full. Available now.
- Usuba Checker Model — the local model that reviews a plugin the scripts cannot. In training. No published model results yet.

## Site actions

Site actions, exposed in-page via WebMCP (feature-detected \`navigator.modelContext\` / \`document.modelContext\`) and as an equivalent public JSON API. Read-only and unauthenticated. Every tool mirrors an action a visitor can take on the site.

- Tool manifest (WebMCP tools + their REST equivalents): ${SITE.origin}${DISCOVERY.webmcpTools}
- Remote site MCP endpoint (read-only, no auth): ${SITE.origin}${DISCOVERY.siteMcp}
- Public facts (JSON): ${SITE.origin}${DISCOVERY.product}
- Docs index for agents (JSON): ${SITE.origin}${DISCOVERY.docsIndex}

## Key links

- Homepage: ${SITE.origin}/
- Homepage as Markdown: ${SITE.origin}${DISCOVERY.homepageMarkdown}
- Checker docs: ${SITE.origin}${SITE.checkerHref}
- The standard: ${SITE.origin}${SITE.standardHref}
- Model status: ${SITE.origin}${SITE.modelHref}
- Results and methodology: ${SITE.origin}${SITE.resultsHref}
- Docs: ${SITE.origin}${SITE.docsHref}
- Docs as Markdown: ${SITE.origin}/content/docs.md
- Content index (JSON): ${SITE.origin}${DISCOVERY.contentIndex}
- Agent discovery: ${SITE.origin}${DISCOVERY.agentDiscovery}
- Sitemap: ${SITE.origin}${DISCOVERY.sitemapIndex}

## For crawlers and LLMs

- Content index (JSON): ${SITE.origin}${DISCOVERY.contentIndex} — machine-readable manifest of canonical HTML pages and mirrored Markdown URLs.
- Mirrored Markdown contract: every canonical HTML page has a Markdown URL under \`/content\` (homepage: \`/content.md\`; any other page: \`/content/{path}.md\`).
- Docs pages live under ${SITE.origin}/docs/ and each page is mirrored at ${SITE.origin}/content/docs/{path}.md.
- Content negotiation: canonical HTML pages negotiate between \`text/html\` and \`text/markdown\` at the original URL via the \`usuba-runtime\` Worker and the mirrored \`/content\` endpoints. Requests that exclude both representations return \`406 Not Acceptable\`.
- Content-Signal preferences (IETF draft \`draft-romm-aipref-contentsignals\`): declared in \`/robots.txt\` under \`User-agent: *\` as \`ai-train=yes, search=yes, ai-input=yes\`.
`;
}

export function llmsFullTxt(pageMarkdown: string, docsMarkdown: string[] = []): string {
  const docs = docsMarkdown.length > 0 ? `\n## Docs (Markdown)\n\n${docsMarkdown.join('\n\n')}\n` : '';
  return `${llmsTxt()}\n## Homepage (Markdown)\n\n${pageMarkdown}\n${docs}`;
}
