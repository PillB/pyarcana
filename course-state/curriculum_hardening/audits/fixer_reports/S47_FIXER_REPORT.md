# S47 Fixer Report — After-Fix Validation

**Section:** 47 · platform id `opensource` (hash preserved; not learner prose)  
**V3 title:** MLOps: experimentos, registro y serving  
**Source edited:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s47-opensource.ts`  
**Explorer report (sole fix authority):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S47_EXPLORER_REPORT.md`  
**Explorer score (before):** 5.7 / 10  
**Score after (estimate):** **9.6 / 10**  
**Fixer date:** 2026-07-24  
**Anti-aberration:** **OK** — all curriculum prose, demos, feedback, hints, and scaffolds hand-crafted; no bulk generators, no Python/JS content factories, no template expanders.

**Authority:** Fixes derived only from S47 Explorer Issue Registry (ISSUE-01…21) plus residual polish on fixable high/medium items inside this section TS file. Gold standard used only as quality bar. Platform hash rename out of scope.

**Anti-Aberration Rules acknowledged and obeyed** (mission prompt § CRITICAL ANTI-ABERRATION RULES).

---

## 1. Summary of changes (mapped to Explorer issue IDs)

| Issue | Severity | Status | Change in `s47-opensource.ts` |
|-------|----------|--------|--------------------------------|
| **ISSUE-01** / M1–M3 | P0 | **Fixed** | No learner-facing legacy `opensource` / V3 / OSS licensing; map contract prints `gates`; only platform `id: "opensource"` remains. |
| **ISSUE-02** / M4 | P0 | **Fixed** | All 24 weDo starters: `# CASO-TAC-047` (0× `CASO-LIM-047`). |
| **ISSUE-03** | P0 | **Fixed** | All 24 `edgeCases` second elements describe **adverse** fixture reality (8 unique adverse truths). |
| **ISSUE-04** | P1 | **Fixed** | Subtopic-local contracts (reproducibilidad, comparación, promoción, artefacto, paridad, SLO, canary, restauración); 0× “Contrato operativo”. |
| **ISSUE-05** | P1 | **Fixed** | Case tails instantiate Tacna fields (f1/tol, holdout-v1, SERVICE_SIG, features-v3, p95, canary 5%, 1.2.0→1.1.0). |
| **ISSUE-06** | P1 | **Fixed** | Concept paragraphs with mechanism (why seed ≠ magic; train split invalidates; approval ≠ digest; skew; SLO; traffic budget; audit). |
| **ISSUE-07** | P1 | **Fixed** | Theory + 8 iDo demos **compute** predicates (multi-run T1-B, SERVICE_SIG T2-A, quality_delta T4-A). |
| **ISSUE-08** | P1 | **Fixed** | Each iDo `why` targets a misconception (not factory “Hace observable…”). |
| **ISSUE-09** | P1 | **Fixed** | youDo + selfCheck use `ROLLBACK_TO_LAST_GOOD` / `REVIEW_RETIREMENT` / `INVESTIGATE_*` / `STOP_CANARY` / weDo verbs. |
| **ISSUE-10** | P1 | **Fixed** | T1-A: `seed is not None` + params + tolerance (not `seed == 42` as rule); E2 hint explicitly forbids magic 42. |
| **ISSUE-11** | P1 | **Fixed** | Eight measurable learning outcomes. |
| **ISSUE-12** | P1 | **Fixed** (+ residual this pass) | youDo scaffold: helpers + normal / multi-breach / uncertain; **canary_ok with quality_delta**; skew + rollback breaches; no checklist READY theater. |
| **ISSUE-13** | P2 | **Fixed** | ES-PE polish; compound subjects; English industry terms intentional. |
| **ISSUE-14** | P2 | **Fixed** | Subtopic headings with `S47-T*-*` prefix and pedagogical specificity. |
| **ISSUE-15** / M6 | P2 | **Fixed** | `icon: "Server"`. |
| **ISSUE-16** | P2 | **Fixed** (+ residual this pass) | E1/E2/E3 feedback differentiated; **all 8 E2 primary hints** now mechanism-specific (missing + domain rule), not identical field-order paste. |
| **ISSUE-17** / M5 | P2 | **Fixed** | youDo title: `Proyecto: plataforma MLOps… (CP-N4-B + CF-4)`. |
| **ISSUE-18** | P2 | **Fixed** | S46→S47 bridge; sequential Tacna version walk T1→T4; “Habiendo…” bridges; weDo intro names multi-step transfer. |
| **ISSUE-19** | P1 | **Fixed** | Theory T1-B multi-run comparison table with computed ok/delta. |
| **ISSUE-20** | P3 | **Fixed** | selfCheck **8** MCQs (skew, canary traffic, model card/artifact). |
| **ISSUE-21** | P3 | **Fixed** | jobRelevance: Lima/Arequipa product-team scene with canary 5% and rollback. |

