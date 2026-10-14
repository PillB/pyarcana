#!/usr/bin/env node
/**
 * Print the playground demos (src/lib/course/playground-demos.ts) as JSON, with no dependency, so
 * the content gate can read them: it runs under Python and Node 20 with no node_modules, where
 * scripts/playground_extractor.mts (which needs tsx) cannot run.
 *
 *   node scripts/playground_demos_dump.mjs
 *
 * The file is one TypeScript declaration whose initialiser is a plain object literal. Only the
 * declaration line is TypeScript, so the literal is evaluated as JavaScript and its strings decode
 * as the compiler decodes them. Any other shape exits 2 with the reason, so a caller can never read
 * an empty set for a file it did not understand. tests/adversarial/test_playground_demo_audit.py
 * holds this output equal to the real module's.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FILE = join(ROOT, 'src/lib/course/playground-demos.ts')
const DECLARATION = /^export const PLAYGROUND_DEMOS: Record<string, PlaygroundDemo> = \{$/m

class DemosRefused extends Error {}

function refuse(message) {
  throw new DemosRefused(message)
}

/** The demos object, evaluated from its `{` to the end of the file. */
export function readDemos(text) {
  const header = text.match(DECLARATION)
  if (!header) refuse('no `export const PLAYGROUND_DEMOS: Record<string, PlaygroundDemo> = {` line')
  if (text.split('PLAYGROUND_DEMOS').length !== 2) refuse('PLAYGROUND_DEMOS is declared more than once or referenced')
  const literal = text.slice(header.index + header[0].length - 1)
  let demos
  try {
    demos = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 5000 })
  } catch (error) {
    refuse(`the demos literal does not evaluate: ${error.message}`)
  }
  for (const [id, demo] of Object.entries(demos)) {
    if (typeof demo?.code !== 'string' || typeof demo?.title !== 'string') refuse(`demo ${id} has no code or title`)
    for (const field of ['expectedOutput', 'hint']) {
      if (demo[field] !== undefined && typeof demo[field] !== 'string') refuse(`demo ${id}.${field} is not a string`)
    }
  }
  return demos
}

try {
  process.stdout.write(JSON.stringify(readDemos(readFileSync(FILE, 'utf8'))))
} catch (error) {
  process.stderr.write(`playground_demos_dump: ${error.message}\n`)
  process.exit(2)
}
