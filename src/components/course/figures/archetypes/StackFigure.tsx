'use client'

import { motion } from 'framer-motion'

import { FIG, FigSvg, FigStepButton, useFigureSteps, FigBox, FigText } from '../../Figure'
import { INK, tintOf, type StackData , wrapLines } from './types'

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
  // Revealed from the base up, which is the order the thing is actually built
  // and the opposite of the order prose has to list it in.
  const { step, next, reset, transition, isLast } = useFigureSteps(data.layers.length + 1)
  const layers = [...data.layers].reverse()
  const n = layers.length
  const layerH = 52
  const topY = 62 + headBlock
  const boxX = 108
  const boxW = 360
  const height = topY + n * layerH + (noteLines.length ? 52 + (noteLines.length - 1) * 18 : 26)
  const volatileFrom = data.volatileFrom ?? n

  return (
    <div>
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
        const shown = step > logical
        return (
          <motion.g key={l.label} initial={false} animate={{ opacity: shown ? 1 : 0.2 }} transition={transition}>
            <FigBox
              x={boxX}
              y={y}
              w={boxW}
              h={layerH - 6}
              fill="var(--card)"
              stroke={INK.outline}
              dashed={isVolatile}
            />
            <FigText
              x={boxX + 14}
              y={y + (l.sub ? 15 : (layerH - 8) / 2)}
              anchor="start"
              size={FIG.microSize}
              weight={600}
              fill={INK.label}
            >
              {l.label}
            </FigText>
            {l.sub ? (
              <FigText x={boxX + 14} y={y + 34} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
                {l.sub}
              </FigText>
            ) : null}
          </motion.g>
        )
      })}

      {/* Anchored inside the canvas: at 320px an end-anchored caption at
          boxX - 12 started at a negative x and was clipped. */}
      <FigText x={24} y={topY + 14} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        cambia más
      </FigText>
      <FigText x={24} y={topY + n * layerH - 20} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
        cambia menos
      </FigText>

      {noteLines.map((l, i) => (
        <FigText key={l} x={24} y={height - 16 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
    <FigStepButton onClick={isLast ? reset : next}>
      {isLast ? 'Reiniciar' : step === 0 ? 'Construir de abajo hacia arriba' : 'Siguiente capa'}
    </FigStepButton>
    </div>
  )
}
