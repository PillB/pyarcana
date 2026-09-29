'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CLOUD_CONFIG, isGatingStage } from '@/lib/cloud/config'
import { useCloudStage } from '@/lib/cloud/hooks'
import type { MePayload, MeSubscription } from '@/lib/cloud/session'
import { cancelSubscription, startTrial, type UiError } from '@/lib/cloud/account-api'
import { canUpgrade, cancelBodyKey, formatDate, planStatus } from '@/lib/cloud/billing-ui'
import { buildSurveyBody, CANCEL_REASONS } from '@/lib/cloud/survey-ui'
import type { Language } from '@/lib/i18n'
import { ErrorAlert, StatusNote } from './Alerts'
import { applyMe, cloudApi, useAccountUi, useAuthMethods } from './runtime'
import { useText, type Tr } from './text'

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function planLine(me: MePayload, tr: Tr, lang: Language): string {
  const s = planStatus(me, Math.floor(Date.now() / 1000))
  if (!s.pro || !s.sourceKey) return tr('account.plan.free', { n: CLOUD_CONFIG.gate.freeSections })
  const end = s.indefinite ? tr('account.plan.indefinite') : s.endsAt ? tr('account.plan.until', { date: formatDate(s.endsAt, lang) }) : ''
  return `${tr(s.sourceKey)}. ${end}`.trim()
}

function upcomingLine(me: MePayload, tr: Tr, lang: Language): string | null {
  const next = me.access.upcoming[0]
  if (!next) return null
  return tr('account.plan.upcoming', { kind: tr(`account.plan.kind.${next.kind}`), date: formatDate(next.start, lang) })
}

export function PlanSection({ me }: { me: MePayload }) {
  const { tr, lang } = useText()
  const upcoming = upcomingLine(me, tr, lang)
  return (
    <Section title={tr('account.plan.heading')}>
      <p className="text-sm" data-testid="account-plan">{planLine(me, tr, lang)}</p>
      {upcoming && <p className="text-xs text-muted-foreground">{upcoming}</p>}
    </Section>
  )
}

/** Opt-in trial (never automatic), with the credit rule stated before the click. */
export function TrialSection({ me }: { me: MePayload }) {
  const { tr } = useText()
  const stage = useCloudStage()
  const days = useAuthMethods((s) => s.trialDays)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<UiError | null>(null)
  if (!isGatingStage(stage) || !me.account.trialAvailable || me.access.isPro) return null
  const start = async () => {
    setBusy(true)
    const r = await startTrial(cloudApi())
    setBusy(false)
    if (r.ok) applyMe(r.me)
    else setError(r.error)
  }
  return (
    <div className="space-y-2">
      <Button onClick={() => void start()} disabled={busy} data-testid="account-trial">
        {days ? tr('account.trial.ctaDays', { days }) : tr('account.trial.cta')}
      </Button>
      <p className="text-xs text-muted-foreground">{tr('account.trial.note')}</p>
      <ErrorAlert error={error} />
    </div>
  )
}

/** Pay buttons live in the confirm panel, which exists only in stage 'paid'. */
export function UpgradeSection({ me }: { me: MePayload }) {
  const { tr } = useText()
  const stage = useCloudStage()
  const show = useAccountUi((s) => s.show)
  if (!isGatingStage(stage) || !canUpgrade(me)) return null
  if (stage !== 'paid') return <p className="text-xs text-muted-foreground">{tr('account.upgrade.notOpen')}</p>
  return (
    <Button variant="outline" onClick={() => show('checkout')} data-testid="account-upgrade">
      {tr('account.upgrade.cta')}
    </Button>
  )
}

const PROVIDER_NAMES: Record<string, string> = { mercadopago: 'Mercado Pago', creem: 'Creem' }
const PLANS = new Set(['pro_monthly', 'pro_yearly'])
const planName = (plan: string, tr: Tr) => (PLANS.has(plan) ? tr(`account.subs.plan.${plan}`) : 'Pro')
const KNOWN_STATUS = new Set(['active', 'past_due', 'canceled', 'pending'])

