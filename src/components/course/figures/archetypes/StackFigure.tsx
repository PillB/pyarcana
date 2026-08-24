'use client'

import { FIG, FigSvg, FigBox, FigText } from '../../Figure'
import { tintOf, type StackData , wrapLines } from './types'

/**
 * Layers, bottom-first, the way the thing is actually built.
 *
 * Prose lists layers top-down because sentences run that way, which inverts
 * how they are constructed and cached. Drawing them stacked puts the stable
 * base at the bottom where it belongs, and dashing the volatile layers shows
 * at a glance which ones invalidate on every commit.
 */
export function StackFigure({ title, data }: { title: string; data: StackData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const layers = [...data.layers].reverse()
  const n = layers.length
  const layerH = 40
  const topY = 62 + headBlock
  const boxX = 90
  const boxW = 380
  const height = topY + n * layerH + (noteLines.length ? 52 + (noteLines.length - 1) * 18 : 26)
  const volatileFrom = data.volatileFrom ?? n

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      {headLines.map((l, i) => (
        <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
          {l}
        </FigText>
      ))}

      {layers.map((l, visual) => {
        // `visual` counts from the top of the drawing; `logical` from the base,
        // which is the index the data speaks in.
        const logical = n - 1 - visual
        const y = topY + visual * layerH
        const isVolatile = logical >= volatileFrom
        return (
          <g key={l.label}>
            <FigBox
              x={boxX}
              y={y}
              w={boxW}
              h={layerH - 6}
              fill="var(--card)"
              stroke={tintOf(l.tint)}
              dashed={isVolatile}
            />
            <FigText
              x={boxX + 14}
              y={y + (l.sub ? 13 : (layerH - 6) / 2)}
              anchor="start"
              size={FIG.microSize}
              weight={600}
              fill={tintOf(l.tint)}
            >
              {l.label}
            </FigText>
            {l.sub ? (
              <FigText x={boxX + 14} y={y + 26} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
                {l.sub}
              </FigText>
            ) : null}
          </g>
        )
      })}

      <FigText x={boxX - 12} y={topY + 12} anchor="end" size={FIG.microSize} fill="var(--muted-foreground)">
        cambia más
      </FigText>
      <FigText x={boxX - 12} y={topY + n * layerH - 18} anchor="end" size={FIG.microSize} fill="var(--muted-foreground)">
        cambia menos
      </FigText>

      {noteLines.map((l, i) => (
        <FigText key={l} x={24} y={height - 16 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
  )
}
