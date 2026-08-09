'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { MuchaHalo, DividerVine } from '@/components/ornaments/Ornaments'
import {
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Rocket,
  Users,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  Flame,
  Trophy,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Compass,
  Database,
  Brain,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressRing } from './ProgressRing'
import { useProgressStore } from '@/lib/progress-store'
import type { CourseSection, CourseMeta } from '@/lib/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import { IS_STATIC_SITE, siteAsset } from '@/lib/runtime-mode'
import { t, useI18n } from '@/lib/i18n'

interface DashboardProps {
  meta: CourseMeta
  sections: CourseSection[]
  onSelectSection: (id: string) => void
  onOpenAuth: (tab: 'login' | 'register') => void
}

/**
 * Dashboard — learner-facing landing page.
 *
 * Solarized copy principles (Stephen Fry redaction):
 *   - Every line answers a learner question: "What can I learn here?",
 *     "What should I do next?", "Where is my progress stored?", "What does a
 *     badge prove?", "What does it NOT prove?".
 *   - No developer meta language (phase, hardening, audit, pipeline, audit
 *     log). If a concept must appear, it is unpacked inline with "esto es, …".
 *   - No unsupported employment, salary, certification or mastery claims.
 *   - Role-aware: anonymous users see what creating an account enables;
 *     signed-in users see their cloud-synced status.
 *   - The static edition (GitHub Pages) shows the browser-only notice and
 *     keeps the create-account CTA visible only when the dynamic edition is
 *     available OR when Firebase client is configured.
 */
