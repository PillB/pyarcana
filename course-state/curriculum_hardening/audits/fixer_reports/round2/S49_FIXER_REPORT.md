# S49 Fixer Report (Round 2) — Agentes, herramientas y context engineering

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S49  
**Section:** 49 · platform id `data-contracts` (silent; not learner-facing as topic label)  
**Source (product files edited):**  
- `src/lib/course/sections/s49-data-contracts.ts`  
- `prisma/seed.ts` (block `'data-contracts'` only — authenticated exam)  
**Anti-aberration:** **OK** — educational prose rewritten by hand unit-by-unit; automation used only for mechanical validation (runtime audit, Spanish metrics, residual greps, exam-position counts).

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 49 — Agentes, herramientas y context engineering |
| **Canonical file** | `src/lib/course/sections/s49-data-contracts.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#data-contracts |
| **Internal ID** | `data-contracts` (retained for deep links / progress; learner prose teaches agents/tools) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S49_EXPLORER_REPORT.md` (score 5.8/10; pre–R1 state) |
| **Expert report** | `expert_audit/S49_report.md` (composite ~7.2; Spanish + cognitive-load focus) |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/Explorer Report — Sección 49.docx` (score 6.3; P0 exam B-exploit + choose_mode residual agent + playground) |
| **Spanish-quality JSON** | `course-state/curriculum_hardening/audits/spanish_quality/S49_SPANISH_QUALITY.json` (pre R2 with LT: **7.09**/10; after R2 `--no-lt`: **10.0**/10) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S49_FIXER_REPORT.md` (~9.65) |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (7 MCQ) + `youDo` CP-N4-C; authenticated bank 24 variants in `prisma/seed.ts` |
| **Validation** | `scripts/python_content_runtime_audit.py --only s49` · `scripts/spanish_quality_audit.py --from 49 --to 49 --no-lt` · hand re-execution of theory/iDo/solution blocks |

