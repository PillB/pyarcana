'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../../Figure'
import { INK, tintOf, wrapLines, type FlowData } from './types'

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
  // A stage's second line has to wrap, not spill. SVG text does not clip: "con una codificación"
  // measured 133px inside a 116px box in S07 and simply overflowed into the stage beside it,
  // with nothing failing. Wrapping keeps the words the section chose; the box grows only when
  // some stage actually needs the second line.
  const subLines = data.stages.map((s) => (s.sub ? wrapLines(s.sub, boxW - 8, 7.4).slice(0, 2) : []))
  const subRows = Math.max(1, ...subLines.map((l) => l.length))
  // 17, not 14: at the 14px label size two lines set 14px apart have touching boxes, and the
  // render probe reads that as an overlap ("train, test," over "cross_split", S30). The box
  // grows by the same step so the second line still sits inside it.
  const subLead = 17
  const boxH = 62 + (subRows - 1) * subLead
  const topY = 92 + headBlock
  const xOf = (i: number) => marginX + i * (boxW + gap)

  const height = 168 + headBlock + boxH + Math.max(1, outLines.length) * 18 + 24

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
                stroke={shown ? tintOf(s.tint) : INK.outline}
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
              {subLines[i].map((line, li) => (
                <FigText
                  key={line}
                  x={xOf(i) + boxW / 2}
                  y={topY + 44 + li * subLead}
                  size={FIG.microSize}
                  fill="var(--muted-foreground)"
                >
                  {line}
                </FigText>
              ))}
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
              stroke="var(--fig-1)"
              strokeWidth={FIG.strokeBold}
              strokeDasharray="5 4"
            />
            {(() => {
              const label = data.boundaryLabel ?? 'frontera'
              const half = (label.length * 7.2) / 2
              const cx = xOf(data.boundaryAfter) + boxW + gap / 2
              // Clamped so a long caption on a boundary near either edge stays
              // on the canvas instead of being cut in half.
              const x = Math.min(FIG.width - half - 8, Math.max(half + 8, cx))
              return (
                <FigText x={x} y={topY - 34} size={FIG.microSize} fill="var(--fig-1)" weight={600}>
                  {label}
                </FigText>
              )
            })()}
          </g>
        ) : null}

        {data.outcome ? (
          <motion.g initial={false} animate={{ opacity: isLast ? 1 : 0 }} transition={transition}>
            {outLines.map((l, i) => (
              <FigText key={l} x={marginX} y={topY + boxH + 50 + i * 18} anchor="start" size={FIG.microSize} fill="var(--muted-foreground)">
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
