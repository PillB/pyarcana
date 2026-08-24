'use client'

import { FIG, FigSvg, FigText, FigArrow, FigArrowDefs } from '../../Figure'
import { tintOf, type TableShapeData , wrapLines } from './types'

/**
 * The same values in two layouts.
 *
 * A layout is the one thing prose cannot show. Both panels carry identical
 * values on purpose: what changes is where each number lives, which is exactly
 * the thing a learner who can recite the definitions still cannot recognise.
 */
export function TableShapeFigure({ title, data, idPrefix }: { title: string; data: TableShapeData; idPrefix: string }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const cellH = 24
  const top = 84 + headBlock
  const maxRows = Math.max(data.left.rows.length, data.right.rows.length)
  const height = top + (maxRows + 1) * cellH + (noteLines.length ? 50 + (noteLines.length - 1) * 18 : 26)

  const panel = (
    x: number,
    p: TableShapeData['left'],
  ) => {
    const cols = p.head.length
    const cellW = Math.floor(226 / cols)
    return (
      <g>
        <FigText x={x} y={68} anchor="start" size={FIG.microSize} weight={600} fill={tintOf(p.tint)}>
          {p.title}
        </FigText>
        {p.head.map((h, c) => (
          <g key={`h-${c}`}>
            <rect x={x + c * cellW} y={top} width={cellW} height={cellH} fill={tintOf(p.tint)} fillOpacity={0.2} stroke="var(--border)" strokeWidth={FIG.stroke} />
            <FigText x={x + c * cellW + cellW / 2} y={top + cellH / 2} size={FIG.microSize} weight={600} mono>
              {h}
            </FigText>
          </g>
        ))}
        {p.rows.map((r, ri) =>
          r.map((v, c) => (
            <g key={`${ri}-${c}`}>
              <rect x={x + c * cellW} y={top + (ri + 1) * cellH} width={cellW} height={cellH} fill="var(--card)" stroke="var(--border)" strokeWidth={FIG.stroke} />
              <FigText x={x + c * cellW + cellW / 2} y={top + (ri + 1) * cellH + cellH / 2} size={FIG.microSize} mono fill="var(--muted-foreground)">
                {v}
              </FigText>
            </g>
          )),
        )}
      </g>
    )
  }

  const leftX = 22
  const rightX = 312
  const midY = top + ((maxRows + 1) * cellH) / 2

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      <FigArrowDefs id={`${idPrefix}-arrow`} />
      <FigText x={22} y={26} anchor="start" weight={600}>
        {data.headline}
      </FigText>

      {panel(leftX, data.left)}
      {panel(rightX, data.right)}

      <FigArrow x1={leftX + 232} y1={midY} x2={rightX - 6} y2={midY} markerId={`${idPrefix}-arrow`} />
      <FigText x={(leftX + 232 + rightX) / 2} y={midY - 14} size={FIG.microSize} mono fill="var(--muted-foreground)">
        {data.forward}
      </FigText>
      {data.backward ? (
        <FigText x={(leftX + 232 + rightX) / 2} y={midY + 16} size={FIG.microSize} mono fill="var(--muted-foreground)">
          {data.backward}
        </FigText>
      ) : null}

      {noteLines.map((l, i) => (
        <FigText key={l} x={22} y={height - 16 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
  )
}
