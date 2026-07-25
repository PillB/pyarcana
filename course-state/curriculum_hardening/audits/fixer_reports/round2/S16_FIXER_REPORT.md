# S16 Fixer Report (Round 2) — Calidad, limpieza y contratos de datos

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S16  
**Scope lock:** Section 16 only (`id: wxpython-gui`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s16-wxpython-gui.ts`  
**Live:** https://pillb.github.io/pyarcana/#wxpython-gui  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **16** |
| Title | Calidad, limpieza y contratos de datos |
| shortTitle | Calidad y contratos |
| Internal id | `wxpython-gui` (legacy slug; deferred rename) |
| Canonical file | `src/lib/course/sections/s16-wxpython-gui.ts` |
| Live route | `#wxpython-gui` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S16_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S16_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Explorer Report — Section 16.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S16_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S16_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (8 MCQs); You Do `run_quality_gate` harness; seed key `wxpython-gui` (out of file scope) |
| Validation | Hand re-execution of code/output pairs (62/62); meta greps; `scripts/spanish_quality_audit.py --from 16 --to 16 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 residual Fixer already closed Explorer P0/P1 learner-text defects: wxPython/V3 map meta-leaks, money locale (`3,00` → `3.0`), T2-A-E3 conflict transfer, T2-B-E3 `card_bad` oracle, T3-B-E3 three labels, You Do acceptance table + metrics contract, `# DEFECT` / blind `ok True` removal, `ShieldCheck` icon, measurable LOs, fechas/cat_map in T3-A. Independent re-audit of the live canonical file **confirmed those closures**.

Round 2 focused on **residual expert-report Spanish/redaction polish**, diagnostic We Do feedback residual (12 generic strings still present), You Do assert tightening, and self-check distractor quality.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 / M1–M5 wxPython/V3 map | Explorer | Already fixed | Retained learner-first map + KPI story | Grep 0 V3/wxPython/retematiza |
| ISSUE-02 icon | Explorer | Already fixed | `ShieldCheck` retained | Source |
| ISSUE-02 seed GUI distractors | Explorer | Deferred | Out of hard scope (`prisma/seed.ts`) | Residual |
| ISSUE-03 money locale | Explorer | Already fixed | `norm_money` PE contract retained | Exec PASS |
| ISSUE-03b demo shape | Explorer | Already fixed | `s16_th_5` + fechas/cat_map | Exec PASS |
| ISSUE-04 Spanglish “marked” | Explorer | Already fixed | “política required…” retained | Source |
| ISSUE-05 V3 rubric/resources | Explorer | Already fixed | quality-gate language retained | Grep 0 V3 |
| ISSUE-06 DEFECT / ok True | Explorer | Already fixed | Lab + Pista comments | Grep 0 |
| ISSUE-07 T2-B-E3 oracle | Explorer | Already fixed | fixture `["a","a"]` → `card_bad` | Exec PASS |
| ISSUE-08 T2-A-E3 noop | Explorer | Already fixed | conflict fixture → `conflict` | Exec PASS |
| ISSUE-09 T3-B-E3 three labels | Explorer | Already fixed | domain-over-IQR retained | Exec PASS |
| ISSUE-10 thin E1s / generic feedback | Explorer | Partial | **12** generic “Compara tu salida…” → diagnostic feedback; T3-A-E3 pass string explicit | Grep 0 generic |
| ISSUE-11 You Do underspecified | Explorer | Mostly fixed | + `assert rows_quarantine >= 2`; context split; conjunto limpio | Source |
| ISSUE-12 connective tissue | Explorer | Already fixed | Further map/jobRelevance polish | Manual |
| ISSUE-13 LOs | Explorer | Already fixed | append-only gloss on LO8 | Manual |
| ISSUE-14 indent | Explorer | Already fixed | 2-space retained | Source |
| ISSUE-15 fechas/cats | Explorer | Already fixed | Retained | Exec PASS |
| ISSUE-16 anglicism glosses | Explorer + Expert | Partial → fixed | fail-closed/job/PII/EDA/KPI/append-only glosses | Manual |
| ISSUE-17 seed alignment | Explorer | Partial | In-section MCQ clean; seed deferred | Residual |
| Expert identity rename | Expert | Deferred | Keep `wxpython-gui` routing | Residual platform |
| Expert demos map wxPython | Expert | Global | SectionView not edited | Residual platform |
| Expert RichText `**` / table | Expert | Global | Not edited (platform) | Residual platform |
| Expert run-ons / tagline | Expert | **Active** | tagline capital; map/jobRelevance/youDo split | SQ 9.92 |
| Expert DNIs / sale en fallo | Expert | **Active** | DNI; termina con error | Grep |
| Expert candidatan | Expert | **Active** | identifican candidatos | Grep |
| Expert vs → vs. | Expert + Grammar | **Active** | Learner-facing prose/headings/why/instructions | Grep residual only in code labels if any |
| Expert set limpio / set clean | Expert | **Active** | conjunto limpio / conjunto `clean` | Grep 0 set limpio |
| Expert warn o fail / KeyError opaco | Expert | **Active** | emitir warn o fallar; sin mensaje claro | Manual |
| Expert filas in / audit bare | Expert | **Active** | filas de entrada; audit trail | Manual |
| Expert COMMA_PERO / Caso Perú | Expert | **Active** | métrica, pero…; Caso sintético Perú | Manual |
| Expert sondas | Expert | **Active** | valores de prueba | Manual |
| Expert Q1/Q6 distractors | Expert | **Active** | moda; 30.0 distractor | Dist {0:2,1:2,2:2,3:2} |
| Expert You Do assert | Expert | **Active** | rows_quarantine >= 2 | Source |
| Expert2 clean∩quarantine | Expert2 | Design note | Intentional (keep first + full evidence); not a code bug | Documented residual |
| SQ residual low | Spanish quality | Mixed | Prose polish; residual LT-style false positives on code tokens | SQ 8.55→9.92 |

---

## 3. Full corrected content or precise diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s16-wxpython-gui.ts`

Round-2 product edits are **hand-crafted prose/style/assessment deltas** (no bulk rewrite of the 8×3 GRR). Representative patches:

### tagline + jobRelevance + map

```diff
- tagline: "suite de calidad que falla..."
+ tagline: "Suite de calidad que falla..."
- ... deja un set limpio + métricas para S17.
+ ... deja un conjunto limpio y métricas para S17.
- ... sale en fallo. ... ni DNIs de personas.
+ ... termina con error (exit code ≠ 0). ... ni DNI de personas.
- El set limpio alimenta...
+ El conjunto limpio alimenta...
```

### T3-B / T4-A / T4-B redaction

```diff
- IQR/z-score solo **candidatan**; ... error vs flag.
+ IQR y z-score solo **identifican candidatos**; ... si es error o flag.
- KeyError opaco ... Columnas extra pueden warn o fail...
+ KeyError sin mensaje claro ... pueden emitir `warn` o fallar...
- Un fail **sin métricas**... Caso: 2 filas in, 1 clean...
+ Un fallo **sin métricas**... Caso: 2 filas de entrada, 1 limpia...
```

### We Do residual feedbacks (sample)

```diff
- feedback: "Compara tu salida con la solución."
+ feedback: "Si el mapa incluye 'b' (optional) o está vacío, filtraste mal la policy..."
```

(All 12 remaining generic feedbacks rewritten with concept-specific diagnosis.)

### You Do + self-check

```diff
+ assert m["rows_quarantine"] >= 2, "..."
- "Convertirse a string vacío"
+ "Imputarse con la moda del campo"
- "3,00 como string sin parsear"
+ "30.0 (coma decimal, punto ignorado)"
```

Structure counts unchanged: theory 9 · I Do 8 · We Do 24 · You Do 1 · self-check 8.

---

## 4. After-Fix Validation Report

### Issue-by-issue confirmation

| Issue class | Status |
|-------------|--------|
| Explorer ISSUE-01…18 (section TS) | Fixed or already fixed (R1 re-verified + R2 polish) |
| Explorer seed GUI (ISSUE-02) | Residual — `prisma/seed.ts` out of hard scope |
| Expert identity rename / demos map / RichText | Residual platform / global |
| Expert Spanish P0–P2 redaction list | Fixed in section TS |
| Spanish-quality actionable prose | Checked; score **9.92** (was 8.55 fleet snapshot) |
| Meta-leaks in section prose | 0× V3/retematiza/wxPython/DEFECT/ok True/candidatan/DNIs |

### Code-execution results

- **62/62** theory + I Do + We Do solution code↔output pairs: **PASS**

### Assessment-key validation

- selfCheck `correctIndex` distribution: `{0: 2, 1: 2, 2: 2, 3: 2}` (balanced)
- You Do asserts: keys, `pass is False`, `rows_in`, `rows_quarantine >= 2`

### Spanish-quality result

| Metric | Before (fleet JSON) | After R2 (`--no-lt`) |
|--------|---------------------|----------------------|
| quality_score_0_10 | 8.55 | **9.92** |
| findings_total | 94 (w/ LT noise) | 15 (heuristic residual low/medium false positives on code tokens) |
| FH | 81.4 | 82.8 |

### Markdown rendering

- `jobRelevance`, some We Do instructions, and `youDo.context` still contain `**` / table markdown.
- **Platform residual:** SectionView raw JSX without `<RichText>` (global Agent A). Not fixed in this section agent.

### Live-render / accessibility / continuity

- Live hash remains `#wxpython-gui` (compat).
- Title/tagline/card align with quality-gate topic.
- Previous S15 / next S17 bridges retained and polished.

### Explicit statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

- Some guided E1s remain micro-scale by design; transfer E3s and diagnostic feedback carry competent demand.
- Heuristic Spanish audit still flags code-like fragments (`vs.` after period casing, arrow `→` as “repeated word”).

### Repository-wide / deferred

1. **Platform id / filename** `wxpython-gui` / `s16-wxpython-gui.ts` — migration with aliases only (Global Agent C).
2. **SectionView `demos['wxpython-gui']`** — still may load off-topic GUI demo (Global Agent A / product); not edited here.
3. **RichText** for jobRelevance / weDo.instruction / youDo.context (Global Agent A).
4. **Seed quiz** `prisma/seed.ts` key `wxpython-gui` — replace “Crear un GUI wx” / “Solo sirve en wxPython” distractors when seed scope opens.
5. **Expert2** note on clean∩quarantine overlap: intentional (evidence full + keep-first); document in mentor notes if graders expect disjoint partitions.

### Adjacent-section recommendations

- S17 should consume “conjunto limpio + métricas” language consistently; do not reintroduce V3/wx maps.

---

## 6. Updated Graph Memory notes

```yaml
section: 16
id: wxpython-gui
title: Calidad, limpieza y contratos de datos
file: src/lib/course/sections/s16-wxpython-gui.ts
explorer_score: 6.5
r1_fixer_estimate: 9.6
r2_status: fixed_validated
spanish_quality_after: 9.92
edges:
  upstream: [s15-stdlib-deep]
  downstream: [s17-packaging]
  capstone: CP-N2-A-quality
strengths:
  - fail-closed quality narrative
  - locale PEN money parse correct
  - 8×3 GRR with aligned transfer oracles
  - diagnostic We Do feedback (0 generic)
  - You Do acceptance table + quarantine assert
  - synthetic PE privacy fixtures
  - meta-leaks eradicated from section TS
resolved_nodes_r2:
  - prose.DNIs_sale_en_fallo_candidatan
  - prose.vs_period_set_limpio_code_mix
  - wedo.generic_feedback_residual
  - youdo.rows_quarantine_assert
  - selfcheck.distractors_q1_q6
residual:
  - seed.gui_wx_distractors
  - platform_id.wxpython-gui_routing
  - SectionView.demos.wxpython_gui_offtopic
  - RichText.markdown_fields
do_not:
  - rename id without migration aliases
  - reintroduce V3/wx retarget changelog in learner prose
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s16-wxpython-gui.ts` | Only product file: Spanish/redaction polish, residual feedbacks, You Do assert, self-check distractors |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S16_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S16.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append) |
| `course-state/curriculum_hardening/audits/spanish_quality/S16_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S16.md` (full)
- `expert_audit/worklog.md` (pointer, Task ID: **FIXER-R2-S16**)

---

Section 16 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
