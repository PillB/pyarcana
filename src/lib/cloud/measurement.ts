/**
 * The client side of experiments and events at runtime (DESIGN-v3 §F): one instance per page.
 *
 * - GET /v1/experiments is public and carries no id, so it runs before consent: the consent card
 *   asks only when some experiment is enabled.
 * - arm(key): null when the experiment is not enabled; otherwise the arm, with the exposure logged
 *   once per device for enrolled visitors in EVERY arm (experiments.ts). Excluded visitors
 *   (no consent, GPC/DNT, automation, QA mode, staff, Pro on gate surfaces) get the control arm and
 *   send nothing; no measurement id exists without consent.
 * - track(event): same exclusions; events are batched and sent on flush (keepalive on page hide).
 * - bind(accountId): POST /v1/me/experiments/bind {cid} once per account and id, so trial starts can
 *   be attributed to an arm. The worker answers with the account's stored arms (the first arm per
 *   account and experiment wins); they are kept per account and, while that account is signed in,
 *   replace the id-derived arm for an enrolled visitor. Forced arms and exclusions still come first.
 *   The exposure dedupe stays per device: an exposure already logged here is not logged again.
 */
import type { ApiClient } from '@/lib/cloud/api'
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'
import {
  ExposureQueue,
  decideArm,
  exclusionReason,
  getOrCreateCid,
  parseExperiments,
  type EventBatch,
  type ExclusionContext,
  type Experiment,
  type TrackedEvent,
} from '@/lib/cloud/experiments'

export const BOUND_KEY = 'pyarcana-exp-bound-v1'
export const ACCOUNT_ARMS_KEY = 'pyarcana-exp-account-arms-v1'
const ARM_TOKEN = /^[a-z0-9_]{1,40}$/i
const MAX_ACCOUNT_ARMS = 50

/** The `arms` map from the bind answer, reduced to short token strings. */
export function sanitizeAccountArms(raw: unknown): Record<string, string> {
  if (!isPlainObject(raw)) return {}
  const entries = Object.entries(raw).filter(([k, v]) => ARM_TOKEN.test(k) && typeof v === 'string' && ARM_TOKEN.test(v))
  return Object.fromEntries(entries.slice(0, MAX_ACCOUNT_ARMS)) as Record<string, string>
}
export type MeasurementContext = Omit<ExclusionContext, 'surface'>

export interface MeasurementDeps {
  api: ApiClient
  storage: KeyValueStorage | null
  context: () => MeasurementContext
  search: () => string
  /** The signed-in account, if any; its stored arms apply only while it is signed in. */
  accountId?: () => string | null
}

export class Measurement {
  private readonly deps: MeasurementDeps
  private readonly queue: ExposureQueue
  private list: Promise<Experiment[]> | null = null
  private keepalive = false

  constructor(deps: MeasurementDeps) {
    this.deps = deps
    this.queue = new ExposureQueue({ storage: deps.storage, send: (batch) => this.send(batch) })
  }

  private async send(batch: EventBatch): Promise<boolean> {
    const r = await this.deps.api.post('/v1/events', batch, { keepalive: this.keepalive })
    return r.ok
  }

  experiments(): Promise<Experiment[]> {
    this.list = this.list ?? this.deps.api.get('/v1/experiments').then((r) => (r.ok ? parseExperiments(r.data) : []))
    return this.list
  }

  /** The measurement id when this visitor may be measured (no exclusion applies), else null. */
  private cid(surface: string): { cid: string | null; ctx: ExclusionContext } {
    const ctx = { ...this.deps.context(), surface }
    const excluded = exclusionReason(ctx) !== null
    return { cid: excluded ? null : getOrCreateCid(this.deps.storage, ctx.canMeasure), ctx }
  }

  async arm(key: string): Promise<string | null> {
    const exp = (await this.experiments()).find((e) => e.key === key)
    if (!exp) return null
    const { cid, ctx } = this.cid(exp.surface)
    const decided = decideArm({ exp, cid, exclusion: exclusionReason(ctx), search: this.deps.search() })
    const stored = decided.reason === 'assigned' ? this.accountArm(exp) : null
    const decision = stored ? { ...decided, arm: stored } : decided
    this.queue.expose(exp, decision, cid)
    return decision.arm
  }

  /** The arm the signed-in account already has for this experiment, when it is still a valid arm. */
  private accountArm(exp: Experiment): string | null {
    const account = this.deps.accountId?.() ?? null
    const saved = account ? readJson(this.deps.storage, ACCOUNT_ARMS_KEY) : null
    if (!isPlainObject(saved) || saved.account !== account) return null
    const arm = sanitizeAccountArms(saved.arms)[exp.key]
    return arm && exp.arms.includes(arm) ? arm : null
  }

  track(event: TrackedEvent): void {
    const { cid } = this.cid(event.surface ?? 'page')
    if (cid) this.queue.track(cid, event)
  }

  async flush(keepalive: boolean): Promise<void> {
    this.keepalive = keepalive
    await this.queue.flush()
  }

  /** Bound with this id and account, and the account's arms are on hand (older binds lack them). */
  private alreadyBound(cid: string, accountId: string): boolean {
    const bound = readJson(this.deps.storage, BOUND_KEY)
    const arms = readJson(this.deps.storage, ACCOUNT_ARMS_KEY)
    const sameBind = isPlainObject(bound) && bound.cid === cid && bound.account === accountId
    return sameBind && isPlainObject(arms) && arms.account === accountId
  }

  async bind(accountId: string): Promise<void> {
    const { cid } = this.cid('account')
    if (!cid) return
    if (this.alreadyBound(cid, accountId)) return
    const r = await this.deps.api.post('/v1/me/experiments/bind', { cid })
    if (!r.ok) return
    writeJson(this.deps.storage, ACCOUNT_ARMS_KEY, { account: accountId, arms: sanitizeAccountArms(isPlainObject(r.data) ? r.data.arms : null) })
    writeJson(this.deps.storage, BOUND_KEY, { cid, account: accountId })
  }
}
