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
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { COURSE_SECTIONS } from '@/lib/course'
import { parseCourseHash, WEB_TRACK_HASH } from '@/lib/course/hash-route'
import { advanceFurthest, resolveTrackPlacement, trackLinkFor, trackLinkTitleKey, trackStanding, type PlacedSection } from '@/lib/tracks/placement'
import { previewFrameProps } from '@/lib/tracks/preview'
import {
  commitTrackStep,
  trackBackupKey,
  loadTrackFurthest,
  saveTrackFurthest,
  countTrackDone,
  loadTrackProgress,
  parseTrackProgress,
  saveTrackProgress,
  serializeTrackProgress,
  toggleTrackStep,
  isTrackComplete,
  trackProgressKey,
} from '@/lib/tracks/progress'
import { WEB_TRACK, WEB_TRACK_ANCHORS, WEB_TRACK_ID } from '@/lib/tracks/web/content'
import { WEB_TRACK_PLACEMENT, WEB_TRACK_STEP_IDS, trackModuleFromHash } from '@/lib/tracks/web/placed'
import { SETUP_PROGRESS_KEY } from '@/lib/setup/progress'
import { t } from '@/lib/i18n'

const COURSE_PROGRESS_KEY = 'python-ds-progress'
const ALL_STEPS = WEB_TRACK.modules.flatMap((m) => m.steps.map((s) => ({ module: m.id, step: s })))
/** Every code block a step shows, the hidden «Hazlo tú» solution included. */
const blocksOf = (step: (typeof ALL_STEPS)[number]['step']) => [...(step.code ?? []), ...(step.exercise ? [step.exercise.solution] : [])]

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
    for (const c of blocksOf(step)) {
      if (c.language !== 'python' || c.runtime === 'cloudflare') continue
      assert.ok(c.output, `${step.id}/${c.title}: a Python block must declare what it prints`)
      // A fresh, empty folder per block, as a learner's project folder: construir_sitio.py writes site/ there.
      const cwd = mkdtempSync(path.join(tmpdir(), 'ruta-web-'))
      const r = spawnSync(py.bin.includes('/') ? path.resolve(py.bin) : py.bin, ['-I', '-'], { input: c.code, encoding: 'utf8', timeout: 20_000, cwd })
      rmSync(cwd, { recursive: true, force: true })
      assert.equal(r.status, 0, `${step.id}/${c.title} exited ${r.status} under ${py.bin} ${py.version}:\n${r.stderr}`)
      assert.equal(
        r.stdout.trimEnd(),
        c.output.trimEnd(),
        `${step.id}/${c.title}: the declared output differs from what the code prints. Paste the real output into src/lib/tracks/web/content.ts.`,
      )
      ran++
    }
  }
  assert.ok(ran >= 24, `expected at least 24 Python blocks (18 worked examples, 6 solutions), ran ${ran}`)
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
    for (const c of blocksOf(step)) {
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

test('every module ends with a «Hazlo tú» practice whose solution is hidden, runnable and different from the worked example', () => {
  for (const m of WEB_TRACK.modules) {
    const last = m.steps[m.steps.length - 1]
    // Defect guarded: a module that only shows worked examples, so the learner never writes code.
    assert.ok(last.exercise, `module ${m.id} must end with a practice step (exercise), found ${last.id}`)
    assert.equal(last.exercise.solution.language, 'python', `${last.id}: the solution must be a Python block the test can run`)
    assert.ok(last.expect, `${last.id}: a practice needs a «Deberías ver» the learner can compare with`)
    const worked = m.steps.flatMap((s) => s.code ?? []).map((c) => c.code)
    assert.ok(!worked.includes(last.exercise.solution.code), `${last.id}: the solution repeats a worked example instead of transferring it`)
  }
})

// ---------------------------------------------------------------------------------------------
// State machines (audit/tracks/web/STATE_MACHINES.md): two tabs, and one standing across views
// ---------------------------------------------------------------------------------------------

function mapStore() {
  const m = new Map<string, string>()
  return { m, kv: { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) } }
}

test('two open tabs: a tick in one survives a tick from the other tab, whose copy is stale', () => {
  const { kv } = mapStore()
  // Both tabs loaded the empty record. Tab A ticks html.reparto; tab B, still holding the empty
  // record, ticks http.navegador. Defect guarded: B writes its whole stale copy and A's tick is lost.
  const a = commitTrackStep(kv, WEB_TRACK_ID, 'html.reparto', true)
  const b = commitTrackStep(kv, WEB_TRACK_ID, 'http.navegador', true)
  assert.ok(a.saved && b.saved)
  assert.deepEqual(loadTrackProgress(kv, WEB_TRACK_ID).done, ['html.reparto', 'http.navegador'])
  assert.deepEqual(b.progress.done, ['html.reparto', 'http.navegador'], 'the tab that saved last must show both ticks')
})

test('two open tabs: unticking in one tab does not resurrect or erase what the other changed', () => {
  const { kv } = mapStore()
  commitTrackStep(kv, WEB_TRACK_ID, 'html.reparto', true)
  commitTrackStep(kv, WEB_TRACK_ID, 'sitio.servir', true) // tab A
  commitTrackStep(kv, WEB_TRACK_ID, 'html.reparto', false) // tab B, which saw html.reparto ticked
  // The intent is the checkbox's new state, not a flip: a stale tab that shows a step unticked and
  // is clicked means "done", even if another tab already ticked it.
  commitTrackStep(kv, WEB_TRACK_ID, 'sitio.servir', true)
  assert.deepEqual(loadTrackProgress(kv, WEB_TRACK_ID).done, ['sitio.servir'])
})

test('a commit to a browser that refuses storage reports it and keeps the change in the page', () => {
  const refusing = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError') } }
  const r = commitTrackStep(refusing, WEB_TRACK_ID, 'html.reparto', true)
  assert.equal(r.saved, false)
  assert.deepEqual(r.progress.done, ['html.reparto'], 'the learner still sees the tick for this visit')
})

test('one standing everywhere: a learner who opened S27 sees "required" on the track page too, not only on S27', () => {
  const secs = liveSections()
  const s27 = WEB_TRACK_PLACEMENT.requiredBefore.id
  const opened = { completedSections: [], completedSubSteps: { [s27]: ['theory'] }, lastVisited: s27 }
  // Defect guarded: the track page has no current section, so a rule that read only completed
  // sections and the open one said "upcoming" there while S27's banner said "required".
  assert.equal(trackStanding(WEB_TRACK_PLACEMENT, secs, { ...opened, currentSectionId: null }, false), 'required')
  assert.equal(trackStanding(WEB_TRACK_PLACEMENT, secs, { completedSections: [], lastVisited: s27 }, false), 'required')
  assert.equal(trackStanding(WEB_TRACK_PLACEMENT, secs, { completedSections: [], completedSubSteps: { [s27]: [] } }, false), 'upcoming', 'an empty entry is not a visit')
})

