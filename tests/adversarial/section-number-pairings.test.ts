/**
 * G-10 (the ledger and exam-bank part): a stored section slug pairs with the section number it
 * sits under, and every bound section has one exam bank.
 *
 * section_ledger.json and the course-state/sNN_phase5_exam_bank.json files (one per bound section)
 * are keyed by number and carry the section's slug. A renumber moves a section's number; a row or
 * bank left at the old number pairs a slug with the wrong section, and no count notices. The rule
 * for a slug at a number: it is that section's id now, or a pre-V3 id the rename map
 * (section-id-migrations.ts) carries for it. There is no third case. The draft named one exception
 * (S40's pre-V3 slug, which the map did not carry); the owner mapped it (O25, batch B), so the
 * list is gone and a slug the map does not carry is named wherever it appears. No expectation below
 * pins a section number: each is read from the bindings by slug.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renameSectionId } from '../../src/lib/section-id-migrations.ts'
import { readBindings } from '../../scripts/course_bindings.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BANK_FILE = /^s(\d\d)_phase5_exam_bank\.json$/

interface Bound {
  readonly number: number
  readonly id: string | null
}

export interface LedgerRow {
  readonly id: string
  readonly section_id: string
}

export interface Bank {
  readonly file: string
  readonly section: string
  readonly section_id: string
}

/** Whether `slug` is an accepted id for section `number`. */
export function slugPairs(bindings: readonly Bound[], number: number, slug: string): boolean {
  const bound = bindings.find((b) => b.number === number)?.id
  if (bound === undefined || bound === null) return false
  return renameSectionId(slug) === bound
}

const pad = (n: number): string => String(n).padStart(2, '0')

/** One line per ledger row whose slug names a different section than its number. */
export function ledgerFailures(bindings: readonly Bound[], rows: readonly LedgerRow[]): string[] {
  const out: string[] = []
  for (const row of rows) {
    const number = Number(row.id.replace(/^S/, ''))
    if (!slugPairs(bindings, number, row.section_id)) {
      const bound = bindings.find((b) => b.number === number)?.id ?? 'no section'
      out.push(`section_ledger ${row.id} stores '${row.section_id}', but section ${number} is '${bound}'`)
    }
  }
  return out
}

/** One line per bank file that disagrees with its number, its section field or its section's slug, and per missing or doubled bank. */
export function bankFailures(bindings: readonly Bound[], banks: readonly Bank[]): string[] {
  const out: string[] = []
  if (banks.length !== bindings.length) out.push(`${banks.length} bank files, bindings ${bindings.length}`)
  const perNumber = new Map<number, number>()
  for (const bank of banks) {
    const fileNumber = Number(BANK_FILE.exec(bank.file)?.[1] ?? Number.NaN)
    const sectionNumber = Number(bank.section.replace(/^S/, ''))
    perNumber.set(fileNumber, (perNumber.get(fileNumber) ?? 0) + 1)
    if (sectionNumber !== fileNumber) {
      out.push(`${bank.file} says section ${bank.section}, but its name says S${pad(fileNumber)}`)
    }
    if (!slugPairs(bindings, fileNumber, bank.section_id)) {
      const bound = bindings.find((b) => b.number === fileNumber)?.id ?? 'no section'
      out.push(`${bank.file} stores section_id '${bank.section_id}', but section ${fileNumber} is '${bound}'`)
    }
  }
  for (const b of bindings) {
    const count = perNumber.get(b.number) ?? 0
    if (count === 0) out.push(`no bank file for section ${b.number}`)
    if (count > 1) out.push(`${count} bank files for section ${b.number}`)
  }
  return out
}

function realLedger(): LedgerRow[] {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'course-state/section_ledger.json'), 'utf-8')).sections
}

function realBanks(): Bank[] {
  const dir = path.join(ROOT, 'course-state')
  return fs
    .readdirSync(dir)
    .filter((f) => BANK_FILE.test(f))
    .sort()
    .map((file) => ({ file, ...JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) }))
}

describe('G-10 ledger and exam-bank pairings on the real tree', () => {
  it('every ledger row pairs its slug with its number', () => {
    assert.deepEqual(ledgerFailures(readBindings(ROOT), realLedger()), [])
  })

  it('every bank file pairs its number, its section field and its slug, with one bank per section', () => {
    assert.deepEqual(bankFailures(readBindings(ROOT), realBanks()), [])
  })
})

