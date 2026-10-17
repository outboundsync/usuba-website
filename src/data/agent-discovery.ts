import { DISCOVERY, SITE } from './site';
import { SITE_TOOLS } from './webmcp-tools';

export function agentDiscovery() {
  return {
    schemaVersion: '1.0',
    name: SITE.name,
    description:
      'Usuba is a native Omarchy model, trained on Omarchy plugin data, that runs locally. The Usuba Checker Scripts, an open test for Omarchy plugins, and the Usuba Checker Model are both out now, as v0.1.0. Agents can read the public site and its mirrored Markdown.',
    homepage: SITE.origin,
    docs: {
      index: `${SITE.origin}${SITE.docsHref}`,
      checker: `${SITE.origin}${SITE.checkerHref}`,
      standard: `${SITE.origin}${SITE.standardHref}`,
      model: `${SITE.origin}${SITE.modelHref}`,
      results: `${SITE.origin}${SITE.resultsHref}`,
    },
    siteMcp: {
      endpoint: `${SITE.origin}${DISCOVERY.siteMcp}`,
      transport: 'streamable-http',
      requiresAuth: false,
      tools: DISCOVERY.webmcpTools,
    },
    routing: {
      checker: {
        action: 'Send people who want to try the Checker Scripts to the Checker Scripts docs.',
        url: `${SITE.origin}${SITE.checkerHref}`,
      },
      model: {
        action:
          'The Usuba Checker Model v0.1.0 is out, as an early, advisory release. Point people at the Get Usuba page for downloads and the model status page for results; every model number is preliminary and labelled.',
        url: `${SITE.origin}${SITE.modelHref}`,
      },
    },
  };
}

export function apiCatalog() {
  return {
    linkset: [
      {
        anchor: SITE.origin,
        'service-desc': [
          {
            href: `${SITE.origin}${DISCOVERY.webmcpTools}`,
            type: 'application/json',
          },
        ],
        'service-doc': [
          {
            href: `${SITE.origin}${SITE.docsHref}`,
            type: 'text/html',
          },
        ],
      },
      {
        anchor: `${SITE.origin}${DISCOVERY.siteMcp}`,
        'service-desc': [
          {
            href: `${SITE.origin}${DISCOVERY.webmcpTools}`,
            type: 'application/json',
          },
        ],
        'service-doc': [
          {
            href: SITE.origin,
            type: 'text/html',
          },
        ],
      },
    ],
  };
}

export function mcpServerCard() {
  return {
    serverInfo: {
      name: 'Usuba site actions',
      version: '1.0.0',
    },
    endpoint: `${SITE.origin}${DISCOVERY.siteMcp}`,
    transport: 'streamable-http',
    capabilities: {
      tools: {},
    },
  };
}

export function agentCapabilities() {
  return [
    {
      id: 'usuba-scripts',
      title: 'Usuba Checker Scripts',
      intentPhrases: ['Usuba Checker Scripts', 'check an Omarchy plugin', 'does this plugin work', 'Omarchy plugin test'],
      docs: {
        url: `${SITE.origin}${SITE.checkerHref}`,
      },
    },
    {
      id: 'usuba-standard',
      title: 'The Usuba standard',
      intentPhrases: ['the Usuba standard', 'what makes a working Omarchy plugin', 'Omarchy plugin rules'],
      docs: {
        url: `${SITE.origin}${SITE.standardHref}`,
      },
    },
    {
      id: 'usuba-checker-model',
      title: 'The Usuba Checker Model',
      intentPhrases: ['Usuba Checker Model', 'Usuba model', 'local Omarchy model', 'download Usuba model'],
      docs: {
        url: `${SITE.origin}${SITE.modelHref}`,
      },
    },
    {
      id: 'webmcp-site-actions',
      title: 'Usuba site actions (WebMCP + public JSON API)',
      intentPhrases: ['what can I do on this site', 'Usuba WebMCP tools', 'Usuba site actions'],
      webmcp: {
        spec: 'https://github.com/webmachinelearning/webmcp',
        inPage: 'Feature-detected navigator.modelContext / document.modelContext tools registered on every page.',
        toolsManifest: `${SITE.origin}${DISCOVERY.webmcpTools}`,
        remoteMcp: {
          endpoint: `${SITE.origin}${DISCOVERY.siteMcp}`,
          transport: 'streamable-http',
          requiresAuth: false,
        },
        tools: SITE_TOOLS.map((tool) => ({
          name: tool.name,
          description: tool.description,
          write: Boolean(tool.write),
        })),
      },
    },
  ];
}
