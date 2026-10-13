import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  COURSE_SECTION_COUNT,
  downloadName,
  issuesPerHour,
  parseQaStats,
  qaExportPath,
  qaStatsPath,
  parseReportList,
  reportsPath,
} from '@/lib/cloud/admin-api'
import { fetchExport } from '@/lib/cloud/admin-download'
import { apiUrl } from '@/lib/cloud/api'
import { COURSE_SECTIONS } from '@/lib/course'
import { QaStatsView } from '@/components/account/admin/AdminQa'
import { ContextList } from '@/components/account/ReportDetail'
import { t } from '@/lib/i18n'
import { API_BASE, APP_ORIGIN, NOW, api, createHarness, seedAccount, sql } from '../../../../workers/billing/tests/fixtures.mjs'
import { handleRequest } from '../../../../workers/billing/src/index.mjs'

// The admin "QA" tab (owner request 5 Oct 2026). The answers here come from the real worker
// (workers/billing/src/qa-admin.mjs) run in-process, so the parser is checked against the contract
// itself, not against a copy of it.

async function seeded() {
  const { env } = await createHarness()
  const admin = await seedAccount(env, { email: 'owner@gmail.com', method: 'google' })
  const tester = await seedAccount(env, { email: 'qa@example.test' })
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", tester.account.id, NOW - 10)
  const context = { path: '/', hash: '#setup', sectionId: 'setup', sectionIndex: 1, viewport: { width: 390, height: 844 }, userAgent: 'UA', language: 'es', deploymentSha: 'abc1234' }
  const report = { source: 'qa_harness', category: 'functionality', cause: 'logic-state', severity: 'high', title: '=SUM(A1)', description: 'd', steps: 's', expected: 'e', actual: 'a', improvement: '', reporterAlias: 'Lucía', context }
  assert.equal((await api(env, 'POST', '/v1/reports', { cookie: tester.token, body: report })).status, 201)
  const session = { sessionId: 'qs_AAAAAAAAAAAAAAAAAAAA', alias: 'Lucía', startedAt: NOW - 7200, lastActiveAt: NOW - 60, activeSeconds: 3600, sections: { setup: 3000, basics: 30 }, issuesCreated: 3, issuesSent: 1, deploymentSha: 'abc1234', browser: 'safari' }
  assert.equal((await api(env, 'POST', '/v1/qa/sessions', { cookie: tester.token, body: session })).status, 200)
  // fetch as the browser would send it: the API origin, the cookie, the app's Origin header.
  const doFetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers)
    headers.set('Origin', APP_ORIGIN)
    headers.set('Cookie', `__Host-pa_session=${admin.token}`)
    return handleRequest(new Request(String(input), { ...init, headers }), env, { now: NOW, log: () => {} })
  }) as typeof fetch
  return { env, admin, doFetch }
}

test('the stats answer from the worker parses whole; junk is dropped and missing numbers read as zero', async () => {
  const { admin, env } = await seeded()
  const r = await api(env, 'GET', qaStatsPath(), { cookie: admin.token })
  assert.equal(r.status, 200)
  const s = parseQaStats(r.body)
  assert.equal(s.reports.total, 1)
  assert.deepEqual(s.reports.severity, [{ key: 'high', count: 1 }])
  assert.deepEqual(s.reports.tester, [{ key: 'Lucía', count: 1 }])
  assert.deepEqual(s.sessions.sections, [{ key: 'setup', seconds: 3000 }, { key: 'basics', seconds: 30 }])
  assert.equal(s.sessions.perTester[0].email, 'qa@example.test')
  assert.equal(s.sessions.perTester[0].activeSeconds, 3600)
  const junk = parseQaStats({ reports: { total: -3, severity: [{ key: 'x', count: 'nine' }, 'bad'] }, sessions: { sections: [{ key: 5, seconds: 2 }], perTester: [{ alias: 'no id' }] } })
  assert.equal(junk.reports.total, 0)
  assert.deepEqual(junk.reports.severity, [{ key: 'x', count: 0 }])
  assert.deepEqual(junk.sessions.sections, [])
  assert.deepEqual(junk.sessions.perTester, [])
  assert.deepEqual(parseQaStats(null).reports.day, [])
})

