'use client'

import { useEffect, useState } from 'react'
import type { ApiResult } from '@/lib/cloud/api'
import { routeMissing } from '@/lib/cloud/admin-api'
import { cloudApi } from './runtime'

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'ok'; value: T }
  | { status: 'failed'; reason: string; httpStatus: number; missing: boolean }

export function failedState(r: Exclude<ApiResult<unknown>, { ok: true }>): LoadState<never> {
  return { status: 'failed', reason: r.reason, httpStatus: r.status, missing: routeMissing(r) }
}

/**
 * GET `path` (null = nothing to load) and parse the answer. `parse` must be stable (a module-level
 * function); `nonce` reloads. A late answer for a path the page moved away from is dropped.
 */
export function useApiLoad<T>(path: string | null, parse: (data: unknown) => T, nonce = 0): LoadState<T> | null {
  const [state, setState] = useState<{ key: string; value: LoadState<T> } | null>(null)
  const key = `${path}#${nonce}`
  useEffect(() => {
    if (path === null) return
    let live = true
    void cloudApi().get(path).then((r) => {
      if (!live) return
      setState({ key, value: r.ok ? { status: 'ok', value: parse(r.data) } : failedState(r) })
    })
    return () => {
      live = false
    }
  }, [path, key, parse])
  if (path === null) return null
  return state && state.key === key ? state.value : { status: 'loading' }
}
