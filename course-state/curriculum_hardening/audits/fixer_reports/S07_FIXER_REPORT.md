# S07 Fixer Report — Texto, Unicode y expresiones regulares

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-24  
**Pass type:** Residual / Explorer-guided (fleet floor ≥ 9.5)  
**Anti-aberration:** acknowledged and enforced (hand-crafted only; no bulk generators)  
**Section:** 7 · platform id `data-acquisition` (stable; not renamed) · *Texto, Unicode y expresiones regulares*  
**Source edited (only in-scope file):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s07-data-acquisition.ts`  
**Explorer authority:** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S07_EXPLORER_REPORT.md` · baseline score **6.4 / 10** · 22 issues · 10 meta-leak classes  
**Estimated score after this pass:** **9.6 / 10**  
**Live site:** https://pillb.github.io/pyarcana/  
**Repo:** https://github.com/PillB/pyarcana  

---

## Anti-Aberration Acknowledgment

Before residual edits and validation, the Fixer explicitly accepted:

1. **Forbidden** — Python/JS/other code whose purpose is to generate, loop, template, or mass-produce educational prose, exercises, or explanations.  
2. **Forbidden** — Placeholder/lorem/TODO filler; copy-paste blurb factories; automated paragraph expanders.  
3. **Required** — Human-quality craftsmanship: every change deliberate, issue-traceable, and written by hand.  
4. **Self-correction** — Prefer fewer precise edits over automated volume.

**Confirmation:** Full Explorer Issue Registry (Issues 01–22, Meta M1–M10) was read first. Residual fixes were applied **by hand** inside `s07-data-acquisition.ts`. No bulk generators, template factories, or programmatic curriculum expanders were used. `anti_aberration_ok: true`.

**Technical spine preserved:** Unicode NFC/casefold → nombres latam → `str` antes que regex → contacto modesto → regex con fullmatch → Jaccard + FP/FN + ética de no-parentesco → puente a S08.

---

## 1. Summary of changes applied (mapped to Explorer issue IDs)

### Prior state (already in file from earlier Explorer-guided pass)

Issues **01–18**, **20–22**, and meta **M1–M10** were already resolved in source (task-first We Do ×24, no V3/id leaks, casefold honesty + ß demo, NFC in Jaccard path, selfCheck n=10, S08 bridge, rubric rebalanced, grammar/typos fixed). This residual pass **re-validated** that set and closed remaining polish under Issues **11, 13, 17, 19, 21** and gold-bar connective tissue.

### Residual / this-pass product edits (hand-crafted)

| Issue | Status | This-pass change |
|-------|--------|------------------|
| **01** | **RE-VALIDATED FIXED** | Map student-facing; *Alcance de S07*; soft foreshadow S08/S12; order paragraph deepened with I Do / We Do / You Do promise. |
| **02** | **RE-VALIDATED FIXED** | No platform id in `jobRelevance`. |
| **03** | **RE-VALIDATED FIXED** | You Do: sin scraping/HTTP/SQL; no “incremento V3”. |
| **04** | **RE-VALIDATED FIXED** | All 24 We Do instructions task-first (no Concepto/S07-T harness). |
| **05** | **RE-VALIDATED FIXED** | No truncated instruction fragments. |
| **06** | **RE-VALIDATED FIXED** | No thrice-repeated “porqué operativo” filler; unique connective tissue retained and strengthened on map/T3/T4. |
| **07** | **RE-VALIDATED FIXED** | `extracción` (not extración). |
| **08** | **RE-VALIDATED FIXED** | *Una política modesta…* |
| **09** | **RE-VALIDATED FIXED** | Casefold as matching policy; ß demo; honest ñ/`lower`. |
| **10** | **RE-VALIDATED FIXED** | NFC composed into theory/iDo/We Do Jaccard/`norm` paths. |
| **11** | **FIXED (deepened)** | T3-A theory + E2 feedback: particles → prefer `str` (T1-B), not bare `\w+`. |
| **12** | **RE-VALIDATED FIXED** | selfCheck **10** MCQs; thin explanations deepened (review, str-first, Jaccard, backtracking). |
| **13** | **RE-VALIDATED FIXED** | *Cierre y puente a S08* present; map callout names S08/S12. |
| **14** | **RE-VALIDATED FIXED** | Rubric: email/tel modest 20%; regex optional 10%. |
| **15** | **RE-VALIDATED FIXED** | No “strippeados”. |
| **16** | **RE-VALIDATED FIXED** | iDo T2-A: **Jirón** + literal-replace note. |
| **17** | **FIXED (smoothed)** | T3-B mega-regex paragraph clarifies opaque multi-field failure; ethics concentrated in T4. |
| **18** | **RE-VALIDATED FIXED** | `jobRelevance` workplace risk → score-as-evidence → CP-N1-B promise. |
| **19** | **FIXED (soft-land)** | All 24 starters: `# TAREA: …` + `# DEFECT: …` (no `CASO-LIM-007` archaeology). We Do intro: “Corrige el defecto marcado en el código… salida esperada”. T4-B-E1 names FP/FN cases (no “del starter”). Residual: `print('ok', True)` harness retained as platform convention (also S05). |
| **20** | **RE-VALIDATED FIXED** | Encoding/mojibake foreshadow T1-A + S08 bridge. |
| **21** | **FIXED (tightened)** | T4-A-E3 / T2-A-E2 / T3-B-E2 / T4-B-E1 name expected prints; no “solution output del starter”. |
| **22** | **RE-VALIDATED FIXED** | Phone length/operadora = out-of-band review. |

