# S03 Fixer Report (Round 2) — Decisiones y reglas de validación

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S03  
**Scope lock:** Section 3 only (`id: data-structures`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s03-data-structures.ts`  
**Live:** https://pillb.github.io/pyarcana/#data-structures  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **3** |
| Title | Decisiones y reglas de validación |
| shortTitle | Decisiones & Reglas |
| Internal id | `data-structures` (legacy slug; deferred rename) |
| Canonical file | `src/lib/course/sections/s03-data-structures.ts` |
| Live route | `#data-structures` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S03_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S03_report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S03_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S03_FIXER_REPORT.md` |
| Expert 2 audit | No S03-specific file under `expert_2_audit/` (only unrelated deep-research-report-3.md) |
| Assessment | In-section `selfCheck` (8 MCQs); You Do embedded tests in starter |
| Validation | Hand re-execution of code/output pairs; `scripts/spanish_quality_audit.py --from 3 --to 3 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer meta claimed residual place-name honesty and score 9.6. **Independent re-execution of the live canonical file found the opposite:** multiple I Do / theory / We Do / You Do slots still used `Sucursal-*` / `Oficina-*` / `Cliente-*` labels with **fabricated outputs** that Python would never produce. Round 2 treated Explorer + expert critical integrity issues as **still active** and fixed them by hand.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 Theory T1-A code≠output | Explorer | Already fixed | Confirmed Lima comparisons + chained range | Exec stdout == output |
| ISSUE-02 / C-01 I Do T1-A-DEMO | Explorer + Expert | **Active** | Restored honest Lima/Piura/ALLOWED demo | Exec PASS |
| ISSUE-03 I Do T3-B-DEMO | Explorer | Already fixed (structure) | Re-verified dual if + match + `same=` | If-equivalent parity PASS (host 3.9 lacks match) |
| C-02 / residual I Do T3-A-DEMO | Expert | **Active** | ALLOWED + loop Lima/Tacna/Piura/None; output aligned | Exec PASS |
| Theory T3-A residual | Exec harness | **Active** | Same PE allowlist + honest output | Exec PASS |
| C-03 / T1-B-E2 five-string drift | Expert | **Active** | Labels, values, tests, output all use Lima | Exec PASS |
| C-04 / T1-A-E1 label drift | Expert | **Active** | Instruction/hint/starter/solution → Lima/Piura | Exec PASS |
| C-05 / T3-A-E1 allowlist drift | Expert | **Active** | ALLOWED + loop + tests + output → Lima/Tacna/None | Exec PASS |
| You Do allowlist / tests | Residual | **Active** | `ALLOWED_REGIONS` + `_run_tests` PE regions | Red oracle on cero válido |
| ISSUE-04..06 / M1–M6 meta-leaks | Explorer | Already clean | Grep re-verify | 0 hits V3/Sales Log/reubicado |
| ISSUE-07 You Do NotImplementedError | Explorer | Already fixed | DEFECT bodies retained; regions fixed | RC≠0 on tests |
| ISSUE-08 print ok theater | Explorer | Already clean | Grep 0 | PASS |
| ISSUE-09..11,13–16,18–21 | Explorer | Already fixed in R1 content | Re-verified structure | PASS / N/A |
| ISSUE-12 id `data-structures` | Explorer | Deferred | No rename (compat / progress keys) | Residual platform |
| ISSUE-17 cognitive load | Explorer | Mitigated | Map ritmo + GRR intros retained | Residual by design |
| SQ-high AGREEMENT “Primero tabla” | Spanish quality | Active | “Primero la tabla, después el código” | Manual |
| SQ-med `hints[]` + `hint` | Spanish quality | Active | “dos pistas (principal y de refuerzo)” | Grep 0 `hints[]` |
| G-01 jobRelevance colon run-on | Expert | Active | Split into two sentences | Manual |
| P-02 set before collections | Expert | Active | Parenthetical first-use of `set` | Manual |
| P-05 outlier 50000 silent | Expert | Active | Documented in portfolioNote | Manual |
| vs → vs. (ES prose) | Grammar plan | Partial | Fixed learner-facing `vs` → `vs.` | Grep |
| C-06 RUC starter gap | Expert | Low / accepted | Instruction lists RUC; E2/E3 solutions cover | Residual low |
| C-08 edad 66–120 review | Expert | Semantic lab | Intentional invariante exercise | Residual documented |

---

## 3. Full corrected content or precise diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s03-data-structures.ts`  
Git diff this pass: **~60 lines changed** (integrity + Spanish polish), not a bulk rewrite.

### Key integrity blocks (post-fix)

**I Do S03-T1-A-DEMO (ISSUE-02 / C-01):**

```python
region = "Lima"
monto = 1500
ALLOWED = {"Lima", "Arequipa", "Cusco"}

print("region == 'Lima' →", region == "Lima")
print("region != 'Piura' →", region != "Piura")
print("monto >= 1000 →", monto >= 1000)
print("monto < 500 →", monto < 500)
print("region in ALLOWED →", region in ALLOWED)
print("'Piura' not in ALLOWED →", "Piura" not in ALLOWED)
print("1000 <= monto <= 2000 →", 1000 <= monto <= 2000)
# output matches exactly
```

**Theory + I Do T3-A (C-02 residual):**

```python
ALLOWED_REG = {"Lima", "Arequipa", "Cusco", "Piura"}
for r, e in [("Lima", 30), ("Tacna", 30), ("Piura", 15), (None, 40)]:
    print(r, e, "→", rule_region_edad(r, e))
# Lima 30 → accept | Tacna 30 → review | Piura 15 → reject | None 40 → review
```

**We Do T1-B-E2 (C-03):**

```python
print("'' or 'default' →", "" or "default")
print("'Lima' or 'default' →", "Lima" or "default")
# … 0 and 99, 5 and 99, None or 0
# output: default, Lima, 0, 99, 0
```

**We Do T3-A-E1 (C-05):**

```python
ALLOWED = {"Lima", "Arequipa", "Cusco", "Piura"}
for r in ["Lima", "Tacna", None]:
    print(r, "→", check_region(r))
# Lima → accept | Tacna → review | None → review
```

**You Do allowlist / oracle regions:**

```python
ALLOWED_REGIONS = {"Lima", "Arequipa", "Cusco", "Piura"}
# happy: Lima + monto 0 → accept
# unknown: Tacna → review
```

**Spanish / meta polish (examples):**

- We Do intro: schema jargon `hints[]` + `hint` → “dos pistas (principal y de refuerzo)”.
- jobRelevance: split after S02 so the decisión clause is a full sentence.
- First `set` mention: brief parenthetical before deep collections.
- portfolioNote: document outlier constant 50000 as review, not reject.
- Learner prose: `vs` → `vs.` where Spanish editorial style requires it.

---

## 4. After-Fix Validation Report

### Issue-by-issue (Explorer ISSUE-01 … ISSUE-21)

| Issue | Result |
|-------|--------|
| 01 | **Fixed** (already) · re-verified |
| 02 | **Fixed** this round |
| 03 | **Fixed** (already) · if-equivalent re-verified |
| 04–06 / M1–M6 | **Fixed** (already) · grep clean |
| 07 | **Fixed** (already) · DEFECT starter, no NotImplementedError |
| 08 | **Fixed** (already) · 0 print-ok theater |
| 09–11, 13–16, 18–21 | **Fixed** / re-verified |
| 12 | **Residual** · platform id rename deferred |
| 17 | **Mitigated** · residual load by design (18h rules engine) |

### Expert criticals C-01…C-05

All **fixed** this round via single PE place-name dataset (Lima/Arequipa/Cusco/Piura/Tacna) and aligned instruction ↔ tests ↔ starter ↔ solution ↔ output.

### Code execution

- **37 / 37** non-`match` theory / I Do / solution code↔output pairs: **PASS** under Python 3.9.  
- **4** `match` blocks: logical parity validated with if-equivalent simulation (host 3.9 SyntaxError on native match; course assumes 3.12+ / Pyodide).  
- **You Do** starter: runs main, **fails** `_run_tests` on cero válido (honest red oracle).  
- **selfCheck:** 8 items; `correctIndex` distribution balanced (2× each of 0,1,2,3).  
- **Synthetic drift tokens** `Sucursal-` / `Oficina-` / `Cliente-A|B`: **0** remaining.  
- **Meta greps:** gate V3, Sales Log, NotImplementedError, Bloom, `hints[]`: **0**.

### Spanish quality

| Metric | Before (fleet audit snapshot) | After R2 (`--no-lt`) |
|--------|-------------------------------|----------------------|
| quality_score_0_10 | **8.72** | **9.8** |
| findings_total | 94 | 15 |
| FH label | fácil | fácil (FH ≈ 84.5) |

Remaining findings are mostly false-positive “repeated_word” on intentional contracts (`True, True, …`, `nulo, nulo`, `DNI`/`dni` case study) and low structure density in exercise contracts — not real typos.

### Markdown rendering

Global SectionView RichText defect may still show raw `**` in some fields site-wide. **Not fixed here** (platform agent scope). Section-local consequence: bold markers may appear as literals until global fix.

### Live render / continuity

- Live SPA hash `#data-structures` still maps to this section (legacy id).  
- Previous: S02 types/parser · Next: S04 iteration — connective tissue in map retained.  
- Accessibility: plain-text code samples; no color-only instruction.

### Explicit statement

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.**

---

## 5. Residual risks and later recommendations

### Section-local residuals

- **ISSUE-12:** `id: 'data-structures'` and filename `s03-data-structures.ts` still mismatch the title. Needs coordinated alias/migration (progress keys, hash, PdfReport, demos).  
- **ISSUE-17:** Dense 18h load (syntax + QA policy + match + tests) remains intentional; pacing block mitigates but does not remove load.  
- **C-06:** E3 doc-type exercise still introduces RUC primarily in solution path (instruction mentions RUC; transfer still works).  
- **C-08:** T4-A-E3 edad 66–120 → review is a deliberate “adjust invariante” lab; not a silent bug if learner reads the exercise narrative.  
- Spanish heuristic false positives on contract lists (repeated status tokens).

### Repository-wide / platform

- SectionView Markdown-as-JSX for callout/jobRelevance/step fields.  
- Global execute-and-diff harness still valuable for regression of place-name rewrites.  
- Legacy ID inventory agent for safe rename.

### Deferred

- Do **not** rename `data-structures` without progress-key migration.  
- Do **not** edit SectionView.tsx from this section agent.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|--------|
| Section node | S03 · Decisiones y reglas de validación · id `data-structures` |
| Concept nodes corrected | Boolean comparisons; truthiness ≠ ausencia; if/elif exclusivity; guards; allowlist+rango tri-estado; decision tables / match; invariants; actionable messages |
| Prerequisites | S02 types / None / parser context |
| Forward edges | S04 iteration over records; CP-N1-A rules engine increment |
| Retained strengths | GRR E1/E2/E3 lattice; tri-estado spine; zero-valid gate; 8 selfCheck; DEFECT We Do pattern |
| Resolved defect nodes | Fabricated I Do outputs; We Do place-name five-way drift; You Do allowlist/test desync; meta schema `hints[]`; jobRelevance run-on |
| Remaining risks | Legacy id; platform Markdown; cognitive density |
| Compatibility | Keep id/hash for stored progress |
| Assessment coverage | is None; zero-valid; if/elif; or return value; allowlist set; match; guard order; actionable message |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s03-data-structures.ts` | Only product edit: integrity + Spanish + connective polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S03_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S03.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S03 |
| `course-state/curriculum_hardening/audits/spanish_quality/S03_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |

No other section sources, no SectionView.tsx, no global platform files.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S03.md`  
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S03**

---

Section 3 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
