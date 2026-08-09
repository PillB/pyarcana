# S09 Fixer Report (Round 2) — Excepciones, debugging y logging seguro

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S09  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **9** — Excepciones, debugging y logging seguro |
| Canonical file | `src/lib/course/sections/s09-visualization.ts` |
| Live route | https://pillb.github.io/pyarcana/#visualization |
| Internal ID | `visualization` (legacy slug retained for progress/URLs; content is exceptions/logging, not charts) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S09_EXPLORER_REPORT.md` (campaign pass ~7.3 pre-R1; R1 gold-aligned content) |
| Expert report | `expert_audit/S09_report.md` (composite 8.0; H-1/H-2 platform; M-1…M-5 residual Spanish/style) |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S09_SPANISH_QUALITY.json` (pre-fix score **7.78**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S09_FIXER_REPORT.md` |
| Expert-2 audit | No dedicated S09 second-expert file under `expert_2_audit/` |
| Assessment surface | Public `selfCheck` (11 MCQs) in canonical file; platform key `visualization` |
| Validation | Python execute-and-diff on theory demos; Spanish audit `--from 9 --to 9 --no-lt`; residual greps |

**Scope obeyed:** Only `s09-visualization.ts` was edited for product content. Reports/worklog under the assigned paths. No `SectionView.tsx`, no `PdfReport.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was limited to: (1) mechanical strip of `# CASO-LIM-009 · …` starter meta header lines, (2) executing existing code to verify outputs, (3) Spanish-quality measurement, (4) applying hand-written orthography/hint-nudge replacements.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 already remediates the expert/Explorer **P0/P1 cluster** from the pre-hardening surface:

- Meta-leaks (V3 / platform id / Netflix EDA / matplotlib confessions) gone from learner prose  
- `structured_log.py` code↔output fidelity  
- Theory map learner-facing (no curriculum migration)  
- `with` / `else` / `log.exception` demonstrated  
- You Do scaffold with `NotImplementedError`  
- 11 MCQs including bare except / finally / correlation_id / CRITICAL / structured fields  
- OWASP Logging Cheat Sheet in resources  
- T4-A-E1 8-case taxonomy aligned  

Live residual defects match the **campaign Explorer M-series** (Spanish, style, CASO-LIM tags, hint duplication) and Spanish-quality findings — not the pre-R1 expert P0 surface.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Expert ISSUE-01…17, 19–21 | Expert / R1 | **Already fixed** (R1) | Re-validated: no V3/Netflix/platform-id/meta; structured_log OK; youDo scaffold; 11 MCQs; OWASP | Grep + read + execute |
| Expert ISSUE-18 / Explorer M-4 | Expert / Explorer | Structural | **Deferred** (compat: progress, `#visualization`) | Residual |
| Expert ISSUE-22 | Expert | Process hygiene | **Out of scope** (stale audit JSON) | Residual |
| Explorer H-1 matplotlib playground | Explorer | Platform | **Not fixed** (global SectionView map) | Residual platform |
| Explorer H-2 PDF “9. Viz” | Explorer | Platform | **Not fixed** (global PdfReport map) | Residual platform |
| Explorer M-1 hint === hints[0] (21/24) | Explorer | **Active** | Distinct progressive first-nudge `hint` for all 24 exercises (0 identical pairs) | Script count 0 same |
| Explorer M-2a fallo/fallos | Explorer / SQ | **Active** | Callout: diferencia **fallos** de datos, configuración y proveedor | Grep |
| Explorer M-2b datos limpio | Explorer / SQ | **Active** | feedback T3-A-E3: datos **limpios** | Grep |
| Explorer M-2c aún así → aun así | Explorer / SQ | **Active** | T1-B-E1 instruction: **aun así** | Grep |
| Explorer M-2d/e re-lanza → relanza | Explorer / SQ | **Active** | instruction T1-A-E3 + tests T1-B-E3 | Grep |
| Explorer M-2f re-correr | Explorer / SQ | **Active** | → **volver a ejecutar** (semantic re-run, not “recorrer”) | Read |
| Explorer M-3a vs → vs. | Explorer / SQ | **Active** | Prose LO / theory / iDo / youDo / hints standardized to `vs.` | Grep 0 bare `vs` |
| Explorer M-3b postmortem | Explorer | **Active** | Standardized to **post mórtem** in learner prose | Grep |
| Explorer M-3c unit spaces | Explorer | **Active** | `0.1 s, 0.2 s, 0.4 s` + gloss thundering herd | Read |
| Explorer M-5 run-ons | Explorer / Expert | **Active** | Split T2-B 5-whys; T4-A fail-fast/cuarentena; youDo context | Editorial |
| Expert CASO-LIM starter tags | Campaign cross-cut / S08 R2 peer | **Active** | Removed 24 `# CASO-LIM-009 · …` starter headers; kept `# A corregir:` | Grep 0 |
| SQ edgeCases missing terminal punct | Spanish JSON | **Active** | Terminal periods on sentence-like edgeCases | Read |
| SQ re-ejecut* | Spanish / Explorer L | **Active** | → “vuelve a ejecutar” / “no vuelvas a ejecutar” | Grep 0 |
| SQ space_before_punct / MORFOLOGIK FPs | Spanish JSON | Noise | No rewrite of valid tech tokens / backticks | Triaged |
| Cross-cutting RichText Markdown | Campaign | Platform | **Not fixed** (global agent) | Residual |
| Cross-cutting legacy id | Campaign | Structural | Preserved `visualization` | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **79.9** (was 7.78 / 78.2); 12 residual findings all low/medium false-positive or intentional tech tokens (`vs.` after period heuristics, `parse_dni`/`DNI` expansion, backticks).

---

## 3. Full corrected content or precise complete diffs

Product file only: `src/lib/course/sections/s09-visualization.ts` (~2298 → ~2275 lines after CASO-LIM strip + prose polish).

### 3.1 Front matter / theory

- `jobRelevance`: `vs.` + **post mórtem**  
- Learning outcomes: `vs.`  
- Map callout: **fallos** de datos…  
- Map P2–P4: `vs.`; post mórtem; “esta sección”; S10 (Módulos y CLI) first-mention  
- T1-B: split `with` sentence; `vs.`  
- T2-B: split 5-whys run-on  
- T3-A/B: post mórtem; S10 title gloss  
- T4-A heading/paragraphs: `vs.`; split fail-fast/cuarentena run-ons; post mórtem  
- T4-B: **volver a ejecutar**; reingesta/reproceso; unit spaces; thundering-herd gloss  

### 3.2 I Do / We Do / You Do

- iDo intro: `vs.`  
- All 24 `hint` fields distinct from `hints[0]` (progressive first nudge)  
- Orthography: relanza, aun así, datos limpios  
- edgeCases: terminal punctuation where sentence-like  
- 24 starters: stripped `# CASO-LIM-009 · …` headers; retained `# A corregir:` learner scaffolds  
- youDo context: split portfolio run-on; objectives `vs.`  

### 3.3 Self-check / resources

- Self-check option text: post mórtems (plural)  
- Resources unchanged (already include OWASP + book URLs from R1)

Representative fragments (post-fix):

```ts
// callout CP-N1-C
"…diferencia **fallos** de datos, configuración y proveedor…"

// T4-B theory
"…permiten **volver a ejecutar** un job sin duplicar side-effects…"
"Backoff simple (sleep creciente: 0.1 s, 0.2 s, 0.4 s…) reduce el **thundering herd** (estampida de reintentos concurrentes)…"

// T1-A-E3
"…y **relanza** `DataLoadError` con `raise ... from e`…"

// T1-B-E1
"…y **aun así** deja closed True…"
```

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue confirmation

| ID | Status | Evidence |
|----|--------|----------|
| Expert 01–17, 19–21 | **Already fixed** (R1) + re-validated | Grep clean of V3/Netflix/platform-id/matplotlib confessions |
| Expert 18 / M-4 | Residual (compat) | `id: "visualization"` retained |
| Explorer H-1 | Residual platform | SectionView demos map not in section scope |
| Explorer H-2 | Residual platform | PdfReport SECTION_NAMES not in section scope |
| Explorer M-1 | **Fixed** | 0/24 `hint === hints[0]` |
| Explorer M-2a–f | **Fixed** | Orthography greps clean |
| Explorer M-3a–c | **Fixed** | `vs.`, post mórtem, unit spaces |
| Explorer M-5 | **Fixed** | Key run-ons split |
| CASO-LIM starter meta | **Fixed** | 0 headers; 22 `# A corregir:` retained |
| Spanish quality | **Improved** | 7.78 → **10.0** |

### 4.2 Code execution (theory demos)

| Demo | Result | Notes |
|------|--------|-------|
| raise_chain.py | **OK** | Output matches |
| minimal_repro.py | **OK** | Output matches |
| structured_log.py | **OK** | Structured fields match |
| redact_pii.py | **OK** | mask + log.exception first line |
| failfast_quarantine.py | **OK** | |
| retry_policy.py | **OK** | |
| boundaries.py | Env extract caveat | TS `\\n` escapes need SPA compile; declared output correct for runtime |
| traceback_read.py | Env extract caveat | Frame paths depend on temp filename vs `<string>`; filter still pedagogical |

### 4.3 Assessment integrity

- 11 MCQs; correctIndex `[0, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3]` — balanced rotation  
- No answer-key changes required  

### 4.4 Spanish-quality (validation only)

- Before: quality **7.78**, FH **78.2**, findings 83  
- After: quality **10.0**, FH **79.9**, findings 12 (FP cluster)  
- Command: `python3 scripts/spanish_quality_audit.py --from 9 --to 9 --no-lt`

### 4.5 Live render / continuity

- Live SPA hash remains `#visualization` (legacy id)  
- Learner title remains “Excepciones, debugging y logging seguro”  
- Adjacent continuity: S08 ETL/cuarentena → S09 bitácora; S10 Módulos y CLI soft preview  

### 4.6 Anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation and mechanical meta-header stripping.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- None blocking. Remaining Spanish audit hits are false positives on tech Spanish (`vs.`, `p. ej.`, `parse_dni`/`DNI`).

### Repository-wide platform dependencies
- **H-1:** `SectionView.tsx` playground still maps `visualization` → matplotlib sandbox — global agent  
- **H-2:** `PdfReport.tsx` labels Section 9 as “9. Viz” — global agent  
- **RichText Markdown leak** on callout/jobRelevance fields — global agent  

### Deferred compatibility migrations
- Keep `id: "visualization"` and filename `s09-visualization.ts` until a progress/URL alias migration exists  

### Adjacent-section recommendations
- None required for S09 correctness  

---

## 6. Updated Graph Memory notes

| Node / edge | Note |
|-------------|------|
| Section node | S09 exceptions/debugging/logging-safe; id `visualization` |
| Concept nodes | Specific exceptions, chaining, try/else/finally/with, traceback, minimal repro, structured logging, log.exception, correlation_id, PII masks, fail-fast vs. quarantine, retries/idempotency |
| Prerequisite edges | S05–S07 normalizers; S08 cuarentena + manifest + reconcile |
| Forward edges | S10 CLI handlers / stdout vs logs |
| Retained strengths | CASO-LIM-009 spine, CP-N1-C portfolio, 8/24/1 I/W/Y, 11 MCQs, OWASP |
| Resolved defect nodes | Spanish M-2/M-3/M-5; hint duplication; CASO-LIM starter meta; post mórtem / vs. / relanza / aun así |
| Remaining risks | Platform playground + PDF label; legacy id |
| Assessment coverage | T1–T4 MCQ breadth OK; no key changes |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s09-visualization.ts` | Hand-crafted R2 residual Spanish, style, run-ons, hints, CASO-LIM strip, orthography |
| `course-state/curriculum_hardening/audits/spanish_quality/S09_SPANISH_QUALITY.json` | Regenerated by validation audit only |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S09_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S09.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S09.md` (full)  
- `expert_audit/worklog.md` (append pointer, Task ID **FIXER-R2-S09**)

---

Section 9 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