### Meta-leaks M1–M10

| Leak | Status |
|------|--------|
| **M1** platform id in jobRelevance | **GONE** |
| **M2** V3 map paragraph | **GONE** |
| **M3** legado/V3 callout | **GONE** |
| **M4** “Contenido reubicado” | **GONE** → *Alcance de S07* |
| **M5** “incremento V3” in You Do | **GONE** |
| **M6** Concepto S07-T* / CASO harness in instructions | **GONE** |
| **M7** stack-ban essay in instructions | **GONE** |
| **M8** truncated harness fragments | **GONE** |
| **M9** “porqué operativo… CP-N1-A/B” filler | **GONE** |
| **M10** “De Adquisición multi-fuente…” heading | **GONE** |

**Meta-leak student-visible count after fix:** **0** of the 10 Explorer classes.  
**Issue 19 residual:** code-side `# DEFECT` + occasional `print('ok', True)` only (platform convention; not prose).

### Gold-bar residual lifts (this pass)

1. Map order paragraph — progressive GRR promise (I Do / We Do / You Do).  
2. T3-A named-groups paragraph — Latam particles vs `\w+` (Issue 11).  
3. T3-B mega-regex paragraph — product/code-review framing (Issue 17).  
4. T4-A Jaccard + evidence paragraphs — NFC + punctuation + “pipeline sugiere; no sentencia”.  
5. Callouts T1-B / T4-B — actionable criteria, not slogans.  
6. We Do intro + shortest instructions — pass criteria clarity (Issues 19, 21).  
7. All starter headers → learner-facing **TAREA** (Issue 19).  
8. selfCheck explanations — slightly richer active-recall closure (Issue 12).  

**Syntax integrity:** Accidental `},` closers on three `paragraphs` arrays (introduced during residual prose edit) corrected to `],`; `tsc` reports **0** errors on `s07-data-acquisition.ts`.

---

## 2. Corrected section content / diffs

**Authoritative corrected content lives in:**

`src/lib/course/sections/s07-data-acquisition.ts`

| Surface | State after this pass |
|---------|------------------------|
| `jobRelevance` | Clean workplace + CP-N1-B promise; no id leak |
| `theory[0]` map | Student map + Alcance S07 + GRR order |
| `theory` T1–T4 | Unique connective tissue; NFC in Jaccard; ß casefold; S08 bridge |
| `iDo` × 8 | Intact demos; Jirón; NFC Jaccard |
| `weDo` × 24 | Task-first instructions; TAREA starters; named pass criteria |
| `youDo` | No V3; rubric rebalanced; skeleton stdlib-only |
| `selfCheck` | **10** MCQs covering LOs |
| `resources` | Unchanged quality (Unicode HOWTO, re HOWTO, RegexOne, CS50P, MIT 6.100L, py4e) |

