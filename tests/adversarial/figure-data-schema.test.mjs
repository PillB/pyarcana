/**
 * The rules that stop a figure library from rotting as it grows.
 *
 * These exist because I broke all three while writing the first batch by hand.
 * Attaching figures section by section, I placed S09-failfast, S27-test-pyramid
 * and S29-window-vs-group in two sections each, and put S16's null-policy
 * diagram in S03. None of that is visible in a diff, none of it fails to
 * compile, and the render probe reports both copies as clean — a duplicate is
 * only wrong pedagogically, which is exactly the kind of wrong no existing gate
 * was watching for.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const SECTIONS = 'src/lib/course/sections'
const DATA = 'src/components/course/figures/data'

/** figure id -> the section files that reference it */
function attachments() {
  const map = new Map()
  for (const f of readdirSync(SECTIONS).filter((n) => n.endsWith('.ts'))) {
    const src = readFileSync(`${SECTIONS}/${f}`, 'utf8')
    for (const m of src.matchAll(/figure:\s*\{\s*\n?\s*id:\s*["']([^"']+)["']/g)) {
      if (!map.has(m[1])) map.set(m[1], [])
      map.get(m[1]).push(f)
    }
  }
  return map
}

function declaredDataIds() {
  const ids = new Set()
  for (const f of readdirSync(DATA).filter((n) => n.endsWith('.ts') && n !== 'index.ts')) {
    const src = readFileSync(`${DATA}/${f}`, 'utf8')
    for (const m of src.matchAll(/^\s{2}'([A-Za-z0-9-]+)':\s*\{/gm)) ids.add(m[1])
  }
  return ids
}

test('no figure is attached to more than one section', () => {
  const dup = [...attachments()].filter(([, files]) => files.length > 1)
  assert.deepEqual(
    dup.map(([id, files]) => `${id} -> ${files.join(', ')}`),
    [],
    'a figure teaches one section; two copies means one of them is decoration',
  )
})

test('every attached figure resolves to a bespoke component or a data entry', () => {
  const registry = readFileSync('src/components/course/figures/index.tsx', 'utf8')
  const data = declaredDataIds()
  const missing = [...attachments().keys()].filter(
    (id) => !data.has(id) && !registry.includes(`'${id}'`),
  )
  assert.deepEqual(missing, [], 'attached ids with nothing to render')
})

test('stress fixtures are never attached to a section', () => {
  const attached = [...attachments().keys()].filter((id) => id.startsWith('ZZ-'))
  assert.deepEqual(attached, [], 'ZZ- entries measure worst cases; they are not lessons')
})

test('every figure entry carries a caption and an alt', () => {
  for (const [id, files] of attachments()) {
    const src = readFileSync(`${SECTIONS}/${files[0]}`, 'utf8')
    const block = src.slice(src.indexOf(`id: "${id}"`))
    const cap = block.match(/caption:\s*\n?\s*"([^"]*)"/)
    const alt = block.match(/alt:\s*\n?\s*"([^"]*)"/)
    assert.ok(cap && cap[1].trim().length > 20, `${id}: caption missing or too short`)
    assert.ok(alt && alt[1].trim().length > 20, `${id}: alt missing or too short`)
  }
})

test('data entries do not declare a headline longer than two wrapped lines', () => {
  // The archetypes wrap, but a headline that needs three lines pushes the
  // diagram down far enough to look like a different figure family.
  for (const f of readdirSync(DATA).filter((n) => n.endsWith('.ts') && n !== 'index.ts')) {
    const src = readFileSync(`${DATA}/${f}`, 'utf8')
    for (const m of src.matchAll(/headline:\s*'([^']+)'/g)) {
      assert.ok(m[1].length <= 130, `${f}: headline of ${m[1].length} chars: ${m[1].slice(0, 50)}…`)
    }
  }
})

test('every data entry is attached to a section', () => {
  // The inverse of the test above, and the one that was missing. Six finished
  // figures -- S20-rag-grounding, S31-path-evidence, S37-query-plan,
  // S41-request-path, S50-judge-ensemble, S51-trace-spans -- sat in the data
  // files referenced by nothing at all. They compile, they typecheck, and the
  // render probe never sees them because the probe walks sections. Authoring a
  // figure and forgetting to attach it is invisible without this.
  const attached = new Set(attachments().keys())
  const orphans = [...declaredDataIds()].filter((id) => !id.startsWith('ZZ-') && !attached.has(id))
  assert.deepEqual(orphans, [], 'figure entries that no section renders')
})

test('a figure id names the section it is attached to', () => {
  // Not cosmetics. Every section file is named for a pre-V3 ordering -- the
  // file holding "Pruebas de datos, propiedades e integración" is called
  // s28-llm-agents.ts -- so the slug is actively misleading. Matching figures
  // to the slug is how two agent diagrams ended up in a testing lesson and the
  // testing lesson's own property-coverage figure ended up one section away.
  // The id prefix is the only place the intended section is written down, so
  // it has to agree with where the figure actually hangs.
  const index = readFileSync('src/lib/course/index.ts', 'utf8')
  const numberOf = new Map(
    [...index.matchAll(/import\s+\{\s*section(\d{2})\s*\}\s+from\s+['"]\.\/sections\/([^'"]+)['"]/g)]
      .map((m) => [`${m[2]}.ts`, Number(m[1])]),
  )
  const wrong = []
  for (const [id, files] of attachments()) {
    const m = id.match(/^S(\d{2})-/)
    if (!m) continue
    const actual = numberOf.get(files[0])
    if (actual !== undefined && Number(m[1]) !== actual) {
      wrong.push(`${id} is attached to S${String(actual).padStart(2, '0')} (${files[0]})`)
    }
  }
  assert.deepEqual(wrong, [], 'figure ids that name a different section than the one rendering them')
})

test('no figure hangs on an optional theory block', () => {
  // Optional blocks render collapsed, so a figure attached to one is never in
  // the DOM: invisible to the learner who does not expand it, and invisible to
  // the render probe, which reported S33-nn-cycle as "figure not rendered" at
  // all six viewport/theme combinations. A figure that cannot be measured is a
  // figure whose contrast and clipping nobody is checking.
  const offenders = []
  for (const f of readdirSync(SECTIONS).filter((n) => n.endsWith('.ts'))) {
    const src = readFileSync(`${SECTIONS}/${f}`, 'utf8')
    for (const m of src.matchAll(/heading:\s*["'][^"']+["']/g)) {
      const next = src.indexOf('heading:', m.index + 1)
      const block = src.slice(m.index, next < 0 ? src.length : next)
      const fig = block.match(/figure:\s*\{\s*\n?\s*id:\s*["']([^"']+)["']/)
      if (fig && /\boptional:\s*true\b/.test(block)) offenders.push(`${fig[1]} (${f})`)
    }
  }
  assert.deepEqual(offenders, [], 'figures on collapsed blocks are never rendered or measured')
})

