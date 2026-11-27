'use client'
import { useId, useState } from 'react'
import { useI18n, t } from '@/lib/i18n'
import { checkAnswer, type LearningCheck } from '@/lib/learning-checks'

/** Formative practice only; no completion or credential writes. */
export function LearningCheckCard({ check, checkId }: { check: LearningCheck; checkId: string }) {
  const lang = useI18n(s => s.lang)
  const tr = (key: string) => t(key, lang)
  const group = useId()
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const result = submitted ? checkAnswer(check, selected) : 'unanswered'
  return (
    <section className="mt-5 rounded-lg border border-primary/30 bg-card p-4" data-testid="learning-check" data-check-id={checkId}>
      <h3 className="text-lg font-semibold">{tr('learningCheck.title')}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tr('learningCheck.note')}</p>
      <fieldset className="mt-3 space-y-2">
        <legend className="mb-2 font-medium">{check.question}</legend>
        {check.options.map((option, index) => (
          <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2">
            <input className="h-5 w-5 shrink-0 accent-primary" type="radio" name={group} checked={selected === index} onChange={() => { setSelected(index); setSubmitted(false) }} />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <button type="button" disabled={selected === null || submitted} onClick={() => setSubmitted(true)} className="mt-3 min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring">{tr('learningCheck.submit')}</button>
      <div role="status" data-testid="learning-check-feedback" className="mt-3 text-sm">
        {result === 'incorrect' && <p>{tr('learningCheck.retry')}</p>}
        {result === 'correct' && <p><strong>{tr('learningCheck.correct')}</strong> {check.explanation}</p>}
      </div>
    </section>
  )
}
