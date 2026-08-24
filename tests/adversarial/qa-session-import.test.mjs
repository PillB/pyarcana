/**
 * The two codex findings on the QA harness, pinned.
 *
 * Both are the same species: a check that looked like a check. The import
 * predicate accepted `context: {}` because it only asked whether the object
 * existed, and the review tab then dereferenced context.viewport.width and
 * threw. The storage fallback swallowed a quota error, so saveQaIssue resolved,
 * the form cleared, and the tester was told a report was filed that no longer
 * existed anywhere.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const SRC = readFileSync('src/lib/qa-session.ts', 'utf8')
const UI = readFileSync('src/components/course/QAHarness.tsx', 'utf8')

test('an imported issue is validated down to the fields the UI dereferences', () => {
  assert.match(SRC, /typeof ctx\.viewport\.width === 'number'/,
    'context.viewport.width is read by ContextPreview and must be validated')
  assert.match(SRC, /typeof ctx\.viewport\.height === 'number'/)
  assert.match(SRC, /isQaContext\(issue\.context\)/,
    'the issue predicate must use the deep context check, not a truthiness test')
})

test('category, cause and severity are checked against the taxonomy', () => {
  for (const list of ['QA_CATEGORIES', 'QA_CAUSES', 'QA_SEVERITIES']) {
    assert.match(SRC, new RegExp(`isOneOf\\(issue\\.\\w+, ${list}\\)`),
      `${list} must gate the imported value, not just typeof string`)
  }
})

test('a storage failure reaches the caller instead of resolving quietly', () => {
  assert.match(SRC, /class QAStorageError/, 'a distinguishable failure type must exist')
  // The fallback must throw rather than swallow; an empty catch here is the bug.
  const fallback = SRC.slice(SRC.indexOf('function fallbackWrite'))
  const body = fallback.slice(0, fallback.indexOf('\n}\n'))
  assert.match(body, /throw new QAStorageError/, 'fallbackWrite must surface quota failures')
  assert.doesNotMatch(body, /catch\s*\{\s*\n\s*(\/\/[^\n]*\n\s*)*\}/,
    'an empty catch here is exactly the silent data loss this test guards')
})

test('the form is not cleared when the write failed', () => {
  assert.match(UI, /catch \(error\)[\s\S]{0,400}QAStorageError/,
    'the submit handler must handle the storage error')
  assert.match(UI, /sigue en el formulario/,
    'the tester must be told their report was kept, not silently dropped')
})
