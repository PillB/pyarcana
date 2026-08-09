# S19 Fixer Report (Round 2) — Visualización y comunicación accesible

**Task ID:** FIXER-R2-S19  
**Agent:** Second-round Section Fixer (Section 19 only)  
**Date:** 2026-07-25  
**Anti-aberration:** **OK** — all learner-facing prose, instructions, feedback, and region labels hand-edited; automation used only for execute-and-diff validation of existing code/output pairs.

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| Section number / title | **19** — Visualización y comunicación accesible |
| Canonical file | `src/lib/course/sections/s19-databases-orm.ts` |
| Internal / platform id | `databases-orm` (routing only; not narrated to learners) |
| Live route | https://pillb.github.io/pyarcana/#databases-orm |
| shortTitle | Viz accesible |
| Icon (after fix) | `BarChart3` |
| Primary Explorer | `course-state/curriculum_hardening/audits/explorer_reports/S19_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S19_report.md` |
| Expert 2 evidence | `expert_audit/expert_2_audit/Section 19 Accessibility Visualization Audit.docx` (identity only; not copied) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S19_SPANISH_QUALITY.json` (score was 8.56 post-R1 prose; residual code integrity still broken) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Assessment bank | `prisma/seed.ts` → `QUESTION_BANK['databases-orm']` (inspected; no region-scramble; not rewritten) |
| Prior R1 report | `course-state/curriculum_hardening/audits/fixer_reports/S19_FIXER_REPORT.md` (claimed region fix; **not present** in source at R2 start) |

---

## 2. Summary of changes applied

### Pre-edit reality (R2 baseline)

Round-1 Explorer pedagogy (despoil, headings, icon, dictionary map, You Do scaffold) was largely present.  
**Critical residual:** pseudonymization drift (`Sucursal-*` / `Oficina-*` / `Cliente-*`) still desynced code, outputs, and instructions.

Execute-and-diff before edit:

| Metric | Count |
|--------|------:|
| Code↔output OK | 28 |
| Mismatch | 9 |
| Runtime ERROR (StopIteration / KeyError / IndexError) | 4 |

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 1–3, M1–M7 meta-leaks (V3/id/legado) | Explorer | Mostly fixed R1 | Confirmed absent; residual **ORMs** disclaimers still active | grep 0 for V3/legado/oráculo/id in prose |
| Exp 4 icon Database | Explorer | Fixed R1 (`BarChart3`) | Kept | source check |
| Exp 5–6, M8–M9 spoiler instructions | Explorer | Fixed R1 | Kept | no Pass exacta / oráculo |
| Exp 7–10 contract bugs | Explorer | Partially fixed R1 | Reconfirmed T1-A-E3, T4-B-E2, float ylim, complete instructions | execute OK |
| Exp 11–15 map / Seaborn / Plotly / You Do / rubric | Explorer | Fixed R1 | Kept + You Do regions → Lima/Cusco/Arequipa | source check |
| Exp 16–22 redaction / feedback / resources | Explorer | Fixed R1 | Spanish polish + residual anglicisms | manual edit |
| Exp 23 S18 continuity | Explorer | Broken by region scramble | Canonical **Lima / Arequipa / Cusco** end-to-end | grep 0 Sucursal/Oficina/Cliente |
| Expert 4–5 ORMs meta | Expert | **Active** | Removed ORM/SQL disclaimers; rewrite out-of-scope to S21/Plotly | grep 0 ORMs |
| Expert 7–12 theory/I Do code↔output | Expert | **Active crash/mismatch** | Aligned all theory + 8 I Do demos to PE regions + regenerated outputs | 41/41 execute match |
| Expert 13–23 We Do unsolvable / scramble | Expert | **Active** | All T2–T4 exercises: same region in instruction/starter/solution/output | execute match; no StopIteration/KeyError |
| Expert 24–30 long sentences / jobRelevance / iDo | Expert | Active | Split run-on orden pedagógico; jobRelevance; iDo intro; Seaborn path | manual prose |
| Expert 31 concordance región sintéticas | Expert | Active | `regiones sintéticas Lima/Cusco/Arequipa` | source |
| Expert 32 y→e imprime | Expert | Active | `e imprime` in T2-A-E2 | source |
| Expert 33 vs → vs. | Expert | Active | All learner-facing `vs.` | regex 0 bare `vs` |
| Expert 34–37 ORMs / template / DEFECT / wrong | Expert | Active | ORMs gone; plantilla; DEFECT harness removed T4-A-E1; wrong→incorrecto | grep |
| Expert 38 tagline capital | Expert | Active | `Cuatro…` + terminal period | source |
| Expert 39 `; .` typography | Expert | Active | “separador `;`” | source |
| Expert 40 Y y | Expert | Active | Dual-axis feedback rephrase | source |
| SQ long sentences / lowercase after period | Spanish-Q | Mixed | Targeted splits; edgeCase terminal period | manual |
| Global SectionView SQL playground | Expert 2 / cross-cut | Active platform | **Not edited** (global Agent A/C scope) | residual risk |
| id / filename / PdfReport | Expert / Global C | Stale identity | **Kept** `id: databases-orm` for progress/URL; not in student prose | residual |

---

## 3. Full corrected content / precise diffs (summary)

Authoritative source: `src/lib/course/sections/s19-databases-orm.ts` (hand-edited).

### 3.1 Meta-leak & opening prose

- `tagline`: capital + “a la evidencia” + period.  
- `jobRelevance`: analítica/reportes; split final sentence; factoría Excel.  
- Map ¶3: orden pedagógico as short sentences (not 45-w run-on).  
- Map ¶4: removed “ORMs ni SQL”; factoría Excel.  
- Callout “Fuera de alcance”: neighbor topics (S21 DOCX/PDF, Plotly/Streamlit), not ORM archaeology.  
- LO1 / T1-A: `vs.`  
- T2-A: path→camino; slides→diapositivas; Seaborn sentence split.  
- T3-A/B: paridad split; filtro Lima; separador `;`.  
- T4-A/B: factoría; Lima claims; reporting→reporte.

### 3.2 Theory demos (code↔output)

| Demo | Fix |
|------|-----|
| `interactive_spec.py` | rows Lima/Cusco/Arequipa; `filtro="Lima"`; output matches |
| `a11y_alt.py` | filtro + tabla Lima; output matches |
| `alt_claim.py` | alt/claims Lima; `alt_len 110`; evita slice matches code |
| `mpl_bar.py` / compose | already Lima-aligned (kept) |

### 3.3 I Do (all 8)

| Demo | Fix |
|------|-----|
| T2-A | regions Lima/Arequipa/Cusco |
| T2-B | Lima/Cusco bars |
| T3-A | was **StopIteration**; view("Lima")/view("Cusco") + matching output |
| T3-B | chart/table Lima/Cusco + matching output |
| T4-A | limitacion Cusco; output parity |
| T4-B | claims Lima; `alt_words 12` |

### 3.4 We Do (critical subset)

| Id | Fix |
|----|-----|
| T2-A-E2/E3 | Lima/Cusco; `e imprime`; float ylim0 |
| T2-B-E1 | Lima/Cusco panels |
| T3-A-E1 | was unsolvable; lookup Lima → 28 |
| T3-A-E2/E3 | tooltip Lima / Cusco; plantilla wording |
| T3-B-E1 | was KeyError; parity Lima 28.0 |
| T3-B-E2/E3 | filtro Lima; alt Lima=28 PEN; Cusco=22 PEN |
| T4-A-E1 | removed DEFECT/assert harness pollution |
| T4-B-E1/E2 | Lima claims + alt n= + hatch |

### 3.5 You Do / selfCheck

- DataFrame: `Lima, Arequipa, Cusco`.  
- Context: `regiones sintéticas`; “a la evidencia”.  
- SelfCheck Q3 claim example: Lima (not Sucursal-Centro).  
- Q4 option: “contraseña del sistema BI”.  
- Q5: diapositiva.

### 3.6 Identity

- `id: "databases-orm"` **retained** (routes, progress, exam bank key).  
- Resources self-link still `#databases-orm` (matches live hash).  
- No student-facing string exposes the id as curriculum archaeology.

