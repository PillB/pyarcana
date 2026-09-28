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
 *   be attributed to an arm.
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
export type MeasurementContext = Omit<ExclusionContext, 'surface'>

export interface MeasurementDeps {
  api: ApiClient
  storage: KeyValueStorage | null
  context: () => MeasurementContext
  search: () => string
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
    const decision = decideArm({ exp, cid, exclusion: exclusionReason(ctx), search: this.deps.search() })
    this.queue.expose(exp, decision, cid)
    return decision.arm
  }

  track(event: TrackedEvent): void {
    const { cid } = this.cid(event.surface ?? 'page')
    if (cid) this.queue.track(cid, event)
  }

  async flush(keepalive: boolean): Promise<void> {
    this.keepalive = keepalive
    await this.queue.flush()
  }

  async bind(accountId: string): Promise<void> {
    const { cid } = this.cid('account')
    if (!cid) return
    const bound = readJson(this.deps.storage, BOUND_KEY)
    if (isPlainObject(bound) && bound.cid === cid && bound.account === accountId) return
    const r = await this.deps.api.post('/v1/me/experiments/bind', { cid })
    if (r.ok) writeJson(this.deps.storage, BOUND_KEY, { cid, account: accountId })
  }
}
