/**
 * Concept mentions a name matcher gets wrong: a dict used through its literal, and the `for` in
 * the title *Python for Everybody*. See scripts/concept_syntax.mts for how each was found.
 *
 * Synthetic text first, so a rewrite of the course cannot silently retire a test. Then two
 * properties of the real extraction, which say nothing about any one sentence and so survive
 * any rewrite: every literal-bearing event mentions dict, and the book title alone never
 * mentions `for`.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { execFileSync } from 'node:child_process'

import { blankProperNames, syntaxMentions } from '../../scripts/concept_syntax.mts'
import { GLOSSARY_TERMS } from '../../src/lib/glossary/terms'

test('a dict literal is a use of dict, in either quote style and inside inline code', () => {
  for (const t of [
    'c = {\n    "case": "CASO-LIM-002",\n}',
    "orig=[{'n':1}]",
    'responde `{"ok": true}` cuando todo va bien',
  ]) assert.deepEqual(syntaxMentions(t), ['dict'], t)
})

test('braces that are not a dict are not a use of dict', () => {
  for (const t of [
    'print(f"{monto:.2f}")',          // format spec on a name
    "print(f\"{'total':>10}\")",       // format spec on a quoted literal: the case the guard is for
    'print(f\'{d["k"]}\')',            // subscript inside an f-string
    'vistos = {1, 2, 3}',              // a set
    'print(f"{nombre}")',
    'Usa llaves `{}` para interpolar',
  ]) assert.deepEqual(syntaxMentions(t), [], t)
})

test('the !r conversion is a use of repr, and nothing else that looks like it is', () => {
  for (const t of ['print(f"valor={nombres!r}")', 'f"{x!r:>10}"', "f'{raw!r} → {clean!r}'"])
    assert.ok(syntaxMentions(t).includes('repr'), t)
  for (const t of ['if x != r:', '¡r}', 'print("!r")', 'f"{x!s}"'])
    assert.ok(!syntaxMentions(t).includes('repr'), t)
})

test('blanking a proper name keeps every offset, so definesTerm still reads the right span', () => {
  const t = 'Lee Python for Everybody — loops; un bucle for repite.'
  const b = blankProperNames(t)
  assert.equal(b.length, t.length)
  assert.equal(b.indexOf('for'), t.lastIndexOf('for'), 'only the loop keyword survives')
})

test('the title is blanked, and nothing else is', () => {
  assert.doesNotMatch(blankProperNames('Coursera — Python for Everybody'), /\bfor\b/)
  assert.match(blankProperNames('Python for Everybody — conditionals if/else'), /\bif\b/)
  assert.equal(blankProperNames('for x in datos:'), 'for x in datos:')
})

// The same extraction the gate runs.
const events = JSON.parse(execFileSync(
  'npx', ['tsx', 'scripts/course_event_extractor.mts'],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
)).events

test('property: every syntax use of a glossary concept is a mention of it', () => {
  // Only glossary ids count: the extractor drops a syntax id with no entry, so `repr` starts
  // counting the day its entry lands, and this property starts holding it to that.
  const ids = new Set(GLOSSARY_TERMS.map((t) => t.id))
  const missed = events.flatMap((e) => syntaxMentions(e.text)
    .filter((id) => ids.has(id) && !e.mentions.includes(id))
    .map((id) => `${id} @ ${e.location}`))
  assert.deepEqual(missed, [])
})

test('property: the book title alone never makes an event mention `for`', () => {
  const wrong = events
    .filter((e) => e.text.includes('Python for Everybody'))
    .filter((e) => !/\bfor\b/i.test(blankProperNames(e.text)) && e.mentions.includes('for'))
    .map((e) => e.location)
  assert.deepEqual(wrong, [])
})
