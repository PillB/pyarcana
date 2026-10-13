'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CLOUD_CONFIG, normalizeOrigin } from '@/lib/cloud/config'
import { buildHandoffUrl } from '@/lib/cloud/handoff'
import { whenProgressHydrated } from '@/lib/cloud/progress-adapter'
import { movedCopy, movedState } from '@/lib/cloud/ui-state'
import { supportContact } from '@/lib/cloud/billing-ui'
import { readRaw, safeStorage } from '@/lib/cloud/storage'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress-sanitize'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'
import { getHandoffImporter } from './runtime'
import { useAfterMount, useText } from './text'

/** Decided once after mount (the import then removes the fragment it was decided from). */
function useMovedState(): 'none' | 'banner' | 'import' {
  return useAfterMount<'none' | 'banner' | 'import'>(
    () => movedState({ origin: window.location.origin, isStaticSite: IS_STATIC_SITE, canonicalOrigin: CLOUD_CONFIG.canonicalOrigin, movedToCanonical: CLOUD_CONFIG.movedToCanonical, hash: window.location.hash }),
    'none'
  )
}

/**
 * Canonical origin: merge the #import= progress (never a replace) and say so once. The importer
 * is shared with the grandfather snapshot, which may already have applied it on this load.
 */
function useHandoffImport() {
  const { toast } = useToast()
  const { tr } = useText()
  useEffect(() => {
    getHandoffImporter().capture()
    return whenProgressHydrated(() => {
      getHandoffImporter().run()
      const notice = getHandoffImporter().notice()
      if (notice?.status === 'failed') toast({ title: tr('moved.importFailed') })
      if (notice?.status === 'imported') toast({ title: tr('moved.imported', { n: notice.added }) })
    })
  }, [])
}

function Banner() {
  const { tr } = useText()
  const canonical = normalizeOrigin(CLOUD_CONFIG.canonicalOrigin) ?? ''
  const host = canonical.replace(/^https?:\/\//, '')
  const [link] = useState(() => buildHandoffUrl(canonical, readRaw(safeStorage(), PROGRESS_STORAGE_KEY)))
  const href = link.ok ? link.url : `${canonical}/`
  // Only what this state supports: accounts only where the canonical site runs them (this same
  // build's stage), "the button carries your progress" only when the link carries it.
  const lines = movedCopy({ link: link.ok ? { ok: true } : { ok: false, reason: link.reason }, accountsThere: CLOUD_CONFIG.launchStage !== 'off' })
  return (
    <div role="region" aria-label={tr('moved.title', { host })} className="border-b border-gold/50 bg-gold/10 px-4 py-3 text-sm" data-testid="moved-banner">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{tr('moved.title', { host })}</p>
          {lines.map((key) => (
            <p key={key} className="text-foreground/80">{tr(key, { host, email: supportContact() })}</p>
          ))}
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
  useHandoffImport()
  return state === 'banner' ? <Banner /> : null
}
