#!/usr/bin/env node
/**
 * G-14: while the curriculum/55 window is open, main may not change what the renumber rewrites,
 * unless an owner override names the change. Design: design_G_round4.md §4 ("Freeze on main").
 *
 * The window file, audit/safe-agent/curriculum55_window.json, holds branch_point_sha (the commit
 * the branch was cut from: the parent of the commit that added the window), status ('open' or
 * 'closed'), overrides[] (path, reason, owner_approval) and the renumber's ledger.
 *
 * Dormant while the window file is absent. The transition check closes the loophole that deleting
 * the file would switch the freeze off: a window file that ever existed in HEAD's history and is
 * now absent is WINDOW_REMOVED. Without history the guard cannot tell the difference, so a shallow
 * checkout is HISTORY_MISSING, never DORMANT.
 *
 * While open, comparing main against the branch point (and HEAD too, until the renumber exists in the
 * tree: no renumber_epoch.json, so a pull request to main is held to the freeze before it merges), it
 * fails when any of these differs without an override row for its path:
 *   - the frozen paths below (the course index and requirements, the three roadmaps, the capstone
 *     catalog, the figure registry, PdfReport.tsx, section_ledger), and the set of exam-bank files;
 *   - in sections S19..S52 at the branch point, the parsed id, index, title, phase, exercise-id set
 *     and figure ids. Prose, exercise bodies, the manifest, tools/fixer and the glossary are not frozen.
 * A window closes only with the renumber_sha that renumber_epoch.json records, when that commit is an
 * ancestor of HEAD (WINDOW_CLOSED_WITHOUT_RENUMBER). A window that names some other ancestor does not close.
 *
 * Usage (from the repository root): node scripts/preservation/curriculum55_freeze_guard.mjs
 */
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openHistory } from './history.mjs'
import { INDEX_PATH, SECTIONS_DIR } from './curriculum_snapshot.mjs'
import { EPOCH_PATH, WINDOW_PATH, readState } from './window_state.mjs'

// The three roadmaps are the ones verified_facts.json RT-A8 names: the root V3, its byte-identical copy
// under upload/ (read by scripts/v3_regression.spec.ts, and it must receive the identical renumber diff)
// and learning_roadmap.md (read by scripts/regression.spec.ts). el_arte_de_python_roadmap_maestro_52_secciones.md
// is historical and no code reads it (reviews_round0/contract_surface.md), so it is not frozen.
export const FROZEN_PATHS = [
  'src/lib/course/index.ts',
  'course-state/course_requirements.json',
  'learning_roadmap_52_V3.md',
  'upload/learning_roadmap_52_V3.md',
  'learning_roadmap.md',
  'src/lib/capstones/catalog.ts',
  'src/components/course/figures/index.tsx',
  'src/components/course/figures/data/index.ts',
  'src/components/course/PdfReport.tsx',
  'course-state/section_ledger.json',
]
export const EXAM_BANK_PATTERN = /^course-state\/s\d{2}_phase5_exam_bank\.json$/
export const FIELDS_FIRST = 19
export const FIELDS_LAST = 52
const SHA = /^[0-9a-f]{40}$/
const fail = (code, detail = {}) => ({ code, ...detail })

