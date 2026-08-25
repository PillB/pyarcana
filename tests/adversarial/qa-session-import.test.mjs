/**
 * The two QA-harness findings from the codex review, pinned as behaviour.
 *
 * Both were the same species: a check that looked like a check. The import
 * predicate accepted `context: {}` because it only asked whether the object
 * existed, and the review tab then dereferenced `context.viewport.width` and
 * threw. The storage fallback swallowed a quota error, so `saveQaIssue`
 * resolved, the form cleared, and the tester was told a report was filed that
 * no longer existed anywhere.
 *
 * These assertions deliberately name the *guarantee*, not one implementation
 * of it. I fixed both independently of PR #50 and my version was the weaker
 * one -- theirs distinguishes QuotaExceededError and validates every context
 * field rather than the two the UI happens to read today. A test written
 * against my own helper names would have failed on the better fix, which is
 * the wrong way round for a regression guard.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const SRC = readFileSync('src/lib/qa-session.ts', 'utf8')
const UI = readFileSync('src/components/course/QAHarness.tsx', 'utf8')

/** The body of a top-level function declaration, for scoped assertions. */
function bodyOf(source, name) {
  const start = source.indexOf(`function ${name}`)
  assert.notEqual(start, -1, `${name} must exist`)
  const rest = source.slice(start)
  const end = rest.indexOf('\n}\n')
  return rest.slice(0, end === -1 ? rest.length : end)
}

test('a failed local write is reported, never swallowed', () => {
  const body = bodyOf(SRC, 'fallbackWrite')
  assert.match(body, /throw/, 'fallbackWrite must surface a failed write')
  // An empty catch here is precisely the silent data loss being guarded.
  assert.doesNotMatch(
    body,
    /catch\s*(\([^)]*\))?\s*\{\s*(\/\/[^\n]*\n\s*)*\}/,
    'an empty catch in fallbackWrite is the bug this test exists for',
  )
})

test('the quota case is distinguishable, because it is the reachable one', () => {
  // A screenshot near the 6 MB cap becomes a larger base64 data URL, so the
  // serialised session can exceed the localStorage quota on a normal report.
  assert.match(SRC, /Quota|quota/, 'the quota failure needs its own message')
})

test('the form is kept when the write failed', () => {
  const handler = UI.slice(UI.indexOf('await saveQaIssue'))
  const scope = handler.slice(0, handler.indexOf('finally'))
  assert.match(scope, /catch/, 'the submit handler must catch a failed save')
  assert.match(
    scope,
    /conserv|sigue|manten/i,
    'the tester must be told their report was kept rather than silently dropped',
  )
})

test('an imported context is validated past mere existence', () => {
  // `{}` is an object. The review tab reads context.viewport.width.
  assert.match(SRC, /viewport/, 'nested viewport must be validated')
  assert.match(SRC, /width/, 'the field the review tab dereferences must be checked')
  assert.doesNotMatch(
    SRC,
    /&&\s*typeof issue\.context === 'object'\s*\n?\s*\}/,
    'a bare typeof-object check on context is what let `{}` through',
  )
})

test('category, cause and severity are checked against the taxonomy', () => {
  for (const list of ['QA_CATEGORIES', 'QA_CAUSES', 'QA_SEVERITIES']) {
    assert.ok(
      SRC.includes(list),
      `${list} must gate the imported value, not just a typeof string test`,
    )
  }
  assert.doesNotMatch(
    SRC,
    /typeof issue\.category === 'string'\s*$/m,
    'an unrecognised category renders an empty label and cannot be filtered',
  )
})
