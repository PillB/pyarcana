/**
 * Figure archetypes: the shapes the curriculum actually needs, drawn once.
 *
 * Fifteen bespoke figures averaged ~110 lines each. Seventy-seven more of those
 * is roughly 8,500 lines of one-off SVG, and it reproduces the risk the first
 * figure plan named out loud: diagrams drawn separately look like diagrams
 * drawn separately. So a figure stops being a component and becomes a typed
 * entry against one of a small number of parameterised shapes.
 *
 * Every archetype paints with FIG tokens from ../../Figure, so type scale,
 * stroke weight, palette and canvas width cannot drift between figures.
 */

/** One labelled stage in a pipeline. */
export interface FlowStage {
  label: string
  /** Second line, smaller — what the stage guarantees or emits. */
  sub?: string
  /** Chart token index 1-5; omit for the neutral fill. */
  tint?: 1 | 2 | 3 | 4 | 5
}

export interface FlowData {
  kind: 'flow'
  /** Sentence above the diagram. Carries the teaching point. */
  headline: string
  stages: FlowStage[]
  /**
   * Index of the stage after which a trust or time boundary is drawn, with its
   * label. This is the part prose serialises badly and the figure shows at once.
   */
  boundaryAfter?: number
  boundaryLabel?: string
  /** Shown under the last stage when the walk-through finishes. */
  outcome?: string
}

/** One branch of a guard-clause funnel. */
export interface DecisionBranch {
  /** The condition, as the learner would read it in code. */
  test: string
  /** Where it lands. */
  result: string
  tint: 1 | 2 | 3 | 4 | 5
}

export interface DecisionData {
  kind: 'decision'
  headline: string
  input: string
  branches: DecisionBranch[]
  /** Reminder under the funnel — usually why order matters. */
  note?: string
}

/** A marker on the single time axis. */
export interface TimelineEvent {
  at: number
  label: string
  sub?: string
  tint: 1 | 2 | 3 | 4 | 5
}

export interface TimelineData {
  kind: 'timeline'
  headline: string
  /** Axis domain. */
  from: number
  to: number
  axisLabel: string
  events: TimelineEvent[]
  /** A vertical line the events are judged against. */
  boundaryAt?: number
  boundaryLabel?: string
  /** Shaded tolerance to the left of the boundary. */
  graceWidth?: number
  graceLabel?: string
  note?: string
}

export interface StackLayer {
  label: string
  sub?: string
  tint?: 1 | 2 | 3 | 4 | 5
}

export interface StackData {
  kind: 'stack'
  headline: string
  /** Bottom-first, the way the thing is actually built. */
  layers: StackLayer[]
  /** Which layers change often — drawn dashed. */
  volatileFrom?: number
  note?: string
}

export interface BarRow {
  label: string
  value: number
  tint: 1 | 2 | 3 | 4 | 5
  /** Printed at the end of the bar instead of the raw number. */
  display?: string
}

export interface BarsData {
  kind: 'bars'
  headline: string
  bars: BarRow[]
  /** Domain maximum; bars are drawn as a fraction of it. */
  max: number
  note?: string
}

export interface TableShapeData {
  kind: 'table'
  headline: string
  left: { title: string; head: string[]; rows: string[][]; tint: 1 | 2 | 3 | 4 | 5 }
  right: { title: string; head: string[]; rows: string[][]; tint: 1 | 2 | 3 | 4 | 5 }
  /** Verb on the arrow between them, each direction. */
  forward: string
  backward?: string
  note?: string
}

export interface SetData {
  kind: 'set'
  headline: string
  universeLabel: string
  regions: { label: string; sub?: string; tint: 1 | 2 | 3 | 4 | 5 }[]
  note?: string
}

/** A node in a graph figure. Positions are computed, never authored. */
export interface GraphNode {
  id: string
  label: string
  sub?: string
  tint: 1 | 2 | 3 | 4 | 5
  /** Column in the wide layout; the stacked layout ignores it. */
  col: number
  row: number
}

export interface GraphEdge {
  from: string
  to: string
  label?: string
  /** Dashed edges read as derived or inferred rather than recorded. */
  derived?: boolean
}

export interface GraphData {
  kind: 'graph'
  headline: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  note?: string
}

export type FigureData =
  | FlowData
  | DecisionData
  | TimelineData
  | StackData
  | BarsData
  | TableShapeData
  | SetData
  | GraphData

/**
 * Contrast-safe roles, because the chart palette is not a text palette.
 *
 * Measured in the browser against the page background:
 *
 *              light    dark
 *   --border    1.24     18.53      unusable as a diagram outline in light
 *   --chart-2   1.85     10.77      unusable as label text in light
 *   --chart-5   2.21      7.84      unusable as label text in light
 *   --chart-4   3.28      5.29      fine for a shape, fails 4.5 for text
 *   --muted-fg  7.85      9.44      safe everywhere
 *   --fg       13.92     15.85      safe everywhere
 *
 * The chart tokens are tuned for filled areas, where a large block of colour
 * carries the signal. Used for 14px type or a 1.5px outline they vanish -- and
 * they vanish only in light mode, which is why reading the figures in dark
 * mode while building them hid it. 453 elements across 81 of the 92 figures
 * were below the WCAG floor.
 *
 * So archetypes address colour by ROLE. A tint may fill a shape; it may not be
 * the only thing carrying a word or an edge.
 */
export const INK = {
  /** Primary label text. */
  label: 'var(--foreground)',
  /** Secondary label text: captions, units, annotations. */
  muted: 'var(--muted-foreground)',
  /** The line that delineates a shape. Never --border: 1.24:1 in light. */
  outline: 'var(--muted-foreground)',
  /** A shape's fill when the tint itself is the information.
   *  0.16-0.28 was the original range and measured 1.1-1.3:1 against the page:
   *  the colour was there in the code and not on the screen. 0.35 reached
   *  1.36-1.85. 0.55 clears the 3:1 floor for a graphical object while leaving
   *  --foreground labels well above 4.5:1 on top of it. */
  tintFillOpacity: 0.55,
} as const

/** Chart tokens, indexed so data files never name a colour. */
export const TINT = ['var(--muted-foreground)', 'var(--fig-1)', 'var(--fig-2)', 'var(--fig-3)', 'var(--fig-4)', 'var(--fig-5)'] as const

export function tintOf(i?: number): string {
  return TINT[i ?? 0] ?? TINT[0]
}

/**
 * Break a sentence into lines that fit the canvas.
 *
 * The first archetype figure clipped its closing line at every viewport: the
 * text was 84 characters, anchored left, and ran past the 560 canvas. That is
 * not a one-off — it is what happens to every free-text field once figures are
 * authored as data by someone who cannot see the box. So the archetypes wrap
 * instead of trusting the author to count.
 *
 * The 7.2px-per-character estimate is deliberately pessimistic for the 14px
 * label size; being wrong in this direction wastes a few pixels, being wrong in
 * the other direction clips a word.
 */
export function wrapLines(text: string, maxWidthPx: number, charPx = 7.2): string[] {
  const budget = Math.max(8, Math.floor(maxWidthPx / charPx))
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w
    if (candidate.length > budget && line) {
      lines.push(line)
      line = w
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}
