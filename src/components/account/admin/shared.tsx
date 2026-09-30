'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ApiResult } from '@/lib/cloud/api'
import type { Built } from '@/lib/cloud/admin-api'
import { cloudApi } from '../runtime'
import type { Tr } from '../text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

export type Outcome = { ok: true; data: Record<string, unknown> } | { ok: false; text: string }

/** Admins see the worker's reason code: it is what they would look up in the worker's source. */
export function adminFailure(r: Exclude<ApiResult<unknown>, { ok: true }>, tr: Tr): string {
  if (r.status === 0) return tr('account.error.network')
  if (r.status >= 500) return tr('account.error.unavailable')
  return tr('adm.error.server', { reason: r.reason })
}

/** Send a built body (or report why it was not built). Never throws. */
export async function sendBuilt(method: 'post' | 'patch', path: string | null, built: Built, tr: Tr): Promise<Outcome> {
  if (!built.ok) return { ok: false, text: tr(built.key) }
  if (path === null) return { ok: false, text: tr('adm.error.target') }
  const r = await cloudApi()[method](path, built.body)
  return r.ok ? { ok: true, data: r.data } : { ok: false, text: adminFailure(r, tr) }
}

/** One id per form fill: a double click or a retry after a timeout creates one grant, not two. */
export function newRequestId(): string {
  return `adm_${crypto.randomUUID()}`
}

export function Feedback({ error, done }: { error: string | null; done: string | null }) {
  if (error) return <p role="alert" className={ERROR_ALERT_CLASS}>{error}</p>
  if (done) return <p role="status" className="text-sm">{done}</p>
  return null
}

/**
 * A destructive admin action (revoke, disable) asks for the reason the worker stores in the audit
 * log. The dialog stays open with the error when the worker refuses.
 */
export function ReasonDialog({ open, title, body, confirm, onClose, onConfirm, tr }: {
  open: boolean
  title: string
  body: string
  confirm: string
  onClose: () => void
  onConfirm: (reason: string) => Promise<string | null>
  tr: Tr
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const run = async () => {
    setBusy(true)
    const failure = await onConfirm(reason)
    setBusy(false)
    setError(failure)
    if (failure === null) {
      setReason('')
      onClose()
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-1">
          <Label htmlFor="adm-reason">{tr('adm.reason')}</Label>
          <Textarea id="adm-reason" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} />
        </div>
        <Feedback error={error} done={null} />
        <AlertDialogFooter>
          <AlertDialogCancel>{tr('adm.cancel')}</AlertDialogCancel>
          <Button variant="destructive" disabled={busy || reason.trim() === ''} onClick={() => void run()}>{confirm}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
