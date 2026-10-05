'use client'

import { SETUP_FIGURES } from '@/lib/setup/figures'
import { FigureShell } from '@/components/course/Figure'
import { ArchetypeFigure } from '@/components/course/figures/archetypes'

/** A Sesión 0 diagram in the course's figure frame. An unknown id renders nothing. */
export function SetupFigure({ id }: { id: string }) {
  const f = SETUP_FIGURES[id]
  if (!f) return null
  return (
    <FigureShell figure={{ id: f.id, caption: f.caption, alt: f.alt }}>
      <ArchetypeFigure title={f.alt} data={f.data} id={f.id} />
    </FigureShell>
  )
}
