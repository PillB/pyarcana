import test from 'node:test'
import assert from 'node:assert/strict'
import {
  fnv1a32,
  assignArm,
  parseExperiments,
  exclusionReason,
  getOrCreateCid,
  forcedArm,
  decideArm,
  ExposureQueue,
  CID_KEY,
  type Experiment,
  type ExclusionContext,
} from '@/lib/cloud/experiments'
import { createMemoryStorage } from '@/lib/cloud/storage'

const exp: Experiment = { key: 'pkg_ab_v1', arms: ['A', 'B'], weights: [1, 1], surface: 'gate' }

const ctx = (patch: Partial<ExclusionContext> = {}): ExclusionContext => ({
  canMeasure: true,
  signals: { gpc: false, dnt: false },
  webdriver: false,
  allowAutomation: false,
  qaMode: false,
  isAdmin: false,
  isTester: false,
  access: 'free',
  surface: 'gate',
  ...patch,
})

test('FNV-1a 32-bit matches the published test vectors', () => {
  assert.equal(fnv1a32(''), 0x811c9dc5)
  assert.equal(fnv1a32('a'), 0xe40c292c)
  assert.equal(fnv1a32('foobar'), 0xbf9cf968)
})

test('assignment is deterministic per (cid, experiment) and independent across experiments', () => {
  const cid = '0123456789abcdef0123456789abcdef'
  assert.equal(assignArm(cid, exp), assignArm(cid, exp))
  let differs = 0
  for (let i = 0; i < 200; i++) {
    const c = i.toString(16).padStart(32, '0')
    if (assignArm(c, exp) !== assignArm(c, { ...exp, key: 'aa_2026_q4' })) differs++
  }
  assert.ok(differs > 60 && differs < 140, `arms should be independent across keys, got ${differs}/200 different`)
})

test('arms follow the weights', () => {
  const count = (e: Experiment) => {
    const n: Record<string, number> = {}
    for (let i = 0; i < 10000; i++) {
      const arm = assignArm(`cid-${i}`, e)
      n[arm] = (n[arm] ?? 0) + 1
    }
    return n
  }
  const even = count(exp)
  assert.ok(Math.abs(even.A - 5000) < 300, JSON.stringify(even))
  const skew = count({ ...exp, weights: [9, 1] })
  assert.ok(Math.abs(skew.A - 9000) < 300, JSON.stringify(skew))
  const off = count({ ...exp, arms: ['none', 'house', 'x'], weights: [1, 1, 0] })
  assert.equal(off.x, undefined)
})

test('the experiment registry from the worker is validated', () => {
  const parsed = parseExperiments({
    ok: true,
    experiments: [
      { key: 'pkg_ab_v1', arms: ['A', 'B'], weights: [1, 1], surface: 'gate' },
      { key: 'bad_weights', arms: ['a', 'b'], weights: [1], surface: 'home' },
      { key: 'negative', arms: ['a', 'b'], weights: [1, -1], surface: 'home' },
      { key: 'all_zero', arms: ['a', 'b'], weights: [0, 0], surface: 'home' },
      { key: 'dupe', arms: ['a', 'a'], weights: [1, 1], surface: 'home' },
      { key: 7, arms: ['a', 'b'], weights: [1, 1], surface: 'home' },
      { key: 'one_arm', arms: ['a'], weights: [1], surface: 'home' },
    ],
  })
  assert.deepEqual(parsed.map((e) => e.key), ['pkg_ab_v1'])
  assert.deepEqual(parseExperiments(null), [])
})

test('exclusions: privacy signals, no consent, automation, QA mode, staff and Pro on gate tests', () => {
  assert.equal(exclusionReason(ctx()), null)
  assert.equal(exclusionReason(ctx({ signals: { gpc: true, dnt: false } })), 'gpc')
  assert.equal(exclusionReason(ctx({ signals: { gpc: false, dnt: true } })), 'dnt')
  assert.equal(exclusionReason(ctx({ canMeasure: false })), 'no_consent')
  assert.equal(exclusionReason(ctx({ webdriver: true })), 'webdriver')
  assert.equal(exclusionReason(ctx({ webdriver: true, allowAutomation: true })), null)
  assert.equal(exclusionReason(ctx({ qaMode: true })), 'qa_mode')
  assert.equal(exclusionReason(ctx({ isAdmin: true })), 'admin')
  assert.equal(exclusionReason(ctx({ isTester: true })), 'tester')
  assert.equal(exclusionReason(ctx({ access: 'pro' })), 'pro')
  assert.equal(exclusionReason(ctx({ access: 'pro', surface: 'gate_or_home' })), 'pro')
  assert.equal(exclusionReason(ctx({ access: 'pro', surface: 'home' })), null)
  assert.equal(exclusionReason(ctx({ access: 'unknown' })), 'access_unknown')
})

