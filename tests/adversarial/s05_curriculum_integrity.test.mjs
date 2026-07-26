import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const section = readFileSync('src/lib/course/sections/s05-oop.ts', 'utf8')
const seed = readFileSync('prisma/seed.ts', 'utf8')
const sectionView = readFileSync('src/components/course/SectionView.tsx', 'utf8')
const pdfReport = readFileSync('src/components/course/PdfReport.tsx', 'utf8')

function between(text, start, end) {
  const startIndex = text.indexOf(start)
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`)
  const endIndex = text.indexOf(end, startIndex + start.length)
  assert.notEqual(endIndex, -1, `missing end marker: ${end}`)
  return text.slice(startIndex, endIndex)
}

test('S05 retains the complete theory → I Do → We Do surface', () => {
  const subtopics = new Set(section.match(/subtopicId: "S05-T\d-[AB]"/g) ?? [])
  const demos = new Set(section.match(/demoId: "S05-T\d-[AB]-DEMO"/g) ?? [])
  const exercises = new Set(section.match(/id: "S05-T\d-[AB]-E[123]"/g) ?? [])

  assert.equal(subtopics.size, 8)
  assert.equal(demos.size, 8)
  assert.equal(exercises.size, 24)
  assert.match(section, /son reglas del laboratorio, no afirmaciones sobre identidad/)
  assert.match(section, /gate mínimo, no validación integral de email/)
})

test('S05 You Do executes every promised boundary oracle', () => {
  const youDo = between(section, '  youDo: {', '  selfCheck: {')

  assert.match(youDo, /is_idempotent\(normalize_nombre/)
  assert.match(youDo, /is_idempotent\(normalize_email/)
  assert.match(youDo, /is_idempotent\(normalize_telefono/)
  assert.match(youDo, /is_idempotent\(normalize_direccion/)
  assert.match(youDo, /normalize_email\("sin-arroba"\)/)
  assert.match(youDo, /raise AssertionError\("normalize_email debe rechazar entradas sin @"\)/)
  assert.match(youDo, /"direccion": "JR UNIÓN 1"/)
})

test('stable S05 id no longer leaks an OOP playground or PDF label', () => {
  const playground = between(sectionView, "    'oop': {", "    'numpy': {")

  assert.match(playground, /Practica funciones con contrato/)
  assert.match(playground, /normalize_nombre/)
  assert.match(playground, /normalize_email/)
  assert.match(playground, /idempotente True/)
  assert.doesNotMatch(playground, /class Animal|class Perro|herencia/)
  assert.match(pdfReport, /oop: '5\. Funciones'/)
  assert.doesNotMatch(pdfReport, /oop: '5\. OOP'/)
})

test('authenticated S05 bank has 24 variants and balanced answer positions', () => {
  const bank = between(seed, '// S05 V3', '// S06 V3')
  const concepts = bank.match(/concept: '[^']+'/g) ?? []
  const indices = [...bank.matchAll(/correctIndex:\s*(\d)/g)].map((match) =>
    Number(match[1]),
  )

  assert.equal(concepts.length, 24)
  assert.equal(indices.length, 24)

  const distribution = [0, 1, 2, 3].map(
    (index) => indices.filter((value) => value === index).length,
  )
  assert.deepEqual(distribution, [6, 6, 6, 6])

  const byConcept = new Map()
  for (const conceptLine of concepts) {
    const concept = conceptLine.slice("concept: '".length, -1)
    byConcept.set(concept, (byConcept.get(concept) ?? 0) + 1)
  }
  assert.equal(byConcept.size, 8)
  assert.deepEqual([...byConcept.values()], Array(8).fill(3))
})
