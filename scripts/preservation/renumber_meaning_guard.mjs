#!/usr/bin/env node
/**
 * G-11 and G-15: the renumber must not change what an exercise id means.
 * Design: audit/fixer/renumber_g0/design_ruled_final.md §4.2-§4.3, design_G_round4.md §4.
 *
 * Dormant while audit/safe-agent/renumber_epoch.json is absent and was never committed (it prints
 * DORMANT). Once the epoch exists the guard never skips: an epoch that was committed and is gone is
 * EPOCH_REMOVED. A history it cannot read is HISTORY_MISSING. It checks the renumber
 * commit R (the epoch's renumber_sha) against its parent P:
 *   (b) R is an ancestor of HEAD, so a squash or rebase of the renumber is caught;
 *   (c) each old slug keeps every (slug, suffix) pair, and each of its ids is bound to f(index);
 *       each new slug is one the epoch declares and carries the full 24-exercise grid;
 *   (e) the section count at R is the number of headings in the roadmap at R.
 *   (d) inside the window, a file the renumber moved that differs from R has a ledger row, and
 *       every ledger row describes a real diff since R.
 *   G-15 (branch side): a line main added since the branch point that carries an S-token >= 19
 *       must appear, mapped by f, at the mapped path on HEAD, or carry a carried_from_main row.
 * (d) and G-15 retire once R is an ancestor of main: the merge has landed, and they describe the window.
 *
 * Usage (from the repository root): node scripts/preservation/renumber_meaning_guard.mjs
 */
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openHistory, parseAddedLines, parseNameStatus } from './history.mjs'
import {
  SECTIONS_DIR,
  gridFor,
  hasTokenAtOrAbove,
  mapSectionNumber,
  mapTokens,
  readCurriculumAt,
  suffixOf,
} from './curriculum_snapshot.mjs'
import { ROADMAP_PATH, roadmapSectionCount } from './roadmap_section_count.mjs'
import { EPOCH_PATH, LEDGER_KINDS, WINDOW_PATH, readState } from './window_state.mjs'

/** Sections from this number on are the ones the renumber touches (S19 and up). */
const RENUMBER_FIRST = 19
const SHA = /^[0-9a-f]{40}$/
const pad = (n) => String(n).padStart(2, '0')
const fail = (code, detail = {}) => ({ code, ...detail })

function epochProblems(epoch) {
  const problems = []
  if (epoch.schema !== 'renumber_epoch/1') problems.push('schema must be renumber_epoch/1')
  if (typeof epoch.renumber_sha !== 'string' || !SHA.test(epoch.renumber_sha)) {
    problems.push('renumber_sha must be a full 40-character commit sha')
  }
  const slugs = Array.isArray(epoch.new_slugs) ? epoch.new_slugs : null
  const valid = (s) => typeof s?.slug === 'string' && Number.isInteger(s.index) && s.index >= RENUMBER_FIRST && s.index <= 55
  if (slugs === null || !slugs.every(valid)) problems.push('new_slugs must be [{slug, index}] with index 19..55')
  return problems
}

/** The window's ledger rows that are well formed. A malformed row is a finding, never silently dropped. */
function ledgerRows(window) {
  const raw = window?.ledger ?? []
  if (!Array.isArray(raw)) return { rows: [], findings: [fail('LEDGER_INVALID', { message: 'ledger must be an array' })] }
  const rows = []
  const findings = []
  raw.forEach((row, index) => {
    const wellFormed = typeof row?.path === 'string' && LEDGER_KINDS.has(row.kind)
      && (row.kind !== 'carried_from_main' || typeof row.line === 'string')
    if (wellFormed) rows.push(row)
    else findings.push(fail('LEDGER_ROW_INVALID', { index }))
  })
  return { rows, findings }
}

/** (c): old slugs keep their pairs and sit at f(index); new slugs are declared and fully gridded. */
function bindingFindings(pre, post, newSlugs) {
  const findings = []
  for (const before of pre.values()) {
    const after = post.get(before.slug)
    if (after) findings.push(...boundFindings(before, after))
    else findings.push(fail('SLUG_MISSING', { slug: before.slug }))
  }
  findings.push(...newSlugFindings(pre, post, newSlugs))
  return findings
}

function boundFindings(before, after) {
  const expected = mapSectionNumber(before.index)
  const findings = []
  if (after.index !== expected) {
    findings.push(fail('ID_BOUND_OFF_MAP', { slug: after.slug, expected, found: after.index }))
  }
  const prefix = `S${pad(expected)}-`
  for (const id of after.exerciseIds) {
    if (!id.startsWith(prefix)) findings.push(fail('ID_BOUND_OFF_MAP', { slug: after.slug, id, expected_prefix: prefix }))
  }
  const kept = new Set(after.exerciseIds.map(suffixOf))
  const wanted = new Set(before.exerciseIds.map(suffixOf))
  for (const suffix of wanted) {
    if (!kept.has(suffix)) findings.push(fail('PAIR_MISSING', { slug: after.slug, suffix }))
  }
  for (const suffix of kept) {
    if (!wanted.has(suffix)) findings.push(fail('PAIR_ADDED', { slug: after.slug, suffix }))
  }
  return findings
}

