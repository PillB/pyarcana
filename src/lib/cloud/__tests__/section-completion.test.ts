import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { needsCompletionRepair, quizPassChanges, stepToggleChanges } from '@/lib/section-completion'

// Learner walkthrough, 5 Oct 2026: W01 (finishing a section un-finished it) and W12 (S19's
// playground was a SyntaxError before the learner typed anything).

const STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const

/** Apply the changes as SectionView does, through toggles, and return the resulting state. */
function pass(state: { steps: string[]; complete: boolean }) {
  const c = quizPassChanges(state.steps, state.complete, STEPS)
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  return { steps: c.markQuiz ? toggle(state.steps, 'quiz') : state.steps, complete: c.markSection ? !state.complete : state.complete }
}

test('passing, then pressing the result card button, leaves the section complete (W01)', () => {
  let s = { steps: ['theory', 'ido', 'wedo', 'youdo'], complete: false }
  s = pass(s) // the automatic call on a pass
  assert.deepEqual(s, { steps: ['theory', 'ido', 'wedo', 'youdo', 'quiz'], complete: true })
  s = pass(s) // «Marcar como completada»
  assert.deepEqual(s, { steps: ['theory', 'ido', 'wedo', 'youdo', 'quiz'], complete: true })
  s = pass(pass(s)) // two retakes
  assert.equal(s.complete, true)
  assert.ok(s.steps.includes('quiz'))
})

test('a pass with steps still open marks the quiz but not the section', () => {
  const s = pass({ steps: ['theory'], complete: false })
  assert.deepEqual(s, { steps: ['theory', 'quiz'], complete: false })
  // Finishing the rest later and passing again completes it.
  assert.equal(pass({ steps: ['theory', 'quiz', 'ido', 'wedo', 'youdo'], complete: false }).complete, true)
})

test('a section already complete is never un-completed by a pass', () => {
  assert.deepEqual(quizPassChanges(['quiz'], true, STEPS), { markQuiz: false, markSection: false })
  assert.deepEqual(quizPassChanges([], true, STEPS), { markQuiz: true, markSection: false })
})

test('every «Pruébalo tú mismo» playground is valid Python (W12)', () => {
  const src = readFileSync('src/components/course/SectionView.tsx', 'utf8')
  const body = src.slice(src.indexOf('function InteractivePlaygroundDemo'))
  const demos = [...body.matchAll(/\n\s*'?([\w-]+)'?: \{\s*\n\s*title: [^\n]*\n\s*code: `((?:\\.|[^`\\])*)`/g)]
  assert.ok(demos.length >= 52, `found ${demos.length} playgrounds; the pattern no longer matches the file`)
  // The template literal as the browser receives it (escapes resolved).
  const programs = demos.map((m) => ({ id: m[1], code: new Function(`return \`${m[2]}\``)() as string }))
  const script = 'import json,sys\nbad=[]\nfor d in json.load(sys.stdin):\n    try: compile(d["code"], d["id"], "exec")\n    except SyntaxError as e: bad.append(f"{d[\'id\']}: {e}")\nprint(json.dumps(bad))'
  const bad = JSON.parse(execFileSync('python3', ['-c', script], { input: JSON.stringify(programs) }).toString())
  assert.deepEqual(bad, [])
})

// --- state-machine audit, 25 Nov 2026: any step can be the last one -------------------------------
//
// Defect guarded: only a self-check pass marked the section complete. Check first, «Tú haces» last:
// every step done, header «Completada», but the menu, the dashboard count and «Continuar» (all read
// completedSections) said not done. Mutations that turn these red: return markSection false from
// stepToggleChanges (the old rule); let an untick un-complete; drop the repair.

/** Apply a step button press as SectionView does: toggle the step, mark (never toggle) the section. */
function press(state: { steps: string[]; complete: boolean }, step: string) {
  const c = stepToggleChanges(step, state.steps, state.complete, STEPS)
  const steps = state.steps.includes(step) ? state.steps.filter((x) => x !== step) : [...state.steps, step]
  return { steps, complete: state.complete || c.markSection }
}

/** Every order of the five steps, the check passed wherever it falls. */
function permutations<T>(xs: readonly T[]): T[][] {
  return xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]))
}

test('whatever order the five steps are finished in, the last one completes the section (120 orders)', () => {
  const orders = permutations(STEPS)
  assert.equal(orders.length, 120)
  for (const order of orders) {
    let s = { steps: [] as string[], complete: false }
    order.forEach((step, i) => {
      s = step === 'quiz' ? pass(s) : press(s, step)
      const last = i === order.length - 1
      assert.equal(s.complete, last, `order ${order.join('>')}: after "${step}" complete must be ${last} (header, menu and dashboard read it)`)
    })
  }
})

test('«Desmarcar» unmarks the step but never takes a finished section away; re-marking keeps it', () => {
  let s = { steps: [...STEPS] as string[], complete: true }
  s = press(s, 'youdo')
  assert.deepEqual(s, { steps: ['theory', 'ido', 'wedo', 'quiz'], complete: true })
  s = press(s, 'youdo')
  assert.equal(s.complete, true)
  assert.deepEqual(stepToggleChanges('theory', [...STEPS], true, STEPS), { toggleStep: true, markSection: false })
})

test('the repair targets exactly the state the old rule left behind', () => {
  assert.equal(needsCompletionRepair([...STEPS], false, STEPS), true, 'every step done, not complete: repair')
  assert.equal(needsCompletionRepair([...STEPS], true, STEPS), false, 'already complete: nothing to do')
  assert.equal(needsCompletionRepair(['theory', 'ido', 'wedo', 'youdo'], false, STEPS), false, 'a step missing: not finished')
  assert.equal(needsCompletionRepair([], false, []), false, 'no steps defined is not "all done"')
})

test('SectionView wires every step button through stepToggleChanges and marks the section idempotently', () => {
  const src = readFileSync('src/components/course/SectionView.tsx', 'utf8')
  for (const step of ['theory', 'ido', 'wedo', 'youdo']) {
    assert.ok(src.includes(`onDone={() => toggleStep('${step}')}`), `the ${step} button must go through toggleStep (stepToggleChanges), not a bare toggleSubStep`)
  }
  assert.equal(/toggleSectionComplete\(/.test(src), false, 'a toggle can un-complete a section when an effect or a double click runs twice; use markSectionComplete')
  assert.ok(/needsCompletionRepair\(/.test(src), 'opening a section must repair the every-step-done, not-complete state')
})
