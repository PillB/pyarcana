/**
 * Client side of A/B experiments (DESIGN-v3 §F), trimmed from Vocal Studio's experiments.js.
 *
 * - Unit: a random 16-byte id (`pyarcana-exp-cid`), created ONLY when measurement is allowed
 *   (consent, no GPC/DNT). It is not the account id.
 * - Assignment: FNV-1a 32 of `cid:key`, mod 10000, against cumulative weights. Deterministic.
 * - Excluded visitors (GPC, DNT, no consent, automation, QA mode, admins, testers, Pro on gate
 *   surfaces, access not yet known) get the control arm (arms[0]) and send nothing.
 * - Exposure is logged at the divergence point in EVERY arm (control included), once per device.
 *   A metric only one arm emits crowned that arm at p ~ 1e-39 in Vocal; logging exposure in both
 *   arms is the guard.
 * - `?ab_<key>=<arm>` previews an arm for QA without enrolling or spending the exposure.
 */
import { randomBytes } from '@/lib/cloud/b64'
import { MEASUREMENT_ID_KEY, type PrivacySignals } from '@/lib/cloud/consent'
import type { AccessState } from '@/lib/cloud/access'
import { isPlainObject, readJson, readRaw, writeJson, writeRaw, type KeyValueStorage } from '@/lib/cloud/storage'

export const CID_KEY = MEASUREMENT_ID_KEY
export const SEEN_KEY = 'pyarcana-exp-seen-v1'
const BUCKETS = 10000
const BATCH = 25
const QUEUE_CAP = 200
const CID = /^[0-9a-f]{32}$/
const TOKEN = /^[a-z0-9_]{1,40}$/i

export interface Experiment {
  key: string
  arms: string[]
  weights: number[]
  surface: string
}

export const EVENT_NAMES = [
  'exposure',
  'gate_view',
  'gate_trial_click',
  'trial_card_view',
  'checkout_open',
  'house_ad_view',
  'house_ad_click',
  'ad_optin_shown',
  'ad_optin_accept',
  'section_complete',
  'session_start',
  'signin_nudge_view',
  'signin_nudge_click',
] as const
export type EventName = (typeof EVENT_NAMES)[number]

export interface TrackedEvent {
  name: EventName
  experiment?: string
  arm?: string
  surface?: string
  sectionIndex?: number
}

