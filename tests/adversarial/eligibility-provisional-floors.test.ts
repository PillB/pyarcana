/**
 * The provisional floors the TypeScript engine enforces are the catalog's (owner decision O27 102-Q1).
 *
 * src/lib/eligibility/types.ts holds a copy of provisional_floors, and engine.ts reads
 * critical_competency_pct from that copy. The catalog is the record each badge version is stated
 * under. No test compared the two, so a floor changed in the catalog would have been ignored at issuance
 * with no test failing. This test closes that gap without touching credential code. Removing the copy
 * is a separate ask-first change to src/lib/eligibility/.
 *
 * Run: node --import tsx --test tests/adversarial/eligibility-provisional-floors.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PROVISIONAL_FLOORS } from '../../src/lib/eligibility/types.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

describe('the floors the TypeScript engine enforces', () => {
  it('equal the catalog provisional_floors, key for key', () => {
    const catalog = JSON.parse(
      readFileSync(join(ROOT, 'src/lib/eligibility/badge_catalog.json'), 'utf8'),
    )
    assert.deepEqual({ ...PROVISIONAL_FLOORS }, catalog.provisional_floors)
  })
})
