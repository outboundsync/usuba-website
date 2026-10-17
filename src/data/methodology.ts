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
  inspiration: {
    series: string;
    articles: { label: string; href: string }[];
    ceo: { name: string; role: string; href: string };
    coinbase: string[];
    anyscale: string[];
  };
  tools: string;
  thanks: {
    icon: string;
    tone: 'mint' | 'butter' | 'lilac' | 'pink';
    name: string;
    href: string | null;
    linkText: string | null;
    body: string;
  }[];
}

export const METHODOLOGY = data as Methodology;
