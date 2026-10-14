#!/usr/bin/env node
/**
 * CI deletion / preservation sentinel.
 *
 * Fails when a PR/push candidate:
 * - deletes tracked files not on the deletion allowlist
 * - removes protected active curriculum section IDs / exercise IDs
 *   (a section id renamed through SECTION_ID_RENAMES to an id still active is preserved:
 *   `migrateSectionIds` carries learner progress across it; see scripts/section_id_renames.mjs.
 *   An exercise id may leave only with a `removed` row appended to the exercise-meaning ledger that names
 *   an owner decision and cites the anchor the base held for it; see scripts/exercise_meaning.mjs)
 * - removes tests, migrations, or progress fields from the progress sanitizer contract
 *
 * Baseline: --base, else PRESERVATION_BASE / GITHUB_BASE_SHA, else the merge-base with
 * origin/main, else HEAD~1. With none of those, or a base git cannot diff against, it fails:
 * it used to fall back to the before-manifest "for informational counts", compare nothing, and
 * exit 0 - a sentinel that cannot compare has not passed.
 *
 * Usage:
 *   node scripts/preservation_sentinel.mjs
 *   node scripts/preservation_sentinel.mjs --base <sha>
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  SECTION_ID_RENAMES_PATH,
  classifyMissingSectionIds,
  parseSectionIdRenames,
} from './section_id_renames.mjs'
import { ROADMAP_PATH, roadmapSectionCount } from './preservation/roadmap_section_count.mjs'
import { ANCHORS_PATH, ledgerFindings, ledgeredRemovals, readAnchorState } from './exercise_meaning.mjs'

const ROOT = process.cwd()
const ALLOWLIST_PATH = join(ROOT, 'audit/safe-agent/deletion-allowlist.json')
const RESULT_PATH = join(ROOT, 'audit/safe-agent/preservation-sentinel-result.json')

const PROGRESS_FIELDS = [
  'completedSections',
  'completedSubSteps',
  'quizScores',
  'lastVisited',
  'bookmarks',
  'startDate',
  'isHydratedFromServer',
]

function git(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim()
}

function tryGit(cmd) {
  try {
    return git(cmd)
  } catch {
    return null
  }
}

function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return new Map()
  const data = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'))
  const map = new Map()
  for (const entry of data.allowlist || []) {
    if (entry.path && entry.request_id) map.set(entry.path, entry)
  }
  return map
}

function resolveBase(cliBase) {
  if (cliBase) return cliBase
  const envBase = process.env.PRESERVATION_BASE || process.env.GITHUB_BASE_SHA
  // A push that creates a branch has no `before`: GitHub sends forty zeros, which is not a commit,
  // and the diff against it failed every new branch's first push. Compare against where the branch
  // left main. Without origin/main there is no such point, and the answer is BASE_UNRESOLVED, never
  // HEAD~1: that would check only the last commit of a branch that may have many.
  if (envBase && /^0+$/.test(envBase)) return tryGit('git merge-base HEAD origin/main')
  if (envBase) return envBase
  // Prefer origin/main merge-base on PRs
  const mergeBase = tryGit('git merge-base HEAD origin/main')
  if (mergeBase) return mergeBase
  const parent = tryGit('git rev-parse HEAD~1')
  if (parent) return parent
  return null
}

/** null when git cannot diff against the base - never read as "nothing was deleted". */
function deletedPaths(base) {
  const out = tryGit(`git diff --name-status --diff-filter=D ${base}...HEAD`)
  if (out === null) return null
  if (!out) return []
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t')
      return parts[parts.length - 1]
    })
}

