import type { Page } from '@playwright/test'

export function attachConsoleGuard(page: Page): { critical: () => string[] } {
  const errors: string[] = []
  page.on('pageerror', (err) => {
    const m = String(err.message || err)
    if (/CLIENT_FETCH_ERROR|Failed to fetch|next-auth/i.test(m)) return
    errors.push(m)
  })
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const t = msg.text()
    if (
      /pyodide|cdn\.jsdelivr|favicon|Download the React DevTools|hydration|CLIENT_FETCH_ERROR|Failed to fetch|next-auth|NetworkError|Load failed|chunk|403 \(Forbidden\)|401 \(Unauthorized\)|status of 403|status of 401|Failed to load resource/i.test(
        t
      )
    ) {
      return
    }
    errors.push(t)
  })
  return {
    critical: () => errors.filter(Boolean),
  }
}
