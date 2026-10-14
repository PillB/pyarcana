#!/usr/bin/env node
/**
 * B11: an exercise id must not silently change meaning.
 *
 * Each exercise id (Sxx-Ty-Z-En) has an anchor in audit/safe-agent/exercise-meaning-anchors.json: a
 * fingerprint of its title, tests, solution code and solution output. The fingerprint is the sha256 of
 * the token sequence, and the token set is kept for comparison. Tokens are [a-z_][a-z0-9_]* or \d+
 * after NFKD, mark removal and case folding, so an accent or whitespace edit changes nothing.
 *
 * Classification of an exercise against its anchor (classify):
 *   - equal fingerprints: ok;
 *   - Jaccard(anchor, current) >= 0.5: a wording edit, ok;
 *   - below 0.5: its content now sits at a sibling anchor (same section) with a Jaccard of at least
 *     max(J + 0.10, 0.5): EXERCISE_CONTENT_MOVED, naming that sibling; otherwise EXERCISE_MEANING_CHANGED.
 * A finding is resolved by a non-historical ledger row for the id whose to_fp is the current sha256.
 *
 * The ledger (audit/safe-agent/exercise-meaning-ledger.json) is append-only. Every anchor change needs a
 * new row (ledgerFindings). The sentinel runs that check against the base commit. The newest row of each
 * id names the anchor the id holds now (ledgerAnchorFindings).
 *
 * To edit the wording of an exercise (owner-confirmed workflow, 2026-10-13): edit it, regenerate the anchors
 * with `node --import tsx scripts/exercise_fingerprints.mts --write`, then append one ledger row per changed
 * id (kind `changed`, from_fp the old anchor, to_fp the new one, reason, decided_by, date). Never edit a row.
 * An appended row's from_fp must be the fingerprint its id held before the row (the base's anchor, or the
 * previous appended row's to_fp; null for an id with no anchor): LEDGER_CHAIN_BROKEN otherwise.
 *
 * To remove an exercise (owner decision O25, 2026-10-13): append a row of kind `removed` for its id, with
 * from_fp the anchor it held, to_fp null, and decided_by naming the owner decision (`owner: O<n> (date)`).
 * The row clears ANCHOR_REMOVED (ledgerFindings) and EXERCISE_REMOVED (classify). The decision is checked
 * by its form only: OWNER_DECISIONS.md retires entries, so a lookup there would break when one retires.
 *
 * To rebind an exercise to a new id (the renumber, owner decision O25): one row of kind `renumbered` per
 * pair, written by the renumber tool: id the new id, from_id the old one, from_fp = to_fp the one
 * fingerprint, then reason, decided_by, date. It clears ANCHOR_REMOVED for from_id and the unledgered
 * anchor of id (EXERCISE_REMOVED and EXERCISE_UNANCHORED in classify) when both ends are true: from_id
 * held that fingerprint at the base and no longer holds it, id holds it at head (or a later row for id
 * carries it on, as for an amended exercise), the exercise the base anchored at id, if there was one,
 * leaves by a row of its own (LEDGER_RENUMBER_TARGET_OCCUPIED otherwise: it would be gone with no row
 * that starts from its fingerprint), and no id leaves or is filled twice. Two ids that swap content
 * take two rows. There is no exemption for the renumber PR. A renumbered id cannot be renumbered
 * again within the same PR. An exercise that a renumber also changes (one that prints its own section
 * token) takes the renumbered row and then a `changed` row on its new id, from the renumbered
 * fingerprint. The order of rows of different exercises does not matter: the departure of an id's old
 * exercise, the amendment of the one that arrived there and the `added` row for a vacated id come in any
 * order. Only one exercise's own chain is in sequence: its renumbered row first, then its amendments.
 * The tool is not in this repository yet; this file is the format of record.
 *
 *   node --import tsx scripts/exercise_meaning.mjs --check          # current tree against its anchors
 *   node scripts/exercise_meaning.mjs --ledger-base <sha>           # anchor and ledger changes since <sha>
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const EXERCISE_ID = /^S\d{2}-T[1-4]-[AB]-E[1-3]$/
export const ANCHORS_PATH = 'audit/safe-agent/exercise-meaning-anchors.json'
export const LEDGER_PATH = 'audit/safe-agent/exercise-meaning-ledger.json'
export const MEANING_FLOOR = 0.5
export const MOVE_MARGIN = 0.1
const LEDGER_KINDS = new Set(['changed', 'added', 'reanchored', 'renumbered', 'removed', 'historical'])
/** A decided_by that names an owner decision: `owner: O25 (2026-10-13)`. The form only; see the header. */
export const OWNER_DECISION = /^owner: O\d+\b/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const FP_SCRIPT = 'scripts/exercise_fingerprints.mts'

