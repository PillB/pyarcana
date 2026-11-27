'use client'
import { ArrowRight } from 'lucide-react'
import { useI18n, t } from '@/lib/i18n'
import { nextLearningGroup, type ResumeGroup } from '@/lib/learning-resume'

export function LearningResumeLink({ groups, done, prefix }: {
  groups: readonly ResumeGroup[]; done: readonly string[]; prefix: '#' | '#ruta-web/'
}) {
  const lang = useI18n(s => s.lang)
  const next = nextLearningGroup(groups, done)
  if (!next) return <p className="mt-3 text-sm text-muted-foreground" data-testid="learning-resume-complete">{t('learningResume.complete',lang)}</p>
  return (
    <a className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring" data-testid="learning-resume" href={prefix + next.id}>
      {t('learningResume.continue',lang)} {next.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  )
}