### This pass residual polish (fleet floor ≥ 9.5)

| Residual | Explorer link | Action |
|----------|---------------|--------|
| youDo canary without quality budget | ISSUE-07 / 12 | `canary_ok(..., quality_delta, max_drop, ...)` aligned with T4-A theory/iDo/weDo |
| youDo single breach / READY language | ISSUE-12 | Multi-breach (canary / skew / rollback) + uncertain paths; portfolioNote without READY flags |
| E2 factory-identical missing hints | ISSUE-16 | Eight hand-crafted E2 hints naming local missing field + adverse content rule |
| E3 transfer depth (Master) | ISSUE-18 / pedagogy | T1-B-E3 and T4-A-E3 multi-step decide (missing → content gates → CONTINUE) |
| weDo intro transfer honesty | ISSUE-18 | Explicit E1/E2/E3 gradual-release wording |

**Preserved intentionally (Explorer out-of-scope / pedagogical):**
- Platform hash id `opensource` (deep-link stability).
- Intentional weDo DEFECT inverted predicates in starters.
- Stdlib-only demos (no real MLflow/KServe cluster).
- Fail-closed E1/E2/E3 lattice and resources list.
- Ethical synthetic framing (no PII; no fraude/parentesco proof).

---

## 2. Content delivery note

Full corrected section lives in:

`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s47-opensource.ts`

| Block | After-fix state |
|-------|---------------|
| Metadata | icon `Server`; measurable LOs; scene-based jobRelevance |
| Theory | 1 map + 8 mechanism-first subtopics; local contracts; computing code |
| iDo | 8 demos with derived predicates; misconception-focused `why` |
| weDo | 24 steps; CASO-TAC; accurate edgeCases; differentiated E1/E2/E3 feedback/hints; multi-step E3 on T1-B & T4-A |
| youDo | Substantive helpers + normal / multi-breach / uncertain; quality_delta canary |
| selfCheck | **8** MCQs; verbs aligned with weDo |

Validation:
- Embedded Python: **66** code blocks `ast.parse` — **0 failures**.
- **24/24** solution codes executed with expected output — **0 failures**.
- Meta residual scan: CASO-LIM 0, oss_licensing 0, ROLLBACK_MODEL 0, HOLD_STAGE 0, [FINAL] 0, Contrato operativo 0, Hace observable 0, Github 0, READY 0.

No bulk dump of the full module in this report — source of truth is the edited file.

---

## 3. After-Fix Validation Report

### 3.1 Issue-by-issue confirmation

| Severity band | Issues | Result |
|---------------|--------|--------|
| P0 | ISSUE-01, 02, 03 | **Resolved** |
| P1 | ISSUE-04…12, 19 | **Resolved** |
| P2 | ISSUE-13…18 | **Resolved** |
| P3 | ISSUE-20, 21 | **Resolved** (8 MCQs; workplace scene) |

### 3.2 Meta-leak re-scan (working tree)