const text = (value) => (value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value))
const sha256 = (value) => createHash('sha256').update(value).digest('hex')

/**
 * The tokens of a text: NFKD, marks stripped, case folded, then [a-z_][a-z0-9_]* and digit runs.
 * JavaScript has no casefold(). Upper then lower folds the cases the course uses: ß becomes ss,
 * as casefold() gives, where lower() alone would drop it (s07 teaches casefold with "straße").
 */
export function tokensOf(value) {
  const folded = value.normalize('NFKD').replace(/\p{M}/gu, '').toUpperCase().toLowerCase()
  return folded.match(/[a-z_][a-z0-9_]*|\d+/g) ?? []
}

/** The anchor of one exercise: the sha256 of its token sequence, and its sorted token set. */
export function fingerprint({ section, title, tests, code, output }) {
  const sequence = tokensOf([title, tests, code, output].map(text).join('\n'))
  return { section, sha256: sha256(sequence.join(' ')), tokens: [...new Set(sequence)].sort() }
}

/** Jaccard similarity of two token lists. Two empty lists are identical. */
export function jaccard(a, b) {
  const left = new Set(a)
  const right = new Set(b)
  if (left.size === 0 && right.size === 0) return 1
  let shared = 0
  for (const token of left) if (right.has(token)) shared += 1
  return shared / (left.size + right.size - shared)
}

const sectionOf = (id) => id.slice(0, 3)

/** The best sibling anchor (same section, not this id) for content that no longer matches its own anchor. */
function bestSibling(id, now, anchors) {
  const siblings = Object.keys(anchors).filter((other) => other !== id && sectionOf(other) === sectionOf(id))
  let best = null
  for (const other of siblings) {
    const score = jaccard(anchors[other].tokens, now.tokens)
    if (best === null || score > best.score) best = { id: other, score }
  }
  return best
}

/**
 * Whether the exercise the anchors hold at `id` has a row that retires it: a removed row for the id, or
 * a renumbered row from it. An id the anchors do not hold has nothing to retire.
 */
const occupantLeaves = (rows, anchors, id) => anchors[id] === undefined
  || rows.some((row) => row.kind !== 'historical' && departedId(row) === id && row.from_fp === anchors[id].sha256)

/**
 * Whether a row accepts `id` holding `sha`: any non-historical row for the id that ends there. A
 * renumbered row also needs the anchor it renumbers from to hold the fingerprint it cites, so a row
 * cannot invent where an exercise came from, and the exercise the anchors hold at `id` to leave by a
 * row of its own, so a row cannot move content over an exercise and drop that one.
 */
function resolvedBy(rows, anchors, id, sha) {
  return rows.some((row) => row.kind !== 'historical' && row.id === id && row.to_fp === sha
    && (row.kind !== 'renumbered' || (anchors[row.from_id]?.sha256 === row.from_fp && occupantLeaves(rows, anchors, id))))
}

/**
 * Whether a row retires `id`, as the anchor `sha` holds it: a removed row for the id, or a renumbered
 * row from the id whose new id holds the same fingerprint in the course now.
 */
function retiredBy(rows, current, id, sha) {
  return rows.some((row) => row.from_fp === sha
    && ((row.kind === 'removed' && row.id === id)
      || (row.kind === 'renumbered' && row.from_id === id && current[row.id]?.sha256 === row.to_fp)))
}

