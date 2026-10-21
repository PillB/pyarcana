export const meta = {
  name: 'model-ladder',
  description: 'Run one task up the Haiku -> Sonnet -> Opus ladder: verified failure hands up, capability signatures hand up at once, the verifier is one level up',
  whenToUse: 'Any fix, draft or audit task that a subagent does and an independent verifier can check',
  phases: [
    { title: 'Attempt', detail: 'the drafter on the current rung' },
    { title: 'Verify', detail: 'an independent verifier one level up' },
    { title: 'Review', detail: 'an adversarial reviewer one level up; blockers and majors refuted before they count' },
  ],
}

// args: {
//   label, cls,            // a short label and the task class (for the ledger)
//   task,                  // the full drafter prompt: objective, output, tools, boundaries, stop conditions
//   verify,                // verifier instructions (commands to run, what must exist), or null
//   review,                // review focus, or null
//   evidenceDir,           // where agents write their full reports (absolute path)
//   start,                 // 'haiku' (default) | 'sonnet' | 'opus' - from the ledger's class promotions
//   test,                  // optional, for the ladder's own recreation tests only:
//                          //   { schemaThrowOn: ['haiku'], skipWorkOn: ['haiku'] }
// }
const A = args || {}
const LADDER = ['haiku', 'sonnet', 'opus']
const UP = { haiku: 'sonnet', sonnet: 'opus', opus: 'opus' }
const T = A.test || {}
const EVID = A.evidenceDir || '/tmp'

const REPORT = { type: 'object', required: ['verdict', 'summary', 'evidence_path'], properties: {
  verdict: { type: 'string', enum: ['done', 'blocked', 'stopped'] },
  summary: { type: 'string', description: 'at most 1500 characters; the detail goes in the evidence file' },
  evidence_path: { type: 'string', description: 'absolute path of the full report you wrote' },
  branch: { type: 'string' }, commits: { type: 'array', items: { type: 'string' } } } }
// An object no output can satisfy: used only by the recreation test of an agent() that throws.
const IMPOSSIBLE = { type: 'object', required: ['a'], properties: { a: { type: 'string', enum: [] } } }
const VERIFY = { type: 'object', required: ['ok', 'failure_kind', 'why'], properties: {
  ok: { type: 'boolean' },
  failure_kind: { type: 'string', enum: ['none', 'content', 'empty_diff', 'stop_condition_broken', 'infra'] },
  why: { type: 'string', description: 'at most 1200 characters' }, evidence_path: { type: 'string' } } }
const REVIEW = { type: 'object', required: ['findings'], properties: { findings: { type: 'array', items: {
  type: 'object', required: ['severity', 'issue', 'fix'], properties: {
    severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
    issue: { type: 'string', description: 'at most 600 characters' }, fix: { type: 'string', description: 'at most 600 characters' } } } } } }
const REFUTE = { type: 'object', required: ['real', 'reason'], properties: { real: { type: 'boolean' }, reason: { type: 'string' } } }

const OUTPUT_RULES = `\n\nOUTPUT RULES: write your full report (every command, its exit code, what changed, every finding) to the plain-text file ${EVID}/<a name of your choice>.txt and return only the small structured result: verdict ('done' when the task is finished; 'blocked' for a quota, rate-limit, auth or outage refusal of a dependency, which you must not retry; 'stopped' when a stop condition in the task says to stop and hand back), a summary of at most 1500 characters, and evidence_path. If the task starts a long process (Codex, a full test suite), WAIT for it to exit, with repeated shell waits of under 10 minutes each, before you report: returning while it still runs is a failure.`

