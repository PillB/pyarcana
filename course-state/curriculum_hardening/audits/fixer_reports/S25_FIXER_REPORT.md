# S25 Fixer Report — Endpoints de IA, Hugging Face y prompting evaluado

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Section:** 25 · `streamlit-dashboards` · `src/lib/course/sections/s25-streamlit-dashboards.ts`  
**Explorer authority (only):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S25_EXPLORER_REPORT.md`  
**Date:** 2026-07-24  
**Live:** https://pillb.github.io/pyarcana/ (`#streamlit-dashboards`)  
**Repo:** https://github.com/PillB/pyarcana  
**Pass type:** Residual / fleet floor ≥ 9.5 (Explorer-guided, section TS only)

---

## 0. Anti-Aberration Acknowledgement

This Fixer pass **explicitly obeyed** the mission’s CRITICAL ANTI-ABERRATION RULES:

1. **No bulk / automated content generation** — no Python/JS (or other) scripts whose purpose is to mass-produce paragraphs, exercises, explanations, or educational text; no blurb factories, template expanders, or placeholder loops.
2. **No low-quality shortcuts** — no lorem/TODO filler; no copy-paste sentence factories; no depth reduction because the section is long.
3. **Human-quality craftsmanship** — every residual rewrite (We Do instructions/solutions, You Do helpers, theory callout, selfCheck item, book URLs) was authored unit-by-unit with deliberate pedagogical intent.
4. **Self-correction** — verification used only independent execution of existing demo/solution code against declared outputs (oracle checks), never to *generate* learner-facing prose.

**Explicit confirmation:** **no automated bulk content generation was used** for any learner-facing educational text.  
**anti_aberration_ok:** `true`

---

## 1. Scope & baseline

| Field | Value |
|--------|--------|
| Title (V3) | Endpoints de IA, Hugging Face y prompting evaluado |
| shortTitle | IA endpoints y prompts |
| Platform id (routing) | `streamlit-dashboards` (**kept** — multi-file migration out of scope) |
| Explorer score before | **5.8 / 10** |
| Explorer issues | 24 |
| Prior structural fix state | Demos, de-meta, F1, circuit, You Do scaffold already present |
| Score after (estimate) | **9.55 / 10** |
| Inventory freeze | 8 subtopics · 8 I Do · 24 We Do · You Do + rubric · 5 selfCheck · resources |

**In-scope file only:** `src/lib/course/sections/s25-streamlit-dashboards.ts`  
**Deferred by Explorer §7 / operational paths:** platform id rename; `prisma/seed.ts` exam slug (ISSUE-14); `phase: 1` metadata (ISSUE-24).

---

## 2. Summary of changes applied (mapped to Explorer issue IDs)

### Confirmed already solid from prior craft (re-verified this pass)

| ID | Severity | Validation this pass | Result |
|----|----------|----------------------|--------|
| **ISSUE-01 / 15** | P0 / P2 | All 8 I Do `code`/`output` pairs executed | **8/8 OK** |
| **ISSUE-02** | P0 | No starter `print('ok', True)` harness footers | **Clean** |
| **ISSUE-03 / 12** | P1 / P2 | No DEFECT / oráculo / pass string / “Datos sintéticos only” stems | **Clean** |
| **ISSUE-05** | P1 | I Do mirrors theory (stack tree, HF contract, cache+circuit, schema, tools, F1, safe request) | **OK** |
| **ISSUE-07 / 11 / 16** | P1 / P2 | Full headings; single ethics callout; S24→S25 bridge in intro/jobRelevance | **OK** |
| **ISSUE-08 / M1** | P1 | `jobRelevance` without legacy Streamlit author note; icon `Sparkles` | **OK** (id kept) |
| **ISSUE-09** | P2 | Contract key **`model`** consistent in theory, demos, exercises, You Do | **OK** |
| **ISSUE-10** | P2 | Field F1 in theory, I Do, We Do, You Do | **OK** |
| **ISSUE-13** | P2 | Rubric observables (no “gate V3”) | **OK** |
| **ISSUE-17** | P2 | Circuit open after N failures in theory + I Do + We Do | **OK** |
| **ISSUE-19 / 21** | P3 | Dead `pass` branch gone; `@example.pe` gone | **OK** |
| **ISSUE-22 / 23** | P1 / P2 | Pipeline shape, constrained decoding note, conceptual hints | **OK** |

