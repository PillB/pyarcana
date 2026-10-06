/**
 * The seven section screenshots the owner approved on 2026-10-06 (decision D19).
 *
 * What can go wrong, and which test catches it:
 * - a record loses its credit, licence or alt, or its alt is just the caption: records;
 * - a licence that forbids commercial use or changes slips into the allowlist: licences;
 * - a PNG is renamed or missing, or its record claims another size: assets;
 * - someone edits a paragraph and the picture now sits under the wrong sentence: placement;
 * - an eighth screenshot appears without an owner decision: placement (the set is pinned);
 * - the split around a picture drops or duplicates prose: proseSegments.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import records from '../../src/assets/sections/shots.json' with { type: 'json' }
import manifest from '../../audit/section-screenshots/manifest.json' with { type: 'json' }
import { COURSE_SECTIONS } from '../../src/lib/course/index.ts'
import { validSectionShotRecord, validShotGuide, proseSegments, shotsAfter } from '../../src/lib/course/section-shots.ts'
import { REUSE_LICENCES, validShotCredit } from '../../src/lib/setup/screenshots.ts'
import type { TheoryBlock } from '../../src/lib/types.ts'

const ASSETS = 'src/assets/sections'
const SECTIONS = 'src/lib/course/sections'

/** D19's scope. Adding an id here needs a new owner decision in audit/fixer/decisions.md. */
const APPROVED = [
  's01-compare-pr-banner',
  's01-new-repository-menu',
  's01-pr-files-changed-tab',
  's01-ruff-quickfix-f401',
  's01-vscode-extensions-python',
  's23-trace-viewer',
  's44-merge-blocked',
]

type Rec = (typeof records)[number]
const byId = new Map<string, Rec>(records.map((r) => [r.id, r]))

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(file)
  assert.equal(buf.subarray(1, 4).toString('ascii'), 'PNG', `${file} is not a PNG`)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

/** Every theory block in the active course that carries a screenshot, with its section. */
function placedShots() {
  const out: { section: string; block: TheoryBlock; id: string; after: number | string }[] = []
  for (const s of COURSE_SECTIONS) {
    for (const block of s.theory) {
      for (const shot of block.screenshots ?? []) out.push({ section: s.id, block, id: shot.id, after: shot.after })
    }
  }
  return out
}

/** The text the picture is placed after: a paragraph, the code, or the callout. */
function textBefore(block: TheoryBlock, after: number | string): string | undefined {
  if (typeof after === 'number') return block.paragraphs[after]
  if (after === 'code') return block.code?.code
  if (after === 'callout') return block.callout?.content
  return undefined
}

async function sectionFromFile(file: string) {
  const mod = (await import(`../../${SECTIONS}/${file}`)) as Record<string, unknown>
  const section = Object.values(mod).find((v) => v && typeof v === 'object' && 'theory' in v)
  assert.ok(section, `${file} exports no section`)
  return section as { id: string; theory: TheoryBlock[] }
}

// --- records ---

test('records: every record validates and the set is exactly the approved seven', () => {
  assert.deepEqual(records.map((r) => r.id).sort(), APPROVED)
  for (const r of records) assert.ok(validSectionShotRecord(r), `${r.id}: record fails validSectionShotRecord`)
})

test('records: alt is not empty and is not the caption', () => {
  for (const r of records) {
    assert.ok(r.alt.trim().length > 40, `${r.id}: alt too short to say what is on screen`)
    assert.notEqual(r.alt.trim(), r.caption.trim(), `${r.id}: alt repeats the caption`)
  }
  // The validator itself refuses both, so a record cannot pass the page's filter with them.
  const r = records[0]
  assert.equal(validSectionShotRecord({ ...r, alt: r.caption }), false, 'alt == caption must be rejected')
  assert.equal(validSectionShotRecord({ ...r, alt: '' }), false, 'empty alt must be rejected')
  assert.equal(validSectionShotRecord({ ...r, guide: undefined }), false, 'a record without a guide must be rejected')
  const { credit: _credit, ...uncredited } = r
  assert.equal(validSectionShotRecord(uncredited), false, 'an uncredited picture must be rejected')
})

test('records: consulted on 2026-10-06, as the survey recorded', () => {
  for (const r of records) assert.equal(r.checkedOn, manifest.consulted, `${r.id}: date consulted`)
})

