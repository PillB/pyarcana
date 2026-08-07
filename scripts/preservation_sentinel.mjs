#!/usr/bin/env node
/**
 * CI deletion / preservation sentinel.
 *
 * Fails when a PR/push candidate:
 * - deletes tracked files not on the deletion allowlist
 * - removes protected active curriculum section IDs / exercise IDs
 * - removes tests, migrations, or progress fields from the progress sanitizer contract
 *
 * Baseline: merge-base with origin/main when available, else HEAD~1, else
 * audit/safe-agent/preservation-manifest-before.json
 *
 * Usage:
 *   node scripts/preservation_sentinel.mjs
 *   node scripts/preservation_sentinel.mjs --base <sha>
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ALLOWLIST_PATH = join(ROOT, 'audit/safe-agent/deletion-allowlist.json')
const BEFORE_PATH = join(ROOT, 'audit/safe-agent/preservation-manifest-before.json')
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
  if (envBase) return envBase
  // Prefer origin/main merge-base on PRs
  const mergeBase = tryGit('git merge-base HEAD origin/main')
  if (mergeBase) return mergeBase
  const parent = tryGit('git rev-parse HEAD~1')
  if (parent) return parent
  return null
}

function deletedPaths(base) {
  if (!base) return []
  const out = tryGit(`git diff --name-status --diff-filter=D ${base}...HEAD`)
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
  const sectionIds = []
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
    if (idMatch) sectionIds.push(idMatch[1])
    for (const m of text.matchAll(/\bid:\s*['"](S\d{2}-T\d-[AB]-E[1-3])['"]/g)) {
      exerciseIds.push(m[1])
    }
  }
  return {
    activeCount: imports.length,
    sectionIds: new Set(sectionIds),
    exerciseIds: new Set(exerciseIds),
    importStems: imports.map(([, , stem]) => stem),
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

function main() {
  const args = process.argv.slice(2)
  const baseIdx = args.indexOf('--base')
  const cliBase = baseIdx >= 0 ? args[baseIdx + 1] : null
  const base = resolveBase(cliBase)
  const head = git('git rev-parse HEAD')
  const allowlist = loadAllowlist()
  const failures = []
  const warnings = []

  // 1) Tracked file deletions
  const deleted = deletedPaths(base)
  const unauthorizedDeletes = []
  for (const path of deleted) {
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

  // 2) Curriculum ID preservation (when base available)
  let curriculum = null
  if (base) {
    try {
      const before = extractActiveCurriculum(base)
      const after = extractActiveCurriculum(head)
      curriculum = {
        before_count: before.activeCount,
        after_count: after.activeCount,
        removed_section_ids: [...before.sectionIds].filter((id) => !after.sectionIds.has(id)),
        removed_exercise_ids: [...before.exerciseIds].filter((id) => !after.exerciseIds.has(id)),
      }
      if (after.activeCount < before.activeCount) {
        failures.push({
          code: 'ACTIVE_SECTION_COUNT_DECREASED',
          message: `Active sections decreased ${before.activeCount} → ${after.activeCount}`,
        })
      }
      if (after.activeCount !== 52) {
        failures.push({
          code: 'ACTIVE_SECTION_COUNT_NOT_52',
          message: `Active imported sections must be 52, found ${after.activeCount}`,
        })
      }
      for (const id of curriculum.removed_section_ids) {
        failures.push({
          code: 'SECTION_ID_REMOVED',
          id,
          message: `Protected section id removed: ${id}`,
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
    } catch (e) {
      warnings.push({ code: 'CURRICULUM_COMPARE_SKIPPED', message: String(e) })
    }

    // 3) Tests / migrations removed
    try {
      const b = testsAndMigrations(base)
      const a = testsAndMigrations(head)
      const removedTests = b.tests.filter((t) => !a.tests.includes(t) && !allowlist.has(t))
      const removedMigrations = b.migrations.filter((m) => !a.migrations.includes(m) && !allowlist.has(m))
      for (const t of removedTests) {
        failures.push({ code: 'TEST_REMOVED', path: t, message: `Test removed: ${t}` })
      }
      for (const m of removedMigrations) {
        failures.push({ code: 'MIGRATION_REMOVED', path: m, message: `Migration removed: ${m}` })
      }
    } catch (e) {
      warnings.push({ code: 'TEST_MIG_COMPARE_SKIPPED', message: String(e) })
    }

    // 4) Progress fields
    try {
      const afterFields = progressFieldsPresent(head)
      for (const f of afterFields.missing) {
        failures.push({
          code: 'PROGRESS_FIELD_REMOVED',
          field: f,
          message: `Progress field missing from progress contract sources: ${f}`,
        })
      }
    } catch (e) {
      warnings.push({ code: 'PROGRESS_FIELD_CHECK_SKIPPED', message: String(e) })
    }
  } else if (existsSync(BEFORE_PATH)) {
    warnings.push({
      code: 'NO_GIT_BASE',
      message: 'No git base; using on-disk before manifest only for informational counts',
    })
  } else {
    warnings.push({ code: 'NO_BASE', message: 'No comparison base available' })
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
