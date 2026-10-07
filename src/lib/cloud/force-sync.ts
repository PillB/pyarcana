/**
 * The guard in front of a FORCED sync: the "Sincronizar ahora" button and Ctrl/⌘ + Alt + S (owner
 * request, 5 Oct 2026). Autosave is never affected: it keeps its debounce and maximum wait, so
 * refusing a force never loses progress. A force only asks for "now".
 *
 * Rules, in order:
 * 1. signed out, or the owner choice still pending: refused;
 * 2. the server asked us to wait (a 429 or 503 retryAfter, or offline backoff): refused until then.
 *    Before this guard the button cancelled that wait and sent two uploads per click;
 * 3. a cooldown in force: refused, with the seconds left;
 * 4. less than FORCE_FLOOR_MS since the last force: refused;
 * 5. flip-flop: the forced documents alternate between two states (A, B, A), as when someone
 *    checks and unchecks a box and forces each time. The force is refused and a cooldown starts,
 *    longer each time: 30 s, 2 min, 10 min. Ten minutes without a force resets the ladder;
 * 6. nothing changed since the server's last acknowledgement: no upload ("Ya está guardado").
 *    It still counts as a force for rule 4.
 *
 * Rule 5 compares the learner's progress (sections, steps, quiz scores, bookmarks), not the
 * uploaded document: the document carries a change log with timestamps, so "unchecked again" is
 * never byte-identical to before. Rule 6 compares the whole document, since that is what an
 * upload would send.
 */

export const FORCE_FLOOR_MS = 10_000
export const FORCE_COOLDOWNS_MS = [30_000, 120_000, 600_000] as const
export const FORCE_RESET_MS = 600_000
const HISTORY = 4

export interface ForceState {
  /** When the last force was allowed (0 = never). */
  lastAt: number
  /** Hashes of the documents of recent forces, oldest first; seeded with the acknowledged one. */
  history: string[]
  /** How many cooldowns have been applied on the current ladder (0..3). */
  step: number
  /** No force before this time (0 = none). */
  until: number
}

export const INITIAL_FORCE_STATE: ForceState = { lastAt: 0, history: [], step: 0, until: 0 }

export interface ForceInput {
  now: number
  signedIn: boolean
  choicePending: boolean
  /** The server's back-off: no upload before this time (ProgressSync.notBefore). */
  notBefore: number
  /** Hash of the progress a push would send now (rule 5). */
  docHash: string
  /** Hash of the progress the server last acknowledged, or null when unknown. */
  ackedHash: string | null
  /** The whole document equals the acknowledged one (rule 6); defaults to docHash === ackedHash. */
  unchanged?: boolean
}

export type ForceDecision =
  | { action: 'push' | 'unchanged' }
  | { action: 'refused'; reason: 'signed_out' | 'choice' | 'backoff' | 'cooldown' | 'floor' | 'flipflop'; waitMs: number }

/** A, B, A at the end of the history: two states alternating. */
function alternating(h: string[]): boolean {
  const n = h.length
  return n >= 3 && h[n - 1] === h[n - 3] && h[n - 1] !== h[n - 2]
}

function refused(reason: Extract<ForceDecision, { action: 'refused' }>['reason'], waitMs: number): ForceDecision {
  return { action: 'refused', reason, waitMs: Math.max(0, Math.ceil(waitMs)) }
}

/** Rules 1-4: refusals that change nothing. */
function precheck(state: ForceState, i: ForceInput): ForceDecision | null {
  if (!i.signedIn) return refused('signed_out', 0)
  if (i.choicePending) return refused('choice', 0)
  if (i.notBefore > i.now) return refused('backoff', i.notBefore - i.now)
  if (state.until > i.now) return refused('cooldown', state.until - i.now)
  if (state.lastAt > 0 && i.now - state.lastAt < FORCE_FLOOR_MS) return refused('floor', state.lastAt + FORCE_FLOOR_MS - i.now)
  return null
}

/** Decide one forced sync and return the guard's next state. Pure: the clock comes in `i.now`. */
export function decideForce(state: ForceState, i: ForceInput): { decision: ForceDecision; next: ForceState } {
  const early = precheck(state, i)
  if (early) return { decision: early, next: state }
  // Quiet time counts from the later of the last force and the end of its cooldown: waiting out a
  // cooldown is not ten quiet minutes.
  const fresh = state.lastAt === 0 || i.now - Math.max(state.lastAt, state.until) >= FORCE_RESET_MS
  const step = fresh ? 0 : state.step
  const seed = fresh || state.history.length === 0 ? (i.ackedHash === null ? [] : [i.ackedHash]) : state.history
  const history = [...seed, i.docHash].slice(-HISTORY)
  if (alternating(history)) {
    const nextStep = Math.min(step + 1, FORCE_COOLDOWNS_MS.length)
    const wait = FORCE_COOLDOWNS_MS[nextStep - 1]
    return { decision: refused('flipflop', wait), next: { lastAt: i.now, history: [i.docHash], step: nextStep, until: i.now + wait } }
  }
  const next: ForceState = { lastAt: i.now, history, step, until: 0 }
  const unchanged = i.unchanged ?? (i.ackedHash !== null && i.docHash === i.ackedHash)
  return { decision: { action: unchanged ? 'unchanged' : 'push' }, next }
}
