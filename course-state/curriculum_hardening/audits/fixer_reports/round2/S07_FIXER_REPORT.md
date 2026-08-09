# S07 Fixer Report (Round 2) — Texto, Unicode y expresiones regulares

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S07  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **7** — Texto, Unicode y expresiones regulares |
| Canonical file | `src/lib/course/sections/s07-data-acquisition.ts` |
| Live route | https://pillb.github.io/pyarcana/#data-acquisition |
| Internal ID | `data-acquisition` (legacy slug retained for progress/URLs/playground key) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S07_EXPLORER_REPORT.md` (baseline **6.4/10**, Issues 01–22) |
| Expert report | `expert_audit/S07_report.md` (post-R1 deep audit **7.5/10**, F-01…F-20) |
| Spanish-quality JSON (pre R2) | `course-state/curriculum_hardening/audits/spanish_quality/S07_SPANISH_QUALITY.json` (pre-fix score **8.54**, FH **75.3**) |
| Spanish-quality (post R2) | same path rewritten by validation run: score **9.66**, FH **74.7**, findings 14 (mostly false positives on code tokens) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context) | `course-state/curriculum_hardening/audits/fixer_reports/S07_FIXER_REPORT.md` |
| Expert-2 audit | No dedicated S07 file under `expert_audit/expert_2_audit/` |
| Assessment surface | Public `selfCheck` (10 MCQs) in canonical file; authenticated exam bank not modified |
| Validation | Manual issue ledger; Python code oracles for NFC/casefold/email/phone/Jaccard/fullmatch; `spanish_quality_audit.py --from 7 --to 7 --no-lt`; `tsc` no errors on S07 |

**Scope obeyed:** Only `s07-data-acquisition.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was used only for mechanical validation (code execution, Spanish metrics, typecheck).

---

## 2. Summary of changes applied

### Prior state (Round 1 already closed Explorer P0/P1 spine)

Re-inspection of current source confirmed Round 1 had already fixed Explorer Issues **01–22** and meta-leaks **M1–M10** at the curriculum-object level:
- No V3/legado/id-conservado in learner prose
- All 24 We Do instructions task-first (no Concepto/S07-T harness)
- No truncated instructions
- Casefold framed as policy (not “lower fails on ñ”)
- NFC in Jaccard / `norm` paths
- selfCheck n=10
- S08 bridge block present
- Rubric rebalanced (email/tel 20%, regex optional 10%)
- `extracción`, *Una política modesta…*, no “strippeados”

### Round-2 product edits (hand-crafted, expert F-02…F-20 + Spanish polish)

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 01–08, 04–05, M1–M10 | Explorer | Already fixed | Re-validated absent | Grep clean |
| Exp 09 casefold honesty | Explorer | Already fixed | Re-validated starter/hint | Oracle True |
| Exp 10 NFC Jaccard | Explorer | Already fixed | Re-validated theory/iDo/We Do | Oracle 0.667 |
| Exp 11–22 | Explorer | Already fixed | Re-validated | Source inspection |
| F-01 playground SQL/scraping | Expert | Active (global) | **Deferred** — `SectionView.tsx` out of section scope | Residual risk |
| F-07 playground accents | Expert | Active (global) | **Deferred** with F-01 | Residual risk |
| F-09 id rename | Expert | Active (compat) | **Deferred** — keep `data-acquisition` | Compatibility residual |
| F-02 jobRelevance run-on | Expert | Active | Split sentence; *intake*; **afirmaciones** | Manual + SQ |
| F-08 “el resultado son” | Expert | Active | → “El resultado: …” | Manual |
| F-06 anglicisms | Expert | Active | Gloss *fail-closed*, *code review*, *bug*; claims→afirmaciones; mental model→modelo mental | Grep |
| F-03 / F-04 T3-B long | Expert | Active | Split compile/findall and mega-regex paragraphs | Manual |
| F-05 You Do context | Expert | Active | Italic stage labels; “email y teléfono” | Manual |
| F-10 tagline “strings” | Expert | Active | → “cadenas” | Manual |
| F-11 / F-14 iDo intro | Expert | Active | “Las ocho demos…”; Pyodide prose (no browser-pyodide leak in intro) | Manual |
| F-13 “matchean” | Expert | Active | → “coinciden” | Manual |
| F-15 mental model | Expert | Active | → **modelo mental** | Manual |
| F-17 / Q10 selfCheck | Expert | Active | Adjective chain; digits_only split | Manual |
| F-19 FP/FN gloss | Expert | Active | *falso positivo* / *falso negativo* at first use | Manual |
| F-20 transforms order | Expert | Active | “orden de aplicación” | Manual |
| SQ medium false-positives | Spanish | N/A | Documented (José×2 output, code tokens, math intervals) | SQ 9.66 |
| Theory connective polish | Expert §6 | Partial | Hand rewrites T1–T4 paragraphs for WPS/FH | Manual |

