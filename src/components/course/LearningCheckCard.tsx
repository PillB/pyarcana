'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { useI18n, t } from '@/lib/i18n'
import { answerFeedback, checkAnswer, shuffledOptions, type LearningCheck } from '@/lib/learning-checks'

/** Formative practice only; no completion or credential writes. */
export function LearningCheckCard({ check, checkId }: { check: LearningCheck; checkId: string }) {
  const lang = useI18n(s => s.lang)
  const tr = (key: string) => t(key, lang)
  const group = useId()
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [order, setOrder] = useState(() => check.options.map((_, i) => i))
  const choices = useRef<HTMLFieldSetElement>(null)
  const restoreFocus = useRef(false)
  const retry = () => {
    restoreFocus.current = true
    setOrder(shuffledOptions(check.options.length))
    setSelected(null)
    setSubmitted(false)
  }
  useEffect(() => {
    if (!restoreFocus.current) return
    restoreFocus.current = false
    choices.current?.querySelector('input')?.focus()
  }, [order])
  const result = submitted ? checkAnswer(check, selected) : 'unanswered'
  return (
    <section className="mt-5 rounded-lg border border-primary/30 bg-card p-4" data-testid="learning-check" data-check-id={checkId}>
      {check.practice && <div className="mb-5 border-b pb-4" data-testid="learning-practice">
        <h3 className="text-lg font-semibold">{tr('learningCheck.practice')}</h3>
        <p className="mt-2">{check.practice.task}</p>
        <p className="mt-2 text-sm"><strong>{tr('learningCheck.evidence')}</strong> {check.practice.evidence}</p>
      </div>}
      <h3 className="text-lg font-semibold">{tr('learningCheck.title')}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tr('learningCheck.note')}</p>
      <fieldset ref={choices} className="mt-3 space-y-2">
        <legend className="mb-2 font-medium">{check.question}</legend>
        {order.map(index => (
          <label key={index} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2">
            <input className="h-5 w-5 shrink-0 accent-primary" type="radio" name={group} checked={selected === index} onChange={() => { setSelected(index); setSubmitted(false) }} />
            <span>{check.options[index]}</span>
          </label>
        ))}
      </fieldset>
      <button type="button" disabled={selected === null} aria-disabled={submitted} onClick={() => { if (!submitted && selected !== null) setSubmitted(true) }} className="mt-3 min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring">{tr('learningCheck.submit')}</button>
      <div role="status" data-testid="learning-check-feedback" className="mt-3 text-sm">
        {result === 'incorrect' && <p>{tr('learningCheck.retry')} {answerFeedback(check, selected)}</p>}
        {result === 'correct' && <p><strong>{tr('learningCheck.correct')}</strong> {answerFeedback(check, selected)}</p>}
      </div>
      {submitted && <button type="button" className="mt-2 min-h-11 rounded-md border px-3 text-sm" onClick={retry}>{tr('learningCheck.tryAgain')}</button>}
    </section>
  )
}
