import test from 'node:test'
import assert from 'node:assert/strict'
import { decideForce, FORCE_COOLDOWNS_MS, FORCE_FLOOR_MS, FORCE_RESET_MS, INITIAL_FORCE_STATE, type ForceInput, type ForceState } from '@/lib/cloud/force-sync'
import { ProgressSync, type ProgressStoreAdapter, type Scheduler } from '@/lib/cloud/progress-sync'
import { buildRemoteDoc, type ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'

// Owner request 5 Oct 2026: a forced sync (button or Ctrl/⌘ + Alt + S) uploads only a real change,
// never skips the server's back-off, and check/uncheck/force loops earn a growing cooldown.

const base = (p: Partial<ForceInput>): ForceInput => ({ now: 1_000_000, signedIn: true, choicePending: false, notBefore: 0, docHash: 'B', ackedHash: 'A', ...p })

function run(steps: Array<Partial<ForceInput>>, start: ForceState = INITIAL_FORCE_STATE) {
  let state = start
  return steps.map((s) => {
    const r = decideForce(state, base(s))
    state = r.next
    return r.decision
  })
}

test('a real change is pushed; nothing changed means no upload', () => {
  assert.deepEqual(run([{ docHash: 'B', ackedHash: 'A' }]), [{ action: 'push' }])
  assert.deepEqual(run([{ docHash: 'A', ackedHash: 'A' }]), [{ action: 'unchanged' }])
  assert.deepEqual(run([{ docHash: 'A', ackedHash: null }]), [{ action: 'push' }], 'never acknowledged: send it')
})

test('signed out, owner choice pending, or the server said wait: refused, and the guard state is untouched', () => {
  const [a, b, c] = [run([{ signedIn: false }]), run([{ choicePending: true }]), run([{ notBefore: 1_000_000 + 45_000 }])]
  assert.equal(a[0].action === 'refused' && a[0].reason, 'signed_out')
  assert.equal(b[0].action === 'refused' && b[0].reason, 'choice')
  assert.deepEqual(c[0], { action: 'refused', reason: 'backoff', waitMs: 45_000 })
  const r = decideForce(INITIAL_FORCE_STATE, base({ notBefore: 2_000_000 }))
  assert.equal(r.next, INITIAL_FORCE_STATE)
})

test('at most one forced sync per 10 s, unchanged ones included', () => {
  const d = run([{ now: 0 + 1, docHash: 'A', ackedHash: 'A' }, { now: 1 + FORCE_FLOOR_MS - 1, docHash: 'B', ackedHash: 'A' }, { now: 1 + FORCE_FLOOR_MS, docHash: 'B', ackedHash: 'A' }])
  assert.equal(d[0].action, 'unchanged')
  assert.deepEqual(d[1], { action: 'refused', reason: 'floor', waitMs: 1 })
  assert.equal(d[2].action, 'push')
})

test('check, uncheck, force again: flip-flop cooldowns of 30 s, 2 min, 10 min; a quiet 10 min resets', () => {
  const t0 = 1_000_000
  const s = FORCE_FLOOR_MS
  // ack A; check (B) + force; uncheck (A) + force -> A,B,A
  const d = run([
    { now: t0, docHash: 'B', ackedHash: 'A' },
    { now: t0 + s, docHash: 'A', ackedHash: 'B' },
  ])
  assert.equal(d[0].action, 'push')
  assert.deepEqual(d[1], { action: 'refused', reason: 'flipflop', waitMs: FORCE_COOLDOWNS_MS[0] })
  // Keep going: each new A,B,A after the cooldown climbs one step.
  let state: ForceState = INITIAL_FORCE_STATE
  let now = t0
  const waits: number[] = []
  const force = (doc: string, acked: string) => {
    const r = decideForce(state, base({ now, docHash: doc, ackedHash: acked }))
    state = r.next
    return r.decision
  }
  force('B', 'A')
  for (let round = 0; round < 4; round++) {
    now += s
    const refusedNow = force('A', 'B')
    assert.equal(refusedNow.action, 'refused')
    if (refusedNow.action === 'refused') waits.push(refusedNow.waitMs)
    now += refusedNow.action === 'refused' ? refusedNow.waitMs : 0
    assert.equal(force('B', 'A').action, 'push', 'after the cooldown a real change goes through')
  }
  assert.deepEqual(waits, [30_000, 120_000, 600_000, 600_000], 'capped at 10 min')
  now += FORCE_RESET_MS
  force('A', 'B')
  now += s
  const fresh = force('B', 'A')
  assert.deepEqual(fresh, { action: 'refused', reason: 'flipflop', waitMs: 30_000 }, 'after a quiet 10 min the ladder starts over')
})

test('during a cooldown every force is refused with the seconds left', () => {
  const t0 = 1_000_000
  const d = run([
    { now: t0, docHash: 'B', ackedHash: 'A' },
    { now: t0 + FORCE_FLOOR_MS, docHash: 'A', ackedHash: 'B' },
    { now: t0 + FORCE_FLOOR_MS + 5_000, docHash: 'C', ackedHash: 'B' },
  ])
  assert.deepEqual(d[2], { action: 'refused', reason: 'cooldown', waitMs: 25_000 })
})

// --- the sync engine ------------------------------------------------------------------------------

type R = ApiResult<Record<string, unknown>>
const ok = (data: Record<string, unknown>): R => ({ ok: true, status: 200, data: { ok: true, ...data } })
const blank = (p: Partial<ProgressState> = {}): ProgressState => ({ completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...p })

function setup(gets: R[], puts: R[], local = blank()) {
  const calls: string[] = []
  const api: ApiClient = {
    get: async () => { calls.push('GET'); const r = gets.shift(); if (!r) throw new Error('unexpected GET'); return r as never },
    put: async () => { calls.push('PUT'); const r = puts.shift(); if (!r) throw new Error('unexpected PUT'); return r as never },
    post: async () => { throw new Error('POST') },
    patch: async () => { throw new Error('PATCH') },
    del: async () => { throw new Error('DELETE') },
  }
  let state = local
  const listeners = new Set<(n: ProgressState, p: ProgressState) => void>()
  const store: ProgressStoreAdapter = {
    getState: () => state,
    setState: (patch) => { const prev = state; state = { ...state, ...patch }; for (const l of listeners) l(state, prev) },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l) },
  }
  let clock = 1_800_000_000_000
  const scheduler: Scheduler = { setTimeout: () => 0, clearTimeout: () => {} }
  let owner: string | null = 'acct_a'
  const sync = new ProgressSync({ api, storage: createMemoryStorage(), store, owner: { get: () => owner, set: (v) => { owner = v } }, now: () => clock, scheduler, random: () => 0.5 })
  return { sync, store, calls, tick: (ms: number) => { clock += ms } }
}