test('paths carry only well-formed days and known formats; the download name is the worker\'s or a safe default', () => {
  assert.equal(qaStatsPath({ from: '2026-10-01', to: '2026-10-04' }), '/v1/admin/qa/stats?from=2026-10-01&to=2026-10-04')
  assert.equal(qaStatsPath({ from: '../x', to: '' }), '/v1/admin/qa/stats')
  assert.equal(qaExportPath('json', { from: '2026-10-01' }), '/v1/admin/qa/export?format=json&from=2026-10-01')
  assert.equal(qaExportPath('xml' as 'csv'), '/v1/admin/qa/export?format=csv')
  for (const p of [qaStatsPath({ from: '2026-10-01' }), qaExportPath('csv', { to: '2026-10-04' })]) assert.doesNotThrow(() => apiUrl(API_BASE, p))
  assert.equal(downloadName('attachment; filename="pyarcana-qa-2026-10-04.csv"', 'csv'), 'pyarcana-qa-2026-10-04.csv')
  assert.equal(downloadName('attachment; filename="../../etc/passwd"', 'json'), 'pyarcana-qa.json')
  assert.equal(downloadName(null, 'csv'), 'pyarcana-qa.csv')
  assert.equal(issuesPerHour(3, 3600), 3)
  assert.equal(issuesPerHour(1, 0), null)
  assert.equal(COURSE_SECTION_COUNT, COURSE_SECTIONS.length, 'coverage is out of the real number of sections')
})

test('downloads go through the real worker: CSV and JSON files, the partial flag read, refusals give the reason', async () => {
  const { doFetch } = await seeded()
  const csv = await fetchExport(API_BASE, qaExportPath('csv'), 'csv', doFetch)
  assert.ok(csv.ok)
  assert.match(csv.name, /^pyarcana-qa-\d{4}-\d\d-\d\d\.csv$/)
  assert.equal(csv.partial, false)
  const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(await csv.blob.arrayBuffer())
  assert.ok(text.startsWith('﻿"id"'))
  assert.ok(text.includes('"\'=SUM(A1)"'), 'formula disarmed')
  const json = await fetchExport(API_BASE, qaExportPath('json'), 'json', doFetch)
  assert.ok(json.ok)
  const pkg = JSON.parse(await json.blob.text())
  assert.equal(pkg.schemaVersion, 'pyarcana.qa.v1')
  assert.equal(pkg.sessions[0].activeSeconds, 3600)
  const bad = await fetchExport(API_BASE, '/v1/admin/qa/export?format=csv&from=2027-02-01&to=2027-01-01', 'csv', doFetch)
  assert.deepEqual(bad, { ok: false, status: 400, reason: 'bad_range' })
  const offline = await fetchExport(API_BASE, qaExportPath('csv'), 'csv', (() => Promise.reject(new TypeError('offline'))) as typeof fetch)
  assert.deepEqual(offline, { ok: false, status: 0, reason: 'network' })
  const slow = await fetchExport(API_BASE, qaExportPath('csv'), 'csv', ((_: unknown, init?: RequestInit) => new Promise((_r, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted'))))) as typeof fetch, 5)
  assert.deepEqual(slow, { ok: false, status: 0, reason: 'timeout' })
})

test('the tab shows the summary, coverage out of the course, the tables and the per-tester rows', async () => {
  const { admin, env } = await seeded()
  const s = parseQaStats((await api(env, 'GET', qaStatsPath(), { cookie: admin.token })).body)
  const html = renderToStaticMarkup(h(QaStatsView, { s }))
  assert.ok(html.includes(t('adm.qa.sum.coverageValue', 'es-PE').replace('{n}', '1').replace('{total}', String(COURSE_SECTION_COUNT))), 'setup counts, basics (30 s) does not')
  assert.match(html, /data-testid="qa-by-severity"/)
  assert.match(html, /data-testid="qa-section-time"/)
  assert.match(html, /data-testid="qa-testers"/)
  assert.ok(html.includes('qa@example.test'))
  assert.ok(html.includes('1 h 00 min'))
  assert.ok(html.includes('3 / 1'), 'issues created / sent')
  const empty = renderToStaticMarkup(h(QaStatsView, { s: parseQaStats({}) }))
  assert.ok(empty.includes(t('adm.qa.none', 'es-PE')))
})

test('the report list filters by source and tester on the worker, and the detail names tester, cause, source, screenshots', async () => {
  const { admin, env } = await seeded()
  const list = async (f: Parameters<typeof reportsPath>[1]) => parseReportList((await api(env, 'GET', reportsPath('admin', f, null), { cookie: admin.token })).body).reports
  assert.equal((await list({ source: 'qa_harness', tester: ' Lucía ' })).length, 1)
  assert.equal((await list({ source: 'feedback' })).length, 0)
  assert.equal((await list({ tester: 'Otro' })).length, 0)
  assert.equal(reportsPath('admin', { source: 'email' }, null), '/v1/admin/reports?limit=50', 'an unknown source is dropped, not sent')
  const [report] = await list({})
  const tr = (k: string) => t(k, 'es-PE')
  const html = renderToStaticMarkup(h(ContextList, { report: { ...report, attachmentCount: 2 }, tr }))
  for (const text of [t('qasite.ctx.tester', 'es-PE'), 'Lucía', 'Lógica / estado', 'qa_harness', t('qasite.ctx.shots', 'es-PE')]) assert.ok(html.includes(text), text)
  assert.ok(!renderToStaticMarkup(h(ContextList, { report, tr })).includes(t('qasite.ctx.shots', 'es-PE')), 'no screenshot line without screenshots')
})
