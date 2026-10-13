/**
 * G-10 (the capstone part): a capstone's gate section is one fact, stated in three places.
 *
 * The catalogue (`gateSection`), GATE_MAP (the inverse) and each capstone's gate.json
 * (`gate_section`) must name the same section, and every section a capstone names (its gate,
 * contributing sections and sub-gates) must be an active section tag. A renumber moves these
 * tags together; a source left behind is named.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAPSTONES, GATE_MAP } from '../../src/lib/capstones/catalog.ts'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export interface CapstoneTags {
  readonly id: string
  readonly gateSection: string
  readonly contributingSections: readonly string[]
  readonly subGateSections: readonly string[]
}

/** One line per disagreement among the catalogue, GATE_MAP, gate.json and the active sections. */
export function gateDisagreements(
  capstones: readonly CapstoneTags[],
  gateJsonByCapstone: ReadonlyMap<string, string | undefined>,
  gateMap: Readonly<Record<string, string>>,
  activeTags: ReadonlySet<string>,
): string[] {
  const out: string[] = []
  for (const c of capstones) {
    const tagged = gateJsonByCapstone.get(c.id)
    if (tagged !== c.gateSection) out.push(`${c.id}: catalogue gate ${c.gateSection}, gate.json ${tagged}`)
    if (gateMap[c.gateSection] !== c.id) out.push(`${c.id}: GATE_MAP[${c.gateSection}] is ${gateMap[c.gateSection]}`)
    for (const tag of [c.gateSection, ...c.contributingSections, ...c.subGateSections]) {
      if (!activeTags.has(tag)) out.push(`${c.id}: ${tag} is no active section`)
    }
  }
  return out
}

const activeTags = new Set(COURSE_SECTIONS.map((s) => `S${String(s.index).padStart(2, '0')}`))
const capstones: CapstoneTags[] = CAPSTONES.map((c) => ({
  id: c.id,
  gateSection: c.gateSection,
  contributingSections: c.contributingSections,
  subGateSections: (c.subGates ?? []).map((g) => g.section),
}))
const gateJson = new Map(
  capstones.map((c) => {
    const file = path.join(ROOT, 'course-state/capstones', c.id, 'gate.json')
    return [c.id, (JSON.parse(fs.readFileSync(file, 'utf-8')) as { gate_section?: string }).gate_section]
  }),
)

describe('capstone gate sections agree across the catalogue, GATE_MAP and gate.json (G-10)', () => {
  it('the real catalogue names one gate section per capstone, in every source', () => {
    assert.deepEqual(gateDisagreements(capstones, gateJson, GATE_MAP, activeTags), [])
  })

  it('a gate.json left at an old section tag is named', () => {
    const stale = new Map([['CP-N2-A', 'S19']])
    const one = [{ id: 'CP-N2-A', gateSection: 'S17', contributingSections: [], subGateSections: [] }]
    assert.deepEqual(gateDisagreements(one, stale, { S17: 'CP-N2-A' }, activeTags), [
      'CP-N2-A: catalogue gate S17, gate.json S19',
    ])
  })

  it('a GATE_MAP entry that points at another capstone is named', () => {
    const one = [{ id: 'CP-N2-A', gateSection: 'S17', contributingSections: [], subGateSections: [] }]
    const bad = gateDisagreements(one, new Map([['CP-N2-A', 'S17']]), { S17: 'CP-N1-C' }, activeTags)
    assert.deepEqual(bad, ['CP-N2-A: GATE_MAP[S17] is CP-N1-C'])
  })

  it('a sub-gate or contributing section that is no active tag is named', () => {
    const one = [{ id: 'CP-N4-C', gateSection: 'S51', contributingSections: ['S48', 'S99'], subGateSections: ['S49'] }]
    const bad = gateDisagreements(one, new Map([['CP-N4-C', 'S51']]), { S51: 'CP-N4-C' }, activeTags)
    assert.deepEqual(bad, ['CP-N4-C: S99 is no active section'])
  })
})
