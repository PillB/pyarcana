'use client'

import { useState, useEffect, useRef } from 'react'
import {
  HelpCircle, CheckCircle2, Award, AlertTriangle,
  Loader2, RotateCcw, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from './ProgressRing'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useI18n, t } from '@/lib/i18n'

interface ExamQuestion {
  id: string
  concept: string
  question: string
  options: string[]
}

interface ExamStartResponse {
  attemptId: string
  attemptNumber: number
  questions: ExamQuestion[]
  totalAttemptsAllowed: number
  attemptsUsed: number
  /** Seconds the attempt may stay open; the server refuses a submission after it. */
  timeLimitSec?: number
  /** Questions in this attempt whose correct answer the learner saw before 2026-09-18. */
  exposedItems?: number
}

interface AttemptSummary {
  id: string
  attemptNumber: number
  score: number
  completedAt: string | null
  timeSpentSec: number
  /** Graded before the 2026-09-18 fix: listed, but it neither counts nor uses up an attempt. */
  legacy?: boolean
  /** Whether the score counts (isEvidence on the server); an older server does not send it. */
  evidence?: boolean
}

/** Whether a listed attempt's score counts toward the best score. */
const scoreCounts = (a: AttemptSummary) => a.evidence ?? !a.legacy

/** Why a listed attempt's score does not count, as an i18n key, or null when it does. */
function unscoredReason(a: AttemptSummary): string | null {
  if (a.legacy) return 'exam.legacyAttempt'
  return scoreCounts(a) ? null : 'exam.exposedAttempt'
}

/** A graded answer from exam/submit. The correct option and the explanation are never sent. */
interface ReviewedAnswer {
  questionId: string
  concept: string
  question: string
  options: string[]
  selectedIndex: number
  correct: boolean
}

const DEFAULT_TIME_LIMIT_SEC = 60 * 60

interface ExamViewProps {
  sectionId: string
  sectionTitle: string
  onAuthRequired: () => void
}

function fill(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    template
  )
}