test('the standing is a pure function of its inputs: every combination lands in exactly one state, and done always wins', () => {
  const secs = liveSections()
  const slugAt = (i: number) => secs.find((s) => s.index === i)!.id
  const positions = [[], [slugAt(12)], [slugAt(26)], [slugAt(27)], [slugAt(52)]]
  const seen = new Set<string>()
  for (const completed of positions) {
    for (const current of [null, slugAt(5), slugAt(13), slugAt(30)]) {
      for (const complete of [false, true]) {
        const s = trackStanding(WEB_TRACK_PLACEMENT, secs, { completedSections: completed, currentSectionId: current }, complete)
        seen.add(s)
        if (complete) assert.equal(s, 'done')
        // Never "upcoming" once the learner is past S12, never "optional" in phase 2 or later.
        const touchedIdx = [...completed, current].filter(Boolean).map((id) => secs.find((x) => x.id === id)!.index)
        const furthest = Math.max(0, ...touchedIdx)
        if (!complete && furthest >= 27) assert.equal(s, 'required', `furthest S${furthest}`)
        if (!complete && furthest > 12 && furthest < 27) assert.equal(s, 'optional', `furthest S${furthest}`)
      }
    }
  }
  assert.deepEqual([...seen].sort(), ['done', 'optional', 'required', 'upcoming'], 'every state is reachable')
})

test('a tick never destroys a stored record it cannot read: the record is copied to a backup key first', () => {
  const { kv, m: map } = mapStore()
  const key = trackProgressKey(WEB_TRACK_ID)
  // Defect guarded: commit read the corrupt record as empty and wrote over it, so a record written
  // by a newer version of the page (or damaged) was lost on the first tick.
  for (const foreign of ['{not json', JSON.stringify({ v: 2, done: { 'html.reparto': '2026-11-25' } })]) {
    map.clear()
    map.set(key, foreign)
    const r = commitTrackStep(kv, WEB_TRACK_ID, 'html.reparto', true, () => 1700)
    assert.equal(r.saved, true)
    assert.equal(map.get(trackBackupKey(WEB_TRACK_ID, 1700)), foreign, `the unreadable record ${foreign} must survive under the backup key`)
    assert.deepEqual(loadTrackProgress(kv, WEB_TRACK_ID).done, ['html.reparto'])
  }
  // A record this code wrote is not backed up on every tick.
  map.clear()
  commitTrackStep(kv, WEB_TRACK_ID, 'html.reparto', true, () => 1)
  commitTrackStep(kv, WEB_TRACK_ID, 'sitio.servir', true, () => 2)
  assert.deepEqual([...map.keys()], [key], 'no backup for a readable v1 record')
})

test('a banner never contradicts the track page: on S12 a learner already in the advanced level reads "still to do", not "optional"', () => {
  const kinds = ['detour', 'required'] as const
  const standings = ['upcoming', 'optional', 'required', 'done'] as const
  for (const kind of kinds) {
    for (const standing of standings) {
      const key = trackLinkTitleKey(kind, standing)
      const optionalWording = key === 'track.link.detour.title'
      // Defect guarded: S12 kept saying "Desvío opcional" while the track page said "Requerida".
      assert.ok(!(standing === 'required' && optionalWording), `${kind}/${standing} shows ${key}`)
      for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
        assert.notEqual(t(key, lang), key, `${key} has no ${lang} text`)
      }
    }
  }
  assert.equal(trackLinkTitleKey('detour', 'optional'), 'track.link.detour.title')
})

test('every section number written in the track prose still names the section it meant (renumbering drift)', () => {
  // The prose says "S12", "S41"... for the learner. Placement is by slug, but these words are not:
  // if sections are renumbered, "FastAPI en S41" would point at another lesson. Each number is
  // pinned here to the slug it meant on 25 Nov 2026; a new number in the prose must be added here.
  const meant: Record<number, string> = {
    1: 'setup', 2: 'basics', 7: 'text-unicode-regex', 8: 'files-ingestion', 10: 'modules-packaging-cli', 11: 'oop-domain',
    12: 'apis-sql-geo', 13: 'evidence-dashboard', 15: 'stdlib-deep', 21: 'fastapi', 27: 'async-concurrency',
    38: 'performance-extreme', 41: 'llm-finetuning', 42: 'graph-rag', 43: 'llmops', 45: 'iac',
  }
  const prose = [
    JSON.stringify(WEB_TRACK),
    ...(['es-PE', 'es-ES', 'en'] as const).flatMap((lang) =>
      ['track.standing.upcoming', 'track.standing.optional', 'track.standing.required', 'track.link.detour.body', 'track.link.required.body'].map((k) => t(k, lang)),
    ),
  ].join('\n')
  const numbers = new Set([...prose.matchAll(/\b(?:S|Secci[oó]n |Section )(\d{1,2})\b/g)].map((m) => Number(m[1])))
  assert.ok(numbers.size >= 6, `expected the prose to cite sections, found ${[...numbers]}`)
  for (const n of numbers) {
    assert.ok(meant[n], `the track prose cites section ${n}, which this test does not pin. Add ${n}: '<slug it means>' to "meant".`)
  }
  const drift = (sections: readonly { id: string; index: number }[]) =>
    [...numbers].flatMap((n) => {
      const now = sections.find((s) => s.index === n)
      return now?.id === meant[n] ? [] : [`section ${n} is now "${now?.id}", but the prose meant "${meant[n]}". Update the number in src/lib/tracks/web/content.ts (or i18n.ts) to the section's new number.`]
    })
  assert.deepEqual(drift(COURSE_SECTIONS), [])
  // Simulated drift: a section inserted before S12 shifts every later number by one.
  const shifted = COURSE_SECTIONS.map((s) => ({ id: s.id, index: s.index >= 12 ? s.index + 1 : s.index }))
  assert.ok(drift(shifted).some((m) => m.startsWith('section 12 ')), 'an insertion before S12 must be reported')
})

test('the standing does not forget S27 when the learner goes back to S12: the furthest section opened is a high-water mark', () => {
  const secs = liveSections()
  const slugAt = (i: number) => secs.find((s) => s.index === i)!.id
  const { kv } = mapStore()
  let furthest = loadTrackFurthest(kv, WEB_TRACK_ID)
  // The learner opens S12, then S27, then goes back to S12 and S05; then opens the track page.
  for (const open of [slugAt(12), slugAt(27), slugAt(12), slugAt(5)]) {
    const next = advanceFurthest(secs, furthest, open)
    if (next && next !== furthest) saveTrackFurthest(kv, WEB_TRACK_ID, next)
    furthest = loadTrackFurthest(kv, WEB_TRACK_ID)
  }
  assert.equal(furthest, slugAt(27), 'going back must not lower the mark')
  // Defect guarded (found in the browser): the course keeps only the last section opened (S05),
  // so the track page said "upcoming" after the learner had opened S27.
  const pos = { completedSections: [], lastVisited: slugAt(5), furthestSeen: furthest }
  assert.equal(trackStanding(WEB_TRACK_PLACEMENT, secs, pos, false), 'required')
  // A slug that disappeared (renamed section) is replaced by the next real one, never kept as a ghost.
  assert.equal(advanceFurthest(secs, 'gone-slug', slugAt(3)), slugAt(3))
  assert.equal(advanceFurthest(secs, slugAt(30), 'gone-slug'), slugAt(30))
  assert.equal(advanceFurthest(secs, slugAt(30), null), slugAt(30))
})

