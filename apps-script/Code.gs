// SPDX-License-Identifier: Apache-2.0
// NeoSymbian site forms -> Google Sheet. Bind this script to the sheet (Extensions -> Apps Script),
// deploy it as a web app (Execute as: me, Who has access: Anyone) and put its /exec URL in assets/config.js.
// Each kind gets its own tab, created with a header row on first use.

var COLUMNS = {
  device: ['model', 'codename', 'bootloader', 'build', 'working', 'log', 'contact'],
  contact: ['name', 'contact', 'message'],
};
// The same caps as assets/report.js; the client can't be trusted to apply them.
var LIMITS = {
  model: 80, codename: 40, bootloader: 20, build: 120, working: 200, log: 8000,
  contact: 120, name: 80, message: 4000,
};
var REQUIRED = { device: ['model'], contact: ['contact', 'message'] };
var MAX_BODY = 20000;

function doPost(e) {
  var raw = e && e.postData ? e.postData.contents : '';
  var res = parse(raw);
  if (!res.ok) return reply(res);
  if (res.spam) return reply({ ok: true }); // honeypot: answer like a success, store nothing
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(res.kind);
    if (!sheet) {
      sheet = book.insertSheet(res.kind);
      sheet.appendRow(['received'].concat(COLUMNS[res.kind]));
    }
    sheet.appendRow([new Date()].concat(res.row));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// Pure: request body -> {ok, kind, row} or {ok: false, error} or {ok: true, spam: true}.
function parse(raw) {
  if (!raw || raw.length > MAX_BODY) return { ok: false, error: 'empty or too large' };
  var d;
  try { d = JSON.parse(raw); } catch (err) { return { ok: false, error: 'not JSON' }; }
  if (!d || typeof d !== 'object') return { ok: false, error: 'not an object' };
  if (d.website) return { ok: true, spam: true };
  var cols = COLUMNS[d.kind];
  if (!cols) return { ok: false, error: 'unknown kind' };
  var row = cols.map(function (c) { return cell(d[c], LIMITS[c]); });
  for (var i = 0; i < REQUIRED[d.kind].length; i++) {
    if (!row[cols.indexOf(REQUIRED[d.kind][i])]) return { ok: false, error: 'missing ' + REQUIRED[d.kind][i] };
  }
  return { ok: true, kind: d.kind, row: row };
}

// A value as a plain text cell: capped, and never read as a formula (=, +, -, @ would start one).
function cell(v, max) {
  if (v === null || v === undefined) return '';
  var s = String(v).trim().slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
