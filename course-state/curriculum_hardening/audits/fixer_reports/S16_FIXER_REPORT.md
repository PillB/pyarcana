# S16 Fixer Report — Calidad, limpieza y contratos de datos

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Section:** 16 · platform id `wxpython-gui` (routing-stable; not learner-facing) · *Calidad, limpieza y contratos de datos*  
**Source edited:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s16-wxpython-gui.ts`  
**Explorer authority (ONLY):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S16_EXPLORER_REPORT.md`  
**Explorer meta score:** 6.5 / 10 · 18 issues · 10 meta-leak surface items  
**Score after estimate:** **9.6 / 10**  
**Anti-aberration:** **OK** — all educational prose and exercise text hand-crafted; no bulk generators, blurb factories, template expanders, or automated paragraph loops  
**Date:** 2026-07-24  
**Run type:** Residual / polish pass (fleet floor ≥ 9.5) — re-validate Explorer Issue Registry + close residual scaffolding gaps inside the section TS file

---

## Anti-Aberration acknowledgment

This Fixer run obeyed the CRITICAL ANTI-ABERRATION RULES:

1. **No** Python/JS (or other) code was written to mass-produce paragraphs, exercises, or explanations.  
2. **No** placeholder / lorem / TODO learner-facing content.  
3. Every instruction, lab hint, feedback line, theory paragraph, self-check item, and You Do scaffold was crafted or verified **manually** with pedagogical intent.  
4. Structural inventory preserved: **8** LOs · **9** theory blocks · **8** I Do demos · **24** We Do · You Do with acceptance table · **8** self-check MCQ.

Authority for what to fix was **only** the Explorer report above. Automation used solely for **validation** (grep, exec of demos/solutions).

---

## 1. Summary of changes applied (mapped to Explorer issue numbers)

### This residual pass (delta)

| Issue | Sev | Residual fix | Status |
|-------|-----|--------------|--------|
| **ISSUE-10** | P2 | Replaced **12** generic We Do feedbacks (`"Compara tu salida con la solución."`) with concept-specific diagnostic feedback (policy filter, was_null order, cap inversion, keep=False, nunique conflict, quarantine split, strip+title, domain mask, IQR fences, schema missing, cross-field invert, audit append-only). | **Fixed (residual)** |
| **ISSUE-10 / transfer clarity** | P2 | Tightened **S16-T3-A-E3**: explicit fixture, print order, pass string `['lima'] ['Lima']`; richer hints. | **Fixed (residual)** |
| **ISSUE-01…09, 11–18** | P0–P3 | Re-validated present in source (prior Explorer-guided work retained). No regressions. | **Confirmed** |

### Full Explorer Issue Registry (confirmed in `s16-wxpython-gui.ts`)

| Issue | Sev | Fix / evidence | Status |
|-------|-----|----------------|--------|
| **ISSUE-01** / M1–M5 | P0 | Opening map + jobRelevance: S15→S16 quality gate + KPI `fillna` anecdote; no V3 / wxPython / platform-id teaching. Callout “Regla de oro del gate”. | **Fixed** |
| **ISSUE-02** icon | P1 | `icon: "ShieldCheck"`. | **Fixed** |
| **ISSUE-02** seed GUI / M10 | P1 | Seed options in `prisma/seed.ts` — **out of file scope**. | **Deferred** |
| **ISSUE-03** | P0 | `norm_money` PE: solo coma → decimal latino (`3,00`→`3.0`); coma+punto → miles (`1.250,5`→`1250.5`). Theory output + We Do T3-A-E2 sum `4.5`. | **Fixed** |
| **ISSUE-03b** | P2 | Theory T3-A as `s16_th_5()`; `re` used; consistent demo shape. | **Fixed** |
| **ISSUE-04** | P2 | Self-check: “Un campo con política required que tiene nulls debe:”. | **Fixed** |
| **ISSUE-05** / M6–M7 | P1 | Rubric quality-gate language; resources “S16 quality gate” (no V3). | **Fixed** |
| **ISSUE-06** / M8 | P1 | 0× `# DEFECT:`; 0× `print('ok', True)`. Lab + Pista comments. | **Fixed** |
| **ISSUE-07** | P0 | T2-B-E3: fixture `["a","a"]`; oracle `card_bad`. | **Fixed** |
| **ISSUE-08** | P1 | T2-A-E3: conflict fixture → `conflict`. | **Fixed** |
| **ISSUE-09** | P2 | T3-B-E3: `['flag', 'error', 'ok']` domain-over-IQR. | **Fixed** |
| **ISSUE-10** | P2 | Raised E1s (T1-A-E1, T4-B-E1) + residual feedback/hints polish this pass. | **Fixed** |
| **ISSUE-11** / M9 | P1 | You Do contract, fixture pack, asserts, acceptance table, rubric. | **Fixed** |
| **ISSUE-12** | P2 | S15 bridge + KPI story + S17 clean-set. | **Fixed** |
| **ISSUE-13** | P3 | Measurable LOs with verification criteria. | **Fixed** |
| **ISSUE-14** | P2 | 2-space TS indentation. | **Fixed** |
| **ISSUE-15** | P2 | Theory T3-A: cat_map + multi-format fechas + money locale. | **Fixed** |
| **ISSUE-16** | P3 | Glosses: fail-closed, audit trail, schema drift. | **Fixed** |
| **ISSUE-17** | P2 | 8 MCQ in-section; no wx distractors. Seed residual deferred. | **Fixed** (seed deferred) |
| **ISSUE-18** | — | 8 I Do + 24 We Do GRR preserved; transfers repaired. | **Preserved** |

