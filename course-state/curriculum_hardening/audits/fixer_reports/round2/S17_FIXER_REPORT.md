# S17 Round-2 Fixer Report — Joins, reshape, groupby y cierre analítico

**Generated:** 2026-07-25  
**Role:** Second-round Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Task ID:** FIXER-R2-S17  
**Section:** 17 · platform id `packaging` (routing only; not narrated to learners as the topic label)  
**Title:** Joins, reshape, groupby y cierre analítico  
**Canonical source (only product file edited):** `src/lib/course/sections/s17-packaging.ts`  
**Live route:** https://pillb.github.io/pyarcana/#packaging  

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| Index | 17 |
| Internal id | `packaging` |
| Short title | Joins · groupby · cierre |
| Canonical file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s17-packaging.ts` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S17_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S17_report.md` |
| Expert 2 (optional) | `expert_audit/expert_2_audit/Explorer Report — Section 17.docx` (noted; not copied blindly) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S17_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 fixer report (context) | `course-state/curriculum_hardening/audits/fixer_reports/S17_FIXER_REPORT.md` |
| Assessments | `selfCheck` embedded in canonical source (5 MCQs); no separate question-bank file for S17 |
| Validation | Independent Python execution of 8 theory demos + 8 I Do demos + 24 We Do `solutionCode` blocks |

**Structure inventory (preserved):** map + dictionary + 8 theory subtopics · 8 I Do demos · 24 We Do · You Do portfolio · 5 selfCheck · resources.

---

## 2. Summary of changes applied

### 2.1 Pre-round reality check

Round 1 had already closed the Explorer meta-leak family (V3 retheme map, jobRelevance packaging archaeology, `supposed`, `nice-to-have`, gate V3 rubric, `# DEFECT:`, `print('ok')`, icon `GitMerge`, formative We Do feedback/hints, domain rubric, pandas-first resources, T1-A C003 narrative, T4-B leakage numbers 115/15/100).

**Round-2 residual blocker:** Round-1’s residual-P0 claim for T3-A was **false or incomplete**. Current tree still had **pseudonymization / fabricated-output drift** in the high-risk class named for S17:

| Block | Defect (before R2) |
|-------|---------------------|
| Theory `groupby_agg.py` | Code: Sucursal-*/Oficina-*; output keys `Oficina-Oeste`/`Cliente-A` with impossible n=2 total 30 |
| I Do `demo_groupby.py` | Code vs printed groups/means inconsistent |
| We Do `S17-T3-A-E1` | Instruction / starter / solution / Pass dict four-way scramble |
| We Do `S17-T3-A-E2` | Solution used three singletons → transform mean identity, not `[2,2,2]` |
| We Do `S17-T3-A-E3` | Region-label drift across instruction/starter/solution |
| Theory `reconcile.py` | Prose tasa 0.75 (150/200) vs code 0.4 (20/50); region names disagree |
| I Do `demo_totals.py` | Oficina-*/Cliente-A labels vs PE place narrative |
| I Do T1-A regions | Oficina-Oeste / Cliente-A |
| You Do fixture / requirements | Sucursal-*/Oficina-* / Cliente-B labels |

Expert report **C-01…C-07** remained **active**. Explorer I09/I10 class (code↔prose trust) reopened by residual region scramble.

