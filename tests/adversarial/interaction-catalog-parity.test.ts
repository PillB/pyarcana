import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { COURSE_SECTIONS } from '../../src/lib/course/index'

type Entry = {
  id: string
  index: number
  demos: { demoId: string }[]
  exercises: { id: string }[]
  selfCheck: { qIndex: number; optionCount: number; correctIndex: number }[]
}

function mismatches(catalog: Entry[]) {
  const errors: string[] = []
  if (catalog.length !== COURSE_SECTIONS.length) errors.push('section count')
  for (const section of COURSE_SECTIONS) {
    const item = catalog.find((e) => e.id === section.id)
    if (!item) {
      errors.push(`missing ${section.id}`)
      continue
    }
    const label = section.id
    if (item.index !== section.index) errors.push(`${label}: index`)
    if (item.demos.length !== section.iDo.steps.filter((d) => !!d.demoId).length) {
      errors.push(`${label}: demos`)
    }
    if (JSON.stringify(item.exercises.map((e) => e.id)) !==
        JSON.stringify(section.weDo.steps.map((e) => e.id))) {
      errors.push(`${label}: exercises`)
    }
    const expected = section.selfCheck.questions.map((q, qIndex) => ({
      qIndex, optionCount: q.options.length, correctIndex: q.correctIndex,
    }))
    if (JSON.stringify(item.selfCheck) !== JSON.stringify(expected)) {
      errors.push(`${label}: selfCheck answer keys/option count`)
    }
  }
  return errors
}

const stored = JSON.parse(readFileSync('course-state/interaction_catalog.json', 'utf8'))

test('interaction catalog agrees with all 52 actual section data objects', () => {
  assert.deepEqual(mismatches(stored.sections), [])
  assert.equal(stored.sections.find((s: Entry) => s.id === 'setup')?.selfCheck.length, 8)
})

test('negative control: July-era five-question S01 catalog is caught', () => {
  const poisoned = structuredClone(stored.sections) as Entry[]
  const setup = poisoned.find((s) => s.id === 'setup')!
  setup.selfCheck.splice(5)
  assert.ok(mismatches(poisoned).includes('setup: selfCheck answer keys/option count'))
})

test('negative control: a silently corrupted correct answer key is caught', () => {
  const poisoned = structuredClone(stored.sections) as Entry[]
  const setup = poisoned.find((s) => s.id === 'setup')!
  setup.selfCheck[0].correctIndex = (setup.selfCheck[0].correctIndex + 1) % 4
  assert.ok(mismatches(poisoned).includes('setup: selfCheck answer keys/option count'))
})
