'use strict';

const {
  countOccurrences,
  contains,
  assert,
  assertEqual,
  assertAtLeast,
} = require('../helpers');

const GUIDE = 'econsimguide.html';

/** Sidebar + body module order aligned with index.html (subset documented in guide). */
const EXPECTED_SIDEBAR_TARGETS = [
  'welcome',
  'interface',
  'usage',
  'pedagogy',
  'mf1',
  'm01',
  'm02',
  'mp3',
  'm05',
  'm06',
  'mx5',
  'm08',
  'm09',
  'm10',
  'm11',
  'm12',
  'm07',
  'm13',
  'm14',
  'm15',
  'm16',
  'm03',
  'm17',
  'm18',
  'm20',
  'm21',
  'm25',
  'm29',
  'mm2',
  'm24',
  'm22',
  'm23',
  'mp1',
  'mg1',
  'm27',
  'mt1',
  'mu1',
  'm19',
  'mk1',
  'm28',
  'mk5',
  'me1',
  'mp2',
  'mw1',
  'mi1',
  'mm1',
  'm04',
  'm30',
  'm26',
  'mx4',
  'references',
];

function sidebarNavTargets(html) {
  const start = html.indexOf('<div class="sidebar-nav">');
  const end = html.indexOf('id="searchNoResults"', start);
  assert(start !== -1 && end !== -1, 'sidebar-nav block not found');
  const block = html.slice(start, end);
  const re = /class="nav-item[^"]*"[^>]*data-target="([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(block)) !== null) out.push(m[1]);
  return out;
}

module.exports = {
  name: 'Student Guide HTML',
  description: 'Validates econsimguide.html structure, theme wiring, and navigation.',
  tests: [
    {
      name: 'Single document shell',
      fn: () => {
        assertEqual(countOccurrences('<html', GUIDE), 1, 'Should have one <html>');
        assertEqual(countOccurrences('<body', GUIDE), 1, 'Should have one <body>');
        assertEqual(countOccurrences('</body>', GUIDE), 1, 'Should have one </body>');
      },
    },
    {
      name: 'Title and fonts',
      fn: () => {
        assert(contains('<title>', GUIDE), 'Missing <title>');
        assert(contains('Student Guide', GUIDE), 'Title should reference Student Guide');
        assert(contains('fonts.googleapis.com', GUIDE), 'Missing Google Fonts');
      },
    },
    {
      name: 'Light theme default on <html>',
      fn: () => {
        assert(contains('data-theme="light"', GUIDE), 'Guide should default to light theme');
      },
    },
    {
      name: 'Layout and navigation present',
      fn: () => {
        assert(contains('class="app-wrapper"', GUIDE), 'Missing app-wrapper');
        assert(contains('class="sidebar"', GUIDE), 'Missing sidebar');
        assert(contains('class="main-content"', GUIDE), 'Missing main-content');
        assertAtLeast(countOccurrences('class="nav-item', GUIDE), 40, 'Expected nav items');
      },
    },
    {
      name: 'Theme persistence (setTheme + localStorage)',
      fn: () => {
        assert(contains("localStorage.setItem('theme'", GUIDE), 'Missing theme persistence');
        assert(contains("function setTheme", GUIDE), 'Missing setTheme');
      },
    },
    {
      name: 'Guide content pages present',
      fn: () => {
        assertAtLeast(countOccurrences('class="page"', GUIDE), 50, 'Expected many .page sections');
        assert(contains('id="welcome"', GUIDE), 'Missing welcome anchor');
        assert(contains('id="references"', GUIDE), 'Missing references section');
      },
    },
    {
      name: 'Light-mode readability tokens',
      fn: () => {
        assert(contains('[data-theme="light"]', GUIDE), 'Missing light theme CSS block');
        assert(contains('--text-primary', GUIDE), 'Missing --text-primary token');
      },
    },
    {
      name: 'Sidebar nav order matches simulator (index.html) order',
      fn: () => {
        const fs = require('fs');
        const path = require('path');
        const html = fs.readFileSync(path.join(__dirname, '..', '..', GUIDE), 'utf8');
        const got = sidebarNavTargets(html);
        assertEqual(
          got.length,
          EXPECTED_SIDEBAR_TARGETS.length,
          `Expected ${EXPECTED_SIDEBAR_TARGETS.length} sidebar targets, got ${got.length}`,
        );
        for (let i = 0; i < EXPECTED_SIDEBAR_TARGETS.length; i++) {
          assertEqual(
            got[i],
            EXPECTED_SIDEBAR_TARGETS[i],
            `Sidebar position ${i}: expected data-target="${EXPECTED_SIDEBAR_TARGETS[i]}", got "${got[i]}"`,
          );
        }
      },
    },
    {
      name: 'Guide body page ids follow same order as sidebar (mf1 … mx4)',
      fn: () => {
        const fs = require('fs');
        const path = require('path');
        const html = fs.readFileSync(path.join(__dirname, '..', '..', GUIDE), 'utf8');
        const ped = html.indexOf('id="pedagogy"');
        const ref = html.indexOf('id="references"');
        assert(ped !== -1 && ref !== -1, 'pedagogy or references anchor missing');
        const body = html.slice(ped, ref);
        const moduleOnly = EXPECTED_SIDEBAR_TARGETS.slice(4, -1);
        const positions = moduleOnly.map((id) => {
          const needle = `id="${id}"`;
          const p = body.indexOf(needle);
          assert(p !== -1, `Module anchor ${needle} not found between pedagogy and references`);
          return p;
        });
        for (let i = 0; i < positions.length - 1; i++) {
          assert(
            positions[i] < positions[i + 1],
            `Order violation: "${moduleOnly[i]}" should appear before "${moduleOnly[i + 1]}" in body`,
          );
        }
      },
    },
  ],
};
