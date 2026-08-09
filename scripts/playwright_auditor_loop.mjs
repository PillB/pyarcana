/**
 * Orchestrator: Playwright visible crawl → lesson auditor → optional auto-strip
 * of banned boilerplate tails → re-crawl worst sections once.
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/playwright_auditor_loop.mjs
 *   FROM=36 TO=42 BASE_URL=http://localhost:3000 node scripts/playwright_auditor_loop.mjs
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FROM = process.env.FROM || '1'
const TO = process.env.TO || '52'
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = path.join(ROOT, 'course-state/curriculum_hardening/audits')
const SCRATCH =
  process.env.SCRATCH ||
  '/var/folders/46/hqp40jys76g696ycvflt54mc0000gn/T/grok-goal-b11e0e04dcbc/implementer'

function run(cmd, args, env = {}) {
  console.log('>', cmd, args.join(' '))
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, BASE_URL: BASE, FROM, TO, ...env },
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
  if (r.stdout) process.stdout.write(r.stdout.slice(-4000))
  if (r.stderr) process.stderr.write(r.stderr.slice(-2000))
  if (r.status !== 0) throw new Error(`${cmd} exited ${r.status}`)
  return r
}

function stripBoilerplateInSources() {
  const sectionsDir = path.join(ROOT, 'src/lib/course/sections')
  const patterns = [
    /\s*En el laboratorio sintético(?: Red Andina \(Lima\))? documentas entrada, salida, error y dueño:[^.]*\./gi,
    /\s*documentas entrada, salida, error y dueño:[^.]*\./gi,
    /\s*Documenta contrato, evidencia y límites en el laboratorio sintético[^.]*\./gi,
    /\s*sin PII real, sin secretos en logs y con fail-closed cuando falta evidencia(?: o el contrato no cuadra)?\./gi,
  ]
  let total = 0
  for (const name of fs.readdirSync(sectionsDir).filter((f) => /^s\d{2}-.*\.ts$/.test(f))) {
    const fp = path.join(sectionsDir, name)
    let t = fs.readFileSync(fp, 'utf8')
    const orig = t
    for (const re of patterns) t = t.replace(re, '')
    t = t.replace(/ {2,}/g, ' ')
    if (t !== orig) {
      fs.writeFileSync(fp, t)
      total++
      console.log('stripped boiler in', name)
    }
  }
  return total
}

function main() {
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(SCRATCH, { recursive: true })

  // Pass 1: crawl
  run('node', [path.join(ROOT, 'scripts/playwright_visible_paragraphs.mjs')], { FROM, TO })
  // Pass 1: audit
  run('python3', [path.join(ROOT, 'scripts/lesson_auditor_agent.py'), '--from', FROM, '--to', TO])

  const summaryPath = path.join(OUT, 'AUDIT_SUMMARY.json')
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
  console.log('Audit pass1', summary.accept, summary.request_fix, summary.reject_hardening)

  const rejects = (summary.sections || []).filter(
    (s) => s.verdict === 'REJECT_HARDENING' || s.verdict === 'REQUEST_FIX'
  )

  if (summary.reject_hardening > 0) {
    console.log('REJECT_HARDENING detected → reporting only (no auto source mutation; set FORCE_BULK_REWRITE=1 to enable strip)')
    const n = process.env.FORCE_BULK_REWRITE === '1' ? stripBoilerplateInSources() : 0
    console.log('files stripped', n)
    // Re-crawl only rejected indices if possible
    const idxs = rejects.map((s) => s.index).sort((a, b) => a - b)
    if (idxs.length) {
      const from = String(idxs[0])
      const to = String(idxs[idxs.length - 1])
      run('node', [path.join(ROOT, 'scripts/playwright_visible_paragraphs.mjs')], {
        FROM: from,
        TO: to,
      })
      run('python3', [
        path.join(ROOT, 'scripts/lesson_auditor_agent.py'),
        '--from',
        from,
        '--to',
        to,
      ])
    }
  }

  const summary2 = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
  const report = {
    generated_at: new Date().toISOString(),
    base: BASE,
    from: FROM,
    to: TO,
    pass1: summary,
    pass2: summary2,
    note:
      'REQUEST_FIX for fragmented_prose alone is soft (UI headings). REJECT_HARDENING forces boiler strip.',
  }
  fs.writeFileSync(path.join(OUT, 'LOOP_REPORT.json'), JSON.stringify(report, null, 2))
  fs.writeFileSync(path.join(SCRATCH, 'auditor_loop_report.json'), JSON.stringify(report, null, 2))
  console.log('LOOP DONE', report.pass2)
}

main()
