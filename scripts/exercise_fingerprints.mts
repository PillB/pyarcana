/**
 * B11 collector: the fingerprint of every exercise in the real course, read through COURSE_SECTIONS.
 *
 *   node --import tsx scripts/exercise_fingerprints.mts --json    # print the current anchors
 *   node --import tsx scripts/exercise_fingerprints.mts --write   # write audit/safe-agent/exercise-meaning-anchors.json
 *
 * An exercise is any object whose id has the Sxx-Ty-Z-En form and that carries a solutionCode. A
 * duplicate id, anywhere in the course, is an error: two exercises must never share an anchor.
 *
 * The fields the anchor covers are read here and hashed by fingerprint() in exercise_meaning.mjs: the title,
 * tests, solution code and output, then the starter code, the kind and the edge cases (O27 101-C2). Operators
 * in those fields are hashed too (O27 101-C1), and so are the signs ≠ ≤ ≥ × ÷ − → (O27 101-C4). Prose
 * (instruction, preamble, hints, feedback) is not read, on
 * purpose: redaction rounds rewrite it, and the decisions are in audit/fixer/OWNER_DECISIONS.md.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COURSE_SECTIONS } from '../src/lib/course/index.ts'
import { ANCHORS_PATH, EXERCISE_ID, fingerprint } from './exercise_meaning.mjs'

export interface Exercise {
  id: string
  section: string
  title: unknown
  tests: unknown
  code: unknown
  output: unknown
  starterCode: unknown
  kind: unknown
  edgeCases: unknown
}

interface Anchor {
  section: string
  sha256: string
  tokens: string[]
}

function visit(node: unknown, found: (object: Record<string, unknown>) => void, seen: Set<object>): void {
  if (Array.isArray(node)) {
    for (const item of node) visit(item, found, seen)
    return
  }
  if (node === null || typeof node !== 'object' || seen.has(node)) return
  seen.add(node)
  found(node as Record<string, unknown>)
  for (const value of Object.values(node)) visit(value, found, seen)
}

/** Every exercise object in the given sections, in the order the course lists them. */
export function collectExercises(sections: unknown[]): Exercise[] {
  const exercises: Exercise[] = []
  for (const section of sections) {
    visit(section, (object) => {
      const solution = object.solutionCode as Record<string, unknown> | undefined
      if (typeof object.id !== 'string' || !EXERCISE_ID.test(object.id) || !solution || typeof solution !== 'object') return
      const starter = object.starterCode as Record<string, unknown> | undefined
      exercises.push({
        id: object.id,
        section: object.id.slice(0, 3),
        title: object.title,
        tests: object.tests,
        code: solution.code,
        output: solution.output,
        starterCode: starter?.code,
        kind: object.kind,
        edgeCases: object.edgeCases,
      })
    }, new Set())
  }
  return exercises
}

/** The anchor of every exercise, keyed by id and sorted. A duplicated id throws. */
export function currentAnchors(sections: unknown[] = COURSE_SECTIONS): Record<string, Anchor> {
  const anchors: Record<string, Anchor> = {}
  for (const exercise of collectExercises(sections)) {
    if (exercise.id in anchors) throw new Error(`exercise id ${exercise.id} appears more than once in the course`)
    anchors[exercise.id] = fingerprint(exercise)
  }
  return Object.fromEntries(Object.keys(anchors).sort().map((id) => [id, anchors[id]]))
}

function main(argv: string[]): void {
  const anchors = currentAnchors()
  if (argv.includes('--write')) {
    writeFileSync(ANCHORS_PATH, JSON.stringify({ schema: 'exercise_meaning_anchors/1', exercises: anchors }, null, 2) + '\n')
    console.log(`wrote ${Object.keys(anchors).length} anchors to ${ANCHORS_PATH}`)
    return
  }
  console.log(JSON.stringify(anchors))
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main(process.argv.slice(2))
