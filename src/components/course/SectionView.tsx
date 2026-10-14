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
  ListChecks,
  CircleHelp,
  ArrowRight,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSession } from 'next-auth/react'
import { useProgressStore, SUB_STEPS, type SubStep } from '@/lib/progress-store'
import type { CourseSection } from '@/lib/types'
import {
  SELF_CHECK_PASS_PCT,
  authoredOrders,
  gradeSelfCheck,
  mathRandomInt,
  optionOrders,
  revealsKey,
} from '@/lib/self-check'
import { CodeBlock } from './CodeBlock'
import { Callout } from './Callout'
import { InlineText, RichText } from './RichText'
import { FigureFrame } from './Figure'
import { SetupIntroLink } from '@/components/setup/SetupIntroLink'
import { SteppedCode } from './SteppedCode'
import { ProgressRing } from './ProgressRing'
import { ExamView } from './ExamView'
import { CodePlayground } from './CodePlayground'
import { PLAYGROUND_DEMOS } from '@/lib/course/playground-demos'
import { t, useI18n } from '@/lib/i18n'
import { popIn, riseIn } from '@/lib/entrance'

interface SectionViewProps {
  /**
   * False while this is the view the page restored from the URL hash as it
   * loaded: the tab panel and the prev/next buttons then mount at rest
   * instead of waiting for an animation frame to leave opacity 0 (see riseIn).
   */
  animateEntrance: boolean
  section: CourseSection
  onPrev: () => void
  onNext: () => void
  hasNext: boolean
  hasPrev: boolean
  onOpenAuth: () => void
  activeSubStep?: SubStep
  onActiveSubStepChange?: (step: SubStep) => void
}

const TAB_META: Record<SubStep, { icon: React.ElementType; labelKey: string; color: string }> = {
  theory: { icon: BookOpen, labelKey: 'section.theory', color: 'text-sky-600' },
  ido: { icon: PlayCircle, labelKey: 'section.ido', color: 'text-violet-600' },
  wedo: { icon: Users, labelKey: 'section.wedo', color: 'text-amber-600' },
  youdo: { icon: Rocket, labelKey: 'section.youdo', color: 'text-emerald-600' },
  quiz: { icon: HelpCircle, labelKey: 'section.quiz', color: 'text-rose-600' },
}

