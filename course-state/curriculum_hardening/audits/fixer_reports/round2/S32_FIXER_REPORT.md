# S32 Fixer Report (Round 2) — Feature engineering y pipelines sin leakage

**Generated:** 2026-07-25  
**Role:** Second-round Section Fixer (headless)  
**Section:** 32 · `microservices` · Feature engineering y pipelines sin leakage  
**Source edited (only):** `src/lib/course/sections/s32-microservices.ts`  
**Anti-aberration:** **OK** — no generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation used only for mechanical validation (code/output oracles, Spanish metrics, residual greps, TypeScript). Hand-authored before→after maps applied as exact string replacements; each unit was reviewed for pedagogical intent.

---

## 1. Section identification and sources reviewed

| Field | Value |
| --- | --- |
| Section number / title | 32 — Feature engineering y pipelines sin leakage |
| Canonical file | `src/lib/course/sections/s32-microservices.ts` |
| Live route | https://pillb.github.io/pyarcana/#microservices |
| Internal ID | `microservices` (legacy routing hash; content is feature engineering) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S32_EXPLORER_REPORT.md` (baseline 5.0; structural under-teaching) |
| Round-1 Fixer report | `course-state/curriculum_hardening/audits/fixer_reports/S32_FIXER_REPORT.md` (R1 ~9.65 structural hardening) |
| Expert report | `expert_audit/S32_report.md` (7.4; Spanish/meta residuals + platform legacy-id) |
| Expert-2 report | `expert_audit/expert_2_audit/Section 32 Quality Audit.docx` (identified; not copied blindly) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S32_SPANISH_QUALITY.json` (pre R2: 8.39) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / worklog | `expert_audit/CAMPAIGN_SUMMARY.md`, `expert_audit/worklog.md` |
| Assessment | Embedded `selfCheck` (10 MCQ); no separate question-bank file for this id |
| Validation | Manual oracle harness (16 theory+iDo + 24 We Do solutions), `scripts/spanish_quality_audit.py --from 32 --to 32 --no-lt`, residual greps, `tsc` (no S32 errors) |

**Scope boundary:** Only Section 32 canonical source. No edits to `SectionView.tsx`, `PdfReport.tsx`, other sections, or global platform files.

---

## 2. Summary of changes applied

### Baseline reality check

Round-1 already resolved Explorer Issues **ISSUE-01…ISSUE-18** (meta V3/Docker/`section_passed`/`gate V3`, computational We Do, T1-B z-score on filled series, graph path lookup, dictionary, You Do portfolio stubs, self-check coverage to 10 MCQ, edgeCases adversarial wording, MiniPipeline/column_router, etc.). Current source matched the expert-report gold structure (dictionary + 8 subtopics × theory/I Do/We Do triad + CP-N3-B You Do + 10 self-check).

