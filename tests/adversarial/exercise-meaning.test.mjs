/**
 * Contracts for B11: an exercise id must not silently change meaning.
 *
 * The rules are proven on literal fixtures. The real course is checked against its committed anchors
 * through COURSE_SECTIONS. The ledger rule is proven through the CLI and through the preservation
 * sentinel, each on a throwaway git repository in the OS temp directory.
 */
import { after, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ANCHORS_PATH,
  EXERCISE_ID,
  LEDGER_PATH,
  classify,
  fingerprint,
  jaccard,
  ledgerAnchorFindings,
  ledgerFindings,
  tokensOf,
} from '../../scripts/exercise_meaning.mjs'
import { currentAnchors } from '../../scripts/exercise_fingerprints.mts'
import { ROADMAP_PATH, roadmapSectionCount } from '../../scripts/preservation/roadmap_section_count.mjs'
import { PROGRESS_FIELDS } from '../../src/lib/progress-sanitize.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const CLI = join(ROOT, 'scripts/exercise_meaning.mjs')
const SENTINEL = join(ROOT, 'scripts/preservation_sentinel.mjs')
const tempDirs = []
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true })
})

const SHA_A = 'a'.repeat(64)
const SHA_B = 'b'.repeat(64)
const SHA_C = 'c'.repeat(64)

/** Two vocabularies that share almost nothing, so a swap is unmistakable. */
const BAR = { title: 'Barras para comparar', tests: 'salida coincide', code: 'chart = "bar"\nprint(chart)', output: 'bar' }
const AXIS = { title: 'Eje recortado', tests: 'ylim cero', code: 'ylim0 = 0.0\nprint(ylim0)', output: 'ylim0 0.0' }

const anchor = (section, content) => fingerprint({ section, ...content })

describe('tokens and fingerprints', () => {
  it('reads letters without accents and digits as tokens, with the NFKD marks removed', () => {
    assert.deepEqual(tokensOf('según mis cálculos: n=96 Ñandú'), ['segun', 'mis', 'calculos', 'n', '96', 'nandu'])
  })

  it('folds case the way casefold does, so the sharp s reads as ss', () => {
    assert.deepEqual(tokensOf('Straße'), ['strasse'])
  })

  it('keeps the fingerprint when only accents or whitespace change', () => {
    const plain = anchor('S05', { title: 'Funcion pura', tests: 'coincide', code: 'print("hola mundo")', output: 'hola' })
    const edited = anchor('S05', { title: 'Función   pura', tests: 'coincide', code: 'print("hola  mundo")', output: 'hola' })
    assert.equal(edited.sha256, plain.sha256)
  })

  it('reports a title typo as a changed fingerprint that is still the same meaning', () => {
    const anchors = { 'S05-T1-A-E1': anchor('S05', { ...BAR }) }
    const typo = { 'S05-T1-A-E1': anchor('S05', { ...BAR, title: 'Barras para comparar regines' }) }
    assert.notEqual(typo['S05-T1-A-E1'].sha256, anchors['S05-T1-A-E1'].sha256)
    assert.deepEqual(classify(anchors, typo), [])
  })

  it('measures similarity as Jaccard on token sets, with two empty sets identical', () => {
    assert.equal(jaccard(['a', 'b'], ['b', 'c']), 1 / 3)
    assert.equal(jaccard([], []), 1)
  })
})

