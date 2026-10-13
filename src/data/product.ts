import { SITE } from './site';

// Public product facts already approved in BRIEF.md and content/copy.md.
// No model performance numbers exist yet: don't add any (BRIEF.md > Tone and hard limits).
export const PRODUCT = {
  name: SITE.name,
  description: SITE.description,
  tagline: 'A native Omarchy model, trained on Omarchy plugin data, that runs locally.',
  whatItIs:
    'Usuba is a model, not an app or a plugin. It is a small AI model made for one job: Omarchy plugins. It runs free on your own laptop. The Usuba Checker Model is in training; the Usuba Checker Scripts are available now.',
  shipping: {
    checkerScripts: 'Usuba Checker Scripts: an open test for Omarchy plugins. Plain Python, not AI. Available now.',
    standard: 'Usuba Standard v0.1: the rulebook the Checker Scripts enforce, published in full. Available now.',
    checkerModel: 'Usuba Checker Model: the local model that reviews a plugin the scripts cannot. In training.',
  },
  checker: {
    summary:
      'An open test, not a model: plain Python scripts, not AI. They load an Omarchy plugin in a real Omarchy environment, run rule checks over its code, and tell you how to fix what they find.',
    scripts:
      'The Checker scripts do the mechanical testing. They load the plugin in a real Omarchy environment and run rule checks on its code, then produce a detailed report: load errors, crashes, missing files, made-up APIs, wrong config format and risky commands. Fast, deterministic and free.',
    reads: 'Reads the code and flags invented APIs, missing helper scripts, made-up command flags and fake data.',
    runs: 'Loads the plugin in a real Omarchy shell and catches load errors and crashes.',
    explains: 'Every problem comes with a rule id, a plain reason and a fix hint.',
    warns: 'Risky commands a plugin may need are warnings. Only clearly destructive ones fail.',
  },
  model: {
    base: 'Qwen 3.5 9B',
    hardware: 'Runs at 4-bit, about 5.5 GB of weights, on a typical 32 GB laptop with no graphics card',
    data: 'Omarchy plugins verified with the Checker Scripts and tested on real Omarchy hardware, from a sweep of 1,400+ published plugins so far. The Checker Scripts’ results across those plugins are part of the training data too.',
    role: 'The model does the reviewing the scripts cannot: whether a plugin really works, whether its data is real or faked, whether its buttons do anything, whether it breaks in use, and what Omarchy’s plugin reviewer would flag. Then it explains what to fix. It is in training, so it is built to do this, not proven at it.',
    results: 'The Usuba Checker Model is in training. No published model results yet.',
  },
  licence: '[TBD: licences for the Checker Scripts, the standard and the model weights; where weights will be published]',
  links: {
    homepage: SITE.origin,
    docs: `${SITE.origin}${SITE.docsHref}`,
    checker: `${SITE.origin}${SITE.checkerHref}`,
    standard: `${SITE.origin}${SITE.standardHref}`,
    model: `${SITE.origin}${SITE.modelHref}`,
    results: `${SITE.origin}${SITE.resultsHref}`,
    github: SITE.githubHref,
    contact: SITE.contactHref,
  },
} as const;