// Why an agent call produced nothing decides what the ladder does next. Only a capability
// signature (an output that cannot satisfy its schema) hands up. A usage, rate, quota or auth
// limit is a blocked dependency, and an abort is the owner denying or skipping a step: a bigger
// model would hit the same wall, so both stop the run. A bare null from agent() means the harness
// gave up after retries on a terminal API error, or the owner skipped the agent; neither says
// anything about the model, so it stops too (2026-10-19: a weekly limit was read as a capability
// failure and every task climbed to Opus for nothing).
// Only a positive match is a capability signature: an output that cannot satisfy its schema. A
// transport failure (a timeout, a reset connection, a 5xx) is infrastructure: the same rung tries
// once more, then the run stops. Anything unrecognised stops too, rather than buying a bigger model
// on a guess (Codex review of #114, 2026-10-20).
const BLOCKED = /weekly limit|usage limit|rate.?limit|quota|\b429\b|overloaded|credit|billing|unauthori[sz]ed|\b401\b|\b403\b|authentication/i
const ABORTED = /abort|cancel|denied|skipped/i
const TRANSPORT = /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|EPIPE|socket hang up|network|timed? ?out|service unavailable|bad gateway|gateway timeout|internal server error|\b50[0-9]\b/i
const SCHEMA = /schema|StructuredOutput|structured output|must have required|must NOT have|does not match|invalid json|enum/i
function classify(message) {
  if (BLOCKED.test(message)) return 'blocked'
  if (ABORTED.test(message)) return 'aborted'
  if (TRANSPORT.test(message)) return 'infra'
  if (SCHEMA.test(message)) return 'capability'
  return 'unknown'
}

async function safe(fn) {
  try {
    const value = await fn()
    if (value === null || value === undefined) return { error: 'the agent returned nothing (a terminal API error after retries, or a skipped agent)', kind: 'null' }
    return { value }
  } catch (e) {
    const message = String(e && e.message ? e.message : e).slice(0, 400)
    return { error: message, kind: classify(message) }
  }
}

// Simulated outcomes for the ladder's own recreation tests: no agent is called on that rung.
// throwOn: an agent() that throws this message; nullOn: one that returns nothing; reportOn: the
// drafter's report; verifyOn: the verifier's verdict; refuteOn: the refuters' result ('null' or a
// verdict object), with reviewOn giving the reviewer's findings.
function simulated(model) {
  if ((T.nullOn || []).includes(model)) return { error: 'the agent returned nothing (simulated)', kind: 'null' }
  const thrown = (T.throwOn || {})[model]
  if (thrown) return { error: thrown, kind: classify(thrown) }
  if ((T.reportOn || {})[model]) return { value: T.reportOn[model] }
  return null
}

// What the last attempts left, so a stronger model continues from it instead of the base state.
function leftBy(h) {
  const where = [h.branch && `branch ${h.branch}`, h.commits && h.commits.length && `commits ${h.commits.join(', ')}`, h.evidence && `evidence ${h.evidence}`].filter(Boolean)
  return where.length ? ` [left: ${where.join('; ')}]` : ''
}

async function attempt(model, n, effort, history) {
  const resume = history.length ? `\n\nTHIS IS ATTEMPT ${n}. Earlier attempts failed, verified:\n${history.map((h) => `- attempt ${h.attempt} (${h.model}${h.effort ? ', effort ' + h.effort : ''}): ${h.kind}: ${h.cause}${leftBy(h)}`).join('\n')}\nContinue from what the last attempt left (the branch, commits and files named above) and fix every failure listed.` : ''
  const schema = (T.schemaThrowOn || []).includes(model) ? IMPOSSIBLE : REPORT
  const opts = { label: `${A.label}:${model}#${n}`, phase: 'Attempt', schema, model }
  if (effort) opts.effort = effort
  if (A.agentType) opts.agentType = A.agentType
  // Recreation test of an agent that reports done without doing the work: it gets no task at all.
  const prompt = (T.skipWorkOn || []).includes(model)
    ? 'This is a test of a verification harness. Do not use any tool and do not create or change any file. Return verdict "done", summary "nothing was done", evidence_path "/dev/null".'
    : `${A.task}${OUTPUT_RULES}${resume}`
  return simulated(model) || safe(() => agent(prompt, opts))
}

