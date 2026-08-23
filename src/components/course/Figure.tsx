'use client'

import { useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Figure as FigureData } from '@/lib/types'
import { FIGURES } from './figures'

/**
 * The single shell every teaching diagram renders inside.
 *
 * Ten diagrams drawn independently look like ten diagrams. One shell — same
 * frame, same caption treatment, same numbering, same accessible wiring — is
 * what makes them read as one family, so the frame lives here and the figure
 * components own nothing but their own drawing.
 *
 * Accessibility: the <svg> inside each figure carries role="img" and a <title>,
 * and the shell repeats the long description in a visually-hidden <p> so the
 * information survives for a reader who cannot see the drawing at all.
 *
 * Overflow: a diagram is the one piece of content that legitimately wants more
 * width than a phone has. The scroll container keeps that from pushing the page
 * body sideways — the failure mode already documented for callouts at 390px.
 */
/**
 * Learner-paced stepping for the figures where a state change *is* the lesson.
 *
 * Deliberately not autoplay. Mayer's segmenting principle favours learner-paced
 * segments over continuous presentation, and the transient-information effect
 * says animation that plays and vanishes costs more attention than it saves.
 * So each step is a state that is fully readable while standing still, and the
 * learner decides when to move.
 *
 * Reduced motion is honoured here rather than in CSS on purpose: the global
 * `prefers-reduced-motion` rule in globals.css neutralises CSS animations and
 * transitions, but Motion drives inline transforms from JavaScript, which that
 * rule never touches. When motion is reduced the steps still work — they just
 * cut rather than tween, so no information is lost.
 */
export function useFigureSteps(count: number) {
  const [step, setStep] = useState(0)
  const reduced = useReducedMotion()
  return {
    step,
    setStep,
    reduced: !!reduced,
    /** Motion transition to spread onto animated parts. */
    transition: reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 26 },
    next: () => setStep((s) => (s + 1) % count),
    reset: () => setStep(0),
    isLast: step === count - 1,
  }
}

export function FigStepButton({
  onClick,
  children,
  'data-testid': testId,
}: {
  onClick: () => void
  children: ReactNode
  'data-testid'?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId ?? 'figure-step'}
      // 44px min height keeps it above the tap-target floor the forensic
      // capture enforces (it flags anything under 24px).
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[13px] font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  )
}

export function FigureFrame({ figure }: { figure: FigureData }) {
  const Drawing = FIGURES[figure.id]

  // An unknown id must not blank the lesson: the caption still teaches.
  if (!Drawing) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Figure] unknown figure id: ${figure.id}`)
    }
    return null
  }

  return (
    <figure
      data-testid="course-figure"
      data-figure-id={figure.id}
      className="my-5 rounded-lg border border-border bg-card/40 p-3 sm:p-4"
    >
      <div className="overflow-x-auto">
        <Drawing title={figure.alt} />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        {figure.caption}
      </figcaption>
      <p className="sr-only">{figure.alt}</p>
    </figure>
  )
}

/**
 * Shared drawing primitives. Every figure builds from these so stroke weight,
 * type scale and colour come from one place instead of being retyped ten times.
 *
 * Colours are theme tokens only — never literal hex — so both light and dark
 * resolve correctly. `currentColor` is deliberately avoided for fills: the
 * figure sits on a card, not on body background.
 */
/**
 * Canvas contract, and the reason for the numbers.
 *
 * An SVG with `width: 100%` scales its text with the viewBox. A 640-wide
 * viewBox inside a 340px phone column renders at scale 0.53, which turns 14px
 * type into 7px — legible in a mockup, useless on a phone. So the canvas is
 * deliberately narrow (560) and a floor is set on the rendered width: at
 * MIN_WIDTH the scale is 460/560 ≈ 0.82, so the smallest type lands at
 * 14 × 0.82 ≈ 11.5px. The first version used 13px here and measured 10.7px on
 * a real phone viewport — legible in a mockup, not in a hand.
 *
 * Below that floor the frame scrolls rather than shrinking further: a wide
 * diagram is one of the few things that legitimately wants more width than a
 * phone has, and squeezing it costs more than scrolling it.
 */
export const FIG = {
  /** Design canvas width. Every figure uses this so they scale identically. */
  width: 560,
  /** Never render narrower than this — see the scale arithmetic above. */
  minWidth: 460,
  /** Body label. */
  labelSize: 15,
  /** Secondary annotation. Nothing in a figure goes below this. */
  microSize: 14,
  stroke: 1.5,
  strokeBold: 2,
  radius: 6,
} as const

export function FigSvg({
  title,
  viewBox,
  children,
}: {
  title: string
  viewBox: string
  children: ReactNode
}) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', minWidth: FIG.minWidth, maxWidth: FIG.width, height: 'auto' }}
      className="block"
    >
      <title>{title}</title>
      {children}
    </svg>
  )
}

/** A labelled box — the unit most figures are built from. */
export function FigBox({
  x,
  y,
  w,
  h,
  fill = 'var(--muted)',
  stroke = 'var(--border)',
  dashed = false,
}: {
  x: number
  y: number
  w: number
  h: number
  fill?: string
  stroke?: string
  dashed?: boolean
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={FIG.radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={FIG.stroke}
      strokeDasharray={dashed ? '5 4' : undefined}
    />
  )
}

/** Figure text. Defaults to the label size so nothing drifts below it. */
export function FigText({
  x,
  y,
  children,
  anchor = 'middle',
  size = FIG.labelSize as number,
  weight = 400,
  fill = 'var(--foreground)',
  mono = false,
  opacity = 1,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  size?: number
  weight?: number
  fill?: string
  mono?: boolean
  opacity?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      fillOpacity={opacity}
      fontFamily={mono ? 'var(--font-mono), ui-monospace, monospace' : 'inherit'}
      dominantBaseline="middle"
    >
      {children}
    </text>
  )
}

/** Arrow marker definition — declared once per figure that needs it. */
export function FigArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
    </defs>
  )
}

export function FigArrow({
  x1,
  y1,
  x2,
  y2,
  markerId,
  stroke = 'var(--muted-foreground)',
  dashed = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  markerId: string
  stroke?: string
  dashed?: boolean
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={FIG.stroke}
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={`url(#${markerId})`}
    />
  )
}