/** The finding for one exercise whose fingerprint differs from its anchor, or null when it is a wording edit. */
function changeFinding(id, anchor, now, anchors) {
  const similarity = jaccard(anchor.tokens, now.tokens)
  if (similarity >= MEANING_FLOOR) return null
  const sibling = bestSibling(id, now, anchors)
  if (sibling && sibling.score >= Math.max(similarity + MOVE_MARGIN, MEANING_FLOOR)) {
    return { code: 'EXERCISE_CONTENT_MOVED', id, moved_to: sibling.id, similarity: Number(similarity.toFixed(3)) }
  }
  return { code: 'EXERCISE_MEANING_CHANGED', id, similarity: Number(similarity.toFixed(3)) }
}

/**
 * Findings for the current exercises against their anchors. `anchors` and `current` map id to
 * { section, sha256, tokens }. `rows` is the ledger; a finding its rows resolve is not reported.
 */
export function classify(anchors, current, rows = []) {
  const findings = []
  for (const id of Object.keys(current).sort()) {
    const now = current[id]
    const anchor = anchors[id]
    if (!anchor) {
      if (!resolvedBy(rows, anchors, id, now.sha256)) findings.push({ code: 'EXERCISE_UNANCHORED', id })
      continue
    }
    if (anchor.sha256 === now.sha256) continue
    const finding = changeFinding(id, anchor, now, anchors)
    if (finding && !resolvedBy(rows, anchors, id, now.sha256)) findings.push(finding)
  }
  for (const id of Object.keys(anchors).sort()) {
    if (!(id in current) && !retiredBy(rows, current, id, anchors[id].sha256)) findings.push({ code: 'EXERCISE_REMOVED', id })
  }
  return findings
}

const isSha256 = (value) => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)
const isBlank = (value) => typeof value !== 'string' || value.trim() === ''

/** Problems with where a row sits and what it names: its number, its exercise id and its kind. */
function placementProblems(row, index) {
  const problems = []
  if (row?.row !== index + 1) problems.push('row must number 1..n in order')
  if (typeof row?.id !== 'string' || !EXERCISE_ID.test(row.id)) problems.push('id must be an exercise id')
  if (!LEDGER_KINDS.has(row?.kind)) problems.push('kind must be changed, added, reanchored, renumbered, removed or historical')
  return problems
}

/**
 * Problems with the fingerprints a row carries. A removed row retires an anchor: from_fp is the anchor
 * it held and to_fp is null. A renumbered row moves an anchor to a new id and keeps it (see
 * renumberedProblems): both ends are a sha256. Every other row ends at a sha256, and starts at one, or
 * at null for an exercise that had no anchor.
 */
function fingerprintProblems(row) {
  const problems = []
  const removed = row?.kind === 'removed'
  if (removed && row.to_fp !== null) problems.push('to_fp must be null: a removed exercise holds no fingerprint')
  if (!removed && !isSha256(row?.to_fp)) problems.push('to_fp must be a sha256')
  problems.push(...startProblems(row))
  return problems
}

/** Problems with where a row starts: a moved anchor starts at a sha256, any other row at one or at null. */
function startProblems(row) {
  const moved = row?.kind === 'removed' || row?.kind === 'renumbered'
  if (moved) return isSha256(row.from_fp) ? [] : ['from_fp must be the sha256 of the anchor that is removed or renumbered']
  const valid = row?.from_fp === null || isSha256(row?.from_fp)
  return valid ? [] : ['from_fp must be a sha256, or null for an exercise that had no anchor']
}

/**
 * Problems with the ids of a renumbered row. `id` is the new id and from_id the one it leaves; the
 * fingerprint is the same at both ends. Any other kind has no from_id.
 */
function renumberedProblems(row) {
  const problems = []
  if (row?.kind !== 'renumbered') {
    if (row?.from_id !== undefined) problems.push('from_id belongs to a renumbered row only')
    return problems
  }
  if (typeof row.from_id !== 'string' || !EXERCISE_ID.test(row.from_id)) problems.push('from_id must be the exercise id the row renumbers from')
  else if (row.from_id === row.id) problems.push('from_id must differ from id')
  if (row.to_fp !== row.from_fp) problems.push('to_fp must equal from_fp: a renumbered exercise keeps its fingerprint')
  return problems
}

