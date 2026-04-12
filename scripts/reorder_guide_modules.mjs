/**
 * Reorders econsimguide.html module bodies to match index.html sidebar order.
 * Drops PART IV / PART V divider-only pages (not in simulator nav).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const guidePath = path.join(__dirname, '..', 'econsimguide.html');
let html = fs.readFileSync(guidePath, 'utf8');

const startNeedle = '\n      <!-- MODULE 01:';
const refNeedle = '\n                  <!-- REFERENCES -->';
const startIdx = html.indexOf(startNeedle);
const refIdx = html.indexOf(refNeedle);
if (startIdx === -1) throw new Error('Start marker not found: MODULE 01');
if (refIdx === -1) throw new Error('REFERENCES marker not found');

const prefix = html.slice(0, startIdx);
const suffix = html.slice(refIdx);
const middle = html.slice(startIdx, refIdx);

// Split at MODULE / PART headers; keep MODULE chunks only in output map.
const segRe = /\n\s*<!-- (MODULE ([A-Z0-9]+):[^\n]*|PART (IV|V):[^\n]*)\n/g;
const matches = [...middle.matchAll(segRe)];
if (!matches.length) throw new Error('No MODULE/PART segments found');

const segments = {};
for (let i = 0; i < matches.length; i++) {
  const start = matches[i].index;
  const end = i + 1 < matches.length ? matches[i + 1].index : middle.length;
  const slice = middle.slice(start, end);
  const modCode = matches[i][2];
  if (modCode) {
    if (segments[modCode]) {
      console.warn('Duplicate segment key:', modCode);
    }
    segments[modCode] = slice;
  }
}

/** Simulator sidebar order; only keys that exist in the student guide. */
const ORDER = [
  'F1',
  '01',
  '02',
  'P3',
  '05',
  '06',
  'X5',
  '08',
  '09',
  '10',
  '11',
  '12',
  '07',
  '13',
  '14',
  '15',
  '16',
  '03',
  '17',
  '18',
  '20',
  '21',
  '25',
  '29',
  'M2',
  '24',
  '22',
  '23',
  'P1',
  'G1',
  '27',
  'T1',
  'U1',
  '19',
  'K1',
  '28',
  'K5',
  'E1',
  'P2',
  'W1',
  'I1',
  'M1',
  '04',
  '30',
  '26',
  'X4',
];

const missing = ORDER.filter((k) => !segments[k]);
if (missing.length) {
  throw new Error(`Missing segments for keys: ${missing.join(', ')}`);
}

const newMiddle = ORDER.map((k) => segments[k]).join('');
const out = prefix + newMiddle + suffix;
fs.writeFileSync(guidePath, out);
console.log('Reordered', ORDER.length, 'module segments; dropped PART IV/V dividers.');