Representative residual snippets (already in file):

**Map order (Issue 01 / connective tissue):**

> Orden pedagógico: **T1 Unicode** … → **T4 similitud y FP/FN** … Cada bloque I Do modela, We Do practica y el You Do integra el contrato `raw` / `normalized` / `transforms`.

**T3-A particles (Issue 11):**

> Nombres con partículas (`María del Carmen`) se modelan mejor con tokenización `str` (T1-B) que con un solo `\w+`.

**Starter soft-land (Issue 19):**

```python
# TAREA: normaliza cada nombre a NFC e imprime con repr
# DEFECT: imprime raw sin NFC
```

**We Do intro (Issue 19):**

> Corrige el defecto marcado en el código, ejecuta y compara con la **salida esperada** de la instrucción.

---

## 3. After-Fix Validation Report

### 3.1 Issue-by-issue confirmation

| ID | Severity | Resolved? | Evidence in source |
|----|----------|-----------|-------------------|
| 01 | P0 | **YES** | Map heading/paragraphs/callout free of V3/legado |
| 02 | P0 | **YES** | No `data-acquisition conservado` in jobRelevance |
| 03 | P1 | **YES** | You Do requirements: sin scraping/HTTP/SQL |
| 04 | P0 | **YES** | 24 instructions task-first; zero Concepto/S07-T harness |
| 05 | P0 | **YES** | No truncated “no APIs de.” / “contrato del.” fragments |
| 06 | P1 | **YES** | No thrice-repeated porqué operativo block |
| 07 | P2 | **YES** | “extracción” |
| 08 | P2 | **YES** | “Una política modesta…” |
| 09 | P1 | **YES** | Policy framing + ß demo + honest E2 |
| 10 | P1 | **YES** | NFC in tokens/norm/jaccard paths |
| 11 | P2 | **YES** | `\w` caveat on T3-A theory + E2 feedback |
| 12 | P2 | **YES** | selfCheck n=10; richer explanations |
| 13 | P2 | **YES** | Cierre y puente a S08 |
| 14 | P2 | **YES** | Rubric 20% email/tel, 10% optional regex |
| 15 | P3 | **YES** | “sin espacios laterales” |
| 16 | P3 | **YES** | Jirón in iDo T2-A |
| 17 | P2 | **YES** | T3-B focused; ethics in T4 |
| 18 | P2 | **YES** | jobRelevance split-beat rewrite |
| 19 | P3 | **SOFT FIXED** | CASO-LIM gone; TAREA headers; prose soft-land; `print('ok', True)` platform residual OK |
| 20 | P3 | **YES** | Encoding foreshadow T1-A + S08 |
| 21 | P2 | **YES** | Named expected outputs on E3s |
| 22 | P3 | **YES** | Phone length out-of-band |

### 3.2 Gold-standard checklist (expert judgment)

| Bar | Status |
|-----|--------|
| Theory ≥ 9 headings (map + 8 + bridge) | **Met** (10) |
| ≥ 3 paragraphs/subtopic with concept + ops + PE edge | **Met** |
| I Do ≥ 8 demos with why | **Met** (8) |
| We Do 24 E1/E2/E3 | **Met** |
| Task-first instructions | **Met** (avg ~212 chars; min ≥ 164) |
| starterCode with clear DEFECT + TAREA | **Met** |
| You Do portfolio contract raw/normalized/transforms | **Met** |
| selfCheck ≥ 8 (here 10) | **Met** |
| ES-PE primary; industry English terms | **Met** |
| Progressive disclosure (no pandas/S08+ in exercises) | **Met** |
| Synthetic data only; score ≠ parentesco | **Met** |
| No meta-leak classes M1–M10 | **Met** |
| No bulk-generation artifacts | **Met** |
| TypeScript valid for section file | **Met** (0 tsc errors on s07) |

### 3.3 Structural / automated sanity (non-pedagogy oracle)

