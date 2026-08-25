'use client'

import { motion } from 'framer-motion'

import { FIG, FigSvg, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../../Figure'
import { INK, tintOf, type TableShapeData , wrapLines } from './types'

/**
 * The same values in two layouts.
 *
 * A layout is the one thing prose cannot show. Both panels carry identical
 * values on purpose: what changes is where each number lives, which is exactly
 * the thing a learner who can recite the definitions still cannot recognise.
 */
export function TableShapeFigure({ title, data, idPrefix }: { title: string; data: TableShapeData; idPrefix: string }) {
  // Two states, because the teaching is the move between them: the left shape,
  // then the same values rearranged. Showing both at once asks the reader to
  // diff two tables in their head, which is the work the figure exists to save.
  const { step, next, reset, transition, isLast } = useFigureSteps(2)
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const cellH = 24
  const top = 84 + headBlock
  const maxRows = Math.max(data.left.rows.length, data.right.rows.length)
  const height = top + (maxRows + 1) * cellH + 22 + (noteLines.length ? 50 + (noteLines.length - 1) * 18 : 26)

  const panel = (
    x: number,
    p: TableShapeData['left'],
  ) => {
    const cols = p.head.length
    const cellW = Math.floor(206 / cols)
    return (
      <g>
        <FigText x={x} y={68} anchor="start" size={FIG.microSize} weight={600} fill={INK.label}>
          {p.title}
        </FigText>
        {p.head.map((h, c) => (
          <g key={`h-${c}`}>
            {/*
              The header band used to carry the tint at INK.tintFillOpacity, with
              foreground text on top. That reads well in light mode and fails in
              both: the probe measured these labels at 3.77:1 light and 2.57:1
              dark, because the dark palette's tints are *light* and near-white
              text lands on a pale band.

              A faint wash of the tint fixed the text and then failed the 3:1
              floor for graphical objects at 1.32:1 -- correctly, since a wash
              that carries meaning has to be visible. So the tint stops being a
              fill here and becomes the solid rule below, which clears 3:1 on
              its own; the band itself is the neutral --muted, whose whole job
              is to sit under text.
            */}
            <rect x={x + c * cellW} y={top} width={cellW} height={cellH} fill="var(--muted)" stroke={INK.outline} strokeWidth={FIG.stroke} />
            <rect x={x + c * cellW} y={top + cellH - 3} width={cellW} height={3} fill={tintOf(p.tint)} />
            <FigText x={x + c * cellW + cellW / 2} y={top + cellH / 2} size={FIG.microSize} weight={600} mono>
              {h}
            </FigText>
          </g>
        ))}
        {p.rows.map((r, ri) =>
          r.map((v, c) => (
            <g key={`${ri}-${c}`}>
              <rect x={x + c * cellW} y={top + (ri + 1) * cellH} width={cellW} height={cellH} fill="var(--card)" stroke={INK.outline} strokeWidth={FIG.stroke} />
              <FigText x={x + c * cellW + cellW / 2} y={top + (ri + 1) * cellH + cellH / 2} size={FIG.microSize} mono fill="var(--muted-foreground)">
                {v}
              </FigText>
            </g>
          )),
        )}
      </g>
    )
  }

  const leftX = 18
  const rightX = 336
  const midY = top + ((maxRows + 1) * cellH) / 2

  return (
    <div>
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      <FigArrowDefs id={`${idPrefix}-arrow`} />
      <FigText x={22} y={26} anchor="start" weight={600}>
        {data.headline}
      </FigText>

      {panel(leftX, data.left)}
      <motion.g initial={false} animate={{ opacity: isLast ? 1 : 0.18 }} transition={transition}>
        {panel(rightX, data.right)}
      </motion.g>

      {/* The verbs used to sit at the arrow's midpoint, which is a 58px gap --
          wide enough for the arrow and not for the word, so "over(partition by)"
          landed on the neighbouring cell. They now sit above the arrow, clear of
          both panels. */}
      <FigArrow x1={leftX + 212} y1={midY} x2={rightX - 6} y2={midY} markerId={`${idPrefix}-arrow`} />
      <FigText x={(leftX + 212 + rightX) / 2} y={top - 34} size={FIG.microSize} mono fill="var(--muted-foreground)">
        {data.forward}
      </FigText>
      {data.backward ? (
        <FigText x={(leftX + 212 + rightX) / 2} y={top + (maxRows + 1) * cellH + 16} size={FIG.microSize} mono fill="var(--muted-foreground)">
          {data.backward}
        </FigText>
      ) : null}

      {noteLines.map((l, i) => (
        <FigText key={l} x={22} y={height - 16 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
    <FigStepButton onClick={isLast ? reset : next}>
      {isLast ? 'Reiniciar' : 'Reorganizar'}
    </FigStepButton>
    </div>
  )
}
