'use client'

import { CheckCircle2, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { t, useI18n } from '@/lib/i18n'
import { WEB_TRACK_HASH } from '@/lib/course/hash-route'
import { useWebTrack } from './useWebTrack'

/**
 * The web track in the menu, beside Sesión 0 and outside the list of the 52 sections (that list's
 * item count is what screen readers announce and what lesson-navigation.test.ts pins). The second
 * line shows the same standing and count as the track page, from the same hook, so the menu can
 * never disagree with the page (STATE_MACHINES.md, SM3).
 */
export function WebTrackSidebarLink({ active, onOpen }: { active: boolean; onOpen?: () => void }) {
  const lang = useI18n((s) => s.lang)
  const { done, total, complete, standing } = useWebTrack()
  const status = complete
    ? t('sidebar.webTrack.done', lang)
    : t(`sidebar.webTrack.${standing === 'required' ? 'required' : 'optional'}`, lang).replace('{done}', String(done)).replace('{total}', String(total))
  return (
    <a
      href={`#${WEB_TRACK_HASH}`}
      data-testid="sidebar-webtrack"
      data-standing={standing}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        if (!onOpen || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        onOpen()
      }}
      className={cn(
        'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active ? 'bg-sidebar-accent shadow-sm' : 'hover:bg-sidebar-accent/50',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          complete ? 'gradient-primary text-white' : standing === 'required' ? 'border border-amber-500/60 text-amber-700 dark:text-amber-300' : 'border border-dashed border-primary/40 text-primary',
        )}
      >
        {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Globe className="h-4 w-4" aria-hidden="true" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn('truncate text-sm font-medium', active ? 'text-foreground' : 'text-foreground/80')}>{t('sidebar.webTrack.title', lang)}</div>
        <div className="truncate text-xs text-muted-foreground" data-testid="sidebar-webtrack-status">{status}</div>
      </div>
    </a>
  )
}
