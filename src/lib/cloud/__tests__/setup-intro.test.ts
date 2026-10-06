/**
 * Sesión 0 (/empezar): OS detection, the learner's ticks, the screenshot records and the content's
 * own rules. Kept in the client group (scripts/run_billing_tests.mjs) because that runner gives
 * each suite a floor; the logic itself lives in src/lib/setup.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { detectOs, isSetupOs } from '@/lib/setup/os'
import {
  EMPTY_SETUP_PROGRESS,
  SETUP_PROGRESS_KEY,
  chooseOs,
  countDone,
  loadSetupProgress,
  parseSetupProgress,
  saveSetupProgress,
  serializeSetupProgress,
  toggleStep,
} from '@/lib/setup/progress'
import { formatCheckedOn, shotAgeDays, validShotBox, validShotRecord } from '@/lib/setup/screenshots'

// Real user-agent strings, as the browsers send them.
const UA = {
  win11Chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  macSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
  ubuntuFirefox: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
  android: 'Mozilla/5.0 (Linux; Android 14; SM-A145M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
  chromebook: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
}

test('each desktop system is recognised from what its browser actually sends', () => {
  assert.deepEqual(detectOs({ userAgent: UA.win11Chrome, platform: 'Win32', uaPlatform: 'Windows' }), { os: 'windows', detected: true, mobile: false })
  assert.deepEqual(detectOs({ userAgent: UA.macSafari, platform: 'MacIntel', maxTouchPoints: 0 }), { os: 'macos', detected: true, mobile: false })
  assert.deepEqual(detectOs({ userAgent: UA.ubuntuFirefox, platform: 'Linux x86_64' }), { os: 'linux', detected: true, mobile: false })
  // Chrome OS: the Linux track is the closest one it can follow.
  assert.equal(detectOs({ userAgent: UA.chromebook, uaPlatform: 'Chrome OS' }).os, 'linux')
})

test('Android is a phone, never the Linux track, even though its user agent says "Linux"', () => {
  const g = detectOs({ userAgent: UA.android, platform: 'Linux armv81', uaPlatform: 'Android' })
  assert.equal(g.mobile, true)
  assert.equal(g.detected, false)
  assert.equal(g.os, 'windows') // the fallback, shown with the "pick yours" line
})

test('an iPad asking for the desktop site (MacIntel with a touch screen) is not a Mac', () => {
  assert.equal(detectOs({ userAgent: UA.macSafari, platform: 'MacIntel', maxTouchPoints: 5 }).mobile, true)
  assert.equal(detectOs({ userAgent: UA.iphone, platform: 'iPhone' }).mobile, true)
})

test('the most specific signal wins: Client Hints over navigator.platform over the user agent', () => {
  // A Windows machine whose user agent was frozen or spoofed to a Mac string.
  assert.equal(detectOs({ uaPlatform: 'Windows', platform: 'MacIntel', userAgent: UA.macSafari }).os, 'windows')
  assert.equal(detectOs({ platform: 'Win32', userAgent: UA.ubuntuFirefox }).os, 'windows')
})

test('nothing to go on gives the fallback, and says it is a fallback', () => {
  assert.deepEqual(detectOs({}), { os: 'windows', detected: false, mobile: false })
  assert.deepEqual(detectOs({ userAgent: 'curl/8.5.0', platform: '' }), { os: 'windows', detected: false, mobile: false })
})

test('isSetupOs accepts the three tracks only', () => {
  assert.ok(isSetupOs('macos'))
  assert.ok(!isSetupOs('Mac'))
  assert.ok(!isSetupOs(null))
})

// --- ticks -------------------------------------------------------------------------------------

function memoryStore(initial?: string) {
  const m = new Map<string, string>(initial === undefined ? [] : [[SETUP_PROGRESS_KEY, initial]])
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m }
}

test('ticks round-trip through storage, in the order they were ticked', () => {
  const store = memoryStore()
  let p = loadSetupProgress(store)
  p = toggleStep(p, 'terminal.win.abrir')
  p = toggleStep(p, 'python.win.descargar')
  p = chooseOs(p, 'windows')
  assert.equal(saveSetupProgress(store, p), true)
  assert.deepEqual(loadSetupProgress(store), { os: 'windows', done: ['terminal.win.abrir', 'python.win.descargar'] })
})

test('toggling twice unticks, and never mutates the record it was given', () => {
  const a = toggleStep(EMPTY_SETUP_PROGRESS, 'git.config.nombre')
  const b = toggleStep(a, 'git.config.nombre')
  assert.deepEqual(a.done, ['git.config.nombre'])
  assert.deepEqual(b.done, [])
  assert.deepEqual(EMPTY_SETUP_PROGRESS.done, [])
})

test('broken stored state reads as empty, and the read does not overwrite it', () => {
  for (const raw of ['{', 'null', '[]', '42', '"x"', '{"done":"terminal"}', '{"os":"amiga","done":[1,{}]}']) {
    const store = memoryStore(raw)
    assert.deepEqual(loadSetupProgress(store), { os: null, done: [] }, raw)
    assert.equal(store.m.get(SETUP_PROGRESS_KEY), raw, 'reading must not destroy what was stored')
  }
})

test('unknown but well-formed ids are kept: a newer page may have written them', () => {
  const p = parseSetupProgress('{"v":2,"os":"linux","done":["parte8.nuevo","<script>","a b"]}')
  assert.deepEqual(p, { os: 'linux', done: ['parte8.nuevo'] })
})

test('storage that throws (private mode, blocked site data) reads empty and reports a failed save', () => {
  const hostile = {
    getItem: () => {
      throw new Error('SecurityError')
    },
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
  }
  assert.deepEqual(loadSetupProgress(hostile), { os: null, done: [] })
  assert.equal(saveSetupProgress(hostile, chooseOs(EMPTY_SETUP_PROGRESS, 'macos')), false)
  assert.equal(saveSetupProgress(null, EMPTY_SETUP_PROGRESS), false)
})

test('the Sesión 0 key is not the course progress key', () => {
  // AGENTS.md invariant: course progress lives in `python-ds-progress`; Sesión 0 must not touch it.
  assert.notEqual(SETUP_PROGRESS_KEY, 'python-ds-progress')
  assert.ok(!serializeSetupProgress(EMPTY_SETUP_PROGRESS).includes('completedSections'))
})

test('countDone counts only the ids asked about', () => {
  const p = { os: null, done: ['a.b', 'c.d', 'zz.old'] }
  assert.equal(countDone(p, ['a.b', 'c.d', 'e.f']), 2)
})

// --- screenshot records --------------------------------------------------------------------------

test('a screenshot box must lie inside the picture', () => {
  assert.ok(validShotBox({ x: 10, y: 20, w: 30, h: 5 }))
  assert.ok(!validShotBox({ x: 80, y: 20, w: 30, h: 5 }), 'runs off the right edge')
  assert.ok(!validShotBox({ x: 10, y: 20, w: 0, h: 5 }), 'empty')
  assert.ok(!validShotBox({ x: '10', y: 20, w: 30, h: 5 }))
})

test('a screenshot record needs an ISO check date and a real size', () => {
  assert.ok(validShotRecord({ id: 'a', checkedOn: '2026-10-05', width: 1280, height: 800 }))
  assert.ok(!validShotRecord({ id: 'a', checkedOn: '5 oct 2026', width: 1280, height: 800 }))
  assert.ok(!validShotRecord({ id: 'a', checkedOn: '2026-10-05', width: 0, height: 800 }))
  assert.ok(!validShotRecord({ id: 'a', checkedOn: '2026-10-05', width: 1280, height: 800, box: { x: 1 } }))
})

test('the check date prints in Spanish, and its age counts in whole days', () => {
  assert.equal(formatCheckedOn('2026-10-05'), '5 oct 2026')
  assert.equal(formatCheckedOn('2027-01-31'), '31 ene 2027')
  assert.equal(shotAgeDays({ id: 'a', checkedOn: '2026-10-05', width: 1, height: 1 }, '2027-02-02'), 120)
})

// --- content ----------------------------------------------------------------------------------

import { SETUP_PARTS, SETUP_SHOTS, setupStepIds, stepsFor } from '@/lib/setup/content'
import { SETUP_FIGURES } from '@/lib/setup/figures'
import { SETUP_OS } from '@/lib/setup/os'
import { readFileSync, readdirSync } from 'node:fs'
import shotRecords from '@/assets/setup/shots.json'

const ALL_STEPS = SETUP_PARTS.flatMap((p) => p.steps)

test('step ids are unique and storable: a duplicate would tick two steps at once', () => {
  const ids = ALL_STEPS.map((s) => s.id)
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [])
  for (const id of ids) assert.equal(toggleStep(EMPTY_SETUP_PROGRESS, id).done[0], id, `${id} is rejected by the store`)
})

test('every system gets every part, and one track never shows another system\'s steps', () => {
  for (const os of SETUP_OS) {
    for (const part of SETUP_PARTS) {
      const steps = stepsFor(part, os)
      assert.ok(steps.length > 0, `${part.id} is empty on ${os}`)
      for (const s of steps) assert.ok(!s.os || s.os.includes(os), `${s.id} leaks into ${os}`)
    }
  }
  // The tracks really differ: a Windows learner never reads the macOS certificates step.
  assert.ok(!setupStepIds('windows').includes('python.mac.certificados'))
  assert.ok(setupStepIds('macos').includes('python.mac.certificados'))
  assert.ok(!setupStepIds('linux').includes('python.win.path'))
})

test('the Windows track carries the three causes that stop most beginners', () => {
  // RESEARCH.md §1.2, ranks 1–3: terminal vs Python prompt, PATH and a stale terminal, the Store alias.
  const win = setupStepIds('windows')
  for (const id of ['python.win.repl', 'python.win.path', 'python.win.reabrir', 'python.win.alias']) assert.ok(win.includes(id), id)
  const verify = ALL_STEPS.find((s) => s.id === 'python.win.verificar')!
  const symptoms = verify.fixes!.map((f) => f.symptom).join(' ')
  assert.match(symptoms, /Microsoft Store/)
  assert.match(symptoms, /no se reconoce/)
})

test('every step has its action and a «deberías ver» checkpoint', () => {
  // The handover's step contract, and the top finding of the 24-session study (RESEARCH.md §1.1,
  // E9): learners could not tell whether an installation had worked.
  for (const s of ALL_STEPS) {
    assert.ok(s.title.trim().length > 3 && s.body.length > 0, s.id)
    assert.ok(s.expect && s.expect.text.trim().length > 10, `${s.id}: nothing tells the learner it worked`)
  }
})

test('every picture and diagram a step names exists', () => {
  const shotIds = new Set(SETUP_SHOTS.map((s) => s.id))
  for (const s of ALL_STEPS) {
    if (s.shot) assert.ok(shotIds.has(s.shot), `${s.id}: unknown screenshot ${s.shot}`)
    if (s.figure) assert.ok(SETUP_FIGURES[s.figure], `${s.id}: unknown figure ${s.figure}`)
  }
  for (const p of SETUP_PARTS) if (p.figure) assert.ok(SETUP_FIGURES[p.figure], `${p.id}: unknown figure ${p.figure}`)
  const used = new Set([...ALL_STEPS.map((s) => s.shot), ...SETUP_PARTS.map((p) => p.figure), ...ALL_STEPS.map((s) => s.figure), 'setup-map'])
  for (const id of Object.keys(SETUP_FIGURES)) assert.ok(used.has(id), `figure ${id} is drawn by no step`)
  for (const s of SETUP_SHOTS) assert.ok(used.has(s.id), `screenshot ${s.id} is asked for by no step`)
})

test('every screenshot spec can be taken and read without seeing it', () => {
  for (const s of SETUP_SHOTS) {
    assert.ok(s.alt.length > 40 && s.caption.length > 15 && s.brief.length > 30, s.id)
    if (s.source === 'browser-script') assert.ok(s.url?.startsWith('https://') && s.selector, `${s.id}: a scripted shot needs a page and a selector`)
  }
})

// The PNGs are read from disk: Node cannot import them, and the build's own index.ts is checked
// against them below (the same renderIndex the generator writes).
const SHOT_DIR = 'src/assets/setup'
const PNGS = readdirSync(SHOT_DIR).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4))

/** Width and height from a PNG's IHDR chunk. */
function pngSize(id: string): [number, number] {
  const b = readFileSync(`${SHOT_DIR}/${id}.png`)
  assert.equal(b.subarray(1, 4).toString(), 'PNG', `${id}.png is not a PNG`)
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

test('captures and their records match: no picture without a date, no date without a picture', () => {
  const records = (shotRecords as unknown[]).filter(validShotRecord)
  assert.equal(records.length, (shotRecords as unknown[]).length, 'a record in shots.json is malformed')
  const specs = new Set(SETUP_SHOTS.map((s) => s.id))
  for (const id of PNGS) {
    assert.ok(specs.has(id), `${id}.png has no spec`)
    assert.ok(records.some((r) => r.id === id), `${id}.png has no checkedOn record`)
  }
  for (const r of records) {
    assert.ok(PNGS.includes(r.id), `${r.id}: record without a picture`)
    assert.deepEqual(pngSize(r.id), [r.width, r.height], `${r.id}: the record's size is not the picture's`)
  }
  assert.equal(readFileSync(`${SHOT_DIR}/index.ts`, 'utf8'), renderIndex(PNGS), 'index.ts is stale: run node scripts/setup_shots_index.mjs')
})

test('a reused picture names its source and an open licence, and says what it really shows', () => {
  const reused = (shotRecords as unknown[]).filter(validShotRecord).filter((r) => r.credit)
  for (const r of reused) {
    assert.ok(r.credit!.url.startsWith('https://github.com/'), `${r.id}: link the exact source file`)
    assert.ok(r.alt && r.caption, `${r.id}: a reused picture brings its own alt and caption`)
  }
  // The licence list is a gate: a NonCommercial or all-rights-reserved picture fails here.
  const words = { alt: 'a'.repeat(50), caption: 'b'.repeat(20) }
  const rec = (licence: string, extra: object = {}) =>
    validShotRecord({ id: 'x', checkedOn: '2026-10-05', width: 1, height: 1, credit: { source: 'Some docs', url: 'https://github.com/x', licence }, ...words, ...extra })
  assert.ok(!rec('CC BY-NC-SA 4.0'))
  assert.ok(!rec('All rights reserved'))
  // Share-alike only as published: no crop, no box of ours over it.
  assert.ok(rec('CC BY-SA 4.0'))
  assert.ok(!rec('CC BY-SA 4.0', { box: { x: 1, y: 1, w: 10, h: 10 } }))
  assert.ok(!validShotRecord({ id: 'x', checkedOn: '2026-10-05', width: 1, height: 1, credit: { source: 'Some docs', url: 'https://github.com/x', licence: 'CC BY-SA 4.0', changes: 'recortada' }, ...words }))
  assert.ok(rec('CC BY 4.0', { box: { x: 1, y: 1, w: 10, h: 10 } }))
  // And a reused picture without its own alt would describe a screen it does not show.
  assert.ok(!validShotRecord({ id: 'x', checkedOn: '2026-10-05', width: 1, height: 1, credit: { source: 'GitHub Docs', url: 'https://github.com/x', licence: 'CC BY 4.0' } }))
})

test('diagram text fits the archetype boxes it is drawn in', () => {
  // The same arithmetic as tests/adversarial/figure-data-schema.test.mjs for course figures.
  for (const f of Object.values(SETUP_FIGURES)) {
    assert.ok(f.caption.length > 20 && f.alt.length > 20, f.id)
    assert.ok(f.data.headline.length <= 130, `${f.id}: headline too long`)
    // Diagram text is SVG <text>: inline markdown is printed literally, so a backtick shows as one.
    const drawn = JSON.stringify(f.data)
    assert.ok(!/[`*]/.test(drawn), `${f.id}: markdown inside SVG text`)
    if (f.data.kind !== 'flow') continue
    const n = f.data.stages.length
    const gap = n > 4 ? 10 : 16
    const budget = Math.floor((Math.floor((560 - 48 - gap * (n - 1)) / n) - 8) / 7.4)
    for (const st of f.data.stages) {
      assert.ok(st.label.length <= budget, `${f.id}: "${st.label}" over ${budget} chars`)
      if (st.sub) assert.ok(st.sub.length <= budget * 2, `${f.id}: "${st.sub}" needs a third line`)
    }
  }
})

// --- the screenshot scripts -----------------------------------------------------------------------

import { mergeRecords, percentBox, report } from '../../../../scripts/setup_screenshots.mjs'
import { folderProblems, renderIndex } from '../../../../scripts/setup_shots_index.mjs'

test('a measured element becomes a box in percent, padded, and never past the edge', () => {
  assert.deepEqual(percentBox({ x: 128, y: 80, width: 256, height: 40 }), { x: 9.4, y: 9.4, w: 21.2, h: 6.2 })
  const edge = percentBox({ x: 1200, y: 760, width: 80, height: 40 })
  assert.ok(edge.x + edge.w <= 100 && edge.y + edge.h <= 100, JSON.stringify(edge))
  assert.ok(validShotBox(edge))
})

test('a retake replaces its record by id and keeps the others', () => {
  const stored = [{ id: 'b', checkedOn: '2026-01-01' }, { id: 'a', checkedOn: '2026-01-01' }]
  const merged = mergeRecords(stored, [{ id: 'b', checkedOn: '2026-10-05' }])
  assert.deepEqual(merged.map((r: { id: string; checkedOn: string }) => `${r.id}@${r.checkedOn}`), ['a@2026-01-01', 'b@2026-10-05'])
})

test('the report calls a capture missing, stale after the age limit, or ok', () => {
  const specs = [{ id: 'x', source: 'browser-script' }, { id: 'y', source: 'owner-capture' }, { id: 'z', source: 'owner-capture' }]
  const records = [{ id: 'y', checkedOn: '2026-01-01' }, { id: 'z', checkedOn: '2026-09-01' }]
  const rows = report(specs, records, '2026-10-05', 120)
  assert.deepEqual(rows.map((r: { state: string }) => r.state), ['missing', 'stale', 'ok'])
})

test('the image index imports each capture and the folder check finds orphans both ways', () => {
  const idx = renderIndex(['win-py-installer-path', 'gh-signup-form'])
  assert.match(idx, /import shot_gh_signup_form from '\.\/gh-signup-form\.png'/)
  assert.match(idx, /'win-py-installer-path': shot_win_py_installer_path,/)
  assert.match(renderIndex([]), /= \{\}/)
  const problems = folderProblems(['a.png', 'Bad Name.png', 'index.ts'], [{ id: 'a' }, { id: 'gone' }])
  assert.ok(problems.some((p: string) => p.includes('Bad Name.png')))
  assert.ok(problems.some((p: string) => p.includes('gone.png is missing')))
  assert.equal(folderProblems(['a.png'], [{ id: 'a' }]).length, 0)
})

test('no DNI-shaped number in anything the learner reads (rule D2)', () => {
  // scripts/synthetic_identifier_audit.py scans the 52 sections only; Sesión 0 needs its own check.
  // A GitHub noreply example of 8 digits ("12345678+ana-quispe@…") is exactly the shape it bans.
  const text = JSON.stringify([SETUP_PARTS, SETUP_SHOTS.map((s) => [s.alt, s.caption]), SETUP_FIGURES])
  assert.deepEqual(text.match(/(?<!\d)\d{8}(?!\d)/g) ?? [], [])
})

test('the first commit happens on the computer before any GitHub sign-in, and the clone proves the push', () => {
  // RESEARCH.md §8.4 (3): a failed sign-in must not take the learner's first commit with it.
  for (const os of SETUP_OS) {
    const ids = setupStepIds(os)
    const at = (id: string) => ids.indexOf(id)
    assert.ok(at('conectar.commit') >= 0 && at('conectar.commit') < at('conectar.login'), `${os}: commit after login`)
    assert.ok(at('conectar.login') < at('conectar.publicar') && at('conectar.publicar') < at('conectar.clonar'), `${os}: publish order`)
  }
  // Git answers in the system's language: each local Git checkpoint names the Spanish wording too.
  const local = ['conectar.init', 'conectar.status', 'conectar.clonar'].map((id) => ALL_STEPS.find((s) => s.id === id)!)
  for (const s of local) assert.match(s.expect!.text, /En español dice/, `${s.id}: no Spanish wording`)
})

// --- adding an own capture --------------------------------------------------------------------

import { ownRecord, pixelBoxToPercent, pngSize as pngSizeOf } from '../../../../scripts/setup_shot_add.mjs'

test('a pixel box becomes percentages of the real picture, and one that spills out is refused', () => {
  // A Retina capture is twice the points: the box is in the PNG's own pixels, whatever the screen.
  assert.deepEqual(pixelBoxToPercent('130, 760, 360, 40', 1316, 822), { x: 9.9, y: 92.5, w: 27.4, h: 4.9 })
  assert.throws(() => pixelBoxToPercent('1300,10,40,10', 1316, 822), /does not fit/)
  assert.throws(() => pixelBoxToPercent('10,10,40', 1316, 822), /four numbers/)
  assert.throws(() => pixelBoxToPercent('10,10,0,5', 1316, 822), /does not fit/)
  assert.ok(validShotBox(pixelBoxToPercent('0,0,1316,822', 1316, 822)))
})

test('an own capture is a plain record: no credit, so the page says "Comprobado el"', () => {
  const r = ownRecord('win-py-installer-done', 658, 408, '2026-10-12', { x: 80, y: 88, w: 15, h: 8 })
  assert.ok(validShotRecord(r))
  assert.equal('credit' in r, false)
  assert.ok(validShotRecord(ownRecord('a', 10, 10, '2026-10-12')))
  assert.throws(() => pngSizeOf(Buffer.from('GIF89a-not-a-png-at-all-really')), /not a PNG/)
  assert.deepEqual(pngSizeOf(readFileSync('src/assets/setup/gh-2fa-setup.png')), [725, 446])
})
