'use client'

import Link from 'next/link'
import { ArrowRight, Wrench } from 'lucide-react'
import { t, useI18n } from '@/lib/i18n'

/**
 * The way into Sesión 0 from the course: on the dashboard and at the top of Section 1.
 *
 * A plain link, never a gate: a learner who already has Python, Git and VS Code skips it, and
 * Section 1 still opens as before (DESIGN.md §1, "free and optional").
 */
export function SetupIntroLink({ className = '', when = true }: { className?: string; when?: boolean }) {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  if (!when) return null
  return (
    <aside
      className={`flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm ${className}`}
      data-testid="setup-intro-link"
    >
      <Wrench className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{tr('setup.link.title')}</p>
        <p className="text-muted-foreground">{tr('setup.link.body')}</p>
      </div>
      <Link
        href="/empezar"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-primary/40 bg-background px-3 py-2 font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {tr('setup.link.cta')}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  )
}