Round-2 focused on **expert Spanish/meta residuals**, **CASO-LIM authoring tags**, **subtopic IDs in learner prose**, **tagline/outcomes/register polish**, and **E3 instruction clarity**.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
| --- | --- | --- | --- | --- |
| Explorer ISSUE-01…18 structural | Explorer + R1 report | **Already fixed** in source | Confirmed present; no re-architecture | Residual greps: no V3/Docker/`section_passed`/`gate V3`; 16+24 oracles PASS |
| Expert H-1 CircuitBreaker demo | Expert H-1 | Active (platform) | **Deferred** — `SectionView.tsx` out of scope | Residual platform |
| Expert H-2 PdfReport "Microsvc" | Expert H-2 | Active (platform) | **Deferred** — `PdfReport.tsx` out of scope | Residual platform |
| Expert H-3 / ML-4–5 `CASO-LIM-032` | Expert H-3 | Active ×24 starters + prose | Removed taxonomy from starter first lines, edgeCases, instructions, theory applications, You Do context; fixtures use `caso-ra-*` | 0 `CASO-LIM` |
| Expert H-4 / ML-6–8 subtopic IDs in prose | Expert H-4 | Active in callouts/instructions/feedback | Callouts → full sentences; instructions → `Ejercicio E*`; feedbacks drop `S32-T*-E*:` | 0 `S32-T1-A:` / `S32-T*-E* ·` in prose (ids retained in schema fields only) |
| Expert M-1 tagline | Expert M-1 / SQ | Active 40-word single sentence | Capitalized; split topic vs ritmo; terminal period | Source + SQ |
| Expert M-2 long E3 instructions | Expert M-2 / SQ | Active packed fail-closed trees | Split CONTINUE / REJECT / REQUEST into short sentences | Spot-check 8 E3 |
| Expert M-3 `vs` without period | Expert M-3 | Active outcomes/rubric/theory | **vs.** in learning outcome, theory T2-B, rubric | Residual grep |
| Expert M-4 `y indicator` | Expert M-4 / SQ | Active hints | **e indicator** | 0 `y indicator` |
| Expert M-5 `[t-w,t)` space | Expert M-5 / SQ | Active I Do description | `[t-w, t)` + clearer `includes_t` wording | Source |
| Expert M-6 telegraphic callouts | Expert M-6 | Active ×8 | Expanded to 2–3 learner sentences with gate codes in backticks | 8 `Contrato local —` |
| SQ learning outcomes terminal `.` | SQ / Expert L-5 | Active ×8 | Terminal periods on all 8 outcomes + 4 You Do objectives | SQ score ↑ |
| Rubric handoff register | Cross-cut / peer R2 | Active "handoff" | **traspaso a S33**; ventana half-open in bonus | Source |
| Legacy id `microservices` | Cross-cut 6.2 / Expert ML-1 | Compatibility | **Retained** (progress/URL hash); no migration in this PR | Residual |
| RichText markdown leak | Cross-cut 6.1 | Platform | Recorded only | Residual |
| SQ unbalanced `[t−w, t)` | SQ | False positive | Documented; notation correct | Residual FP |
| SQ `app,app` repeated_word | SQ | False positive in code example | Documented | Residual FP |

---

## 3. Full corrected content / precise diffs (summary of substantive edits)

All product changes are in `src/lib/course/sections/s32-microservices.ts`. Representative units:

### Header
- **Tagline:** two sentences; capital start; terminal period; “skew y versionado”.
- **learningOutcomes:** terminal `.` on all eight; `vs.` for numérica vs. categórica.

### Theory
- Gate callout: privacy framing (Red Andina / CP-N3-B, sin PII real).
- Eight “Contrato local” callouts rewritten without `S32-T*` prefixes.
- Application paragraphs: “Aplicación al caso sintético Red Andina” (no `CASO-LIM-032`).
- T2-B: `vs.` half-open comparison.

### I Do
- Window demo description: `[t-w, t)` spacing and clearer `includes_t` phrasing.

### We Do (24)
- Instructions: `Ejercicio E1/E2/E3 · …`; CASO-LIM stripped; E3 fail-closed trees sentence-split.
- Feedback: authoring prefixes removed; short professional sentences; gate codes in backticks where polished.
- Hints: `e indicator`.
- Starter first lines: `# E* — … (Red Andina sintético, sin PII real)`.
- edgeCases third item: “Caso sintético Red Andina (sin PII real)”.
- Fixture `case_id`: `caso-ra-1a` … `caso-ra-4b` (not asserted; synthetic labels only).

### You Do
- Context and starter header: caso Red Andina / `run_id=cpn3b-feat`; “Traspaso a S33”.
- Objectives: terminal periods.
- Rubric: `vs.`; bonus uses “ventana half-open” + “traspaso a S33”.

### Preserved (do not break)
- `id: "microservices"` (URL/progress compatibility).
- Computational We Do kernels and solution outputs (`S32-T*-E*` **ids** and print tokens like `S32-T1-A PASS` retained as harness contracts).
- Ethics spine (no fraude/parentesco as labels).
- 10 self-check MCQs (already covering train-only stats, catalog, skew, version bump, REQUEST vs REJECT).
- Resources list.

---

## 4. After-Fix Validation Report

