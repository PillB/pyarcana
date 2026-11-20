'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { neighbourStep, type StepTarget } from '@/lib/course/step-nav'
import type { SubStep } from '@/lib/progress-store'
import type { CourseSection } from '@/lib/types'
import { t, useI18n } from '@/lib/i18n'
import { popIn } from '@/lib/entrance'

const STEP_LABEL_KEYS: Record<SubStep, string> = {
  theory: 'section.theory',
  ido: 'section.ido',
  wedo: 'section.wedo',
  youdo: 'section.youdo',
  quiz: 'section.quiz',
}

/** What a target is called: «Yo hago» inside the section, «S3 · Teoría» across a section. */
export function stepTargetName(target: StepTarget, sections: readonly CourseSection[], lang: Parameters<typeof t>[1]): string {
  const step = t(STEP_LABEL_KEYS[target.step], lang)
  if (!target.crossesSection) return step
  return `S${sections[target.section].index} · ${step}`
}

/** One button's target, its short name, and its accessible name (which contains the name). */
function describe(
  sections: readonly CourseSection[],
  position: number,
  step: SubStep,
  direction: 1 | -1,
  lang: Parameters<typeof t>[1]
): { target: StepTarget | null; name: string; label: string } {
  const target = neighbourStep(sections.length, position, step, direction)
  const [stepKey, endKey] = direction === 1 ? ['course.nextStep', 'course.nextSection'] : ['course.previousStep', 'course.previousSection']
  if (!target) return { target, name: '', label: t(endKey, lang) }
  const name = stepTargetName(target, sections, lang)
  return { target, name, label: t(stepKey, lang).replace('{step}', name) }
}

interface StepNavButtonsProps {
  animateEntrance: boolean
  sections: readonly CourseSection[]
  position: number
  activeStep: SubStep
  /** Same section: switch tab. Another section: open it on that step. */
  onGo: (target: StepTarget) => void
}

/**
 * The floating ← → buttons. They walk the course step by step (see step-nav.ts) and say where
 * they go: the destination is in the accessible name and the tooltip everywhere, and written on
 * the → button from `md` up. An arrow alone gave no clue whether it moved a tab or a section,
 * which is the whole of the tester's report.
 */
export function StepNavButtons({ animateEntrance, sections, position, activeStep, onGo }: StepNavButtonsProps) {
  const lang = useI18n((s) => s.lang)
  const { target: prev, label: prevLabel } = describe(sections, position, activeStep, -1, lang)
  const { target: next, name: nextName, label: nextLabel } = describe(sections, position, activeStep, 1, lang)

  return (
    <>
      <motion.button
        type="button"
        initial={popIn(animateEntrance, 0.8)}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => prev && onGo(prev)}
        disabled={!prev}
        data-testid="section-prev"
        data-target-step={prev?.step ?? ''}
        data-crosses-section={prev?.crossesSection ? 'true' : 'false'}
        aria-label={prevLabel}
        title={prevLabel}
        className={cn(
          // lg: clear the 18rem sidebar (page.tsx w-72); at left-3 it covered «Recursos» there.
          'fixed left-3 lg:left-[19rem] bottom-4 z-40 h-11 w-11 lg:h-12 lg:w-12 rounded-full shadow-lg backdrop-blur-md',
          'bg-card/90 border border-border flex items-center justify-center',
          'hover:bg-card transition-colors',
          !prev && 'opacity-40 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </motion.button>

      <motion.button
        type="button"
        initial={popIn(animateEntrance, 0.8)}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => next && onGo(next)}
        disabled={!next}
        data-testid="section-next"
        data-target-step={next?.step ?? ''}
        data-crosses-section={next?.crossesSection ? 'true' : 'false'}
        aria-label={nextLabel}
        title={nextLabel}
        className={cn(
          'fixed right-3 bottom-4 z-40 h-11 min-w-11 lg:h-12 lg:min-w-12 rounded-full shadow-lg backdrop-blur-md',
          'bg-primary text-primary-foreground border border-primary/50 flex items-center justify-center gap-2',
          'hover:bg-primary/90 transition-colors md:px-4',
          !next && 'opacity-40 cursor-not-allowed'
        )}
      >
        {next && (
          <span className="hidden md:inline max-w-[11rem] truncate text-sm font-semibold" data-testid="section-next-label">
            {nextName}
          </span>
        )}
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
      </motion.button>
    </>
  )
}

/**
 * Below `md` the → button is an icon: a written pill there would cover the lesson. So the same
 * step is offered in the flow of the page, at the end of the tab, with its destination written.
 */
export function StepNextInline({ sections, position, activeStep, onGo }: Omit<StepNavButtonsProps, 'animateEntrance'>) {
  const lang = useI18n((s) => s.lang)
  const { target, label } = describe(sections, position, activeStep, 1, lang)
  if (!target) return null
  return (
    <div className="mx-12 mt-6 mb-20 md:hidden">
      <button
        type="button"
        onClick={() => onGo(target)}
        data-testid="section-next-inline"
        data-target-step={target.step}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 text-sm font-semibold hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label}
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
    </div>
  )
}