describe('classify: what an exercise now means', () => {
  it('reports two CONTENT_MOVED findings, each naming the other, when sibling content swaps and the ids stay', () => {
    const anchors = {
      'S05-T1-A-E1': anchor('S05', BAR),
      'S05-T1-A-E2': anchor('S05', AXIS),
    }
    const current = {
      'S05-T1-A-E1': anchor('S05', AXIS),
      'S05-T1-A-E2': anchor('S05', BAR),
    }
    const findings = classify(anchors, current)
    assert.deepEqual(findings.map((f) => [f.code, f.id, f.moved_to]), [
      ['EXERCISE_CONTENT_MOVED', 'S05-T1-A-E1', 'S05-T1-A-E2'],
      ['EXERCISE_CONTENT_MOVED', 'S05-T1-A-E2', 'S05-T1-A-E1'],
    ])
  })

  it('treats another section\'s content as MEANING_CHANGED, not a move, and a ledger row makes it green', () => {
    const anchors = {
      'S05-T1-A-E1': anchor('S05', BAR),
      'S19-T1-A-E1': anchor('S19', AXIS),
    }
    const current = { ...anchors, 'S05-T1-A-E1': anchor('S19', AXIS) }
    const findings = classify(anchors, current)
    assert.deepEqual(findings.map((f) => [f.code, f.id]), [['EXERCISE_MEANING_CHANGED', 'S05-T1-A-E1']])
    const rows = [{ row: 1, id: 'S05-T1-A-E1', kind: 'changed', from_fp: anchors['S05-T1-A-E1'].sha256, to_fp: current['S05-T1-A-E1'].sha256, reason: 'reemplazo', decided_by: 'owner', date: '2026-10-13' }]
    assert.deepEqual(classify(anchors, current, rows), [])
  })

  it('does not count a historical row as the acceptance of a present change', () => {
    const anchors = { 'S05-T1-A-E1': anchor('S05', BAR) }
    const current = { 'S05-T1-A-E1': anchor('S05', AXIS) }
    const rows = [{ row: 1, id: 'S05-T1-A-E1', kind: 'historical', from_fp: SHA_A, to_fp: current['S05-T1-A-E1'].sha256, reason: 'pasado', decided_by: 'medido', date: '2026-10-13' }]
    assert.equal(classify(anchors, current, rows).length, 1)
  })

  it('reports an exercise with no anchor, and an anchor whose exercise is gone', () => {
    const findings = classify({ 'S05-T1-A-E1': anchor('S05', BAR) }, { 'S05-T1-A-E2': anchor('S05', AXIS) })
    assert.deepEqual(findings.map((f) => f.code).sort(), ['EXERCISE_REMOVED', 'EXERCISE_UNANCHORED'])
  })
})

describe('ledgerFindings: the anchors and the ledger move together', () => {
  const row = (over = {}) => ({ row: 1, id: 'S05-T1-A-E1', kind: 'changed', from_fp: SHA_A, to_fp: SHA_B, reason: 'reescrito', decided_by: 'owner O17', date: '2026-10-13', ...over })
  const base = { 'S05-T1-A-E1': { section: 'S05', sha256: SHA_A, tokens: ['x'] } }
  const head = { 'S05-T1-A-E1': { section: 'S05', sha256: SHA_B, tokens: ['y'] } }

  it('reports an anchor change that has no row', () => {
    const findings = ledgerFindings({ baseAnchors: base, headAnchors: head, baseRows: [], headRows: [] })
    assert.deepEqual(findings.map((f) => f.code), ['ANCHOR_CHANGED_UNLEDGERED'])
  })

  it('accepts the same change once an appended row names the id and the new fingerprint', () => {
    assert.deepEqual(ledgerFindings({ baseAnchors: base, headAnchors: head, baseRows: [], headRows: [row()] }), [])
  })

  it('refuses an edit to a row the base already recorded', () => {
    const findings = ledgerFindings({ baseAnchors: base, headAnchors: head, baseRows: [row()], headRows: [row({ reason: 'otra razón' })] })
    assert.ok(findings.some((f) => f.code === 'LEDGER_ROW_EDITED' && f.row === 1), JSON.stringify(findings))
  })

  it('refuses a row that does not number 1..n or names no real exercise', () => {
    const findings = ledgerFindings({ baseAnchors: null, headAnchors: null, headRows: [row({ row: 3, id: 'S5-T1-A-E1' })] })
    assert.ok(findings.some((f) => f.code === 'LEDGER_ROW_INVALID'), JSON.stringify(findings))
  })

  it('exempts the commit that introduces the anchors, because it has no base to compare with', () => {
    assert.deepEqual(ledgerFindings({ baseAnchors: null, headAnchors: head, headRows: [] }), [])
  })

  it('refuses a row whose from_fp is neither a sha256 nor null', () => {
    const findings = ledgerFindings({ baseAnchors: null, headAnchors: null, headRows: [row({ from_fp: 'no-hash-here' })] })
    assert.ok(findings.some((f) => f.code === 'LEDGER_ROW_INVALID' && f.problems.some((p) => /from_fp/.test(p))), JSON.stringify(findings))
  })

  it('does not accept a change with a historical row, which records a change made before the anchors', () => {
    const historical = row({ kind: 'historical' })
    const findings = ledgerFindings({ baseAnchors: base, headAnchors: head, baseRows: [], headRows: [historical] })
    assert.deepEqual(findings.map((f) => f.code), ['ANCHOR_CHANGED_UNLEDGERED'])
  })
})

