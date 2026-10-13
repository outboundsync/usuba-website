# Copy (v2: model + Checker)

Approved copy for the homepage, plus voice rules and microcopy. `[TBD]` items depend on open questions in `BRIEF.md`. The homepage reference (`reference/homepage.html`) uses exactly this copy.

## Names

| Use | Don't use |
|-----|-----------|
| **Usuba** (the project and the model) | "the Usuba app," "the Usuba plugin," "the Usuba tool" |
| **the Usuba model** | "Usuba AI," "our assistant" |
| **Usuba Checker**, "the Checker" (capital C) | "the checker tool," "Usuba Check" |
| **an open test** (what the Checker is) | "an AI checker" (the Checker is not a model) |
| **the standard**, "the Usuba standard" `[TBD: confirm name]` | "spec," "framework" |
| **Usuba Builder** (future) | Any promise of a date |
| **Omarchy** | "Omarchy Linux," "Omarchy OS" unless that's the project's own usage |

## Voice

- **Plain and honest. No hype.** Say what it does, what's done and what isn't.
- **Status is always visible.** Anything not available says so next to its name ("In training," "Next").
- **Numbers carry their context**: what was tested, out of how many, and whether results are preliminary.
- **The Checker helps models; it doesn't beat them.** Never position it against AI models.
- **Never claim the model beats frontier models. Never imply model performance numbers.**
- **Never use the word "bitter."**
- **Cute lives in the visuals.** The mascot, stickers and colors carry the warmth. Words stay plain. The hero bubble ("let's check!") is the one playful line.
- Sentence case everywhere. No emoji in copy. Errors explain and direct, without apologizing.
- Use the Omarchy name descriptively ("for Omarchy"). Don't imply official status unless Harris confirms it.

## Homepage

**Page title:** Usuba: a native Omarchy model that runs locally
**Meta description:** Usuba is a small AI model trained on Omarchy plugin data that runs locally. The model is in training; the Usuba Checker is available now.

**Nav:** Checker · Standard · Model · GitHub · [Try the Checker]

### 1. Hero

- **Mascot bubble:** let's check!
- **Status pill (links to Checker section):** The Usuba Checker is available now. Check it out, try it today.
- **H1:** A native Omarchy model, trained on Omarchy plugin data, that runs locally.
- **Lede:** Usuba is a small AI model made for one job: Omarchy plugins. It runs free on your own laptop. The model is still in training. Its first piece, the Usuba Checker, is ready now.
- **Buttons:** Try the Checker · Read the standard

### 2. Problem

- **H2:** AI is bad at Omarchy plugins
- **Lede:** We gave 49 real plugin requests to the top models and ran every answer in real Omarchy 4.0.4.
- **Chart caption:** Working plugins out of 49
  - Written by people: 27
  - GPT-5.6: 22 `[TBD: exact version + date]`
  - Claude Opus: about 20 `[TBD: exact count, version + date]`
  - Small local models: 3 to 4 `[TBD: which models]`
- **Chart note:** Same 49 requests and the same test for everyone, including the plugins people wrote. `[TBD: link to methodology]`
- **H3:** What goes wrong
  - **Made-up APIs.** Calls to functions and commands that Omarchy doesn't have.
  - **Fake data dressed up as real.** A Dropbox widget showing storage numbers with Dropbox not even installed.
  - **Panels that show nothing.** The plugin loads, and the panel is empty.
  - **X11-only tools.** Tools that don't exist on Omarchy, so the plugin can't run.

### 3. Usuba Checker

- **H2:** Usuba Checker `[badge: Available now]`
- **Lede:** An open test, not a model. It checks whether an Omarchy plugin actually works, and tells you how to fix it.
- **Cards:**
  - **Reads the code.** Flags invented APIs, missing helper scripts, made-up command flags and fake data.
  - **Runs it for real.** Loads the plugin in a real Omarchy shell and catches load errors and crashes.
  - **Explains every problem.** Each one comes with a rule id, a plain reason and a fix hint.
  - **Warns before it fails.** Risky commands a plugin may need are warnings. Only clearly destructive ones, like deleting your home folder, fail.
  - **Follows a public standard.** The rules are written up as an open standard for what a working Omarchy plugin is.
  - **Matches real hardware.** It agrees with a laptop running Omarchy on all 90 plugins in our answer key.