/** The fields G-14 freezes in one section file. Each is null or a list when the file lacks it. */
export function sectionFieldsOf(text) {
  const first = (pattern) => text.match(pattern)?.[1] ?? null
  const unique = (pattern) => [...new Set([...text.matchAll(pattern)].map((m) => m[1]))].sort()
  return {
    id: first(/\bid:\s*['"]([^'"]+)['"]/),
    index: first(/\bindex:\s*(\d+)/),
    title: text.match(/\btitle:\s*(["'])(.*?)\1/)?.[2] ?? null,
    phase: first(/\bphase:\s*(\d+)/),
    exerciseIds: unique(/\bid:\s*['"](S\d{2}-T[1-4]-[AB]-E[1-3])['"]/g),
    figureIds: unique(/\bfigure:\s*\{\s*id:\s*['"]([^'"]+)['"]/g),
  }
}

/** The section files imported at `rev` whose index is in S19..S52, keyed by path. Throws when unreadable. */
function frozenSectionsAt(history, rev) {
  const index = history.show(rev, INDEX_PATH)
  if (index === null) throw new Error(`${INDEX_PATH} is unreadable at ${rev}`)
  const sections = new Map()
  for (const [, stem] of index.matchAll(/import\s+\{\s*section\d{2}\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g)) {
    const path = `${SECTIONS_DIR}/${stem}.ts`
    const text = history.show(rev, path)
    if (text === null) throw new Error(`section file ${path} is unreadable at ${rev}`)
    const fields = sectionFieldsOf(text)
    const number = Number(fields.index)
    if (number >= FIELDS_FIRST && number <= FIELDS_LAST) sections.set(path, fields)
  }
  return sections
}

/** The overrides that are well formed, and a finding for each malformed one. */
function overridesOf(window) {
  const raw = window.overrides ?? []
  if (!Array.isArray(raw)) return { rows: [], findings: [fail('OVERRIDE_INVALID', { message: 'overrides must be an array' })] }
  const rows = []
  const findings = []
  raw.forEach((row, index) => {
    const ok = ['path', 'reason', 'owner_approval'].every((key) => typeof row?.[key] === 'string' && row[key].trim() !== '')
    if (ok) rows.push(row)
    else findings.push(fail('OVERRIDE_INVALID', { index }))
  })
  return { rows, findings }
}

function examBanksAt(history, rev) {
  return new Set(history.listAt(rev).filter((p) => EXAM_BANK_PATTERN.test(p)))
}

/** The frozen paths, and the exam-bank set, that differ between the branch point and main. */
function frozenPathFindings(history, bp, main, overridden) {
  const findings = []
  for (const path of FROZEN_PATHS) {
    if (history.show(bp, path) !== history.show(main, path) && !overridden.has(path)) {
      findings.push(fail('FROZEN_CHANGED', { path }))
    }
  }
  const before = examBanksAt(history, bp)
  const after = examBanksAt(history, main)
  for (const path of new Set([...before, ...after])) {
    if (before.has(path) !== after.has(path) && !overridden.has(path)) findings.push(fail('EXAM_BANK_SET_CHANGED', { path }))
  }
  return findings
}

/** The S19..S52 fields that differ between the branch point and main, for each section file. */
function sectionFieldFindings(history, bp, main, overridden) {
  const findings = []
  for (const [path, before] of frozenSectionsAt(history, bp)) {
    const text = history.show(main, path)
    const now = text === null ? null : sectionFieldsOf(text)
    if (JSON.stringify(before) !== JSON.stringify(now) && !overridden.has(path)) {
      findings.push(fail('FROZEN_SECTION_FIELD_CHANGED', { path, fields: changedKeys(before, now) }))
    }
  }
  return findings
}

function changedKeys(before, now) {
  return Object.keys(before).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(now?.[key]))
}

function verdict(findings, extra = {}) {
  return { state: findings.length > 0 ? 'FAIL' : 'OK', findings, ...extra }
}

/** Every frozen-item finding for `rev` against the branch point, each tagged with what was compared. */
function freezeFindingsAgainst({ history, bp, rev, against, overridden }) {
  return [
    ...frozenPathFindings(history, bp, rev, overridden),
    ...sectionFieldFindings(history, bp, rev, overridden),
  ].map((finding) => ({ ...finding, against }))
}

/**
 * The window while open: the freeze against the branch point. Main is always compared. The tree under
 * test is compared too until the renumber exists in it (no epoch file): in a pull request run origin/main
 * is the base tip, which does not hold the change under review, so a comparison with main alone goes
 * green on the pull request and red only after the merge. Once the epoch exists the tree differs from
 * the branch point on purpose (the renumber), and only main is held to the freeze.
 */
function openWindowVerdict({ history, window, main, epoch }) {
  const bp = history.commit(window.branch_point_sha ?? '')
  if (bp === null) return verdict([fail('HISTORY_MISSING', { reason: 'window branch_point_sha is unreadable' })])
  const head = history.commit('HEAD')
  if (head === null) return verdict([fail('HISTORY_MISSING', { reason: 'HEAD is unreadable' })])
  const { rows, findings: overrideFindings } = overridesOf(window)
  const overridden = new Set(rows.map((row) => row.path))
  const targets = [{ rev: main, against: 'main' }]
  if (epoch === null && head !== main) targets.push({ rev: head, against: 'HEAD' })
  const findings = [
    ...overrideFindings,
    ...targets.flatMap((target) => freezeFindingsAgainst({ history, bp, overridden, ...target })),
  ]
  return verdict(findings, { frozen_items: FROZEN_PATHS.length, branch_point: bp })
}

/**
 * The window once closed. It must name the renumber sha that renumber_epoch.json records, and HEAD
 * must contain that commit. A window that names any other ancestor closes the freeze without the
 * renumber, so each of the three conditions fails on its own.
 */
function closedWindowVerdict({ history, window, epoch }) {
  const sha = window.renumber_sha
  const refuse = (reason) => verdict([fail('WINDOW_CLOSED_WITHOUT_RENUMBER', { reason, renumber_sha: sha ?? null })])
  if (typeof sha !== 'string' || !SHA.test(sha)) return refuse('the closed window names no renumber_sha')
  if (epoch === null) return refuse(`${EPOCH_PATH} is absent, so no renumber is recorded`)
  if (epoch.renumber_sha !== sha) return refuse(`the window's renumber_sha is not the one ${EPOCH_PATH} records`)
  if (history.commit(sha) === null) return refuse('renumber_sha is not a commit git can read')
  if (!history.isAncestor(sha, 'HEAD')) return refuse('renumber_sha is not an ancestor of HEAD')
  return verdict([], { window: 'closed' })
}

/**
 * The guard. `window` and `epoch` are the parsed state files, or null while absent. `main` is the
 * commit main points at. Returns { state: 'DORMANT' | 'OK' | 'FAIL', findings, ... }.
 */
export function checkFreeze({ history, window, epoch = null, main }) {
  if (history.isShallow()) return verdict([fail('HISTORY_MISSING', { reason: 'the repository is shallow' })])
  if (window === null) {
    const everCommitted = history.lastCommitTouching('HEAD', WINDOW_PATH)
    if (everCommitted !== null) return verdict([fail('WINDOW_REMOVED', { path: WINDOW_PATH, last_commit: everCommitted })])
    return { state: 'DORMANT', findings: [] }
  }
  if (window.status === 'closed') return closedWindowVerdict({ history, window, epoch })
  if (window.status !== 'open') return verdict([fail('WINDOW_STATUS_INVALID', { status: window.status ?? null })])
  if (main === null) return verdict([fail('HISTORY_MISSING', { reason: 'neither origin/main nor main is readable' })])
  return openWindowVerdict({ history, window, main, epoch })
}

function main() {
  const root = process.cwd()
  let window
  let epoch
  try {
    window = readState(root, WINDOW_PATH)
    epoch = readState(root, EPOCH_PATH)
  } catch (e) {
    console.error(`CURRICULUM55 FREEZE GUARD FAILED: ${e.message}`)
    process.exit(1)
  }
  const history = openHistory(root)
  let result
  try {
    const mainTip = history.commit('origin/main') ?? history.commit('main')
    result = checkFreeze({ history, window, epoch, main: mainTip })
  } catch (e) {
    result = verdict([fail('HISTORY_MISSING', { reason: e.message })])
  }
  if (result.state === 'DORMANT') {
    console.log(`CURRICULUM55 FREEZE GUARD: DORMANT (${WINDOW_PATH} is absent)`)
    return
  }
  if (result.state === 'FAIL') {
    console.error('CURRICULUM55 FREEZE GUARD FAILED')
    console.error(JSON.stringify(result, null, 2))
    process.exit(1)
  }
  console.log('CURRICULUM55 FREEZE GUARD OK')
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main()
