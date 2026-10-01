'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useToast } from '@/hooks/use-toast'
import { useCloudRuntime, useCloudSession, type MePayload } from '@/lib/cloud/session'
import { confirmWordFor, deleteAccount, exportAccount, exportFileBody, linkProvider, linkState, unlinkProvider, type ActionResult, type LinkProvider, type UiError } from '@/lib/cloud/account-api'
import { formatDate } from '@/lib/cloud/billing-ui'
import { listArchives, type SyncStatus } from '@/lib/cloud/progress-sync'
import { safeStorage } from '@/lib/cloud/storage'
import { ErrorAlert, StatusNote } from './Alerts'
import { GoogleButton } from './GoogleButton'
import { MicrosoftButton } from './SignInPanel'
import { Section } from './PlanSections'
import { applyMe, cloudApi, getProgressSync, signOutCloud, useAccountUi, useLoadedAuthMethods, useSyncUi } from './runtime'
import { useText } from './text'
import { DESTRUCTIVE_ACTION_CLASS, DESTRUCTIVE_HOVER_CLASS } from './a11y'

const SYNC_KEYS: Partial<Record<SyncStatus, string>> = {
  pulling: 'account.sync.busy',
  pushing: 'account.sync.busy',
  offline: 'account.sync.offline',
  error: 'account.sync.error',
  conflict: 'account.sync.conflict',
  too_large: 'account.sync.tooLarge',
  remote_unreadable: 'account.sync.unreadable',
  needs_choice: 'account.sync.choice',
}

export function SyncSection() {
  const { tr, lang } = useText()
  const status = useSyncUi((s) => s.status)
  const lastSyncAt = useCloudSession((s) => s.lastSyncAt)
  const [busy, setBusy] = useState(false)
  const special = SYNC_KEYS[status]
  const when = lastSyncAt ? formatDate(Math.floor(lastSyncAt / 1000), lang) : null
  const line = special ? tr(special) : when ? tr('account.sync.synced', { when }) : tr('account.sync.never')
  const syncNow = async () => {
    setBusy(true)
    await getProgressSync().pull()
    await getProgressSync().pushNow()
    setBusy(false)
  }
  return (
    <Section title={tr('account.sync.heading')}>
      <p role="status" className="text-sm" data-testid="account-sync-status">{line}</p>
      <Button variant="outline" size="sm" onClick={() => void syncNow()} disabled={busy || status === 'needs_choice'}>
        {tr('account.sync.now')}
      </Button>
      {status === 'needs_choice' && (
        <Button size="sm" className="ml-2" onClick={() => useSyncUi.setState({ choiceDeferred: false })}>{tr('account.sync.chooseNow')}</Button>
      )}
    </Section>
  )
}

export function ArchiveSection() {
  const { tr, lang } = useText()
  const [archives] = useState(() => listArchives(safeStorage()))
  const [note, setNote] = useState<string | null>(null)
  if (archives.length === 0) return null
  const restore = (key: string) => {
    const r = getProgressSync().restoreArchive(key)
    setNote(r.ok ? tr('account.archives.restored', { n: r.added }) : tr('account.error.generic'))
  }
  return (
    <Section title={tr('account.archives.heading')}>
      <p className="text-xs text-muted-foreground">{tr('account.archives.hint')}</p>
      <ul className="space-y-1">
        {archives.map((a) => (
          <li key={a.key} className="flex items-center justify-between gap-2 text-sm">
            <span>{tr('account.archives.item', { date: formatDate(Math.floor(a.ts / 1000), lang) })}</span>
            <Button variant="outline" size="sm" onClick={() => restore(a.key)}>{tr('account.archives.restore')}</Button>
          </li>
        ))}
      </ul>
      <StatusNote text={note} />
    </Section>
  )
}

function methodList(methods: string[], lang: string): string {
  return new Intl.ListFormat(lang, { type: 'conjunction' }).format(methods)
}