function extractActiveCurriculum(treeish) {
  const index = git(`git show ${treeish}:src/lib/course/index.ts`)
  const imports = [...index.matchAll(/import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g)]
  const sections = new Map() // section id -> its two-digit number in src/lib/course/index.ts
  const exerciseIds = []
  for (const [, num, stem] of imports) {
    const path = `src/lib/course/sections/${stem}.ts`
    let text
    try {
      text = git(`git show ${treeish}:${path}`)
    } catch {
      continue
    }
    const idMatch = text.match(/\bid:\s*['"]([^'"]+)['"]/)
    if (idMatch) sections.set(idMatch[1], num)
    for (const m of text.matchAll(/\bid:\s*['"](S\d{2}-T\d-[AB]-E[1-3])['"]/g)) {
      exerciseIds.push(m[1])
    }
  }
  return {
    activeCount: imports.length,
    sections,
    exerciseIds: new Set(exerciseIds),
    importStems: imports.map(([, , stem]) => stem),
  }
}

/**
 * SECTION_ID_RENAMES as committed at `treeish`, the same tree the section ids come from.
 * A commit from before the map existed has no renames. A map that exists but cannot be
 * parsed also yields no renames, and an error the caller must report as a failure.
 */
function readSectionIdRenames(treeish) {
  const source = tryGit(`git show ${treeish}:${SECTION_ID_RENAMES_PATH}`)
  if (source === null) return { renames: new Map(), error: null }
  try {
    return { renames: parseSectionIdRenames(source), error: null }
  } catch (e) {
    return { renames: new Map(), error: e.message }
  }
}

/**
 * The section count the roadmap at `treeish` declares, or null after recording why it could not be
 * read. A count the sentinel cannot read is a failure, never a guess at 52 or at the tree's own count.
 */
function roadmapCountAt(treeish, failures) {
  const source = tryGit(`git show ${treeish}:${ROADMAP_PATH}`)
  if (source === null) {
    failures.push({
      code: 'ROADMAP_UNREADABLE',
      path: ROADMAP_PATH,
      message: `Cannot read ${ROADMAP_PATH}, so the section count cannot be checked`,
    })
    return null
  }
  try {
    return roadmapSectionCount(source)
  } catch (e) {
    failures.push({ code: 'ROADMAP_MALFORMED', path: ROADMAP_PATH, message: e.message })
    return null
  }
}

/**
 * The exercise ids an appended `removed` ledger row lets leave the course (an owner decision, see
 * scripts/exercise_meaning.mjs). A ledger that cannot be read excuses nothing: the removal stays a
 * failure, and compareExerciseMeaning says why the ledger could not be read.
 */
function ledgeredRemovalIds(base, head) {
  try {
    const was = readAnchorState(ROOT, base)
    const now = readAnchorState(ROOT, head)
    return ledgeredRemovals({ baseAnchors: was.anchors, baseRows: was.rows, headRows: now.rows })
  } catch {
    return new Set()
  }
}

/** The exercise ids that left the course source, split into those the ledger lets leave and those nothing excuses. */
function splitRemovedExerciseIds(base, head, before, after) {
  const gone = [...before.exerciseIds].filter((id) => !after.exerciseIds.has(id))
  const excused = gone.length > 0 ? ledgeredRemovalIds(base, head) : new Set()
  return { removed: gone.filter((id) => !excused.has(id)), ledgered: gone.filter((id) => excused.has(id)) }
}

function compareCurriculum(base, head, failures) {
  const before = extractActiveCurriculum(base)
  const after = extractActiveCurriculum(head)
  const exercises = splitRemovedExerciseIds(base, head, before, after)
  const { renames, error } = readSectionIdRenames(head)
  if (error) {
    failures.push({
      code: 'SECTION_ID_RENAMES_UNREADABLE',
      path: SECTION_ID_RENAMES_PATH,
      message: `Cannot read SECTION_ID_RENAMES, so no section id counts as renamed: ${error}`,
    })
  }
  const sectionIds = classifyMissingSectionIds(before.sections, after.sections, renames)
  const expectedCount = roadmapCountAt(head, failures)
  const curriculum = {
    before_count: before.activeCount,
    after_count: after.activeCount,
    expected_count: expectedCount,
    removed_section_ids: sectionIds.removed.map(({ id }) => id),
    renamed_section_ids: sectionIds.renamed,
    removed_exercise_ids: exercises.removed,
    ledgered_removed_exercise_ids: exercises.ledgered,
  }
  if (after.activeCount < before.activeCount) {
    failures.push({
      code: 'ACTIVE_SECTION_COUNT_DECREASED',
      message: `Active sections decreased ${before.activeCount} → ${after.activeCount}`,
    })
  }
  if (expectedCount !== null && after.activeCount !== expectedCount) {
    failures.push({
      code: 'ACTIVE_SECTION_COUNT_NOT_ROADMAP',
      expected: expectedCount,
      found: after.activeCount,
      message: `Active imported sections must match the ${expectedCount} headings in ${ROADMAP_PATH}, found ${after.activeCount}`,
    })
  }
  for (const { id, reason } of sectionIds.removed) {
    failures.push({
      code: 'SECTION_ID_REMOVED',
      id,
      reason,
      message: `Protected section id removed: ${id} (${reason})`,
    })
  }
  // Cap exercise removals reporting (noise control) but still fail
  if (curriculum.removed_exercise_ids.length > 0) {
    failures.push({
      code: 'EXERCISE_IDS_REMOVED',
      count: curriculum.removed_exercise_ids.length,
      sample: curriculum.removed_exercise_ids.slice(0, 20),
      message: `${curriculum.removed_exercise_ids.length} exercise id(s) removed from active curriculum`,
    })
  }
  return curriculum
}

/**
 * Run one comparison, turning a throw into a failure. A comparison that threw has not run, and a
 * sentinel that could not compare has not passed. These were warnings until 2026-10-05, and that
 * was a hole: moving src/lib/course/index.ts reads as a rename to `--diff-filter=D`, so nothing
 * counted as deleted, the curriculum compare threw, and the sentinel exited 0 having compared no
 * section and no exercise id.
 */
function attempt(code, failures, compare) {
  try {
    return compare()
  } catch (e) {
    failures.push({ code, message: `Cannot compare, so this check has not passed: ${String(e)}` })
    return null
  }
}

function compareTestsAndMigrations(base, head, allowlist, failures) {
  const b = testsAndMigrations(base)
  const a = testsAndMigrations(head)
  for (const t of b.tests.filter((t) => !a.tests.includes(t) && !allowlist.has(t))) {
    failures.push({ code: 'TEST_REMOVED', path: t, message: `Test removed: ${t}` })
  }
  for (const m of b.migrations.filter((m) => !a.migrations.includes(m) && !allowlist.has(m))) {
    failures.push({ code: 'MIGRATION_REMOVED', path: m, message: `Migration removed: ${m}` })
  }
}

function checkProgressFields(head, failures) {
  for (const f of progressFieldsPresent(head).missing) {
    failures.push({
      code: 'PROGRESS_FIELD_REMOVED',
      field: f,
      message: `Progress field missing from progress contract sources: ${f}`,
    })
  }
}

function progressFieldsPresent(treeish) {
  // Prefer pure sanitizer module; fall back to progress-store for older commits.
  let text = null
  for (const path of ['src/lib/progress-sanitize.ts', 'src/lib/progress-store.ts']) {
    try {
      text = git(`git show ${treeish}:${path}`)
      break
    } catch {
      /* try next */
    }
  }
  if (!text) return { present: [], missing: [...PROGRESS_FIELDS] }
  const present = PROGRESS_FIELDS.filter((f) => text.includes(f))
  const missing = PROGRESS_FIELDS.filter((f) => !text.includes(f))
  return { present, missing }
}

function testsAndMigrations(treeish) {
  const files = git(`git ls-tree -r --name-only ${treeish}`).split('\n').filter(Boolean)
  return {
    tests: files.filter(
      (f) =>
        f.startsWith('tests/') ||
        f.endsWith('.spec.ts') ||
        f.endsWith('.test.ts') ||
        f.endsWith('.test.mjs') ||
        f.includes('/test_')
    ),
    migrations: files.filter((f) => f.startsWith('prisma/migrations/')),
  }
}

/**
 * B11: every exercise anchor that changes between base and head needs a ledger row added after the
 * base's rows, and an old row is never edited (scripts/exercise_meaning.mjs). A base without anchors
 * is the commit that introduces them, which has nothing to compare with. Before the anchors exist
 * the check is dormant, like the renumber guards; once the base had them, their absence at HEAD is a
 * deletion, which fails.
 */
function compareExerciseMeaning(base, head, failures) {
  const before = readAnchorState(ROOT, base)
  const after = readAnchorState(ROOT, head)
  if (after.anchors === null) {
    if (before.anchors !== null) {
      failures.push({ code: 'EXERCISE_ANCHORS_REMOVED', path: ANCHORS_PATH, message: `${ANCHORS_PATH} existed at the base and is gone at HEAD` })
    }
    return
  }
  const findings = ledgerFindings({
    baseAnchors: before.anchors,
    headAnchors: after.anchors,
    baseRows: before.rows,
    headRows: after.rows,
  })
  for (const finding of findings) {
    failures.push({ ...finding, code: 'EXERCISE_MEANING_LEDGER', rule: finding.code })
  }
}

function main() {
  const args = process.argv.slice(2)
  const baseIdx = args.indexOf('--base')
  const cliBase = baseIdx >= 0 ? args[baseIdx + 1] : null
  const base = resolveBase(cliBase)
  const head = git('git rev-parse HEAD')
  const allowlist = loadAllowlist()
  const failures = []
  const warnings = []

  // 0) A comparison that could not run is a failure. With no base, or a base git cannot read,
  // this used to report no deletions, skip every comparison below and exit 0 - a sentinel that
  // checked nothing, indistinguishable from one that found nothing.
  if (!base) {
    failures.push({
      code: 'BASE_UNRESOLVED',
      message: 'Cannot compare: no base commit resolved (pass --base, or set PRESERVATION_BASE)',
    })
  }

  // 1) Tracked file deletions
  const deleted = base ? deletedPaths(base) : []
  if (deleted === null) {
    failures.push({ code: 'BASE_UNREADABLE', message: `Cannot compare: git could not diff ${base}...HEAD` })
  }
  const unauthorizedDeletes = []
  for (const path of deleted ?? []) {
    if (!allowlist.has(path)) {
      unauthorizedDeletes.push(path)
      failures.push({
        code: 'UNAUTHORIZED_DELETE',
        path,
        message: `Tracked file deleted without deletion-allowlist entry: ${path}`,
      })
    } else {
      const entry = allowlist.get(path)
      warnings.push({
        code: 'AUTHORIZED_DELETE',
        path,
        request_id: entry.request_id,
      })
    }
  }

  // 2) curriculum ids, 3) tests and migrations, 4) progress fields. Each one that cannot run fails.
  let curriculum = null
  if (base) {
    curriculum = attempt('CURRICULUM_UNCOMPARABLE', failures, () => compareCurriculum(base, head, failures))
    attempt('TESTS_MIGRATIONS_UNCOMPARABLE', failures,
      () => compareTestsAndMigrations(base, head, allowlist, failures))
    attempt('PROGRESS_FIELDS_UNCOMPARABLE', failures, () => checkProgressFields(head, failures))
    attempt('EXERCISE_MEANING_UNCOMPARABLE', failures, () => compareExerciseMeaning(base, head, failures))
  }

  const result = {
    ok: failures.length === 0,
    head,
    base,
    unauthorized_deletes: unauthorizedDeletes,
    authorized_deletes: warnings.filter((w) => w.code === 'AUTHORIZED_DELETE'),
    curriculum,
    failure_count: failures.length,
    failures,
    warnings,
    checked_at: new Date().toISOString(),
  }

  mkdirSync(join(ROOT, 'audit/safe-agent'), { recursive: true })
  writeFileSync(RESULT_PATH, JSON.stringify(result, null, 2) + '\n')

  if (!result.ok) {
    console.error('PRESERVATION SENTINEL FAILED')
    console.error(JSON.stringify(result, null, 2))
    process.exit(1)
  }
  console.log('PRESERVATION SENTINEL OK')
  console.log(JSON.stringify({ head, base, unauthorized_deletes: 0, failures: 0 }, null, 2))
}

main()