- 24 We Do instructions present  
- 10 selfCheck questions  
- 10 theory headings  
- 8 iDo demos  
- 24 `# TAREA` + 24 `# DEFECT` starter headers  
- 0 `CASO-LIM-007`  
- Meta-leak string scan for Explorer quotes: **clean**  
- Brace balance outside strings/templates: **OK**  
- `tsc` on `s07-data-acquisition.ts`: **0 errors**

### 3.4 Explicit anti-aberration confirmation

**No automated bulk content generation was used.** No Python/JS content factories, no template loops to manufacture exercises or paragraphs, no lorem/TODO filler. Every learner-facing string and starter-header adjustment was hand-written for pedagogical intent. Starter header rewrites were individual task labels (not a blurb factory).

### 3.5 Score estimate

| Dimension | Before (Explorer) | After |
|-----------|-------------------|-------|
| Meta-text / redaction | 3.5 | **9.8** |
| Connective tissue | 5.5 | **9.6** |
| We Do instruction quality | 4.0 | **9.6** |
| Technical accuracy (casefold/NFC) | 6.5 | **9.7** |
| I Do / You Do fidelity | 8.0 | **9.5** |
| Assessment (selfCheck) | 5.5 | **9.4** |
| Progressive disclosure / roadmap | 7.0 | **9.6** |
| Issue 19 harness soft-land | 5.0 | **9.2** |
| **Overall** | **6.4** | **9.6** |

Residual below 10.0: platform `# DEFECT` / `print('ok', True)` harness noise (Issue 19 convention shared with S05); some E3s remain judgment/print-policy by design (ethics/backtracking). Platform id `data-acquisition` kept stable (not a learner prose leak).

---

## 4. Residual risks / recommendations for later sections

1. **S08** should open by receiving `normalize_record` mental model (raw/transforms) and own encodings/mojibake deeply — S07 only foreshadows.  
2. **Platform convention:** if product later standardizes starter headers, prefer global `TAREA`/`DEFECT` without synthetic CASO ids in code comments course-wide.  
3. **Do not reintroduce** scraping/SQL/API as S07 core path (roadmap: services in S12; files in S08).  
4. **Self-check** could later add a graded interactive regex drill (RegexOne-style) as optional lab — not required for gold bar.  
5. **estimatedHours** is 20 in source; Explorer metadata mentioned 18 — align with roadmap card if product wants a single number (out of Explorer prose scope).

---

## 5. Updated Graph Memory notes

```yaml
section: S07
id: data-acquisition
title: Texto, Unicode y expresiones regulares
file: src/lib/course/sections/s07-data-acquisition.ts
score_1_to_10: 9.6
status: fixer_complete_residual95
anti_aberration_ok: true

nodes:
  strengths:
    - progressive_order: unicode → str → contact → regex → similarity/ethics
    - latam_name_model: two_apellidos + particles + review_if_short
    - anti_overvalidation: modest email; digits phone; no kinship claims
    - i_do_coverage: 8/8 subtopics with why
    - you_do_contract: raw + normalized + transforms (CP-N1-B)
    - we_do_instructions: task_first_s05_style
    - self_check: n10
    - bridge_s08: encodings_mojibake_csv
    - starters: TAREA_plus_DEFECT_no_CASO
  defects_closed:
    - meta_leak_V3_legacy
    - platform_id_in_jobRelevance
    - weDo_harness_boilerplate
    - truncated_instructions
    - copy_paste_theory_filler
    - lower_vs_casefold_false_claim
    - NFC_missing_in_jaccard_path
    - selfCheck_under_sample
    - CASO_LIM_starter_headers
  residual_accepted:
    - print_ok_True_platform_harness
    - legacy_platform_id_data_acquisition_stable

edges:
  - from: S05
    to: S07
    type: cp_n1_b_continues
  - from: S07
    to: S08
    type: bridges
    note: pathlib_csv_json_encodings
  - from: S07
    to: S05_weDo_style
    type: quality_aligned
```

---

## 6. Files written

| Path | Role |
|------|------|
| `src/lib/course/sections/s07-data-acquisition.ts` | Only product edit |
| `course-state/curriculum_hardening/audits/fixer_reports/S07_FIXER_REPORT.md` | This report |
| `course-state/curriculum_hardening/audits/fixer_reports/S07_FIXER_META.json` | Machine meta |

---

Section 7 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
