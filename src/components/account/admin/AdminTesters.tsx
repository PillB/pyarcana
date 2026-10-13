'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_STATES, parseRoleList, roleRequest, roleRevokeRequest, rolesPath, type AdminRole, type RoleState } from '@/lib/cloud/admin-api'
import type { Language } from '@/lib/i18n'
import { LoadNote, SELECT_CLASS, formatDay } from '../LoadNote'
import { useApiLoad } from '../useApiLoad'
import { useText, type Tr } from '../text'
import { DaysFields } from './AdminGrants'
import { Feedback, ReasonDialog, sendBuilt } from './shared'

const EMPTY = { target: '', daysText: '30', indefinite: false, note: '' }

function RoleCreate({ onDone }: { onDone: () => void }) {
  const { tr } = useText()
  const [form, setForm] = useState(EMPTY)
  const [result, setResult] = useState<{ error: string | null; done: string | null }>({ error: null, done: null })
  const patch = (p: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...p }))
  const submit = async () => {
    const out = await sendBuilt('post', '/v1/admin/roles', roleRequest(form), tr)
    if (!out.ok) return setResult({ error: out.text, done: null })
    setResult({ error: null, done: tr('adm.testers.done') })
    setForm(EMPTY)
    onDone()
  }
  return (
    <form className="space-y-3 rounded-md border border-border p-4" onSubmit={(e) => { e.preventDefault(); void submit() }}>
      <h3 className="font-semibold">{tr('adm.testers.new')}</h3>
      <p className="text-xs text-muted-foreground">{tr('adm.testers.what')}</p>
      <div className="space-y-1">
        <Label htmlFor="role-target">{tr('adm.target')}</Label>
        <Input id="role-target" value={form.target} autoComplete="off" onChange={(e) => patch({ target: e.target.value })} />
      </div>
      <DaysFields id="role" daysText={form.daysText} indefinite={form.indefinite} onDays={(daysText) => patch({ daysText })} onIndefinite={(indefinite) => patch({ indefinite })} tr={tr} />
      <div className="space-y-1">
        <Label htmlFor="role-note">{tr('adm.note')}</Label>
        <Input id="role-note" value={form.note} maxLength={200} onChange={(e) => patch({ note: e.target.value })} />
      </div>
      <Feedback error={result.error} done={result.done} />
      <Button type="submit">{tr('adm.testers.submit')}</Button>
    </form>
  )
}

function RoleRow({ r, onRevoke, tr, lang }: { r: AdminRole; onRevoke: (r: AdminRole) => void; tr: Tr; lang: Language }) {
  const until = r.expiresAt === null ? tr('adm.testers.noEnd') : tr('adm.testers.until', { date: formatDay(r.expiresAt, lang) })
  return (
    <li className="flex flex-wrap items-start justify-between gap-2 px-3 py-2 text-sm">
      <div>
        <span className="font-medium">{r.email ?? r.accountId}</span> · {r.state}
        <span className="block text-xs text-muted-foreground">{tr('adm.testers.since', { date: formatDay(r.createdAt, lang) })} · {until}{r.note ? ` · ${r.note}` : ''}</span>
      </div>
      {r.state === 'active' && <Button variant="outline" size="sm" onClick={() => onRevoke(r)}>{tr('adm.revoke')}</Button>}
    </li>
  )
}

/** "Testers": the tester role (DESIGN-v3 §H), granted for fixed days or indefinitely. */
export function AdminTesters() {
  const { tr, lang } = useText()
  const [nonce, setNonce] = useState(0)
  const [state, setState] = useState<RoleState>('active')
  const [revoking, setRevoking] = useState<AdminRole | null>(null)
  const reload = () => setNonce((n) => n + 1)
  const load = useApiLoad(rolesPath(state), parseRoleList, nonce)
  const roles = load?.status === 'ok' ? load.value : null
  return (
    <div className="space-y-5">
      <RoleCreate onDone={reload} />
      <Label className="flex items-center gap-2 font-normal">
        {tr('adm.state')}
        <select className={SELECT_CLASS} value={state} onChange={(e) => setState(e.target.value as RoleState)}>
          {ROLE_STATES.map((s) => <option key={s} value={s}>{tr(`adm.roleState.${s}`)}</option>)}
        </select>
      </Label>
      <LoadNote state={load} />
      {roles && !roles.length && <p className="text-sm text-muted-foreground">{tr('adm.testers.none')}</p>}
      {roles && roles.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {roles.map((r) => <RoleRow key={`${r.accountId}-${r.createdAt}`} r={r} onRevoke={setRevoking} tr={tr} lang={lang} />)}
        </ul>
      )}
      <ReasonDialog
        open={revoking !== null}
        title={tr('adm.testers.revokeTitle')}
        body={tr('adm.testers.revokeBody', { who: revoking?.email ?? revoking?.accountId ?? '' })}
        confirm={tr('adm.revoke')}
        onClose={() => setRevoking(null)}
        tr={tr}
        onConfirm={async (reason) => {
          const out = await sendBuilt('post', '/v1/admin/roles/revoke', roleRevokeRequest(revoking?.accountId ?? '', reason), tr)
          if (out.ok) reload()
          return out.ok ? null : out.text
        }}
      />
    </div>
  )
}
