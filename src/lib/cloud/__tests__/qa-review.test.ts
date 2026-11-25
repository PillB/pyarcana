/**
 * Retest checks and the QA supervisor, client side (owner request 2026-11-19). The answers come
 * from the real worker run in-process (workers/billing/src), so the builders and parsers are checked
 * against the contract itself. What each test would catch if it broke:
 * - a tester or a learner shown the supervisor's controls or the admin tabs;
 * - a body the worker refuses (a builder drifted from report-verify.mjs / handleReviewReport);
 * - the supervisor's form sending an admin note, or an unknown role widening into a stronger one;
 * - a verifier's identity reaching the page.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseReportList, reportsPath, roleRequest, rolesPath } from '@/lib/cloud/admin-api'
import { canReview, myVerification, parseVerifications, qaAccess, reviewPath, reviewRequest, staffRole, verificationsPath, verifiedSummary, verifyRequest } from '@/lib/cloud/qa-review'
import { canSendQaSession } from '@/lib/cloud/qa-sessions'
import { parseMe } from '@/lib/cloud/session'
import { t } from '@/lib/i18n'
import { QaWorkspace } from '@/components/account/admin/QaWorkspace'
import { StaffSection } from '@/components/account/StaffSection'
import { NOW, api, createHarness, seedAccount, sql } from '../../../../workers/billing/tests/fixtures.mjs'

async function team() {
  const { env } = await createHarness()
  const admin = await seedAccount(env, { email: 'owner@gmail.com', method: 'google' })
  const tester = await seedAccount(env, { email: 'qa@example.test' })
  const sup = await seedAccount(env, { email: 'sup@example.test' })
  const learner = await seedAccount(env, { email: 'learner@example.test' })
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", tester.account.id, NOW - 10)
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'qa_supervisor', ?2)", sup.account.id, NOW - 10)
  const context = { path: '/', hash: '#S07', sectionId: 'S07', sectionIndex: 7, viewport: { width: 390, height: 844 }, userAgent: 'UA', language: 'es', deploymentSha: 'abc1234' }
  const body = { source: 'qa_harness', category: 'functionality', cause: 'logic-state', severity: 'high', title: 'Siguiente no avanza', description: 'd', steps: 's', expected: 'e', actual: 'a', improvement: '', reporterAlias: 'Lucía', context }
  const filed = await api(env, 'POST', '/v1/reports', { cookie: tester.token, body })
  assert.equal(filed.status, 201)
  return { env, admin, tester, sup, learner, id: filed.body.id as string }
}

// Owner request 2026-11-25: the account window names the role and links to /admin. Defects guarded:
// a learner shown a staff line or an /admin link; an admin labelled tester (or the reverse); a
// stale admin told nothing; the link pointing anywhere but /admin.
test('the account window names the staff role from the worker\'s /v1/me and links to /admin; a learner sees nothing', async () => {
  const { env, admin, tester, sup, learner } = await team()
  const me = async (who: { token: string }, now?: number) => parseMe((await api(env, 'GET', '/v1/me', { cookie: who.token, ...(now ? { now } : {}) })).body)
  assert.deepEqual(staffRole(await me(admin)), { role: 'admin', reauth: false })
  assert.deepEqual(staffRole(await me(admin, NOW + 13 * 3600)), { role: 'admin', reauth: true }, 'stale Google session: still named admin, told to sign in again')
  assert.deepEqual(staffRole(await me(sup)), { role: 'supervisor', reauth: false })
  assert.deepEqual(staffRole(await me(tester)), { role: 'tester', reauth: false })
  assert.equal(staffRole(await me(learner)), null)
  assert.equal(staffRole(null), null)
  const html = async (who: { token: string }, now?: number) => {
    const m = await me(who, now)
    return m ? renderToStaticMarkup(h(StaffSection, { me: m })) : ''
  }
  const adminHtml = await html(admin)
  assert.ok(adminHtml.includes(t('account.staff.role.admin', 'es-PE')) && adminHtml.includes('href="/admin"') && adminHtml.includes(t('account.staff.link.admin', 'es-PE')), adminHtml)
  assert.ok(!adminHtml.includes('account-staff-reauth'), 'a fresh admin is not told to sign in again')
  const testerHtml = await html(tester)
  assert.ok(testerHtml.includes(`>${t('account.staff.role.tester', 'es-PE')}<`) && testerHtml.includes('href="/admin"') && testerHtml.includes(t('account.staff.link.qa', 'es-PE')), testerHtml)
  assert.ok(!testerHtml.includes(t('account.staff.role.admin', 'es-PE')), 'a tester is never labelled admin')
  assert.ok((await html(admin, NOW + 13 * 3600)).includes('account-staff-reauth'), 'a stale admin gets the sign-in-with-Google note')
  assert.equal(await html(learner), '', 'a learner sees no staff line and no /admin link')
})

const tr = (key: string, vars?: Record<string, string | number>) => t(key, 'es-PE').replace(/\{(\w+)\}/g, (_, k: string) => String(vars?.[k] ?? ''))

test('the window follows the worker\'s /v1/me: admin > supervisor > tester; a learner gets none', async () => {
  const { env, admin, tester, sup, learner } = await team()
  const access = async (who: { token: string }) => qaAccess(parseMe((await api(env, 'GET', '/v1/me', { cookie: who.token })).body))
  assert.equal(await access(admin), 'admin')
  assert.equal(await access(sup), 'supervisor')
  assert.equal(await access(tester), 'tester')
  assert.equal(await access(learner), null)
  assert.equal(qaAccess(null), null)
  assert.deepEqual([canReview('admin'), canReview('supervisor'), canReview('tester'), canReview(null)], [true, true, false, false])
  const supMe = parseMe((await api(env, 'GET', '/v1/me', { cookie: sup.token })).body)
  assert.equal(canSendQaSession(supMe), true, 'a supervisor sends session summaries like a tester')
  assert.equal((await api(env, 'POST', '/v1/qa/sessions', { cookie: sup.token, body: { sessionId: 'qs_AAAAAAAAAAAAAAAAAAAA', alias: null, startedAt: NOW - 600, lastActiveAt: NOW - 60, activeSeconds: 300, sections: { setup: 300 }, issuesCreated: 1, issuesSent: 0, deploymentSha: 'abc1234', browser: 'chromium' } })).status, 200, 'and the worker agrees')
})

test('a built check is what the worker accepts, and its answer parses with mine and no identity', async () => {
  const { env, tester, sup, id } = await team()
  const built = verifyRequest('fixed', '  retest en Safari  ', 'ABC1234DEF')
  assert.deepEqual(built, { ok: true, body: { result: 'fixed', note: 'retest en Safari', deploymentSha: 'ABC1234DEF' } })
  const path = verificationsPath(id)
  assert.equal(path, `/v1/qa/reports/${id}/verifications`)
  const r = await api(env, 'POST', path as string, { cookie: sup.token, body: built.ok ? built.body : {} })
  assert.equal(r.status, 200, JSON.stringify(r.body))
  const asTester = parseVerifications((await api(env, 'GET', `/v1/qa/reports/${id}`, { cookie: tester.token })).body)
  assert.deepEqual(asTester.map((v) => [v.result, v.note, v.mine, v.byReporter]), [['fixed', 'retest en Safari', false, false]])
  assert.equal(myVerification(asTester), null)
  assert.ok(!JSON.stringify(asTester).includes('@'))
  // A bad build id is left out rather than sent (the worker would refuse the whole check).
  assert.deepEqual(verifyRequest('reproduced', '', 'not-a-sha'), { ok: true, body: { result: 'reproduced' } })
  assert.deepEqual(verifyRequest('resolved', '', null), { ok: false, key: 'qarev.error.result' })
  assert.deepEqual(verifyRequest('fixed', 'x'.repeat(1001), null), { ok: false, key: 'qarev.error.note' })
  assert.equal(verificationsPath('../admin/roles'), null, 'only the worker\'s report ids reach a path')
  assert.deepEqual(parseVerifications({ verifications: [{ result: 'closed', mine: true }, 'junk', { result: 'reproduced', deploymentSha: '<x>' }] }).map((v) => [v.result, v.deploymentSha]), [['reproduced', null]])
})

test('the supervisor\'s change sends status and duplicate only; the worker takes it from a supervisor and refuses a tester', async () => {
  const { env, tester, sup, id } = await team()
  const built = reviewRequest({ status: 'new', duplicateOf: null }, { status: 'fixed', duplicateOf: '' })
  assert.deepEqual(built, { ok: true, body: { status: 'fixed' } })
  assert.equal(reviewPath(id), `/v1/qa/reports/${id}`)
  assert.equal((await api(env, 'PATCH', reviewPath(id) as string, { cookie: tester.token, body: built.ok ? built.body : {} })).status, 403)
  const ok = await api(env, 'PATCH', reviewPath(id) as string, { cookie: sup.token, body: built.ok ? built.body : {} })
  assert.deepEqual([ok.status, ok.body.report.status], [200, 'fixed'])
  for (const next of [{ status: 'fixed', duplicateOf: '' }, { status: 'duplicate', duplicateOf: 'rep_other' }, { status: 'in_progress', duplicateOf: 'rep_x' }]) {
    const b = reviewRequest({ status: 'new', duplicateOf: null }, next)
    if (b.ok) assert.ok(Object.keys(b.body).every((k) => k === 'status' || k === 'duplicateOf'), JSON.stringify(b.body))
  }
  assert.deepEqual(reviewRequest({ status: 'fixed', duplicateOf: null }, { status: 'fixed', duplicateOf: '' }), { ok: false, key: 'adm.error.nothing' })
  assert.deepEqual(reviewRequest({ status: 'new', duplicateOf: null }, { status: 'duplicate', duplicateOf: 'nope' }), { ok: false, key: 'adm.error.duplicateOf' })
})

test('the review queue filter reaches the worker and lists only reports a retest says are fixed', async () => {
  const { env, sup, tester, id } = await team()
  assert.equal(reportsPath('qa', { awaiting: 'review' }, null), '/v1/qa/reports?awaiting=review&limit=50')
  assert.equal(reportsPath('qa', { awaiting: 'everything' }, null), '/v1/qa/reports?limit=50', 'an unknown value is dropped, not sent')
  const queue = async () => parseReportList((await api(env, 'GET', reportsPath('qa', { awaiting: 'review' }, null), { cookie: sup.token })).body).reports
  assert.deepEqual(await queue(), [])
  await api(env, 'POST', `/v1/qa/reports/${id}/verifications`, { cookie: tester.token, body: { result: 'fixed' } })
  const rows = await queue()
  assert.deepEqual(rows.map((r) => [r.id, r.verified.fixed, r.status]), [[id, 1, 'new']])
  assert.equal(verifiedSummary(rows[0].verified, tr), 'Arreglado según retest: 1')
  assert.equal(verifiedSummary({ reproduced: 0, notReproduced: 0, fixed: 0 }, tr), null)
})

test('granting a QA supervisor is one the worker accepts; an unknown role narrows to tester, never wider', async () => {
  const { env, admin } = await team()
  const built = roleRequest({ target: 'nueva@example.test', daysText: '30', indefinite: false, note: '' }, 'qa_supervisor')
  assert.deepEqual(built, { ok: true, body: { email: 'nueva@example.test', role: 'qa_supervisor', days: 30 } })
  const r = await api(env, 'POST', '/v1/admin/roles', { cookie: admin.token, body: built.ok ? built.body : {} })
  assert.equal(r.status, 201, JSON.stringify(r.body))
  const widened = roleRequest({ target: 'x@example.test', daysText: '1', indefinite: false, note: '' }, 'admin' as never)
  assert.equal(widened.ok && widened.body.role, 'tester')
  assert.equal(rolesPath('active', 'qa_supervisor'), '/v1/admin/roles?role=qa_supervisor&state=active')
  assert.equal(rolesPath('all'), '/v1/admin/roles?role=tester&state=all', 'the default list stays the tester list')
})

test('the QA window shows no admin tab to a tester or a supervisor, and the review queue only to the supervisor', () => {
  const adminOnly = ['adm.tab.grants', 'adm.tab.testers', 'adm.tab.accounts', 'adm.tab.ads', 'adm.tab.usage', 'adm.tab.experiments', 'adm.tab.surveys'].map((k) => t(k, 'es-PE'))
  const tester = renderToStaticMarkup(h(QaWorkspace, { access: 'tester' }))
  const sup = renderToStaticMarkup(h(QaWorkspace, { access: 'supervisor' }))
  for (const label of adminOnly) {
    assert.ok(!tester.includes(`>${label}<`) && !sup.includes(`>${label}<`), `no "${label}" tab`)
  }
  assert.ok(tester.includes(t('qarev.tab.team', 'es-PE')) && tester.includes(t('qarev.tab.mine', 'es-PE')))
  assert.ok(!tester.includes(t('qarev.tab.queue', 'es-PE')), 'a tester has no review queue')
  assert.ok(sup.includes(t('qarev.tab.queue', 'es-PE')))
  assert.ok(tester.includes(t('qarev.scope.tester', 'es-PE')) && sup.includes(t('qarev.scope.supervisor', 'es-PE')))
})

test('every new text exists in the three interface languages', () => {
  const keys = ['account.staff.heading', 'account.staff.role.admin', 'account.staff.role.supervisor', 'account.staff.link.admin', 'account.staff.link.qa', 'account.staff.reauth', 'qarev.h', 'qarev.result.reproduced', 'qarev.result.not_reproduced', 'qarev.result.fixed', 'qarev.fixedHint', 'qarev.review.h', 'qarev.tab.queue', 'qarev.menuLink', 'qarev.count.fixed', 'qarev.error.result', 'adm.role.qa_supervisor', 'adm.supervisors.what', 'adm.supervisors.revokeBody']
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    for (const key of keys) assert.notEqual(t(key, lang), key, `${lang} ${key}`)
  }
  // t() falls back to es-PE, so a key missing from English would still read as Spanish: catch that.
  for (const key of keys.filter((k) => k !== 'qarev.h')) assert.notEqual(t(key, 'en'), t(key, 'es-PE'), `en ${key} is translated`)
})
