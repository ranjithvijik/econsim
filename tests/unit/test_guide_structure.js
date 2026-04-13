'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const {
  countOccurrences,
  contains,
  assert,
  assertEqual,
  assertAtLeast,
} = require('../helpers');

const GUIDE = 'econsimguide.html';

/** Parsed guide root (throws if file missing). Catches stray `</div>` that drops `.page` out of `.main-content`. */
function parseGuideRoot() {
  const html = fs.readFileSync(path.join(__dirname, '..', '..', GUIDE), 'utf8');
  return parse(html);
}

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
  description:
    'Validates econsimguide.html structure, theme wiring, navigation, and DOM layout (sidebar + single main column).',
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
    {
      name: 'DOM: app-wrapper contains only sidebar + main-content (flex row)',
      fn: () => {
        const root = parseGuideRoot();
        const app = root.querySelector('.app-wrapper');
        assert(!!app, 'Missing .app-wrapper');
        const kids = app.childNodes.filter((n) => n.nodeType === 1);
        assertEqual(kids.length, 2, `app-wrapper should have exactly 2 element children, got ${kids.length}`);
        assertEqual(kids[0].tagName, 'NAV', 'First child should be <nav>');
        assert(
          (kids[0].getAttribute('class') || '').split(/\s+/).includes('sidebar'),
          'nav should have class sidebar',
        );
        assertEqual(kids[1].tagName, 'DIV', 'Second child should be <div class="main-content">');
        assert(
          (kids[1].getAttribute('class') || '').split(/\s+/).includes('main-content'),
          'Second child should be .main-content',
        );
      },
    },
    {
      name: 'DOM: no .page directly under .app-wrapper (stray closing div)',
      fn: () => {
        const root = parseGuideRoot();
        const app = root.querySelector('.app-wrapper');
        const stray = app.querySelectorAll(':scope > .page');
        assertEqual(
          stray.length,
          0,
          `Found ${stray.length} .page as direct child of .app-wrapper — extra </div> likely closed .main-content early`,
        );
      },
    },
    {
      name: 'DOM: every .page section is inside .main-content',
      fn: () => {
        const root = parseGuideRoot();
        const main = root.querySelector('.main-content');
        assert(!!main, 'Missing .main-content');
        const pages = root.querySelectorAll('.page');
        assertAtLeast(pages.length, 1, 'Expected at least one .page');
        const orphans = [];
        for (const el of pages) {
          const col = el.closest('.main-content');
          if (!col || col !== main) {
            orphans.push(el.getAttribute('id') || el.tagName);
          }
        }
        assertEqual(
          orphans.length,
          0,
          `.page outside .main-content: ${orphans.slice(0, 8).join(', ')}${orphans.length > 8 ? '…' : ''}`,
        );
      },
    },
    {
      name: 'DOM: key anchors (#mp3, #m05, #references) under .main-content',
      fn: () => {
        const root = parseGuideRoot();
        const main = root.querySelector('.main-content');
        for (const id of ['mp3', 'm05', 'references']) {
          const el = root.querySelector(`#${id}`);
          assert(!!el, `Missing #${id}`);
          const col = el.closest('.main-content');
          assert(!!col && col === main, `#${id} must be a descendant of .main-content`);
        }
      },
    },
  ],
};
