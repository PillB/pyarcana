/**
 * Count known-false-claim hits per file, for tools/fixer/apply_patches.py.
 *
 *   npx tsx scripts/false_claims_scan.mts <repo-path>[=<text-file>] ...
 *
 * Each argument names a repository file, which decides its scope (section, glossary, exam bank,
 * capstone), and optionally a file holding the text to scan in its place, so a caller can count
 * the hits in a file's text from before a patch. Prints {"<repo-path>": {"KFC-001": n, ...}};
 * a file no learner reads maps to {}. Allowed hits are not counted.
 */
import { readFileSync } from 'node:fs'

import { activeSectionFiles, loadRegistry, scan, scopeOf, unitsFromText } from './lib/false_claims.mts'

const root = process.cwd()
const entries = loadRegistry(root)
const sections = activeSectionFiles(root)
const out: Record<string, Record<string, number>> = {}

for (const arg of process.argv.slice(2)) {
  const [file, textFile] = arg.split('=')
  const scope = scopeOf(file, sections)
  out[file] = {}
  if (!scope) continue
  const units = unitsFromText(file, scope, readFileSync(textFile ?? file, 'utf8'))
  for (const hit of scan(entries, units)) {
    if (!hit.allowed) out[file][hit.id] = (out[file][hit.id] ?? 0) + 1
  }
}
process.stdout.write(JSON.stringify(out))
