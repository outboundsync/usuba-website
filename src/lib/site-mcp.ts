import { PRODUCT } from '../data/product';
import { SITE } from '../data/site';
import { remoteSiteTools, type SiteTool, toolByName } from '../data/webmcp-tools';

type Json = Record<string, unknown>;

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Json;
}

interface DocsIndex {
  items: Array<{
    url: string;
    markdownUrl: string;
    title: string;
    description: string;
  }>;
}

export interface SiteMcpContext {
  docsIndex?: DocsIndex;
  loadDocsIndex?: () => Promise<DocsIndex | null>;
}

const PROTOCOL = '2025-06-18';
const MAX_BODY_BYTES = 64 * 1024;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id',
  'access-control-allow-methods': 'POST, OPTIONS',
} as const;

function isRecord(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function json(body: unknown, status = 200, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CORS,
      ...extra,
    },
  });
}

function ok(id: string | number | null | undefined, result: unknown): Response {
  return json({ jsonrpc: '2.0', id: id ?? null, result });
}

function fail(id: string | number | null | undefined, code: number, message: string): Response {
  return json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });
}

function text(body: string, status: number, extra?: HeadersInit): Response {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      ...CORS,
      ...extra,
    },
  });
}

function empty(status: number): Response {
  return new Response(null, { status, headers: { ...CORS } });
}

function toolResult(id: string | number | null | undefined, payload: unknown, isError = false): Response {
  return ok(id, {
    content: [{ type: 'text', text: typeof payload === 'string' ? payload : JSON.stringify(payload) }],
    isError,
  });
}

function listTools() {
  return remoteSiteTools().map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));
}

async function resolveDocsIndex(context: SiteMcpContext): Promise<DocsIndex | null> {
  if (context.docsIndex) return context.docsIndex;
  if (context.loadDocsIndex) return context.loadDocsIndex();
  return null;
}

async function callTool(tool: SiteTool, args: Json, context: SiteMcpContext): Promise<unknown> {
  switch (tool.name) {
    case 'get_product':
      return PRODUCT;
    case 'search_docs': {
      const docsIndex = await resolveDocsIndex(context);
      if (!docsIndex) {
        throw new Error('Docs index is unavailable.');
      }
      const query = String(args.query ?? '')
        .trim()
        .toLowerCase();
      const items = docsIndex.items.filter((item) => {
        if (!query) return false;
        return `${item.title} ${item.description} ${item.url}`.toLowerCase().includes(query);
      });
      return { items };
    }
    case 'find_the_checker':
      return { url: SITE.checkerHref };
    default: {
      const exhaustive: never = tool.name;
      throw new Error(`Unhandled tool: ${String(exhaustive)}`);
    }
  }
}

async function handleRpc(request: JsonRpcRequest, context: SiteMcpContext): Promise<Response | null> {
  const method = request.method ?? '';
  switch (method) {
    case 'initialize':
      return ok(request.id, {
        protocolVersion: PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: { name: 'Usuba site actions', version: '1.0.0' },
        instructions: `Read-only tools for the Usuba site: get the public Usuba facts and search the docs. The Usuba Checker Scripts are available now at ${SITE.origin}${SITE.checkerHref}. Usuba Standard v0.2, the rulebook the Checker Scripts enforce, is published at ${SITE.origin}${SITE.standardHref}. The Usuba Checker Model is In Training; its latest run (Usuba run 2) has preliminary, labelled results, and the full account of the method is at ${SITE.origin}${SITE.methodologyHref}. Human search on /docs/ is Starlight Pagefind.`,
      });
    case 'notifications/initialized':
      return empty(204);
    case 'ping':
      return ok(request.id, {});
    case 'tools/list':
      return ok(request.id, { tools: listTools() });
    case 'tools/call': {
      const name = String(request.params?.name ?? '');
      const args = (request.params?.arguments as Json | undefined) ?? {};
      const tool = toolByName(name, true);
      if (!tool) return fail(request.id, -32602, `Unknown or unavailable tool: ${name}`);
      try {
        return toolResult(request.id, await callTool(tool, args, context));
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Internal error';
        if (reason === 'Docs index is unavailable.') {
          return toolResult(request.id, reason, true);
        }
        return fail(request.id, -32603, reason);
      }
    }
    default:
      return fail(request.id, -32601, `Method not found: ${method}`);
  }
}

const METHOD_HINT = 'This is a JSON-RPC MCP endpoint. POST an MCP message here. See /.well-known/webmcp/tools.json.';

export async function handleSiteMcp(request: Request, context: SiteMcpContext): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return empty(204);
    }

    if (request.method !== 'POST') {
      return text(METHOD_HINT, 405, { allow: 'POST, OPTIONS' });
    }

    const declared = Number(request.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return text('Payload Too Large', 413);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return text('Payload Too Large', 413);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return fail(null, -32700, 'Parse error');
    }

    if (!isRecord(parsed)) {
      return fail(null, -32600, 'Invalid Request');
    }

    const rpcMessage = parsed as JsonRpcRequest;
    if (rpcMessage.jsonrpc !== '2.0' || typeof rpcMessage.method !== 'string' || rpcMessage.method.length === 0) {
      return fail('id' in rpcMessage ? (rpcMessage.id ?? null) : null, -32600, 'Invalid Request');
    }

    const isNotification = !('id' in rpcMessage);
    const response = (await handleRpc(rpcMessage, context)) ?? fail(rpcMessage.id ?? null, -32603, 'Internal error');
    if (isNotification) return empty(204);
    return response;
  } catch {
    return fail(null, -32603, 'Internal error');
  }
}
