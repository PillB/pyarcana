/**
 * G-10 (the capstone part): a capstone's gate section is one fact, stated in three places.
 *
 * The catalogue (`gateSection`), GATE_MAP (the inverse) and each capstone's gate.json
 * (`gate_section`) must name the same section, and every section a capstone names (its gate,
 * contributing sections and sub-gates) must be an active section tag. A renumber moves these
 * tags together; a source left behind is named.
 *
 * Agreement among copies is not enough: if every copy keeps the old tag, they still agree, and the
 * tag is still some active section, so a pass would land on the wrong lesson. Each gate and
 * sub-gate is therefore also anchored to the slug of the section it closes (GATE_SLUGS), and its
 * tag must be the tag the bindings give that slug. A slug survives a renumber; a tag does not.
 *
 * Not guarded here: `contributingSections` (the run of sections that feed a gate) and the 47
 * capstone files' prose, which names S-tokens in sentences; they move with the renumber as
 * Codex-written text (owner, 2026-10-13).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAPSTONES, GATE_MAP } from '../../src/lib/capstones/catalog.ts'
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'
import { readBindings } from '../../scripts/course_bindings.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** The section each capstone gate closes, by slug (the stable id), not by tag. */
export const GATE_SLUGS: Readonly<Record<string, string>> = {
  'CP-N1-A': 'iteration-summaries',
  'CP-N1-B': 'files-ingestion',
  'CP-N1-C': 'evidence-dashboard',
  'CP-N2-A': 'packaging',
  'CP-N2-B': 'fastapi',
  'CP-N2-C': 'integrator-phase1',
  'CP-N3-A': 'security-infra',
  'CP-N3-B': 'cv-ai-integration',
  'CP-N3-C': 'integrator-phase2',
  'CP-N4-A': 'llmops',
  'CP-N4-B': 'opensource',
  'CP-N4-C': 'integrator-final',
  'CP-FINAL': 'career-strategy',
  // The three sub-gates of CP-N4-C.
  'CP-N4-C.1': 'data-contracts',
  'CP-N4-C.2': 'tech-leadership',
  'CP-N4-C.3': 'integrator-final',
}

const tagOf = (n: number): string => `S${String(n).padStart(2, '0')}`

/** One line per gate whose tag is not the tag of the section its anchor slug is bound to, and per anchor without a gate. */
export function anchorFailures(
  gates: ReadonlyArray<{ readonly id: string; readonly tag: string }>,
  anchors: Readonly<Record<string, string>>,
  bindings: ReadonlyArray<{ readonly number: number; readonly id: string | null }>,
): string[] {
  const out: string[] = []
  for (const g of gates) {
    const slug = anchors[g.id]
    const bound = slug === undefined ? undefined : bindings.find((b) => b.id === slug)
    if (slug === undefined) out.push(`${g.id}: no section slug anchors this gate`)
    else if (!bound) out.push(`${g.id}: anchor '${slug}' is bound to no section`)
    else if (g.tag !== tagOf(bound.number)) out.push(`${g.id}: tagged ${g.tag}, but '${slug}' is section ${tagOf(bound.number)}`)
  }
  const known = new Set(gates.map((g) => g.id))
  for (const id of Object.keys(anchors)) if (!known.has(id)) out.push(`${id}: anchored, but no such gate in the catalogue`)
  return out
}

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

  it('every gate and sub-gate is tagged with the section its slug is bound to', () => {
    const gates = [
      ...CAPSTONES.map((c) => ({ id: c.id, tag: c.gateSection })),
      ...CAPSTONES.flatMap((c) => (c.subGates ?? []).map((g) => ({ id: g.id, tag: g.section }))),
    ]
    assert.ok(gates.length > CAPSTONES.length, 'no sub-gate was read: the sub-gate anchors would be unchecked')
    assert.deepEqual(anchorFailures(gates, GATE_SLUGS, readBindings(ROOT)), [])
  })

  it('a tag left at the old number in every copy is named, though the copies agree', () => {
    // Fixture: two sections are inserted ahead of 'fastapi', which moves from slot 21 to 23. The
    // catalogue, GATE_MAP and gate.json all still say S21, so the agreement check passes.
    const bindings = [
      { number: 21, id: 'inserted' },
      { number: 23, id: 'fastapi' },
    ]
    const one = [{ id: 'CP-N2-B', gateSection: 'S21', contributingSections: [], subGateSections: [] }]
    const agree = gateDisagreements(one, new Map([['CP-N2-B', 'S21']]), { S21: 'CP-N2-B' }, new Set(['S21', 'S23']))
    assert.deepEqual(agree, [], 'the three copies agree, which is why agreement alone is not a guard')
    assert.deepEqual(anchorFailures([{ id: 'CP-N2-B', tag: 'S21' }], { 'CP-N2-B': 'fastapi' }, bindings), [
      "CP-N2-B: tagged S21, but 'fastapi' is section S23",
    ])
    assert.deepEqual(anchorFailures([{ id: 'CP-N2-B', tag: 'S23' }], { 'CP-N2-B': 'fastapi' }, bindings), [])
  })

  it('a gate with no anchor, an anchor with no section and an anchor with no gate are each named', () => {
    const bindings = [{ number: 5, id: 'alpha' }]
    const failures = anchorFailures(
      [
        { id: 'CP-A', tag: 'S05' },
        { id: 'CP-B', tag: 'S05' },
      ],
      { 'CP-B': 'gone', 'CP-C': 'alpha' },
      bindings,
    )
    assert.deepEqual(failures, [
      'CP-A: no section slug anchors this gate',
      "CP-B: anchor 'gone' is bound to no section",
      'CP-C: anchored, but no such gate in the catalogue',
    ])
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
