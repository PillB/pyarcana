import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ProgressSync,
  decideOwnerAction,
  archiveKey,
  listArchives,
  PUSH_DEBOUNCE_MS,
  type ProgressStoreAdapter,
  type Scheduler,
} from '@/lib/cloud/progress-sync'
import { buildRemoteDoc, CHANGES_KEY, type ChangeLog, type ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage, type KeyValueStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { signOutAccount, type ActionResult } from '@/lib/cloud/account-api'

const PROGRESS_KEY = 'python-ds-progress'
const T0 = Date.parse('2026-09-28T12:00:00Z')

function blank(patch: Partial<ProgressState> = {}): ProgressState {
  return { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...patch }
}

function fakeStore(initial: ProgressState): ProgressStoreAdapter & { sets: Array<Partial<ProgressState>> } {
  let state = initial
  const listeners = new Set<(n: ProgressState, p: ProgressState) => void>()
  const sets: Array<Partial<ProgressState>> = []
  return {
    sets,
    getState: () => state,
    setState: (patch) => {
      const prev = state
      state = { ...state, ...patch }
      sets.push(patch)
      for (const l of listeners) l(state, prev)
    },
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

type Handler = (body: unknown, opts?: { keepalive?: boolean }) => ApiResult<Record<string, unknown>>
function fakeApi(handlers: { get?: Handler[]; put?: Handler[] }) {
  const calls: Array<{ method: string; path: string; body?: unknown; keepalive?: boolean }> = []
  const take = (list: Handler[] | undefined, method: string): Handler => {
    const h = list?.shift()
    if (!h) throw new Error(`unexpected ${method}`)
    return h
  }
  const api: ApiClient = {
    get: async (path, opts) => {
      calls.push({ method: 'GET', path, keepalive: opts?.keepalive })
      return take(handlers.get, 'GET')(undefined, opts) as never
    },
    put: async (path, body, opts) => {
      calls.push({ method: 'PUT', path, body: JSON.parse(JSON.stringify(body)), keepalive: opts?.keepalive })
      return take(handlers.put, 'PUT')(body, opts) as never
    },
    post: async () => { throw new Error('unexpected POST') },
    patch: async () => { throw new Error('unexpected PATCH') },
    del: async () => { throw new Error('unexpected DELETE') },
  }
  return { api, calls }
}

const ok = (data: Record<string, unknown>): ApiResult<Record<string, unknown>> => ({ ok: true, status: 200, data: { ok: true, ...data } })
/** The worker's 409 body (workers/billing/src/progress.mjs): the winner's copy under `server`. */
const conflict = (server?: { rev: number; doc: unknown }): ApiResult<Record<string, unknown>> => ({
  ok: false,
  status: 409,
  reason: 'conflict',
  data: { ok: false, reason: 'conflict', ...(server ? { server: { ...server, updatedAt: T0 } } : {}) },
})
const network = (): ApiResult<Record<string, unknown>> => ({ ok: false, status: 0, reason: 'network', data: null })

function manualScheduler(): Scheduler & { run: () => void; pending: () => number } {
  const timers = new Map<number, () => void>()
  let id = 0
  return {
    setTimeout: (fn) => {
      timers.set(++id, fn)
      return id
    },
    clearTimeout: (h) => {
      timers.delete(h as number)
    },
    run: () => {
      const fns = [...timers.values()]
      timers.clear()
      fns.forEach((f) => f())
    },
    pending: () => timers.size,
  }
}

function setup(opts: { local?: ProgressState; owner?: string | null; storage?: KeyValueStorage; get?: Handler[]; put?: Handler[] }) {
  const storage = opts.storage ?? createMemoryStorage()
  const store = fakeStore(opts.local ?? blank())
  let owner = opts.owner ?? null
  let clock = T0
  const scheduler = manualScheduler()
  const { api, calls } = fakeApi({ get: opts.get, put: opts.put })
  const sync = new ProgressSync({
    api,
    storage,
    store,
    owner: { get: () => owner, set: (id) => { owner = id } },
    now: () => clock,
    scheduler,
  })
  return { sync, store, storage, calls, scheduler, owner: () => owner, tick: (ms: number) => { clock += ms } }
}

const flushMicrotasks = () => new Promise((r) => setTimeout(r, 0))

// --- owner rule ------------------------------------------------------------------------------

test('owner rule: empty or same owner merges; a different owner asks only when there is local work', () => {
  assert.equal(decideOwnerAction(null, 'acct_a', true), 'merge')
  assert.equal(decideOwnerAction('acct_a', 'acct_a', true), 'merge')
  assert.equal(decideOwnerAction('acct_b', 'acct_a', true), 'ask')
  assert.equal(decideOwnerAction('acct_b', 'acct_a', false), 'merge')
})

test('first sign-in on a device with progress uploads it and claims the device', async () => {
  const local = blank({ completedSections: ['setup'], completedSubSteps: { setup: ['theory'] } })
  const t = setup({ local, get: [() => ok({ rev: 0, doc: null })], put: [() => ok({ rev: 1 })] })
  const status = await t.sync.start('acct_a')
  assert.equal(status, 'synced')
  assert.equal(t.owner(), 'acct_a')
  const put = t.calls.find((c) => c.method === 'PUT')!
  const body = put.body as { doc: { state: ProgressState }; baseRev: number }
  assert.equal(body.baseRev, 0)
  assert.deepEqual(body.doc.state.completedSubSteps, { setup: ['theory'] })
  assert.equal(put.keepalive, false)
})

test('same owner: remote progress is merged in and nothing is pushed when both already agree', async () => {
  const remoteState = blank({ completedSections: ['setup', 'basics'] })
  const doc = buildRemoteDoc(remoteState, {})
  const t = setup({ local: blank({ completedSections: ['setup'] }), owner: 'acct_a', get: [() => ok({ rev: 7, doc })] })
  assert.equal(await t.sync.start('acct_a'), 'synced')
  assert.deepEqual(t.store.getState().completedSections, ['setup', 'basics'])
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 0)
})

test('a different owner with local work waits for the learner: nothing merged, pushed or claimed', async () => {
  const local = blank({ completedSections: ['setup'] })
  const t = setup({ local, owner: 'acct_b', get: [() => ok({ rev: 3, doc: buildRemoteDoc(blank({ completedSections: ['basics'] }), {}) })] })
  assert.equal(await t.sync.start('acct_a'), 'needs_choice')
  assert.equal(t.store.sets.length, 0)
  assert.equal(t.owner(), 'acct_b')
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 0)
})

test('"Unir" merges both and claims the device', async () => {
  const t = setup({
    local: blank({ completedSections: ['setup'] }),
    owner: 'acct_b',
    get: [() => ok({ rev: 3, doc: buildRemoteDoc(blank({ completedSections: ['basics'] }), {}) })],
    put: [() => ok({ rev: 4 })],
  })
  await t.sync.start('acct_a')
  assert.equal(await t.sync.resolveOwnerChoice('merge'), 'synced')
  assert.deepEqual(t.store.getState().completedSections, ['setup', 'basics'])
  assert.equal(t.owner(), 'acct_a')
  assert.equal((t.calls.find((c) => c.method === 'PUT')!.body as { baseRev: number }).baseRev, 3)
})

test('"Usar solo mi cuenta" archives the stored progress byte-for-byte, then adopts the account copy', async () => {
  const raw = '{"state":{"completedSections":["setup"],"futureField":{"kept":true}},   "version":1}'
  const storage = createMemoryStorage({ [PROGRESS_KEY]: raw })
  const remote = blank({ completedSections: ['basics'], quizScores: { basics: 80 } })
  const t = setup({
    storage,
    local: blank({ completedSections: ['setup'], isHydratedFromServer: true }),
    owner: 'acct_b',
    get: [() => ok({ rev: 9, doc: buildRemoteDoc(remote, { 'sec:basics': { present: true, ts: T0 - 5 } }) })],
  })
  await t.sync.start('acct_a')
  assert.equal(await t.sync.resolveOwnerChoice('use_account'), 'synced')
  const key = archiveKey('acct_b', T0)
  assert.equal(storage.getItem(key), raw, 'archive must be the exact stored bytes')
  assert.equal(storage.getItem(PROGRESS_KEY), raw, 'sync never writes python-ds-progress itself')
  assert.deepEqual(t.store.getState().completedSections, ['basics'])
  assert.deepEqual(t.store.getState().quizScores, { basics: 80 })
  assert.equal(t.store.getState().isHydratedFromServer, true)
  assert.equal(t.owner(), 'acct_a')
  assert.deepEqual(listArchives(storage).map((a) => [a.key, a.ownerId, a.ts]), [[key, 'acct_b', T0]])
})

test('if the archive cannot be written, the local progress is not replaced', async () => {
  const base = createMemoryStorage({ [PROGRESS_KEY]: '{"state":{"completedSections":["setup"]},"version":1}' })
  const storage: KeyValueStorage = {
    ...base,
    setItem: (k, v) => {
      if (k.startsWith('python-ds-progress.archive.')) throw new Error('QuotaExceededError')
      base.setItem(k, v)
    },
  }
  const t = setup({ storage, local: blank({ completedSections: ['setup'] }), owner: 'acct_b', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })] })
  await t.sync.start('acct_a')
  assert.equal(await t.sync.resolveOwnerChoice('use_account'), 'error')
  assert.equal(t.sync.lastError, 'archive_failed')
  assert.deepEqual(t.store.getState().completedSections, ['setup'])
  assert.equal(t.store.sets.length, 0)
  assert.equal(t.owner(), 'acct_b')
})