/** One linked provider's "Quitar" button and its confirmation (DELETE /v1/me/identities/:provider). */
function UnlinkDialog({ provider, onResult }: { provider: LinkProvider; onResult: (r: ActionResult) => void }) {
  const { tr } = useText()
  const [busy, setBusy] = useState(false)
  const method = tr(`account.method.${provider}`)
  const confirm = async () => {
    setBusy(true)
    const r = await unlinkProvider(cloudApi(), provider)
    setBusy(false)
    onResult(r)
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">{tr('account.unlink.button', { method })}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr('account.unlink.title', { method })}</AlertDialogTitle>
          <AlertDialogDescription>{tr('account.unlink.body', { method })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tr('account.delete.back')}</AlertDialogCancel>
          <AlertDialogAction className={DESTRUCTIVE_ACTION_CLASS} disabled={busy} onClick={() => void confirm()}>
            {tr('account.unlink.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function signedOutLocally(): void {
  useCloudSession.setState({ me: null, licenseToken: null, fetchedAt: Date.now() })
  useCloudRuntime.setState({ meStatus: 'signed_out', licence: { state: 'unchecked' } })
}

/**
 * The ways in the account holds (me.account.identities) and the ones it can add. A provider the
 * account already holds is not offered again; a Google or Microsoft identity can be removed while
 * another way in remains (the worker refuses the last one, 409 last_sign_in_method). Linking and
 * removing both need a sign-in from the last 10 minutes (401 reauth_required, explained).
 */
export function LinkSection({ me }: { me: MePayload }) {
  const { tr, lang } = useText()
  const { toast } = useToast()
  const methods = useLoadedAuthMethods()
  const [error, setError] = useState<UiError | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const current = me.account.signInMethod
  const state = linkState(me.account, methods)
  const onGoogle = async (idToken: string, noncePreimage: string) => {
    const r = await linkProvider(cloudApi(), 'google', { idToken, noncePreimage })
    if (!r.ok) return setError(r.error)
    applyMe(r.me)
    setDone(tr('account.link.done', { method: 'Google' }))
  }
  const onUnlinked = (provider: LinkProvider) => (r: ActionResult) => {
    const method = tr(`account.method.${provider}`)
    if (!r.ok) return setError(r.error)
    setError(null)
    if (r.data.signedOut === true) {
      signedOutLocally()
      return toast({ title: tr('account.unlink.signedOut', { method }) })
    }
    applyMe(r.me)
    setDone(tr('account.unlink.done', { method }))
  }
  return (
    <Section title={tr('account.link.heading')}>
      {state.linked.length > 0 && <p className="text-sm">{tr('account.link.linked', { methods: methodList(state.linked.map((m) => tr(`account.method.${m}`)), lang) })}</p>}
      {current && <p className="text-xs text-muted-foreground">{tr('account.link.current', { method: tr(`account.method.${current}`) })}</p>}
      {(state.offer.length > 0 || state.removable.length > 0) && <p className="text-xs text-muted-foreground">{tr('account.link.hint')}</p>}
      {state.offer.includes('google') && <GoogleButton enabled onToken={(t, p) => void onGoogle(t, p)} />}
      {state.offer.includes('microsoft') && <MicrosoftButton enabled purpose="link" label={tr('account.link.microsoft')} />}
      {state.removable.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {state.removable.map((p) => <UnlinkDialog key={p} provider={p} onResult={onUnlinked(p)} />)}
        </div>
      )}
      <ErrorAlert error={error} />
      <StatusNote text={done} />
    </Section>
  )
}

function download(body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'pyarcana-mis-datos.json'
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function DeleteDialog({ onDeleted }: { onDeleted: () => void }) {
  const { tr, lang } = useText()
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<UiError | null>(null)
  const [busy, setBusy] = useState(false)
  const word = confirmWordFor(lang)
  const confirm = async () => {
    setBusy(true)
    const r = await deleteAccount(cloudApi(), typed, lang)
    setBusy(false)
    if (!r.ok) return setError(r.error)
    onDeleted()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className={DESTRUCTIVE_HOVER_CLASS}>{tr('account.data.delete')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr('account.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>{tr('account.delete.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-1">
          <Label htmlFor="account-delete-word">{tr('account.delete.type', { word })}</Label>
          <Input id="account-delete-word" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
        </div>
        <ErrorAlert error={error} />
        <AlertDialogFooter>
          <AlertDialogCancel>{tr('account.delete.back')}</AlertDialogCancel>
          <AlertDialogAction
            className={DESTRUCTIVE_ACTION_CLASS}
            disabled={busy || typed.trim() === ''}
            onClick={(e) => {
              e.preventDefault()
              void confirm()
            }}
          >
            {tr('account.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DataSection() {
  const { tr } = useText()
  const { toast } = useToast()
  const close = useAccountUi((s) => s.setOpen)
  const [error, setError] = useState<UiError | null>(null)
  const exportData = async () => {
    const r = await exportAccount(cloudApi())
    const body = r.ok ? exportFileBody(r.data) : null
    if (body) return download(body)
    setError(r.ok ? { key: 'account.error.unavailable' } : r.error)
  }
  const onDeleted = () => {
    signedOutLocally()
    close(false)
    toast({ title: tr('account.delete.done') })
  }
  return (
    <Section title={tr('account.data.heading')}>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => void exportData()}>{tr('account.data.export')}</Button>
        <DeleteDialog onDeleted={onDeleted} />
      </div>
      <ErrorAlert error={error} />
    </Section>
  )
}

export function SignOutSection() {
  const { tr } = useText()
  const { toast } = useToast()
  const close = useAccountUi((s) => s.setOpen)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<UiError | null>(null)
  const signOut = async () => {
    setBusy(true)
    const r = await signOutCloud(false)
    setBusy(false)
    if (!r.ok && r.status !== 401) return setError(r.error)
    close(false)
    toast({ title: tr('account.signout.done') })
  }
  return (
    <div className="border-t border-border pt-4">
      <Button variant="ghost" onClick={() => void signOut()} disabled={busy} data-testid="account-signout">
        {tr('account.signout')}
      </Button>
      <ErrorAlert error={error} />
    </div>
  )
}