- **Sample output** `[TBD: replace with real command, rule ids and output]`:
  ```
  $ usuba check ./dropbox-widget
  ✗ fake-data   Shows storage numbers, but Dropbox isn't installed.
    fix: detect Dropbox first, and show an empty state without it.
  ✗ x11-only    Calls xdotool, which doesn't exist on Omarchy.
    fix: use hyprctl for window info instead.
  ⚠ risky-cmd   Deletes ~/.cache/dropbox-widget. Allowed; review it.

  2 problems, 1 warning
  ```
- **Note under sample:** Sample output. Command and rule ids shown for illustration. (Remove once real output replaces it.)

### 4. Proof

- **H2:** It makes every model better at Omarchy
- **Lede:** The Checker isn't competing with AI models. Give a model the Checker's feedback and one more try, and more of its plugins work.
- **Stickers:** +13 GPT-5.6 · +13 Claude Opus · +15 Claude Sonnet · +15 Kimi (a cheap open model, up from 3 on the first try). Each labeled "more working plugins."
- **Note:** Hand-checked results from the tests finished so far. Final numbers: `[TBD]`. When final numbers land, change to: "Hand-checked results, [date]. [Link: methodology]."

### 5. Model

- **H2:** The Usuba model `[badge: In training]`
- **Lede:** A local Omarchy model trained only on Omarchy plugins we've verified with the Checker and tested on real Omarchy hardware.
- **Spec chips:** Based on Qwen 3.5 9B · Runs on a typical 32 GB laptop · No graphics card needed · 1,400+ published plugins swept so far
- **Roadmap (numbered, it's a real sequence):**
  1. **Usuba Checker** `[Available now]`. The open test. Checks plugins with scripts and a real Omarchy shell.
  2. **Usuba model, checking** `[In training]`. Catches what scripts can't, like a panel that renders nothing or numbers that are obviously fake.
  3. **Usuba Builder** `[Next]`. Writes Omarchy plugins from scratch.
- **Closing line:** No model results yet. We'll publish them when they're in.

### 6. Who it's for (closing band, wave mascot)

- **H2:** Built for Omarchy plugin builders
- **Body:** And for anyone using AI to write Omarchy plugins. Check it out, try it today.
- **Button:** Try the Checker

### Footer

- Usuba is open source. Sponsored by Coinbase. `[TBD: Coinbase-approved credit wording; optionally "Inspired by Coinbase's work post-training Qwen3.5-9B" with a link]`
- Links: GitHub · Standard · Omarchy

## Microcopy

| Moment | Copy |
|--------|------|
| Copy button | Copy → Copied |
| 404 heading | This page wandered off |
| 404 body | The link may be old or mistyped. Try the Checker docs, or head back home. |
| 404 buttons | Go home · Checker docs |
| Model page, before results | No results yet. We'll publish them here when training finishes, with the test method and model versions. |
| Builder mentions | Next. Not started. (Never give a date unless Harris sets one.) |
| Preliminary-number label | Preliminary, hand-checked |
| Docs search, no results | Nothing matches "{query}". Try a shorter search, or browse the docs from the sidebar. |
| Skip link | Skip to content |

## GitHub README header (suggested)

Use `assets/mascot/usu-chan-wave.svg` centered above:

> **usuba**
> A native Omarchy model, trained on Omarchy plugin data, that runs locally. The model is in training; the Usuba Checker is available now.

## Terminal art (optional, for the Checker's output)

Only if Harris wants it. Keep it to one small block, suppressible (`--quiet`, and off automatically when stdout isn't a TTY or output is machine-readable):

```
      ╭──────────╮
 ▄▄▄▄▄┤  ●    ●  │
 ▀▀▀▀▀┤    ◡     │
      ╰──────────╯
```
Fallback without Unicode box drawing:
```
      +----------+
 =====|  o    o  |
 =====|    u     |
      +----------+
```
