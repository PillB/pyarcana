#!/usr/bin/env node
/**
 * V3 structural count regression (no Playwright dependency).
 *
 * Asserts:
 *   - COURSE_SECTIONS length === 52 (from src/lib/course/index.ts)
 *   - setup section (s01-setup.ts) has 24 V3 exercise ids and 8 demoIds (regex)
 *
 * Run: node scripts/v3_regression_counts.test.mjs
 * Exit 0 on pass, 1 on failure.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const INDEX = path.join(ROOT, 'src/lib/course/index.ts')
const SETUP = path.join(ROOT, 'src/lib/course/sections/s01-setup.ts')

const EX_RE = /\bid:\s*'(S\d{2}-T\d-[AB]-E\d)'/g
const DEMO_RE = /demoId:\s*'([^']+)'/g
const SECTION_IMPORT_RE = /import \{ section\d+ \}/g
const SECTION_ARRAY_RE = /section\d+,/g

function uniqueMatches(text, re) {
  const ids = new Set()
  for (const m of text.matchAll(re)) ids.add(m[1])
  return [...ids].sort()
}

function main() {
  const failures = []

  // ── COURSE_SECTIONS length === 52 ──
  const indexText = fs.readFileSync(INDEX, 'utf-8')
  const imports = indexText.match(SECTION_IMPORT_RE) || []
  const arrayEntries = indexText.match(SECTION_ARRAY_RE) || []

  try {
    assert.equal(
      imports.length,
      52,
      `section imports in index.ts: got ${imports.length}, want 52`
    )
  } catch (e) {
    failures.push(e.message)
  }

  try {
    assert.equal(
      arrayEntries.length,
      52,
      `COURSE_SECTIONS entries in index.ts: got ${arrayEntries.length}, want 52`
    )
  } catch (e) {
    failures.push(e.message)
  }

  // ── setup: 24 V3 exercise ids + 8 demoIds ──
  const setupText = fs.readFileSync(SETUP, 'utf-8')
  const exercises = uniqueMatches(setupText, EX_RE)
  const demos = uniqueMatches(setupText, DEMO_RE)

  try {
    assert.equal(
      exercises.length,
      24,
      `setup V3 exercise ids: got ${exercises.length}, want 24`
    )
  } catch (e) {
    failures.push(e.message)
  }

  try {
    assert.equal(
      demos.length,
      8,
      `setup demoIds: got ${demos.length}, want 8`
    )
  } catch (e) {
    failures.push(e.message)
  }

  const report = {
    ok: failures.length === 0,
    course_sections_imports: imports.length,
    course_sections_array: arrayEntries.length,
    setup_exercises: exercises.length,
    setup_exercise_ids: exercises,
    setup_demos: demos.length,
    setup_demo_ids: demos,
    failures,
  }

  const outPath = path.join(ROOT, 'course-state', 'v3_regression_counts_report.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n')

  if (failures.length) {
    console.error(JSON.stringify({ ok: false, failures }, null, 2))
    process.exit(1)
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        course_sections: arrayEntries.length,
        setup_exercises: exercises.length,
        setup_demos: demos.length,
      },
      null,
      2
    )
  )
}

main()
