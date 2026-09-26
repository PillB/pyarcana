'use client'

import { motion } from 'framer-motion'
import { FIG, FigSvg, FigText, FigStepButton, useFigureSteps } from '../../Figure'
import { INK, tintOf, type FoldRole, type FoldsData, wrapLines } from './types'

/**
 * Cross-validation as a grid: one row per fold, one column per group, and the validation cell
 * moving along the diagonal.
 *
 * In prose, "each fold is the validation part once while the rest train" asks the reader to run
 * k splits in their head at once. Drawn, it is k rows read top to bottom, and the property the
 * section cares about — no group is on both sides of the same row — is visible in each row.
 *
 * Every cell carries its role as a word, not only as a tint: the chart palette is not
 * contrast-safe for text or edges (INK), and colour alone would lose the meaning for part of
 * the audience. Rows appear one at a time, each readable standing still.
 */
export function FoldsFigure({ title, data }: { title: string; data: FoldsData }) {
  const headLines = wrapLines(data.headline, FIG.width - 48, 8.2)
  const headBlock = (headLines.length - 1) * 20
  const noteLines = data.note ? wrapLines(data.note, FIG.width - 48) : []
  const summaryLines = data.summary ? wrapLines(data.summary, FIG.width - 48) : []
  const n = data.rows.length
  const { step, next, reset, transition, isLast } = useFigureSteps(n + 1)

  const hasScore = data.rows.some((r) => r.score !== undefined)
  const labelW = 24 + Math.max(...data.rows.map((r) => Math.ceil(r.label.length * 7.4))) + 12
  const scoreW = hasScore ? Math.max(64, Math.ceil((data.scoreLabel ?? '').length * 7.4) + 16) : 0
  const gridX = labelW
  const gridW = FIG.width - 24 - labelW - scoreW
  const cellW = gridW / data.groups.length
  const cellH = 30
  const headY = 70 + headBlock
  const top = headY + 16
  const bottom = top + n * cellH
  const summaryY = bottom + 24
  const noteY = summaryY + (summaryLines.length ? summaryLines.length * 18 + 8 : 0)
  const height = noteY + (noteLines.length ? noteLines.length * 18 + 8 : 4)

  const fill = (role: FoldRole) => (role === 'valid' ? tintOf(4) : role === 'train' ? tintOf(2) : 'var(--muted)')
  const opacity = (role: FoldRole) => (role === 'skip' ? 1 : INK.tintFillOpacity)
  const word = (role: FoldRole) => (role === 'skip' ? '—' : role)

  return (
    <div>
      <FigSvg title={title} viewBox={`0 0 ${FIG.width} ${height}`}>
        {headLines.map((l, i) => (
          <FigText key={l} x={24} y={26 + i * 20} anchor="start" weight={600}>
            {l}
          </FigText>
        ))}

        {data.groups.map((g, c) => (
          <FigText key={`g-${g}`} x={gridX + c * cellW + cellW / 2} y={headY} size={FIG.microSize} weight={600} mono fill={INK.label}>
            {g}
          </FigText>
        ))}
        {hasScore ? (
          <FigText x={gridX + gridW + scoreW / 2} y={headY} size={FIG.microSize} weight={600} fill={INK.label}>
            {data.scoreLabel ?? ''}
          </FigText>
        ) : null}

        {data.rows.map((r, i) => {
          const y = top + i * cellH
          return (
            <motion.g key={r.label} initial={false} animate={{ opacity: step > i ? 1 : 0.18 }} transition={transition}>
              <FigText x={24} y={y + cellH / 2} anchor="start" size={FIG.microSize} fill={INK.muted}>
                {r.label}
              </FigText>
              {r.roles.map((role, c) => (
                <g key={`${r.label}-${c}`}>
                  <rect
                    x={gridX + c * cellW + 2}
                    y={y + 2}
                    width={cellW - 4}
                    height={cellH - 4}
                    rx={FIG.radius}
                    fill={fill(role)}
                    fillOpacity={opacity(role)}
                    stroke={INK.outline}
                    strokeWidth={role === 'valid' ? FIG.strokeBold : FIG.stroke}
                  />
                  <FigText
                    x={gridX + c * cellW + cellW / 2}
                    y={y + cellH / 2}
                    size={FIG.microSize}
                    mono
                    weight={role === 'valid' ? 700 : 400}
                    fill={INK.label}
                  >
                    {word(role)}
                  </FigText>
                </g>
              ))}
              {r.score !== undefined ? (
                <FigText x={gridX + gridW + scoreW / 2} y={y + cellH / 2} size={FIG.microSize} mono weight={600} fill={INK.label}>
                  {r.score}
                </FigText>
              ) : null}
            </motion.g>
          )
        })}

        {summaryLines.map((l, i) => (
          <motion.g key={l} initial={false} animate={{ opacity: isLast ? 1 : 0.18 }} transition={transition}>
            <FigText x={24} y={summaryY + i * 18} anchor="start" size={FIG.microSize} weight={600} fill={INK.label}>
              {l}
            </FigText>
          </motion.g>
        ))}
        {noteLines.map((l, i) => (
          <FigText key={l} x={24} y={noteY + i * 18} anchor="start" size={FIG.microSize} fill={INK.muted}>
            {l}
          </FigText>
        ))}
      </FigSvg>

      <FigStepButton onClick={isLast ? reset : next}>{isLast ? 'Reiniciar' : 'Siguiente'}</FigStepButton>
    </div>
  )
}
