'use strict';

const {
  countOccurrences,
  contains,
  assert,
  assertEqual,
  assertAtLeast,
} = require('../helpers');

const GUIDE = 'econsimguide.html';

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
  ],
};
