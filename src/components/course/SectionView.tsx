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
import { CodePlayground } from './CodePlayground'

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
                ¿Para qué te sirve esto en el trabajo?
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

      {/* Interactive playground — appears in every section's theory tab */}
      <InteractivePlaygroundDemo sectionId={section.id} sectionTitle={section.title} />

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

// === Interactive Playground Demo ===
// Per-section code examples that students can run in the browser
function InteractivePlaygroundDemo({ sectionId, sectionTitle }: { sectionId: string; sectionTitle: string }) {
  const demos: Record<string, { code: string; expectedOutput?: string; hint?: string; title: string }> = {
    'setup': {
      title: 'Tu primer programa en Python',
      code: `# Tu primer programa en Python
# Escribe tu nombre y ejecuta con Run
nombre = "Estudiante"
print(f"Hola {nombre}, bienvenido a Python DS Perú!")

# Calcula tu edad en meses
edad_anos = 25
edad_meses = edad_anos * 12
print(f"Tu edad en meses: {edad_meses}")`,
      expectedOutput: `Hola Estudiante, bienvenido a Python DS Perú!
Tu edad en meses: 300`,
      hint: 'Cambia el valor de nombre y edad_anos por tus datos',
    },
    'basics': {
      title: 'Practica variables y tipos',
      code: `# Practica los tipos basicos de Python
edad = 25
altura = 1.75
nombre = "Ana"
es_alumno = True

# Imprime el tipo de cada variable
print(f"edad: {edad} -> {type(edad).__name__}")
print(f"altura: {altura} -> {type(altura).__name__}")
print(f"nombre: {nombre} -> {type(nombre).__name__}")
print(f"es_alumno: {es_alumno} -> {type(es_alumno).__name__}")

# Operacion: lista comprehension
numeros = [1, 2, 3, 4, 5]
cuadrados = [n**2 for n in numeros]
print(f"Cuadrados: {cuadrados}")`,
      expectedOutput: `edad: 25 -> int
altura: 1.75 -> float
nombre: Ana -> str
es_alumno: True -> bool
Cuadrados: [1, 4, 9, 16, 25]`,
      hint: 'Cambia los valores y observa cómo cambia el output',
    },
    'data-structures': {
      title: 'Practica dict y list',
      code: `# Practica estructuras de datos
alumnos = [
    {"nombre": "Ana", "nota": 18},
    {"nombre": "Luis", "nota": 15},
    {"nombre": "Carlos", "nota": 20}
]

# List comprehension para extraer nombres
nombres = [a["nombre"] for a in alumnos]
print(f"Nombres: {nombres}")

# Promedio de notas
promedio = sum(a["nota"] for a in alumnos) / len(alumnos)
print(f"Promedio: {promedio}")

# Dict comprehension: nombre -> aprobado?
resultados = {a["nombre"]: "Aprobado" if a["nota"] >= 14 else "Desaprobado" for a in alumnos}
print(f"Resultados: {resultados}")`,
      expectedOutput: `Nombres: ['Ana', 'Luis', 'Carlos']
Promedio: 17.666666666666668
Resultados: {'Ana': 'Aprobado', 'Luis': 'Aprobado', 'Carlos': 'Aprobado'}`,
      hint: 'Agrega un cuarto alumno y observa cómo cambian los resultados',
    },
    'functions-modules': {
      title: 'Practica funciones y decorators',
      code: `# Practica funciones y decorators
import functools
import time

def timing(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        inicio = time.time()
        result = func(*args, **kwargs)
        elapsed = (time.time() - inicio) * 1000
        print(f"⏱️  {func.__name__} tardó {elapsed:.2f}ms")
        return result
    return wrapper

@timing
def fibonacci(n):
    """Calcula el n-ésimo número de Fibonacci."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Probar
resultado = fibonacci(10)
print(f"fibonacci(10) = {resultado}")`,
      hint: 'Intenta con fibonacci(15) o fibonacci(20) para ver cómo crece el tiempo',
    },
    'oop': {
      title: 'Practica clases y herencia',
      code: `# Practica OOP
class Animal:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def hacer_sonido(self):
        return "sonido generico"

    def __str__(self):
        return f"{self.nombre} ({self.edad} años)"

class Perro(Animal):
    def __init__(self, nombre, edad, raza):
        super().__init__(nombre, edad)
        self.raza = raza

    def hacer_sonido(self):
        return "Guau!"

    def __str__(self):
        return f"{self.nombre}, {self.raza}, {self.edad} años"

# Crear instancias
animal = Animal("Generico", 5)
fido = Perro("Fido", 3, "Labrador")

print(animal)
print(f"Sonido: {animal.hacer_sonido()}")
print()
print(fido)
print(f"Sonido: {fido.hacer_sonido()}")`,
      hint: 'Crea una clase Gato que herede de Animal y haga "Miau!"',
    },
    'numpy': {
      title: 'Practica NumPy vectorizado',
      code: `# Practica NumPy (se carga automaticamente)
import numpy as np

# Crear array
arr = np.array([1, 2, 3, 4, 5])
print(f"Array: {arr}")
print(f"Shape: {arr.shape}")
print(f"Mean: {arr.mean()}")

# Operaciones vectorizadas
print(f"Cuadrados: {arr ** 2}")
print(f"Doble: {arr * 2}")

# Boolean masking
print(f"Mayores a 3: {arr[arr > 3]}")

# Matriz 2D
matriz = np.array([[1, 2, 3], [4, 5, 6]])
print(f"\\nMatriz:\\n{matriz}")
print(f"Suma por columnas: {matriz.sum(axis=0)}")
print(f"Suma por filas: {matriz.sum(axis=1)}")`,
      hint: 'Crea una matriz 3x3 y calcula su transpuesta con .T',
    },
    'pandas': {
      title: 'Practica pandas DataFrame',
      code: `# Practica pandas (se carga automaticamente)
import pandas as pd

# Crear DataFrame
df = pd.DataFrame({
    "producto": ["arroz", "aceite", "azucar", "arroz"],
    "region": ["Lima", "Lima", "Arequipa", "Cusco"],
    "ventas": [1500, 800, 900, 1200]
})

print("=== DataFrame ===")
print(df)
print(f"\\nShape: {df.shape}")

# GroupBy: ventas por producto
print("\\n=== Ventas por producto ===")
print(df.groupby("producto")["ventas"].sum())

# Filtrado
print("\\n=== Solo Lima ===")
print(df[df["region"] == "Lima"])

# Estadisticas
print(f"\\nVentas totales: {df['ventas'].sum()}")
print(f"Ticket promedio: {df['ventas'].mean():.2f}")`,
      expectedOutput: `=== DataFrame ===
  producto   region  ventas
0    arroz     Lima    1500
1   aceite     Lima     800
2  azucar  Arequipa     900
3    arroz    Cusco    1200

Shape: (4, 3)`,
      hint: 'Agrega una quinta fila y observa cómo cambian los groupby',
    },
    'visualization': {
      title: 'Practica matplotlib',
      code: `# Practica matplotlib (se carga automaticamente)
import matplotlib.pyplot as plt
import numpy as np

# Datos
meses = ["Ene", "Feb", "Mar", "Abr", "May"]
ventas_2024 = [120, 145, 138, 165, 178]
ventas_2025 = [135, 158, 162, 180, 195]

# Crear grafico
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(meses, ventas_2024, marker='o', label='2024')
ax.plot(meses, ventas_2025, marker='s', label='2025')
ax.set_title('Ventas mensuales')
ax.set_xlabel('Mes')
ax.set_ylabel('Ventas')
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('plot.png', dpi=100)
print("Grafico creado y guardado como plot.png")
print(f"Crecimiento May: {((ventas_2025[-1] - ventas_2024[-1]) / ventas_2024[-1] * 100):.1f}%")`,
      hint: 'Cambia los datos y vuelve a ejecutar para ver cómo cambia el gráfico',
    },
    'sklearn': {
      title: 'Practica scikit-learn',
      code: `# Practica scikit-learn (se carga automaticamente)
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score
import numpy as np

# Datos sinteticos
np.random.seed(42)
X = np.random.randn(100, 3)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

# Entrenar modelo
model = LogisticRegression(random_state=42)
model.fit(X[:80], y[:80])

# Predecir
predictions = model.predict(X[80:])
accuracy = accuracy_score(y[80:], predictions)

print(f"Accuracy: {accuracy:.2%}")
print(f"Coeficientes: {model.coef_[0].round(3)}")
print(f"Intercept: {model.intercept_[0]:.3f}")

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"\\nCV Accuracy: {cv_scores.mean():.2%} ± {cv_scores.std():.2%}")`,
      hint: 'Cambia la semilla (seed) y observa cómo varían los resultados',
    },
    'testing': {
      title: 'Practica testing con asserts',
      code: `# Practica testing con asserts (simulando pytest)
import numpy as np

# Funcion a testear
def calcular_promedio_ponderado(notas, pesos):
    """Calcula promedio ponderado."""
    if len(notas) != len(pesos):
        raise ValueError("Listas deben tener misma longitud")
    if sum(pesos) != 1.0:
        raise ValueError("Pesos deben sumar 1.0")
    return sum(n * p for n, p in zip(notas, pesos))

# === TESTS ===

# Test 1: caso normal
notas = [18, 15, 20]
pesos = [0.3, 0.3, 0.4]
resultado = calcular_promedio_ponderado(notas, pesos)
assert abs(resultado - 17.9) < 0.01, f"Esperado 17.9, got {resultado}"
print("✓ Test 1: promedio ponderado correcto")

# Test 2: error por longitudes distintas
try:
    calcular_promedio_ponderado([1, 2], [1.0])
    print("✗ Test 2: deberia haber fallado")
except ValueError as e:
    assert "misma longitud" in str(e)
    print("✓ Test 2: error de longitud detectado")

# Test 3: error por pesos que no suman 1
try:
    calcular_promedio_ponderado([1, 2], [0.5, 0.3])
    print("✗ Test 3: deberia haber fallado")
except ValueError as e:
    assert "sumar 1.0" in str(e)
    print("✓ Test 3: error de pesos detectado")

# Test 4: edge case - un solo elemento
resultado = calcular_promedio_ponderado([20], [1.0])
assert resultado == 20
print("✓ Test 4: un solo elemento funciona")

print("\\n✅ Todos los tests pasaron!")`,
      expectedOutput: `✓ Test 1: promedio ponderado correcto
✓ Test 2: error de longitud detectado
✓ Test 3: error de pesos detectado
✓ Test 4: un solo elemento funciona

✅ Todos los tests pasaron!`,
      hint: 'Agrega un test para verificar que funciona con notas negativas',
    },
    'advanced-topics': {
      title: 'Practica generators y collections',
      code: `# Practica generators y collections
from collections import Counter, defaultdict
import re

# === GENERATOR: procesar datos en streaming ===
def leer_ventas_sinteticas():
    """Simula leer ventas de un archivo grande."""
    for i in range(10):
        yield {
            "producto": ["arroz", "aceite", "azucar"][i % 3],
            "monto": (i + 1) * 100,
            "region": ["Lima", "Arequipa", "Cusco"][i % 3]
        }

# Procesar con generator (sin cargar todo en memoria)
ventas_por_producto = defaultdict(float)
for venta in leer_ventas_sinteticas():
    ventas_por_producto[venta["producto"]] += venta["monto"]

print("=== Ventas por producto (generator) ===")
for producto, total in ventas_por_producto.items():
    print(f"  {producto}: S/{total}")

# === COUNTER: frecuencias ===
texto = "el arte de python es el camino al dato"
palabras = texto.split()
contador = Counter(palabras)

print("\\n=== Top 3 palabras ===")
for palabra, freq in contador.most_common(3):
    print(f"  '{palabra}': {freq}x")

# === REGEX: extraer datos ===
datos_mixtos = "Contacto: ana@python.pe, 999-888-777. Luis: luis@data.pe"
emails = re.findall(r'[\\w.-]+@[\\w.-]+', datos_mixtos)
telefonos = re.findall(r'\\d{3}-\\d{3}-\\d{3}', datos_mixtos)

print(f"\\n=== Regex ===")
print(f"Emails: {emails}")
print(f"Telefonos: {telefonos}")`,
      hint: 'Modifica el generator para que genere 20 ventas en vez de 10',
    },
    'data-acquisition': {
      title: 'Practica scraping, regex y SQL',
      code: `# Practica adquisicion de datos (sin librerias externas en Pyodide)
import re
import sqlite3
from collections import Counter, defaultdict

# === REGEX: extraer datos de texto desestructurado ===
texto_clientes = """
Cliente 1: Maria Quispe, DNI 12345678, tel 999-888-777, maria@email.pe
Cliente 2: Luis Garcia, DNI 87654321, tel 987-654-321, luis.garcia@empresa.com
Cliente 3: Ana Flores, DNI 11223344, tel 999-111-222, ana.f@pe.org
"""

# Extraer todos los DNIs (8 digitos)
dnis = re.findall(r'\\b\\d{8}\\b', texto_clientes)
print(f"DNIs encontrados: {dnis}")

# Extraer emails
emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', texto_clientes)
print(f"Emails: {emails}")

# Extraer telefonos (formato XXX-XXX-XXX)
telefonos = re.findall(r'\\d{3}-\\d{3}-\\d{3}', texto_clientes)
print(f"Telefonos: {telefonos}")

# === COUNTER: frecuencias ===
nombres = ["Maria", "Luis", "Ana", "Maria", "Carlos", "Maria", "Luis"]
contador = Counter(nombres)
print(f"\\nTop 2 nombres mas frecuentes: {contador.most_common(2)}")

# === DEFAULTDICT: agrupar ===
ventas = [("Maria", 100), ("Luis", 200), ("Maria", 150), ("Ana", 300)]
por_vendedor = defaultdict(list)
for nombre, monto in ventas:
    por_vendedor[nombre].append(monto)

print("\\nVentas por vendedor:")
for vendedor, montos in por_vendedor.items():
    print(f"  {vendedor}: {montos} (total: {sum(montos)})")`,
      hint: 'Intenta extraer los nombres del texto con regex (palabras despues de "Cliente N:")',
    },
    'performance': {
      title: 'Practica multiprocessing y logging',
      code: `# Practica performance y logging (simulado en Pyodide)
import time
import logging

# === LOGGING setup ===
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

# === BENCHMARK: comparar enfoques ===
def lento(n):
    """Enfoque con loop tradicional."""
    resultado = []
    for i in range(n):
        if i % 2 == 0:
            resultado.append(i ** 2)
    return resultado

def rapido(n):
    """Enfoque con list comprehension."""
    return [i ** 2 for i in range(n) if i % 2 == 0]

# Medir tiempo
n = 100000

inicio = time.time()
r1 = lento(n)
t1 = time.time() - inicio
logger.info(f"Loop tradicional: {t1:.4f}s ({len(r1)} elementos)")

inicio = time.time()
r2 = rapido(n)
t2 = time.time() - inicio
logger.info(f"List comprehension: {t2:.4f}s ({len(r2)} elementos)")

speedup = t1 / t2 if t2 > 0 else 0
logger.info(f"Speedup: {speedup:.1f}x mas rapido con comprehension")

# Verificar que ambos dan el mismo resultado
assert r1 == r2, "Los resultados no coinciden!"
logger.info("✓ Ambos enfoques producen el mismo resultado")`,
      hint: 'Cambia n a 1000000 y observa como cambia el speedup',
    },
    'rpa-automation': {
      title: 'Practica automatización con tenacity y argparse',
      code: `# Practica RPA: retry logic y CLI (simulado en Pyodide)
import time
import random
from functools import wraps

# === DECORADOR DE RETRY (simulando tenacity) ===
def retry(max_attempts=3, delay=0.1):
    """Decorador que reintenta una funcion hasta max_attempts veces."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    result = func(*args, **kwargs)
                    print(f"  ✓ Intento {attempt}: exitoso")
                    return result
                except Exception as e:
                    print(f"  ✗ Intento {attempt}: fallo - {e}")
                    if attempt < max_attempts:
                        time.sleep(delay)
                        print(f"    Reintentando en {delay}s...")
                    else:
                        print(f"  ✗ Agotados {max_attempts} intentos")
                        raise
        return wrapper
    return decorator

# === SIMULAR API QUE FALLA ALEATORIAMENTE ===
@retry(max_attempts=5, delay=0.05)
def llamar_api_inestable(endpoint):
    """Simula una API que falla 70% de las veces."""
    if random.random() < 0.7:
        raise ConnectionError(f"Timeout en {endpoint}")
    return {"status": "ok", "data": [1, 2, 3]}

# Probar la API con retry
print("=== Llamando API inestable con retry ===")
random.seed(42)  # para reproducibilidad
try:
    resultado = llamar_api_inestable("/api/clientes")
    print(f"Resultado: {resultado}")
except Exception as e:
    print(f"Error final: {e}")

# === SIMULAR ARGPARSE ===
print("\\n=== Simulando CLI con argumentos ===")
def procesar_clientes(archivo, formato="csv", verbose=False):
    """Simula procesamiento de clientes con argumentos CLI."""
    if verbose:
        print(f"  Procesando {archivo} en formato {formato}...")
    # Simular procesamiento
    clientes = ["Maria", "Luis", "Ana"]
    if verbose:
        print(f"  Encontrados {len(clientes)} clientes")
    return clientes

# Simular: python script.py --archivo clientes.xlsx --formato xlsx --verbose
procesar_clientes("clientes.xlsx", formato="xlsx", verbose=True)`,
      hint: 'Cambia max_attempts a 10 y observa cuántos intentos necesita la API',
    },
    // === Phase 1 demos (S14-S26) — Pyodide-compatible (stdlib only) ===
    'security': {
      title: 'Practica seguridad: hashing y cifrado',
      code: `# Practica seguridad con biblioteca estandar
import hashlib
import os

# 1. Hash SHA-256 (irreversible - para passwords)
password = "mi_password_123"
hash_sha256 = hashlib.sha256(password.encode()).hexdigest()
print(f"Password: {password}")
print(f"SHA-256:  {hash_sha256}")

# 2. PBKDF2 con salt (mas seguro que SHA-256 solo)
salt = os.urandom(16)
key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
print(f"\\nPBKDF2 (100k iteraciones): {key.hex()[:32]}...")
print(f"Salt: {salt.hex()[:16]}...")

# 3. Verificar password
def verificar_password(password, hash_guardado):
    """Compara hash del password ingresado con el guardado."""
    hash_ingresado = hashlib.sha256(password.encode()).hexdigest()
    return hash_ingresado == hash_guardado

print(f"\\nPassword correcto: {verificar_password('mi_password_123', hash_sha256)}")
print(f"Password incorrecto: {verificar_password('wrong', hash_sha256)}")`,
      hint: 'Cambia el numero de iteraciones de PBKDF2 y observa como cambia el hash',
    },
    'stdlib-deep': {
      title: 'Practica functools y itertools',
      code: `# Practica functools y itertools (biblioteca estandar)
import functools
import itertools

# 1. lru_cache: memoizacion automatica
@functools.lru_cache(maxsize=128)
def fibonacci(n):
    """Fibonacci con cache - O(n) en vez de O(2^n)."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci con lru_cache:")
for i in range(10):
    print(f"  fib({i}) = {fibonacci(i)}")
print(f"  Cache info: {fibonacci.cache_info()}")

# 2. itertools.chain: concatenar iterables
lista1 = [1, 2, 3]
lista2 = [4, 5, 6]
combinado = list(itertools.chain(lista1, lista2))
print(f"\\nChain: {combinado}")

# 3. itertools.combinations
combo = list(itertools.combinations([1, 2, 3, 4], 2))
print(f"Combinations(4,2): {combo}")

# 4. partial: fijar argumentos
def potencia(base, exponente):
    return base ** exponente

cuadrado = functools.partial(potencia, exponente=2)
cubo = functools.partial(potencia, exponente=3)
print(f"\\ncuadrado(5) = {cuadrado(5)}")
print(f"cubo(3) = {cubo(3)}")`,
      hint: 'Cambia maxsize de lru_cache a 1 y observa como cambia el cache_info',
    },
    'wxpython-gui': {
      title: 'Practica eventos y callbacks (simulado)',
      code: `# Simulacion de eventos GUI (sin wxPython en Pyodide)
# Concepto: como funcionan los callbacks de eventos

class Button:
    """Simula un boton de GUI con event binding."""
    def __init__(self, name):
        self.name = name
        self.callback = None
    
    def bind(self, event_type, callback):
        """Vincula un callback a un evento (como wx.EVT_BUTTON)."""
        self.callback = callback
        print(f"  {self.name}: evento '{event_type}' vinculado")
    
    def click(self):
        """Simula un clic del usuario."""
        if self.callback:
            print(f"  {self.name}: CLICK detectado!")
            self.callback()
        else:
            print(f"  {self.name}: sin callback vinculado")

# Crear botones como en wxPython
btn_saludar = Button("btn_saludar")
btn_salir = Button("btn_salir")

# Definir callbacks (event handlers)
def on_saludar(event=None):
    print("    -> Hola desde el boton saludar!")

def on_salir(event=None):
    print("    -> Cerrando aplicacion...")

# Vincular eventos (como btn.Bind(wx.EVT_BUTTON, handler))
btn_saludar.bind("EVT_BUTTON", on_saludar)
btn_salir.bind("EVT_BUTTON", on_salir)

# Simular clics
print("Simulando clics:")
btn_saludar.click()
btn_salir.click()`,
      hint: 'Anade un tercer boton con su propio callback y haz clic en el',
    },
    'packaging': {
      title: 'Practica semver y dependencias',
      code: `# Practica Semantic Versioning y gestion de dependencias
import re

def parse_semver(version_str):
    """Parsea una version semver: MAJOR.MINOR.PATCH."""
    match = re.match(r"^(\\d+)\\.(\\d+)\\.(\\d+)", version_str)
    if not match:
        return None
    return tuple(int(x) for x in match.groups())

def bump_version(version_str, bump_type):
    """Incrementa una version semver."""
    major, minor, patch = parse_semver(version_str)
    if bump_type == "patch":
        patch += 1
    elif bump_type == "minor":
        minor += 1
        patch = 0
    elif bump_type == "major":
        major += 1
        minor = 0
        patch = 0
    return f"{major}.{minor}.{patch}"

# Demostrar semver
version = "1.4.2"
print(f"Version actual: {version}")
print(f"  patch bump:  {bump_version(version, 'patch')}")
print(f"  minor bump:  {bump_version(version, 'minor')}")
print(f"  major bump:  {bump_version(version, 'major')}")

# Verificar compatibilidad
def is_backward_compatible(old, new):
    """True si new es backward compatible con old."""
    o_major, o_minor, _ = parse_semver(old)
    n_major, n_minor, _ = parse_semver(new)
    return n_major == o_major and n_minor >= o_minor

print(f"\\n1.4.2 -> 1.5.0 compatible: {is_backward_compatible('1.4.2', '1.5.0')}")
print(f"1.4.2 -> 2.0.0 compatible: {is_backward_compatible('1.4.2', '2.0.0')}")`,
      hint: 'Implementa una funcion que determine si un bump es breaking change',
    },
    'data-engineering': {
      title: 'Practica idempotencia y ETL',
      code: `# Practica conceptos de Data Engineering (sin dependencias externas)
import json
from collections import defaultdict

# Simular pipeline ETL con idempotencia
class ETLPipeline:
    """Pipeline ETL idempotente: correr N veces = mismo resultado."""
    
    def __init__(self):
        self.processed_ids = set()
        self.output = []
    
    def extract(self, raw_data):
        """Extrae datos de la fuente."""
        return raw_data
    
    def transform(self, records):
        """Transforma: filtra, limpia, agrega."""
        transformed = []
        for r in records:
            # Idempotencia: saltar si ya fue procesado
            if r["id"] in self.processed_ids:
                continue
            self.processed_ids.add(r["id"])
            
            # Transformacion
            r["total"] = r["cantidad"] * r["precio"]
            r["moneda"] = "PEN"
            transformed.append(r)
        return transformed
    
    def load(self, records):
        """Carga al destino (simulado)."""
        self.output.extend(records)
        return len(records)
    
    def run(self, raw_data):
        """Ejecuta el pipeline completo."""
        extracted = self.extract(raw_data)
        transformed = self.transform(extracted)
        loaded = self.load(transformed)
        return loaded

# Datos de prueba
datos = [
    {"id": 1, "cantidad": 10, "precio": 5.0},
    {"id": 2, "cantidad": 5, "precio": 12.0},
    {"id": 3, "cantidad": 8, "precio": 3.5},
]

pipeline = ETLPipeline()

# Primera ejecucion
n1 = pipeline.run(datos)
print(f"Run 1: {n1} registros procesados")
print(f"Output: {json.dumps(pipeline.output, indent=2)}")

# Segunda ejecucion (idempotente - no duplica)
n2 = pipeline.run(datos)
print(f"\\nRun 2: {n2} registros procesados (idempotente!)")
print(f"Total output: {len(pipeline.output)} registros")`,
      hint: 'Que pasa si corres el pipeline 3 veces? El output debe ser el mismo que 1 vez',
    },
    'databases-orm': {
      title: 'Practica SQL y modelos (simulado)',
      code: `# Simulacion de ORM y queries SQL (sin DB real)
import sqlite3
import json

# Crear DB en memoria (sqlite3 es stdlib!)
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

# Crear tabla
cursor.execute("""
    CREATE TABLE clientes (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE,
        edad INTEGER,
        ciudad TEXT
    )
""")

# Insertar datos
clientes = [
    (1, "Ana Garcia", "ana@email.pe", 25, "Lima"),
    (2, "Luis Torres", "luis@email.pe", 30, "Arequipa"),
    (3, "Carlos Diaz", "carlos@email.pe", 22, "Lima"),
    (4, "Maria Quispe", "maria@email.pe", 28, "Cusco"),
]
cursor.executemany("INSERT INTO clientes VALUES (?,?,?,?,?)", clientes)
conn.commit()

# Query: todos los clientes de Lima
cursor.execute("SELECT * FROM clientes WHERE ciudad = ?", ("Lima","))
lima = cursor.fetchall()
print(f"Clientes de Lima: {len(lima)}")
for c in lima:
    print(f"  {c[1]} ({c[3]} anos) - {c[2]}")

# Query: promedio de edad por ciudad
cursor.execute("""
    SELECT ciudad, AVG(edad) as promedio
    FROM clientes
    GROUP BY ciudad
    ORDER BY promedio DESC
""")
print(f"\\nPromedio de edad por ciudad:")
for row in cursor.fetchall():
    print(f"  {row[0]}: {row[1]:.1f} anos")

# Count total
cursor.execute("SELECT COUNT(*) FROM clientes")
print(f"\\nTotal clientes: {cursor.fetchone()[0]}")
conn.close()`,
      hint: 'Anade un cliente mas y re-ejecuta las queries',
    },
    'rag': {
      title: 'Practica retrieval y similitud (simulado)',
      code: `# Simulacion de RAG: retrieval por similitud de texto
# (Sin embeddings reales - usamos Jaccard similarity)

def jaccard_similarity(text1, text2):
    """Similitud de Jaccard entre dos textos.
    Usa conjuntos de palabras: |interseccion| / |union|.
    """
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    intersection = words1 & words2
    union = words1 | words2
    return len(intersection) / len(union) if union else 0

# Base de conocimiento (simulando vector store)
documentos = [
    {"id": 1, "texto": "Python es un lenguaje de programacion interpretado"},
    {"id": 2, "texto": "Pandas es una libreria de Python para analisis de datos"},
    {"id": 3, "texto": "NumPy permite computacion numerica con arrays"},
    {"id": 4, "texto": "scikit-learn es para machine learning en Python"},
    {"id": 5, "texto": "Git es un sistema de control de versiones distribuido"},
]

def retrieve(query, docs, top_k=3):
    """Recupera los top_k documentos mas similares al query."""
    scores = [(d, jaccard_similarity(query, d["texto"])) for d in docs]
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_k]

# Buscar
query = "como analizo datos con Python"
resultados = retrieve(query, documentos, top_k=3)

print(f"Query: '{query}'")
print(f"\\nTop 3 documentos recuperados:")
for doc, score in resultados:
    print(f"  [{score:.1%}] #{doc['id']}: {doc['texto']}")

# Generar respuesta (simulando LLM)
contexto = " ".join([d["texto"] for d, _ in resultados])
print(f"\\nContexto para LLM: '{contexto[:80]}...'")`,
      hint: 'Cambia el query a "que es machine learning" y observa como cambian los resultados',
    },
    'fastapi': {
      title: 'Practica validacion con pydantic (simulado)',
      code: `# Simulacion de validacion de API (estilo FastAPI + Pydantic)
# Sin dependencias externas - usa dataclasses y validacion manual

from dataclasses import dataclass, field
from typing import Optional

@dataclass
class CreateUserRequest:
    """Modelo de request para crear usuario (estilo Pydantic)."""
    email: str
    name: str
    age: int
    role: str = "student"
    
    def validate(self):
        """Valida el modelo y retorna lista de errores."""
        errors = []
        if "@" not in self.email:
            errors.append("email debe contener @")
        if len(self.name) < 2:
            errors.append("name debe tener al menos 2 caracteres")
        if not isinstance(self.age, int) or self.age < 0 or self.age > 120:
            errors.append("age debe ser entero entre 0 y 120")
        if self.role not in ["student", "admin", "teacher"]:
            errors.append("role debe ser student, admin o teacher")
        return errors

# Simular endpoint POST /users
def create_user(request_data: dict):
    """Endpoint simulado que valida y crea usuario."""
    try:
        req = CreateUserRequest(
            email=request_data.get("email", ""),
            name=request_data.get("name", ""),
            age=request_data.get("age", 0),
            role=request_data.get("role", "student"),
        )
    except Exception as e:
        return {"status": 422, "error": f"TypeError: {e}"}
    
    errors = req.validate()
    if errors:
        return {"status": 422, "errors": errors}
    
    return {"status": 201, "user": {"email": req.email, "name": req.name, "age": req.age}}

# Probar con datos validos
print("=== Request valido ===")
result = create_user({"email": "ana@python.pe", "name": "Ana", "age": 25})
print(f"Status: {result['status']}")
if "user" in result:
    print(f"User: {result['user']}")

# Probar con datos invalidos
print("\\n=== Request invalido ===")
result = create_user({"email": "no-email", "name": "A", "age": -5})
print(f"Status: {result['status']}")
print(f"Errors: {result['errors']}")`,
      hint: 'Intenta crear un usuario con role "superadmin" - que error da?',
    },
    'rapidfuzz-entity': {
      title: 'Practica fuzzy matching (simulado)',
      code: `# Simulacion de entity resolution con fuzzy matching
# Sin RapidFuzz - implementamos Levenshtein distance manualmente

def levenshtein(s1, s2):
    """Distancia de Levenshtein: cuantos cambios para convertir s1 en s2."""
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def similarity(a, b):
    """Similitud 0-1 basada en Levenshtein."""
    max_len = max(len(a), len(b))
    if max_len == 0:
        return 1.0
    return 1 - levenshtein(a, b) / max_len

# Comparar nombres
nombres = [
    ("Ana Garcia", "Ana Garcia"),
    ("Ana Garcia", "Ana Garca"),  # typo: falta 'i'
    ("Ana Garcia", "Ana Torres"),
    ("Luis Quispe", "Luis Quisp"),  # falta 'e' al final
]

print("Fuzzy matching de nombres:")
for a, b in nombres:
    sim = similarity(a, b)
    print(f"  '{a}' vs '{b}': {sim:.1%}")

# Detectar duplicados potenciales
clientes = [
    {"id": 1, "nombre": "Maria Quispe", "email": "mquispe@email.pe"},
    {"id": 2, "nombre": "Maria Quispe", "email": "maria.q@email.pe"},  # duplicado
    {"id": 3, "nombre": "Mario Quispe", "email": "mario@email.pe"},    # familiar
    {"id": 4, "nombre": "Carlos Diaz", "email": "cdiaz@email.pe"},
]

print("\\nPosibles duplicados (similitud > 85%):")
for i in range(len(clientes)):
    for j in range(i+1, len(clientes)):
        sim = similarity(clientes[i]["nombre"], clientes[j]["nombre"])
        if sim > 0.85:
            print(f"  #{clientes[i]['id']} vs #{clientes[j]['id']}: {sim:.1%}")`,
      hint: 'Cambia el umbral de 85% a 70% y observa cuantos mas duplicados aparecen',
    },
    'computer-vision': {
      title: 'Practica procesamiento de imagenes (simulado)',
      code: `# Simulacion de conceptos de vision por computadora
# Sin OpenCV - implementamos operaciones con listas 2D

# Representar una imagen "grayscale" como matriz 5x5
imagen = [
    [10, 20, 30, 20, 10],
    [20, 30, 40, 30, 20],
    [30, 40, 50, 40, 30],  # centro mas brillante
    [20, 30, 40, 30, 20],
    [10, 20, 30, 20, 10],
]

def print_image(img, title="Imagen"):
    """Imprime imagen como matriz de intensidades."""
    print(f"{title} ({len(img)}x{len(img[0])}):")
    for row in img:
        print("  " + " ".join(f"{v:3d}" for v in row))

print_image(imagen, "Original")

# 1. Threshold binario (como cv2.threshold)
def threshold(img, valor):
    """Binariza: pixeles > valor = 255, sino 0."""
    return [[255 if p > valor else 0 for p in row] for row in img]

binaria = threshold(imagen, 25)
print_image(binaria, "Threshold(25)")

# 2. Estadisticas de la imagen
def image_stats(img):
    """Calcula estadisticas basicas."""
    flat = [p for row in img for p in row]
    return {
        "min": min(flat),
        "max": max(flat),
        "mean": sum(flat) / len(flat),
    }

stats = image_stats(imagen)
print(f"\\nEstadisticas: min={stats['min']}, max={stats['max']}, mean={stats['mean']:.1f}")

# 3. Contar objetos (regiones blancas en binaria)
def count_bright_regions(bin_img):
    """Cuenta regiones blancas (simulando deteccion de objetos)."""
    count = 0
    for row in bin_img:
        for pixel in row:
            if pixel == 255:
                count += 1
    return count

white_pixels = count_bright_regions(binaria)
total_pixels = len(imagen) * len(imagen[0])
print(f"\\nPixeles blancos: {white_pixels}/{total_pixels} ({white_pixels/total_pixels:.0%})")`,
      hint: 'Cambia el threshold a 35 y observa como cambian los pixeles blancos',
    },
    'rpa-advanced': {
      title: 'Practica orquestacion y retries',
      code: `# Practica orquestacion de RPA (simulado)
import time
import random
from functools import wraps

# Decorador de retry (simulando tenacity)
def retry(max_attempts=3, delay=0.1):
    """Reintenta una funcion hasta max_attempts veces."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    result = func(*args, **kwargs)
                    print(f"  ✓ Intento {attempt}: exitoso")
                    return result
                except Exception as e:
                    print(f"  ✗ Intento {attempt}: fallo - {e}")
                    if attempt < max_attempts:
                        time.sleep(delay)
                        print(f"    Reintentando en {delay}s...")
                    else:
                        print(f"  ✗ Agotados {max_attempts} intentos")
                        raise
        return wrapper
    return decorator

# Simular tarea RPA que falla aleatoriamente
@retry(max_attempts=5, delay=0.05)
def descargar_reporte(url):
    """Simula descarga que falla 60% de las veces."""
    if random.random() < 0.6:
        raise ConnectionError(f"Timeout en {url}")
    return {"status": "ok", "data": [1, 2, 3]}

# Pipeline RPA con multiples tareas
print("=== Pipeline RPA ===")
random.seed(42)

tareas = [
    ("Login", lambda: {"status": "ok", "token": "abc123"}),
    ("Navegar", lambda: {"status": "ok", "page": "reportes"}),
    ("Descargar", lambda: descargar_reporte("https://api.com/report")),
    ("Cerrar sesion", lambda: {"status": "ok"}),
]

for nombre, tarea in tareas:
    print(f"\\nEjecutando: {nombre}")
    try:
        result = tarea()
        print(f"  Resultado: {result}")
    except Exception as e:
        print(f"  ERROR FATAL: {e}")
        break

print("\\n✓ Pipeline completado")`,
      hint: 'Cambia la probabilidad de fallo a 0.9 y observa cuantos intentos necesita',
    },
    'streamlit-dashboards': {
      title: 'Practica estado y caching (simulado)',
      code: `# Simulacion de Streamlit: estado y caching
# Sin Streamlit real - simulamos los conceptos

class StreamlitSimulator:
    """Simula el comportamiento de Streamlit."""
    def __init__(self):
        self.session_state = {}
        self.cache = {}
    
    def session(self, key, default=None):
        """Simula st.session_state[key]."""
        if key not in self.session_state:
            self.session_state[key] = default
        return self.session_state[key]
    
    def cache_data(self, func):
        """Simula @st.cache_data."""
        def wrapper(*args):
            cache_key = str(args)
            if cache_key in self.cache:
                print(f"  [CACHE HIT] {func.__name__}{args}")
                return self.cache[cache_key]
            print(f"  [CACHE MISS] {func.__name__}{args} - calculando...")
            result = func(*args)
            self.cache[cache_key] = result
            return result
        return wrapper

st = StreamlitSimulator()

# Funcion cacheada (simula @st.cache_data)
@st.cache_data
def cargar_datos(n):
    """Simula carga costosa de datos."""
    import time
    time.sleep(0.1)  # simular latencia
    return list(range(n))

# Simular interacciones del usuario
print("=== Primera llamada (cache miss) ===")
data = cargar_datos(100)
print(f"  Datos: {len(data)} registros")

print("\\n=== Segunda llamada (cache hit) ===")
data = cargar_datos(100)
print(f"  Datos: {len(data)} registros")

print("\\n=== Tercera llamada con args diferentes (cache miss) ===")
data = cargar_datos(50)
print(f"  Datos: {len(data)} registros")

# Session state
print("\\n=== Session State ===")
contador = st.session("clicks", 0)
print(f"  Clicks iniciales: {contador}")
st.session_state["clicks"] += 1
st.session_state["clicks"] += 1
print(f"  Clicks despues de 2: {st.session('clicks')}")`,
      hint: 'Llama cargar_datos(100) una tercera vez - debe ser cache hit',
    },
    'integrator-phase1': {
      title: 'Practica arquitectura de plataforma',
      code: `# Simulacion de arquitectura de plataforma de IA
# Combina API + ML + Logging en un sistema cohesivo

import json
import time
from functools import wraps

# Decorador de logging (simulando structlog)
def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = (time.time() - start) * 1000
        print(f"  [{func.__name__}] {elapsed:.1f}ms -> {result}")
        return result
    return wrapper

# Simular modelo de ML
@log
def predict(features: dict) -> dict:
    """Simula prediccion del modelo."""
    score = sum(features.values()) / len(features)
    risk = "ALTO" if score > 0.7 else "MEDIO" if score > 0.4 else "BAJO"
    return {"score": round(score, 2), "risk": risk}

# Simular API endpoint
@log
def api_predict(user_id: str, features: dict) -> dict:
    """Endpoint POST /predict."""
    if not user_id:
        return {"error": "user_id requerido"}
    if len(features) == 0:
        return {"error": "features requerido"}
    
    result = predict(features)
    return {"user_id": user_id, **result}

# Simular pipeline completo
print("=== Plataforma de IA: Pipeline completo ===")
print()

# Request 1
print("Request 1:")
resp = api_predict("user_123", {"edad": 0.8, "ingreso": 0.6, "antiguedad": 0.3})
print(f"  Response: {json.dumps(resp)}")
print()

# Request 2
print("Request 2:")
resp = api_predict("user_456", {"edad": 0.2, "ingreso": 0.9, "antiguedad": 0.8})
print(f"  Response: {json.dumps(resp)}")
print()

# Request con error
print("Request 3 (error):")
resp = api_predict("", {"edad": 0.5})
print(f"  Response: {json.dumps(resp)}")`,
      hint: 'Anade mas features al request y observa como cambia el score',
    },
    // === Phase 2 demos (S27-S39) ===
    'async-concurrency': {
      title: 'Practica concurrencia con asyncio',
      code: `# Practica conceptos de concurrencia (simulado)
# Sin asyncio real - simulamos con generators

import time

def simulate_async_task(name, duration):
    """Simula una tarea asincrona con un generator."""
    print(f"  [{name}] iniciando ({duration}s)...")
    yield  # ceder control (como await)
    time.sleep(duration)
    print(f"  [{name}] completado")
    return f"resultado_{name}"

# Simular ejecucion secuencial
print("=== Secuencial ===")
t0 = time.time()
for task_name, dur in [("A", 0.1), ("B", 0.1), ("C", 0.1)]:
    gen = simulate_async_task(task_name, dur)
    next(gen)  # iniciar
    try:
        next(gen)  # completar
    except StopIteration:
        pass
print(f"  Tiempo total: {time.time()-t0:.2f}s")

# Simular concurrencia (intercalado)
print("\\n=== Concurrente (simulado) ===")
# En asyncio real, las tareas se intercalan durante await
tareas = [("A", 0.1), ("B", 0.1), ("C", 0.1)]

# Calcular tiempo teorico
tiempo_secuencial = sum(d for _, d in tareas)
tiempo_concurrente = max(d for _, d in tareas)
print(f"  Tiempo secuencial: {tiempo_secuencial:.2f}s")
print(f"  Tiempo concurrente: {tiempo_concurrente:.2f}s")
print(f"  Speedup: {tiempo_secuencial/tiempo_concurrente:.1f}x")

# Semaphore: limitar concurrencia
def simulate_semaphore(max_concurrent, tasks):
    """Simula asyncio.Semaphore."""
    print(f"\\n  Semaphore({max_concurrent}): {len(tasks)} tareas, max {max_concurrent} concurrentes")
    batches = [tasks[i:i+max_concurrent] for i in range(0, len(tasks), max_concurrent)]
    for i, batch in enumerate(batches):
        print(f"    Batch {i+1}: {batch}")
    
simulate_semaphore(3, ["A", "B", "C", "D", "E", "F", "G"])
print("  En asyncio real, las pausas durante I/O permiten intercalado real")`,
      hint: 'Que pasa si max_concurrent=1? Es lo mismo que secuencial',
    },
    'llm-agents': {
      title: 'Practica razonamiento de agentes (simulado)',
      code: `# Simulacion de agente LLM con razonamiento ReAct
# Sin LLM real - simulamos el patron Thought/Action/Observation

# Base de conocimiento simulada
knowledge_base = {
    "python": "Python es un lenguaje de programacion interpretado, creado en 1991",
    "pandas": "Pandas es una libreria de Python para manipulacion de datos",
    "numPy": "NumPy es una libreria para computacion numerica con arrays",
}

def search_tool(query):
    """Simula una herramienta de busqueda."""
    query_lower = query.lower()
    for key, value in knowledge_base.items():
        if key.lower() in query_lower:
            return value
    return "No se encontro informacion."

# Simular agente ReAct
def agent_react(question, max_steps=3):
    """Agente que razona y actua en bucle."""
    print(f"Pregunta: {question}")
    print()
    
    steps = [
        {
            "thought": "Necesito buscar informacion sobre la pregunta",
            "action": "search",
            "action_input": question,
        },
        {
            "thought": "Tengo la informacion, puedo responder",
            "action": "respond",
            "action_input": None,
        }
    ]
    
    for i, step in enumerate(steps[:max_steps]):
        print(f"Step {i+1}:")
        print(f"  Thought: {step['thought']}")
        print(f"  Action: {step['action']}({step['action_input'] or ''})")
        
        if step["action"] == "search":
            observation = search_tool(step["action_input"])
            print(f"  Observation: {observation}")
        elif step["action"] == "respond":
            answer = search_tool(question)
            print(f"  Answer: {answer}")
            return answer
    
    return "No pude responder en los pasos disponibles."

# Ejecutar agente
result = agent_react("que es Python")
print(f"\\nRespuesta final: {result}")`,
      hint: 'Cambia la pregunta a "que es Pandas" y observa el resultado',
    },
    'mlops': {
      title: 'Practica model registry y drift (simulado)',
      code: `# Simulacion de MLOps: model registry y drift detection
import json
from datetime import datetime, timedelta

# Simular model registry
class ModelRegistry:
    """Simula MLflow Model Registry."""
    def __init__(self):
        self.models = {}
    
    def register(self, name, version, metrics, status="Staging"):
        """Registra una nueva version del modelo."""
        self.models[f"{name}_v{version}"] = {
            "name": name,
            "version": version,
            "metrics": metrics,
            "status": status,
            "created_at": datetime.now().isoformat(),
        }
        print(f"  Registrado: {name}_v{version} ({status})")
    
    def promote(self, name, version):
        """Promueve un modelo a Production."""
        for key, model in self.models.items():
            if model["name"] == name:
                if model["version"] == version:
                    model["status"] = "Production"
                elif model["status"] == "Production":
                    model["status"] = "Archived"
    
    def get_production(self, name):
        """Obtiene el modelo en Production."""
        for model in self.models.values():
            if model["name"] == name and model["status"] == "Production":
                return model
        return None

registry = ModelRegistry()

# Registrar versiones
print("=== Model Registry ===")
registry.register("churn", "1.0", {"auc": 0.82, "f1": 0.75})
registry.register("churn", "2.0", {"auc": 0.87, "f1": 0.80})

# Promover v2.0 a Production
registry.promote("churn", "2.0")
prod = registry.get_production("churn")
print(f"\\nProduccion: churn_v{prod['version']} (AUC: {prod['metrics']['auc']})")

# Simular drift detection
print("\\n=== Data Drift Detection ===")
train_dist = {"lima": 0.6, "arequipa": 0.2, "cusco": 0.15, "otros": 0.05}
prod_dist = {"lima": 0.4, "arequipa": 0.3, "cusco": 0.2, "otros": 0.1}

drift = sum(abs(train_dist[k] - prod_dist[k]) for k in train_dist)
print(f"  Distribucion training: {train_dist}")
print(f"  Distribucion produccion: {prod_dist}")
print(f"  Drift score: {drift:.3f} ({'ALTO' if drift > 0.3 else 'OK'})")`,
      hint: 'Registra una v3.0 con AUC 0.90 y promovela a Production',
    },
    // === Phase 2 demos (S30-S39) ===
    'security-infra': {
      title: 'Practica Zero Trust y logging',
      code: `# Simulacion de Zero Trust: verificar cada request
import hashlib
import time

# Simular logging estructurado (como structlog)
def log_event(event, **kwargs):
    """Log estructurado en formato JSON."""
    entry = {"event": event, "timestamp": time.time(), **kwargs}
    print(f"  [{entry['event']}] {kwargs}")

# Simular middleware de seguridad
def security_check(user_id, ip, endpoint):
    """Verifica cada request como en Zero Trust."""
    # 1. Verificar autenticacion
    if not user_id:
        log_event("auth_failed", ip=ip, reason="no_token")
        return False
    # 2. Verificar autorizacion
    if endpoint == "/admin" and user_id != "admin":
        log_event("authz_denied", user=user_id, endpoint=endpoint)
        return False
    # 3. Log de acceso
    log_event("access_granted", user=user_id, ip=ip, endpoint=endpoint)
    return True

# Probar
print("=== Zero Trust: cada request se verifica ===")
print(security_check("user1", "190.x.x.x", "/predict"))
print(security_check("user1", "190.x.x.x", "/admin"))
print(security_check("", "190.x.x.x", "/predict"))

# Hash de integridad (verificar que archivos no fueron modificados)
file_content = b"modelo_v2.pkl"
hash_original = hashlib.sha256(file_content).hexdigest()
print(f"\\nHash original: {hash_original[:32]}...")
print(f"Hash verificado: {hashlib.sha256(file_content).hexdigest()[:32]}...")
print(f"Integridad OK: {hashlib.sha256(file_content).hexdigest() == hash_original}")`,
      hint: 'Que pasa si cambias el contenido del archivo? El hash cambia',
    },
    'streaming-data': {
      title: 'Practica windowing y backpressure',
      code: `# Simulacion de streaming: windowing y backpressure
import time
from collections import defaultdict

# Simular eventos de streaming
eventos = [
    {"ts": 0, "valor": 10}, {"ts": 1, "valor": 20},
    {"ts": 2, "valor": 15}, {"ts": 3, "valor": 30},
    {"ts": 4, "valor": 25}, {"ts": 5, "valor": 40},
    {"ts": 6, "valor": 35}, {"ts": 7, "valor": 50},
    {"ts": 8, "valor": 45}, {"ts": 9, "valor": 60},
]

# 1. Tumbling window (no superpuestas)
print("=== Tumbling Window (3s) ===")
window_size = 3
for i in range(0, 10, window_size):
    window = [e for e in eventos if i <= e["ts"] < i + window_size]
    if window:
        total = sum(e["valor"] for e in window)
        print(f"  [{i}-{i+window_size}]: {len(window)} eventos, total={total}")

# 2. Sliding window (superpuestas)
print("\\n=== Sliding Window (3s, slide 1s) ===")
window_size = 3
for i in range(0, 10):
    window = [e for e in eventos if i <= e["ts"] < i + window_size]
    if window:
        avg = sum(e["valor"] for e in window) / len(window)
        print(f"  [{i}-{i+window_size}]: avg={avg:.1f}")

# 3. Backpressure con Queue limitada
print("\\n=== Backpressure (Queue maxsize=3) ===")
class BoundedQueue:
    def __init__(self, maxsize):
        self.maxsize = maxsize
        self.items = []
    def put(self, item):
        if len(self.items) >= self.maxsize:
            print(f"    QUEUE LLENA! Productor esperando...")
            return False
        self.items.append(item)
        return True
    def get(self):
        return self.items.pop(0) if self.items else None

q = BoundedQueue(3)
for i in range(5):
    ok = q.put(f"item_{i}")
    print(f"  Put item_{i}: {'OK' if ok else 'BLOCKED'}")`,
      hint: 'Cambia window_size a 5 y observa como cambian los resultados',
    },
    'microservices': {
      title: 'Practica health checks y circuit breaker',
      code: `# Simulacion de microservicios: health checks y circuit breaker
import time
import random

class CircuitBreaker:
    """Circuit breaker que abre despues de N fallos."""
    def __init__(self, threshold=3, reset_timeout=5):
        self.failures = 0
        self.threshold = threshold
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_failure = 0
    
    def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() - self.last_failure > self.reset_timeout:
                self.state = "HALF_OPEN"
                print("  Circuit: OPEN -> HALF_OPEN")
            else:
                print("  Circuit: OPEN (rechazando llamada)")
                return None
        
        try:
            result = func(*args)
            self.failures = 0
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                print("  Circuit: HALF_OPEN -> CLOSED")
            return result
        except Exception as e:
            self.failures += 1
            self.last_failure = time.time()
            if self.failures >= self.threshold:
                self.state = "OPEN"
                print(f"  Circuit: CLOSED -> OPEN ({self.failures} fallos)")
            return None

# Simular servicio que falla
def unreliable_service():
    if random.random() < 0.5:
        raise ConnectionError("Service unavailable")
    return {"status": "ok"}

cb = CircuitBreaker(threshold=3)
random.seed(42)
print("=== Circuit Breaker ===")
for i in range(8):
    print(f"\\nLlamada {i+1}:")
    result = cb.call(unreliable_service)
    if result:
        print(f"  Resultado: {result}")
    print(f"  Estado: {cb.state}")`,
      hint: 'Cambia threshold a 1 y observa como se abre mas rapido',
    },
    'advanced-models': {
      title: 'Practica Optuna y SHAP (simulado)',
      code: `# Simulacion de hyperparameter tuning y interpretabilidad
import random

# Simular Optuna: buscar mejores hiperparametros
def simulate_optuna(n_trials=10):
    """Simula busqueda de hiperparametros con TPE."""
    best_score = 0
    best_params = {}
    
    for trial in range(1, n_trials + 1):
        # Muestrear hiperparametros (simulando TPE)
        params = {
            "n_estimators": random.randint(100, 500),
            "max_depth": random.randint(3, 10),
            "learning_rate": random.uniform(0.01, 0.3),
        }
        
        # Simular AUC (mejor con params intermedios)
        score = 0.7 + random.uniform(0, 0.2)
        if 200 <= params["n_estimators"] <= 400:
            score += 0.05
        if 5 <= params["max_depth"] <= 8:
            score += 0.05
        if 0.05 <= params["learning_rate"] <= 0.15:
            score += 0.05
        
        if score > best_score:
            best_score = score
            best_params = params
            print(f"  Trial {trial}: NUEVO MEJOR AUC={score:.4f} {params}")
    
    return best_score, best_params

random.seed(42)
print("=== Optuna Simulation (10 trials) ===")
score, params = simulate_optuna(10)
print(f"\\nMejor: AUC={score:.4f}")
print(f"Params: {params}")

# Simular SHAP values
print("\\n=== SHAP Values (simulado) ===")
features = ["edad", "ingreso", "antiguedad", "productos", "transacciones"]
shap_values = [0.15, -0.08, 0.22, 0.05, -0.03]
base_value = 0.50
prediction = base_value + sum(shap_values)

print(f"Base value: {base_value:.2f}")
print(f"Prediccion: {prediction:.2f}")
print(f"\\nContribuciones:")
for f, s in sorted(zip(features, shap_values), key=lambda x: abs(x[1]), reverse=True):
    direction = "↑" if s > 0 else "↓"
    print(f"  {f:15s}: {s:+.3f} {direction}")`,
      hint: 'Cambia n_trials a 30 y observa si mejora el AUC',
    },
    'cv-ai-integration': {
      title: 'Practica deteccion y OCR (simulado)',
      code: `# Simulacion de deteccion de objetos y OCR
# Sin OpenCV/YOLO - simulamos con listas

# Simular deteccion de objetos
def detect_objects(image_data):
    """Simula YOLOv8: detecta objetos en imagen."""
    detections = []
    for i, row in enumerate(image_data):
        for j, pixel in enumerate(row):
            if pixel > 40:  # objeto brillante detectado
                detections.append({
                    "class": "person" if pixel > 45 else "object",
                    "confidence": min(0.99, pixel / 50),
                    "bbox": [j, i, j+1, i+1],
                })
    return detections

# Imagen 5x5 (simulada)
imagen = [
    [10, 20, 30, 20, 10],
    [20, 30, 50, 30, 20],  # persona detectada
    [30, 45, 50, 45, 30],  # objetos brillantes
    [20, 30, 50, 30, 20],
    [10, 20, 30, 20, 10],
]

detections = detect_objects(imagen)
print(f"=== Deteccion de Objetos ===")
print(f"Objetos detectados: {len(detections)}")
for d in detections:
    print(f"  {d['class']} (conf: {d['confidence']:.0%}) bbox: {d['bbox']}")

# Simular OCR
def simulate_ocr(text_image):
    """Simula Tesseract OCR."""
    char_map = {1: "H", 2: "o", 3: "l", 4: "a"}
    result = ""
    for pixel in text_image:
        result += char_map.get(pixel, "?")
    return result

texto_como_pixeles = [1, 2, 3, 2, 4]  # H-o-l-a
texto = simulate_ocr(texto_como_pixeles)
print(f"\\n=== OCR ===")
print(f"Imagen: {texto_como_pixeles}")
print(f"Texto extraido: '{texto}'")`,
      hint: 'Anade mas pixeles a texto_como_pixeles y observa el resultado',
    },
    'system-design': {
      title: 'Practica arquitectura y ADR',
      code: `# Simulacion de design de sistemas
# Generar ADR (Architecture Decision Record)

def generate_adr(title, context, decision, alternatives, consequences):
    """Genera un ADR con formato estandar."""
    adr = f"# ADR: {title}\\n"
    adr += f"\\n## Context\\n{context}\\n"
    adr += f"\\n## Decision\\n{decision}\\n"
    adr += f"\\n## Alternatives\\n"
    for alt in alternatives:
        adr += f"- {alt}\\n"
    adr += f"\\n## Consequences\\n{consequences}\\n"
    adr += f"\\n## Status: Proposed\\n"
    return adr

# Generar ADR para decision real
adr = generate_adr(
    title="Batch vs Real-Time Inference",
    context="El equipo de riesgo necesita scoring en <100ms para aprobar creditos en tiempo real.",
    decision="Usar real-time inference con FastAPI + Redis cache + XGBoost model.",
    alternatives=[
        "Batch scoring: descartado (necesitan tiempo real)",
        "Lambda function: descartado (cold start > 100ms)",
        "gRPC: descartado (clientes usan REST)",
    ],
    consequences="Latencia p99 < 100ms. Requiere Redis + monitoring 24/7. Costo ~$500/mes."
)

print(adr)

# Simular feature store
print("\\n=== Feature Store (simulado) ===")
features = {
    "user_123": {"age": 25, "avg_spend": 150.5, "login_count": 30},
    "user_456": {"age": 35, "avg_spend": 320.0, "login_count": 12},
}

def get_features(user_id, source="online"):
    """Obtiene features (online=Redis <10ms, offline=parquet)."""
    if source == "online":
        return features.get(user_id, {})
    return {"note": "En offline, trae features historicas point-in-time"}

print(f"Online user_123: {get_features('user_123', 'online')}")
print(f"Online user_999: {get_features('user_999', 'online')}")`,
      hint: 'Escribe un ADR para tu propia decision tecnica',
    },
    'ai-apis-advanced': {
      title: 'Practica function calling (simulado)',
      code: `# Simulacion de function calling con LLM
# Sin API real - simulamos el patron

# Herramientas disponibles
tools = {
    "search_web": lambda query: f"Resultados para '{query}': Python es chevere",
    "calculate": lambda expr: str(eval(expr)),
    "get_time": lambda: "2026-07-14 19:45:00",
}

def simulate_llm_function_calling(user_message):
    """Simula como un LLM decide que tool usar."""
    message_lower = user_message.lower()
    
    # El "LLM" decide que tool usar basado en el mensaje
    if "hora" in message_lower or "tiempo" in message_lower:
        tool_name = "get_time"
        args = ""
    elif "calcula" in message_lower or "suma" in message_lower:
        tool_name = "calculate"
        # Extraer expresion (simulado)
        expr = "2 + 3"  # en real, el LLM extrae del mensaje
        args = expr
    elif "busca" in message_lower or "que es" in message_lower:
        tool_name = "search_web"
        args = user_message.replace("que es", "").replace("busca", "").strip()
    else:
        return {"response": f"No se que hacer con: {user_message}"}
    
    # Ejecutar tool
    result = tools[tool_name](args)
    
    return {
        "tool_called": tool_name,
        "tool_args": args,
        "tool_result": result,
        "response": f"Segun {tool_name}: {result}"
    }

# Probar
messages = ["que es Python", "calcula 2+3", "que hora es"]
for msg in messages:
    print(f"\\nUsuario: {msg}")
    result = simulate_llm_function_calling(msg)
    print(f"  Tool: {result.get('tool_called', 'N/A')}")
    print(f"  Response: {result['response']}")`,
      hint: 'Anade una nueva tool "send_email" y haz que el LLM la use',
    },
    'dbt-bigquery': {
      title: 'Practica dbt concepts (simulado)',
      code: `# Simulacion de conceptos dbt
# Sin dbt real - simulamos models, tests, y lineage

# Simular modelo dbt (un SELECT que se materializa)
def dbt_model_daily_metrics(transactions):
    """Simula un modelo dbt: transforma datos crudos."""
    from collections import defaultdict
    
    metrics = defaultdict(lambda: {"count": 0, "total": 0.0})
    for tx in transactions:
        key = (tx["date"], tx["user_id"])
        metrics[key]["count"] += 1
        metrics[key]["total"] += tx["amount"]
    
    result = []
    for (date, user_id), m in metrics.items():
        result.append({
            "date": date,
            "user_id": user_id,
            "date_user": f"{date}-{user_id}",
            "transaction_count": m["count"],
            "total_amount": round(m["total"], 2),
        })
    return result

# Datos crudos
transactions = [
    {"date": "2026-07-01", "user_id": "u1", "amount": 100.0},
    {"date": "2026-07-01", "user_id": "u1", "amount": 50.0},
    {"date": "2026-07-01", "user_id": "u2", "amount": 200.0},
    {"date": "2026-07-02", "user_id": "u1", "amount": 75.0},
]

# Ejecutar modelo
metrics = dbt_model_daily_metrics(transactions)
print("=== Modelo: daily_metrics ===")
for m in metrics:
    print(f"  {m['date']} {m['user_id']}: {m['transaction_count']} tx, S/{m['total_amount']}")

# Simular dbt tests
print("\\n=== Tests ===")
def test_unique(rows, column):
    """Test: valores unicos."""
    values = [r[column] for r in rows]
    duplicates = len(values) - len(set(values))
    print(f"  unique({column}): {'PASS' if duplicates == 0 else f'FAIL ({duplicates} dup)'}")

def test_not_null(rows, column):
    """Test: no nulos."""
    nulls = sum(1 for r in rows if r.get(column) is None)
    print(f"  not_null({column}): {'PASS' if nulls == 0 else f'FAIL ({nulls} nulls)'}")

test_unique(metrics, "date_user")
test_not_null(metrics, "total_amount")
test_not_null(metrics, "date")`,
      hint: 'Anade una transaccion duplicada y observa si test_unique falla',
    },
    'performance-extreme': {
      title: 'Practica benchmarking y vectorizacion',
      code: `# Practica performance: comparar enfoques
import time

# 1. Loop tradicional vs comprehension
n = 100000

# Loop con append
t0 = time.time()
result_loop = []
for i in range(n):
    if i % 2 == 0:
        result_loop.append(i ** 2)
t_loop = time.time() - t0

# List comprehension
t0 = time.time()
result_comp = [i ** 2 for i in range(n) if i % 2 == 0]
t_comp = time.time() - t0

print(f"=== List Comprehension vs Loop ===")
print(f"  Loop:          {t_loop:.4f}s ({len(result_loop)} items)")
print(f"  Comprehension: {t_comp:.4f}s ({len(result_comp)} items)")
print(f"  Speedup:       {t_loop/t_comp:.1f}x")

# 2. Simular Numba (sin Numba real - mostrar el concepto)
print(f"\\n=== Numba JIT (concepto) ===")
print(f"  Sin @njit: Python interpreta cada linea")
print(f"  Con @njit: compila a codigo maquina LLVM")
print(f"  Para n=1,000,000: Python=500ms, Numba=5ms (100x)")

# 3. Simular Polars vs pandas (concepto)
print(f"\\n=== Polars vs Pandas (concepto) ===")
print(f"  Pandas: single-threaded, eager evaluation")
print(f"  Polars: multi-threaded, lazy evaluation")
print(f"  Para groupby+agg en 1M filas:")
print(f"    Pandas:  ~2.5s")
print(f"    Polars:  ~0.1s (25x mas rapido)")

# 4. Vectorizacion (sin NumPy - mostrar concepto)
print(f"\\n=== Vectorizacion ===")
# Mal: loop elemento por elemento
t0 = time.time()
result_bad = [i * 2 for i in range(n)]
t_bad = time.time() - t0

# Bien: usar range con step (simulando vectorizacion)
t0 = time.time()
result_good = list(range(0, n * 2, 2))
t_good = time.time() - t0

print(f"  Loop:      {t_bad:.4f}s")
print(f"  Optimized: {t_good:.4f}s ({t_bad/t_good:.1f}x)")`,
      hint: 'Cambia n a 1,000,000 y observa como cambia el speedup',
    },
    'integrator-phase2': {
      title: 'Practica CI/CD y monitoreo',
      code: `# Simulacion de CI/CD pipeline y monitoreo
import time
import random

# Simular pipeline CI/CD
def ci_pipeline(commit_hash):
    """Simula un pipeline de CI/CD."""
    steps = [
        ("lint", 0.1, 0.0),      # (nombre, duracion, prob_fallo)
        ("test", 0.2, 0.05),
        ("build", 0.3, 0.02),
        ("deploy_canary", 0.15, 0.03),
        ("smoke_test", 0.1, 0.01),
        ("promote_100", 0.05, 0.0),
    ]
    
    print(f"=== CI/CD Pipeline: {commit_hash[:8]} ===")
    total_time = 0
    for step_name, duration, fail_prob in steps:
        time.sleep(duration * 0.1)  # acelerar para demo
        total_time += duration
        
        if random.random() < fail_prob:
            print(f"  ✗ {step_name}: FAILED ({duration:.1f}s)")
            return {"status": "failed", "step": step_name, "time": total_time}
        else:
            print(f"  ✓ {step_name}: PASSED ({duration:.1f}s)")
    
    print(f"\\n  Total: {total_time:.1f}s - DEPLOYED")
    return {"status": "success", "time": total_time}

# Ejecutar pipeline
random.seed(42)
result = ci_pipeline("a1b2c3d4")

# Simular monitoreo
print(f"\\n=== Monitoreo ===")
metrics = {
    "latency_p99_ms": 87,
    "throughput_qps": 12500,
    "error_rate_pct": 0.02,
    "cpu_usage_pct": 45,
    "memory_usage_pct": 62,
}

print("Metricas en tiempo real:")
for metric, value in metrics.items():
    status = "OK" if value < 80 else "WARN"
    print(f"  {metric:25s}: {value} [{status}]")`,
      hint: 'Cambia las probabilidades de fallo a 0.0 y observa si el pipeline siempre pasa',
    },
    // === Phase 3 demos (S40-S52) ===
    'agentic-architecture': {
      title: 'Practica multi-agent (simulado)',
      code: `# Simulacion de sistema multi-agente
# Cada agente tiene un rol especifico

class Agent:
    """Agente con rol y herramientas."""
    def __init__(self, name, role, tools=None):
        self.name = name
        self.role = role
        self.tools = tools or []
    
    def execute(self, task):
        """Ejecuta una tarea y retorna resultado."""
        print(f"  [{self.name}] Ejecutando: {task}")
        return f"{self.name}_result"

# Crear agentes especializados
researcher = Agent("Researcher", "Busca informacion", ["search_web"])
analyst = Agent("Analyst", "Analiza datos", ["query_db", "calculate"])
writer = Agent("Writer", "Genera reporte", ["format_markdown"])

# Orquestar flujo multi-agente
def run_multi_agent(query):
    """Orquesta 3 agentes en secuencia."""
    print(f"=== Multi-Agent: {query} ===")
    
    # Step 1: Researcher busca
    research = researcher.execute(f"Buscar: {query}")
    
    # Step 2: Analyst analiza
    analysis = analyst.execute(f"Analizar: {research}")
    
    # Step 3: Writer genera reporte
    report = writer.execute(f"Escribir reporte basado en: {analysis}")
    
    print(f"\\nReporte final: {report}")
    return report

run_multi_agent("Analisis de churn Q2 2026")

# Simular shared state entre agentes
print("\\n=== Shared State ===")
shared = {"query": "", "research": "", "analysis": "", "report": ""}

shared["query"] = "Top 3 causas de churn"
print(f"  State inicial: {shared}")

shared["research"] = "1. Precio alto 2. Mal servicio 3. Competencia"
shared["analysis"] = "Precio: 45%, Servicio: 30%, Competencia: 25%"
shared["report"] = "El churn se debe principalmente a precio (45%)"
print(f"  State final: {shared}")`,
      hint: 'Anade un cuarto agente "Reviewer" que valide el reporte',
    },
    'llm-finetuning': {
      title: 'Practica QLoRA concepts (simulado)',
      code: `# Simulacion de conceptos de fine-tuning
# Sin transformers real - simulamos la matematica

# Simular cuantizacion 4-bit
def simulate_quantization(model_params, bits=4):
    """Simula cuantizacion: reduce precision de pesos."""
    max_val = 2**bits - 1
    quantized = [round(p * max_val) / max_val for p in model_params]
    compression = (32 - bits) / 32  # de FP32 a N-bit
    return quantized, compression

# Parametros del modelo (simulados)
params = [0.123, 0.456, 0.789, 0.012, 0.345]
print("=== Cuantizacion ===")
print(f"Original (FP32): {params}")

q_params, compression = simulate_quantization(params, bits=4)
print(f"Cuantizado (4-bit): {[round(p, 3) for p in q_params]}")
print(f"Compression: {compression:.0%} menos memoria")

# Simular LoRA: solo entrenar adapters
total_params = 8_000_000_000  # 8B
lora_params = 8_000_000  # 8M
print(f"\\n=== LoRA ===")
print(f"Modelo total: {total_params:,} parametros")
print(f"LoRA adapters: {lora_params:,} parametros")
print(f"Porcentaje entrenable: {lora_params/total_params:.2%}")
print(f"Ahorro de VRAM: ~99.9% (no se guardan gradientes del modelo base)")

# Calcular VRAM necesaria
fp32_vram = total_params * 4 / 1e9  # 4 bytes per FP32
fp16_vram = total_params * 2 / 1e9
int4_vram = total_params * 0.5 / 1e9
print(f"\\n=== VRAM Requirements ===")
print(f"FP32: {fp32_vram:.1f} GB")
print(f"FP16: {fp16_vram:.1f} GB")
print(f"INT4: {int4_vram:.1f} GB (QLoRA)")
print(f"GPU necesaria: RTX 3090 (24GB) puede fine-tunear 8B en INT4")`,
      hint: 'Calcula la VRAM necesaria para un modelo de 70B en INT4',
    },
    'graph-rag': {
      title: 'Practica knowledge graphs (simulado)',
      code: `# Simulacion de knowledge graph y GraphRAG
# Sin Neo4j - implementamos con dict de adyacencia

class KnowledgeGraph:
    """Knowledge graph simple con dict de adyacencia."""
    def __init__(self):
        self.nodes = {}
        self.edges = []
    
    def add_node(self, name, node_type):
        self.nodes[name] = {"type": node_type}
    
    def add_edge(self, source, target, rel_type):
        self.edges.append({"source": source, "target": target, "type": rel_type})
    
    def neighbors(self, node, rel_type=None):
        """Encuentra vecinos de un nodo."""
        result = []
        for e in self.edges:
            if e["source"] == node and (rel_type is None or e["type"] == rel_type):
                result.append(e["target"])
        return result
    
    def find_path(self, start, end, max_depth=3):
        """Encuentra camino entre dos nodos (BFS)."""
        queue = [(start, [start])]
        visited = {start}
        while queue:
            node, path = queue.pop(0)
            if node == end:
                return path
            if len(path) >= max_depth:
                continue
            for neighbor in self.neighbors(node):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        return None

# Construir knowledge graph
kg = KnowledgeGraph()
kg.add_node("Ana", "Person")
kg.add_node("Interbank", "Company")
kg.add_node("Luis", "Person")
kg.add_node("ChurnBot", "Project")

kg.add_edge("Ana", "Interbank", "WORKS_AT")
kg.add_edge("Luis", "Interbank", "WORKS_AT")
kg.add_edge("Ana", "ChurnBot", "WORKS_ON")
kg.add_edge("Luis", "ChurnBot", "WORKS_ON")

# Query: colegas de Ana
print("=== Knowledge Graph Queries ===")
colegas = kg.neighbors("Ana", "WORKS_AT")
print(f"Colegas de Ana: {colegas}")

# Query: proyectos de Ana
proyectos = kg.neighbors("Ana", "WORKS_ON")
print(f"Proyectos de Ana: {proyectos}")

# Multi-hop: quien mas trabaja en el mismo proyecto que Ana?
print(f"\\nMulti-hop: colegas en mismo proyecto:")
for proj in kg.neighbors("Ana", "WORKS_ON"):
    workers = kg.neighbors(proj)  # pero edges van persona->proyecto
    # Invertir: buscar quien tiene edge hacia este proyecto
    for e in kg.edges:
        if e["target"] == proj and e["source"] != "Ana":
            print(f"  {e['source']} tambien trabaja en {proj}")`,
      hint: 'Anade un nodo "Maria" que tambien trabaja en Interbank y encuentra el camino',
    },
    'llmops': {
      title: 'Practica tracing y eval (simulado)',
      code: `# Simulacion de LLMOps: tracing y evaluacion
import time
from functools import wraps

# Simular tracing (como LangSmith)
def traced(name):
    """Decorador que simula tracing de LangSmith."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            elapsed = (time.time() - start) * 1000
            print(f"  [{name}] {elapsed:.1f}ms -> {str(result)[:50]}")
            return result
        return wrapper
    return decorator

# Simular pipeline RAG con tracing
@traced("retriever")
def retrieve(query):
    """Recupera documentos relevantes."""
    return [f"doc_{i}" for i in range(3)]

@traced("generator")
def generate(query, docs):
    """Genera respuesta con LLM."""
    return f"Respuesta basada en {len(docs)} documentos"

@traced("rag_pipeline")
def rag_pipeline(query):
    """Pipeline completo con tracing."""
    docs = retrieve(query)
    response = generate(query, docs)
    return response

# Ejecutar
print("=== Tracing ===")
result = rag_pipeline("que es Python?")

# Simular evaluacion RAGAS
print(f"\\n=== Evaluacion RAGAS (simulada) ===")
metrics = {
    "faithfulness": 0.92,      # respuesta fundamentada en contexto
    "answer_relevancy": 0.88,  # responde la pregunta
    "context_precision": 0.85, # contexto recuperado es relevante
    "context_recall": 0.90,    # contexto recuperado es completo
}

for metric, score in metrics.items():
    status = "OK" if score > 0.8 else "WARN"
    print(f"  {metric:25s}: {score:.2f} [{status}]")

avg = sum(metrics.values()) / len(metrics)
print(f"\\n  Promedio: {avg:.2f} ({'APROBADO' if avg > 0.8 else 'RECHAZADO'})")

# Simular cost tracking
print(f"\\n=== Cost Tracking ===")
tokens = {"input": 1500, "output": 300}
cost = (tokens["input"] * 0.0025 + tokens["output"] * 0.01) / 1000
print(f"  Tokens: {tokens}")
print(f"  Costo: ${'{cost:.4f}'}")`,
      hint: 'Cambia faithfulness a 0.5 y observa como cambia el status',
    },
    'multimodal': {
      title: 'Practica CLIP y Whisper (simulado)',
      code: `# Simulacion de conceptos multi-modales
# Sin transformers - simulamos con conceptos

# Simular CLIP: alinear texto e imagen en espacio vectorial
def text_embedding(text):
    """Simula embedding de texto (CLIP)."""
    words = text.lower().split()
    # Hash simple como embedding simulado
    return [len(w) / 10 for w in words]

def cosine_sim(a, b):
    """Similitud coseno entre dos vectores."""
    dot = sum(x*y for x, y in zip(a, b))
    norm_a = sum(x**2 for x in a)**0.5
    norm_b = sum(y**2 for y in b)**0.5
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0

# Buscar imagen por texto (zero-shot)
texts = ["un gato", "un perro", "un auto"]
# Simular embeddings de imagenes (pre-calculados)
images = {
    "img1.jpg": [0.5, 0.3, 0.4],  # similar a "un gato"
    "img2.jpg": [0.4, 0.5, 0.3],  # similar a "un perro"
    "img3.jpg": [0.3, 0.3, 0.9],  # similar a "un auto"
}

print("=== CLIP: Buscar imagen por texto ===")
query = "un gato"
query_emb = text_embedding(query)
print(f"Query: '{query}' -> embedding: {query_emb}")

for img_name, img_emb in images.items():
    # Padding para igualar longitud
    max_len = max(len(query_emb), len(img_emb))
    q = query_emb + [0] * (max_len - len(query_emb))
    i = img_emb + [0] * (max_len - len(img_emb))
    sim = cosine_sim(q, i)
    print(f"  {img_name}: similitud={sim:.2f}")

# Simular Whisper: transcripcion
print(f"\\n=== Whisper: Transcripcion (simulada) ===")
audio_segments = [
    {"start": 0.0, "end": 2.5, "text": "Hola, bienvenidos al curso"},
    {"start": 2.5, "end": 5.0, "text": "de Python para Data Science"},
    {"start": 5.0, "end": 7.5, "text": "vamos a aprender mucho"},
]

print("Transcripcion con timestamps:")
for seg in audio_segments:
    print(f"  [{seg['start']:.1f}s - {seg['end']:.1f}s] {seg['text']}")

full_text = " ".join(seg["text"] for seg in audio_segments)
print(f"\\nTexto completo: '{full_text}'")`,
      hint: 'Cambia el query a "un auto" y observa cual imagen tiene mayor similitud',
    },
    'iac': {
      title: 'Practica Terraform concepts',
      code: `# Simulacion de conceptos de IaC
# Sin Terraform real - simulamos el modelo declarativo

# Simular Terraform: estado deseado vs estado actual
class TerraformSimulator:
    """Simula Terraform: plan, apply, destroy."""
    def __init__(self):
        self.resources = {}
        self.state = {}
    
    def plan(self, desired):
        """Muestra que cambiaria (como terraform plan)."""
        to_create = []
        to_modify = []
        to_destroy = []
        
        for name, config in desired.items():
            if name not in self.state:
                to_create.append(name)
            elif self.state[name] != config:
                to_modify.append(name)
        
        for name in self.state:
            if name not in desired:
                to_destroy.append(name)
        
        return {"create": to_create, "modify": to_modify, "destroy": to_destroy}
    
    def apply(self, desired):
        """Aplica cambios (como terraform apply)."""
        plan = self.plan(desired)
        for name in plan["create"]:
            print(f"  + Creating {name}")
            self.state[name] = desired[name]
        for name in plan["modify"]:
            print(f"  ~ Modifying {name}")
            self.state[name] = desired[name]
        for name in plan["destroy"]:
            print(f"  - Destroying {name}")
            del self.state[name]
    
    def destroy_all(self):
        """Destruye todo (como terraform destroy)."""
        for name in list(self.state.keys()):
            print(f"  - Destroying {name}")
            del self.state[name]

tf = TerraformSimulator()

# Estado deseado: cluster de ML
desired = {
    "ml_api": {"image": "ml-api:v1", "replicas": 3},
    "redis": {"image": "redis:7", "port": 6379},
    "prometheus": {"image": "prom:v2", "port": 9090},
}

print("=== terraform plan ===")
plan = tf.plan(desired)
print(f"  Create: {plan['create']}")
print(f"  Modify: {plan['modify']}")
print(f"  Destroy: {plan['destroy']}")

print("\\n=== terraform apply ===")
tf.apply(desired)
print(f"  State: {list(tf.state.keys())}")

print("\\n=== Actualizar (cambiar replicas) ===")
desired["ml_api"]["replicas"] = 5
tf.apply(desired)
print(f"  ml_api replicas: {tf.state['ml_api']['replicas']}")

print("\\n=== terraform destroy ===")
tf.destroy_all()
print(f"  State: {list(tf.state.keys())}")`,
      hint: 'Anade un nuevo recurso "grafana" al estado deseado y aplica',
    },
    'gpu-computing': {
      title: 'Practica conceptos de GPU (simulado)',
      code: `# Simulacion de conceptos de GPU computing
import time
import math

# Simular multiplicacion de matrices: CPU vs GPU (conceptual)
def matrix_multiply_cpu(A, B):
    """Multiplicacion de matrices en CPU (O(n^3))."""
    n = len(A)
    C = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C

# Simular conceptos de GPU
print("=== GPU Computing Concepts ===")

# 1. Paralelismo: CPU vs GPU
print("\\n1. Paralelismo:")
print("  CPU: 4-16 cores, cada uno hace trabajo complejo")
print("  GPU: 1000s de cores, cada uno hace trabajo simple")
print("  Para matrices 5000x5000:")
print("    CPU (1 core):  ~2.1s")
print("    GPU (CuPy):    ~0.05s (42x speedup)")

# 2. Memory hierarchy
print("\\n2. Jerarquia de memoria:")
print("  CPU RAM:  16-64 GB, lento (100 GB/s)")
print("  GPU VRAM: 8-80 GB, rapido (900 GB/s)")
print("  Limitacion: datos deben caber en VRAM")
print("  T4: 16GB | A100: 80GB | H100: 80GB")

# 3. Simular benchmark de small matrix
n = 100
A = [[random.random() for _ in range(n)] for _ in range(n)]
B = [[random.random() for _ in range(n)] for _ in range(n)]

import random
random.seed(42)
A = [[random.random() for _ in range(n)] for _ in range(n)]
B = [[random.random() for _ in range(n)] for _ in range(n)]

t0 = time.time()
C = matrix_multiply_cpu(A, B)
t_cpu = time.time() - t0
print(f"\\n3. Benchmark (matriz {n}x{n}):")
print(f"  CPU (Python puro): {t_cpu:.4f}s")
print(f"  GPU estimado:      {t_cpu/42:.4f}s (42x speedup)")
print(f"  NumPy estimado:    {t_cpu/100:.4f}s (100x vs Python puro)")

# 4. Conceptos de vLLM
print("\\n4. vLLM (LLM serving):")
print("  PagedAttention: gestiona KV cache como memoria virtual")
print("  Permite batch de 100+ requests sin OOM")
print("  3-5x mas rapido que HuggingFace transformers")`,
      hint: 'Cambia n a 200 y observa como aumenta el tiempo cuadraticamente',
    },
    'opensource': {
      title: 'Practica empaquetado y CI',
      code: `# Simulacion de conceptos de open source
import json

# 1. Simular pyproject.toml
pyproject = {
    "build-system": {"requires": ["hatchling"], "build-backend": "hatchling.build"},
    "project": {
        "name": "pytools-cli",
        "version": "1.0.0",
        "description": "CLI toolkit para Data Science",
        "requires-python": ">=3.10",
        "dependencies": ["click>=8.0", "pandas>=2.0"],
    },
    "project.optional-dependencies": {
        "dev": ["pytest", "ruff", "mypy"],
        "ml": ["scikit-learn", "xgboost"],
    },
    "project.scripts": {
        "pytools": "pytools_cli.main:cli"
    }
}

print("=== pyproject.toml ===")
print(f"  Nombre: {pyproject['project']['name']}")
print(f"  Version: {pyproject['project']['version']}")
print(f"  Entry point: {list(pyproject['project.scripts'].keys())[0]}")
print(f"  Deps: {pyproject['project']['dependencies']}")
print(f"  Extras: {list(pyproject['project.optional-dependencies'].keys())}")

# 2. Semantic Versioning
def check_compatibility(old, new):
    """Verifica compatibilidad semver."""
    o = [int(x) for x in old.split('.')]
    n = [int(x) for x in new.split('.')]
    if n[0] != o[0]:
        return "BREAKING (major bump)"
    elif n[1] > o[1]:
        return "COMPATIBLE (minor bump - new features)"
    elif n[2] > o[2]:
        return "COMPATIBLE (patch bump - bugfix)"
    return "SAME VERSION"

print("\\n=== Semantic Versioning ===")
versions = [("1.0.0", "1.0.1"), ("1.0.0", "1.1.0"), ("1.0.0", "2.0.0")]
for old, new in versions:
    compat = check_compatibility(old, new)
    print(f"  {old} -> {new}: {compat}")

# 3. Simular CI matrix
print("\\n=== CI Matrix (simulado) ===")
oses = ["ubuntu", "macos", "windows"]
pythons = ["3.10", "3.11", "3.12"]
print(f"  OS: {oses}")
print(f"  Python: {pythons}")
print(f"  Total jobs: {len(oses) * len(pythons)} (paralelo)")
print(f"  Steps: checkout -> setup-python -> pip install -> ruff -> pytest")`,
      hint: 'Que pasa si cambio la version a 2.0.0? Es compatible con 1.x?',
    },
    'ai-governance': {
      title: 'Practica bias y fairness',
      code: `# Simulacion de bias detection y fairness
import random

# Simular predicciones de un modelo
random.seed(42)
n = 100
genero = ["M"] * 50 + ["F"] * 50
# Modelo con bias: aprueba mas hombres que mujeres
predicciones = []
for g in genero:
    if g == "M":
        predicciones.append(1 if random.random() < 0.7 else 0)
    else:
        predicciones.append(1 if random.random() < 0.5 else 0)

# Calcular metricas de fairness
def fairness_metrics(genero, predicciones):
    """Calcula metricas de fairness basicas."""
    m_aprobados = sum(p for g, p in zip(genero, predicciones) if g == "M")
    f_aprobados = sum(p for g, p in zip(genero, predicciones) if g == "F")
    m_total = sum(1 for g in genero if g == "M")
    f_total = sum(1 for g in genero if g == "F")
    
    m_rate = m_aprobados / m_total
    f_rate = f_aprobados / f_total
    disparate_impact = min(m_rate, f_rate) / max(m_rate, f_rate)
    
    return {
        "m_approval_rate": m_rate,
        "f_approval_rate": f_rate,
        "disparate_impact": disparate_impact,
        "has_bias": disparate_impact < 0.8,
    }

metrics = fairness_metrics(genero, predicciones)
print("=== Bias Detection ===")
print(f"  Tasa aprobacion Hombres: {metrics['m_approval_rate']:.1%}")
print(f"  Tasa aprobacion Mujeres: {metrics['f_approval_rate']:.1%}")
print(f"  Disparate Impact: {metrics['disparate_impact']:.3f}")
print(f"  Bias detectado: {'SI' if metrics['has_bias'] else 'NO'} (umbral: 0.8)")

# Simular model card
print("\\n=== Model Card ===")
model_card = {
    "name": "Credit Scoring Model v2.0",
    "intended_use": "Scoring crediticio para clientes de banca",
    "training_data": "10,000 registros historicos (2024)",
    "metrics": {"auc": 0.87, "precision": 0.82},
    "bias_check": f"Disparate impact: {metrics['disparate_impact']:.3f}",
    "limitations": "Solo valido para clientes con > 3 meses de antiguedad",
    "human_oversight": "Requerido para score > 80%",
}
for key, value in model_card.items():
    print(f"  {key}: {value}")`,
      hint: 'Cambia la probabilidad de aprobacion de mujeres a 0.65 y observa si el bias desaparece',
    },
    'data-contracts': {
      title: 'Practica data contracts',
      code: `# Simulacion de data contracts con validacion
from dataclasses import dataclass
from typing import Optional

# Definir contrato de datos (estilo pydantic)
@dataclass
class TransactionContract:
    """Contrato para transacciones de clientes."""
    transaction_id: str
    user_id: str
    amount: float
    currency: str = "PEN"
    
    def validate(self):
        """Valida el contrato y retorna errores."""
        errors = []
        if not self.transaction_id:
            errors.append("transaction_id es requerido")
        if not self.user_id:
            errors.append("user_id es requerido")
        if self.amount <= 0:
            errors.append("amount debe ser positivo")
        if self.currency not in ["PEN", "USD", "EUR"]:
            errors.append("currency debe ser PEN, USD o EUR")
        return errors

# Simular Great Expectations
def gx_validate(data, expectations):
    """Simula Great Expectations: valida reglas de calidad."""
    results = []
    for exp in expectations:
        name = exp["name"]
        check = exp["check"](data)
        results.append({"name": name, "passed": check})
    return results

# Datos de prueba
transactions = [
    {"id": "tx1", "user": "u1", "amount": 100.0},
    {"id": "tx2", "user": "u2", "amount": 50.0},
    {"id": "tx3", "user": "", "amount": -10.0},  # invalido
]

# Validar contrato
print("=== Data Contract Validation ===")
for tx in transactions:
    contract = TransactionContract(
        transaction_id=tx["id"],
        user_id=tx["user"],
        amount=tx["amount"],
    )
    errors = contract.validate()
    status = "OK" if not errors else f"ERROR: {errors}"
    print(f"  {tx['id']}: {status}")

# Simular Great Expectations
print("\\n=== Great Expectations ===")
expectations = [
    {"name": "not_null_id", "check": lambda d: all(t["id"] for t in d)},
    {"name": "positive_amount", "check": lambda d: all(t["amount"] > 0 for t in d)},
    {"name": "unique_ids", "check": lambda d: len(set(t["id"] for t in d)) == len(d)},
]

results = gx_validate(transactions, expectations)
for r in results:
    status = "PASS" if r["passed"] else "FAIL"
    print(f"  {r['name']}: {status}")`,
      hint: 'Corrige la transaccion 3 y observa si todas las validaciones pasan',
    },
    'tech-leadership': {
      title: 'Practica design doc y postmortem',
      code: `# Generador de templates de liderazgo tecnico

def generate_design_doc(title, context, goals, design, alternatives, risks):
    """Genera un design doc estructurado."""
    doc = f"# Design Doc: {title}\\n"
    doc += f"\\n## Context\\n{context}\\n"
    doc += f"\\n## Goals\\n"
    for g in goals:
        doc += f"- {g}\\n"
    doc += f"\\n## Design\\n{design}\\n"
    doc += f"\\n## Alternatives\\n"
    for a in alternatives:
        doc += f"- {a}\\n"
    doc += f"\\n## Risks\\n"
    for r in risks:
        doc += f"- {r}\\n"
    return doc

# Generar design doc real
dd = generate_design_doc(
    title="Sistema de Recomendacion en Tiempo Real",
    context="Necesitamos recomendar productos en <50ms para 10K usuarios concurrentes.",
    goals=["Latencia p99 < 50ms", "Throughput: 10K QPS", "Cobertura: 95% de catalogo"],
    design="Redis cache + collaborative filtering + fallback a populares",
    alternatives=["Batch pre-compute (descartado: no personalizado)", "ML en cada request (descartado: >200ms)"],
    risks=["Cache invalidation staleness", "Cold start para nuevos usuarios"]
)
print(dd)

# Generar postmortem template
def generate_postmortem(summary, timeline, root_causes, actions):
    """Genera un postmortem blameless."""
    pm = f"# Postmortem: {summary}\\n"
    pm += f"\\n## Timeline\\n"
    for t in timeline:
        pm += f"- {t}\\n"
    pm += f"\\n## Root Cause (5 Whys)\\n"
    for rc in root_causes:
        pm += f"- {rc}\\n"
    pm += f"\\n## Action Items\\n"
    for a in actions:
        pm += f"- [ ] {a}\\n"
    return pm

print("\\n" + "="*50)
pm = generate_postmortem(
    summary="API caida 23 min (12K requests fallidos)",
    timeline=["12:03 Alerta error rate >5%", "12:05 Investigacion: Redis pool", "12:15 Rollback", "12:26 Restaurado"],
    root_causes=["Pool agotado por leak", "No habia test de pool", "CI no cubre Redis"],
    actions=["Anadir Redis a docker-compose test", "Contract test para pool", "Alerta pool > 80%"]
)
print(pm)`,
      hint: 'Escribe un design doc para tu propio proyecto',
    },
    'integrator-final': {
      title: 'Practica arquitectura agenticaca',
      code: `# Simulacion de plataforma agéntica completa
from typing import TypedDict

# Simular LangGraph StateGraph
class AgentState(TypedDict):
    query: str
    research: str
    analysis: str
    report: str

# Simular agentes especializados
def researcher(state):
    """Agente 1: busca informacion."""
    print(f"  [Researcher] Buscando: {state['query']}")
    return {"research": f"Datos encontrados sobre {state['query']}"}

def analyst(state):
    """Agente 2: analiza datos."""
    print(f"  [Analyst] Analizando: {state['research'][:30]}...")
    return {"analysis": f"Insights: {state['query']} tiene 3 patrones clave"}

def writer(state):
    """Agente 3: genera reporte."""
    print(f"  [Writer] Escribiendo reporte...")
    return {"report": f"# Reporte\\n\\nQuery: {state['query']}\\nAnalisis: {state['analysis']}"}

# Orquestar (simulando LangGraph)
def run_platform(query):
    """Ejecuta la plataforma agéntica completa."""
    print(f"=== Plataforma Agéntica ===")
    print(f"Query: {query}\\n")
    
    state = {"query": query, "research": "", "analysis": "", "report": ""}
    
    # Flujo: researcher -> analyst -> writer
    state.update(researcher(state))
    state.update(analyst(state))
    state.update(writer(state))
    
    print(f"\\n=== Reporte Final ===")
    print(state["report"])
    return state

# Ejecutar
result = run_platform("Analisis de churn Q2 2026")

# Simular LLMOps
print(f"\\n=== LLMOps ===")
metrics = {
    "latency_p99": 245,
    "tokens_used": 1850,
    "cost_usd": 0.0046,
    "faithfulness": 0.92,
}
for k, v in metrics.items():
    print(f"  {k}: {v}")`,
      hint: 'Anade un cuarto agente "Reviewer" que valide el reporte antes de entregarlo',
    },
    'career-strategy': {
      title: 'Practica portfolio y CV',
      code: `# Generador de portfolio y CV tips

# Simular portfolio site
projects = [
    {
        "title": "Churn Prediction Pipeline",
        "tech": ["Python", "XGBoost", "FastAPI", "Docker"],
        "impact": "Redujo churn 15%, salvando S/2M anuales",
        "metrics": {"auc": 0.87, "qps": 12500, "latency_ms": 87},
    },
    {
        "title": "Familiarity Score Dashboard",
        "tech": ["Python", "RapidFuzz", "Leaflet", "Next.js"],
        "impact": "Detecto 500+ duplicados en base de 50K clientes",
        "metrics": {"accuracy": 0.95, "records": 50000, "duplicates": 500},
    },
    {
        "title": "Invoice Digitizer Bot",
        "tech": ["Python", "Playwright", "Ollama", "Tesseract"],
        "impact": "Automatizo 200h/mes de trabajo manual",
        "metrics": {"hours_saved": 200, "accuracy": 0.89, "cost": "$0"},
    },
]

print("=== Portfolio Site ===")
for p in projects:
    print(f"\\n  {p['title']}")
    print(f"    Tech: {', '.join(p['tech'])}")
    print(f"    Impacto: {p['impact']}")
    print(f"    Metrics: {p['metrics']}")

# Generar CV con logros cuantificables
print(f"\\n=== CV: Logros Cuantificables ===")
logros = [
    ("Construi pipeline de churn con XGBoost, reduciendo churn 15% y salvando S/2M anuales"),
    ("Procese 50M transacciones/dia con Kafka + Spark, reduciendo latencia 80%"),
    ("Automatice 200h/mes de trabajo manual con Python + Playwright, 99.5% uptime"),
    ("Implemente entity resolution con RapidFuzz, detectando 500+ duplicados en 50K registros"),
]

for i, logro in enumerate(logros, 1):
    # Verificar que tiene numeros (ATS check)
    has_numbers = any(c.isdigit() for c in logro)
    print(f"  {i}. {'✓' if has_numbers else '✗'} {logro}")

# Calcular keyword overlap (ATS)
print(f"\\n=== ATS Keyword Check ===")
job_desc = "Python pandas scikit-learn AWS Docker Kubernetes FastAPI"
cv_keywords = "Python XGBoost FastAPI Docker pandas numpy"
overlap = len(set(job_desc.lower().split()) & set(cv_keywords.lower().split()))
total = len(set(job_desc.lower().split()))
print(f"  Job desc keywords: {job_desc}")
print(f"  CV keywords: {cv_keywords}")
print(f"  Overlap: {overlap}/{total} ({overlap/total:.0%})")`,
      hint: 'Anade mas keywords de la job desc a tu CV para aumentar el overlap',
    },
  }
  if (!demo) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-t border-border pt-6">
        <Sparkles className="h-5 w-5 text-gold" />
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-subdisplay)' }}>Pruébalo tú mismo</h3>
      </div>
      <Callout type="tip" title="Editor interactivo en tu navegador">
        Este editor corre Python de verdad en tu browser (con Pyodide). Modifica el código, presiona <strong>Run</strong>, y experimenta. No necesitas instalar nada.
      </Callout>
      <CodePlayground
        initialCode={demo.code}
        expectedOutput={demo.expectedOutput}
        hint={demo.hint}
        title={demo.title}
      />
    </div>
  )
}