// --- push ------------------------------------------------------------------------------------

test('changes are pushed once, 5 s after the last one (debounce)', async () => {
  const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [() => ok({ rev: 2 })] })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  t.store.setState({ completedSubSteps: { setup: ['theory'] } })
  t.store.setState({ bookmarks: ['setup'] })
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 0)
  assert.equal(t.scheduler.pending(), 1)
  t.scheduler.run()
  await flushMicrotasks()
  const puts = t.calls.filter((c) => c.method === 'PUT')
  assert.equal(puts.length, 1)
  const doc = (puts[0].body as { doc: { state: ProgressState; changes: ChangeLog } }).doc
  assert.deepEqual(doc.state.bookmarks, ['setup'])
  assert.deepEqual(Object.keys(doc.changes).sort(), ['bm:setup', 'sec:setup', 'sub:setup:theory'])
  assert.equal(t.sync.status, 'synced')
  assert.equal(PUSH_DEBOUNCE_MS, 5000)
})

test('a 409 re-merges the server copy and retries; both devices\' work survives', async () => {
  const serverNow = buildRemoteDoc(blank({ completedSections: ['basics'] }), { 'sec:basics': { present: true, ts: T0 - 1 } })
  const t = setup({
    owner: 'acct_a',
    get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })],
    put: [() => conflict({ rev: 2, doc: serverNow }), () => ok({ rev: 3 })],
  })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.pushNow(), 'synced')
  assert.deepEqual(t.calls.map((c) => c.method), ['GET', 'PUT', 'PUT'], 'the server copy in the 409 body needs no re-pull')
  const puts = t.calls.filter((c) => c.method === 'PUT')
  assert.equal(puts.length, 2)
  const second = puts[1].body as { doc: { state: ProgressState }; baseRev: number }
  assert.equal(second.baseRev, 2)
  assert.deepEqual(second.doc.state.completedSections.sort(), ['basics', 'setup'])
  assert.deepEqual(t.store.getState().completedSections.sort(), ['basics', 'setup'])
})

