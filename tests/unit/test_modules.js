'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Simulator Modules & Sections',
  description: 'Validates the presence and structure of all economic modules plus live markets.',
  tests: [
    {
      name: 'Functional Modules are registered in nav',
      fn: () => {
        // Checking for navigation items specifically (about 24 items in the core layout)
        assertAtLeast(countOccurrences('class="nav-item"'), 24, 'Should have core nav module items');
      }
    },
    {
      name: 'All 26 sections exist',
      fn: () => {
        // Checking for section titles
        assertAtLeast(countOccurrences('<h2 class="section-title">'), 26, 'Should have at least 26 section titles');
      }
    },
    {
      name: 'Live Markets section exists',
      fn: () => {
        assert(contains('id="live-markets"'), 'Missing live markets section');
        assert(contains('Real-Time Market Data'), 'Missing Real-Time Market Data title');
      }
    },
    {
      name: 'Explanations and enhanced subtitles are present',
      fn: () => {
        assertAtLeast(countOccurrences('class="section-subtitle"'), 26, 'Missing section subtitles');
      }
    },
    {
      name: 'Source tags (OpenStax / Perloff) exist',
      fn: () => {
        assertAtLeast(countOccurrences('class="source-tag'), 10, 'There should be multiple source references throughout the modules');
      }
    }
  ]
};
