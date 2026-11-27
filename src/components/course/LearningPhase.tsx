'use client'
import type { ReactNode } from 'react'
import { useI18n, t } from '@/lib/i18n'
import { InlineText } from './RichText'
import { LearningCheckCard } from './LearningCheckCard'
import type { LearningPhases } from '@/lib/learning-phases'

export function LearningPhase({ id, kind, children }: { id:string; kind:'demo'|'guided'|'independent'|'check'; children:ReactNode }) {
  const lang=useI18n(s=>s.lang)
  const heading=id+'-phase-'+kind
  return <section aria-labelledby={heading} data-testid="learning-phase" data-phase={kind} className="mt-6 rounded-lg border border-border p-4">
    <h3 id={heading} tabIndex={-1} className="scroll-mt-24 rounded-sm text-xl font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('learningPhase.'+kind,lang)}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{t('learningPhase.'+kind+'.description',lang)}</p>
    <div className="mt-3">{children}</div>
  </section>
}

const PHASE_KINDS = ['demo','guided','independent','check'] as const
/** Local phase jumps intentionally do not mutate course hashes or completion. */
export function PhaseNavigation({ id }: {id:string}) {
  const lang=useI18n(s=>s.lang)
  const go=(kind:string)=>{
    const target=document.getElementById(id+'-phase-'+kind)
    target?.focus({preventScroll:true})
    target?.scrollIntoView({block:'start'})
  }
  return <nav aria-label={t('learningPhase.navigation',lang)} className="mt-4" data-testid="phase-navigation">
    <ul className="flex flex-wrap gap-2">
      {PHASE_KINDS.map(kind=><li key={kind}><button type="button" onClick={()=>go(kind)} className="min-h-11 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">{t('learningPhase.short.'+kind,lang)}</button></li>)}
    </ul>
  </nav>
}

export function WorkedExample({ phase }: {phase:LearningPhases}) {
  const lang=useI18n(s=>s.lang)
  return <div className="space-y-3 text-[15px]" data-testid="phase-worked-example">
    <p><InlineText text={phase.example}/></p>
    <p><strong>{t('learningPhase.reason',lang)} </strong><InlineText text={phase.reason}/></p>
    <p className="rounded-md bg-muted p-3"><strong>{t('learningPhase.result',lang)} </strong><InlineText text={phase.result}/></p>
  </div>
}

export function GuidedPrediction({ phase, id }: {phase:LearningPhases;id:string}) {
  const lang=useI18n(s=>s.lang)
  return <>
    <LearningCheckCard check={phase.guided} checkId={id} guidedHint={phase.hint}/>
    <div className="mt-4 rounded-md border border-border p-3" data-testid="guided-action">
      <h4 className="font-semibold">{t('learningPhase.action',lang)}</h4>
      <p className="mt-2"><InlineText text={phase.action}/></p>
      <details className="mt-3" data-testid="guided-evidence">
        <summary className="min-h-11 cursor-pointer py-2 font-medium">{t('learningPhase.compare',lang)}</summary>
        <p className="mt-1 text-sm"><InlineText text={phase.evidence}/></p>
      </details>
    </div>
  </>
}