**Strengths preserved:** fail-closed narrative; quarantine + metrics + append-only audit; synthetic Lima/Arequipa/Cusco / `S/` / `C00x`; privacy; 8×3 GRR; pandas + stdlib only; platform id unchanged for routing.

---

## 2. Content deliverable

**Authoritative corrected section:**

`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s16-wxpython-gui.ts`

### Residual deltas this pass (GitHub-style, conceptual)

```diff
# 12× weDo feedback (ISSUE-10 residual)
- feedback: "Compara tu salida con la solución."
+ feedback: "<diagnóstico conceptual por ejercicio: política, orden was_null, cap, keep=False, …>"

# S16-T3-A-E3
- "…imprime evidencia según solution… Pass: salida del oracle."
+ "…Imprime raw, luego canónica. Pass: `['lima'] ['Lima']`."
```

### High-signal contracts already in source

| Area | Contract |
|------|----------|
| Meta | Zero learner-facing V3 / wxPython / `# DEFECT` / blind `ok True` |
| Money | `3,00` → 3.0; `1.250,5` → 1250.5; We Do sum 4.5 |
| T2-A-E3 | `conflict` |
| T2-B-E3 | `card_bad` |
| T3-B-E3 | `['flag', 'error', 'ok']` |
| You Do | `{metrics, quarantine, audit}` + `pass is False` asserts |
| Icon | `ShieldCheck` |

---

## 3. After-Fix Validation Report

### Issue-by-issue confirmation

| Issue | Resolved in `s16-wxpython-gui.ts`? | Evidence |
|-------|-------------------------------------|----------|
| ISSUE-01 | Yes | Map + jobRelevance student-goal first |
| ISSUE-02 icon | Yes | `ShieldCheck` |
| ISSUE-02 seed | Deferred | Outside file scope |
| ISSUE-03 | Yes | Locale outputs correct |
| ISSUE-03b | Yes | `s16_th_5` + used `re` |
| ISSUE-04 | Yes | ES-PE self-check wording |
| ISSUE-05 | Yes | No V3 in rubric/resources |
| ISSUE-06 | Yes | 0× DEFECT / 0× ok True |
| ISSUE-07 | Yes | card_bad same fixture |
| ISSUE-08 | Yes | conflict transfer |
| ISSUE-09 | Yes | three labels |
| ISSUE-10 | Yes | Raised E1s + **0 generic feedbacks** |
| ISSUE-11 | Yes | acceptance table + asserts |
| ISSUE-12 | Yes | S15/S17 + anecdote |
| ISSUE-13 | Yes | measurable LOs |
| ISSUE-14 | Yes | 2-space indent |
| ISSUE-15 | Yes | fechas + cat_map |
| ISSUE-16 | Yes | glosses fail-closed / drift |
| ISSUE-17 | Yes (in-section) | 8 MCQ aligned |
| ISSUE-18 | Yes | structure intact |

### Runtime validation

- **Theory demos (s16_th_*):** 8/8 outputs match (executed).  
- **I Do demos (s16_ido_*):** 8/8 outputs match (executed).  
- **We Do solutions:** 24/24 outputs match (executed).  
- **Meta-leak scan (learner surface):** 0 hits for V3 / retematiza / wxPython / DEFECT / print ok True / marked required / chamba / jato.  
- **Generic feedback residual:** 0× `"Compara tu salida con la solución."`  
- **Structure:** theory 9 · iDo 8 · weDo 24 · selfCheck 8 · You Do 1 · icon ShieldCheck.  
- **Money anti-pattern mentions of 300:** only as *wrong* path warnings in instructions/MCQ (pedagogically correct).

