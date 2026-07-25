# S27 Fixer Report (Round 2) — Estrategia de pruebas con pytest

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S27  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **27** — Estrategia de pruebas con pytest |
| Canonical file | `src/lib/course/sections/s27-async-concurrency.ts` |
| Live route | https://pillb.github.io/pyarcana/#async-concurrency |
| Internal ID | `async-concurrency` (legacy slug retained for progress/URLs; content is pytest contracts, **not** asyncio) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S27_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S27_report.md` (score 7.6/10; grammar-focused) |
| Expert-2 audit | `expert_audit/expert_2_audit/Section 27 Pytest Quality Audit.docx` (score 5.5/10; construct validity + `match=` fact) |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S27_SPANISH_QUALITY.json` (pre-fix snapshot **8.13**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S27_FIXER_REPORT.md` (Explorer P0/P1 structural fix; expert estimate 9.6) |
| Assessment surface | Public `selfCheck` (5 MCQs) in canonical file; no section-local authenticated bank edit this pass |
| Validation | Python execute-and-diff of 24 solutions + demos; Spanish audit `--from 27 --to 27 --no-lt` |

**Scope obeyed:** Only `s27-async-concurrency.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was used only for mechanical validation (Spanish metrics, code/output execution, residual greps). `CASO-LIM-027` → `Caso 27` was a mechanical taxonomy-token cleanup, not prose generation.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer had already resolved nearly all Explorer P0/P1 pedagogical defects (meta-leaks ledger/lane/gate/legacy confession, boilerplate purge, code/output honesty for risk demos, harness instruction paste, authentic `test_*` shapes, dual-track honesty, You Do scaffold, Q5 fixture scope). Expert report **7.6/10** reflected residual Spanish/typography/metadata. Expert-2 raised construct-validity (pytest theater) and a **factual error** on `pytest.raises(..., match=)` that was still active.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 01 / M7 id/filename async | Explorer | Product debt | **Preserved** `id: "async-concurrency"`; no learner-facing legacy confession | Residual |
| Exp 02–05 meta-leaks | Explorer | Already fixed R1 | Re-validated: no legacy/ledger/gate V3/harness suffix | Grep |
| Exp 06–07 code/output | Explorer | Already fixed R1 | Re-exec PASS | Exec |
| Exp 08–17 pedagogy | Explorer | Already fixed R1 | Preserved dual-track + `test_*` shapes | Read/exec |
| Exp 11 headings | Explorer | Already fixed R1 | Title-case headings intact | Read |
| Exp 15 Q3/Q5 | Explorer | Already fixed R1 | Q5 = fixture scope | Read |
| Expert M2 level Competente vs Senior | Expert D2 | **Active** | `level: "Senior"` (Phase 2) | Read |
| Expert G1 `el *por qué*` | Expert | **Active** | → `el *porqué*`; “We Do” → “ejercicios guiados” | Grep |
| Expert G2 comma before `pero` | Expert | **Active** | Feedback T3-A-E2 + expanded regex note | Read |
| Expert G3 `re-correr` | Expert | **Active** | → **volver a correr** | Grep |
| Expert G4 `una fixture` | Expert | **Active** | → `un fixture` (Q5) | Grep |
| Expert G5 unspaced em-dash | Expert | **Active** | `pytest — no scripts…` | Read |
| Expert G7 `N%` spacing | Expert | **Active** | `100 %` / `90 %` in theory + tests prose | Grep |
| Expert G8 `2 a.m.` | Expert | **Active** | → `2 a. m.` | Grep |
| Expert G9 long jobRelevance | Expert + SQ | **Active** | Split into 4 sentences | Editorial |
| Expert risk paragraphs density | Expert 6.2 | **Active** | Split colon-chained impact/probabilidad sentences | Editorial |
| Expert AAA/oracle density | Expert 6.3 | **Active** | Split AAA failure chain; three-oracle list | Editorial |
| Expert E3 `before` | Expert | Already fixed R1 | “antes que e2e” present | Read |
| Expert D11 youDo context | Expert | **Active** | Split + semicolon list of deliverables | Read |
| Expert portfolioNote | Expert | **Active** | Split at colon | Read |
| Expert-2 `match=` is regex | Expert-2 P0 | **Active** | Theory T2-A/T3-A + E2 instruction/edgeCases/feedback state `re.search`; lab = literal fragment | Read |
| Expert-2 construct dual-track | Expert-2 P0 | Partially honest | Strengthened honesty that lab ≠ full CLI; residual: in-browser cannot run real pytest | Residual |
| Taxonomy `CASO-LIM-027` | Expert borderline + R2 pattern S22 | **Active** | → **Caso 27** (prose + 24 starter comments) | Grep 0 |
| `mal hecha` (merge) | Expert rewrite | **Active** | → `mal hecho` | Read |
| `vs` bare | Grammar subplan | **Active** | → `vs.` (theory + E3) | Grep |
| SQ medium terminal punct | Spanish JSON | **Active** | Periods on hints/edgeCases/objectives | SQ |
| SQ repeated_word True True | Spanish JSON | **Active** | Rephrased tests field | SQ |
| Cross-cutting RichText | Campaign | Platform | **Not fixed** | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **74.4** (was 8.13 / 73.0); findings **15**, all **low** (style/structure noise and intentional code tokens under `--no-lt`).

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s27-async-concurrency.ts` (single authority; 1623 lines after R2).

### Diff group R2-A — Metadata and jobRelevance (Expert M2, G5, G9)

```diff
-  level: "Competente",
+  level: "Senior",

-  jobRelevance: "... pytest—no scripts ... En esta sección inicias **CP-N3-A**: priorizas ... protege el contrato. Matching..."
+  jobRelevance: "... pytest — no scripts ... En esta sección inicias **CP-N3-A**. Priorizas ... fixtures. Cubres bordes ... protege el contrato. Matching..."
```

### Diff group R2-B — Theory grammar, density, `match=` fact (Expert G3/G7/G8; Expert-2)

- Caso taxonomy: `CASO-LIM-027` / contactos fakes → **Caso 27** / contactos sintéticos.
- Risk paragraphs: split impact/probabilidad lists; `mal hecho`.
- AAA/oracle: shorter sentences; three-oracle list.
- Discovery: `volver a correr`; `2 a. m.`; **match= is regex (`re.search`)** + dual-track model for lab.
- Borders: same regex truth + lab containment for literal fragments.
- Coverage: `100 %` / `90 %`; split long colon sentences.
- Mutation: `vs.` typography.

### Diff group R2-C — I Do / We Do / You Do / self-check polish

- iDo.intro: `el *porqué*`; “ejercicios guiados”.
- weDo.intro: semicolon map; Caso 27.
- 24 starters: `# Caso 27 · …` (taxonomy only).
- T3-A-E2: instruction/hints/edgeCases/feedback teach real `match=` regex vs lab `in`.
- Edge/hint terminal punctuation; tests field rephrasing (no false “True True” repeat).
- youDo.context + portfolioNote + objectives terminal punctuation.
- Q5: `un fixture`.

---

## 4. After-Fix Validation Report

### Explorer issues (ISSUE-01…22)

| Issue | Status |
|-------|--------|
| 01 id/filename | Residual (compatibility; no learner confession) |
| 02–05 meta / harness | Fixed (R1 + re-validated) |
| 06–07 code/output | Fixed (R1); re-exec PASS |
| 08–10, 16–17 authenticity | Fixed (R1) with residual Expert-2 dual-track limit |
| 11–15, 18–19 editorial | Fixed R1 + R2 polish |
| 20 phase | Intentional keep |
| 21–22 process | Documented |

### Expert issues (G1–G9, M1–M2, E3)

| Issue | Status |
|-------|--------|
| G1–G8, G9, M2, D11 | **Fixed** this round |
| E3 before→antes | Already fixed |
| M1 id rename | Residual (ops migration) |

### Expert-2

| Issue | Status |
|-------|--------|
| `match=` substring falsehood | **Fixed** |
| Full authentic pytest CLI in every exercise | Residual (platform dual-track; honesty strengthened, not a 24-exercise rewrite) |
| Authentic eval mount / 8 public MCQ | Residual (schema/product; out of section-local scope) |

### Mechanical validation

| Check | Result |
|-------|--------|
| Solution code execute-and-diff | **24/24 PASS** |
| Theory + iDo demo execute-and-diff (prior full run) | **40/40 PASS** including solutions |
| Spanish quality `--no-lt` | **8.13 → 10.0**; FH **74.4**; 15 low findings only |
| Brace/bracket balance | 0 / 0 / 0 |
| Residual greps | No `CASO-LIM`, `re-correr`, `pytest—no`, bare `100%` prose, `subcadena` falsehood, ledger/gate V3 |
| TypeScript project | Pre-existing errors in **other** sections (S25/S26); none attributed to S27 |
| Markdown `**` in jobRelevance | May still show raw if RichText global bug (platform residual) |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- **Dual-track authenticity:** Exercises still run as assert+print in the course runner. Theory now states clearly that real `match=` is regex and that CLI discovery is practiced on the learner machine. A future pass could replace 2–4 transfer exercises with full `test_*.py` packages if the runner gains pytest.
- **Public self-check** remains 5 MCQs (not 8 topic authentic evals). Expanding authenticated banks is out of this Fixer’s product-file scope unless bank keys are section-local and assigned.

### Repository-wide / deferred
- **`id: "async-concurrency"` + filename** migration to `pytest-strategy` with progress alias (Global Agent C).
- **SectionView.tsx RichText** markdown leak (Global Agent A).
- **Expert-2** demand for red→green failure demos with real pytest traceback (needs runner support).

### Adjacent sections
- S26→S27 bridge already present; S27→S28 mock/integration bridge retained. No edits to S26/S28.

---

## 6. Updated Graph Memory notes

```yaml
section: 27
id: async-concurrency  # retained for URL/progress
file: s27-async-concurrency.ts
v3_topic: pytest_contracts_cpn3a
round2_status: fixed_validated
explorer_baseline: 4.8  # pre-R1
expert_score: 7.6
expert2_score: 5.5  # construct validity; partial residual
spanish_pre: 8.13
spanish_post: 10.0
resolved:
  - meta_leaks_R1
  - code_output_honesty_R1
  - grammar_G1_G9_R2
  - match_regex_fact_R2
  - caso_lim_taxonomy_R2
  - level_Senior_R2
retained_strengths:
  - ethics_no_fraude_no_parentesco
  - risk_x_layer_framing
  - dual_track_honest_wording
  - youDo_pytest_scaffold
  - S26_bridge_S28_forward
residuals:
  - id_async_concurrency_compatibility
  - dual_track_no_CLI_in_browser
  - platform_RichText
edges:
  - S26_VP --> S27_pytest_contracts
  - S27 --> S28_mocks_integration
  - S27_id ↛ title_pytest (compatibility only)
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s27-async-concurrency.ts` | Only product edit: Senior level, Spanish/typography, match= fact, Caso 27 taxonomy, readability splits, edge/hint polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S27_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S27.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append) |
| `course-state/curriculum_hardening/audits/spanish_quality/S27_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

Full entry written to `expert_audit/worklog_entries_r2/S27.md`.  
Brief pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S27**.

---

Section 27 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