describe('the real course against its committed anchors', () => {
  const committed = JSON.parse(readFileSync(join(ROOT, ANCHORS_PATH), 'utf8')).exercises
  const ledger = JSON.parse(readFileSync(join(ROOT, LEDGER_PATH), 'utf8')).rows
  const current = currentAnchors()

  it('gives every id the Sxx-Ty-Z-En form, 24 per section, and no id twice', () => {
    const ids = Object.keys(committed)
    assert.ok(ids.every((id) => EXERCISE_ID.test(id)), ids.filter((id) => !EXERCISE_ID.test(id)).join(' '))
    assert.equal(new Set(ids).size, ids.length)
    const perSection = new Map()
    for (const id of ids) perSection.set(id.slice(0, 3), (perSection.get(id.slice(0, 3)) ?? 0) + 1)
    const declared = roadmapSectionCount(readFileSync(join(ROOT, ROADMAP_PATH), 'utf8'))
    assert.equal(perSection.size, declared, `the anchors cover ${perSection.size} sections; the roadmap declares ${declared}`)
    assert.ok([...perSection.values()].every((n) => n === 24), JSON.stringify([...perSection]))
  })

  it('has zero findings: every current exercise matches the anchor committed for it, exactly', () => {
    // A wording edit is no classifier finding, so the exact hash is what catches stale anchors:
    // regenerate them (scripts/exercise_fingerprints.mts --write) and add a ledger row for the change.
    const stale = Object.keys(current).filter((id) => committed[id]?.sha256 !== current[id].sha256)
    assert.deepEqual(stale, [], 'these anchors are stale: regenerate them and add a ledger row')
    assert.deepEqual(classify(committed, current, ledger), [])
  })

  it('names only exercise ids, and the newest row of each holds the anchor the id has now', () => {
    // The newest row, not every row: the ledger is append-only, so an id that changed twice keeps
    // its first row at the fingerprint it recorded then (ledgerAnchorFindings).
    for (const row of ledger) assert.ok(EXERCISE_ID.test(row.id), row.id)
    assert.deepEqual(ledgerAnchorFindings(committed, ledger), [])
  })

  it('records every historical row as decided by the owner in O25, with no stand-in note', () => {
    // O25 (2026-10-13) accepted the exercise-meaning changes made between 35d19637 and the anchors.
    // The draft's rows said "measured ... no decision is recorded here"; that was a stand-in.
    const historical = ledger.filter((row) => row.kind === 'historical')
    assert.ok(historical.length > 0, 'the ledger holds no historical rows, so this check would pass for nothing')
    for (const row of historical) {
      assert.equal(row.decided_by, 'owner: O25 (2026-10-13)', `row ${row.row} (${row.id})`)
      assert.doesNotMatch(row.reason, /no decision is recorded|measured/i, `row ${row.row} (${row.id})`)
    }
  })

  it('stays green when the next owner-approved wording edit lands on an id that already has ledger rows', () => {
    // The workflow of 2026-10-13: edit the exercise, regenerate the anchors, append one row. Doing it
    // to a historical id (23 of the 34 are in S03, the section the fixer works on next) and then to
    // the same id again must leave both the sentinel's rule and this test green.
    const id = ledger.find((row) => row.kind === 'historical').id
    const first = { ...committed[id], sha256: SHA_A }
    const second = { ...committed[id], sha256: SHA_B }
    const rowFor = (n, from, to) => ({ row: n, id, kind: 'changed', from_fp: from, to_fp: to, reason: 'reescrito', decided_by: 'owner', date: '2026-10-13' })
    const afterFirst = { anchors: { ...committed, [id]: first }, rows: [...ledger, rowFor(ledger.length + 1, committed[id].sha256, SHA_A)] }
    const afterSecond = { anchors: { ...committed, [id]: second }, rows: [...afterFirst.rows, rowFor(ledger.length + 2, SHA_A, SHA_B)] }
    for (const state of [afterFirst, afterSecond]) {
      assert.deepEqual(ledgerAnchorFindings(state.anchors, state.rows), [])
      assert.deepEqual(ledgerFindings({ baseAnchors: committed, headAnchors: state.anchors, baseRows: ledger, headRows: state.rows }), [])
    }
  })
})

describe('the real ledger and the chain', () => {
  const committed = JSON.parse(readFileSync(join(ROOT, ANCHORS_PATH), 'utf8')).exercises
  const ledger = JSON.parse(readFileSync(join(ROOT, LEDGER_PATH), 'utf8')).rows

  it('refuses the next owner-approved edit when its row starts from the wrong fingerprint', () => {
    const id = ledger.find((row) => row.kind === 'historical').id
    const edited = { ...committed, [id]: { ...committed[id], sha256: SHA_A } }
    const rowFrom = (from) => ({ row: ledger.length + 1, id, kind: 'changed', from_fp: from, to_fp: SHA_A, reason: 'reescrito', decided_by: 'owner', date: '2026-10-13' })
    const check = (from) => ledgerFindings({ baseAnchors: committed, headAnchors: edited, baseRows: ledger, headRows: [...ledger, rowFrom(from)] })
    assert.deepEqual(check(committed[id].sha256), [])
    assert.deepEqual(check(SHA_B).map((f) => [f.code, f.id, f.expected_from_fp]), [['LEDGER_CHAIN_BROKEN', id, committed[id].sha256]])
  })
})

