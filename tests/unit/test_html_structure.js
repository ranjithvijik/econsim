'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'HTML Structure & Health',
  description: 'Validates raw HTML integrity, essential tags, globals, and structural invariants.',
  tests: [
    {
      name: 'Single <html> and <body>',
      fn: () => {
        assertEqual(countOccurrences('<html'), 1, 'Should have exactly one <html');
        assertEqual(countOccurrences('<body'), 1, 'Should have exactly one <body');
        assertEqual(countOccurrences('</body>'), 1, 'Should have exactly one </body>');
      }
    },
    {
      name: 'Title element is present and correct',
      fn: () => {
        assert(contains('<title>'), 'Missing <title> tag');
        assert(contains('Economics Simulator'), 'Title should contain Economics Simulator');
      }
    },
    {
      name: 'Layout classes present',
      fn: () => {
        assert(contains('<div class="app-layout">'), 'Missing app-layout wrapper');
        assert(contains('class="sidebar"'), 'Missing sidebar');
        assert(contains('class="main-content"'), 'Missing main-content');
      }
    },
    {
      name: 'Script dependencies present',
      fn: () => {
        assert(contains('cdn.jsdelivr.net/npm/chart.js'), 'Missing Chart.js CDN');
      }
    },
    {
      name: 'Light mode defaults',
      fn: () => {
        assert(contains('data-theme="light"'), 'Should default to data-theme="light"');
      }
    }
  ]
};