export function Dashboard({ meta, sections, onSelectSection, onOpenAuth }: DashboardProps) {
  const { completedSections, completedSubSteps, quizScores, lastVisited, startDate, setStartDate } = useProgressStore()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const lang = useI18n((state) => state.lang)
  const tr = (key: string) => t(key, lang)
  const english = lang === 'en'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Empty state during SSR and first client render to avoid hydration mismatch.
  const safeCompletedSections = mounted ? completedSections : []
  const safeCompletedSubSteps = mounted ? completedSubSteps : {}
  const safeQuizScores = mounted ? quizScores : {}
  const safeLastVisited = mounted ? lastVisited : null

  const totalSubSteps = sections.length * 5
  const doneSubSteps = sections.reduce(
    (acc, s) => acc + (safeCompletedSubSteps[s.id]?.length || 0),
    0
  )
  const overallProgress = Math.round((doneSubSteps / totalSubSteps) * 100)
  const completedCount = safeCompletedSections.length

  const nextSection = sections.find((s) => !safeCompletedSections.includes(s.id)) || sections[0]
  const isReturning = safeLastVisited !== null
  const isSignedIn = !!session?.user

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl gradient-mesh border border-border/60 p-6 sm:p-10"
      >
        {/* Mucha Halo background */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[500px] w-[500px] opacity-60 lg:block">
          <MuchaHalo className="h-full w-full" opacity={0.4} />
        </div>
        {/* Circuit-Vine — AI × Art Nouveau */}
        <div className="circuit-vine-bg pointer-events-none absolute inset-0" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={siteAsset('/logo.svg')}
              alt="PyArcana"
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl shadow-glow"
            />
            <Badge variant="outline" className="gap-1.5 border-gold bg-background/70 backdrop-blur shadow-[0_0_0_1px_rgba(201,162,39,0.35)]">
              <Sparkles className="h-3 w-3 text-gold" />
              {english ? 'PyArcana · 52 sections · Lessons in Peruvian Spanish' : 'PyArcana · 52 secciones · Español peruano'}
            </Badge>
          </div>
          <h1 className="font-display max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="gradient-text">{meta.title}</span>
          </h1>
          <p className="mt-1 max-w-xl text-xs uppercase tracking-[0.28em] text-gold/90 sm:text-sm" style={{ fontFamily: 'var(--font-subdisplay)' }}>
            {english ? 'The art of learning Python' : 'El arte de aprender Python'}
          </p>
          <p className="font-subdisplay mt-4 max-w-2xl text-xl text-foreground/80 sm:text-2xl" style={{ fontFamily: 'var(--font-subdisplay)' }}>
            {english ? 'From zero to data and responsible AI systems' : meta.subtitle}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {english
              ? 'A self-paced route with 52 sequential sections. The interface is available in English; lesson explanations and exercises remain authored in Peruvian Spanish.'
              : meta.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                setStartDate()
                onSelectSection(nextSection.id)
              }}
              className="gap-2 shadow-glow"
            >
              <Rocket className="h-4 w-4" />
              {isReturning ? tr('progress.continue') : tr('progress.start')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            {!isSignedIn && !IS_STATIC_SITE && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => onOpenAuth('register')}
                className="gap-2 border-gold"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                {tr('progress.createAccount')}
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {meta.totalHours}h {english ? 'estimated (provisional plan)' : 'estimadas (plan provisional)'} · {meta.totalSections} {english ? 'sections' : 'secciones'}
            </div>
          </div>

          {/* What can I learn here? */}
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <LearnCard
              icon={BookOpen}
              title={english ? 'Python, from scratch' : 'Python, desde cero'}
              body={
                english
                  ? 'Install, types, control flow, functions, modules, OOP, packaging.'
                  : 'Instalación, tipos, control de flujo, funciones, módulos, POO y empaquetado.'
              }
            />
            <LearnCard
              icon={Database}
              title={english ? 'Data analysis' : 'Análisis de datos'}
              body={
                english
                  ? 'NumPy, pandas, matplotlib, seaborn — acquire, clean, model, communicate.'
                  : 'NumPy, pandas, matplotlib, seaborn — adquirir, limpiar, modelar y comunicar.'
              }
            />
            <LearnCard
              icon={Brain}
              title={english ? 'Machine learning & responsible AI' : 'Machine learning e IA responsable'}
              body={
                english
                  ? 'scikit-learn, RAG, LLMs — and the questions to ask before shipping them.'
                  : 'scikit-learn, RAG, LLMs — y las preguntas que conviene hacerse antes de publicarlos.'
              }
            />
            <LearnCard
              icon={Wrench}
              title={english ? 'Engineering & automation' : 'Ingeniería y automatización'}
              body={
                english
                  ? 'Testing, FastAPI, RPA, orchestration — turn scripts into systems.'
                  : 'Testing, FastAPI, RPA, orquestación — de scripts a sistemas.'
              }
            />
            <LearnCard
              icon={ShieldCheck}
              title={english ? 'Security & responsible use' : 'Seguridad y uso responsable'}
              body={
                english
                  ? 'OWASP, NIST, privacy — risks you should recognise before exposing real users.'
                  : 'OWASP, NIST, privacidad — riesgos que conviene reconocer antes de exponer usuarios reales.'
              }
            />
            <LearnCard
              icon={Compass}
              title={english ? 'Practice & portfolio' : 'Práctica y portafolio'}
              body={
                english
                  ? 'Independent projects per section that you can carry to GitHub.'
                  : 'Proyectos independientes por sección que puedes llevar a tu GitHub.'
              }
            />
          </div>

          {/* Where is my progress stored? — role-aware notice */}
          {!isSignedIn ? (
            <div
              className="mt-6 max-w-2xl rounded-xl border border-gold/50 bg-background/75 px-4 py-3 text-xs text-foreground/80 backdrop-blur"
              data-testid="progress-storage-notice"
            >
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <div className="space-y-1">
                  <p>
                    <strong>{english ? 'Where is your progress stored?' : '¿Dónde se guarda tu progreso?'}</strong>{' '}
                    {english
                      ? 'Right now, only in this browser (localStorage — esto es, una base de datos interna del navegador que tú controlas).'
                      : 'Por ahora, solo en este navegador (localStorage — esto es, una base de datos interna del navegador que tú controlas).'}
                  </p>
                  <p>
                    {english
                      ? 'If you create an account, your progress also syncs to our servers so you can resume on another device. We do not sell or share your data.'
                      : 'Si creas una cuenta, tu progreso también se sincroniza con nuestros servidores para que puedas retomarlo en otro dispositivo. No vendemos ni compartimos tus datos.'}{' '}
                    <Link
                      href="/privacy"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {english ? 'Read the Privacy Notice' : 'Lee el Aviso de Privacidad'}
                    </Link>{' '}
                    ·{' '}
                    <Link
                      href="/cookies"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {english ? 'Local-storage notice' : 'Aviso de almacenamiento local'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="mt-6 max-w-2xl rounded-xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-xs text-foreground/80"
              data-testid="progress-storage-notice"
            >
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                <div className="space-y-1">
                  <p>
                    <strong>{english ? 'Signed in' : 'Sesión iniciada'}</strong>{' '}
                    {english
                      ? '— your progress is syncing to your cloud account, so it follows you across devices.'
                      : '— tu progreso se está sincronizando con tu cuenta en la nube, así te sigue entre dispositivos.'}
                  </p>
                  <p>
                    {english
                      ? 'Browser-local progress remains the fast first read; the cloud copy is the source of truth when you switch devices.'
                      : 'El progreso del navegador sigue siendo la lectura rápida inicial; la copia en la nube es la fuente de verdad cuando cambias de dispositivo.'}{' '}
                    <Link
                      href="/data-rights"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {english ? 'Manage your data' : 'Gestiona tus datos'}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Static-edition notice, in plain words */}
          {IS_STATIC_SITE && (
            <div
              className="mt-4 max-w-2xl rounded-xl border border-gold/50 bg-background/75 px-4 py-3 text-xs text-foreground/80 backdrop-blur"
              data-testid="static-site-notice"
            >
              <strong>Edición pública / Public edition:</strong>{' '}
              {english
                ? 'This page is a read-only snapshot hosted on GitHub Pages. Account creation and cloud sync are available when Firebase is configured; otherwise, your progress stays in this browser only.'
                : 'Esta página es una versión de solo lectura publicada en GitHub Pages. Crear cuenta y sincronizar en la nube están disponibles cuando Firebase está configurado; de lo contrario, tu progreso se queda únicamente en este navegador.'}
            </div>
          )}
        </div>
      </motion.section>

      {/* Stats row — what should I do next? */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={english ? 'Overall progress' : 'Progreso total'}
          value={`${overallProgress}%`}
          sublabel={english ? `${doneSubSteps} of ${totalSubSteps} steps` : `${doneSubSteps} de ${totalSubSteps} etapas`}
          color="violet"
          delay={0.05}
        />
        <StatCard
          icon={Trophy}
          label={english ? 'Sections completed' : 'Secciones completadas'}
          value={`${completedCount}/${sections.length}`}
          sublabel={
            completedCount > 0
              ? english ? 'Keep going' : 'Vas bien, sigue así'
              : english ? 'Nothing opened yet' : 'Aún no abres ninguna'
          }
          color="emerald"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label={english ? 'Quiz average' : 'Quiz promedio'}
          value={`${Math.round(
            Object.values(safeQuizScores).reduce((a, b) => a + b, 0) /
              Math.max(Object.keys(safeQuizScores).length, 1)
          )}%`}
          sublabel={
            english
              ? `${Object.keys(safeQuizScores).length} quizzes answered`
              : `${Object.keys(safeQuizScores).length} quizzes rendidos`
          }
          color="amber"
          delay={0.15}
        />
        <StatCard
          icon={Target}
          label={english ? 'Your learning path' : 'Tu ruta de aprendizaje'}
          value={english ? 'Step by step' : 'Avanza a tu ritmo'}
          sublabel={
            english
              ? 'Pick the next section; badges mark what you have practised.'
              : 'Sigue con la siguiente sección; los badges marcan lo que has practicado.'
          }
          color="sky"
          delay={0.2}
        />
      </div>

      {/* Continue learning — what should I do next? */}
      {isReturning && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <Card className="overflow-hidden border-primary/30">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {english ? 'CONTINUE WHERE YOU LEFT OFF' : 'CONTINÚA DONDE LO DEJASTE'}
                </div>
                <h3 className="mt-1 text-lg font-bold">{nextSection.title}</h3>
                <p className="text-sm text-muted-foreground">{nextSection.tagline}</p>
              </div>
              <Button onClick={() => onSelectSection(nextSection.id)} className="gap-2">
                {english ? 'Continue' : 'Continuar'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Badges — what they prove and what they don't */}
      <BadgeExplainer isSignedIn={isSignedIn} english={english} />

      {/* Curriculum grid */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{tr('course.curriculum')}</h2>
            <p className="text-sm text-muted-foreground">
              {english ? '52 sections · I Do / We Do / You Do · portfolio projects' : '52 secciones · método I Do / We Do / You Do · proyectos de portafolio'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, idx) => {
            const isCompleted = safeCompletedSections.includes(section.id)
            const subStepsDone = safeCompletedSubSteps[section.id] || []
            const sectionProgress = Math.round((subStepsDone.length / 5) * 100)
            const isNext = section.id === nextSection.id
            const Icon = (Icons as unknown as Record<string, React.ElementType>)[section.icon] || Icons.Circle

            return (
              <motion.button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                whileHover={{ y: -2 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all',
                  isCompleted ? 'border-green-500/30' : isNext ? 'border-primary/40 shadow-glow' : 'border-border hover:border-primary/30'
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md', section.accentColor)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isCompleted ? (
                    <Badge className="gap-1 bg-green-600 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      {english ? 'Done' : 'Hecho'}
                    </Badge>
                  ) : isNext ? (
                    <Badge variant="outline" className="gap-1 border-primary text-primary">
                      <Sparkles className="h-3 w-3" />
                      {english ? 'Next' : 'Siguiente'}
                    </Badge>
                  ) : null}
                </div>

                {/* Title */}
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    {english ? 'Section' : 'Sección'} {section.index}
                  </div>
                  <h3 className="text-base font-bold leading-tight">{section.shortTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{section.tagline}</p>
                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {section.estimatedHours}h
                    <span className="mx-1">·</span>
                    <span>{section.level}</span>
                  </div>
                  {sectionProgress > 0 && !isCompleted && (
                    <span className="text-xs font-semibold text-primary">{sectionProgress}%</span>
                  )}
                </div>

                {/* Progress bar */}
                {sectionProgress > 0 && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${sectionProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Methodology section */}
      <section className="mt-12">
        <Card className="overflow-hidden border-border/60">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary">
                <Sparkles className="h-3 w-3" />
                {english ? 'Pedagogy' : 'Pedagogía'}
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">
                {english ? 'Method ' : 'Método '}<span className="gradient-text">I Do / We Do / You Do</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {english
                  ? 'Gradual release of responsibility: first observe a complete process, then practise with support, and finally transfer the skill independently. Lesson content remains in Peruvian Spanish.'
                  : 'Liberación gradual de responsabilidad: primero observas un proceso completo, luego practicas con apoyo y finalmente transfieres lo aprendido. Cada sección conserva las mismas cuatro fases para que sepas qué evidencia producir.'}
              </p>

              <div className="mt-5 space-y-3">
                <MethodStep
                  icon={PlayCircle}
                  color="violet"
                  step="I Do"
                  title={english ? 'I do — Demonstration' : 'Yo hago — Demostración'}
                  desc={
                    english
                      ? 'I walk you through a real problem step by step, explaining the why of each line.'
                      : 'Te muestro paso a paso cómo se resuelve un problema real, explicando el porqué de cada línea.'
                  }
                />
                <MethodStep
                  icon={Users}
                  color="amber"
                  step="We Do"
                  title={english ? 'We do together — Guided practice' : 'Hacemos juntos — Práctica guiada'}
                  desc={
                    english
                      ? 'You write code with my guidance. Starter code, hints and solution so you can compare.'
                      : 'Escribes código con mi guía. Te doy starter code, hints y solución para que compares.'
                  }
                />
                <MethodStep
                  icon={Rocket}
                  color="emerald"
                  step="You Do"
                  title={english ? 'You do — Portfolio project' : 'Tú haces — Proyecto de portafolio'}
                  desc={
                    english
                      ? 'You build a small project that goes straight to your GitHub. That is what you can show in interviews.'
                      : 'Construyes un mini-proyecto que va directo a tu GitHub. Esto es lo que puedes mostrar en entrevistas.'
                  }
                />
                <MethodStep
                  icon={HelpCircle}
                  color="rose"
                  step="Autocheck"
                  title={english ? 'Quiz with immediate feedback' : 'Quiz con feedback inmediato'}
                  desc={
                    english
                      ? 'Active recall to fix the memory. You need 70% to unlock the next section.'
                      : 'Active recall para fijar la memoria. Necesitas 70% para desbloquear la siguiente sección.'
                  }
                />
              </div>
            </div>

            <div className="border-t bg-muted/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {tr('course.whyDifferent')}
              </h3>
              <div className="mt-4 space-y-4">
                <Feature
                  icon={Target}
                  title={english ? 'Cases set in Peru' : 'Casos situados en Perú'}
                  desc={
                    english
                      ? 'You practise with synthetic work scenarios and data; we never use real personal information, and we make no employment promises.'
                      : 'Practicas con escenarios sintéticos de trabajo y datos; no usamos información personal real ni prometemos resultados laborales.'
                  }
                />
                <Feature
                  icon={Award}
                  title={english ? 'Projects with verifiable evidence' : 'Proyectos con evidencia verificable'}
                  desc={
                    english
                      ? 'Each deliverable asks for code, tests, decisions and limits so you can explain what you built and how you validated it.'
                      : 'Cada entrega pide código, pruebas, decisiones y límites para que puedas explicar qué construiste y cómo lo validaste.'
                  }
                />
                <Feature
                  icon={BookOpen}
                  title={english ? 'Traceable, progressive route' : 'Ruta trazable y progresiva'}
                  desc={
                    english
                      ? 'Concepts move from fundamentals to data systems and AI, with official documentation linked in each section.'
                      : 'Los conceptos avanzan desde fundamentos hasta sistemas de datos e IA, con documentación oficial enlazada en cada sección.'
                  }
                />
                <Feature
                  icon={TrendingUp}
                  title={english ? 'Self-paced learning' : 'Aprendizaje autoguiado'}
                  desc={
                    english
                      ? 'You advance at your own pace and can ask for external review when you need it. In the public edition, progress is stored only in your browser.'
                      : 'Avanzas a tu ritmo y puedes pedir revisión externa cuando la necesites. En la edición pública, el progreso se guarda solo en tu navegador.'
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Optional external routes — no employment guarantee */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">{english ? 'Optional external routes' : 'Rutas externas opcionales'}</h2>
        <p className="text-sm text-muted-foreground">
          {english
            ? 'Use them only when they fit your goal and experience. No credential guarantees employment; always verify requirements, current status, and cost on the official page before paying. See our '
            : 'Úsalas solo si encajan con tu objetivo y experiencia. Ninguna credencial garantiza empleo; revisa siempre requisitos, vigencia y costo en la página oficial antes de pagar. Lee nuestro '}
          <Link href="/disclaimer" className="font-medium text-foreground underline-offset-2 hover:underline">
            {english ? 'Educational and Career Disclaimer' : 'Aviso educativo y laboral'}
          </Link>{' '}
          {english ? 'and ' : 'y '}
          <Link href="/badge-notice" className="font-medium text-foreground underline-offset-2 hover:underline">
            {english ? 'Badge Notice' : 'Aviso de badges'}
          </Link>.
        </p>

        {/* Introductory learning routes */}
        <h3 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">
          {english ? 'Introductory and practice' : 'Introductorias y de práctica'}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              name: english ? 'CS50P · Harvard' : 'CS50P · Harvard',
              desc: english
                ? 'Open Python course with problem sets, a final project, and a free CS50 certificate when you meet its requirements.'
                : 'Curso abierto de Python con problem sets, proyecto final y certificado CS50 gratuito al cumplir sus requisitos.',
              url: 'https://cs50.harvard.edu/python',
            },
            {
              name: english ? 'Google IT Automation with Python' : 'Google IT Automation with Python',
              desc: english
                ? 'Route for people with IT fundamentals: Python, Git, debugging, automation and configuration. The certificate track may have a cost.'
                : 'Ruta para personas con fundamentos de TI: Python, Git, debugging, automatización y configuración. La modalidad con certificado puede tener costo.',
              url: 'https://grow.google/certificates/it-automation-python/',
            },
            {
              name: 'Kaggle Learn',
              desc: english
                ? 'Short lessons and guided practice to complement specific data and machine-learning topics.'
                : 'Lecciones breves y práctica guiada para complementar temas concretos de datos y machine learning.',
              url: 'https://www.kaggle.com/learn',
            },
          ].map((c, i) => (
            <Card key={i} className="p-5">
              <Award className="h-6 w-6 text-primary" />
              <h4 className="mt-2 font-semibold">{c.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {english ? 'Open' : 'Abrir'} <ArrowRight className="h-3 w-3" />
              </a>
            </Card>
          ))}
        </div>

        {/* Advanced cloud credentials — clearly optional, no employment claim */}
        <h3 className="mt-8 mb-3 text-sm font-semibold text-muted-foreground">
          {english ? 'Advanced cloud credentials' : 'Credenciales cloud avanzadas'}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              name: 'AWS Machine Learning Engineer – Associate',
              desc: english
                ? 'Assesses implementation and operation of ML workloads on AWS. The vendor recommends prior hands-on experience with its services.'
                : 'Evalúa implementación y operación de cargas de ML en AWS. El proveedor recomienda experiencia práctica previa con sus servicios.',
              url: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/',
            },
            {
              name: 'Google Cloud Professional Machine Learning Engineer',
              desc: english
                ? 'Assesses design, build and operation of ML solutions on Google Cloud; recommended experience is advanced.'
                : 'Evalúa diseño, construcción y operación de soluciones ML en Google Cloud; la experiencia recomendada es avanzada.',
              url: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
            },
            {
              name: 'Microsoft Azure AI Apps and Agents Developer Associate',
              desc: english
                ? 'AI-103 credential on AI solutions and agents with Python and Microsoft Foundry. It replaces the retired AI-102 on this list.'
                : 'Credencial AI-103 sobre soluciones de IA y agentes con Python y Microsoft Foundry. Sustituye en esta lista al retirado AI-102.',
              url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-apps-and-agents-developer-associate/',
            },
          ].map((c, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <h4 className="mt-2 font-semibold">{c.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {english ? 'Open' : 'Abrir'} <ArrowRight className="h-3 w-3" />
              </a>
            </Card>
          ))}
        </div>

        {/* Legal footer summary */}
        <div
          className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground"
          data-testid="legal-links"
        >
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
            <span>
              {english
                ? 'Badges show what you practised. Verified credentials show what you demonstrated. See:'
                : 'Los badges muestran lo que practicaste. Las credenciales verificadas muestran lo que demostraste. Lee:'}
            </span>
            <Link href="/credential-policy" className="font-medium text-foreground underline-offset-2 hover:underline">Política de credenciales</Link>·
            <Link href="/privacy" className="font-medium text-foreground underline-offset-2 hover:underline">Privacidad</Link>·
            <Link href="/terms" className="font-medium text-foreground underline-offset-2 hover:underline">Términos</Link>·
            <Link href="/cookies" className="font-medium text-foreground underline-offset-2 hover:underline">Cookies</Link>·
            <Link href="/disclaimer" className="font-medium text-foreground underline-offset-2 hover:underline">Aviso educativo</Link>·
            <Link href="/badge-notice" className="font-medium text-foreground underline-offset-2 hover:underline">Aviso de badges</Link>·
            <Link href="/external-resources" className="font-medium text-foreground underline-offset-2 hover:underline">Recursos externos</Link>·
            <Link href="/acceptable-use" className="font-medium text-foreground underline-offset-2 hover:underline">Uso aceptable</Link>·
            <Link href="/data-rights" className="font-medium text-foreground underline-offset-2 hover:underline">Derechos ARCO</Link>·
            <Link href="/security" className="font-medium text-foreground underline-offset-2 hover:underline">Seguridad</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

/**
 * Badge explainer — answers the two learner questions:
 *   "What does a badge prove?" / "What does it NOT prove?"
 */
function BadgeExplainer({ isSignedIn, english }: { isSignedIn: boolean; english: boolean }) {
  return (
    <section className="mt-10" aria-labelledby="badge-explainer-title">
      <Card className="overflow-hidden border-gold/30 bg-gradient-to-br from-amber-500/5 to-transparent">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gold" />
            <h2 id="badge-explainer-title" className="text-xl font-bold tracking-tight">
              {english ? 'About badges' : 'Sobre los badges'}
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {english
              ? 'A badge is a small marker that you completed an exercise or section independently. This is, it confirms you practised a specific skill — it is not a professional certification.'
              : 'Un badge es un pequeño marcador de que completaste un ejercicio o sección de forma independiente. Esto es, confirma que practicaste una habilidad concreta — no es una certificación profesional.'}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                {english ? 'What a badge proves' : 'Lo que un badge sí prueba'}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                <li>
                  {english
                    ? 'You completed an exercise or section under your own effort.'
                    : 'Completaste un ejercicio o sección con tu propio esfuerzo.'}
                </li>
                <li>
                  {english
                    ? 'You produced the requested evidence (code, tests, decisions, limits).'
                    : 'Produciste la evidencia pedida (código, pruebas, decisiones, límites).'}
                </li>
                <li>
                  {english
                    ? 'You met the rubric threshold (70% or higher).'
                    : 'Alcanzaste el umbral de la rúbrica (70% o más).'}
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                <HelpCircle className="h-4 w-4" />
                {english ? 'Credential boundaries' : 'Límites de la credencial'}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {english
                  ? 'Badges and verified credentials describe evidence demonstrated within the course. They do not constitute accredited professional certification or guarantee employment. See the '
                  : 'Los badges y credenciales verificadas describen evidencia demostrada dentro del curso. No constituyen certificación profesional acreditada ni garantizan empleo. Consulta la '}
                <Link href="/credential-policy" className="font-medium text-foreground underline-offset-2 hover:underline">
                  {english ? 'credential policy' : 'política de credenciales'}
                </Link>
                {english ? ' for details.' : ' para más detalles.'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <strong className="text-foreground">
                  {english ? 'Local preview' : 'Vista previa local'}
                </strong>
              </div>
              <p className="mt-1">
                {english
                  ? 'When you finish an exercise without an account, the badge is a local preview stored only in this browser. Nobody else can see or verify it.'
                  : 'Cuando terminas un ejercicio sin cuenta, el badge es una vista previa local guardada solo en este navegador. Nadie más puede verlo ni verificarlo.'}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                <strong className="text-foreground">
                  {english ? 'Verified award' : 'Insignia verificada'}
                </strong>
              </div>
              <p className="mt-1">
                {isSignedIn
                  ? english
                    ? 'When you are signed in, a supervisor in your cohort can verify a badge. The verification step is what turns a preview into a verified award.'
                    : 'Cuando tienes sesión iniciada, un supervisor de tu cohorte puede verificar un badge. La verificación es lo que convierte una vista previa en una insignia verificada.'
                  : english
                    ? 'Sign in to invite a supervisor to verify your badges. Verification is what turns a preview into a verified award.'
                    : 'Inicia sesión para invitar a un supervisor a verificar tus badges. La verificación es lo que convierte una vista previa en una insignia verificada.'}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/80">
            {english
              ? 'See the full '
              : 'Lee el '}
            <Link href="/badge-notice" className="font-medium text-foreground underline-offset-2 hover:underline">
              {english ? 'Badge and Credential Notice' : 'Aviso de badges y credenciales'}
            </Link>{' '}
            {english
              ? 'for criteria, limitations and revocation policy.'
              : 'para criterios, limitaciones y política de revocación.'}
          </p>
        </div>
      </Card>
    </section>
  )
}

function LearnCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType
  title: string
  body: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs font-semibold text-foreground">{title}</div>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  sublabel: string
  color: 'violet' | 'emerald' | 'amber' | 'sky'
  delay: number
}) {
  const colorMap = {
    violet: 'from-violet-500/10 to-violet-500/5 text-violet-600',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
    sky: 'from-sky-500/10 to-sky-500/5 text-sky-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={cn('bg-gradient-to-br p-5', colorMap[color])}>
        <Icon className="h-5 w-5" />
        <div className="mt-3 text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium text-foreground/70">{label}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>
      </Card>
    </motion.div>
  )
}

function MethodStep({
  icon: Icon,
  color,
  step,
  title,
  desc,
}: {
  icon: React.ElementType
  color: 'violet' | 'amber' | 'emerald' | 'rose'
  step: string
  title: string
  desc: string
}) {
  const colorMap = {
    violet: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  }
  return (
    <div className="flex gap-3">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', colorMap[color])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{step}</div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
