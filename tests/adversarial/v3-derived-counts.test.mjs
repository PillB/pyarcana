/**
 * G-9: the course's section and hour totals are derived from their sources, never pinned.
 *
 * Each count is read from its own source (the imports, the COURSE_SECTIONS slots, COURSE_META,
 * the V3 roadmap headings, section_ledger.json, each section's estimatedHours) and every count
 * is compared with the others. The renumber adds sections, so each source moves together; a
 * source left behind is reported by name. Each defect is recreated on a fixture course tree.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { derivedCountFailures, readDerivedCounts } from '../../scripts/v3_counts.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** A course tree with `sections` bound sections. Each option plants one stale-source defect. */
function fixtureTree({ sections = 2, ledgerRows, headings, totalSections, totalHours, hours = 10 } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'v3-counts-'))
  const slots = Array.from({ length: sections }, (_, i) => `section${String(i + 1).padStart(2, '0')}`)
  const stems = slots.map((slot, i) => `s${String(i + 1).padStart(2, '0')}-topic${i + 1}`)
  const write = (rel, body) => {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true })
    fs.writeFileSync(path.join(root, rel), body, 'utf-8')
  }
  const imports = slots.map((slot, i) => `import { ${slot} } from './sections/${stems[i]}'`).join('\n')
  const meta = `  totalSections: ${totalSections ?? sections},\n  totalHours: ${totalHours ?? hours * sections},`
  write(
    'src/lib/course/index.ts',
    `${imports}\nexport const COURSE_META = {\n${meta}\n}\nexport const COURSE_SECTIONS: CourseSection[] = [\n  ${slots.join(', ')},\n]\n`
  )
  stems.forEach((stem) => write(`src/lib/course/sections/${stem}.ts`, `export const s = {\n  estimatedHours: ${hours},\n}\n`))
  const headingCount = headings ?? sections
  const roadmap = Array.from({ length: headingCount }, (_, i) => `### S${String(i + 1).padStart(2, '0')} — Tema ${i + 1}`)
  write('learning_roadmap_52_V3.md', roadmap.join('\n') + '\n')
  const rows = Array.from({ length: ledgerRows ?? sections }, (_, i) => ({ id: `S${i + 1}` }))
  write('course-state/section_ledger.json', JSON.stringify({ sections: rows }))
  return root
}

describe('G-9 derived counts on the real tree', () => {
  it('every total agrees with every other source, with no pinned literal', () => {
    assert.deepEqual(derivedCountFailures(readDerivedCounts(ROOT)), [])
  })

  it('the sources are read, not assumed: the count is the number of bindings', () => {
    const counts = readDerivedCounts(ROOT)
    assert.equal(counts.bindings, counts.arraySlots)
    assert.equal(counts.sectionHours.length, counts.bindings)
  })
})

describe('G-9 recreations on fixture course trees', () => {
  it('a consistent fixture passes', () => {
    assert.deepEqual(derivedCountFailures(readDerivedCounts(fixtureTree({ sections: 3 }))), [])
  })

  it('a ledger left at the old count is named', () => {
    const failures = derivedCountFailures(readDerivedCounts(fixtureTree({ sections: 3, ledgerRows: 2 })))
    assert.equal(failures.length, 1)
    assert.match(failures[0], /section_ledger rows 2, bindings 3/)
  })

  it('a roadmap that lost a heading is named', () => {
    const failures = derivedCountFailures(readDerivedCounts(fixtureTree({ sections: 3, headings: 2 })))
    assert.equal(failures.length, 1)
    assert.match(failures[0], /roadmap ### S headings 2, bindings 3/)
  })

  it('a stale totalSections literal is named', () => {
    const failures = derivedCountFailures(readDerivedCounts(fixtureTree({ sections: 3, totalSections: 52 })))
    assert.equal(failures.length, 1)
    assert.match(failures[0], /COURSE_META\.totalSections is 52, bindings 3/)
  })

  it('totalHours that no longer equals the sum of estimatedHours is named', () => {
    const failures = derivedCountFailures(readDerivedCounts(fixtureTree({ sections: 3, hours: 10, totalHours: 491 })))
    assert.equal(failures.length, 1)
    assert.match(failures[0], /COURSE_META\.totalHours is 491, section estimatedHours sum to 30/)
  })
})
