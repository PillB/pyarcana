/**
 * Compare each complexity violation to the same named legacy function, not a
 * global count. A newly introduced complexity-20 function cannot be cancelled
 * out by deleting a different legacy complexity-17 function.
 */
export function complexityRegressions(baseline, current, ceiling) {
  if (!Array.isArray(baseline)) {
    throw new Error('Missing per-function complexity baseline; fail closed')
  }
  const known = new Map()
  for (const offender of baseline) {
    if (known.has(offender.key)) throw new Error(`Duplicate baseline identity: ${offender.key}`)
    known.set(offender.key, offender.score)
  }
  return current.filter((offender) =>
    offender.score > Math.max(ceiling, known.get(offender.key) ?? ceiling)
  )
}

export function complexityDebtReduced(baseline, current) {
  const currentScores = new Map(current.map((o) => [o.key, o.score]))
  return baseline.some((o) => (currentScores.get(o.key) ?? 0) < o.score)
}
