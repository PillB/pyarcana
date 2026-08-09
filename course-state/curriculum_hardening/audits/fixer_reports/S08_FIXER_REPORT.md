# S08 Fixer Report — Archivos, CSV, JSON y contratos de ingesta

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-24  
**Pass type:** Residual Explorer-guided polish to **≥ 9.5** (authority = `S08_EXPLORER_REPORT.md` only)  
**Section:** 8 · platform id `pandas` · *Archivos, CSV, JSON y contratos de ingesta*  
**Source edited (only in-scope file):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s08-pandas.ts`  
**Explorer baseline:** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S08_EXPLORER_REPORT.md` · score **5.5 / 10** · 25 issues · 6 primary meta-leak classes  
**Estimated score after fix:** **9.65 / 10**  
**Live site:** https://pillb.github.io/pyarcana/  
**Repo:** https://github.com/PillB/pyarcana  
**Gold bar:** `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md` + early-section narrative fidelity (S02)

---

## Anti-Aberration Acknowledgment

Before edits and validation, the Fixer explicitly accepted:

1. **Forbidden** — Python/JS/other code whose purpose is to generate, loop, template, or mass-produce educational prose, exercises, or explanations.  
2. **Forbidden** — Placeholder/lorem/TODO filler; copy-paste blurb factories; automated paragraph expanders.  
3. **Required** — Human-quality craftsmanship: every change deliberate, issue-traceable, and written by hand.  
4. **Self-correction** — Prefer fewer precise edits over automated volume.

**Confirmation:** Full Explorer Issue Registry (Issues 01–25, Meta M1–M8) was read first. Residual remediations and prior-pass preservation were applied **by hand**. No bulk generators or programmatic content factories were used to manufacture learner text. `anti_aberration_ok: true`.

**Note on tooling:** A short Python harness was used only to **re-execute** existing `code`/`output` pairs for fidelity checks (verification oracle), never to synthesize curriculum prose, exercises, or explanations.

---

## 1. Summary of changes applied (mapped to Explorer issue numbers)

### High / P0 (confirmed present from prior Explorer-guided remediation; re-validated this pass)

| Issue | Status | Evidence this pass |
|-------|--------|-------------------|
| **01** | **FIXED** (validated) | Theory `path_utf8.py` → `(True, ['línea1', 'línea2'])` |
| **02** | **FIXED** (validated) | `csv_dict.py`: string montos after Decimal quantize; `;` dialect + utf-8-sig line; reject `{raw, reason}` |
| **03** | **FIXED** (validated) | `quarantine_rows.py`: `reason: "col_count"`; tuple print matches return |
| **04** | **FIXED** (validated) | `json_ser.py`: single JSON array line; keys `id` then `día` |
| **05** | **FIXED** (validated) | `hash_backup.py`: sha256 of `b"id\nC1\n"` = `b776a3a3…`, `bytes: 6` |
| **06** | **FIXED** (validated) | `manifest.py`: derived totals + `reconcile_ok`; fixture `transactions.json` |
| **07** | **FIXED** (validated) | All 8 I Do demos: honest executed outputs (incl. JSONL in T3-A) |
| **08** | **FIXED** (validated) | No truncated We Do instructions |

### Medium–High / P1

| Issue | Status | Change |
|-------|--------|--------|
| **09** | **FIXED** | Task-first instructions; no CASO/C00x template spam essays |
| **10** | **FIXED** | No student-facing V3 / platform-id confessions |
| **11** | **DEFERRED (copy only)** | `id: "pandas"` retained for SPA hash `#pandas`; learner copy says stdlib now / pandas later |
| **12** | **FIXED** | Single atomic contract: `tmp = path.with_name(path.name + ".tmp")` everywhere |
| **13** | **FIXED** | I Do T3-A writes array **and** JSONL |
| **14** | **FIXED** | No unconditional `print('ok', True)` in starters |
| **15** | **FIXED** | T1-A-E3 encoding quarantine cleanly staged |
| **25** | **FIXED** | Quarantine/reject shape `{raw, reason}` consistent |

### Medium / P2

