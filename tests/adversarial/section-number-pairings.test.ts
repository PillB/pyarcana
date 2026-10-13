/**
 * G-10 (the ledger and exam-bank part): a stored section slug pairs with the section number it
 * sits under, and every bound section has one exam bank.
 *
 * section_ledger.json and the 52 course-state/sNN_phase5_exam_bank.json files are keyed by number
 * and carry the section's slug. A renumber moves a section's number; a row or bank left at the
 * old number pairs a slug with the wrong section, and no count notices. The rule for a slug at a
 * number: it is that section's id now, or a pre-V3 id the rename map (section-id-migrations.ts)
 * carries for it, or a pre-V3 id named in UNMAPPED_LEGACY_IDS. The last list is the owner's to
 * shrink: it holds the one pre-V3 id the rename map does not yet carry (S40, see the PR report).
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

/** A pre-V3 slug the rename map does not carry, the number it sat under, and the id that section has now. */
export const UNMAPPED_LEGACY_IDS: readonly { slug: string; number: number; id: string }[] = [
  { slug: 'agentic-architecture', number: 40, id: 'architecture-ddd-decisions' },
]

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
  if (renameSectionId(slug) === bound) return true
  return UNMAPPED_LEGACY_IDS.some((u) => u.slug === slug && u.number === number && u.id === bound)
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

  it('the unmapped list holds the one named exception, and nothing else', () => {
    assert.equal(UNMAPPED_LEGACY_IDS.length, 1, 'the owner decides this list; it may only shrink')
    assert.equal(UNMAPPED_LEGACY_IDS[0].slug, 'agentic-architecture')
  })
})

describe('G-10 recreations on the real bindings', () => {
  const bindings = readBindings(ROOT)

  it('a ledger row that moved to another number with its slug is named', () => {
    const rows = [{ id: 'S19', section_id: 'setup' }]
    assert.deepEqual(ledgerFailures(bindings, rows), ["section_ledger S19 stores 'setup', but section 19 is 'databases-orm'"])
  })

  it('a pre-V3 slug the rename map carries, at its own number, is accepted: the positive control', () => {
    assert.deepEqual(ledgerFailures(bindings, [{ id: 'S03', section_id: 'data-structures' }]), [])
  })

  it('the named S40 exception is accepted at 40 and named at any other number', () => {
    assert.deepEqual(ledgerFailures(bindings, [{ id: 'S40', section_id: 'agentic-architecture' }]), [])
    assert.deepEqual(
      ledgerFailures(bindings, [{ id: 'S41', section_id: 'agentic-architecture' }]),
      ["section_ledger S41 stores 'agentic-architecture', but section 41 is 'llm-finetuning'"]
    )
  })

  it('a bank whose section field disagrees with its file name is named', () => {
    const banks = [{ file: 's19_phase5_exam_bank.json', section: 'S21', section_id: 'databases-orm' }]
    const failures = bankFailures(bindings, banks)
    assert.ok(failures.includes('s19_phase5_exam_bank.json says section S21, but its name says S19'), failures.join('\n'))
  })

  it('a bank whose slug belongs to another section is named', () => {
    const banks = [{ file: 's19_phase5_exam_bank.json', section: 'S19', section_id: 'fastapi' }]
    const failures = bankFailures(bindings, banks)
    assert.ok(
      failures.includes("s19_phase5_exam_bank.json stores section_id 'fastapi', but section 19 is 'databases-orm'"),
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