async function verify(model, n, report) {
  if (!A.verify) return { value: { ok: true, failure_kind: 'none', why: 'no verifier configured' } }
  if ((T.verifyOn || {})[model]) return { value: T.verifyOn[model] }
  return safe(() => agent(`Independently verify a subagent's work. Do not trust its report; check everything yourself. Its result: ${JSON.stringify(report)} (read the evidence file it names if it exists). FIRST check that the work the task asked for exists at all; if nothing was done (no change, no file, an empty diff), answer ok=false with failure_kind 'empty_diff'. If the agent broke a stop condition of its task, answer failure_kind 'stop_condition_broken'. If your checks could not run for an environmental reason (a missing directory, a refused worktree, a stalled tool), answer failure_kind 'infra'. If a check you ran failed, answer failure_kind 'content' with the failing command and its output. Otherwise ok=true and failure_kind 'none'. The task it was given:\n---\n${A.task}\n---\nYOUR CHECKS:\n${A.verify}\nWrite your full notes to the plain-text file ${EVID}/${A.label}-verify-${n}.txt and return the small result.`, { label: `verify:${A.label}:${UP[model]}`, phase: 'Verify', schema: VERIFY, model: UP[model] }))
}

async function review(model, n, report) {
  if (!A.review && !T.reviewOn) return { value: { confirmed: [], findings: [] } }
  const rv = T.reviewOn ? { value: { findings: T.reviewOn } } : await safe(() => agent(`Adversarially review a subagent's finished work, read-only (create nothing, edit nothing). Its result: ${JSON.stringify(report)}. The task:\n---\n${A.task}\n---\nREVIEW FOCUS:\n${A.review}\nReport only real problems; blocker only for must-not-ship. Default to no finding when unsure.`, { label: `review:${A.label}:${UP[model]}`, phase: 'Review', schema: REVIEW, model: UP[model] }))
  if (rv.error) return { error: rv.error, kind: rv.kind }
  const serious = (rv.value?.findings ?? []).filter((f) => f.severity !== 'minor')
  // A serious finding is dismissed only by a refuter that answered real=false. A refuter that
  // returned nothing or failed leaves the finding standing (fail closed), and one that hit a limit
  // or an abort stops the run (Codex review of #114, 2026-10-20).
  const verdicts = await parallel(serious.map((f) => async () => {
    const c = T.refuteOn !== undefined
      ? (T.refuteOn === 'null' ? { error: 'the refuter returned nothing (simulated)', kind: 'null' } : { value: T.refuteOn })
      : await safe(() => agent(`Try to REFUTE this review finding on a subagent's work (read-only). ISSUE: ${f.issue}\nFIX PROPOSED: ${f.fix}\nThe work: ${JSON.stringify(report)}. Default to real=false if it rests on a misreading or cannot be reproduced.`, { label: `refute:${A.label}:${UP[model]}`, phase: 'Review', schema: REFUTE, model: UP[model] }))
    return { f, c }
  }))
  const stop = verdicts.find((v) => v && v.c.error && ['blocked', 'aborted'].includes(v.c.kind))
  if (stop) return { error: `a refuter could not run: ${stop.c.error}`, kind: stop.c.kind }
  const confirmed = verdicts.map((v, i) => (!v || v.c.error || v.c.value?.real !== false ? serious[i] : null)).filter(Boolean)
  return { value: { findings: rv.value?.findings ?? [], confirmed } }
}

