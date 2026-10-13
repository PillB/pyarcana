/**
 * Download an admin export (CSV or the QA JSON package) from the worker.
 *
 * The API client (api.ts) reads every answer as JSON, so a file needs its own request. It follows
 * the same rules: the same /v1/ path guard, the cookie session (`credentials: 'include'`), no
 * cache. The timeout is longer (60 s) because the JSON package can carry up to 20 MB of
 * screenshots. A refusal is read as JSON to get the worker's reason code. Never throws.
 */
import { apiUrl, interpret } from '@/lib/cloud/api'
import { downloadName, type QaExportFormat } from '@/lib/cloud/admin-api'

export const DOWNLOAD_TIMEOUT_MS = 60_000

export type DownloadResult =
  | { ok: true; blob: Blob; name: string; partial: boolean }
  | { ok: false; status: number; reason: string }

export async function fetchExport(
  baseUrl: string,
  path: string,
  format: QaExportFormat,
  doFetch: typeof fetch = (input, init) => globalThis.fetch(input, init),
  timeoutMs = DOWNLOAD_TIMEOUT_MS,
): Promise<DownloadResult> {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  try {
    const res = await doFetch(apiUrl(baseUrl, path), { method: 'GET', credentials: 'include', cache: 'no-store', signal: controller.signal })
    if (!res.ok) {
      const r = interpret(res.status, await res.text())
      return { ok: false, status: res.status, reason: r.ok ? `http_${res.status}` : r.reason }
    }
    const blob = await res.blob()
    return { ok: true, blob, name: downloadName(res.headers.get('content-disposition'), format), partial: res.headers.get('x-pyarcana-partial') === '1' }
  } catch {
    return { ok: false, status: 0, reason: timedOut ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}

/** Hand a blob to the browser as a file (the pattern of the account's own data export). */
export function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
