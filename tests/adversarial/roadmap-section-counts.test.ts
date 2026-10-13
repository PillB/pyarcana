/**
 * G-7: the three roadmaps and the capstone table count the course from the bindings, not from 52.
 *
 * The V3 roadmap at the root is read by CI; its copy under upload/ is read only by the Playwright
 * spec scripts/v3_regression.spec.ts, which CI does not run. learning_roadmap.md is a third file
 * with its own count of 52. A renumber that moves the sections must move every roadmap, so each
 * roadmap's headers are checked here, in the adversarial suite CI runs, against the bindings and
 * the capstone catalogue. Each defect is recreated on the real roadmap text.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAPSTONES } from '../../src/lib/capstones/catalog.ts'
import { phasesOf, readBindings } from '../../scripts/course_bindings.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

interface Bound {
  readonly number: number
  readonly phase: number
}

export interface RoadmapInput {
  readonly bindings: readonly Bound[]
  readonly v3: string
  readonly v3Upload: string
  readonly learningRoadmap: string
  readonly capstoneIds: readonly string[]
}

const numbersOf = (text: string, re: RegExp): number[] => [...text.matchAll(re)].map((m) => Number(m[1]))
const countOf = (text: string, re: RegExp): number => (text.match(re) ?? []).length
const sameSequence = (found: readonly number[], expected: readonly number[]): boolean =>
  found.length === expected.length && found.every((v, i) => v === expected[i])
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

/** One line per disagreement between a roadmap and the bindings. An empty list means they agree. */
export function roadmapFailures(input: RoadmapInput): string[] {
  const { bindings, v3, v3Upload, learningRoadmap, capstoneIds } = input
  const n = bindings.length
  const phases = phasesOf(bindings)
  const fasePhases = phases.filter((p) => p > 0)
  const out: string[] = []

  if (v3Upload !== v3) out.push('upload/learning_roadmap_52_V3.md differs from learning_roadmap_52_V3.md')

  for (const [label, text] of [
    ['learning_roadmap_52_V3.md', v3],
    ['upload/learning_roadmap_52_V3.md', v3Upload],
  ] as const) {
    const sections = numbersOf(text, /^### S(\d+) — /gm)
    if (!sameSequence(sections, range(n))) out.push(`${label} has ${sections.length} ### S headings, bindings ${n}`)
    const levels = countOf(text, /^## Nivel \d —/gm)
    if (levels !== phases.length) out.push(`${label} has ${levels} ## Nivel headings, phases ${phases.length}`)
    const named = new Set(text.match(/\bCP-(?:N\d-[A-Z]|FINAL)\b/g) ?? [])
    for (const id of named) if (!capstoneIds.includes(id)) out.push(`${label} names ${id}, which is no capstone`)
    for (const id of capstoneIds) if (!named.has(id)) out.push(`${label} omits capstone ${id}`)
  }

  const sections = numbersOf(learningRoadmap, /^## (\d+)\. /gm)
  if (!sameSequence(sections, range(n))) {
    out.push(`learning_roadmap.md has ${sections.length} section headers, bindings ${n}`)
  }
  const examSpecs = countOf(learningRoadmap, /^### Auto-evaluación — Requisitos detallados del examen$/gm)
  if (examSpecs !== n) out.push(`learning_roadmap.md has ${examSpecs} exam-spec headers, bindings ${n}`)
  const fases = numbersOf(learningRoadmap, /^## Fase (\d+) —/gm)
  if (!sameSequence(fases, fasePhases)) {
    out.push(`learning_roadmap.md has Fase headers [${fases.join(',')}], phases [${fasePhases.join(',')}]`)
  }
  return out
}

function realInput(): RoadmapInput {
  const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf-8')
  return {
    bindings: readBindings(ROOT),
    v3: read('learning_roadmap_52_V3.md'),
    v3Upload: read('upload/learning_roadmap_52_V3.md'),
    learningRoadmap: read('learning_roadmap.md'),
    capstoneIds: CAPSTONES.map((c) => c.id),
  }
}

describe('G-7 roadmap counts on the real tree', () => {
  it('the three roadmaps and the capstone table agree with the bindings and the catalogue', () => {
    assert.deepEqual(roadmapFailures(realInput()), [])
  })

  it('the V3 upload copy is the root copy, byte for byte', () => {
    const input = realInput()
    assert.equal(input.v3Upload, input.v3)
  })
})

describe('G-7 recreations on the real roadmaps', () => {
  it('a learning roadmap with one section header dropped is named', () => {
    const base = realInput()
    const dropped = base.learningRoadmap.replace(/^## 52\. .*\n/m, '')
    assert.deepEqual(
      roadmapFailures({ ...base, learningRoadmap: dropped }),
      ['learning_roadmap.md has 51 section headers, bindings 52']
    )
  })

  it('an upload copy that differs by one character is named', () => {
    const base = realInput()
    const edited = base.v3Upload.replace('Entorno', 'Entornos')
    assert.deepEqual(
      roadmapFailures({ ...base, v3Upload: edited }),
      ['upload/learning_roadmap_52_V3.md differs from learning_roadmap_52_V3.md']
    )
  })

  it('a V3 section heading renumbered out of order is named', () => {
    const base = realInput()
    const renumbered = base.v3.replace('### S27 — ', '### S28 — ')
    const failures = roadmapFailures({ ...base, v3: renumbered, v3Upload: renumbered })
    assert.ok(failures.includes('learning_roadmap_52_V3.md has 52 ### S headings, bindings 52'), failures.join('\n'))
  })

  it('an exam-spec header lost from learning_roadmap.md is named', () => {
    const base = realInput()
    const lost = base.learningRoadmap.replace(/^### Auto-evaluación — Requisitos detallados del examen\n/m, '')
    assert.deepEqual(
      roadmapFailures({ ...base, learningRoadmap: lost }),
      ['learning_roadmap.md has 51 exam-spec headers, bindings 52']
    )
  })

  it('a Fase header for phase 0 is named: phase 0 is implicit in S01 to S13', () => {
    const base = realInput()
    const added = base.learningRoadmap.replace(/^## Fase 1 —/m, '## Fase 0 —\n\n## Fase 1 —')
    const failures = roadmapFailures({ ...base, learningRoadmap: added })
    assert.ok(
      failures.includes('learning_roadmap.md has Fase headers [0,1,2,3], phases [1,2,3]'),
      failures.join('\n')
    )
  })

  it('a capstone the catalogue does not hold is named, and the one it drops is named too', () => {
    const base = realInput()
    const renamed = base.v3.replace(/CP-FINAL/g, 'CP-N9-Z')
    const failures = roadmapFailures({ ...base, v3: renamed, v3Upload: renamed })
    assert.ok(failures.includes('learning_roadmap_52_V3.md names CP-N9-Z, which is no capstone'), failures.join('\n'))
    assert.ok(failures.includes('learning_roadmap_52_V3.md omits capstone CP-FINAL'), failures.join('\n'))
  })

  it('a V3 roadmap with one Nivel heading missing is named', () => {
    const base = realInput()
    const dropped = base.v3.replace(/^## Nivel 4 —.*\n/m, '')
    const failures = roadmapFailures({ ...base, v3: dropped, v3Upload: dropped })
    assert.ok(failures.includes('learning_roadmap_52_V3.md has 3 ## Nivel headings, phases 4'), failures.join('\n'))
  })
})