test('a 409 without the server copy re-pulls it', async () => {
  const t = setup({
    owner: 'acct_a',
    get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) }), () => ok({ rev: 5, doc: buildRemoteDoc(blank({ bookmarks: ['basics'] }), {}) })],
    put: [() => conflict(), () => ok({ rev: 6 })],
  })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.pushNow(), 'synced')
  assert.deepEqual(t.store.getState().bookmarks, ['basics'])
  assert.equal(t.calls.filter((c) => c.method === 'GET').length, 2)
})

test('conflicts stop after 3 retries (4 attempts) and report conflict', async () => {
  const always = () => conflict({ rev: 2, doc: buildRemoteDoc(blank(), {}) })
  const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [always, always, always, always] })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.pushNow(), 'conflict')
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 4)
})

test('page hide flushes with keepalive; a doc over 64 KiB is flushed without it', async () => {
  const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [() => ok({ rev: 2 }), () => ok({ rev: 3 })] })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.flush(), 'synced')
  assert.equal(t.scheduler.pending(), 0, 'the debounce timer is cancelled by the flush')
  const big: Record<string, string[]> = {}
  for (let i = 0; i < 400; i++) big[`section-${i}`] = ['theory', 'ido', 'wedo']
  t.store.setState({ completedSubSteps: big })
  assert.equal(await t.sync.flush(), 'synced')
  const puts = t.calls.filter((c) => c.method === 'PUT')
  assert.equal(puts[0].keepalive, true)
  assert.equal(puts[1].keepalive, false)
})

