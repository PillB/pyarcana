/**
 * Sending QA-harness issues to the team (DESIGN-v3 §H): POST /v1/reports with the issue id as
 * clientIssueId (a resend is idempotent), the local copy kept and marked with the server id, and
 * the screenshot re-encoded before it leaves the browser (<= 1600 px, JPEG 0.8, <= 1 MiB; the canvas
 * re-encode drops EXIF). The body fits the worker's limits, which REFUSE long text instead of
 * clipping it (workers/billing/src/input.mjs), so the client clips and says so.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import type { QAIssue } from '@/lib/qa-session'
import {
  REPORT_LIMITS,
  SCREENSHOT_MAX_BYTES,
  clipText,
  dataUrlBytes,
  deploymentJsonUrl,
  fitWithin,
  markSent,
  prepareScreenshot,
  reportBody,
  sendIssue,
  sendUnsent,
  sentMark,
  unsentIssues,
  type ImageCodec,
} from '@/lib/cloud/qa-report'

// remoteId/sentAt are left untyped here so hostile stored values (a number, markup) can be fed in.
function issue(over: Omit<Partial<QAIssue>, 'remoteId' | 'sentAt'> & Record<string, unknown> = {}): QAIssue {
  return {
    id: '3f2b8c1e-8a4d-4f5e-9b1c-2d3e4f5a6b7c',
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
    status: 'open',
    category: 'content',
    cause: 'content-gap',
    severity: 'high',
    title: '  La pregunta 3 no se puede responder  ',
    description: 'La teoría no menciona dropna.',
    expected: 'Poder responder con lo leído.',
    actual: 'Falta el concepto.',
    reproductionSteps: '1. Abrir S06\n2. Ir al quiz',
    improvement: '',
    context: {
      path: '/', hash: '#/section/functions', sectionId: 'functions', sectionIndex: 6, sectionTitle: 'Funciones',
      subStep: 'quiz', viewport: { width: 1280, height: 800 }, scrollY: 120, userAgent: 'UA', language: 'es-PE',
      deploymentSha: 'abc123', elementHint: null,
    },
    screenshotDataUrl: null,
    ...over,
  } as QAIssue
}

const opts = { tester: 'ana', contactEmail: '', signedIn: true, attachment: null }

// --- body ------------------------------------------------------------------------------------------

test('body: the worker field names, source qa_harness, issue id as clientIssueId, text trimmed', () => {
  const r = reportBody(issue(), opts)
  assert.ok(r.ok)
  assert.deepEqual(r.body, {
    source: 'qa_harness',
    category: 'content',
    cause: 'content-gap',
    severity: 'high',
    title: 'La pregunta 3 no se puede responder',
    description: 'La teoría no menciona dropna.',
    steps: '1. Abrir S06\n2. Ir al quiz',
    expected: 'Poder responder con lo leído.',
    actual: 'Falta el concepto.',
    improvement: '',
    reporterAlias: 'ana',
    clientIssueId: '3f2b8c1e-8a4d-4f5e-9b1c-2d3e4f5a6b7c',
    context: issue().context,
  })
  assert.equal(r.clipped, false)
})

test('body: text over the worker limits is clipped (the worker would refuse it) and flagged', () => {
  const r = reportBody(issue({ title: 'T'.repeat(250), description: 'D'.repeat(6000), expected: 'E'.repeat(2001) }), opts)
  assert.ok(r.ok)
  assert.equal((r.body.title as string).length, REPORT_LIMITS.title)
  assert.equal((r.body.description as string).length, REPORT_LIMITS.description)
  assert.equal((r.body.expected as string).length, REPORT_LIMITS.expected)
  assert.equal(r.clipped, true)
})

test('clipText never leaves half of a surrogate pair at the cut', () => {
  const s = 'a'.repeat(199) + '😀'
  const clipped = clipText(s, 200)
  assert.equal(clipped, 'a'.repeat(199))
  assert.ok(!/[\uD800-\uDBFF]$/.test(clipped))
})

test('body: a contact email only for anonymous senders, and only a plausible one', () => {
  const anon = reportBody(issue(), { ...opts, signedIn: false, contactEmail: '  ana@example.org ' })
  assert.ok(anon.ok)
  assert.equal(anon.body.contactEmail, 'ana@example.org')
  const signed = reportBody(issue(), { ...opts, signedIn: true, contactEmail: 'ana@example.org' })
  assert.ok(signed.ok)
  assert.equal('contactEmail' in signed.body, false)
  const bad = reportBody(issue(), { ...opts, signedIn: false, contactEmail: 'no-es-correo' })
  assert.deepEqual(bad, { ok: false, key: 'qa.send.error.contactEmail' })
  const empty = reportBody(issue(), { ...opts, signedIn: false, contactEmail: '   ' })
  assert.ok(empty.ok)
  assert.equal('contactEmail' in empty.body, false)
})

test('body: an id the worker would refuse as clientIssueId is not sent (no idempotency without it)', () => {
  assert.deepEqual(reportBody(issue({ id: 'short' }), opts), { ok: false, key: 'qa.send.error.badId' })
  assert.deepEqual(reportBody(issue({ id: 'con espacios y más de ocho' }), opts), { ok: false, key: 'qa.send.error.badId' })
  assert.ok(reportBody(issue({ id: 'qa-1727517600000-8f3a2b' }), opts).ok)
})

test('body: an empty title after trimming is refused before any request', () => {
  assert.deepEqual(reportBody(issue({ title: '   ' }), opts), { ok: false, key: 'qa.send.error.invalid' })
})

test('body: the screenshot goes as one JPEG attachment', () => {
  const r = reportBody(issue(), { ...opts, attachment: { mime: 'image/jpeg', data: 'data:image/jpeg;base64,/9j/AA==' } })
  assert.ok(r.ok)
  assert.deepEqual(r.body.attachments, [{ mime: 'image/jpeg', data: 'data:image/jpeg;base64,/9j/AA==' }])
})

// --- sent marks ----------------------------------------------------------------------------------

test('sent marks: only a server id and an ISO time count; markSent keeps every local field', () => {
  assert.equal(sentMark(issue()), null)
  assert.equal(sentMark(issue({ remoteId: 'rep_abc', sentAt: 'ayer' })), null)
  assert.equal(sentMark(issue({ remoteId: 123, sentAt: '2026-09-28T10:00:00.000Z' })), null)
  assert.equal(sentMark(issue({ remoteId: '<img src=x>', sentAt: '2026-09-28T10:00:00.000Z' })), null)
  const sent = markSent(issue({ screenshotDataUrl: 'data:image/png;base64,iVBO' }), 'rep_Ab-9', '2026-09-28T11:00:00.000Z')
  assert.deepEqual(sentMark(sent), { remoteId: 'rep_Ab-9', sentAt: '2026-09-28T11:00:00.000Z' })
  assert.equal(sent.screenshotDataUrl, 'data:image/png;base64,iVBO')
  assert.equal(sent.updatedAt, '2026-09-28T10:00:00.000Z')
  const list = [issue({ id: 'aaaaaaaa-1' }), sent, issue({ id: 'bbbbbbbb-2', remoteId: 'rep_x', sentAt: 'nope' })]
  assert.deepEqual(unsentIssues(list).map((i) => i.id), ['aaaaaaaa-1', 'bbbbbbbb-2'])
})

// --- screenshots -------------------------------------------------------------------------------------

test('fitWithin keeps the aspect ratio, caps the longer side at 1600 and never upscales', () => {
  assert.deepEqual(fitWithin(3200, 1800, 1600), { width: 1600, height: 900 })
  assert.deepEqual(fitWithin(1000, 4000, 1600), { width: 400, height: 1600 })
  assert.deepEqual(fitWithin(800, 600, 1600), { width: 800, height: 600 })
  assert.deepEqual(fitWithin(1601, 1, 1600), { width: 1600, height: 1 })
})

test('dataUrlBytes decodes the base64 length (padding counted), null for anything else', () => {
  assert.equal(dataUrlBytes('data:image/jpeg;base64,AAAA'), 3)
  assert.equal(dataUrlBytes('data:image/jpeg;base64,AAA='), 2)
  assert.equal(dataUrlBytes('data:image/jpeg;base64,AA=='), 1)
  assert.equal(dataUrlBytes('https://example.org/x.jpg'), null)
})

function fakeCodec(width: number, height: number, bytesAt: (w: number, q: number) => number, calls: string[] = []): ImageCodec {
  return {
    load: async () => ({ width, height }),
    encodeJpeg: async (w, h, q) => {
      calls.push(`${w}x${h}@${q}`)
      const n = bytesAt(w, q)
      return `data:image/jpeg;base64,${'A'.repeat(Math.ceil(n / 3) * 4)}`
    },
  }
}

test('screenshot: always re-encoded (EXIF dropped), even when the original is already small', async () => {
  const calls: string[] = []
  const out = await prepareScreenshot('data:image/png;base64,iVBORw0KGgo=', fakeCodec(640, 480, () => 20_000, calls))
  assert.deepEqual(calls, ['640x480@0.8'])
  assert.equal(out?.mime, 'image/jpeg')
  assert.ok(out?.data.startsWith('data:image/jpeg;base64,'))
})

test('screenshot: 1600 px first, lower quality next, then smaller sizes, until it fits 1 MiB', async () => {
  const calls: string[] = []
  const big = (w: number, q: number) => (w >= 1600 ? 3_000_000 : w * q * 1000)
  const out = await prepareScreenshot('data:image/png;base64,AAAA', fakeCodec(3200, 2000, big, calls))
  assert.deepEqual(calls.slice(0, 5), ['1600x1000@0.8', '1600x1000@0.7', '1600x1000@0.6', '1600x1000@0.5', '1200x750@0.8'])
  assert.ok(out)
  assert.ok(dataUrlBytes(out.data)! <= SCREENSHOT_MAX_BYTES)
})

test('screenshot: gives up (null) rather than send more than 1 MiB, or a PNG the canvas fell back to', async () => {
  assert.equal(await prepareScreenshot('data:image/png;base64,AAAA', fakeCodec(4000, 4000, () => 2_000_000)), null)
  const png: ImageCodec = { load: async () => ({ width: 10, height: 10 }), encodeJpeg: async () => 'data:image/png;base64,iVBO' }
  assert.equal(await prepareScreenshot('data:image/png;base64,AAAA', png), null)
  const broken: ImageCodec = { load: async () => { throw new Error('tainted') }, encodeJpeg: async () => '' }
  assert.equal(await prepareScreenshot('data:image/svg+xml;base64,PHN2Zz4=', broken), null)
})

// --- sending -----------------------------------------------------------------------------------------

type Call = { path: string; body: unknown }
function api(answers: Array<ApiResult<Record<string, unknown>>>, calls: Call[] = []): ApiClient {
  const next = async (path: string, body: unknown) => {
    calls.push({ path, body })
    return answers.shift() ?? { ok: false, status: 0, reason: 'network', data: null }
  }
  const unused = async () => ({ ok: false as const, status: 0, reason: 'network', data: null })
  return { get: unused, put: unused, patch: unused, del: unused, post: next } as unknown as ApiClient
}
const ok = (status: number, data: Record<string, unknown>): ApiResult<Record<string, unknown>> => ({ ok: true, status, data })
const fail = (status: number, reason: string, data: Record<string, unknown> | null = null): ApiResult<Record<string, unknown>> => ({ ok: false, status, reason, data })

test('send: POST /v1/reports; 201 gives the server id; a resend (200 deduplicated) is still a success', async () => {
  const calls: Call[] = []
  const first = await sendIssue(api([ok(201, { ok: true, id: 'rep_1', status: 'new', attachments: 0 })], calls), issue(), opts)
  assert.deepEqual(first, { ok: true, remoteId: 'rep_1', deduplicated: false, attachmentsDropped: 0, clipped: false })
  assert.equal(calls[0].path, '/v1/reports')
  const again = await sendIssue(api([ok(200, { ok: true, id: 'rep_1', deduplicated: true })]), issue(), opts)
  assert.ok(again.ok && again.deduplicated)
})

test('send: screenshots the worker could not store are reported, the report still counts as sent', async () => {
  const r = await sendIssue(api([ok(201, { ok: true, id: 'rep_2', attachments: 0, attachmentsDropped: 1, attachmentsReason: 'attachment_budget' })]), issue(), opts)
  assert.ok(r.ok)
  assert.equal(r.attachmentsDropped, 1)
})

test('send: an answer without a report id is not a success (never mark an unsaved issue as sent)', async () => {
  const r = await sendIssue(api([ok(201, { ok: true })]), issue(), opts)
  assert.equal(r.ok, false)
})

test('send: failures name what happened; network, rate limit and outages stop a batch', async () => {
  const limited = await sendIssue(api([fail(429, 'rate_limited', { retryAfter: 600 })]), issue(), opts)
  assert.deepEqual(limited, { ok: false, key: 'account.error.rateLimited', minutes: 10, stop: true })
  const offline = await sendIssue(api([fail(0, 'network')]), issue(), opts)
  assert.deepEqual(offline, { ok: false, key: 'account.error.network', minutes: undefined, stop: true })
  const down = await sendIssue(api([fail(503, 'http_503')]), issue(), opts)
  assert.equal(down.ok === false && down.stop, true)
  const tooBig = await sendIssue(api([fail(413, 'attachment_too_large')]), issue(), opts)
  assert.deepEqual(tooBig, { ok: false, key: 'qa.send.error.tooLarge', minutes: undefined, stop: false })
  const invalid = await sendIssue(api([fail(400, 'bad_category')]), issue(), opts)
  assert.deepEqual(invalid, { ok: false, key: 'qa.send.error.invalid', minutes: undefined, stop: false })
})

test('send: a body the client refuses sends nothing', async () => {
  const calls: Call[] = []
  const r = await sendIssue(api([], calls), issue({ id: 'x' }), opts)
  assert.deepEqual(r, { ok: false, key: 'qa.send.error.badId', stop: false })
  assert.equal(calls.length, 0)
})

test('send all: only unsent issues, one at a time, each saved as sent; stops at a rate limit', async () => {
  const calls: Call[] = []
  const saved: string[] = []
  const issues = [
    issue({ id: 'aaaaaaaa-1' }),
    issue({ id: 'bbbbbbbb-2', remoteId: 'rep_old', sentAt: '2026-09-27T10:00:00.000Z' }),
    issue({ id: 'cccccccc-3' }),
    issue({ id: 'dddddddd-4' }),
  ]
  const client = api([ok(201, { ok: true, id: 'rep_a' }), fail(429, 'rate_limited', { retryAfter: 60 })], calls)
  const r = await sendUnsent(client, issues, opts, {
    now: () => '2026-09-28T12:00:00.000Z',
    prepare: async () => null,
    save: async (i) => { saved.push(`${i.id}:${sentMark(i)?.remoteId}`) },
  })
  assert.deepEqual(calls.map((c) => (c.body as { clientIssueId: string }).clientIssueId), ['aaaaaaaa-1', 'cccccccc-3'])
  assert.deepEqual(saved, ['aaaaaaaa-1:rep_a'])
  assert.deepEqual(r, { sent: 1, failed: 1, remaining: 1, error: { key: 'account.error.rateLimited', minutes: 1 } })
})

test('send all: a failed save of the sent mark is reported, never hidden', async () => {
  const r = await sendUnsent(api([ok(201, { ok: true, id: 'rep_a' })]), [issue()], opts, {
    now: () => '2026-09-28T12:00:00.000Z',
    prepare: async () => null,
    save: async () => { throw new Error('quota') },
  })
  assert.deepEqual(r, { sent: 1, failed: 0, remaining: 0, error: { key: 'qa.send.error.markNotSaved' } })
})

test('the deployment file is read under the site base path, not a hard-coded /pyarcana', () => {
  assert.equal(deploymentJsonUrl(''), '/deployment.json')
  assert.equal(deploymentJsonUrl('/pyarcana'), '/pyarcana/deployment.json')
})