### 2.2 Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Explorer I01–I08, I11–I18, I21–I24 | Explorer / R1 | Already fixed | Reconfirmed: no V3/meta, formative We Do, rubric domain, resources, headings, icon | Grep zero meta tokens |
| Explorer I09 | Theory T1-A | Already fixed | C003 orphan narrative still matches code | Manual |
| Explorer I10 | Theory T4-B | Already fixed | 115 / 15 / 100 still aligned | Python |
| Explorer I20, I25 | Structure | Deferred | Wrappers / single-space indent not student prose | Documented residual |
| Expert C-01 | Theory T3-A | **Active** | Lima×2 + Arequipa + Cusco; output sorted groups + transform means | Python exec |
| Expert C-02 | I Do T3-A | **Active** | Lima / Cusco / Arequipa×2; totals & means coherent | Python exec |
| Expert C-03 | We Do T3-A-E1 | **Active** | One fixture Lima×2 + Arequipa; Pass `{'Arequipa': 3.0, 'Lima': 3.0}` | Python |
| Expert C-04 | We Do T3-A-E2 | **Active** | Lima 1/3 + Arequipa 2 → transform mean `[2.0, 2.0, 2.0]` | Python |
| Expert C-05 | We Do T3-A-E3 | **Active** | Lima/Arequipa unified; columns `['region','total','n']` | Python |
| Expert C-06 | Theory T4-A | **Active** | Parts Lima 60 / Arequipa 30 / Cusco 10; tasa 150/200=0.75 | Code↔prose↔output |
| Expert C-07 | I Do T4-A | **Active** | Parts Lima/Arequipa/Cusco 50/30/20; tasa 0.75 | Python |
| Expert M-01 / id | Platform | N/A global | Keep `id: "packaging"` for URL/progress | Documented residual |
| Expert M-02 | SectionView demos | N/A global | Semver playground not editable in section scope | Documented residual |
| Expert M-03 | SectionView RichText | N/A global | Markdown asterisks platform defect | Documented residual |
| Expert G-01 | Grammar | **Active** | All learner `vs` → `vs.` | Grep bare vs = 0 |
| Expert G-02 | Grammar | **Active** | Prefer **tabla puente** after first-use (bridge table) | Manual |
| Expert G-03 / L-01 | Load | Partial | Dictionary split into shorter term blocks | Manual |
| Expert O-01 | Tagline / You Do title | **Active** | Spanish-first tagline + You Do title | Manual |
| SQ medium findings | Spanish JSON | Mixed | vs., glossary density, anglicisms addressed; LT code-token FPs left | `--no-lt` score 10.0 |

### 2.3 Domain fixture policy (this round)

All learner-facing region labels restored to **Lima / Arequipa / Cusco** (Explorer PE domain flavor; no real PII). Synthetic `cliente_id` remains `C00x`. API identifiers (`merge`, `groupby`, `validate`, `indicator`) stay English as code.

---

## 3. Full corrected content / diffs (summary)

Authoritative content lives in `s17-packaging.ts`. Representative GitHub-style hunks:

### Diff A — Theory T3-A groupby integrity (Expert C-01)

```diff
- "region": ["Sucursal-Sur", "Sucursal-Centro", "Oficina-Este"],
- "monto": [10.0, 20.0, 5.0],
+ "region": ["Lima", "Lima", "Arequipa", "Cusco"],
+ "monto": [10.0, 20.0, 5.0, 15.0],
- output: {'region': ['Oficina-Oeste', 'Cliente-A'], ...}  # fabricated
+ output: {'region': ['Arequipa', 'Cusco', 'Lima'], 'monto_sum': [5.0, 15.0, 30.0], 'n': [1, 1, 2]}
+         [15.0, 15.0, 5.0, 15.0]
```

### Diff B — I Do T3-A (Expert C-02)

```diff
- "region": ["Cliente-B", "Sucursal-Norte", "Arequipa", "Arequipa"],
+ "region": ["Lima", "Cusco", "Arequipa", "Arequipa"],
+ output: {'region': ['Arequipa', 'Cusco', 'Lima'], 'total': [20.0, 30.0, 10.0], 'n': [2, 1, 1]}
+         [10.0, 30.0, 10.0, 10.0]
```

### Diff C — We Do T3-A-E1…E3 (Expert C-03…C-05)

- **E1:** fixture Lima×2 + Arequipa; sum Pass `{'Arequipa': 3.0, 'Lima': 3.0}`; starter still uses intentional `mean` bug; feedback “Lima sale 1.5”.
- **E2:** same multi-row Lima + Arequipa 2.0 → transform mean `[2.0, 2.0, 2.0]`.
- **E3:** Lima/Arequipa only; column contract unchanged.

### Diff D — Theory + I Do T4-A (Expert C-06, C-07)

```diff
- parts Sucursal-Centro/Oficina-Este + tasa 20/50 = 0.4  # prose said 0.75
+ parts Lima 60 / Arequipa 30 / Cusco 10; activos 200, pagados 150 → tasa 0.75
+ I Do parts Lima/Arequipa/Cusco 50/30/20; tasa 0.75 den 200
```

### Diff E — Regions + Spanish polish

- I Do T1-A regions Lima/Cusco; You Do fixture Lima/Cusco; requirements Lima/Arequipa/Cusco.
- Tagline and You Do title Spanish-first.
- `vs` → `vs.`; **tabla puente** preferred after gloss; dictionary paragraphs split.
- T4-A-E3 instruction: nacional→Lima; feedback uses “tabla puente”.

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue disposition

