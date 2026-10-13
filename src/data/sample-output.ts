// The homepage's illustrative Checker output. The command and the wording are still
// unconfirmed (BRIEF.md open question 3) and are labelled as illustrative on the page;
// the rule ids are real, from Usuba Standard v0.1. Docs show real output only.
// Rendered as explicit lines because Astro collapses whitespace between elements,
// which would run a <pre> block together.
export type OutputTone = 'prompt' | 'fail' | 'warn' | 'hint';

export interface OutputPart {
  tone?: OutputTone;
  text: string;
}

export const SAMPLE_OUTPUT: OutputPart[][] = [
  [{ tone: 'prompt', text: '$ ' }, { text: 'usuba check ./dropbox-widget' }],
  [{ tone: 'fail', text: '✗ USB-H02' }, { text: '   Shows storage numbers, but Dropbox isn’t installed.' }],
  [{ tone: 'hint', text: '  fix: detect Dropbox first, and show an empty state without it.' }],
  [{ tone: 'fail', text: '✗ USB-B02' }, { text: '   Calls xdotool, which doesn’t exist on Omarchy.' }],
  [{ tone: 'hint', text: '  fix: use hyprctl for window info instead.' }],
  [{ tone: 'warn', text: '⚠ USB-S01' }, { text: '   Writes outside the plugin directory (~/.cache/dropbox-widget). Review it.' }],
  [],
  [{ text: '2 problems, 1 warning' }],
];
