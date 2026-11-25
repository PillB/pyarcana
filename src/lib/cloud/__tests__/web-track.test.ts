/**
 * The applied web track (#ruta-web): its placement beside the 52 sections, its own ticks, its
 * routing, and its content's rules, including that every Python block prints what it claims and
 * that app.js really sorts the table. Each test names the defect it guards; the PR lists the
 * mutation that turned each one red.
 *
 * Kept in the client group (scripts/run_billing_tests.mjs) because that runner gives each suite a
 * floor and fails on a missing file.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { COURSE_SECTIONS } from '@/lib/course'
import { parseCourseHash, WEB_TRACK_HASH } from '@/lib/course/hash-route'
import { resolveTrackPlacement, trackLinkFor, trackStanding, type PlacedSection } from '@/lib/tracks/placement'
import { previewFrameProps } from '@/lib/tracks/preview'
import {
  countTrackDone,
  loadTrackProgress,
  parseTrackProgress,
  saveTrackProgress,
  serializeTrackProgress,
  toggleTrackStep,
  trackProgressKey,
} from '@/lib/tracks/progress'
import { WEB_TRACK, WEB_TRACK_ANCHORS, WEB_TRACK_ID } from '@/lib/tracks/web/content'
import { WEB_TRACK_PLACEMENT, WEB_TRACK_STEP_IDS, trackModuleFromHash } from '@/lib/tracks/web/placed'
import { SETUP_PROGRESS_KEY } from '@/lib/setup/progress'

const COURSE_PROGRESS_KEY = 'python-ds-progress'
const ALL_STEPS = WEB_TRACK.modules.flatMap((m) => m.steps.map((s) => ({ module: m.id, step: s })))

// ---------------------------------------------------------------------------------------------
// Ticks: their own key, fail safe, never the course record
// ---------------------------------------------------------------------------------------------

test('the track keeps its ticks under its own key, apart from the course and from Sesión 0', () => {
  const key = trackProgressKey(WEB_TRACK_ID)
  assert.equal(key, 'pyarcana:track:ruta-web:v1')
  // Defect guarded: a shared key would let a track tick overwrite completed sections or Sesión 0.
  assert.notEqual(key, COURSE_PROGRESS_KEY, 'the track must not write the course progress key')
  assert.notEqual(key, SETUP_PROGRESS_KEY, 'the track must not write Sesión 0 progress key')
  assert.throws(() => trackProgressKey('Ruta Web'), /not a valid track id/)
})

test('saving a tick writes only the track key and leaves the course record byte-for-byte', () => {
  const course = JSON.stringify({ state: { completedSections: ['setup', 'basics'] }, version: 3 })
  const store = new Map<string, string>([[COURSE_PROGRESS_KEY, course]])
  const kv = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
  const p = toggleTrackStep({ done: [] }, 'html.escapar')
  assert.equal(saveTrackProgress(kv, WEB_TRACK_ID, p), true)
  assert.equal(store.get(COURSE_PROGRESS_KEY), course, 'the course progress changed when a track step was ticked')
  assert.deepEqual([...store.keys()].sort(), [COURSE_PROGRESS_KEY, trackProgressKey(WEB_TRACK_ID)].sort())
  assert.deepEqual(loadTrackProgress(kv, WEB_TRACK_ID).done, ['html.escapar'])
})

test('unreadable stored ticks read as empty instead of throwing, and unknown ids from a newer page survive', () => {
  for (const raw of [null, '', '{', '[]', 'null', '42', '{"done":"html.escapar"}']) {
    assert.deepEqual(parseTrackProgress(raw), { done: [] }, `stored ${JSON.stringify(raw)} should read as no ticks`)
  }
  const parsed = parseTrackProgress(JSON.stringify({ v: 1, done: ['html.escapar', 'futuro.paso', '<script>', 7, 'html.escapar'] }))
  assert.deepEqual(parsed.done, ['html.escapar', 'futuro.paso'], 'valid ids kept once, malformed ones dropped')
  assert.equal(serializeTrackProgress(parsed), '{"v":1,"done":["html.escapar","futuro.paso"]}')
})

test('a browser that refuses storage reads as empty and the save reports false', () => {
  const throwing = { getItem: () => { throw new Error('SecurityError') }, setItem: () => { throw new Error('QuotaExceededError') } }
  assert.deepEqual(loadTrackProgress(throwing, WEB_TRACK_ID), { done: [] })
  assert.equal(saveTrackProgress(throwing, WEB_TRACK_ID, { done: ['html.escapar'] }), false)
  assert.equal(saveTrackProgress(null, WEB_TRACK_ID, { done: [] }), false)
})

test('ticking twice unticks, and the counter counts only the ids asked about', () => {
  let p = toggleTrackStep({ done: [] }, 'html.reparto')
  p = toggleTrackStep(p, 'http.navegador')
  assert.equal(countTrackDone(p, WEB_TRACK_STEP_IDS), 2)
  p = toggleTrackStep(p, 'html.reparto')
  assert.deepEqual(p.done, ['http.navegador'])
  assert.deepEqual(toggleTrackStep(p, 'NO VALE'), p, 'a malformed id is ignored, not stored')
})

// ---------------------------------------------------------------------------------------------
// Placement: by slug and phase, against the live course and against simulated drift
// ---------------------------------------------------------------------------------------------

test('in the live course the detour starts after S12, is offered in S13 and is required from S27', () => {
  assert.equal(WEB_TRACK_PLACEMENT.recommendedAfter.index, 12, `anchor resolved to ${WEB_TRACK_PLACEMENT.recommendedAfter.id}`)
  assert.equal(WEB_TRACK_PLACEMENT.recommendedAfter.title, 'APIs, SQL y geodatos responsables')
  assert.deepEqual(WEB_TRACK_PLACEMENT.offeredIn.map((s) => s.index), [13])
  // "Optional at intermediate, required at advanced": phase 2 is the first level the course names
  // «Integración avanzada» (src/lib/course/index.ts PHASES).
  assert.equal(WEB_TRACK_PLACEMENT.requiredBefore.phase, 2)
  assert.equal(WEB_TRACK_PLACEMENT.requiredBefore.index, 27)
})

/** The live course as plain records, so drift can be simulated without touching lesson files. */
function liveSections(): PlacedSection[] {
  return COURSE_SECTIONS.map((s) => ({ id: s.id, index: s.index, phase: s.phase, title: s.title }))
}

