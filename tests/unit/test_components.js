'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Interactive Components & KPIs',
  description: 'Validates that sliders, KPI readouts, formulas, and chart canvas hooks are present.',
  tests: [
    {
      name: 'Interactive Sliders Exist',
      fn: () => {
        // Sliders are dynamically generated through the sl() interpolation function
        assertAtLeast(countOccurrences('sl('), 10, 'Should have multiple slider constructor calls');
      }
    },
    {
      name: 'Chart Canvas Elements Present',
      fn: () => {
        assertAtLeast(countOccurrences('<canvas'), 10, 'Should have multiple canvas elements for Chart.js renders');
      }
    },
    {
      name: 'KPI Result Cards Exist',
      fn: () => {
        assertAtLeast(countOccurrences('class="kpi-card"'), 20, 'Missing KPI blocks');
        assertAtLeast(countOccurrences('class="kpi-val"'), 20, 'Missing KPI value outputs');
      }
    },
    {
      name: 'Formula Blocks for Education',
      fn: () => {
        assertAtLeast(countOccurrences('class="formula-block"'), 10, 'Expected multiple mathematical formula blocks');
      }
    },
    {
      name: 'Interactive Buttons',
      fn: () => {
        assert(contains('Apply to All Modules'), 'Missing Apply to All Modules button in Live Markets');
      }
    }
  ]
};
