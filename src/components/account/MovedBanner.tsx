'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CLOUD_CONFIG, normalizeOrigin } from '@/lib/cloud/config'
import { applyHandoff, buildHandoffUrl, decodeHandoff, stripImportFragment } from '@/lib/cloud/handoff'
import { loadChangeLog, saveChangeLog } from '@/lib/cloud/progress-merge'
import { progressStoreAdapter, whenProgressHydrated } from '@/lib/cloud/progress-adapter'
import { movedState } from '@/lib/cloud/ui-state'
import { readRaw, safeStorage } from '@/lib/cloud/storage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress-sanitize'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { useAfterMount, useText } from './text'

/** Decided once after mount (the import then removes the fragment it was decided from). */
function useMovedState(): 'none' | 'banner' | 'import' {
  return useAfterMount<'none' | 'banner' | 'import'>(
    () => movedState({ origin: window.location.origin, isStaticSite: IS_STATIC_SITE, canonicalOrigin: CLOUD_CONFIG.canonicalOrigin, movedToCanonical: CLOUD_CONFIG.movedToCanonical, hash: window.location.hash }),
    'none'
  )
}

/** Canonical origin: merge the #import= progress (never a replace), then drop the fragment. */
function useHandoffImport(active: boolean) {
  const { toast } = useToast()
  const { tr } = useText()
  useEffect(() => {
    if (!active) return
    const hash = window.location.hash
    window.history.replaceState(null, '', stripImportFragment(window.location.href))
    return whenProgressHydrated(() => {
      const decoded = decodeHandoff(hash)
      if (!decoded.ok) return void toast({ title: tr('moved.importFailed') })
      const storage = safeStorage()
      const r = applyHandoff(progressStoreAdapter.getState(), loadChangeLog(storage, Date.now()), decoded.state, Date.now())
      progressStoreAdapter.setState(r.state)
      saveChangeLog(storage, r.changes)
      toast({ title: tr('moved.imported', { n: r.added }) })
    })
  }, [active])
}

function Banner() {
  const { tr } = useText()
  const canonical = normalizeOrigin(CLOUD_CONFIG.canonicalOrigin) ?? ''
  const host = canonical.replace(/^https?:\/\//, '')
  const [link] = useState(() => buildHandoffUrl(canonical, readRaw(safeStorage(), PROGRESS_STORAGE_KEY)))
  const href = link.ok ? link.url : `${canonical}/`
  return (
    <div role="region" aria-label={tr('moved.title', { host })} className="border-b border-gold/50 bg-gold/10 px-4 py-3 text-sm" data-testid="moved-banner">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{tr('moved.title', { host })}</p>
          <p className="text-foreground/80">{tr('moved.body', { host })}</p>
          {!link.ok && link.reason === 'too_large' && <p className="text-foreground/80">{tr('moved.tooLarge')}</p>}
        </div>
        <Button asChild size="sm" className="shrink-0 gap-1.5">
          <a href={href}>
            {link.ok ? tr('moved.cta', { host }) : tr('moved.ctaEmpty', { host })}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  )
}

/**
 * The origin move (DESIGN-v2 §8.7, v3 §A/§K). On an old origin, once the owner sets
 * movedToCanonical, a banner offers the canonical site with the progress in the #import=
 * fragment (the fragment never reaches a server). On the canonical origin the fragment is merged.
 * Nothing renders by default (movedToCanonical false) and nothing in prerendered HTML.
 */
export function MovedBanner() {
  const state = useMovedState()
  useHandoffImport(state === 'import')
  return state === 'banner' ? <Banner /> : null
}
