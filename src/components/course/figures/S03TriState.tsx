'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../Figure'

/**
 * S03 — the row of doors, and the three ways out.
 *
 * The prose calls the guard clauses "una fila de puertas" and separately
 * teaches accept / reject / review. Sending three different records through
 * shows what prose has to claim: the record leaves by the *first* door that
 * opens, so a single dominant branch decides the outcome and the later
 * questions are never asked.
 */
export function S03TriState({ title }: { title: string }) {
  // Each record stops at a different door — that is the point of the exercise.
  const RECORDS = [
    { name: 'monto ausente', stops: 0, out: 'review' },
    { name: 'monto = -5', stops: 1, out: 'reject' },
    { name: 'monto = 120', stops: 2, out: 'accept' },
  ]
  const { step, next, transition } = useFigureSteps(RECORDS.length)
  const record = RECORDS[step]

  const doors = [
    { q: '¿falta el campo?', out: 'review' },
    { q: '¿fuera de rango?', out: 'reject' },
    { q: '¿valor permitido?', out: 'accept' },
  ]
  const laneY = 62
  const doorW = 132
  const doorH = 44
  const gap = 28
  const startX = 96

  const exitColor: Record<string, string> = {
    accept: 'var(--chart-2)',
    reject: 'var(--chart-4)',
    review: 'var(--chart-3)',
  }
  const tokenX = startX + record.stops * (doorW + gap) + doorW / 2

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} 236`}>
        <FigArrowDefs id="s03-arrow" />

        <FigText x={24} y={26} anchor="start" weight={600}>
          {record.name}
        </FigText>

        <FigArrow x1={40} y1={laneY + doorH / 2} x2={startX - 8} y2={laneY + doorH / 2} markerId="s03-arrow" />

        {doors.map((d, i) => {
          const x = startX + i * (doorW + gap)
          const cx = x + doorW / 2
          const isLast = i === doors.length - 1
          const reached = i <= record.stops
          const exits = i === record.stops
          return (
            <g key={i}>
              <FigBox
                x={x}
                y={laneY}
                w={doorW}
                h={doorH}
                fill={reached ? 'var(--muted)' : 'var(--card)'}
                stroke={exits ? exitColor[d.out] : 'var(--border)'}
              />
              <FigText
                x={cx}
                y={laneY + doorH / 2}
                size={FIG.microSize}
                opacity={reached ? 1 : 0.45}
              >
                {d.q}
              </FigText>

              {exits && (
                <FigArrow
                  x1={cx}
                  y1={laneY + doorH + 4}
                  x2={cx}
                  y2={laneY + doorH + 46}
                  markerId="s03-arrow"
                  stroke={exitColor[d.out]}
                />
              )}
              <FigBox
                x={cx - 52}
                y={laneY + doorH + 50}
                w={104}
                h={34}
                fill="var(--card)"
                stroke={exits ? exitColor[d.out] : 'var(--border)'}
              />
              <FigText
                x={cx}
                y={laneY + doorH + 67}
                mono
                weight={600}
                fill={exits ? exitColor[d.out] : 'var(--muted-foreground)'}
                opacity={exits ? 1 : 0.5}
              >
                {d.out}
              </FigText>

              {!isLast && (
                <FigArrow
                  x1={x + doorW}
                  y1={laneY + doorH / 2}
                  x2={x + doorW + gap - 8}
                  y2={laneY + doorH / 2}
                  markerId="s03-arrow"
                />
              )}
            </g>
          )
        })}

        {/* the record itself, sitting at the door that decided it */}
        <motion.circle
          cx={tokenX}
          cy={laneY + doorH / 2}
          r={8}
          fill={exitColor[record.out]}
          initial={false}
          animate={{ cx: tokenX }}
          transition={transition}
        />

        <FigText x={FIG.width / 2} y={220} size={FIG.microSize} fill="var(--muted-foreground)">
          Sale por la primera puerta que se abre. Nunca por dos.
        </FigText>
      </FigSvg>

      <FigStepButton onClick={next} data-testid="s03-step">
        Enviar otro registro
      </FigStepButton>
      <span className="ml-3 text-[13px] text-muted-foreground">
        Las puertas grises no se llegaron a preguntar.
      </span>
    </div>
  )
}
