# S19 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Visualización y comunicación accesible
- **id:** `databases-orm` (index 19; archivo histórico `s19-databases-orm.ts`; contenido = charts honestos, Matplotlib, a11y y claims)
- **source:** `src/lib/course/sections/s19-databases-orm.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S19_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2 (plus optional I Do retros)
- No generators, no bulk templates, no wholesale rewrite of units already **Strong**
- **No code/output changes** — prose-only tightening
- Word-count measurement only; each paragraph written for a pedagogical purpose

## Acceptance checklist
- [x] P1 E2 spoiler strip: T1-B-E2 instruction (gate logic), T3-A-E2 instruction (f-string paste)
- [x] P1 role split: T2-B-E3 and T4-A-E3 feedback ≠ retrospective
- [x] P2 polish: shortest retros, thin feedback, mild E2 over-spec, title soft floor
- [x] Optional I Do retros: T1-B-DEMO, T3-A-DEMO (self-check)
- [x] Spanish PE; no real PII; CASO-LIM-019 / datos sintéticos preserved
- [x] No generators used
- [x] Solution `code` / `output` preserved (tooltip `Lima: 28 PEN (n=40)`, `revisar`, `['Vol', 'Med']`, `unidad: PEN | n: 10`, etc.)
- [x] Typecheck (`tsc --noEmit`) clean

## What was fixed

### P1 (learning integrity)

| Unit | Severity | Changes |
|------|----------|---------|
| **S19-T1-B-E2** | P1 full gate logic in steps | Instruction: three veredictos by encoding/`ylim_bottom` (point to I Do); no paste of `honesto`/`revisar`/`ok_con_nota` decision tree |
| **S19-T3-A-E2** | P1 full solution f-string | Instruction: complete f-string with `n` in a11y token order; success stays in preamble. Retro: hover honesty + self-check on missing `(n=…)` |
| **S19-T2-B-E3** | P1 feedback ≈ retro | Feedback: diagnose empty `get_title()` with only suptitle. Retro: axes title as panel contract + self-check + bridge to T3-A |
| **S19-T4-A-E3** | P1 feedback ≈ retro | Feedback: diagnose keys-only join (`unidad \| n`). Retro: `k: v` toward S21 + classic error + self-check + bridge to T4-B |

### P2 polish

| Unit | Changes |
|------|---------|
| **S19-T1-A-E1** | Retro: pie “bonito” + self-check tendencia semanal |
| **S19-T1-A-E2** | Retro: orphan brief + self-check clave “por qué barras” |
| **S19-T1-A-E3** | Feedback: both lines `bar` → ignore question; normalize + keyword |
| **S19-T1-B-E1** | Retro: classic wrong denominator + self-check span with max 50 |
| **S19-T1-B-E3** | Feedback: inverted ternary still prints `ok` |
| **S19-T2-A-E1** | Retro: classic dramatize gap + self-check if bottom stays 1 |
| **S19-T2-A-E2** | Instruction: no exact ylabel/ylim literals; goal-level PEN + baseline 0. Retro: float cast self-check |
| **S19-T2-B-E1** | Retro: hardcode `png_ok`/panels; self-check BytesIO |
| **S19-T2-B-E2** | Feedback: diagnose bare `fig_cpn2b.png`. Retro: one PNG for all re-renders + self-check `version=1` |
| **S19-T3-A-E1** | Retro: hardcode other region + self-check 22 under Lima filter |
| **S19-T3-A-E3** | Title → “Plantilla tooltip reutilizable por fila”; feedback: missing `(n=…)` |
| **S19-T3-B-E1** | Retro: “redondear bonito” + self-check 28 vs 28.0 |
| **S19-T3-B-E2** | Retro: call sample a censo + self-check state only with `sample_n` |
| **S19-T3-B-E3** | Feedback: diagnose string without PEN; keep separator |
| **S19-T4-A-E1** | Feedback: only `unidad=PEN` → missing fuente. Retro: classic + portfolio self-check |
| **S19-T4-A-E2** | Retro: three keys + typo `limitación` self-check |
| **S19-T4-B-E1** | Title → “Rechazar sobreclaim nacional sin muestra” |
| **S19-T4-B-E2** | Retro: blue contrast classic + `hatch=""` self-check |
| **S19-T1-B-DEMO** | Retro: self-check honest denominator = max not gap |
| **S19-T3-A-DEMO** | Retro: self-check Lima → Cusco tooltip change |

### Left alone (as directed)
- iDo Strong units: T1-A, T2-A, T2-B, T3-B, T4-A, T4-B demos (except optional T1-B / T3-A retros)
- weDo already Strong: T2-A-E3, T4-B-E3, and other units without residual text
- youDo entire shell (defense retrospective ~96 w; multi-check style OK)
- All `starterCode` / `solutionCode` / `output` / tests / hints (hints remain more direct than E2/E3 instructions by design)

## Code / output integrity
- **No** starterCode / solutionCode / output edits in this pass
- Preserved: `revisar`, `Lima: 28 PEN (n=40)`, `Cusco: 22.5 PEN (n=32)`, `['Vol', 'Med']`, `unidad: PEN | n: 10`, `factor 5.0`, `True` parity/ylim gates, versioned `fig_cpn2b_v3.png`, claim `RECHAZADO`/`PERMITIDO`, Matplotlib Agg paths

## Residual risks (post-fix)
1. **Historical id/filename** (`databases-orm`) vs title “Viz accesible” — orchestration only; not renamed here.
2. **Matplotlib/Agg** in T2 We Do: environment risk; outputs not re-run (prose-only pass).
3. **Exact-output labs:** de-spoiled E2 instructions keep success criteria in **preamble**; graders still depend on canonical strings.
4. Soft word-floor: expanded retros sit with principle + misconception + self-check; prefer fewer stronger sentences over essay bloat.
5. Role collapse can return if a later pass reuses the same opening for feedback and retrospective.
6. E1 guided formulas (T1-B-E1 factor) intentionally keep more breadcrumb than E2/E3.

## Validation
- Hand re-read of each edited unit after apply
- Integrity: T2-B-E3 and T4-A-E3 no longer share the same claim between feedback and retrospective
- E2 instructions no longer paste full `gate_baseline` tree or exact tooltip f-string
- Canonical outputs grepped intact (`Lima: 28 PEN (n=40)`, `revisar`, `unidad: PEN | n: 10`)
- `npx tsc --noEmit` exit 0
- Field completeness unchanged from R1 shell (preamble/title/retrospective already present)

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat; no bulk preamble expansion of 4-bullet form
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 19 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
