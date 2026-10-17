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
import { parseQaPackage, QA_SCHEMA_VERSION } from '../../src/lib/qa-session.ts'

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
  // Scoped to the write path: a match anywhere in the file was satisfied by a comment.
  assert.match(bodyOf(SRC, 'fallbackWrite'), /QuotaExceededError/, 'the quota failure needs its own message')
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

// The importer itself, handed the shapes it must refuse. These two tests used to read the
// source text instead, and passed on its type declarations and comments: deleting the
// validators left them green.
const CONTEXT = {
  path: '/s/setup', hash: '#theory', sectionId: 'setup', sectionIndex: 1, sectionTitle: 'x',
  subStep: 'theory', viewport: { width: 1280, height: 800 }, scrollY: 0, userAgent: 'test',
  language: 'es', deploymentSha: null, elementHint: null,
}
const ISSUE = {
  id: 'qa-1', createdAt: '2026-10-03T00:00:00Z', updatedAt: '2026-10-03T00:00:00Z',
  status: 'open', category: 'content', cause: 'content-gap', severity: 'low', title: 't',
  description: 'd', expected: 'e', actual: 'a', reproductionSteps: 'r', improvement: 'i',
  context: CONTEXT,
}
const pkg = (...issues) => JSON.stringify({
  schemaVersion: QA_SCHEMA_VERSION, exportedAt: '2026-10-03T00:00:00Z', tester: 'qa', issues,
})

test('a complete package imports, so the refusals below are about the bad field', () => {
  assert.equal(parseQaPackage(pkg(ISSUE)).issueCount, 1)
})

test('an imported context is validated past mere existence', () => {
  // `{}` is an object. The review tab reads context.viewport.width.
  assert.throws(() => parseQaPackage(pkg({ ...ISSUE, context: {} })), '`context: {}` was accepted')
  assert.throws(
    () => parseQaPackage(pkg({ ...ISSUE, context: { ...CONTEXT, viewport: { height: 800 } } })),
    'a viewport without the width the review tab dereferences was accepted',
  )
})

test('category, cause and severity are checked against the taxonomy', () => {
  // An unrecognised category renders an empty label and cannot be filtered.
  for (const [field, value] of [['category', 'not-a-category'], ['cause', 'nope'], ['severity', 'critical']]) {
    assert.throws(() => parseQaPackage(pkg({ ...ISSUE, [field]: value })), `${field}=${value} was accepted`)
  }
})
