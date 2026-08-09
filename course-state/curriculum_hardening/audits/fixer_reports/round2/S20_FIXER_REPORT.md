# S20 Fixer Report (Round 2) — Automatización robusta de Excel

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S20  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **20** — Automatización robusta de Excel |
| Canonical file | `src/lib/course/sections/s20-rag.ts` |
| Live route | https://pillb.github.io/pyarcana/#rag |
| Internal ID | `rag` (legacy slug retained for progress/URLs; **not** RAG content) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S20_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S20_report.md` |
| Expert-2 audit | `expert_audit/expert_2_audit/Section 20 Excel Factory Audit.docx` |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S20_SPANISH_QUALITY.json` (pre-fix score **8.76**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S20_FIXER_REPORT.md` |
| Assessment surface | Public `selfCheck` (8 MCQs) in canonical file; authenticated exam bank not modified this pass |
| Validation | Python executable-oracle harness on **41** code↔output pairs; Spanish audit `--from 20 --to 20 --no-lt` |

**Scope obeyed:** Only `s20-rag.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Python was used only to execute snippets, recompute hashes/pivots, and compare stdout to claimed `output`.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer report claimed integrity green and Lima/Cusco standardization, but the working tree still had **active pseudonymization drift** (`Sucursal-*` / `Oficina-*` / `Cliente-*`) that desynced theory, I Do, We Do instruction/hint/starter/solution/output surfaces. Expert report Issues 3–14 and Expert-2 S20-01/S20-02 accurately described the live residual cluster.

Explorer meta-leak Issues 01–02 (learner prose), outcomes honesty, load/save, batch exceptions, Embeddings distractor, and `FileSpreadsheet` icon were **already resolved** in source and re-validated.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 01 / M2–M4 RAG map meta | Explorer | Already fixed | Re-validated Excel map + *Contrato de la sección* | Grep |
| Exp 02 / M1 jobRelevance | Explorer | Already fixed | Re-validated (no id freeze language) | Grep |
| Exp 03 MessageSquare | Explorer | Already fixed | `FileSpreadsheet` retained | Read |
| Exp 04 / 19 outcomes | Explorer | Already fixed | Outcomes match taught skills | Read |
| Exp 05 load/save | Explorer | Already fixed | T2-A theory + I Do + We Do E3 + You Do | Read |
| Exp 06 batch indent | Explorer | Already fixed | Nested `classify` runnable | Oracle |
| Exp 07 instruction↔solution | Explorer | Partial; data still drifted | Realigned T2-A-E2/E3, T3-A-E2, T3-B-E2/E3, T4-B-E2 | Oracle |
| Exp 08 harness meta | Explorer | Mostly fixed; `CASO-LIM-020` remained | Stripped all `CASO-LIM-020` starter tags | Grep 0 |
| Exp 09 trivial We Do | Explorer | Partial | T2-A-E2 RGB assert so starter fails without PatternFill | Starter False / solution True |
| Exp 10 BadZipFile | Explorer | Already fixed | Re-validated | Oracle |
| Exp 11 connective tissue | Explorer | Mostly fixed | Gloss master/manifest/backup; Hago yo / Hacemos juntos / Tú haces labels; split intros | Editorial |
| Exp 12 sheet names | Explorer | Mostly fixed | Entrada/Salida canon; PE cities Lima/Cusco/Arequipa | Grep |
| Exp 13 You Do scaffold | Explorer + Expert2 S20-04 | Partial (asserted flags) | `master_sha` before/after; `dig_rows` for idempotent; Lima/Cusco rows | Read |
| Exp 14 Embeddings | Explorer | Already fixed | Distractor *archivo temporal del SO* | Read |
| Exp 15 selfCheck depth | Explorer | Already fixed (8 items) | Re-validated | Count |
| Exp 16 Spanish gloss | Explorer + Expert 18 | Partial | *plantilla master*, *manifest*, *backup*, *gate*, *ops team*, *share* | Editorial |
| Exp 17 pass criteria pipes | Explorer | Already fixed | Multi-line outputs match | Oracle |
| Exp 18 resources V3 | Explorer | Already fixed | *sección Excel factory* | Read |
| Exp 20 id `#rag` | Explorer | Deferred (product) | **Preserved** `id: "rag"`; prose silent | Residual |
| Expert 1 RAG playground | Expert | **Platform** (`SectionView.tsx`) | **Not fixed** (global agent) | Residual |
| Expert 2 id/filename | Expert | Structural | Deferred compatibility | Residual |
| Expert 3 T3-A theory | Expert | **Active P0** | Lima/Lima/Cusco + matching pivot output | Oracle |
| Expert 4 T3-B theory | Expert | **Active P0** | Piura outside allowlist → `domain_ok False` | Oracle |
| Expert 5 I Do T1-A | Expert | **Active P0** | A2=`Lima` / output `A2 Lima` | Oracle |
| Expert 6 I Do T2-B | Expert | **Active P0** | Cobertura Lima\|Arequipa\|Cusco | Oracle |
| Expert 7 I Do T3-A | Expert | **Active P0** | Pivot `{'Arequipa': 8.0, 'Cusco': 5.5, 'Lima': 22.0}` | Oracle |
| Expert 8 I Do T3-B | Expert | **Active P0** | bad_regions `['Piura', 'Ica']` | Oracle |
| Expert 9 I Do T4-B hash | Expert | **Active P0** | Rows Lima/Cusco → sha1_8 `3e819052` | Oracle |
| Expert 10 We Do T2-A-E3 | Expert | **Active P0** | Write/check both `Lima`; True | Oracle |
| Expert 11 We Do T3-A-E2 | Expert | **Active P0** | Single fixture Lima/Lima/Cusco → sum dict | Oracle |
| Expert 12 We Do T3-B-E2 | Expert | **Active P0** | Lima+Piura, allowed Lima/Cusco → `['Piura']` | Oracle |
| Expert 13 We Do T3-B-E3 | Expert | **Active P0** | Lima+Ica → `['Ica']` | Oracle |
| Expert 14 We Do T4-B-E2 | Expert | **Active P0** | Same multiset reversed → True with sorted dig | Oracle |
| Expert 15–32 Spanish | Expert | Mixed | Angled glosses, `vs.`, ops/share, I Do label, We Do intro split | SQ 10.0 |
| Expert2 S20-04 You Do flags | Expert2 | Active | Hash-based master_intact; dig-based idempotent | Read |
| Expert2 S20-05 exam topics | Expert2 | Assessment bank | **Not in section file**; residual for assessment agent | Residual |
| SQ long/run-on intros | Spanish JSON | Active | Split iDo/weDo intros | Editorial |
| Cross-cutting RichText | Campaign | Platform | **Not fixed** | Residual |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **78.7** (was 8.76 / 78.1); findings 27 (triaged as style/structure noise or intentional code tokens under `--no-lt`).

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s20-rag.ts` (single authority; ~1871 lines after R2).

### Diff group R2-A — Theory integrity (Expert 3–4)

**T3-A `reconcile.py`**

```python
det = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [10.0, 5.0, 7.0]})
# output:
# {'region': ['Cusco', 'Lima'], 'monto': [7.0, 15.0]}
# ok True
```

**T3-B `structure.py`**

```python
regiones = {"Lima", "Arequipa", "Cusco"}
row = {"region": "Piura", "monto": 10.0}
# domain_ok False  (fail-fast pedagogy restored)
```

### Diff group R2-B — I Do integrity (Expert 5–9)

| Demo | Fix |
|------|-----|
| T1-A | `Lima` / `Cusco` rows; output `A2 Lima` |
| T2-A | A2=`Lima` (style demo) |
| T2-B | `Cobertura: Lima\|Arequipa\|Cusco` |
| T3-A | regions Lima×2 + Arequipa + Cusco; pivot dict matches |
| T3-B | allowed Lima/Cusco/Arequipa; violators Piura, Ica |
| T4-B | rows Lima/Cusco; sha1_8 `3e819052` (executed) |

### Diff group R2-C — We Do integrity (Expert 10–14)

- **T2-A-E2:** assert RGB ends with `1F4E79` (starter no longer passes on default fill).
- **T2-A-E3:** instruction/hint/starter/solution all use `Lima`; solution prints `True`.
- **T3-A-E2:** single DF Lima/Lima/Cusco; sum dict `{'Cusco': 7.0, 'Lima': 15.0}`.
- **T3-B-E2:** A2 Lima, A3 Piura, allowed {Lima, Cusco} → `['Piura']`.
- **T3-B-E3:** validate_rows Lima+Ica vs allowlist → `['Ica']`.
- **T4-B-E2:** dig([Lima,1],[Cusco,2]) == dig(reversed) with `sorted`.
- **T1-A-E2:** append row `Lima` (removed Cliente/Sucursal labels).

### Diff group R2-D — You Do evidence (Expert2 S20-04)

- Rows Lima/Cusco; context VP en Lima.
- `master_sha_before` / `master_sha_after` → `master_intact` (not mere `exists()`).
- `dig_rows` order-invariant → `idempotent` flag evidence.
- Manifest keys include `master_sha1_8`.

### Diff group R2-E — Spanish / meta hygiene

- *ops team* → *equipo de operaciones*; *share* → *carpeta compartida*.
- First-use glosses for master / manifest / backup / gate.
- UI labels *Hago yo* / *Hacemos juntos* / *Tú haces* instead of bare “I Do”.
- `vs` → `vs.` in learner prose.
- Split long iDo/weDo intros.
- Removed all `CASO-LIM-020` starter taxonomy tags.
- Domain callout states `domain_ok False` policy.

---

## 4. After-Fix Validation Report

### Issue-by-issue confirmation

| Cluster | Status |
|---------|--------|
| Explorer 01–19 (learner-facing) | **Fixed** or **already fixed** (re-validated) |
| Explorer 20 id freeze | **Residual** (product policy) |
| Expert P0 code↔output Issues 3–14 | **Fixed** (41/41 oracles) |
| Expert Issue 1 RAG playground | **Residual platform** (`SectionView.tsx` demos map key `rag`) |
| Expert Issue 2 rename id/file | **Residual** compatibility |
| Expert Spanish Issues 15–32 | **Fixed** or **N/A** (false positives / MCQ colon stems) |
| Expert2 S20-04 You Do | **Fixed** (evidence-bearing flags) |
| Expert2 S20-05 exam bank topics | **Residual** (outside section file scope) |
| Spanish-quality findings | Checked; score **10.0** post-fix (`--no-lt`) |

### Mechanical validation

| Check | Result |
|-------|--------|
| Code↔output oracles (theory + I Do + We Do solutions) | **41/41 pass** |
| PatternFill starter vs solution | Starter **False**, solution **True** |
| Meta-leak grep (`oráculo`, `DEFECT:`, `Embeddings`, `gate V3`, `CASO-LIM`, `Material legado`, `RAG en producción`) | **0** |
| Region drift (`Sucursal-`, `Oficina-`, `Cliente-`) | **0** |
| Spanish quality S20 `--no-lt` | **10.0** / FH **78.7** (pre 8.76 / 78.1) |
| selfCheck | 8 MCQs retained; no Embeddings distractor |
| Platform id | `id: "rag"` preserved (progress/URL) |
| Markdown RichText leak | **Platform residual** (global) |

### Live-render inspection

Live SPA is a hash-routed client app; tab body is sourced from this TS object. Content authority verified against `s20-rag.ts` (not static HTML). Previous/next roadmap neighbors S19→S20→S21 continuity language preserved (dashboard S19 / package S21 / CP-N2-B).

### Accessibility / continuity

- Synthetic PE regions only; no PII.
- Continuity: Entrada/Salida contract; fail-closed reconcile; manifest handoff to S21.
- Accessibility of workbooks (Expert2) not expanded in this pass — residual recommendation, not a code↔output blocker.

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. Some We Do exercises remain short completion problems (acceptable for guided E1; transfer steps are stronger after this pass).
2. Charts / named ranges / sheet protection intentionally out of scope (outcomes already narrowed); roadmap cosmetic gap noted for product, not re-expanded here.
3. Workbook accessibility (contrast, headers for screen readers) not taught — optional follow-up handoff from S19.

### Repository-wide / platform residuals

1. **`SectionView.tsx` demos[`rag`]** still mounts a Jaccard/RAG playground on the Excel page — requires Global Agent (RichText/demo map), not a section Fixer.
2. **Legacy id** `rag` / filename `s20-rag.ts` / URL `#rag` — freeze policy; needs Global Agent C migration with aliases.
3. **RichText markdown** in callouts/jobRelevance — Global Agent A.
4. **Authenticated exam bank** may still sample charts/named ranges/protection (Expert2 S20-05) — Global Agent D / assessment integrity; not present in `s20-rag.ts`.

