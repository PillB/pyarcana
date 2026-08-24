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