test('drift: inserting a section before S12 moves the detour with S12, not with the number 12', () => {
  const shifted = liveSections().map((s) => (s.index >= 5 ? { ...s, index: s.index + 1 } : s))
  shifted.push({ id: 'new-section', index: 5, phase: 0, title: 'Nueva' })
  const placed = resolveTrackPlacement(shifted, WEB_TRACK_ANCHORS)
  assert.equal(placed.recommendedAfter.id, 'apis-sql-geo')
  assert.equal(placed.recommendedAfter.index, 13, 'the detour must follow its section to its new number')
  assert.equal(placed.requiredBefore.id, WEB_TRACK_PLACEMENT.requiredBefore.id)
})

test('drift: retitling S12 changes nothing; renaming or deleting its slug fails loudly with the fix', () => {
  const retitled = liveSections().map((s) => (s.id === 'apis-sql-geo' ? { ...s, title: 'Otro título' } : s))
  assert.equal(resolveTrackPlacement(retitled, WEB_TRACK_ANCHORS).recommendedAfter.index, 12)
  const deleted = liveSections().filter((s) => s.id !== 'apis-sql-geo')
  assert.throws(
    () => resolveTrackPlacement(deleted, WEB_TRACK_ANCHORS),
    (e: Error) => /"apis-sql-geo" names no active section/.test(e.message) && /src\/lib\/tracks\/web\/content\.ts/.test(e.message),
  )
  const offeredGone = liveSections().filter((s) => s.id !== 'evidence-dashboard')
  assert.throws(() => resolveTrackPlacement(offeredGone, WEB_TRACK_ANCHORS), /alsoOfferedIn anchor "evidence-dashboard"/)
})

test('drift: if phase 2 moves, "required" follows the first section of the phase, and an impossible order is refused', () => {
  const moved = liveSections().map((s) => (s.index === 27 ? { ...s, phase: 1 as const } : s))
  assert.equal(resolveTrackPlacement(moved, WEB_TRACK_ANCHORS).requiredBefore.index, 28)
  const noPhase = liveSections().map((s) => (s.phase === 2 ? { ...s, phase: 3 as const } : s))
  assert.throws(() => resolveTrackPlacement(noPhase, WEB_TRACK_ANCHORS), /no active section has phase 2/)
  assert.throws(
    () => resolveTrackPlacement(liveSections(), { ...WEB_TRACK_ANCHORS, requiredFromPhase: 0 }),
    /required .* no later than it is recommended/,
  )
})

