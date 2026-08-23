'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Play, ChevronRight, Eye } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

/**
 * The I Do demo, revealed at the learner's pace.
 *
 * Why this exists, precisely: every I Do preamble already tells the learner to
 * predict the output ("**Predicción:**", eight per section, pinned by tests) —
 * but the code *and its output* are both on screen the moment the tab opens, so
 * the instruction asks them to predict something already visible. Stepping the
 * reveal is what makes that existing instruction honest. The animation is a
 * side effect, not the point.
 *
 * The hard constraint: scripts/code_rendering.spec.ts asserts, for every code
 * block in every tab including this one, that the rendered textContent is
 * byte-identical to `data-code-source`. So nothing here truncates the code.
 * Unrevealed lines keep their text and are hidden with `visibility`, which also
 * preserves their height — the block never reflows as lines appear. The line
 * currently arriving is swept with a clip-path, which looks like typing while
 * the text underneath is complete the whole time.
 *
 * The same rule covers the output: it stays in the DOM with its full text so
 * the fidelity gate still checks it, and is blurred until the learner asks for
 * it rather than being withheld from the accessibility tree.
 */

/** Remembered separately from progress — `python-ds-progress` is not ours to touch. */
const PREF_KEY = 'pyarcana:idoReveal'

type Pref = 'stepped' | 'all'

/**
 * The preference is read through useSyncExternalStore rather than an effect.
 *
 * That gives two things at once. React supports the server and client snapshots
 * differing here, so there is no setState-in-effect and no hydration mismatch.
 * And because the *server* snapshot is 'all', a reader with JavaScript disabled
 * gets the complete demo instead of a code block masked by a stepper that can
 * never run.
 */
const prefListeners = new Set<() => void>()

function subscribePref(cb: () => void) {
  prefListeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    prefListeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

function getPrefSnapshot(): Pref {
  try {
    return localStorage.getItem(PREF_KEY) === 'all' ? 'all' : 'stepped'
  } catch {
    return 'stepped'
  }
}

/** No JS, no stepper — so show the whole demo. */
const getPrefServerSnapshot = (): Pref => 'all'

function writePref(p: Pref) {
  try {
    localStorage.setItem(PREF_KEY, p)
  } catch {
    /* private mode: the preference simply does not persist */
  }
  prefListeners.forEach((cb) => cb())
}

/**
 * Split a demo into the chunks a person would actually type in one go.
 *
 * Blank lines are the author's own paragraphing and 95 % of demos have them, so
 * they are the primary boundary. Long runs get sub-divided, and a demo written
 * without blank lines falls back to fixed groups, so every demo segments.
 */
export function segmentCode(code: string, maxLines = 5): number[] {
  const lines = code.split('\n')
  const ends: number[] = []
  let start = 0
  lines.forEach((line, i) => {
    const isBlank = line.trim() === ''
    const isLast = i === lines.length - 1
    if ((isBlank && i > start) || isLast || i - start + 1 >= maxLines) {
      ends.push(i)
      start = i + 1
    }
  })
  // collapse a trailing 1-line remainder into the previous chunk
  if (ends.length > 1 && ends[ends.length - 1] - ends[ends.length - 2] === 1) {
    ends.splice(ends.length - 2, 1)
  }
  return ends
}

export function SteppedCode({
  code,
  language = 'python',
  title,
  output,
  demoId,
}: {
  code: string
  language?: string
  title?: string
  output?: string
  demoId?: string
}) {
  const reduced = useReducedMotion()
  const pref = useSyncExternalStore(subscribePref, getPrefSnapshot, getPrefServerSnapshot)
  const normalized = code.trim()
  const segments = useMemo(() => segmentCode(normalized), [normalized])
  const totalLines = normalized.split('\n').length

  // Start with the first chunk already written: an empty block teaches nothing,
  // and the prediction only becomes possible once there is something to read.
  const [segment, setSegment] = useState(1)
  const [ran, setRan] = useState(false)

  const showAll = pref === 'all'
  const visibleLines = showAll ? totalLines : (segments[segment - 1] ?? -1) + 1
  const done = showAll || segment >= segments.length
  const outputVisible = showAll || (done && ran)

  const advance = () => setSegment((s) => Math.min(s + 1, segments.length))
  const revealEverything = () => {
    setSegment(segments.length)
    setRan(true)
  }
  const persist = (p: Pref) => {
    writePref(p)
    if (p === 'stepped') {
      setSegment(1)
      setRan(false)
    }
  }

  return (
    <div data-testid="stepped-code" data-demo-id={demoId}>
      <CodeBlock
        code={normalized}
        language={language}
        title={title}
        output={output}
        showLineNumbers
        reveal={{ visibleLines, animate: !reduced && !showAll, outputVisible }}
      />

      {!showAll && (
        <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2">
          {!done ? (
            <button
              type="button"
              onClick={advance}
              data-testid="ido-advance"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-4 w-4" />
              Escribir la siguiente parte
              <span className="opacity-70">
                ({segment + 1}/{segments.length})
              </span>
            </button>
          ) : !ran ? (
            <button
              type="button"
              onClick={() => setRan(true)}
              data-testid="ido-run"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Play className="h-4 w-4" />
              Ejecutar y ver la salida
            </button>
          ) : null}

          {!done && (
            <button
              type="button"
              onClick={revealEverything}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[13px] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Eye className="h-4 w-4" />
              Ver el demo completo
            </button>
          )}

          <span className="text-[13px] text-muted-foreground">
            {!done
              ? 'Antes de continuar, predice qué va a imprimir.'
              : !ran
                ? 'Ya está todo el código. ¿Qué esperas que imprima?'
                : 'Compara tu predicción con la salida real.'}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => persist(pref === 'all' ? 'stepped' : 'all')}
        className="mb-4 text-[13px] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
      >
        {pref === 'all'
          ? 'Volver a ver los demos paso a paso'
          : 'Mostrar siempre los demos completos'}
      </button>
    </div>
  )
}

export const __test = { segmentCode, PREF_KEY }