/** Problems with the evidence a row carries: its fingerprints, its reason, its decider and its date. */
function evidenceProblems(row) {
  const problems = [...fingerprintProblems(row), ...renumberedProblems(row)]
  for (const key of ['reason', 'decided_by']) if (isBlank(row?.[key])) problems.push(`${key} must be non-empty`)
  if (row?.kind === 'removed' && !isBlank(row.decided_by) && !OWNER_DECISION.test(row.decided_by)) {
    problems.push('decided_by must name an owner decision (owner: O<n> (date)) for a removed exercise')
  }
  if (typeof row?.date !== 'string' || !ISO_DATE.test(row.date)) problems.push('date must be YYYY-MM-DD')
  return problems
}

function rowProblems(row, index) {
  return [...placementProblems(row, index), ...evidenceProblems(row)]
}

/** The append-only rule: base rows are a prefix of head rows, unchanged. Rows are well formed and numbered. */
function appendOnlyFindings(baseRows, headRows) {
  const findings = []
  if (headRows.length < baseRows.length) findings.push({ code: 'LEDGER_ROW_REMOVED', count: baseRows.length - headRows.length })
  baseRows.forEach((row, index) => {
    if (JSON.stringify(headRows[index]) !== JSON.stringify(row)) findings.push({ code: 'LEDGER_ROW_EDITED', row: index + 1 })
  })
  headRows.forEach((row, index) => {
    const problems = rowProblems(row, index)
    if (problems.length > 0) findings.push({ code: 'LEDGER_ROW_INVALID', row: index + 1, problems })
  })
  return findings
}

/**
 * The ledger rule between a base and a head. `baseAnchors` is null when the base has no anchor file,
 * which is the commit that introduces the anchors; nothing to compare against there. Otherwise every
 * anchor that differs at head needs a row added after the base's rows, naming that id and that
 * fingerprint. A `historical` row records a change made before the anchors existed, so it never
 * accepts a change made now (the same rule as classify's resolvedBy). An anchor that left the course
 * (ANCHOR_REMOVED) needs a `removed` row for its id, or a `renumbered` row that moves it to a new id.
 * Only a well-formed appended row clears a finding: a malformed row is reported by LEDGER_ROW_INVALID
 * and clears nothing. Each appended row also starts where its id stood (walkAppended), so the ledger
 * cannot cite a fingerprint the id never held, and a renumbered row must be true at both of its ids
 * (notVacatedFindings, targetFindings, occupiedFindings, reusedFindings). The renumber PR is not exempt.
 */
export function ledgerFindings({ baseAnchors, headAnchors, baseRows = [], headRows = [] }) {
  const findings = appendOnlyFindings(baseRows, headRows)
  if (baseAnchors === null) return findings
  const added = headRows.slice(baseRows.length).filter((row, index) => rowProblems(row, baseRows.length + index).length === 0)
  const context = { baseAnchors, headAnchors, added }
  const walk = walkAppended(context)
  return [
    ...findings,
    ...removedAnchorFindings(context),
    ...changedAnchorFindings(context),
    ...notVacatedFindings(context),
    ...walk.findings,
    ...targetFindings(context, walk.arrivals),
    ...reusedFindings(context),
  ]
}

/** The id a row vacates, or null: the exercise a removed row retires, the id a renumbered row leaves. */
function departedId(row) {
  if (row.kind === 'removed') return row.id
  return row.kind === 'renumbered' ? row.from_id : null
}

/** LEDGER_CHAIN_BROKEN for a row whose from_fp is not `expected`, the fingerprint its exercise held. */
const chainBroken = (row, expected) => ({
  code: 'LEDGER_CHAIN_BROKEN',
  id: row.id,
  ...(row.kind === 'renumbered' && { from_id: row.from_id }),
  row: row.row,
  from_fp: row.from_fp,
  expected_from_fp: expected,
})

/**
 * A renumbered row leaves from_id, which only its old exercise has touched. It fills id with a new chain,
 * and the exercise the base anchored at id is not part of that chain: it leaves by a row of its own.
 */
