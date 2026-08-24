/**
 * Every data-driven figure in the course, keyed by the id a TheoryBlock uses.
 *
 * Grouped by archetype so a reviewer can read all the pipelines together, all
 * the graphs together, and judge consistency without opening components.
 */
import type { FigureData } from '../archetypes/types'
import { FLOW_FIGURES } from './flows'
import { GRAPH_FIGURES } from './graphs'
import { MISC_FIGURES } from './misc'

export const FIGURE_DATA: Record<string, FigureData> = {
  ...FLOW_FIGURES,
  ...GRAPH_FIGURES,
  ...MISC_FIGURES,
}