| Check | Result |
| --- | --- |
| Explorer ISSUE-01…18 | **Already fixed** (R1) — revalidated |
| Expert H-3, H-4, M-1…M-6 | **Fixed** in section source |
| Expert H-1, H-2 | **Residual** platform (out of scope) |
| Theory + I Do code/output | **16/16 PASS** |
| We Do solutionCode | **24/24 PASS** |
| Spanish quality | **8.39 → 9.77** (`--no-lt`); FH ~89.0; findings 93→9 (mostly FP half-open / code examples) |
| Residual greps | 0 `CASO-LIM`, 0 `section_passed`, 0 `gate V3`, 0 `Docker`, 0 callout `S32-T1-A:`, 0 `y indicator` |
| TypeScript | No errors in `s32-microservices.ts` (unrelated S25 parse error elsewhere) |
| Markdown / RichText | Platform defect unchanged; section still uses `**bold**` in jobRelevance (render leak is global) |
| Assessment keys | Self-check indices unchanged; 10 questions; correctIndex distribution intact |
| Live render | Hash `#microservices` retained; content is features (wrong CircuitBreaker panel is global) |
| Previous/next | S31 graph bridge and S33 `fs-vN` handoff prose preserved |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (execute-and-diff oracles, Spanish-quality metrics, residual greps, TypeScript). Exact before→after maps were hand-authored and applied as literal replacements.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- A few SQ false positives remain (half-open interval notation, `app,app` in ModeImputer example, intentional short E3 gate sentences flagged as choppy).
- Print harness tokens (`S32-T1-A PASS`) remain in code I/O contracts; they are learner-visible output labels, not prose meta-leaks — migrating them would require coordinated test/harness changes.

### Repository-wide / platform (do not fix here)
- **H-1:** `SectionView.tsx` maps `demos["microservices"]` to CircuitBreaker playground — wrong topic for this section.
- **H-2:** `PdfReport.tsx` label `microservices: '32. Microsvc'`.
- **Legacy id/filename:** `id: "microservices"` + `s32-microservices.ts` need compatibility aliases if renamed.
- **RichText markdown leak** on jobRelevance/callouts/instructions (global SectionView).

### Adjacent-section notes (no edits)
- S33 should continue to consume `fs-vN` JSON contract as documented in You Do.
- S31 graph fixture remains conceptual (shared address / degree / path); optional shared mini-fixture export is out of R2 scope.

---

## 6. Updated Graph Memory notes

| Node | Notes |
| --- | --- |
| Section node | S32 Features sin leakage · phase 2 · 18h · CP-N3-B |
| Concept nodes corrected | train≡serve, half-open window, silent fill, fit→transform, fs-vN, entity overlap, label-as-feature, train–serve skew |
| Prerequisite edges | S31 grafo de evidencia → graph feats (shared/degree/path) |
| Forward edges | `fs-vN` + split report → S33 baseline |
| Retained strengths | Fail-closed REQUEST_*/REJECT_*, ethics (no fraude/parentesco), computational We Do, 10 MCQ, MiniPipeline/column_router analogy |
| Resolved defect nodes | CASO-LIM taxonomy in learner surfaces; subtopic IDs in callouts/instructions/feedback; tagline/outcomes/vs./y→e; E3 clarity |
| Remaining risks | Platform demo/PDF mislabel; legacy hash |
| Compatibility | Keep `id: "microservices"` until Global Agent C migration |
| Assessment coverage | Catalog, missing/scale, half-open, fit order, entity overlap, label leak, train-only μ/σ, unknown keys, skew, version bump, REQUEST_STATE_JSON |

---

## 7. Files changed

| File | Why |
| --- | --- |
| `src/lib/course/sections/s32-microservices.ts` | Sole product edit: meta/Spanish/instruction polish for R2 |
| `course-state/curriculum_hardening/audits/spanish_quality/S32_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S32_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S32.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append) |

---

## 8. Worklog confirmation

Completion entry written to `expert_audit/worklog_entries_r2/S32.md` and brief pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S32**.

---

Section 32 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