test('a learner who finished stays "done" when a later round adds steps; only an untick undoes it', () => {
  const { kv } = mapStore()
  const ids = [...WEB_TRACK_STEP_IDS]
  let last = { progress: loadTrackProgress(kv, WEB_TRACK_ID), saved: true }
  for (const id of ids) last = commitTrackStep(kv, WEB_TRACK_ID, id, true, Date.now, ids)
  assert.equal(isTrackComplete(last.progress, ids), true)
  // Simulated drift: two steps are added to the track after the learner finished.
  const grown = [...ids, 'html.nuevo', 'sitio.nuevo']
  const stored = loadTrackProgress(kv, WEB_TRACK_ID)
  // Defect guarded: "done" was "every current step ticked", so adding a step demoted every learner
  // who had finished, and S27 started telling them the track was required again.
  assert.equal(isTrackComplete(stored, grown), true, 'finished before the steps were added')
  assert.equal(trackLinkFor(WEB_TRACK_PLACEMENT.requiredBefore.id, WEB_TRACK_PLACEMENT, isTrackComplete(stored, grown)), null)
  // Ticking a new step keeps it; unticking any step clears "finished".
  assert.equal(isTrackComplete(commitTrackStep(kv, WEB_TRACK_ID, 'html.nuevo', true, Date.now, grown).progress, grown), true)
  const unticked = commitTrackStep(kv, WEB_TRACK_ID, ids[0], false, Date.now, grown).progress
  assert.equal(isTrackComplete(unticked, grown), false)
  assert.equal(isTrackComplete(loadTrackProgress(kv, WEB_TRACK_ID), grown), false, 'the untick is stored')
  // An unfinished learner is not "done" because of the new steps, and nothing invents the mark.
  assert.equal(isTrackComplete({ done: ids.slice(1) }, ids), false)
  assert.equal(parseTrackProgress(JSON.stringify({ v: 1, done: [], finished: 'yes' })).finished, undefined)
})

test('a section completed in another tab reaches this tab: the course store re-reads on that key only', async () => {
  const { followCourseProgressInOtherTabs } = await import('@/lib/progress-cross-tab')
  const listeners: ((e: { key: string | null; newValue: string | null }) => void)[] = []
  const target = {
    addEventListener: (_: string, fn: (e: { key: string | null; newValue: string | null }) => void) => void listeners.push(fn),
    removeEventListener: (_: string, fn: (e: { key: string | null; newValue: string | null }) => void) => void listeners.splice(listeners.indexOf(fn), 1),
  }
  let rereads = 0
  const stop = followCourseProgressInOtherTabs(target as never, () => { rereads += 1 })
  // Defect guarded: a tab left open kept old completion, so its track standing and sidebar disagreed
  // with the tab where the learner had just worked.
  const events = [
    { key: 'python-ds-progress', newValue: '{"state":{},"version":3}' },
    { key: 'python-ds-progress', newValue: null }, // removed in the other tab
    { key: null, newValue: null }, // localStorage.clear()
    { key: 'pyarcana:track:ruta-web:v1', newValue: '{}' },
    { key: 'pyarcana:theory-checkpoints', newValue: '{}' },
  ]
  for (const e of events) listeners.forEach((fn) => fn(e))
  assert.equal(rereads, 1, 'only a new course record re-reads; a removal would be written straight back, other keys are not ours')
  stop()
  assert.equal(listeners.length, 0, 'the listener is removed on unmount')
})

test('the menu has a web track entry beside Sesión 0, outside the list of the 52 sections', async () => {
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { createElement } = await import('react')
  const { Sidebar } = await import('@/components/course/Sidebar')
  const html = renderToStaticMarkup(
    createElement(Sidebar, { sections: COURSE_SECTIONS, activeSectionId: null, onSelectSection: () => {}, onHome: () => {}, view: 'webtrack' }),
  )
  const entry = html.indexOf('data-testid="sidebar-webtrack"')
  const session0 = html.indexOf('data-testid="sidebar-session0"')
  const list = html.indexOf('data-testid="sidebar-sections"')
  // Defects guarded: no way to reach the track except three banners; and an entry placed inside
  // the list would make screen readers announce 53 sections.
  assert.ok(entry > session0 && entry < list, `expected Sesión 0 < web track < section list, got ${session0} / ${entry} / ${list}`)
  assert.match(html, /<a[^>]*href="#ruta-web"[^>]*data-testid="sidebar-webtrack"/)
  assert.match(html, /data-testid="sidebar-webtrack"[^>]*aria-current="page"/, 'the entry is marked current on the track page')
  assert.equal((html.slice(list).match(/role="listitem"/g) ?? []).length, COURSE_SECTIONS.length)
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    for (const k of ['title', 'optional', 'required', 'done']) assert.notEqual(t(`sidebar.webTrack.${k}`, lang), `sidebar.webTrack.${k}`, `${lang} lacks sidebar.webTrack.${k}`)
  }
  assert.match(t('sidebar.webTrack.optional', 'es-PE'), /\{done\}.*\{total\}/)
})

test('one copy per page: a tick on the track page reaches the menu and the banner in the same tab at once', async () => {
  const { createTrackState } = await import('@/lib/tracks/shared-state')
  const { kv } = mapStore()
  const state = createTrackState(WEB_TRACK_ID, () => kv)
  const secs = liveSections()
  let menuRenders = 0
  let bannerRenders = 0
  const stopMenu = state.subscribe(() => { menuRenders += 1 })
  const stopBanner = state.subscribe(() => { bannerRenders += 1 })
  // Defect guarded (found in the browser): each component kept its own copy, and a page never
  // receives its own storage events, so the menu kept the old count until it remounted.
  state.setStep('html.reparto', true, WEB_TRACK_STEP_IDS)
  assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto'])
  assert.ok(menuRenders === 1 && bannerRenders === 1, `both readers notified once, got menu ${menuRenders}, banner ${bannerRenders}`)
  const before = state.getSnapshot()
  state.refresh()
  state.handleStorageEvent('pyarcana:theory-checkpoints')
  assert.equal(state.getSnapshot(), before, 'no change, same snapshot: React must not re-render in a loop')
  assert.equal(menuRenders, 1)
  state.visit(secs, WEB_TRACK_PLACEMENT.requiredBefore.id)
  assert.equal(state.getSnapshot().furthestSeen, WEB_TRACK_PLACEMENT.requiredBefore.id)
  assert.equal(menuRenders, 2, 'a visit to S27 reaches the menu')
  // Another tab writes: the event re-reads.
  commitTrackStep(kv, WEB_TRACK_ID, 'sitio.servir', true)
  state.handleStorageEvent(trackProgressKey(WEB_TRACK_ID))
  assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto', 'sitio.servir'])
  stopMenu(); stopBanner()
})