test('a 409 during the page-hide flush retries from the 409 body, still with keepalive', async () => {
  const serverNow = buildRemoteDoc(blank({ bookmarks: ['basics'] }), { 'bm:basics': { present: true, ts: T0 - 1 } })
  const t = setup({
    owner: 'acct_a',
    get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })],
    put: [() => conflict({ rev: 2, doc: serverNow }), () => ok({ rev: 3 })],
  })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.flush(), 'synced')
  const after = t.calls.slice(1)
  assert.deepEqual(after.map((c) => `${c.method}:${c.keepalive}`), ['PUT:true', 'PUT:true'])
  const second = after[1].body as { doc: { state: ProgressState }; baseRev: number }
  assert.equal(second.baseRev, 2)
  assert.deepEqual(second.doc.state.bookmarks, ['basics'])
})

test('a 409 during the flush without a server copy re-pulls with keepalive, so the unload does not cancel it', async () => {
  const t = setup({
    owner: 'acct_a',
    get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) }), () => ok({ rev: 4, doc: buildRemoteDoc(blank(), {}) })],
    put: [() => conflict(), () => ok({ rev: 5 })],
  })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.flush(), 'synced')
  assert.deepEqual(t.calls.slice(1).map((c) => `${c.method}:${c.keepalive}`), ['PUT:true', 'GET:true', 'PUT:true'])
})

test('a doc over the 256 KiB server cap is not sent', async () => {
  const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })] })
  await t.sync.start('acct_a')
  const big: Record<string, string[]> = {}
  for (let i = 0; i < 6000; i++) big[`section-${i}`] = ['theory', 'ido', 'wedo']
  t.store.setState({ completedSubSteps: big })
  assert.equal(await t.sync.pushNow(), 'too_large')
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 0)
})

test('sign-out flushes first, keeps local progress, and stops pushing', async () => {
  const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [() => ok({ rev: 2 })] })
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  await t.sync.signOut()
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 1)
  assert.deepEqual(t.store.getState().completedSections, ['setup'])
  assert.equal(t.sync.status, 'signed_out')
  t.store.setState({ completedSections: ['setup', 'basics'] })
  assert.equal(t.scheduler.pending(), 0)
})

test('an un-toggle made while signed out is remembered and wins at the next sign-in', async () => {
  const storage = createMemoryStorage()
  const t = setup({
    storage,
    owner: 'acct_a',
    local: blank({ completedSections: ['setup', 'basics'] }),
    get: [() => ok({ rev: 4, doc: buildRemoteDoc(blank({ completedSections: ['setup', 'basics'] }), { 'sec:basics': { present: true, ts: T0 - 10_000 } }) })],
    put: [() => ok({ rev: 5 })],
  })
  t.sync.attach()
  t.store.setState({ completedSections: ['setup'] })
  assert.deepEqual(JSON.parse(storage.getItem(CHANGES_KEY)!)['sec:basics'], { present: false, ts: T0 })
  await t.sync.start('acct_a')
  assert.deepEqual(t.store.getState().completedSections, ['setup'])
  const put = t.calls.find((c) => c.method === 'PUT')!.body as { doc: { state: ProgressState } }
  assert.deepEqual(put.doc.state.completedSections, ['setup'])
})

test('applying a merge does not stamp new change entries', async () => {
  const storage = createMemoryStorage()
  const t = setup({ storage, owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank({ completedSections: ['basics'] }), {}) })] })
  await t.sync.start('acct_a')
  assert.deepEqual(t.store.getState().completedSections, ['basics'])
  assert.deepEqual(JSON.parse(storage.getItem(CHANGES_KEY) ?? '{}'), {})
  assert.equal(t.scheduler.pending(), 0, 'a merge from the server is not a local edit, so nothing is queued')
})

test('an empty account never clears the device: local work is kept and uploaded', async () => {
  const local = blank({ completedSections: ['setup'], quizScores: { setup: 70 } })
  const t = setup({ local, owner: 'acct_a', get: [() => ok({ rev: 0, doc: null })], put: [() => ok({ rev: 1 })] })
  await t.sync.start('acct_a')
  assert.deepEqual(t.store.getState(), local)
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 1)
})

test('an unreadable server copy is left alone: no merge, no overwrite', async () => {
  const t = setup({ local: blank({ completedSections: ['setup'] }), owner: 'acct_a', get: [() => ok({ rev: 2, doc: { v: 2, state: {} } })] })
  assert.equal(await t.sync.start('acct_a'), 'remote_unreadable')
  assert.equal(t.store.sets.length, 0)
  assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 0)
})

