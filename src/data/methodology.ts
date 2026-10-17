import data from './methodology.json';

// Words and figures for /methodology/ that aren't exam results; those live in results.json.

export interface Figure {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  href?: string;
}

export interface Methodology {
  timeline: { date: string; title: string; what: string; learned: string }[];
  lies: { how: string; flattering: string; exposed: string; honest: string }[];
  validatorVsReal: { caption: string; note: string; total: number; rows: { name: string; validator: number; real: number }[] };
  graderVsReal: { caption: string; note: string; max: number; rounds: { label: string; grader: number; real: number | null }[] };
  authority: { title: string; body: string; power: string }[];
  lessons: string[];
  spend: { confirmed: string; provisional: string };
  screenshots: Figure[];
  screenshotsNote: string;
  sourceCharts: Figure[];
}

export const METHODOLOGY = data as Methodology;
