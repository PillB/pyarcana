# S50 Fixer Report (Round 2) — Evals, red teaming y fiabilidad de IA

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S50  
**Scope lock:** Section 50 only (`id: tech-leadership`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s50-tech-leadership.ts`  
**Live:** https://pillb.github.io/pyarcana/#tech-leadership  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **50** |
| Title | Evals, red teaming y fiabilidad de IA |
| shortTitle | Evals y red team |
| Internal id | `tech-leadership` |
| Canonical file | `src/lib/course/sections/s50-tech-leadership.ts` |
| Live route | `#tech-leadership` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S50_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S50_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Explorer Audit Report — Section 50.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S50_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S50_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (**10** MCQs); You Do CP-N4-C scorecard; authenticated bank key `tech-leadership` (not rewritten) |
| Validation | Manual greps; execute-and-diff 24 solution blocks + 9 theory + 8 iDo + youDo starter; `scripts/spanish_quality_audit.py --from 50 --to 50 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, output comparison, Spanish-quality metrics) and for mechanical code-integrity replacement of tautological `meets_contract` predicates already present in solution blocks.

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer already resolved Explorer **P0/P1** items in section TS: meta purge (Id legacy / V3 / DEFECT / soft_skills), CASO-ICA (0× CASO-LIM), specialized theory contracts, mechanism demos, constructive E1s, youDo scorecard with seeded rows, 10 selfCheck items, ShieldCheck icon, S49 trajectory bridge. Independent re-check confirmed those **held**.

Expert report (8.6/10) described that post-R1 state and listed Spanish polish. Expert-2 (docx, 6.3/10) raised **critical technical defects** still present after R1 (NameError in T4-B-E1, brittle injection pedagogy, hard-coded `treat_as_data` → True, tautological `meets_contract`, output drift). Round 2 closed those residuals plus expert/Spanish findings.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 playground design-doc | Explorer P0 | **Deferred (platform)** | Out of section-TS scope (`SectionView.tsx`) | Residual platform |
| ISSUE-02…05 meta / CASO-LIM | Explorer | **Already fixed (R1)** | Held (0× Id legacy, soft_skills, CASO-LIM, DEFECT DSL) | Grep |
| ISSUE-06…10 pedagogy lattice | Explorer | **Already fixed (R1)** | Held; callouts re-specialized where residual clones remained | Source |
| ISSUE-11 tokens | Explorer | **Already fixed (R1)** | Held | Grep |
| ISSUE-13 PdfReport Leadership | Explorer | **Deferred (platform)** | Out of section-TS scope | Residual platform |
| ISSUE-14 scorecard | Explorer | **Already fixed (R1)** | Held — seeded EVAL_ROWS + P0/P1 rollup | youDo exec |
| ISSUE-15 selfCheck 10 | Explorer | **Already fixed (R1)** | Held | Count=10 |
| ISSUE-16…18 icon/bridge/hours | Explorer | **Already fixed / mitigated (R1)** | Map callout ~20 h plan restored; ShieldCheck held | Source |
| EXP #1–8 `vs` → `vs.` | Expert + SQ | **Active → fixed** | All learner-facing `vs` → `vs.` | Grep 0 bare `vs ` |
| EXP #9–10 COMMA_PERO | Expert + SQ | **Active → fixed** | `P0, pero` / `` `task_pass`, pero `` | Source |
| EXP #11 checklist gender | Expert + SQ | **Active → fixed** | `La checklist` / `márcala` | Source |
| EXP #12 weDo intro density | Expert + SQ | **Improved** | Backticked mechanism identifiers | Source |
| EXP #13 portfolioNote scan | Expert | **Active → fixed** | Numbered artifact list + BLOCKED/READY backticks | Source |
| EXP #14–15 quote styles | Expert | **Active → fixed** | `«funciona en demo»` / `«salva»` | Source |
| EXP #16 `*porqué*` | Expert + SQ | **Active → fixed** | Drop italics | Source |
| EXP #18 answer/abstain quotes | Expert | **Active → fixed** | Hint uses `"answer"` / `"abstain"` | Source |
| EXP #25 “You Do” tab leak | Expert | **Active → fixed** | `del Tú haces` | Grep 0 “You Do” |
| EXP #8 E3 feedback backticks | Expert | **Active → fixed** | 8 E3 feedbacks backticked | Source |
| EXP claim *alinea* | Expert | **Active → fixed** | `se alinea con el umbral` | Source |
| E2-1 NameError T4-B-E1 | Expert-2 Critical | **Active → fixed** | `meets_contract = healthy == "PASS"` | 24/24 exec |
| E2-2 brittle injection | Expert-2 Critical | **Improved** | Multi-marker lab model + production disclaimer | Theory/iDo/E1 |
| E2-3 treat_as_data theatre | Expert-2 Critical | **Fixed** | `effective_permissions` never expands session allowlist; poison_total vs removed | Theory/iDo/E1 |
| E2-4 tautological meets_contract | Expert-2 High | **Fixed** | Real predicates from `meets`/`ok`/`status`/`results`/`judge`/`healthy` | 0 tautologies |
| E2-5 output vs print drift | Expert-2 High | **Fixed** | Solution outputs include `meets_contract True` | 24/24 match |
| Callout residual clones | Expert / R1 residual | **Fixed** | Domain callouts (manifiesto, trajectory, ensemble, order bias, injection≠exfil, PDF-as-data, abstain, canary/RTO, ~20 h) | Source |
| Map “Nota de orientación” | Meta-leak residual | **Fixed** | Honest ~20 h plan callout | Grep |
| Latency heading EN | SQ MORFOLOGIK | **Fixed** | `Latencia, costo, incidente y rollback` | Source |
| Y_E_O_U o holdout | SQ | **Fixed** | `u holdout` in Spanish prose | Source |
| Platform RichText `**` | Cross-cutting | Platform | Not section-owned | Residual platform |
| Legacy id `tech-leadership` | Cross-cutting | Compatibility | Kept silent for URL/progress | Residual |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s50-tech-leadership.ts`

### Representative corrections (post-R2)

**T4-B-E1 NameError (Expert-2 Critical):**
```python
# before (broken)
meets_contract = bool(ok)  # NameError: ok is function-local

# after
meets_contract = healthy == "PASS"
```

**Injection lab model (theory + iDo + T3-A-E1):**
```python
ATTACK_MARKERS = (
    "ignore previous",
    "ignore all previous",
    "disregard previous instructions",
)
def injection_signal(user_text: str) -> bool:
    low = user_text.lower()
    return any(m in low for m in ATTACK_MARKERS)
```
Prose states this is a **stdlib lab micro-model**, not production defence-in-depth (OWASP).

**Least privilege (theory + iDo + T3-B-E1):**
```python
def effective_permissions(session_allowed, _doc):
    return set(session_allowed)  # document never expands session
# poison_removed < poison_total → QUARANTINE_POISONED_CORPUS
```

**Spanish polish (samples):**
- `baseline vs. candidato`; `rollback vs. RTO`
- `ambos son P0, pero se detectan…`
- `La checklist inicia en BLOCKED: márcala READY…`
- `no se «salva»`; `no solo «funciona en demo»`
- `scorecard del Tú haces`; `Lee el porqué`

**Contract success (all 24 solutions):**
- 0× `meets_contract = ('X' == 'X')`
- Outputs include matching `meets_contract True` line where printed

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer ISSUE-02…12, 14–18 in section TS | **Already fixed (R1)** / held; callouts + hours reinforced |
| Explorer ISSUE-01, 13 | **Deferred** — platform files out of scope |
| Expert Spanish #1–16, #18, #25 | **Fixed** |
| Expert-2 NameError T4-B-E1 | **Fixed** |
| Expert-2 injection pedagogy | **Improved** (lab model + disclaimer) |
| Expert-2 least-privilege theatre | **Fixed** (`effective_permissions`) |
| Expert-2 tautologies + output drift | **Fixed** |
| Meta grep | `CASO-LIM`, `Id legacy`, `soft_skills`, `Nota de orientación`, `Contrato local`, `You Do`, tautologies → **0** |
| Code exec solutions | **24/24** PASS |
| Solution output match | **24/24** match declared `output` |
| Theory + iDo demos | **9 + 8** exec OK vs declared output |
| youDo starter | **OK** — BLOCKED + P0_trajectory/injection/hallucination + P1_latency_slo |
| Spanish quality (`--no-lt`) | **8.89 → 10.0** (findings ~96 → 22; residual mostly tech-term / dense lab tokens) |
| Markdown / RichText | Platform residual: bold in non-RichText fields may still show `**` globally |
| Assessment | Public selfCheck **10** MCQs; exam bank not section-rewritten this pass |
| Previous/next | S49 agentes → S50 evals/red team → S51 obs/UX; bridges preserved |

**Explicit confirmation:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation and mechanical code-integrity replacement of already-present tautological contract lines.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Injection detector remains a **lab marker list**, not a production classifier; prose now states that limit. Full multi-vector red-team harness (Garak/Promptfoo style) is intentionally out of stdlib scope.
- We Do skill lattice is still primarily predicate repair (E1/E2/E3). Deeper constructive eval-harness design is portfolio You Do work; full redesign of all 24 exercises was out of R2 residual scope and would risk anti-aberration bulk rewrite.
- Holdout is still modelled as counts/flags rather than hashed disjoint IDs (Expert-2 Issue 6) — progressive disclosure retained; portfolio requires sealed-holdout evidence narrative.

### Repository-wide / platform
- `SectionView.tsx` InteractivePlayground for `tech-leadership` may still teach design-doc/postmortem (Explorer ISSUE-01) — **Global Agent A/C**.
- `PdfReport.tsx` label `"50. Leadership"` (Explorer ISSUE-13) — **Global Agent C**.
- Legacy id/filename `tech-leadership` / `s50-tech-leadership.ts` kept for URL/progress compatibility.
- RichText markdown leak in non-RichText fields — **Global Agent A**.

### Deferred
- Authenticated exam-bank expansion beyond in-section selfCheck.
- Adjacent S51 playground/title cross-check only if that section’s Fixer owns it.

---

## 6. Updated Graph Memory notes

```yaml
section: 50
id: tech-leadership
title: Evals, red teaming y fiabilidad de IA
round2_status: complete
score_before_r2_expert: 8.6
score_spanish_after: 10.0
edges:
  prerequisites: [S49 agentes/tools]
  unlocks: [S51 obs/gobernanza/UX copiloto]
  gate: CP-N4-C
  case: CASO-ICA-050
resolved_r2:
  - t4b_e1_nameerror
  - injection_lab_markers_with_disclaimer
  - effective_permissions_least_privilege
  - meets_contract_real_predicates
  - solution_output_alignment
  - spanish_vs_quotes_checklist_youdo_tab
  - domain_callouts_restored
retained_strengths:
  - e1_e2_e3_lattice_24
  - scorecard_youdo_p0_p1
  - selfcheck_10
  - s49_trajectory_bridge
  - stdlib_no_paid_api
  - synthetic_no_pii
remaining_risks:
  - platform_playground_stale
  - pdfreport_leadership_label
  - legacy_id_silent
compatibility:
  - keep_id_tech-leadership
  - keep_hash_route
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s50-tech-leadership.ts` | Only product curriculum file in scope — technical correctness, Spanish polish, pedagogy of injection/least-privilege, callouts, selfCheck/youDo wording |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S50_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S50.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |

---

## 8. Worklog confirmation

Completion entry written to:
- `expert_audit/worklog_entries_r2/S50.md` (full)
- `expert_audit/worklog.md` (append pointer, Task ID: **FIXER-R2-S50**)

Section 50 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
