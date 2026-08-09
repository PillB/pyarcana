'use client'

/**
 * CapstonesPage — learner-facing capstone experience for PyArcana.
 *
 * Renders the canonical 13-capstone catalog (4 levels × 3 + 1 final) using
 * the descriptors from `src/lib/capstones/catalog.ts`.
 *
 * Design constraints (see ADR-level-language.md and Task 7 spec):
 *  - Uses ONLY curricular proficiency language (no senior/master/experto/
 *    job-ready/listo para aplicar wording).
 *  - Honest evidence status: every capstone shows "Evidencia requerida" and
 *    "Sin registrar" until evidence is actually registered. We NEVER claim
 *    "Aprobado" for all by default.
 *  - No internal audit/agent/ledger/pipeline terminology — uses "proyecto",
 *    "evaluación", "evidencia", "nivel" instead.
 *  - Theme-token only styling (bg-background, bg-card, border-border, etc.)
 *    so light/dark mode both work — NO hardcoded blue/indigo.
 *  - Fully keyboard-navigable and mobile-responsive.
 */

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers,
  ListChecks,
  Lock,
  Map,
  ShieldAlert,
  Target,
  Wrench,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { siteAsset } from '@/lib/runtime-mode'
import { useI18n, t } from '@/lib/i18n'
import {
  CAPSTONES,
  GATE_MAP,
  LEVELS,
  getCapstonesByLevel,
  getFinalCapstone,
  type CapstoneDescriptor,
  type LevelDescriptor,
} from '@/lib/capstones/catalog'

