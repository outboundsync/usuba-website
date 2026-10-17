import data from './results.json';

// Every number on the site comes from results.json. Each block names its source file in
// usuba-checker-scripts, so the next run is a data swap, not a rewrite.

export interface BenchmarkModel {
  name: string;
  /** Which side of the open / proprietary line the model sits on. */
  group: 'proprietary' | 'open';
  firstTry: number;
  /** Passing in total after up to three fix rounds (first try included). */
  afterFixes: number;
  worksRightAway: number;
  fixedByChecker: number;
  stillBuggy: number;
  fullyBroken: number;
  footnote?: string;
}

export type OutcomeKey = 'worksRightAway' | 'fixedByChecker' | 'stillBuggy' | 'fullyBroken';
export type BenchmarkTotals = Record<OutcomeKey, number>;

/** A measured rate with its 95% interval, when there is one. */
export interface Measure {
  value: number;
  low: number | null;
  high: number | null;
}

export interface ComparisonMetric {
  label: string;
  exam: string;
  n: number;
  better: 'higher' | 'lower';
  run2: Measure;
  stock: Measure;
  /** How run 2 reads against stock, given the intervals. */
  read: 'better' | 'on par' | 'worse';
}

export interface ScoreRow {
  name: string;
  kind: 'scripts' | 'usuba' | 'base' | 'peer';
  score: Measure;
}

export interface Exam {
  name: string;
  size: string;
  measures: string;
  labels: string;
  limit: string;
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
    passTest: string[];
    labels: Record<OutcomeKey, string>;
    dellLoad: { checked: number; loaded: number; failed: number; notRun: number; note: string };
    /** What the 49 requests are made of, as short factual pills. */
    breakdown: string[];
    /** The four outcomes summed across every model. */
    totals: BenchmarkTotals;
    models: BenchmarkModel[];
  };
  scripts: {
    standardVersion: string;
    ruleCount: number;
    dell75: { accuracy: Measure; correct: number; n: number; interval: string };
    alwaysBroken: number;
    keyAgreement: string;
    keyAgreementNote: string;
    sweepKeyAgreement: string;
  };
  sweep: {
    total: number;
    labels: { key: 'works' | 'broken' | 'unsure'; label: string; value: number }[];
    rerun: number;
    inUse: { total: number; items: { label: string; value: number }[] };
    newRules: string[];
  };
  exams: Exam[];
  scoreboard: { caption: string; rows: ScoreRow[]; baseline: { name: string; value: number }; note: string };
  model: {
    final: boolean;
    status: string;
    specs: string[];
    summary: string;
    run2: {
      date: string;
      base: string;
      train: number;
      val: number;
      steps: number;
      valLoss: number;
      adapter: string;
      gguf: string;
      scoredOn: string;
      targets: string;
      gaps: string[];
    };
    comparison: { caption: string; metrics: ComparisonMetric[] };
    facts: { addedFindings: string; dismissals: string; loop: string };
  };
}

export const RESULTS = data as Results;

/**
 * A preliminary number is never shown without its label (AGENTS.md > Honesty rules).
 * Flip `final` in results.json once the numbers are confirmed.
 */
export function preliminaryLabel(final: boolean): string | null {
  return final ? null : RESULTS.benchmark.preliminaryLabel;
}

/** A rate to a fixed number of places (charts use two, so 0.507 reads 0.51, as in the draft's tables). */
export function rate(value: number, digits = 2): string {
  return value.toFixed(digits);
}