test('standing: upcoming before S12, optional after it, required from the advanced level, done wins', () => {
  const secs = liveSections()
  const at = (completed: string[], current?: string, complete = false) =>
    trackStanding(WEB_TRACK_PLACEMENT, secs, { completedSections: completed, currentSectionId: current }, complete)
  const slug = (i: number) => secs.find((s) => s.index === i)!.id
  assert.equal(at([]), 'upcoming')
  assert.equal(at([slug(1), slug(2)], slug(3)), 'upcoming')
  assert.equal(at([slug(12)]), 'optional')
  assert.equal(at([], slug(13)), 'optional', 'a learner already in S13 is past the anchor')
  assert.equal(at([], slug(26)), 'optional', 'phase 1 is still optional')
  // Defect guarded: a rule on index ("required after 26 sections done") would miss a learner who
  // jumped straight into the advanced level; the rule reads the phase of what they touched.
  assert.equal(at([], slug(27)), 'required')
  assert.equal(at([slug(30)]), 'required')
  assert.equal(at([slug(45)], slug(46), true), 'done')
})

test('the banner shows on S12, S13 and S27 only; the 49 other sections are untouched', () => {
  const shown = COURSE_SECTIONS.map((s) => [s.index, trackLinkFor(s.id, WEB_TRACK_PLACEMENT, false)] as const).filter(([, k]) => k)
  assert.deepEqual(shown, [[12, 'detour'], [13, 'detour'], [27, 'required']])
  assert.equal(trackLinkFor(WEB_TRACK_PLACEMENT.requiredBefore.id, WEB_TRACK_PLACEMENT, true), null, 'a finished track stops nagging')
  assert.equal(trackLinkFor('apis-sql-geo', WEB_TRACK_PLACEMENT, true), 'detour', 'the detour stays as a way back to the material')
})

// ---------------------------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------------------------

test('#ruta-web and #ruta-web/<module> open the track on both editions; no section may take the slug', () => {
  for (const isStatic of [true, false]) {
    assert.deepEqual(parseCourseHash('#ruta-web', COURSE_SECTIONS, isStatic), { view: 'webtrack' })
    assert.deepEqual(parseCourseHash('#ruta-web/modelo', COURSE_SECTIONS, isStatic), { view: 'webtrack' })
  }
  assert.equal(WEB_TRACK_HASH, WEB_TRACK.id, 'the router and the content must agree on the hash')
  assert.ok(!COURSE_SECTIONS.some((s) => s.id === WEB_TRACK_HASH), 'a section slug equal to the track hash would be unreachable')
  assert.equal(trackModuleFromHash('#ruta-web/modelo'), 'modelo')
  assert.equal(trackModuleFromHash('#ruta-web/nada'), null)
  assert.equal(trackModuleFromHash('#ruta-web'), null)
  assert.equal(trackModuleFromHash('#modelo'), null)
})

// ---------------------------------------------------------------------------------------------
// Content rules
// ---------------------------------------------------------------------------------------------

test('step ids are unique, stable-looking and prefixed by their module', () => {
  const seen = new Set<string>()
  for (const { module, step } of ALL_STEPS) {
    assert.match(step.id, /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, `step id ${step.id}`)
    assert.ok(step.id.startsWith(`${module}.`), `step ${step.id} lives in module ${module}; its id must start with "${module}."`)
    assert.ok(!seen.has(step.id), `duplicate step id ${step.id}`)
    seen.add(step.id)
  }
  assert.ok(seen.size >= 15, `expected at least 15 steps (floor), found ${seen.size}`)
})

test('a module leans only on sections taught before the detour starts', () => {
  const anchor = WEB_TRACK_PLACEMENT.recommendedAfter.index
  for (const m of WEB_TRACK.modules) {
    for (const slug of m.buildsOn) {
      const s = COURSE_SECTIONS.find((x) => x.id === slug)
      assert.ok(s, `module ${m.id} builds on "${slug}", which names no section`)
      // Defect guarded: a prerequisite from a later section is a concept the learner has not met.
      assert.ok(s.index <= anchor, `module ${m.id} builds on S${s.index} (${slug}), after the detour starts at S${anchor}`)
    }
  }
})

