#!/usr/bin/env node
/**
 * Generate a preservation manifest for Safe-Agent baseline / after comparison.
 * Usage:
 *   node scripts/generate_preservation_manifest.mjs [before|after|path]
 */
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const OUT_DIR = join(ROOT, 'audit', 'safe-agent')

const PROTECTED_PREFIXES = [
  'src/lib/course/sections/',
  'src/lib/course/index.ts',
  'src/lib/progress-store.ts',
  'src/lib/progress-sanitize.ts',
  'prisma/migrations/',
  'public/',
  'tests/',
  'scripts/regression.spec.ts',
  'scripts/static_public.spec.ts',
  'scripts/v3_invariant_validator.py',
  'scripts/v3_regression_counts.test.mjs',
  'scripts/preservation_sentinel.mjs',
  'scripts/generate_preservation_manifest.mjs',
  'learning_roadmap_52_V3.md',
  'AGENTS.md',
  '.github/CODEOWNERS',
  '.github/workflows/',
  'audit/safe-agent/deletion-allowlist.json',
]

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

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function isProtected(rel) {
  return PROTECTED_PREFIXES.some((p) => rel === p || rel.startsWith(p))
}

function activeSectionImports() {
  const index = readFileSync(join(ROOT, 'src/lib/course/index.ts'), 'utf8')
  const imports = [...index.matchAll(/import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g)]
  return imports.map(([_, num, stem]) => ({
    number: Number(num),
    stem,
    path: `src/lib/course/sections/${stem}.ts`,
  }))
}

function extractIds(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const sectionIdMatch = text.match(/\bid:\s*['"]([^'"]+)['"]/)
  const sectionId = sectionIdMatch ? sectionIdMatch[1] : null
  const subtopics = [...text.matchAll(/subtopicId:\s*['"](S\d{2}-T\d-[AB])['"]/g)].map((m) => m[1])
  const demos = [...text.matchAll(/demoId:\s*['"](S\d{2}-T\d-[AB]-DEMO)['"]/g)].map((m) => m[1])
  const exercises = [...text.matchAll(/\bid:\s*['"](S\d{2}-T\d-[AB]-E[1-3])['"]/g)].map((m) => m[1])
  return {
    sectionId,
    subtopics: [...new Set(subtopics)].sort(),
    demos: [...new Set(demos)].sort(),
    exercises: [...new Set(exercises)].sort(),
  }
}

function collectRoutes() {
  const app = join(ROOT, 'src/app')
  const routes = []
  for (const file of walk(app)) {
    const rel = relative(app, file).replace(/\\/g, '/')
    if (rel.endsWith('page.tsx')) {
      const dir = rel.replace(/\/page\.tsx$/, '').replace(/page\.tsx$/, '')
      routes.push(dir === '' || dir === '.' ? '/' : `/${dir}`)
    }
    if (rel.endsWith('route.ts')) {
      const dir = rel.replace(/\/route\.ts$/, '')
      routes.push(`/${dir}`)
    }
  }
  return [...new Set(routes)].sort()
}

function buildManifest() {
  const tracked = git('git ls-files').split('\n').filter(Boolean)
  const protectedFiles = []
  for (const f of tracked) {
    if (!isProtected(f)) continue
    const abs = join(ROOT, f)
    if (!existsSync(abs) || !statSync(abs).isFile()) continue
    protectedFiles.push({ path: f, sha256: sha256(abs), size: statSync(abs).size })
  }

  const active = activeSectionImports()
  const sectionIds = []
  const exerciseIds = []
  const subtopicIds = []
  const demoIds = []
  for (const s of active) {
    const ids = extractIds(join(ROOT, s.path))
    if (ids.sectionId) sectionIds.push(ids.sectionId)
    exerciseIds.push(...ids.exercises)
    subtopicIds.push(...ids.subtopics)
    demoIds.push(...ids.demos)
  }

  const migrations = walk(join(ROOT, 'prisma/migrations'))
    .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
    .sort()
  const publicAssets = walk(join(ROOT, 'public'))
    .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
    .sort()
  const tests = tracked.filter(
    (f) =>
      f.startsWith('tests/') ||
      f.endsWith('.spec.ts') ||
      f.endsWith('.test.ts') ||
      f.endsWith('.test.mjs') ||
      f.includes('/test_')
  )

  return {
    baseline_commit: git('git rev-parse HEAD'),
    generated_at: new Date().toISOString(),
    tracked_file_count: tracked.length,
    tracked_files: tracked,
    protected_file_count: protectedFiles.length,
    protected_files: protectedFiles,
    active_section_count: active.length,
    active_sections: active,
    section_ids: sectionIds,
    section_ids_unique: [...new Set(sectionIds)].sort(),
    exercise_ids: [...new Set(exerciseIds)].sort(),
    subtopic_ids: [...new Set(subtopicIds)].sort(),
    demo_ids: [...new Set(demoIds)].sort(),
    routes: collectRoutes(),
    storage_keys: ['python-ds-progress', 'pyarcana:tourCompleted'],
    progress_fields: PROGRESS_FIELDS,
    migrations,
    public_assets: publicAssets,
    tests: [...new Set(tests)].sort(),
    workflows: existsSync(join(ROOT, '.github/workflows'))
      ? readdirSync(join(ROOT, '.github/workflows')).map((n) => `.github/workflows/${n}`).sort()
      : [],
  }
}

const arg = process.argv[2] || 'before'
mkdirSync(OUT_DIR, { recursive: true })
const manifest = buildManifest()
let outPath
if (arg === 'before') outPath = join(OUT_DIR, 'preservation-manifest-before.json')
else if (arg === 'after') outPath = join(OUT_DIR, 'preservation-manifest-after.json')
else outPath = join(ROOT, arg)

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(
  JSON.stringify(
    {
      wrote: relative(ROOT, outPath),
      commit: manifest.baseline_commit,
      tracked: manifest.tracked_file_count,
      active_sections: manifest.active_section_count,
      section_ids: manifest.section_ids.length,
      exercises: manifest.exercise_ids.length,
      tests: manifest.tests.length,
    },
    null,
    2
  )
)
