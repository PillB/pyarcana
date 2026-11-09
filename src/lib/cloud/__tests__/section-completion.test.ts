import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { quizPassChanges } from '@/lib/section-completion'

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
