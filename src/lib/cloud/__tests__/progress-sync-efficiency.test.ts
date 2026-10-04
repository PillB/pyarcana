import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ProgressSync,
  PUSH_DEBOUNCE_MS,
  PUSH_MAX_WAIT_MS,
  PULL_THROTTLE_MS,
  RETRY_BASE_MS,
  RETRY_MAX_MS,
  type ProgressStoreAdapter,
  type Scheduler,
} from '@/lib/cloud/progress-sync'
import { SyncController, type EventHost } from '@/lib/cloud/sync-controller'
import { buildRemoteDoc, type ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'

// Owner request 4 Oct 2026: progress must not depend on this browser alone, and the account copy must
// cost as little as possible: no upload when nothing changed, a bounded debounce, throttled pulls,
// backoff that honours the server, and an immediate flush when the connection comes back.

const T0 = Date.parse('2026-10-04T12:00:00Z')
type R = ApiResult<Record<string, unknown>>
const ok = (data: Record<string, unknown>): R => ({ ok: true, status: 200, data: { ok: true, ...data } })
const network = (): R => ({ ok: false, status: 0, reason: 'network', data: null })
const limited = (retryAfter: number): R => ({ ok: false, status: 429, reason: 'rate_limited', data: { ok: false, reason: 'rate_limited', retryAfter } })

function blank(patch: Partial<ProgressState> = {}): ProgressState {
  return { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...patch }
}

function fakeStore(initial: ProgressState): ProgressStoreAdapter {
  let state = initial
  const listeners = new Set<(n: ProgressState, p: ProgressState) => void>()
  return {
    getState: () => state,
    setState: (patch) => {
      const prev = state
      state = { ...state, ...patch }
      for (const l of listeners) l(state, prev)
    },
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

/** A scheduler that remembers each delay, so the timing rules are observable. */
function timingScheduler(): Scheduler & { delays: number[]; run: () => void } {
  const timers = new Map<number, () => void>()
  const delays: number[] = []
  let id = 0
  return {
    delays,
    setTimeout: (fn, ms) => {
      delays.push(ms)
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
  }
}

function setup(gets: R[], puts: R[], local = blank()) {
  const calls: string[] = []
  const api: ApiClient = {
    get: async () => { calls.push('GET'); const r = gets.shift(); if (!r) throw new Error('unexpected GET'); return r as never },
    put: async () => { calls.push('PUT'); const r = puts.shift(); if (!r) throw new Error('unexpected PUT'); return r as never },
    post: async () => { throw new Error('POST') },
    patch: async () => { throw new Error('PATCH') },
    del: async () => { throw new Error('DELETE') },
  }
  let clock = T0
  const store = fakeStore(local)
  const scheduler = timingScheduler()
  let owner: string | null = 'acct_a'
  const sync = new ProgressSync({
    api,
    storage: createMemoryStorage(),
    store,
    owner: { get: () => owner, set: (v) => { owner = v } },
    now: () => clock,
    scheduler,
    random: () => 0.5,
  })
  return { sync, store, scheduler, calls, tick: (ms: number) => { clock += ms } }
}

const settle = () => new Promise((r) => setTimeout(r, 0))
const agreed = (state: ProgressState) => ok({ rev: 1, doc: buildRemoteDoc(state, {}) })

test('no upload when the document equals the last one the server acknowledged', async () => {
  const local = blank({ completedSections: ['setup'], quizScores: { setup: 80 } })
  const t = setup([agreed(local)], [], local)
  assert.equal(await t.sync.start('acct_a'), 'synced')
  // A store update that leaves the document identical (a new object with the same scores).
  t.store.setState({ quizScores: { setup: 80 } })
  t.scheduler.run()
  await settle()
  assert.deepEqual(t.calls, ['GET'], 'no PUT for an unchanged document')
  assert.equal(t.sync.status, 'synced')
})

test('the debounce never holds a change longer than the maximum wait', async () => {
  const t = setup([agreed(blank())], [], blank())
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(t.scheduler.delays.at(-1), PUSH_DEBOUNCE_MS)
  // Steady activity: a change every 4 s keeps restarting the 5 s debounce...
  for (let i = 0; i < 14; i++) {
    t.tick(4000)
    t.store.setState({ completedSections: ['setup', `s${i}`] })
  }
  // ...but 56 s after the first change only 4 s remain of the 60 s maximum.
  assert.equal(t.scheduler.delays.at(-1), PUSH_MAX_WAIT_MS - 56_000)
  assert.ok(PUSH_MAX_WAIT_MS <= 60_000)
})

test('pulls on tab focus are throttled; start always pulls and a forced pull goes through', async () => {
  const t = setup([agreed(blank()), agreed(blank()), agreed(blank())], [], blank())
  await t.sync.start('acct_a')
  t.tick(PULL_THROTTLE_MS - 1000)
  await t.sync.pull()
  assert.deepEqual(t.calls, ['GET'], 'too soon: no request')
  await t.sync.pull(true)
  assert.deepEqual(t.calls, ['GET', 'GET'], 'forced ("Sincronizar ahora")')
  t.tick(PULL_THROTTLE_MS + 1)
  await t.sync.pull()
  assert.deepEqual(t.calls, ['GET', 'GET', 'GET'])
})

test('offline: retries back off exponentially (capped) and keep the local copy; the server\'s retryAfter wins', async () => {
  const t = setup([agreed(blank())], [network(), network(), limited(120), ok({ rev: 2 })], blank())
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  t.scheduler.run()
  await settle()
  assert.equal(t.sync.status, 'offline')
  assert.equal(t.scheduler.delays.at(-1), RETRY_BASE_MS, 'first retry after the base delay (jitter 0.5 -> factor 1)')
  t.scheduler.run()
  await settle()
  assert.equal(t.scheduler.delays.at(-1), RETRY_BASE_MS * 2, 'doubles')
  t.scheduler.run()
  await settle()
  assert.equal(t.scheduler.delays.at(-1), 120_000, '429 retryAfter (s) is honoured')
  t.scheduler.run()
  await settle()
  assert.equal(t.sync.status, 'synced')
  assert.deepEqual(t.store.getState().completedSections, ['setup'], 'local progress never lost')
  assert.ok(RETRY_MAX_MS <= 300_000)
})

test('the server hint slows uploads down (budget saver) and is cleared by a later answer without it', async () => {
  const t = setup([agreed(blank())], [ok({ rev: 2, syncHint: { minIntervalMs: 60_000 } }), ok({ rev: 3 })], blank())
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  t.scheduler.run()
  await settle()
  t.store.setState({ completedSections: ['setup', 'values'] })
  assert.equal(t.scheduler.delays.at(-1), 60_000, 'debounce raised to the hint')
  t.scheduler.run()
  await settle()
  t.store.setState({ completedSections: ['setup', 'values', 'decisions'] })
  assert.equal(t.scheduler.delays.at(-1), PUSH_DEBOUNCE_MS, 'back to normal once the server stops hinting')
})

test('a red budget day (503 budget_saver) defers the upload to the server\'s time without calling it offline', async () => {
  const saver: R = { ok: false, status: 503, reason: 'budget_saver', data: { ok: false, reason: 'budget_saver', retryAfter: 18_300 } }
  const t = setup([agreed(blank())], [saver, ok({ rev: 2 })], blank())
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  t.scheduler.run()
  await settle()
  assert.equal(t.sync.status, 'deferred')
  assert.equal(t.scheduler.delays.at(-1), 18_300_000, 'retry when the budget resets, not on the backoff ladder')
  t.scheduler.run()
  await settle()
  assert.equal(t.sync.status, 'synced')
  assert.deepEqual(t.store.getState().completedSections, ['setup'])
})

test('the controller flushes and re-pulls as soon as the connection comes back', () => {
  const seen: string[] = []
  const host = (): EventHost & { fire: (t: string) => void } => {
    const fns = new Map<string, () => void>()
    return { addEventListener: (t, f) => fns.set(t, f), removeEventListener: (t) => fns.delete(t), fire: (t) => fns.get(t)?.() }
  }
  const doc = Object.assign(host(), { visibilityState: 'visible' })
  const win = host()
  const c = new SyncController({
    sync: {
      attach: () => {},
      detach: () => {},
      start: async () => 'synced',
      pull: async (force?: boolean) => { seen.push(`pull:${force === true}`); return 'synced' },
      flush: async () => 'synced',
      pushNow: async () => { seen.push('pushNow'); return 'synced' },
      signOut: async () => {},
    },
    doc,
    win,
  })
  c.mount()
  c.setAccount('acct_a')
  win.fire('online')
  assert.deepEqual(seen, ['pushNow', 'pull:true'])
})
