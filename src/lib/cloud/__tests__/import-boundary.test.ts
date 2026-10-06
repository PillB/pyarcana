import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

/**
 * The course data is a 6.1 MB chunk. Nothing the account, access, ads or sync code pulls in may reach
 * it, directly or through another module, or every page that shows an account button downloads it.
 * This walks the real import graph from every file under src/lib/cloud and src/components/account.
 */
const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const FORBIDDEN = join(SRC, 'lib', 'course')
const ENTRY_DIRS = [join(SRC, 'lib', 'cloud'), join(SRC, 'components', 'account')]
const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return name === '__tests__' ? [] : listFiles(full)
    return /\.(ts|tsx)$/.test(name) ? [full] : []
  })
}

function resolveSpecifier(from: string, spec: string): string | null {
  let base: string
  if (spec.startsWith('@/')) base = join(SRC, spec.slice(2))
  else if (spec.startsWith('.')) base = resolve(dirname(from), spec)
  else return null // a package, not repo code
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return base // unresolved, still checked against the forbidden prefix
}

function reachable(entries: string[]): Map<string, string> {
  const seen = new Map<string, string>() // file -> the file that imported it
  const queue: Array<[string, string]> = entries.map((e) => [e, '(entry)'])
  for (let i = 0; i < queue.length; i++) {
    const [file, parent] = queue[i]
    if (seen.has(file)) continue
    seen.set(file, parent)
    if (!existsSync(file) || file.startsWith(FORBIDDEN)) continue
    const text = readFileSync(file, 'utf8')
    for (const m of text.matchAll(IMPORT)) {
      const target = resolveSpecifier(file, m[1] ?? m[2] ?? m[3])
      if (target) queue.push([target, file])
    }
  }
  return seen
}

test('nothing reachable from the cloud and account code imports @/lib/course', () => {
  const entries = ENTRY_DIRS.flatMap(listFiles)
  assert.ok(entries.length >= 10, `expected the cloud modules to be found, got ${entries.length}`)
  const graph = reachable(entries)
  const offenders = [...graph.entries()].filter(([file]) => file.startsWith(FORBIDDEN))
  assert.deepEqual(
    offenders.map(([file, parent]) => `${relative(ROOT, parent)} -> ${relative(ROOT, file)}`),
    []
  )
  // The walk is not vacuous: it follows @/ imports out of the cloud directory.
  assert.ok(graph.has(join(SRC, 'lib', 'progress-sanitize.ts')))
  assert.ok(graph.has(join(SRC, 'lib', 'section-id-migrations.ts')))
})

test('the walker sees every import form it guards against', () => {
  const sample = `import a from '@/lib/x'\nexport { b } from './y'\nconst c = await import('../z')\nimport '@/lib/side-effect'\nimport type { T } from '@/lib/types'`
  const specs = [...sample.matchAll(IMPORT)].map((m) => m[1] ?? m[2] ?? m[3])
  assert.deepEqual(specs, ['@/lib/x', './y', '../z', '@/lib/side-effect', '@/lib/types'])
})