test('engine: a forced sync with nothing new sends no upload; a real change is one PUT', async () => {
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], [ok({ rev: 2 })])
  await t.sync.start('acct_a')
  const same = await t.sync.forceSync()
  assert.equal(same.decision.action, 'unchanged')
  assert.deepEqual(t.calls, ['GET'], 'a pull was done a moment ago: not even a GET')
  t.tick(FORCE_FLOOR_MS)
  t.store.setState({ completedSections: ['setup'] })
  const changed = await t.sync.forceSync()
  assert.equal(changed.decision.action, 'push')
  assert.deepEqual(t.calls, ['GET', 'PUT'])
  assert.equal(changed.status, 'synced')
})

test('engine: after a 429 the force waits for retryAfter instead of sending two more uploads', async () => {
  const limited: R = { ok: false, status: 429, reason: 'rate_limited', data: { ok: false, reason: 'rate_limited', retryAfter: 120 } }
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], [limited])
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  await t.sync.pushNow()
  assert.deepEqual(t.calls, ['GET', 'PUT'])
  t.tick(FORCE_FLOOR_MS)
  const r = await t.sync.forceSync()
  assert.equal(r.decision.action, 'refused')
  assert.equal(r.decision.action === 'refused' && r.decision.reason, 'backoff')
  assert.deepEqual(t.calls, ['GET', 'PUT'], 'nothing sent')
})

test('engine: check, force, uncheck, force: the second force is refused and autosave still saves', async () => {
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], [ok({ rev: 2 }), ok({ rev: 3 })])
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal((await t.sync.forceSync()).decision.action, 'push')
  t.tick(FORCE_FLOOR_MS)
  t.store.setState({ completedSections: [] })
  const flip = await t.sync.forceSync()
  assert.deepEqual(flip.decision, { action: 'refused', reason: 'flipflop', waitMs: 30_000 })
  assert.deepEqual(t.calls, ['GET', 'PUT'])
  await t.sync.pushNow() // what the autosave timer does
  assert.deepEqual(t.calls, ['GET', 'PUT', 'PUT'], 'the change is still saved by autosave')
})

