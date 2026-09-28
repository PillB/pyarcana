/**
 * Cross-device progress merge (DESIGN-v2 §8.5): a last-writer-wins element set over the persisted
 * progress shape, so an un-toggle on one device propagates instead of being resurrected by a union.
 *
 * Remote doc: {v:1, sv:<section-id schema version>, state:<progress fields>, changes:{[item]:{present, ts}}}
 * Items: `sec:<id>`, `sub:<id>:<step>`, `bm:<id>`.
 * - An item in either change log: the newest ts wins; a tie goes to present. Lists are rebuilt only
 *   from ids some state holds, so a change log alone cannot inject progress.
 * - Otherwise: union.  quizScores: max.  startDate: earliest.  lastVisited: local (remote only
 *   when local has none).  isHydratedFromServer: ALWAYS local (never forced true).
 * - The remote state passes sanitizePersisted then migrateProgressState before anything else, and
 *   then an id/score filter (no __proto__, quiz 0..100). Local data is never filtered or dropped.
 *
 * Trade-off (DESIGN-v2 §11.8): timestamps are client clocks. A device with a wrong clock can win or
 * lose a tie; change entries more than 24 h in the future are discarded so one bad clock cannot pin
 * an item forever.
 */
import {
  migrateProgressState,
  sanitizePersisted,
  type SanitizedProgressState,
} from '@/lib/progress-sanitize'
import { SECTION_ID_SCHEMA_VERSION, renameSectionId } from '@/lib/section-id-migrations'
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export type ProgressState = SanitizedProgressState
export interface ChangeEntry {
  present: boolean
  ts: number
}
export type ChangeLog = Record<string, ChangeEntry>

export const CHANGES_KEY = 'pyarcana-cloud-changes-v1'
export const REMOTE_DOC_VERSION = 1
const MAX_FUTURE_MS = 24 * 3600 * 1000
const MAX_CHANGES = 20000
const ID = /^[A-Za-z0-9._-]{1,100}$/
const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype'])

export function safeId(id: unknown): id is string {
  return typeof id === 'string' && ID.test(id) && !FORBIDDEN.has(id)
}

export const secKey = (id: string) => `sec:${id}`
export const subKey = (id: string, step: string) => `sub:${id}:${step}`
export const bmKey = (id: string) => `bm:${id}`

/** Canonical form of an item key (section ids renamed), or null when it is not a valid key. */
export function canonicalKey(key: string): string | null {
  const [kind, id, step, extra] = key.split(':')
  if (extra !== undefined || !safeId(id)) return null
  const current = renameSectionId(id)
  if (kind === 'sub') return safeId(step) ? subKey(current, step) : null
  if (step !== undefined) return null
  if (kind === 'sec') return secKey(current)
  return kind === 'bm' ? bmKey(current) : null
}

function validEntry(entry: unknown, nowMs: number): ChangeEntry | null {
  if (!isPlainObject(entry) || typeof entry.present !== 'boolean') return null
  const ts = entry.ts
  if (typeof ts !== 'number' || !Number.isFinite(ts) || ts <= 0 || ts > nowMs + MAX_FUTURE_MS) return null
  return { present: entry.present, ts }
}

function pickWinner(a: ChangeEntry | undefined, b: ChangeEntry | undefined): ChangeEntry | undefined {
  if (!a || !b) return a ?? b
  if (a.ts !== b.ts) return a.ts > b.ts ? a : b
  return a.present ? a : b
}

export function sanitizeChangeLog(raw: unknown, nowMs: number): ChangeLog {
  const out: ChangeLog = {}
  if (!isPlainObject(raw)) return out
  for (const [key, entry] of Object.entries(raw).slice(0, MAX_CHANGES)) {
    const canonical = canonicalKey(key)
    const valid = validEntry(entry, nowMs)
    if (canonical && valid) out[canonical] = pickWinner(out[canonical], valid)!
  }
  return out
}

