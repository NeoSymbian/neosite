// SPDX-License-Identifier: Apache-2.0
// Guards the roadmap data: ids, references, phase order, and states that agree with dependencies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PHASES, PARTS, STAGES, STATES, WHERE_LABEL, AS_OF, counts, phaseState, docUrl } from '../assets/roadmap.js';

const byId = new Map(STAGES.map(s => [s.id, s]));
const partIds = new Set(PARTS.map(p => p.id));

test('ids are unique and every field is known', () => {
  assert.equal(byId.size, STAGES.length, 'duplicate stage id');
  assert.deepEqual(PHASES.map(p => p.n), PHASES.map((_, i) => i + 1), 'phases numbered 1..n in order');
  assert.match(AS_OF, /^\d{4}-\d{2}-\d{2}$/);
  for (const s of STAGES) {
    assert.ok(partIds.has(s.part), `${s.id}: unknown part ${s.part}`);
    assert.ok(PHASES.some(p => p.n === s.phase), `${s.id}: unknown phase ${s.phase}`);
    assert.ok(STATES.includes(s.state), `${s.id}: unknown state ${s.state}`);
    assert.ok(s.where in WHERE_LABEL, `${s.id}: unknown where ${s.where}`);
    assert.ok(s.date === '' || /^\d{4}-\d{2}-\d{2}$/.test(s.date), `${s.id}: date ${s.date}`);
    assert.ok(!s.date || s.date <= AS_OF, `${s.id}: date after AS_OF`);
    assert.ok(s.title && s.doc && Array.isArray(s.after), `${s.id}: missing title, doc or after`);
  }
  for (const p of PARTS) assert.ok(STAGES.some(s => s.part === p.id), `part ${p.id} has no stages`);
});

test('dependencies exist, never point to a later phase, and have no cycles', () => {
  for (const s of STAGES) {
    for (const a of s.after) {
      const dep = byId.get(a);
      assert.ok(dep, `${s.id}: unknown dependency ${a}`);
      assert.ok(dep.phase <= s.phase, `${s.id} (phase ${s.phase}) depends on ${a} (phase ${dep.phase})`);
    }
  }
  const seen = new Set(), stack = new Set();
  const visit = id => {
    if (stack.has(id)) assert.fail(`dependency cycle through ${id}`);
    if (seen.has(id)) return;
    stack.add(id);
    byId.get(id).after.forEach(visit);
    stack.delete(id);
    seen.add(id);
  };
  STAGES.forEach(s => visit(s.id));
});

test('states agree with dependencies', () => {
  for (const s of STAGES) {
    for (const a of s.after) {
      const d = byId.get(a).state;
      // A done stage may build on merged work still awaiting acceptance (C8 on C7), never on unstarted or blocked work.
      if (s.state === 'done') assert.ok(d === 'done' || d === 'progress', `${s.id} is done but ${a} is ${d}`);
      if (s.state === 'progress') assert.notEqual(d, 'planned', `${s.id} is in progress but ${a} is planned`);
    }
  }
});

test('phase states and counts', () => {
  const st = (...states) => states.map(state => ({ state }));
  assert.equal(phaseState(st('done', 'done')), 'done');
  assert.equal(phaseState(st('done', 'blocked')), 'progress');
  assert.equal(phaseState(st('planned', 'planned')), 'planned');
  assert.deepEqual(counts(st('done', 'progress', 'progress')), { done: 1, progress: 2, blocked: 0, planned: 0 });
  // The current picture: phase 1 done, the last phase not started.
  assert.equal(phaseState(STAGES.filter(s => s.phase === 1)), 'done');
  assert.equal(phaseState(STAGES.filter(s => s.phase === PHASES.length)), 'planned');
});

test('doc links resolve to the docs repo or a full URL', () => {
  assert.equal(docUrl('wifi.md'), 'https://github.com/NeoSymbian/docs/blob/main/wifi.md');
  assert.equal(docUrl('https://github.com/NeoSymbian/neoui'), 'https://github.com/NeoSymbian/neoui');
});
