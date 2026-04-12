#!/usr/bin/env node
/**
 * run_tests.js — EconSim QA Orchestrator
 * ═════════════════════════════════════════════
 * Single-command test runner for the Economics Simulator.
 * Executes all test modules against index.html and writes a human-readable
 * QA-REPORT.md, mirroring the quantlab QA pattern.
 *
 * Usage:
 *   node run_tests.js                          # run all tests, write QA-REPORT.md
 *   node run_tests.js --fast                   # skip live-data tests
 *   node run_tests.js --module financial_values # run only that module
 *   node run_tests.js --out my_report.md        # custom output path
 *   node run_tests.js --no-report              # run but don't write file
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Module registry ───────────────────────────────────────────────────────────
const TEST_MODULES = {
  html_structure:         'tests/unit/test_html_structure.js',
  simulator_modules:      'tests/unit/test_modules.js',
  interactive_components: 'tests/unit/test_components.js'
};

// ─── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const FAST      = hasFlag('--fast');
const NO_REPORT = hasFlag('--no-report');
const MODULE    = getArg('--module');
const OUT_PATH  = getArg('--out') || 'QA-REPORT.md';

if (MODULE && !TEST_MODULES[MODULE]) {
  console.error(`Unknown module "${MODULE}". Valid: ${Object.keys(TEST_MODULES).join(', ')}`);
  process.exit(1);
}

// ─── Grade thresholds ──────────────────────────────────────────────────────────
const GRADE_THRESHOLDS = [
  ['A+', 100], ['A', 97], ['B', 90], ['C', 80], ['D', 70], ['F', 0],
];

function grade(passPct) {
  for (const [g, t] of GRADE_THRESHOLDS) {
    if (passPct >= t) return g;
  }
  return 'F';
}

function bar(pct, width = 30) {
  const filled = Math.round(Math.min(Math.max(pct, 0), 100) / 100 * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── Run a single test module ──────────────────────────────────────────────────
function runModule(key) {
  const modPath = path.resolve(__dirname, TEST_MODULES[key]);
  const mod = require(modPath);
  const results = [];
  let passed = 0, failed = 0;
  const t0 = Date.now();

  for (const test of mod.tests) {
    let status = 'PASSED';
    let error  = null;
    try {
      test.fn();
      passed++;
    } catch (e) {
      status = 'FAILED';
      error  = e.message;
      failed++;
    }
    results.push({ name: test.name, desc: test.desc || test.name, status, error });
  }

  return {
    key,
    name:        mod.name        || key,
    description: mod.description || '',
    path:        TEST_MODULES[key],
    passed,
    failed,
    total:       passed + failed,
    duration:    Date.now() - t0,
    results,
  };
}

// ─── Report generation ─────────────────────────────────────────────────────────
function generateReport(moduleResults, totalMs) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  const totals = moduleResults.reduce(
    (acc, m) => { acc.passed += m.passed; acc.failed += m.failed; acc.total += m.total; return acc; },
    { passed: 0, failed: 0, total: 0 }
  );
  const passPct = totals.total > 0 ? (totals.passed / totals.total * 100) : 0;
  const g = grade(passPct);
  const allPassed = totals.failed === 0;

  const lines = [];

  // ── Header ────────────────────────────────────────────────────────────────
  lines.push(
    '# EconSim — QA Report',
    '',
    `> Generated: **${now}**  |  Grade: **${g}**  |  Pass Rate: **${passPct.toFixed(1)}%**`,
    '',
  );

  // ── Banner ────────────────────────────────────────────────────────────────
  const banner = allPassed ? '🟢 ALL TESTS PASSED' : '🔴 SOME TESTS FAILED';
  lines.push(
    `## ${banner}`,
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Total Tests | **${totals.total}** |`,
    `| Passed      | ✅ ${totals.passed} |`,
    `| Failed      | ${totals.failed > 0 ? '❌' : '✅'} ${totals.failed} |`,
    `| Pass Rate   | ${passPct.toFixed(1)}% \`${bar(passPct)}\` |`,
    `| Duration    | ⏱️ ${(totalMs / 1000).toFixed(2)}s |`,
    `| Grade       | **${g}** |`,
    '',
  );

  // ── Module Summary ─────────────────────────────────────────────────────────
  lines.push(
    '## 🧪 Test Modules',
    '',
    '| Module | Description | Tests | Passed | Failed | Status |',
    '|--------|-------------|-------|--------|--------|--------|',
  );
  for (const m of moduleResults) {
    const status = m.failed === 0 ? '✅' : '❌';
    lines.push(`| \`${m.path}\` | ${m.description} | ${m.total} | ${m.passed} | ${m.failed} | ${status} |`);
  }
  lines.push('');

  // ── Detailed Results ───────────────────────────────────────────────────────
  lines.push('## 📋 Detailed Test Results', '');
  for (const m of moduleResults) {
    const status = m.failed === 0 ? '✅ PASSED' : `❌ ${m.failed} FAILED`;
    lines.push(
      `### ${m.name}`,
      `**File:** \`${m.path}\` &nbsp;|&nbsp; **Status:** ${status} &nbsp;|&nbsp; **${m.passed}/${m.total} tests passing**`,
      '',
      '<details>',
      '<summary>Show all tests</summary>',
      '',
      '| Test | Description | Status |',
      '|------|-------------|--------|',
    );
    for (const t of m.results) {
      const icon = t.status === 'PASSED' ? '✅' : '❌';
      const errNote = t.error ? ` <br><sub>${t.error.replace(/\|/g, '\\|')}</sub>` : '';
      lines.push(`| \`${t.name}\` | ${t.desc}${errNote} | ${icon} ${t.status} |`);
    }
    lines.push('', '</details>', '');
  }

  // ── Failures ──────────────────────────────────────────────────────────────
  const allFailures = moduleResults.flatMap(m =>
    m.results.filter(t => t.status === 'FAILED').map(t => ({ module: m.name, ...t }))
  );
  if (allFailures.length > 0) {
    lines.push(
      '## ❌ Failure Details',
      '',
      '| # | Module | Test | Error |',
      '|---|--------|------|-------|',
    );
    allFailures.forEach((f, i) => {
      lines.push(`| ${i + 1} | ${f.module} | \`${f.name}\` | ${f.error || ''} |`);
    });
    lines.push('', '> Run `node run_tests.js` locally to reproduce.', '');
  }

  // ── How to Run ────────────────────────────────────────────────────────────
  lines.push(
    '## 🚀 Running the Tests',
    '',
    '### Quick start',
    '```bash',
    'npm install',
    'node run_tests.js',
    '```',
    '',
    '### Options',
    '```bash',
    'node run_tests.js --fast                   # skip live-data tests',
    'node run_tests.js --module financial_values # run only that module',
    'node run_tests.js --out my_qa.md            # custom output path',
    'node run_tests.js --no-report              # run without writing file',
    '```',
    '',
    '### Makefile shortcuts',
    '```bash',
    'make qa              # full suite + QA-REPORT.md',
    'make test            # verbose run',
    'make fast            # skip live-data',
    'make t-html          # HTML structure only',
    'make t-data          # financial values only',
    'make t-exports       # export functions only',
    'make t-sections      # section coverage only',
    'make clean           # remove QA-REPORT.md',
    '```',
    '',
  );

  // ── Architecture ──────────────────────────────────────────────────────────
  lines.push(
    '## 🏗️ Test Architecture',
    '',
    '```',
    'tests/',
    '├── helpers.js                         # Shared utilities (getHTML, assert, etc.)',
    '│',
    '└── unit/',
    '    ├── test_html_structure.js         # General DOM structure, CDNs, scripts',
    '    ├── test_modules.js                # All 78 functional economics modules',
    '    └── test_components.js             # Interactive sliders, KPIs, Canvas elements',
    '                                       # CORS proxies, static fallback',
    '```',
    '',
    'All tests run **fully offline** — no network calls, no browser, no server.',
    'Tests parse `index.html` directly as a text file using Node.js `fs`.',
    '',
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  lines.push('---', `*Generated by \`run_tests.js\` · ${now}*`, '');

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const width = 62;
  const line  = '═'.repeat(width);

  console.log('\n' + line);
  console.log('  EconSim QA Orchestrator');
  console.log(line);
  console.log(`  Time   : ${new Date().toLocaleString()}`);
  console.log(`  Report : ${OUT_PATH}`);
  console.log(`  Mode   : ${FAST ? 'fast (live-data skipped)' : 'full suite'}`);
  if (MODULE) console.log(`  Module : ${MODULE}`);
  console.log(line + '\n');

  // Select modules
  let modulesToRun;
  if (MODULE) {
    modulesToRun = { [MODULE]: TEST_MODULES[MODULE] };
  } else if (FAST) {
    const { live_data: _, ...rest } = TEST_MODULES;
    modulesToRun = rest;
  } else {
    modulesToRun = TEST_MODULES;
  }

  const t0 = Date.now();
  const moduleResults = [];

  for (const key of Object.keys(modulesToRun)) {
    const modDef = (() => {
      try { return require(path.resolve(__dirname, TEST_MODULES[key])); } catch (e) { return null; }
    })();
    const name = modDef ? (modDef.name || key) : key;
    process.stdout.write(`  ▶  ${name.padEnd(35)} ... `);
    const result = runModule(key);
    moduleResults.push(result);
    const icon = result.failed === 0 ? '✅' : '❌';
    console.log(`${icon}  ${result.passed} passed, ${result.failed} failed  (${result.duration}ms)`);
  }

  const totalMs = Date.now() - t0;

  // Totals
  const totals = moduleResults.reduce(
    (acc, m) => { acc.passed += m.passed; acc.failed += m.failed; acc.total += m.total; return acc; },
    { passed: 0, failed: 0, total: 0 }
  );
  const passPct = totals.total > 0 ? (totals.passed / totals.total * 100) : 0;
  const g = grade(passPct);

  console.log('\n' + line);
  console.log(`  Results  : ${totals.passed}/${totals.total} passed  (${passPct.toFixed(1)}%)`);
  console.log(`  Grade    : ${g}`);
  console.log(`  Duration : ${(totalMs / 1000).toFixed(2)}s`);
  console.log(line);

  const failures = moduleResults.flatMap(m =>
    m.results.filter(t => t.status === 'FAILED').map(t => ({ module: m.name, ...t }))
  );
  if (failures.length > 0) {
    console.log(`\n❌  ${failures.length} test(s) failed:`);
    for (const f of failures) {
      console.log(`    • [${f.module}] ${f.name}: ${f.error}`);
    }
  }

  if (!NO_REPORT) {
    const report = generateReport(moduleResults, totalMs);
    fs.writeFileSync(path.resolve(__dirname, OUT_PATH), report, 'utf8');
    console.log(`\n📄 Report written → ${OUT_PATH}`);
  }

  console.log('');
  process.exit(totals.failed > 0 ? 1 : 0);
}

main();
