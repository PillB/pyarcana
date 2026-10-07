/**
 * QA session statistics (owner request 5 Oct 2026): how long a tester actually worked, on which
 * sections. Local first: the numbers live in this tab (sessionStorage) and in the exported QA
 * package; a signed-in tester or admin also sends a summary (src/lib/cloud/qa-sessions.ts).
 *
 * Active time is counted in ticks, and only when all of these hold:
 * - the tab is visible and focused;
 * - there was input (key, pointer, scroll, wheel) in the last IDLE_MS;
 * - the tick is not a catch-up after a sleep: at most MAX_TICK_MS is credited per tick.
 * The time goes to the section on screen at that tick (none on pages without a section).
 * A session starts the first time the QA workspace opens, or QA mode is on, in a tab, and lasts
 * until the tab closes. Nothing here identifies a person: the alias is the tester's own label.
 */

export const QA_SESSION_KEY = 'pyarcana:qa-session-stats:v1'
export const TICK_MS = 15_000
export const IDLE_MS = 60_000
export const MAX_TICK_MS = 2 * TICK_MS
const MAX_SECTIONS = 60

export type QaBrowser = 'chromium' | 'firefox' | 'safari' | 'other'

export interface QaSessionStats {
  sessionId: string
  startedAt: number
  lastActiveAt: number
  lastTickAt: number
  activeMs: number
  sections: Record<string, number>
  deploymentSha: string | null
  browser: QaBrowser
}

export interface TickInput {
  now: number
  visible: boolean
  focused: boolean
  lastInputAt: number
  sectionId: string | null
}

/** Chromium (Chrome, Edge, Opera), Firefox, Safari, or other: coarse on purpose. */
export function browserFamily(userAgent: string): QaBrowser {
  if (/Firefox\//.test(userAgent)) return 'firefox'
  if (/(Chrome|Chromium|CriOS|Edg)\//.test(userAgent)) return 'chromium'
  if (/Safari\//.test(userAgent) && /Version\//.test(userAgent)) return 'safari'
  return 'other'
}

/** A new session (ids look like the worker expects: qs_ + 22 url-safe characters). */
export function newQaSession(now: number, userAgent: string, deploymentSha: string | null, random: () => number = Math.random): QaSessionStats {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  const id = Array.from({ length: 22 }, () => alphabet[Math.floor(random() * alphabet.length) % alphabet.length]).join('')
  return { sessionId: `qs_${id}`, startedAt: now, lastActiveAt: now, lastTickAt: now, activeMs: 0, sections: {}, deploymentSha, browser: browserFamily(userAgent) }
}

const SECTION_ID = /^[a-z0-9][a-z0-9_-]{0,39}$/

/** Credit one tick of active time (see the rule above). Pure: returns a new object. */
export function tickQaSession(s: QaSessionStats, i: TickInput): QaSessionStats {
  const elapsed = Math.max(0, Math.min(i.now - s.lastTickAt, MAX_TICK_MS))
  const active = i.visible && i.focused && i.now - i.lastInputAt < IDLE_MS
  if (!active || elapsed === 0) return { ...s, lastTickAt: i.now }
  const sections = { ...s.sections }
  const id = i.sectionId && SECTION_ID.test(i.sectionId) ? i.sectionId : null
  if (id && (id in sections || Object.keys(sections).length < MAX_SECTIONS)) sections[id] = (sections[id] ?? 0) + elapsed
  return { ...s, lastTickAt: i.now, lastActiveAt: i.now, activeMs: s.activeMs + elapsed, sections }
}

export interface QaSessionSummary {
  sessionId: string
  alias?: string
  startedAt: number
  lastActiveAt: number
  activeSeconds: number
  sections: Record<string, number>
  issuesCreated: number
  issuesSent: number
  deploymentSha: string | null
  browser: QaBrowser
}

/** The summary the worker stores (seconds, epoch seconds), counting this session's issues. */
export function qaSessionSummary(s: QaSessionStats, issues: Array<{ createdAt: string; remoteId?: string }>, alias: string): QaSessionSummary {
  const mine = issues.filter((x) => Date.parse(x.createdAt) >= s.startedAt)
  const sec = (ms: number) => Math.floor(ms / 1000)
  const sections = Object.fromEntries(Object.entries(s.sections).map(([k, v]) => [k, Math.min(sec(v), sec(s.activeMs))]))
  const trimmed = alias.trim().slice(0, 80)
  return {
    sessionId: s.sessionId,
    ...(trimmed ? { alias: trimmed } : {}),
    startedAt: sec(s.startedAt),
    lastActiveAt: Math.max(sec(s.startedAt), sec(s.lastActiveAt)),
    activeSeconds: sec(s.activeMs),
    sections,
    issuesCreated: mine.length,
    issuesSent: mine.filter((x) => typeof x.remoteId === 'string').length,
    deploymentSha: s.deploymentSha && /^[0-9a-f]{7,64}$/i.test(s.deploymentSha) ? s.deploymentSha : null,
    browser: s.browser,
  }
}

/** Read this tab's session, or null (malformed data is ignored, never trusted). */
export function readQaSession(raw: string | null): QaSessionStats | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as QaSessionStats
    const ok = typeof v.sessionId === 'string' && /^qs_[A-Za-z0-9_-]{16,40}$/.test(v.sessionId)
      && [v.startedAt, v.lastActiveAt, v.lastTickAt, v.activeMs].every((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0)
      && v.sections !== null && typeof v.sections === 'object'
    return ok ? v : null
  } catch {
    return null
  }
}

/** "1 h 05 min", "12 min", "40 s": active time as people read it. */
export function formatActive(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`
}
