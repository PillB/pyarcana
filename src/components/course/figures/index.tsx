import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'

import { ArchetypeFigure } from './archetypes'
export { FIGURE_DATA } from './data'
import { FIGURE_DATA } from './data'

import { S01CwdPath } from './S01CwdPath'
import { S03TriState } from './S03TriState'
import { S04Denominator } from './S04Denominator'
import { S05ContractWindow } from './S05Contract'
import { S06ThreeStructures } from './S06ThreeStructures'
import { S07NfcNfd } from './S07NfcNfd'
import { S08Reconcile } from './S08Reconcile'
import { S14ViewVsCopy } from './S14ViewVsCopy'
import { S15DataFrame } from './S15DataFrame'
import { S18Interval } from './S18Interval'
import { S17WideLong } from './S17WideLong'
import { S32Leakage } from './S32Leakage'
import { S36RollingOrigin } from './S36RollingOrigin'
import { S46EventTime } from './S46EventTime'

/**
 * The graph figure is loaded on demand, not with the registry.
 *
 * Importing it here eagerly pulled `@xyflow/react` into the bundle for every
 * section in the course, when exactly one section renders a graph. That showed
 * up as ~5s to hydrate S01 — right on the code-fidelity spec's 5s budget for
 * the first navigation, which is what made that gate flaky.
 *
 * `ssr: false` because React Flow measures the DOM to lay out edges; there is
 * nothing useful to render on the server, and the surrounding <figcaption> and
 * the screen-reader description in FigureFrame carry the meaning regardless.
 */
const S31EvidenceGraph = dynamic(
  () => import('./S31EvidenceGraph').then((m) => m.S31EvidenceGraph),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[260px] items-center justify-center rounded-md border border-border bg-muted/30 text-[13px] text-muted-foreground"
        role="status"
      >
        Cargando el grafo…
      </div>
    ),
  },
)

/**
 * Every teaching figure, keyed by the id used in a TheoryBlock's `figure`.
 *
 * Keys are stable and namespaced by section so a figure can be found from the
 * content file without grepping components. Adding a figure means adding a row
 * here and a `figure:` field to one theory block — nothing else changes.
 */
export const FIGURES: Record<string, ComponentType<{ title: string }>> = {
  'S01-cwd-path': S01CwdPath,
  'S03-tri-state': S03TriState,
  'S04-denominator': S04Denominator,
  'S05-contract': S05ContractWindow,
  'S06-three-structures': S06ThreeStructures,
  'S07-nfc-nfd': S07NfcNfd,
  'S08-reconcile': S08Reconcile,
  'S14-view-vs-copy': S14ViewVsCopy,
  'S15-dataframe': S15DataFrame,
  'S17-wide-long': S17WideLong,
  'S18-interval': S18Interval,
  'S32-leakage': S32Leakage,
  'S36-rolling-origin': S36RollingOrigin,
  'S46-event-time': S46EventTime,
  'S31-evidence-graph': S31EvidenceGraph,
}

/**
 * Resolve a figure id to something renderable.
 *
 * Two kinds coexist deliberately. The first fifteen are bespoke components,
 * each drawing one idea that has no sibling anywhere else in the course; they
 * stay as they are. Everything after them is a typed data entry rendered by a
 * shared archetype, because seventy-seven more bespoke files would be ~8,500
 * lines of one-off SVG and would guarantee that the set stops looking like one
 * family.
 *
 * Bespoke wins on lookup so an id can be promoted from data to a hand-drawn
 * figure later without touching any section file.
 */
export const FIGURE_IDS = [...Object.keys(FIGURES), ...Object.keys(FIGURE_DATA)]