const attempts = []
let infraRetries = 0
const startAt = Math.max(0, LADDER.indexOf(A.start || 'haiku'))
for (const model of LADDER.slice(startAt)) {
  const tries = model === 'opus' ? [null, 'xhigh'] : [null, null]
  let rung = 0
  while (rung < tries.length) {
    const effort = tries[rung]
    const n = attempts.length + 1
    const rec = { model, attempt: n, effort }
    const r = await attempt(model, n, effort, attempts.filter((a) => a.kind !== 'ok'))
    if (r.error) {
      if (r.kind === 'capability') {
        // The output could not satisfy its schema: a capability signature, handed up at once.
        attempts.push({ ...rec, verdict: 'no-output', kind: 'capability', cause: r.error })
        log(`${A.label}: ${model}#${n} produced no valid output, handing up`)
        break
      }
      if (r.kind === 'infra' && ++infraRetries <= 1) {
        // A transport failure: the same rung tries once more.
        attempts.push({ ...rec, verdict: 'no-output', kind: 'infra', cause: r.error })
        log(`${A.label}: ${model}#${n} transport failure, retrying the same model`)
        continue
      }
      // A limit, an abort, a bare null, a repeated transport failure or an unrecognised error: the
      // same wall waits on every rung, so stop and surface it.
      attempts.push({ ...rec, verdict: 'no-output', kind: r.kind, cause: r.error })
      log(`${A.label}: ${model}#${n} stopped (${r.kind}): ${r.error}`)
      return { ok: false, outcome: r.kind, model, attempts }
    }
    const report = r.value
    // Keep what this attempt left, so a later attempt can continue from it.
    if (report.branch) rec.branch = report.branch
    if (report.commits && report.commits.length) rec.commits = report.commits
    if (report.evidence_path) rec.evidence = report.evidence_path
    if (report.verdict === 'blocked') { attempts.push({ ...rec, verdict: 'blocked', kind: 'blocked', cause: report.summary }); return { ok: false, outcome: 'blocked', model, report, attempts } }
    if (report.verdict === 'stopped') { attempts.push({ ...rec, verdict: 'stopped', kind: 'stopped', cause: report.summary }); return { ok: false, outcome: 'stopped', model, report, attempts } }
    const v = await verify(model, n, report)
    if (v.error && !['capability', 'infra'].includes(v.kind)) { attempts.push({ ...rec, verdict: 'unverified', kind: v.kind, cause: `the verifier could not run: ${v.error}` }); return { ok: false, outcome: v.kind, model, report, attempts } }
    if (v.error) { attempts.push({ ...rec, verdict: 'unverified', kind: 'infra', cause: `the verifier failed to run: ${v.error}` }); if (++infraRetries > 1) return { ok: false, outcome: 'infra', model, report, attempts }; continue }
    const vk = v.value.failure_kind
    if (!v.value.ok) {
      if (vk === 'infra') { attempts.push({ ...rec, verdict: 'unverified', kind: 'infra', cause: v.value.why }); if (++infraRetries > 1) return { ok: false, outcome: 'infra', model, report, attempts }; continue }
      const capability = vk === 'empty_diff' || vk === 'stop_condition_broken'
      attempts.push({ ...rec, verdict: 'verify-failed', kind: capability ? 'capability' : 'content', cause: `${vk}: ${v.value.why}` })
      if (capability) { log(`${A.label}: ${model}#${n} ${vk}, handing up`); break }
      rung++; continue
    }
    const rv = await review(model, n, report)
    if (rv.error && !['capability', 'infra'].includes(rv.kind)) { attempts.push({ ...rec, verdict: 'unreviewed', kind: rv.kind, cause: `the reviewer could not run: ${rv.error}` }); return { ok: false, outcome: rv.kind, model, report, attempts } }
    if (rv.error) { attempts.push({ ...rec, verdict: 'unreviewed', kind: 'infra', cause: `the reviewer failed to run: ${rv.error}` }); if (++infraRetries > 1) return { ok: false, outcome: 'infra', model, report, attempts }; continue }
    if (rv.value.confirmed.length) {
      attempts.push({ ...rec, verdict: 'review-failed', kind: 'content', cause: rv.value.confirmed.map((f) => `${f.severity}: ${f.issue} (fix: ${f.fix})`).join(' | ') })
      rung++; continue
    }
    attempts.push({ ...rec, verdict: 'done', kind: 'ok', cause: '' })
    log(`${A.label}: done on ${model}, attempt ${n}`)
    return { ok: true, outcome: 'done', model, attempt: n, report, verification: v.value, review: rv.value, attempts }
  }
}
return { ok: false, outcome: 'exhausted', attempts }