export function fnv1a32(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

export function assignArm(cid: string, exp: Experiment): string {
  const total = exp.weights.reduce((a, b) => a + b, 0)
  const point = (fnv1a32(`${cid}:${exp.key}`) % BUCKETS) * (total / BUCKETS)
  let cumulative = 0
  for (let i = 0; i < exp.arms.length; i++) {
    cumulative += exp.weights[i]
    if (point < cumulative) return exp.arms[i]
  }
  return exp.arms[0]
}

function validExperiment(e: Record<string, unknown>): Experiment | null {
  const { key, arms, weights, surface } = e
  if (typeof key !== 'string' || !TOKEN.test(key) || typeof surface !== 'string' || !TOKEN.test(surface)) return null
  if (!Array.isArray(arms) || !Array.isArray(weights) || arms.length < 2 || arms.length !== weights.length) return null
  if (!arms.every((a) => typeof a === 'string' && TOKEN.test(a)) || new Set(arms).size !== arms.length) return null
  if (!weights.every((w) => typeof w === 'number' && Number.isFinite(w) && w >= 0)) return null
  return weights.some((w) => w > 0) ? { key, arms, weights, surface } : null
}

/** GET /v1/experiments body -> the enabled experiments that are well formed. */
export function parseExperiments(raw: unknown): Experiment[] {
  const list = isPlainObject(raw) && Array.isArray(raw.experiments) ? raw.experiments : []
  return list.filter(isPlainObject).map(validExperiment).filter((e): e is Experiment => e !== null)
}

export type Exclusion = 'gpc' | 'dnt' | 'no_consent' | 'webdriver' | 'qa_mode' | 'admin' | 'tester' | 'pro' | 'access_unknown'

export interface ExclusionContext {
  canMeasure: boolean
  signals: PrivacySignals
  webdriver: boolean
  allowAutomation: boolean
  qaMode: boolean
  isAdmin: boolean
  isTester: boolean
  access: AccessState
  surface: string
}

type Rule = [Exclusion, (c: ExclusionContext) => boolean]
const gateSurface = (surface: string) => surface.includes('gate')

/** First matching rule names the exclusion. Staff and testers never enter the sample. */
const EXCLUSION_RULES: Rule[] = [
  ['gpc', (c) => c.signals.gpc],
  ['dnt', (c) => c.signals.dnt],
  ['no_consent', (c) => !c.canMeasure],
  ['webdriver', (c) => c.webdriver && !c.allowAutomation],
  ['qa_mode', (c) => c.qaMode],
  ['admin', (c) => c.isAdmin],
  ['tester', (c) => c.isTester],
  ['access_unknown', (c) => gateSurface(c.surface) && c.access === 'unknown'],
  ['pro', (c) => gateSurface(c.surface) && c.access === 'pro'],
]

export function exclusionReason(ctx: ExclusionContext): Exclusion | null {
  return EXCLUSION_RULES.find(([, rule]) => rule(ctx))?.[0] ?? null
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** The measurement id, created on first use only when measurement is allowed. */
export function getOrCreateCid(storage: KeyValueStorage | null, allowed: boolean, random: (n: number) => Uint8Array = randomBytes): string | null {
  if (!allowed) return null
  const existing = readRaw(storage, CID_KEY)
  if (existing && CID.test(existing)) return existing
  const cid = hex(random(16))
  return writeRaw(storage, CID_KEY, cid) ? cid : null
}

export function forcedArm(search: string, exp: Experiment): string | null {
  const value = new URLSearchParams(search).get(`ab_${exp.key}`)
  return value && exp.arms.includes(value) ? value : null
}

export interface ArmDecision {
  arm: string
  enrolled: boolean
  reason: 'assigned' | 'forced' | 'no_cid' | Exclusion
}

export function decideArm(i: { exp: Experiment; cid: string | null; exclusion: Exclusion | null; search: string }): ArmDecision {
  const forced = forcedArm(i.search, i.exp)
  if (forced) return { arm: forced, enrolled: false, reason: 'forced' }
  if (i.exclusion) return { arm: i.exp.arms[0], enrolled: false, reason: i.exclusion }
  if (!i.cid) return { arm: i.exp.arms[0], enrolled: false, reason: 'no_cid' }
  return { arm: assignArm(i.cid, i.exp), enrolled: true, reason: 'assigned' }
}

function validEvent(e: TrackedEvent): boolean {
  const optionalToken = (v: unknown) => v === undefined || (typeof v === 'string' && TOKEN.test(v))
  const indexOk = e.sectionIndex === undefined || (Number.isInteger(e.sectionIndex) && e.sectionIndex >= 1 && e.sectionIndex <= 999)
  return (EVENT_NAMES as readonly string[]).includes(e.name) && optionalToken(e.experiment) && optionalToken(e.arm) && optionalToken(e.surface) && indexOk
}

export interface EventBatch {
  cid: string
  events: TrackedEvent[]
}

export class ExposureQueue {
  private queue: Array<{ cid: string; event: TrackedEvent }> = []
  private readonly storage: KeyValueStorage | null
  private readonly send: (batch: EventBatch) => Promise<boolean>

  constructor(deps: { storage: KeyValueStorage | null; send: (batch: EventBatch) => Promise<boolean> }) {
    this.storage = deps.storage
    this.send = deps.send
  }

  size(): number {
    return this.queue.length
  }

  track(cid: string, event: TrackedEvent): boolean {
    if (!validEvent(event)) return false
    this.queue.push({ cid, event })
    if (this.queue.length > QUEUE_CAP) this.queue.splice(0, this.queue.length - QUEUE_CAP)
    return true
  }

  /** Log the exposure for an enrolled visitor, in whichever arm, once per device and experiment. */
  expose(exp: Experiment, decision: ArmDecision, cid: string | null): boolean {
    if (!decision.enrolled || !cid) return false
    const seen = readJson(this.storage, SEEN_KEY)
    const bag = isPlainObject(seen) && seen.cid === cid && isPlainObject(seen.arms) ? seen.arms : {}
    if (typeof bag[exp.key] === 'string') return false
    writeJson(this.storage, SEEN_KEY, { cid, arms: { ...bag, [exp.key]: decision.arm } })
    return this.track(cid, { name: 'exposure', experiment: exp.key, arm: decision.arm, surface: exp.surface })
  }

  /** Send one batch (<= 25 events of one id); failed sends keep the events for later. */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return
    const cid = this.queue[0].cid
    const batch = this.queue.filter((q) => q.cid === cid).slice(0, BATCH)
    const ok = await this.send({ cid, events: batch.map((q) => q.event) })
    if (ok) this.queue = this.queue.filter((q) => !batch.includes(q))
  }
}
