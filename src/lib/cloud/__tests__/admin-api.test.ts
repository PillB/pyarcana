/**
 * The admin window and the QA reporting subsite talk to the worker through request builders and
 * parsers (DESIGN-v3 §H, worker contract in workers/billing/src/{grants,roles,admin-accounts,
 * report-triage}.mjs). What is pinned here:
 * - a grant or tester role is fixed days (1..3650) or indefinite (days: null), never a guess;
 * - an email never travels in a URL (the worker refuses GET ?email=; lookups are POST bodies);
 * - every query value is percent-encoded strictly enough for the API client's path guard, so a
 *   search for "it's (bad)*" is sent, not thrown away;
 * - ids that reach a URL path are the worker's own id shapes, so no path can be smuggled;
 * - lists from the server are parsed field by field (untrusted input).
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { apiUrl } from '@/lib/cloud/api'
import {
  attachmentPath,
  encodeQuery,
  grantRequest,
  grantWindow,
  grantsPath,
  lookupRequest,
  parseGrantList,
  parseReportList,
  parseRoleList,
  parseTarget,
  rectifyRequest,
  reportPatch,
  reportPath,
  reportsPath,
  revokeGrantRequest,
  roleRequest,
  roleRevokeRequest,
  rolesPath,
  accountActionRequest,
  experimentResultsPath,
  surveysPath,
  experimentView,
  surveyView,
} from '@/lib/cloud/admin-api'

const REQ = 'req_2026-09-29_abcdef'

test('target: an acct_ id is an account id, anything else must be an email; blanks are refused', () => {
  assert.deepEqual(parseTarget('  acct_AbC123xyz  '), { accountId: 'acct_AbC123xyz' })
  assert.deepEqual(parseTarget(' Ana@Example.com '), { email: 'Ana@Example.com' })
  assert.equal(parseTarget(''), null)
  assert.equal(parseTarget('ana'), null)
  assert.equal(parseTarget('acct_'), null)
})

test('grant: fixed days 1..3650 or indefinite (null); kind gift|tester; note trimmed; request id kept', () => {
  const fixed = grantRequest({ target: 'ana@example.com', daysText: '30', indefinite: false, kind: 'gift', note: '  amiga  ' }, REQ)
  assert.deepEqual(fixed, { ok: true, body: { email: 'ana@example.com', days: 30, kind: 'gift', note: 'amiga', requestId: REQ } })
  const forever = grantRequest({ target: 'acct_x1234567', daysText: '30', indefinite: true, kind: 'tester', note: '' }, REQ)
  assert.deepEqual(forever, { ok: true, body: { accountId: 'acct_x1234567', days: null, kind: 'tester', requestId: REQ } })
  for (const bad of ['0', '3651', '2.5', '', 'diez', '-3']) {
    assert.deepEqual(grantRequest({ target: 'ana@example.com', daysText: bad, indefinite: false, kind: 'gift', note: '' }, REQ), { ok: false, key: 'adm.error.days' }, bad)
  }
  assert.deepEqual(grantRequest({ target: 'ana@example.com', daysText: '3650', indefinite: false, kind: 'gift', note: '' }, REQ).ok, true)
  assert.deepEqual(grantRequest({ target: 'nadie', daysText: '7', indefinite: false, kind: 'gift', note: '' }, REQ), { ok: false, key: 'adm.error.target' })
  assert.deepEqual(grantRequest({ target: 'a@b.co', daysText: '7', indefinite: false, kind: 'trial' as 'gift', note: '' }, REQ), { ok: false, key: 'adm.error.kind' })
  assert.deepEqual(grantRequest({ target: 'a@b.co', daysText: '7', indefinite: false, kind: 'gift', note: 'x'.repeat(201) }, REQ), { ok: false, key: 'adm.error.note' })
  assert.deepEqual(grantRequest({ target: 'a@b.co', daysText: '7', indefinite: false, kind: 'gift', note: '' }, 'short'), { ok: false, key: 'adm.error.retry' })
})

test('revoke: the reason is required (the worker keeps it), trimmed and at most 200 characters', () => {
  assert.deepEqual(revokeGrantRequest('grant_abc', '  error de tipeo '), { ok: true, body: { grantId: 'grant_abc', reason: 'error de tipeo' } })
  assert.deepEqual(revokeGrantRequest('grant_abc', '   '), { ok: false, key: 'adm.error.reason' })
  assert.deepEqual(revokeGrantRequest('grant_abc', 'x'.repeat(201)), { ok: false, key: 'adm.error.reason' })
})

test('tester role: same days rule; revoke needs the account id and a reason', () => {
  assert.deepEqual(roleRequest({ target: 'qa@example.com', daysText: '', indefinite: true, note: '' }), { ok: true, body: { email: 'qa@example.com', role: 'tester', days: null } })
  assert.deepEqual(roleRequest({ target: 'qa@example.com', daysText: '14', indefinite: false, note: 'ronda 1' }), { ok: true, body: { email: 'qa@example.com', role: 'tester', days: 14, note: 'ronda 1' } })
  assert.deepEqual(roleRequest({ target: 'qa@example.com', daysText: '0', indefinite: false, note: '' }), { ok: false, key: 'adm.error.days' })
  assert.deepEqual(roleRevokeRequest('acct_q1234567', 'terminó la ronda'), { ok: true, body: { accountId: 'acct_q1234567', role: 'tester', reason: 'terminó la ronda' } })
  assert.deepEqual(roleRevokeRequest('acct_q1234567', ''), { ok: false, key: 'adm.error.reason' })
})

test('accounts: lookups, disables and rectifications carry the email in the BODY, never the URL', () => {
  assert.deepEqual(lookupRequest('ana@example.com'), { ok: true, body: { email: 'ana@example.com' } })
  assert.deepEqual(lookupRequest('acct_z1234567'), { ok: true, body: { accountId: 'acct_z1234567' } })
  assert.deepEqual(lookupRequest('???'), { ok: false, key: 'adm.error.target' })
  assert.deepEqual(accountActionRequest('ana@example.com', 'abuso'), { ok: true, body: { email: 'ana@example.com', reason: 'abuso' } })
  assert.deepEqual(accountActionRequest('ana@example.com', ''), { ok: false, key: 'adm.error.reason' })
  assert.deepEqual(rectifyRequest('acct_z1234567', ' nueva@example.com ', 'lo pidió'), { ok: true, body: { accountId: 'acct_z1234567', newEmail: 'nueva@example.com', reason: 'lo pidió' } })
  assert.deepEqual(rectifyRequest('acct_z1234567', 'no-es-correo', 'x'), { ok: false, key: 'adm.error.email' })
  for (const path of [grantsPath({ kind: 'gift', state: 'active' }), rolesPath('active'), reportsPath('admin', { q: 'ana@example.com' }, null)]) {
    assert.doesNotMatch(path, /email=/, path)
  }
})

test('query strings: empty values dropped; every reserved character percent-encoded; the API guard accepts them', () => {
  assert.equal(encodeQuery({ a: '', b: null, c: undefined }), '')
  assert.equal(encodeQuery({ kind: 'gift', limit: 50 }), '?kind=gift&limit=50')
  const q = encodeQuery({ q: "it's (bad)*~! & más" })
  assert.equal(q, '?q=it%27s%20%28bad%29%2A%7E%21%20%26%20m%C3%A1s')
  assert.doesNotThrow(() => apiUrl('/api', `/v1/qa/reports${q}`))
  assert.equal(decodeURIComponent(q.slice(3)), "it's (bad)*~! & más")
})

test('lists: grants by kind and state; reports by status, severity, category, section, text and cursor', () => {
  assert.equal(grantsPath({ kind: 'tester', state: 'active' }), '/v1/admin/grants?kind=tester&state=active&limit=100')
  assert.equal(grantsPath({ kind: '', state: 'all' }), '/v1/admin/grants?state=all&limit=100')
  assert.equal(rolesPath('all'), '/v1/admin/roles?role=tester&state=all')
  assert.equal(
    reportsPath('qa', { status: 'new', severity: 'high', category: 'content', section: 'functions', q: 'dropna' }, 'MTIzOnJlcF9h'),
    '/v1/qa/reports?status=new&severity=high&category=content&section=functions&q=dropna&cursor=MTIzOnJlcF9h&limit=50'
  )
  assert.equal(reportsPath('admin', {}, null), '/v1/admin/reports?limit=50')
  // Values outside the worker's enums are not sent (the worker would answer 400 for the whole list).
  assert.equal(reportsPath('qa', { status: 'bogus', severity: 'urgent', category: 'nope' }, null), '/v1/qa/reports?limit=50')
})

test('paths with ids: only the worker id shapes reach a URL', () => {
  assert.equal(reportPath('rep_AbC-12_x'), '/v1/qa/reports/rep_AbC-12_x')
  assert.equal(reportPath('rep_x/../../admin'), null)
  assert.equal(reportPath('grant_abc'), null)
  assert.equal(attachmentPath('rep_abc', 'att_def-1'), '/v1/qa/reports/rep_abc/attachments/att_def-1')
  assert.equal(attachmentPath('rep_abc', 'att_d?x=1'), null)
  assert.equal(experimentResultsPath('ads_house_v1'), '/v1/admin/experiments/results?key=ads_house_v1')
  assert.equal(experimentResultsPath('../x'), null)
  assert.equal(surveysPath('nps'), '/v1/admin/surveys?kind=nps')
  assert.equal(surveysPath('free_text' as 'nps'), null)
})

test('report triage: only changed fields are sent; a duplicate needs a report id; other statuses clear it', () => {
  const current = { status: 'new', adminNote: null, duplicateOf: null }
  assert.deepEqual(reportPatch(current, { status: 'triaged', adminNote: '', duplicateOf: '' }), { ok: true, body: { status: 'triaged' } })
  assert.deepEqual(reportPatch(current, { status: 'new', adminNote: ' visto ', duplicateOf: '' }), { ok: true, body: { adminNote: 'visto' } })
  assert.deepEqual(reportPatch(current, { status: 'duplicate', adminNote: '', duplicateOf: 'rep_first1' }), { ok: true, body: { status: 'duplicate', duplicateOf: 'rep_first1' } })
  assert.deepEqual(reportPatch(current, { status: 'duplicate', adminNote: '', duplicateOf: '' }), { ok: false, key: 'adm.error.duplicateOf' })
  assert.deepEqual(reportPatch(current, { status: 'duplicate', adminNote: '', duplicateOf: 'otra cosa' }), { ok: false, key: 'adm.error.duplicateOf' })
  assert.deepEqual(reportPatch(current, { status: 'new', adminNote: '', duplicateOf: '' }), { ok: false, key: 'adm.error.nothing' })
  assert.deepEqual(reportPatch(current, { status: 'closed', adminNote: '', duplicateOf: '' }), { ok: false, key: 'adm.error.status' })
})

test('grant list: rows parsed field by field; start/end computed by the worker are shown as they are', () => {
  const raw = {
    grants: [
      { id: 'grant_a', accountId: 'acct_1', email: 'a@x.co', kind: 'gift', days: 30, note: null, createdAt: 100, issuedBy: 'me@x.co', state: 'active', start: 200, end: 2792200, revokedAt: null, revokeReason: null },
      { id: 'grant_b', accountId: 'acct_2', email: null, kind: 'tester', days: null, note: 'qa', createdAt: 100, issuedBy: null, state: 'active', start: 300, end: null, revokedAt: null, revokeReason: null },
      { id: 'grant_c', accountId: 'acct_3', email: 'c@x.co', kind: 'gift', days: 7, createdAt: 1, state: 'pending_activation', start: null, end: null },
      { id: 42, kind: 'gift' },
      'junk',
    ],
    partial: true,
  }
  const { grants, partial } = parseGrantList(raw)
  assert.equal(partial, true)
  assert.deepEqual(grants.map((g) => g.id), ['grant_a', 'grant_b', 'grant_c'])
  assert.deepEqual(grantWindow(grants[0]), { kind: 'dates', start: 200, end: 2792200 })
  assert.deepEqual(grantWindow(grants[1]), { kind: 'indefinite', start: 300, end: null })
  assert.deepEqual(grantWindow(grants[2]), { kind: 'pending', start: null, end: null })
  assert.deepEqual(grantWindow({ ...grants[0], state: 'revoked', revokedAt: 500 }), { kind: 'revoked', start: 200, end: 500 })
  assert.deepEqual(parseGrantList(null), { grants: [], partial: false })
})

test('role and report lists: parsed field by field; the next-page cursor passes only in its own shape', () => {
  const roles = parseRoleList({ roles: [{ accountId: 'acct_1', email: 'q@x.co', role: 'tester', createdAt: 5, expiresAt: null, revokedAt: null, note: null, grantedBy: 'me@x.co', state: 'active' }, { role: 'tester' }] })
  assert.deepEqual(roles.map((r) => [r.accountId, r.state, r.expiresAt]), [['acct_1', 'active', null]])
  const page = parseReportList({
    reports: [
      { id: 'rep_1', createdAt: 10, updatedAt: 11, source: 'qa_harness', category: 'content', cause: null, severity: 'high', status: 'new', title: 'T', description: 'D', steps: '', expected: null, actual: null, improvement: null, context: { sectionId: 'functions', sectionIndex: 6, subStep: 'quiz', path: '/', hash: '#x' }, reporterAlias: 'ana', duplicateOf: null, attachmentCount: 1, mine: true },
      { id: 'nope', title: 'x' },
    ],
    nextCursor: 'MTA6cmVwXzE',
  })
  assert.equal(page.reports.length, 1)
  assert.equal(page.reports[0].context.sectionIndex, 6)
  assert.equal(page.reports[0].mine, true)
  assert.equal(page.reports[0].accountEmail, null)
  assert.equal(page.nextCursor, 'MTA6cmVwXzE')
  assert.equal(parseReportList({ reports: [], nextCursor: 'a b<script>' }).nextCursor, null)
})

// --- experiments and satisfaction (worker routes pending: shape assumed from DESIGN-v3 §F/§G) --------


test('experiment results: before the plan is met only exposure counts are shown, never a comparison', () => {
  const early = experimentView({ key: 'pkg_ab_v1', plan: { met: false, minPerArm: 400, minDays: 14 }, arms: [{ arm: 'a', exposed: 12, trialStarts: 3, rate: 0.25 }, { arm: 'b', exposed: 9, trialStarts: 1 }] })
  assert.equal(early.planMet, false)
  assert.deepEqual(early.arms, [{ arm: 'a', cells: [['exposed', 12]] }, { arm: 'b', cells: [['exposed', 9]] }])
  const done = experimentView({ plan: { met: true }, srm: { flagged: true, p: 0.0001 }, arms: [{ arm: 'a', exposed: 500, trialStarts: 40, label: '<b>x</b>', nested: { a: 1 } }] })
  assert.equal(done.planMet, true)
  assert.equal(done.srmFlagged, true)
  assert.deepEqual(done.arms, [{ arm: 'a', cells: [['exposed', 500], ['trialStarts', 40]] }])
  assert.deepEqual(experimentView('junk'), { planMet: false, srmFlagged: false, arms: [] })
})

test('satisfaction: numeric aggregates and the latest texts (strings only, capped at 500 characters)', () => {
  const v = surveyView({ kind: 'nps', n: 31, mean: 8.2, ci: [7.5, 8.9], latest: [{ text: 'Muy claro', at: 5 }, { text: 'x'.repeat(900) }, { text: 42 }] })
  assert.deepEqual(v.stats, [['n', 31], ['mean', 8.2]])
  assert.deepEqual(v.texts.map((t) => t.length), [9, 500])
  assert.deepEqual(surveyView(null), { stats: [], texts: [] })
})
