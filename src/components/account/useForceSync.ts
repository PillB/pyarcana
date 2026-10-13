'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { ForceDecision } from '@/lib/cloud/force-sync'
import type { SyncStatus } from '@/lib/cloud/progress-sync'
import { currentNavigator, isApplePlatform, matchShortcut, shortcutLabel } from '@/lib/hotkeys'
import { getProgressSync } from './runtime'
import { useText, type Tr } from './text'

/** "45 s" or "2 min": how long a refused force must wait, as people read it. */
export function waitLabel(ms: number): string {
  const s = Math.max(1, Math.ceil(ms / 1000))
  return s < 120 ? `${s} s` : `${Math.ceil(s / 60)} min`
}

const REFUSAL_KEYS: Record<Extract<ForceDecision, { action: 'refused' }>['reason'], string> = {
  signed_out: 'account.force.signedOut',
  choice: 'account.force.choice',
  backoff: 'account.force.backoff',
  cooldown: 'account.force.wait',
  floor: 'account.force.wait',
  flipflop: 'account.force.flipflop',
}

const FAILED_KEYS: Partial<Record<SyncStatus, string>> = {
  offline: 'account.sync.offline',
  deferred: 'account.sync.deferred',
  error: 'account.sync.error',
  conflict: 'account.sync.conflict',
  too_large: 'account.sync.tooLarge',
  signed_out: 'account.force.signedOut',
}

/** The toast text for one forced sync's outcome. */
export function forceMessage(decision: ForceDecision, status: SyncStatus, tr: Tr): string {
  if (decision.action === 'refused') return tr(REFUSAL_KEYS[decision.reason], { wait: waitLabel(decision.waitMs) })
  const failed = FAILED_KEYS[status]
  if (failed) return tr(failed)
  return tr(decision.action === 'unchanged' ? 'account.force.unchanged' : 'account.force.saved')
}

/**
 * "Sincronizar ahora" and Ctrl/⌘ + Alt + S share this: one guarded forced sync (force-sync.ts),
 * one toast with what happened. `busy` covers the request; a refusal returns at once.
 */
export function useForceSync(): { run: () => Promise<void>; busy: boolean } {
  const { toast } = useToast()
  const { tr } = useText()
  const [busy, setBusy] = useState(false)
  const running = useRef(false)
  const run = useCallback(async () => {
    if (running.current) return
    running.current = true
    setBusy(true)
    try {
      const { decision, status } = await getProgressSync().forceSync()
      toast({ title: forceMessage(decision, status, tr), variant: decision.action === 'refused' ? 'default' : undefined })
    } finally {
      running.current = false
      setBusy(false)
    }
  }, [toast, tr])
  return { run, busy }
}

/** Ctrl/⌘ + Alt + S anywhere on the page while signed in (mounted by CloudSync). */
export function useForceSyncHotkey(enabled: boolean): void {
  const { run } = useForceSync()
  useEffect(() => {
    if (!enabled) return
    const apple = isApplePlatform(currentNavigator())
    const onKeyDown = (event: KeyboardEvent) => {
      if (!matchShortcut(event, 's', apple)) return
      event.preventDefault()
      void run()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, run])
}

/** The shortcut as this platform names it, after mount (prerendered HTML says Ctrl/⌘). */
const noSubscribe = () => () => {}

export function useForceSyncShortcutLabel(): string {
  // The platform never changes while the page is open; the server and the first paint use both names.
  return useSyncExternalStore(noSubscribe, () => shortcutLabel('s', isApplePlatform(currentNavigator())), () => 'Ctrl/⌘ + Alt + S')
}