---

## 4. After-Fix Validation Report

### Issue disposition (Explorer 1–30)

| Status | Issues |
|--------|--------|
| **Fixed** (R1 kept or R2 repaired) | 1–25, 27–29 |
| **Already fixed R1, reconfirmed** | 5–6, 11–15, 16–22, 24–25, 27–29 |
| **Residual / deferred** | 26 (`learning_roadmap.md` out of section scope), 30 (phase-6 JSON out of scope) |
| **Global residual** | SectionView playground SQL demo; PdfReport `19. DB/ORM`; filename/id migration |

### Expert issues 1–55

- **H code/output (7–23):** fixed in section TS.  
- **H meta body ORMs (4–5):** fixed.  
- **H identity (1–3, 6):** deferred to Global Agent C / platform (documented residual).  
- **M/L grammar:** core set fixed (tagline, vs., y→e, concordance, Y y, template→plantilla, DEFECT, wrong).

### Mechanical validation

| Check | Result |
|-------|--------|
| Execute-and-diff all 41 code/output pairs | **OK=41, MM=0, ER=0** |
| `Sucursal-` / `Oficina-` / `Cliente-` | **0** |
| `ORMs` / `oráculo` / `Pass (salida` / `DEFECT` / `SQLAlchemy` | **0** |
| bare `vs` (not `vs.`) | **0** |
| TS brace / backtick balance | **0** net |
| Assessment bank `databases-orm` | Conceptual OK; no scramble; keys unchanged |
| Spanish-quality script | Not re-run as content generator; prior SQ 8.56; prose polish applied manually |

