# S14 Fixer Report (Round 2) — NumPy y cómputo vectorizado

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S14  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **14** — NumPy y cómputo vectorizado |
| Canonical file | `src/lib/course/sections/s14-security.ts` |
| Live route | https://pillb.github.io/pyarcana/#security |
| Internal ID | `security` (legacy slug retained for progress/URLs) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S14_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S14_report.md` |
| Expert-2 audit | `expert_audit/expert_2_audit/Auditoría de Calidad de la Sección 14.docx` |
| Spanish-quality JSON (pre-R2 snapshot) | `course-state/curriculum_hardening/audits/spanish_quality/S14_SPANISH_QUALITY.json` (pre-fix **8.89** / FH **81.9**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Assessment surface | Public `selfCheck` (11 MCQs) in canonical file; You Do `_run_tests()` oracle |
| Validation | Python execute-and-diff on **24** solutions + **16** theory/I Do oracles; You Do tests with fail-closed; Spanish audit `--from 14 --to 14 --no-lt`; `tsc --noEmit` |

**Scope obeyed:** Only `s14-security.ts` was edited. No `SectionView.tsx`, no `learning_roadmap.md`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Python was used only to apply pre-written feedback maps by exercise id, strip a fixed harness line, execute snippets, compare stdout, and measure Spanish metrics.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Prior Fixer campaigns (Explorer-guided + residual fleet) already closed the bulk of Explorer **structural** defects:

| Class | Status before R2 |
|--------|------------------|
| Explorer #1–#5 meta V3 / OWASP / reubicación / gate V3 / resource note | **Already fixed** |
| Explorer #6 icon `ShieldCheck` | **Already fixed** → `Binary` |
| Explorer #7–#8 T4-B E2/E3 starter↔solution mismatch | **Already fixed** |
| Explorer #9 T1-A-E3 case drift | **Already fixed** |
| Explorer #10–#11 templated / truncated stems | **Mostly fixed**; residual polish |
| Explorer #12 You Do scaffold thinner than objectives | **Already fixed** (5 functions) |
| Explorer #13 self-check undersample (5 items) | **Already fixed** (11 MCQs) |
| Explorer #14 S13→S14 bridge | **Already fixed** (Puente + diccionario) |
| Explorer #16 fixed machine ratios | **Already fixed** (`ratio_gt_1`) |
| Explorer #6 / Expert #1–#3 / Expert-2 #1–#2 legacy `id: "security"` + playground | **Deferred** (compat + global) |
| Expert #4 `Si` without tilde | **Active** |
| Expert #5–#9 long sentences / dictionary list | **Active** |
| Expert-2 #3 `print('ok', True)` harness in starters | **Active** |
| Expert-2 #4–#5 generic feedback / flat E1–E3 scaffolding | **Active** |
| Expert-2 #8 fail-closed not in `_run_tests` | **Active** |

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| #1–#5 meta V3/OWASP/gate | Explorer | Already fixed | Re-validated: 0 hits | Grep |
| #6 icon ShieldCheck | Explorer | Already fixed | `icon: "Binary"` retained | Read |
| #6/#22 id `security` | Explorer / Expert / E2 | Deferred | **Kept** stable hash; no rename | Residual |
| #7–#8 T4-B E2/E3 | Explorer | Already fixed | Starters match allclose / assert_fail | Exec |
| #9 T1-A-E3 | Explorer | Already fixed | Invalid case `np.array([1,2])` | Exec |
| #10 instruction templates | Explorer | Partially fixed | Softened “starter” → “código inicial”; split T2-B-E2 | Read |
| #11 T2-B-E2 truncation | Explorer | Already fixed (full constraints) | Split into shorter sentences | Read |
| #12 You Do scaffold | Explorer | Already fixed | 5 functions + tests retained | Exec |
| #13 self-check coverage | Explorer | Already fixed | 11 items; fixed `Sí` option | Manual |
| #14 connective tissue | Explorer | Already fixed | Dictionary list + pedagogy list | Read |
| #16 machine ratios | Explorer | Already fixed | `ratio_gt_1` only | Exec |
| #17 uniqueness LO | Explorer | Already fixed | Theory + E2 + self-check | Read |
| Expert #4 `Si,` tilde | Expert / SQ | **Active** | → `Sí, de derecha a izquierda:…` | Grep |
| Expert #5 dictionary density | Expert | **Active** | 8-bullet Markdown list | Read |
| Expert #6–#9 long sentences | Expert | **Active** | Split T2-A, T4-A, youDo, portfolio list | Editorial |
| Expert #11 `memo` | Expert | **Active** | → “nota del portfolio” | Grep |
| Expert labels I/We/You Do | Expert / S05 pattern | **Active** | Softened English labels in intros | Read |
| E2 #3 `print('ok', True)` | Expert-2 | **Active** | Removed from all 22 starters | Grep + exec |
| E2 #4–#5 feedback | Expert-2 | **Active** | 24 diagnostic tests/feedback strings | Manual map |
| E2 #4 E3 scaffolding | Expert-2 | **Active** | Softened E3 second hints; We Do intro states taper | Read |
| E2 #6 single-shot bench | Expert-2 | Partial | Theory note: production → median; demo keeps one pair | Read |
| E2 #8 fail-closed tests | Expert-2 | **Active** | `_run_tests` + `completeness` docstring ValueError on 1D | Exec |
| Callout “Side effects” | Style / S05 | **Active** | → “Efectos colaterales por view” | Read |
| SQ high AGREEMENT / diacritics | Spanish JSON | Mixed | Real: `Sí`; rest mostly code FP | Audit |
| SectionView security playground | Expert #2 / E2 | Platform | **Not fixed** (SectionView.tsx) | Residual |
| learning_roadmap.md “Seguridad…” | Expert-2 #1 | Platform/docs | **Not fixed** (out of section scope) | Residual |
| RichText Markdown leak | Campaign | Platform | **Not fixed** (global agent) | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **88.9** (was **8.89** / **81.9**); 10 residual findings (low/medium noise, mostly code tokens).

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s14-security.ts` only.

