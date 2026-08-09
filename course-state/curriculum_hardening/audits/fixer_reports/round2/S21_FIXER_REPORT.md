# S21 Fixer Report (Round 2) — Documentos, plantillas y reportes trazables

**Task ID:** FIXER-R2-S21  
**Agent:** Second-round Section Fixer (Section 21 only)  
**Date:** 2026-07-25  
**Anti-aberration:** **OK** — all learner-facing prose, instructions, feedback, self-check stems, and code-contract comments hand-edited; automation used only for execute-and-diff validation and Spanish-quality measurement.

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| Section number / title | **21** — Documentos, plantillas y reportes trazables |
| Canonical file | `src/lib/course/sections/s21-fastapi.ts` |
| Internal / platform id | `fastapi` (routing only; not narrated as topic label beyond scope notes) |
| Live route | https://pillb.github.io/pyarcana/#fastapi |
| shortTitle | Reportes trazables |
| Icon | `FileStack` (already semantic; kept) |
| Primary Explorer | `course-state/curriculum_hardening/audits/explorer_reports/S21_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S21_report.md` |
| Expert 2 evidence | `expert_audit/expert_2_audit/section-21-explorer-report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S21_SPANISH_QUALITY.json` (pre R2 ~7.79; post R2 **10.0** FH **81.2** with `--no-lt`) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Assessment | Public `selfCheck` in section file (8 MCQs after fix); no separate authenticated bank rewrite in scope |

---

## 2. Summary of changes applied

### Pre-edit reality (R2 baseline)

Round-1 work had already removed most Explorer P0 meta-leaks (V3 rewrite prose, lane/ledger, oráculo/Pass boilerplate, gate V3 rubric, resources V3 note). Concept labels for T4-A were already aligned (E1 precisión, E2 `fmt_pen`, E3 a11y). Pass-string mismatches I-09/I-10 and PDF `n=32` drift were already fixed. Icon was already `FileStack`.

**Active residuals at R2 start:**

1. **Code↔output:** theory T1-B `jinja_table.py` and I Do T1-B `demo_cond_table.py` Jinja indent drift (expert F02/F03).
2. **Orthography / agreement:** `metricas, limites`; `descripcion`; `APIs`; checklist `completo`/`incompleto`.
3. **a11y false positive (Expert2 P0):** `a11y_min` via `all([])` approved empty alt lists.
4. **Coverage:** self-check lacked T3-A narrative and T4-A a11y; Q5 duplicated T2-B needs_ocr.
5. **Spanish polish:** long opening/capstone sentences; dictionary as semicolon prose; unglossed starter/scaffold; `exports sueltos`; `ancla Lima`.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp I-01 V3 / FastAPI rewrite prose | Explorer | Already fixed R1 | Confirmed absent | grep 0 V3/oráculo/lane |
| Exp I-02 id `fastapi` / filename | Explorer / Expert F01 | Active structural | **Kept** for progress/URL compatibility (Global C) | residual |
| Exp I-03–I-08 meta harness | Explorer | Already fixed R1 | Confirmed clean prose | grep |
| Exp I-09 T1-B-E3 Pass | Explorer | Already fixed R1 | Kept multiline contract | execute OK |
| Exp I-10 T2-A-E1 Pass | Explorer | Already fixed R1 | Kept two-line True True | execute OK |
| Exp I-11 T4-A concept swap | Explorer | Already fixed R1 | Kept | source |
| Exp I-12 T3-B labels | Explorer | Partially soft | E1/E2/E3 concepts already paridad/caption/check_parity | residual pedagogical grain |
| Exp I-13 T4-B-E1 thin provenance | Explorer | Partial R1 | E1 prints run_id + status with full dict | residual grain |
| Exp I-14 spoiling | Explorer | Fixed R1 | Kept non-spoiling instructions | source |
| Exp I-15 micro grain | Explorer | Accepted residual | Not bulk-rewritten (anti-aberration) | residual |
| Exp I-16 theory density | Explorer | Improved R1 | Opening + dictionary rewritten | manual |
| Exp I-17 install note | Explorer | Fixed R1 (callout deps) | Kept | source |
| Exp I-18 tagline EN brand | Explorer | Fixed R1 | Kept Spanish tagline | source |
| Exp I-19 heading case | Explorer | Fixed R1 | Kept Title Case | source |
| Exp I-20 T4-A `s21_ido_7` | Explorer | Fixed R1 | Function wrapper present | source |
| Exp I-21 n=32 PDF | Explorer | Fixed R1 | n=40 throughout demos | source |
| Exp I-22 Tabla1/2 | Explorer | Aligned to Tabla1 | Kept | source |
| Exp I-23 frozen datetime | Explorer | Fixed R1 (fixed ts) | Kept | source |
| Exp I-24 SHA pedagogy | Explorer | Present in theory | Kept SHA-256 note | source |
| Exp I-25 StrictUndefined | Explorer / Expert2 #6 | Active | Theory + E1 edge case mention StrictUndefined | source |
| Exp I-26–I-34 | Explorer | Mixed | Residual portfolio/platform items only | residual |
| Expert F02 Jinja theory output | Expert | **Active** | `Environment(trim_blocks, lstrip_blocks)` + single-line `\n` | execute match |
| Expert F03 Jinja I Do output | Expert | **Active** | Same pattern on `s21_ido_2` | execute match |
| Expert F04 métricas/límites | Expert | **Active** | Tildes in T1-A callout | source |
| Expert F05 descripción | Expert | **Active** | Starter + solution alt string | source |
| Expert F06 APIs → API | Expert | **Active** | RAE sigla in map + dictionary | source |
| Expert F07 checklist gender | Expert | **Active** | completa/incompleta | source |
| Expert F08–F12 long / dictionary | Expert | **Active** | Split opening; bullet dictionary; dual `—` note | Spanish 10.0 |
| Expert F13 anglicisms | Expert | **Active** | Gloss starter/scaffold; soften T4-A advice | source |
| Expert F14–F20 | Expert | L / FP | Spot polish (`exports`, `ancla`, missing marker backticks) | source |
| Expert2 #1 a11y empty alts | Expert2 | **Active P0** | `len(alts) > 0`; three-print E3; theory note | execute True/False/False |
| Expert2 #3 self-check 8 items | Expert2 | 7 Q, gap T3-A/T4-A | Q5 → hallazgo≠decisión; Q8 a11y empty list | 8 MCQs |
| Expert2 #4 tres We Do mislabel | Expert2 | Active | “tres ejercicios (E1/E2/E3…)” | source |
| Expert2 #5 fastapi id | Expert2 | Platform | Not renamed | residual |
| SQ meta_todo / long sentences | Spanish-Q | Active | Rephrased We Do intro; splits | score 10.0, 0 high |
| Global RichText / id migration | Cross-cut | Active | Not edited (Global A/C) | residual |