test('offline pull leaves everything as it was', async () => {
  const local = blank({ completedSections: ['setup'] })
  const t = setup({ local, owner: 'acct_a', get: [network] })
  assert.equal(await t.sync.start('acct_a'), 'offline')
  assert.deepEqual(t.store.getState(), local)
  assert.equal(t.owner(), 'acct_a')
})

test('restoring an archive merges it back in and keeps the archive', async () => {
  const archived = '{"state":{"completedSections":["numpy"],"completedSubSteps":{"setup":["quiz"]},"quizScores":{"setup":95}},"version":0}'
  const key = archiveKey('acct_b', T0 - 1000)
  const storage = createMemoryStorage({ [key]: archived })
  const t = setup({ storage, owner: 'acct_a', local: blank({ completedSections: ['setup'], quizScores: { setup: 60 } }), get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank({ completedSections: ['setup'], quizScores: { setup: 60 } }), {}) })], put: [() => ok({ rev: 2 })] })
  await t.sync.start('acct_a')
  const r = t.sync.restoreArchive(key)
  assert.deepEqual(r, { ok: true, added: 2 })
  assert.deepEqual(t.store.getState().completedSections, ['setup', 'collections'])
  assert.deepEqual(t.store.getState().completedSubSteps, { setup: ['quiz'] })
  assert.deepEqual(t.store.getState().quizScores, { setup: 95 })
  assert.equal(storage.getItem(key), archived)
  assert.equal(t.scheduler.pending(), 1, 'the restored items are queued for upload')
  assert.deepEqual(t.sync.restoreArchive('python-ds-progress.archive.x.1'), { ok: false, added: 0 })
})

test('archive keys are only ever the archive namespace, never the progress key', () => {
  assert.equal(archiveKey('acct_b', 123), 'python-ds-progress.archive.acct_b.123')
  assert.equal(archiveKey('../../evil', 1), 'python-ds-progress.archive.unknown.1')
  const storage = createMemoryStorage({ [PROGRESS_KEY]: '{}', 'python-ds-progress.archive.acct_b.10': '{}', 'python-ds-progress.archive.bad key.x': '{}' })
  assert.deepEqual(listArchives(storage).map((a) => a.key), ['python-ds-progress.archive.acct_b.10'])
})

// --- sign-out through the account panel (runtime.signOutCloud -> account-api.signOutAccount) ---------

const logoutFailed = (status: number): ActionResult => ({ ok: false, status, reason: status === 0 ? 'network' : `http_${status}`, error: { key: 'account.error.unavailable' } })

test('a failed logout (network or 5xx) keeps sync on for the still-signed-in account', async () => {
  for (const status of [0, 503]) {
    const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [() => ok({ rev: 2 }), () => ok({ rev: 3 })] })
    await t.sync.start('acct_a')
    t.store.setState({ completedSections: ['setup'] })
    const order: string[] = []
    const r = await signOutAccount({
      sync: t.sync,
      request: async () => (order.push(`logout after ${t.calls.filter((c) => c.method === 'PUT').length} PUT`), logoutFailed(status)),
      onSignedOut: () => void order.push('ended'),
    })
    assert.equal(r.ok, false)
    assert.deepEqual(order, ['logout after 1 PUT'], 'the flush went first and the session was not ended')
    assert.notEqual(t.sync.status, 'signed_out')
    t.store.setState({ completedSections: ['setup', 'basics'] })
    t.scheduler.run()
    await flushMicrotasks()
    const puts = t.calls.filter((c) => c.method === 'PUT')
    assert.equal(puts.length, 2, `status ${status}: the next change is still pushed`)
    assert.deepEqual((puts[1].body as { doc: { state: ProgressState } }).doc.state.completedSections.sort(), ['basics', 'setup'])
  }
})

test('a successful (or already expired, 401) logout ends the session after the flush', async () => {
  for (const r0 of [{ ok: true as const, me: null, data: {} }, logoutFailed(401)]) {
    const t = setup({ owner: 'acct_a', get: [() => ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], put: [() => ok({ rev: 2 })] })
    await t.sync.start('acct_a')
    t.store.setState({ completedSections: ['setup'] })
    const order: string[] = []
    await signOutAccount({ sync: t.sync, request: async () => (order.push('logout'), r0), onSignedOut: () => void order.push('ended') })
    assert.deepEqual(order, ['logout', 'ended'])
    assert.equal(t.calls.filter((c) => c.method === 'PUT').length, 1)
    assert.deepEqual(t.store.getState().completedSections, ['setup'], 'local progress is kept')
  }
})