| Class | Result |
|-------|--------|
| Explorer I01–I25 | **Fixed**, **already fixed** (R1), or **deferred** (I20 wrappers, I25 indent) with justification |
| Expert C-01…C-07 | **Fixed** |
| Expert M-01…M-03 | **Residual / global** (id, SectionView demos map, RichText) — out of section scope |
| Expert G-01, G-02, O-01 | **Fixed** |
| Expert G-03 / glossary density | **Mitigated** (split dictionary) |
| Expert P-02 hint/hints[0] | **Residual** (platform dual-field pattern; renderer prefers `hints[]`) |
| Spanish-quality actionable | Checked; score **10.0** with `--no-lt` (was 8.25 with LT noise) |

### 4.2 Code execution

| Suite | Result |
|-------|--------|
| Theory demos (8) | **8/8** code↔output match |
| I Do demos (8) | **8/8** match |
| We Do solutionCode (24) | **24/24** match |
| **Total** | **40/40** pass |
| Forbidden tokens (`Sucursal-`, `Oficina-`, `Cliente-A/B`, V3 meta, `supposed`, `# DEFECT`, bare `vs`) | **0** |

### 4.3 Spanish quality

| Metric | Before (fleet JSON) | After R2 (`--no-lt`) |
|--------|---------------------|----------------------|
| quality_score_0_10 | 8.25 | **10.0** |
| FH mean | 84.6 | 84.6 |
| findings_total | 113 (many LT FPs on API tokens) | 17 (structure/orthography residual noise on code-adjacent strings) |

### 4.4 Markdown / live / accessibility

- **Platform Markdown leak** (raw `**` in callout/jobRelevance/etc.): still repository-wide in `SectionView.tsx` — **not fixed here**.
- Live SPA still hydrates client-side; content pipeline = this TS source.
- Previous/next continuity: S16 calidad/contratos → S17 joins/groupby → S18 EDA/incertidumbre preserved in map and portfolioNote.
- Accessibility: plain-text code outputs; no new image alts required.

### 4.5 Assessment integrity

- selfCheck 5 MCQs unchanged (validate, anti-join, transform, leakage, reconciliation) — keys still valid; indices not reshuffled.
- You Do `portfolio_summary` contract keys unchanged; starter fixture regions only.

### 4.6 Anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (Python execute-and-diff, Spanish-quality measurement, grep).

---

## 5. Residual risks and later recommendations

### Section-local residuals

- **I20:** `s17_th_*` / `s17_ido_*` wrappers — mild extraneous load; optional flatten later.
- **I25:** single-space TS object indent — maintainability only.
- **hint == hints[0]** dual field (Expert P-02) — dead data if renderer prefers array; global schema cleanup.

### Repository-wide / deferred (do not fix in this PR)

1. **`id: "packaging"`** + filename `s17-packaging.ts` + URL `#packaging` — needs coordinated migration (progress keys, demos map, PdfReport).
2. **SectionView `demos['packaging']`** still loads semver playground (Expert M-02) — Global Agent / platform PR.
3. **RichText rendering** for callout/jobRelevance/instruction/feedback (Expert M-03) — Global Agent A.
4. Optional: intermediate multi-step We Do join→groupby→reconcile before You Do (Explorer I19 density) — content expansion, not integrity.

### Adjacent sections

- No edits to S16 or S18. Forward handoff language to S18 retained.

---

## 6. Updated Graph Memory notes

| Node | Update |
|------|--------|
| Section 17 | Joins / reshape / groupby / cierre CP-N2-A portfolio |
| Concept nodes corrected | Cardinalidad, fan-out, anti-join, long/wide, groupby agg vs. transform, tabla puente, cutoff/leakage |
| Prerequisite edges | S15 typed ingest · S16 contracts/dtypes before merge |
| Forward edges | S18 incertidumbre / hallazgo vs. hipótesis on clean tables |
| Strengths retained | validate gate, anti-join evidence, T4-B-E3 mini-integration, domain rubric, synthetic PE context |
| Resolved defect nodes | Fabricated T3-A/T4-A outputs; region scramble; bare `vs`; English tagline |
| Remaining risks | Legacy id packaging; SectionView demos + RichText |
| Compatibility | Keep `packaging` id / progress / exam routing keys |
| Assessment coverage | Quiz still light on melt/pivot/cohort (acceptable length; documented gap) |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s17-packaging.ts` | Only product content edit: code↔output integrity, PE regions, Spanish polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S17_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S17.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S17 |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S17.md` (full)
- `expert_audit/worklog.md` (append pointer Task ID: **FIXER-R2-S17**)

---

Section 17 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