---

## 3. Full corrected content / precise diffs (summary)

Authoritative source: `src/lib/course/sections/s21-fastapi.ts` (hand-edited; ~1677 → ~1690 lines).

### 3.1 Theory map (opening, order, dictionary)

- Opening factory definition split into five pieces + provenance/approval overlays; `APIs` → `API`.
- Pedagogical order: “tres ejercicios (E1 guiado, E2 con menos andamiaje, E3 de transferencia)”; `vs.` orthography.
- Dictionary converted to bullet list; documented dual use of `—` (missing vs. raya).

### 3.2 Jinja code↔output (F02/F03)

Theory T1-B and I Do T1-B now use:

```python
env = Environment(trim_blocks=True, lstrip_blocks=True)
tmpl = env.from_string("{% for r in rows %}…\\n{% endfor %}")
print(tmpl.render(...), end="")
```

Stated outputs match executed bytes (no 4-space indent drift, no trailing whitespace-only line).

### 3.3 a11y contract (Expert2 P0)

- Theory: checklist mínima requires non-empty alts.
- I Do T4-A: `len(alts) > 0 and all(...)`.
- We Do T4-A-E3: solution `bool(has_h1) and len(alts) > 0 and all(len(a) > 10 for a in alts)`; three cases including `[]` → False; `descripción` with tilde.

### 3.4 Spanish / connective tissue

- T1-A callout: `métricas, límites`.
- T4-B: checklist completa/incompleta.
- T4-A anglicism advice softened; StrictUndefined called out in theory + E1 edge case.
- We Do intro: gloss starter/scaffold; no learner-facing “TODO” meta token; split You Do sentence.
- I Do / You Do intros tightened; `exportaciones sueltas`; missing as `` `—` ``; feedback “muestra Lima del lab”.

### 3.5 Self-check (8 items)

