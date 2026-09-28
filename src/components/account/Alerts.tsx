'use client'

import type { UiError } from '@/lib/cloud/account-api'
import { errorMessage } from '@/lib/cloud/billing-ui'
import { useText } from './text'

/** Errors are announced (role=alert); an empty slot renders nothing. */
export function ErrorAlert({ error }: { error: UiError | null }) {
  const { lang } = useText()
  if (!error) return null
  return (
    <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
      {errorMessage(error, lang)}
    </p>
  )
}

/** Confirmations and progress are polite status messages. */
export function StatusNote({ text }: { text: string | null }) {
  if (!text) return null
  return (
    <p role="status" className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-foreground">
      {text}
    </p>
  )
}
