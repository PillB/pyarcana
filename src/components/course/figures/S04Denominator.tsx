'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigBox, FigText, FigArrow, FigArrowDefs, FigStepButton, useFigureSteps } from '../Figure'

/**
 * S04 — the conveyor, and the two counters that are not the same number.
 *
 * The section's hardest idea is arithmetic, not code: dividing by *procesadas*
 * instead of *intentadas* makes the rate improve every time a row fails early.
 * The trap is a process, so the learner runs it: six rows go in, one drops out
 * before the decision, and the two rates separate in front of them.
 *
 * Three states: loaded, one row dropped, rates computed.
 */
export function S04Denominator({ title }: { title: string }) {
  const { step, next, reset, transition } = useFigureSteps(3)
  const dropped = step >= 1
  const scored = step >= 2

  const beltY = 74
  const beltH = 40
  const boxW = 30
  const rows = [0, 1, 2, 3, 4, 5]
  const dropX = 34 + 4 * (boxW + 16) + boxW / 2

  const labels = ['Cargar el lote', 'Procesar', 'Reiniciar']

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} 272`}>
        <FigArrowDefs id="s04-arrow" />

        <FigText x={24} y={26} anchor="start" weight={600}>
          6 filas entran
        </FigText>

        <FigBox x={24} y={beltY} w={300} h={beltH} fill="var(--muted)" />
        {rows.map((i) => {
          const falls = i === 4 && dropped
          return (
            <motion.rect
              key={i}
              x={34 + i * (boxW + 16)}
              y={falls ? beltY + beltH + 12 : beltY + 5}
              width={boxW}
              height={beltH - 10}
              rx={FIG.radius}
              fill={falls ? 'var(--chart-4)' : 'var(--card)'}
              stroke={falls ? 'var(--chart-4)' : 'var(--border)'}
              strokeWidth={FIG.stroke}
              initial={false}
              animate={{ y: falls ? beltY + beltH + 12 : beltY + 5, opacity: falls ? 0.85 : 1 }}
              transition={transition}
            />
          )
        })}

        {dropped && (
          <>
            <FigArrow
              x1={dropX}
              y1={beltY + beltH + 4}
              x2={dropX}
              y2={beltY + beltH + 30}
              markerId="s04-arrow"
              stroke="var(--chart-4)"
            />
            <FigText x={dropX} y={beltY + beltH + 61} size={FIG.microSize} fill="var(--chart-4)">
              falla antes de decidir
            </FigText>
          </>
        )}

        <FigArrow x1={330} y1={beltY + beltH / 2} x2={356} y2={beltY + beltH / 2} markerId="s04-arrow" />
        <FigText x={366} y={beltY + beltH / 2} anchor="start" size={FIG.microSize}>
          {dropped ? '5 llegan a la decisión' : '6 intentadas'}
        </FigText>

        {/* the two denominators, side by side, so the difference is unarguable */}
        <FigBox x={24} y={196} w={250} h={48} fill="var(--card)" stroke="var(--chart-2)" />
        <FigText x={149} y={214} size={FIG.microSize} mono fill="var(--chart-2)" weight={600}>
          aceptadas / intentadas
        </FigText>
        <FigText x={149} y={232} size={FIG.microSize} fill="var(--muted-foreground)">
          {scored ? '3 / 6 = 50 %   ← honesto' : '· · ·'}
        </FigText>

        <FigBox x={290} y={196} w={246} h={48} fill="var(--card)" stroke="var(--chart-4)" dashed />
        <FigText x={413} y={214} size={FIG.microSize} mono fill="var(--chart-4)" weight={600}>
          aceptadas / procesadas
        </FigText>
        <FigText x={413} y={232} size={FIG.microSize} fill="var(--muted-foreground)">
          {scored ? '3 / 5 = 60 %   ← infla solo' : '· · ·'}
        </FigText>
      </FigSvg>

      <FigStepButton onClick={step === 2 ? reset : next} data-testid="s04-step">
        {labels[step]}
      </FigStepButton>
      <span className="ml-3 text-[13px] text-muted-foreground">
        {scored
          ? 'Los mismos 3 aciertos. Solo cambió contra cuántas filas se comparan.'
          : dropped
            ? 'Una fila salió del lote. ¿Contra cuántas se calcula la tasa?'
            : 'Seis filas intentadas, ninguna decidida todavía.'}
      </span>
    </div>
  )
}
