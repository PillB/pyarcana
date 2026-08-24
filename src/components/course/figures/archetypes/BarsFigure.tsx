'use client'

import { motion } from 'framer-motion'

import { FIG, FigSvg, FigStepButton, useFigureSteps, FigText } from '../../Figure'
import { INK, tintOf, type BarsData , wrapLines } from './types'

/**
 * Paired magnitudes on one scale.
 *
 * Two numbers in a sentence are two numbers; on a shared axis they are a
 * ratio, and the ratio is usually the point — a baseline that is almost as
 * good as the model, a hot path that dwarfs everything else being optimised.
 */
export function BarsFigure({ title, data }: { title: string; data: BarsData }) {
  // Revealed one bar at a time. With paired magnitudes the comparison IS the
  // teaching, and a comparison the reader watches arrive lands differently
  // from one already finished when the page opened.
  const { step, next, reset, transition, isLast } = useFigureSteps(data.bars.length + 1)
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
    <div>
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
      {headLines.map((l, i) => (
        <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
          {l}
        </FigText>
      ))}

      {data.bars.map((b, i) => {
        const y = topY + i * rowH
        const w = Math.max(2, ((x1 - x0) * b.value) / data.max)
        const shown = step > i
        return (
          <motion.g key={b.label} initial={false} animate={{ opacity: shown ? 1 : 0.2 }} transition={transition}>
            <FigText x={24} y={y + 12} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
              {b.label}
            </FigText>
            <rect x={x0} y={y} width={w} height={24} rx={FIG.radius} fill={tintOf(b.tint)} fillOpacity={INK.tintFillOpacity} stroke={INK.outline} strokeWidth={FIG.stroke} />
            {/* A bar at the domain maximum leaves no room to its right, so a
                long label is drawn inside the bar instead of past its end. */}
            {(() => {
              const label = b.display ?? String(b.value)
              const needs = label.length * 7.2
              const outside = x0 + w + 8 + needs < FIG.width - 8
              return (
                <FigText
                  x={outside ? x0 + w + 8 : x0 + w - 8}
                  y={y + 12}
                  anchor={outside ? 'start' : 'end'}
                  size={FIG.microSize}
                  weight={600}
                  fill={outside ? tintOf(b.tint) : 'var(--foreground)'}
                >
                  {label}
                </FigText>
              )
            })()}
          </motion.g>
        )
      })}

      <line x1={x0} y1={topY - 8} x2={x0} y2={topY + n * rowH - 12} stroke={INK.outline} strokeWidth={FIG.stroke} />

      {noteLines.map((l, i) => (
        <FigText key={l} x={24} y={height - 14 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
    </FigSvg>
    <FigStepButton onClick={isLast ? reset : next}>
      {isLast ? 'Reiniciar' : step === 0 ? 'Comparar' : 'Siguiente'}
    </FigStepButton>
    </div>
  )
}
