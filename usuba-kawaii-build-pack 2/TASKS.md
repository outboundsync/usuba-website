# Build plan

Work phase by phase. Stop at the end of each phase and report (see `AGENTS.md` > Final report).

## Phase 0: Confirm (with Harris, before code)

- [ ] Walk through `BRIEF.md` > Open questions. Record answers in `BRIEF.md`; leave unanswered items as `[TBD]`.
- [ ] Confirm stack (recommended: Astro + Starlight) and where the site's code lives (in the Usuba repo under `/website`, or its own repo).
- [ ] Confirm hosting target so the build output matches it. Don't set up deploys yet.

## Phase 1: Foundation

- [ ] Scaffold the project with the confirmed stack.
- [ ] Copy `design/tokens.css` in as the global token layer. Generate any framework config (e.g., Tailwind theme, Starlight custom CSS) from it, not by retyping values.
- [ ] Self-host M PLUS Rounded 1c (500, 700, 800) and M PLUS 1 Code (500) as WOFF2 with `font-display: swap`. Latin subset by default.
- [ ] Copy `assets/` in. Set `brand/favicon.svg` as the favicon, plus a 180px PNG apple-touch-icon rendered from it.
- [ ] Build the base layout: skip link, header, footer, polka-dot body, focus styles.

**Done when:** an empty page with header and footer matches the reference at 1440px and 390px, and passes keyboard navigation (tab order, visible focus, skip link works).

## Phase 2: Homepage

- [ ] Build the homepage to match `reference/homepage.html` exactly: same structure, copy, spacing and behavior.
- [ ] Inline the hero mascot SVG (so the bubble text uses the brand font).
- [ ] Components: Button, StatusPill, Badge (available now / in training / next), StickerCard, BarChart, GainSticker, SpecChip, Roadmap, CodeWindow, CtaBand, Logo.
- [ ] Drive the bar chart, gain stickers and roadmap from one data file (e.g., `src/data/results.json`) so final numbers are a one-place change, and so the Results page can reuse them.
- [ ] Every preliminary number renders with its "preliminary" note until the data file marks it final.
- [ ] Hop-in animation on the hero mascot only, disabled under `prefers-reduced-motion`.

**Done when:** side-by-side screenshots against the reference at 1440, 1024, 768, 390 and 320px show no meaningful differences; Lighthouse accessibility 100 and performance ≥ 95 on mobile; no horizontal page scroll at any width.

## Phase 3: Docs

- [ ] Docs shell (Starlight or equivalent) themed with the tokens: sidebar, content, search, prev/next, edit-on-GitHub link `[TBD: repo URL]`.
- [ ] Map docs elements to the system: inline code chip, code blocks styled like the code window (minus the window bar if it's noisy in long docs), tip/warning callouts with mascots.
- [ ] Starter pages with structure and `[TBD]` content only (don't write technical content you can't verify): Checker > Install, Checker > Run a check, Checker > Reading results, Standard > Overview, Standard > one page per rule id (reason, failing example, fix), Contributing.

**Done when:** a sample docs page with headings, lists, a table, inline code, a long code block and both callouts reads cleanly and passes the same accessibility checks.

## Phase 4: Supporting pages

- [ ] 404 page (oops pose; copy in `content/copy.md`).
- [ ] Model page: status-first. Badge, what it is, what it's trained on, the roadmap, and "No results yet." No numbers until Harris provides them.
- [ ] Results / methodology page: the 49-request benchmark and the Checker-feedback experiment, with model versions, test dates, Omarchy version, how "working" was judged, and how the 49 requests, the 90-plugin answer key and the 1,400+ sweep relate. Structure only until Harris supplies the details.
- [ ] Social preview image (1200×630): wave pose, wordmark, the H1, on the polka-dot ground. Export PNG; set Open Graph and Twitter meta.
- [ ] README header snippet for the GitHub repo (see `content/copy.md`).

## Phase 5: Polish and hand-off

- [ ] Verify every color pair in use is in the checked table in `DESIGN_SYSTEM.md`.
- [ ] Claims audit: search the built site for "bitter," "beats," "best," "app," "plugin" (used about Usuba itself) and any model performance figure. Confirm each number on the site matches the data file and is labeled correctly.
- [ ] Test with keyboard only and with a screen reader (Orca on Linux is fine) on the homepage and one docs page.
- [ ] Check total page weight; fonts are the likely culprit.
- [ ] Dark mode stays off unless Harris approved it in Phase 0.
- [ ] Final report with remaining `[TBD]`s and deployment steps for the chosen host.

## Out of scope unless asked

Analytics, newsletter signup, blog, i18n, CMS, any third-party embeds, community plugin gallery.
