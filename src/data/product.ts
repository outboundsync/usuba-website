import { RESULTS } from './results';
import { SITE } from './site';

// Public product facts, served as /data/product.json and by the site MCP's get_product tool.
// Numbers come from results.json, always with the preliminary label (AGENTS.md > Honesty rules).
export const PRODUCT = {
  name: SITE.name,
  description: SITE.description,
  tagline: 'A native Omarchy model, trained on Omarchy plugin data, that runs locally.',
  whatItIs:
    'Usuba is a model, not an app or a plugin. It is a small AI model made for one job: Omarchy plugins. It runs free on your own laptop. The Usuba Checker Model is In Training; the Usuba Checker Scripts are available now.',
  shipping: {
    checkerScripts: 'Usuba Checker Scripts: an open test for Omarchy plugins. Plain Python, not AI. Available now.',
    standard: 'Usuba Standard v0.2: the rulebook the Checker Scripts enforce, published in full. Available now.',
    checkerModel: 'Usuba Checker Model: the local model that reviews a plugin the scripts cannot. In Training; latest run: Usuba run 2.',
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
    base: 'Qwen3.5 9B with a LoRA adapter (stock weights unchanged)',
    hardware:
      'A 5.63 GB 4-bit file (Q4_K_M), built for a typical 32 GB laptop with no graphics card. The 4-bit file has no exam score yet.',
    data: `Usuba run 2 was trained on ${RESULTS.model.run2.train} examples (${RESULTS.model.run2.val} held out for validation) built from real plugin git histories and Dell hardware runs.`,
    role: 'The model does the reviewing the scripts cannot: whether a plugin really works, whether its data is real or faked, whether its buttons do anything, whether it breaks in use, and what Omarchy’s plugin reviewer would flag. Then it explains what to fix. It is In Training, so it is built to do this, not proven at it.',
    results: RESULTS.model.summary,
    weights: SITE.adaptersHref,
    dataset: SITE.datasetHref,
  },
  licence:
    'MIT for the Usuba Checker Scripts, the Usuba Standard, this site and all repository code (copyright 2026 OutboundSync). Apache-2.0 for the Usuba Checker Model weights and adapters, matching the Qwen base model; they are published on Hugging Face.',
  links: {
    homepage: SITE.origin,
    docs: `${SITE.origin}${SITE.docsHref}`,
    checker: `${SITE.origin}${SITE.checkerHref}`,
    standard: `${SITE.origin}${SITE.standardHref}`,
    model: `${SITE.origin}${SITE.modelHref}`,
    results: `${SITE.origin}${SITE.resultsHref}`,
    github: SITE.githubHref,
    scripts: SITE.scriptsRepoHref,
    models: SITE.modelsRepoHref,
    methodology: `${SITE.origin}${SITE.methodologyHref}`,
    contact: SITE.contactHref,
  },
} as const;
