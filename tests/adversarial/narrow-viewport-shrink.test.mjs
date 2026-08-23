/**
 * Flex children that must be allowed to shrink at 320px.
 *
 * A flex item defaults to `min-width: auto`, so it refuses to shrink below its
 * own content and pushes its siblings past the viewport. The Callout already
 * carries a regression test for exactly this (callout-shrink.test.mjs, from a
 * defect that put 16 elements outside a 390px viewport). These are the same
 * defect in three more places, found by measuring the rendered page at 320px:
 *
 *   basics   66px  -> the mobile header brand refused to give way
 *   testing  202px -> long inline code in prose could not wrap
 *   all      36px  -> the "Profundización opcional" badge, pushed out by a
 *                     flex-1 heading with no min-w-0
 *
 * All three now measure 0px.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')

test('the folded-block heading can shrink beside its badge', () => {
  const src = read('../../src/components/course/SectionView.tsx')
  const heading = src.match(/<span className="([^"]*flex-1[^"]*)">\{block\.heading\}<\/span>/)
  assert.ok(heading, 'expected the collapsible trigger heading span')
  assert.match(
    heading[1],
    /\bmin-w-0\b/,
    'a flex-1 heading without min-w-0 pushes the badge past a 320px viewport',
  )
})

test('long inline code in prose wraps instead of widening the page', () => {
  // `ClientService(InMemoryClientRepository()).register(...)` in S11 prose is
  // one token as far as the browser is concerned, and inline code has no
  // scroll container to absorb it.
  const src = read('../../src/components/course/RichText.tsx')
  const codeStyled = [...src.matchAll(/\[&_code\]:font-mono/g)]
  assert.ok(codeStyled.length >= 3, 'expected the three inline-code style sites')
  const breaks = [...src.matchAll(/\[&_code\]:break-words/g)]
  assert.equal(
    breaks.length,
    codeStyled.length,
    'every inline-code surface needs break-words, or a long identifier overflows the page',
  )
})

test('the mobile header lets the brand give way, not the controls', () => {
  const src = read('../../src/app/page.tsx')
  const brand = src.match(/<button onClick=\{handleHome\} className="([^"]*)"/)
  assert.ok(brand, 'expected the header brand button')
  assert.match(brand[1], /\bmin-w-0\b/, 'the brand must be allowed to shrink')
  assert.match(src, /<span className="truncate text-sm font-bold"/, 'the brand label must truncate')
  assert.match(
    src,
    /<div className="flex shrink-0 items-center gap-1">/,
    'the control cluster must not shrink into unusable targets',
  )
})
