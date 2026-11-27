import { chooseOs, loadSetupProgress, saveSetupProgress, toggleStep, isDone, type KeyValueStore, type SetupProgress } from './progress'
import type { SetupOs } from './os'

export type SetupIntent = { type: 'os'; os: SetupOs } | { type: 'step'; id: string; done: boolean }

export function applySetupIntent(progress: SetupProgress, intent: SetupIntent): SetupProgress {
  if (intent.type === 'os') return chooseOs(progress, intent.os)
  return isDone(progress, intent.id) === intent.done ? progress : toggleStep(progress, intent.id)
}

/** Rebase explicit intents on the latest saved record. Pending writes survive in memory.
 * This does not make simultaneous cross-process localStorage writes atomic.
 */
export function createSetupState(storage: () => KeyValueStore | null) {
  let pending: SetupIntent[] = []
  const current = () => pending.reduce(applySetupIntent, loadSetupProgress(storage()))
  const snapshot = () => ({ progress: current(), saveFailed: pending.length > 0 })
  const apply = (intent: SetupIntent) => {
    pending = pending.filter(old => !sameTarget(old, intent))
    pending.push(intent)
    const progress = current()
    const saved = saveSetupProgress(storage(), progress)
    if (saved) pending = []
    return { progress, saveFailed: !saved }
  }
  return { snapshot, apply }
}

function sameTarget(a: SetupIntent, b: SetupIntent): boolean {
  if (a.type === 'os') return b.type === 'os'
  return b.type === 'step' && a.id === b.id
}
