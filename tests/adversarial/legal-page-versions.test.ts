/**
 * Adversarial guard: a legal page whose meaning changed carries a new version and effective date.
 *
 * The badge notice and the credential policy were rewritten on 2026-10-13 to say what PyArcana does
 * today: the revocation, versioning, review and verification promises they made are withdrawn, and
 * the storage sentence follows the build. A reader of "Versión 1.0 · 2026-07-29" would take the
 * withdrawn promises as in force and the new text as old. Other legal pages show the repo bumps on a
 * material change (data-rights 1.2, 2026-10-05).
 *
 * Each page below is pinned to the version and date it carried before that rewrite; it must now
 * declare a later version and a date on or after the rewrite. The numbers are the page's own props,
 * read from its source.
 *
 * Not covered: nothing forces a bump the next time one of these pages changes. A fingerprint of the
 * page text per version would, at the cost of a failure on every typo fix and a merge conflict
 * between parallel branches; the owner has not asked for it.
 *
 * Run: node --import tsx --test tests/adversarial/legal-page-versions.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

/** The day the copy of both pages was rewritten. */
const REWRITTEN_ON = '2026-10-13'

const PAGES: ReadonlyArray<{ file: string; before: { version: string; effectiveDate: string } }> = [
  { file: 'src/app/badge-notice/page.tsx', before: { version: '1.0', effectiveDate: '2026-07-29' } },
  { file: 'src/app/credential-policy/page.tsx', before: { version: '2.0', effectiveDate: '2026-07-31' } },
]

/** The `version` and `effectiveDate` props of the page's LegalPage, whatever the line breaks. */
function declared(file: string): { version: string; effectiveDate: string } {
  const source = readFileSync(join(ROOT, file), 'utf8')
  const version = /version="([^"]+)"/.exec(source)?.[1]
  const effectiveDate = /effectiveDate="([^"]+)"/.exec(source)?.[1]
  assert.ok(version && effectiveDate, `${file} declares no version or effective date`)
  return { version, effectiveDate }
}

/** True when dotted version `a` is later than `b`, comparing each part as a number. */
function later(a: string, b: string): boolean {
  const left = a.split('.').map(Number)
  const right = b.split('.').map(Number)
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const [x, y] = [left[i] ?? 0, right[i] ?? 0]
    if (x !== y) return x > y
  }
  return false
}

describe('legal pages rewritten on 2026-10-13', () => {
  for (const { file, before } of PAGES) {
    it(`${file} declares a later version than ${before.version}`, () => {
      const { version } = declared(file)
      assert.ok(later(version, before.version), `still version ${version}`)
    })

    it(`${file} declares an effective date on or after the rewrite, not ${before.effectiveDate}`, () => {
      const { effectiveDate } = declared(file)
      assert.match(effectiveDate, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(effectiveDate >= REWRITTEN_ON, `effective ${effectiveDate}`)
    })
  }

  it('the version comparison reads 1.10 as later than 1.9, not earlier', () => {
    assert.equal(later('1.10', '1.9'), true)
    assert.equal(later('1.0', '1.0'), false)
    assert.equal(later('2.0', '2.1'), false)
  })
})
