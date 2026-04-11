'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Simulator Modules & Sections',
  description: 'Validates the presence and structure of all economic modules plus live markets.',
  tests: [
    {
      name: 'Functional Modules are registered in nav',
      fn: () => {
        assertAtLeast(countOccurrences('class="nav-item"'), 40, 'Should have 40+ nav module items');
      }
    },
    {
      name: 'All section titles exist (26 original + 20 new)',
      fn: () => {
        assertAtLeast(countOccurrences('<h2 class="section-title">'), 46, 'Should have at least 46 section titles');
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
      name: 'Original modules present',
      fn: () => {
        assert(contains('id="supply-demand"'), 'Missing supply-demand');
        assert(contains('id="elasticity"'), 'Missing elasticity');
        assert(contains('id="production-costs"'), 'Missing production-costs');
        assert(contains('id="ad-as"'), 'Missing AD-AS');
        assert(contains('id="solow-growth"'), 'Missing solow-growth');
      }
    },
    {
      name: 'New Fundamentals modules present',
      fn: () => {
        assert(contains('id="scarcity-choice"'), 'Missing scarcity-choice');
        assert(contains('id="ppf-sim"'), 'Missing ppf-sim');
        assert(contains('id="budget-constraint"'), 'Missing budget-constraint');
        assert(contains('id="opp-cost"'), 'Missing opp-cost');
        assert(contains('id="price-controls"'), 'Missing price-controls');
      }
    },
    {
      name: 'New Market/GDP/Trade modules present',
      fn: () => {
        assert(contains('id="labor-market"'), 'Missing labor-market');
        assert(contains('id="credit-market"'), 'Missing credit-market');
        assert(contains('id="gdp-calc"'), 'Missing gdp-calc');
        assert(contains('id="real-nominal-gdp"'), 'Missing real-nominal-gdp');
        assert(contains('id="growth-rate"'), 'Missing growth-rate');
        assert(contains('id="unemp-calc"'), 'Missing unemp-calc');
        assert(contains('id="cpi-calc"'), 'Missing cpi-calc');
        assert(contains('id="comp-advantage"'), 'Missing comp-advantage');
        assert(contains('id="tariff-sim"'), 'Missing tariff-sim');
      }
    },
    {
      name: 'New Micro modules present',
      fn: () => {
        assert(contains('id="utility-max"'), 'Missing utility-max');
        assert(contains('id="perf-comp"'), 'Missing perf-comp');
        assert(contains('id="price-disc"'), 'Missing price-disc');
        assert(contains('id="lorenz"'), 'Missing lorenz');
        assert(contains('id="expected-value"'), 'Missing expected-value');
      }
    },
    {
      name: 'Explanations and subtitles present',
      fn: () => {
        assertAtLeast(countOccurrences('class="section-subtitle"'), 46, 'Missing section subtitles');
      }
    },
    {
      name: 'Source tags exist',
      fn: () => {
        assertAtLeast(countOccurrences('class="source-tag'), 10, 'Should have multiple source references');
      }
    }
  ]
};
