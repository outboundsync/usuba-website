# Usuba Kawaii design system

The visual target is `reference/homepage.html` and `reference/components.html`. This document explains the rules behind them so new pages stay consistent. Values live in `tokens.css`; this file never restates a value that a token already holds unless it's needed to explain a rule.

## The idea in one line

**Stickers on a bubblegum notebook.** Everything interactive or important is a flat pastel shape with a thick plum outline and a hard offset shadow, as if cut out and stuck onto a polka-dot page.

## Principles

1. **Cute surface, precise substance.** The look is playful; the words, numbers and docs are serious. Never make technical content or claims cutesy. Usuba is a model and a benchmark-backed test; the design has to read as trustworthy as well as friendly.
2. **One outline weight, one ink.** Outlines are always `--border` (3px plum). Text on light grounds is always ink or ink-soft. Pastels are fills, never text on light backgrounds.
3. **Shadows are hard, never blurred.** Offset shadows use the outline color with zero blur. No soft grey drop shadows, no glows, no gradients (the polka-dot ground is the only pattern).
4. **Round everything, but not equally.** Pills for buttons, 30px for cards, 28px for windows, circles for icon badges. Hierarchy comes from radius and size, not from extra decoration.
5. **The mascot carries the mood.** Use a mascot pose instead of an emoji, exclamation marks or decorative illustration. At most one mascot per viewport.
6. **One orchestrated motion moment per page.** The hero mascot hops in once on load. Everything else moves only in response to the user (button press, copy confirmation). Always respect `prefers-reduced-motion`.

## Color

| Token | Role |
|-------|------|
| `--color-bg` + `--color-bg-dot` | Page ground with 30px polka-dot grid |
| `--color-surface` | Cards, panels, callouts' default ground |
| `--color-ink` | Headings, body text, outlines, shadows |
| `--color-ink-soft` | Secondary text (ledes, card body, captions) |
| `--color-pink` | Brand accent: hover underlines, code prompts, chart fills |
| `--color-mint` | Action buttons, tips, success |
| `--color-butter` | Highlights, warnings, controls |
| `--color-steel` | Info buttons, the mascot blade |
| `--color-lilac` | Tertiary accent, icon badges only |
| `--color-on-accent` | Text and icons on any pastel fill |
| `--color-outline` | Outlines and hard shadows (separate token so dark mode can differ) |

### Checked contrast pairs (WCAG 2.x)

All pass AA for normal text. Don't introduce other text/background pairs without checking them.

| Text | Background | Ratio |
|------|------------|-------|
| ink #4a2a3f | bg #ffe1ec | 10.2 |
| ink #4a2a3f | surface #fffaf3 | 11.9 |
| ink #4a2a3f | pink #ff9cbf | 6.4 |
| ink #4a2a3f | steel #eef1f8 | 11.0 |
| ink #4a2a3f | mint #bdeed8 | 9.7 |
| ink #4a2a3f | butter #ffe69a | 10.1 |
| ink #4a2a3f | lilac #d9ccff | 8.3 |
| ink-soft #5e3a52 | bg #ffe1ec | 7.8 |
| ink-soft #5e3a52 | surface #fffaf3 | 9.2 |
| code text #fffaf3 | code bg #4a2a3f | 11.9 |
| pink #ff9cbf | code bg #4a2a3f | 6.4 |
| mint #bdeed8 | code bg #4a2a3f | 9.7 |
| butter #ffe69a (warn) | code bg #4a2a3f | 10.1 |
| hint #d9c4d1 | code bg #4a2a3f | 7.5 |
| dark: text #fdeef4 | dark bg #2a1b28 | 14.6 |
| dark: text #fdeef4 | dark surface #3b2638 | 12.3 |
| dark: ink-soft #e6c9d8 | dark surface #3b2638 | 9.0 |
| dark: on-accent #2a1b28 | pink #ff9cbf | 8.4 |
| dark: on-accent #2a1b28 | steel #eef1f8 | 14.4 |

### Dark mode (draft)

Tokens exist under `:root[data-theme="dark"]` and the gallery has a toggle. Known gaps before it can ship: the mascot's plum outlines are low-contrast on the dark ground (likely needs a light-outline variant of each pose, or a soft surface disc behind it), and the polka dots need tuning. Don't enable `prefers-color-scheme` switching until Harris approves.

## Typography

- **M PLUS Rounded 1c** for everything (display 800, body 500, emphasis 700). One family keeps it cohesive; weight does the hierarchy.
- **M PLUS 1 Code** for code. Its rounded terminals match the display face.
- Both are SIL Open Font License. Self-host them (Fontsource packages or downloaded WOFF2), Latin subset first, Japanese subset only on pages that need it. They are heavy fonts; subsetting matters.
- Sentence case everywhere. No all-caps labels, no eyebrow labels above headings, no italic.
- Headings are centered on marketing pages and left-aligned in docs. Body copy is left-aligned except short centered ledes under a centered heading.
- Keep body copy under `--measure` (30em).

