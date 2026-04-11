'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Interactive Components & KPIs',
  description: 'Validates that sliders, KPI readouts, formulas, and chart canvas hooks are present.',
  tests: [
    {
      name: 'Interactive Sliders Exist',
      fn: () => {
        assertAtLeast(countOccurrences('sl('), 30, 'Should have 30+ slider constructor calls across all modules');
      }
    },
    {
      name: 'Chart Canvas Elements Present',
      fn: () => {
        assertAtLeast(countOccurrences('<canvas'), 12, 'Should have 12+ canvas elements for Chart.js renders');
      }
    },
    {
      name: 'KPI Result Cards Exist',
      fn: () => {
        assertAtLeast(countOccurrences('class="kpi-card"'), 30, 'Missing KPI blocks');
        assertAtLeast(countOccurrences('class="kpi-val"'), 30, 'Missing KPI value outputs');
      }
    },
    {
      name: 'Formula Blocks for Education',
      fn: () => {
        assertAtLeast(countOccurrences('class="formula-block"'), 15, 'Expected 15+ mathematical formula blocks');
      }
    },
    {
      name: 'Interactive Buttons',
      fn: () => {
        assert(contains('Apply to All Modules'), 'Missing Apply to All Modules button');
      }
    },
    {
      name: 'New Module JS Functions Registered',
      fn: () => {
        assert(contains('function updateScarcity'), 'Missing updateScarcity function');
        assert(contains('function updatePPF'), 'Missing updatePPF function');
        assert(contains('function updateBudgetConstraint'), 'Missing updateBudgetConstraint function');
        assert(contains('function updateGDPCalc'), 'Missing updateGDPCalc function');
        assert(contains('function updateLorenz'), 'Missing updateLorenz function');
        assert(contains('function updateExpectedValue'), 'Missing updateExpectedValue function');
      }
    }
  ]
};
