import type { SetupOs } from './os'

/** "Si no funciona": one symptom the learner can recognise, and what to do about it. */
export interface SetupFix {
  /** What the learner sees, in their words or the screen's: «"python" no se reconoce…». */
  symptom: string
  /** What to do, one action per entry. */
  steps: string[]
}

/** One action, its picture, its checkpoint and its recovery box (DESIGN.md §4). */
export interface SetupStep {
  /** Stable: stored in the learner's ticks. `parte.so.accion`, lowercase. Never renamed. */
  id: string
  /** The systems this step applies to; omitted means all three. */
  os?: readonly SetupOs[]
  /** The action, in the imperative: «Descarga el instalador». */
  title: string
  /** Short paragraphs, inline markdown (`code`, **bold**). */
  body: readonly string[]
  /** What to type, exactly. Shown as a code block with a copy button. */
  command?: string
  /** «Deberías ver»: the checkpoint. */
  expect?: { text: string; output?: string }
  /** A screenshot spec id (SETUP_SHOTS). */
  shot?: string
  /** A diagram id (SETUP_FIGURES). */
  figure?: string
  /** «Si no funciona». */
  fixes?: readonly SetupFix[]
  /**
   * The product's own, current guide for this step. Screens change; the official guide is where
   * the latest version lives. `label` is the link text and names the guide, never "aquí" (WCAG
   * 2.4.4: a link list read out of context must still say where each link goes).
   */
  guide?: { label: string; url: string }
}

export interface SetupPart {
  /** Anchor and prefix of its step ids. */
  id: string
  title: string
  /** One sentence: what the learner can do at the end of this part. */
  goal: string
  /** Orientation before the steps (writing rule B6): where am I, why does this exist. */
  intro: readonly string[]
  /** A diagram shown before the steps. */
  figure?: string
  steps: readonly SetupStep[]
}
