/**
 * The course's section bindings, read from their sources (design G-2, G-4 to G-10).
 *
 * Each `import { sectionNN } from './sections/<stem>'` in src/lib/course/index.ts is one bound
 * section. Its number is the `index:` the section file declares (G-2 checks that the index and
 * the slot agree), its slug is the `id:`, and its phase is the `phase:`. A guard that names a
 * section number takes it from here, so a renumber moves every guard with the sections.
 */
import fs from 'node:fs'
import path from 'node:path'

const IMPORT_RE = /import \{ (section\d+) \} from '\.\/sections\/([^']+)'/g
const ID_RE = /^\s{0,4}id:\s*['"]([^'"]+)['"]/m
const INDEX_RE = /^\s{0,4}index:\s*(\d+)/m
const PHASE_RE = /^\s{0,4}phase:\s*(\d+)/m

/** One entry per bound section, in import order: { binding, stem, id, number, phase }. */
export function readBindings(root) {
  const index = fs.readFileSync(path.join(root, 'src/lib/course/index.ts'), 'utf-8')
  return [...index.matchAll(IMPORT_RE)].map(([, binding, stem]) => {
    const source = fs.readFileSync(path.join(root, 'src/lib/course/sections', `${stem}.ts`), 'utf-8')
    return {
      binding,
      stem,
      id: ID_RE.exec(source)?.[1] ?? null,
      number: Number(INDEX_RE.exec(source)?.[1] ?? Number.NaN),
      phase: Number(PHASE_RE.exec(source)?.[1] ?? Number.NaN),
    }
  })
}

/** The distinct phases the bindings declare, ascending. */
export function phasesOf(bindings) {
  return [...new Set(bindings.map((b) => b.phase))].sort((a, b) => a - b)
}

/** The span label of one phase, as the catalogue writes it: 'S14–S28'. Null when the phase is empty. */
export function phaseSpan(bindings, phase) {
  const numbers = bindings.filter((b) => b.phase === phase).map((b) => b.number)
  if (numbers.length === 0) return null
  const pad = (n) => `S${String(n).padStart(2, '0')}`
  return `${pad(Math.min(...numbers))}–${pad(Math.max(...numbers))}`
}
