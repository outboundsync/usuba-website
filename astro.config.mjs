// @ts-check

import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { DOCS_SIDEBAR, SITE } from './src/data/site.ts';
import { agentSurfaces } from './src/integrations/agent-surfaces.ts';

export default defineConfig({
  site: SITE.origin,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'Usuba Docs',
      description:
        'The Usuba Checker Scripts and the standard for a working Omarchy plugin. Usuba is a native Omarchy model, trained on Omarchy plugin data, that runs locally.',
      favicon: '/favicon.svg',
      disable404Route: true,
      lastUpdated: true,
      credits: false,
      pagefind: true,
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
      },
      customCss: [
        '@fontsource/m-plus-rounded-1c/latin-500.css',
        '@fontsource/m-plus-rounded-1c/latin-700.css',
        '@fontsource/m-plus-rounded-1c/latin-800.css',
        '@fontsource/m-plus-1-code/latin-500.css',
        './src/styles/tokens.css',
        './src/styles/global.css',
        './src/styles/charts.css',
        './src/styles/docs.css',
      ],
      components: {
        Head: './src/components/starlight/Head.astro',
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        PageFrame: './src/components/starlight/PageFrame.astro',
        Header: './src/components/starlight/Header.astro',
      },
      sidebar: DOCS_SIDEBAR,
      // Docs pages share the site's social card (public/og.png, from npm run make:images).
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#ffe1ec' } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE.origin}/og.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE.origin}/og.png` } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
    }),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/404' && path !== '/404/';
      },
    }),
    agentSurfaces(),
  ],
});