function stepRenumbered(walk, row) {
  const expected = walk.old.get(row.from_id) ?? null
  if (row.from_fp !== expected) walk.findings.push(chainBroken(row, expected))
  walk.old.set(row.from_id, null)
  walk.fresh.set(row.id, { fp: row.to_fp, row: row.row, arrival: true })
  walk.fills.push(row)
}

/**
 * Whether a row of any other kind continues the fresh chain of its id. A row from nothing starts or
 * resumes it; otherwise it continues the chain whose fingerprint it cites, the fresh one first. A row
 * that cites neither is judged against the fresh chain when the id has one, else against the old exercise.
 */
function continuesFresh(row, chain, oldFp) {
  if (row.from_fp === null || chain?.fp === row.from_fp) return true
  return oldFp !== row.from_fp && chain !== undefined
}

/** A changed, added, reanchored or removed row: it moves the chain it continues to the row's to_fp. */
function stepAmendment(walk, row) {
  const chain = walk.fresh.get(row.id)
  const oldFp = walk.old.get(row.id) ?? null
  const fresh = continuesFresh(row, chain, oldFp)
  const expected = fresh ? (chain?.fp ?? null) : oldFp
  if (row.from_fp !== expected) walk.findings.push(chainBroken(row, expected))
  else if (row.from_fp === null) walk.fills.push(row)
  if (fresh) walk.fresh.set(row.id, { arrival: false, row: row.row, ...chain, fp: row.to_fp })
  else walk.old.set(row.id, row.to_fp)
}

/**
 * A row that puts a new exercise into an id (a renumbered row, or a row from nothing) needs the exercise
 * the base anchored there to have left by a row of its own. Otherwise that exercise is gone and no row
 * starts from its fingerprint. A renumbered row is LEDGER_RENUMBER_TARGET_OCCUPIED, a row from nothing
 * LEDGER_CHAIN_BROKEN: the id held a fingerprint, not nothing.
 */
function occupiedFindings(walk) {
  return walk.fills.flatMap((row) => {
    const occupant = walk.old.get(row.id) ?? null
    if (occupant === null) return []
    if (row.kind !== 'renumbered') return [chainBroken(row, occupant)]
    return [{ code: 'LEDGER_RENUMBER_TARGET_OCCUPIED', id: row.id, row: row.row, occupant_fp: occupant }]
  })
}

/**
 * Walk the appended rows. LEDGER_CHAIN_BROKEN: a row whose from_fp is not the fingerprint its exercise
 * held when the row was written. One id can hold two exercises in a PR: the one the base anchored, which
 * may still be on its way out, and the one that arrived (a renumbered row's, or one written from
 * nothing). So the walk keeps two chains per id, and a row continues the one whose fingerprint it cites:
 *   - `old`: the base's anchor, as in-place edits left it, null once the exercise has left;
 *   - `fresh`: what arrived since, at the fingerprint its chain has reached, with the row that began it.
 * A row of one chain never reads the other, so the order of rows of different exercises does not change
 * the verdict: the departure of an id's old exercise, the amendment of the exercise that arrived there
 * and the `added` row for a vacated id come in any order. What stays in sequence is one chain: a
 * renumbered row comes before the amendments of its arrival, and each row starts where the one before it
 * ended. A `removed` row ends its chain at null. A row from nothing needs the id's old exercise to have
 * left by the end of the walk, so it is judged after the last row (occupiedFindings). A `historical` row
 * describes a change from before the anchors existed and is not part of any chain. One renumbered row
 * cannot be renumbered again within the same PR. Returns the findings, in row order, and `arrivals`: the
 * chain of every id a renumbered row filled, id -> { fp, row, arrival }.
 */
function walkAppended({ baseAnchors, added }) {
  const walk = {
    old: new Map(Object.entries(baseAnchors).map(([id, anchor]) => [id, anchor.sha256])),
    fresh: new Map(),
    fills: [],
    findings: [],
  }
  for (const row of added) {
    if (row.kind === 'historical') continue
    if (row.kind === 'renumbered') stepRenumbered(walk, row)
    else stepAmendment(walk, row)
  }
  walk.findings.push(...occupiedFindings(walk))
  return { findings: walk.findings.sort((a, b) => a.row - b.row), arrivals: walk.fresh }
}