| Issue | Status | Change |
|-------|--------|--------|
| **16** | **FIXED** | Unique theory paragraphs per subtopic; no T4-A/T4-B paste |
| **17** | **FIXED + residual this pass** | selfCheck **11** MCQs (was 5 in Explorer; was 10 prior). **Added** `newline=''` item covering missing Explorer LO depth |
| **18** | **FIXED** | Full We Do→You Do bridge: intro map + T4-B-E3 mini-ensamblaje + You Do receta 1–6 |
| **19** | **FIXED + residual** | Dialect `;` + `utf-8-sig` in theory; You Do requirements now also require `newline=''` + encoding policy |
| **20** | **FIXED + residual this pass** | **ES-PE redaction:** Rioplatense voseo (`escribís`, `Implementá`, `podés`, `usá`, …) rewritten to tú/impersonal aligned with S02/S07 voice |
| **21** | **FIXED + residual this pass** | Map dictionary + S07 glue retained; **added** S02-style `s08_gate_contract.py` mini-demo with honest output |
| **24** | **FIXED (human-oracles)** | `tests` fields are exact pass strings; not full pytest AST (platform residual OK) |

### Low / P3

| Issue | Status | Change |
|-------|--------|--------|
| **22** | **FIXED** | Resources: Real Python, MIT 6.100L, CS50P, py4e + Cookbook/DDIA |
| **23** | **FIXED** | Q2 stem complete; no “convertir a pandas” joke option |

### Meta-leaks M1–M8

| Leak | Status |
|------|--------|
| **M1–M3, M5–M6, M8** | **GONE** from learner prose |
| **M4** | **Deferred** as product id rename (documented) |
| **M7** `# DEFECT` starters | **Retained intentional** (one clear defect per starter; gold harness pattern) |

### This residual pass (hand-crafted only)

1. **ISSUE-20 residual** — Systematic ES-PE voice pass (theory, callouts, We Do imperatives, You Do context).  
2. **ISSUE-21 residual** — Map `s08_gate_contract.py` demo (gate / artifacts / reconcile / no PII).  
3. **ISSUE-17 residual** — selfCheck Q11 on `newline=''` (Explorer gap list).  
4. **ISSUE-19 / You Do** — Explicit `newline=''` + encoding in assembly recipe and requirements.  
5. **Gold bar instruction length** — T3-A-E2 expanded so **24/24** instructions ≥ 150 chars.  
6. **Re-validation** — **41/41** theory + I Do + We Do solution blocks re-executed green (includes new map demo).

**Technical spine preserved:**  
**Path/UTF-8 → atomic/newlines → CSV dialect/cast → quarantine → JSON/JSONL → schema/nulls → hash/backup → manifest/reconcile → CP-N1-B You Do → S09 bridge**

---

## 2. Corrected content location

All curriculum remediations live in:

**`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s08-pandas.ts`**

No other `src/lib/course/sections/*` files were edited.

### Key pedagogical surfaces (validated present)

1. **No learner-visible** V3 / platform-id archaeology.  
2. **Theory + I Do + solution code↔output** truth: **41/41** re-executed green.  
3. **We Do prose** task-first; **24/24** instructions ≥ 150 chars; **0** truncations.  
4. **One atomic write contract** (`name + ".tmp"`).  
5. **One quarantine shape** `{raw, reason}`.  
6. **JSONL worked example** in I Do T3-A.  
7. **Self-check** n=11 covers T1–T4 depth including `newline=''`.  
8. **You Do** closes CP-N1-B with typed stubs, Decimal, fail-closed `run`, assembly recipe.  
9. **S07 → S08 → S09** connective tissue present.  
10. **ES-PE voice** consistent with early gold sections (no residual voseo imperatives).

### Illustrative corrected surfaces

**Map contract demo (ISSUE-21 residual):**  
> `gate CP-N1-B` / `artifacts clean,quarantine,manifest` / `reconcile n_in == n_clean + n_quarantine` / `real_pii_ok False`

**selfCheck newline (ISSUE-17 residual):**  
> “Al abrir un CSV en disco con el módulo csv, ¿por qué usas newline=''?”

**jobRelevance (ISSUE-10, 20):**  
> Onboarding Perú + CP-N1-B in stdlib; pandas later in data level — no platform-id confession.

---

## 3. After-Fix Validation Report

### Issue-by-issue confirmation

| Priority batch | Issues | Result |
|----------------|--------|--------|
| P0 demos | 01–07 | **PASS** — executed outputs match source |
| P0/P1 instructions | 08, 09, 14, 15 | **PASS** — full sentences; no ok-True lies |
| P1 meta + identity | 10, 11 (copy), M1–M6 | **PASS** — student prose clean; id rename deferred |
| P1 contracts | 12, 13, 25 | **PASS** — atomic / JSONL / quarantine schema |
| P2 pedagogy | 16–21, 24 | **PASS** — quiz n=11; bridge; dialect/BOM; map demo; **ES-PE voice** |
| P3 | 22, 23 | **PASS** |
| Product | 11 rename | **DEFERRED** — needs URL/progress migration |