test('every guide link is https and names its destination', () => {
  for (const { step } of ALL_STEPS) {
    if (!step.guide) continue
    assert.match(step.guide.url, /^https:\/\//, `${step.id}: ${step.guide.url}`)
    assert.ok(!/^(aquí|aqui|here|link|enlace)$/i.test(step.guide.label.trim()), `${step.id}: link text must name the guide (WCAG 2.4.4)`)
  }
})

test('preview frames run nothing: an empty sandbox and no script in any preview', () => {
  for (const { step } of ALL_STEPS) {
    for (const p of step.previews ?? []) {
      const props = previewFrameProps(p)
      assert.equal(props.sandbox, '', `${step.id}: the sandbox must grant no permission (no allow-scripts)`)
      assert.ok(!/<script|on\w+=|javascript:/i.test(p.html), `${step.id}: preview "${p.title}" must not carry script`)
      assert.ok(props.srcDoc.includes(p.html))
    }
  }
})

test('each preview shows what its step prints: every table row in the picture is in the output', () => {
  let rows = 0
  for (const { step } of ALL_STEPS) {
    const printed = (step.code ?? []).map((c) => c.output ?? '').join('\n')
    for (const p of step.previews ?? []) {
      for (const row of p.html.match(/<tr>.*?<\/tr>/g) ?? []) {
        rows++
        // Defect guarded: the code changes and the picture keeps showing the old result.
        assert.ok(printed.includes(row), `${step.id}: preview "${p.title}" shows ${row}, which the code does not print`)
      }
    }
  }
  assert.ok(rows >= 6, `expected the previews to show at least 6 rows, found ${rows}`)
})

function python(): { bin: string; version: string } {
  for (const bin of ['.venv-content/bin/python', 'python3']) {
    const r = spawnSync(bin, ['-I', '-c', 'import sys; print("%d.%d" % sys.version_info[:2])'], { encoding: 'utf8' })
    if (r.status === 0) return { bin, version: r.stdout.trim() }
  }
  throw new Error('REFUSED: no Python interpreter (.venv-content/bin/python or python3) could run; the track snippets were not checked.')
}

test('every Python block runs and prints exactly its declared output', () => {
  const py = python()
  const [major, minor] = py.version.split('.').map(Number)
  assert.ok(major === 3 && minor >= 12, `REFUSED: ${py.bin} is Python ${py.version}; the track is written for 3.12 or later.`)
  let ran = 0
  for (const { step } of ALL_STEPS) {
    for (const c of step.code ?? []) {
      if (c.language !== 'python') continue
      assert.ok(c.output, `${step.id}/${c.title}: a Python block must declare what it prints`)
      const r = spawnSync(py.bin, ['-I', '-'], { input: c.code, encoding: 'utf8', timeout: 20_000 })
      assert.equal(r.status, 0, `${step.id}/${c.title} exited ${r.status} under ${py.bin} ${py.version}:\n${r.stderr}`)
      assert.equal(
        r.stdout.trimEnd(),
        c.output.trimEnd(),
        `${step.id}/${c.title}: the declared output differs from what the code prints. Paste the real output into src/lib/tracks/web/content.ts.`,
      )
      ran++
    }
  }
  assert.ok(ran >= 7, `expected at least 7 Python blocks, ran ${ran}`)
})

/** A DOM just big enough for app.js: header buttons, a tbody, aria-sort on the headers. */
function fakeTable(rows: string[][]) {
  const live = rows.map((cells) => ({ cells: cells.map((textContent) => ({ textContent })) }))
  const attrs: Record<string, string>[] = [{}, {}]
  const ths = attrs.map((a) => ({
    getAttribute: (k: string) => a[k] ?? null,
    setAttribute: (k: string, v: string) => void (a[k] = v),
    removeAttribute: (k: string) => void delete a[k],
  }))
  const clicks: (() => void)[] = []
  const buttons = ths.map((th, i) => ({ closest: () => th, addEventListener: (_e: string, f: () => void) => void (clicks[i] = f) }))
  const tbody = { get rows() { return live }, append: (...f: typeof live) => { live.length = 0; live.push(...f) } }
  const document = { querySelectorAll: (sel: string) => (sel === 'th button' ? buttons : ths), querySelector: () => tbody }
  return { document, clicks, attrs, column: (i: number) => live.map((r) => r.cells[i].textContent) }
}

test('app.js sorts numbers as numbers, text as text, toggles direction and marks one header', () => {
  const code = ALL_STEPS.flatMap(({ step }) => step.code ?? []).find((c) => c.title === 'app.js')?.code
  assert.ok(code, 'the sitio module must ship app.js')
  const t = fakeTable([['Sede A', '1250.00'], ['Bodega <Norte>', '980.50'], ['Sede C', '1430.25']])
  new Function('document', code)(t.document)
  t.clicks[1]()
  // Defect guarded: a text sort puts "1250.00" before "980.50".
  assert.deepEqual(t.column(1), ['980.50', '1250.00', '1430.25'])
  assert.deepEqual(t.attrs, [{}, { 'aria-sort': 'ascending' }])
  t.clicks[1]()
  assert.deepEqual(t.column(1), ['1430.25', '1250.00', '980.50'])
  assert.equal(t.attrs[1]['aria-sort'], 'descending')
  t.clicks[0]()
  assert.deepEqual(t.column(0), ['Bodega <Norte>', 'Sede A', 'Sede C'])
  assert.deepEqual(t.attrs, [{ 'aria-sort': 'ascending' }, {}], 'only the sorted column may carry aria-sort')
})

test('a JavaScript block with a top-level await is presented as console code, never as a page script', () => {
  for (const { step } of ALL_STEPS) {
    for (const c of step.code ?? []) {
      if (c.language !== 'javascript') continue
      // Defect guarded (research round, 25 Nov 2026): `await` outside a function is a SyntaxError
      // in a classic <script src>, so a learner who saves the block as a page script gets nothing.
      const topLevelAwait = c.code.split('\n').some((line) => /^(const|let|var)?\s*\w*\s*=?\s*await\b/.test(line.trim()))
      if (topLevelAwait) assert.match(c.title, /consola/, `${step.id}/${c.title}: top-level await only runs in the browser console; title it as console code`)
    }
  }
})

test('the knowledge map is a sound graph and names only modules the track has', async () => {
  const { readFileSync } = await import('node:fs')
  const g = JSON.parse(readFileSync('audit/tracks/web/graph.json', 'utf8')) as {
    nodes: { id: string; status: string; where: string }[]
    edges: { from: string; to: string }[]
    loose: { node: string }[]
    resolved?: { node: string; action: string }[]
  }
  const ids = new Set(g.nodes.map((n) => n.id))
  assert.equal(ids.size, g.nodes.length, 'duplicate node ids in graph.json')
  for (const e of g.edges) assert.ok(ids.has(e.from) && ids.has(e.to), `edge ${e.from} → ${e.to} names a missing node`)
  // Acyclic: Kahn's algorithm must consume every node.
  const indeg = new Map([...ids].map((id) => [id, 0]))
  for (const e of g.edges) indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
  const queue = [...ids].filter((id) => indeg.get(id) === 0)
  let seen = 0
  while (queue.length) {
    const id = queue.pop()!
    seen++
    for (const e of g.edges.filter((x) => x.from === id)) {
      indeg.set(e.to, indeg.get(e.to)! - 1)
      if (indeg.get(e.to) === 0) queue.push(e.to)
    }
  }
  assert.equal(seen, ids.size, 'graph.json has a cycle: a concept cannot be its own prerequisite')
  // Drift guarded: a module renamed in content.ts while the map keeps pointing at the old id.
  const modules = new Set(WEB_TRACK.modules.map((m) => m.id))
  for (const n of g.nodes.filter((x) => x.status === 'track')) {
    const m = /^modulo:([a-z-]+)/.exec(n.where)?.[1]
    assert.ok(m && modules.has(m), `node ${n.id} is taught in "${n.where}", which is not a module of the track`)
  }
  for (const l of [...g.loose, ...(g.resolved ?? [])]) assert.ok(ids.has(l.node), `loose/resolved entry ${l.node} names no node`)
  for (const r of g.resolved ?? []) assert.match(r.action, /^(REMOVE|REPHRASE|GLOSS|TEACH|DEFER)$/, `${r.node}: unknown action ${r.action}`)
})
