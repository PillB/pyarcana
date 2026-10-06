import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mergeProgress,
  diffChanges,
  recordChanges,
  sanitizeChangeLog,
  buildRemoteDoc,
  parseRemoteDoc,
  unionInto,
  hasProgress,
  type ChangeLog,
  type ProgressState,
} from '@/lib/cloud/progress-merge'
import { SECTION_ID_SCHEMA_VERSION } from '@/lib/section-id-migrations'

const NOW = Date.parse('2026-09-28T12:00:00Z')

function state(patch: Partial<ProgressState> = {}): ProgressState {
  return {
    completedSections: [],
    completedSubSteps: {},
    quizScores: {},
    lastVisited: null,
    bookmarks: [],
    startDate: null,
    isHydratedFromServer: false,
    ...patch,
  }
}

function doc(s: Partial<ProgressState>, changes: ChangeLog = {}, sv = SECTION_ID_SCHEMA_VERSION) {
  return { v: 1, sv, state: s, changes }
}

test('an un-toggle made here propagates: local removal is newer than the remote add', () => {
  const local = state({ completedSubSteps: { setup: ['theory'] } })
  const localChanges: ChangeLog = { 'sub:setup:ido': { present: false, ts: NOW - 1000 } }
  const remote = doc({ completedSubSteps: { setup: ['theory', 'ido'] } }, { 'sub:setup:ido': { present: true, ts: NOW - 5000 } })
  const r = mergeProgress(local, localChanges, remote, NOW)
  assert.deepEqual(r.state.completedSubSteps, { setup: ['theory'] })
  assert.deepEqual(r.changes['sub:setup:ido'], { present: false, ts: NOW - 1000 })
})

test('an un-toggle made on another device propagates here too', () => {
  const local = state({ completedSections: ['setup', 'basics'], bookmarks: ['basics'] })
  const localChanges: ChangeLog = { 'sec:basics': { present: true, ts: 100 }, 'bm:basics': { present: true, ts: 100 } }
  const remote = doc({ completedSections: ['setup'], bookmarks: [] }, { 'sec:basics': { present: false, ts: 200 }, 'bm:basics': { present: false, ts: 200 } })
  const r = mergeProgress(local, localChanges, remote, NOW)
  assert.deepEqual(r.state.completedSections, ['setup'])
  assert.deepEqual(r.state.bookmarks, [])
})

test('concurrent adds on two devices both survive (union)', () => {
  const local = state({ completedSubSteps: { setup: ['theory'] }, completedSections: ['setup'] })
  const remote = doc({ completedSubSteps: { setup: ['ido'], basics: ['theory'] }, completedSections: ['basics'] })
  const r = mergeProgress(local, { 'sub:setup:theory': { present: true, ts: 5 } }, remote, NOW)
  assert.deepEqual(r.state.completedSubSteps, { setup: ['theory', 'ido'], basics: ['theory'] })
  assert.deepEqual(r.state.completedSections, ['setup', 'basics'])
})

test('a tie in time goes to present', () => {
  const local = state({ bookmarks: ['setup'] })
  const remote = doc({ bookmarks: [] }, { 'bm:setup': { present: false, ts: 50 } })
  const r = mergeProgress(local, { 'bm:setup': { present: true, ts: 50 } }, remote, NOW)
  assert.deepEqual(r.state.bookmarks, ['setup'])
})

test('quiz scores keep the maximum; startDate the earliest; lastVisited and the hydration flag stay local', () => {
  const local = state({ quizScores: { setup: 60, basics: 90 }, startDate: '2026-05-01T00:00:00.000Z', lastVisited: 'basics', isHydratedFromServer: false })
  const remote = doc({ quizScores: { setup: 80, basics: 40 }, startDate: '2026-03-01T00:00:00.000Z', lastVisited: 'setup', isHydratedFromServer: true })
  const r = mergeProgress(local, {}, remote, NOW)
  assert.deepEqual(r.state.quizScores, { setup: 80, basics: 90 })
  assert.equal(r.state.startDate, '2026-03-01T00:00:00.000Z')
  assert.equal(r.state.lastVisited, 'basics')
  assert.equal(r.state.isHydratedFromServer, false)
  const hydrated = mergeProgress({ ...local, isHydratedFromServer: true }, {}, remote, NOW)
  assert.equal(hydrated.state.isHydratedFromServer, true)
})

