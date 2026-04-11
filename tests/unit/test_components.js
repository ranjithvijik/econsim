'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Interactive Components & KPIs',
  description: 'Validates sliders, KPI readouts, formulas, charts, and JS functions for all 63 modules.',
  tests: [
    {
      name: 'Interactive Sliders (50+)',
      fn: () => {
        assertAtLeast(countOccurrences('sl('), 50, 'Should have 50+ slider constructor calls');
      }
    },
    {
      name: 'Chart Canvas Elements (12+)',
      fn: () => {
        assertAtLeast(countOccurrences('<canvas'), 12, 'Should have 12+ canvas elements');
      }
    },
    {
      name: 'KPI Cards (40+)',
      fn: () => {
        assertAtLeast(countOccurrences('class="kpi-card"'), 40, 'Missing KPI blocks');
        assertAtLeast(countOccurrences('class="kpi-val"'), 40, 'Missing KPI value outputs');
      }
    },
    {
      name: 'Formula Blocks (20+)',
      fn: () => {
        assertAtLeast(countOccurrences('class="formula-block"'), 20, 'Expected 20+ formula blocks');
      }
    },
    {
      name: 'Result Boxes (25+)',
      fn: () => {
        assertAtLeast(countOccurrences('class="result-box"'), 25, 'Expected 25+ result boxes');
      }
    },
    {
      name: 'Core JS Functions (Wave 1)',
      fn: () => {
        ['updateScarcity','updatePPF','updateBudgetConstraint','updateGDPCalc',
         'updateLorenz','updateExpectedValue','updateCompAdvantage','updateTariff'].forEach(fn => {
          assert(contains('function '+fn), 'Missing JS function: '+fn);
        });
      }
    },
    {
      name: 'Core JS Functions (Wave 2)',
      fn: () => {
        ['updateKeynesianCross','updateParadoxThrift','updateFractionalReserve',
         'updatePurchasingPower','updateBalanceTrade','updateDemandShifter',
         'updateMarginalDecision','updateShortRunProduction','updateMonopolisticComp',
         'updateKinkedDemand','updateMRP','updatePovertyCalc','updateProductivityGrowth'].forEach(fn => {
          assert(contains('function '+fn), 'Missing JS function: '+fn);
        });
      }
    },
    {
      name: 'Interactive Buttons',
      fn: () => {
        assert(contains('Apply to All Modules'), 'Missing Apply to All Modules button');
      }
    }
  ]
};