---

## 3. Full corrected content or precise diffs

**Authoritative corrected content:** `src/lib/course/sections/s07-data-acquisition.ts`

Representative R2 diffs (intent):

**tagline + jobRelevance (F-02, F-08, F-10):**
```diff
-  tagline: "Unicode latam, strings y regex sin sobrevalidar",
+  tagline: "Unicode latam, cadenas y regex sin sobrevalidar",
-  jobRelevance: "…partículas: el resultado son falsos negativos… **claims automáticos** …"
+  jobRelevance: "…partículas. El resultado: falsos negativos… **afirmaciones automáticas** …"
```

**iDo intro (F-11, F-14):**
```diff
- intro: "Ocho demos (I Do): … entorno browser-pyodide …"
+ intro: "Las ocho demos (I Do) modelan el pipeline T1→T4: … el editor ejecuta Python real en tu navegador (Pyodide) …"
```

**T3-B (F-03, F-04):**
```diff
- "`re.compile` reutiliza el patrón en loops: … `findall` / `finditer` … — herramientas de **extracción**…"
+ "`re.compile` reutiliza el patrón en bucles: … `findall` y `finditer` … Son herramientas de **extracción**…"
- "… más testeable y más fácil de explicar en code review. La elegancia … es un bug de producto…"
+ "… más testeable. También es más fácil de explicar en una revisión de código (*code review*). … defecto de producto disfrazado (*bug*)…"
```

**T4-B FP/FN (F-19) + Cierre (F-15):**
```diff
- "**FP** (false positive): … **FN**: debería matchear…"
+ "**FP** (*falso positivo*): … **FN** (*falso negativo*): debería coincidir…"
- "Lleva a S08 tu mental model de `normalize_record`…"
+ "Lleva a S08 tu **modelo mental** de `normalize_record`…"
```

**We Do / You Do / selfCheck:**
- `matchean` → `coinciden`
- We Do intro: “2 pistas cada uno”; claims → afirmaciones
- You Do: transforms “orden de aplicación”; context polish
- selfCheck Q3/Q7/Q10 explanations polished

Technical spine (Unicode → str → contact → regex → Jaccard/ethics → S08 bridge), 8 iDo demos, 24 We Do contracts, You Do skeleton, and 10 selfCheck keys are **unchanged in learning intent**.

---

## 4. After-Fix Validation Report

### Explorer Issues 01–22

| ID | Status |
|----|--------|
| 01–08, 04–05 (meta/boilerplate/truncation) | **already fixed** (R1); re-validated |
| 09 casefold honesty | **already fixed**; re-validated |
| 10 NFC Jaccard | **already fixed**; re-validated |
| 11–22 remaining pedagogy/bridge/rubric | **already fixed**; re-validated |
| Residual harness `print('ok', True)` / `# DEFECT:` | **residual risk (platform convention)** — Issue 19 soft residual |

### Expert F-01…F-20

| ID | Status |
|----|--------|
| F-01, F-07 playground | **residual risk — global** (`SectionView.tsx`) |
| F-09 id rename | **residual risk — compatibility** |
| F-02–F-06, F-08, F-10–F-11, F-13–F-15, F-17, F-19–F-20 | **fixed** this pass |
| F-12 dash consistency | **not applicable** / course-wide polish |
| F-16 fullmatch vs match pedagogy | **residual risk (optional deepen)** — deliberately omit `re.match` for load |
| F-18 portfolioNote | **already acceptable** |

