/**
 * Adversarial guard: the capstone cards show no badge.
 *
 * Owner decision BSC-02 (audit/fixer/DECISIONS_2026-09-21.md, ALREADY_DECIDED): stop rendering the
 * Award chips on the capstone cards until BSC-01 settles what a badge may claim. Each card carried
 * an award icon and the badge id the capstone leads to ("integrated_python_ai_capstone_foundations"),
 * a chip that reads as an earned badge when PyArcana issues none. The badgeId stays in
 * src/lib/capstones/catalog.ts; only the chip goes.
 *
 * The badge notice used to say, as a permanent fact, that every capstone page shows that icon and
 * id. A sentence tied to a chip that can be removed is a sentence that turns false without a test
 * failing, so this file also fails if the notice says it again.
 *
 * Run: node --import tsx --test tests/adversarial/capstone-badge-chips.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CAPSTONES } from '../../src/lib/capstones/catalog.ts'
import { CapstonesPage } from '../../src/components/course/CapstonesPage.tsx'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')

function source(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

/** Every .ts and .tsx file under `dir`, relative to the repository. */
function files(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(join(ROOT, path)).isDirectory()) return files(path)
    return /\.tsx?$/.test(name) ? [relative(ROOT, join(ROOT, path))] : []
  })
}

describe('BSC-02: the capstone cards show no badge', () => {
  it('the catalog still holds a badgeId for every capstone: the data stays, only the chip goes', () => {
    assert.ok(CAPSTONES.length >= 13, `only ${CAPSTONES.length} capstones`)
    for (const cap of CAPSTONES) assert.ok(cap.badgeId, `${cap.id} lost its badgeId`)
  })

  it('the capstones page renders none of the catalog badge ids', () => {
    const html = renderToStaticMarkup(h(CapstonesPage, { animateEntrance: false, onOpenSection: () => {} }))
    assert.ok(html.includes(CAPSTONES[0].id), 'the page did not render the capstones, so this proves nothing')
    for (const cap of CAPSTONES) assert.ok(!html.includes(cap.badgeId), `the page renders the badge id ${cap.badgeId}`)
  })

  it('no component or page outside the verify page reads a badge id', () => {
    // /verify shows a credential someone was issued; the API routes are not pages.
    const readers = [...files('src/components'), ...files('src/app')]
      .filter((file) => !file.startsWith('src/app/api/') && file !== 'src/app/verify/page.tsx')
      .filter((file) => /\bbadgeId\b|\bbadge_id\b/.test(source(file)))
    assert.deepEqual(readers, [])
  })

  it('the badge notice does not say the capstone pages show a badge icon or id', () => {
    const notice = source('src/app/badge-notice/page.tsx').replace(/\s+/g, ' ').toLowerCase()
    for (const phrase of ['icono de premio', 'identificador de la insignia', 'página de capstone muestra']) {
      assert.ok(!notice.includes(phrase), `the badge notice says "${phrase}"`)
    }
  })
})