| # | Construct | correctIndex |
|---|-----------|--------------|
| 1 | Jinja data/presentation | 0 |
| 2 | OCR / image PDF | 2 |
| 3 | Paridad | 3 |
| 4 | Cierre CP-N2-B | 1 |
| 5 | **Hallazgo ≠ decisión (T3-A)** | 0 |
| 6 | Missing ≠ 0 | 2 |
| 7 | Heading real DOCX | 3 |
| 8 | **a11y empty alts / all([]) (T4-A)** | 0 |

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Theory + I Do code↔output (16 blocks) | **16/16** match after TS-unescape execute |
| We Do solutions (24 blocks) | **24/24** match |
| Jinja F02/F03 | Fixed (repr matches stated clean lines) |
| a11y empty list | `a11y_min(True, [])` → **False** |
| Provenance lab hashes | `385fcd67`, `f2b0d009` still correct |
| Meta-leak grep (V3, oráculo, lane, gate V3) | Clean in learner prose |
| Orthography slips (metricas, descripcion, APIs, checklist masc) | Clean |
| Spanish-quality (section-only, `--no-lt`) | **10.0** / FH **81.2** (was ~7.79 pre-campaign snapshot; 0 high findings) |
| Markdown `**` in jobRelevance/callouts | Still subject to global SectionView RichText residual |
| Live hash `#fastapi` | Works; content is Reporting Factory (identity residual) |
| Previous/next continuity | S20 Excel → S21 reports → S22 approval preserved in prose |
| Answer-position distribution (8 Q) | Indices {0×3, 1×1, 2×2, 3×2} — acceptable for N=8 |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (Python execute-and-diff, Spanish-quality metrics, grep).

### Issue disposition summary

- **Fixed in R2:** F02, F03, F04, F05, F06, F07, F08–F13 (targeted), Expert2 a11y P0, self-check coverage T3-A/T4-A, We Do intro meta_todo, StrictUndefined pedagogy note, dictionary list, checklist gender, APIs, orthography.
- **Already fixed (R1 / prior):** Explorer meta-leak cluster I-01/I-03–I-08, Pass I-09/I-10, T4-A concept order, n=40 PDF, FileStack icon, resources note, most spoiling.
- **Not applicable / false positive:** DEFECT/TODO in Python starter comments (code, not prose); CASO-LIM-021 ids; `sintetico` ASCII in ReportLab canvas (documented).
- **Residual risk:** legacy `id: "fastapi"` + filename `s21-fastapi.ts`; global RichText; some We Do grain still micro-print for Competente; T3-B still mostly dict parity (not real figure insert); full WCAG beyond lab minimum.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **We Do grain (I-15):** several E1s remain one-line drills; acceptable for scaffolding after R1 despoil, but a future pass could deepen T3-B figure insert without bulk templates.
2. **T3-B performance vs. claim:** theory still talks about embedding figures; exercises emphasize parity dicts — documented pedagogical choice; optional later lab with real `add_picture`.
3. **a11y is still a lab minimum:** length + non-empty alts ≠ full WCAG; Q8 and theory now prevent the empty-list false positive but do not claim full accessibility certification.

### Repository-wide / deferred

1. **Identity freeze:** do not rename `id: "fastapi"` or `s21-fastapi.ts` without Global C migration (progress keys, bookmarks, analytics). Same pattern as S05/S08/S11/S12/S19/S20.
2. **SectionView RichText:** callout/jobRelevance Markdown asterisks — Global Agent A.
3. **S41 FastAPI:** remains the real HTTP API section; S21 scope note correctly defers API HTTP.

### Adjacent recommendations (do not expand this fix)

- S22 should continue consuming `pending_review` packages from S21 language.
- Authenticated exam bank (if any global bank row keys on `fastapi`) should stay aligned with public self-check constructs when Global D runs.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| Section node | S21 Reporting Factory / CP-N2-B close |
| Corrected concept nodes | Jinja whitespace-safe tables; missing≠0; DOCX reopen; PDF digital/needs_ocr; H→evidencia decision=None; parity; fmt_pen; **a11y non-empty alts**; provenance pending_review |
| Prerequisite edges | S18 EDA n=40 · S19 dashboard · S20 Excel factory |
| Forward edges | S22 email/approval queue; S24 OCR depth (out of scope here) |
| Retained strengths | Ethical spine; CASO-LIM-021 continuity; 8×3 We Do grid; SHA-256 production note; deps callout |
| Resolved defect nodes | Jinja indent lie; empty-alts a11y gate; orthography; dictionary scanability; self-check T3-A/T4-A |
| Remaining risks | fastapi id hash; platform Markdown; micro-exercise grain |
| Compatibility constraints | Keep `id: "fastapi"`; progress/exam keys |
| Assessment coverage | 8 public MCQs covering T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s21-fastapi.ts` | Sole canonical content edits for Section 21 |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S21_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S21.md` | Full R2 worklog entry |
| `expert_audit/worklog.md` | Brief FIXER-R2-S21 completion pointer (append) |
| `course-state/curriculum_hardening/audits/spanish_quality/S21_SPANISH_QUALITY.json` | Regenerated by validation-only audit script (`--from 21 --to 21 --no-lt`) |

No edits to `SectionView.tsx`, other sections, or global platform files.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S21.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S21**)

---

Section 21 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
