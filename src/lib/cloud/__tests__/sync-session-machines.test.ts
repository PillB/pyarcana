/**
 * State-machine audit, 25 Nov 2026 (docs/architecture/STATE_MACHINES.md §4): one ProgressSync
 * lives for the whole page (components/account/runtime.ts getProgressSync), so signing out of
 * account A and into account B on the same tab reuses it. Per-account memory must not cross.
 *
 * Defect guarded: signOut kept `ackedJson` (the document account A's server acknowledged). After
 * "Combinar" into an empty account B the merged document equals A's acknowledged one, so push()
 * took its "unchanged since ack" shortcut, reported `synced`, and never uploaded: B's server stayed
 * empty while the page said synced. Mutation that turns this red: drop the reset in signOut.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { ProgressSync, type ProgressStoreAdapter, type Scheduler } from '@/lib/cloud/progress-sync'
import type { ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'

const T0 = Date.parse('2026-11-25T12:00:00Z')
type R = ApiResult<Record<string, unknown>>

function store(initial: ProgressState): ProgressStoreAdapter {
  let state = initial
  const ls = new Set<(n: ProgressState, p: ProgressState) => void>()
  return {
    getState: () => state,
    setState: (patch) => {
      const prev = state
      state = { ...state, ...patch }
      for (const l of ls) l(state, prev)
    },
    subscribe: (l) => (ls.add(l), () => ls.delete(l)),
  }
}

const scheduler: Scheduler = { setTimeout: () => 0, clearTimeout: () => undefined }
const ok = (data: Record<string, unknown>): R => ({ ok: true, status: 200, data: { ok: true, ...data } })

function harness() {
  const servers: Record<string, { rev: number; doc: unknown }> = { A: { rev: 0, doc: null }, B: { rev: 0, doc: null } }
  let who = 'A'
  const puts: Array<{ account: string; rev: number }> = []
  const api: ApiClient = {
    get: async () => ok({ rev: servers[who].rev, doc: servers[who].doc }) as never,
    put: async (_p, body) => {
      const b = body as { doc: unknown; baseRev: number }
      const s = servers[who]
      if (b.baseRev !== s.rev) return { ok: false, status: 409, reason: 'conflict', data: { ok: false, server: { ...s, updatedAt: T0 } } } as never
      s.rev += 1
      s.doc = JSON.parse(JSON.stringify(b.doc))
      puts.push({ account: who, rev: s.rev })
      return ok({ rev: s.rev }) as never
    },
    post: async () => { throw new Error('unexpected POST') },
    patch: async () => { throw new Error('unexpected PATCH') },
    del: async () => { throw new Error('unexpected DELETE') },
  }
  let owner: string | null = null
  const local = store({
    completedSections: ['basics'], completedSubSteps: { basics: ['theory'] }, quizScores: {}, lastVisited: 'basics',
    bookmarks: [], startDate: '2026-11-01', isHydratedFromServer: false,
  })
  const sync = new ProgressSync({ api, storage: createMemoryStorage(), store: local, owner: { get: () => owner, set: (id) => { owner = id } }, now: () => T0, scheduler })
  return { sync, servers, puts, signInAs: (id: string) => { who = id } }
}

test('switching accounts on one tab: "Combinar" into account B uploads to B (no shortcut from A\'s ack)', async () => {
  const h = harness()
  assert.equal(await h.sync.start('A'), 'synced', 'precondition: account A syncs the local progress')
  assert.ok(h.servers.A.doc !== null, 'precondition: A holds the progress')

  await h.sync.signOut()
  h.signInAs('B')
  assert.equal(await h.sync.start('B'), 'needs_choice', 'owner A with local work: B must ask first')
  const status = await h.sync.resolveOwnerChoice('merge')

  assert.equal(status, 'synced')
  assert.ok(
    h.puts.some((p) => p.account === 'B'),
    `DEFECT: the page reports "${status}" but nothing was uploaded to account B (uploads: ${JSON.stringify(h.puts)}). ` +
      'signOut must forget the acknowledged document of the previous account (progress-sync.ts signOut).',
  )
  assert.ok(h.servers.B.doc !== null, 'account B must now hold the merged progress')
})

test('the same account signing back in still uses the shortcut (no needless upload)', async () => {
  const h = harness()
  await h.sync.start('A')
  const before = h.puts.length
  await h.sync.signOut()
  assert.equal(await h.sync.start('A'), 'synced')
  assert.equal(h.puts.length, before, 'A already holds this exact document: a re-sign-in must not upload it again')
})

// --- 401 on sync while the session machine says "ok" ----------------------------------------------
//
// Defect guarded: a 401 from PUT/GET /v1/me/progress set the sync status to `signed_out`, but nothing
// told the session machine (meStatus stayed `ok`, access stayed Pro, the panel still said "signed in",
// SyncController kept the account), so every later change was uploaded and refused again. Correct:
// a 401 while signed in calls onUnauthorized once per refusal; the runtime re-reads /v1/me, whose 401
// moves meStatus to signed_out and stops the sync. Mutations that turn this red: drop the callback in
// failed(); call it for every failure; or let recheckSessionAfter401 run while meStatus is not "ok".

test('a 401 from the progress server while signed in tells the session machine; other failures do not', async () => {
  const calls: string[] = []
  let answer: R = { ok: false, status: 401, reason: 'unauthorized', data: { ok: false } }
  const api: ApiClient = {
    get: async () => answer as never,
    put: async () => answer as never,
    post: async () => { throw new Error('unexpected POST') },
    patch: async () => { throw new Error('unexpected PATCH') },
    del: async () => { throw new Error('unexpected DELETE') },
  }
  const sync = new ProgressSync({
    api, storage: createMemoryStorage(), store: store({ completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false }),
    owner: { get: () => null, set: () => undefined }, now: () => T0, scheduler, onUnauthorized: () => void calls.push('401'), random: () => 0.5,
  })
  assert.equal(await sync.start('A'), 'signed_out')
  assert.deepEqual(calls, ['401'], 'the pull refused with 401 must reach the session machine exactly once')

  answer = { ok: false, status: 500, reason: 'http_500', data: null }
  await sync.pull(true)
  assert.deepEqual(calls, ['401'], 'a 5xx is not a sign-out: onUnauthorized must not fire')

  await sync.signOut()
  answer = { ok: false, status: 401, reason: 'unauthorized', data: { ok: false } }
  await sync.pull(true)
  assert.deepEqual(calls, ['401'], 'after sign-out there is no account to report: no call')
})

test('recheckSessionAfter401 re-reads /v1/me only while the page believes it is signed in', async () => {
  const { recheckSessionAfter401 } = await import('@/components/account/runtime')
  let reads = 0
  const refresh = async () => void (reads += 1)
  assert.equal(recheckSessionAfter401({ meStatus: () => 'ok', refresh }), true)
  assert.equal(reads, 1, 'meStatus ok + a sync 401: one /v1/me read')
  for (const s of ['pending', 'signed_out', 'unavailable', 'error', 'idle']) {
    assert.equal(recheckSessionAfter401({ meStatus: () => s, refresh }), false, `meStatus ${s}: no read (in flight or already known)`)
  }
  assert.equal(reads, 1)
})

// --- sign-in methods: `failed` was an absorbing state ----------------------------------------------
//
// Defect guarded: loadAuthMethods returned unless the state was `idle`, so one failed request (the
// learner was offline when the dialog first opened) left "Servicio no disponible" in every sign-in
// panel until a reload. Correct: `failed` -> `loading` on the next reader's mount; `loading` and `ok`
// never send a second request. Mutation that turns this red: restore the `!== 'idle'` guard.

test('sign-in methods: a failed load is retried by the next reader; ok and in-flight loads are not repeated', async () => {
  const { loadAuthMethods, authMethodsStore } = await import('@/components/account/runtime')
  let gets = 0
  let answer: R = { ok: false, status: 0, reason: 'network', data: null }
  const api = { get: async () => (gets++, answer) } as unknown as ApiClient
  authMethodsStore.setState({ state: 'idle' })

  await loadAuthMethods(api)
  assert.equal(authMethodsStore.getState().state, 'failed', 'precondition: offline -> failed')

  answer = ok({ email: true, google: false, microsoft: false, trialDays: 7 })
  await loadAuthMethods(api)
  assert.equal(authMethodsStore.getState().state, 'ok', 'DEFECT: a failed load must be retried when a panel mounts again')
  assert.equal(authMethodsStore.getState().trialDays, 7)
  assert.equal(gets, 2)

  await loadAuthMethods(api)
  assert.equal(gets, 2, 'once ok, no further request')

  authMethodsStore.setState({ state: 'loading' })
  await loadAuthMethods(api)
  assert.equal(gets, 2, 'while a load is in flight, no second request')
})

test('straight from account A to account B (no sign-out in between): "Unir" still uploads to B', async () => {
  // Mutation that turns this red: drop the lastAccountId check in start().
  const h = harness()
  await h.sync.start('A')
  h.signInAs('B')
  assert.equal(await h.sync.start('B'), 'needs_choice')
  await h.sync.resolveOwnerChoice('merge')
  assert.ok(h.puts.some((p) => p.account === 'B'), `nothing uploaded to B: ${JSON.stringify(h.puts)}`)
})