/**
 * LEDGER_RENUMBER_TARGET_MISMATCH: an id a renumbered row filled that does not hold the fingerprint its
 * chain reached, the renumbered row's own or the last amendment's. Without it a renumbered row, or a
 * renumbered row and an amendment, could clear the removal of an anchor whose content went nowhere.
 */
function targetFindings({ headAnchors }, arrivals) {
  const findings = []
  for (const [id, { fp, row, arrival }] of arrivals) {
    const holds = headAnchors[id]?.sha256 ?? null
    if (arrival && holds !== fp) findings.push({ code: 'LEDGER_RENUMBER_TARGET_MISMATCH', id, row, anchor: holds })
  }
  return findings
}

/**
 * LEDGER_RENUMBER_REUSED: one id left twice, or one id filled twice, by the rows of a PR. An id that leaves
 * twice has been copied, not moved; an id that is filled twice holds the content of only one of them.
 */
function reusedFindings({ added }) {
  const findings = []
  const seen = { departs: new Set(), arrives: new Set() }
  for (const row of added) {
    const departed = departedId(row)
    const roles = [['departs', departed], ['arrives', row.kind === 'renumbered' ? row.id : null]]
    for (const [role, id] of roles) {
      if (id === null) continue
      if (seen[role].has(id)) findings.push({ code: 'LEDGER_RENUMBER_REUSED', role, id, row: row.row })
      seen[role].add(id)
    }
  }
  return findings
}

/** ANCHOR_REMOVED: an anchor the base had and the head lacks, with no appended row that retires the id. */
function removedAnchorFindings({ baseAnchors, headAnchors, added }) {
  const findings = []
  for (const id of Object.keys(baseAnchors)) {
    if (id in headAnchors) continue
    if (!added.some((row) => departedId(row) === id)) findings.push({ code: 'ANCHOR_REMOVED', id })
  }
  return findings
}

/** ANCHOR_CHANGED_UNLEDGERED: an anchor that is new or differs from the base, with no row naming id and fingerprint. */
function changedAnchorFindings({ baseAnchors, headAnchors, added }) {
  const findings = []
  for (const id of Object.keys(headAnchors)) {
    const before = baseAnchors[id]
    const now = headAnchors[id]
    if (before && before.sha256 === now.sha256) continue
    if (!added.some((row) => row.kind !== 'historical' && row.id === id && row.to_fp === now.sha256)) {
      findings.push({ code: 'ANCHOR_CHANGED_UNLEDGERED', id })
    }
  }
  return findings
}

/** Whether `id` holds other content at head than at the base, or is gone: the id no longer names what it named. */
const vacated = ({ baseAnchors, headAnchors }, id) => !(id in headAnchors) || headAnchors[id].sha256 !== baseAnchors[id]?.sha256

/**
 * LEDGER_ID_NOT_VACATED: a `removed` or `renumbered` row that vacates an id the head still anchors with
 * the fingerprint the base gave it. The row says the exercise left the id while the anchor says it did
 * not (for a renumbered row, that is a copy). An id another row fills with other content is vacated.
 */
function notVacatedFindings(context) {
  return context.added.flatMap((row) => {
    const id = departedId(row)
    return id !== null && !vacated(context, id) ? [{ code: 'LEDGER_ID_NOT_VACATED', id, row: row.row }] : []
  })
}

/**
 * The ledger's last word on an id must be the anchor the id holds now. The ledger is append-only, so
 * an id that changed twice has two rows and only the newest names the current anchor; an older row
 * keeps the fingerprint it recorded. A historical row is the newest row of an id until that id changes
 * again, and then a later row takes its place. An id with no row is not examined here (classify
 * reports an anchor that no longer matches the course).
 *
 * A `removed` row is not an anchor, and a `renumbered` row is an anchor for its new id and a departure
 * for its from_id. A departure excuses the missing anchor of an id whose last word it is, and an id that
 * is departed and still anchored is reported. An id that came back after its departure is judged by the
 * row that brought it back. Where a departure sits among the rows of its own PR is not judged
 * (ledgerFindings judges each appended one, LEDGER_ID_NOT_VACATED), so an anchor equal to the arrival
 * row's passes whatever the order: two ids that swapped their content need two rows, in either order.
 */