describe('ledgerAnchorFindings: the newest row of an id names its anchor', () => {
  const anchorOf = (sha256) => ({ section: 'S05', sha256, tokens: ['x'] })
  const rowFor = (n, id, kind, from, to) => ({ row: n, id, kind, from_fp: from, to_fp: to, reason: 'razón', decided_by: 'owner', date: '2026-10-13' })
  const ID = 'S05-T1-A-E1'

  it('accepts two successive changes to one id: the first row keeps the fingerprint it recorded', () => {
    const rows = [rowFor(1, ID, 'changed', SHA_A, SHA_B), rowFor(2, ID, 'changed', SHA_B, SHA_C)]
    assert.deepEqual(ledgerAnchorFindings({ [ID]: anchorOf(SHA_C) }, rows), [])
  })

  it('accepts one change to an id whose only row is historical, once a row follows it', () => {
    const rows = [rowFor(1, ID, 'historical', SHA_A, SHA_B), rowFor(2, ID, 'changed', SHA_B, SHA_C)]
    assert.deepEqual(ledgerAnchorFindings({ [ID]: anchorOf(SHA_C) }, rows), [])
  })

  it('reports an anchor that moved with no row after a historical one', () => {
    const rows = [rowFor(1, ID, 'historical', SHA_A, SHA_B)]
    const findings = ledgerAnchorFindings({ [ID]: anchorOf(SHA_C) }, rows)
    assert.deepEqual(findings.map((f) => [f.code, f.id, f.row]), [['LEDGER_NEWEST_ROW_NOT_ANCHOR', ID, 1]])
  })

  it('reports an id whose newest row is not its anchor, and an id whose anchor is gone', () => {
    const rows = [rowFor(1, ID, 'changed', SHA_A, SHA_B), rowFor(2, ID, 'changed', SHA_B, SHA_C)]
    assert.equal(ledgerAnchorFindings({ [ID]: anchorOf(SHA_B) }, rows).length, 1)
    assert.equal(ledgerAnchorFindings({}, rows).length, 1)
  })

  it('does not examine an id that has no row', () => {
    assert.deepEqual(ledgerAnchorFindings({ [ID]: anchorOf(SHA_A) }, []), [])
  })
})

