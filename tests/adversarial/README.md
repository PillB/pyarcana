# Adversarial unit suite

Purpose: deliberately stress **edge cases, malformed inputs, boundaries, rate limits, score corruption, and knowledge-packet isolation** — without duplicating Playwright UI smoke.

## What is covered (and why)

| Module | Threats | Not covered (elsewhere) |
|--------|---------|-------------------------|
| `exam-scoring` | empty answers→NaN, OOR indices, missing Qs, score clamp, 100-answer cap | DB ownership (API e2e) |
| `feedback-guards` | rate exhaustion, window reset, IP key isolation, control-char sanitize | Firestore dual-write |
| `admin-analytics` | empty cohorts, incomplete exams, risk clocks, histogram bins | Auth on `/api/admin/*` |
| `subscription-plans` | plan integrity, pricing non-neg, free/pro contracts | Payment providers |
| `runtime_audit_classify` | incomplete starters, soft output match, active-52 filter | Full 2k+ runtime (CI python-content) |
| `newbie_packet` | no solution leak, bounds, option-array nested quotes | Live LLM newbies |
| `geometry_overlap` | nested false positives, sticky chrome, area noise | Full page geometry (Playwright) |
| `auth-hardening` | bounded body/rate state, spoofed keys, public role escalation, fallback secrets | Distributed gateway limits (deployment) |
| `static_export_guard` | source mutation, base path, third-party logo, dead server controls | Full visual regression (Playwright) |

## Commands

```bash
npm run test:adversarial        # node + python
npm run test:adversarial:node
npm run test:adversarial:py
```

## Rules for adding tests

1. **Necessary** — map to a real failure mode (or a bug we already shipped).
2. **Non-duplicative** — one assertion path per behavior.
3. **Meaningful** — assert product invariants (score ∈ [0,100], pass≥70, packets strip keys).
4. Prefer pure helpers over mounting React.
