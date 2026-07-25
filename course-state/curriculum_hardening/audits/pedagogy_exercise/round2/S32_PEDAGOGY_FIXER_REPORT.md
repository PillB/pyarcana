# S32 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Feature engineering y pipelines sin leakage
- **id:** `microservices` (archivo `s32-microservices.ts`)
- **index:** 32
- **source:** `src/lib/course/sections/s32-microservices.ts`
- **Round 2 review:** `round2/S32_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1 (unchanged structure)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Hand-edited only pedagogical prose in Section 32 source (no generators, no bulk templates, no code/output changes).
- Prefer fewer stronger sentences; expand retros to principle + misconception + transfer + self-check where residual.
- Measured word counts for gate only; TypeScript `tsc --noEmit` clean.

## What was fixed (P2 polish)

### 1. We Do retrospectives (24)
All weDo `retrospective` fields rewritten or expanded by hand to:
- Clear **principle** (what stuck)
- **Misconception** distinct from `feedback` (especially E2, where Round 2 flagged echo)
- **Transfer** cue (next E or S33/promote)
- Optional **self-check** question

Priority units from Round 2 (replace angle, not pad):  
T1-A-E2, T1-B-E2, T2-A-E2, T2-A-E3, T2-B-E2, T2-B-E3, T3-A-E2, T3-A-E3, T3-B-E2, T3-B-E3, T4-A-E2, T4-B-E2, plus E1/E3 expansions with self-check.

Post-fix gate: all 33 unit retrospectives in ~42–72 words (spec target 40–80).

### 2. We Do E3 titles (8)
Expanded from 3-word `Fail-closed: REQUEST_*` to ≥4 words:

| Unit | New title |
|------|-----------|
| T1-A-E3 | Fail-closed: REQUEST_CATALOG frente a REJECT |
| T1-B-E3 | Fail-closed: REQUEST_MEDIAN sin inventar fill |
| T2-A-E3 | Fail-closed: REQUEST_GRAPH_FEAT sin inventar 0 |
| T2-B-E3 | Fail-closed: REQUEST_WINDOW sin inventar w |
| T3-A-E3 | Fail-closed: REQUEST_FIT_STATE hacia fs-vN |
| T3-B-E3 | Fail-closed: REQUEST_STATE_JSON sin inventar version |
| T4-A-E3 | Fail-closed: REQUEST_SPLIT_KEYS antes del baseline |
| T4-B-E3 | Fail-closed: REQUEST_FEATURE_SET_ID hacia S33 |

### 3. I Do retrospectives (7; T1-A already in range)
Expanded T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B demos with self-check + sharper misconception; kept CP-N3-B / train≡serve / S33 bridges.

### 4. I Do T3-A `why`
Expanded ~+15 words to clear the 40-word floor (state versionable, audit, bridge to We Do).

### 5. Feedback border (touched units)
- **T4-A-E1:** + hardcode `1,1,0` engaña al promote  
- **T2-B-E3:** + score offline/serve divergen en silencio  

### 6. Explicitly not changed
- Code, starter DEFECT markers, solution outputs, canonical PASS/REJECT/MISSING/CONTINUE strings  
- You Do frame (already A; no residual required)  
- Hints (optional; did not increase spoiling)  
- File/id naming `microservices` vs features content (product debt, out of scope)

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective`
- [x] We Do has short `title` (≥4 words on E3 fail-closed units)
- [x] `instruction` remains task-only (untouched)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit`)

## Residual risks (post-fix)
- **Instruction length** still often under 40 words on E1/E2; Round 2 marked non-blocking — steps are clear and defect-named.
- **Hints E1** still somewhat formula-direct (guided tier); left as-is.
- **Demo T4-B** still shows leaky/skew True (detection); E1 still clean promote — intentional.
- **24 We Do cognitive load** remains structural; fade E1→E2→E3 surfaces stay distinct.

## Files touched
1. `src/lib/course/sections/s32-microservices.ts` — prose only  
2. `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S32_PEDAGOGY_FIXER_REPORT.md` — this report  

---

Section 32 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