/** Merge two change logs, newest entry per item. */
export function recordChanges(log: ChangeLog, more: ChangeLog): ChangeLog {
  const out: ChangeLog = { ...log }
  for (const [key, entry] of Object.entries(more)) out[key] = pickWinner(out[key], entry)!
  return out
}

type ItemFields = Pick<ProgressState, 'completedSections' | 'completedSubSteps' | 'bookmarks'>

function itemSet(state: Partial<ItemFields>): Set<string> {
  const items = new Set<string>()
  for (const id of state.completedSections ?? []) items.add(secKey(id))
  for (const [id, steps] of Object.entries(state.completedSubSteps ?? {})) {
    for (const step of steps) items.add(subKey(id, step))
  }
  for (const id of state.bookmarks ?? []) items.add(bmKey(id))
  return items
}

/** Change entries for every item added or removed between two states. */
export function diffChanges(prev: Partial<ItemFields>, next: Partial<ItemFields>, ts: number): ChangeLog {
  const before = itemSet(prev)
  const after = itemSet(next)
  const out: ChangeLog = {}
  for (const key of after) if (!before.has(key) && canonicalKey(key) === key) out[key] = { present: true, ts }
  for (const key of before) if (!after.has(key) && canonicalKey(key) === key) out[key] = { present: false, ts }
  return out
}

const validScore = (v: number) => Number.isFinite(v) && v >= 0 && v <= 100
const isDate = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v))

function filterSteps(map: Record<string, string[]> | undefined): Record<string, string[]> | undefined {
  if (!map) return undefined
  const out: Record<string, string[]> = {}
  for (const [id, steps] of Object.entries(map)) if (safeId(id)) out[id] = steps.filter(safeId)
  return out
}

function filterScores(map: Record<string, number> | undefined): Record<string, number> | undefined {
  if (!map) return undefined
  const out: Record<string, number> = {}
  for (const [id, v] of Object.entries(map)) if (safeId(id) && validScore(v)) out[id] = v
  return out
}

/** Filter incoming (never local) state: safe ids only, quiz 0..100, real dates. */
function dropUnsafe(s: Partial<ProgressState>): Partial<ProgressState> {
  return {
    completedSections: s.completedSections?.filter(safeId),
    completedSubSteps: filterSteps(s.completedSubSteps),
    quizScores: filterScores(s.quizScores),
    bookmarks: s.bookmarks?.filter(safeId),
    lastVisited: safeId(s.lastVisited) ? s.lastVisited : null,
    startDate: isDate(s.startDate) ? s.startDate : null,
  }
}

/** Untrusted progress (remote doc, archive, handoff): sanitize, migrate ids, filter. */
export function cleanIncomingState(raw: unknown, fromVersion: number): Partial<ProgressState> {
  const migrated = migrateProgressState(sanitizePersisted(raw), fromVersion, SECTION_ID_SCHEMA_VERSION).state
  return dropUnsafe(migrated)
}

export interface ParsedRemote {
  state: Partial<ProgressState>
  changes: ChangeLog
}

export function parseRemoteDoc(raw: unknown, nowMs: number): ParsedRemote | null {
  if (!isPlainObject(raw) || raw.v !== REMOTE_DOC_VERSION) return null
  const sv = typeof raw.sv === 'number' && Number.isInteger(raw.sv) && raw.sv >= 0 ? raw.sv : 0
  return { state: cleanIncomingState(raw.state, sv), changes: sanitizeChangeLog(raw.changes, nowMs) }
}

function orderedUnion(a: string[], b: string[], keep: (v: string) => boolean): string[] {
  return [...new Set([...a, ...b])].filter(keep)
}

function mergeSteps(local: Record<string, string[]>, remote: Record<string, string[]>, present: (k: string) => boolean) {
  const out: Record<string, string[]> = {}
  for (const id of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    if (id === '__proto__') continue
    const steps = orderedUnion(local[id] ?? [], remote[id] ?? [], (step) => present(subKey(id, step)))
    if (steps.length > 0 || Object.prototype.hasOwnProperty.call(local, id)) out[id] = steps
  }
  return out
}