interface CapstonesPageProps {
  /** Open a course section by its stable id (e.g. "S04"). */
  onOpenSection: (sectionId: string) => void
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function useTr() {
  const lang = useI18n((s) => s.lang)
  return (key: string) => t(key, lang)
}

/** Stable accent class per level — uses theme tokens, NOT hardcoded colors. */
const LEVEL_ACCENT: Record<
  number,
  { ring: string; chip: string; dot: string }
> = {
  1: {
    ring: 'border-l-4 border-l-emerald-500/70',
    chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  2: {
    ring: 'border-l-4 border-l-amber-500/70',
    chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  3: {
    ring: 'border-l-4 border-l-rose-500/70',
    chip: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  4: {
    ring: 'border-l-4 border-l-violet-500/70',
    chip: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
}

function SectionChip({ section }: { section: string }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-foreground/80 transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      tabIndex={-1}
      aria-hidden="true"
    >
      {section}
    </button>
  )
}

function SectionLink({
  section,
  onOpenSection,
  label,
}: {
  section: string
  onOpenSection: (s: string) => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenSection(section)}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${label ?? 'Abrir sección'} ${section}`}
    >
      {section}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </button>
  )
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  )
}

function StringList({ items, emptyHint }: { items: string[]; emptyHint?: string }) {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground italic">{emptyHint ?? '—'}</span>
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li
          key={s}
          className="inline-flex items-center rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80"
        >
          {s}
        </li>
      ))}
    </ul>
  )
}

function CriticalList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="space-y-1">
      {items.map((s, i) => (
        <li
          key={i}
          className="flex items-start gap-1.5 text-xs text-foreground/85"
        >
          <span
            className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"
            aria-hidden="true"
          />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Capstone card
// ────────────────────────────────────────────────────────────────────────────

function CapstoneCard({
  cap,
  onOpenSection,
  onShowPath,
  accent,
}: {
  cap: CapstoneDescriptor
  onOpenSection: (s: string) => void
  onShowPath: (kind: 'rubric' | 'brief', cap: CapstoneDescriptor) => void
  accent: { ring: string; chip: string; dot: string }
}) {
  const tr = useTr()
  const hasSubGates = cap.subGates && cap.subGates.length > 0

  return (
    <Card
      className={cn(
        'h-full gap-4 py-5 focus-within:ring-2 focus-within:ring-ring',
        accent.ring,
      )}
    >
      <CardHeader className="gap-2 px-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="gap-1 font-mono"
            aria-label={`${tr('capstones.level')} ${cap.level}`}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', accent.dot)} aria-hidden="true" />
            {cap.id}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            v{cap.version}
          </Badge>
          <Badge
            variant="outline"
            className={cn('ml-auto gap-1 border-amber-500/30', accent.chip)}
            title={tr('capstones.badge')}
          >
            <Award className="h-3 w-3" aria-hidden="true" />
            {cap.badgeId}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug sm:text-lg">
          {cap.name}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {cap.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-5">
        {/* Honest evidence status — never claims "Aprobado" by default */}
        <div
          className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-2.5 py-1.5"
          role="status"
          aria-live="polite"
        >
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
          >
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {tr('capstones.evidenceRequired')}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {tr('capstones.notRegistered')}
          </span>
        </div>

        {/* Gate section + intended user */}
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">{tr('capstones.gate')}:</span>
            <SectionLink section={cap.gateSection} onOpenSection={onOpenSection} label={tr('capstones.gate')} />
          </div>
          <div className="flex items-start gap-1.5">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-foreground/85">{cap.intendedUser}</span>
          </div>
        </div>

        {/* Sub-gates for CP-N4-C */}
        {hasSubGates && (
          <div className="rounded-md border border-border bg-background/60 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              {tr('capstones.subGates')}
            </div>
            <ul className="space-y-2">
              {cap.subGates!.map((sg) => (
                <li key={sg.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {sg.id}
                    </Badge>
                    <SectionLink section={sg.section} onOpenSection={onOpenSection} />
                  </div>
                  <div className="text-xs font-medium text-foreground/90">{sg.title}</div>
                  <div className="text-[11px] leading-snug text-muted-foreground">{sg.focus}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable details */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-0">
            <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
              <span className="flex items-center gap-1.5">
                <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                Detalles del proyecto
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-1 text-sm">
              <DetailRow icon={BookOpen} label={tr('capstones.prerequisites')}>
                <StringList items={cap.prerequisites} />
              </DetailRow>
              <DetailRow icon={Boxes} label={tr('capstones.contributing')}>
                <StringList items={cap.contributingSections} />
              </DetailRow>
              <DetailRow icon={ClipboardList} label={tr('capstones.dependencies')}>
                {cap.dependencies.length > 0 ? (
                  <StringList items={cap.dependencies} />
                ) : (
                  <span className="text-muted-foreground italic">
                    Sin proyectos previos requeridos.
                  </span>
                )}
              </DetailRow>
              <DetailRow icon={ShieldAlert} label={tr('capstones.criticalFailures')}>
                <CriticalList items={cap.criticalFailures} />
              </DetailRow>
              <DetailRow icon={Wrench} label={tr('capstones.interface')}>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground/90">
                  {cap.finalIntegrationInterface}
                </code>
              </DetailRow>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 px-5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => onShowPath('rubric', cap)}
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {tr('capstones.viewRubric')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => onShowPath('brief', cap)}
        >
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          {tr('capstones.viewBrief')}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Final capstone card (prominent)
// ────────────────────────────────────────────────────────────────────────────

function FinalCapstoneCard({
  cap,
  onOpenSection,
  onShowPath,
}: {
  cap: CapstoneDescriptor
  onOpenSection: (s: string) => void
  onShowPath: (kind: 'rubric' | 'brief', cap: CapstoneDescriptor) => void
}) {
  const tr = useTr()
  return (
    <Card className="border-2 border-primary/30 bg-primary/5 py-6 focus-within:ring-2 focus-within:ring-ring">
      <CardHeader className="gap-3 px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="default"
            className="gap-1 font-mono"
          >
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            {tr('capstones.final')}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {cap.id}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            v{cap.version}
          </Badge>
          <Badge variant="outline" className="ml-auto gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300">
            <Award className="h-3 w-3" aria-hidden="true" />
            {cap.badgeId}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug sm:text-xl">
          {cap.name}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed sm:text-base">
          {cap.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6">
        {/* Integration note — 12 upstream capstones */}
        <div className="rounded-md border border-primary/30 bg-background/70 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
            {tr('capstones.finalDeps')}
          </div>
          <p className="mb-2 text-xs text-muted-foreground">
            {tr('capstones.finalDepsDesc')}
          </p>
          <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
            {cap.dependencies.map((dep) => (
              <li
                key={dep}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground/85"
              >
                {dep}
              </li>
            ))}
          </ul>
        </div>

        {/* Honest evidence status */}
        <div
          className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2"
          role="status"
          aria-live="polite"
        >
          <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {tr('capstones.evidenceRequired')}
          </Badge>
          <span className="text-xs text-muted-foreground">{tr('capstones.notRegistered')}</span>
        </div>

        {/* Gate + interface */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">{tr('capstones.gate')}:</span>
            <SectionLink section={cap.gateSection} onOpenSection={onOpenSection} label={tr('capstones.gate')} />
          </div>
          <div className="flex items-start gap-1.5 text-xs">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-foreground/85">{cap.intendedUser}</span>
          </div>
        </div>

        <DetailRow icon={Wrench} label={tr('capstones.interface')}>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground/90">
            {cap.finalIntegrationInterface}
          </code>
        </DetailRow>

        <DetailRow icon={ShieldAlert} label={tr('capstones.criticalFailures')}>
          <CriticalList items={cap.criticalFailures} />
        </DetailRow>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 px-6 pt-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs"
          onClick={() => onShowPath('rubric', cap)}
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {tr('capstones.viewRubric')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs"
          onClick={() => onShowPath('brief', cap)}
        >
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          {tr('capstones.viewBrief')}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Level section
// ────────────────────────────────────────────────────────────────────────────

function LevelSection({
  level,
  capstones,
  onOpenSection,
  onShowPath,
}: {
  level: LevelDescriptor
  capstones: CapstoneDescriptor[]
  onOpenSection: (s: string) => void
  onShowPath: (kind: 'rubric' | 'brief', cap: CapstoneDescriptor) => void
}) {
  const tr = useTr()
  const accent = LEVEL_ACCENT[level.id]
  return (
    <section
      aria-labelledby={`level-${level.stableId}-heading`}
      className="scroll-mt-24"
    >
      <Card className={cn('gap-4 py-5', accent.ring)}>
        <CardHeader className="gap-2 px-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2
              id={`level-${level.stableId}-heading`}
              className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
            >
              <span className="mr-2 font-mono text-sm text-muted-foreground">
                {level.stableId}
              </span>
              {tr(`capstones.levelName.${level.stableId}`)}
            </h2>
            <Badge variant="outline" className={cn('gap-1', accent.chip)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', accent.dot)} aria-hidden="true" />
              {level.band}
            </Badge>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Target className="h-3.5 w-3.5" aria-hidden="true" />
                {tr('capstones.exitCapability')}
              </div>
              <p className="text-foreground/90">{level.exitCapability}</p>
            </div>
            <div className="rounded-md border border-dashed border-border bg-background/60 px-3 py-2">
              <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                {tr('capstones.doesNotEstablish')}
              </div>
              <p className="text-xs text-muted-foreground">{level.doesNotEstablish}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium">Secciones:</span>
            <span className="font-mono">{level.sections}</span>
            <Separator orientation="vertical" className="mx-1 h-3" />
            <span className="font-medium">Evaluaciones:</span>
            <ul className="flex flex-wrap gap-1">
              {level.gates.map((g) => (
                <li key={g}>
                  <SectionChip section={g} />
                </li>
              ))}
            </ul>
          </div>
        </CardHeader>
        <CardContent className="px-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capstones.map((cap) => (
              <CapstoneCard
                key={cap.id}
                cap={cap}
                onOpenSection={onOpenSection}
                onShowPath={onShowPath}
                accent={accent}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Gates map
// ────────────────────────────────────────────────────────────────────────────

function GatesMap({ onOpenSection }: { onOpenSection: (s: string) => void }) {
  const tr = useTr()
  const entries = useMemo(() => Object.entries(GATE_MAP), [])
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="gap-1 px-5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="h-4 w-4 text-primary" aria-hidden="true" />
          {tr('capstones.gatesTitle')}
        </CardTitle>
        <CardDescription className="text-xs">{tr('capstones.gatesDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <ul className="flex flex-wrap gap-1.5">
          {entries.map(([section, capId]) => (
            <li
              key={section}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1 text-[11px]"
            >
              <SectionLink
                section={section}
                onOpenSection={onOpenSection}
                label={tr('capstones.gate')}
              />
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <span className="font-mono text-foreground/80">{capId}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Rubric / brief dialog
// ────────────────────────────────────────────────────────────────────────────

interface PathDialogState {
  open: boolean
  kind: 'rubric' | 'brief' | null
  cap: CapstoneDescriptor | null
}

function PathDialog({
  state,
  onClose,
}: {
  state: PathDialogState
  onClose: () => void
}) {
  const tr = useTr()
  const { kind, cap } = state
  const title = kind === 'rubric' ? tr('capstones.viewRubric') : tr('capstones.viewBrief')
  const capId = cap?.id || ''
  const fileName = kind === 'rubric' ? `${capId}_RUBRIC.json` : `${capId}_BRIEF.md`
  const fetchUrl = siteAsset(`/capstones/${fileName}`)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!state.open || !capId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(null)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then(text => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContent(text)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
      })
      .catch(err => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(err.message)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false)
      })
  }, [state.open, capId, kind, fetchUrl])
  return (
    <Dialog open={state.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {kind === 'rubric' ? (
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            ) : (
              <FlaskConical className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            {title}
            {cap && (
              <span className="ml-1 font-mono text-xs text-muted-foreground">{cap.id}</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {cap?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            {kind === 'rubric'
              ? 'La rúbrica de evaluación define los criterios y los bloqueantes críticos de este proyecto.'
              : 'El brief describe el alcance, los entregables y el escenario del proyecto.'}
          </p>
          {loading && (
            <p className="text-muted-foreground">Cargando…</p>
          )}
          {error && (
            <p className="text-rose-600 dark:text-rose-400">No se pudo cargar: {error}</p>
          )}
          {content && (
            <pre className="max-h-80 overflow-y-auto rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/90">
              {content}
            </pre>
          )}
          <p className="text-xs text-muted-foreground">
            Estado de evidencia: <span className="font-medium text-foreground/80">{tr('capstones.notRegistered')}</span>. La rúbrica y el brief definen qué se espera; no constituyen por sí mismos una aprobación.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────

export function CapstonesPage({ onOpenSection }: CapstonesPageProps) {
  const tr = useTr()
  const [pathDialog, setPathDialog] = useState<PathDialogState>({
    open: false,
    kind: null,
    cap: null,
  })

  const finalCap = useMemo(() => getFinalCapstone(), [])
  const levelsWithCapstones = useMemo(
    () => LEVELS.map((lvl) => ({ level: lvl, capstones: getCapstonesByLevel(lvl.id) })),
    [],
  )

  const handleShowPath = (kind: 'rubric' | 'brief', cap: CapstoneDescriptor) => {
    setPathDialog({ open: true, kind, cap })
  }

  return (
    <div
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
      data-testid="capstones-page"
    >
      {/* Page header */}
      <header className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
          {CAPSTONES.length} proyectos · {LEVELS.length} niveles + 1 final
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">{tr('capstones.title')}</span>
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
          {tr('capstones.subtitle')}
        </p>
      </header>

      {/* Required qualification block — visible to all learners */}
      <aside
        className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4"
        role="note"
        aria-label="Calificación de niveles curriculares"
      >
        <div className="flex items-start gap-2.5">
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-foreground/90">
            {tr('capstones.disclaimer')}
          </p>
        </div>
      </aside>

      {/* Gates map */}
      <div className="mb-8">
        <GatesMap onOpenSection={onOpenSection} />
      </div>

      {/* Level sections */}
      <div className="space-y-8">
        {levelsWithCapstones.map(({ level, capstones }) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.25 }}
          >
            <LevelSection
              level={level}
              capstones={capstones}
              onOpenSection={onOpenSection}
              onShowPath={handleShowPath}
            />
          </motion.div>
        ))}
      </div>

      {/* Final capstone */}
      <section
        aria-labelledby="final-capstone-heading"
        className="mt-12 scroll-mt-24"
      >
        <div className="mb-3 flex items-center gap-2">
          <h2
            id="final-capstone-heading"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            {tr('capstones.final')}
          </h2>
          <Badge variant="outline" className="font-mono text-[10px]">
            CP-FINAL
          </Badge>
        </div>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          {tr('capstones.finalNote')}
        </p>
        <FinalCapstoneCard
          cap={finalCap}
          onOpenSection={onOpenSection}
          onShowPath={handleShowPath}
        />
      </section>

      <PathDialog
        state={pathDialog}
        onClose={() => setPathDialog({ open: false, kind: null, cap: null })}
      />
    </div>
  )
}
