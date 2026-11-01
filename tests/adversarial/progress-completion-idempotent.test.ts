import assert from 'node:assert/strict'
import { test } from 'node:test'
import { useProgressStore } from '../../src/lib/progress-store'

test('a passing quiz may report success twice without undoing stored progress', () => {
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    } }, configurable: true,
  })
  useProgressStore.setState({
    completedSubSteps: { setup: [] }, completedSections: [], quizScores: {},
  })
  const first = useProgressStore.getState()
  first.markSubStepDone('setup', 'quiz')
  first.markSubStepDone('setup', 'quiz')
  assert.deepEqual(useProgressStore.getState().completedSubSteps.setup, ['quiz'])

  first.markSectionComplete('setup')
  first.markSectionComplete('setup')
  assert.deepEqual(useProgressStore.getState().completedSections, ['setup'])
  const persisted = JSON.parse(storage.get('python-ds-progress') ?? '{}')
  assert.deepEqual(persisted.state.completedSubSteps.setup, ['quiz'])
  assert.deepEqual(persisted.state.completedSections, ['setup'])

  // Negative counterexample: toggle APIs are intentionally reversible and
  // MUST NOT be used by an automatic success event.
  first.toggleSubStep('setup', 'quiz')
  assert.deepEqual(useProgressStore.getState().completedSubSteps.setup, [])
  useProgressStore.getState().markSubStepDone('setup', 'quiz')
})
