/**
 * tests/helpers.js — Shared utilities for EconSim QA suite
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const _htmlCache = Object.create(null);

function _resolveSafe(filename) {
  const base = path.basename(filename);
  return path.resolve(ROOT, base);
}

/** Lazily read and cache a project HTML file (basename only, e.g. index.html). */
function getHTML(filename = 'index.html') {
  const full = _resolveSafe(filename);
  if (!_htmlCache[full]) {
    _htmlCache[full] = fs.readFileSync(full, 'utf8');
  }
  return _htmlCache[full];
}

/** Read any project root file (relative path, no .. segments). */
function readProjectFile(relPath) {
  const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const full = path.resolve(ROOT, normalized);
  if (!full.startsWith(ROOT)) {
    throw new Error('Invalid path');
  }
  return fs.readFileSync(full, 'utf8');
}

/** Count occurrences of a string or regex in the given HTML file */
function countOccurrences(pattern, filename = 'index.html') {
  const html = getHTML(filename);
  if (typeof pattern === 'string') {
    return html.split(pattern).length - 1;
  }
  return (html.match(pattern) || []).length;
}

/** Check if string/regex appears at least once */
function contains(pattern, filename = 'index.html') {
  const html = getHTML(filename);
  if (typeof pattern === 'string') return html.includes(pattern);
  return pattern.test(html);
}

/** Return all matches for a regex */
function findAll(regex, filename = 'index.html') {
  return getHTML(filename).match(regex) || [];
}

/** Count <section> vs </section> (whole-document sanity check). */
function sectionTagCounts(filename = 'index.html') {
  const html = getHTML(filename);
  const open = (html.match(/<section\b/g) || []).length;
  const close = (html.match(/<\/section>/g) || []).length;
  return { open, close };
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

module.exports = {
  getHTML,
  readProjectFile,
  countOccurrences,
  contains,
  findAll,
  sectionTagCounts,
  assert,
  assertEqual,
  assertAtLeast,
};
