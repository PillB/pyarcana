#!/usr/bin/env node
/**
 * V3 structural count regression (no Playwright dependency).
 *
 * Asserts:
 *   - the section count is derived, never pinned: COURSE_SECTIONS, COURSE_META, the V3 roadmap,
 *     section_ledger.json and the sum of estimatedHours agree (design G-9, scripts/v3_counts.mjs)
 *   - setup section (s01-setup.ts) has 24 V3 exercise ids and 8 demoIds (regex)
 *
 * Run: node scripts/v3_regression_counts.test.mjs
 * Exit 0 on pass, 1 on failure.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { derivedCountFailures, readDerivedCounts } from './v3_counts.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SETUP = path.join(ROOT, 'src/lib/course/sections/s01-setup.ts')

const EX_RE = /\bid:\s*'(S\d{2}-T\d-[AB]-E\d)'/g
const DEMO_RE = /demoId:\s*'([^']+)'/g

function uniqueMatches(text, re) {
  const ids = new Set()
  for (const m of text.matchAll(re)) ids.add(m[1])
  return [...ids].sort()
}

function main() {
  const failures = []

  // ── section count: derived from its sources, compared with each other (G-9) ──
  const counts = readDerivedCounts(ROOT)
  failures.push(...derivedCountFailures(counts))

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
    course_sections_imports: counts.bindings,
    course_sections_array: counts.arraySlots,
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
        course_sections: counts.bindings,
        setup_exercises: exercises.length,
        setup_demos: demos.length,
      },
      null,
      2
    )
  )
}

main()
