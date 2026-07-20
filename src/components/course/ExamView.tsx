'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle, CheckCircle2, Clock, Award, AlertTriangle,
  Loader2, RotateCcw, Trophy, X, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from './ProgressRing'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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
}

interface AttemptSummary {
  id: string
  attemptNumber: number
  score: number
  completedAt: string | null
  timeSpentSec: number
}

interface ExamViewProps {
  sectionId: string
  sectionTitle: string
  onAuthRequired: () => void
}

export function ExamView({ sectionId, sectionTitle, onAuthRequired }: ExamViewProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [exam, setExam] = useState<ExamStartResponse | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{
    score: number
    correctCount: number
    totalQuestions: number
    detailedAnswers: {
      questionId: string
      concept: string
      question: string
      options: string[]
      selectedIndex: number
      correctIndex: number
      correct: boolean
      explanation: string
    }[]
    passed: boolean
  } | null>(null)
  const [previousAttempts, setPreviousAttempts] = useState<AttemptSummary[]>([])
  const [startTime, setStartTime] = useState<number>(0)

  // Load previous attempts
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
          title: 'No se puede iniciar el examen',
          description: data.error || 'Error desconocido',
          variant: 'destructive',
        })
        return
      }
      setExam(data)
      setAnswers({})
      setSubmitted(false)
      setResult(null)
      setStartTime(Date.now())
    } catch {
      toast({ title: 'Error de conexión', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!exam) return
    setLoading(true)
    const timeSpentSec = Math.round((Date.now() - startTime) / 1000)

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: exam.attemptId,
          answers: exam.questions.map((q) => ({
            questionId: q.id,
            selectedIndex: answers[q.id] ?? -1,
          })),
          timeSpentSec,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: data.error || 'Error', variant: 'destructive' })
        return
      }
      setResult(data)
      setSubmitted(true)
      // Refresh previous attempts
      const attemptsRes = await fetch(`/api/exam/attempts?sectionId=${sectionId}`)
      const attemptsData = await attemptsRes.json()
      setPreviousAttempts(attemptsData.attempts || [])
      toast({
        title: data.passed ? '✓ Examen aprobado' : 'No aprobaste esta vez',
        description: `Score: ${data.score}% (${data.correctCount}/${data.totalQuestions})`,
      })
    } catch {
      toast({ title: 'Error de conexión', variant: 'destructive' })
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

  // Not logged in
  if (status !== 'authenticated') {
    return (
      <Card className="border-primary/30 bg-primary/5 p-6 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 text-lg font-semibold">Inicia sesión para rendir el examen</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          El examen guarda tu score, intentos y tiempo. Necesitas una cuenta para tracking.
        </p>
        <Button onClick={onAuthRequired} className="mt-4 gap-2" data-testid="exam-auth-required">
          Iniciar sesión
        </Button>
      </Card>
    )
  }

  // Loading state
  if (loading && !exam) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando examen...</span>
      </div>
    )
  }

  // Exam in progress
  if (exam && !submitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-semibold">Examen — {sectionTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {exam.questions.length} pregunta{exam.questions.length === 1 ? '' : 's'} · 1 por concepto
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              Intento {exam.attemptNumber} de {exam.totalAttemptsAllowed}
            </Badge>
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div className="text-sm">
              <strong>Reglas:</strong> Una pregunta por concepto ({exam.questions.length} en este intento). Tienes 3 intentos máximo por sección. Cada intento usa variantes diferentes. Tu mejor score es el que cuenta. Necesitas 70% para aprobar.
            </div>
          </div>
        </Card>

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
          onClick={handleSubmit}
          disabled={loading || Object.keys(answers).length < exam.questions.length}
          className="w-full gap-2"
          size="lg"
          data-testid="exam-submit"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Enviar respuestas ({Object.keys(answers).length}/{exam.questions.length})
        </Button>
      </div>
    )
  }

  // Result view
  if (submitted && result) {
    const canRetry = exam ? exam.attemptNumber < 3 : false
    return (
      <div className="space-y-6">
        <Card className={cn('p-6 text-center', result.passed ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5')}>
          <div className="mb-2 flex justify-center">
            <ProgressRing progress={result.score} size={80} />
          </div>
          <div className="text-2xl font-bold">
            {result.passed ? '¡Aprobado! 🎉' : 'No aprobaste esta vez'}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.correctCount} de {result.totalQuestions} correctas · Score: {result.score}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {result.passed
              ? 'Pasaste la sección. Puedes continuar a la siguiente.'
              : canRetry
                ? `Te quedan ${3 - (exam?.attemptNumber || 0)} intento(s).`
                : 'Has agotado tus 3 intentos para esta sección.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {canRetry && (
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reintentar ({3 - (exam?.attemptNumber || 0)} restantes)
              </Button>
            )}
          </div>
        </Card>

        {/* Detailed answers */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Revisión de respuestas</h3>
          <div className="space-y-3">
            {result.detailedAnswers.map((a, i) => (
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
                        <span>Tu respuesta: {a.options[a.selectedIndex] || 'Sin responder'}</span>
                      </div>
                      {!a.correct && (
                        <div className="text-green-700 dark:text-green-300">
                          Correcta: {a.options[a.correctIndex]}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground italic">{a.explanation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={() => { setExam(null); setSubmitted(false); setResult(null) }} className="w-full">
          Volver al resumen
        </Button>
      </div>
    )
  }

  // Default: show intro + previous attempts + start button
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-rose-600" />
        <h2 className="text-xl font-semibold">Examen — {sectionTitle}</h2>
      </div>

      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <div className="text-sm font-semibold">Examen de sección con anti-plagio</div>
            <p className="mt-1 text-sm text-foreground/80">
              <strong>Una pregunta por concepto</strong> (el total depende del banco de la sección; secciones V3 completas: 8).
              Cada intento muestra <strong>variantes diferentes</strong> (3 equivalentes por concepto).
              Tienes <strong>3 intentos máximo</strong> (2 retries). Tu mejor score es el que cuenta.
              Necesitas <strong>70% para aprobar</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Previous attempts */}
      {previousAttempts.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Tus intentos anteriores</h3>
          <div className="space-y-2">
            {previousAttempts
              .filter((a) => a.completedAt)
              .map((a) => (
                <Card key={a.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
                        a.score >= 70 ? 'bg-green-500' : a.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                    >
                      {a.attemptNumber}
                    </div>
                    <div>
                      <div className="text-sm font-medium">Intento {a.attemptNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.completedAt && new Date(a.completedAt).toLocaleDateString('es-PE')}
                        {' · '}
                        {Math.floor(a.timeSpentSec / 60)}m {a.timeSpentSec % 60}s
                      </div>
                    </div>
                  </div>
                  <Badge variant={a.score >= 70 ? 'default' : 'secondary'}>
                    {a.score}%
                  </Badge>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Max attempts reached */}
      {previousAttempts.filter((a) => a.completedAt).length >= 3 ? (
        <Card className="border-amber-500/40 bg-amber-500/5 p-4 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" />
          <h3 className="mt-2 font-semibold">Has agotado tus 3 intentos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu mejor score: {Math.max(...previousAttempts.filter(a => a.completedAt).map(a => a.score))}%
          </p>
        </Card>
      ) : (
        <Button
          onClick={handleStartExam}
          disabled={loading}
          className="w-full gap-2"
          size="lg"
          data-testid="exam-start"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
          {previousAttempts.length === 0 ? 'Iniciar primer intento' : `Iniciar intento ${previousAttempts.filter(a => a.completedAt).length + 1}`}
        </Button>
      )}
    </div>
  )
}
