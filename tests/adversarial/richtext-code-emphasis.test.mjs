/**
 * Emphasis must not be parsed inside inline code.
 *
 * renderInline once replaced code spans straight to `<code>$1</code>`, leaving
 * the code text in the string for the bold and italic passes that follow. A
 * span like `print(*args)` then donated its asterisk to an emphasis pair and a
 * real **bold** nearby lost its partner, rendering a literal ** to the learner.
 *
 * Seen live on two sections before the fix:
 *   S02  **print(*args, sep=" ", end="\n")**  -> "*print(args...)** controla"
 *   S21  `render(**ctx)` next to **no**       -> "a secas no** escapa HTML"
 *
 * The fix stashes code CONTENT behind a sentinel while emphasis is parsed, the
 * same technique the function already used for glossary term markers.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = readFileSync(
  fileURLToPath(new URL('../../src/components/course/RichText.tsx', import.meta.url)),
  'utf8',
)

test('code spans are stashed before emphasis is parsed', () => {
  const stash = src.indexOf('codeSpans.push(inner)')
  const bold = src.indexOf("'<strong>$1</strong>'")
  const restore = src.indexOf('<code>${codeSpans[Number(i)]}</code>')
  assert.ok(stash > -1, 'code spans must be captured into a placeholder list')
  assert.ok(bold > -1, 'bold pass must exist')
  assert.ok(restore > -1, 'code spans must be restored after emphasis')
  assert.ok(stash < bold, 'code must be stashed BEFORE the bold pass')
  assert.ok(bold < restore, 'code must be restored AFTER the emphasis passes')
})

test('the naive replacement that caused the bug is gone', () => {
  assert.doesNotMatch(
    src,
    /replace\(\/`\(\[\^`\]\+\)`\/g,\s*'<code>\$1<\/code>'\)/,
    'wrapping code inline leaves its asterisks visible to the emphasis regexes',
  )
})
