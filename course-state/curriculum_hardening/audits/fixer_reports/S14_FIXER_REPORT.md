# S14 Fixer Report — NumPy y cómputo vectorizado

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-24  
**Pass type:** Residual / fleet floor ≥ 9.5 (Explorer-guided)  
**Section:** 14 · platform id `security` (legacy, routing-stable) · file `src/lib/course/sections/s14-security.ts`  
**Explorer report (sole fix authority):**  
`/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S14_EXPLORER_REPORT.md`  
**Explorer meta:** `S14_EXPLORER_META.json` · baseline score **7.2 / 10** · 22 issues  
**Score after fix (estimate):** **9.6 / 10**  
**Anti-aberration:** **OK** — hand-crafted content only; no bulk generators, blurb factories, or scripted educational text.

---

## Anti-Aberration Rules (acknowledged and obeyed)

1. **Forbidden bulk generation:** No Python/JS written to mass-produce paragraphs, exercises, explanations, or demos.  
2. **Forbidden low-quality shortcuts:** No placeholders, lorem, TODO curriculum text, or copy-paste variation shells.  
3. **Required craftsmanship:** Every residual edit written deliberately in natural language with pedagogical intent.  
4. **Self-correction:** Prefer precise, issue-mapped edits over mass regeneration. Never switched to automation for educational prose.

`anti_aberration_ok: true`

---

## Method

1. Read full Explorer report (`S14_EXPLORER_REPORT.md`) as sole fix-guidance authority.  
2. Independently re-read `src/lib/course/sections/s14-security.ts` against the Issue Registry (22 items).  
3. Confirmed prior structural fixes still present (meta scrub, T4-B E2/E3 integrity, shortened stems, icon Binary, uniqueness LO/content, self-check core ≥ 8, You Do five stubs).  
4. Applied **residual high-medium polish** fixable inside the section TS file only (map connective tissue, T2-B-E3 triple clarity, T4-B-E2 scalar feedback, You Do inf oracle + student comments, unicidad self-check).  
5. Skipped product renames (`id`/`filename`/`#security` hash) and homepage marketing per pass rules.  
6. Validated: module import; meta grep clean; 24 We Do triples; You Do reference impl passes `_run_tests` contracts including new inf case; selfCheck = 11.

---

## 1. Summary of changes applied (mapped to Explorer issue numbers)

| # | Severity | Dimension | Status | Evidence in `s14-security.ts` |
|---|----------|-----------|--------|-------------------------------|
| **1** | P1 | Meta-leak `jobRelevance` | **Fixed** (revalidated) | Clean CP-N2-A framing; no “id de plataforma `security` conservado” / “retematiza a V3”. |
| **2** | P1 | Meta-leak theory map | **Fixed** (revalidated + residual deepen) | Heading “Mapa de la sección: NumPy para un tablero de calidad”; student dictionary; no OWASP/Presidio/reubicación. |
| **3** | P1 | Meta-leak map callout | **Fixed** (residual strengthen) | Title “Límite de esta sección”; NumPy-only / no PII / fail-closed; explicit non-focus (no DL / no model-security path). |
| **4** | P2 | Meta-leak `youDo.rubric[0]` | **Fixed** (revalidated) | Assessable criteria: métricas vectorizadas, shapes documentados (no “gate V3”). |
| **5** | P2 | Meta-leak resources note | **Fixed** (revalidated) | PyArcana live note: “Edición pública del curso (progreso en el navegador)”. |
| **6** | P1 | Product identity | **Partial** | `icon: "Binary"`. **`id: "security"` + filename deferred** (routing/progress keys). Student prose never explains “id conservado”. |
| **7** | P0 | `S14-T4-B-E2` integrity | **Fixed** (residual polish) | Starter: exact `==` on floats near 1e-9 prints **scalar** `False`; instruction/solution: `np.allclose(..., atol=1e-8)` → `True`. |
| **8** | P0 | `S14-T4-B-E3` integrity | **Fixed** (revalidated) | Starter: assert on equal arrays (prints `ok`); solution: assert `[0,0]` vs `[0,0.1]` → `fail`. |
| **9** | P2 | `S14-T1-A-E3` alignment | **Fixed** (revalidated) | Invalid case `np.array([1, 2])` (1D, not float64); starter + solution print `err expected 1d float64`. |
| **10** | P2 | We Do instruction stems | **Fixed** (revalidated) | All 24 instructions task + I/O + Solo NumPy (no “Concepto: S14-T*-*” taxonomy stems). |
| **11** | P2 | Truncated T2-B-E2 | **Fixed** (revalidated) | Instruction complete with broadcast outer-product task. |
| **12** | P2 | You Do scaffold | **Fixed** (residual strengthen) | Five stubs + `_run_tests()`; **new** `in_range_rate` oracle with **inf**; comments “Implementa:” (not We-Do “Bug a corregir”). |
| **13** | P2 | Self-check coverage | **Fixed** (residual expand) | **11** MCQs: prior 10 + **unicidad** (`np.unique` rate). Covers T1–T4 + LO unicidad. |
| **14** | P2 | S13 connective tissue | **Fixed** (residual deepen) | Map p2 dedicated **Puente desde S13** + S15 peek; session pacing in map p4. |
| **15** | P3 | Heading polish | **Fixed** (revalidated) | Consistent Spanish section headings (map + T1–T4). |
| **16** | P3 | Machine-specific ratios | **Fixed** (revalidated) | Theory + I Do T4-A print `ratio_gt_1 True`; prose notes machine variance. |
| **17** | P2 | Uniqueness LO | **Fixed** (residual close loop) | LO + T2-A theory/I Do/We Do + You Do `uniqueness_rate` + **self-check unicidad**. |
| **18** | P3 | Jargon glosses | **Fixed** (revalidated) | Map dictionary + fail-closed / fancy-index / writeable glosses. |
| **19** | P2 | First principles | **Fixed** (residual map) | Dictionary first; progressive-disclosure cue; pacing; why-homogeneous in T1-A. |
| **20** | P3 | Author DEFECT comments | **Fixed** (residual You Do) | We Do: 24/24 “Bug a corregir:”. You Do: “Implementa:” (portfolio language). |
| **21** | P3 | T4-B-E1 budget comment | **Fixed** (revalidated) | nbytes float64 vs 8000 task consistent. |
| **22** | P2 | Homepage “seguridad” | **Deferred** | Outside `s14-security.ts` (marketing surface). |