/** Every passage the learner reads on the track, in reading order, with where it is. */
function trackProse(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = []
  const add = (where: string, text?: string) => void (text && out.push({ where, text }))
  add('summary', WEB_TRACK.summary)
  for (const m of WEB_TRACK.modules) {
    add(`${m.id}.goal`, m.goal)
    // Paragraphs are read in sequence, so D13 is checked across their boundaries (Codex, PR #208).
    add(`${m.id}.intro`, (Array.isArray(m.intro) ? m.intro : [m.intro]).join(' '))
    for (const st of m.steps) {
      add(`${st.id}.body`, st.body.join(' '))
      st.table?.rows.forEach((r, i) => r.forEach((c, j) => add(`${st.id}.table${i}.${j}`, c)))
      add(`${st.id}.expect`, st.expect)
      st.fixes?.forEach((f, i) => { add(`${st.id}.fix${i}`, f.symptom); f.steps.forEach((x, j) => add(`${st.id}.fix${i}.${j}`, x)) })
      add(`${st.id}.hint`, st.exercise?.hint)
    }
  }
  return out
}

function proseSentences(text: string): string[] {
  const plain = text.replace(/`[^`]*`/g, 'X').replace(/\*\*/g, '')
  return plain.split(/(?<=[.?!])\s+(?=[¿¡«A-ZÁÉÍÓÚÑX(])/).map((x) => x.trim()).filter(Boolean)
}

test('writing rules D1 and D13 hold on every passage of the track: 32 words at most, never two short sentences in a row', () => {
  // Defect guarded: the review on 25 Nov found 14 sentences over 32 words and a run of three short
  // ones; scripts/prose_quality_audit.py does not read the track, so nothing stopped them.
  const problems: string[] = []
  for (const { where, text } of trackProse()) {
    const lens = proseSentences(text).map((x) => x.split(/\s+/).length)
    lens.forEach((n, i) => n > 32 && problems.push(`${where}: sentence ${i + 1} has ${n} words (D1: at most 32)`))
    // Codex (PR #208): a two-sentence table cell was skipped; a pair is a run too.
    if (lens.length > 1) lens.slice(1).forEach((n, i) => n < 15 && lens[i] < 15 && problems.push(`${where}: sentences ${i + 1}-${i + 2} are ${lens[i]} and ${n} words (D13)`))
  }
  assert.deepEqual(problems, [], `split or join these passages in src/lib/tracks/web/content.ts (audit/fixer/writing_rules.md)`)
})

test('a glossary term taught after S12 is explained where the track first names it (concept order)', async () => {
  const { GLOSSARY_TERMS } = await import('@/lib/glossary/terms')
  const anchor = WEB_TRACK_PLACEMENT.recommendedAfter.index
  const indexOf = (id: string) => COURSE_SECTIONS.find((x) => x.id === id)?.index ?? Infinity
  const prose = trackProse()
  const problems: string[] = []
  let checked = 0
  for (const term of GLOSSARY_TERMS) {
    if (indexOf(term.firstSectionId) <= anchor) continue
    const names = [...new Set([term.term, ...term.aliases])].filter((n) => n.length > 2)
    const rx = new RegExp(`(?<![\\w-])(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w-])`, 'i')
    const first = prose.find((p) => rx.test(p.text.replace(/`[^`]*`/g, ' ')))
    if (!first) continue
    checked += 1
    // Glossed: the name is followed by an apposition («FastAPI, la biblioteca…») or a parenthesis.
    const name = first.text.replace(/`[^`]*`/g, ' ').match(rx)![1]
    const glossed = new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\*\\*)?(,\\s+(la|el|los|las|un|una)\\s|\\s*\\()`, 'i').test(first.text)
    if (!glossed) problems.push(`${term.id} is taught in ${term.firstSectionId} (S${indexOf(term.firstSectionId)}), but ${first.where} names it without explaining it`)
  }
  // Defect guarded: FastAPI (S41) and Jinja were named with no explanation; concept_map.py reads
  // only the 52 sections, so the track was invisible to it.
  assert.ok(checked >= 1, 'expected the track to name at least one term taught later (FastAPI); the matcher may be broken')
  assert.deepEqual(problems, [], 'gloss the term at its first mention, as an apposition or in parentheses')
})

test('a browser that refuses storage keeps every tick of this visit, not only the last one', async () => {
  const { createTrackState } = await import('@/lib/tracks/shared-state')
  let refusing = true
  const m = new Map<string, string>()
  const kv = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { if (refusing) throw new Error('QuotaExceededError'); m.set(k, v) } }
  const state = createTrackState(WEB_TRACK_ID, () => kv)
  const stop = state.subscribe(() => {})
  // Defect guarded (Codex review, PR #196): each tick was rebuilt from storage, which held nothing,
  // so ticking html.reparto and then http.navegador left only http.navegador.
  state.setStep('html.reparto', true, WEB_TRACK_STEP_IDS)
  state.setStep('http.navegador', true, WEB_TRACK_STEP_IDS)
  assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto', 'http.navegador'])
  assert.equal(state.getSnapshot().saveFailed, true)
  state.handleStorageEvent(trackProgressKey(WEB_TRACK_ID))
  assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto', 'http.navegador'], 'a storage event must not wipe the unsaved ticks')
  state.setStep('html.reparto', false, WEB_TRACK_STEP_IDS)
  assert.deepEqual(state.getSnapshot().progress.done, ['http.navegador'], 'an untick works in memory too')
  // Storage comes back: the next tick saves everything the page holds.
  refusing = false
  assert.equal(state.setStep('sitio.servir', true, WEB_TRACK_STEP_IDS), true)
  assert.deepEqual(loadTrackProgress(kv, WEB_TRACK_ID).done, ['http.navegador', 'sitio.servir'])
  assert.equal(state.getSnapshot().saveFailed, false)
  stop()
})

