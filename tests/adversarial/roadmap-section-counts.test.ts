/**
 * G-7: the three roadmaps and the capstone table count the course from the bindings, not from a literal.
 *
 * The V3 roadmap at the root is read by CI; its copy under upload/ is read only by the Playwright
 * spec scripts/v3_regression.spec.ts, which CI does not run. learning_roadmap.md is a third file
 * with its own count of sections. A renumber that moves the sections must move every roadmap, so each
 * roadmap's headers are checked here, in the adversarial suite CI runs, against the bindings and
 * the capstone catalogue. Each defect is recreated on the real roadmap text, and every number a
 * recreation expects (a count, a section number, a level) is read from that text or from the
 * bindings, so the renumber moves the expectations with the course and edits no test.
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
const EXAM_SPEC = /^### Auto-evaluación — Requisitos detallados del examen$/gm

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
  const examSpecs = countOf(learningRoadmap, EXAM_SPEC)
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

/** Roadmaps of a course that binds `n` sections in two levels: the guard must not care what n is. */
function syntheticInput(n: number): RoadmapInput {
  const bindings = range(n).map((number) => ({ number, phase: number <= n / 2 ? 0 : 1 }))
  const v3 = [
    '## Nivel 1 — Base',
    '## Nivel 2 — Avance',
    ...range(n).map((k) => `### S${String(k).padStart(2, '0')} — Tema ${k}`),
    'Capstone CP-N1-A',
  ].join('\n')
  const learningRoadmap = [
    '## Fase 1 — Avance',
    ...range(n).flatMap((k) => [`## ${k}. Tema ${k}`, '### Auto-evaluación — Requisitos detallados del examen']),
  ].join('\n')
  return { bindings, v3, v3Upload: v3, learningRoadmap, capstoneIds: ['CP-N1-A'] }
}

describe('G-7 holds at any course size: the guard has no count of its own', () => {
  for (const size of [7, 61]) {
    it(`a ${size}-section course with matching roadmaps passes, and one lost header is named`, () => {
      const input = syntheticInput(size)
      assert.deepEqual(roadmapFailures(input), [])
      const dropped = input.learningRoadmap.replace(`## ${size}. Tema ${size}\n`, '')
      assert.deepEqual(roadmapFailures({ ...input, learningRoadmap: dropped }), [
        `learning_roadmap.md has ${size - 1} section headers, bindings ${size}`,
      ])
    })
  }
})

describe('G-7 recreations on the real roadmaps', () => {
  it('a learning roadmap with its last section header dropped is named', () => {
    const base = realInput()
    const found = numbersOf(base.learningRoadmap, /^## (\d+)\. /gm)
    const last = found[found.length - 1]
    const dropped = base.learningRoadmap.replace(new RegExp(`^## ${last}\\. .*\\n`, 'm'), '')
    assert.deepEqual(
      roadmapFailures({ ...base, learningRoadmap: dropped }),
      [`learning_roadmap.md has ${found.length - 1} section headers, bindings ${base.bindings.length}`]
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
    const n = base.bindings.length
    const middle = Math.floor(n / 2)
    const label = (k: number) => `### S${String(k).padStart(2, '0')} — `
    const renumbered = base.v3.replace(label(middle), label(middle + 1))
    assert.notEqual(renumbered, base.v3, `the recreation found no ${label(middle)} heading to renumber`)
    const failures = roadmapFailures({ ...base, v3: renumbered, v3Upload: renumbered })
    assert.ok(failures.includes(`learning_roadmap_52_V3.md has ${n} ### S headings, bindings ${n}`), failures.join('\n'))
  })

  it('an exam-spec header lost from learning_roadmap.md is named', () => {
    const base = realInput()
    const specs = countOf(base.learningRoadmap, EXAM_SPEC)
    const lost = base.learningRoadmap.replace(/^### Auto-evaluación — Requisitos detallados del examen\n/m, '')
    assert.deepEqual(
      roadmapFailures({ ...base, learningRoadmap: lost }),
      [`learning_roadmap.md has ${specs - 1} exam-spec headers, bindings ${base.bindings.length}`]
    )
  })

  it('a Fase header for phase 0 is named: phase 0 is implicit in its first sections', () => {
    const base = realInput()
    const fasePhases = phasesOf(base.bindings).filter((p) => p > 0)
    const added = base.learningRoadmap.replace(
      new RegExp(`^## Fase ${fasePhases[0]} —`, 'm'),
      `## Fase 0 —\n\n## Fase ${fasePhases[0]} —`
    )
    const failures = roadmapFailures({ ...base, learningRoadmap: added })
    assert.ok(
      failures.includes(`learning_roadmap.md has Fase headers [0,${fasePhases.join(',')}], phases [${fasePhases.join(',')}]`),
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

  it('a V3 roadmap with its last Nivel heading missing is named', () => {
    const base = realInput()
    const levels = phasesOf(base.bindings).length
    const dropped = base.v3.replace(new RegExp(`^## Nivel ${levels} —.*\\n`, 'm'), '')
    assert.notEqual(dropped, base.v3, `the recreation found no Nivel ${levels} heading to drop`)
    const failures = roadmapFailures({ ...base, v3: dropped, v3Upload: dropped })
    assert.ok(
      failures.includes(`learning_roadmap_52_V3.md has ${levels - 1} ## Nivel headings, phases ${levels}`),
      failures.join('\n')
    )
  })
})