test('the measurement id is created only when measurement is allowed, then reused', () => {
  const storage = createMemoryStorage()
  assert.equal(getOrCreateCid(storage, false), null)
  assert.equal(storage.getItem(CID_KEY), null)
  const cid = getOrCreateCid(storage, true)!
  assert.match(cid, /^[0-9a-f]{32}$/)
  assert.equal(getOrCreateCid(storage, true), cid)
  assert.equal(getOrCreateCid(storage, false), null, 'an existing id is not used once measurement is off')
  const full = { ...createMemoryStorage(), getItem: () => null, setItem: () => { throw new Error('quota') } }
  assert.equal(getOrCreateCid(full, true), null)
  storage.setItem(CID_KEY, 'tampered<script>')
  assert.notEqual(getOrCreateCid(storage, true), 'tampered<script>')
})

test('?ab_<key>=<arm> previews an arm without enrolling', () => {
  assert.equal(forcedArm('?ab_pkg_ab_v1=B', exp), 'B')
  assert.equal(forcedArm('?ab_pkg_ab_v1=Z', exp), null)
  assert.equal(forcedArm('?x=1', exp), null)
  const d = decideArm({ exp, cid: 'abc', exclusion: null, search: '?ab_pkg_ab_v1=B' })
  assert.deepEqual(d, { arm: 'B', enrolled: false, reason: 'forced' })
})

test('excluded or id-less visitors get the control arm and are not enrolled', () => {
  let inB = ''
  for (let i = 0; !inB; i++) if (assignArm(`cid-${i}`, exp) === 'B') inB = `cid-${i}`
  assert.deepEqual(decideArm({ exp, cid: inB, exclusion: 'pro', search: '' }), { arm: 'A', enrolled: false, reason: 'pro' })
  assert.deepEqual(decideArm({ exp, cid: null, exclusion: null, search: '' }), { arm: 'A', enrolled: false, reason: 'no_cid' })
  const d = decideArm({ exp, cid: 'abc', exclusion: null, search: '' })
  assert.equal(d.enrolled, true)
  assert.equal(d.arm, assignArm('abc', exp))
})

test('exposure is logged in both arms, once per device, and never for unenrolled visitors', async () => {
  const sent: unknown[] = []
  const storage = createMemoryStorage()
  const q = new ExposureQueue({ storage, send: async (batch) => { sent.push(...batch.events); return true } })
  let cidA = ''
  let cidB = ''
  for (let i = 0; !cidA || !cidB; i++) {
    const c = `cid-${i}`
    if (assignArm(c, exp) === 'A') cidA ||= c
    else cidB ||= c
  }
  assert.equal(q.expose(exp, decideArm({ exp, cid: cidA, exclusion: null, search: '' }), cidA), true)
  assert.equal(q.expose(exp, decideArm({ exp, cid: cidA, exclusion: null, search: '' }), cidA), false, 'second exposure is not re-logged')
  const q2 = new ExposureQueue({ storage: createMemoryStorage(), send: async (batch) => { sent.push(...batch.events); return true } })
  assert.equal(q2.expose(exp, decideArm({ exp, cid: cidB, exclusion: null, search: '' }), cidB), true)
  assert.equal(q.expose(exp, decideArm({ exp, cid: cidA, exclusion: 'qa_mode', search: '' }), cidA), false)
  assert.equal(q.expose(exp, decideArm({ exp, cid: cidA, exclusion: null, search: '?ab_pkg_ab_v1=B' }), cidA), false)
  await q.flush()
  await q2.flush()
  assert.deepEqual(sent, [
    { name: 'exposure', experiment: 'pkg_ab_v1', arm: 'A', surface: 'gate' },
    { name: 'exposure', experiment: 'pkg_ab_v1', arm: 'B', surface: 'gate' },
  ])
})

test('only allowlisted events are queued; flush batches by 25 and keeps events when sending fails', async () => {
  let fail = true
  const batches: number[] = []
  const q = new ExposureQueue({ storage: createMemoryStorage(), send: async (batch) => { batches.push(batch.events.length); return !fail } })
  assert.equal(q.track('cid-1', { name: 'gate_view', sectionIndex: 6 }), true)
  assert.equal(q.track('cid-1', { name: 'email_captured' as never }), false)
  assert.equal(q.track('cid-1', { name: 'gate_view', sectionIndex: 6.5 }), false)
  for (let i = 0; i < 29; i++) q.track('cid-1', { name: 'house_ad_view' })
  await q.flush()
  assert.equal(q.size(), 30, 'a failed send keeps the events')
  fail = false
  await q.flush()
  await q.flush()
  assert.deepEqual(batches, [25, 25, 5])
  assert.equal(q.size(), 0)
})
