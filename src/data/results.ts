import data from './results.json';

export interface BenchmarkModel {
  name: string;
  /** Which side of the open / proprietary line the model sits on. */
  group: 'proprietary' | 'open';
  firstTry: number;
  afterFixes: number;
  worksRightAway: number;
  fixedByChecker: number;
  stillBuggy: number;
  fullyBroken: number;
  footnote?: string;
}

export interface BenchmarkTotals {
  worksRightAway: number;
  fixedByChecker: number;
  stillBuggy: number;
  fullyBroken: number;
}

export interface Results {
  benchmark: {
    final: boolean;
    preliminaryLabel: string;
    caption: string;
    requests: number;
    rounds: number;
    omarchyVersion: string;
    runDate: string;
    provider: string;
    note: string;
    /** What the 49 requests are made of, as short factual pills. */
    breakdown: string[];
    /** The four outcomes summed across every model. */
    totals: BenchmarkTotals;
    models: BenchmarkModel[];
  };
  model: {
    final: boolean;
    specs: string[];
    honestNote: string;
  };
}

export const RESULTS = data as Results;

/**
 * A preliminary number is never shown without its label (AGENTS.md > Honesty rules).
 * Flip `final` in results.json once Harris supplies the confirmed numbers.
 */
export function preliminaryLabel(final: boolean): string | null {
  return final ? null : RESULTS.benchmark.preliminaryLabel;
}
