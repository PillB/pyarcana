'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { accountActionRequest, lookupRequest, parseAccountDetail, rectifyRequest, type AccountDetail, type AdminGrant } from '@/lib/cloud/admin-api'
import type { Language } from '@/lib/i18n'
import { formatDay } from '../LoadNote'
import { useText, type Tr } from '../text'
import { GrantRows, RevokeGrantDialog } from './AdminGrants'
import { Feedback, ReasonDialog, sendBuilt } from './shared'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

function Facts({ d, tr, lang }: { d: AccountDetail; tr: Tr; lang: Language }) {
  const a = d.account
  const access = d.access.isPro ? tr('adm.acct.pro', { source: d.access.source ?? '—', end: d.access.indefinite ? tr('adm.acct.noEnd') : formatDay(d.access.accessEnd, lang) }) : tr('adm.acct.free')
  const rows: Array<[string, string]> = [
    ['adm.acct.id', a.id],
    ['adm.acct.email', `${a.email ?? '—'} ${a.emailVerified ? tr('adm.acct.verified') : tr('adm.acct.unverified')}`],
    ['adm.acct.created', formatDay(a.createdAt, lang)],
    ['adm.acct.firstSignin', formatDay(a.firstSigninAt, lang)],
    ['adm.acct.access', access],
    ['adm.acct.identities', d.identities.map((i) => i.provider).join(', ') || '—'],
  ]
  return (
    <dl className="grid gap-1 text-sm sm:grid-cols-[12rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted-foreground">{tr(k)}</dt>
          <dd className="break-all">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Subscriptions({ d, tr, lang }: { d: AccountDetail; tr: Tr; lang: Language }) {
  if (!d.subscriptions.length) return <p className="text-sm text-muted-foreground">{tr('adm.acct.noSubs')}</p>
  return (
    <ul className="space-y-1 text-sm">
      {d.doubleSubscription && <li role="alert" className={ERROR_ALERT_CLASS}>{tr('adm.acct.double')}</li>}
      {d.subscriptions.map((s) => (
        <li key={s.id}>
          {s.provider} · {s.plan} · {s.status}{s.cancelAtPeriodEnd ? ` · ${tr('adm.acct.cancelling')}` : ''} · {tr('adm.acct.paidThrough', { date: formatDay(s.paidThrough, lang) })}
        </li>
      ))}
    </ul>
  )
}

function Rectify({ accountId, onDone }: { accountId: string; onDone: () => void }) {
  const { tr } = useText()
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [result, setResult] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const submit = async () => {
    const out = await sendBuilt('post', '/v1/admin/accounts/email', rectifyRequest(accountId, email, reason), tr)
    if (!out.ok) return setResult({ error: out.text, done: null })
    setResult({ error: null, done: tr('adm.acct.rectified') })
    onDone()
  }
  return (
    <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <h4 className="text-sm font-semibold">{tr('adm.acct.rectify')}</h4>
      <p className="text-xs text-muted-foreground">{tr('adm.acct.rectifyNote')}</p>
      <Label htmlFor="rect-email">{tr('adm.acct.newEmail')}</Label>
      <Input id="rect-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Label htmlFor="rect-reason">{tr('adm.reason')}</Label>
      <Input id="rect-reason" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} />
      <Feedback error={result.error} done={result.done} />
      <Button type="submit" variant="outline" size="sm">{tr('adm.acct.rectifySubmit')}</Button>
    </form>
  )
}

function DisableToggle({ d, onDone }: { d: AccountDetail; onDone: () => void }) {
  const { tr } = useText()
  const [open, setOpen] = useState(false)
  const disabled = d.account.disabledAt !== null
  const action = disabled ? 'enable' : 'disable'
  return (
    <>
      {disabled && <p className={ERROR_ALERT_CLASS}>{tr('adm.acct.disabled', { reason: d.account.disabledReason ?? '—' })}</p>}
      <Button variant={disabled ? 'outline' : 'destructive'} size="sm" onClick={() => setOpen(true)}>{tr(`adm.acct.${action}`)}</Button>
      <ReasonDialog
        open={open}
        title={tr(`adm.acct.${action}Title`)}
        body={tr(`adm.acct.${action}Body`)}
        confirm={tr(`adm.acct.${action}`)}
        onClose={() => setOpen(false)}
        tr={tr}
        onConfirm={async (reason) => {
          const out = await sendBuilt('post', `/v1/admin/accounts/${action}`, accountActionRequest(d.account.id, reason), tr)
          if (out.ok) onDone()
          return out.ok ? null : out.text
        }}
      />
    </>
  )
}

function AccountView({ d, reload }: { d: AccountDetail; reload: () => void }) {
  const { tr, lang } = useText()
  const [revoking, setRevoking] = useState<AdminGrant | null>(null)
  return (
    <article className="space-y-4 rounded-md border border-border p-4" data-testid="admin-account">
      <Facts d={d} tr={tr} lang={lang} />
      <h4 className="text-sm font-semibold">{tr('adm.acct.subs')}</h4>
      <Subscriptions d={d} tr={tr} lang={lang} />
      <h4 className="text-sm font-semibold">{tr('adm.tab.grants')}</h4>
      <GrantRows grants={d.grants} onRevoke={setRevoking} />
      <RevokeGrantDialog grant={revoking} onClose={() => setRevoking(null)} onDone={reload} />
      <p className="text-sm">{tr('adm.acct.roles', { roles: d.roles.map((r) => `${r.role} (${r.state})`).join(', ') || '—' })}</p>
      <DisableToggle d={d} onDone={reload} />
      <Rectify accountId={d.account.id} onDone={reload} />
    </article>
  )
}

/** "Cuentas": look one account up (an email travels in the POST body, never in a URL). */
export function AdminAccounts() {
  const { tr } = useText()
  const [target, setTarget] = useState('')
  const [detail, setDetail] = useState<AccountDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const lookup = async (text: string) => {
    const out = await sendBuilt('post', '/v1/admin/account/lookup', lookupRequest(text), tr)
    const parsed = out.ok ? parseAccountDetail(out.data) : null
    setDetail(parsed)
    setError(out.ok ? (parsed ? null : tr('cloudpage.loadFailed', { reason: 'bad_response' })) : out.text)
  }
  return (
    <div className="space-y-4">
      <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void lookup(target) }}>
        <div className="space-y-1">
          <Label htmlFor="acct-target">{tr('adm.target')}</Label>
          <Input id="acct-target" className="w-72" value={target} autoComplete="off" onChange={(e) => setTarget(e.target.value)} />
        </div>
        <Button type="submit" variant="outline">{tr('adm.acct.lookup')}</Button>
      </form>
      <Feedback error={error} done={null} />
      {detail && <AccountView d={detail} reload={() => void lookup(detail.account.id)} />}
    </div>
  )
}
