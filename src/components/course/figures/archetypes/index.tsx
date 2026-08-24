'use client'

import dynamic from 'next/dynamic'
import { FlowFigure } from './FlowFigure'
import { DecisionFigure } from './DecisionFigure'
import { TimelineFigure } from './TimelineFigure'
import { StackFigure } from './StackFigure'
import { BarsFigure } from './BarsFigure'
import { TableShapeFigure } from './TableShapeFigure'
import { SetFigure } from './SetFigure'
import type { FigureData } from './types'

/**
 * One lazy boundary for every graph figure in the course.
 *
 * `@xyflow/react` is 3.5M unpacked. Importing it eagerly here would pull it
 * into all 52 sections for the sake of the handful that draw a graph — the
 * exact regression that made the code-fidelity gate flaky when S31 was first
 * added. Because every graph figure renders through this one component, they
 * share a single chunk that is fetched only when a graph is actually on screen.
 */
const GraphFigure = dynamic(() => import('./GraphFigure').then((m) => m.GraphFigure), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[260px] items-center justify-center rounded-md border border-border bg-muted/30 text-[13px] text-muted-foreground"
      role="status"
    >
      Cargando el diagrama…
    </div>
  ),
})

/** Renders a figure from its data. The id seeds SVG marker ids, which must be unique per figure. */
export function ArchetypeFigure({ title, data, id }: { title: string; data: FigureData; id: string }) {
  switch (data.kind) {
    case 'flow':
      return <FlowFigure title={title} data={data} idPrefix={id} />
    case 'decision':
      return <DecisionFigure title={title} data={data} idPrefix={id} />
    case 'timeline':
      return <TimelineFigure title={title} data={data} />
    case 'stack':
      return <StackFigure title={title} data={data} />
    case 'bars':
      return <BarsFigure title={title} data={data} />
    case 'table':
      return <TableShapeFigure title={title} data={data} idPrefix={id} />
    case 'set':
      return <SetFigure title={title} data={data} />
    case 'graph':
      return <GraphFigure title={title} data={data} />
  }
}
