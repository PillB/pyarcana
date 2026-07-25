# S18 Round-2 Fixer Report — EDA, estadística descriptiva e incertidumbre

**Generated:** 2026-07-25  
**Role:** Second-round Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Task ID:** FIXER-R2-S18  
**Section:** 18 · platform id `data-engineering` (routing only; not narrated to learners)  
**Title:** EDA, estadística descriptiva e incertidumbre  
**Canonical source (only file edited):** `src/lib/course/sections/s18-data-engineering.ts`  
**Live route:** https://pillb.github.io/pyarcana/#data-engineering  

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| Index | 18 |
| Internal id | `data-engineering` |
| Short title | EDA e incertidumbre |
| Canonical file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s18-data-engineering.ts` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S18_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S18_report.md` |
| Expert 2 (optional) | `expert_audit/expert_2_audit/Section 18 Quality Audit.docx` (noted; not copied) |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S18_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 fixer report (context) | `course-state/curriculum_hardening/audits/fixer_reports/S18_FIXER_REPORT.md` |
| Assessments | `selfCheck` embedded in canonical source (8 MCQs); no separate question-bank file for S18 |
| Validation | Independent Python execution of theory / I Do / 24 solution codes |

**Structure inventory (preserved):** map + 8 theory subtopics · 8 I Do demos · 24 We Do · You Do portfolio · 8 selfCheck · resources.

---

## 2. Summary of changes applied

### 2.1 Pre-round reality check

Round 1 had already closed most Explorer meta-leaks (V3 retheme text, Prefect/GE map, spoiled pass-strings, heading capitalization, icon `BarChart3`, bootstrap/Spearman practice path, expanded selfCheck).  

**Round-2 residual blocker:** a failed / incomplete region-label restore left **pseudonymization drift** (`Cliente-*`, `Sucursal-*`, `Oficina-*`) so that **code keys, prose, and `output` blocks disagreed**. Expert report I-01…I-11 remained **active** in the current tree despite Round-1 claims. This is the high-risk class named for S18 in the campaign (fabricated outputs after synthetic renames).

### 2.2 Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Explorer 01–05, 10–11, 20 | Explorer / R1 | Already fixed | Confirmed: no V3/platform-id/Prefect meta; student map; rubric observable; resources clean; `BarChart3` | Grep zero residual meta |
| Explorer 06–08, 12–14, 17, 19, 21–22 | Explorer / R1 | Already fixed | Confirmed: no pass-string dumps; no oráculo jargon; transfer scaffolds; concept feedback | Manual read of We Do grid |
| Explorer 09 + Expert I-01 | Theory T2-A | **Active** | Restored Lima/Arequipa/Cusco in `pob`/`muestra`; `bias_pp` +0.25 for Lima; output aligned | Python exec |
| Expert I-02 | Theory T3-B | **Active** | Regions Lima/Arequipa; rates `{Arequipa:0.2, Lima:0.0}`; narrative aligned | Python exec |
| Expert I-03 | Theory T4-A | **Active** | QHE pregunta/métrica/output all “Lima”; prose coherent | String equality code↔output |
| Expert I-04 | I Do T2-A | **Active** | Matching pob/muestra keys; share 0.7/0.2/0.1; max bias 0.2 | Python exec |
| Expert I-05 | I Do T3-B | **Active** | Lima/Arequipa/Cusco; sum/mean dict coherent | Python exec |
| Expert I-06 | I Do T4-A | **Active** | pregunta + resultado Lima/Cusco aligned | Code↔output |
| Expert I-07 | I Do T4-B | **Active** | Regions Lima/Arequipa/Cusco; `sha1_8` = `07e9d521` | hashlib exec |
| Expert I-08 | We Do T2-A-E1 | **Active** | Same muestra in starter/solution; count Lima → `share_Lima 0.75`; “e imprímela” | Python + grammar |
| Expert I-09 | We Do T2-A-E3 | **Active** | Fixture Lima 9 / Arequipa 1 vs pob 0.5/0.5; `.get(k,0)`; output `0.4` | Python exec |
| Expert I-10 | We Do T3-B-E2 | **Active** | region/flag/instruction/hints/feedback all Lima; `tasa_Lima 1.0` | Python exec |
| Expert I-11 | We Do T4-A-E3 | **Active** | Starter + solution + output: `P: ticket mediano Lima` | Python exec |
| Expert I-14, I-15 | Grammar | **Active** | y→e before “imprímela”; o→u before “otra” | Manual edit |
| Expert I-16 | Grammar | Partial | Prose `vs` → `vs.` in descriptions/rubric/paragraphs | Grep |
| Expert I-18 | Grammar | **Active** | Hint prose “parámetro límite” (code id `limite` unchanged) | Manual |
| Expert I-19 | Structure | **Active** | Split T2-B-E3 bootstrap instruction into shorter sentences | Manual |
| Expert I-21/I-22/I-23 | Spanish | Partial | “nota de datos”, “d de Cohen”, “valor p”, “afirmación” vs claim; first-use gloss | Manual |
| Expert I-24 | You Do | **Active** | Comment clarifies variable `se`; no `print("TODO")` | Manual |
| Expert I-25/I-26 | SelfCheck | **Active** | Q5 Lima/Cusco + monto/visitas; Q7 Cusco stem and fraud option same region | Manual |
| Expert I-27 | Callout | **Active** | “Sin afirmación causal” | Manual |
| Expert I-29 | You Do context | **Active** | “fintech peruana” not Cliente-A as company | Manual |
| Explorer 04/15 You Do | You Do starter | Residual labels | Regions + pob Lima/Arequipa/Cusco; bias checkpoint works | Manual + logic |
| Explorer 18 | T4-B-E2 | Already fixed R1 | Reconfirmed `chr(10)` payload → `2aa26ec9` | hashlib |
| Expert I-12 | Platform id | **N/A (global)** | id/filename kept for progress URL compatibility | Documented residual |
| SQ long sentences / CASING | Spanish JSON | Mixed | High-severity conceptual sentences shortened where pedagogical; LT UPPERCASE on code tokens left as FP | Manual judgment |

