/**
 * Wires page events to ProgressSync (DESIGN-v2 §8.6) so the <CloudSync/> component stays a thin
 * shell: record local changes from mount (also signed out, so an offline un-toggle still wins
 * later), start once per account, pull when the page becomes visible, flush on hide and pagehide
 * (ProgressSync picks keepalive by size), and on sign-out flush first and keep local progress.
 */
import type { SyncStatus } from '@/lib/cloud/progress-sync'

export interface SyncLike {
  attach(): void
  detach(): void
  start(accountId: string): Promise<SyncStatus>
  pull(force?: boolean): Promise<SyncStatus>
  flush(): Promise<SyncStatus>
  pushNow(): Promise<SyncStatus>
  signOut(): Promise<void>
}

export interface EventHost {
  addEventListener(type: string, fn: () => void): void
  removeEventListener(type: string, fn: () => void): void
}

export class SyncController {
  private account: string | null = null
  private readonly deps: { sync: SyncLike; doc: EventHost & { visibilityState: string }; win: EventHost }

  constructor(deps: { sync: SyncLike; doc: EventHost & { visibilityState: string }; win: EventHost }) {
    this.deps = deps
  }

  private readonly onVisibility = () => {
    if (this.deps.doc.visibilityState === 'hidden') void this.deps.sync.flush()
    else if (this.account) void this.deps.sync.pull()
  }

  private readonly onPageHide = () => {
    void this.deps.sync.flush()
  }

  /** Back online: send what waited locally, then take what other devices sent meanwhile. */
  private readonly onOnline = () => {
    if (!this.account) return
    void this.deps.sync.pushNow()
    void this.deps.sync.pull(true)
  }

  mount(): () => void {
    this.deps.sync.attach()
    this.deps.doc.addEventListener('visibilitychange', this.onVisibility)
    this.deps.win.addEventListener('pagehide', this.onPageHide)
    this.deps.win.addEventListener('online', this.onOnline)
    return () => {
      this.deps.win.removeEventListener('online', this.onOnline)
      this.deps.doc.removeEventListener('visibilitychange', this.onVisibility)
      this.deps.win.removeEventListener('pagehide', this.onPageHide)
      this.deps.sync.detach()
    }
  }

  setAccount(accountId: string | null): void {
    if (accountId === this.account) return
    const had = this.account
    this.account = accountId
    if (accountId) void this.deps.sync.start(accountId)
    else if (had) void this.deps.sync.signOut()
  }
}
