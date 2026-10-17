/**
 * Derived course counts (design G-9). Every count is read from its own source and compared with
 * the others, so no check pins a literal. The renumber adds sections and moves each source
 * together; a source left behind is reported by name.
 */
import fs from 'node:fs'
import path from 'node:path'

const IMPORT_RE = /import \{ section\d+ \} from '\.\/sections\/([^']+)'/g
const ARRAY_RE = /COURSE_SECTIONS:\s*CourseSection\[\]\s*=\s*\[([\s\S]*?)\]/
const SLOT_RE = /section\d+/g
const HEADING_RE = /^### S\d+ — /gm
const HOURS_RE = /^\s{0,4}estimatedHours:\s*(\d+)/m

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf-8')
}

function metaValue(index, key) {
  const found = new RegExp(`${key}:\\s*(\\d+)`).exec(index)
  return found ? Number(found[1]) : Number.NaN
}

function sectionHours(root, stems) {
  return stems.map((stem) => {
    const found = HOURS_RE.exec(read(root, `src/lib/course/sections/${stem}.ts`))
    return found ? Number(found[1]) : Number.NaN
  })
}

/** Each count, read from its own source. `bindings` is the number of sections index.ts imports. */
export function readDerivedCounts(root) {
  const index = read(root, 'src/lib/course/index.ts')
  const stems = [...index.matchAll(IMPORT_RE)].map((m) => m[1])
  const array = ARRAY_RE.exec(index)
  const ledger = JSON.parse(read(root, 'course-state/section_ledger.json'))
  return {
    bindings: stems.length,
    arraySlots: array ? (array[1].match(SLOT_RE) || []).length : null,
    totalSections: metaValue(index, 'totalSections'),
    totalHours: metaValue(index, 'totalHours'),
    roadmapHeadings: (read(root, 'learning_roadmap_52_V3.md').match(HEADING_RE) || []).length,
    ledgerRows: ledger.sections.length,
    sectionHours: sectionHours(root, stems),
  }
}

/** One named string per disagreement; an empty list means every count derives the same number. */
export function derivedCountFailures(counts) {
  const n = counts.bindings
  const failures = []
  if (counts.arraySlots !== n) failures.push(`COURSE_SECTIONS has ${counts.arraySlots} slots, bindings ${n}`)
  if (counts.totalSections !== n) failures.push(`COURSE_META.totalSections is ${counts.totalSections}, bindings ${n}`)
  if (counts.roadmapHeadings !== n) failures.push(`roadmap ### S headings ${counts.roadmapHeadings}, bindings ${n}`)
  if (counts.ledgerRows !== n) failures.push(`section_ledger rows ${counts.ledgerRows}, bindings ${n}`)
  const hours = counts.sectionHours.reduce((a, b) => a + b, 0)
  if (counts.sectionHours.some(Number.isNaN) || counts.totalHours !== hours) {
    failures.push(`COURSE_META.totalHours is ${counts.totalHours}, section estimatedHours sum to ${hours}`)
  }
  return failures
}
