# AGENTS.md: Usuba website build pack (Kawaii theme)

You are building the public website for **Usuba**: a native Omarchy model, trained on Omarchy plugin data, that runs locally. **Usuba is a model, not an app or plugin.** The model is in training; what ships first is the **Usuba Checker**, an open test that checks whether an Omarchy plugin works. This pack contains the approved visual direction, design tokens, mascot assets, copy and a static reference homepage. Your job is to turn it into a real, deployable site.

Read these in order before writing code:

1. `BRIEF.md`: what Usuba is, who the site is for, and the **open questions you must resolve with Harris before or during the build**.
2. `design/DESIGN_SYSTEM.md`: the rules of the theme. Treat it as the spec.
3. `design/tokens.css` (and `tokens.json`): the single source of truth for color, type, radius, borders, shadows, spacing and motion.
4. `reference/homepage.html` and `reference/components.html`: open them in a browser. They are the visual target. Match them; do not reinterpret them.
5. `content/copy.md`: all approved copy and microcopy. Use it verbatim unless Harris changes it.
6. `TASKS.md`: the build plan, phase by phase, with acceptance criteria.

## Ground rules

- **Do not invent product facts.** The Checker's install steps, command, rule ids and output, final benchmark numbers, model versions, licenses and URLs are unconfirmed (see `BRIEF.md` > Open questions). Keep them as clearly marked placeholders (`[TBD: ...]`) and list every placeholder in your final report.
- **Honesty rules are hard limits** (`BRIEF.md` > Tone and hard limits): no hype, never the word "bitter," never claim the model beats frontier models, never show or imply model performance numbers, always label preliminary numbers and in-progress pieces.
- **Tokens only.** No raw hex values, font names or shadow values in components. If you need a value that isn't a token, add it to `tokens.css` and `tokens.json` and note it.
- **Use the mascot SVGs as provided.** Don't redraw, restyle or add new poses without asking. If a page needs a pose that doesn't exist, use the closest one and note the gap.
- **Accessibility is a requirement, not polish.** Every color pairing in the system was checked against WCAG AA; don't introduce new pairings without checking them.
- **Cute surface, serious underneath.** The audience is Linux power users who will check every claim. Pages must be fast, keyboard-navigable, and every number must be traceable to the methodology page. Personality lives in the visuals, never in claims or technical content.
- **Ask before** choosing a hosting provider, a domain, analytics, or adding any third-party script.

## Final report

When you finish a phase, report: what was built, what deviates from the reference and why, every `[TBD]` placeholder still in the site, and anything in this pack you found ambiguous.