test('unsaved ticks survive opening a section, and a retry still never overwrites an unreadable record without a backup', async () => {
  const { createTrackState } = await import('@/lib/tracks/shared-state')
  const key = trackProgressKey(WEB_TRACK_ID)
  // Case 1 (Codex, PR #196): storage refuses every write; opening a section re-read storage and
  // dropped the ticks of this visit.
  {
    const m = new Map<string, string>()
    const kv = { getItem: (k: string) => m.get(k) ?? null, setItem: () => { throw new Error('QuotaExceededError') } }
    const state = createTrackState(WEB_TRACK_ID, () => kv)
    const stop = state.subscribe(() => {})
    state.setStep('html.reparto', true, WEB_TRACK_STEP_IDS)
    state.visit(liveSections(), WEB_TRACK_PLACEMENT.recommendedAfter.id)
    assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto'], 'visiting a section must not drop the unsaved tick')
    stop()
  }
  // Case 2 (Codex, PR #196): an unreadable record whose backup cannot be written. The first tick
  // refused to overwrite it; the retry path wrote straight over it on the second tick.
  {
    const foreign = JSON.stringify({ v: 2, done: { 'html.reparto': '2026-11-25' } })
    const m = new Map<string, string>([[key, foreign]])
    const kv = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { if (k.includes(':unreadable:')) throw new Error('QuotaExceededError'); m.set(k, v) } }
    const state = createTrackState(WEB_TRACK_ID, () => kv)
    const stop = state.subscribe(() => {})
    state.setStep('html.reparto', true, WEB_TRACK_STEP_IDS)
    state.setStep('http.navegador', true, WEB_TRACK_STEP_IDS)
    assert.equal(m.get(key), foreign, 'the unreadable record must survive every click while it has no backup')
    assert.deepEqual(state.getSnapshot().progress.done, ['html.reparto', 'http.navegador'], 'the ticks are still shown for this visit')
    assert.equal(state.getSnapshot().saveFailed, true)
    stop()
  }
})

test('a tab whose saves failed retries its own intents on the latest record, keeping what another tab saved meanwhile', async () => {
  const { createTrackState } = await import('@/lib/tracks/shared-state')
  const m = new Map<string, string>()
  let aRefused = true
  const kvA = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { if (aRefused) throw new Error('QuotaExceededError'); m.set(k, v) } }
  const kvB = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }
  const a = createTrackState(WEB_TRACK_ID, () => kvA)
  const b = createTrackState(WEB_TRACK_ID, () => kvB)
  const stopA = a.subscribe(() => {})
  const stopB = b.subscribe(() => {})
  // Codex's case (PR #196): A fails to tick html.reparto, B saves http.navegador, A then saves
  // sitio.servir. Defect guarded: A wrote its whole stale copy and erased B's tick.
  a.setStep('html.reparto', true, WEB_TRACK_STEP_IDS)
  b.setStep('http.navegador', true, WEB_TRACK_STEP_IDS)
  a.handleStorageEvent(trackProgressKey(WEB_TRACK_ID))
  assert.deepEqual([...a.getSnapshot().progress.done].sort(), ['html.reparto', 'http.navegador'], 'A shows its unsaved tick and B\'s saved one')
  aRefused = false
  assert.equal(a.setStep('sitio.servir', true, WEB_TRACK_STEP_IDS), true)
  assert.deepEqual(loadTrackProgress(kvB, WEB_TRACK_ID).done, ['http.navegador', 'html.reparto', 'sitio.servir'])
  // After a successful save nothing is pending: a later untick in B is not undone by A.
  b.setStep('html.reparto', false, WEB_TRACK_STEP_IDS)
  a.handleStorageEvent(trackProgressKey(WEB_TRACK_ID))
  assert.deepEqual(a.getSnapshot().progress.done, ['http.navegador', 'sitio.servir'])
  assert.equal(a.getSnapshot().saveFailed, false)
  stopA(); stopB()
})

test('a completion re-read from another tab is not counted as this tab\'s own (no second section_complete, no survey)', async () => {
  const { followCourseProgressInOtherTabs } = await import('@/lib/progress-cross-tab')
  const { isApplyingRemote } = await import('@/lib/cloud/progress-adapter')
  const { useProgressStore } = await import('@/lib/progress-store')
  const store = new Map<string, string>()
  ;(globalThis as { window?: unknown }).window ??= {}
  const w = globalThis.window as unknown as { localStorage?: unknown }
  const previous = w.localStorage
  w.localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) }
  try {
    const seen: boolean[] = []
    const stopSub = useProgressStore.subscribe((next, prev) => {
      if (next.completedSections !== prev.completedSections) seen.push(isApplyingRemote())
    })
    const listeners: ((e: { key: string | null; newValue: string | null }) => void)[] = []
    const stop = followCourseProgressInOtherTabs({ addEventListener: (_: string, fn: never) => void listeners.push(fn), removeEventListener: () => {} } as never)
    // Another tab wrote a record with one more completed section.
    const raw = { state: { ...useProgressStore.getState(), completedSections: ['setup'] }, version: (useProgressStore.persist.getOptions().version ?? 0) }
    store.set('python-ds-progress', JSON.stringify(raw))
    listeners.forEach((fn) => fn({ key: 'python-ds-progress', newValue: store.get('python-ds-progress')! }))
    await new Promise((r) => setTimeout(r, 0))
    // Defect guarded (Codex, PR #196): the re-read ran outside the guard, so SurveyPrompt counted
    // the other tab's completion again here, once per open tab.
    assert.deepEqual(seen, [true], 'the re-read changed completedSections exactly once, under the remote guard')
    assert.deepEqual(useProgressStore.getState().completedSections, ['setup'])
    stop(); stopSub()
  } finally {
    w.localStorage = previous
    useProgressStore.setState({ completedSections: [] })
  }
})

// ---------------------------------------------------------------------------------------------
// The prototype module: D1, quotas and the Worker's code, held to what the prose promises
// ---------------------------------------------------------------------------------------------

const protoStep = (id: string) => {
  const s = ALL_STEPS.find((x) => x.step.id === id)?.step
  assert.ok(s, `step ${id} is missing from src/lib/tracks/web/content.ts; the prototype tests read it`)
  return s
}
const protoCode = (id: string, title: string) => {
  const c = blocksOf(protoStep(id)).find((x) => x.title === title)
  assert.ok(c, `${id} has no block titled ${title}`)
  return c
}

