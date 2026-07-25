# S15 Fixer Report (Round 2) — Pandas: ingesta, selección y tipos

**Role:** Second-round Section Fixer (Grok Build)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S15  
**Section:** 15 — Pandas: ingesta, selección y tipos  
**Canonical file:** `src/lib/course/sections/s15-stdlib-deep.ts`  
**Internal id / live hash:** `stdlib-deep` (`#stdlib-deep`)  
**Live site:** https://pillb.github.io/pyarcana/  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | 15 — Pandas: ingesta, selección y tipos |
| Canonical | `src/lib/course/sections/s15-stdlib-deep.ts` |
| Live route | https://pillb.github.io/pyarcana/#stdlib-deep |
| Internal ID | `stdlib-deep` |
| Primary Explorer | `course-state/curriculum_hardening/audits/explorer_reports/S15_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S15_report.md` |
| Expert 2 (docx) | `expert_audit/expert_2_audit/Section 15 Audit Report.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S15_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer (context) | `course-state/curriculum_hardening/audits/fixer_reports/S15_FIXER_REPORT.md` |
| Assessment | Public `selfCheck` (10 MCQ) in canonical; no section-local question-bank seed found for `stdlib-deep` |
| Validation | In-process code/output exec harness; `scripts/spanish_quality_audit.py --from 15 --to 15 --no-lt` |

**Scope confirmation:** Only `s15-stdlib-deep.ts` was edited. No changes to `SectionView.tsx`, `PdfReport.tsx`, or other sections.

**Anti-aberration:** Educational prose and exercise contracts were written/edited by hand against audit evidence. Automation was limited to mechanical validation (exec solutions/demos, strip `# CASO-LIM-015` meta lines, Spanish-quality metrics). No generators, loops, or bulk paraphrase factories manufactured learner content.

---

## 2. Summary of changes applied

### Baseline after Round 1
Round 1 already closed Explorer P0/P1 meta (V3/stdlib framing, fence templates, `# DEFECT:`, gate V3 rubric, truncated T4-A-E3, dictionary, headings, Coercionar, You Do `_run_tests`). Expert report score ~7.6 reflected remaining residuals. Expert-2 flagged **release-blocking** technical inconsistencies around default NA tokens and coercion deltas.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 1–9, 11–19 meta/polish | Explorer | Already fixed (R1) | Re-verified zero residual learner-facing V3/`# DEFECT`/fence leaks | Grep: 0 hits |
| Exp 10 You Do | Explorer | Present but wrong NA model | Fixtures `SIN_DATO`; coercion delta works; hash keys accept sha256 | Reference impl `report.score>=1`, `tx.monto>=1` |
| Exp 18 id drift | Explorer | Platform | **Deferred** — keep `id: "stdlib-deep"` | No migration |
| H-1 functools demo | Expert | Platform | **Residual global** — `SectionView.tsx` demos map | Out of section scope |
| H-2 PDF “stdlib” | Expert | Platform | **Residual global** — `PdfReport.tsx` | Out of scope |
| H-3 / M-5 jobRelevance run-on | Expert + SQ | Active | Split into short workplace sentences | Manual read |
| H-4 CASO-LIM-015 ×24 | Expert | Active | Removed all starter meta lines | 0 × CASO-LIM |
| M-1 `la Series` | Expert + SQ high | Active | `objeto Series` / `serie` | 0 hits |
| M-2 `con coerce` | Expert + SQ PREP_VERB | Active | `errors='coerce'` | 0 hits |
| M-3 iDo intro | Expert + SQ | Active | Two-sentence retailer arc | SQ long_sentence gone |
| M-4 portfolioNote | Expert | Active | Split at CP-N2-A period | Manual |
| M-6 capital after `?` | Expert | Active | Loc / Parse_dates / Category | Manual |
| M-7 `vs` | Expert + grammar plan | Partial | `vs.` or rephrase; edgeCases cleaned | 1 bare `vs` only in old state → cleaned |
| M-8 identity | Expert | Platform | Deferred with aliases note | id retained |
| E2-I1 coercion delta impossible | Expert 2 critical | Active | CLIENTES/TX use `SIN_DATO`; theory teaches default NA vs custom tokens | delta=1 verified |
| E2-I2 na_values false premise | Expert 2 critical | Active | T1-B-E1 uses `SIN_DATO` + honest instruction | starter isna=0, solution=1 |
| E2-I3 CoW / chained | Expert 2 high | Active | Theory T2-B + selfCheck updated for modern CoW | Manual |
| E2-I9 schema datetime | Expert 2 | Active | I Do `apply_schema` supports float/string/datetime + TypeError else | Exec OK |
| E2-I12 manifest fields | Expert 2 | Active | I Do/theory include dtypes; SHA-256; You Do accepts sha256 keys | 16/16 demos |
| E2-I14 SHA-1 default | Expert 2 | Active | Theory/I Do/E3 hash → SHA-256 | Expected `309b0e45` |
| E2-I15 category memory | Expert 2 | Active | Softened claim; Int64/null note | Manual |
| E2-I17 riesgo label | Expert 2 | Active | `prioridad_revision` si/no lab label | Output match |
| E2-I19 `continues` | Expert 2 | Active | `continúes` | Manual |
| SQ long_sentence / PREP_VERB / AGREEMENT | SQ JSON | Active | Fixed as above | SQ **10.0** (--no-lt), findings 5 residual FP |
| Gradual-release UI (E2-I4) | Expert 2 | Platform | Residual — renderer shows all We Do under one tab | Global |
| Auth exam bank seed | Expert 2 | Unverified | Residual — no `stdlib-deep` bank in repo | Global/assessment agent |
| Markdown RichText leak | Cross-cutting | Platform | Residual — documented only | Global Agent A |

