'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../../Figure'
import { tintOf, wrapLines, type FlowData } from './types'

/**
 * A pipeline, walked one stage at a time.
 *
 * Prose has to name stages in sequence, which is the one thing it does badly:
 * by the fourth clause the reader has lost the first. Stepping the walk means
 * the learner sees each stage arrive against the ones already there, and — the
 * part that matters — sees where the boundary sits.
 */
export function FlowFigure({ title, data, idPrefix }: { title: string; data: FlowData; idPrefix: string }) {
  const n = data.stages.length
  const { step, next, reset, transition, isLast } = useFigureSteps(n + 1)

  // Stages share the canvas evenly; the box shrinks as the pipeline lengthens
  // so a six-stage flow never runs off the 560 canvas.
  const marginX = 24
  const headLines = wrapLines(data.headline, FIG.width - marginX * 2, 8.2)
  const outLines = data.outcome ? wrapLines(data.outcome, FIG.width - marginX * 2) : []
  const headBlock = (headLines.length - 1) * 20
  const gap = n > 4 ? 10 : 16
  const usable = FIG.width - marginX * 2
  const boxW = Math.floor((usable - gap * (n - 1)) / n)
  const boxH = 62
  const topY = 92 + headBlock
  const xOf = (i: number) => marginX + i * (boxW + gap)

  const height = 208 + headBlock + outLines.length * 18

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
        <FigArrowDefs id={`${idPrefix}-arrow`} />

        {headLines.map((l, i) => (
          <FigText key={l} x={marginX} y={26 + i * 20} anchor="start" weight={600}>
            {l}
          </FigText>
        ))}

        {data.stages.map((s, i) => {
          const shown = step > i
          return (
            <motion.g
              key={s.label}
              initial={false}
              animate={{ opacity: shown ? 1 : 0.22 }}
              transition={transition}
            >
              <FigBox
                x={xOf(i)}
                y={topY}
                w={boxW}
                h={boxH}
                fill={shown ? 'var(--card)' : 'var(--muted)'}
                stroke={shown ? tintOf(s.tint) : 'var(--border)'}
              />
              <FigText
                x={xOf(i) + boxW / 2}
                y={topY + (s.sub ? 24 : boxH / 2)}
                size={FIG.microSize}
                weight={600}
                fill={shown ? tintOf(s.tint) : 'var(--muted-foreground)'}
              >
                {s.label}
              </FigText>
              {s.sub ? (
                <FigText
                  x={xOf(i) + boxW / 2}
                  y={topY + 44}
                  size={FIG.microSize}
                  fill="var(--muted-foreground)"
                >
                  {s.sub}
                </FigText>
              ) : null}
              {i < n - 1 ? (
                <FigArrow
                  x1={xOf(i) + boxW + 1}
                  y1={topY + boxH / 2}
                  x2={xOf(i + 1) - 2}
                  y2={topY + boxH / 2}
                  markerId={`${idPrefix}-arrow`}
                />
              ) : null}
            </motion.g>
          )
        })}

        {/* The boundary is the teaching point in most of these, so it is drawn
            full height and labelled, not implied by a gap. */}
        {typeof data.boundaryAfter === 'number' ? (
          <g>
            <line
              x1={xOf(data.boundaryAfter) + boxW + gap / 2}
              y1={topY - 22}
              x2={xOf(data.boundaryAfter) + boxW + gap / 2}
              y2={topY + boxH + 22}
              stroke="var(--chart-1)"
              strokeWidth={FIG.strokeBold}
              strokeDasharray="5 4"
            />
            <FigText
              x={xOf(data.boundaryAfter) + boxW + gap / 2}
              y={topY - 34}
              size={FIG.microSize}
              fill="var(--chart-1)"
              weight={600}
            >
              {data.boundaryLabel ?? 'frontera'}
            </FigText>
          </g>
        ) : null}

        {data.outcome ? (
          <motion.g initial={false} animate={{ opacity: isLast ? 1 : 0 }} transition={transition}>
            {outLines.map((l, i) => (
              <FigText key={l} x={marginX} y={topY + boxH + headBlock + 50 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
                {l}
              </FigText>
            ))}
          </motion.g>
        ) : null}
      </FigSvg>

      <FigStepButton onClick={isLast ? reset : next}>
        {isLast ? 'Reiniciar' : step === 0 ? 'Recorrer el flujo' : 'Siguiente etapa'}
      </FigStepButton>
    </div>
  )
}