export function SectionView({
  animateEntrance,
  section,
  onPrev,
  onNext,
  hasNext,
  hasPrev,
  onOpenAuth,
  activeSubStep,
  onActiveSubStepChange,
}: SectionViewProps) {
  const [uncontrolledTab, setUncontrolledTab] = useState<SubStep>('theory')
  const [tabSectionId, setTabSectionId] = useState(section.id)
  if (section.id !== tabSectionId) {
    setTabSectionId(section.id)
    setUncontrolledTab('theory')
  }
  const activeTab = activeSubStep ?? uncontrolledTab
  const setActiveTab = (step: SubStep) => {
    onActiveSubStepChange?.(step)
    if (activeSubStep === undefined) setUncontrolledTab(step)
  }
  const lang = useI18n((state) => state.lang)
  const tr = (key: string) => t(key, lang)
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

  // Scroll: new sections open at top; returning to a section restores the last offset.
  // Positions are session-scoped (sessionStorage) so refresh keeps resume only for this tab.
  useEffect(() => {
    setLastVisited(section.id)

    const key = `pyarcana:sectionScroll:${section.id}`
    const savedRaw =
      typeof window !== 'undefined' ? sessionStorage.getItem(key) : null
    const saved = savedRaw != null ? Number(savedRaw) : NaN
    const restore = Number.isFinite(saved) && saved > 0

    // Prefer the document scroll (main content is not a nested scroller in layout).
    const apply = () => {
      if (restore) {
        window.scrollTo({ top: saved, behavior: 'auto' })
        document
          .getElementById('section-content')
          ?.scrollTo({ top: 0, behavior: 'auto' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document
          .getElementById('section-content')
          ?.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    // Wait a frame so sticky headers / tab reset don't steal the offset.
    const id = window.requestAnimationFrame(apply)
    return () => window.cancelAnimationFrame(id)
  }, [section.id, setLastVisited])

  // Persist scroll while reading; clear is not needed (overwrite on leave).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = `pyarcana:sectionScroll:${section.id}`
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        sessionStorage.setItem(key, String(window.scrollY || 0))
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      // Final write when leaving this section (before next section mounts).
      sessionStorage.setItem(key, String(window.scrollY || 0))
      window.removeEventListener('scroll', onScroll)
    }
  }, [section.id])

  const sectionProgress = Math.round(
    (subStepsDone.length / SUB_STEPS.length) * 100
  )

  return (
    <div
      className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 pb-32 lg:pb-24"
      id="section-content"
      data-testid="section-root"
      data-section-id={section.id}
      data-section-index={section.index}
      data-section-title={section.shortTitle || section.title}
    >
      {/* Compact sticky top bar — replaces 500px preamble stack */}
      <div className="sticky top-14 z-30 -mx-4 mb-3 bg-background/85 backdrop-blur-md border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary shrink-0" data-testid="section-badge">
            <span className="font-bold">S{section.index}</span>
          </Badge>
          <h1 className="text-base sm:text-lg font-bold tracking-tight truncate flex-1 min-w-0">
            <span className="gradient-text">{section.title}</span>
          </h1>

          {/* Compact progress ring — replaces progress strip card */}
          <div className="shrink-0" title={`${sectionProgress}% completado`}>
            <ProgressRing progress={sectionProgress} size={32} />
          </div>

          {/* Job relevance — popover (was 100px card) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title={tr('section.jobRelevance')} data-testid="section-job-relevance">
                <Briefcase className="h-4 w-4 text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96" side="bottom" align="end">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {tr('section.jobRelevance')}
                </div>
                <p className="text-sm text-foreground/80"><InlineText text={section.jobRelevance} /></p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Learning outcomes — sheet (was 200-400px grid) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Objetivos de aprendizaje" data-testid="section-outcomes">
                <ListChecks className="h-4 w-4 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Objetivos de aprendizaje
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {section.learningOutcomes.map((lo, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs text-foreground/90"><InlineText text={lo.text} /></span>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tagline as muted secondary line (was its own <p>) */}
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1"><InlineText text={section.tagline} /></p>

        {/* Inline meta badges */}
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {section.estimatedHours}h
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {section.level}
          </span>
          {allDone && (
            <Badge className="ml-auto gap-1 bg-green-600 text-white h-5 px-1.5 text-[10px]">
              <Award className="h-3 w-3" />
              Completada
            </Badge>
          )}
        </div>
      </div>

      {/* Section 1 assumes a computer that is already set up; Sesión 0 is the way there. */}
      <SetupIntroLink when={section.index === 1} className="mb-3" />

      {/* Tabs — compact horizontal, no per-trigger CheckCircle (uses color) */}
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
                data-testid={`tab-${step}`}
                className="flex flex-row items-center justify-center gap-1.5 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className={cn('h-3.5 w-3.5', meta.color, done && 'opacity-100')} />
                <span className="text-[10px] sm:text-xs hidden sm:inline">{tr(meta.labelKey)}</span>
                {done && <CheckCircle2 className="h-3 w-3 text-green-600 sm:hidden" />}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={riseIn(animateEntrance, 4)}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-3 mx-12 lg:ml-0 lg:mr-24"
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

      {/* HUD FABs — game-style overlay navigation (replaces bottom nav) */}
      {/* Bottom-left: Prev section */}
      <motion.button
        initial={popIn(animateEntrance, 0.8)}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onPrev}
        disabled={!hasPrev}
        data-testid="section-prev"
        aria-label={tr('course.previousSection')}
        className={cn(
          'fixed left-3 bottom-4 z-40 h-11 w-11 lg:h-12 lg:w-12 rounded-full shadow-lg backdrop-blur-md',
          'bg-card/90 border border-border flex items-center justify-center',
          'hover:bg-card transition-colors',
          !hasPrev && 'opacity-40 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* Bottom-right: Next section */}
      <motion.button
        initial={popIn(animateEntrance, 0.8)}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onNext}
        disabled={!hasNext}
        data-testid="section-next"
        aria-label={tr('course.nextSection')}
        className={cn(
          'fixed right-3 bottom-4 z-40 h-11 w-11 lg:h-12 lg:w-12 rounded-full shadow-lg backdrop-blur-md',
          'bg-primary text-primary-foreground border border-primary/50 flex items-center justify-center',
          'hover:bg-primary/90 transition-colors',
          !hasNext && 'opacity-40 cursor-not-allowed'
        )}
      >
        <ArrowRight className="h-5 w-5" />
      </motion.button>

      {/* Bottom-center: 5-dot progress strip + Mark done — floating above FABs */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 bg-card/90 border border-border rounded-full px-3 py-1.5 shadow-md backdrop-blur-md">
        {SUB_STEPS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={cn(
              'h-1.5 w-6 rounded-full transition-all hover:scale-110',
              subStepsDone.includes(s) ? 'bg-primary' : 'bg-muted',
              activeTab === s && 'ring-2 ring-primary/40 ring-offset-1 ring-offset-card'
            )}
            title={tr(TAB_META[s].labelKey)}
            aria-label={`${lang === 'en' ? 'Go to' : 'Ir a'} ${tr(TAB_META[s].labelKey)}`}
          />
        ))}
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
      {section.theory.map((block, i) => {
        const body = (
          <>
            {/* A real heading, not the first paragraph. The heading used to be joined onto
                the paragraphs and handed to RichText, so every theory heading in the course
                rendered as a 15px <p> indistinguishable from the prose under it, and a
                screen reader had no heading to jump to (WCAG 1.3.1). An optional block's
                heading lives in its collapsible trigger instead. */}
            {!block.optional && (
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                <InlineText text={block.heading} />
              </h3>
            )}
            <RichText sectionId={section.id} content={block.paragraphs.join('\n\n')} />
            {/* Spatial contiguity: the figure sits between the prose it
                explains and the code that follows, never in a gallery. */}
            {block.figure && <FigureFrame figure={block.figure} />}
            {block.code && (
              <CodeBlock
                code={block.code.code}
                language={block.code.language}
                title={block.code.title}
                output={block.code.output}
              />
            )}
            {block.callout && (
              <Callout type={block.callout.type} title={block.callout.title && <InlineText text={block.callout.title} />}>
                <InlineText text={block.callout.content} />
              </Callout>
            )}
          </>
        )

        // Optional deeper dive: collapsed by default so the section's main
        // thread stays readable. The heading moves into the trigger.
        if (block.optional) {
          return (
            <Collapsible key={i} className="rounded-lg border border-dashed border-sky-300 dark:border-sky-800">
              <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-sky-950/40">
                <ChevronDown className="h-4 w-4 shrink-0 text-sky-600 transition-transform group-data-[state=open]:rotate-180" />
                {/* min-w-0: a flex-1 item defaults to min-width:auto and refuses to
                    shrink below its text, pushing the badge past a 320px viewport.
                    Same defect the Callout already carries a regression test for. */}
                <span className="min-w-0 flex-1 font-semibold"><InlineText text={block.heading} /></span>
                <Badge variant="outline" className="shrink-0 text-xs font-normal">
                  Profundización opcional
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 px-4 pb-4">{body}</CollapsibleContent>
            </Collapsible>
          )
        }

        return (
          <div key={i} className="space-y-4">
            {body}
          </div>
        )
      })}

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
      <RichText content={section.iDo.intro} sectionId={section.id} />
      {section.iDo.steps.map((step, i) => (
        <Card
          key={i}
          className="overflow-hidden border-violet-500/20"
          data-testid={step.demoId ? `demo-${step.demoId}` : `demo-step-${i}`}
        >
          <div className="border-b border-border/60 bg-violet-500/5 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-semibold"><InlineText text={step.description} /></span>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {step.preamble && (
              <Callout type="info" title="Antes de la demo">
                <RichText content={step.preamble} sectionId={section.id} />
              </Callout>
            )}
            {/* I Do only: the demo arrives at the learner's pace, so the
                "Predicción" the preamble already asks for happens before the
                output is legible instead of next to it. */}
            <SteppedCode
              code={step.code.code}
              language={step.code.language}
              title={step.code.title}
              output={step.code.output}
              demoId={step.demoId}
            />
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Lightbulb className="h-3.5 w-3.5" />
                ¿Por qué este código?
              </div>
              <div className="mt-1 text-sm text-foreground/80">
                <RichText content={step.why} sectionId={section.id} />
              </div>
            </div>
            {step.retrospective && (
              <Callout type="success" title="Después de la demo — consolida">
                <RichText content={step.retrospective} sectionId={section.id} />
              </Callout>
            )}
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
      <RichText content={section.weDo.intro} sectionId={section.id} />
      {section.weDo.steps.map((step, i) => {
        const showSol = showSolutions[i] || false
        const exId = step.id || `step-${i}`
        const headerTitle =
          step.title?.trim() ||
          (step.instruction.length > 96 ? `${step.instruction.slice(0, 93).trim()}…` : step.instruction)
        return (
          <Card
            key={i}
            className="overflow-hidden border-amber-500/20"
            data-testid={`exercise-${exId}`}
          >
            <div className="border-b border-border/60 bg-amber-500/5 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold"><InlineText text={headerTitle} /></span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              {step.preamble && (
                <Callout type="info" title="Antes de empezar">
                  <RichText content={step.preamble} sectionId={section.id} />
                </Callout>
              )}
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Tu tarea</div>
                <div className="text-sm text-foreground/90">
                  <RichText content={step.instruction} sectionId={section.id} />
                </div>
              </div>
              {step.hints && step.hints.length > 0 ? (
                step.hints.map((h, hi) => (
                  <Callout key={hi} type="tip" title={hi === 0 ? 'Pista 1' : `Pista ${hi + 1}`}>
                    <RichText content={h} sectionId={section.id} />
                  </Callout>
                ))
              ) : (
                <Callout type="tip" title="Pista">
                  <RichText content={step.hint} sectionId={section.id} />
                </Callout>
              )}
              {step.kind && (
                <p className="text-xs text-muted-foreground">
                  Tipo:{' '}
                  {step.kind === 'guided'
                    ? 'Guiado'
                    : step.kind === 'independent'
                      ? 'Independiente'
                      : 'Transferencia'}
                  {step.id ? ` · ${step.id}` : ''}
                </p>
              )}
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
                  data-testid={`exercise-check-${exId}`}
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
                  className="space-y-3"
                  data-testid={`exercise-feedback-${exId}`}
                >
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Solución:</div>
                  <CodeBlock
                    code={step.solutionCode.code}
                    language={step.solutionCode.language}
                    title={step.solutionCode.title}
                    output={step.solutionCode.output}
                  />
                  {step.edgeCases && step.edgeCases.length > 0 && (
                    <Callout type="warning" title="Casos borde">
                      <ul className="list-disc pl-4 space-y-1">
                        {step.edgeCases.map((ec, eci) => (
                          <li key={eci}>{ec}</li>
                        ))}
                      </ul>
                    </Callout>
                  )}
                  {step.feedback && (
                    <Callout type="success" title="Feedback">
                      <RichText content={step.feedback} sectionId={section.id} />
                    </Callout>
                  )}
                  {step.retrospective && (
                    <Callout type="tip" title="Después del ejercicio — consolida">
                      <RichText content={step.retrospective} sectionId={section.id} />
                    </Callout>
                  )}
                  {step.tests && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Verificación: </span>
                      {step.tests}
                    </p>
                  )}
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
            <div className="mt-1 text-sm text-foreground/80">
              <RichText content={project.context} sectionId={section.id} />
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Objetivos</div>
            <ul className="mt-2 space-y-2">
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span><InlineText text={o} /></span>
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
                  <span className="font-mono text-[13px]"><InlineText text={r} /></span>
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
            <RichText content={project.portfolioNote} sectionId={section.id} />
          </Callout>

          {project.retrospective && (
            <Callout type="success" title="Después del proyecto — consolida y defiende">
              <RichText content={project.retrospective} sectionId={section.id} />
            </Callout>
          )}

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
                      <td className="px-3 py-2 text-foreground/80"><InlineText text={r.criterion} /></td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">{r.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {section.topicEvaluations && section.topicEvaluations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-rose-600" />
            <h3 className="text-lg font-semibold">Evaluaciones de tema (V3)</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Rúbrica 0–3 por criterio (corrección, robustez, mantenibilidad, uso responsable). Solo datos sintéticos.
          </p>
          {section.topicEvaluations.map((te) => (
            <Card key={te.id} className="border-rose-500/20 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="mb-1 text-[10px] font-mono">
                    {te.id}
                  </Badge>
                  <h4 className="text-sm font-semibold"><InlineText text={te.title} /></h4>
                </div>
              </div>
              <ul className="space-y-2">
                {te.tasks.map((task) => (
                  <li key={task.id} className="rounded-md border border-border/60 bg-muted/30 p-2.5">
                    <div className="text-xs font-medium text-foreground"><InlineText text={task.title} /></div>
                    <p className="mt-1 text-xs text-foreground/75"><InlineText text={task.deliverable} /></p>
                  </li>
                ))}
              </ul>
              <div className="grid gap-1.5 sm:grid-cols-2 text-[11px] text-muted-foreground">
                <div><span className="font-medium text-foreground/80">Corrección: </span><InlineText text={te.rubric_0_3.correctness} /></div>
                <div><span className="font-medium text-foreground/80">Robustez: </span><InlineText text={te.rubric_0_3.robustness} /></div>
                <div><span className="font-medium text-foreground/80">Mantenibilidad: </span><InlineText text={te.rubric_0_3.maintainability} /></div>
                <div><span className="font-medium text-foreground/80">Uso responsable: </span><InlineText text={te.rubric_0_3.responsible_use} /></div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
  const questions = section.selfCheck.questions
  // Answers hold AUTHORED option indexes; `orders` only decides where each option is drawn.
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  // Authored order on the first render, so the static HTML and hydration agree; shuffled after.
  const [orders, setOrders] = useState<number[][]>(() => authoredOrders(questions))

  useEffect(() => {
    setOrders(optionOrders(questions, mathRandomInt))
  }, [questions])

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }))
  }

  const handleSubmit = () => {
    const { pct } = gradeSelfCheck(questions, answers)
    onSubmitScore(pct)
    setSubmitted(true)
    if (pct >= SELF_CHECK_PASS_PCT) {
      onDone()
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setOrders(optionOrders(questions, mathRandomInt))
  }

  const { correct, total, pct } = gradeSelfCheck(questions, answers)
  // Below the pass mark only the score shows: no key, no right/wrong marks, no explanations.
  const reveal = submitted && revealsKey(pct)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-rose-600" />
        <h2 className="text-xl font-semibold">Autocheck — Verifica tu aprendizaje</h2>
      </div>
      <Callout type="info" title="¿Para qué este quiz?">
        Intentar recordar lo aprendido te ayuda a retenerlo mejor que volver a leerlo. Contesta sin mirar la teoría; las opciones cambian de orden en cada intento. Con 70% o más desbloqueas la siguiente sección y ves las respuestas correctas y sus explicaciones. Si no llegas, repasa y reintenta.
      </Callout>

      {questions.map((q, qIdx) => {
        const userAnswer = answers[qIdx]
        const isCorrect = userAnswer === q.correctIndex
        return (
          <Card key={qIdx} className="overflow-hidden" data-testid={`sc-q-${qIdx}`}>
            <div className="p-5">
              <div className="mb-3 flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs font-bold text-rose-600">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-medium text-foreground"><InlineText text={q.question} /></p>
              </div>
              <div className="space-y-2">
                {(orders[qIdx] ?? q.options.map((_, i) => i)).map((oIdx, shownAt) => {
                  const opt = q.options[oIdx]
                  const isSelected = userAnswer === oIdx
                  const showCorrect = reveal && oIdx === q.correctIndex
                  const showWrong = reveal && isSelected && oIdx !== q.correctIndex
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      data-testid={`sc-q-${qIdx}-opt-${oIdx}`}
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
                          String.fromCharCode(65 + shownAt)
                        )}
                      </span>
                      <span className="flex-1"><InlineText text={opt} /></span>
                    </button>
                  )
                })}
              </div>
              {reveal && (
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
          data-testid="sc-submit"
        >
          <CheckCircle2 className="h-4 w-4" />
          Enviar respuestas ({Object.keys(answers).length}/{total})
        </Button>
      ) : (
        <Card
          className={cn('p-5 text-center', reveal ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5')}
          data-testid="sc-result"
        >
          <div className="mb-2 flex justify-center">
            <div className="relative">
              <ProgressRing progress={pct} size={72} />
            </div>
          </div>
          <div className="text-lg font-bold">
            {reveal ? '¡Buenazo! Sección completada' : 'Casi, vuelve a intentarlo'}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {correct} de {total} correctas ({pct}%)
          </p>
          {!reveal && (
            <p className="mt-2 text-sm text-muted-foreground" data-testid="sc-below-pass">
              Verás las respuestas correctas y sus explicaciones cuando alcances el 70%; ahora repasa la teoría y el I Do de esta sección y reintenta.
            </p>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={handleRetry} className="gap-2">
              Reintentar
            </Button>
            {reveal && (
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
  const demo = PLAYGROUND_DEMOS[sectionId]
  if (!demo) return null

  return (
    <div className="space-y-3" data-testid={`demo-playground-${sectionId}`}>
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
        testId={`demo-run-${sectionId}`}
      />
    </div>
  )
}
