import test from 'node:test'
import assert from 'node:assert/strict'
import {
  gateDecision,
  isLocked,
  stageForGate,
  ensureGrandfatherSnapshot,
  readGrandfather,
  isGrandfathered,
  progressSectionIds,
  GRANDFATHER_KEY,
} from '@/lib/cloud/gate'
import { createMemoryStorage } from '@/lib/cloud/storage'

const d = (o: Partial<Parameters<typeof gateDecision>[0]> = {}) =>
  gateDecision({ packaging: 'A', sectionIndex: 6, subStep: null, access: 'free', grandfathered: false, stage: 'beta', freeSections: 5, ...o })

test('packaging A: sections 1-5 are open to everyone, 6+ locked for free users', () => {
  for (let i = 1; i <= 5; i++) assert.equal(d({ sectionIndex: i }), 'open', `S${i}`)
  for (const i of [6, 7, 30, 52]) assert.equal(d({ sectionIndex: i }), 'locked', `S${i}`)
})

test('Pro opens every section; unknown access shows the skeleton only where a lock is possible', () => {
  assert.equal(d({ access: 'pro' }), 'open')
  assert.equal(d({ access: 'unknown' }), 'pending')
  assert.equal(d({ access: 'unknown', sectionIndex: 3 }), 'open')
})

test('no gate outside beta and paid', () => {
  assert.equal(d({ stage: 'off' }), 'open')
  assert.equal(d({ stage: 'sync' }), 'open')
  assert.equal(d({ stage: 'paid' }), 'locked')
})

test('grandfathered sections stay open for a free user', () => {
  assert.equal(d({ sectionIndex: 20, grandfathered: true }), 'open')
})

test('packaging B: theory and I-do are free in 6+, practice and quiz are Pro', () => {
  const b = (subStep: string | null, access: 'free' | 'pro' | 'unknown' = 'free') => d({ packaging: 'B', subStep, access })
  assert.equal(b('theory'), 'open')
  assert.equal(b('ido'), 'open')
  assert.equal(b('wedo'), 'locked')
  assert.equal(b('youdo'), 'locked')
  assert.equal(b('quiz'), 'locked')
  assert.equal(b('wedo', 'pro'), 'open')
  assert.equal(b('quiz', 'unknown'), 'pending')
  assert.equal(b(null), 'open', 'the section shell is open; practice steps lock individually')
  assert.equal(b('capstone'), 'locked', 'an unrecognised sub-step fails closed')
  assert.equal(d({ packaging: 'B', sectionIndex: 4, subStep: 'quiz' }), 'open')
})

test('packaging A ignores the sub-step', () => {
  assert.equal(d({ packaging: 'A', subStep: 'theory' }), 'locked')
})

test('a misconfigured gate or a bad section index opens (soft gate; never strand a learner)', () => {
  for (const freeSections of [0, -1, 2.5, Number.NaN]) assert.equal(d({ freeSections }), 'open', `free=${freeSections}`)
  for (const sectionIndex of [0, -3, 1.5, Number.NaN]) assert.equal(d({ sectionIndex }), 'open', `index=${sectionIndex}`)
})

test('isLocked is the positional form and is true only for a definite lock', () => {
  assert.equal(isLocked('A', 6, null, 'free', false, 'beta', 5), true)
  assert.equal(isLocked('A', 6, null, 'unknown', false, 'beta', 5), false)
  assert.equal(isLocked('A', 6, null, 'free', true, 'beta', 5), false)
  assert.equal(isLocked('B', 6, 'theory', 'free', false, 'paid', 5), false)
  assert.equal(isLocked('B', 6, 'youdo', 'free', false, 'paid', 5), true)
})

test('isLocked defaults freeSections to the configured free plan (5)', () => {
  assert.equal(isLocked('A', 5, null, 'free', false, 'beta'), false)
  assert.equal(isLocked('A', 6, null, 'free', false, 'beta'), true)
})

