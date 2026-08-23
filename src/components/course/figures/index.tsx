import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'

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
  'S18-interval': S18Interval,
  'S31-evidence-graph': S31EvidenceGraph,
}

export const FIGURE_IDS = Object.keys(FIGURES)
