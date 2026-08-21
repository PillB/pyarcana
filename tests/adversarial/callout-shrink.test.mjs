import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// CAMP-20260820-02 / C02-S01-P2-MOBILE-CALLOUT-OVERFLOW
//
// The Callout content column is a flex item. A flex item defaults to
// min-width:auto, so it refuses to shrink below its content and pushes long
// exercise preambles past a narrow viewport, where they are clipped and
// unreachable. Rendered evidence: qa/pass_01/setup/after/.../capture_008
// recorded 16 elements outside the 390px viewport on the We Do tab.
const source = readFileSync(
  new URL('../../src/components/course/Callout.tsx', import.meta.url),
  'utf8',
)

test('Callout content column can shrink inside a narrow viewport', () => {
  const contentColumn = source.match(/<div className="([^"]*flex-1[^"]*)">/)
  assert.ok(contentColumn, 'expected a flex-1 content column in Callout')
  assert.match(
    contentColumn[1],
    /\bmin-w-0\b/,
    'the flex-1 content column needs min-w-0 or long content overflows a narrow viewport',
  )
})
