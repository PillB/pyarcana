'use client'

import { useEffect } from 'react'
import { CheckCircle2, Globe } from 'lucide-react'
import { useI18n, t } from '@/lib/i18n'
import { countTrackDone } from '@/lib/tracks/progress'
import { WEB_TRACK } from '@/lib/tracks/web/content'
import { trackModuleFromHash } from '@/lib/tracks/web/placed'
import { sectionLabel } from '@/lib/tracks/web/placed'
import { WEB_CHECKS } from '@/lib/learning-checks'
import { LearningCheckCard } from '@/components/course/LearningCheckCard'
import { InlineText } from '@/components/course/RichText'
import { TrackStepView } from './TrackStepView'
import { useWebTrack } from './useWebTrack'

const STANDING_TONE = {
  upcoming: 'border-border bg-muted/40',
  optional: 'border-primary/30 bg-primary/5',
  required: 'border-amber-500/50 bg-amber-500/10',
  done: 'border-green-500/40 bg-green-500/5',
} as const

/**
 * «Ruta aplicada: Python en la web» (#ruta-web), inside the course shell like Sesión 0: optional
 * beside the 52 sections, its own ticks, nothing it does changes a section, exam or badge.
 */
export function WebTrackView() {
  const lang = useI18n((s) => s.lang)
  const tr = (key: string) => t(key, lang)
  const { progress, setStep, done, total, standing, saveFailed } = useWebTrack()
  // Opened from a section banner the page is scrolled down; start at the top, or at the module a
  // shared link names (#ruta-web/modelo).
  // A link to another module while the track is open (#ruta-web/sitio → #ruta-web/modelo) does not
  // remount this view, so the same scroll answers the hash change too (red-team, 25 Nov 2026).
  useEffect(() => {
    const go = () => {
      const named = trackModuleFromHash(window.location.hash)
      const target = named ? document.getElementById(`track-${named}`) : null
      if (target) target.scrollIntoView()
      else window.scrollTo({ top: 0 })
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [])
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8" data-testid="web-track" data-standing={standing}>
      <p className="text-sm font-medium uppercase tracking-wide text-primary">{tr('track.kicker')}</p>
      <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight">
        <Globe className="h-7 w-7 text-primary" aria-hidden="true" />
        {WEB_TRACK.title}
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
        <InlineText text={WEB_TRACK.summary} />
      </p>
      <p className={`mt-4 rounded-md border p-3 text-sm ${STANDING_TONE[standing]}`} data-testid="track-standing">
        {tr(`track.standing.${standing}`)}
      </p>
      <p className="mt-3 text-sm text-muted-foreground" role="status" data-testid="track-progress">
        {tr('track.progress').replace('{done}', String(done)).replace('{total}', String(total))}
      </p>
      {saveFailed && (
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300" data-testid="track-save-failed">
          {tr('track.saveFailed')}
        </p>
      )}
      <nav aria-label={tr('track.toc')} className="mt-6">
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {WEB_TRACK.modules.map((m, i) => {
            const ids = m.steps.map((s) => s.id)
            const complete = countTrackDone(progress, ids) === ids.length
            return (
              <li key={m.id}>
                <a href={`#ruta-web/${m.id}`} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent">
                  {complete ? <CheckCircle2 className="h-4 w-4 text-green-600" aria-label={tr('track.done')} /> : <span className="w-4 text-center text-muted-foreground">{i + 1}</span>}
                  <span>{m.title}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
      {WEB_TRACK.modules.map((m, i) => {
        const ids = m.steps.map((s) => s.id)
        return (
          <section key={m.id} id={`track-${m.id}`} aria-labelledby={`track-${m.id}-h`} className="mt-10 scroll-mt-20" data-testid="track-module">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tr('track.module').replace('{n}', String(i + 1))} ·{' '}
              {tr('track.moduleCount').replace('{done}', String(countTrackDone(progress, ids))).replace('{total}', String(ids.length))}
            </p>
            <h2 id={`track-${m.id}-h`} className="mt-1 text-2xl font-bold tracking-tight">{m.title}</h2>
            <p className="mt-2 text-[15px] font-medium">
              <InlineText text={m.goal} />
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground" data-testid="track-builds-on">
              {tr('track.buildsOn')}: {m.buildsOn.map(sectionLabel).join(' · ')}
            </p>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/90">
              {m.intro.map((p) => (
                <p key={p}>
                  <InlineText text={p} />
                </p>
              ))}
            </div>
            <ol className="mt-4 space-y-4">
              {m.steps.map((step, n) => (
                <TrackStepView key={step.id} step={step} number={`${i + 1}.${n + 1}`} done={progress.done.includes(step.id)} onToggle={(checked) => setStep(step.id, checked)} />
              ))}
            </ol>
            {WEB_CHECKS[m.id] && <LearningCheckCard check={WEB_CHECKS[m.id]} checkId={m.id} />}
          </section>
        )
      })}
    </div>
  )
}
