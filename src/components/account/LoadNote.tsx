'use client'

import type { Language } from '@/lib/i18n'
import type { LoadState } from './useApiLoad'
import { useText } from './text'
import { ERROR_ALERT_CLASS } from '@/components/account/a11y'

/** What a list shows while it loads or when it could not: never an empty table that looks final. */
export function LoadNote({ state }: { state: LoadState<unknown> | null }) {
  const { tr } = useText()
  if (!state || state.status === 'ok') return null
  if (state.status === 'loading') return <p role="status" className="text-sm text-muted-foreground">{tr('cloudpage.loading')}</p>
  if (state.missing) return <p role="status" className="text-sm" data-testid="route-missing">{tr('adm.notYet')}</p>
  return <p role="alert" className={ERROR_ALERT_CLASS}>{tr('cloudpage.loadFailed', { reason: state.reason })}</p>
}

const LOCALES: Record<Language, string> = { 'es-PE': 'es-PE', 'es-ES': 'es-ES', en: 'en-GB' }

/** A worker timestamp (seconds) as a date in the page language; '—' when there is none. */
export function formatDay(seconds: number | null, lang: Language): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return '—'
  return new Date(seconds * 1000).toLocaleDateString(LOCALES[lang], { year: 'numeric', month: 'short', day: 'numeric' })
}

export const SELECT_CLASS = 'h-9 rounded-md border border-input bg-background px-2 text-sm'