### Diff group R2-A — Map cognitive load (Expert #5, #8; Explorer #14 polish)

- Diccionario convertido a lista de 8 viñetas + `view vs. copy`.
- Orden pedagógico en viñetas; “You Do” → **Tú haces**.
- Hilo conductor: `latam` → `LatAm`; frase de métricas desglosada.

### Diff group R2-B — Long sentences & redaction (Expert #4, #6–#9, #11)

- T2-A reducciones: definición + relevancia en dos oraciones.
- T4-A: split del ratio máquina-dependiente; nota de mediana en producción; `memo` → **nota del portfolio**.
- You Do context y `portfolioNote` como lista de documentación.
- Self-check broadcast option: **`Sí,`** + puntuación limpia.
- Callout “Efectos colaterales por view”.

### Diff group R2-C — Exercise integrity (Expert-2 #3, #4, #5)

- Eliminadas **22** líneas `print('ok', True)` de starters (salida alineada al oráculo).
- Cada We Do recibe `tests` + `feedback` diagnósticos (24 unidades, mapeo por id).
- Instrucciones: “bug del starter” → “bug del código inicial”.
- T2-B-E2 instruction/hints reescritos a mano (progressive outer product).
- E3: segunda pista menos “API spoon-feed”.
- We Do intro: anuncia reducción de andamiaje E1→E3.

### Diff group R2-D — Capstone fail-closed (Expert-2 #8)

- `completeness` documenta `ValueError` si `ndim != 2`.
- `_run_tests()` intenta `completeness` 1D y exige `ValueError`.

### Deferred (documented, not applied)

- `id: "security"` / filename `s14-security.ts` (progress + URL + SectionView key).
- Interactive playground under `SectionView.tsx` key `'security'` (hashing demo).
- `learning_roadmap.md` still listing S14 as seguridad (docs outside section file).
- Full multi-run microbenchmarks / timeit rewrite of all T4 demos (theory note only).

---

## 4. After-Fix Validation Report

| Check | Result |
|--------|--------|
| Explorer issues #1–#5, #7–#9, #12–#14, #16–#17 | Fixed or already fixed |
| Explorer #6 id/hash | Residual (compat) |
| Expert #4 `Sí` | Fixed |
| Expert long-sentence cluster | Fixed |
| Expert-2 starter harness | Fixed (0 `print('ok', True)`) |
| Expert-2 diagnostic feedback | Fixed (24/24 unique) |
| Solution oracles | **24/24 PASS** |
| Theory + I Do oracles | **16/16 PASS** |
| You Do tests + fail-closed | **PASS** |
| selfCheck correctIndex | 11 items; dist {0:3, 1:3, 2:2, 3:3} |
| Meta-leak greps (V3, OWASP, gate V3, reubic) | Clean |
| Spanish quality | **8.89 → 10.0** (FH 81.9 → 88.9) |
| `tsc --noEmit` | Clean |
| Markdown platform leak | Residual (global) |
| Live hash `#security` | Residual (identity) |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation and for applying pre-authored per-exercise feedback strings by stable exercise id.

---

## 5. Residual risks and later recommendations

### Section-local residuals

- E2/E3 still expose full `solutionCode` in the data model (platform shows solutions by design); true fading of answers would need UI policy, not only copy.
- Single-shot timings remain in demos (honest enough for teaching; not production microbench).
- Some exercise instructions remain long procedural stems (acceptable for code tasks).

### Repository-wide / deferred

- Legacy `id: "security"` + filename `s14-security.ts` → needs migration aliases + progress remap (Global Agent C).
- `SectionView.tsx` playground for `'security'` still teaches hashlib (Global Agent A / playground inventory).
- `learning_roadmap.md` still lists S14 as seguridad (docs PR, not this file).
- RichText raw Markdown on some fields (Global Agent A).

### Adjacent-section notes (do not expand this fix)

- S15 should continue “de NumPy a tablas tipadas” using CP-N2-A vocabulary already set here.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| Section node | S14 NumPy vectorizado / CP-N2-A open |
| Concept nodes corrected | diccionario ndarray; diagnostic We Do feedback; starter integrity; fail-closed completeness |
| Prerequisite edges | S13 evidence dashboard (Python lists/dicts, no NumPy) |
| Forward edges | S15 pandas ingesta; S16–S17 quality gates / joins |
| Retained strengths | 8 LO × 8 I Do × 24 We Do; synthetic PE clients; honest allclose culture |
| Resolved defect nodes | meta V3 (prior); harness `ok True`; generic feedback; `Sí` orthography; dictionary density |
| Remaining risks | legacy id/hash; wrong playground; roadmap doc drift |
| Compatibility constraints | keep `id: "security"` until migration |
| Assessment coverage | 11 MCQs cover dtype, mask, axis, view, nanmean, broadcast, allclose, bench, nbytes, writeable, unique |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s14-security.ts` | Only product edit: theory, intros, We Do integrity/feedback, You Do tests, self-check orthography |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S14_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S14.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S14 |
| `course-state/curriculum_hardening/audits/spanish_quality/S14_SPANISH_QUALITY.json` | Regenerated by validation audit script |

---

## 8. Worklog confirmation

Completion entry written to `expert_audit/worklog_entries_r2/S14.md` and a brief pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S14**.

---

Section 14 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