function subscriptionLine(s: MeSubscription, tr: Tr, lang: Language): string | null {
  const date = s.paidThrough ? formatDate(s.paidThrough, lang) : null
  if (s.status === 'past_due') return tr('account.subs.pastDue', { provider: PROVIDER_NAMES[s.provider] ?? s.provider })
  if (!date) return null
  const ending = s.cancelAtPeriodEnd || s.status === 'canceled'
  return ending ? tr('account.subs.endsAt', { date }) : tr('account.subs.renews', { date })
}

function CancelDialog({ sub, onDone }: { sub: MeSubscription; onDone: () => void }) {
  const { tr } = useText()
  const [reason, setReason] = useState('')
  const [error, setError] = useState<UiError | null>(null)
  const [busy, setBusy] = useState(false)
  const confirm = async () => {
    setBusy(true)
    const body = reason ? buildSurveyBody('cancel_reason', { reasonCode: reason }) : null
    if (body) void cloudApi().post('/v1/surveys', body)
    const r = await cancelSubscription(cloudApi(), sub.id)
    setBusy(false)
    if (!r.ok) return setError(r.error)
    applyMe(r.me)
    onDone()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">{tr('account.subs.cancel')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr('account.subs.cancelTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{tr(cancelBodyKey(sub, Math.floor(Date.now() / 1000)))}</AlertDialogDescription>
        </AlertDialogHeader>
        <label className="block space-y-1 text-sm">
          <span>{tr('account.subs.cancelReason')}</span>
          <select className="w-full rounded-md border border-input bg-background px-2 py-1.5" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">{tr('account.subs.cancelReasonNone')}</option>
            {CANCEL_REASONS.map((c) => (
              <option key={c} value={c}>{tr(`survey.cancel.${c}`)}</option>
            ))}
          </select>
        </label>
        <ErrorAlert error={error} />
        <AlertDialogFooter>
          <AlertDialogCancel>{tr('account.subs.keep')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(e) => {
              e.preventDefault()
              void confirm()
            }}
          >
            {tr('account.subs.cancelConfirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SubscriptionRow({ sub, onCancelled }: { sub: MeSubscription; onCancelled: () => void }) {
  const { tr, lang } = useText()
  const status = KNOWN_STATUS.has(sub.status) ? sub.status : 'other'
  const line = subscriptionLine(sub, tr, lang)
  const cancellable = (sub.status === 'active' || sub.status === 'past_due') && !sub.cancelAtPeriodEnd
  return (
    <li className="space-y-1 rounded-md border border-border p-3 text-sm">
      <p className="font-medium">
        {planName(sub.plan, tr)} · {tr(`account.subs.status.${status}`)}
      </p>
      {line && <p className="text-xs text-muted-foreground">{line}</p>}
      <div className="flex flex-wrap items-center gap-3">
        {cancellable && <CancelDialog sub={sub} onDone={onCancelled} />}
        {sub.manageUrl && (
          <a href={sub.manageUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-2">
            {tr('account.subs.manage', { provider: PROVIDER_NAMES[sub.provider] ?? sub.provider })}
          </a>
        )}
      </div>
    </li>
  )
}

export function SubscriptionSection({ me }: { me: MePayload }) {
  const { tr } = useText()
  const [done, setDone] = useState(false)
  if (me.subscriptions.length === 0) return null
  return (
    <Section title={tr('account.subs.heading')}>
      <ul className="space-y-2">
        {me.subscriptions.map((s) => (
          <SubscriptionRow key={s.id} sub={s} onCancelled={() => setDone(true)} />
        ))}
      </ul>
      <StatusNote text={done ? tr('account.subs.cancelled') : null} />
    </Section>
  )
}
