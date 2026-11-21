/**
 * Theory parts read follow a signed-in learner to another device (owner request, 19 Nov 2026).
 *
 * Correct behaviour: a part ticked on one device is in the account's progress document as
 * `state.theoryParts` with a `tp:<section>:<part>` change entry, lands in the checkpoint store of
 * the next device that pulls, and an un-tick wins over an older tick. A learner with no part read
 * uploads the same bytes as before the field existed.
 *
 * Defects these tests are built to catch (each named in its message): a pull that drops the
 * parts; an un-tick resurrected by a union; a change entry that injects a part nobody holds; a
 * remote document that plants a malformed key; a copy of the document from before the field
 * existed wiping this device's parts; "Usar solo mi cuenta" discarding the other learner's parts
 * without an archive; an empty field costing every learner a write; the worst-case document
 * outgrowing what the worker stores.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { useProgressStore } from '@/lib/progress-store'
import { followProgressReset, THEORY_CHECKPOINTS_KEY, useTheoryCheckpoints } from '@/lib/theory-checkpoints'
import { isApplyingRemote, progressStoreAdapter } from '@/lib/cloud/progress-adapter'
import { archiveKey, archivePartsKey, DOC_MAX_BYTES, KEEPALIVE_MAX_BYTES, ProgressSync, type Scheduler } from '@/lib/cloud/progress-sync'
import {
  buildRemoteDoc,
  canonicalKey,
  diffChanges,
  hasProgress,
  mergeProgress,
  sanitizeChangeLog,
  tpKey,
  unionInto,
  type ChangeLog,
  type ProgressState,
} from '@/lib/cloud/progress-merge'
import { createMemoryStorage, type KeyValueStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { COURSE_SECTIONS } from '@/lib/course'
import { theoryParts } from '@/lib/course/theory-parts'
import { SUB_STEPS } from '@/lib/progress-store'
import { SECTION_ID_RENAMES, SECTION_ID_SCHEMA_VERSION } from '@/lib/section-id-migrations'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { storageDisclosure } from '@/components/account/CloudLegalSection'
import { t as translate, type Language } from '@/lib/i18n'

const NOW = Date.parse('2026-11-20T12:00:00Z')

function state(patch: Partial<ProgressState> = {}): ProgressState {
  return { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...patch }
}
const doc = (s: Record<string, unknown>, changes: Record<string, unknown> = {}) => ({ v: 1, sv: SECTION_ID_SCHEMA_VERSION, state: s, changes })

// --- the merge ---------------------------------------------------------------------------------

test('a part read on another device arrives here; one read here is kept', () => {
  const local = state({ theoryParts: { setup: ['intro'] } })
  const remote = doc({ theoryParts: { setup: ['S01-T1-A'], basics: ['intro'] } }, { 'tp:setup:S01-T1-A': { present: true, ts: NOW - 50 } })
  const r = mergeProgress(local, {}, remote, NOW)
  assert.deepEqual(r.state.theoryParts, { setup: ['intro', 'S01-T1-A'], basics: ['intro'] }, 'the pull dropped parts read on the other device, or this device’s own')
})

test('an un-tick wins over an older tick and loses to a newer one', () => {
  const remote = doc({ theoryParts: { setup: ['intro', 'S01-T1-A'] } }, { 'tp:setup:S01-T1-A': { present: true, ts: NOW - 5000 } })
  const unticked = mergeProgress(state({ theoryParts: { setup: ['intro'] } }), { 'tp:setup:S01-T1-A': { present: false, ts: NOW - 1000 } }, remote, NOW)
  assert.deepEqual(unticked.state.theoryParts, { setup: ['intro'] }, 'the un-tick made here was undone by the other device’s older tick')
  const older = mergeProgress(state({ theoryParts: { setup: ['intro'] } }), { 'tp:setup:S01-T1-A': { present: false, ts: NOW - 9000 } }, remote, NOW)
  assert.deepEqual(older.state.theoryParts, { setup: ['intro', 'S01-T1-A'] }, 'a tick made after the un-tick was lost')
  // The last part of a section un-ticked: no empty list is left behind for that section.
  const last = mergeProgress(state({ theoryParts: {} }), { 'tp:setup:intro': { present: false, ts: NOW - 1 } }, doc({ theoryParts: { setup: ['intro'] } }), NOW)
  assert.deepEqual(last.state.theoryParts, {}, 'a section with no part read kept an entry')
})

test('a change entry alone never adds a part that no copy holds', () => {
  const r = mergeProgress(state({ theoryParts: {} }), {}, doc({}, { 'tp:setup:S01-T1-A': { present: true, ts: NOW - 1 } }), NOW)
  assert.deepEqual(r.state.theoryParts, {}, 'a change entry injected a part')
})

test('a document from before the field existed never clears this device’s parts, and they are uploaded again', () => {
  const local = state({ completedSubSteps: { setup: ['theory'] }, theoryParts: { setup: ['intro', 'S01-T1-A'] } })
  const old = doc({ completedSubSteps: { setup: ['theory'] } })
  const r = mergeProgress(local, {}, old, NOW)
  assert.deepEqual(r.state.theoryParts, local.theoryParts, 'an older copy of the document wiped the parts read here')
  assert.notEqual(JSON.stringify(buildRemoteDoc(r.state, r.changes)), JSON.stringify(old), 'the merged document equals the old one: the parts would never be uploaded')
})

test('a hostile remote document cannot plant a malformed section or part', () => {
  const [[oldId, newId]] = Object.entries(SECTION_ID_RENAMES)
  const hostile = doc(
    {
      theoryParts: {
        setup: ['intro', 'bad key', 'a:b', '__proto__x'.repeat(8), 7, null, 'S01-T1-B#2'],
        'Not A Slug': ['intro'],
        __proto__: ['intro'],
        basics: 'intro',
        [oldId]: ['intro'],
      },
    },
    { 'tp:setup:a:b': { present: true, ts: NOW }, 'tp:Not A Slug:intro': { present: true, ts: NOW }, [`tp:${oldId}:intro`]: { present: true, ts: NOW - 1 }, 'tp:setup:intro': { present: true, ts: NOW + 7 * 86_400_000 } }
  )
  const r = mergeProgress(state({ theoryParts: {} }), {}, hostile, NOW)
  assert.deepEqual(r.state.theoryParts, { setup: ['intro', 'S01-T1-B#2'], [newId]: ['intro'] }, 'a malformed key got through, or a renamed section’s parts were not carried to its new id')
  assert.deepEqual(Object.keys(r.changes), [`tp:${newId}:intro`], 'a malformed or far-future change entry was kept, or the renamed one was not canonicalised')
  assert.equal(Object.prototype.hasOwnProperty.call(Object.prototype, 'intro'), false)
})

test('a tick and an un-tick are recorded as changes, including a part key with «#2»', () => {
  const prev = state({ theoryParts: { setup: ['intro'] } })
  const next = state({ theoryParts: { setup: ['S01-T1-B#2'] } })
  const diff = diffChanges(prev, next, 42)
  assert.deepEqual(diff, { 'tp:setup:S01-T1-B#2': { present: true, ts: 42 }, 'tp:setup:intro': { present: false, ts: 42 } })
  // …and those entries survive being stored and read back (the change log is sanitized on load).
  assert.deepEqual(sanitizeChangeLog(JSON.parse(JSON.stringify(diff)), NOW), diff, 'a part’s change entry does not survive the change log’s own sanitizer: the un-tick would not propagate')
  assert.equal(canonicalKey(tpKey('setup', 'S01-T1-B#2')), 'tp:setup:S01-T1-B#2')
  assert.equal(canonicalKey('tp:setup'), null)
  assert.equal(canonicalKey('tp:setup:bad key'), null)
})

test('no part read: the uploaded document is byte-identical to the one before the field existed', () => {
  const s = state({ completedSections: ['setup'], completedSubSteps: { setup: ['theory'] }, quizScores: { setup: 80 } })
  const changes: ChangeLog = { 'sec:setup': { present: true, ts: 3 } }
  const before = JSON.stringify(buildRemoteDoc(s, changes))
  assert.equal(before.includes('theoryParts'), false, 'a state without parts uploads a theoryParts field')
  assert.equal(JSON.stringify(buildRemoteDoc({ ...s, theoryParts: {} }, changes)), before, 'an empty theoryParts changed the document: every learner would spend a write on it')
  assert.equal(JSON.stringify(buildRemoteDoc({ ...s, theoryParts: { setup: [] } }, changes)), before, 'an empty list changed the document')
  const withParts = buildRemoteDoc({ ...s, theoryParts: { setup: ['intro'] } }, changes)
  assert.deepEqual((withParts.state as ProgressState).theoryParts, { setup: ['intro'] })
  // Round trip: what is uploaded merges back to itself.
  const back = mergeProgress({ ...s, theoryParts: { setup: ['intro'] } }, changes, JSON.parse(JSON.stringify(withParts)), NOW)
  assert.deepEqual(back.state.theoryParts, { setup: ['intro'] })
})

test('parts alone count as local work, and an imported copy only adds', () => {
  assert.equal(hasProgress(state({ theoryParts: { setup: ['intro'] } })), true, 'a device holding only another learner’s parts would be merged into the account without asking')
  assert.equal(hasProgress(state({ theoryParts: { setup: [] } })), false)
  const r = unionInto(state({ theoryParts: { setup: ['intro'] } }), { 'tp:setup:S01-T1-A': { present: false, ts: NOW - 10 } }, { theoryParts: { setup: ['S01-T1-A'], basics: ['intro'] } }, NOW)
  assert.deepEqual(r.state.theoryParts, { setup: ['intro', 'S01-T1-A'], basics: ['intro'] })
  assert.equal(r.changes['tp:setup:S01-T1-A'].present, true, 'the restored part did not win over its older un-tick')
})

test('the whole course read and done still fits what the worker stores', () => {
  const full = state({ completedSections: COURSE_SECTIONS.map((s) => s.id), theoryParts: {}, startDate: new Date(NOW).toISOString() })
  const changes: ChangeLog = {}
  let parts = 0
  for (const s of COURSE_SECTIONS) {
    full.completedSubSteps[s.id] = [...SUB_STEPS]
    full.quizScores[s.id] = 100
    full.theoryParts![s.id] = theoryParts(s.theory).map((p) => p.key)
    parts += full.theoryParts![s.id].length
  }
  Object.assign(changes, diffChanges(state(), full, NOW))
  const size = () => Buffer.byteLength(JSON.stringify({ doc: buildRemoteDoc(full, changes), baseRev: 1 }))
  // Everything done and read, nothing bookmarked: what a learner who finishes the course uploads.
  // Under the keepalive budget, the upload made as the page closes is allowed to outlive the page.
  assert.ok(
    size() <= KEEPALIVE_MAX_BYTES,
    `a finished course uploads ${size()} bytes, over the ${KEEPALIVE_MAX_BYTES} a closing page may send: the last change before closing the tab waits for the next visit. ` +
      'Next step: shorten the tp change entries (progress-merge.ts) or drop the parts of a section whose Teoría step is done.'
  )
  // The extreme: every section bookmarked as well.
  full.bookmarks = COURSE_SECTIONS.map((s) => s.id)
  Object.assign(changes, diffChanges(state(), full, NOW))
  const bytes = size()
  assert.ok(parts >= COURSE_SECTIONS.length * 3, `only ${parts} parts in the course: theoryParts() no longer splits the theory`)
  assert.ok(bytes < DOC_MAX_BYTES / 2, `the fullest document is ${bytes} bytes; the worker refuses ${DOC_MAX_BYTES} and half of it is the margin for longer part keys`)
})

// --- the two stores behind one adapter, and the sync that drives them ---------------------------

const ok = (data: Record<string, unknown>): ApiResult<Record<string, unknown>> => ({ ok: true, status: 200, data: { ok: true, ...data } })

function manualScheduler(): Scheduler & { run: () => void } {
  const timers = new Map<number, () => void>()
  let id = 0
  return {
    setTimeout: (fn) => { timers.set(++id, fn); return id },
    clearTimeout: (h) => { timers.delete(h as number) },
    run: () => { const fns = [...timers.values()]; timers.clear(); fns.forEach((f) => f()) },
  }
}

function rig(opts: { remote: { rev: number; doc: unknown }; owner?: string | null; storage?: KeyValueStorage; local?: Partial<ProgressState> }) {
  const { theoryParts: localParts, ...localProgress } = opts.local ?? {}
  useProgressStore.setState({ ...state(), ...localProgress })
  useTheoryCheckpoints.setState({ read: localParts ?? {} })
  const puts: Array<{ doc: { state: ProgressState; changes: ChangeLog }; baseRev: number }> = []
  let owner = opts.owner === undefined ? 'acct_a' : opts.owner
  const api: ApiClient = {
    get: async () => ok(opts.remote) as never,
    put: async (_path, body) => { puts.push(JSON.parse(JSON.stringify(body))); return ok({ rev: opts.remote.rev + puts.length }) as never },
    post: async () => { throw new Error('unexpected POST') },
    patch: async () => { throw new Error('unexpected PATCH') },
    del: async () => { throw new Error('unexpected DELETE') },
  }
  const scheduler = manualScheduler()
  const storage = opts.storage ?? createMemoryStorage()
  const sync = new ProgressSync({ api, storage, store: progressStoreAdapter, owner: { get: () => owner, set: (id) => { owner = id } }, now: () => NOW, scheduler })
  return { sync, puts, scheduler, storage, owner: () => owner }
}
const settle = () => new Promise((r) => setTimeout(r, 0))

test('ticking a part on this device uploads it, with its change entry, after the debounce', async () => {
  const t = rig({ remote: { rev: 1, doc: buildRemoteDoc(state(), {}) } })
  await t.sync.start('acct_a')
  assert.equal(t.puts.length, 0, 'nothing to upload yet')
  useTheoryCheckpoints.getState().toggle('setup', 'intro')
  useTheoryCheckpoints.getState().toggle('setup', 'S01-T1-A')
  assert.equal(t.puts.length, 0, 'uploaded before the debounce: every tick would cost a write')
  t.scheduler.run()
  await settle()
  t.sync.detach()
  assert.equal(t.puts.length, 1, 'a ticked part was never uploaded: it would not reach another device')
  assert.deepEqual(t.puts[0].doc.state.theoryParts, { setup: ['intro', 'S01-T1-A'] })
  assert.deepEqual(Object.keys(t.puts[0].doc.changes).sort(), ['tp:setup:S01-T1-A', 'tp:setup:intro'])
  assert.equal(t.puts[0].doc.changes['tp:setup:intro'].present, true)
})

test('a pull lands the account’s parts in the checkpoint store, as a remote write, and uploads nothing back', async () => {
  const remote = buildRemoteDoc(state({ theoryParts: { setup: ['intro', 'S01-T1-A'] } }), { 'tp:setup:intro': { present: true, ts: NOW - 9 }, 'tp:setup:S01-T1-A': { present: true, ts: NOW - 8 } })
  const t = rig({ remote: { rev: 4, doc: remote } })
  const seen: boolean[] = []
  const stop = useTheoryCheckpoints.subscribe(() => seen.push(isApplyingRemote()))
  assert.equal(await t.sync.start('acct_a'), 'synced')
  stop()
  assert.deepEqual(useTheoryCheckpoints.getState().read, { setup: ['intro', 'S01-T1-A'] }, 'the parts read on the other device did not arrive')
  assert.deepEqual(seen, [true], 'the parts were written more than once, or not marked as a remote write')
  t.scheduler.run()
  await settle()
  assert.equal(t.puts.length, 0, 'a pull that changed nothing on the server was answered with an upload')

  // A second pull of the same document leaves the store untouched: no re-render, no storage write.
  const again: number[] = []
  const stopAgain = useTheoryCheckpoints.subscribe(() => again.push(1))
  await t.sync.pull(true)
  stopAgain()
  t.sync.detach()
  assert.deepEqual(again, [], 'an unchanged pull rewrote the checkpoint store')
})

test('after detach, a tick is no longer recorded', async () => {
  const t = rig({ remote: { rev: 1, doc: null } })
  await t.sync.start('acct_a')
  t.sync.detach()
  useTheoryCheckpoints.getState().toggle('setup', 'intro')
  t.scheduler.run()
  await settle()
  assert.equal(t.puts.length, 0, 'the checkpoint listener outlived detach()')
  assert.equal((t.storage.getItem('pyarcana-cloud-changes-v1') ?? '').includes('tp:'), false, 'a tick after detach reached the change log')
})

test('«Usar solo mi cuenta» archives this browser’s parts byte for byte, adopts the account’s, and the archive restores them', async () => {
  const rawParts = '{"state":{"read":{"setup":["intro","S01-T1-A"]}},"version":1}'
  const rawProgress = '{"state":{"completedSections":["setup"]},"version":1}'
  const storage = createMemoryStorage({ 'python-ds-progress': rawProgress, [THEORY_CHECKPOINTS_KEY]: rawParts })
  const account = buildRemoteDoc(state({ theoryParts: { basics: ['intro'] } }), { 'tp:basics:intro': { present: true, ts: NOW - 5 } })
  const t = rig({ remote: { rev: 9, doc: account }, owner: 'acct_b', storage, local: { completedSections: ['setup'], theoryParts: { setup: ['intro', 'S01-T1-A'] } } })
  // The reset follower is mounted in the app: the account's parts must be what is left after it runs.
  const stopReset = followProgressReset(useProgressStore)
  assert.equal(await t.sync.start('acct_a'), 'needs_choice', 'a device holding another account’s work was merged without asking')
  assert.equal(await t.sync.resolveOwnerChoice('use_account'), 'synced')
  const key = archiveKey('acct_b', NOW)
  assert.equal(storage.getItem(archivePartsKey(key)), rawParts, 'the other learner’s parts were replaced without an exact archive')
  assert.deepEqual(useTheoryCheckpoints.getState().read, { basics: ['intro'] }, 'this browser kept the previous owner’s parts, or lost the account’s')
  assert.deepEqual(useProgressStore.getState().completedSections, [])

  const restored = t.sync.restoreArchive(key)
  stopReset()
  t.sync.detach()
  assert.equal(restored.ok, true)
  assert.deepEqual(useTheoryCheckpoints.getState().read, { basics: ['intro'], setup: ['intro', 'S01-T1-A'] }, 'restoring the archive did not bring its parts back')
})

test('if the parts cannot be archived, nothing is replaced', async () => {
  const base = createMemoryStorage({ 'python-ds-progress': '{"state":{"completedSections":["setup"]},"version":1}', [THEORY_CHECKPOINTS_KEY]: '{"state":{"read":{"setup":["intro"]}},"version":1}' })
  const storage: KeyValueStorage = { ...base, setItem: (k, v) => { if (k.endsWith('.parts')) throw new Error('QuotaExceededError'); base.setItem(k, v) } }
  const t = rig({ remote: { rev: 1, doc: buildRemoteDoc(state(), {}) }, owner: 'acct_b', storage, local: { completedSections: ['setup'], theoryParts: { setup: ['intro'] } } })
  await t.sync.start('acct_a')
  assert.equal(await t.sync.resolveOwnerChoice('use_account'), 'error')
  t.sync.detach()
  assert.equal(t.sync.lastError, 'archive_failed')
  assert.deepEqual(useTheoryCheckpoints.getState().read, { setup: ['intro'] }, 'the parts were replaced although their archive failed')
  assert.equal(t.owner(), 'acct_b')
})

test('the browser-storage list a learner reads names the checkpoint record and its archive, in every language', () => {
  const items = storageDisclosure({ ...structuredClone(CLOUD_CONFIG), launchStage: 'beta' }).flatMap((g) => g.items)
  const item = items.find((i) => i.key === THEORY_CHECKPOINTS_KEY)
  assert.ok(item, `«${THEORY_CHECKPOINTS_KEY}» is written to this browser and uploaded to the account, and the storage list does not name it (CloudLegalSection.tsx)`)
  for (const lang of ['es-PE', 'es-ES', 'en'] as Language[]) {
    const text = translate(item.text, lang)
    assert.notEqual(text, item.text, `${item.text} has no ${lang} text: the list would show the key name`)
  }
  // The parts archive sits under the prefix the list already names.
  const archive = archivePartsKey(archiveKey('acct_b', NOW))
  assert.ok(items.some((i) => i.key.endsWith('*') && archive.startsWith(i.key.slice(0, -1))), `the archive key «${archive}» is not covered by any listed prefix`)
})
