# S12 Fixer Report (Round 2) — APIs, SQL y geodatos responsables

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S12  
**Scope lock:** Section 12 only (`id: performance`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s12-performance.ts`  
**Live:** https://pillb.github.io/pyarcana/#performance  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **12** |
| Title | APIs, SQL y geodatos responsables |
| shortTitle | APIs · SQL · Geo |
| Internal id | `performance` (legacy slug; deferred rename) |
| Canonical file | `src/lib/course/sections/s12-performance.ts` |
| Live route | `#performance` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S12_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S12_report.md` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S12_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Expert 2 audit | `expert_2_audit/deep-research-report-12.md` (off-topic: modules/packages — not used as evidence for this section) |
| Assessment | In-section `selfCheck` (7 MCQs); You Do CP-N1-C starter with DEFECT stubs |
| Validation | Hand re-execution of theory / I Do / We Do solution code↔output; `scripts/spanish_quality_audit.py --from 12 --to 12 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Explorer (older pass) flagged heavy V3 meta-leaks and garbled We Do instructions. **Current source already had those scrubbed** (dictionary map, clean E-instructions, aligned retry N1 policy, SQL theory/iDo oracles).

Expert report + execute-and-diff found the **still-active P0 class**: inconsistent synthetic place labels (`Sucursal-*` / `Oficina-*` / `Cliente-*`) across starter / solution / `output` / `Salida/pass`, with **fabricated or crashing demos** in theory T4-A, I Do T2-B, I Do T4-A, and We Do T1-A-E1/E2, T4-A-E2 (starter KeyError). Round 2 treated integrity as **still active** and fixed it by hand with a canonical PE place vocabulary: **Lima, Arequipa, Callao, Cusco, Iquitos**.

Spanish-quality (fleet 7.7) and grammar subplan drove noun `caché`, `autoetiqueta`, `y`→`e` before *imprime*, `vs.`, run-on splits in `jobRelevance` / You Do, and related polish.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I-01 / I-02 / I-04 map & jobRelevance meta | Explorer | Already fixed (R1) | Re-verified: no V3/reubicado/id de plataforma | Grep 0 |
| I-03 / I-04 / I-10 / I-25 We Do garbled template | Explorer | Already fixed | Re-verified short gold-form instructions | Manual |
| I-05 / I-06 / I-08 / I-09 SQL oracles | Explorer | Already fixed | Re-exec theory T3-A/B + iDo demos | PASS |
| I-07 provenance iDo | Explorer | Already fixed | Re-exec `provenance_demo.py` | PASS |
| Expert #1 theory T4-A mock_geocode | Expert | **Active** | TABLE Lima/Arequipa; geocode("lima") → Lima; honest output | Exec PASS |
| Expert #2 iDo T4-A-DEMO | Expert | **Active** | DB + loop Lima/Arequipa/Iquitos; output aligned | Exec PASS |
| Expert #3 iDo T2-B-DEMO KeyError | Expert | **Active** | PRECALC["Lima"]; all calls use Lima | Exec PASS |
| Expert #4 T1-A-E1 four-name drift | Expert | **Active** | region **Lima** in instruction/starter/solution/output | Exec PASS |
| Expert #5 T1-A-E2 four-name drift | Expert | **Active** | region **Lima** everywhere | Exec PASS |
| Expert #6 T4-A-E2 broken starter + drift | Expert | **Active** | Lima/Arequipa DB; DEFECT always Lima; Cusco → None | Exec PASS |
| Expert #7 T4-A-E3 label drift | Expert | **Active** | Lima labels on starter + solution | Exec PASS |
| You Do / portfolio pseudo labels | Residual | **Active** | MockGeocoder + store + egress + portfolio Lima/Arequipa/Callao | Manual |
| I-11 dictionary / connective map | Explorer | Already present | Minor: cache→caché in map prose | Manual |
| I-12 / Expert #19 id `performance` | Explorer + Expert | Deferred | No rename (progress/hash compat) | Residual platform |
| I-16 retry policy alignment | Explorer | Already fixed | N1 {429,503}; 500 fail_server | Self-check + E3 |
| I-17 normalize without .title() | Explorer | Already aligned | Theory + E1 + weDo intro | Manual |
| I-21 selfCheck breadth | Explorer | Already improved (7 Q) | Pagination + TX items present | Manual |
| I-22 / I-23 resources & gloss | Explorer | Already fixed | Re-verified; resources note public | Manual |
| Expert #8 APIs → API | Expert | Active | learningOutcomes[0] | Manual |
| Expert #9 caché noun | Expert + SQ | Active | Headings, feedback, objectives, rubric, selfCheck option | Grep |
| Expert #10 autoetiqueta | Expert | Active | callout + iDo T4-B description | Grep |
| Expert #11 y → e imprime | Expert | Active | T3-A-E1, T3-A-E3 instructions | Manual |
| Expert #12 vs. | Grammar plan | Active | `vs.` in T1-B + iDo T2-B | Manual |
| Expert #13 1..5 | Expert | Active | “items del 1 al 5” | Manual |
| Expert #15–17 run-ons | Expert + SQ | Active | jobRelevance split; youDo.context split; iDo intro lightly tightened | Manual |
| Expert #14 Coordenadas basura | Expert | Stylistic | → Coordenadas inválidas | Manual |
| SQ medium inverted-? on `?` SQL | Spanish quality | False positive | Documented residual | N/A |
| Global RichText markdown leak | Cross-cutting | Platform | Not edited (SectionView out of scope) | Residual platform |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s12-performance.ts`

Substantive hand-edits (not a bulk rewrite):

### Integrity — canonical place vocabulary (Lima / Arequipa / Callao / Cusco / Iquitos)

- **Theory T4-A `mock_geocode.py`:** `TABLE = {"Lima": …, "Arequipa": …}`; output `city: 'Lima'` (was Oficina-Este / None).
- **I Do T2-B `geocoder_contract_demo.py`:** `PRECALC["Lima"]`; online/fallback/contract all use Lima (was KeyError on Sucursal-Centro / Oficina-Este).
- **I Do T4-A `mock_cities_demo.py`:** loop Lima, Arequipa, Iquitos with matching DB and output.
- **We Do T1-A-E1 / E2:** instruction, starter, solution, output all use `region: "Lima"`.
- **We Do T4-A-E2:** starter DEFECT always returns Lima coords (no KeyError); solution lookup Lima/Arequipa; Cusco → None.
- **We Do T4-A-E3:** both cases use city Lima.
- **You Do starter / objectives / requirements / portfolioNote / rubric:** Lima/Arequipa/Callao; caché wording.

### Spanish / redaction (hand)

- `jobRelevance`: split opening run-on; “del Perú”.
- Noun **caché** in learner-facing prose (not verb `cachear` / not identifier `cache_hit` / not class name `Cache`).
- `APIs` → `API` in first learning outcome (sigla invariable).
- `auto-etiqueta(s)` → `autoetiqueta(s)`.
- `y imprime` → `e imprime` (×2).
- `vs` → `vs.` in Spanish prose.
- `1..5` → `del 1 al 5`.
- You Do context: two sentences (HTTP/caché/provenance then SQLite + MockGeocoder).
- Coordenadas inválidas; selfCheck distractor “Borrar el caché”.

Representative integrity fix (theory T4-A):

```diff
 class MockGeocoder:
     TABLE = {
-        "Sucursal-Centro": (-12.0464, -77.0428),
+        "Lima": (-12.0464, -77.0428),
         "Arequipa": (-16.4090, -71.5375),
     }
 ...
-geo {'city': 'Oficina-Este', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}
+geo {'city': 'Lima', 'lat': -12.0464, 'lon': -77.0428, 'provider': 'mock'}
```

---

## 4. After-Fix Validation Report

| Check | Result |
|--------|--------|
| Theory + I Do critical blocks (16 incl. list/paginate demos) | **PASS** (stdout == declared `output`) |
| All 24 We Do `solutionCode` + `output` | **PASS** (24/24) |
| Residual Sucursal-/Oficina-/Cliente-A/B tokens | **0** |
| Meta-leak V3 / reubicado / retematiza / Performance & concurrency | **0** learner-facing |
| Spanish-quality `--no-lt` before (fleet snapshot) | **7.7** / 75 findings |
| Spanish-quality `--no-lt` after | **9.15** / 23 findings (mostly FP: `?` as question mark, short hints) |
| Fernández-Huerta mean after | **87.1** (fácil) |
| Assessment keys selfCheck | Unchanged correctIndex distribution; 7 questions intact |
| Markdown **bold** in jobRelevance/callouts | Still raw if platform does not use RichText (global) |
| Previous/next continuity | S11 domain tables / S13 dashboard hooks preserved |

**Issue-by-issue disposition:** all Explorer P0/P1 content issues fixed or confirmed already fixed; all Expert HIGH integrity issues fixed; Spanish medium/high actionable items fixed or FP-documented; platform id rename deferred.

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

| Residual | Kind | Recommendation |
|----------|------|----------------|
| `id: "performance"` + filename `s12-performance.ts` | Platform / compat | Global identity migration with aliases (progress keys, demos map, PdfReport) — **not** section-local |
| SectionView RichText for jobRelevance / callouts / instructions | Platform | Global Agent A |
| Self-check “Borrar el caché” still a weak distractor | Section-local low | Optional stronger distractor later |
| SQ false positives on SQL `?` and short hints | Tooling | Ignore or tune audit script |
| E3 dict-fill theater (status_action / operation_mode) | Pedagogy low | Acceptable micro-skills; optional richer transfer later |
| Expert-2 deep-research-report-12.md | Out of scope | Wrong topic (modules/packages); do not apply |

---

## 6. Updated Graph Memory notes

- **Section node:** S12 `performance` → learner title APIs/SQL/Geo (compat id retained).
- **Corrected concept nodes:** `MockGeocoder.lookup` honest; `contract.fallback` non-crashing; We Do region/city labels coherent; PE place graph Lima↔Arequipa↔Callao↔Cusco↔Iquitos.
- **Prerequisite edges:** S11 domain names (`clients`/`transactions`/`evidence`) unchanged.
- **Forward edges:** S13 dashboard + `relationship_signal_score`; signal ≠ kinship retained.
- **Retained strengths:** GRR 8×3 DEFECT We Do, N1 retry policy, egress allowlist, parameterized SQL, Haversine ethics.
- **Resolved defect nodes:** pseudonymization-fabricated geo/HTTP outputs; starter KeyError on T4-A-E2.
- **Remaining risks:** platform id drift; RichText.
- **Assessment coverage:** status retry, secrets, SQL injection, egress, kinship, pagination, atomic rollback.

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s12-performance.ts` | Only product edit: integrity + Spanish/redaction |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S12_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S12.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S12 |
| `course-state/curriculum_hardening/audits/spanish_quality/S12_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S12.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S12**)

---

Section 12 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