export function ExamView({ sectionId, sectionTitle, onAuthRequired }: ExamViewProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const lang = useI18n((s) => s.lang)
  const [loading, setLoading] = useState(false)
  const [exam, setExam] = useState<ExamStartResponse | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    correctCount: number
    totalQuestions: number
    detailedAnswers: ReviewedAnswer[]
    passed: boolean
  } | null>(null)
  const [previousAttempts, setPreviousAttempts] = useState<AttemptSummary[]>([])
  const [startTime, setStartTime] = useState<number>(0)

  const refreshAttempts = () =>
    fetch(`/api/exam/attempts?sectionId=${sectionId}`)
      .then((r) => r.json())
      .then((data) => setPreviousAttempts(data.attempts || []))
      .catch(() => {})

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch(`/api/exam/attempts?sectionId=${sectionId}`)
        .then((r) => r.json())
        .then((data) => setPreviousAttempts(data.attempts || []))
        .catch(() => {})
    }
  }, [sectionId, status, session])

  const handleStartExam = async () => {
    if (status !== 'authenticated') {
      onAuthRequired()
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({
          title: t('exam.cannotStart', lang),
          description: data.error || t('exam.unknownError', lang),
          variant: 'destructive',
        })
        // start may have just closed an attempt whose time ran out; show it.
        void refreshAttempts()
        return
      }
      setExam(data)
      setAnswers({})
      setSubmitted(false)
      setResult(null)
      setStartTime(Date.now())
    } catch {
      toast({ title: t('exam.connectionError', lang), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // timedOut: the countdown reached zero, so what is marked is sent even if incomplete.
  const handleSubmit = async (timedOut = false) => {
    if (!exam) return
    const limit = exam.timeLimitSec ?? DEFAULT_TIME_LIMIT_SEC
    const timeSpentSec = Math.min(limit, Math.round((Date.now() - startTime) / 1000))
    // Only answered questions are sent; the server counts the rest as wrong.
    const marked = exam.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({ questionId: q.id, selectedIndex: answers[q.id] }))
    if (marked.length === 0) {
      // Nothing to grade: the server closes the attempt with 0 when its time is over.
      toast({ title: t('exam.timeUpNothingAnswered', lang), variant: 'destructive' })
      setExam(null)
      void refreshAttempts()
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: exam.attemptId,
          answers: marked,
          timeSpentSec,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: data.error || t('exam.error', lang), variant: 'destructive' })
        return
      }
      setResult(data)
      setSubmitted(true)
      const attemptsRes = await fetch(`/api/exam/attempts?sectionId=${sectionId}`)
      const attemptsData = await attemptsRes.json()
      setPreviousAttempts(attemptsData.attempts || [])
      toast({
        title: timedOut
          ? t('exam.timeUp', lang)
          : data.passed ? t('exam.passedToast', lang) : t('exam.failed', lang),
        description: fill(t('exam.ofCorrect', lang), {
          c: data.correctCount,
          t: data.totalQuestions,
          score: data.score,
        }),
      })
    } catch {
      toast({ title: t('exam.connectionError', lang), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setExam(null)
    setSubmitted(false)
    setResult(null)
    setAnswers({})
    handleStartExam()
  }

  if (status !== 'authenticated') {
    return (
      <Card className="border-primary/30 bg-primary/5 p-6 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 text-lg font-semibold">{t('exam.loginRequired', lang)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('exam.loginRequiredDesc', lang)}
        </p>
        <Button onClick={onAuthRequired} className="mt-4 gap-2" data-testid="exam-auth-required">
          {t('auth.login', lang)}
        </Button>
      </Card>
    )
  }

  if (loading && !exam) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">{t('exam.loading', lang)}</span>
      </div>
    )
  }

  if (exam && !submitted) {
    const n = exam.questions.length
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-semibold">{t('exam.title', lang)} — {sectionTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {fill(t('exam.questionsBadge', lang), {
                n,
                s: n === 1 ? '' : lang === 'en' ? 's' : 's',
              })}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              {fill(t('exam.attemptOf', lang), {
                n: exam.attemptNumber,
                max: exam.totalAttemptsAllowed,
              })}
            </Badge>
            <ExamCountdown
              limitSec={exam.timeLimitSec ?? DEFAULT_TIME_LIMIT_SEC}
              startedAt={startTime}
              onExpire={() => {
                if (!loading) void handleSubmit(true)
              }}
            />
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div className="text-sm">
              <strong>{t('exam.rules', lang)}:</strong> {t('exam.rulesDesc', lang)}{' '}
              {t('exam.timeLimitRule', lang)}
            </div>
          </div>
        </Card>

        <ExposedNote count={exam.exposedItems ?? 0} />

        {exam.questions.map((q, qIdx) => {
          const userAnswer = answers[q.id]
          return (
            <Card key={q.id} className="overflow-hidden" data-testid={`exam-q-${q.id}`}>
              <div className="p-5">
                <div className="mb-3 flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs font-bold text-rose-600">
                    {qIdx + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswer === oIdx
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: oIdx }))}
                        data-testid={`exam-q-${q.id}-opt-${oIdx}`}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40 hover:bg-accent/50'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted text-muted-foreground'
                          )}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>
          )
        })}

        <Button
          onClick={() => handleSubmit()}
          disabled={loading || Object.keys(answers).length < exam.questions.length}
          className="w-full gap-2"
          size="lg"
          data-testid="exam-submit"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {fill(t('exam.submitWithCount', lang), {
            a: Object.keys(answers).length,
            t: exam.questions.length,
          })}
        </Button>
      </div>
    )
  }

  if (submitted && result) {
    const canRetry = exam ? exam.attemptNumber < 3 : false
    const left = 3 - (exam?.attemptNumber || 0)
    return (
      <div className="space-y-6">
        <Card className={cn('p-6 text-center', result.passed ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5')}>
          <div className="mb-2 flex justify-center">
            <ProgressRing progress={result.score} size={80} />
          </div>
          <div className="text-2xl font-bold">
            {result.passed ? t('exam.passed', lang) : t('exam.failed', lang)}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {fill(t('exam.ofCorrect', lang), {
              c: result.correctCount,
              t: result.totalQuestions,
              score: result.score,
            })}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {result.passed
              ? t('exam.passedContinue', lang)
              : canRetry
                ? fill(t('exam.retriesLeft', lang), { n: left })
                : t('exam.maxAttemptsSection', lang)}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {canRetry && (
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                {fill(t('exam.retryWithCount', lang), { n: left })}
              </Button>
            )}
          </div>
        </Card>

        <ExamReview answers={result.detailedAnswers} />

        <Button onClick={() => { setExam(null); setSubmitted(false); setResult(null) }} className="w-full">
          {t('exam.backToSummary', lang)}
        </Button>
      </div>
    )
  }

  const completedAttempts = previousAttempts.filter((a) => a.completedAt)
  // Legacy attempts are listed but neither count nor use up an attempt.
  const counted = completedAttempts.filter((a) => !a.legacy)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-rose-600" />
        <h2 className="text-xl font-semibold">{t('exam.title', lang)} — {sectionTitle}</h2>
      </div>

      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <div className="text-sm font-semibold">{t('exam.antiPlagiarism', lang)}</div>
            <p className="mt-1 text-sm text-foreground/80">
              {t('exam.antiPlagiarismDesc', lang)}
            </p>
          </div>
        </div>
      </Card>

      {previousAttempts.length > 0 && <AttemptHistory attempts={completedAttempts} />}

      {counted.length >= 3 ? (
        <MaxAttemptsCard attempts={counted} />
      ) : (
        <Button
          onClick={handleStartExam}
          disabled={loading}
          className="w-full gap-2"
          size="lg"
          data-testid="exam-start"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
          {counted.length === 0
            ? t('exam.start', lang)
            : `${t('exam.startN', lang)} ${counted.length + 1}`}
        </Button>
      )}
    </div>
  )
}

