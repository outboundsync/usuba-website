# usuba-website

Public website for **Usuba** (`usuba.dev` — `[TBD]`): a native Omarchy model, trained on Omarchy plugin data, that runs
locally. **Usuba is a model, not an app or a plugin.** The **Usuba Checker Scripts**, an open test for Omarchy plugins, are
available now; the **Usuba Checker Model** is in training.

The approved design direction, tokens, mascot assets and copy live in [`usuba-kawaii-build-pack 2/`](usuba-kawaii-build-pack%202/)
(next to this file). Read `BRIEF.md`, `design/DESIGN_SYSTEM.md`, `content/copy.md` and `TASKS.md` there before changing
anything visual or any claim.

## Ground rules

- **Naming contract** (`src/data/site.ts`): Usuba (project) · Usuba Checker Scripts (the tests, now) · Usuba Checker Model
  (the reviewer, in training) · Usuba Standard v0.1 (the rulebook, now). Never bare "the Checker". The Usuba Builder Model
  (the writer) is coming later and is **not on the site**; `check:site` fails if "Builder" appears.
- **Do not invent product facts.** The Checker Scripts' install steps, command, rule ids and output, final benchmark numbers, model
  versions, licences and repo URL are unconfirmed (`BRIEF.md` > Open questions). Keep them as `[TBD: ...]`. `npm run
  check:site` fails the build on the honesty rules below, not on the placeholders — placeholders are expected until Harris
  clears them.
- **Honesty rules are hard limits.** No hype. Never the word "bitter." Never claim the model beats frontier models. Never
  state or imply model performance numbers. Always label preliminary numbers and in-progress pieces.
- **Tokens only.** No raw hex, font names or shadow values in components or stylesheets. `src/styles/tokens.css` is the
  source of truth (copied from the build pack); if you need a value that is not a token, add it there and to the build
  pack's `design/tokens.json`, and note it. `check:site` enforces this for `src/styles/`.
- **Use the mascot SVGs as provided.** Don't redraw, restyle or add poses. One mascot per viewport.
- **The hero mascot is inlined**, not an `<img>`, so the "let's check!" bubble renders in the brand font.
- **Accessibility is a requirement.** Every colour pairing in use is in the checked table in `DESIGN_SYSTEM.md`. Don't
  introduce new pairings without checking them.
- **Ask before** choosing a domain, a hosting provider, analytics, or adding any third-party script.

## Stack

Astro 7 (static output), npm, Node 22+, TypeScript strict, Biome (single quotes, semicolons, 140 cols). Plain CSS with
tokens in `src/styles/`. Fonts are self-hosted via `@fontsource` (M PLUS Rounded 1c, M PLUS 1 Code) — never Google Fonts.

- Marketing pages — `src/pages/**/*.astro`, shared layout `src/layouts/Base.astro`.
- Docs (Starlight) — `src/content/docs/**/*.mdx`; shell overrides in `src/components/starlight/`.
- Components — `src/components/**`; content data — `src/data/**` (results.json drives the two charts, gains and roadmap).
- Agent surfaces — `src/integrations/agent-surfaces.ts` (build-time) + `src/lib/runtime.ts` (Worker);

```
npm run dev           # http://localhost:4321
npm run build         # → dist/ (writes the Markdown mirrors and discovery files)
npx astro preview     # serve dist/
npm run check:types   # astro check
npm run check:site    # post-build gate: agent surfaces + TASKS.md acceptance + honesty rules
npm run check:browser # post-build gate: Chromium — console errors, sideways scroll, nav, copy button
npm run make:images   # re-render public/og.png + public/apple-touch-icon.png from the tokens
npm run lint          # biome check .
npm run ci            # lint + types + build + check:site + check:browser + wrangler dry-run
```

`check:browser` and `make:images` drive Playwright's Chromium: run `npx playwright install chromium`
once on a fresh machine. Both need a `dist/` from `npm run build`; never run a build and a check as
concurrent commands, because the checks would serve a half-written `dist/`.

Deploy: `usuba-runtime` (Cloudflare Worker) serves `dist/` and handles content negotiation, `/llms.txt`,
`/content*.md` mirrors and the read-only site MCP at `/api/mcp/`. Pushes to `main` deploy; never deploy from a branch.
