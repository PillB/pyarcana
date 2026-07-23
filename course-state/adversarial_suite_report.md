# Adversarial suite report (2026-07-21)

## Bugs found and fixed (permanent regression tests)

1. **Exam empty answers → NaN score**  
   - `gradeExamAnswers([])` previously would divide by zero if called.  
   - Schema now requires `answers.min(1)`; grader returns score `0` if empty.  
   - Tests: `exam-scoring.test.ts` empty schema + empty grade.

2. **Exam selectedIndex unbounded**  
   - Cap at 50; OOR vs option length marks incorrect.  
   - Regression in same file.

3. **Feedback rate-limit not unit-testable / IP parse**  
   - Extracted `checkRateLimit` + `clientIpFromForwarded` with length bound.  
   - Tests: exhaustion, window reset, key isolation, empty key.

4. **JSON body parse crash on exam/feedback POST**  
   - Catch invalid JSON → 400 before schema.

5. **Geometry false positives (CI browser regression)**  
   - Sticky/fixed + nested depth + main-only selectors + min area.  
   - Unit tests in `geometry_overlap.test.mjs`.

## Suite result (local)

- Node: **43/43 pass** (prior)
- Python: **17/17 pass** (prior)
- **2026-07-23 re-run:** `pytest tests/adversarial/ -q` → **64 passed, 1 skipped**
- Typecheck: clean (tests/ excluded from tsconfig)
- Exam pedagogy: p0=p1=0
- V3 counts: ok

## Residual (product)

- Dual-newbie pedagogy gate: **agentic_E1 + agentic_E2 clean_52** (see `course-state/newbie_walkthrough/SUMMARY.md`).
- Browser geometry Playwright still needs dev server in CI job.