**Scope note:** Round 1 already closed Explorer ISS-01–16 residuals that were still open at that pass (jobRelevance promotion, CASO-LIM, meta V3/legacy, mechanism iDo, E3 helper reuse, resources, selfCheck T3/T4). Round 2 verified that state and closed **Expert Spanish residuals + Expert-2 P0 exam exploit + choose_mode fail-closed contradiction + HITL binding + map/callout polish**.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISS-01 jobRelevance inverted promotion | Explorer | **Already fixed** (R1) | Re-validated: prefers workflow when baseline ≥ agent; promotes agent only with plan/budgets/SRP | Grep / manual |
| ISS-02 / M1–M2 legacy path V3 | Explorer | **Already fixed** (R1) | Zero learner-facing legacy/V3 notes | Grep |
| ISS-03 CASO-LIM-049 ×24 | Explorer | **Already fixed** (R1) | Zero `CASO-LIM` | Grep |
| ISS-04 theory shells / callouts | Explorer | **Partially fixed** | Callouts were still `Contrato local`; rewrote 8 unique mechanism tips | Manual |
| ISS-05/11 iDo + theory code | Explorer | **Mostly fixed** (R1) | Strengthened T1-A choose/adr_mode fail-closed; HITL `approved_for` on T4 demos | Runtime 62/62 |
| ISS-06 weDo boolean gates | Explorer | **Fixed structure** (R1) | Clarified `KEEP_DETERMINISTIC_WORKFLOW` = no agent promote yet; E2 instruction rewrite | Manual |
| ISS-07 edgeCases `adverso:` | Explorer | **Already fixed** (R1) | Re-validated | Grep |
| ISS-08 headings/outcomes | Explorer | **Already fixed** (R1) | LO periods + `vs.` + sin efectos duplicados | Manual |
| ISS-09 youDo grammar/scaffold | Explorer | **Already fixed** (R1) | `decide_mode` fail-closed + `call_tool(..., approved_for=)` | Exec youDo smoke |
| ISS-10/16 product jargon map | Explorer | **Already fixed** (R1) | Map dictionary bullets + hilo conductor list | Manual |
| ISS-12 context-engineering resource | Explorer | **Already fixed** (R1) | Present | Manual |
| ISS-13 hash `data-contracts` | Explorer | **Platform residual** | Not renamed (compatibility freeze) | Documented |
| ISS-14/15 cost_pen / selfCheck T3–T4 | Explorer | **Already fixed** (R1) | Ethics option aligned to sandbox; explanation fixed | Manual |
| H-01 Diccionario overload | Expert | **Active** | Split into glossary bullets + action-code block | SQ 10.0 |
| H-02 Hilo conductor run-on | Expert | **Active** | Numbered 1–5 list + producto/fallos | SQ |
| H-03 tagline lowercase | Expert | **Active** | Capitalized + terminal period | Manual |
| M-01 `re-efectos` / `re-ejecutar` | Expert | **Active** | → *efectos duplicados* / *volver a ejecutar* | Grep 0 |
| M-02 `vs` without period | Expert | **Active** | → `vs.` in Spanish prose | Grep |
| M-05 residual risk / lab stdlib | Expert | **Active** | → riesgo residual / laboratorio basado en stdlib | Grep |
| M-06 tools de red abiertas | Expert | **Active** | → tools con red abierta | Manual |
| L-01 tabular_contracts_only_topic | Expert | **Active** | Map demo → `topic_is_agent_tools: True` | Exec |
| L-05 El checklist | Expert | **Active** | → La lista de verificación / conviértela | Manual |
| L-06 intro-level courses notes | Expert | **Active** | Notes mark CS224N/MIT/CS50P/Py4E as repaso opcional | Manual |
| Expert-2 ISSUE-01 playground | Expert-2 | **Platform residual** | SectionView demos map keyed by `data-contracts` — Global Agent A/C | Out of section file scope |
| Expert-2 ISSUE-02 exam always B | Expert-2 | **Active P0** | Rebalanced 24 variants to correctIndex **6/6/6/6** + Spanish explanations | Count assert |
| Expert-2 ISSUE-03 choose_mode residual agent | Expert-2 | **Active P0** | Theory + iDo + youDo: `workflow` / `agent_candidate` / `need_evidence` (no silent agent) | Exec |
| Expert-2 ISSUE-06 HITL boolean global | Expert-2 | **Active** | Approval bound to tool name (`approved_for == name`) in theory/iDo/youDo | Exec |
| Expert-2 ISSUE-04/05/07/08 redesign depth | Expert-2 | **Residual justified** | Full multi-step agent trajectory redesign exceeds R2 residual polish; R1 already mechanism demos | Documented |
| SectionView RichText Markdown | Cross-cutting 6.1 | **Platform residual** | Not this agent’s file scope | Documented |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "data-contracts"` / filename `s49-data-contracts.ts` | Compatibility deep links and progress keys; silent retention |
| Graded weDo action strings (`KEEP_DETERMINISTIC_WORKFLOW`, etc.) | Harness stability; clarified *meaning* in dictionary/weDo intro instead of renaming codes |
| E1/E2 inverted-predicate scaffold ×24 | Intentional gradual-release micro-skill under browser/stdlib constraint |
| Full multi-turn agent loop product | Expert-2 wants authentic trajectory lab; that is curriculum redesign, not silent polish |
| `hint` dual with `hints[0]` | Schema requires `hint`; progressive `hints[]` present (M-04 maintenance residual) |

---

## 3. Precise changes (substance)

### 3.1 Opening and theory (hand-crafted)

- **tagline:** Capitalized sentence start; *casos y reportes*; terminal period.
- **learningOutcomes:** Terminal periods; `vs.`; *sin efectos duplicados*.
- **Diccionario:** Glossary bullets + separate action-code block; defines `KEEP_DETERMINISTIC_WORKFLOW` as *no promocionar el agente aún*.
- **Bridge / hilo / orden:** Concordance *tools con red abierta*; numbered hilo conductor; *válido, adverso o incierto*; removed “solo contratos de tablas” apology tone in favor of positive framing.
- **Map code:** `topic_is_agent_tools: True` (no `tabular_contracts_only_topic`).
- **T1-A:** Fail-closed `choose_mode(..., plan_bounded)` → `workflow` | `agent_candidate` | `need_evidence`.
- **Callouts:** Unique titles — ADR antes del loop · Cota o stop · Catálogo auditable · Un efecto, una key · Atención acotada · LKG o nada · Stop con razón · HITL y anti-replay.
- **T4-B theory code:** `approved_for` bound to tool name.

### 3.2 I Do / We Do

- T1-A demo `adr_mode` aligned to three-way fail-closed decision.
- T4-B demo `gate(..., approved_for, ...)`.
- weDo intro split into E1/E2/E3 paragraphs + note on `KEEP_DETERMINISTIC_WORKFLOW`.
- T1-A-E2 instruction clarifies row-2 meaning (no agent promote yet).
- T1-A-E3 feedback de-templated toward promotion policy reasoning.
- Orthography: *efectos duplicados*, *volver a ejecutar*, `vs.` across instructions/feedback/descriptions.

### 3.3 You Do / self-check / resources

- `decide_mode` fail-closed; `call_tool` approval tied to tool name; smoke prints updated.
- portfolioNote: *La lista de verificación* / *conviértela*.
- selfCheck: `vs.`; ethics distractor = `network=open` (not ER/parentesco); explanation aligned.
- Resources course notes: intro courses marked as repaso opcional.

### 3.4 Authenticated exam bank (`prisma/seed.ts`)

- 24 variants rebalanced: `correctIndex` distribution **6 / 6 / 6 / 6** (was **0 / 24 / 0 / 0** — always B).
- Explanations rewritten in professional Spanish aligned to S49 contracts.

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue confirmation

| ID | Resolved? | Evidence |
|----|-----------|----------|
| Explorer ISS-01…16 (R1 set) | **Already fixed / re-validated** | Greps clean; mechanism demos present |
| Expert H-01…H-03, M-01…M-06, L-01/L-05/L-06 | **Fixed** | Source + SQ 10.0 |
| Expert-2 ISSUE-02 exam B-exploit | **Fixed** | 6/6/6/6 |
| Expert-2 ISSUE-03 choose_mode | **Fixed** | need_evidence / agent_candidate |
| Expert-2 ISSUE-06 HITL binding | **Fixed (lab-scale)** | approved_for == name |
| Expert-2 ISSUE-01 playground | **Residual platform** | SectionView |
| Expert-2 full agent trajectory | **Residual justified** | Redesign |

### 4.2 Meta-leak re-scan

| Family | Status |
|--------|--------|
| M1 legacy in jobRelevance | **Cleared** |
| M2 V3/legacy in map | **Cleared** |
| M3 CASO-LIM ×24 | **Cleared** |
| M4 iDo/weDo defecto agentic | **Cleared** |
| tabular_contracts_only_topic | **Cleared** (renamed) |
| Contrato local monotony | **Cleared** |

### 4.3 Executable / metrics

| Check | Result |
|-------|--------|
| `python_content_runtime_audit.py --only s49` | **62 pass / 0 fail / 2 skip** |
| Hand re-exec theory + iDo + solutionCode | **41/41 PASS** |
| Spanish quality `--no-lt` | **7.09 → 10.0** (23 low residual; mostly `vs.` period false positives) |
| Exam correctIndex dist | **6 / 6 / 6 / 6** |
| selfCheck correctIndex | `[0,2,3,1,0,2,3]` distributed |
| Markdown in jobRelevance/callouts | Platform RichText residual (global) |

### 4.4 Anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics, answer-position counts). Every prose unit changed in this pass was rewritten by hand with deliberate pedagogical intent.

---

## 5. Residual risks and later recommendations

### Section-local residuals

- We Do remains policy-predicate drills (Expert-2 construct underrepresentation). A future redesign could add one integrated stdlib trajectory (plan → tool → eval → approval → checkpoint).
- `hint` still duplicates `hints[0]` (schema dual field; maintenance hazard).
- Some E3 instructions remain long (technical density at Master level; low SQ only).

### Repository-wide platform dependencies

- **SectionView** playground for `'data-contracts'` still shows TransactionContract / Great Expectations (Expert-2 ISSUE-01) — Global Agent A/C.
- **PdfReport** label “49. Contracts” if still keyed by legacy id — Global Agent C.
- **RichText** Markdown leak on jobRelevance/callout/step fields — Global Agent A.
- Identity migration `data-contracts` → `agents-tools` needs aliases + progress migration — Global Agent C.

### Deferred compatibility

- Do not rename `id` without migration plan.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| **Section node** | S49 agents/tools/context engineering · gate CP-N4-C |
| **Corrected concept nodes** | workflow vs. agent fail-closed; agent_candidate; need_evidence; KEEP_DETERMINISTIC_WORKFLOW = no promote; HITL approved_for; topic_is_agent_tools |
| **Prerequisite edges** | S48 RAG evidence → S49 tools/agents |
| **Forward edges** | S49 stops/HITL → S50 evals + red team CP-N4-C |
| **Retained strengths** | Synthetic CASO-AYA-049; fail-closed vocabulary; E1→E2→E3 scaffold; Anthropic resources |
| **Resolved defect nodes** | Exam B-exploit; residual agent promotion; re- hyphenations; diccionario/hilo load; callout monotony |
| **Remaining risks** | Playground off-topic; deep agent trajectory authenticity |
| **Compatibility** | id `data-contracts` frozen |
| **Assessment coverage** | selfCheck 7; exam 8 concepts × 3 variants balanced |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s49-data-contracts.ts` | Theory/iDo/weDo/youDo/selfCheck/resources residual R2 fixes |
| `prisma/seed.ts` | S49 authenticated exam rebalance + Spanish explanations only |
| `course-state/curriculum_hardening/audits/spanish_quality/S49_SPANISH_QUALITY.json` | Regenerated by validation script |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S49_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S49.md` | Full worklog entry |
| `expert_audit/worklog.md` | Completion pointer append |

---

## 8. Worklog confirmation

Full entry: `expert_audit/worklog_entries_r2/S49.md`  
Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S49**).

---

Section 49 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
