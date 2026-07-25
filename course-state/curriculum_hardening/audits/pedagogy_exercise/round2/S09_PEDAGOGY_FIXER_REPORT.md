# S09 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Excepciones, debugging y logging seguro
- **id:** `visualization` (index 9; archivo `s09-visualization.ts`)
- **source:** `src/lib/course/sections/s09-visualization.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S09_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2 (plus optional youDo trim)
- No generators, no bulk templates, no wholesale rewrite of A-scored units
- **No code/output changes** — prose-only tightening
- Word-count measurement only; each paragraph written for a pedagogical purpose

## Acceptance checklist
- [x] P1 integrity: T4-B-E2 `hint` no longer demands backoff
- [x] P1 metacognition: T4-B-E1 retrospective expanded (principle + classic error + self-check + transfer)
- [x] P1 feedback/retro split: T1-B-E2 feedback names starter “todo recover”; retro carries self-check
- [x] P2 polish applied (thin feedback, thin why, instruction nits, thin retros)
- [x] Optional youDo retrospective trimmed to ≤80 words
- [x] A-scored units left alone (no re-campaign)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Solution `code` / `output` preserved on all residual units

## What was fixed

### P1

| Unit | Severity | Changes |
|------|----------|---------|
| **S09-T4-B-E2** | P1 integrity | Replaced `hint` “Backoff creciente; tope en max_attempts.” with “Bucle hasta max_attempts capturando solo TimeoutError; si agotas, relanza el último.” Aligns with instruction/tests/solution (no sleep/backoff). `hints[0]` already correct. |
| **S09-T4-B-E1** | P1 thin close | Expanded `retrospective` (~18 → ~48 w): canal vs dato/permisos; classic starter yes-on-ValueError/KeyError; self-check PermissionError; transfer to E2 loop. |
| **S09-T1-B-E2** | P1 feedback≈retro | `feedback` now names starter “todo recover” + manifest poison; `retrospective` keeps principle + on-call self-check + E3 transfer (no longer clones feedback rule). |

### P2 polish

| Unit | Changes |
|------|---------|
| **S09-T1-A-E3** | `feedback` (~15 → ~40 w): names dual starter defect (FileNotFoundError-only + missing `from e`) and PermissionError escape |
| **S09-T3-A-E1** | `feedback` (~17 → ~31 w): names starter “todo INFO”; maps WARNING/ERROR/DEBUG without restating retro’s “ERROR en cada cuarentena” |
| **S09-T4-B-DEMO** | `why` (~33 → ~57 w): TimeoutError consumes loop; ValueError → quarantine first try; max_attempts as incident control |
| **S09-T1-A-E2** | Instruction step 4: “loop del starter ampliado a […]” instead of “loop de la solución” |
| **S09-T2-A-E1** | Instruction step 4 = task constraint (parse string tb); theory “most recent call last” stays in feedback/edgeCases. Retrospective expanded with classic error (first line / blame `cli`) |
| **S09-T1-B-E1** | Retrospective (~25 → ~41 w): cleanup ≠ recovery; classic “return err inside work” |
| **youDo** | Retrospective trim (~87 → ~68 w); defense triad preserved |

### Left alone (as directed)
- All R2 **A** units without residual text (majority of T2-B, T3-B, T4-A, several E3s, T1-A-E1, T1-B-E3, etc.)
- I Do demos other than T4-B-DEMO `why`
- Optional-only items already strong (T2-A-E2 mild feedback/retro overlap left as acceptable)
- Historical section `id: "visualization"` — out of Fixer scope
- No backoff added to T4-B-E2 solution/tests (would be code expansion, not a hint lie)

## Code / output integrity
- **No** starterCode / solutionCode / output edits in this pass
- Preserved oracles called out in R2: `done calls 3`, idempotency hash, LOGS trailing format, mask fixtures
- T4-B-E2 contract remains: TimeoutError loop + max_attempts only

## Residual risks (post-fix)
1. Section `id: "visualization"` vs title “Excepciones…” remains product debt (orchestrator).
2. Drill-style E1 maps (exception types, levels, taxonomy, retry table) stay classification drills by design — operational preambles + stronger retros keep them from trivia.
3. T1-B-E2 (policy recover/fail-fast) and T4-A-E1 (data|config|provider taxonomy) remain distinct axes; do not merge prose.
4. If product later wants backoff in retry E2, that needs code + tests + instruction rewrite — not a hint-only change.
5. Full browser/Pyodide suite not re-run; no code/output drift introduced.

## Validation
- Hand re-read of each edited unit after apply
- Integrity greps: no `Backoff creciente` in T4-B-E2; no “loop de la solución” in T1-A-E2; no “most recent call last” in T2-A-E1 instruction
- Word counts post-fix (measurement only): T4-B why ~57; T4-B-E1 retro ~48; T1-B-E1 retro ~41; T2-A-E1 retro ~47; T1-A-E3 feedback ~40; T3-A-E1 feedback ~31; youDo retro ~68
- Field completeness unchanged from R1 shell (preamble/title/retrospective already present)

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 9 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