test('engine: the budget hint on a GET slows the next pulls down', async () => {
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}), syncHint: { minIntervalMs: 300_000 } }), ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], [])
  await t.sync.start('acct_a')
  t.tick(120_000)
  await t.sync.pull()
  assert.deepEqual(t.calls, ['GET'], 'inside the hinted 5 min: no pull')
  t.tick(200_000)
  await t.sync.pull()
  assert.deepEqual(t.calls, ['GET', 'GET'])
})

test('engine: after the budget saver, a force asks the server once per 10 s and sends only when it is no longer red', async () => {
  const saver: R = { ok: false, status: 503, reason: 'budget_saver', data: { ok: false, reason: 'budget_saver', retryAfter: 6 * 3600, syncHint: { minIntervalMs: 900_000, level: 'red' } } }
  const red = ok({ rev: 1, doc: buildRemoteDoc(blank(), {}), syncHint: { minIntervalMs: 900_000, level: 'red' } })
  const green = ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) }), red, green], [saver, ok({ rev: 2 })])
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  assert.equal(await t.sync.pushNow(), 'deferred')
  t.tick(FORCE_FLOOR_MS)
  const stillRed = await t.sync.forceSync()
  assert.equal(stillRed.decision.action === 'refused' && stillRed.decision.reason, 'backoff', 'still red: the server\'s wait holds')
  assert.deepEqual(t.calls, ['GET', 'PUT', 'GET'], 'one read to ask')
  t.tick(3_000)
  assert.equal((await t.sync.forceSync()).decision.action, 'refused')
  assert.deepEqual(t.calls, ['GET', 'PUT', 'GET'], 'a click inside 10 s asks nothing')
  t.tick(FORCE_FLOOR_MS)
  const cleared = await t.sync.forceSync()
  assert.equal(cleared.decision.action, 'push')
  assert.equal(cleared.status, 'synced')
  assert.deepEqual(t.calls, ['GET', 'PUT', 'GET', 'GET', 'PUT'], 'no longer red: one read, then the kept change is sent')
})

test('engine: other back-offs (429, offline) are never asked about: the force just waits', async () => {
  const limited: R = { ok: false, status: 429, reason: 'rate_limited', data: { ok: false, reason: 'rate_limited', retryAfter: 120 } }
  const t = setup([ok({ rev: 1, doc: buildRemoteDoc(blank(), {}) })], [limited])
  await t.sync.start('acct_a')
  t.store.setState({ completedSections: ['setup'] })
  await t.sync.pushNow()
  for (let i = 0; i < 3; i++) {
    t.tick(FORCE_FLOOR_MS)
    await t.sync.forceSync()
  }
  assert.deepEqual(t.calls, ['GET', 'PUT'])
})

// --- what the learner reads ---------------------------------------------------------------------

test('each outcome has its own words, in all three languages; waits read as seconds or minutes', async () => {
  const { forceMessage, waitLabel } = await import('@/components/account/useForceSync')
  const { t } = await import('@/lib/i18n')
  assert.equal(waitLabel(25_000), '25 s')
  assert.equal(waitLabel(119_000), '119 s')
  assert.equal(waitLabel(120_000), '2 min')
  assert.equal(waitLabel(600_000), '10 min')
  assert.equal(waitLabel(1), '1 s')
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    const tr = (k: string, v?: Record<string, string | number>) => t(k, lang).replace(/\{(\w+)\}/g, (_, n) => String(v?.[n] ?? ''))
    const flip = forceMessage({ action: 'refused', reason: 'flipflop', waitMs: 30_000 }, 'synced', tr)
    assert.match(flip, /30 s/, lang)
    assert.notEqual(forceMessage({ action: 'push' }, 'synced', tr), forceMessage({ action: 'unchanged' }, 'synced', tr), lang)
    assert.equal(forceMessage({ action: 'push' }, 'offline', tr), t('account.sync.offline', lang), 'a failed upload says why')
    for (const k of ['saved', 'unchanged', 'wait', 'flipflop', 'backoff', 'signedOut', 'choice', 'hint']) assert.notEqual(t(`account.force.${k}`, lang), `account.force.${k}`, `${lang} ${k}`)
  }
})
