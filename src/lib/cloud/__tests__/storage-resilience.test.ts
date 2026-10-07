import test from 'node:test'
import assert from 'node:assert/strict'
import {
  completedSteps,
  NUDGE_KEY,
  NUDGE_MIN_STEPS,
  NUDGE_SNOOZE_MS,
  nudgeDismissedAt,
  PERSIST_KEY,
  rememberedPersist,
  requestPersistOnce,
  showSigninNudge,
} from '@/lib/cloud/storage-resilience'
import { createMemoryStorage } from '@/lib/cloud/storage'

// Owner request 4 Oct 2026: the browser copy is the fallback, so ask the browser to keep it once,
// and nudge signed-out learners with real progress towards the account copy.

test('persist is asked once: the answer is stored and never asked again', async () => {
  const storage = createMemoryStorage()
  let asked = 0
  const manager = { persisted: async () => false, persist: async () => { asked++; return true } }
  assert.equal(await requestPersistOnce(manager, storage), 'granted')
  assert.equal(await requestPersistOnce(manager, storage), 'granted')
  assert.equal(asked, 1)
  assert.equal(storage.getItem(PERSIST_KEY), 'granted')
})

test('persist: already persisted needs no prompt; refusal, error and a missing API are recorded', async () => {
  let asked = 0
  assert.equal(await requestPersistOnce({ persisted: async () => true, persist: async () => { asked++; return false } }, createMemoryStorage()), 'granted')
  assert.equal(asked, 0, 'no prompt when the browser already keeps it')
  assert.equal(await requestPersistOnce({ persist: async () => false }, createMemoryStorage()), 'denied')
  assert.equal(await requestPersistOnce({ persist: async () => { throw new Error('x') } }, createMemoryStorage()), 'denied')
  const none = createMemoryStorage()
  assert.equal(await requestPersistOnce(undefined, none), 'unsupported')
  assert.equal(rememberedPersist(none), 'unsupported')
  none.setItem(PERSIST_KEY, 'maybe')
  assert.equal(rememberedPersist(none), null, 'junk is not an answer')
})

test('steps count every completed sub-step across sections', () => {
  assert.equal(completedSteps({ completedSubSteps: { setup: ['theory', 'practice'], pandas: ['theory'] } }), 3)
  assert.equal(completedSteps({ completedSubSteps: {} }), 0)
})

test('the nudge: signed out, accounts on, enough progress, and not snoozed', () => {
  const base = { signedIn: false, isStaticSite: true, stage: 'sync' as const, steps: NUDGE_MIN_STEPS, dismissedAt: null, now: 1_000_000_000_000 }
  assert.equal(showSigninNudge(base), true)
  assert.equal(showSigninNudge({ ...base, steps: NUDGE_MIN_STEPS - 1 }), false, 'not before there is something to lose')
  assert.equal(showSigninNudge({ ...base, signedIn: true }), false)
  assert.equal(showSigninNudge({ ...base, stage: 'off' }), false, 'never where accounts are off')
  assert.equal(showSigninNudge({ ...base, isStaticSite: false }), false)
  assert.equal(showSigninNudge({ ...base, dismissedAt: base.now - NUDGE_SNOOZE_MS + 1 }), false, '"Ahora no" holds for a week')
  assert.equal(showSigninNudge({ ...base, dismissedAt: base.now - NUDGE_SNOOZE_MS }), true, 'then it may show again')
  const s = createMemoryStorage()
  assert.equal(nudgeDismissedAt(s), null)
  s.setItem(NUDGE_KEY, '1700000000000')
  assert.equal(nudgeDismissedAt(s), 1_700_000_000_000)
  s.setItem(NUDGE_KEY, 'soon')
  assert.equal(nudgeDismissedAt(s), null)
})