test('a Worker file is compiled, not run, and the run loop skips only those (runtime "cloudflare")', () => {
  const py = python()
  const workers = ALL_STEPS.flatMap(({ step }) => blocksOf(step).filter((c) => c.runtime === 'cloudflare').map((c) => ({ step, c })))
  assert.ok(workers.length >= 1, 'expected the D1 step to show its Worker file (runtime "cloudflare")')
  for (const { step, c } of workers) {
    assert.equal(c.language, 'python', `${step.id}/${c.title}: runtime "cloudflare" is for Python Worker files`)
    // Defect guarded: a Worker file is exempt from the run, so a typo in it would ship unseen.
    const r = spawnSync(py.bin, ['-I', '-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: c.code, encoding: 'utf8' })
    assert.equal(r.status, 0, `${step.id}/${c.title} does not parse as Python:\n${r.stderr}`)
    assert.ok(/from workers import/.test(c.code), `${step.id}/${c.title}: runtime "cloudflare" must import workers; otherwise run it like any other block`)
    assert.equal(c.output, undefined, `${step.id}/${c.title}: a Worker file cannot declare a printed output the unit test never checks`)
  }
})

test('the migration, the Worker query and «Deberías ver» agree: the index is used, the rows match, an injected sede returns nothing', () => {
  const migration = protoCode('prototipo.configurar', 'migrations/0001_inicial.sql').code
  const entry = protoCode('prototipo.worker-d1', 'src/entry.py').code
  const query = /prepare\(\s*"([^"]+)"\s*\)/.exec(entry)?.[1]
  assert.ok(query, 'src/entry.py lost its prepare("...") query; this test runs it against the migration')
  // Defect guarded: SQL built by pasting text (S12's injection) instead of a ? bound with bind().
  assert.ok(query.includes('?') && /\.bind\(/.test(entry), 'the Worker query must use ? and bind()')
  assert.ok(!/f"[^"]*(SELECT|INSERT|UPDATE|DELETE)/i.test(entry), 'the Worker builds SQL with an f-string')
  const script = `
import json, sqlite3, sys
con = sqlite3.connect(":memory:")
con.executescript(sys.argv[1])
q = sys.argv[2]
plan = [r[3] for r in con.execute("EXPLAIN QUERY PLAN " + q, ("SED-01",))]
rows = [{"id": a, "monto": b} for a, b in con.execute(q, ("SED-01",))]
inj = con.execute(q, ("SED-01' OR 1=1--",)).fetchall()
print(json.dumps({"plan": plan, "rows": json.dumps(rows), "inj": inj}))
`
  const py = python()
  const r = spawnSync(py.bin, ['-I', '-c', script, migration, query], { encoding: 'utf8' })
  assert.equal(r.status, 0, `the migration or the query fails in SQLite:\n${r.stderr}`)
  // rows: printed by Python's json.dumps, the same separators the Worker's Response.json uses
  const out = JSON.parse(r.stdout) as { plan: string[]; rows: string; inj: unknown[] }
  // Defect guarded: the migration drops the index, so the API the step deploys scans the table.
  assert.ok(out.plan.some((p) => /USING (COVERING )?INDEX idx_ventas_sede/.test(p)), `the Worker query does not use idx_ventas_sede: ${out.plan.join(' | ')}`)
  const expect = protoStep('prototipo.worker-d1').expect ?? ''
  assert.ok(expect.includes(`"ventas": ${out.rows}`), `«Deberías ver» must show the rows the migration gives for SED-01: ${out.rows}`)
  assert.deepEqual(out.inj, [], 'an injected sede must return no rows')
})

test('the quota numbers in the prose, the table and the calculator are the same numbers', () => {
  const step = protoStep('prototipo.cuotas')
  const calc = protoCode('prototipo.cuotas', 'cuota_diaria.py').code
  const limit = Number(/LIMITE_GRATIS = ([\d_]+)/.exec(calc)?.[1].replace(/_/g, ''))
  const row = step.table?.rows.find((r) => r[0] === 'Filas leídas en D1')
  assert.ok(row, 'the quota table lost its "Filas leídas en D1" row')
  // Defect guarded (drift): a round updates Cloudflare's limit in the table and forgets the code, or
  // the reverse, so the calculator tells the learner the wrong day their prototype stops.
  const millions = Number(/^(\d+) millones/.exec(row[1])?.[1])
  assert.equal(limit, millions * 1_000_000, `cuota_diaria.py uses ${limit}, the table says "${row[1]}"`)
  const rows = Number(/\("sin índice", ([\d_]+)\)/.exec(calc)?.[1].replace(/_/g, ''))
  const scanned = /filas revisadas (\d+), plan: SCAN/.exec(protoCode('prototipo.indices', 'filas_leidas.py').output ?? '')?.[1]
  assert.equal(String(rows), scanned, 'the calculator must multiply the rows the index step measured without an index')
  // Simulated drift: a future limit of 10 million in the table must make the comparison fail.
  assert.notEqual(limit, 10 * 1_000_000, 'sanity: the simulated drift value must differ from today')
})

test('every SQLite plan the prose quotes is one the code prints (EXPLAIN QUERY PLAN wording drift)', () => {
  // Defect guarded: SQLite rewords plans between versions ("SCAN TABLE ventas" before 3.36); a
  // «Deberías ver» quoting the old wording would send the learner looking for a line that never appears.
  for (const id of ['prototipo.indices', 'prototipo.practica']) {
    const s = protoStep(id)
    const printed = blocksOf(s).map((c) => c.output ?? '').join('\n')
    const quoted = [...(s.expect ?? '').matchAll(/`((?:SCAN|SEARCH|USE TEMP)[^`]*)`/g)].map((m) => m[1])
    assert.ok(quoted.length >= 1, `${id}: «Deberías ver» should quote the plan line the learner compares with`)
    for (const q of quoted) assert.ok(printed.includes(q), `${id}: «Deberías ver» quotes \`${q}\`, which the code does not print`)
  }
})

test('the prototype module closes the deploy part: it comes right after despliegue and before modelo', () => {
  const ids = WEB_TRACK.modules.map((m) => m.id)
  // Defect guarded: the owner asked for the runbook-based steps "in the last part of the deploy
  // track"; a module placed after modelo would teach D1 before the learner has published anything.
  assert.equal(ids.indexOf('prototipo'), ids.indexOf('despliegue') + 1, `module order is ${ids.join(', ')}`)
  const said = ALL_STEPS.find((x) => x.step.id === 'despliegue.python-servidor')?.step.body.join(' ') ?? ''
  assert.ok(/módulo siguiente/.test(said), 'despliegue.python-servidor must point to the next module instead of saying the detour stops at static sites')
})