### 2.3 Domain fixture policy (this round)

All learner-facing region labels restored to **Lima / Arequipa / Cusco** (Explorer “keep” domain flavor; Peruvian place names only; no real PII). Print keys such as `claim` / `sin_claim_causal` remain **code identifiers**, not Spanish prose.

---

## 3. Full corrected content / diffs (summary)

Authoritative content lives in `s18-data-engineering.ts`. Representative GitHub-style hunks:

### Diff A — Theory T2-A sample bias (Expert I-01)

```diff
- pob = {"Sucursal-Norte": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
- muestra = ["Sucursal-Centro"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
+ pob = {"Lima": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
+ muestra = ["Lima"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
- output: share_muestra {'Oficina-Este': 0.8, ...} bias_pp {'Cliente-A': 0.25, ...}
+ output: share_muestra {'Lima': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
+         bias_pp {'Lima': 0.25, 'Arequipa': -0.09, 'Cusco': -0.16}
```

### Diff B — Theory T3-B segments (Expert I-02)

```diff
- "region": ["Cliente-A"] * 5 + ["Cliente-B"] * 5,
+ "region": ["Lima"] * 5 + ["Arequipa"] * 5,
- output rates Sucursal-*
+ output {'Arequipa': 0.2, 'Lima': 0.0}
- callout title: Sin claim causal
+ callout title: Sin afirmación causal
```

### Diff C — Theory T4-A QHE (Expert I-03)

```diff
- pregunta = "¿El ticket mediano en Cliente-A supera 25 PEN?"
+ pregunta = "¿El ticket mediano en Lima supera 25 PEN?"
- metrica = "median(monto | region==Cliente-B)"
+ metrica = "median(monto | region==Lima)"
# output matches code exactly
```

### Diff D — I Do T2-A / T3-B / T4-A / T4-B (Expert I-04…I-07)

- Bias demo: pob and muestra share Lima/Arequipa/Cusco; output `0.7 / 0.2 / 0.1`, max_abs_bias_pp `0.2`.
- Tukey demo: groupby rates coherent for three regions.
- QHE demo: pregunta and hallazgo both Lima/Cusco.
- Data note demo: `sha1_8` = **`07e9d521`** for filtered CSV.

### Diff E — We Do blockers (Expert I-08…I-11)

- **T2-A-E1:** `muestra = ["Lima","Lima","Lima","Arequipa"]`; fix count to Lima → `0.75`.
- **T2-A-E3:** `max_bias({"Lima":0.5,"Arequipa":0.5}, {"Lima":9,"Arequipa":1})` with `.get` → `0.4`.
- **T3-B-E2:** filter `region == "Lima"`; instruction/hints/feedback agree.
- **T4-A-E3:** `traza("ticket mediano Lima", ...)` starter = solution = output.

