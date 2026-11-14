// SPDX-License-Identifier: Apache-2.0
// Device reports and contact messages: clean the fields, build a prefilled GitHub issue, post to the sheet.

// Per-field caps. apps-script/Code.gs applies the same caps again on the server.
export const LIMITS = {
  model: 80, codename: 40, bootloader: 20, build: 120, working: 200, log: 8000,
  contact: 120, name: 80, message: 4000,
};
// GitHub refuses very long new-issue URLs (about 8 KB), so the issue gets the end of the log only.
export const ISSUE_LOG_CHARS = 2000;

// Known fields only, as trimmed strings within their caps. Unknown keys are dropped.
export function clean(fields) {
  const out = {};
  for (const [k, max] of Object.entries(LIMITS)) {
    if (fields[k] == null) continue;
    const v = String(fields[k]).replace(/\r\n?/g, '\n').trim().slice(0, max);
    if (v) out[k] = v;
  }
  return out;
}

// A new-issue URL for the device-report issue form (docs: .github/ISSUE_TEMPLATE/device-report.yml).
// Query keys match the form's field ids. The contact address never goes into the public issue.
export function issueUrl(r, repo = 'NeoSymbian/docs') {
  const title = 'Device report: ' + (r.model || 'unknown phone') + (r.codename ? ` (${r.codename})` : '');
  const q = new URLSearchParams({ template: 'device-report.yml', labels: 'device-report', title });
  for (const k of ['model', 'codename', 'bootloader', 'build', 'working']) if (r[k]) q.set(k, r[k]);
  if (r.log) q.set('log', r.log.length > ISSUE_LOG_CHARS ? r.log.slice(-ISSUE_LOG_CHARS) : r.log);
  return `https://github.com/${repo}/issues/new?${q}`;
}

// Apps Script web apps answer no CORS preflight, so this is a "simple" text/plain POST whose reply
// can't be read. It rejects only when the network fails.
export async function send(url, kind, record, website = '', fetchImpl = fetch) {
  await fetchImpl(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ kind, website, ...record }),
  });
}