test('records: guide link text is descriptive, never "aquí" (WCAG 2.4.4)', () => {
  for (const r of records) assert.ok(validShotGuide(r.guide), `${r.id}: guide`)
  for (const label of ['aquí', 'Aquí', 'este enlace', 'here']) {
    assert.equal(validShotGuide({ label, url: 'https://docs.github.com/' }), false, `"${label}" must be rejected`)
  }
})

test('records: each guide points to the product that owns the screen', () => {
  const host: Record<string, string> = {
    's01-compare-pr-banner': 'docs.github.com',
    's01-pr-files-changed-tab': 'docs.github.com',
    's01-new-repository-menu': 'docs.github.com',
    's44-merge-blocked': 'docs.github.com',
    's01-vscode-extensions-python': 'code.visualstudio.com',
    's01-ruff-quickfix-f401': 'github.com',
    's23-trace-viewer': 'playwright.dev',
  }
  for (const r of records) assert.equal(new URL(r.guide.url).host, host[r.id], `${r.id}: guide host`)
  assert.match(byId.get('s01-ruff-quickfix-f401')!.guide.url, /astral-sh\/ruff-vscode/)
  assert.match(byId.get('s23-trace-viewer')!.guide.url, /\/python\//, 'the Python edition of the Trace Viewer guide')
})

test('records: the caveats the survey asked for are in the captions', () => {
  assert.match(byId.get('s01-ruff-quickfix-f401')!.caption, /no uses el arreglo automático/)
  assert.match(byId.get('s23-trace-viewer')!.caption, /JavaScript.*Python/)
  assert.match(byId.get('s44-merge-blocked')!.caption, /calidad de código.*revisiones requeridas/)
  assert.match(byId.get('s01-vscode-extensions-python')!.credit.changes ?? '', /logotipo/, 'the crop that removes the trademark is declared')
})

// --- licences ---

test('licences: every record is on the allowlist, MIT and Apache-2.0 included', () => {
  for (const r of records) assert.ok(r.credit.licence in REUSE_LICENCES, `${r.id}: ${r.credit.licence} not allowed`)
  assert.ok('MIT' in REUSE_LICENCES && 'Apache-2.0' in REUSE_LICENCES)
})

test('licences: NonCommercial and NoDerivatives stay rejected', () => {
  for (const key of Object.keys(REUSE_LICENCES)) assert.doesNotMatch(key, /NC|ND|NonCommercial|NoDeriv/i, key)
  const base = { source: 'Alguien', url: 'https://example.org/a.png' }
  for (const licence of ['CC BY-NC-SA 4.0', 'CC BY-NC 4.0', 'CC BY-ND 4.0', 'CC BY-NC-ND 4.0']) {
    assert.equal(validShotCredit({ ...base, licence }), false, `${licence} must be rejected`)
  }
})

test('licences: MIT and Apache-2.0 credits link the source licence file and name the holder', () => {
  const base = { source: 'Alguien', url: 'https://example.org/a.png' }
  assert.equal(validShotCredit({ ...base, licence: 'MIT' }), false, 'MIT without its licence file must be rejected')
  assert.equal(validShotCredit({ ...base, licence: 'Apache-2.0' }), false, 'Apache-2.0 without its licence file must be rejected')
  assert.equal(validShotCredit({ ...base, licence: 'CC BY 4.0' }), true, 'CC BY needs no licence file')
  for (const r of records.filter((x) => x.credit.licence === 'MIT' || x.credit.licence === 'Apache-2.0')) {
    assert.match(r.credit.licenceUrl ?? '', /\/LICENSE$/, `${r.id}: licence file`)
    assert.match(r.credit.source, /©/, `${r.id}: copyright holder named`)
  }
})

// --- assets ---

test('assets: each record has its PNG and an import, at the size the record claims', () => {
  const pngs = fs.readdirSync(ASSETS).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, '')).sort()
  assert.deepEqual(pngs, APPROVED, 'PNG files in src/assets/sections')
  const index = fs.readFileSync(path.join(ASSETS, 'index.ts'), 'utf8')
  for (const r of records) {
    assert.ok(index.includes(`from './${r.id}.png'`), `${r.id}: not imported`)
    assert.ok(index.includes(`'${r.id}':`), `${r.id}: not in SECTION_SHOT_IMAGES`)
    assert.deepEqual(pngSize(path.join(ASSETS, `${r.id}.png`)), { width: r.width, height: r.height }, `${r.id}: size`)
  }
})

test('assets: the app copy is byte-identical to the validated survey image', () => {
  for (const shot of manifest.shots) {
    const app = fs.readFileSync(path.join(ASSETS, shot.image))
    const audited = fs.readFileSync(path.join('audit/section-screenshots', shot.image))
    assert.ok(app.equals(audited), `${shot.image} differs from the image that was validated`)
  }
})