describe('G-10 recreations on the real bindings', () => {
  const bindings = readBindings(ROOT)
  /** The number the bindings give a section, by its slug: the only way a number enters a recreation. */
  const numberOf = (id: string): number => {
    const bound = bindings.find((b) => b.id === id)
    if (!bound) throw new Error(`no bound section has the slug ${id}`)
    return bound.number
  }
  const tag = (n: number): string => `S${pad(n)}`
  const bankFile = (n: number): string => `s${pad(n)}_phase5_exam_bank.json`

  it('a ledger row that moved to another number with its slug is named', () => {
    const n = numberOf('databases-orm')
    const rows = [{ id: tag(n), section_id: 'setup' }]
    assert.deepEqual(ledgerFailures(bindings, rows), [
      `section_ledger ${tag(n)} stores 'setup', but section ${n} is 'databases-orm'`,
    ])
  })

  it('a pre-V3 slug the rename map carries, at its own number, is accepted: the positive control', () => {
    const n = numberOf(renameSectionId('data-structures'))
    assert.deepEqual(ledgerFailures(bindings, [{ id: tag(n), section_id: 'data-structures' }]), [])
  })

  it('S40\'s pre-V3 slug is accepted at its own section and named at the section after it', () => {
    // Batch B (O25) put the slug in the rename map. The first section after it is read from the bindings.
    const slug = 'agentic-architecture'
    const id = renameSectionId(slug)
    assert.notEqual(id, slug, 'the rename map no longer carries the slug: this recreation is finished')
    const n = numberOf(id)
    const next = bindings.find((b) => b.number === n + 1)
    assert.ok(next, `${id} is the last section: the recreation needs a section after it`)
    assert.deepEqual(ledgerFailures(bindings, [{ id: tag(n), section_id: slug }]), [])
    assert.deepEqual(ledgerFailures(bindings, [{ id: tag(next.number), section_id: slug }]), [
      `section_ledger ${tag(next.number)} stores '${slug}', but section ${next.number} is '${next.id}'`,
    ])
  })

  it('a renamed slug follows its section when a renumber moves it: no number is stored with it', () => {
    // Fixture: the section moved from slot 4 to slot 6 and another section took slot 4.
    const slug = 'agentic-architecture'
    const moved = [
      { number: 4, id: 'newcomer' },
      { number: 6, id: renameSectionId(slug) },
    ]
    assert.equal(slugPairs(moved, 6, slug), true)
    assert.equal(slugPairs(moved, 4, slug), false)
  })

  it('there is no exception list: a pre-V3 slug the rename map does not carry is named at its own section', () => {
    // The draft excused S40's slug by name while the map lacked it. With no entry, no section excuses it.
    const fixture = [{ number: 1, id: 'alpha' }]
    assert.equal(slugPairs(fixture, 1, 'alpha'), true)
    assert.equal(slugPairs(fixture, 1, 'old-alpha'), false)
    assert.deepEqual(ledgerFailures(fixture, [{ id: 'S01', section_id: 'old-alpha' }]), [
      "section_ledger S01 stores 'old-alpha', but section 1 is 'alpha'",
    ])
    assert.deepEqual(bankFailures(fixture, [{ file: 's01_phase5_exam_bank.json', section: 'S01', section_id: 'old-alpha' }]), [
      "s01_phase5_exam_bank.json stores section_id 'old-alpha', but section 1 is 'alpha'",
    ])
  })

  it('a bank whose section field disagrees with its file name is named', () => {
    const file = numberOf('databases-orm')
    const field = numberOf('fastapi')
    const banks = [{ file: bankFile(file), section: tag(field), section_id: 'databases-orm' }]
    const failures = bankFailures(bindings, banks)
    assert.ok(failures.includes(`${bankFile(file)} says section ${tag(field)}, but its name says ${tag(file)}`), failures.join('\n'))
  })

  it('a bank whose slug belongs to another section is named', () => {
    const n = numberOf('databases-orm')
    const banks = [{ file: bankFile(n), section: tag(n), section_id: 'fastapi' }]
    const failures = bankFailures(bindings, banks)
    assert.ok(
      failures.includes(`${bankFile(n)} stores section_id 'fastapi', but section ${n} is 'databases-orm'`),
      failures.join('\n')
    )
  })

  it('a bank count that differs from the bindings is named, and so is a section left with no bank', () => {
    const three = [
      { binding: 'a', stem: 'a', id: 'alpha', number: 1, phase: 0 },
      { binding: 'b', stem: 'b', id: 'beta', number: 2, phase: 0 },
      { binding: 'c', stem: 'c', id: 'gamma', number: 3, phase: 0 },
    ]
    const banks = [
      { file: 's01_phase5_exam_bank.json', section: 'S01', section_id: 'alpha' },
      { file: 's02_phase5_exam_bank.json', section: 'S02', section_id: 'beta' },
    ]
    const failures = bankFailures(three, banks)
    assert.ok(failures.includes('2 bank files, bindings 3'), failures.join('\n'))
    assert.ok(failures.includes('no bank file for section 3'), failures.join('\n'))
  })

  it('two banks for one section are named', () => {
    const three = [{ binding: 'a', stem: 'a', id: 'alpha', number: 1, phase: 0 }]
    const banks = [
      { file: 's01_phase5_exam_bank.json', section: 'S01', section_id: 'alpha' },
      { file: 's01_phase5_exam_bank.json', section: 'S01', section_id: 'alpha' },
    ]
    assert.ok(bankFailures(three, banks).includes('2 bank files for section 1'))
  })
})
