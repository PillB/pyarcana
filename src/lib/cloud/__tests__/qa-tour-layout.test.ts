import test from 'node:test'
import assert from 'node:assert/strict'
import { boldParts, placeTourPanel, TOUR_GAP, TOUR_MARGIN, TOUR_MIN_PANEL } from '@/lib/qa-tour-layout'

// Owner report 5 Oct 2026: the QA tutorial's highlighted control was sometimes behind its panel.

const box = (top: number, bottom: number) => ({ top, bottom, left: 100, right: 300 })
const covers = (height: number, t: { top: number; bottom: number }, p: ReturnType<typeof placeTourPanel>['placement']) => {
  if (p.kind === 'below') return p.top < t.bottom
  if (p.kind === 'above') return height - p.bottom > t.top
  return true
}

test('the panel never overlaps the control, wherever the control is', () => {
  const H = 698 // the window of the report
  for (let top = 0; top <= H - 40; top += 7) {
    const t = box(top, top + 40)
    const { placement } = placeTourPanel(H, t)
    assert.ok(!covers(H, t, placement), `control at ${top}: panel ${JSON.stringify(placement)} covers it`)
    // The panel also stays inside the workspace: its height is capped to the room on its side.
    if (placement.kind === 'below') assert.ok(placement.top + placement.maxHeight <= H - TOUR_MARGIN)
    if (placement.kind === 'above') assert.ok(placement.bottom + placement.maxHeight <= H - TOUR_MARGIN)
  }
})

test('the panel goes on the side with more room, one gap away from the control', () => {
  assert.deepEqual(placeTourPanel(700, box(100, 140)).placement, { kind: 'below', top: 140 + TOUR_GAP, maxHeight: 700 - 140 - TOUR_GAP - TOUR_MARGIN })
  assert.deepEqual(placeTourPanel(700, box(560, 600)).placement, { kind: 'above', bottom: 700 - 560 + TOUR_GAP, maxHeight: 560 - TOUR_GAP - TOUR_MARGIN })
})

test('a tall control in a short workspace is reported as not fitting, so the caller scrolls it', () => {
  // The report's case: a control in the middle of a 480 px workspace leaves under 220 px each side.
  const r = placeTourPanel(480, box(200, 280))
  assert.equal(r.fits, false)
  assert.ok(!covers(480, box(200, 280), r.placement), 'the best placement still does not cover it')
  // Scrolled to the top of its area, the same control leaves room below.
  assert.equal(placeTourPanel(480, box(60, 140)).fits, true)
  // Exactly the minimum counts as fitting.
  const edge = TOUR_MIN_PANEL + TOUR_GAP + TOUR_MARGIN
  assert.equal(placeTourPanel(600, box(0, 600 - edge)).fits, true)
  assert.equal(placeTourPanel(600, box(0, 600 - edge + 1)).fits, false)
})

test('a step with no control centres the panel', () => {
  assert.deepEqual(placeTourPanel(700, null), { placement: { kind: 'center' }, fits: true })
})

test('**bold** spans of the copy become bold parts and lose their asterisks', () => {
  assert.deepEqual(boldParts('Pulsa **Señalar elemento** y luego **Enviar**.'), [
    { text: 'Pulsa ', bold: false },
    { text: 'Señalar elemento', bold: true },
    { text: ' y luego ', bold: false },
    { text: 'Enviar', bold: true },
    { text: '.', bold: false },
  ])
  assert.deepEqual(boldParts('sin negritas'), [{ text: 'sin negritas', bold: false }])
  assert.deepEqual(boldParts('un * suelto'), [{ text: 'un * suelto', bold: false }])
})

test('every body in the real tutorial renders with no stray asterisks', async () => {
  const { QA_TOUR_STEPS } = await import('@/lib/qa-tour-content')
  for (const step of QA_TOUR_STEPS) {
    const shown = boldParts(step.body).map((p) => p.text).join('')
    assert.ok(!shown.includes('**'), `step "${step.title}" still shows ** after rendering`)
  }
})
