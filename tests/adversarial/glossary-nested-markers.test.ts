/**
 * Regression: on the deployed S01 exercise S01-T3-B-E2, the visible term label
 * was `Conventional ⟦TERM:commit⟧Commits`. This is a rendering failure, not a
 * spelling preference. A glossary alias must not be annotated inside a span
 * already owned by another glossary alias.
 *
 * Negative control: the pre-fix annotateGlossaryTermsPlain inserted nested
 * markers; renderToStaticMarkup exposed the inner marker verbatim. This test
 * must fail on that implementation and pass on its corrected output.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RichText } from '../../src/components/course/RichText'

test('S01 glossary aliases never leak internal annotation markers to learners', () => {
  const html = renderToStaticMarkup(createElement(RichText, {
    sectionId: 'setup',
    content: 'Elige un mensaje de commit siguiendo Conventional Commits y justifica el cambio.',
  }))

  assert.doesNotMatch(html, /⟦\/?TERM(?::[^⟧]+)?⟧/, 'internal markers leaked to visible HTML')
  assert.match(html, /Conventional Commits/, 'the original technical term must remain readable')
  assert.equal(
    (html.match(/data-testid="term-hint-conventional-commits"/g) || []).length,
    1,
    'the complete phrase must have one glossary tooltip, not nested or duplicate labels',
  )
})
