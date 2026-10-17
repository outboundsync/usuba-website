// Real output from the Usuba Checker Scripts, verbatim: `functest.py --reasons` on a small, deliberately broken
// "now playing" bar widget, run on a Mac (static checks only; the runtime stage needs the reference Linux build).
// Long lines are wrapped onto their own `Fix:` line; the words are unchanged. Rule ids are from Usuba Standard v0.2.
// Rendered as explicit lines because Astro collapses whitespace between elements,
// which would run a <pre> block together.
export type OutputTone = 'prompt' | 'fail' | 'warn' | 'hint';

export interface OutputPart {
  tone?: OutputTone;
  text: string;
}

export const SAMPLE_OUTPUT: OutputPart[][] = [
  [{ tone: 'prompt', text: '$ ' }, { text: 'python3 functest/functest.py now-playing --reasons' }],
  [{ tone: 'fail', text: 'FAIL' }, { text: ' (static checks only: runtime skipped,' }],
  [{ text: '      the runtime stage needs Linux, this is darwin)' }],
  [{ tone: 'fail', text: '  [USB-B05]' }, { text: ' Widget.qml: runs `playerctl` - not an' }],
  [{ text: '      Omarchy/system binary on the Dell and not shipped' }],
  [{ text: '      by the plugin.' }],
  [{ tone: 'hint', text: '      Fix: use an installed program or ship/document it' }],
  [{ tone: 'fail', text: '  [USB-A04]' }, { text: ' Widget.qml: line 19: `p.start()` -' }],
  [{ text: '      `Process` has no method `start`.' }],
  [{ tone: 'hint', text: '      Fix: set `running = true` to start a Process' }],
  [{ tone: 'hint', text: '      (there is no start())' }],
];

/** Where the output came from, shown under the window. */
export const SAMPLE_OUTPUT_NOTE =
  'Real output from the Usuba Checker Scripts on a deliberately broken test plugin. Static checks only, run on a Mac; long lines wrapped.';
