/**
 * The shape of an applied track: optional content that sits beside the 52 sections, never inside
 * them (audit/tracks/web/DESIGN.md §1). Its ticks live under their own storage key and count
 * toward no section, exam, badge or gate.
 */

/** A code block. `output` is what the code prints, run, never typed by hand (the test runs it). */
export interface TrackCode {
  language: 'python' | 'bash' | 'html' | 'javascript' | 'json' | 'text'
  title: string
  code: string
  /** Required for `python`: the test runs the block under python3 -I and compares every line. */
  output?: string
}

/** A small table of facts or choices. Rendered with a caption and column headers. */
export interface TrackTable {
  caption: string
  columns: readonly string[]
  rows: readonly (readonly string[])[]
}

/**
 * HTML the browser draws, shown in a sandboxed frame with scripts off. `title` names the frame for
 * screen readers. Every row of it must appear in the step's printed output (the test checks), so
 * the picture cannot drift from the code that produced it.
 */
export interface TrackPreview {
  title: string
  html: string
}

/** "Si no funciona": what the learner sees, and what to do. */
export interface TrackFix {
  symptom: string
  steps: readonly string[]
}

export interface TrackStep {
  /** Stable: stored in the learner's ticks. `modulo.accion`, lowercase. Never renamed. */
  id: string
  title: string
  /** Short paragraphs, inline markdown (`code`, **bold**). */
  body: readonly string[]
  code?: readonly TrackCode[]
  table?: TrackTable
  previews?: readonly TrackPreview[]
  /** «Deberías ver»: the checkpoint the learner can compare against. */
  expect?: string
  fixes?: readonly TrackFix[]
  /**
   * «Hazlo tú»: a transfer task the learner writes themselves. The body states the task; the
   * solution is hidden behind a disclosure and run by the test like any other Python block.
   */
  exercise?: { hint?: string; solution: TrackCode }
  /** The product's own current guide. `label` names the guide, never "aquí" (WCAG 2.4.4). */
  guide?: { label: string; url: string }
}

export interface TrackModule {
  /** Anchor and prefix of its step ids. */
  id: string
  title: string
  /** One sentence: what the learner can do at the end. */
  goal: string
  /** Orientation before the steps: where this sits and what it rests on. */
  intro: readonly string[]
  /** Course sections whose teaching this module leans on, by stable slug id. */
  buildsOn: readonly string[]
  steps: readonly TrackStep[]
}

export interface TrackDefinition {
  /** The hash that opens it (`#ruta-web`) and the prefix of its storage key. */
  id: string
  title: string
  summary: string
  modules: readonly TrackModule[]
}
