// Falsification harness for the convergence counting in s03_redteam_plan.js.
// Replays the exact quiet/errored arithmetic against scripted agent outcomes.
const DIMS = 12
function run(rounds, { fixed }) {
  const seen = new Set(); let quiet = 0, r = 0, allDead = false, reviserDied = false
  for (const spec of rounds) {
    r += 1
    const results = Array.from({ length: DIMS }, (_, i) => (i < spec.dead ? null : { findings: spec.findings || [] }))
    const errored = results.filter(x => x === null).length
    const found = results.filter(Boolean).flatMap(x => x.findings)
    if (fixed && errored === DIMS) { allDead = true; break }
    const fresh = found.filter(f => !seen.has(f.k)); fresh.forEach(f => seen.add(f.k))
    const real = fresh.filter(f => f.sev !== 'minor')
    if (!fresh.length) { quiet = fixed && errored ? 0 : quiet + 1; continue }
    quiet = ((real.length || (fixed && errored)) ? 0 : quiet + 1)
    if (spec.reviserDead) { if (fixed) { reviserDied = true; break } }
  }
  return { converged: fixed ? (quiet >= 2 && !allDead && !reviserDied) : quiet >= 2, ended_on_agent_failure: allDead || reviserDied }
}
const REAL = [ { dead: 3, findings: [{ k: 'a', sev: 'major' }], reviserDead: true }, { dead: 12 }, { dead: 12 } ]
console.log('the 2026-09-28 run, old logic:', run(REAL, { fixed: false }))
console.log('the 2026-09-28 run, fixed    :', run(REAL, { fixed: true }))
const GENUINE = [ { dead: 0, findings: [{ k: 'a', sev: 'major' }] }, { dead: 0, findings: [] }, { dead: 0, findings: [] } ]
console.log('genuinely quiet rounds, fixed:', run(GENUINE, { fixed: true }))
const PARTIAL = [ { dead: 2, findings: [] }, { dead: 0, findings: [] }, { dead: 0, findings: [] } ]
console.log('one round part-dead then quiet:', run(PARTIAL, { fixed: true }))