function maxScores(local: Record<string, number>, remote: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [id, v] of [...Object.entries(local), ...Object.entries(remote)]) {
    if (id === '__proto__') continue
    const has = Object.prototype.hasOwnProperty.call(out, id)
    if (!has || v > out[id]) out[id] = v
  }
  return out
}

function earliest(a: string | null, b: string | null | undefined): string | null {
  if (!isDate(b)) return a
  if (!isDate(a)) return a ?? b
  return Date.parse(b) < Date.parse(a) ? b : a
}

function buildMerged(local: ProgressState, other: Partial<ProgressState>, present: (k: string) => boolean): ProgressState {
  return {
    completedSections: orderedUnion(local.completedSections, other.completedSections ?? [], (id) => present(secKey(id))),
    completedSubSteps: mergeSteps(local.completedSubSteps, other.completedSubSteps ?? {}, present),
    quizScores: maxScores(local.quizScores, other.quizScores ?? {}),
    lastVisited: local.lastVisited ?? other.lastVisited ?? null,
    bookmarks: orderedUnion(local.bookmarks, other.bookmarks ?? [], (id) => present(bmKey(id))),
    startDate: earliest(local.startDate, other.startDate),
    isHydratedFromServer: local.isHydratedFromServer,
  }
}

export interface MergeResult {
  state: ProgressState
  changes: ChangeLog
}

/** Merge a remote doc into local progress. An unreadable remote returns local untouched. */
export function mergeProgress(local: ProgressState, localChanges: ChangeLog, remoteRaw: unknown, nowMs: number): MergeResult {
  const remote = parseRemoteDoc(remoteRaw, nowMs)
  if (!remote) return { state: local, changes: localChanges }
  const changes = recordChanges(localChanges, remote.changes)
  const localItems = itemSet(local)
  const remoteItems = itemSet(remote.state)
  // Lists are rebuilt only from ids that some state holds, so a change entry alone never adds an item.
  const present = (key: string) => {
    const change = changes[key]
    return change ? change.present : localItems.has(key) || remoteItems.has(key)
  }
  return { state: buildMerged(local, remote.state, present), changes }
}

export interface UnionResult extends MergeResult {
  added: number
}

/**
 * Add everything an incoming copy (archive restore, #import= handoff) has; never remove anything.
 * Additions are recorded as changes so they win over older removals and reach other devices.
 */
export function unionInto(local: ProgressState, localChanges: ChangeLog, incoming: Partial<ProgressState>, nowMs: number): UnionResult {
  const clean = dropUnsafe(incoming)
  const items = new Set([...itemSet(local), ...itemSet(clean)])
  const state = buildMerged(local, clean, (key) => items.has(key))
  const additions = diffChanges(local, state, nowMs)
  return { state, changes: recordChanges(localChanges, additions), added: Object.keys(additions).length }
}

export interface RemoteDoc {
  v: 1
  sv: number
  state: Omit<ProgressState, 'isHydratedFromServer'>
  changes: ChangeLog
}

/** The doc PUT to /v1/me/progress. The device-local hydration flag is not part of it. */
export function buildRemoteDoc(state: ProgressState, changes: ChangeLog): RemoteDoc {
  const { isHydratedFromServer: _local, ...shared } = state
  return { v: REMOTE_DOC_VERSION, sv: SECTION_ID_SCHEMA_VERSION, state: shared, changes }
}

export function hasProgress(state: Partial<ProgressState>): boolean {
  const steps = Object.values(state.completedSubSteps ?? {}).some((s) => s.length > 0)
  return (state.completedSections?.length ?? 0) > 0 || steps || (state.bookmarks?.length ?? 0) > 0 || Object.keys(state.quizScores ?? {}).length > 0
}

export function loadChangeLog(storage: KeyValueStorage | null, nowMs: number): ChangeLog {
  return sanitizeChangeLog(readJson(storage, CHANGES_KEY), nowMs)
}

export function saveChangeLog(storage: KeyValueStorage | null, log: ChangeLog): boolean {
  return writeJson(storage, CHANGES_KEY, log)
}
