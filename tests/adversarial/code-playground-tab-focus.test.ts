// A9 (reval S02-RT-006): the code editor must not trap keyboard focus (WCAG 2.1.2).
// Tab still indents; Shift+Tab leaves at once; Escape then Tab leaves once.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import { resolveEditorKey } from '../../src/components/course/code-playground-keys'

const SOURCE = readFileSync(
  join(process.cwd(), 'src/components/course/CodePlayground.tsx'),
  'utf8',
)

test('plain Tab still indents, so the editor keeps its Python behaviour', () => {
  assert.deepEqual(resolveEditorKey('Tab', false, false), { action: 'indent', escapeArmed: false })
})

test('Shift+Tab leaves the editor instead of indenting', () => {
  assert.deepEqual(resolveEditorKey('Tab', true, false), { action: 'leave', escapeArmed: false })
})

test('Escape arms the editor, and the next Tab leaves it', () => {
  const armed = resolveEditorKey('Escape', false, false)
  assert.deepEqual(armed, { action: 'none', escapeArmed: true })
  assert.deepEqual(resolveEditorKey('Tab', false, armed.escapeArmed), {
    action: 'leave',
    escapeArmed: false,
  })
})

test('the Escape exit is spent after one Tab, so the next Tab indents again', () => {
  const left = resolveEditorKey('Tab', false, true)
  assert.equal(left.action, 'leave')
  assert.deepEqual(resolveEditorKey('Tab', false, left.escapeArmed), {
    action: 'indent',
    escapeArmed: false,
  })
})

test('any other key between Escape and Tab disarms the exit', () => {
  const armed = resolveEditorKey('Escape', false, false)
  const typed = resolveEditorKey('a', false, armed.escapeArmed)
  assert.deepEqual(typed, { action: 'none', escapeArmed: false })
  assert.deepEqual(resolveEditorKey('Tab', false, typed.escapeArmed), {
    action: 'indent',
    escapeArmed: false,
  })
})

test('the component routes Tab through the policy and no longer traps it unconditionally', () => {
  assert.match(SOURCE, /resolveEditorKey\(e\.key, e\.shiftKey, escapeArmedRef\.current\)/)
  assert.doesNotMatch(SOURCE, /if \(e\.key === 'Tab'\) \{\s*e\.preventDefault\(\)/)
  assert.match(SOURCE, /aria-describedby=\{keyboardHelpId\}/)
})