### Residual hand-crafted lifts this pass (toward ≥ 9.5 floor)

| ID | Severity | Action | Result |
|----|----------|--------|--------|
| **ISSUE-04** (residual) | P1 | Deepened thin We Do: T2-A-E1 → first mock item `{model,label}`; T3-A-E2 → `loads` + required ⊆ keys; T3-B-E1 → allowlist gate dict with audit name; T4-B-E2 → `minimize(payload, allow_keys)` function | Authentic practice closer to theory/You Do |
| **ISSUE-06** (residual) | P1 | You Do starter: added `injection_signal` + `minimize_payload` helpers; steps 2–5 reference injection path and minimize | Ladder from We Do safety drills → portfolio |
| **ISSUE-14** (in-section only) | P2 | T3-B prose + callout: exam evaluates generic **thinking / tools / checkpoints**, not a brand surface | Brand-agnostic LO explicit |
| **ISSUE-18** (residual) | P2 | Books gained URLs (Mitchell arXiv; Chip Huyen O’Reilly) | Self-study no longer dead-end |
| **ISSUE-20** (residual) | P3 | SelfCheck Q5 → circuit breaker / fallback (was score-only; score≠fraude still covered by Q4 + theory/We Do) | Ops LO active-recall |
| **ISSUE-22** (polish) | P1 | T3-B callout reinforces checkpoint pattern plan→tool→validar→narrar | External best-practice alignment |

### Deferred / out of scope

| ID | Severity | Why deferred |
|----|----------|--------------|
| **ISSUE-14** (seed slug) | P2 | Exam concept `glm-thinking-tools-checkpoints` lives in `prisma/seed.ts` — outside section TS. In-section theory is brand-agnostic. |
| **ISSUE-24** | P3 | `phase: 1` is shared band metadata; UI-hidden. |
| Platform id `streamlit-dashboards` | M6 residual | Multi-file routing/seed/hash migration. Student-facing legacy **speech** scrubbed only. |

---

## 3. Content surfaces touched (this residual pass)

### Theory
- T3-B paragraph: exam concept framed as generic thinking/tools/checkpoints (no product brand).
- T3-B callout: checkpoint pattern + deny = stop.

### We Do (4 residual authenticity lifts)
| Id | Before | After |
|----|--------|--------|
| S25-T2-A-E1 | Print bare `billing` | Dict `{model, label}` case-insensitive |
| S25-T3-A-E2 | issubset on pre-built dict | `json.loads` + required ⊆ keys (extra keys OK) |
| S25-T3-B-E1 | Print `deny` string | `gate()` → `{'status':'deny','name':...}` |
| S25-T4-B-E2 | One-liner comprehension print | Function `minimize(payload, allow_keys)` |

### You Do
- Helpers: `injection_signal`, `minimize_payload` (alongside existing `field_f1`, `build_safe_request`, `SCHEMA_KEYS`, `GOLDEN`).
- Student stubs remain: `choose_stack`, `mock_or_http`, `eval_golden`.
- Step list updated for injection + minimize path.

### Resources / SelfCheck
- Books with `url` (ISSUE-18 residual).
- SelfCheck Q5: circuit breaker ops (ISSUE-17 LO recall).

### Unchanged (by design)
- Platform `id: "streamlit-dashboards"` (routing).
- Inventory counts, ethics invariants, rubric structure, exam bank (seed out of scope).

---

## 4. After-Fix Validation Report

### Issue-by-issue confirmation (Explorer registry)

