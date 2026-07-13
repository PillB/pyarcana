'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  PlayCircle,
  Users,
  Rocket,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Target,
  Briefcase,
  Clock,
  Lightbulb,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  X,
  Award,
  ExternalLink,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { useProgressStore, SUB_STEPS, type SubStep } from '@/lib/progress-store'
import type { CourseSection } from '@/lib/types'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import { RichText } from './RichText'
import { ProgressRing } from './ProgressRing'
import { ExamView } from './ExamView'

interface SectionViewProps {
  section: CourseSection
  onPrev: () => void
  onNext: () => void
  hasNext: boolean
  hasPrev: boolean
  onOpenAuth: () => void
}

const TAB_META: Record<SubStep, { icon: React.ElementType; label: string; color: string }> = {
  theory: { icon: BookOpen, label: 'Teoría', color: 'text-sky-600' },
  ido: { icon: PlayCircle, label: 'Yo hago', color: 'text-violet-600' },
  wedo: { icon: Users, label: 'Hacemos juntos', color: 'text-amber-600' },
  youdo: { icon: Rocket, label: 'Tú haces', color: 'text-emerald-600' },
  quiz: { icon: HelpCircle, label: 'Autocheck', color: 'text-rose-600' },
}

export function SectionView({ section, onPrev, onNext, hasNext, hasPrev, onOpenAuth }: SectionViewProps) {
  const [activeTab, setActiveTab] = useState<SubStep>('theory')
  const { data: session } = useSession()
  const {
    completedSubSteps,
    toggleSubStep,
    toggleSectionComplete,
    quizScores,
    setQuizScore,
    setLastVisited,
  } = useProgressStore()

  const subStepsDone = completedSubSteps[section.id] || []
  const allDone = SUB_STEPS.every((s) => subStepsDone.includes(s))

  useEffect(() => {
     
    setLastVisited(section.id)
    // scroll to top
    document.getElementById('section-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [section.id, setLastVisited])

  // Reset active tab when section changes (deferred to avoid effect cascading)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab('theory')
  }, [section.id])

  const sectionProgress = Math.round(
    (subStepsDone.length / SUB_STEPS.length) * 100
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8" id="section-content">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
            <span className="font-bold">Sección {section.index}</span>
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3 w-3" />
            {section.estimatedHours}h estimadas
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Target className="h-3 w-3" />
            {section.level}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">{section.title}</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{section.tagline}</p>

        {/* Job relevance strip */}
        <Card className="mt-4 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                ¿Para qué te sirve esto en la pega?
              </div>
              <p className="mt-1 text-sm text-foreground/80">{section.jobRelevance}</p>
            </div>
          </div>
        </Card>

        {/* Learning outcomes */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {section.learningOutcomes.map((lo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground/90">{lo.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress strip */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
        <ProgressRing progress={sectionProgress} size={56} />
        <div className="flex-1">
          <div className="text-sm font-semibold">Progreso de la sección</div>
          <div className="text-xs text-muted-foreground">
            {subStepsDone.length} de {SUB_STEPS.length} etapas completadas
          </div>
        </div>
        {allDone && (
          <Badge className="gap-1 bg-green-600 text-white">
            <Award className="h-3 w-3" />
            Completada
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SubStep)}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          {SUB_STEPS.map((step) => {
            const meta = TAB_META[step]
            const Icon = meta.icon
            const done = subStepsDone.includes(step)
            return (
              <TabsTrigger
                key={step}
                value={step}
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={cn('h-4 w-4', meta.color)} />
                  {done && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                </div>
                <span className="text-[11px] sm:text-xs">{meta.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <TabsContent value="theory" className="mt-0 focus-visible:outline-none">
              <TheoryTab section={section} onDone={() => toggleSubStep(section.id, 'theory')} done={subStepsDone.includes('theory')} />
            </TabsContent>
            <TabsContent value="ido" className="mt-0 focus-visible:outline-none">
              <IDoTab section={section} onDone={() => toggleSubStep(section.id, 'ido')} done={subStepsDone.includes('ido')} />
            </TabsContent>
            <TabsContent value="wedo" className="mt-0 focus-visible:outline-none">
              <WeDoTab section={section} onDone={() => toggleSubStep(section.id, 'wedo')} done={subStepsDone.includes('wedo')} />
            </TabsContent>
            <TabsContent value="youdo" className="mt-0 focus-visible:outline-none">
              <YouDoTab section={section} onDone={() => toggleSubStep(section.id, 'youdo')} done={subStepsDone.includes('youdo')} />
            </TabsContent>
            <TabsContent value="quiz" className="mt-0 focus-visible:outline-none">
              {session?.user ? (
                <ExamView
                  sectionId={section.id}
                  sectionTitle={section.title}
                  onAuthRequired={onOpenAuth}
                />
              ) : (
                <QuizTab
                  section={section}
                  onDone={() => {
                    toggleSubStep(section.id, 'quiz')
                    if (allDone || subStepsDone.length >= SUB_STEPS.length - 1) {
                      toggleSectionComplete(section.id)
                    }
                  }}
                  done={subStepsDone.includes('quiz')}
                  score={quizScores[section.id] || 0}
                  onSubmitScore={(s) => {
                    setQuizScore(section.id, s)
                  }}
                />
              )}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Bottom nav */}
      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!hasPrev}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {SUB_STEPS.map((s) => (
            <span
              key={s}
              className={cn(
                'h-1.5 w-6 rounded-full transition-colors',
                subStepsDone.includes(s) ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <Button
          onClick={onNext}
          disabled={!hasNext}
          className="gap-2"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// === Theory Tab ===
function TheoryTab({ section, onDone, done }: { section: CourseSection; onDone: () => void; done: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold">Teoría</h2>
      </div>
      {section.theory.map((block, i) => (
        <RichText key={i} content={block.heading + '\n\n' + block.paragraphs.join('\n\n')} />
      ))}
      {/* Renderizar bloques estructurados si existen */}
      {section.theory.map((block, i) => (
        <div key={`structured-${i}`}>
          {block.code && (
            <CodeBlock
              code={block.code.code}
              language={block.code.language}
              title={block.code.title}
              output={block.code.output}
            />
          )}
          {block.callout && (
            <Callout type={block.callout.type} title={block.callout.title}>
              {block.callout.content}
            </Callout>
          )}
        </div>
      ))}
      <MarkDoneButton onDone={onDone} done={done} label="Marcar teoría como leída" />
    </div>
  )
}

// === I Do Tab ===
function IDoTab({ section, onDone, done }: { section: CourseSection; onDone: () => void; done: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PlayCircle className="h-5 w-5 text-violet-600" />
        <h2 className="text-xl font-semibold">Yo hago — Demostración guiada</h2>
      </div>
      <Callout type="info" title="¿Qué hace el profe?">
        Te muestro paso a paso cómo se resuelve un problema real con los conceptos de esta sección. Fíjate en el <strong>por qué</strong> de cada línea, no solo en el qué. Esta es la fase <strong>I Do</strong> del método Gradual Release of Responsibility.
      </Callout>
      <RichText content={section.iDo.intro} />
      {section.iDo.steps.map((step, i) => (
        <Card key={i} className="overflow-hidden border-violet-500/20">
          <div className="border-b border-border/60 bg-violet-500/5 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-semibold">{step.description}</span>
            </div>
          </div>
          <div className="p-5">
            <CodeBlock
              code={step.code.code}
              language={step.code.language}
              title={step.code.title}
              output={step.code.output}
            />
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Lightbulb className="h-3.5 w-3.5" />
                ¿Por qué este código?
              </div>
              <p className="mt-1 text-sm text-foreground/80">{step.why}</p>
            </div>
          </div>
        </Card>
      ))}
      <MarkDoneButton onDone={onDone} done={done} label="Entendido, marcado como visto" />
    </div>
  )
}

// === We Do Tab ===
function WeDoTab({ section, onDone, done }: { section: CourseSection; onDone: () => void; done: boolean }) {
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({})

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-semibold">Hacemos juntos — Práctica guiada</h2>
      </div>
      <Callout type="tip" title="Manos a la obra, en pareja">
        Ahora te toca a ti escribir el código, pero con mi guía. Lee la instrucción, intenta completar el starter code, y si te trabas, revisa la solución. <strong>La magia ocurre cuando escribes el código tú mismo</strong> — no copies sin entender.
      </Callout>
      <RichText content={section.weDo.intro} />
      {section.weDo.steps.map((step, i) => {
        const showSol = showSolutions[i] || false
        return (
          <Card key={i} className="overflow-hidden border-amber-500/20">
            <div className="border-b border-border/60 bg-amber-500/5 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold">{step.instruction}</span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <Callout type="tip" title="Pista">
                {step.hint}
              </Callout>
              <div>
                <div className="mb-2 text-xs font-medium text-muted-foreground">Starter code:</div>
                <CodeBlock
                  code={step.starterCode.code}
                  language={step.starterCode.language}
                  title={step.starterCode.title}
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolutions((s) => ({ ...s, [i]: !s[i] }))}
                  className="gap-2"
                >
                  {showSol ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Ocultar solución
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Ver solución
                    </>
                  )}
                </Button>
              </div>
              {showSol && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Solución:</div>
                  <CodeBlock
                    code={step.solutionCode.code}
                    language={step.solutionCode.language}
                    title={step.solutionCode.title}
                    output={step.solutionCode.output}
                  />
                </motion.div>
              )}
            </div>
          </Card>
        )
      })}
      <MarkDoneButton onDone={onDone} done={done} label="Práctica completada" />
    </div>
  )
}

// === You Do Tab ===
function YouDoTab({ section, onDone, done }: { section: CourseSection; onDone: () => void; done: boolean }) {
  const project = section.youDo
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-semibold">Tú haces — Proyecto para tu portafolio</h2>
      </div>
      <Callout type="success" title="Tu momento de brillar">
        Este es el proyecto que vas a subir a tu GitHub y mostrar en entrevistas. Tómate tu tiempo, no te apresures. Si te trabas, vuelve a la teoría o al I Do — pero intenta resolverlo solo primero. <strong>Acá es donde se consolida el aprendizaje.</strong>
      </Callout>

      <Card className="overflow-hidden border-emerald-500/30 shadow-glow">
        <div className="gradient-primary px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-bold">{project.title}</h3>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="text-sm font-semibold text-foreground">Contexto</div>
            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Objetivos</div>
            <ul className="mt-2 space-y-2">
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Requisitos técnicos</div>
            <ul className="mt-2 space-y-1.5">
              {project.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span className="font-mono text-[13px]">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.starterCode && (
            <div>
              <div className="mb-2 text-sm font-semibold text-foreground">Starter code</div>
              <CodeBlock code={project.starterCode} language="python" title="starter.py" />
            </div>
          )}

          <Callout type="tip" title="Tip para tu portafolio">
            {project.portfolioNote}
          </Callout>

          <div>
            <div className="mb-2 text-sm font-semibold text-foreground">Rúbrica de evaluación</div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Criterio</th>
                    <th className="px-3 py-2 text-right font-medium text-foreground">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {project.rubric.map((r, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="px-3 py-2 text-foreground/80">{r.criterion}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{r.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      <MarkDoneButton onDone={onDone} done={done} label="Proyecto enviado a mi GitHub" />
    </div>
  )
}

// === Quiz Tab ===
function QuizTab({
  section,
  onDone,
  done,
  score,
  onSubmitScore,
}: {
  section: CourseSection
  onDone: () => void
  done: boolean
  score: number
  onSubmitScore: (s: number) => void
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    const total = section.selfCheck.questions.length
    const correct = section.selfCheck.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    )
    const pct = Math.round((correct / total) * 100)
    onSubmitScore(pct)
    setSubmitted(true)
    if (pct >= 70) {
      onDone()
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  const total = section.selfCheck.questions.length
  const correct = section.selfCheck.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  )
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-rose-600" />
        <h2 className="text-xl font-semibold">Autocheck — Verifica tu aprendizaje</h2>
      </div>
      <Callout type="info" title="¿Para qué este quiz?">
        Active recall: intentar recordar lo que aprendiste es más efectivo que releer. Contesta sin mirar la teoría. Si sacas 70% o más, desbloqueas la siguiente sección. Si no, vuelve a repasar y reintenta.
      </Callout>

      {section.selfCheck.questions.map((q, qIdx) => {
        const userAnswer = answers[qIdx]
        const isCorrect = userAnswer === q.correctIndex
        return (
          <Card key={qIdx} className="overflow-hidden">
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
                  const showCorrect = submitted && oIdx === q.correctIndex
                  const showWrong = submitted && isSelected && oIdx !== q.correctIndex
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                        showCorrect
                          ? 'border-green-500 bg-green-500/5 text-foreground'
                          : showWrong
                            ? 'border-red-500 bg-red-500/5 text-foreground'
                            : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/40 hover:bg-accent/50',
                        submitted && 'cursor-default'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                          showCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : showWrong
                              ? 'border-red-500 bg-red-500 text-white'
                              : isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted text-muted-foreground'
                        )}
                      >
                        {showCorrect ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : showWrong ? (
                          <X className="h-3.5 w-3.5" />
                        ) : (
                          String.fromCharCode(65 + oIdx)
                        )}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <div
                  className={cn(
                    'mt-3 rounded-lg p-3 text-xs',
                    isCorrect ? 'bg-green-500/10 text-green-900 dark:text-green-200' : 'bg-red-500/10 text-red-900 dark:text-red-200'
                  )}
                >
                  <strong>{isCorrect ? '✓ Correcto. ' : '✗ Incorrecto. '}</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          </Card>
        )
      })}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < total}
          className="w-full gap-2"
          size="lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          Enviar respuestas ({Object.keys(answers).length}/{total})
        </Button>
      ) : (
        <Card className={cn('p-5 text-center', pct >= 70 ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5')}>
          <div className="mb-2 flex justify-center">
            <div className="relative">
              <ProgressRing progress={pct} size={72} />
            </div>
          </div>
          <div className="text-lg font-bold">
            {pct >= 70 ? '¡Buenazo! Sección completada' : 'Casi, vuelve a intentarlo'}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {correct} de {total} correctas ({pct}%)
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={handleRetry} className="gap-2">
              Reintentar
            </Button>
            {pct >= 70 && (
              <Button className="gap-2" onClick={onDone}>
                <Award className="h-4 w-4" />
                Marcar como completada
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

// === Mark Done Button ===
function MarkDoneButton({ onDone, done, label }: { onDone: () => void; done: boolean; label: string }) {
  return (
    <Button
      onClick={onDone}
      variant={done ? 'secondary' : 'default'}
      className={cn('w-full gap-2', done && 'bg-green-600 text-white hover:bg-green-700')}
      size="lg"
    >
      <CheckCircle2 className="h-4 w-4" />
      {done ? 'Completado' : label}
    </Button>
  )
}
