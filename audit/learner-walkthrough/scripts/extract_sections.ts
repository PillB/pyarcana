// Dumps each active section's learner-facing content to one JSON file per section, so a reader
// (human or agent) can judge the lesson as the persona reads it. Read-only: imports the course
// exactly as the app does (src/lib/course/index.ts) and writes outside the protected paths.
//   bun audit/learner-walkthrough/scripts/extract_sections.ts <outDir>
import { mkdirSync, writeFileSync } from 'node:fs'
import * as course from '../../../src/lib/course/index'

const out = process.argv[2]
if (!out) throw new Error('usage: extract_sections.ts <outDir>')
mkdirSync(out, { recursive: true })
const sections = course.COURSE_SECTIONS
if (!Array.isArray(sections)) throw new Error(`no sections export; exports: ${Object.keys(course).join(', ')}`)
for (const s of sections) {
  writeFileSync(`${out}/${s.id}.json`, JSON.stringify(s, null, 1))
}
console.log(`wrote ${sections.length} sections`)
