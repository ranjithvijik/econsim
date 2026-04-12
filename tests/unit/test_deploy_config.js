'use strict';

const { readProjectFile, contains, assert } = require('../helpers');

module.exports = {
  name: 'Deploy & Project Config',
  description: 'Ensures Amplify ships all static pages and cross-links stay wired.',
  tests: [
    {
      name: 'Amplify artifacts include simulator and guide',
      fn: () => {
        const yml = readProjectFile('amplify.yml');
        assert(yml.includes('index.html'), 'amplify.yml should list index.html');
        assert(yml.includes('econsimguide.html'), 'amplify.yml should list econsimguide.html');
      },
    },
    {
      name: 'Index links to Student Guide',
      fn: () => {
        assert(contains('econsimguide.html', 'index.html'), 'index.html should link to econsimguide.html');
        assert(contains('Student Guide', 'index.html'), 'index.html should label Student Guide link');
      },
    },
    {
      name: 'Package scripts invoke QA runner',
      fn: () => {
        const pkg = readProjectFile('package.json');
        assert(pkg.includes('run_tests.js'), 'package.json should run run_tests.js');
        assert(pkg.includes('test:html') || pkg.includes('html_structure'), 'package.json should expose html tests');
      },
    },
  ],
};