### Anti-aberration confirmation

**Explicit confirmation:** no automated bulk content generation was used. No generators, no blurb factories, no template loops for educational text. All new/changed prose (12 feedbacks + T3-A-E3 instruction/hints) were written by hand unit-by-unit. Automation used solely for validation (grep, exec of demos/solutions).

### New problems introduced?

None observed. Platform id retained deliberately. Seed GUI distractors remain as residual outside TS section scope.

---

## 4. Residual risks / recommendations for later sections

1. **Seed quiz (`prisma/seed.ts` key `wxpython-gui`):** replace distractors “Crear un GUI wx”, “Que el GUI crasheó”, “Solo sirve en wxPython” with quality-domain wrong strategies when seed scope opens (ISSUE-02 / M10).  
2. **Platform id `wxpython-gui`:** keep for SPA hash/routing; never re-teach as curriculum narrative.  
3. **S17 bridge:** consume S16 clean set + metrics language consistently; avoid reintroducing V3/meta maps.  
4. **Optional:** mentor-only reference solution for You Do if portfolio grading variance stays high.  
5. **Density:** some guided E1s remain micro-scale by design; transfer E3s and diagnostic feedback now carry competent-level demand.

---

## 5. Updated Graph Memory notes

```yaml
section: 16
id: wxpython-gui
title: Calidad, limpieza y contratos de datos
file: src/lib/course/sections/s16-wxpython-gui.ts
explorer_score: 6.5
fixer_score_after_estimate: 9.6
status: fixed_validated
pass: residual95
edges:
  upstream: [s15-stdlib-deep]  # typed ingest → quality
  downstream: [s17-packaging]  # clean set + metrics → joins / CP-N2-A portfolio
  capstone: CP-N2-A-quality
strengths:
  - fail-closed quality narrative coherent
  - locale PEN money parse correct and taught
  - 8×3 GRR with repaired transfer oracles
  - concept-specific We Do feedback (no generic compare-to-solution)
  - You Do acceptance table + metrics contract
  - quarantine + audit + metrics pattern teachable
  - privacy / synthetic PE fixtures consistent
  - meta-leaks eradicated from section TS
fixed_nodes:
  - meta_leak.wxpython_v3_map
  - theory.T3A.norm_money_decimal_latino
  - wedo.S16-T2-B-E3.oracle_mismatch
  - wedo.S16-T2-A-E3.noop_transfer
  - wedo.S16-T3-B-E3.three_labels
  - wedo.generic_feedback_eradicated
  - wedo.S16-T3-A-E3.pass_string_explicit
  - youdo.acceptance_specified
  - icon.ShieldCheck
residual:
  - seed.gui_wx_distractors  # prisma/seed.ts out of section-file scope
  - platform_id.wxpython-gui_routing  # keep
do_not:
  - change platform id wxpython-gui without migration
  - reintroduce V3/wx retarget changelog in student prose
gold_standard_delta: |
  Opening: student-goal + KPI story (S01-class narrative).
  Locale contract explicit and correct.
  Transfer oracles aligned; feedback diagnostic per exercise.
  Self-check 8 MCQ; You Do self-evaluable.
anti_aberration_ok: true
explorer_report_path: course-state/curriculum_hardening/audits/explorer_reports/S16_EXPLORER_REPORT.md
```

---

## Comparative quality (short)

| Dimension | Explorer (before) | After residual Fixer |
|-----------|-------------------|----------------------|
| Opening motivation | Contaminated by retarget map | S15 bridge + KPI story + fail-closed |
| Technical correctness | Money locale wrong | Locale contract correct end-to-end |
| GRR structure | Solid skeleton | Solid + transfer oracles fixed |
| Exercise integrity | T2-A-E3/T2-B-E3 broken | Aligned fixtures + pass strings |
| We Do scaffolding | Telegraphic / generic feedback | Concept-specific diagnostics |
| Meta-leaks | High (V3/wx/id) | Zero in section TS |
| You Do clarity | Stub-level | Contract + table + asserts |
| Self-check | 5 (1 Spanglish) | 8 ES-PE aligned |
| Score | 6.5 | **~9.6** |

---

Section 16 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
