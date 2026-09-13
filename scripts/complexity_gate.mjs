#!/usr/bin/env node
/**
 * chore(lint): cyclomatic complexity ceiling, enforced as a ratchet.
 *
 * McCabe's original guidance puts 10 at the edge of what one person can hold in
 * mind, and most TypeScript/React teams settle at 15. This repository's worst
 * function scores 90, so a hard ceiling today would block every change and be
 * switched off within a week - which is how complexity limits usually die.
 *
 * So the ceiling is real but the enforcement is directional: the count of
 * functions above it, and the worst score, may fall and may not rise. New code
 * meets the ceiling; existing debt is visible, counted, and cannot grow.
 *
 *   node scripts/complexity_gate.mjs            # check against the baseline
 *   node scripts/complexity_gate.mjs --update   # re-baseline after reducing debt
 */
import { ESLint } from 'eslint'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const CEILING = 15
const BASELINE = 'audit/fixer/complexity_baseline.json'

const eslint = new ESLint({
  overrideConfig: { rules: { complexity: ['error', CEILING] } },
  overrideConfigFile: 'eslint.config.mjs',
})

const results = await eslint.lintFiles(['src/**/*.ts', 'src/**/*.tsx'])
const offenders = []
for (const r of results) {
  for (const m of r.messages) {
    if (m.ruleId !== 'complexity') continue
    const n = /complexity of (\d+)/.exec(m.message)
    if (n) offenders.push({ score: +n[1], file: r.filePath.split(`${process.cwd()}/`).pop(), line: m.line })
  }
}
offenders.sort((a, b) => b.score - a.score)
const now = { ceiling: CEILING, over_ceiling: offenders.length, worst: offenders[0]?.score ?? 0 }

if (process.argv.includes('--update') || !existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify({ ...now, worst_offenders: offenders.slice(0, 10) }, null, 1) + '\n')
  console.log('complexity baseline written:', JSON.stringify(now))
  process.exit(0)
}

const was = JSON.parse(readFileSync(BASELINE, 'utf8'))
const grew = now.over_ceiling > was.over_ceiling || now.worst > was.worst
console.log(`complexity ceiling ${CEILING}: ${now.over_ceiling} functions over (baseline ${was.over_ceiling}), worst ${now.worst} (baseline ${was.worst})`)
if (grew) {
  console.log('\nFAIL: complexity grew. Split the new function, or reduce elsewhere first.')
  for (const o of offenders.slice(0, 8)) console.log(`  ${o.score}  ${o.file}:${o.line}`)
  process.exit(1)
}
if (now.over_ceiling < was.over_ceiling || now.worst < was.worst) {
  writeFileSync(BASELINE, JSON.stringify({ ...now, worst_offenders: offenders.slice(0, 10) }, null, 1) + '\n')
  console.log('debt reduced; baseline tightened.')
}
process.exit(0)
