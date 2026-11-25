'use client'

import { ArrowRight, Globe } from 'lucide-react'
import { t, useI18n } from '@/lib/i18n'
import { trackLinkFor } from '@/lib/tracks/placement'
import { WEB_TRACK_PLACEMENT } from '@/lib/tracks/web/placed'
import { useWebTrack } from './useWebTrack'

/**
 * The way into the web track from a section: a detour on S12 and S13, a "required" notice on the
 * first section of the advanced level while the track is unfinished, nothing anywhere else
 * (trackLinkFor, tested). A plain link, never a gate.
 */
export function WebTrackLink({ sectionId, className = '' }: { sectionId: string; className?: string }) {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  const { complete } = useWebTrack(sectionId)
  const kind = trackLinkFor(sectionId, WEB_TRACK_PLACEMENT, complete)
  if (!kind) return null
  const tone = kind === 'required' ? 'border-amber-500/50 bg-amber-500/10' : 'border-primary/30 bg-primary/5'
  return (
    <aside className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm ${tone} ${className}`} data-testid="web-track-link" data-kind={kind}>
      <Globe className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{tr(`track.link.${kind}.title`)}</p>
        <p className="text-muted-foreground">{tr(`track.link.${kind}.body`)}</p>
      </div>
      <a
        href="#ruta-web"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-primary/40 bg-background px-3 py-2 font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {tr('track.link.cta')}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  )
}
