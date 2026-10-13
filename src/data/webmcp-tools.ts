import { DISCOVERY, SITE } from './site';

export type ToolBacking = { kind: 'fetch'; method: 'GET'; path: string } | { kind: 'navigate'; url: string };

export type SiteToolName = 'get_product' | 'search_docs' | 'find_the_checker';

export interface SiteTool {
  name: SiteToolName;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  backing: ToolBacking;
  inTabOnly?: boolean;
  write?: boolean;
}

// Every tool mirrors something a visitor can already do on the site. No fake JS tools.
export const SITE_TOOLS: SiteTool[] = [
  {
    name: 'get_product',
    title: 'Get the product',
    description:
      'Get the public Usuba facts: what Usuba is, the status of the Checker Scripts, the standard and the Checker Model, and the key links. No model performance numbers exist yet.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    backing: {
      kind: 'fetch',
      method: 'GET',
      path: DISCOVERY.product,
    },
  },
  {
    name: 'search_docs',
    title: 'Search the documentation',
    description:
      'Search the Usuba docs by keyword against the public docs index. Returns matching pages with their URLs and Markdown mirrors. Human search on /docs/ is Starlight Pagefind.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keywords.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
    backing: {
      kind: 'fetch',
      method: 'GET',
      path: DISCOVERY.docsIndex,
    },
  },
  {
    name: 'find_the_checker',
    title: 'Find the Checker Scripts',
    description: 'Get the URL for the Usuba Checker Scripts docs, the piece of Usuba that is available now.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    backing: {
      kind: 'navigate',
      url: SITE.checkerHref,
    },
    inTabOnly: true,
  },
];

export function webmcpToolsManifest() {
  return {
    schemaVersion: '1.0',
    name: 'Usuba site actions',
    description:
      'Agent-callable tools for the Usuba site, exposed in-page via WebMCP and as an equivalent public JSON API. Every tool mirrors an action a visitor can take on the site.',
    spec: 'https://github.com/webmachinelearning/webmcp',
    homepage: SITE.origin,
    tools: SITE_TOOLS,
  };
}

export function remoteSiteTools(): SiteTool[] {
  return SITE_TOOLS.filter((tool) => !tool.write && !tool.inTabOnly);
}

export function toolByName(name: string, remote: boolean): SiteTool | undefined {
  const tools = remote ? remoteSiteTools() : SITE_TOOLS;
  return tools.find((tool) => tool.name === name);
}