test('a fresh device with no lastVisited resumes where the account left off', () => {
  const r = mergeProgress(state(), {}, doc({ lastVisited: 'setup' }), NOW)
  assert.equal(r.state.lastVisited, 'setup')
})

test('a remote doc written before the section rename is migrated before merging', () => {
  const remote = doc(
    { completedSections: ['numpy'], completedSubSteps: { pandas: ['theory'] }, quizScores: { numpy: 70 }, bookmarks: ['oop'], lastVisited: 'numpy' },
    { 'sec:numpy': { present: true, ts: 10 }, 'bm:oop': { present: true, ts: 10 } },
    0
  )
  const r = mergeProgress(state(), {}, remote, NOW)
  assert.deepEqual(r.state.completedSections, ['collections'])
  assert.deepEqual(r.state.completedSubSteps, { 'files-ingestion': ['theory'] })
  assert.deepEqual(r.state.quizScores, { collections: 70 })
  assert.deepEqual(r.state.bookmarks, ['functions-contracts'])
  assert.equal(r.state.lastVisited, 'collections')
  assert.ok(r.changes['sec:collections'] && !r.changes['sec:numpy'])
})

test('a hostile remote doc is sanitized: bad types, __proto__, impossible scores and future timestamps are dropped', () => {
  const local = state({ completedSections: ['setup'], quizScores: { setup: 50 } })
  const hostile = JSON.parse(`{
    "v": 1, "sv": 1,
    "state": {
      "completedSections": "everything",
      "completedSubSteps": {"__proto__": ["theory"], "basics": ["theory", 7]},
      "quizScores": {"setup": 1e999, "basics": -5, "decisions-rules": 500, "collections": 75, "__proto__": 100},
      "bookmarks": ["basics"],
      "startDate": 12
    },
    "changes": {
      "sec:setup": {"present": false, "ts": ${NOW + 10 * 365 * 86400000}},
      "sec:basics": {"present": "yes", "ts": 1},
      "junk": {"present": true, "ts": 1},
      "sub:__proto__:theory": {"present": true, "ts": 1}
    }
  }`)
  const r = mergeProgress(local, {}, hostile, NOW)
  assert.deepEqual(r.state.completedSections, ['setup'], 'the far-future removal must not win')
  assert.deepEqual(r.state.completedSubSteps, {}, 'mixed-type step list and __proto__ are dropped')
  assert.deepEqual(r.state.quizScores, { setup: 50, collections: 75 })
  assert.deepEqual(r.state.bookmarks, ['basics'])
  assert.equal(r.state.startDate, null)
  assert.deepEqual(Object.keys(r.changes), [])
  assert.equal(({} as Record<string, unknown>).theory, undefined)
  assert.equal(Object.getPrototypeOf(r.state.quizScores), Object.prototype)
})

test('a change log alone cannot add progress that neither state holds', () => {
  const remote = doc({}, { 'sec:advanced-topics': { present: true, ts: NOW - 1 }, 'sub:basics:quiz': { present: true, ts: NOW - 1 } })
  const r = mergeProgress(state(), {}, remote, NOW)
  assert.deepEqual(r.state.completedSections, [])
  assert.deepEqual(r.state.completedSubSteps, {})
})

test('an unreadable remote leaves local progress exactly as it was', () => {
  const local = state({ completedSections: ['setup'], completedSubSteps: { setup: ['theory'] }, bookmarks: ['basics'], quizScores: { setup: 90 } })
  for (const remote of [null, 'x', [], { v: 2, state: {} }, { state: { completedSections: [] } }]) {
    const r = mergeProgress(local, {}, remote, NOW)
    assert.deepEqual(r.state, local, JSON.stringify(remote))
  }
  assert.equal(parseRemoteDoc({ v: 2, state: {} }, NOW), null)
})

test('an empty remote never clears the local store', () => {
  const local = state({ completedSections: ['setup'], completedSubSteps: { setup: ['theory', 'ido'] }, bookmarks: ['setup'], quizScores: { setup: 90 } })
  const r = mergeProgress(local, {}, doc({}), NOW)
  assert.deepEqual(r.state, local)
})

test('diffChanges records adds and removals with a timestamp, and nothing for no change', () => {
  const prev = state({ completedSubSteps: { setup: ['theory'] }, bookmarks: ['basics'] })
  const next = state({ completedSubSteps: { setup: ['theory', 'ido'] }, bookmarks: [], completedSections: ['setup'] })
  assert.deepEqual(diffChanges(prev, next, 42), {
    'sub:setup:ido': { present: true, ts: 42 },
    'bm:basics': { present: false, ts: 42 },
    'sec:setup': { present: true, ts: 42 },
  })
  assert.deepEqual(diffChanges(next, next, 43), {})
})

