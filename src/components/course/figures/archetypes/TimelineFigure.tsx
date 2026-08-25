'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigText, FigStepButton, useFigureSteps } from '../../Figure'
import { INK, tintOf, type TimelineData , wrapLines } from './types'

/**
 * One time axis with a line events are judged against.
 *
 * This is the shape S46's watermark defect had: prose had to hold two roles
 * for the same axis at once — when a thing happened, and whether it had
 * arrived yet — and lost track of which number was which. Drawn, the boundary
 * is a line and the verdict is which side of it a dot sits on.
 */
export function TimelineFigure({ title, data }: { title: string; data: TimelineData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const n = data.events.length
  const { step, next, reset, transition, isLast } = useFigureSteps(n + 1)

  const x0 = 96
  const x1 = FIG.width - 48
  const span = data.to - data.from
  const sx = (v: number) => x0 + ((v - data.from) / span) * (x1 - x0)

  const topY = 76 + headBlock
  const rowH = 38
  const axisY = topY + n * rowH + 12
  const height = axisY + (data.graceLabel ? 46 + wrapLines(data.graceLabel, 210).length * 16 : 46)

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
        <FigText x={24} y={26} anchor="start" weight={600}>
          {data.headline}
        </FigText>

        {/* grace band sits behind everything it qualifies */}
        {typeof data.boundaryAt === 'number' && data.graceWidth ? (
          <rect
            x={sx(data.boundaryAt - data.graceWidth)}
            y={topY - 12}
            width={sx(data.boundaryAt) - sx(data.boundaryAt - data.graceWidth)}
            height={axisY - topY + 12}
            fill="var(--fig-4)"
            fillOpacity={INK.tintFillOpacity}
          />
        ) : null}

        {typeof data.boundaryAt === 'number' ? (
          <g>
            <line x1={sx(data.boundaryAt)} y1={topY - 12} x2={sx(data.boundaryAt)} y2={axisY} stroke="var(--fig-1)" strokeWidth={FIG.strokeBold} />
            <FigText x={sx(data.boundaryAt)} y={axisY + 30} size={FIG.microSize} fill="var(--fig-1)" weight={600}>
              {data.boundaryLabel ?? 'límite'}
            </FigText>
          </g>
        ) : null}
        {data.graceLabel && typeof data.boundaryAt === 'number' && data.graceWidth ? (
          <>
            {wrapLines(data.graceLabel, 210).map((gl, gi) => (
              <FigText
                key={gl}
                x={24}
                y={axisY + 48 + gi * 16}
                anchor="start"
                size={FIG.microSize}
                fill="var(--muted-foreground)"
              >
                {gl}
              </FigText>
            ))}
          </>
        ) : null}

        {data.events.map((e, i) => {
          const y = topY + i * rowH
          const shown = step > i
          return (
            <motion.g key={`${e.label}-${e.at}`} initial={false} animate={{ opacity: shown ? 1 : 0.18 }} transition={transition}>
              <FigText x={24} y={y} anchor="start" size={FIG.microSize} weight={600} fill={INK.label}>
                {e.label}
              </FigText>
              <circle cx={sx(e.at)} cy={y} r={5} fill={tintOf(e.tint)} />
              <FigText x={sx(e.at)} y={y - 17} size={FIG.microSize} mono fill={INK.label}>
                {String(e.at)}
              </FigText>
              {e.sub ? (
                // Anchored to the side with room: a dot near the right edge of
                // the axis pushed its subtitle off the canvas ("RTO incumplido",
                // "pérdida máxima 24 h").
                <FigText
                  x={sx(e.at) > FIG.width * 0.6 ? sx(e.at) - 12 : sx(e.at) + 12}
                  y={y}
                  anchor={sx(e.at) > FIG.width * 0.6 ? 'end' : 'start'}
                  size={FIG.microSize}
                  fill="var(--muted-foreground)"
                >
                  {e.sub}
                </FigText>
              ) : null}
            </motion.g>
          )
        })}

        <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={INK.outline} strokeWidth={FIG.stroke} />
        <FigText x={24} y={axisY} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {data.axisLabel}
        </FigText>
      </FigSvg>

      <FigStepButton onClick={isLast ? reset : next}>
        {isLast ? 'Reiniciar' : step === 0 ? 'Ver llegadas' : 'Siguiente'}
      </FigStepButton>
    </div>
  )
}
