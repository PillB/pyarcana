import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import {
  PROGRESS_STORAGE_KEY, parsePersistedEnvelope, roundTripProgress,
  migrateProgressState, mergeServerProgress, EMPTY_PROGRESS,
} from '../../src/lib/progress-sanitize.ts'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

const raw = fs.readFileSync('audit/content-campaign/evidence/legacy_progress_fixture.json', 'utf8')
const fixture = JSON.parse(raw)

test('storage key is unchanged', () => {
  assert.equal(PROGRESS_STORAGE_KEY, 'python-ds-progress')
})

test('legacy envelope parses with no loss after the content change', () => {
  const p = parsePersistedEnvelope(raw)
  assert.equal(p.ok, true, 'envelope must parse')
  assert.equal(p.reason, undefined, 'no migration/reset warning for a valid fixture')
  const s = p.state
  assert.deepEqual([...(s.completedSections ?? [])].sort(),
    [...fixture.state.completedSections].sort())
  for (const [sec, steps] of Object.entries(fixture.state.completedSubSteps)) {
    assert.deepEqual([...(s.completedSubSteps?.[sec] ?? [])].sort(), [...(steps as string[])].sort(),
      `sub-steps preserved for ${sec}`)
  }
  assert.deepEqual(s.quizScores, fixture.state.quizScores)
  assert.deepEqual(s.bookmarks, fixture.state.bookmarks)
  assert.equal(s.lastVisited, fixture.state.lastVisited)
  assert.equal(s.startDate, fixture.state.startDate)
})

test('round-trip preserves every field', () => {
  const p = parsePersistedEnvelope(raw)
  const rt = roundTripProgress({ ...EMPTY_PROGRESS, ...p.state })
  assert.deepEqual(rt.quizScores, fixture.state.quizScores)
  assert.deepEqual([...rt.completedSections].sort(), [...fixture.state.completedSections].sort())
  assert.deepEqual(rt.bookmarks, fixture.state.bookmarks)
})

test('migration v0 -> v1 never reduces completed work and is idempotent', () => {
  const p = parsePersistedEnvelope(raw)
  const before = { ...EMPTY_PROGRESS, ...p.state }
  const once = migrateProgressState(before, p.version, 1)
  assert.equal(once.version, 1)
  assert.ok((once.state.completedSections ?? []).length >= before.completedSections.length)
  assert.deepEqual(once.state.quizScores, before.quizScores)
  assert.deepEqual(once.state.bookmarks, before.bookmarks)
  const twice = migrateProgressState(once.state, once.version, 1)
  assert.deepEqual(twice.state, once.state, 'migration is idempotent')
})

test('an empty server response cannot wipe the touched sections', () => {
  const p = parsePersistedEnvelope(raw)
  const local = { ...EMPTY_PROGRESS, ...p.state }
  const merged = mergeServerProgress(local, { completedSections: [], completedSubSteps: {}, quizScores: {}, bookmarks: [] })
  assert.ok(merged.completedSections.includes('data-engineering'))
  assert.ok(merged.completedSections.includes('stdlib-deep'))
  assert.deepEqual([...merged.completedSubSteps['data-engineering']].sort(),
    ['ido','quiz','theory','wedo','youdo'])
  assert.equal(merged.quizScores['data-engineering'], 100)
})

test('every section id referenced by the fixture still exists in the course', () => {
  const ids = new Set(COURSE_SECTIONS.map(s => s.id))
  for (const id of fixture.state.completedSections) assert.ok(ids.has(id), `${id} still active`)
  for (const id of fixture.state.bookmarks) assert.ok(ids.has(id), `${id} bookmark target still active`)
  assert.ok(ids.has(fixture.state.lastVisited))
  assert.equal(COURSE_SECTIONS.length, 52)
})

test('touched sections keep their identity and grew only additively', () => {
  const s18 = COURSE_SECTIONS.find(s => s.id === 'data-engineering')!
  const s15 = COURSE_SECTIONS.find(s => s.id === 'stdlib-deep')!
  assert.equal(s18.index, 18)
  assert.equal(s15.index, 15)
  for (const s of [s18, s15]) {
    const subs = new Set(s.theory.map(t => t.subtopicId).filter(Boolean))
    assert.equal(subs.size, 8, `${s.id} still has exactly 8 subtopics`)
    const ex = new Set(s.weDo.steps.map(w => w.id).filter(Boolean))
    assert.equal(ex.size, 24, `${s.id} still has exactly 24 exercise ids`)
    assert.equal(s.iDo.steps.length, 8, `${s.id} still has 8 demos`)
  }
  assert.equal(s18.selfCheck.questions.length, 10, 'S18 Autocheck grew 8 -> 10')
})
