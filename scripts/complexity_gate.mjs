#!/usr/bin/env node
/**
 * chore(lint): cyclomatic complexity ceiling, enforced as a ratchet.
 *
 * McCabe's original guidance puts 10 at the edge of what one person can hold in
 * mind, and most TypeScript/React teams settle at 15. This repository's worst
 * function scores 90, so a hard ceiling today would block every change and be
 * switched off within a week - which is how complexity limits usually die.
 *
 * The ceiling is enforced per function, even though existing debt is grandfathered.
 * A new offender or an increase in an existing offender fails: removing an
 * unrelated legacy function cannot offset it. The baseline is mandatory.
 *
 *   node scripts/complexity_gate.mjs            # check against the baseline
 *   node scripts/complexity_gate.mjs --update   # re-baseline after reducing debt
 */
import { ESLint } from 'eslint'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { complexityRegressions, complexityDebtReduced } from './lib/complexity_policy.mjs'
import { anonymousFunctionFingerprint } from './lib/function_identity.mjs'

const CEILING = 15
const BASELINE = 'audit/fixer/complexity_baseline.json'

const eslint = new ESLint({
  overrideConfig: { rules: { complexity: ['error', CEILING] } },
  overrideConfigFile: 'eslint.config.mjs',
})

const results = await eslint.lintFiles(['src/**/*.ts', 'src/**/*.tsx'])
const offenders = []
const identities = new Map()
const sources = new Map()
for (const r of results) {
  for (const m of r.messages) {
    if (m.ruleId !== 'complexity') continue
    const n = /complexity of (\d+)/.exec(m.message)
    if (!n) throw new Error(`Unrecognized complexity report: ${m.message}`)
    const file = r.filePath.split(`${process.cwd()}/`).pop()
    const match = /^(?:Async )?(Function|Method) '([^']+)'/i.exec(m.message)
    if (!sources.has(file)) sources.set(file, readFileSync(r.filePath, 'utf8'))
    const label = match ? `${match[1].toLowerCase()}:${match[2]}` :
      `anonymous-fingerprint:${anonymousFunctionFingerprint(sources.get(file), file, m.line, m.column)}`
    const baseKey = `${file}::${label}`
    const nth = identities.get(baseKey) ?? 0
    identities.set(baseKey, nth + 1)
    offenders.push({ key: `${baseKey}#${nth}`, score: +n[1], file, line: m.line })
  }
}
offenders.sort((a, b) => b.score - a.score)
const now = { schema_version: 2, ceiling: CEILING, over_ceiling: offenders.length,
  worst: offenders[0]?.score ?? 0, offenders, worst_offenders: offenders.slice(0, 10) }

if (!existsSync(BASELINE)) {
  console.error(`FAIL: missing tracked complexity baseline ${BASELINE}`)
  process.exit(1)
}

const was = JSON.parse(readFileSync(BASELINE, 'utf8'))
// One-time migration from positional keys. It is safe only if no per-file
// complexity scores have changed, and never happens in normal CI/check runs.
if (process.argv.includes('--migrate-anonymous-identities')) {
  const scoreSignature = (items) => items.map((o) => `${o.file}:${o.score}`).sort().join('\n')
  const unchanged = was.schema_version === 2 &&
    scoreSignature(was.offenders) === scoreSignature(offenders)
  if (!unchanged) {
    console.error('FAIL: identity migration requires an unchanged per-file score multiset')
    process.exit(1)
  }
  writeFileSync(BASELINE, JSON.stringify(now, null, 1) + '\n')
  console.log('Migrated anonymous identities to AST fingerprints; scores unchanged.')
  process.exit(0)
}
const migrating = !Array.isArray(was.offenders) && process.argv.includes('--update') &&
  now.over_ceiling === was.over_ceiling && now.worst === was.worst
if (!migrating && !Array.isArray(was.offenders)) {
  console.error('FAIL: legacy aggregate-only complexity baseline; migrate with --update on an unchanged baseline')
  process.exit(1)
}
const regressions = migrating ? [] : complexityRegressions(was.offenders, offenders, CEILING)
const grew = regressions.length > 0 || now.over_ceiling > was.over_ceiling || now.worst > was.worst
console.log(`complexity ceiling ${CEILING}: ${now.over_ceiling} functions over (baseline ${was.over_ceiling}), worst ${now.worst} (baseline ${was.worst})`)
if (grew) {
  console.log('\nFAIL: complexity grew in a specific function. Split it before merging.')
  for (const o of regressions.slice(0, 8)) console.log(`  ${o.score}  ${o.key}:${o.line}`)
  process.exit(1)
}
if (process.argv.includes('--update') || complexityDebtReduced(was.offenders, offenders)) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 1) + '\n')
  console.log(migrating ? 'per-function baseline migrated.' : 'debt baseline tightened.')
}
process.exit(0)