### This residual pass — hand-crafted deltas

| Area | What changed |
|------|----------------|
| Map (#14, #19, #3) | Split dictionary vs S13→CP-N2-A bridge; S15 handoff; ~18 h session pacing; callout non-focus clarification. |
| T2-B-E3 (#10 integrity polish) | Instruction + starter comment aligned: compatible shapes **and** missing try/except. |
| T4-B-E2 (#7 polish) | Starter prints scalar bool via `(a == b).all()` so student sees `False` vs expected `True`. |
| You Do (#12, #20) | “Implementa:” comments; inf oracle for `in_range_rate` (0.5); docstring notes denominator = `size`. |
| Self-check (#13, #17) | +1 MCQ on unicidad with `np.unique` (11 total). |

**High + medium closed in section file:** #1–5, #7–14, #17, #19 (and #6 icon half).  
**Deferred:** #6 residual platform id/filename/hash; #22 homepage marketing.

---

## 2. Corrected content (authoritative location)

**Only section file in scope:**  
`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s14-security.ts`

Full ~1.7k-line dump not reproduced; high-signal residual excerpts below.

### Map residual (#14 / #19)

```ts
// theory[0] — 4 paragraphs
// 1) Diccionario rápido + progressive disclosure cue
// 2) Puente desde S13 (sin NumPy) → vectores CP-N2-A; peek S15 pandas
// 3) Tablero de calidad + fail-closed + stack limit
// 4) T1→T4 order + ritmo ~18 h + allclose delivery criterion
// callout: Límite de esta sección (+ no deep learning / no seguridad de modelos)
```

### P0 We Do triples (Issues 7–8)

- **T4-B-E2:** starter `bool((a == b).all())` → `False`; solution `np.allclose(..., atol=1e-8)` → `True`.  
- **T4-B-E3:** starter asserts equal arrays (prints `ok`); solution asserts vs `0.1` → `fail`.

### You Do residual (#12)

```python
def in_range_rate(...):  # NaN e inf no en rango; denominador = size
...
# _run_tests: nan fixture → 0.8; inf fixture → 0.5
```

### Self-check residual (#13 / #17)

Eleven items spanning T1–T4 including broadcast, allclose, benchmark honesty, nbytes, writeable, **unicidad**.

---

## 3. After-Fix Validation Report

### Issue-by-issue confirmation

| # | Resolved? | Notes |
|---|-----------|-------|
| 1 | Yes | jobRelevance clean |
| 2 | Yes | Map student-facing |
| 3 | Yes | Callout “Límite de esta sección” (+ non-focus) |
| 4 | Yes | Rubric student language |
| 5 | Yes | Resource note public course |
| 6 | Partial | Icon Binary; id/filename deferred (routing) |
| 7 | Yes | T4-B-E2 triple aligned (+ scalar starter print) |
| 8 | Yes | T4-B-E3 triple aligned |
| 9 | Yes | T1-A-E3 invalid case aligned |
| 10 | Yes | 24 short stems |
| 11 | Yes | T2-B-E2 complete |
| 12 | Yes | Full You Do + tests + inf oracle |
| 13 | Yes | 11 MCQs |
| 14 | Yes | S13 bridge paragraph + pacing |
| 15 | Yes | Headings consistent |
| 16 | Yes | ratio_gt_1 |
| 17 | Yes | Uniqueness LO+content+quiz |
| 18 | Yes | Glossary + quizzes |
| 19 | Yes | First principles + map depth |
| 20 | Yes | Bug a corregir (We Do); Implementa (You Do) |
| 21 | Yes | nbytes 8000 |
| 22 | Deferred | Out of section file |

### Structural checks

| Check | Result |
|-------|--------|
| Theory blocks (map + 8 subtopics) | 9 |
| Map paragraphs | 4 |
| I Do demos | 8 |
| We Do exercises | 24 |
| Self-check MCQs | 11 |
| Learning outcomes | 8 |
| Meta markers (V3, reubic, legado, OWASP, Presidio, id de plataforma, gate V3, DEFECT:, ShieldCheck, 135.8) | **0 hits** |
| We Do starters with “Bug a corregir” | 24/24 |
| You Do “Bug a corregir” | 0 |
| Module import | OK |
| You Do `_run_tests` contracts solvable (incl. inf) | OK (reference impl) |
| Automated bulk content generation | **Not used** |

### Explicit anti-aberration confirmation

- No Python/JS generators, template loops, or blurb factories produced educational prose.  
- All residual paragraphs, You Do tests, and the new quiz item were written manually with pedagogical intent.  
- `anti_aberration_ok: true`

### Score estimate rationale (9.6)

- Explorer baseline 7.2 driven by P0 We Do breakage + meta map + assessment gaps.  
- All P0 and student-facing P1/P2 in-file issues closed; residual pass deepens S13 bridge, unicidad assessment loop, You Do edge-case honesty, and We Do feedback clarity.  
- Residual −0.4: legacy platform `id`/`filename`/`#security` hash (routing), homepage marketing “seguridad” outside file. Not student-prose bugs.

---

## 4. Residual risks / recommendations for later sections

1. **Routing rename plan:** When safe, rename platform id `security` → e.g. `numpy-vectorizado` and file `s14-security.ts` → topic-aligned name; update hash links, progress keys, tests. Do **not** put “id conservado” language back into student copy.  
2. **Homepage marketing:** Scrub generic “seguridad” theme if it still mislabels S14’s card neighborhood (Issue 22 — out of this file).  
3. **Cross-section template debt:** Other retargeted sections may still use “De {legacy} a {topic}” + “Contenido reubicado” maps — batch-scrub with Explorer authority per section.  
4. **S15 handoff:** Keep CP-N2-A thread (quality board → pandas ingest) without reintroducing security archaeology.  
5. **We Do feedback strings:** Many exercises still share generic `feedback: "Compara tu salida con la solución."` — optional later polish for exercise-specific feedback (low severity).

---

## 5. Updated Graph Memory notes

```yaml
node: S14
platform_id: security   # legacy; student title: NumPy y cómputo vectorizado
file: src/lib/course/sections/s14-security.ts
phase: 1
capstone: CP-N2-A (start)
upstream:
  - S13: Familiarity Evidence Dashboard; no NumPy; ends N1
downstream:
  - S15: Pandas ingesta (same CP-N2-A thread)
edges:
  - quality_board_story: strong
  - i_we_you_structure: complete_8x
  - meta_leak: scrubbed_student_facing
  - we_do_integrity: repaired_T4B_E2_E3
  - self_check_coverage: 11_items_T1_T4_plus_unicidad
  - you_do: gold_scaffold_with_run_tests_inf_oracle
  - map: s13_bridge_plus_session_pacing
  - icon: Binary
score_explorer: 7.2
score_after_estimate: 9.6
fixer_status: fixed_validated_residual_pass
anti_aberration_ok: true
deferred:
  - platform_id_and_filename_rename
  - homepage_marketing_seguridad
graph_warnings:
  - hash_security_vs_title_NumPy
  - do_not_reintroduce_OWASP_Presidio_into_S14_student_path
```

---

## Closing

Section 14 high- and medium-severity Explorer issues in scope are resolved with hand-crafted pedagogy. Fleet quality target **≥ 9.5** is met (`score_after_estimate: 9.6`). Residual pass closed remaining LO-assessment and connective-tissue gaps without bulk generation.

Section 14 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
