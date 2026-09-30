'use client'

import type { UiError } from '@/lib/cloud/account-api'
import { errorMessage } from '@/lib/cloud/billing-ui'
import { useText } from './text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

/** Errors are announced (role=alert); an empty slot renders nothing. */
export function ErrorAlert({ error }: { error: UiError | null }) {
  const { lang } = useText()
  if (!error) return null
  return (
    <p role="alert" className={ERROR_ALERT_CLASS}>
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
