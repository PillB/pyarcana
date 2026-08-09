# S41 Fixer Report (Round 2) — APIs con FastAPI y contratos HTTP

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S41  
**Section:** 41 · platform id `llm-finetuning` (silent; not learner-facing)  
**Source (only product file edited):** `src/lib/course/sections/s41-llm-finetuning.ts`  
**Anti-aberration:** **OK** — educational prose, callouts, E2 feedback, and E3 instructions rewritten by hand; mechanical deletion only for tautological `meets_contract` residue; no generators or bulk prose factories.

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 41 — APIs con FastAPI y contratos HTTP |
| **Canonical file** | `src/lib/course/sections/s41-llm-finetuning.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#llm-finetuning |
| **Internal ID** | `llm-finetuning` (retained for deep links; never explained to learners) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S41_EXPLORER_REPORT.md` |
| **Expert report** | `expert_audit/S41_report.md` |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/Auditoría de la Sección 41- APIs con FastAPI.docx` |
| **Spanish-quality JSON** | `course-state/curriculum_hardening/audits/spanish_quality/S41_SPANISH_QUALITY.json` (pre: 8.81/10) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S41_FIXER_REPORT.md` |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (8 MCQ) + `youDo` portfolio; no separate bank edit |

**Scope note:** Round 1 already rewrote theory mechanisms, expanded LOs, fixed meta-legacy prose, keyset pagination, Problem Details, behavioral youDo, and 8 technical self-check items. Round 1 *claimed* residual cleanup (callouts, `meets_contract` strip, E3 salida, E2 feedback) that **was not present** in the tree; Round 2 applied those residuals and expert-2 HTTP semantics.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISS-01 / M1 | Explorer | Already fixed | No legacy id / V3 in `jobRelevance` | Scan clean |
| ISS-02 / M3 | Explorer | Already fixed | Map demo gates only | Exec OK |
| ISS-03 / ISS-04 | Explorer | Already fixed | Unique mechanism theory | Manual review |
| ISS-05 / ISS-10 | Explorer | Already fixed | Computing demos; Idempotency-Key | Exec OK |
| ISS-06 | Explorer | Already fixed | stdlib→FastAPI bridge on map | Present |
| ISS-07 residual | Explorer + R1 claim | **Active** | E2 feedback diversified ×8; E3 salida = token triples; stripped 24× tautological `meets_contract` | Exec 24/24 sol |
| ISS-08 | Explorer | Already fixed | youDo `readiness()` behavioral | READY after correct impl |
| ISS-09 | Explorer | Already fixed | CASO-ARE only | Scan clean |
| ISS-11 | Explorer | Already fixed | 422 vs 405 in dictionary | Present |
| ISS-12 | Explorer | Already fixed | Measurable LOs | Present |
| ISS-13 | Explorer | Already fixed | 8 MCQ technical | Present |
| ISS-14 | Explorer | Already fixed | Distinct iDo `why` | Present |
| ISS-15 | Explorer | Already fixed | `icon: "Server"`; id silent | Present |
| ISS-16 residual | Explorer + R1 claim | **Active** | 9 theory callouts → local measurable criteria (learner voice) | Manual |
| ISS-17 residual | Explorer | Partial | edgeCases capitalised (`Fixture adverso`, `Falta …`) | Scan |
| ISS-18 | Explorer | Already fixed | youDo context grammar | Present |
| ISS-19–23 | Explorer | Already fixed / noted | Headings, Problem Details, keyset | Present |
| H-1..H-3 | Expert | **Platform residual** | File id / SectionView QLoRA demo / PdfReport FineTune **out of section scope** | Documented residual |
| M-2 | Expert | **Active** | `o OpenAPI` → `u OpenAPI` in edgeCases / anti-patterns | Scan |
| M-3 | Expert | **Active** | `vs` → `vs.` / `frente a` in iDo why | Scan |
| M-4 | Expert | **Active** | Determiners: *la misma clave + el mismo body* | Manual |
| M-7 | Expert | **Active** | Sentence-initial edgeCases capitalised | Scan |
| M-9 | Expert | **Active** | Rubric `Correctitud` → `Corrección técnica…` + terminal periods | Manual |
| SQ run_on weDo intro | Spanish quality | **Active** | Split / simplified weDo intro | Manual |
| SQ long iDo intro | Spanish quality | **Active** | Split iDo intro enumeration | Manual |
| T3-A long sentence | Expert M-6 / Explorer | **Active** | Split CPU/durable boundary sentence | Manual |
| Expert-2 Issue 2 | Expert-2 | **Active** | HTTP matrix: collection GET 200; item GET 404; theory + iDo + E1 | Exec OK |
| Meta callouts | Expert + campaign | **Active** | Removed “Nota de orientación / no promociones / promote / residual risk” | Scan clean |
| Py 3.9 types | Validation | **Active** | `str \| None` → untyped `after_id=None` in keyset helpers | Exec on 3.9.6 |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "llm-finetuning"` / filename | Compatibility deep links; silent retention (Explorer M4) |
| SectionView QLoRA demo / PdfReport FineTune | Global platform defect — not this agent’s file scope |
| Full FastAPI + TestClient rewrite of all 24 labs | Progressive stdlib isomorphism is intentional; bridge + resources + optional youDo note remain. Expert-2 “require FastAPI from T1-B” deferred as curriculum redesign, not R2 residual polish |
| `APIs` plural sigla | Expert M-5 style preference; es-PE tech writing accepts form; title stability |

---

## 3. Precise changes (substance)

### 3.1 Theory callouts (all 9 → learner criteria)

Examples of replacement intent:

- Map: gate evidence local (idempotencia, sin PII, lectura v1).  
- T1-A: 201 create / 200 colección / 404 ítem.  
- T1-B: replay + keyset.  
- T2-A: handler delgado + fake store.  
- T2-B: 422 + allow-list + OpenAPI fiel.  
- T3-A: CPU/durable fuera del event loop.  
- T3-B: cascade + Problem Details.  
- T4-A: pirámide seed→level.  
- T4-B: 429 + consumer v1 + traza sin PII.

### 3.2 HTTP semantics (T1-A)

`status_for` now distinguishes:

- `POST …/jobs` → 201  
- `GET …/jobs` (colección) → 200  
- `GET …/jobs/{id}` → 200 o 404  
- `GET …/health` → 200  
- fallback → 405  

Updated theory code, iDo demo, E1 starter/solution/hints/feedback.

### 3.3 weDo residual theater

- Removed all `meets_contract = ('…' == '…')` / `print('meets_contract', …)` from 24 solutions.  
- E3 instructions: exact token-triple salida (no “imprime meets_contract”).  
- E2 feedback: eight rule-specific strings (no “explica qué campo…” clone).

### 3.4 Spanish / redaction

- `vs` → `vs.` / `frente a`.  
- `o OpenAPI` → `u OpenAPI` where conjunction.  
- Rubric: corrección técnica + periods.  
- Determiners on Idempotency-Key phrases.  
- edgeCases capitalised.  
- Curriculum-gatekeeper verbs reduced in feedback/callouts.

---

## 4. After-Fix Validation Report

### Issue-by-issue (Explorer ISS-01…23)

| ISS | Result |
|-----|--------|
| 01–06 | Fixed / already fixed |
| 07 | Fixed in R2 (E2/E3/meets_contract) |
| 08–15 | Already fixed (re-validated) |
| 16 | Fixed in R2 (callouts) |
| 17 | Fixed in R2 (edgeCases casing + adverse wording already coherent) |
| 18–20 | Already fixed |
| 21 | Process residual (ledger) — N/A content |
| 22–23 | Already fixed |

### Expert HIGH (H-1..H-3)

| ID | Result |
|----|--------|
| H-1 file/id | Residual platform — silent id retained |
| H-2 QLoRA demo | Residual platform — SectionView.tsx out of scope |
| H-3 PDF FineTune | Residual platform — PdfReport.tsx out of scope |

### Code execution

| Suite | Result |
|-------|--------|
| 24 solutionCode | **24/24 PASS** (Python 3.9.6, shared-ns `exec`) |
| 8 iDo demos | **8/8 PASS** |
| 9 theory codes | **9/9 PASS** |
| T1-A-E1 starter | Assert fails as intended (DEFECT 200 on create) |
| youDo with correct `create_job` | `READY` + empty missing |

### Spanish-quality

| Metric | Before (fleet JSON) | After (editorial judgment) |
|--------|---------------------|----------------------------|
| Quality score | 8.81/10 | ~9.2–9.4 (run-ons/meta callouts/`meets_contract` noise removed) |
| Actionable high run-on weDo intro | Present | Split / clarified |
| Y_E_O_U / vs. / Correctitud | Present | Fixed |
| LT false positives (PREP_VERB on create, AGREEMENT on 429) | Known noise | Not content bugs |

### Markdown / platform

- Section-local prose may still show raw `**` in fields rendered without `<RichText>` (global ISS). Recorded residual; not fixed here.

### Assessment keys

- 8 selfCheck items unchanged in keys; still aligned to outcomes (201, conflict, OpenAPI, 422, replay, DI, async, 429).  
- Correct-index distribution unchanged this round.

### Continuity

- S40 → S41 fronteras HTTP preserved.  
- S42 authz/schemas forward pointer preserved (content-correct).

### Anti-aberration statement

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content.** Automation was used only for: stripping tautological `meets_contract` lines; executing existing code; scanning residual markers; writing reports.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **Stdlib-first pedagogy** remains the Master path; learners who expect a full FastAPI app in every lab still need the optional bridge + resources. A future redesign could add one vertical FastAPI+TestClient lab without discarding stdlib pretraining.  
2. **weDo E2/E3 shape** is still assess/decide lattice (fail-closed culture). Residual monomorphism of *format* is acceptable; skill tokens and feedback are now topic-specific.  
3. **CASO-ARE-041** scaffolding in starter comments remains intentional case framing (not legacy LIM).

### Platform residuals (do not fix in S41 TS alone)

1. Interactive demo map key `llm-finetuning` → QLoRA simulator (SectionView.tsx).  
2. PdfReport label `41. FineTune`.  
3. Filename / hash migration with aliases.  
4. RichText rendering for callout/jobRelevance fields.

### Deferred

- Gate ledger claim that CP-N4-A lives on S43 (expert-2) — roadmap ownership outside section prose.  
- Full OpenAPI generation exercise — resources cite; stdlib isomorphism documents mapping only.

---

## 6. Updated Graph Memory notes

| Node / edge | Update |
|-------------|--------|
| **Section node** | S41 APIs FastAPI / HTTP contracts — R2 residual hardened |
| **Concept nodes** | Collection vs item status; Idempotency-Key; DI thin handler; 422; async/background; Problem Details; test pyramid; 429+trace |
| **Prerequisites** | S40 domain boundaries → HTTP resources |
| **Forward** | S42 schemas / authz / privacy |
| **Resolved defect nodes** | Meta callouts; meets_contract theater; E3 salida; HTTP 404-on-collection error; Spanish M-2/M-3/M-4/M-7/M-9 |
| **Remaining risks** | Platform demo/PDF/id drift; optional FastAPI authenticity gap |
| **Compatibility** | Keep `llm-finetuning` id |
| **Assessment coverage** | 8 MCQ + behavioral youDo + 24 fail-closed labs |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s41-llm-finetuning.ts` | Only product curriculum source for S41 |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S41_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S41.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S41 |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S41.md`  
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S41**)

---

Section 41 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
