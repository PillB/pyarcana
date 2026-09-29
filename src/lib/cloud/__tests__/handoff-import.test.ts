import test from 'node:test'
import assert from 'node:assert/strict'
import { HandoffImporter, snapshotAfterHandoff, type HandoffImportDeps } from '@/lib/cloud/handoff-import'
import { buildHandoffUrl } from '@/lib/cloud/handoff'
import { GRANDFATHER_KEY, isGrandfathered, readGrandfather } from '@/lib/cloud/gate'
import { CHANGES_KEY, type ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage, type KeyValueStorage } from '@/lib/cloud/storage'

const CANON = 'https://pyarcana.example'
const T0 = Date.parse('2026-09-29T12:00:00Z')

function blank(patch: Partial<ProgressState> = {}): ProgressState {
  return { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...patch }
}

/** The fragment the old origin's banner builds for a learner who finished S08 there. */
function importHash(state: Partial<ProgressState>): string {
  const built = buildHandoffUrl(CANON, JSON.stringify({ state, version: 1 }))
  assert.ok(built.ok)
  return new URL((built as { url: string }).url).hash
}

function setup(opts: { hash: string; target?: boolean; local?: ProgressState; storage?: KeyValueStorage }) {
  let state = opts.local ?? blank()
  let hash = opts.hash
  const sets: Array<Partial<ProgressState>> = []
  const urls: string[] = []
  const storage = opts.storage ?? createMemoryStorage()
  const deps: HandoffImportDeps = {
    readHash: () => hash,
    currentHref: () => `${CANON}/${hash}`,
    replaceUrl: (url) => {
      urls.push(url)
      hash = ''
    },
    isImportTarget: (h) => (opts.target ?? true) && h.startsWith('#import='),
    store: {
      getState: () => state,
      setState: (patch) => {
        sets.push(patch)
        state = { ...state, ...patch }
      },
    },
    storage,
    now: () => T0,
  }
  return { importer: new HandoffImporter(deps), storage, sets, urls, getState: () => state }
}

test('first gated load via #import=: the imported sections are in the grandfather snapshot', () => {
  const t = setup({ hash: importHash({ completedSections: ['files-ingestion'], lastVisited: 'files-ingestion' }) })
  const snap = snapshotAfterHandoff(t.importer, t.storage, t.getState, T0)
  assert.ok(isGrandfathered(snap, 'files-ingestion'), 'S08 finished on the old origin stays open')
  assert.deepEqual(readGrandfather(t.storage)?.sections, snap.sections, 'the stored snapshot is the one returned')
  assert.deepEqual(t.getState().completedSections, ['files-ingestion'], 'the import itself is merged into progress')
})

test('the banner applying the import first and the snapshot second give one merge and the same snapshot', () => {
  const t = setup({ hash: importHash({ completedSections: ['files-ingestion'] }) })
  const first = t.importer.run()
  assert.deepEqual(first, { status: 'imported', added: 1 })
  const snap = snapshotAfterHandoff(t.importer, t.storage, t.getState, T0)
  assert.ok(isGrandfathered(snap, 'files-ingestion'))
  assert.equal(t.sets.length, 1, 'the import is applied once per load')
  assert.deepEqual(t.importer.run(), first, 'later callers get the same outcome')
})

test('the fragment is captured once and stripped; the notice is handed out once', () => {
  const t = setup({ hash: importHash({ completedSections: ['files-ingestion'] }) })
  t.importer.capture()
  t.importer.capture()
  assert.deepEqual(t.urls, ['/'], 'replaceState once, to the same path without the fragment')
  assert.equal(t.importer.notice(), null, 'no notice before the merge ran')
  t.importer.run()
  assert.deepEqual(t.importer.notice(), { status: 'imported', added: 1 })
  assert.equal(t.importer.notice(), null, 'a second effect run (StrictMode) shows no second toast')
  assert.ok(localStorageHasChanges(t.storage), 'the import is recorded in the change log so sync uploads it')
})

function localStorageHasChanges(storage: KeyValueStorage): boolean {
  const raw = storage.getItem(CHANGES_KEY)
  return raw !== null && raw.includes('sec:files-ingestion')
}

test('not an import target (old origin, flag off, no fragment): nothing merged, the address is left alone', () => {
  const t = setup({ hash: importHash({ completedSections: ['files-ingestion'] }), target: false })
  assert.deepEqual(t.importer.run(), { status: 'none' })
  assert.deepEqual(t.urls, [])
  assert.equal(t.sets.length, 0)
  const plain = setup({ hash: '#S08' })
  assert.deepEqual(plain.importer.run(), { status: 'none' })
  assert.deepEqual(plain.urls, [])
})

test('a hostile fragment fails closed: progress untouched, the snapshot holds only local work', () => {
  const t = setup({ hash: '#import=%%%not-base64', local: blank({ completedSections: ['setup'] }) })
  assert.deepEqual(t.importer.run(), { status: 'failed' })
  assert.deepEqual(t.urls, ['/'], 'even a bad fragment is removed from the address bar')
  assert.equal(t.sets.length, 0)
  const snap = snapshotAfterHandoff(t.importer, t.storage, t.getState, T0)
  assert.deepEqual(snap.sections, ['setup'])
})

test('a snapshot from an earlier gated load is not widened by a later import (first-load rule, stated trade-off)', () => {
  const storage = createMemoryStorage({ [GRANDFATHER_KEY]: JSON.stringify({ v: 1, takenAt: '2026-09-01T00:00:00.000Z', sections: [] }) })
  const t = setup({ hash: importHash({ completedSections: ['files-ingestion'] }), storage })
  const snap = snapshotAfterHandoff(t.importer, t.storage, t.getState, T0)
  assert.deepEqual(snap.sections, [])
  assert.deepEqual(t.getState().completedSections, ['files-ingestion'], 'the progress itself still arrives')
})
