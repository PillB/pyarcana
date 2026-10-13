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
 * new row (ledgerFindings). The sentinel runs that check against the base commit.
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
const LEDGER_KINDS = new Set(['changed', 'added', 'reanchored', 'renumbered', 'historical'])
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

function resolvedBy(rows, id, sha) {
  return rows.some((row) => row.kind !== 'historical' && row.id === id && row.to_fp === sha)
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
      if (!resolvedBy(rows, id, now.sha256)) findings.push({ code: 'EXERCISE_UNANCHORED', id })
      continue
    }
    if (anchor.sha256 === now.sha256) continue
    const finding = changeFinding(id, anchor, now, anchors)
    if (finding && !resolvedBy(rows, id, now.sha256)) findings.push(finding)
  }
  for (const id of Object.keys(anchors).sort()) {
    if (!(id in current)) findings.push({ code: 'EXERCISE_REMOVED', id })
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
  if (!LEDGER_KINDS.has(row?.kind)) problems.push('kind must be changed, added, reanchored, renumbered or historical')
  return problems
}

/** Problems with the evidence a row carries: its fingerprints, its reason, its decider and its date. */
function evidenceProblems(row) {
  const problems = []
  if (!isSha256(row?.to_fp)) problems.push('to_fp must be a sha256')
  if (row?.from_fp !== null && !isSha256(row?.from_fp)) problems.push('from_fp must be a sha256, or null for an exercise that had no anchor')
  for (const key of ['reason', 'decided_by']) if (isBlank(row?.[key])) problems.push(`${key} must be non-empty`)
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
 * accepts a change made now (the same rule as classify's resolvedBy).
 */
export function ledgerFindings({ baseAnchors, headAnchors, baseRows = [], headRows = [] }) {
  const findings = appendOnlyFindings(baseRows, headRows)
  if (baseAnchors === null) return findings
  const added = headRows.slice(baseRows.length)
  for (const id of Object.keys(baseAnchors)) {
    if (!(id in headAnchors)) findings.push({ code: 'ANCHOR_REMOVED', id })
  }
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
  const findings = classify(anchors.anchors ?? {}, current, anchors.rows)
  return findings
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