test('a term the track defines in bold is not used earlier in the same module (A1: explain at first use)', () => {
  // Defect guarded (Codex, PR #208): the first prototipo table offered «vista previa» and
  // «producción» as choices four steps before prototipo.entornos defined them.
  const problems: string[] = []
  for (const m of WEB_TRACK.modules) {
    // The goal is the module's promise, shown above the intro, so it may name what the intro defines.
    const ordered = trackProse().filter((p) => p.where.startsWith(`${m.id}.`) && p.where !== `${m.id}.goal`)
    ordered.forEach((p, i) => {
      for (const [, term] of p.text.matchAll(/\*\*([^*]{3,40})\*\*/g)) {
        if (term.includes('→')) continue // a menu path in bold is a UI label, not a definition
        const rx = new RegExp(`(?<![\\wáéíóúñ])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\wáéíóúñ])`, 'i')
        const before = [...ordered.slice(0, i).map((x) => x.text), p.text.slice(0, p.text.indexOf(`**${term}**`))]
          .map((x) => x.replace(/`[^`]*`/g, ' '))
        const k = before.findIndex((x) => rx.test(x))
        if (k >= 0) problems.push(`${m.id}: «${term}» is defined in ${p.where} but already used in ${k < i ? ordered[k].where : p.where}`)
      }
    })
  }
  assert.deepEqual(problems, [], 'define the term where it first appears, or describe the idea without the label until it is defined')
})

// ---------------------------------------------------------------------------------------------
// Explained and exemplified (owner, 25 Nov 2026; docs/agents/lesson-writing.md §1): every config
// field and every line of the Worker is explained, and every warning has a block that runs.
// ---------------------------------------------------------------------------------------------

/** wrangler.jsonc as data: JSONC is JSON that allows // comments. */
function wranglerConfig(): Record<string, unknown> {
  const text = protoCode('prototipo.configurar', 'wrangler.jsonc').code.replace(/^\s*\/\/.*$/gm, '')
  return JSON.parse(text) as Record<string, unknown>
}

/** Every field path in the config, arrays of objects written as `[]`: d1_databases[].binding. */
function fieldPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    const objects = value.filter((v) => v && typeof v === 'object')
    return objects.length ? objects.flatMap((v) => fieldPaths(v, `${prefix}[]`)) : [prefix]
  }
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => fieldPaths(v, prefix ? `${prefix}.${k}` : k))
  return [prefix]
}

test('every field of wrangler.jsonc is explained in the configurar table (no config line left unexplained)', () => {
  // Defect guarded (owner, 25 Nov): the first draft explained wrangler.jsonc as "the file that says
  // which folder to publish" and added main, compatibility_flags, d1_databases, binding and
  // database_id with no word on any of them.
  const table = protoStep('prototipo.configurar').table
  assert.ok(table, 'prototipo.configurar lost its table of wrangler.jsonc fields')
  const explained = new Set(table.rows.map((r) => r[0].replace(/`/g, '')))
  const leaves = [...new Set(fieldPaths(wranglerConfig()))]
  assert.ok(leaves.length >= 9, `expected at least 9 fields in wrangler.jsonc, found ${leaves.join(', ')}`)
  const missing = leaves.filter((p) => !explained.has(p))
  assert.deepEqual(missing, [], `explain these fields in the prototipo.configurar table: ${missing.join(', ')}`)
  // Simulated drift: a field added to the config without a row must be reported.
  const drifted = fieldPaths({ ...wranglerConfig(), observability: { enabled: true } }).filter((p) => !explained.has(p))
  assert.ok(drifted.includes('observability.enabled'), 'sanity: an unexplained field added to the config must be caught')
})

test('every binding the Worker uses is declared in wrangler.jsonc, and every declared binding is used', () => {
  // Defect guarded (found 25 Nov in pywrangler dev): entry.py called self.env.ASSETS, but the
  // config declared no assets binding, so any path that was neither the API nor a file crashed
  // with a 500 (AttributeError: ASSETS) instead of a 404.
  const cfg = wranglerConfig() as { assets?: { binding?: string }; d1_databases?: { binding: string }[] }
  const declared = [cfg.assets?.binding, ...(cfg.d1_databases ?? []).map((d) => d.binding)].filter(Boolean).sort()
  const entry = protoCode('prototipo.worker-d1', 'src/entry.py').code
  const used = [...new Set([...entry.matchAll(/self\.env\.([A-Z_][A-Z0-9_]*)/g)].map((m) => m[1]))].sort()
  assert.deepEqual(declared, used, `wrangler.jsonc declares [${declared}] and src/entry.py uses self.env.[${used}]; they must match`)
})

test('every name src/entry.py imports or calls is explained in the worker-d1 line table', () => {
  // Defect guarded (owner, 25 Nov): class Default(WorkerEntrypoint), self.env.DB and Response.json
  // are not self-explanatory to someone who knows only S01–S12.
  const entry = protoCode('prototipo.worker-d1', 'src/entry.py').code
  const table = protoStep('prototipo.worker-d1').table
  assert.ok(table, 'prototipo.worker-d1 lost its table of entry.py lines')
  const explained = table.rows.map((r) => r.join(' ')).join(' ')
  const imported = [...entry.matchAll(/^from \S+ import (.+)$/gm)].flatMap((m) => m[1].split(',').map((x) => x.trim()))
  // Attributes and calls specific to Workers and D1; dict.get and list indexing are S06.
  const attrs = [...entry.matchAll(/\.(prepare|bind|all|results|meta|rows_read|fetch|json|env|url|query)\b/g)].map((m) => m[1])
  const names = [...new Set([...imported, 'Default', ...attrs.filter((a) => a !== 'meta')])]
  const missing = names.filter((n) => !new RegExp(`\\b${n}\\b`).test(explained))
  assert.ok(names.length >= 12, `expected to check at least 12 names in entry.py, found ${names.join(', ')}`)
  assert.deepEqual(missing, [], `the worker-d1 table does not explain: ${missing.join(', ')}`)
})

test('the request diagram names the same file, bindings, folder and database as the config', () => {
  // Defect guarded (drift): a round renames the binding or the folder in wrangler.jsonc and the
  // diagram keeps the old name, so the picture teaches a Worker that does not exist.
  const cfg = wranglerConfig() as { main: string; assets: { directory: string; binding: string }; d1_databases: { binding: string; database_name: string }[] }
  const diagram = protoCode('prototipo.configurar', 'flujo_de_una_peticion.txt').code
  const entry = protoCode('prototipo.worker-d1', 'src/entry.py').code
  const apiPath = /url\.path != "([^"]+)"/.exec(entry)?.[1]
  assert.ok(apiPath, 'src/entry.py no longer compares url.path with the API route; this test reads it')
  const names = [cfg.main, cfg.assets.directory, `"binding": "${cfg.assets.binding}"`, ...cfg.d1_databases.flatMap((d) => [`"binding": "${d.binding}"`, d.database_name]), apiPath]
  const missing = names.filter((n) => !diagram.includes(n))
  assert.deepEqual(missing, [], `flujo_de_una_peticion.txt does not name: ${missing.join(', ')}`)
})

