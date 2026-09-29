'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  GRANT_KINDS,
  GRANT_STATES,
  grantRequest,
  grantWindow,
  grantsPath,
  parseGrantList,
  revokeGrantRequest,
  type AdminGrant,
  type GrantForm,
  type GrantKind,
  type GrantState,
} from '@/lib/cloud/admin-api'
import type { Language } from '@/lib/i18n'
import { LoadNote, SELECT_CLASS, formatDay } from '../LoadNote'
import { useApiLoad } from '../useApiLoad'
import { useText, type Tr } from '../text'
import { Feedback, ReasonDialog, newRequestId, sendBuilt } from './shared'

/** Fixed days or indefinite (DESIGN-v3 §H); shared by gifts and the tester role. */
export function DaysFields({ id, daysText, indefinite, onDays, onIndefinite, tr }: {
  id: string
  daysText: string
  indefinite: boolean
  onDays: (v: string) => void
  onIndefinite: (v: boolean) => void
  tr: Tr
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <Label htmlFor={`${id}-days`}>{tr('adm.days')}</Label>
        <Input id={`${id}-days`} inputMode="numeric" className="w-28" value={daysText} disabled={indefinite} onChange={(e) => onDays(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pb-2">
        <Checkbox id={`${id}-indef`} checked={indefinite} onCheckedChange={(v) => onIndefinite(v === true)} />
        <Label htmlFor={`${id}-indef`} className="font-normal">{tr('adm.indefinite')}</Label>
      </div>
    </div>
  )
}

const EMPTY_FORM: GrantForm = { target: '', daysText: '30', indefinite: false, kind: 'gift', note: '' }

function GrantCreate({ onDone }: { onDone: () => void }) {
  const { tr } = useText()
  const [form, setForm] = useState<GrantForm>(EMPTY_FORM)
  const [requestId, setRequestId] = useState(newRequestId)
  const [result, setResult] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const [busy, setBusy] = useState(false)
  const patch = (p: Partial<GrantForm>) => setForm((f) => ({ ...f, ...p }))
  const submit = async () => {
    setBusy(true)
    const out = await sendBuilt('post', '/v1/admin/grants', grantRequest(form, requestId), tr)
    setBusy(false)
    if (!out.ok) return setResult({ error: out.text, done: null })
    setResult({ error: null, done: tr('adm.grants.done') })
    setForm(EMPTY_FORM)
    setRequestId(newRequestId())
    onDone()
  }
  return (
    <form className="space-y-3 rounded-md border border-border p-4" onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <h3 className="font-semibold">{tr('adm.grants.new')}</h3>
      <div className="space-y-1">
        <Label htmlFor="grant-target">{tr('adm.target')}</Label>
        <Input id="grant-target" value={form.target} autoComplete="off" onChange={(e) => patch({ target: e.target.value })} />
      </div>
      <DaysFields id="grant" daysText={form.daysText} indefinite={form.indefinite} onDays={(daysText) => patch({ daysText })} onIndefinite={(indefinite) => patch({ indefinite })} tr={tr} />
      <div className="space-y-1">
        <Label htmlFor="grant-kind">{tr('adm.kind')}</Label>
        <select id="grant-kind" className={SELECT_CLASS} value={form.kind} onChange={(e) => patch({ kind: e.target.value as GrantKind })}>
          {GRANT_KINDS.map((k) => <option key={k} value={k}>{tr(`adm.kind.${k}`)}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="grant-note">{tr('adm.note')}</Label>
        <Input id="grant-note" value={form.note} maxLength={200} onChange={(e) => patch({ note: e.target.value })} />
      </div>
      <p className="text-xs text-muted-foreground">{tr('adm.grants.startsAt')}</p>
      <Feedback error={result.error} done={result.done} />
      <Button type="submit" disabled={busy}>{tr('adm.grants.submit')}</Button>
    </form>
  )
}

function windowText(g: AdminGrant, tr: Tr, lang: Language): string {
  const w = grantWindow(g)
  if (w.kind === 'pending') return g.days === null ? tr('adm.window.pendingIndef') : tr('adm.window.pending', { days: g.days })
  if (w.kind === 'indefinite') return tr('adm.window.indefinite', { start: formatDay(w.start, lang) })
  if (w.kind === 'revoked') return tr('adm.window.revoked', { end: formatDay(w.end, lang) })
  return tr('adm.window.dates', { start: formatDay(w.start, lang), end: formatDay(w.end, lang) })
}

const REVOCABLE = new Set(['active', 'upcoming', 'pending_activation'])

function GrantRow({ g, onRevoke, tr, lang }: { g: AdminGrant; onRevoke: (g: AdminGrant) => void; tr: Tr; lang: Language }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-2 px-3 py-2 text-sm">
      <div>
        <span className="font-medium">{g.email ?? g.accountId}</span> · {tr(`adm.kind.${g.kind}`)} · {g.state}
        <span className="block text-xs text-muted-foreground">{windowText(g, tr, lang)}{g.note ? ` · ${g.note}` : ''}</span>
        {g.revokeReason && <span className="block text-xs text-muted-foreground">{tr('adm.revokedFor', { reason: g.revokeReason })}</span>}
      </div>
      {REVOCABLE.has(g.state) && <Button variant="outline" size="sm" onClick={() => onRevoke(g)}>{tr('adm.revoke')}</Button>}
    </li>
  )
}

export function GrantRows({ grants, onRevoke }: { grants: AdminGrant[]; onRevoke: (g: AdminGrant) => void }) {
  const { tr, lang } = useText()
  if (!grants.length) return <p className="text-sm text-muted-foreground">{tr('adm.grants.none')}</p>
  return (
    <ul className="divide-y divide-border rounded-md border border-border" data-testid="admin-grants">
      {grants.map((g) => <GrantRow key={g.id} g={g} onRevoke={onRevoke} tr={tr} lang={lang} />)}
    </ul>
  )
}

/** Revoke a grant with the reason the worker keeps; `onDone` reloads whatever listed it. */
export function RevokeGrantDialog({ grant, onClose, onDone }: { grant: AdminGrant | null; onClose: () => void; onDone: () => void }) {
  const { tr } = useText()
  return (
    <ReasonDialog
      open={grant !== null}
      title={tr('adm.grants.revokeTitle')}
      body={tr('adm.grants.revokeBody', { who: grant?.email ?? grant?.accountId ?? '' })}
      confirm={tr('adm.revoke')}
      onClose={onClose}
      tr={tr}
      onConfirm={async (reason) => {
        const out = await sendBuilt('post', '/v1/admin/grants/revoke', revokeGrantRequest(grant?.id ?? '', reason), tr)
        if (out.ok) onDone()
        return out.ok ? null : out.text
      }}
    />
  )
}

function GrantList({ nonce, reload }: { nonce: number; reload: () => void }) {
  const { tr } = useText()
  const [kind, setKind] = useState<GrantKind | ''>('')
  const [state, setState] = useState<GrantState>('active')
  const [revoking, setRevoking] = useState<AdminGrant | null>(null)
  const load = useApiLoad(grantsPath({ kind, state }), parseGrantList, nonce)
  const list = load?.status === 'ok' ? load.value : null
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Label className="flex items-center gap-2 font-normal">
          {tr('adm.kind')}
          <select className={SELECT_CLASS} value={kind} onChange={(e) => setKind(e.target.value as GrantKind | '')}>
            <option value="">{tr('qasite.filter.any')}</option>
            {GRANT_KINDS.map((k) => <option key={k} value={k}>{tr(`adm.kind.${k}`)}</option>)}
          </select>
        </Label>
        <Label className="flex items-center gap-2 font-normal">
          {tr('adm.state')}
          <select className={SELECT_CLASS} value={state} onChange={(e) => setState(e.target.value as GrantState)}>
            {GRANT_STATES.map((s) => <option key={s} value={s}>{tr(`adm.grantState.${s}`)}</option>)}
          </select>
        </Label>
      </div>
      <LoadNote state={load} />
      {list?.partial && <p className="text-xs text-muted-foreground">{tr('adm.grants.partial')}</p>}
      {list && <GrantRows grants={list.grants} onRevoke={setRevoking} />}
      <RevokeGrantDialog grant={revoking} onClose={() => setRevoking(null)} onDone={reload} />
    </section>
  )
}

/** "Pro regalado": gifts and tester Pro, fixed days or indefinite; the list by kind and state. */
export function AdminGrants() {
  const [nonce, setNonce] = useState(0)
  const reload = () => setNonce((n) => n + 1)
  return (
    <div className="space-y-5">
      <GrantCreate onDone={reload} />
      <GrantList nonce={nonce} reload={reload} />
    </div>
  )
}