describe('ledgerFindings: the chain, an appended row starts where the base left the id (O25)', () => {
  const ID = 'S05-T1-A-E1'
  const OTHER = 'S05-T1-A-E2'
  const exercise = (sha256) => ({ section: 'S05', sha256, tokens: ['x'] })
  const rowFor = (n, id, kind, from, to, over = {}) => ({ row: n, id, kind, from_fp: from, to_fp: to, reason: 'razón', decided_by: 'owner: O25 (2026-10-13)', date: '2026-10-13', ...over })
  const base = { [ID]: exercise(SHA_A), [OTHER]: exercise(SHA_B) }
  const run = (rows, head, baseAnchors = base) => ledgerFindings({ baseAnchors, headAnchors: head, baseRows: [], headRows: rows })
  const chainFindings = (findings) => findings.filter((f) => f.code === 'LEDGER_CHAIN_BROKEN')

  it('accepts a row whose from_fp is the anchor the base held, and one for a new id with a null from_fp', () => {
    const head = { [ID]: exercise(SHA_C), [OTHER]: exercise(SHA_B), 'S05-T1-A-E3': exercise(SHA_A) }
    const rows = [rowFor(1, ID, 'changed', SHA_A, SHA_C), rowFor(2, 'S05-T1-A-E3', 'added', null, SHA_A)]
    assert.deepEqual(run(rows, head), [])
  })

  it('reports a row whose from_fp is not the base anchor of its id, naming the one expected', () => {
    const findings = run([rowFor(1, ID, 'changed', SHA_B, SHA_C)], { ...base, [ID]: exercise(SHA_C) })
    assert.deepEqual(findings.map((f) => [f.code, f.id, f.row, f.from_fp, f.expected_from_fp]), [['LEDGER_CHAIN_BROKEN', ID, 1, SHA_B, SHA_A]])
  })

  it('reports an added row (null from_fp) for an id the base already anchors', () => {
    const findings = chainFindings(run([rowFor(1, ID, 'added', null, SHA_C)], { ...base, [ID]: exercise(SHA_C) }))
    assert.deepEqual(findings.map((f) => f.expected_from_fp), [SHA_A])
  })

  it('reports a row that claims an old fingerprint for an id the base had no anchor for', () => {
    const head = { ...base, 'S05-T1-A-E3': exercise(SHA_C) }
    const findings = chainFindings(run([rowFor(1, 'S05-T1-A-E3', 'changed', SHA_A, SHA_C)], head))
    assert.deepEqual(findings.map((f) => [f.id, f.expected_from_fp]), [['S05-T1-A-E3', null]])
  })

  it('accepts two rows for one id in one PR when the second starts where the first ended', () => {
    const rows = [rowFor(1, ID, 'changed', SHA_A, SHA_B), rowFor(2, ID, 'reanchored', SHA_B, SHA_C)]
    assert.deepEqual(run(rows, { ...base, [ID]: exercise(SHA_C) }), [])
  })

  it('reports a second row for one id that does not start where the first ended', () => {
    const rows = [rowFor(1, ID, 'changed', SHA_A, SHA_B), rowFor(2, ID, 'changed', SHA_A, SHA_C)]
    const findings = chainFindings(run(rows, { ...base, [ID]: exercise(SHA_C) }))
    assert.deepEqual(findings.map((f) => [f.row, f.expected_from_fp]), [[2, SHA_B]])
  })

  it('follows a removal: an id removed and added back in one PR starts the new row from null', () => {
    const rows = [rowFor(1, ID, 'removed', SHA_A, null), rowFor(2, ID, 'added', null, SHA_C)]
    assert.deepEqual(run(rows, { ...base, [ID]: exercise(SHA_C) }), [])
    const wrong = [rowFor(1, ID, 'removed', SHA_A, null), rowFor(2, ID, 'added', SHA_A, SHA_C)]
    assert.deepEqual(chainFindings(run(wrong, { ...base, [ID]: exercise(SHA_C) })).map((f) => f.row), [2])
  })

  it('leaves a historical row out of the chain: it describes a change from before the anchors', () => {
    const findings = run([rowFor(1, ID, 'historical', SHA_C, SHA_B)], { ...base, [ID]: exercise(SHA_B) })
    assert.deepEqual(findings.map((f) => f.code), ['ANCHOR_CHANGED_UNLEDGERED'])
  })

  it('does not run on the commit that introduces the anchors, which has no base to chain from', () => {
    assert.deepEqual(ledgerFindings({ baseAnchors: null, headAnchors: base, baseRows: [], headRows: [rowFor(1, ID, 'historical', SHA_C, SHA_A)] }), [])
  })

  it('does not chain a row the base already recorded, only the rows added after them', () => {
    const recorded = rowFor(1, ID, 'changed', SHA_C, SHA_A)
    assert.deepEqual(ledgerFindings({ baseAnchors: base, headAnchors: base, baseRows: [recorded], headRows: [recorded] }), [])
  })
})

