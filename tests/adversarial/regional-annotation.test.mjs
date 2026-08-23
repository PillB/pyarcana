/**
 * The regional annotation must add meaning without changing a character.
 *
 * `code_rendering.spec.ts` compares the page against the lesson source and 15
 * prose tests pin exact sentences, so any annotation that alters textContent
 * breaks the fidelity guarantee this course is built on. It must also leave
 * code spans alone: a lesson that prints PEN has to keep printing PEN, because
 * the runtime audit executes it and compares byte for byte.
 *
 * The first version bounded on a non-'>' character, which was safe and silently
 * skipped **PEN** -- the form the token usually takes. These cases exist so
 * that regression cannot come back quietly.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const S = String.fromCharCode(3)
const TOKENS = ['PEN', 'S/', 'RUC', 'DNI', 'SUNAT']

function annotate(html) {
  const stash = []
  const keep = (m) => {
    const i = stash.length
    stash.push(m)
    return S + i + S
  }
  let out = html.replace(/<code\b[^>]*>[\s\S]*?<\/code>/g, keep).replace(/<[^>]+>/g, keep)
  for (const token of TOKENS) {
    const esc = token.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
    const rx = new RegExp(`(^|[^A-Za-z0-9_])(${esc})(?![A-Za-z0-9_])`, 'g')
    out = out.replace(rx, (_m, b, h) => `${b}<abbr title="t">${h}</abbr>`)
  }
  return out.replace(new RegExp(S + '(\\d+)' + S, 'g'), (_m, i) => stash[Number(i)])
}

const strip = (h) => h.replace(/<[^>]+>/g, '')

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
]

for (const [input, expected] of CASES) {
  test(`text is preserved: ${input.slice(0, 44)}`, () => {
    assert.equal(strip(annotate(input)), strip(input))
  })
  test(`annotates ${expected}x: ${input.slice(0, 44)}`, () => {
    assert.equal((annotate(input).match(/<abbr/g) ?? []).length, expected)
  })
}
