'use client'

import { useCallback, useEffect, useState } from 'react'
import { t, useI18n, type Language } from '@/lib/i18n'
import { fillTemplate } from '@/lib/cloud/ui-state'
import { SITE_BASE_PATH } from '@/lib/runtime-mode'

export type Tr = (key: string, vars?: Record<string, string | number>) => string

/** The interface language and a translator with {placeholder} filling. */
export function useText(): { lang: Language; tr: Tr } {
  const lang = useI18n((s) => s.lang)
  const tr = useCallback<Tr>((key, vars) => fillTemplate(t(key, lang), vars ?? {}), [lang])
  return { lang, tr }
}

/** A site-internal href for plain <a> elements (next/link adds the base path itself). */
export function sitePath(path: string): string {
  return `${SITE_BASE_PATH}${path}`
}

/**
 * A value computed once in the browser after mount; `initial` during prerendering and hydration,
 * so the server HTML never depends on location or storage.
 */
export function useAfterMount<T>(compute: () => T, initial: T): T {
  const [value, setValue] = useState<T>(initial)
  useEffect(() => {
    setValue(compute()) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])
  return value
}
