#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '../..')
const logsDir = path.join(root, 'course-state/e2e_max_logs')
const catalogPath = path.join(root, 'course-state/interaction_catalog.json')
const outPath = path.join(root, 'course-state/e2e_max_report.json')

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const logFiles = fs.existsSync(logsDir)
  ? fs.readdirSync(logsDir).filter((f) => f.endsWith('.log'))
  : []

const summary = {
  generated_at: new Date().toISOString(),
  catalog: catalog.totals,
  catalog_ok: catalog.ok,
  logs: {},
  pass_lines: 0,
  fail_lines: 0,
  shards: {},
}

for (const f of logFiles) {
  const text = fs.readFileSync(path.join(logsDir, f), 'utf8')
  const passed = (text.match(/(\d+) passed/g) || []).pop()
  const failed = (text.match(/(\d+) failed/g) || []).pop()
  const flaky = (text.match(/(\d+) flaky/g) || []).pop()
  summary.logs[f] = {
    bytes: text.length,
    last_passed: passed || null,
    last_failed: failed || null,
    last_flaky: flaky || null,
    has_error: /Error:|failed/i.test(text),
  }
  if (f.startsWith('shard_')) {
    summary.shards[f] = summary.logs[f]
  }
}

// Also read playwright json if present
const pwJson = path.join(root, 'course-state/e2e_max_playwright.json')
if (fs.existsSync(pwJson)) {
  try {
    const j = JSON.parse(fs.readFileSync(pwJson, 'utf8'))
    summary.playwright_json = {
      suites: j.suites?.length,
      stats: j.stats,
    }
  } catch {
    summary.playwright_json = { parse_error: true }
  }
}

summary.ok =
  catalog.ok &&
  Object.values(summary.logs).every(
    (l) => !l.last_failed || l.last_failed.startsWith('0 failed')
  )

// softer: ok if no "  X failed" with X>0 in any final summary
let hardFails = 0
for (const f of logFiles) {
  const text = fs.readFileSync(path.join(logsDir, f), 'utf8')
  const m = text.match(/\n\s+(\d+) failed\b/g)
  if (m) {
    for (const line of m) {
      const n = Number(line.match(/(\d+)/)[1])
      if (n > 0) hardFails += n
    }
  }
}
summary.hard_fail_count = hardFails
summary.ok = catalog.ok && hardFails === 0

fs.writeFileSync(outPath, JSON.stringify(summary, null, 2))
console.log(JSON.stringify(summary, null, 2))