describe('removed rows: an exercise leaves the course only by an owner decision (O25)', () => {
  const ID = 'S05-T1-A-E1'
  const OTHER = 'S05-T1-A-E2'
  const OWNER = 'owner: O25 (2026-10-13)'
  const exercise = (sha256) => ({ section: 'S05', sha256, tokens: ['x'] })
  const removed = (over = {}) => ({ row: 1, id: ID, kind: 'removed', from_fp: SHA_A, to_fp: null, reason: 'retirado del curso', decided_by: OWNER, date: '2026-10-13', ...over })
  const base = { [ID]: exercise(SHA_A), [OTHER]: exercise(SHA_B) }
  const head = { [OTHER]: exercise(SHA_B) }
  const findingsFor = (rows, headAnchors = head) => ledgerFindings({ baseAnchors: base, headAnchors, baseRows: [], headRows: rows })
  const codeList = (findings) => findings.map((f) => f.code)

  it('reports an anchor that left the course with no row', () => {
    assert.deepEqual(codeList(findingsFor([])), ['ANCHOR_REMOVED'])
  })

  it('accepts the removal once an appended removed row names the id and the owner decision', () => {
    assert.deepEqual(findingsFor([removed()]), [])
  })

  it('does not accept the removal with a row of any other kind', () => {
    for (const kind of ['changed', 'added', 'reanchored', 'historical']) {
      const findings = findingsFor([removed({ kind, to_fp: SHA_B })])
      assert.ok(codeList(findings).includes('ANCHOR_REMOVED'), `${kind}: ${JSON.stringify(findings)}`)
    }
  })

  it('does not accept the removal of one id as the removal of another', () => {
    assert.ok(codeList(findingsFor([removed({ id: OTHER, from_fp: SHA_B })])).includes('ANCHOR_REMOVED'))
  })

  it('refuses a removed row whose decided_by names no owner decision, and it clears nothing', () => {
    for (const decided_by of ['medido', 'owner', 'owner: sí', 'agent: O25', 'O25']) {
      const findings = findingsFor([removed({ decided_by })])
      assert.deepEqual(codeList(findings), ['LEDGER_ROW_INVALID', 'ANCHOR_REMOVED'], `${decided_by}: ${JSON.stringify(findings)}`)
      assert.ok(findings[0].problems.some((p) => /decided_by/.test(p)), JSON.stringify(findings[0]))
    }
  })

  it('refuses a removed row that holds a to_fp, or has no from_fp to point at', () => {
    for (const over of [{ to_fp: SHA_B }, { from_fp: null }, { from_fp: 'no-hash-here' }]) {
      const findings = findingsFor([removed(over)])
      assert.equal(findings[0]?.code, 'LEDGER_ROW_INVALID', JSON.stringify({ over, findings }))
    }
  })

  it('refuses a removed row for an id the head still anchors, unchanged', () => {
    const findings = ledgerFindings({ baseAnchors: base, headAnchors: base, baseRows: [], headRows: [removed()] })
    assert.deepEqual(codeList(findings), ['LEDGER_ID_NOT_VACATED'])
    assert.equal(findings[0].id, ID)
  })

  it('accepts a removed row for an id the head holds again with other content, when a row names that', () => {
    const reused = { ...head, [ID]: exercise(SHA_C) }
    const added = { row: 2, id: ID, kind: 'added', from_fp: null, to_fp: SHA_C, reason: 'otro ejercicio', decided_by: OWNER, date: '2026-10-13' }
    assert.deepEqual(findingsFor([removed(), added], reused), [])
  })

  it('classify: resolves EXERCISE_REMOVED with a removed row for the anchor it holds, and no other', () => {
    const anchors = { [ID]: anchor('S05', BAR), [OTHER]: anchor('S05', AXIS) }
    const current = { [OTHER]: anchors[OTHER] }
    assert.deepEqual(classify(anchors, current).map((f) => f.code), ['EXERCISE_REMOVED'])
    assert.deepEqual(classify(anchors, current, [removed({ from_fp: anchors[ID].sha256 })]), [])
    assert.equal(classify(anchors, current, [removed({ from_fp: SHA_C })]).length, 1, 'a row for another fingerprint')
    assert.equal(classify(anchors, current, [removed({ id: OTHER, from_fp: anchors[OTHER].sha256 })]).length, 1, 'a row for another id')
  })

  it('ledgerAnchorFindings: an id the ledger removed needs no anchor, and one that is still anchored is reported', () => {
    const changed = { row: 1, id: ID, kind: 'changed', from_fp: SHA_A, to_fp: SHA_B, reason: 'r', decided_by: 'owner', date: '2026-10-13' }
    assert.deepEqual(ledgerAnchorFindings({}, [changed, removed({ row: 2, from_fp: SHA_B })]), [])
    const findings = ledgerAnchorFindings({ [ID]: exercise(SHA_C) }, [removed()])
    assert.deepEqual(findings.map((f) => [f.code, f.id, f.row]), [['LEDGER_NEWEST_ROW_NOT_ANCHOR', ID, 1]])
  })

  it('ledgerAnchorFindings: an id that came back after its removal holds the anchor of the row that brought it back', () => {
    const back = { row: 2, id: ID, kind: 'added', from_fp: null, to_fp: SHA_C, reason: 'r', decided_by: 'owner', date: '2026-10-13' }
    assert.deepEqual(ledgerAnchorFindings({ [ID]: exercise(SHA_C) }, [removed(), back]), [])
    assert.equal(ledgerAnchorFindings({}, [removed(), back]).length, 1)
  })
})

describe('CODEOWNERS: the B11 guard and its state are the owner\'s files', () => {
  const owners = readFileSync(join(ROOT, '.github/CODEOWNERS'), 'utf8')
    .split('\n')
    .map((line) => line.trim().split(/\s+/))
    .filter(([pattern]) => pattern && !pattern.startsWith('#'))
  const ownerOf = (path) => owners.find(([pattern]) => pattern === `/${path}`)?.slice(1)

  it('lists the exercise-meaning script and the fingerprint collector, each with an owner', () => {
    for (const path of ['scripts/exercise_meaning.mjs', 'scripts/exercise_fingerprints.mts']) {
      assert.ok(existsSync(join(ROOT, path)), `${path} must exist`)
      assert.deepEqual(ownerOf(path), ['@PillB'], `${path} needs its own CODEOWNERS line`)
    }
  })

  it('covers the anchors and the ledger through /audit/safe-agent/, which must keep an owner', () => {
    assert.ok(existsSync(join(ROOT, ANCHORS_PATH)) && existsSync(join(ROOT, LEDGER_PATH)))
    assert.deepEqual(ownerOf('audit/safe-agent/'), ['@PillB'])
  })
})

