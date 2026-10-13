# Adversarial unit suite

Purpose: deliberately stress **edge cases, malformed inputs, boundaries, rate limits, score corruption, and knowledge-packet isolation** — without duplicating Playwright UI smoke.

## What is covered (and why)

| Module | Threats | Not covered (elsewhere) |
|--------|---------|-------------------------|
| `exam-scoring` | empty answers→NaN, OOR indices, missing Qs, score clamp, 100-answer cap, scoring over the drawn set (not the answers sent), foreign and repeated ids, unreadable draws, answer-key release and redaction | DB ownership (API e2e) |
| `exam-submit-route` | the real exam/start, exam/submit, exam/attempts and progress handlers against an in-memory db: forged submissions (1 of 8 answered, foreign section, duplicates) → 13% or 400, ownership 404, double and racing submissions, the key never returned, grading against the saved form after a reseed, the 60-minute limit, legacy attempts neither counting nor using up an attempt, questions whose key was seen drawn last and flagging the attempt (credential evidence: `credential-issue-gates`), options shuffled per attempt (answering B on an all-B bank averages about 25, the key's text scores 100, no concept or option order sent), a bank row that cannot be shown is a 500 with no attempt used | Prisma query semantics, NextAuth (e2e); needs `--experimental-test-module-mocks` (set in `test:adversarial:node`) |
| `exam-draw` | the option shuffle is uniform: every RNG sequence for n = 1..6 enumerated (bounds n..2, n! permutations once each), chi-square on the real RNG; Sattolo, naive and identity shuffles fail; the draw takes its randomness from the rng passed in | Statistical quality of `crypto.randomInt` itself (Node) |
| `exam-rng` | the exam draw's randomness reaches `node:crypto` `randomInt(n)`, which a Math.random swap would not (statistics cannot tell them apart) | — |
| `exam-strategy-simulation` | the real bank through the real draw and grading, 1000 learners x 3 attempts per bank: fixed-position strategies pass no bank; banks passable by picking the longest option, the clang option, or the slug option are held to exact owed lists | Strategies that read the code in options, or a learner who partly knows the material |
| `test_exam_grading_migration` | the grading migration on a real SQLite db built from the committed migrations: existing attempts become version 0 with every value kept, forms cascade | Prisma migrate itself |
| `feedback-guards` | rate exhaustion, window reset, IP key isolation, control-char sanitize | Firestore dual-write |
| `admin-analytics` | empty cohorts, incomplete exams, risk clocks, histogram bins, scores that are not evidence kept out of every score figure but counted as activity | Auth on `/api/admin/*` |
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
5. **It must run.** `unittest` collects `TestCase` classes and nothing else: a pytest-style
   function or a bare `main()` script imports cleanly and never runs. Seventeen files here did
   exactly that until 2026-10-03. Wrap a `main()` check with `script_case.assert_main_passes`.
   `scripts/run_adversarial_py.py` fails a file that collects no tests.
6. **No skip without an entry in `skip_allowlist.json`** that says why and where the check runs
   instead. Prefer a fixture or a fresh extraction to a skip. A skip that fires only in some
   environments is still a test that did not run there.
7. **Never read `.fixer/`.** It is gitignored, so a test reading it skips forever in CI and, locally,
   checks whatever the last gate run left. Use `course_events.fresh_events()`.
8. **Never write into the tree.** Use `tempfile`. Both runners fail a run that changes any tracked or
   untracked file — a byte-identical rewrite included, because that is a silent re-baseline.
9. **Test the real code, never a copy of it.** Import the function; if it is nested or private,
   move it to module level first. A copy agrees with the original until the day it matters.
10. **Show that it can fail.** Break what the test guards, watch it report, revert, and say in the
    PR which mutation you used.
11. **Python 3.12, as CI.** The Python runner refuses any other interpreter.