### Spanish-quality

| Metric | Before (audit JSON) | After (`--no-lt`) |
|--------|---------------------|-------------------|
| quality_score | 8.54 | **9.66** |
| Fernández-Huerta | 75.3 | **74.7** (still *bastante fácil*) |
| findings_total | 59 | 14 (mostly code-token FP) |

Remaining SQ medium hits are false positives: repeated `'José'` in expected output, `replace(...).replace(...)` in hint code, math interval `[0.4, 1.0)`, intentional spaces inside string literals.

### Code execution

All oracles **PASS**: NFC equality, casefold ñ/ß, email/phone normalize, Jaccard 0.667 with NFC, fullmatch vs search.

### Assessment

- selfCheck: **10** MCQs; keys unchanged; explanations polished
- correctIndex distribution not rewritten
- No authenticated bank edits

### Markdown / live render

- Platform RichText leak on `jobRelevance` / callouts remains **global** (not fixed here)
- Section body still hydrates from TS; hash `#data-acquisition` matches `id`

### Accessibility / continuity

- Previous: S06 collections (implicit sets for tokens) — no backward sentence required this pass  
- Next: S08 bridge present (Cierre + encoding foreshadow in T1-A callout)

### Explicit anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Optional one-line T4-A callback to S06 sets (nice-to-have, not blocking)
- Optional mention of `re.match` vs `fullmatch` (F-16) if load budget allows

### Repository-wide platform dependencies
- **F-01 / F-07:** Replace orphaned `SectionView.tsx` playground for `'data-acquisition'` (scraping/SQL/email-regex) with S07-aligned NFC/`str`/modest email/fullmatch/Jaccard demo — **Global Agent A / dedicated playground fix**
- **Markdown raw asterisks** in non-RichText fields — Global RichText fix
- **`id: data-acquisition`** vs title Texto & Unicode — Global identity migration with redirects (F-09)

### Deferred compatibility migrations
- Do not rename section id/file without alias for progress keys, demos map, glossary `firstSectionId`, and URL bookmarks

### Adjacent-section recommendations
- S08 should open by receiving `normalize_record` mental model and mojibake examples already foreshadowed here

---

## 6. Updated Graph Memory notes

```yaml
section: S07
id: data-acquisition
title: Texto, Unicode y expresiones regulares
file: src/lib/course/sections/s07-data-acquisition.ts
round: 2
status: fixed_validated
score_explorer_baseline: 6.4
score_expert_pre_r2: 7.5
score_spanish_pre: 8.54
score_spanish_post: 9.66

nodes:
  strengths:
    - progressive_order: unicode → str → contact → regex → similarity/ethics
    - latam_name_model: two_apellidos + particles + review_if_short
    - anti_overvalidation: modest email; digits phone; no kinship claims
    - i_do_we_do_you_do: 8/24/1 gold structure
    - selfCheck_n10
    - s08_bridge: encodings/mojibake
  resolved_this_r2:
    - jobRelevance_readability
    - anglicism_claims_failclosed_mental_model
    - t3b_sentence_split
    - ido_intro_pyodide_prose
    - fp_fn_spanish_gloss
    - tagline_cadenas
  residual_risks:
    - playground_legacy_in_SectionView (global)
    - id_slug_data-acquisition (compat)
    - print_ok_True_harness_convention

edges:
  - from: S05
    to: S07
    type: cp_n1_continues
  - from: S07
    to: S08
    type: bridges_encodings_csv
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s07-data-acquisition.ts` | Only product edit: expert redaction, Spanish polish, anglicism glosses, long-sentence splits, iDo/We Do/You Do/selfCheck prose |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S07_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S07.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |
| `course-state/curriculum_hardening/audits/spanish_quality/S07_SPANISH_QUALITY.json` | Regenerated by validation audit script |

---

## 8. Worklog confirmation

Full entry written to `expert_audit/worklog_entries_r2/S07.md`.  
Brief completion pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S07**.

---

Section 7 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
