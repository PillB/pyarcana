#!/usr/bin/env node
/**
 * Check or mechanically rebalance self-check answer positions.
 *
 * Correct content is never generated: the existing correct option is moved to
 * a deterministic, section-varying balanced permutation and correctIndex
 * follows it. This removes both the historical "second option" leak and the
 * newer cross-section leak caused by repeating one visible cycle 52 times.
 *
 * Usage:
 *   node scripts/rebalance_selfcheck_positions.mjs --from 14 --to 39 --write
 *   node scripts/rebalance_selfcheck_positions.mjs --from 1 --to 52
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const sectionDir = path.join(root, 'src/lib/course/sections')
const indexFile = path.join(root, 'src/lib/course/index.ts')
const args = process.argv.slice(2)

function intArg(name, fallback) {
  const i = args.indexOf(name)
  return i >= 0 ? Number(args[i + 1]) : fallback
}

const from = intArg('--from', 1)
const to = intArg('--to', 52)
const write = args.includes('--write')
const sectionCycles = [
  [0, 2, 3, 1],
  [1, 3, 0, 2],
  [2, 0, 1, 3],
  [3, 1, 2, 0],
]

function desiredCycle(section) {
  return sectionCycles[(section - 1) % sectionCycles.length]
}

function property(node, name) {
  return node.properties.find(
    (p) => ts.isPropertyAssignment(p) && p.name.getText().replaceAll(/['"]/g, '') === name,
  )
}

function inspect(file, section, shouldWrite) {
  let text = fs.readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const questions = []

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const q = property(node, 'question')
      const options = property(node, 'options')
      const correct = property(node, 'correctIndex')
      if (
        q &&
        options &&
        correct &&
        ts.isArrayLiteralExpression(options.initializer) &&
        ts.isNumericLiteral(correct.initializer)
      ) {
        questions.push({ options: options.initializer, correct: correct.initializer })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)

  const before = questions.map((q) => Number(q.correct.text))
  if (!shouldWrite) return { before, after: before, changed: 0 }

  const edits = []
  questions.forEach((q, i) => {
    const current = Number(q.correct.text)
    const elements = [...q.options.elements]
    if (elements.length !== 4 || current < 0 || current >= elements.length) return
    const cycle = desiredCycle(section)
    const desired = cycle[i % cycle.length]
    const [answer] = elements.splice(current, 1)
    elements.splice(desired, 0, answer)
    edits.push({
      start: q.options.getStart(sf),
      end: q.options.getEnd(),
      replacement: `[${elements.map((e) => e.getText(sf)).join(', ')}]`,
    })
    edits.push({
      start: q.correct.getStart(sf),
      end: q.correct.getEnd(),
      replacement: String(desired),
    })
  })
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end)
  }
  fs.writeFileSync(file, text)
  return {
    before,
    after: Array.from({ length: questions.length }, (_, i) => {
      const cycle = desiredCycle(section)
      return cycle[i % cycle.length]
    }),
    changed: edits.length / 2,
  }
}

const rows = []
const activeNames = [...fs.readFileSync(indexFile, 'utf8').matchAll(/from\s+['"]\.\/sections\/([^'"]+)['"]/g)]
  .map((match) => `${match[1]}.ts`)
for (const name of activeNames) {
  const source = fs.readFileSync(path.join(sectionDir, name), 'utf8')
  const indexMatch = source.match(/\bindex\s*:\s*(\d+)/)
  if (!indexMatch) continue
  const section = Number(indexMatch[1])
  if (section < from || section > to) continue
  const row = inspect(path.join(sectionDir, name), section, write)
  if (row.before.length) rows.push({ section, file: name, ...row })
}

const failures = rows.filter((row) => {
  const positions = write ? row.after : row.before
  const cycle = desiredCycle(row.section)
  const expected = Array.from({ length: positions.length }, (_, i) => cycle[i % cycle.length])
  return positions.length < 4 || positions.some((position, i) => position !== expected[i])
})
console.log(JSON.stringify({ write, from, to, sections: rows.length, failures, rows }, null, 2))
process.exitCode = failures.length ? 1 : 0
