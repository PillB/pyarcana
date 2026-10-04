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
import { aliasIsAcronym } from '../../src/lib/glossary/terms.ts'

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

  // Either quote style: S01-S03 write their questions in single quotes, and the double-quote-only
  // pattern this used to have skipped all 27 of their items without a word.
  const ITEM = /question:\s*(["'])((?:\\.|(?!\1)[^\\])+)\1,\s*\n\s*options:\s*\[([\s\S]*?)\],/g
  const offenders = []
  let scanned = 0
  let questions = 0
  for (const [n, text] of [...src.entries()].sort((a, b) => a[0] - b[0])) {
    questions += (text.match(/\bquestion:\s*['"`]/g) ?? []).length
    for (const item of text.matchAll(ITEM)) {
      scanned += 1
      const blob = `${item[2]} ${item[3]}`
      for (const { term, at } of glossary) {
        if (at <= n) continue
        // An acronym matches case-sensitively, by the course's own rule (aliasIsAcronym in
        // terms.ts): reading all 395 items surfaced `ABC` matching the string "abc" in S02.
        const flags = aliasIsAcronym(term) ? '' : 'i'
        const used = new RegExp(`(?<![\\w\`])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, flags).test(blob)
        // An inline gloss right after the term makes it evaluable on the spot,
        // which is the point -- the rule is "explained where it is used", not
        // "never used early".
        const glossed = new RegExp(`${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`, 'i').test(blob)
        if (used && !glossed) {
          offenders.push(`S${String(n).padStart(2, '0')} uses «${term}» (introduced S${String(at).padStart(2, '0')}): ${item[2].slice(0, 60)}…`)
        }
      }
    }
  }
  assert.ok(questions > 0, 'no self-check question found in any section')
  assert.equal(scanned, questions, `read ${scanned} of the ${questions} self-check questions in the course`)
  assert.deepEqual(offenders, [], 'self-check items resting on vocabulary the learner has not met')
})