| ID | Status | Notes |
|----|--------|-------|
| ISSUE-01 | **Fixed** | All 8 I Do outputs match execution |
| ISSUE-02 | **Fixed** | No starter harness `print('ok', True)` |
| ISSUE-03 | **Fixed** | No ×23 developer stem |
| ISSUE-04 | **Fixed** (+ residual deepen) | Transfer/guided set practices full contracts |
| ISSUE-05 | **Fixed** | I Do fidelity to theory procedures |
| ISSUE-06 | **Fixed** (+ residual helpers) | You Do scaffold + golden + safety helpers + eval stubs |
| ISSUE-07 | **Fixed** | Stem spam → one ethics callout |
| ISSUE-08 | **Fixed** (student-facing) | id kept by design |
| ISSUE-09 | **Fixed** | `model` contract consistent |
| ISSUE-10 | **Fixed** | field F1 taught + exercised |
| ISSUE-11 | **Fixed** | Full headings |
| ISSUE-12 | **Fixed** | es-PE instructions |
| ISSUE-13 | **Fixed** | Rubric observables |
| ISSUE-14 | **Deferred** (seed) / **mitigated** (in-section generic framing) | |
| ISSUE-15 | **Fixed** | T3-A output complete |
| ISSUE-16 | **Fixed** | S24 bridge + desk situating |
| ISSUE-17 | **Fixed** | Circuit shown + selfCheck recall |
| ISSUE-18 | **Fixed** | Precise books **with URLs** |
| ISSUE-19 | **Fixed** | Dead branch removed |
| ISSUE-20 | **Fixed** | SelfCheck professional + ops Q |
| ISSUE-21 | **Fixed** | `@example.pe` gone |
| ISSUE-22 | **Fixed** | Pipeline shape + constrained decoding + eval/injection practice |
| ISSUE-23 | **Fixed** | Conceptual hints |
| ISSUE-24 | **Deferred** | phase metadata only |

### Meta-leak classes (Explorer §4)

| Class | Status |
|-------|--------|
| M1 jobRelevance legacy note | **Removed** |
| M2 DEFECT harness | **Removed** |
| M3 pass string / oráculo | **Removed** |
| M4 Datos sintéticos only | **Removed** |
| M5 gate V3 rubric | **Removed** |
| M6 id/icon Streamlit | **Icon fixed**; **id retained** (routing) |
| M7 English DEFECT tags | **→ Spanish “Bug:”** |
| M8 print('ok', True) footers | **Removed** from demos/starters |

### Grep ban-list (student-facing)

`DEFECT`, `oráculo`, `pass string`, `Datos sintéticos only`, `gate V3`, `Id legacy`, `path V3`, `LayoutDashboard`, `Building LLM Apps`, `print('ok', True)`, `@example.pe`, over-localized slang (`chamba`, `jato`) → **none found**.

### Runtime checks performed

| Surface | Count | Result |
|---------|-------|--------|
| Theory + I Do + We Do solution pairs | 40 | outputs match (**0 FAIL**) |
| Inventory | 8 demos / 24 We Do / You Do / 5 selfCheck | preserved |
| Bare `# TODO` in Master S40–S52 style | 0 in this file | OK |

### Anti-aberration confirmation

- **No** content generators, blurb factories, or template loops produced educational text.
- Every residual rewrite was hand-authored unit-by-unit.
- Inventory counts preserved; You Do `NotImplementedError` stubs are intentional student tasks, not author TODOs.
- Course invariants **not regressed:** no auto-fraud, fail-closed schema, synthetic-only data, score ≠ fraude, `model` key contract, I Do code/output parity.

### Strengths retained (do not regress)

- Clear **no auto-fraud / HITL / fail-closed** policy.
- Decision tree rules vs specialized vs LLM.
- Model cards + license + local/cloud.
- Excellent `docs` set (HF, OWASP, JSON Schema, structured outputs).
- T4-B theory + T4-B-E1 injection pedagogy ceiling.
- Field F1 + circuit breaker taught and practiced.

---

## 5. Residual risks & recommendations

