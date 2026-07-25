# S08 Fixer Report (Round 2) — Archivos, CSV, JSON y contratos de ingesta

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S08  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **8** — Archivos, CSV, JSON y contratos de ingesta |
| Canonical file | `src/lib/course/sections/s08-pandas.ts` |
| Live route | https://pillb.github.io/pyarcana/#pandas |
| Internal ID | `pandas` (legacy slug retained for progress/URLs; content is stdlib ETL, not pandas) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S08_EXPLORER_REPORT.md` (score 5.5; P0 code↔output / meta) |
| Expert report | `expert_audit/S08_report.md` (score 8.0; Spanish/voseo/run-ons) |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S08_SPANISH_QUALITY.json` (pre-fix score **8.44**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S08_FIXER_REPORT.md` |
| Expert-2 audit | No dedicated S08 second-expert file under `expert_2_audit/` |
| Assessment surface | Public `selfCheck` (11 MCQs) in canonical file; question-bank key `pandas` (not modified beyond public selfCheck) |
| Validation | Python execute-and-diff on representative theory/I Do/We Do snippets; Spanish audit `--from 8 --to 8 --no-lt` |

**Scope obeyed:** Only `s08-pandas.ts` was edited for product content. Reports/worklog under the assigned paths. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was limited to: (1) stripping `# CASO-LIM-008 · …` meta header lines from starter strings (mechanical), (2) executing existing code to verify outputs, (3) Spanish-quality measurement.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 already remediates the Explorer **P0 cluster** (theory/I Do code↔output, truncated We Do instructions, V3/platform-id confessions, unified `write_atomic`, JSONL demo, quarantine schema, expanded self-check to 11 items). Live residual defects match the **expert report** (voseo, run-ons, orthography, CASO-LIM tags), not the pre-hardening Explorer surface.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Explorer 01–07 theory/I Do code↔output | Explorer | **Already fixed** (R1) | Re-validated path_utf8, csv_dict, quarantine, json_ser, hash, manifest, demos | Execute-and-diff OK |
| Explorer 08–09 instruction integrity | Explorer | **Already fixed** | Re-validated short task-first instructions | Read |
| Explorer 10 / M1–M3 V3 meta | Explorer | **Already fixed** | No V3 / platform-id confessions in learner prose | Grep clean |
| Explorer 11 legacy id `pandas` | Explorer | Structural | **Deferred** (compat: progress, seed, `#pandas`) | Residual |
| Explorer 12 atomic contract | Explorer | **Already fixed** | `with_name(name + ".tmp")` everywhere | Read |
| Explorer 13 JSONL | Explorer | **Already fixed** | I Do T3-A dual format | Read |
| Explorer 14 `print('ok', True)` | Explorer | **Already fixed** | No unconditional success lies | Grep |
| Explorer 15–25 polish | Explorer | **Already fixed** or N/A | Self-check 11 items; schema consistency | Read |
| Expert I-01 voseo | Expert | **Active** | `leé/anticipá/contrastá`→tuteo; `usás`→`usas`; `Validá/Distinguí`→`Valida/Distingue`; `Recolectá/Reportá`→`Recolecta/Reporta`; `versioná`→`versiona` | Grep 0 residual |
| Expert I-02 jobRelevance run-on | Expert | **Active** | Split 59w opener into two sentences | Editorial |
| Expert I-03 youDo receta | Expert | **Active** | Numbered list 1–6 | Editorial |
| Expert I-04 `este bytes` | Expert | **Active** | → `estos bytes exactos` | Grep |
| Expert I-05 COMMA_PERO | Expert | **Active** | `10==9+1, pero fuentes rotas` | Grep |
| Expert I-06 weDo.intro mapa | Expert | **Active** | Markdown bullet map T1–T4 | Editorial |
| Expert I-07 portfolioNote | Expert | **Active** | Numbered list 1–4 | Editorial |
| Expert I-08 bare S0X first mention | Expert | Borderline | Pilot: callout “esta sección” + “S10 (Módulos & CLI)”; youDo context same | Editorial |
| Expert I-09 `re-leer` | Expert | **Active** | → `releer` (theory T1-B + selfCheck Q11) | Grep |
| Expert I-10 `vs` → `vs.` | Expert | **Active** | Prose occurrences fixed | Grep |
| Expert I-11 `.tmp` / `.bak` prose | Expert / SQ | **Active** | Backticked extensions | Read |
| Expert I-14 CSV field lists | Expert / SQ | **Active** | Spaces in prose field lists | Read |
| Expert I-15 PARCIAL echo | Expert / SQ | **Active** | “escribe el literal `'PARCIAL'` en dest” | Read |
| Expert I-17 CASO-LIM tags | Expert | **Active** | Removed 24 `# CASO-LIM-008 · …` starter headers; kept `# DEFECT:` | Grep 0 |
| Expert I-18 stale visible_paragraphs | Expert | Repo hygiene | **Out of section product scope** (not under canonical) | Residual |
| SQ AGREEMENT_DET_NOUN | Spanish JSON | **Active** | Same as I-04 | Fixed |
| SQ COMMA_PERO | Spanish JSON | **Active** | Same as I-05 | Fixed |
| SQ space_before_punct | Spanish JSON | **Active** | Same as I-11 | Fixed |
| SQ run_on / long map | Spanish JSON | **Active** | Same as I-06 | Fixed |
| SQ FP cluster (MORFOLOGIK, APOSTROFO, etc.) | Spanish JSON | Noise | No rewrite of valid tech tokens | Triaged |
| Cross-cutting RichText Markdown | Campaign | Platform | **Not fixed** (global agent) | Residual |
| Cross-cutting legacy id | Campaign | Structural | Preserved `pandas` | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **9.82** / FH **85.0** (was 8.44 / 85.0); 8 residual findings all false-positive or intentional code tokens (`sources(sources)`, `!=`, bytes literals, book labels).

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s08-pandas.ts`

### Diff group R2-A — Voseo → tuteo (Expert I-01 + extra finds)

- `iDo.intro`: **lee** / **anticipa** / **contrasta**
- `theory[T3-B].paragraphs[0]`: **Valida** / **Distingue** / `null en JSON` / `eco de S03`
- `theory[T3-B].paragraphs[1]`: **versiona** el schema
- `weDo` T4-B-E3: **Recolecta** / **Reporta**
- `selfCheck` Q8: **usas**

### Diff group R2-B — Cognitive load (Expert I-02, I-03, I-06, I-07)

- `jobRelevance`: period after “gráficos”; second sentence starts with “Es **abrir**…”
- `weDo.intro`: bullet **Mapa puente al You Do** (T1-A…T4-B)
- `youDo.context`: numbered **Receta de ensamblaje** (6 steps) + blank lines
- `youDo.portfolioNote`: numbered attach list (4 items)

### Diff group R2-C — Grammar / orthography (I-04, I-05, I-09, I-10, I-11, I-14, I-15)

- `estos bytes exactos`
- comma before **pero** in compensated_bad case
- `releer` (no hyphen)
- `vs.` in dictionary, Windows vs. Unix, null vs. clave, clean vs. cuarentena, good vs. quarantine
- basura `` `.tmp` ``; backup `` `.bak` ``
- prose field lists: `id, nombre`; `raw, reason`; instruction spacing for sources list
- PARCIAL instruction reword
- UnicodeDecodeError E3 instruction split into two sentences

### Diff group R2-D — Meta-leak / connective (I-08, I-17)

- Gate callout: “Al finalizar **esta sección**…”; “S10 (**Módulos & CLI**)”
- youDo context: same S10 title spell-out
- 24 starter headers `# CASO-LIM-008 · …` removed; `# DEFECT:` retained as intentional scaffolding

### Unchanged (already correct)

- Theory/I Do/We Do executable contracts and claimed outputs (R1)
- Atomic write convention
- Self-check 11-question coverage and answer keys
- You Do skeleton contracts and rubric
- Platform id `pandas` (compatibility)

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer P0 code↔output (spot execute path_utf8, atomic, csv_dict, hash, run) | **Pass** — matches declared outputs |
| Expert I-01…I-17 | **Fixed** or already fixed / deferred with justification |
| Spanish-quality `--from 8 --to 8 --no-lt` | **8.44 → 9.82**; findings 52 → 8 (all FP/triaged) |
| Voseo residual grep | **0** (`leé`, `usás`, `Validá`, `Recolectá`, `versioná`, …) |
| CASO-LIM-008 residual | **0** |
| V3 / Id de plataforma residual | **0** |
| selfCheck answer positions | n=11; correctIndex {0:2, 1:3, 2:3, 3:3} — balanced |
| Markdown RichText | Platform residual (global) — section still uses `**bold**` in jobRelevance/callouts |
| Live render | SPA still hashes `#pandas`; content titles Archivos & ETL |
| Adjacent continuity | S07 Unicode → S08 files; S09 exceptions bridge retained |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (code execution, CASO-LIM line strip, Spanish-quality measurement, greps).

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Some short `edgeCases` / `tests` tags still use bare `vs` (not learner prose paragraphs).
- Bare `S0X` cross-references remain on second mention (curriculum convention); first-mention pilot applied only on gate callout / youDo CLI note.
- Stale `visible_paragraphs/s08_pandas.json` may still exist under course-state (hygiene; does not ship to SPA).

### Repository-wide platform dependencies
- `SectionView.tsx` RichText markdown leak for jobRelevance/callouts/instructions.
- Legacy id `pandas` vs title “Archivos & ETL” / filename `s08-pandas.ts` — needs coordinated migration with aliases.

### Deferred compatibility migrations
- Do **not** rename `id: "pandas"` without progress/URL/seed migration plan.

### Adjacent-section recommendations
- None that require editing S07/S09 in this pass.

---

## 6. Updated Graph Memory notes

- **Node S08 (pandas / Archivos & ETL):** quality after R2 ~ **9.8/10** Spanish + solid pedagogical fidelity; regional language restored to Peruvian tuteo.
- **Corrected concept nodes:** voseo free; jobRelevance/weDo/youDo cognitive load; orthography (`releer`, `vs.`, agreement); CASO-LIM meta stripped.
- **Prerequisite edges retained:** S02 Decimal; S03 null≠missing; S05–S07 normalizers; S06 in-memory; S07 Unicode.
- **Forward edges retained:** S09 exceptions/logs; S10 CLI; S15 pandas tabular.
- **Retained strengths:** GRR fidelity, 24 We Do defect-repair, CP-N1-B capstone, 11-item self-check, honest demos.
- **Resolved defect nodes:** Explorer P0 (prior); Expert I-01…I-07, I-09…I-11, I-14, I-15, I-17 (this pass).
- **Remaining risks:** platform id; RichText; optional full S0X title spell-out convention.
- **Compatibility:** `id: "pandas"` + hash `#pandas` stable.
- **Assessment coverage:** T1–T4 + synthesis (reconcile, fail-closed, Decimal, null/missing, newline).

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s08-pandas.ts` | All learner-facing R2 remediations |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S08_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S08.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S08 |
| `course-state/curriculum_hardening/audits/spanish_quality/S08_SPANISH_QUALITY.json` | Regenerated by validation audit only |

---

## 8. Worklog confirmation

- Full entry written to `expert_audit/worklog_entries_r2/S08.md`.
- Brief completion pointer **appended** to `expert_audit/worklog.md` with Task ID **FIXER-R2-S08** (no overwrite of other entries).

---

Section 8 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
