'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../../Figure'
import { tintOf, type DecisionData , wrapLines } from './types'

/**
 * A guard-clause funnel, evaluated in order.
 *
 * The thing prose cannot convey about ordered guards is that order is the
 * semantics: the same set of conditions in a different sequence classifies the
 * same input differently. Falling through the tests one at a time makes the
 * "first match wins" rule visible instead of stated.
 */
export function DecisionFigure({ title, data, idPrefix }: { title: string; data: DecisionData; idPrefix: string }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const n = data.branches.length
  const { step, next, reset, transition, isLast } = useFigureSteps(n + 1)

  const rowH = 40
  const topY = 78 + headBlock
  const testX = 150
  const testW = 236
  const resultX = 410
  const height = topY + n * rowH + (noteLines.length ? 54 + (noteLines.length - 1) * 18 : 30)

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
        <FigArrowDefs id={`${idPrefix}-arrow`} />

        <FigText x={24} y={26} anchor="start" weight={600}>
          {data.headline}
        </FigText>

        <FigBox x={24} y={topY} w={104} h={rowH - 8} fill="var(--muted)" />
        <FigText x={76} y={topY + (rowH - 8) / 2} size={FIG.microSize} mono>
          {data.input}
        </FigText>

        {data.branches.map((b, i) => {
          const y = topY + i * rowH
          const reached = step > i
          const matched = step === i + 1
          return (
            <motion.g key={b.test} initial={false} animate={{ opacity: reached ? 1 : 0.25 }} transition={transition}>
              <FigBox
                x={testX}
                y={y}
                w={testW}
                h={rowH - 8}
                fill={matched ? 'var(--card)' : 'var(--muted)'}
                stroke={matched ? tintOf(b.tint) : 'var(--border)'}
              />
              <FigText x={testX + 10} y={y + (rowH - 8) / 2} anchor="start" size={FIG.microSize} mono>
                {b.test}
              </FigText>
              <FigArrow
                x1={testX + testW + 2}
                y1={y + (rowH - 8) / 2}
                x2={resultX - 4}
                y2={y + (rowH - 8) / 2}
                markerId={`${idPrefix}-arrow`}
              />
              <FigText
                x={resultX}
                y={y + (rowH - 8) / 2}
                anchor="start"
                size={FIG.microSize}
                weight={600}
                fill={tintOf(b.tint)}
              >
                {b.result}
              </FigText>
              {/* the fall-through line: only drawn once this test has been passed over */}
              {i < n - 1 ? (
                <line
                  x1={testX - 12}
                  y1={y + rowH - 8}
                  x2={testX - 12}
                  y2={y + rowH}
                  stroke="var(--border)"
                  strokeWidth={FIG.stroke}
                />
              ) : null}
            </motion.g>
          )
        })}

        <line
          x1={testX - 12}
          y1={topY + (rowH - 8) / 2}
          x2={testX - 12}
          y2={topY + (n - 1) * rowH + (rowH - 8) / 2}
          stroke="var(--border)"
          strokeWidth={FIG.stroke}
        />
        <line x1={128} y1={topY + (rowH - 8) / 2} x2={testX - 2} y2={topY + (rowH - 8) / 2} stroke="var(--border)" strokeWidth={FIG.stroke} />

        {noteLines.map((l, i) => (
        <FigText key={l} x={24} y={height - 18 - (noteLines.length - 1) * 18 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
          {l}
        </FigText>
      ))}
      </FigSvg>

      <FigStepButton onClick={isLast ? reset : next}>
        {isLast ? 'Reiniciar' : step === 0 ? 'Evaluar en orden' : 'Siguiente guarda'}
      </FigStepButton>
    </div>
  )
}
