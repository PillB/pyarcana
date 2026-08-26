/**
 * The regional annotation must add meaning without changing a character.
 *
 * `code_rendering.spec.ts` compares the page against the lesson source and 15
 * prose tests pin exact sentences, so any annotation that alters textContent
 * breaks the fidelity guarantee this course is built on. It must also leave
 * code spans alone: a lesson that prints PEN has to keep printing PEN, because
 * the runtime audit executes it and compares byte for byte.
 *
 * This used to re-implement the annotator so it could be tested from node, and
 * a copy of the code under test is not a test of it: the real function moved to
 * one mark per token and case-sensitive matching, and the copy kept passing on
 * the old rules. It now imports the real thing, which is why that function
 * lives in the locale module rather than inside a React component. The suite
 * runs under `--import tsx`, so a .mjs test can import the .ts module directly
 * and the file keeps the path it has always had.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { annotateRegional, REGIONAL_TERMS } from '../../src/lib/locale/regional-reference.ts'

const strip = (h) => h.replace(/<[^>]+>/g, '')
/** A fresh `seen` per call, the way RichText builds one per render. */
const run = (html) => annotateRegional(html, 'MX', new Set())
const marks = (html) => (run(html).match(/<abbr/g) ?? []).length

const CASES = [
  ['El monto es 100 PEN y el RUC tiene 11 dígitos.', 2],
  ['<strong>PEN</strong> en negrita', 1],
  ['un <code>PEN</code> dentro de código', 0],
  ['<code>monto: PEN</code> y luego PEN suelto', 1],
  ['PENDIENTE, OPEN, SUNATX no se anotan', 0],
  ['S/ 28.46 en la tabla', 1],
  ['<a href="/x?q=PEN">link</a> con PEN fuera', 1],
  ['DNI, RUC y SUNAT juntos.', 3],
  ['PEN al inicio', 1],
  ['termina en PEN', 1],
  // The tokens added for readers outside Peru.
  ['El total en soles, sin IGV.', 2],
  ['RENIEC emite el DNI.', 2],
  ['La sucursal de Lima cerró.', 1],
  ['Huamán y Quispe en el padrón.', 2],
]

for (const [input, expected] of CASES) {
  test(`text is preserved: ${input.slice(0, 44)}`, () => {
    assert.equal(strip(run(input)), strip(input))
  })
  test(`annotates ${expected}x: ${input.slice(0, 44)}`, () => {
    assert.equal(marks(input), expected)
  })
}

test('a token is marked once per section, not once per mention', () => {
  // Eleven dotted underlines on PEN in one section stops reading as help. This
  // is also what makes common words like "soles" or "Lima" safe to annotate.
  const seen = new Set()
  const first = annotateRegional('PEN aquí y PEN allá', 'MX', seen)
  assert.equal((first.match(/<abbr/g) ?? []).length, 1, 'more than one mark in the same block')
  const second = annotateRegional('otra vez PEN', 'MX', seen)
  assert.equal((second.match(/<abbr/g) ?? []).length, 0, 'the same token was marked again later in the section')
})

test('matching is case-sensitive', () => {
  // S15 teaches that "lima" and "Lima" are two different category strings.
  // Annotating the lowercase one underlines the very distinction being drawn.
  assert.equal(marks('normalizar “lima” y “Lima” como una sola categoría'), 1)
})

test('readers inside Peru get no annotations at all', () => {
  // Nothing to explain: PEN, RUC and Lima are not foreign to this reader, and
  // underlining them would be noise on every page.
  assert.equal(annotateRegional('100 PEN y el RUC en Lima', 'PE', new Set()), '100 PEN y el RUC en Lima')
})

test('every declared term can actually be annotated', () => {
  // A term with no `equivalentIn` for a region produces no sentence and is
  // silently skipped -- an entry that never fires is worse than no entry.
  for (const token of Object.keys(REGIONAL_TERMS)) {
    const marked = annotateRegional(`antes ${token} después`, 'MX', new Set())
    assert.match(marked, /<abbr/, `${token} declared but never annotates`)
  }
})
