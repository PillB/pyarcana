/**
 * A distractor you cannot evaluate is not a distractor.
 *
 * S16 asked why IQR without domain bounds is risky and offered "necesita que la
 * columna siga una distribución normal" as a wrong answer. The course does not
 * introduce that idea until S18. A learner at S16 rejects the option because
 * the words are unfamiliar, not because IQR is rank-based and assumes nothing
 * about the shape -- right answer, wrong reason, and the item stops telling
 * anyone whether the concept landed.
 *
 * The fix for that one was a five-word gloss rather than a rewrite, which keeps
 * what the question discriminates. This guards against the next one.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const SECTIONS = 'src/lib/course/sections'

function course() {
  const index = readFileSync('src/lib/course/index.ts', 'utf8')
  const order = new Map()
  const src = new Map()
  for (const m of index.matchAll(
    /import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g,
  )) {
    const n = Number(m[1])
    const text = readFileSync(`${SECTIONS}/${m[2]}.ts`, 'utf8')
    order.set(text.match(/^\s*id:\s*(['"])(.*?)\1/m)[2], n)
    src.set(n, text)
  }
  return { order, src }
}

test('no self-check item is built on a term the course introduces later', () => {
  const { order, src } = course()
  const glossary = [...readFileSync('src/lib/glossary/terms.ts', 'utf8')
    .matchAll(/\n    term: '([^']+)',[\s\S]*?\n    firstSectionId: '([^']+)',/g)]
    .map((m) => ({ term: m[1], at: order.get(m[2]) }))
    .filter((t) => t.at !== undefined)

  const offenders = []
  for (const [n, text] of [...src.entries()].sort((a, b) => a[0] - b[0])) {
    for (const item of text.matchAll(/question:\s*"((?:\\.|[^"\\])+)",\s*\n\s*options:\s*\[([\s\S]*?)\],/g)) {
      const blob = `${item[1]} ${item[2]}`
      for (const { term, at } of glossary) {
        if (at <= n) continue
        const used = new RegExp(`(?<![\\w\`])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'i').test(blob)
        // An inline gloss right after the term makes it evaluable on the spot,
        // which is the point -- the rule is "explained where it is used", not
        // "never used early".
        const glossed = new RegExp(`${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`, 'i').test(blob)
        if (used && !glossed) {
          offenders.push(`S${String(n).padStart(2, '0')} uses «${term}» (introduced S${String(at).padStart(2, '0')}): ${item[1].slice(0, 60)}…`)
        }
      }
    }
  }
  assert.deepEqual(offenders, [], 'self-check items resting on vocabulary the learner has not met')
})