### Diff F — You Do / selfCheck / Spanish polish

- Context: fintech peruana (not Cliente-A as employer).
- Starter regions and `pob` quotas Lima/Arequipa/Cusco; IC scaffold comment clarifies `se`; no `print("TODO")`.
- SelfCheck Q5/Q7 region and variable consistency; “d de Cohen”; “nota de datos”.
- Prose: vs. · valor p · afirmación causal · portafolio · nota de datos (first-use gloss in T4-B).

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue disposition

| Class | Result |
|-------|--------|
| Explorer 01–22 | **Fixed** or **already fixed** (R1) and reconfirmed; none silently ignored |
| Expert I-01…I-11 (code↔output) | **Fixed** |
| Expert Spanish I-14…I-29 (actionable) | **Fixed** or intentionally partial (anglicisms kept where industry-standard: bootstrap, ticket, IQR) |
| Expert I-12 platform id | **Residual / global** — do not rename without migration plan |
| Spanish-quality LT UPPERCASE / MORFOLOGIK on code tokens | **False positives** for identifiers |
| Markdown `**` in jobRelevance | **Global platform residual** (SectionView RichText) — not section-local |

### 4.2 Mechanical validation

| Check | Result |
|-------|--------|
| 24/24 `solutionCode` exec vs declared `output` | **PASS** (0 mismatches) |
| Theory T2-A / T3-B / T4-A / T4-B + I Do demos re-run | **PASS** |
| T4-B-E2 sha1[:8] | **`2aa26ec9`** |
| I Do T4-B sha1[:8] | **`07e9d521`** |
| Residual meta strings (retematiza, gate V3, Prefect, oráculo, np.str_) | **0** |
| Residual Cliente-/Oficina- labels | **0** |
| Spanish-quality numeric re-run | Not re-run as gate (script may only validate; content was hand-edited) |

### 4.3 Anti-aberration statement

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content.** Automation was used only for mechanical validation (Python execute-and-diff of existing code and expected outputs).

### 4.4 Live / accessibility / continuity

- Live SPA still hashes `#data-engineering` (id preserved).
- Continuity S17 (CP-N2-A) → S18 (CP-N2-B start) → S19 (dashboard) retained in map, intros, You Do.
- Accessibility: no new dense walls; long instructions split where flagged; ethics spine preserved.

---

## 5. Residual risks and later recommendations

| Residual | Type | Recommendation |
|----------|------|----------------|
| `id: "data-engineering"` + filename | Platform / compatibility | Global Agent C migration with aliases; never narrate id to students |
| `**bold**` in jobRelevance if rendered raw | Global SectionView | Global Agent A RichText |
| Some exercise instructions still say “starter” / “bug” | Style (acceptable PE analytics register) | Optional later polish |
| Authenticated multi-variant exam bank | Out of section pattern | Course-wide assessment agent if banks expand |
| Expert-2 DOCX | Secondary | Not applied blindly; no contradiction requiring extra edits after source inspection |

---

## 6. Updated Graph Memory notes

```
[S17:CP-N2-A clean+limits] --edge--> [S18:EDA+uncertainty CP-N2-B start]
[S18:DataNotes] --edge--> [S19:Accessible dashboard]
[S18:Regions] --aligned--> Lima/Arequipa/Cusco (code + prose + outputs)
[Defect:pseudonym-drift I-01..I-11] --resolved--> [Trusted demos/exercises]
[Meta:V3/Prefect/platform-id] --resolved-in-prose--> [Still in routing id only]
[Practice:bootstrap] --present--> theory + I Do + We Do T2-B-E3
[Practice:Spearman] --present--> theory + I Do + We Do T3-A-E2
[Ethics:no-causal/no-fraud] --retained--> all T3/T4 + selfCheck
[Compat:id=data-engineering] --constraint--> progress keys / live hash
```

**Retained strengths:** ethical spine; 8× theory + 8× I Do + 24× We Do grid; Q→H→E template; synthetic PEN tickets; Think Stats / OpenIntro resources.

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s18-data-engineering.ts` | Only learner-facing source for S18: code↔output integrity, region coherence, Spanish polish, You Do/selfCheck fixes |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S18_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S18.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S18 |

No other section files, no SectionView.tsx, no global platform edits.

---

## 8. Worklog confirmation

- Full entry written to: `expert_audit/worklog_entries_r2/S18.md`
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S18**

---

Section 18 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