function newSlugFindings(pre, post, newSlugs) {
  const findings = []
  for (const after of post.values()) {
    if (pre.has(after.slug)) continue
    const declared = newSlugs.find((s) => s.slug === after.slug)
    if (declared) findings.push(...gridFindings(after, declared.index))
    else findings.push(fail('UNDECLARED_SLUG', { slug: after.slug }))
  }
  for (const declared of newSlugs) {
    if (!post.has(declared.slug)) findings.push(fail('NEW_SLUG_MISSING', { slug: declared.slug }))
  }
  return findings
}

function gridFindings(after, number) {
  const findings = []
  if (after.index !== number) findings.push(fail('NEW_SLUG_NUMBER', { slug: after.slug, expected: number, found: after.index }))
  const want = gridFor(number)
  const have = after.exerciseIds
  const missing = want.filter((id) => !have.includes(id))
  const extra = have.filter((id, i) => !want.includes(id) || have.indexOf(id) !== i)
  if (missing.length || extra.length) findings.push(fail('GRID_INCOMPLETE', { slug: after.slug, missing, extra }))
  return findings
}

/** (e): the number of sections at R is the number of section headings in the roadmap at R. */
function countFindings(history, sha, post) {
  const source = history.show(sha, ROADMAP_PATH)
  if (source === null) return [fail('ROADMAP_UNREADABLE', { path: ROADMAP_PATH, at: sha })]
  try {
    const declared = roadmapSectionCount(source)
    return declared === post.size ? [] : [fail('SECTION_COUNT_NOT_ROADMAP', { declared, found: post.size })]
  } catch (e) {
    return [fail('ROADMAP_MALFORMED', { message: e.message })]
  }
}

/**
 * The section files the renumber moved, read from the index rather than from git's rename
 * detection, which depends on similarity (a small or heavily edited file reads as delete plus add).
 * A slug whose file stem changed has moved: old path -> new path.
 */
function sectionRenames(pre, post) {
  const renames = new Map()
  for (const before of pre.values()) {
    const after = post.get(before.slug)
    if (after && after.stem !== before.stem) {
      renames.set(`${SECTIONS_DIR}/${before.stem}.ts`, `${SECTIONS_DIR}/${after.stem}.ts`)
    }
  }
  return renames
}

/** Every path a diff between two revisions touches (the last column of --name-status). */
function pathsChanged(history, a, b) {
  const text = history.nameStatus(a, b)
  if (text === null) throw new Error(`git cannot list the files that differ between ${a} and ${b}`)
  return new Set(parseNameStatus(text))
}

/** (d): a moved file that differs from R needs a ledger row, and each ledger row needs a diff. */
function movedFileFindings({ history, sha, head, renames, ledger }) {
  const findings = []
  for (const newPath of renames.values()) {
    const differs = history.show(head, newPath) !== history.show(sha, newPath)
    if (differs && !ledger.some((row) => row.path === newPath)) findings.push(fail('MOVED_FILE_UNLEDGERED', { path: newPath }))
  }
  const changed = pathsChanged(history, sha, head)
  for (const row of ledger) {
    if (!changed.has(row.path)) findings.push(fail('LEDGER_ROW_WITHOUT_DIFF', { path: row.path, kind: row.kind }))
  }
  return findings
}

/** G-15: a line main added since the branch point must arrive mapped, or be carried by a ledger row. */
function carriedFindings({ history, branchPoint, main, head, renames, ledger }) {
  const diff = history.unifiedDiff(branchPoint, main)
  if (diff === null) throw new Error(`git cannot diff ${branchPoint} against ${main}`)
  const findings = []
  for (const [path, lines] of parseAddedLines(diff)) {
    const target = renames.get(path) ?? path
    const onHead = new Set((history.show(head, target) ?? '').split('\n'))
    for (const line of lines) {
      if (!hasTokenAtOrAbove(line, RENUMBER_FIRST) || onHead.has(mapTokens(line))) continue
      const carried = ledger.some((row) => row.kind === 'carried_from_main' && row.path === target && row.line === line)
      if (!carried) findings.push(fail('CARRIED_TOKEN_UNMAPPED', { path: target, line, expected: mapTokens(line) }))
    }
  }
  return findings
}

