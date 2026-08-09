# S14 Pedagogy Fixer Report (Round 2)

## Section
- **title:** NumPy y cómputo vectorizado
- **id:** `security` (index 14; archivo histórico `s14-security.ts`; contenido = ndarray/máscaras/ufuncs, **no** seguridad de modelos)
- **source:** `src/lib/course/sections/s14-security.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S14_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2 (plus optional I Do retros and thin feedback)
- No generators, no bulk templates, no wholesale rewrite of Strong units
- **No code/output changes** — prose-only (instruction / feedback / retrospective / hints)
- Word-count measurement only; each paragraph written for a pedagogical purpose

## Acceptance checklist
- [x] P1 instruction defade: T2-A-E3, T3-B-E3 (no one-liner paste)
- [x] P1 feedback/retro roles: T2-B-E2 and T2-A-E3 pair
- [x] P1 retrospectives expanded: T4-A-DEMO, T3-B-E1, T4-A-E1, T4-B-E1
- [x] P2: E2 mild spoilers, thin feedback/retro cluster, optional I Do retros, E2 hints
- [x] Exact solution outputs preserved
- [x] Spanish PE; no real PII; CASO-LIM-014 / CP-N2-A thread intact
- [x] No generators; hand-edited prose only
- [x] Typecheck (`tsc --noEmit`) clean

## What was fixed

### P1 (learning integrity)

| Unit | Severity | Changes |
|------|----------|---------|
| **S14-T2-A-E3** | P1 spoiler + role collapse | Instruction: center **por fila** without pasting `X - X.mean(axis=1, keepdims=True)`. Feedback diagnoses wrong axis / lost axis. Retro: keepdims principle + misconception + shape self-check + T2-B bridge |
| **S14-T3-B-E3** | P1 spoiler | Instruction: convert inf→nan + sum omitting NaN (no full `where` one-liner). Hints keep soft `isinf`/`where` breadcrumb only |
| **S14-T2-B-E2** | P1 collapse | Feedback: fail/ValueError + insert column axis + first-column zeros cue. Retro: outer = sibling of `pairwise_diff` + misconception “1D×1D already knows rows/cols”. First hint: “Convierte `a` en columna…” (no shape `(4, 1)`) |
| **S14-T4-A-DEMO** | P1 thin retro | Retrospective: allclose-before-ratio + ratio≠SLA + self-check if allclose False + We Do bridge |
| **S14-T3-B-E1** | P1 thin retro | Retrospective: rate of NaN + IEEE misconception + self-check on inf vs isnan + E2 bridge |
| **S14-T4-A-E1** | P1 thin retro | Retrospective: equivalence as oracle + fixed-boolean classic error + dtype=float self-check |
| **S14-T4-B-E1** | P1 thin retro | Retrospective: nbytes = portfolio evidence + float32 misconception + 500×500 self-check |

### P2 polish

| Unit | Changes |
|------|---------|
| **S14-T1-A-E2** | Instruction: “malla en [0, 1] con 5 puntos” without full `linspace(...)` call |
| **S14-T1-B-E2** | Instruction: median + filter ids **bajo** mediana (no `ids[scores < med].tolist()` paste) |
| **S14-T4-B-E2** | Instruction: tolerance goal-level (orden 1e-8); retro adds bit-a-bit misconception; hints no longer open with full `allclose` call |
| **S14-T2-A-E1** | Retrospective: business meaning of axis + print-order / round classic error |
| **S14-T2-B-E1** | Retrospective: right-align broadcast + multiply-by-zeros classic |
| **S14-T2-B-E3** | Feedback: don’t “fix” second array to (2,3); noisy fail is the point |
| **S14-T3-A-E2** | Feedback: view still mutates even if name `raw` is not reassigned; print order |
| **S14-T3-A-E3** | Retrospective: fail-on-write + copy vs writeable self-check |
| **S14-T4-A-E2** | Feedback diagnoses 10.0 (linear sum); retro separates energy/norm² vs sum of scores |
| **S14-T4-A-E3** | Feedback: mean check + don’t print float time |
| **S14-T1-B-E1** | Retrospective: posición vs valor + inclusive threshold self-check |
| **S14-T1-B-DEMO** | Retrospective: mask/ids length self-check |
| **S14-T3-B-DEMO** | Retrospective: nanmean vs remaining inf self-check |

### Left alone (as directed)
- Strong units: T1-A-DEMO/E1/E3, T1-B-E3, T2-A-DEMO/E2, T2-B-DEMO, T3-A-DEMO/E1, T3-B-E2, T4-B-DEMO/E3, youDo entire shell
- Preambles already Strong from R1 — not rewritten “for symmetry”
- Solution `code` / `output` and starter defects unchanged
- Historical section `id: "security"` — out of Fixer scope (orchestrator debt)

## Code / output integrity
- **No** starterCode / solutionCode / output edits in this pass
- Canonical solution outputs preserved: e.g. `[0.0, 0.0, 0.0]`, `3.0`, `(4, 3) [[0, 0, 0],…]`, `True`, `8000 True`, `timed True`, `blocked`, `incompatible`
- T3-A-E1 intentional corruption output `[9, 2, 3]` left intact
- Bench honesty: no fixed machine-dependent ratio numbers in prose

## Residual risks (post-fix)
1. Filename / id `security` vs NumPy content remains product debt (orchestrator).
2. E1 guided units still name APIs in instruction/hints (`np.where`, `isnan`) — intentional for guided tier; E2/E3 no longer paste full one-liners.
3. Soft word-floor: some retros may still sit near ~35–45 w after fewer stronger sentences; principle / misconception / transfer / self-check are present on expanded units.
4. Full browser/Pyodide suite not re-run; no code/output drift introduced.
5. Role collapse returns if a later pass expands feedback and retro with the same slogan — keep feedback = *this* anti-pattern diagnosis.

## Validation
- Hand re-read of each edited unit after apply
- Integrity greps: instruction paths no longer contain `X - X.mean(axis=1, keepdims=True)`, full `where(isinf…)`, `ids[scores < med].tolist()`, full `linspace(0, 1, 5, dtype=…)`, or full `allclose(..., atol=1e-8)` as step text
- Hints on T2-B-E2 / T3-B-E3 / T4-B-E2 softened (no `(4, 1)` first-hint; no full one-liner as primary breadcrumb)
- `npx tsc --noEmit -p tsconfig.json` — clean

Section 14 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
