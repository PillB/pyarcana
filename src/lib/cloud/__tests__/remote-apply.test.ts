import test from 'node:test'
import assert from 'node:assert/strict'
import { useProgressStore } from '@/lib/progress-store'
import { isApplyingRemote, progressStoreAdapter } from '@/lib/cloud/progress-adapter'
import { ProgressSync } from '@/lib/cloud/progress-sync'
import { HandoffImporter } from '@/lib/cloud/handoff-import'
import { buildHandoffUrl } from '@/lib/cloud/handoff'
import { buildRemoteDoc, type ProgressState } from '@/lib/cloud/progress-merge'
import { localCompletion, surveyTrigger } from '@/lib/cloud/survey-ui'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'

const T0 = Date.parse('2026-09-29T12:00:00Z')
const EMPTY: ProgressState = { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false }

/** SurveyPrompt's listener, verbatim in its rule: what it would track as section_complete. */
function listen(): { seen: string[]; stop: () => void } {
  const seen: string[] = []
  const stop = useProgressStore.subscribe((next, prev) => {
    const added = localCompletion(prev.completedSections, next.completedSections, isApplyingRemote())
    if (added) seen.push(added)
  })
  return { seen, stop }
}

function reset(): void {
  useProgressStore.setState({ ...EMPTY })
}

function api(remote: ProgressState): ApiClient {
  const get = async () => ({ ok: true, status: 200, data: { ok: true, rev: 3, doc: buildRemoteDoc(remote, { 'sec:files-ingestion': { present: true, ts: T0 - 1000 } }) } }) as ApiResult<never>
  return {
    get,
    put: async () => ({ ok: true, status: 200, data: { ok: true, rev: 4 } }) as ApiResult<never>,
    post: async () => { throw new Error('unexpected POST') },
    patch: async () => { throw new Error('unexpected PATCH') },
    del: async () => { throw new Error('unexpected DELETE') },
  }
}

test('a pull of another device\'s completion is not a completion on this device (no section_complete, no CSAT)', async () => {
  reset()
  const l = listen()
  const sync = new ProgressSync({
    api: api({ ...EMPTY, completedSections: ['files-ingestion'] }),
    storage: createMemoryStorage(),
    store: progressStoreAdapter,
    owner: { get: () => 'acct_a', set: () => {} },
    now: () => T0,
    scheduler: { setTimeout: () => 0, clearTimeout: () => {} },
  })
  await sync.start('acct_a')
  sync.detach()
  l.stop()
  assert.deepEqual(useProgressStore.getState().completedSections, ['files-ingestion'], 'the pull did land')
  assert.deepEqual(l.seen, [])
  assert.equal(isApplyingRemote(), false, 'the flag is down again after the apply')
})

test('the #import= handoff is not a completion on this device either', () => {
  reset()
  const l = listen()
  const built = buildHandoffUrl('https://pyarcana.example', JSON.stringify({ state: { completedSections: ['files-ingestion'] }, version: 1 }))
  assert.ok(built.ok)
  const hash = new URL((built as { url: string }).url).hash
  const importer = new HandoffImporter({
    readHash: () => hash,
    currentHref: () => 'https://pyarcana.example/' + hash,
    replaceUrl: () => {},
    isImportTarget: () => true,
    store: progressStoreAdapter,
    storage: createMemoryStorage(),
    now: () => T0,
  })
  assert.equal(importer.run().status, 'imported')
  l.stop()
  assert.deepEqual(useProgressStore.getState().completedSections, ['files-ingestion'])
  assert.deepEqual(l.seen, [])
})

test('the learner completing a section here still counts, once', () => {
  reset()
  const l = listen()
  useProgressStore.getState().toggleSectionComplete('files-ingestion')
  useProgressStore.getState().toggleSectionComplete('files-ingestion')
  l.stop()
  assert.deepEqual(l.seen, ['files-ingestion'], 'the un-toggle adds nothing')
})

test('the CSAT trigger ignores a remote apply and fires for a local completion', () => {
  const prev = ['setup']
  const next = ['setup', 'files-ingestion']
  assert.equal(surveyTrigger({ kind: 'completed', prev, next, remote: true }), null)
  assert.deepEqual(surveyTrigger({ kind: 'completed', prev, next, remote: false }), { kind: 'section_csat', sectionId: 'files-ingestion' })
  assert.equal(surveyTrigger({ kind: 'completed', prev: next, next: prev, remote: false }), null)
})
