# Usuba Kawaii build pack

Everything a coding agent (Claude Code, Cursor, etc.) needs to build the Usuba website in the approved Kawaii style.

**v2 positioning:** Usuba is a native Omarchy model, trained on Omarchy plugin data, that runs locally. The model is in training; the site launches around the Usuba Checker, an open test for Omarchy plugins that's available now.

## How to use it

1. Unzip into the repo where the site will live (e.g., `usuba/website/` or a new repo).
2. Open `reference/homepage.html` and `reference/components.html` in a browser to see the target.
3. Point your agent at `AGENTS.md` and tell it to start with Phase 0 in `TASKS.md`. It will ask you the open questions first.

## What's inside

```
AGENTS.md              Agent instructions and ground rules (start here)
BRIEF.md               Product brief, audience, open questions, stack recommendation
TASKS.md               Phased build plan with acceptance criteria
design/
  DESIGN_SYSTEM.md     Rules, components, mascot usage, checked contrast pairs
  tokens.css           Design tokens (source of truth), incl. draft dark mode
  tokens.json          Same tokens as JSON
content/
  copy.md              Approved copy, voice rules, microcopy, terminal art
assets/
  mascot/              6 mascot poses (hero, default, wave, celebrate, sleep, oops)
  brand/               Logo mark, lockup, favicon, sparkle
  icons/               Stroke icons (seedling, heart, gift, github, terminal, book, copy, check)
  _generate.py         Regenerates all SVGs from one source
reference/
  homepage.html        Static homepage (v2 copy), the visual target
  components.html      Component gallery with a dark-mode preview toggle
  site.css             Reference component styles
```

## Before your agent starts, decide

The agent will ask these, but having answers ready saves a round trip:

1. Final proof numbers, exact model versions and test dates
2. How people install and run the Checker, with real rule ids and output
3. Where the standard lives and what it's called
4. How the 49 requests, the 90-plugin answer key and the 1,400+ plugin sweep relate (for a methodology page)
5. Coinbase-approved sponsor and inspiration wording
6. Relationship to Omarchy / Omacom
7. Licenses, repo URL, where model weights will be published, domain and hosting

The reference pages load fonts from Google Fonts for convenience; the real site should self-host them (covered in `TASKS.md`).
