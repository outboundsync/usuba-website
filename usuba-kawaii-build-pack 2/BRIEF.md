# Brief (v2: model + Checker)

## What Usuba is

**Usuba is a model, not an app, plugin or CLI tool.** The project's goal is to make AI good at building plugins for Omarchy, DHH's Linux setup: a small model that runs locally on your own laptop for free, trained only on Omarchy plugin data.

The first thing shipping is the **Usuba Checker**, an open test (not a model) that checks whether an Omarchy plugin actually works and says how to fix it. The model itself is in training.

Owner: Harris Kenny. Name: Usuba (薄刃, "thin blade," the Japanese vegetable knife).

### Required headline

> A native Omarchy model, trained on Omarchy plugin data, that runs locally.

The Checker's call to action uses **"Check it out, try it today."**

### What exists, and what doesn't yet

| Piece | What it is | Status |
|-------|-----------|--------|
| Usuba Checker | Open test for Omarchy plugins: static code checks plus loading in a real Omarchy shell | **Available now** |
| Usuba standard | The Checker's rules, written up as a public standard for what a working Omarchy plugin is | Available now |
| Usuba model (checking) | Local model based on Qwen 3.5 9B. First job: catching problems scripts can't | **In training, no results yet** |
| Usuba Builder | The model writing plugins from scratch | **Next, not started on the site** |

## The problem (benchmark facts)

- 49 real plugin requests, given to top models. Every answer was run in real Omarchy 4.0.4.
- Working plugins out of 49: GPT-5.6 **22**, Opus **about 20**, plugins written by people **27** (same test), small open models that run locally **3 to 4**.
- Common failures: made-up APIs; fake data dressed up as real (a Dropbox widget showing storage with Dropbox not installed); panels that show nothing; X11-only tools that don't exist on Omarchy.

## Usuba Checker (facts)

- Reads the plugin's code and flags invented APIs, missing helper scripts, made-up command flags and fake data.
- Loads the plugin in a real Omarchy shell and catches load errors and crashes.
- Every problem comes with a rule id, a plain reason and a fix hint.
- Risky commands a plugin may legitimately need are warnings, not failures. Only clearly destructive ones (e.g., deleting your home folder) fail outright.
- The rules are written up as a public standard.
- It agrees with real hardware (a laptop running Omarchy) on all 90 plugins in the answer key.

## Proof: the Checker makes other models better (preliminary)

With the Checker's feedback and another try, working plugins go up. Hand-checked, on the tests finished so far: GPT **+13**, Opus **+13**, Sonnet **+15**, Kimi (a cheap open model) **+15** on top of 3 first-try successes. **These are preliminary; final numbers were due the day of the debrief. Replace before launch.**

## Usuba model (facts)

- Based on Qwen 3.5 9B, sized for a typical 32 GB laptop with no dedicated graphics.
- Trained on Omarchy plugins verified with the Checker and tested on real Omarchy hardware, from a sweep of more than 1,400 published plugins so far.
- First job is checking: catching what scripts can't, like a panel that renders nothing or numbers that are obviously fake.
- Building plugins from scratch (Usuba Builder) comes after.
- **No performance numbers exist yet. Don't imply any.**

## Context

- Inspired by Coinbase's work post-training Qwen3.5-9B on their own data to beat frontier models at a specialized task. **Coinbase is a sponsor.**
- Long term, Usuba probably belongs as an Omacom project; maintaining the Checker and building a builder-grade model is ongoing work. **Internal context only; don't put this on the site until it's agreed.**

## Audience

Omarchy plugin builders, and anyone using AI to write Omarchy plugins. Assume they're terminal-comfortable Linux users who will check claims. Credibility comes from showing the method, not from adjectives.

## Tone and hard limits

- Plain and honest. No hype.
- Never use the word "bitter."
- Never claim the Usuba model beats frontier models. Never state or imply model performance numbers.
- Never call Usuba an app, plugin or tool. The model is a model; the Checker is "an open test."
- The Checker complements AI models; don't frame it as competing with them.
- Mark preliminary numbers as preliminary wherever they appear.

## Open questions (resolve with Harris before launch)

| # | Question | Why it matters |
|---|----------|----------------|
| 1 | Final numbers for the proof section. Are gains measured on the same 49 requests? What were Sonnet's and Opus's exact first-try counts? | Current figures are preliminary; "about 20" can't ship on a results page |
| 2 | Exact model versions and test dates (GPT-5.6, which Opus, which Sonnet, which Kimi, which small open models) | Benchmarks without versions and dates get dismissed, and go stale fast |
| 3 | How people run the Checker: install, command, real rule ids, real sample output. Does it need Omarchy installed locally to do the shell test? | The homepage sample output is illustrative and must be replaced |
| 4 | Where the public standard lives and what it's called | It's a primary nav item and CTA |
| 5 | How the 49 requests, the 90-plugin answer key and the 1,400+ sweep relate | Three different numbers will confuse readers without a methodology page |
| 6 | Where the 27 human-written plugins came from | A 27/49 human score invites "is the test too strict?" One sentence of context prevents that |
| 7 | Coinbase: approved credit wording, logo use, and a link to their Qwen post-training write-up | Sponsor and inspiration claims need their sign-off |
| 8 | Relationship to Omarchy / Omacom | Until agreed, describe Usuba as independent and use the Omarchy name only descriptively |
| 9 | Licenses (Checker, standard, model weights), repo URL, and where weights will be published | Footer, docs and model page all depend on it |
| 10 | Domain and hosting; mascot name (working name "Usu-chan"); dark mode at launch or later | Carried over from v1 |

## Site map (launch)

1. **Home** (reference: `reference/homepage.html`)
2. **Checker**: what it checks, how to run it, reading results, rule ids. Docs.
3. **Standard**: the rules, one entry per rule id (reason, example, fix).
4. **Model**: status page. What it is, what it's trained on, what it will do, current status. Updated as training progresses; no numbers until they exist.
5. **Results / methodology**: the 49-request benchmark and the feedback experiment, with versions, dates and how plugins were judged.
6. GitHub link.

## Recommended stack (confirm before scaffolding)

Astro with Starlight for docs (Checker docs and the standard). Static output, markdown-first, built-in search, and Starlight's theme is driven by CSS custom properties, so `design/tokens.css` maps onto it cleanly.
