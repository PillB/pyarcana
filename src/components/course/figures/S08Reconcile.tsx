'use client'

import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs } from '../Figure'

/**
 * S08 — the count that has to balance.
 *
 * `n_in == n_clean + n_quarantine` is the section's governing rule, and as a
 * line of code it reads like a formality. Drawn as one stream splitting into
 * two, with the totals on both sides, it reads as what it is: an accounting
 * identity that fails loudly when a row goes missing.
 */
export function S08Reconcile({ title }: { title: string }) {
  const inX = 24
  const inW = 150
  const outX = 356
  const outW = 180
  const midY = 108

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 232`}>
      <FigArrowDefs id="s08-arrow" />

      {/* what came in */}
      <FigBox x={inX} y={midY - 34} w={inW} h={68} fill="var(--muted)" />
      <FigText x={inX + inW / 2} y={midY - 12} size={FIG.microSize} mono>
        n_in
      </FigText>
      <FigText x={inX + inW / 2} y={midY + 14} size={20} weight={600}>
        1000
      </FigText>

      <FigArrow x1={inX + inW + 6} y1={midY} x2={outX - 46} y2={midY - 44} markerId="s08-arrow" stroke="var(--fig-2)" />
      <FigArrow x1={inX + inW + 6} y1={midY} x2={outX - 46} y2={midY + 44} markerId="s08-arrow" stroke="var(--fig-4)" />

      <FigText x={262} y={midY - 56} size={FIG.microSize} fill="var(--fig-2)">
        pasan el contrato
      </FigText>
      <FigText x={262} y={midY + 68} size={FIG.microSize} fill="var(--fig-4)">
        no lo cumplen
      </FigText>

      {/* the two exits */}
      <FigBox x={outX} y={midY - 76} w={outW} h={58} fill="var(--card)" stroke="var(--fig-2)" />
      <FigText x={outX + outW / 2} y={midY - 58} size={FIG.microSize} mono fill="var(--fig-2)">
        n_clean
      </FigText>
      <FigText x={outX + outW / 2} y={midY - 36} size={18} weight={600}>
        987
      </FigText>

      <FigBox x={outX} y={midY + 18} w={outW} h={58} fill="var(--card)" stroke="var(--fig-4)" />
      <FigText x={outX + outW / 2} y={midY + 36} size={FIG.microSize} mono fill="var(--fig-4)">
        n_quarantine
      </FigText>
      <FigText x={outX + outW / 2} y={midY + 58} size={18} weight={600}>
        13
      </FigText>

      {/* the identity */}
      <FigText x={FIG.width / 2} y={202} size={FIG.microSize} mono weight={600}>
        1000 == 987 + 13
      </FigText>
      <FigText x={FIG.width / 2} y={222} size={FIG.microSize} fill="var(--muted-foreground)">
        Si no cuadra, el programa termina con error. No publica a medias.
      </FigText>
    </FigSvg>
  )
}