/** The window-scoped checks (d) and G-15, or the record that they retired because R is on main. */
function windowFindings({ history, sha, main, head, renames, window }) {
  if (window === null) return { findings: [fail('WINDOW_MISSING', { path: WINDOW_PATH })], retired: [] }
  const ledger = ledgerRows(window)
  const branchPoint = typeof window.branch_point_sha === 'string' ? history.commit(window.branch_point_sha) : null
  if (branchPoint === null) {
    return { findings: [...ledger.findings, fail('HISTORY_MISSING', { reason: 'window branch_point_sha is unreadable' })], retired: [] }
  }
  const scoped = { history, sha, main, head, renames, ledger: ledger.rows }
  const findings = [
    ...ledger.findings,
    ...movedFileFindings(scoped),
    ...carriedFindings({ ...scoped, branchPoint }),
  ]
  return { findings, retired: [] }
}

/** A verdict: FAIL when any finding exists, OK otherwise. `retired` names the checks that stood down. */
function verdict(findings, retired = []) {
  return { state: findings.length > 0 ? 'FAIL' : 'OK', findings, retired }
}

/**
 * No epoch file at HEAD. That is DORMANT only if no epoch was ever committed: a file that existed in
 * HEAD's history and is gone is EPOCH_REMOVED (deleting it must not switch G-11 and G-15 off, the
 * same loophole G-14's WINDOW_REMOVED closes). A shallow checkout cannot tell the two apart, so it
 * is HISTORY_MISSING, never DORMANT. Owner, 2026-10-13: the epoch is not retirable, so EPOCH_REMOVED
 * is permanent; a deliberate cleanup would need an owner decision that changes this guard.
 */
function absentEpochVerdict(history) {
  if (history.isShallow()) return verdict([fail('HISTORY_MISSING', { reason: 'the repository is shallow' })])
  try {
    const lastCommit = history.lastCommitTouching('HEAD', EPOCH_PATH)
    if (lastCommit !== null) return verdict([fail('EPOCH_REMOVED', { path: EPOCH_PATH, last_commit: lastCommit })])
  } catch (e) {
    return verdict([fail('HISTORY_MISSING', { reason: e.message })])
  }
  return { state: 'DORMANT', findings: [], retired: [] }
}

/**
 * The guard. `history` is an openHistory() handle, `epoch` and `window` are the parsed state files
 * (null while absent). Returns { state: 'DORMANT' | 'OK' | 'FAIL', findings, retired }.
 */
export function checkRenumberMeaning({ history, epoch, window }) {
  if (epoch === null) return absentEpochVerdict(history)
  const problems = epochProblems(epoch)
  if (problems.length > 0) return verdict([fail('EPOCH_INVALID', { problems })])
  if (history.isShallow()) return verdict([fail('HISTORY_MISSING', { reason: 'the repository is shallow' })])
  const sha = epoch.renumber_sha
  const parent = history.commit(`${sha}^`)
  const mainTip = history.commit('origin/main') ?? history.commit('main')
  if (history.commit(sha) === null || parent === null || mainTip === null) {
    return verdict([fail('HISTORY_MISSING', { reason: 'the renumber sha, its parent, or main is unreadable' })])
  }
  try {
    return checkAgainstHistory({ history, epoch, window, sha, parent, mainTip })
  } catch (e) {
    return verdict([fail('HISTORY_MISSING', { reason: e.message })])
  }
}

function checkAgainstHistory({ history, epoch, window, sha, parent, mainTip }) {
  const newSlugs = epoch.new_slugs
  const findings = []
  if (!history.isAncestor(sha, 'HEAD')) findings.push(fail('RENUMBER_SHA_NOT_IN_HEAD', { sha }))
  let pre
  let post
  try {
    pre = readCurriculumAt(history, parent)
    post = readCurriculumAt(history, sha)
  } catch (e) {
    return verdict([...findings, fail('CURRICULUM_UNREADABLE', { message: e.message })])
  }
  findings.push(...bindingFindings(pre, post, newSlugs))
  findings.push(...countFindings(history, sha, post))
  if (history.isAncestor(sha, mainTip)) return verdict(findings, ['G-11(d)', 'G-15'])
  const windowed = windowFindings({ history, sha, main: mainTip, head: 'HEAD', renames: sectionRenames(pre, post), window })
  return verdict([...findings, ...windowed.findings])
}

function runCli() {
  const root = process.cwd()
  let epoch
  let window
  try {
    epoch = readState(root, EPOCH_PATH)
    window = readState(root, WINDOW_PATH)
  } catch (e) {
    console.error(`RENUMBER MEANING GUARD FAILED: ${e.message}`)
    process.exit(1)
  }
  const result = checkRenumberMeaning({ history: openHistory(root), epoch, window })
  if (result.state === 'DORMANT') {
    console.log(`RENUMBER MEANING GUARD: DORMANT (${EPOCH_PATH} is absent)`)
    return
  }
  if (result.state === 'FAIL') {
    console.error('RENUMBER MEANING GUARD FAILED')
    console.error(JSON.stringify(result, null, 2))
    process.exit(1)
  }
  console.log('RENUMBER MEANING GUARD OK')
  console.log(JSON.stringify({ retired: result.retired }))
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) runCli()