test('recordChanges keeps the newest entry per item', () => {
  const log = recordChanges({ 'sec:setup': { present: true, ts: 10 } }, { 'sec:setup': { present: false, ts: 20 }, 'bm:setup': { present: true, ts: 5 } })
  assert.deepEqual(log, { 'sec:setup': { present: false, ts: 20 }, 'bm:setup': { present: true, ts: 5 } })
  assert.deepEqual(recordChanges(log, { 'sec:setup': { present: true, ts: 15 } })['sec:setup'], { present: false, ts: 20 })
})

test('sanitizeChangeLog validates keys, entries and timestamps', () => {
  const clean = sanitizeChangeLog(
    {
      'sec:setup': { present: true, ts: 1 },
      'sub:setup:theory': { present: false, ts: 2 },
      'bm:basics': { present: true, ts: NOW + 60_000 },
      'sub:setup': { present: true, ts: 1 },
      'sec:': { present: true, ts: 1 },
      'sec:a:b': { present: true, ts: 1 },
      'sec:far-future': { present: true, ts: NOW + 2 * 86400000 },
      'sec:negative': { present: true, ts: -1 },
      'sec:nan': { present: true, ts: 'x' },
    },
    NOW
  )
  assert.deepEqual(Object.keys(clean).sort(), ['bm:basics', 'sec:setup', 'sub:setup:theory'])
})

test('the pushed doc carries the schema version and not the device-local hydration flag; it round-trips', () => {
  const local = state({ completedSections: ['setup'], completedSubSteps: { setup: ['theory'] }, quizScores: { setup: 70 }, bookmarks: ['basics'], startDate: '2026-01-01T00:00:00.000Z', lastVisited: 'setup', isHydratedFromServer: true })
  const changes: ChangeLog = { 'sec:setup': { present: true, ts: 3 } }
  const pushed = buildRemoteDoc(local, changes)
  assert.equal(pushed.v, 1)
  assert.equal(pushed.sv, SECTION_ID_SCHEMA_VERSION)
  assert.equal('isHydratedFromServer' in pushed.state, false)
  const back = mergeProgress(local, changes, JSON.parse(JSON.stringify(pushed)), NOW)
  assert.deepEqual(back.state, local)
  assert.deepEqual(back.changes, changes)
})

test('unionInto adds what the incoming copy has, never removes, and records the additions', () => {
  const local = state({ completedSections: ['setup'], bookmarks: ['setup'], quizScores: { setup: 90 }, lastVisited: 'setup' })
  const localChanges: ChangeLog = { 'sec:basics': { present: false, ts: NOW - 10 } }
  const incoming = { completedSections: ['basics'], completedSubSteps: { basics: ['theory'] }, quizScores: { setup: 40, basics: 70 }, bookmarks: [], lastVisited: 'basics', startDate: '2025-01-01T00:00:00.000Z' }
  const r = unionInto(local, localChanges, incoming, NOW)
  assert.deepEqual(r.state.completedSections, ['setup', 'basics'])
  assert.deepEqual(r.state.completedSubSteps, { basics: ['theory'] })
  assert.deepEqual(r.state.bookmarks, ['setup'])
  assert.deepEqual(r.state.quizScores, { setup: 90, basics: 70 })
  assert.equal(r.state.lastVisited, 'setup')
  assert.equal(r.state.startDate, '2025-01-01T00:00:00.000Z')
  assert.deepEqual(r.changes['sec:basics'], { present: true, ts: NOW })
  assert.deepEqual(r.changes['sub:basics:theory'], { present: true, ts: NOW })
  assert.equal(r.added, 2)
})

test('hasProgress is true for any learner work and false for an empty store', () => {
  assert.equal(hasProgress(state()), false)
  assert.equal(hasProgress(state({ lastVisited: 'setup' })), false)
  assert.equal(hasProgress(state({ bookmarks: ['setup'] })), true)
  assert.equal(hasProgress(state({ quizScores: { setup: 10 } })), true)
  assert.equal(hasProgress(state({ completedSubSteps: { setup: [] } })), false)
  assert.equal(hasProgress(state({ completedSubSteps: { setup: ['theory'] } })), true)
})
