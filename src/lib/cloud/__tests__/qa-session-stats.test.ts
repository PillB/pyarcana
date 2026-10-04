import test from 'node:test'
import assert from 'node:assert/strict'
import { browserFamily, formatActive, IDLE_MS, MAX_TICK_MS, newQaSession, qaSessionSummary, readQaSession, tickQaSession, TICK_MS } from '@/lib/qa-session-stats'
import { parseQaSession } from '../../../../workers/billing/src/qa-sessions.mjs'

// Owner request 5 Oct 2026: QA session statistics — only real, attended time counts.

const T0 = 1_800_000_000_000
const active = (now: number, sectionId: string | null = 'setup') => ({ now, visible: true, focused: true, lastInputAt: now - 1000, sectionId })

test('only visible, focused, recently used time counts, per section; a sleep is not credited', () => {
  let s = newQaSession(T0, 'Mozilla/5.0 Firefox/131.0', 'abc1234', () => 0.5)
  s = tickQaSession(s, active(T0 + TICK_MS))
  s = tickQaSession(s, active(T0 + 2 * TICK_MS, 'python-basics'))
  assert.equal(s.activeMs, 2 * TICK_MS)
  assert.deepEqual(s.sections, { setup: TICK_MS, 'python-basics': TICK_MS })
  const hidden = tickQaSession(s, { ...active(T0 + 3 * TICK_MS), visible: false })
  const blurred = tickQaSession(s, { ...active(T0 + 3 * TICK_MS), focused: false })
  const idle = tickQaSession(s, { ...active(T0 + 3 * TICK_MS), lastInputAt: T0 + 3 * TICK_MS - IDLE_MS })
  for (const x of [hidden, blurred, idle]) assert.equal(x.activeMs, s.activeMs)
  const slept = tickQaSession(idle, active(T0 + 3 * TICK_MS + 3_600_000))
  assert.equal(slept.activeMs - idle.activeMs, MAX_TICK_MS, 'a laptop lid closed for an hour credits one tick at most')
  const page = tickQaSession(s, active(T0 + 3 * TICK_MS, null))
  assert.equal(page.activeMs, s.activeMs + TICK_MS, 'time on a page without a section still counts')
  assert.deepEqual(page.sections, s.sections)
  assert.equal(tickQaSession(s, active(T0 + 3 * TICK_MS, 'Bad Id!')).sections['Bad Id!'], undefined)
})

test('the summary is exactly what the worker accepts; issues of this session only', () => {
  let s = newQaSession(T0, 'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15', 'abc1234')
  for (let i = 1; i <= 8; i++) s = tickQaSession(s, active(T0 + i * TICK_MS))
  const issues = [
    { createdAt: new Date(T0 - 1000).toISOString() },
    { createdAt: new Date(T0 + 5000).toISOString(), remoteId: 'rep_x' },
    { createdAt: new Date(T0 + 6000).toISOString() },
  ]
  const summary = qaSessionSummary(s, issues, '  Lucía  ')
  assert.deepEqual([summary.issuesCreated, summary.issuesSent, summary.activeSeconds, summary.alias, summary.browser], [2, 1, 120, 'Lucía', 'safari'])
  const now = Math.floor((T0 + 9 * TICK_MS) / 1000)
  const parsed = parseQaSession(summary, now) as { error?: unknown; activeSeconds?: number }
  assert.equal(parsed.error, undefined, JSON.stringify(parsed))
  assert.equal(parsed.activeSeconds, 120)
  assert.equal(qaSessionSummary(s, [], '').alias, undefined, 'no alias key when empty')
})

test('browser families, the stored session read back defensively, and the time label', () => {
  assert.equal(browserFamily('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/129.0 Safari/537.36 Edg/129.0'), 'chromium')
  assert.equal(browserFamily('Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 CriOS/129.0 Mobile/15E148 Safari/604.1'), 'chromium')
  assert.equal(browserFamily('Mozilla/5.0 (X11; Linux) Gecko/20100101 Firefox/131.0'), 'firefox')
  assert.equal(browserFamily('curl/8'), 'other')
  const s = newQaSession(T0, 'x', null)
  assert.deepEqual(readQaSession(JSON.stringify(s)), s)
  for (const bad of [null, '', '{', '{"sessionId":"nope"}', JSON.stringify({ ...s, activeMs: -1 })]) assert.equal(readQaSession(bad), null)
  assert.equal(formatActive(40_000), '40 s')
  assert.equal(formatActive(12 * 60_000), '12 min')
  assert.equal(formatActive(65 * 60_000), '1 h 05 min')
})
