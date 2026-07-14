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
  }

  const demo = demos[sectionId]
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
