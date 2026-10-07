'use client'

import { useEffect, useRef } from 'react'
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

/**
 * Confirmations and progress are polite status messages. The role=status container stays mounted
 * while empty, so text that arrives later is announced (a live region inserted already filled is
 * often not). `focusOnShow` moves focus to the note when its text appears, for actions whose
 * trigger disappears (a cancelled subscription loses its "Cancelar" button); the focus is moved
 * after the closing dialog has returned focus, so it is not lost to <body>.
 */
export function StatusNote({ text, focusOnShow = false }: { text: string | null; focusOnShow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!text || !focusOnShow) return
    const id = window.setTimeout(() => ref.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [text, focusOnShow])
  return (
    <div ref={ref} role="status" tabIndex={focusOnShow ? -1 : undefined} className={text ? STATUS_NOTE_CLASS : undefined}>
      {text}
    </div>
  )
}

const STATUS_NOTE_CLASS = 'rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'
