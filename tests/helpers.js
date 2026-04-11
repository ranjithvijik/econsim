/**
 * tests/helpers.js — Shared test utilities for SGI QA suite
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');

let _html = null;

/** Lazily read and cache index.html */
function getHTML() {
  if (!_html) _html = fs.readFileSync(HTML_PATH, 'utf8');
  return _html;
}

/** Count occurrences of a string or regex in the HTML */
function countOccurrences(pattern) {
  const html = getHTML();
  if (typeof pattern === 'string') {
    return html.split(pattern).length - 1;
  }
  return (html.match(pattern) || []).length;
}

/** Check if string/regex appears at least once */
function contains(pattern) {
  const html = getHTML();
  if (typeof pattern === 'string') return html.includes(pattern);
  return pattern.test(html);
}

/** Return all matches for a regex */
function findAll(regex) {
  return getHTML().match(regex) || [];
}

/** Simple assertion that throws on failure */
function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

/** Assert two values are strictly equal */
function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label || 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

/** Assert value >= min */
function assertAtLeast(actual, min, label) {
  if (actual < min) {
    throw new Error(`${label || 'assertAtLeast'}: expected >= ${min}, got ${actual}`);
  }
}

module.exports = { getHTML, countOccurrences, contains, findAll, assert, assertEqual, assertAtLeast };