### Deferred compatibility

- Do not rename `id: "rag"` without progress migration and demo key update.

### Adjacent-section notes (no edits)

- S21 should continue to expect workbook + manifest artifacts from this factory narrative.

---

## 6. Updated Graph Memory notes

| Node | Update |
|------|--------|
| Section S20 | Excel factory (openpyxl) — integrity restored |
| Concepts | sheets/headers, formulas vs. materialize, template copy→load→save, merges/ISO dates, reconcile/pivot, allowlist, batch BadZipFile/lock, backup, idempotent dig, manifest |
| Prerequisites | S17–S19 (packaging / DE / viz) retained |
| Forward | S21 reporting package; CP-N2-B gate |
| Strengths retained | I/We/You scaffold ×8 subtopics; glossary map; PE ops scenario; privacy discipline |
| Defects resolved | Fabricated outputs; multi-surface region drift; PatternFill false pass; You Do asserted flags; CASO-LIM meta; Spanish anglicisms targeted |
| Remaining risks | Platform RAG demo key; id freeze; exam-bank constructive alignment |
| Assessment coverage | selfCheck 8 on taught skills; exam bank deferred |
| Compatibility | `id: "rag"` frozen |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s20-rag.ts` | All learner-facing integrity, You Do evidence, Spanish polish for Section 20 |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S20_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S20.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append only) |

No other product files modified.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S20.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S20**)

---

Section 20 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