---

## 3. Precise changes (GitHub-style summary)

### 3.1 Opening / theory
- **jobRelevance:** split overload sentence; invalid-token framing instead of bare “NA as only case”.
- **Diccionario:** parser-null vs conversion-failure; `vs.` for loc/iloc.
- **T1-B:** default `NA`/`N/A` vs custom `na_values` (`SIN_DATO`); `continúes`; `vs.`.
- **T2-B:** Copy-on-Write / chained assignment modern mental model.
- **T3-A:** Int64 nullable; category only low-cardinality; `errors='coerce'` wording.
- **T3-B:** delta=0 when tokens are already parser nulls; practice tokens `xx`/`SIN_DATO`.
- **T4-B:** SHA-256 + same-payload hashing; `content_sha256` in theory code/output.

### 3.2 I Do
- Intro: retailer arc, eight demos without 37-word stack sentence.
- T2-A: `prioridad_revision` instead of unsupported `riesgo` alto/bajo.
- T2-B why: CoW-aligned copy message.
- T3-B: schema dispatcher with `datetime64` + unsupported `TypeError`.
- T4-B: manifest with `dtypes` + `content_sha256`.

### 3.3 We Do
- Stripped **24×** `# CASO-LIM-015 · …` meta first lines.
- **T1-B-E1** rewritten around `SIN_DATO` (true defect).
- Spanish: Series concordance, `errors='coerce'`, feedback capitalization/code ticks.
- **T4-B-E3:** SHA-256 prefix `309b0e45`.

### 3.4 You Do
- Fixtures: `SIN_DATO` for score and monto (conversion failures).
- Requirements/rubric: honest coercion semantics; SHA-256 preferred; edge cases wording.
- `_run_tests` accepts `sha256` / `content_sha256` / legacy sha1 keys.
- portfolioNote split.

### 3.5 Self-check / resources
- Capitalization after `?`; CoW-aligned SettingWithCopy options/explanations; category cardinality note; `vs.` in options/notes.

---

## 4. After-Fix Validation Report

### Issue disposition (Explorer 1–19)
All Explorer issues **fixed** in R1 and **re-confirmed** in R2, except **#18** (legacy id) deferred as platform migration.

### Expert (H/M/L)
| ID | Disposition |
|----|-------------|
| H-1, H-2 | Residual global platform |
| H-3, H-4 | Fixed in section |
| M-1…M-7 | Fixed |
| M-8 | Residual identity migration |
| L-* FPs | No action / not content defects |

