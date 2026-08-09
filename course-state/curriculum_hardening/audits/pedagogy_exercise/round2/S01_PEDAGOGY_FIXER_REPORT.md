# S01 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Entorno reproducible y trabajo seguro
- **id:** `setup`
- **source file:** `src/lib/course/sections/s01-setup.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S01_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; no generators, templates, or bulk replace of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only where edited
- [x] Exact outputs preserved (no execute-and-diff needed)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — learning integrity

| Unit | Change |
|------|--------|
| **S01-T3-A-E3** | Removed learner-facing spoiler “eliges **B**” from preamble Éxito; success now requires justified choice + rewrites with valid prefixes. Instruction and starter headers no longer assume A/C are wrong. Enriched feedback (~48 w). Solution/tests still select B (reviewer-facing). |
| **S01-T4-A-E2** | Starter TAREA comment no longer names dead imports `(sys, os)`. Body still has defective `import sys` / `import os`. Solution unchanged. |
| **S01-T3-B-DEMO** | Expanded `why` (~68 w): branch+PR as trust circuit, optional remote, restore/stash vs force-push ban. |

### P2 — polish

| Unit | Change |
|------|--------|
| **S01-T1-B-DEMO** | `why` trimmed: removed `mkdir` scope creep not in demo; focuses exit codes + cwd vs PATH. |
| **S01-T2-B-DEMO** | `description` no longer claims `reinstall -r`; title of code block aligned; `why` expanded on pin verification (install -r stays in We Do). |
| **S01-T3-A-DEMO** | Expanded `why` (git show vs empty post-commit diff); retro self-check question added. |
| **S01-T4-B-DEMO** | `why` kept local: ignore / example / check-ignore / `rm --cached`; dropped premature remote push. |
| **S01-T1-B-E1** | Retrospective differentiated from feedback (CI reads integer; PowerShell self-check; job-looks-ok pattern). |
| **S01-T2-B-E1** | Instruction adds prefix verify + grep/import coincidence step. |
| **S01-T3-A-E1** | Feedback brought into 25–60 w range (add without commit / empty-wip). |
| **S01-T4-A-E3** | Feedback enriched (noise vs signal; E/F/I respect). |
| **youDo** | Retrospective tightened to ~74 w (was ~87). |

### Not changed (per report)

- Units scored Strong with no residual proposal (majority of T1–T4 We Do and several I Do).
- Optional micro-adds (T1-A-E2 instruction, T2-A-E2 PowerShell step) left out to keep surgical scope.
- Starters’ `____` defects, solution codes, and automated tests unchanged except E3 starter headers / E2 comment text as above.
- Fixtures: `requests==2.32.3`, sample Python 3.12.x kept.

## Validation notes

- Spoiler strings `eliges **B**`, `imports sin usar (sys, os)`, and description `reinstall -r` are absent from learner-facing fields.
- Word counts of edited `why` / feedback / retrospectives sit in or near spec targets (40–90 / 25–60 / 40–80).
- Feedback≠retrospective on the worst prior twin pair (T1-B-E1): feedback keeps immediate corrective loop; retro adds CI channel + self-check + transfer.
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

- **Spoiler regression:** do not reintroduce the correct letter into E3 preamble “Éxito”.
- **Hints may still name F401 / dead-import pattern** on T4-A-E2 — acceptable for progressive hints; starter must stay discovery-first.
- **Tests for T3-A-E3** still say “Elige B” (reviewer/automation) — intentional.
- Feedback/retro overlap remains mild on some Strong units not in the P1/P2 list; out of Round-2 scope.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, or retrospectives.

---

Section 1 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
