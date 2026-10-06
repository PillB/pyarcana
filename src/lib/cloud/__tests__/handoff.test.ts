import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHandoffUrl, encodeHandoff, decodeHandoff, applyHandoff, stripImportFragment, HANDOFF_MAX_BYTES } from '@/lib/cloud/handoff'
import { bytesToB64url, utf8 } from '@/lib/cloud/b64'
import type { ProgressState } from '@/lib/cloud/progress-merge'

const CANON = 'https://pyarcana.example'
const NOW = Date.parse('2026-09-28T12:00:00Z')

function blank(patch: Partial<ProgressState> = {}): ProgressState {
  return { completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...patch }
}

const stored = JSON.stringify({
  state: {
    completedSections: ['setup', 'basics'],
    completedSubSteps: { setup: ['theory', 'ido'] },
    quizScores: { setup: 85 },
    lastVisited: 'basics',
    bookmarks: ['basics'],
    startDate: '2026-02-01T00:00:00.000Z',
    isHydratedFromServer: false,
  },
  version: 1,
})

test('round trip: the canonical origin receives exactly the progress the old origin stored', () => {
  const built = buildHandoffUrl(CANON + '/', stored)
  assert.equal(built.ok, true)
  if (!built.ok) return
  const url = new URL(built.url)
  assert.equal(url.origin + url.pathname, 'https://pyarcana.example/')
  assert.ok(url.hash.startsWith('#import='))
  const decoded = decodeHandoff(url.hash)
  assert.equal(decoded.ok, true)
  if (!decoded.ok) return
  assert.deepEqual(decoded.state.completedSections, ['setup', 'basics'])
  assert.deepEqual(decoded.state.completedSubSteps, { setup: ['theory', 'ido'] })
  assert.deepEqual(decoded.state.quizScores, { setup: 85 })
  assert.equal(decoded.state.lastVisited, 'basics')
  assert.equal(decoded.state.startDate, '2026-02-01T00:00:00.000Z')
})

test('an envelope from before the section rename arrives migrated', () => {
  const old = JSON.stringify({ state: { completedSections: ['numpy'], quizScores: { numpy: 60 } }, version: 0 })
  const built = buildHandoffUrl(CANON, old)
  assert.ok(built.ok)
  const decoded = decodeHandoff(new URL((built as { url: string }).url).hash)
  assert.ok(decoded.ok)
  if (decoded.ok) {
    assert.deepEqual(decoded.state.completedSections, ['collections'])
    assert.deepEqual(decoded.state.quizScores, { collections: 60 })
  }
})

test('nothing to hand off, an unreadable store or a bad canonical origin produce no link', () => {
  assert.deepEqual(encodeHandoff(null), { ok: false, reason: 'empty' })
  assert.deepEqual(encodeHandoff('{broken'), { ok: false, reason: 'unreadable' })
  assert.deepEqual(buildHandoffUrl('', stored), { ok: false, reason: 'no_canonical' })
  assert.deepEqual(buildHandoffUrl('http://pyarcana.example', stored), { ok: false, reason: 'no_canonical' })
  const local = buildHandoffUrl('http://localhost:3000', stored)
  assert.ok(local.ok && local.url.startsWith('http://localhost:3000/#import='), 'the local E2E canonical origin works')
})

test('progress larger than 64 KiB is refused on both ends', () => {
  const huge: Record<string, string[]> = {}
  for (let i = 0; i < 3000; i++) huge[`section-${i}`] = ['theory', 'ido', 'wedo', 'youdo']
  assert.deepEqual(encodeHandoff(JSON.stringify({ state: { completedSubSteps: huge }, version: 1 })), { ok: false, reason: 'too_large' })
  const oversized = '#import=' + 'A'.repeat(Math.ceil((HANDOFF_MAX_BYTES * 4) / 3) + 8)
  assert.deepEqual(decodeHandoff(oversized), { ok: false, reason: 'too_large' })
})

test('hostile fragments are refused or sanitized, never trusted', () => {
  const enc = (s: string) => '#import=' + bytesToB64url(utf8(s))
  assert.deepEqual(decodeHandoff('#import=%%%'), { ok: false, reason: 'malformed' })
  assert.deepEqual(decodeHandoff(enc('not json')), { ok: false, reason: 'malformed' })
  assert.deepEqual(decodeHandoff(enc('[1,2,3]')), { ok: false, reason: 'malformed' })
  assert.deepEqual(decodeHandoff(enc('')), { ok: false, reason: 'empty' })
  const r = decodeHandoff(enc('{"state":{"completedSections":"all","bookmarks":["setup","__proto__"],"quizScores":{"setup":1000,"basics":50},"lastVisited":{"x":1}},"version":1}'))
  assert.equal(r.ok, true)
  if (r.ok) {
    assert.equal(r.state.completedSections, undefined)
    assert.deepEqual(r.state.bookmarks, ['setup'])
    assert.deepEqual(r.state.quizScores, { basics: 50 })
    assert.equal(r.state.lastVisited, null)
  }
})

test('only #import= fragments are read; lesson hashes are ignored', () => {
  assert.deepEqual(decodeHandoff(''), { ok: false, reason: 'none' })
  assert.deepEqual(decodeHandoff('#setup/theory'), { ok: false, reason: 'none' })
  assert.deepEqual(decodeHandoff('#importx=abc'), { ok: false, reason: 'none' })
})

test('the handoff merges and never replaces what this origin already has', () => {
  const local = blank({ completedSections: ['decisions-rules'], quizScores: { setup: 95 }, lastVisited: 'decisions-rules', bookmarks: ['setup'] })
  const incoming = { completedSections: ['setup'], quizScores: { setup: 70, basics: 60 }, lastVisited: 'basics', bookmarks: [] }
  const r = applyHandoff(local, {}, incoming, NOW)
  assert.deepEqual(r.state.completedSections, ['decisions-rules', 'setup'])
  assert.deepEqual(r.state.quizScores, { setup: 95, basics: 60 })
  assert.deepEqual(r.state.bookmarks, ['setup'])
  assert.equal(r.state.lastVisited, 'decisions-rules')
  assert.deepEqual(r.changes['sec:setup'], { present: true, ts: NOW })
})

test('the fragment is stripped from the address, keeping path and query', () => {
  assert.equal(stripImportFragment('https://pyarcana.example/?x=1#import=abc'), '/?x=1')
  assert.equal(stripImportFragment('https://pyarcana.example/cuenta#import=abc'), '/cuenta')
})
