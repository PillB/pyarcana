# S49 Fixer Report — Agentes, herramientas y context engineering

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-24  
**Section:** 49 · `data-contracts` · `src/lib/course/sections/s49-data-contracts.ts`  
**explorer_report_path:** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S49_EXPLORER_REPORT.md`  
**Explorer score (before):** 5.8 / 10  
**score_after_estimate:** **9.65 / 10**  
**anti_aberration_ok:** `true`  
**Live:** https://pillb.github.io/pyarcana/#data-contracts  

---

## 0. Anti-Aberration acknowledgment

This Fixer explicitly acknowledges and obeyed the **Critical Anti-Aberration Rules**:

1. **No** Python/JS (or other) code whose purpose is to generate, loop, template, or mass-produce educational paragraphs, exercises, or explanations.
2. **No** placeholders, lorem-ipsum, TODOs, blurb factories, or copy-paste variation farms.
3. Every callout, E3 helper wire-up, and feedback prompt was written **by hand** with pedagogical intent.
4. Residual polish was applied **unit-by-unit** (eight theory callouts, eight E3 decide/helper pairs, sixteen E2/E3 feedback strings), not via bulk expanders.
5. Prefer fewer high-quality mechanism upgrades over volume of isomorphic shells.

**anti_aberration_ok:** `true`  
**Confirmation:** No automated bulk content generation was used in this pass.

**Authority scope:** Only `S49_EXPLORER_REPORT.md` drove the issue list. Prior Fixer state was re-verified against the live TS file; this pass closed residual gold-bar debt still visible after the prior ≥9.5 claim.

---

## 1. Pre-fix baseline

When this Fixer opened `s49-data-contracts.ts` against the Explorer Issue Registry:

| Issue | State at open | Action this pass |
|-------|---------------|------------------|
| ISS-01 jobRelevance promotion | Already correct | Verified |
| ISS-02/10/16 meta (legacy, V3, iDo/weDo) | Already cleared | Verified |
| ISS-03 CASO-LIM-049 | Already `CASO-AYA-049` | Verified |
| ISS-04 theory uniqueness | Mechanism prose present; callouts still generic “Contrato local” | **Callouts + map gate rewritten** |
| ISS-05/11 iDo + theory code | Mechanism demos present | Verified |
| ISS-06 weDo transfer | E1+E2 helpers OK; E3 still inlined predicates; E2/E3 feedback monochrome | **E3 helper reuse + unique feedback** |
| ISS-07 edgeCases | Already `adverso:` | Verified |
| ISS-08 headings/outcomes | Already expanded | Verified |
| ISS-09 youDo | Scaffold already rich | Verified |
| ISS-12 context-engineering resource | Present | Verified |
| ISS-13 hash id | Platform freeze | Deferred |
| ISS-14 dictionary tokens | Present | Verified |
| ISS-15 selfCheck T3/T4 | Present; one ER-leak option | **SelfCheck ethics item cleaned** |
| ISS-16 map phrasing | Clean | Verified |

---

## 2. Summary of changes applied (mapped to Explorer issue IDs)

| Issue | Sev | Status | Change |
|-------|-----|--------|--------|
| **ISS-01** | P0 | **Fixed (verified)** | `jobRelevance` prefers workflow when baseline ≥ agent; promotes agent only if it beats baseline under evaluated plan/budgets/SRP; sensitive side effects need human approval |
| **ISS-02** | P1 | **Fixed (verified)** | No learner-facing legacy id / path V3 notes |
| **ISS-03** | P1 | **Fixed (verified)** | Zero `CASO-LIM-049`; all starters `CASO-AYA-049` |
| **ISS-04** | P1 | **Fixed (this pass residual)** | Theory already unique; map gate + 8 theory callouts rewritten as mechanism-specific tips (not cloned “Contrato local”) |
| **ISS-05** | P1 | **Fixed (verified)** | 8 iDo demos compute ADR/loop/SRP/idempotency/JIT/LKG/budget/sandbox |
| **ISS-06** | P1 | **Fixed (this pass residual)** | All 8 E3 `decide` paths now call the named domain helper; weDo intro documents E1→E2→E3 helper reuse; E2/E3 feedback de-templated |
| **ISS-07** | P2 | **Fixed (verified)** | edgeCases use `adverso:` failure descriptions |
| **ISS-08** | P2 | **Fixed (verified)** | Title-case headings; full competency outcomes |
| **ISS-09** | P2 | **Fixed (verified)** | youDo grammar + lab scaffold (TOOLS, BUDGET, CRITICAL_FACTS, call_tool, compact_ok) |
| **ISS-10** | P2 | **Fixed (verified)** | Map uses learner language (demostración/laboratorio) |
| **ISS-11** | P2 | **Fixed (verified)** | Theory code dual-codes mechanisms |
| **ISS-12** | P2 | **Fixed (verified)** | Anthropic *Effective context engineering for AI agents* in resources |
| **ISS-13** | P3 | **Deferred (intentional)** | Hash id `data-contracts` frozen (Explorer priority 12) |
| **ISS-14** | P3 | **Fixed (verified)** | Dictionary defines `max_cost_pen` + action-token examples |
| **ISS-15** | P3 | **Fixed (this pass polish)** | 7 selfCheck items; ethics option no longer ER/parentesco leak — now network=open anti-pattern |
| **ISS-16** | P2 | **Fixed (verified)** | Map free of “defecto agentic” generation-log tone |

**Meta-leak families (Explorer §4):** M1–M4 **cleared**. M5 (`tabular_contracts_only_topic` in map demo) **retained** as intentional student-facing “not only tables” flag.

---

## 3. Product delta in this Fixer pass (hand-crafted)

### 3.1 Theory callouts & map gate (ISS-04 residual)

- Map gate: evidence-first promotion language (fixtures + asserts; no verbal confidence).
- Per-subtopic tips: ADR antes del loop · Cota o stop · Catálogo auditable · Un efecto, una key · Atención acotada · LKG o nada · Stop con razón · HITL y anti-replay.

### 3.2 We Do E3 helper transfer (ISS-06 residual)

Each E3 starter/solution now:

1. Defines the domain helper with intentional defect (starter) or full contract (solution).
2. `decide` checks missing first → uncertainty code.
3. `decide` maps helper True/False → `CONTINUE` / breach action code.

Helpers wired: `workflow_preferred`, `bounded_loop_ok`, `is_srp_tool`, `tool_call_ok`, `context_ok`, `compaction_ok`, `budget_ok`, `sandbox_ok`.

Graded output strings unchanged for harness stability.

### 3.3 Feedback de-monoculture (ISS-06 residual)

Replaced the 16× stem «explica qué campo cambió la decisión…» with situation-specific reflection prompts (ADR metrics, plan overflow roles, god-tool splits, secret-dump kinds, attention budget, LKG invent, cost log strings, anti-replay).

### 3.4 SelfCheck ethics option (ISS-15 polish)

Replaced ER/parentesco distractor with `network=open` anti-pattern aligned to S49 sandbox teaching.

### 3.5 Unchanged on purpose

- Graded strings and action tokens stable.
- Intentional starter defects preserved.
- No Red Andina ethics boilerplate tails.
- Platform id `data-contracts` not renamed.

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue confirmation

| ID | Resolved? | Evidence |
|----|-----------|----------|
| ISS-01 | **Yes** | jobRelevance promotes agent only when it **beats** baseline under plan/budgets |
| ISS-02 | **Yes** | Zero path V3 / Id legacy in learner copy |
| ISS-03 | **Yes** | Zero CASO-LIM-049 |
| ISS-04 | **Yes** | Unique mechanism prose + unique callouts; no Contrato operativo / Contrato local clone |
| ISS-05 | **Yes** | Mechanism iDo (not label printers) |
| ISS-06 | **Yes** | E1 build + E2 assess helper + E3 decide helper; diversified feedback |
| ISS-07 | **Yes** | adverso: edgeCases |
| ISS-08 | **Yes** | Headings + full outcomes |
| ISS-09 | **Yes** | Grammar + portfolio skeleton |
| ISS-10 | **Yes** | No product iDo/weDo jargon in theory map |
| ISS-11 | **Yes** | Theory code computes concepts |
| ISS-12 | **Yes** | Context-engineering Anthropic resource present |
| ISS-13 | **Deferred** | Hash freeze intentional |
| ISS-14 | **Yes** | Dictionary cost_pen + action tokens |
| ISS-15 | **Yes** | 7 selfCheck incl. T3/T4; ethics option S49-aligned |
| ISS-16 | **Yes** | Map learner-facing |

### 4.2 Meta-leak re-scan

| Family | Status |
|--------|--------|
| M1 legacy in jobRelevance | **Cleared** |
| M2 V3/legacy in map | **Cleared** |
| M3 CASO-LIM ×24 | **Cleared** |
| M4 iDo/weDo defecto agentic | **Cleared** |
| M5 tabular_contracts_only_topic | **Retained (intentional)** |

Grep confirmation (post-edit): no matches for `CASO-LIM`, `path V3`, `Id legacy`, `defecto agentic`, `Contrato operativo`, `Contrato local`, `explica qué campo cambió`, `no supera baseline`.

### 4.3 Executable smoke (this pass)

All eight E3 solution snippets executed with `assert` paths:

| Exercise | Result |
|----------|--------|
| S49-T1-A-E3 | OK → `CONTINUE KEEP_DETERMINISTIC_WORKFLOW RUN_AGENT_BASELINE` |
| S49-T1-B-E3 | OK → `CONTINUE STOP_AGENT_LOOP REPLAN_WITH_BOUNDS` |
| S49-T2-A-E3 | OK → `CONTINUE DISABLE_OVERBROAD_TOOL SPLIT_TOOL_CONTRACT` |
| S49-T2-B-E3 | OK → `CONTINUE DENY_TOOL_CALL CLASSIFY_TOOL_ERROR` |
| S49-T3-A-E3 | OK → `CONTINUE COMPACT_AND_CHECKPOINT RETRIEVE_MINIMUM_CONTEXT` |
| S49-T3-B-E3 | OK → `CONTINUE RESTORE_LAST_KNOWN_GOOD REVIEW_COMPACTION_LOSS` |
| S49-T4-A-E3 | OK → `CONTINUE STOP_BUDGET_EXHAUSTED ASK_FOR_SCOPE_REDUCTION` |
| S49-T4-B-E3 | OK → `CONTINUE SANDBOX_AND_STOP REQUEST_HUMAN_APPROVAL` |

TypeScript project check (`tsc --noEmit`) completed without errors.

### 4.4 Anti-aberration confirmation

- **No automated bulk content generation was used.**
- **No** blurb factories, paragraph loops, or template expanders.
- E3 helper wiring and feedback rewrites written individually per subtopic.
- Quality exceeds prior ~9.55 estimate via E3 transfer depth + callout freshness + feedback uniqueness.

### 4.5 score_after_estimate rationale (≥ 9.5)

| Dimension | Explorer (5.8) | After this pass |
|-----------|----------------|-----------------|
| Meta-leak / trust | Fail | Pass |
| Semantic promotion rule | P0 fail | Pass |
| Theory freshness | Clone shells | Unique mechanisms + unique callouts |
| I Do fidelity | Label print | Micro-systems |
| We Do transfer | Boolean invert only | E1 build → E2 assess helper → E3 decide helper |
| You Do | Checklist thin | Lab scaffold + 3 scenarios |
| Resources / quiz | Gaps | Context eng + T3/T4 + S49-aligned ethics |
| **Expert estimate** | **5.8** | **9.65** |

Residual structural debt that is **not** a learner-content defect: platform hash `data-contracts` (ISS-13).

---

## 5. Residual risks & recommendations (later sections / product)

1. **ISS-13:** Hash `data-contracts` vs title “Agentes…” remains a discoverability scar — product/redirect plan, not curriculum prose.
2. **Optional deeper lab:** A multi-step agent loop exercise beyond gate predicates could further raise interview transfer; not required for ≥9.5.
3. **20h estimate:** Credible if You Do is multi-file; schedule portfolio time in sessions 9–10.
4. **S50 dependency:** Gate language CP-N4-C must stay aligned with eval/red-team suite in S50.
5. **Do not** reintroduce ethics boilerplate tails or rename section id without platform plan.

---

## 6. Updated Graph Memory notes

```yaml
section: 49
id: data-contracts
title: Agentes, herramientas y context engineering
file: src/lib/course/sections/s49-data-contracts.ts
explorer_score: 5.8
fixer_score_after_estimate: 9.65
anti_aberration_ok: true
explorer_report_path: course-state/curriculum_hardening/audits/explorer_reports/S49_EXPLORER_REPORT.md
nodes:
  concepts:
    - workflow_vs_agent
    - planner_worker_evaluator
    - srp_tools
    - schema_permissions_idempotency
    - min_context_jit_checkpoint
    - memory_compaction_lkg
    - stopping_budgets
    - sandbox_human_approval
  domain_functions:
    - workflow_preferred
    - bounded_loop_ok
    - is_srp_tool
    - tool_call_ok
    - context_ok
    - compaction_ok
    - budget_ok
    - sandbox_ok
  edges:
    - S48_RAG -> S49_agents_tools: "extends retrieval with governed tool-use loops"
    - S49_agents_tools -> S50_evals: "CP-N4-C agent gates need eval suite"
    - S22_email_approval -> S49_HITL: "approval pattern continuity"
  quality_edges_closed:
    - jobRelevance_aligns_T1A_baseline_rule
    - starter_comments_match_CASO-AYA-049
    - theory_mechanisms_unique_per_subtopic
    - theory_callouts_unique_per_subtopic
    - iDo_worked_micro_mechanisms
    - weDo_E1_build_E2_assess_E3_decide_helper
    - feedback_de_templated
  meta_leaks: []
  case: CASO-AYA-049
  gate: CP-N4-C
  stack: stdlib_only_no_open_network
  residual_risk: "hash id data-contracts freeze; optional multi-step agent portfolio lab"
```

---

## 7. Files touched

| Path | Action |
|------|--------|
| `src/lib/course/sections/s49-data-contracts.ts` | Curriculum content only |
| `course-state/curriculum_hardening/audits/fixer_reports/S49_FIXER_REPORT.md` | This report |
| `course-state/curriculum_hardening/audits/fixer_reports/S49_FIXER_META.json` | Machine-readable meta |

---

Section 49 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