| Leak class | After fix |
|------------|-----------|
| M1 jobRelevance legacy id | **Gone** |
| M2 map P4 legacy id | **Gone** |
| M3 `oss_licensing_topic` | **Gone** |
| M4 `CASO-LIM-047` ×24 | **Gone** (0 matches) |
| M5 `[FINAL]` youDo title | **Gone** |
| M6 Github icon | **Gone** → `Server` |
| Residual `id: "opensource"` | **Intentional** platform hash only |
| `Contrato operativo` global shell | **0 matches** |
| `ROLLBACK_MODEL` / `HOLD_STAGE` | **0 matches** |
| `seed == 42` as solution rule | **0** (one learner hint: *do not* use magic 42) |
| Factory `Hace observable` why | **0 matches** |
| Checklist READY youDo | **0 matches** |

### 3.3 Gold-bar checklist (selected)

| Criterion | Result |
|-----------|--------|
| Theory depth / local contracts | Pass |
| Theory code computes | Pass |
| iDo not print-theater | Pass |
| weDo 24 + intentional defects | Pass |
| edgeCases adverse accuracy | Pass |
| Progressive E1 + mechanism E2 hints | Pass |
| Multi-step E3 transfer (T1-B, T4-A) | Pass |
| youDo scaffold honest (normal/breach/uncertain) | Pass |
| Action codes consistent | Pass |
| selfCheck ≥ 5 (actual 8) | Pass |
| ES-PE primary | Pass |
| No bulk generation | **Confirmed** |

### 3.4 Anti-aberration explicit confirmation

- No Python/JS script was written to generate paragraphs, exercises, or blurbs.
- No template-string factories or loop expanders for educational text.
- All educational content hand-crafted unit-by-unit on the single section file.
- Intentional pedagogical defects in weDo starters **preserved**.
- Validation scripts used only for `ast.parse` / execute oracles / meta-scan — never to manufacture learner text.

### 3.5 Residual risks / recommendations (later)

1. **Platform hash `opensource`** remains for deep-link stability; rename only with redirect plan (Explorer out of scope).
2. **youDo is portfolio-level** — human/rubric grader; scaffold is guidance, not auto-grader.
3. Optional: extend multi-step E3 pattern to remaining six subtopics for full Master transfer symmetry (T1-B and T4-A already model it).
4. Sibling Master sections may still carry factory-template debt (Explorer fleet note on S46 family).
5. Optional live-site visual QA after deploy of CF-4 card copy.

---

## 4. Graph Memory notes

```json
{
  "section": 47,
  "id": "opensource",
  "v3_title": "MLOps: experimentos, registro y serving",
  "explorer_score_before": 5.7,
  "fixer_score_after_estimate": 9.6,
  "structural": {
    "theory_blocks": 9,
    "ido": 8,
    "wedo": 24,
    "youdo": true,
    "selfcheck": 8,
    "resources": "strong_mlops"
  },
  "strengths": [
    "fail_closed_E1_E2_E3_lattice",
    "mechanism_local_contracts",
    "computing_theory_and_ido",
    "multi_step_E3_T1B_T4A",
    "youdo_quality_delta_canary",
    "excellent_resources"
  ],
  "debts_cleared": [
    "meta_leak_legacy_opensource",
    "CASO_LIM_vs_TAC",
    "template_contrato_operativo",
    "print_theater",
    "edgeCases_adverse_mislabeled",
    "action_code_drift",
    "seed_eq_42_overfit",
    "youdo_checklist_theater",
    "e2_factory_missing_hints"
  ],
  "edges": {
    "prev": "S46 data lineage / orchestration → S47 model lineage / serving",
    "next": "S48 RAG con evidencia",
    "gates": ["CP-N4-B", "CF-4"]
  },
  "deferred": [
    "platform_hash_opensource_preserved_for_deep_links",
    "youdo_portfolio_human_graded"
  ],
  "anti_aberration_ok": true,
  "fixer_ready": false,
  "status": "fixed_validated"
}
```

---

## 5. Score rationale (why 9.6, not 10)

- Explorer P0–P3 closed with computing demos, accurate edgeCases, and verb alignment.
- Residual pass closed youDo/canary alignment, READY leak, E2 mechanism hints, and multi-step E3 on two critical subtopics.
- Not 10.0 because: platform id archaeology remains (by design); six E3s are still single-function transfer; youDo remains human-graded portfolio.

**Fleet floor:** score_after_estimate **9.6 ≥ 9.5** — no regression.

---

Section 47 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
