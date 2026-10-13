import { SITE_TOOLS, type SiteTool } from '../data/webmcp-tools';
import type { ModelContextTool } from '../types/webmcp';

function modelContext() {
  return navigator.modelContext ?? document.modelContext;
}

async function runTool(tool: SiteTool, input: Record<string, unknown>): Promise<unknown> {
  switch (tool.backing.kind) {
    case 'fetch': {
      const response = await fetch(tool.backing.path);
      if (!response.ok) throw new Error(`${tool.backing.path} failed (${response.status})`);
      const data: unknown = await response.json();
      if (tool.name === 'search_docs') {
        const query = String(input.query ?? '')
          .trim()
          .toLowerCase();
        const items = Array.isArray((data as { items?: unknown }).items)
          ? (data as { items: Array<{ title?: string; description?: string; url?: string }> }).items
          : [];
        if (!query) return { items: [] };
        return {
          items: items.filter((item) => `${item.title ?? ''} ${item.description ?? ''} ${item.url ?? ''}`.toLowerCase().includes(query)),
        };
      }
      return data;
    }
    case 'navigate':
      window.location.assign(tool.backing.url);
      return { url: tool.backing.url };
    default: {
      const exhaustive: never = tool.backing;
      throw new Error(`Unhandled backing: ${JSON.stringify(exhaustive)}`);
    }
  }
}

function register(tool: SiteTool): void {
  const context = modelContext();
  if (!context?.registerTool) return;

  const definition: ModelContextTool = {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: tool.inputSchema,
    annotations: {
      readOnlyHint: !tool.write,
    },
    execute: (input) => runTool(tool, input),
  };
  context.registerTool(definition);
}

export function mountWebmcp(): void {
  if (!modelContext()) return;
  for (const tool of SITE_TOOLS) register(tool);
}

mountWebmcp();
