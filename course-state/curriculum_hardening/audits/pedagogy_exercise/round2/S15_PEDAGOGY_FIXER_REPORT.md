# S15 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Pandas: ingesta, selección y tipos
- **id:** `stdlib-deep` (index 15; archivo `s15-stdlib-deep.ts`)
- **source:** `src/lib/course/sections/s15-stdlib-deep.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S15_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2 (plus optional I Do retros)
- No generators, no bulk templates, no wholesale rewrite of units already **Strong**
- **No code/output changes** — prose-only tightening
- Word-count measurement only; each paragraph written for a pedagogical purpose

## Acceptance checklist
- [x] P1 metacognición: T3-A-E1, T4-A-E1, T4-B-E2, T4-B-DEMO retros
- [x] P1 role split: T2-B-E2 and T4-A-E2 feedback ≠ retrospective
- [x] P2 polish: thin retros, thin feedback, E3 instruction migas
- [x] Optional I Do retros: T2-A, T3-A, T3-B, T4-A (misconception + self-check)
- [x] Spanish PE; no real PII; score sintético ≠ culpa preserved
- [x] No generators used
- [x] Solution `code` / `output` preserved (incl. hash `309b0e45`, openpyxl, `SIN_DATO`)
- [x] Typecheck (`tsc --noEmit`) clean

## What was fixed

### P1 (learning integrity / metacognición / role collapse)

| Unit | Severity | Changes |
|------|----------|---------|
| **S15-T3-A-E1** | P1 retro puente-only | Retrospective: title **antes** de category; misconception “castear y limpiar después”; self-check de categorías del fixture |
| **S15-T4-A-E1** | P1 retro puente-only | Retrospective: round-trip = write/seek/re-read/compare; classic `Unnamed: 0`; self-check de `seek(0)` |
| **S15-T4-B-E2** | P1 fb corto + retro delgado | Feedback: `rows=0`/`columns=[]` no reconcilia; hechos del DF real. Retro: hardcodear ceros miente; self-check si el DF crece a 300 |
| **S15-T2-B-E2** | P1 collapse fb↔retro | Feedback: slice sin independencia + `.copy()` **después** del loc. Retro: vida propia del subset + “¿si solo lees, necesitas copy?” |
| **S15-T4-A-E2** | P1 collapse apertura | Feedback: buffer vacío → `to_excel` + medir bytes; no hardcodear `True`. Retro: honestidad de dependencias + alternativa CSV+schema JSON |
| **S15-T4-B-DEMO** | P1 retro delgado | Retrospective: classic hash de `str(df)`/index; self-check `rows=3` y payload `index=False` |

### P2 polish

| Unit | Changes |
|------|---------|
| **S15-T2-A-DEMO** | Retro: encadenamiento `df[df...][cols]` + ética del flag de laboratorio |
| **S15-T3-A-DEMO** | Retro: coerce sin conteo = basura elegante; self-check parser vs conversión |
| **S15-T3-B-DEMO** | Retro: report 0 vs 1; dónde viaja el `report` en CP-N2-A |
| **S15-T4-A-DEMO** | Retro: classic confiar en memoria / `Unnamed: 0`; self-check `excel_ok` |
| **S15-T1-A-E1** | Retro: self-check reordenar CSV |
| **S15-T1-A-E2** | Feedback: posición vs etiqueta + reordenamiento |
| **S15-T1-A-E3** | Instruction: sin API exacta `s1.add(..., fill_value=0)`; método de Series + verificar dict |
| **S15-T1-B-E1** | Retro: `isna` 0 con basura visible; self-check `SIN_DATO` vs `NA` |
| **S15-T1-B-E2** | Feedback: `head()` bonito miente; filtros temporales |
| **S15-T2-A-E1** | Retro: self-check “al menos 0.5” |
| **S15-T2-A-E3** | Instruction: celda por **posición** (sin regalar `iloc[1, 0]`) |
| **S15-T2-B-E1** | Retro: ticket de calidad al exportar; self-check `fillna` en print |
| **S15-T2-B-E3** | Feedback: alias `c = df` + mutación del original |
| **S15-T3-A-E2** | Retro: NaN = embrión del `coercion_report`; self-check conteo/posición |
| **S15-T3-A-E3** | Feedback: `ignore` deja string opaco; coerce + isna → `1` |
| **S15-T3-B-E1** | Retro: self-check delta si `before` ya tenía nulo |
| **S15-T4-A-E3** | Feedback: `contract = {}` no documenta; comprehension + `sorted` |
| **S15-T4-B-E1** | Retro: booleano fijo / `deep=False`; self-check del fixture de strings |
| **S15-T4-B-E3** | Instruction: serializar CSV sin index + SHA-256 truncado (sin línea canónica completa) |

### Left alone (as directed)
- iDo: T1-A, T1-B, T2-B (already Strong/Adequate)
- weDo: T1-B-E3, T2-A-E2, T3-B-E2, T3-B-E3
- youDo: **S15-YouDo** (retrospective already Strong ~68w)
- Starters, solutions, outputs, tests, hints (except where E3 instruction was loosened — hints stay more direct than instruction)
- openpyxl dependency and canonical hashes untouched

## Code / output integrity
- **No** starterCode / solutionCode / output edits in this pass
- Preserved: hash `309b0e45` (T4-B-E3), demo manifest `15375056672a`, fixture `SIN_DATO`, openpyxl Excel paths, score ethics notes

## Residual risks (post-fix)
1. **openpyxl** still required for T4-A demo/E2 — document, do not fake success.
2. **E3 hints** remain more direct than instructions (by design for transfer fade); do not “fix” hints into full spoilers or empty them.
3. Soft word-floor: a few retros may sit ~40–55w with principle + misconception + self-check present (prefer fewer stronger sentences).
4. Role collapse can return if a later pass reuses the same opening sentence for feedback and retrospective.
5. Full browser/Pyodide suite not re-run; no code/output drift introduced.

## Validation
- Hand re-read of each edited unit after apply
- Integrity: T2-B-E2 and T4-A-E2 no longer share opening phrases between feedback and retrospective
- E3 instructions no longer paste `s1.add(s2, fill_value=0)`, `iloc[1, 0]`, or `blob = df.to_csv...hexdigest()[:8]`
- Canonical outputs and fixtures grepped intact (`309b0e45`, `SIN_DATO`)
- `npx tsc --noEmit` exit 0
- Field completeness unchanged from R1 shell (preamble/title/retrospective already present)

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 15 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