### Expert 2 critical/high (section-local)
| ID | Disposition |
|----|-------------|
| I1 coercion tests | Fixed (SIN_DATO + delta) |
| I2 na_values exercise | Fixed |
| I3 CoW prose | Fixed (section prose/selfCheck) |
| I4–I5 UI scaffold / 3-hint platform | Residual platform |
| I6 I Do process depth | Partial — improved why + schema demo; full line-by-line UI residual |
| I7 read_excel / Int64 practice depth | Partial — theory Int64 + openpyxl contract; no new read_excel micro-drill (scope balance) |
| I8–I10 assessment/transfer architecture | Residual product / partial |
| I9 schema demo | Fixed |
| I11 Markdown render | Residual platform |
| I12–I15, I17, I19 | Fixed section-local |
| I13 provenance return bytes | Residual design (documented as hash-of-export contract) |
| I16 date format adversarial | Residual (valid ISO fixture) |
| I18 cognitive load You Do size | Residual (milestones deferred) |
| I20 legacy id | Residual platform |

### Mechanical validation
| Check | Result |
|-------|--------|
| We Do solutionCode ×24 | **24/24 PASS** |
| Theory + I Do named demos | **16/16 PASS** |
| You Do coercion reference | score delta=1, monto delta=1 |
| T1-B-E1 SIN_DATO | starter isna=0; solution isna=1 |
| Meta leaks (CASO-LIM, DEFECT, gate V3, Coaccionar, la Series) | **0** |
| Spanish quality (--no-lt) | **10.0** / FH **83.2** (was 8.5 pre-R2 snapshot in SQ JSON baseline) |
| Answer-key selfCheck positions | Unchanged distribution 2,0,1,3,2,0,1,3,2,0 |
| Markdown bold/backticks in jobRelevance | Still may render as raw text (platform) |

**Statement:** No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation and for stripping identical meta-marker lines (`# CASO-LIM-015`).

---

## 5. Residual risks and later recommendations

### Section-local residuals
- You Do remains a large multi-function capstone; intermediate milestones would reduce load (Expert2 I18).
- Transfer exercises are still mostly micro-bug repairs (Expert2 I10); deeper transfer would need new hand-authored scenarios.
- No dedicated `read_excel` We Do (outcome coverage partial).
- Authenticated exam bank for this section not verified in-repo.

### Platform / global (do not fix in section agent)
- `SectionView.tsx` demos[`stdlib-deep`] still shows functools/itertools.
- `PdfReport.tsx` label “15. stdlib”.
- RichText for jobRelevance / instructions / feedback.
- Legacy `id` / filename / progress keys migration with aliases.
- Gradual-release UI (true independent You Do without full solution reveal for E3).

### Compatibility
- Keep `id: "stdlib-deep"` and URL `#stdlib-deep` until Global Agent C migrates.
- You Do hash keys still accept legacy `sha1`/`content_sha1` for portfolios already in flight.

---

## 6. Updated Graph Memory notes

| Node | Notes |
|------|-------|
| Section 15 | Pandas ingesta tipada CP-N2-A; score after R2 ~ gold for section-local content |
| Concepts corrected | parser-null vs conversion failure; custom `na_values`; CoW chained assignment; SHA-256 provenance; Int64/category caveats |
| Prerequisites | S14 NumPy vectors → S15 tables |
| Forward | S16 quality gates; S17 joins/groupby |
| Strengths retained | 8/8/24 structure; fail-closed schema; synthetic PE geography; score≠culpa |
| Defects resolved | CASO-LIM meta; NA pedagogy lie; coercion test gaming; Series agreement; coerce PREP_VERB; riesgo label |
| Remaining risks | Platform demos/PDF/RichText/id; exam bank seed |
| Assessment coverage | 10 public MCQ; You Do `_run_tests` honest with SIN_DATO |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s15-stdlib-deep.ts` | Only product content edits for Section 15 |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S15_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S15.md` | Full R2 worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S15 |
| `course-state/.../spanish_quality/S15_SPANISH_QUALITY.json` | Regenerated by validation audit script |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S15.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S15**)

---

Section 15 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