test('assets: nothing is served from public/', () => {
  for (const id of APPROVED) assert.equal(fs.existsSync(`public/${id}.png`), false, `${id} in public/`)
  const component = fs.readFileSync('src/components/course/SectionScreenshot.tsx', 'utf8')
  assert.match(component, /@\/assets\/sections/)
})

// --- placement ---

test('placement: the active course holds exactly the approved seven, once each', () => {
  const ids = placedShots().map((p) => p.id).sort()
  assert.deepEqual(ids, APPROVED, 'a screenshot was added, lost or duplicated without an owner decision')
})

test('placement: every placed screenshot resolves to a record and an asset', () => {
  for (const p of placedShots()) {
    assert.ok(byId.has(p.id), `${p.id}: no record`)
    assert.ok(fs.existsSync(path.join(ASSETS, `${p.id}.png`)), `${p.id}: no PNG`)
  }
})

test('placement: each picture follows the passage that holds its anchor sentence, in the block the survey chose', async () => {
  for (const shot of manifest.shots) {
    const section = await sectionFromFile(shot.file)
    const block = section.theory.find((b) => b.heading === shot.block_heading)
    assert.ok(block, `${shot.section}: block «${shot.block_heading}» not found`)
    assert.equal(block.subtopicId ?? null, shot.subtopicId, `${shot.section}: subtopicId of «${shot.block_heading}»`)
    const id = shot.image.replace(/\.png$/, '')
    const placed = (block.screenshots ?? []).find((s) => s.id === id)
    assert.ok(placed, `${id}: not in «${shot.block_heading}»`)
    const text = textBefore(block, placed.after)
    assert.ok(text?.includes(shot.anchor_quote), `${id}: the passage before it (after=${placed.after}) does not hold the anchor sentence`)
  }
})

test('placement: in the rendered order, the anchor paragraph ends the prose right above the picture', async () => {
  for (const shot of manifest.shots) {
    const section = await sectionFromFile(shot.file)
    const block = section.theory.find((b) => b.heading === shot.block_heading)!
    const id = shot.image.replace(/\.png$/, '')
    const placed = block.screenshots!.find((s) => s.id === id)!
    if (typeof placed.after !== 'number') {
      assert.deepEqual(shotsAfter(block, placed.after as 'code' | 'callout'), [id])
      continue
    }
    const seg = proseSegments(block).find((s) => s.shots.includes(id))
    assert.ok(seg, `${id}: not rendered after any prose`)
    const lastParagraph = seg.text.split('\n\n').at(-1)!
    assert.ok(lastParagraph.includes(shot.anchor_quote), `${id}: the paragraph right above it is not the anchor`)
  }
})

// --- proseSegments ---

test('proseSegments: with no paragraph screenshot the prose is one piece, as before', () => {
  const block = { heading: 'H', paragraphs: ['a', 'b'] }
  assert.deepEqual(proseSegments(block), [{ text: 'H\n\na\n\nb', before: '', shots: [] }])
  assert.deepEqual(proseSegments({ ...block, optional: true }), [{ text: 'a\n\nb', before: '', shots: [] }])
  assert.deepEqual(proseSegments({ ...block, screenshots: [{ id: 'x', after: 'code' }] }), [{ text: 'H\n\na\n\nb', before: '', shots: [] }])
})

test('proseSegments: a split loses and repeats no prose, and the second piece knows the first', () => {
  const block = { heading: 'H', paragraphs: ['a', 'b', 'c'], screenshots: [{ id: 'x', after: 0 }, { id: 'y', after: 2 }] }
  const segs = proseSegments(block)
  assert.deepEqual(segs.map((s) => s.shots), [['x'], ['y']])
  assert.equal(segs.map((s) => s.text).join('\n\n'), 'H\n\na\n\nb\n\nc')
  assert.equal(segs[1].before, 'H\n\na')
})

test('proseSegments: every active block renders the same prose it did before the change', () => {
  for (const s of COURSE_SECTIONS) {
    for (const block of s.theory) {
      const old = block.optional ? block.paragraphs.join('\n\n') : block.heading + '\n\n' + block.paragraphs.join('\n\n')
      const joined = proseSegments(block).map((seg) => seg.text).join('\n\n')
      assert.equal(joined.trim(), old.trim(), `${s.id} «${block.heading}»`)
    }
  }
})