## Components

All are demonstrated in `reference/components.html` with styles in `reference/site.css`.

**Buttons.** Pill, 3px outline, `--shadow-md`. Hover moves up-left 1px and grows the shadow by 1px. Active pushes 4px into the shadow (`--shadow-pressed`). The hierarchy is the point: **action** (mint) is a step the reader takes — "Try the Checker Scripts"; **info** (steel) is an FYI the reader can read on — "Read the Standard"; **control** (butter) is a UI control that is neither, like the nav menu toggle. One action button per view. Small size (48px tall) for nav and inside cards. Min touch target 48px. Label says exactly what happens; no trailing arrows.

**Sticker cards.** Surface fill, 3px outline, 30px radius, `--shadow-lg`. In a row, they tilt in the repeating cycle `--tilt-1/2/3`. Tilt is removed below 640px and on any card containing a form, table or code.

**Icon badges.** 68px circle, pastel fill cycling mint, butter, lilac, pink. Stroke icons at 34px in `--color-on-accent`. Use the icons in `assets/icons/` (stroke 2.2, round caps and joins). New icons must match that style; Lucide icons at stroke-width 2.2 are a close match.

**Code window.** Ink background with a pink hard shadow (the only non-ink shadow in the system) and a bar with three dots (pink, butter, mint). Add a copy button only when the content is meant to be copied (commands), not for sample output. Prompts in pink and not selectable. For Checker output: failures in `--color-code-fail` with ✗, warnings in `--color-code-warn` with ⚠, fix hints in `--color-code-hint`, passes in `--color-code-success`. The homepage sample is illustrative; docs show real output only.

**Status pill.** Butter sticker pill, slightly tilted, linking to what's available. One per page, in the hero.

**Badges.** Small outlined pills next to a heading that state availability: mint "Available now," butter "In training," lilac "Next." Every piece of Usuba that isn't shipped carries one. These are information, not decoration.

**Bar chart.** A sticker card containing rows of outlined pill bars, label left, value right. Caption says what's measured and out of how many; a note below gives context or marks results preliminary. Bar colors cycle mint, butter, lilac, pink for row distinction, and each bar has a text value, so color never carries meaning alone. Widths are proportional to the value over the total. Wraps to label-above-bar on narrow screens.

**Gain stickers.** Sticker cards with a large number, the model name, and a one-line detail. Only for measured results, always paired with a note saying how they were measured.

**Spec chips.** Surface pills with an outline and no shadow, for short factual specs (base model, hardware, data size).

**Roadmap.** Numbered sticker cards (it's a real sequence), each led by its status badge.

**CTA band.** A wide sticker card with the wave mascot and one button. One per page, at the end.

**Inline code.** Surface chip with 2px outline and 8px radius.

**Callouts (docs).** Tip = mint, warning = butter, each with a small mascot (default pose for tips, oops for warnings). Callout copy is plain and factual.

**Empty and error states.** Centered mascot (sleep for empty, oops for errors/404), a heading that says what happened, one sentence saying what to do, and one or two buttons.

**Header.** Logo mark + lowercase "usuba" wordmark left, nav right, the green action CTA last. On small screens it centers and wraps; the agent should replace the wrap with a compact menu if the nav grows past four items.

**Footer.** One sentence plus links. Minimal.

## Mascot

Working name **Usu-chan** (pending Harris's decision). A small rectangular usuba blade with a face, pink cheeks, a lilac ferrule and a wooden handle. Source of truth: `assets/_generate.py`; regenerate rather than hand-editing output SVGs.

| Pose | File | Use for |
|------|------|---------|
| hero | `usu-chan-hero.svg` | Homepage hero only (includes the "Let's cook!" bubble) |
| default | `usu-chan-default.svg` | General use, docs tips |
| wave | `usu-chan-wave.svg` | Closing CTA band, welcome, README |
| celebrate | `usu-chan-celebrate.svg` | A Checker run with no problems, release announcements |
| sleep | `usu-chan-sleep.svg` | Empty states |
| oops | `usu-chan-oops.svg` | 404, errors, warnings, failing Checker examples |

Rules: one mascot per viewport; never recolor, stretch, rotate past ±8°, or crop the handle; minimum width 72px (below that use `brand/logo-mark.svg`); always give it `alt=""` when decorative or a real description when it carries meaning.

The speech bubble text in the hero SVG uses the brand font, which only renders when the SVG is inlined in the page (an `<img>` SVG can't load web fonts). Inline the hero SVG.

## Layout

- Page container 1160px, narrow 920px (hero), code 820px. Gutter 28px.
- Section rhythm: 96px between sections, 44px between a section title and its content.
- Marketing pages are centered and generous. Docs pages use a conventional left sidebar + content layout; apply tokens to it rather than inventing a new docs layout.
- Must work from 320px wide up. Nothing scrolls sideways except code blocks inside their own container.
