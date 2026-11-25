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
      if (c.language !== 'python') continue
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
  assert.ok(ran >= 12, `expected at least 12 Python blocks (7 worked examples, 5 solutions), ran ${ran}`)
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
    1: 'setup', 2: 'basics', 7: 'text-unicode-regex', 8: 'files-ingestion', 11: 'oop-domain',
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
    ;(Array.isArray(m.intro) ? m.intro : [m.intro]).forEach((x, i) => add(`${m.id}.intro${i}`, x as string))
    for (const st of m.steps) {
      st.body.forEach((x, i) => add(`${st.id}.body${i}`, x))
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
    if (lens.length > 2) lens.slice(1).forEach((n, i) => n < 15 && lens[i] < 15 && problems.push(`${where}: sentences ${i + 1}-${i + 2} are ${lens[i]} and ${n} words (D13)`))
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