### Markdown / a11y / live

- Platform RichText leak (jobRelevance `**`) remains **global** — not section-local.  
- Live SPA still may show stale SQL playground until Global Agent A edits `SectionView.tsx`.  
- Section content itself is viz/Matplotlib/a11y consistent.

### Anti-aberration declaration

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content.** Automation was used only for mechanical validation (execute-and-diff of existing Python snippets, grep counts, brace balance).

---

## 5. Residual risks and later recommendations

### Section-local residuals (low)

- Some English tech borrowings remain by design (*chart*, *encoding*, *tooltip*, *sampling*, *gate*) — glossed in dictionary.  
- `tests: "salida coincide con solution output"` still identical ×24 (low; grader field, not pedagogy).  
- Dense dictionary paragraph still one block (list markup depends on RichText; content is clear).

### Repository-wide platform (do not fix in S19)

1. **`SectionView.tsx` demos[`databases-orm`]** still serves sqlite3/SQL “Practica SQL y modelos” — catastrophic UX mismatch.  
2. **`PdfReport.tsx`** label `19. DB/ORM`.  
3. **Filename / id migration** to `viz-accesible` needs compatibility aliases for progress and exam keys.  
4. **RichText** for `jobRelevance` / callouts / instructions.

### Deferred outside TS

- `learning_roadmap.md` “Databases & ORM” label.  
- phase-6 validation inventory green-light criteria upgrade.

---

## 6. Updated Graph Memory notes

```
S18_EDA_uncertainty --supports--> S19_chart_choice
S19_honest_axes --gates--> S19_static_export
S19_static_export --feeds--> S20_excel / S21_reports
S19_a11y_parity --gates--> CP-N2-B_portfolio
CASO-LIM-019_regions (Lima/Arequipa/Cusco) --consistent--> theory/iDo/weDo/youDo/selfCheck

RESOLVED:
  META_ORM_disclaimer_prose
  SPOILER_instructions (already R1)
  CODE_OUTPUT_REGION_SCRAMBLE
  UNSOLVABLE_T3A_E1 / T3B_E1

RETAINED_COMPAT:
  id=databases-orm
  URL_hash=#databases-orm
  QUESTION_BANK['databases-orm']

REMAINING_RISKS:
  PLATFORM_playground_SQL_on_viz_section
  PLATFORM_PdfReport_DB/ORM_label
  PLATFORM_RichText_markdown_leak
```

**Retained strengths:** honesty gates, a11y parity, gradual T1→T4, CP-N2-B thread, spoiler-free We Do design, domain rubric.

**Assessment coverage:** selfCheck 5; exam bank 24 MCQ concepts unchanged (still valid; Seaborn optional / Plotly-as-spec already honest in section prose).

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s19-databases-orm.ts` | Sole instructional source: meta-leak, Spanish, region integrity, code/output parity, You Do / selfCheck |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S19_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S19.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append completion pointer FIXER-R2-S19 |

**Not changed (by design):** `SectionView.tsx`, `PdfReport.tsx`, `index.ts`, `prisma/seed.ts`, other sections.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S19.md`  
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S19**)

---

Section 19 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