export function ledgerAnchorFindings(anchors, rows) {
  const arrivals = new Map()
  const departures = new Map()
  for (const row of rows) {
    if (row.kind !== 'removed') arrivals.set(row.id, row)
    const departed = departedId(row)
    if (departed !== null) departures.set(departed, row)
  }
  const findings = []
  for (const id of new Set(rows.flatMap((row) => [row.id, departedId(row)]).filter((id) => id !== null))) {
    const arrival = arrivals.get(id)
    const departure = departures.get(id)
    const held = anchors[id]?.sha256
    if (arrival && held === arrival.to_fp) continue
    const departedSince = departure !== undefined && (arrival === undefined || departure.row > arrival.row)
    if (departedSince && held === undefined) continue
    findings.push({ code: 'LEDGER_NEWEST_ROW_NOT_ANCHOR', id, row: (departedSince ? departure : arrival).row, anchor: held ?? null })
  }
  return findings
}

function parseJson(source, label) {
  try {
    return JSON.parse(source)
  } catch (e) {
    throw new Error(`${label} is not valid JSON: ${e.message}`)
  }
}

/**
 * The file at a commit: null when that commit has no such path. A commit git cannot read throws, so a
 * base that is missing or mistyped fails the check; it is never read as "no anchors yet".
 */
function readAtCommit(root, rev, path) {
  const commit = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${rev}^{commit}`], { cwd: root, encoding: 'utf8' })
  if (commit.status !== 0) throw new Error(`${rev} is not a commit git can read, so ${path} cannot be compared`)
  const shown = spawnSync('git', ['cat-file', 'blob', `${rev}:${path}`], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  return shown.status === 0 ? shown.stdout : null
}

/** The anchors and rows as the file at `rev` holds them (or the working tree when rev is null). */
export function readAnchorState(root, rev) {
  const read = (path) => {
    if (rev === null) return existsSync(join(root, path)) ? readFileSync(join(root, path), 'utf8') : null
    return readAtCommit(root, rev, path)
  }
  const anchorsText = read(ANCHORS_PATH)
  const ledgerText = read(LEDGER_PATH)
  return {
    anchors: anchorsText === null ? null : parseJson(anchorsText, ANCHORS_PATH).exercises,
    rows: ledgerText === null ? [] : parseJson(ledgerText, LEDGER_PATH).rows,
  }
}

/** The current exercises, from the real course module, through the TypeScript collector. */
function currentFromCourse(root) {
  const out = execFileSync(process.execPath, ['--import', 'tsx', join(root, FP_SCRIPT), '--json'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
  return parseJson(out, FP_SCRIPT)
}

function runCheck(root) {
  const anchors = readAnchorState(root, null)
  const current = currentFromCourse(root)
  return [
    ...classify(anchors.anchors ?? {}, current, anchors.rows),
    ...ledgerAnchorFindings(anchors.anchors ?? {}, anchors.rows),
  ]
}

function runLedgerBase(root, base) {
  const before = readAnchorState(root, base)
  const after = readAnchorState(root, null)
  return ledgerFindings({
    baseAnchors: before.anchors,
    headAnchors: after.anchors ?? {},
    baseRows: before.rows,
    headRows: after.rows,
  })
}

/** Exit 0 only when the check ran and found nothing. A check that threw is a failure, never a pass. */
function main(argv) {
  const root = process.cwd()
  const baseIndex = argv.indexOf('--ledger-base')
  try {
    if (baseIndex >= 0 && !argv[baseIndex + 1]) throw new Error('--ledger-base needs a commit')
    const findings = baseIndex >= 0 ? runLedgerBase(root, argv[baseIndex + 1]) : runCheck(root)
    if (findings.length > 0) {
      console.error('EXERCISE MEANING FAILED')
      console.error(JSON.stringify({ findings }, null, 2))
      process.exit(1)
    }
  } catch (e) {
    console.error('EXERCISE MEANING FAILED')
    console.error(String(e?.message ?? e))
    process.exit(1)
  }
  console.log('EXERCISE MEANING OK')
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main(process.argv.slice(2))