test('every warning in the prototype module has a block that runs the mistake and its correction (B8)', () => {
  // Defect guarded (owner, 25 Nov): «pide en una sola consulta con JOIN» and «crea índices… y no
  // para todas» were warnings with nothing that showed the cost.
  const warnings: [string, RegExp, string][] = [
    ['prototipo.indices', /columna sin índice revisa la tabla entera/, 'filas_leidas.py'],
    ['prototipo.cuotas', /y no para todas/, 'escrituras.py'],
    ['prototipo.paginar', /LIMIT 20 OFFSET 5000/, 'paginar.py'],
    ['prototipo.paginar', /en lugar de una consulta por cada fila/, 'una_consulta.py'],
    // Content editor review, 25 Nov: the composite index, «solo agrega», the token and the package check.
    ['prototipo.indices', /USE TEMP B-TREE FOR ORDER BY/, 'indice_compuesto.py'],
    ['prototipo.lista', /una migración solo agrega/, 'migracion_que_borra.py'],
    ['prototipo.ia', /permiso mínimo/, 'alcance_minimo.py'],
    ['prototipo.ia', /inventan nombres de paquetes/, 'nombre_parecido.py'],
    // Codex, PR #208: the .dev.vars warning had only the correct setup.
    ['prototipo.entornos', /nunca se sube a Git/, 'dev_vars_en_git.py'],
  ]
  for (const [id, said, title] of warnings) {
    const s = protoStep(id)
    const body = [...s.body, ...(s.table?.rows.flat() ?? [])].join(' ')
    assert.match(body, said, `${id}: the warning ${said} is gone; update this list if it moved`)
    const block = protoCode(id, title)
    const e = block.code.indexOf('# Error'), c = block.code.indexOf('# Corrección')
    assert.ok(e >= 0 && c > e, `${id}/${title}: expected a "# Error" block followed by a "# Corrección" block`)
    assert.ok((block.output ?? '').trim().split('\n').length >= 2, `${id}/${title}: the output must show both the mistake and the correction`)
  }
})

test('every number «Deberías ver» quotes in cuotas and paginar matches the output line of the case it names', () => {
  // Defect guarded (drift): the prose quotes 227 pages while the code prints 228. Codex (PR #208)
  // showed the first version accepted a number from the other case (three indexes quoted with the
  // one-index figures), so each quoted claim is tied to the output line of its own case.
  const norm = (x: string) => x.replace(/[,_]/g, '')
  const claims: [string, RegExp, string][] = [
    ['prototipo.cuotas', /Sin índice, la cuota del día se acaba en la visita ([\d,]+)/, 'sin índice:'],
    ['prototipo.cuotas', /con índice alcanza para ([\d,]+) visitas/, 'con índice:'],
    ['prototipo.cuotas', /Con tres índices, la carga escribe ([\d,]+) filas y ocupa (\d+) páginas/, 'tres índices:'],
    ['prototipo.cuotas', /con uno, ([\d,]+) filas y (\d+) páginas/, 'un índice:'],
    ['prototipo.paginar', /`OFFSET` revisa (\d+) filas/, 'OFFSET:'],
    ['prototipo.paginar', /paginación por clave revisa (\d+)/, 'después del id'],
    ['prototipo.paginar', /cuesta (\d+) consultas, una por fila/, 'una consulta por fila:'],
    ['prototipo.paginar', /y (\d+) con `JOIN`/, 'con JOIN:'],
  ]
  const check = (expect: string, lines: string[]) => claims.flatMap(([id, rx, prefix]) => {
    const m = rx.exec(expect.includes(id) ? expect.split(id)[1] : expect)
    if (!m) return [`${id}: «Deberías ver» no longer says ${rx}; update this list if it was reworded`]
    const line = lines.find((l) => l.startsWith(`${id}|${prefix}`))
    if (!line) return [`${id}: no output line starts with "${prefix}"`]
    return m.slice(1).filter((n) => !new RegExp(`(?<!\\d)${norm(n)}(?!\\d)`).test(norm(line))).map((n) => `${id}: «Deberías ver» quotes ${n} for "${prefix}", but that line prints: ${line.split('|')[1]}`)
  })
  const ids = [...new Set(claims.map((c) => c[0]))]
  const expect = ids.map((id) => `${id}${protoStep(id).expect ?? ''}`).join('\n')
  const lines = ids.flatMap((id) => blocksOf(protoStep(id)).flatMap((c) => (c.output ?? '').split('\n').map((l) => `${id}|${l}`)))
  assert.deepEqual(check(expect, lines), [], 'make «Deberías ver» quote the numbers of the case it names')
  // Negative control: the three-index claim quoted with the one-index figures must be reported.
  const swapped = expect.replace('escribe 40,000 filas y ocupa 227 páginas', 'escribe 20,000 filas y ocupa 131 páginas')
  assert.notEqual(swapped, expect, 'sanity: the negative control no longer finds the sentence it swaps')
  assert.ok(check(swapped, lines).length >= 2, 'sanity: quoting one case with the other case\'s numbers must be caught')
})

test('the injection example hides a command that the approval row tells the learner to stop', () => {
  // Defect guarded: an injection described only in words. The README block must hide the command
  // inside an HTML comment, and every dangerous part of it must be one the table says to approve.
  const readme = protoCode('prototipo.ia', 'README.md').code
  const hidden = /<!--([\s\S]*?)-->/.exec(readme)?.[1] ?? ''
  assert.match(hidden, /DROP TABLE/, 'the hidden comment in README.md must carry the destructive command')
  assert.ok(!readme.replace(/<!--[\s\S]*?-->/, '').includes('DROP'), 'the command must be only inside the comment, where a rendered page hides it')
  const approve = protoStep('prototipo.ia').table?.rows.find((r) => /Aprueba tú/.test(r[0]))?.[0] ?? ''
  for (const part of ['DROP', '--remote']) assert.ok(approve.includes(part) && hidden.includes(part), `the approval row and the hidden command must both name ${part}`)
})

test('run in order, the entornos blocks leave the terminal in the Worker folder before pywrangler or .dev.vars', () => {
  // Defect guarded (Codex, PR #208): vercel_entornos.sh ends inside site/, so secretos.sh created
  // site/.dev.vars, which pywrangler dev never reads (it must sit beside wrangler.jsonc).
  const depthAfter = (code: string, start: number) => code.split('\n').reduce((d, line) => {
    const to = /^\s*cd\s+(\S+)/.exec(line)?.[1]
    if (!to) return d
    return to.split('/').filter(Boolean).reduce((x, part) => (part === '..' ? x - 1 : part === '.' ? x : x + 1), d)
  }, start)
  let depth = 0
  const problems: string[] = []
  for (const c of protoStep('prototipo.entornos').code ?? []) {
    if (c.language !== 'bash') continue
    if (/pywrangler|\.dev\.vars/.test(c.code) && depth !== 0) problems.push(`${c.title} starts ${depth} folder(s) below ventas-api`)
    depth = depthAfter(c.code, depth)
  }
  assert.deepEqual(problems, [], 'add a cd back to ventas-api (where wrangler.jsonc is) before these blocks')
  // Negative control: the same check on the old vercel_entornos.sh, without its last cd .., must fail.
  assert.equal(depthAfter('cd site\nnpx vercel', 0), 1, 'sanity: a cd into site/ must count as one folder down')
})
