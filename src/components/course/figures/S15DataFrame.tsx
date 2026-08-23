'use client'

import { FIG, FigSvg, FigBox, FigText } from '../Figure'

/**
 * S15 — a DataFrame is columns aligned by one Index, and each column has its
 * own promise.
 *
 * The prose already contains the sentence "un conjunto de columnas alineadas
 * por una misma fila de referencia" and, separately, the dtype contract. The
 * figure puts the Index and the dtypes on the same picture, which is where the
 * section's warning lands: the column that quietly became text.
 */
export function S15DataFrame({ title }: { title: string }) {
  const cols = [
    { name: 'cliente_id', dtype: 'str', tint: 'var(--chart-1)', vals: ['C001', 'C002', 'C003'] },
    { name: 'monto', dtype: 'str', tint: 'var(--chart-4)', vals: ['15,50', '8,00', '22,10'] },
    { name: 'fecha', dtype: 'datetime64', tint: 'var(--chart-2)', vals: ['2024-01-05', '2024-01-06', '2024-01-08'] },
  ]
  const idxW = 44
  const colW = 148
  const rowH = 30
  const gridX = 20
  const headY = 62
  const bodyY = headY + 34

  return (
    <FigSvg title={title} viewBox={`0 0 ${FIG.width} 250`}>
      <FigText x={20} y={22} anchor="start" weight={600}>
        Columnas alineadas por un mismo Index
      </FigText>

      {/* Index column — drawn apart so it reads as the spine, not a data column */}
      <FigText x={gridX + idxW / 2} y={headY + 16} size={FIG.microSize} fill="var(--muted-foreground)">
        Index
      </FigText>
      {[0, 1, 2].map((r) => (
        <g key={`i${r}`}>
          <FigBox
            x={gridX}
            y={bodyY + r * rowH}
            w={idxW}
            h={rowH}
            fill="var(--muted)"
            stroke="var(--border)"
          />
          <FigText x={gridX + idxW / 2} y={bodyY + r * rowH + rowH / 2} size={FIG.microSize} mono>
            {r}
          </FigText>
        </g>
      ))}

      {cols.map((c, i) => {
        const x = gridX + idxW + 8 + i * colW
        const cx = x + colW / 2
        const suspect = c.name === 'monto'
        return (
          <g key={c.name}>
            <FigText x={cx} y={headY} size={FIG.microSize} mono weight={600}>
              {c.name}
            </FigText>
            <FigText x={cx} y={headY + 17} size={FIG.microSize} mono fill={c.tint}>
              {c.dtype}
            </FigText>
            {c.vals.map((v, r) => (
              <g key={r}>
                <FigBox
                  x={x}
                  y={bodyY + r * rowH}
                  w={colW - 8}
                  h={rowH}
                  fill="var(--card)"
                  stroke={suspect ? c.tint : 'var(--border)'}
                  dashed={suspect}
                />
                <FigText
                  x={cx - 4}
                  y={bodyY + r * rowH + rowH / 2}
                  size={FIG.microSize}
                  mono
                  fill={suspect ? c.tint : 'var(--foreground)'}
                >
                  {v}
                </FigText>
              </g>
            ))}
          </g>
        )
      })}

      <FigText x={20} y={230} anchor="start" size={FIG.microSize} fill="var(--chart-4)">
        La coma decimal dejó `monto` como texto. Nada falló; los totales están mal.
      </FigText>
    </FigSvg>
  )
}
