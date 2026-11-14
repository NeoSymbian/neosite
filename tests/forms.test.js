// SPDX-License-Identifier: Apache-2.0
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { clean, issueUrl, send, LIMITS, ISSUE_LOG_CHARS } from '../assets/report.js';

// Code.gs is plain Apps Script: run it in a sandbox and use its top-level functions.
const gs = {};
vm.runInNewContext(readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8'), gs);

test('clean keeps known fields, trimmed and capped', () => {
  const r = clean({ model: '  Pixel  ', evil: 'x', codename: '', log: 'a'.repeat(9000), message: 'hi\r\nthere' });
  assert.deepEqual(Object.keys(r).sort(), ['log', 'message', 'model']);
  assert.equal(r.model, 'Pixel');
  assert.equal(r.log.length, LIMITS.log);
  assert.equal(r.message, 'hi\nthere');
});

test('issueUrl prefills the issue form and leaves the contact out', () => {
  const log = 'x'.repeat(5000) + 'TAIL';
  const u = new URL(issueUrl({ model: 'OnePlus 6', codename: 'enchilada', working: 'Boots', contact: 'a@b.c', log }));
  assert.equal(u.pathname, '/NeoSymbian/docs/issues/new');
  assert.equal(u.searchParams.get('template'), 'device-report.yml');
  assert.equal(u.searchParams.get('title'), 'Device report: OnePlus 6 (enchilada)');
  assert.equal(u.searchParams.get('working'), 'Boots');
  assert.equal(u.searchParams.get('contact'), null);
  assert.equal(u.searchParams.get('log').length, ISSUE_LOG_CHARS);
  assert.ok(u.searchParams.get('log').endsWith('TAIL'), 'keeps the end of the log');
});

test('send posts a simple text/plain request with the kind and honeypot', async () => {
  let seen;
  await send('https://example.test/exec', 'device', { model: 'X' }, '', (url, opts) => { seen = { url, opts }; });
  assert.equal(seen.opts.mode, 'no-cors');
  assert.equal(seen.opts.headers['Content-Type'], 'text/plain;charset=utf-8');
  assert.deepEqual(JSON.parse(seen.opts.body), { kind: 'device', website: '', model: 'X' });
});

test('Code.gs parse accepts a device report and orders its columns', () => {
  const r = gs.parse(JSON.stringify({ kind: 'device', model: 'Pixel', contact: 'a@b.c', extra: 'dropped' }));
  assert.equal(r.ok, true);
  assert.equal(r.kind, 'device');
  assert.deepEqual([...r.row], ['Pixel', '', '', '', '', '', 'a@b.c']);
});

test('Code.gs parse rejects bad input and swallows the honeypot', () => {
  assert.equal(gs.parse('').ok, false);
  assert.equal(gs.parse('{not json').ok, false);
  assert.equal(gs.parse('x'.repeat(20001)).ok, false);
  assert.equal(gs.parse(JSON.stringify({ kind: 'admin' })).ok, false);
  assert.equal(gs.parse(JSON.stringify({ kind: 'device' })).error, 'missing model');
  assert.equal(gs.parse(JSON.stringify({ kind: 'contact', contact: 'a@b.c' })).error, 'missing message');
  const spam = gs.parse(JSON.stringify({ kind: 'contact', website: 'http://spam' }));
  assert.equal(spam.ok, true);
  assert.equal(spam.spam, true);
});

test('Code.gs cell never lets a value become a formula', () => {
  assert.equal(gs.cell('=HYPERLINK("http://x")', 100), '\'=HYPERLINK("http://x")');
  assert.equal(gs.cell('+1', 10), "'+1");
  assert.equal(gs.cell('-2', 10), "'-2");
  assert.equal(gs.cell('@a', 10), "'@a");
  assert.equal(gs.cell('Pixel 3a', 10), 'Pixel 3a');
  assert.equal(gs.cell('abcdef', 3), 'abc');
  assert.equal(gs.cell(undefined, 3), '');
});