/**
 * The attempts already graded. Counted ones are numbered by their place among counted attempts,
 * which is what "Intento n de 3" means; a legacy one keeps its stored number and says it does not
 * count.
 */
function AttemptHistory({ attempts }: { attempts: AttemptSummary[] }) {
  const lang = useI18n((s) => s.lang)
  const position = new Map(attempts.filter((a) => !a.legacy).map((a, i) => [a.id, i + 1]))
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{t('exam.previousAttempts', lang)}</h3>
      <div className="space-y-2">
        {attempts.map((a) => {
          const n = position.get(a.id) ?? a.attemptNumber
          const reason = unscoredReason(a)
          return (
            <Card key={a.id} className={cn('flex items-center justify-between p-3', reason && 'opacity-70')}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
                    reason ? 'bg-muted-foreground' : a.score >= 70 ? 'bg-green-500' : a.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                >
                  {n}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {t('exam.attempt', lang)} {n}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.completedAt && new Date(a.completedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-PE')}
                    {' · '}
                    {Math.floor(a.timeSpentSec / 60)}m {a.timeSpentSec % 60}s
                  </div>
                  {reason && (
                    <div className="text-xs text-muted-foreground" data-testid={`exam-unscored-${a.id}`}>
                      {t(reason, lang)}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={!reason && a.score >= 70 ? 'default' : 'secondary'}>
                {a.score}%
              </Badge>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/** All three attempts used. The best score shown is the best one that counts, if any does. */
function MaxAttemptsCard({ attempts }: { attempts: AttemptSummary[] }) {
  const lang = useI18n((s) => s.lang)
  const scored = attempts.filter(scoreCounts)
  return (
    <Card className="border-amber-500/40 bg-amber-500/5 p-4 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" />
      <h3 className="mt-2 font-semibold">{t('exam.maxAttempts', lang)}</h3>
      {scored.length > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          {fill(t('exam.bestScore', lang), {
            score: Math.max(...scored.map((a) => a.score)),
          })}
        </p>
      )}
    </Card>
  )
}

/** Said at the top of an attempt that includes questions whose correct answer the learner saw. */
function ExposedNote({ count }: { count: number }) {
  const lang = useI18n((s) => s.lang)
  if (count <= 0) return null
  return (
    <Card className="border-amber-500/30 bg-amber-500/5 p-4 text-sm" data-testid="exam-exposed-warning">
      {t('exam.exposedWarning', lang)}
    </Card>
  )
}

/**
 * Time left in the attempt, counted from when the page received it. At zero it calls onExpire
 * once, which sends what is marked; the server allows a short grace for the request to arrive.
 */
function ExamCountdown({ limitSec, startedAt, onExpire }: { limitSec: number; startedAt: number; onExpire: () => void }) {
  const lang = useI18n((s) => s.lang)
  const [now, setNow] = useState(() => Date.now())
  const expire = useRef(onExpire)
  const fired = useRef(false)
  useEffect(() => {
    expire.current = onExpire
  })
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, Math.ceil(limitSec - (now - startedAt) / 1000))
  useEffect(() => {
    if (left === 0 && !fired.current) {
      fired.current = true
      expire.current()
    }
  }, [left])
  const time = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`
  return (
    <Badge variant={left <= 300 ? 'destructive' : 'outline'} className="gap-1.5 tabular-nums" role="timer" data-testid="exam-countdown">
      {fill(t('exam.timeLeft', lang), { time })}
    </Badge>
  )
}

/**
 * The per-question review after a submission: the question, the option the learner chose and
 * whether it was right. The correct option and the explanation never reach the page (V3 roadmap,
 * line 93), and this says so and what to do instead.
 */
function ExamReview({ answers }: { answers: ReviewedAnswer[] }) {
  const lang = useI18n((s) => s.lang)
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{t('exam.review', lang)}</h3>
      <p className="mb-3 text-xs text-muted-foreground" data-testid="exam-key-withheld">
        {t('exam.keyWithheld', lang)}
      </p>
      <div className="space-y-3">
        {answers.map((a, i) => (
          <Card key={i} className={cn('p-4', a.correct ? 'border-green-500/30' : 'border-red-500/30')}>
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                  a.correct ? 'bg-green-500' : 'bg-red-500'
                )}
              >
                {a.correct ? '✓' : '✗'}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.question}</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className={cn('flex items-center gap-1', a.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300')}>
                    <span>
                      {t('exam.yourAnswer', lang)}: {a.options[a.selectedIndex] || t('exam.noAnswer', lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
