'use client'

import { FIG, FigSvg, FigText } from '../../Figure'
import { tintOf, type BarsData , wrapLines } from './types'

/**
 * Paired magnitudes on one scale.
 *
 * Two numbers in a sentence are two numbers; on a shared axis they are a
 * ratio, and the ratio is usually the point — a baseline that is almost as
 * good as the model, a hot path that dwarfs everything else being optimised.
 */
export function BarsFigure({ title, data }: { title: string; data: BarsData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const n = data.bars.length
  const rowH = 42
  const topY = 62 + headBlock
  const labelW = 148
  const x0 = labelW + 24
  const x1 = FIG.width - 96
  const height = topY + n * rowH + (noteLines.length ? 46 + (noteLines.length - 1) * 18 : 20)

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      {headLines.map((l, i) => (
        <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
          {l}
        </FigText>
      ))}

      {data.bars.map((b, i) => {
        const y = topY + i * rowH
        const w = Math.max(2, ((x1 - x0) * b.value) / data.max)
        return (
          <g key={b.label}>
            <FigText x={24} y={y + 12} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
              {b.label}
            </FigText>
            <rect x={x0} y={y} width={w} height={24} rx={FIG.radius} fill={tintOf(b.tint)} fillOpacity={0.28} stroke={tintOf(b.tint)} strokeWidth={FIG.stroke} />
            <FigText x={x0 + w + 8} y={y + 12} anchor="start" size={FIG.microSize} weight={600} fill={tintOf(b.tint)}>
              {b.display ?? String(b.value)}
            </FigText>
          </g>
        )
      })}

      <line x1={x0} y1={topY - 8} x2={x0} y2={topY + n * rowH - 12} stroke="var(--border)" strokeWidth={FIG.stroke} />

      {noteLines.map((l, i) => (
        <FigText key={l} x={24} y={height - 14 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
  )
}