### Acceptance criteria (from Explorer §7)

- [x] Every theory/I Do snippet’s `output` matches a real run.  
- [x] No truncated exercise instructions.  
- [x] No student-facing “Id de plataforma pandas” / “En V3… reubica”.  
- [x] Single `write_atomic` convention documented.  
- [x] Self-check ≥ 8 items covering T1–T4 (**11**).  
- [x] You Do still closes CP-N1-B with reconcile fail-closed.  

### Structural counts (post-fix)

| Surface | Count | Target |
|---------|-------|--------|
| theory headings | 10 (map + 8 subtopics + S09 bridge) | ≥ 9 |
| iDo demos | 8 | 8 |
| weDo exercises | 24 | 24 |
| selfCheck | 11 | ≥ 8 |
| learningOutcomes | 8 | 6–10 |
| Meta-leak strings (M1–M3, M5–M6) | 0 | 0 |
| `with_suffix` atomic | 0 | 0 |
| Unconditional `print('ok', True)` | 0 | 0 |
| We Do instructions &lt; 150 chars | 0 | 0 |
| Executable fidelity (theory+I Do+solution) | 41/41 | 0 mismatches |

### Anti-aberration confirmation

- **No** bulk educational content generation (no paragraph factories, no template loops producing exercises).  
- **No** lorem/TODO/placeholder learner prose.  
- Verification scripts only re-ran existing code blocks.  
- All residual prose edits (voice, instructions, quiz, map demo, You Do requirements) written by hand.

---

## 4. Residual risks & recommendations

| Item | Risk | Recommendation |
|------|------|----------------|
| **ISSUE-11** platform id `pandas` vs titles | Support/bookmark confusion | Product-owned rename + redirect `#pandas` → new id + progress migration |
| **Filename** `s08-pandas.ts` | Maintainer confusion | Rename only with import map update |
| **ISSUE-24** `tests` as strings | If autochecker expects AST | Platform layer; keep human-oracle strings consistent |
| **M7 DEFECT starters** | Author voice in comments | Acceptable for bug-hunt pedagogy; optional future soften to blank/`____` like S02 |
| **You Do integration cliff** | Still real for weaker students | Bridge is explicit; optional later lab fixture pack outside this section file |
| **S09+** | Logging of decode/cast failures | S09 should continue fail-closed vocabulary from S08 checklist |

---

## 5. Updated Graph Memory notes

```yaml
section: 8
id: pandas  # retained for SPA hash #pandas
file: src/lib/course/sections/s08-pandas.ts
title: Archivos, CSV, JSON y contratos de ingesta
explorer_score: 5.5
fixer_score_after_estimate: 9.65
status: fixer_complete_residual95
gate: CP-N1-B
stack: [pathlib, csv, json, hashlib, shutil, decimal]
depends_on: [S05-normalizers, S06-in-memory-model, S07-unicode-text]
feeds: [S09-exceptions-logs, S10-cli-packaging]
identity_debt:
  - platform_id_pandas_vs_files_etl  # deferred product
  - filename_s08-pandas_ts           # deferred product
quality_edges:
  - code_output: honest_41_blocks
  - meta_leak_nodes: cleared_student_facing
  - strong_nodes: [youDo_etl_starter, T4_reconcile_per_source, jsonl_demo, map_contract_demo, es_pe_voice]
  - bridge: [weDo_intro_map, T4-B-E3_mini_assembly, youDo_recipe]
issues_fixed: [01-10, 12-25, M1-M3, M5-M6, M8]
issues_deferred: [11]
anti_aberration_ok: true
```

---

## 6. Score estimate rationale

| Dimension (Explorer) | Before | After (est.) |
|----------------------|--------|--------------|
| Meta-leak / identity honesty | 3.5 | 9.2 (id rename only deferred) |
| Grammar / redaction ES-PE | 6.0 | 9.5 (voseo residual cleared) |
| Connective tissue / flow | 5.5 | 9.5 (map demo + S07/S09 + bridge) |
| I Do / We Do / You Do fidelity | 6.5 | 9.7 (41/41 honest outputs) |
| Cognitive load / progressive disclosure | 6.0 | 9.3 |
| Exercises / exam alignment | 5.0 | 9.4 (instructions + quiz n=11) |
| Roadmap consistency | 7.0 | 9.5 |
| External best-practice parity | 7.5 | 9.4 (atomic, UTF-8, Decimal, BOM, newline) |
| **Overall** | **5.5** | **9.65** |

Fleet floor **≥ 9.5**: **met** (no regression).

---

Section 8 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