test('gate.since delays the gate until that moment; an unreadable date keeps it off', () => {
  const now = Date.parse('2026-10-01T00:00:00Z')
  assert.equal(stageForGate('beta', '', now), 'beta')
  assert.equal(stageForGate('beta', '2026-09-30T00:00:00Z', now), 'beta')
  assert.equal(stageForGate('paid', '2026-10-02T00:00:00Z', now), 'sync')
  assert.equal(stageForGate('beta', 'pronto', now), 'sync')
  assert.equal(stageForGate('off', '', now), 'off')
})

// --- grandfathering --------------------------------------------------------------------------

const progress = {
  completedSections: ['setup', 'decisions-rules'],
  completedSubSteps: { 'files-ingestion': ['theory'], 'oop-domain': [] as string[] },
  quizScores: { 'apis-sql-geo': 80 },
  bookmarks: ['evidence-dashboard'],
  lastVisited: 'modules-packaging-cli',
  startDate: null,
  isHydratedFromServer: false,
}

test('the snapshot takes every section id from completions, sub-step keys, bookmarks and last visited', () => {
  assert.deepEqual(progressSectionIds(progress).sort(), [
    'decisions-rules',
    'evidence-dashboard',
    'files-ingestion',
    'modules-packaging-cli',
    'oop-domain',
    'setup',
  ])
})

test('the first gate-active load stores the snapshot; later loads never widen it', () => {
  const storage = createMemoryStorage()
  const first = ensureGrandfatherSnapshot(storage, progress, Date.parse('2026-10-01T00:00:00Z'))
  assert.ok(first.sections.includes('files-ingestion'))
  const later = ensureGrandfatherSnapshot(storage, { ...progress, completedSections: ['setup', 'some-pro-section'] }, Date.parse('2026-11-01T00:00:00Z'))
  assert.deepEqual(later, first)
  assert.equal(readGrandfather(storage)!.takenAt, '2026-10-01T00:00:00.000Z')
  assert.equal(isGrandfathered(later, 'some-pro-section'), false)
})

test('an empty device still records its (empty) snapshot, so progress made later is not grandfathered', () => {
  const storage = createMemoryStorage()
  const snap = ensureGrandfatherSnapshot(storage, { completedSections: [], completedSubSteps: {}, bookmarks: [], lastVisited: null }, 0)
  assert.deepEqual(snap.sections, [])
  const again = ensureGrandfatherSnapshot(storage, progress, 1)
  assert.deepEqual(again.sections, [])
})

test('a corrupt stored snapshot is retaken rather than trusted', () => {
  const storage = createMemoryStorage({ [GRANDFATHER_KEY]: '{"v":1,"sections":"all"}' })
  assert.equal(readGrandfather(storage), null)
  const snap = ensureGrandfatherSnapshot(storage, progress, 0)
  assert.ok(snap.sections.includes('setup'))
})

test('a snapshot taken under an old section id still opens the renamed section', () => {
  const storage = createMemoryStorage({ [GRANDFATHER_KEY]: JSON.stringify({ v: 1, takenAt: '2026-01-01T00:00:00.000Z', sections: ['pandas'] }) })
  const snap = readGrandfather(storage)!
  assert.equal(isGrandfathered(snap, 'files-ingestion'), true)
  assert.equal(isGrandfathered(snap, 'pandas'), true)
  assert.equal(isGrandfathered(null, 'files-ingestion'), false)
})

test('grandfathering writes only its own key, never the progress store', () => {
  const storage = createMemoryStorage({ 'python-ds-progress': '{"state":{},"version":1}' })
  ensureGrandfatherSnapshot(storage, progress, 0)
  assert.deepEqual(storage.keys().sort(), [GRANDFATHER_KEY, 'python-ds-progress'])
  assert.equal(storage.getItem('python-ds-progress'), '{"state":{},"version":1}')
})
