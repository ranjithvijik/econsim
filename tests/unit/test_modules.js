'use strict';

const { countOccurrences, contains, assert, assertEqual, assertAtLeast } = require('../helpers');

module.exports = {
  name: 'Simulator Modules & Sections',
  description: 'Validates all 78 economic modules.',
  tests: [
    {
      name: 'Nav items present (78 modules)',
      fn: () => {
        // Match "nav-item", "nav-item live", "nav-item active" (exact `class="nav-item"` alone is only 76)
        assertAtLeast(countOccurrences('class="nav-item'), 78, 'Should have 78 nav items');
      }
    },
    {
      name: 'All section titles exist (78 total)',
      fn: () => {
        assertAtLeast(countOccurrences('<h2 class="section-title">'), 78, 'Should have at least 78 section titles');
      }
    },
    {
      name: 'Live Markets section exists',
      fn: () => {
        assert(contains('id="live-markets"'), 'Missing live markets');
        assert(contains('Real-Time Market Data'), 'Missing Real-Time Market Data');
      }
    },
    {
      name: 'Original 26 modules present',
      fn: () => {
        ['supply-demand','elasticity','production-costs','revenue-profit','market-structures',
         'reaction-functions','bertrand','collusion','entry-deterrence','merger',
         'game-theory','sequential-games','dynamic-games','mixed-strategy','coordination','behavioral',
         'externalities','auctions','firm-org','csr-ethics',
         'ad-as','fiscal-policy','monetary-policy','phillips-curve','solow-growth'].forEach(id => {
          assert(contains('id="'+id+'"'), 'Missing original module: '+id);
        });
      }
    },
    {
      name: 'Wave 1 Fundamentals & Macro modules present',
      fn: () => {
        ['scarcity-choice','ppf-sim','budget-constraint','opp-cost','price-controls',
         'labor-market','credit-market','gdp-calc','real-nominal-gdp','growth-rate',
         'unemp-calc','cpi-calc','comp-advantage','tariff-sim',
         'utility-max','perf-comp','price-disc','lorenz','expected-value'].forEach(id => {
          assert(contains('id="'+id+'"'), 'Missing Wave 1 module: '+id);
        });
      }
    },
    {
      name: 'Wave 2 Keynesian, Production & Welfare modules present',
      fn: () => {
        ['keynesian-cross','paradox-thrift','fractional-reserve','purchasing-power','balance-trade',
         'demand-shifter','supply-elasticity','cross-income-elast',
         'marginal-decision','short-run-prod','indifference-curves','monopolistic-comp','kinked-demand','mrp-labor',
         'poverty-calc','unemp-types','productivity-growth'].forEach(id => {
          assert(contains('id="'+id+'"'), 'Missing Wave 2 module: '+id);
        });
      }
    },
    {
      name: 'Wave 3 Advanced & International modules present',
      fn: () => {
        ['asymmetric-info','moral-hazard','financial-markets','public-choice',
         'exchange-rates','national-debt','trade-policy','globalization','tax-incidence','intra-industry','macro-policy-world'].forEach(id => {
          assert(contains('id="'+id+'"'), 'Missing Wave 3 module: '+id);
        });
      }
    },
    {
      name: 'Section subtitles present',
      fn: () => {
        assertAtLeast(countOccurrences('class="section-subtitle"'), 78, 'Missing section subtitles');
      }
    },
    {
      name: 'Source tags exist throughout',
      fn: () => {
        assertAtLeast(countOccurrences('class="source-tag'), 30, 'Should have 30+ source references');
      }
    }
  ]
};