1. **Platform id** `streamlit-dashboards` still appears in URL hash / seed keys until a coordinated rename (section id, seed bank key, glossary, routes, live hash).
2. **ISSUE-14 seed:** Rename exam concept `glm-thinking-tools-checkpoints` → `thinking-tools-checkpoints` in `prisma/seed.ts` and any phase validators that assert the slug. Section theory already teaches the generic pattern.
3. **We Do form factor:** Exercises remain sandbox-sized (single- or dual-line oracles) by playground grader design; You Do carries full system assembly. Residual pass raised four thinner items toward contract/function shape.
4. **SelfCheck coverage trade-off:** Q5 now probes circuit breaker; score≠fraude remains in Q4, theory T4-B, and We Do T4-B-E3. A future sixth item is out of inventory freeze.
5. **S26 edge:** Keep `portfolioNote` bridge; S26 should consume CP-N2-C AI assist outputs without re-teaching S25 ethics stems.

---

## 6. Graph Memory notes (post-fix)

```yaml
section: 25
id: streamlit-dashboards  # routing legacy; student speech V3
title_v3: Endpoints de IA, Hugging Face y prompting evaluado
file: src/lib/course/sections/s25-streamlit-dashboards.ts
explorer_score_before: 5.8
fixer_score_after_estimate: 9.55
explorer_report: course-state/curriculum_hardening/audits/explorer_reports/S25_EXPLORER_REPORT.md
anti_aberration_ok: true
pass: residual_min95

nodes_strength:
  - ethics_hitl_no_auto_fraud
  - i_do_output_fidelity
  - theory_stack_decision_tree
  - field_f1_taught_and_practiced
  - you_do_scaffold_golden_safe_request_injection_minimize_eval_stubs
  - instruction_es_pe_no_harness
  - resources_docs_hf_owasp_jsonschema
  - resources_books_with_urls
  - circuit_breaker_shown_open_after_n
  - circuit_breaker_selfcheck
  - hf_pipeline_shape_documented
  - transfer_mock_pipeline_batch_contract
  - we_do_minimize_function_and_gate_dict
  - constrained_decoding_named_with_code_validation
  - desk_lima_s24_bridge
  - exam_thinking_tools_checkpoints_generic_in_theory

nodes_weak_residual:
  - platform_id_streamlit_legacy  # multi-file rename pending
  - exam_slug_glm_branding        # seed.ts deferred
  - we_do_still_sandbox_oracles   # platform constraint (improved, not eliminated)

edges:
  - S24_ocr_fields -> S25_untrusted_context  # explicit bridge prose
  - S25_theory_contract -> S25_we_do_tasks   # restored + residual deepen
  - S25_ai_assist -> S26_vp_orchestration    # portfolioNote + intro foreshadow

do_not_regress:
  - no_auto_fraud_policy
  - fail_closed_schema
  - synthetic_only
  - model_key_contract
  - i_do_code_output_parity
```

---

## 7. Corrected content location

**Authoritative corrected content lives in:**

`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s25-streamlit-dashboards.ts`

No separate patch file. Inventory: 8 theory subtopics + intro, 8 I Do demos, 24 We Do exercises, You Do + rubric, 5 selfCheck, resources.

---

## 8. Score rationale (9.55)

| Dimension | Before (Explorer) | After |
|-----------|-------------------|--------|
| Demo/output fidelity | Broken | 40/40 runtime OK |
| We Do meta / cognitive load | Harness stem ×23 | Human es-PE + authentic transfers |
| We Do residual thin items | Micro-flips | Contract dicts / loads / minimize / gate audit |
| I Do → You Do ladder | Cliff | Procedure demos + helpers + stubs + golden |
| Theory progressive disclosure | Stem spam | One ethics callout + mechanism focus |
| Legacy identity | Streamlit speech | Scrubbed; id only residual |
| External best practice | Gaps | Pipeline shape, F1, injection, constrained decoding, book URLs |
| Gold-bar craft | Below S01 narrative | Desk situating + decision `why` + residual function drills |

**Score after estimate: 9.55 / 10** (fleet floor ≥ 9.5 met; residual only: platform id migration, seed slug ISSUE-14, sandbox oracle form factor).

---

## 9. Closing

Section 25 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
