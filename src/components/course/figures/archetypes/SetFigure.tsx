'use client'

import { FIG, FigSvg, FigText } from '../../Figure'
import { tintOf, wrapLines, type SetData } from './types'

/**
 * Nested coverage inside one universe.
 *
 * Used where the teaching point is what a technique does *not* reach — the
 * cases example-based tests never generate, the pairs blocking never compares.
 * Prose says "some"; nesting shows the leftover.
 *
 * The first version placed each region's label with arithmetic that drifted as
 * regions nested, and the stress figure caught three labels sitting on top of
 * one another at desktop width. Labels now live in their own reserved band per
 * region, so the geometry cannot collide however many regions are declared.
 */
export function SetFigure({ title, data }: { title: string; data: SetData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []

  const n = data.regions.length
  const bandH = 56
  const outerX = 40
  const outerY = 62 + headBlock
  const outerW = FIG.width - 80
  const outerH = 34 + n * bandH + 16
  const height = outerY + outerH + (noteLines.length ? 34 + noteLines.length * 18 : 24)

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      {headLines.map((l, i) => (
        <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
          {l}
        </FigText>
      ))}

      <rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        rx={FIG.radius}
        fill="var(--muted)"
        stroke="var(--border)"
        strokeWidth={FIG.stroke}
        strokeDasharray="5 4"
      />
      <FigText x={outerX + outerW - 10} y={outerY + 16} anchor="end" size={FIG.microSize} fill="var(--muted-foreground)">
        {data.universeLabel}
      </FigText>

      {data.regions.map((r, i) => {
        // Each region is inset from the previous on the left and gets its own
        // horizontal band, so the uncovered remainder stays visible as margin
        // while no two labels can ever share a row.
        const inset = 20 + i * 26
        const y = outerY + 30 + i * bandH
        const w = outerW - inset - 20
        return (
          <g key={r.label}>
            <rect
              x={outerX + inset}
              y={y}
              width={w}
              height={bandH - 12}
              rx={FIG.radius}
              fill={tintOf(r.tint)}
              fillOpacity={0.16}
              stroke={tintOf(r.tint)}
              strokeWidth={FIG.stroke}
            />
            <FigText
              x={outerX + inset + 12}
              y={y + (r.sub ? 15 : (bandH - 12) / 2)}
              anchor="start"
              size={FIG.microSize}
              weight={600}
              fill={tintOf(r.tint)}
            >
              {r.label}
            </FigText>
            {r.sub ? (
              <FigText x={outerX + inset + 12} y={y + 35} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
                {r.sub}
              </FigText>
            ) : null}
          </g>
        )
      })}

      {noteLines.map((l, i) => (
        <FigText
          key={l}
          x={24}
          y={height - 16 - (noteLines.length - 1) * 18 + i * 18}
          anchor="start"
          size={FIG.microSize}
          fill="var(--muted-foreground)"
        >
          {l}
        </FigText>
      ))}
    </FigSvg>
  )
}