describe('CLI and sentinel: an anchor change needs a row, and an old row is never rewritten', () => {
  const git = (dir, ...args) => execFileSync('git', ['-c', 'user.name=meaning-test', '-c', 'user.email=meaning-test@example.invalid', '-c', 'commit.gpgsign=false', ...args], { cwd: dir, encoding: 'utf8' }).trim()
  const exercise = (fp) => ({ section: 'S05', sha256: fp, tokens: ['x'] })

  function repo(files) {
    const dir = mkdtempSync(join(tmpdir(), 'exercise-meaning-'))
    tempDirs.push(dir)
    git(dir, 'init', '-q', '-b', 'main')
    write(dir, files)
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', 'base')
    return { dir, base: git(dir, 'rev-parse', 'HEAD') }
  }

  function write(dir, files) {
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), text)
    }
  }

  const anchorsFile = (sha) => JSON.stringify({ schema: 'exercise_meaning_anchors/1', exercises: { 'S05-T1-A-E1': exercise(sha) } })
  const ledgerFile = (rows) => JSON.stringify({ schema: 'exercise_meaning_ledger/1', rows })
  const changedRow = (over = {}) => ({ row: 1, id: 'S05-T1-A-E1', kind: 'changed', from_fp: SHA_A, to_fp: SHA_B, reason: 'reescrito', decided_by: 'owner O17', date: '2026-10-13', ...over })

  it('fails the CLI on an anchor change that has no ledger row', () => {
    const { dir, base } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_B) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base', base], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /ANCHOR_CHANGED_UNLEDGERED/)
  })

  it('fails the CLI when an old ledger row is rewritten, even with a new row added', () => {
    // The base is coherent: its one row ended at SHA_B, so SHA_B is the anchor and the new row starts there.
    const { dir, base } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_B), [LEDGER_PATH]: ledgerFile([changedRow()]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_C), [LEDGER_PATH]: ledgerFile([changedRow({ reason: 'borrado' }), changedRow({ row: 2, from_fp: SHA_B, to_fp: SHA_C })]) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base', base], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /LEDGER_ROW_EDITED/)
  })

  it('fails the CLI, never passes it, when the base commit cannot be read', () => {
    const { dir } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base', 'no-such-commit'], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /not a commit git can read/)
  })

  it('fails the CLI when --ledger-base is given without a commit', () => {
    const { dir } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base'], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /needs a commit/)
  })

  it('fails the CLI on an appended row that does not start at the anchor the base held', () => {
    const { dir, base } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_B), [LEDGER_PATH]: ledgerFile([changedRow({ from_fp: SHA_C })]) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base', base], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /LEDGER_CHAIN_BROKEN/)
  })

  it('passes the CLI when the change comes with an appended row that names it', () => {
    const { dir, base } = repo({ [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_B), [LEDGER_PATH]: ledgerFile([changedRow()]) })
    const run = spawnSync(process.execPath, [CLI, '--ledger-base', base], { cwd: dir, encoding: 'utf8' })
    assert.equal(run.status, 0, run.stderr)
  })

  // The smallest tree the sentinel can read: one imported section and a one-section roadmap.
  const CURRICULUM = {
    'src/lib/course/index.ts': "import { section01 } from './sections/s01-one'\n",
    'src/lib/course/sections/s01-one.ts': "export const section01 = {\n  id: 'one',\n  index: 1,\n}\n",
    'src/lib/progress-sanitize.ts': `export const PROGRESS_FIELDS = ${JSON.stringify(PROGRESS_FIELDS)}\n`,
    'learning_roadmap_52_V3.md': '### S1 — Uno\n',
  }

  /** The sentinel run in `dir` against `base`, with the environment's base variables removed. */
  function runSentinel(dir, base) {
    const env = { ...process.env }
    for (const key of ['PRESERVATION_BASE', 'GITHUB_BASE_SHA', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete env[key]
    return spawnSync(process.execPath, [SENTINEL, '--base', base], { cwd: dir, encoding: 'utf8', env })
  }

  const sentinelResult = (dir) => JSON.parse(readFileSync(join(dir, 'audit/safe-agent/preservation-sentinel-result.json'), 'utf8'))

  it('fails the preservation sentinel on the same unledgered change, in the sentinel CLI', () => {
    const { dir, base } = repo({ ...CURRICULUM, [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_B) })
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', 'anchor changed without a row')
    const run = runSentinel(dir, base)
    assert.equal(run.status, 1)
    const result = sentinelResult(dir)
    assert.ok(result.failures.some((f) => f.code === 'EXERCISE_MEANING_LEDGER' && /ANCHOR_CHANGED_UNLEDGERED/.test(JSON.stringify(f))), JSON.stringify(result.failures))
  })

  it('fails the preservation sentinel on an appended row that does not start at the anchor the base held', () => {
    const { dir, base } = repo({ ...CURRICULUM, [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: anchorsFile(SHA_B), [LEDGER_PATH]: ledgerFile([changedRow({ from_fp: SHA_C })]) })
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', 'a row that skips a step')
    assert.equal(runSentinel(dir, base).status, 1)
    const failures = sentinelResult(dir).failures.filter((f) => f.code === 'EXERCISE_MEANING_LEDGER')
    assert.deepEqual(failures.map((f) => f.rule), ['LEDGER_CHAIN_BROKEN'])
  })

  it('fails the preservation sentinel when the anchors the base had are deleted', () => {
    const { dir, base } = repo({ ...CURRICULUM, [ANCHORS_PATH]: anchorsFile(SHA_A), [LEDGER_PATH]: ledgerFile([]) })
    git(dir, 'rm', '-q', ANCHORS_PATH)
    git(dir, 'commit', '-q', '-m', 'anchors deleted')
    const run = runSentinel(dir, base)
    assert.equal(run.status, 1)
    assert.ok(sentinelResult(dir).failures.some((f) => f.code === 'EXERCISE_ANCHORS_REMOVED'), JSON.stringify(sentinelResult(dir).failures))
  })

  const twoAnchors = (shaA, shaB) => JSON.stringify({ schema: 'exercise_meaning_anchors/1', exercises: { 'S05-T1-A-E1': exercise(shaA), 'S05-T1-A-E2': exercise(shaB) } })
  const oneAnchor = (sha) => JSON.stringify({ schema: 'exercise_meaning_anchors/1', exercises: { 'S05-T1-A-E2': exercise(sha) } })
  const removedRow = (over = {}) => ({ row: 1, id: 'S05-T1-A-E1', kind: 'removed', from_fp: SHA_A, to_fp: null, reason: 'retirado del curso', decided_by: 'owner: O25 (2026-10-13)', date: '2026-10-13', ...over })

  /** The sentinel's exercise-meaning failures after a commit that drops exercise E1 from the anchors. */
  function sentinelAfterRemoval(rows) {
    const { dir, base } = repo({ ...CURRICULUM, [ANCHORS_PATH]: twoAnchors(SHA_A, SHA_B), [LEDGER_PATH]: ledgerFile([]) })
    write(dir, { [ANCHORS_PATH]: oneAnchor(SHA_B), [LEDGER_PATH]: ledgerFile(rows) })
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', 'exercise E1 leaves the course')
    runSentinel(dir, base)
    return sentinelResult(dir).failures.filter((f) => f.code === 'EXERCISE_MEANING_LEDGER')
  }

  it('fails the preservation sentinel on an exercise that leaves the anchors with no removed row', () => {
    const failures = sentinelAfterRemoval([])
    assert.deepEqual(failures.map((f) => f.rule), ['ANCHOR_REMOVED'])
  })

  it('passes the preservation sentinel when a removed row names the owner decision', () => {
    assert.deepEqual(sentinelAfterRemoval([removedRow()]), [])
  })

  it('fails the preservation sentinel on a removed row that names no owner decision', () => {
    const failures = sentinelAfterRemoval([removedRow({ decided_by: 'medido' })])
    assert.deepEqual(failures.map((f) => f.rule), ['LEDGER_ROW_INVALID', 'ANCHOR_REMOVED'])
  })

  it('stays dormant before any anchors exist: neither the base nor HEAD has them, so nothing is compared', () => {
    const { dir, base } = repo({ ...CURRICULUM })
    write(dir, { 'notes.txt': 'unrelated change\n' })
    git(dir, 'add', '-A')
    git(dir, 'commit', '-q', '-m', 'unrelated')
    runSentinel(dir, base)
    assert.deepEqual(sentinelResult(dir).failures.filter((f) => f.code.startsWith('EXERCISE_')), [])
  })
})
