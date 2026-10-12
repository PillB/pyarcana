I've completed the sweep. Here is the adversarial report.

## Verdict up front

Two of the three insertions are **largely redundant with content that already exists** (S18 already teaches intervals, bootstrap, effect size, selection bias, confounding, counterfactuals and randomization; S33 T2 already teaches "regresión/logística y regularización"). And the renumber has a **credential-issuance path that corrupts silently**. I'd recommend against executing this plan as scoped — see §F.

---

# A. SILENT CORRUPTION — ranked

## A1. Credential issuance re-points to the wrong sections, silently, on a live route

`src/lib/credential-gates.ts:40-48`
```ts
export function requiredSectionIds(spec: BadgeSpec): string[] {
  return spec.required_sections.map((tag) => {
    const match = /^S(\d{2})$/.exec(tag)
    const section = match && COURSE_SECTIONS.find((s) => s.index === Number(match[1]))
    if (!section) throw new Error(`${spec.badge_id}: section ${tag} is not in COURSE_SECTIONS`)
```
This resolves `badge_catalog.json`'s `required_sections` **numbers** → section **slugs** via `index`, and it is what `/api/credentials/issue` gates on. All 31 badge specs carry number tags (`src/lib/eligibility/badge_catalog.json`), duplicated again in 31 files under `src/lib/eligibility/claim_evidence_contracts/`.

Concretely, if `badge_catalog.json` is not rewritten:
- `evidence_grounded_ai_systems_capstone` requires `["S52"]` → after the shift S52 is **old S49, "Agentes, herramientas y context engineering"**. The *final capstone credential* is issued on the wrong section's exam.
- `integrated_python_ai_capstone_integrated_mastery` requires `S40–S51` → resolves to old S37–S48.
- `applied_sql_query_development` requires `["S19","S37"]` → S19 becomes the **new inference section**. A learner earns an "Applied SQL Query Development" badge without ever touching the ORM/SQL section.
- `progress_journey_completed` requires `S01…S52` → a learner who finishes 52 of 55 sections is handed "journey completed", and S53/S54/S55 are required by *no* badge.

**Why it's silent:** the `throw` only fires for a number with *no* section. Shrinking the referenced range never trips it. The engine (`src/lib/eligibility/engine.ts:596,610,624,669`) treats `${section}-YOUDO/-EXAM/-SELFCHECK` as opaque strings. No test cross-checks `required_sections` against titles or content — `tests/adversarial/test_claim_evidence_contracts.py:28` only asserts the *field exists*, never that the two copies agree with each other or with the curriculum. `scripts/badge_readiness_audit.py:93-96` has an `UNKNOWN_REQUIRED_SECTION` check, but it is **not run in CI** (`.github/workflows/tests.yml` runs only `glossary_intro_audit`, `glossary_coverage_audit`, `python_content`, `test:v3`).

This is also an AGENTS.md *ask-first* item: `AGENTS.md:93` — "Changing what a credential claims (`badge_catalog.json`)".

## A2. Three number-keyed regression guards silently detach from the content they protect — and stay green

`tests/adversarial/test_late_curriculum_transfer_contract.py`
```python
14:        for number in range(31, 40):
29:        text = active_sections()[33].read_text(encoding="utf-8")
34:        text = active_sections()[39].read_text(encoding="utf-8")
```
Docstring: *"Pedagogy regressions found by the independent S14-S39 Fixer review."*

After the shift, `active_sections()[33]` is **old S31** (Grafos y evidencia relacional), not old S33 (ML supervisado). The test asserts `assertNotIn("Tres prints finales", text)` — trivially true on a graph section, so it **passes while protecting nothing**. Old S33 is now S36 and can re-acquire the defect freely. Same for `[39]` (now old S36) and for the `range(31,40)` window, which drops old S37–S39 out of coverage and silently pulls the brand-new S35 in.

This is the single worst *test-side* silent failure: the suite stays green and three documented pedagogy regressions become unguarded.

## A3. The learner-facing PDF/certificate labels carry hardcoded numbers with no numeric gate

`src/components/course/PdfReport.tsx:61-115` — a hand-written slug → `"NN. Label"` map:
```
"databases-orm": '19. DB/ORM',
rag: '20. RAG',
...
"career-strategy": '52. Career',
```
I verified all 52 numeric prefixes currently match `index` exactly (0 mismatches). The only gate is `src/lib/progress-document.test.ts:175`:
```ts
assert.deepEqual(Object.keys(SECTION_NAMES), COURSE_SECTIONS.map((s) => s.id))
```
That checks **keys and order** — loud if you forget to add the 3 new slugs. It never looks at the **value**. So the progress record and the completion certificate would print `19. DB/ORM` for what is now S21, for all 34 shifted sections, and CI is green.

## A4. 44 external-resource tags re-point to unrelated sections

`src/components/course/ResourcesPage.tsx:1611-1614`
```ts
export function sectionIndexOfTag(tag: string): number | null {
  const match = /^s(\d{2})-/.exec(tag)
  return match ? Number(match[1]) : null
}
```
The comment explicitly says *"Only the number is read."* 127 tags in the catalogue; **44 point at sections ≥19**. Renumbering without rewriting the tag prefixes moves Matplotlib/Seaborn docs under "Inferencia", RAG docs under "Excel", etc.

`tests/adversarial/resources-section-filter.test.ts:63-71` derives its expectations from the same tags it tests (`prefix = s${index}-`), so it is self-consistent under any wrong renumber and will **pass**.

## A5. 76 figure ids become section-mismatched with no gate

117 figures are attached across the active curriculum; **76 live in sections ≥19**. Ids encode the section (`S32-leakage`, `S36-rolling-origin`, `S46-event-time`), as do component files (`src/components/course/figures/S31EvidenceGraph.tsx`, `S32Leakage.tsx`, `S36RollingOrigin.tsx`, `S46EventTime.tsx`), the registry (`src/components/course/figures/index.tsx:58-72`) and the data entries (`figures/data/graphs.ts`, `flows.ts`).

`tests/adversarial/figure-data-schema.test.mjs` is the gate, and its own docstring (lines 5-7) claims to catch *"put S16's null-policy diagram in S03"*. It does **not**. It checks only: no figure attached twice (41-48), every attached id renders (50-58), caption/alt length (64-77), no orphan data entries (92-100). **There is no assertion that a figure's `SXX-` prefix matches its host section.** I verified 0 mismatches today — so the invariant holds de facto and is completely unenforced. Renumber the sections but not the figure ids (or vice versa) and nothing fails.

## A6. 711 authored cross-section prose pointers, and S18→S19 is a load-bearing one

Measured on the 52 active files: **2,166 non-structural `S<n>` references**, of which **1,598 point at sections ≥19** and **711 are cross-section** (not self-references). These are teaching prose, code filenames and heading text:

- `src/lib/course/sections/s18-data-engineering.ts` — *"es la base de trazabilidad hacia S19–S21"*, *"En S19 ese paquete alimenta el dashboard accesible"*, *"# Hilo S17 → S18 → S19"*, *"alimenta dashboard y reportes en S19–S21"*
- `src/lib/course/sections/s17-packaging.ts:1607,1656` — *"en S18 trabajarás la lectura de incertidumbre"*
- `src/lib/course/sections/s19-databases-orm.ts:48` — heading *"Fuera de alcance en S19"*; code file `s19_map_contract.py`; function `def s18_th_3()` in S18
- `prisma/seed.ts` — exam explanations: *"OOP de dominio llega en S11, no aquí"*, *"según S05"*, 25 references each to S12/S13

A renumber script that targets `index:` and structural ids leaves every one of these wrong, pointing learners at the wrong lesson. A blanket `S\d\d` rewrite is worse: it would corrupt the 568 references to S01–S18 that must *not* move, and would rewrite `S19-T1-A-E1` ids correctly but `def s18_th_3()` incorrectly.

`src/lib/qa-tour-content.ts:85` is the sharpest case — a *counted distance*: *"«PII» aparece por primera vez en S01 y el glosario recién la explica en S30, veintinueve secciones después."* After the shift that is S32, thirty-one sections later. The number is spelled out in Spanish words.

## A7. `concept_map.json` — 11,096 of 17,609 "uses" point at sections ≥19, plus derived distance metrics

`course-state/concept_map.json`: 108 concepts. Each use is dual-keyed:
```json
{"section": "S02", "location": "basics.S02-T2-A.p1", "kind": "theory.paragraph"}
```
and each concept carries derived fields `first_use`, `explanation_lag_sections`, `sections_used`, `reinforcements`, `depth`, `figure_gap`. `explanation_lag_sections` is a *section-count distance*: inserting 3 sections changes its value without any content changing. The cache does go stale correctly (`tests/adversarial/test_concept_map_cache.py`), so regeneration is forced — but the regenerated numbers then collide with the exact-equality ratchets in `test_concept_depth_ratchets.py:83-93` (`NEVER_EXPLAINED_OWED = 7`, `UNEXEMPLIFIED_CONCEPTS_OWED = 35`, `FIGURES_OWED = 274`, `FIGURE_TARGET_FLOOR = 312`, `D3_SUBTOPIC_OWED = 30`). Those will fire *loudly*, which is good, but every one of the five baselines then has to be re-argued — and a reviewer cannot tell "moved because 3 sections were inserted" from "moved because content regressed."

## A8. Two copies of the protected roadmap, gated by two different suites, that can satisfy both while diverging

`learning_roadmap_52_V3.md` and `upload/learning_roadmap_52_V3.md` are **byte-identical today** (verified by diff).

- `tests/adversarial/test_active_v3_curriculum_contract.py:24-29,45` reads the **root** copy and requires exactly 52 `### S<n> — Title` headings.
- `scripts/v3_regression.spec.ts:309,315` reads the **upload/** copy and requires exactly 52 headings — and it is **not in CI** (only in `test:all-gates` / `test:layout:playwright` per `package.json`).

So: update root to 55, leave `upload/` at 52, and the CI gate is satisfied while the repo holds two contradictory "authoritative" curricula, the stale one still referenced by a regression spec. Note also the heading format is `### S19 — …`, **not** `### S19` zero-padded — any migration regex written against `SXX` will miss all 52.

## A9. `section_ledger.json` holds the number and the slug side by side

`course-state/section_ledger.json` — 52 entries of the form:
```json
{"id": "S19", "section_id": "databases-orm", "level": 2, "state": "passed", ...}
```
Update one field and not the other and the production-readiness ledger misattributes 34 sections. Its only gate is `scripts/v3_regression.spec.ts:74-109` (`sections` length 52, numbered S01…S52) — **not in CI**.

## A10. Artifacts that self-certify counts and are never regenerated in CI

| Artifact | Hardcoded | Gate |
|---|---|---|
| `course-state/course_requirements.json` `invariant_vector` | `sections:52`, `sections_per_level:13`, `subtopics:416`, `demos:416`, `student_exercises:1248`, `topic_evaluations:208`, `exam_variants:1248`, `section_exams:52`, `section_project_increments:52` | `scripts/v3_regression.spec.ts:50-63` — not in CI |
| `course-state/interaction_catalog.json` `invariants` | `expected_sections:52`, `expected_demos:416`, `expected_exercises:1248`, and `ok` computed from them | `scripts/export_interaction_catalog.mjs:134-142` — run only by `test:e2e-max:catalog`, not in CI |
| `scripts/course_complete_gate.py:19,24,43-44` | `len(sections) == 52`, `len(caps) == 13`, key `sections_passed_52` | `test:course-complete` — not in CI |
| `capstone_validation/reality/section_capstone_mapping.json` | 52 entries, each with `level` + `contributesToCapstones` | `test_section_capstone_mapping.py` — **is** in CI (loud) |

`sections_per_level: 13` has **no correct value** under uneven levels. That is the same defect as the hardcoded `range(s, s+13)` you already found, in a committed invariant vector rather than a test.

## A11. `admin-analytics.ts` phase cutoffs (and an existing bug)

`src/lib/admin-analytics.ts:79,83-88`
```ts
phase: s.phase ?? (s.index <= 13 ? 1 : s.index <= 26 ? 1 : s.index <= 39 ? 2 : 3),
...
export function phaseForSectionIndex(index: number): 1 | 2 | 3 {
  if (index <= 13) return 1 // fundamentals treated as phase 1 band for UI
  if (index <= 26) return 1
```
Hardcoded 13/26/39. Under the new bands these must become 13/28/42 (and the N4/FINAL split has no representation here at all). The `<= 13 ? 1 : <= 26 ? 1` double-branch is pre-existing dead logic. `phaseMax` on `StudentMetrics` (line ~60) is derived from this, so cohort/admin analytics would mis-bucket every learner past section 26 — a reporting number, which nobody will notice is wrong.

## A12. The duplicated claim/contract pair can diverge with legal weight

`src/lib/eligibility/badge_catalog.json` (`required_sections`, `required_activities`) and `src/lib/eligibility/claim_evidence_contracts/*.json` (same two fields, 31 files) are independent copies. `credential-gates.ts` reads the catalog; the *published claim* is the contract. `test_claim_evidence_contracts.py:25-31` only checks field presence. Update one and the credential is issued on one basis while asserting another — and `specification_hash` is a literal string (`"sha256:ai_governance_code_review_practice:1.0.0"`), not a real digest, so it cannot detect the drift either.

## A13. Historical learner-simulation evidence keyed by number

`course-state/newbie_walkthrough/{attempt_002..007b, agentic_*}/section_NN/` — 8 attempt sets × 52 sections, 416 `selfcheck_key_meta.json`, plus `packets/section_52.json`. These are *evidence of past runs*. Rewriting the directory numbers falsifies evidence; leaving them silently misattributes every simulation past section 18. There is no third option and the plan has no position on it. `tests/adversarial/test_phrase_bank_sc_keys_gates.py:115` builds synthetic fixtures with `for s in range(1, 53)`.

## A14. 53 `docs/concept-map/SXX.md` files keyed by number

Generated by `scripts/concept_map.py:39`, consumed by `tools/fixer/build_concept_prompt.py:4` ("for the given section, every concept whose first…"). The fixer's per-section prompt would read the wrong section's concept inventory.

---

# B. LOUD failures (the ones that will actually stop you)

These are the good news, and they define the shape of the change.

1. **`EXERCISE_IDS_REMOVED` is unconditional and has no rename mechanism.** `scripts/preservation_sentinel.mjs:168-175` fails on *any* removed `S\d{2}-T\d-[AB]-E[1-3]`. Renumbering 34 sections removes **816** of them. `scripts/section_id_renames.mjs` handles **section** ids only. There is no `EXERCISE_ID_RENAMES` anywhere in the repo. **The gate cannot be made green without modifying the sentinel itself** plus its contract test (`tests/adversarial/preservation-sentinel-renames.test.mjs`).
2. **A slug rename and a renumber cannot happen in the same commit.** `scripts/section_id_renames.mjs:52-57`:
   ```js
   if (before.get(id) === undefined || after.get(target) !== before.get(id))
     return `${via}, which is section ${after.get(target)}, not section ${before.get(id)}`
   ```
   A rename is only accepted if the slug stays at the *same section number*. If you take the opportunity to fix the abandoned slugs (`security` → something about NumPy) while renumbering, the sentinel classifies it as a **deletion**.
3. `scripts/preservation_sentinel.mjs:159-162` — `ACTIVE_SECTION_COUNT_NOT_52`.
4. `tests/adversarial/test_active_v3_curriculum_contract.py:39,45` — `range(1,53)` on both index and roadmap; `:106-108` the `number == 52` hours exception and `h <= 20` cap (S55 carries 29h → fails); `:116-120` `per_level` vs `PHASES` `hours` and `totalHours: 491`.
5. `tests/adversarial/test_curriculum_preservation.py:37,47,61` — count 52, numbers `range(1,53)`, `len(all_ids) == 52 * 24`. Also `:65+` forbids deleting the 5 `INACTIVE_PRESERVED` legacy files (`s07-pandas.ts`, `s08-visualization.ts`, `s09-sklearn.ts`, `s10-testing.ts`, `s11-advanced-topics.ts`, which carry duplicate `index: 7..11`).
6. `tests/adversarial/test_section_capstone_mapping.py:33,35-40` — `EXPECTED_SECTIONS` 1..52 and `LEVEL_RANGES {1:(1,13),2:(14,26),3:(27,39),4:(40,52)}`; also asserts every capstone's `contributingSections` fall inside its level range.
7. `tests/adversarial/test_capstone_cardinality.py:44-52` — `EXPECTED_GATES` with literal `S04…S52`.
8. `tests/adversarial/test_forward_dependencies.py:86-89` — `capstone_starters()` **raises** if any `gate.json`'s `gate_section` tag is not an active section number. All 13 `course-state/capstones/*/gate.json` carry `"gate_section": "SNN"`.
9. `tests/adversarial/glossary-first-use-ratchet.test.mjs:44-46,76-90` — `DECLARED_LATE_OWED = 13`, `NEVER_APPEARS_OWED = 5`, **exact equality**. 109 glossary terms key `firstSectionId` on *slug* (immune to renumbering) but the ratchet surveys *position*. New inference/regression vocabulary appearing at new S19/S20/S35 will flip terms declared at `advanced-models` (S33) into "declared late". This is a real content gate and it will fire.
10. `scripts/v3_regression_counts.test.mjs:41,53` — imports/array entries must be 52 (in CI via `test:v3`).
11. `scripts/v3_invariant_validator.py:22,95-98` — `"sections": 52`, but only `if len(section_files) < 52` and it globs `s\d{2}-*.ts` (so it counts all **57** files including legacy orphans). Adding files never fails it. This one is **weak**, not loud.

---

# C. Insertion points — the strongest case against each

Real titles, read from the roadmap and the section files:

| | title |
|---|---|
| S17 | Joins, reshape, groupby y cierre analítico |
| S18 | **EDA, estadística descriptiva e incertidumbre** |
| S19 | Visualización y comunicación accesible |
| S32 | Feature engineering y pipelines sin leakage |
| S33 | **ML supervisado y baselines responsables** |
| S34 | Métricas, desbalance, calibración y umbrales |

## C1. "Inferencia: incertidumbre, intervalos y contraste" at S19 — mostly already taught in S18

S18 is not an EDA warm-up. `src/lib/course/sections/s18-data-engineering.ts:151-245` is subtopic **S18-T2-A "Población, muestra y sesgo"** and **S18-T2-B "Intervalos básicos y tamaño de efecto"**, and it already ships, with runnable code and pinned output:

- confidence interval `media ± z·(s/√n)`, with the correct caveat *"no significa «el 95% de los datos cae en el intervalo»"*
- a **bootstrap** (200 resamples, 2.5/97.5 percentiles) with the rule for when to prefer it
- **Cohen's d** effect size, and the language contract *"di «compatible con» / «en la muestra» y reporta n + IC; nunca «probado»"*
- selection bias against a population frame, with `bias_pp` per segment

Measured: 61 inference-term hits in S18 and **0 anywhere else in the course** except 3 incidental "bootstrap" in S10.

**The strongest case against:** the only genuinely missing piece is *contraste* — hypothesis testing. I grepped the whole active curriculum for `p-valor|p_value|contraste de hipótesis|prueba de hipótesis|significancia` and found **zero** matches in any section. That is roughly **one subtopic** of new material, not a 4-topic / 8-subtopic / 24-exercise / 8-demo section. Inserting a full section forces you to either re-author what S18 already says well, or hollow S18 out — and hollowing S18 out means removing exercise ids, which `preservation_sentinel.mjs:168` forbids outright.

**Second case against: it cuts a capstone in half.** `src/lib/capstones/catalog.ts:75` — `CP-N2-B` contributing `['S18','S19','S20','S21']`, gate `S21`. The roadmap's project lines are `S18: inicio CP-N2-B` → `S19: dashboard ejecutivo` → `S20: reporting factory` → `S21: cierre CP-N2-B`. S18's own prose hands the artifact forward explicitly: *"# Hilo S17 → S18 → S19"*, *"es la base de trazabilidad hacia S19–S21"*. Inserting two unrelated sections at position 19 turns a tight 4-section build into a 6-section arc with a 2-section interruption in the middle, and the two new sections have **no capstone increment** — which breaks `learning_roadmap_52_V3.md:28` *"Incrementos de proyecto | 1 | 13 | 52"*.

**A better slot, if you insist on inserting:** between **S17 and S18**. That is a clean capstone boundary — S17 closes CP-N2-A, S18 opens CP-N2-B — so no increment arc is split, and `CP-N2-A`/`CP-N2-B` `contributingSections` need no semantic reassignment beyond a shift. The cost is that inference then precedes EDA, which inverts the natural order. **The better option still is to split S18**: it carries **13 theory blocks against a course median of 10** (only S01 at 26, S02 at 15, S33 at 14 are denser), and `S18-T2-B` and `S18-T3-A` each carry *two* theory blocks for one subtopic — the authored content is already over-running its 8-subtopic frame. A split preserves the prose and only re-labels ids.

## C2. "Diseño experimental, estimandos y causalidad" at S20 — already taught, by name, in S18-T2-B

`s18-data-engineering.ts:248-260`, heading **"De la diferencia observada al experimento aleatorizado"**, teaches:
- the **counterfactual** (*"¿cuánto habría facturado este mismo comercio si no hubiera tenido el plan?"*)
- naming **unidad / tratamiento / control / resultado**
- the **estimand**, in so many words: *"fija la cantidad exacta que quieres estimar… Si no logras escribir esa cantidad en una frase, todavía no tienes una pregunta, tienes una intuición"*
- **random assignment** and why it balances unobservables *en promedio*
- a worked **confounding** case, `CASO-LIM-018`: true effect 5.00 PEN, self-selection yields 41.35 (8×), randomization yields 5.50 with IC 95% (1.18, 9.82)

Measured: 85 causality-term hits in S18. The deeper treatment also already exists downstream — S35 "Explicabilidad, equidad e incertidumbre" (112 causal hits) and S33 (70). **The proposed S20 is a section-sized restatement of one existing subtopic plus one existing section.**

**Case against the placement specifically:** two consecutive brand-new sections at 19 and 20 push the entire N2 reporting arc two slots right and make level 2 fifteen sections — the one structural change the repo's invariants cannot express (see §D1).

## C3. "Regresión y regularización" at S35 — S33 T2 *is* that section, and the placement inverts the baseline-first rule

`learning_roadmap_52_V3.md:489` — S33 topic 2 verbatim:
> `- T2 Lineales: regresión/logística y regularización; coeficientes, supuestos y scaling.`

`s33-advanced-models.ts` contains `LogisticRegression`, `Regulariza`, and 25 regression-term hits. So inserting a dedicated regression section *immediately before* S33 means the course teaches regression and regularization twice, two sections apart. Rescoping S33's T2 to avoid the duplication means removing or re-pointing 6 of its 24 exercise ids — blocked by `preservation_sentinel.mjs:168`.

**Pedagogical inversion, which is the stronger objection.** S33's T1 is *"Framing: unidad, target y horizonte; costos, baseline de regla y dummy estimator"*, and its gate is *"comparación honesta que conserva el baseline determinista y demuestra cuándo el ML agrega —o no agrega— valor."* Placing a model-family section **before** the section that teaches framing and the dummy baseline teaches a learner to fit a model before they have been taught what a baseline is. That is precisely the failure mode S33's gate exists to prevent, and the plan would put a new section on the wrong side of it.

**Does anything in old S19–S32 already depend on regression?** No. I grepped the active content for `regresi[óo]n lineal|regresi[óo]n log|LinearRegression|LogisticRegression|mínimos cuadrados|Ridge|Lasso|regulariza` across all 52 sections. Every hit in S24/S26/S27/S28/S30/S31/S37/S39/S48/S50/S52 is either *regression testing* (software sense) or the substring "bridge". The first statistical use is **S33 T2**, and the first *consumer* is **S35 T1** ("coeficientes e importancia por permutación"). So regression is already correctly ordered, and the insertion slot you've chosen is the one place that breaks it.

**Case against on capstone grounds too:** `catalog.ts:87` — `CP-N3-B` contributing `['S31','S32','S33','S34']`, gate `S34`. New S35 lands between old S32 (→S34) and old S33 (→S36), i.e. **inside CP-N3-B's increment arc**, exactly like C1. Both insertions split a capstone.

**Better slot:** between old S33 and old S34 (after baselines, before metrics) — or, again, **split S33**, which at 14 theory blocks and 158 KB is the second-densest file in the course.

---

# D. What else must change — the reviewer's inconsistency list

## D1. The "13 sections per level" identity is load-bearing and has no uneven form
- `learning_roadmap_52_V3.md:6` — *"Escala: 4 niveles × 13 secciones = 52 secciones."*
- `:17-32` — the quantified contract's **"Por nivel"** column (13, 52, 104, 104, 312, 52, 104, 312, 13, 104, 312, 13, 3). Every cell is `per-section × 13`. With levels of 13/15/14/12/1 **there is no single correct value for any of them.**
- `:43` — *"La promoción exige aprobar las 13 secciones…"*
- `:36-41` — the level progression table (`S1–S13`, `S14–S26`, `S27–S39`, `S40–S52`)
- `course-state/course_requirements.json` → `invariant_vector.sections_per_level: 13`
- `tests/adversarial/test_active_v3_curriculum_contract.py:117` → `range(s, s+13) for s in (1,14,27,40)`

Either the roadmap's central identity is rewritten (it is a **protected path**, `AGENTS.md:144`), or the plan is wrong.

## D2. Two incompatible level taxonomies, and the plan assumes the one the code doesn't have
`src/lib/course/index.ts:92-97` has **4 phases** with FINAL inside phase 3 (`sections: '40-52'`). `src/lib/capstones/catalog.ts:36` has **4 levels** with L4 = `'S40–S52'`. But `badge_catalog.json` has `progress_phase3_walked` = 12 sections `S40…S51` + a separate `evidence_grounded_ai_systems_capstone` = `['S52']`. Your target model (N4 = S43–S54, FINAL = S55) is a **5-band** model that exists in the badge catalog and nowhere in the code. Adding a 5th `PHASES` entry breaks `test_active_v3_curriculum_contract.py:119` (`re.findall(r"\bhours:\s*(\d+)")` would return 5 values against a 4-element `per_level`).

## D3. Prerequisite chains, including range forms that silently widen
`learning_roadmap_52_V3.md` has 53 `**Prerrequisito(s):**` lines (127-696). Most are `S(n-1)` and shift mechanically. The **ranges** are the trap:
- `:340` `**Prerrequisitos:** S17–S19` (Excel automation). Rewriting the endpoints to `S17–S21` silently *adds the two new inference sections* as prerequisites for Excel automation. The semantically correct form is a non-contiguous set, which the roadmap's grammar cannot express.
- Same shape at `:250` (`S8–S11`), `:261` (`S1–S12`), `:395` (`S21–S24`), `:406` (`S14–S25`), `:551` (`S27–S38`), `:696` (`S1–S51`).
- `:274,419,564` use `**Prerrequisito:** Nivel 1/2/3` — these now mean 15- and 14-section levels.
- `:122` the cross-cutting "Desde" line: *"Desde S27: pytest sistemático… Desde S32: prevención de leakage. Desde S40: ADRs… Desde S44: supply chain… Desde S49: evals"* — a **different syntax** that a `### S` / `Prerrequisito` regex will not touch. "Desde S32: prevención de leakage" must become S34; miss it and the leakage policy appears to start at the new regression section.

## D4. Capstone catalog — 13 gates, 5 sub-gates, 1 partition
`src/lib/capstones/catalog.ts`: `LEVELS[].sections` and `LEVELS[].gates` (lines 27-37), `SUB_N4C[].section` S49/S50/S51 (41-47), 13 × `gateSection` + `contributingSections` + `prerequisites` (66-115), `CP-FINAL`'s 12 `prerequisites` `['S04'…'S51']` (110), `GATE_MAP` (120-123). Mirrored in `capstone_validation/capstones/*.json` (13), `course-state/capstones/*/gate.json` (13 × `gate_section`), `capstone_validation/architecture/capstone_dependency_graph.json`, `capstone_validation/reality/section_capstone_mapping.json` (52 entries with `level` + `contributesToCapstones`), and `public/capstones/*_BRIEF.md` (which reference every section S01–S52 — except S48, an existing gap).

**`contributingSections` is an exact partition**: I verified all 52 sections appear exactly once, none twice, none missing. So the 3 new sections *must* be assigned, and `test_section_capstone_mapping.py` will force them into a level range — but **nothing checks the semantic fit.** Assigning "Inferencia" to *"Fábrica de Reportes y Tablero Accesible"* satisfies every gate in the repo.

## D5. CF checkpoints
`learning_roadmap_52_V3.md:105-109`: CF-1·S13, CF-2·S26, CF-3·S39, CF-4·S47, CF-5·S51 → S13, S28, S42, S50, S54. These numbers are also hardcoded in teaching prose: `s26-integrator-phase1.ts:50,357,1673,1751` (*"regresión S14–S26 y CF-2"*), `s39-integrator-phase2.ts:18,33,51,135,343,380,...,2534` (*"regresión S27–S39"*, 11 occurrences), `s13-evidence-dashboard.ts:432,750,779,1798,1885` (*"regresión S01–S13"*). One of these, `s39-integrator-phase2.ts:1985`, is an **exercise acceptance criterion**: *"scope debe ser exacto `S27-S39`"* — the learner's code is graded against the literal string.

## D6. Hours
Measured: `sum(estimatedHours) = 491`, per-level `[118, 118, 118, 137]` — which matches `PHASES` `hours:` exactly and `COURSE_META.totalHours: 491` (`src/lib/course/index.ts:64-65`). Three sections at ~9h each → ~519. New bands would be roughly N1 118 / N2 136 / N3 127 / N4 108 / FINAL 29. Every one of those must land in `PHASES`, `totalHours`, and `test_active_v3_curriculum_contract.py:117-120` simultaneously. Note the roadmap still carries the **retracted** 1,040h claim at `:775` and *"Cada sección parte de 16–24 horas"* at `:777`, both contradicting the 9-10h reality — pre-existing drift the migration will be blamed for if touched carelessly.

## D7. i18n and copy
`src/lib/i18n.ts` — 18 strings hardcode "52 secciones / 52 sections" across es-PE, es, en (lines 164,170,174,175,239,284,310,451,457,461,462,526,571,597,738,744,748,749,813,858,884), including **certificate-gating copy**: *"Completa las 52 secciones para descargar el certificado"*. Plus `src/lib/subscription-plans.ts:70,80` (*"Acceso completo al curso de 52 secciones"*, *"Las 52 secciones completas"*) — **pricing copy**, which `src/lib/progress-document.ts:8` records as having caused a prior incident. Plus `src/components/course/Dashboard.tsx:132,146,410`, `src/components/course/ResourcesPage.tsx`, `scripts/newbie_packet_builder.py:345,348` (which `literal()`-matches the dashboard string and will fail loudly — one of the few gates on this copy).

---

# E. The ordering trap

**The renumber cannot be staged across merges to `main`/`develop`.** `.github/workflows/tests.yml:27-30` runs the sentinel with `PRESERVATION_BASE = pull_request.base.sha || github.event.before`. For a PR, that diffs the whole PR against its base — so intermediate *commits* are invisible. But **for a push to `main`/`develop` it diffs against the previous head**, so every merged increment is independently checked against `activeCount === 52` and zero removed exercise ids. **No partial renumber can satisfy both.** Stage it in two PRs and the first merge fails with ~400-800 `EXERCISE_IDS_REMOVED` entries.

**Worst intermediate state, and the gate that lets it through.** `scripts/preservation_sentinel.mjs:261-269`:
```js
try { curriculum = compareCurriculum(base, head, failures) }
catch (e) { warnings.push({ code: 'CURRICULUM_COMPARE_SKIPPED', message: String(e) }) }
```
and `:301` `ok: failures.length === 0`. Warnings do not fail. `extractActiveCurriculum` opens with `git show ${treeish}:src/lib/course/index.ts` via `git()`, which **throws** if that path is missing. So a commit that temporarily moves or splits `src/lib/course/index.ts` (the obvious thing to do when inserting 3 imports into an ordered list) makes the sentinel **emit a warning and exit 0** having validated neither the section count nor a single one of the ~1,360 ids. That is the worst state: the one gate designed to stop this change silently self-disables, and the artifact it uploads says `failures: 0`.

**Gate that catches a half-done rename vs. one that passes it:**
- **Catches:** `test_forward_dependencies.py:86-89` raises `AssertionError` if any `gate.json` `gate_section` is not an active number. `figure-data-schema.test.mjs:41-48` fires on a duplicated figure attachment — so if you *copy* `s19-*.ts` → `s21-*.ts` before deleting the original, every figure in it is attached twice and this fails loudly. `test_curriculum_preservation.py:41` catches duplicate section slugs.
- **Passes:** everything in §A. In particular a tree where section files are fully renumbered and `badge_catalog.json`, `PdfReport.tsx`, resource tags, figure ids and `concept_map.json` are not, is **green on every CI job**.

**Git rename detection is a real risk, not a certainty.** The sentinel reads `git diff --name-status --diff-filter=D` (line 78). Renames surface as `R` and are excluded — *if* similarity detection fires. Renaming `s19-databases-orm.ts` → `s21-databases-orm.ts` while rewriting ~1,000 ids and prose references inside it can drop below the 50% similarity threshold, at which point it becomes `D` + `A` and trips `UNAUTHORIZED_DELETE`, whose only escape is a `DestructiveChangeRequest` with human + verifier approval (`AGENTS.md:89-92`, default deletion budget **zero**).

**Governance ordering.** `AGENTS.md:93-96` makes three of this change's components *ask-first*: changing `badge_catalog.json`, "moving a project between sections", and "changing a protected path". The protected set (`AGENTS.md:141-145`) covers `src/lib/course/sections/`, `src/lib/course/index.ts`, `tests/`, `scripts/*regression*`, `public/`, `prisma/migrations/`, and `learning_roadmap_52_V3.md`. This migration touches **all seven**.

**The one thing that is genuinely clean:** learner data. Progress, `Progress`/`ExamAttempt` rows, `QUESTION_BANK` (keyed by slug: `setup`, `basics`, `collections`…), and `/api/exam/*` (`start/route.ts:24`, `attempts/route.ts:17` via `renameSectionId`) are all slug-keyed. **Provided no slug changes**, no DB migration is needed. But see §B2: that also means you *cannot* fix the lying slugs in the same change.

---

# F. Would I veto this? Yes, as scoped.

**Three independent reasons, quantified.**

1. **~70-80% of the new content already exists.** S18-T2-A/B already teach intervals, bootstrap, effect size, selection bias, counterfactuals, estimands, randomization and confounding with a worked confounding case. S33-T2 is literally *"regresión/logística y regularización."* The measured gap is hypothesis testing — **0 occurrences of `p-valor` / `contraste de hipótesis` in all 52 sections** — which is roughly **one subtopic**. The plan proposes **3 sections = 12 topics, 24 subtopics, 24 demos, 72 exercises, 12 topic evaluations, 72 exam variants, 3 section exams, 3 project increments** of fully-authored, runtime-verified, A/B/C-equivalence-reviewed Spanish content (`learning_roadmap_52_V3.md:73-84`, the 12-step cycle) to cover it.

2. **The migration cost is ~20× the authoring cost and most of it fails silently.** Measured blast radius: **816 gated exercise ids** (hard-blocked, no rename mechanism exists), **1,360 structural ids**, **2,166 prose/filename `S<n>` references** (1,598 shifting, 711 cross-section), **76 figure ids** + 4 component files + registry + 2 data files, **127→44 resource tags**, **52 PdfReport labels**, **31 badge specs × 2 duplicate copies**, **13 gate.json + 13 contracts + 2 graphs + 1 52-row mapping**, **17,609 concept-map uses** (11,096 shifting), **52 ledger rows**, **11 invariant-vector constants**, **2 roadmap copies**, **53 concept-map docs**, **~416 historical evidence directories**. Of the twelve consumer classes I found, **ten corrupt silently** and the whole set is green on CI.

3. **The two insertion points both split a capstone, and one inverts the course's own pedagogical rule.** `CP-N2-B` (S18-S21) and `CP-N3-B` (S31-S34) each get a 2-section and 1-section interruption mid-arc, and the new sections carry no project increment. The regression insertion puts a model family *before* S33 teaches framing and the dummy baseline — the exact inversion S33's gate exists to prevent.

**What I'd do instead, in order of preference:**

**(1) Rescope, don't insert.** Split the two densest-and-most-overloaded sections in the course — which are, not coincidentally, exactly the two you want to insert next to:
- **S18** (13 theory blocks vs. median 10; `S18-T2-B` and `S18-T3-A` each carry *two* theory blocks for one subtopic) → S18 "EDA y estadística descriptiva" + S19 "Inferencia: incertidumbre, intervalos y contraste", with the existing estimand/randomization block promoted into S19-T4. Net +1 section, and the *authored prose survives* — you re-label subtopic ids rather than write 24 exercises.
- **S33** (14 theory blocks, 158 KB, 2nd-largest file) → S33 "Framing y baselines" + S34 "Regresión y regularización". Net +1.

This is **+2 instead of +3**, leaves 11 of the 12 silent-corruption classes untouched for sections 1-17, and halves the renumber span. It still breaks the 13-per-level identity, so it is not free — but it is the smallest change that closes the real gap.

**(2) Append, don't insert.** S53/S54/S55 as an optional "Inferencia aplicada" track. **Zero** renumbering: no exercise-id churn, no sentinel modification, no badge/PDF/resource/figure/concept-map rewrite, no prose repointing, no capstone repartition. `activeCount !== 52` and the `range(1,53)` assertions still fail loudly (4-5 test edits), and the level model needs a 5th band. The cost is pedagogical: inference arrives after the final capstone, which is wrong if you believe the material is foundational. But if the material is *remedial depth* rather than a prerequisite for anything — and §C3 shows nothing in S19-S32 depends on it — appending is defensible and roughly **1/20th the risk**.

**(3) If you insert anyway, three preconditions.** Do not start without: (a) an `EXERCISE_ID_RENAMES` map in `scripts/section_id_renames.mjs` plus the sentinel change and contract test, landed and reviewed **in a separate prior PR**; (b) a one-shot consistency checker that asserts, for all 55 sections, that `index` ⇔ figure-id prefix ⇔ `PdfReport` label number ⇔ resource tag prefix ⇔ `section_ledger.id` ⇔ `badge_catalog.required_sections` ⇔ `gate.json.gate_section` all agree — none of which exists today; (c) a single atomic PR, because §E proves it cannot be staged across merges.

---

# G. What I could not determine

- **Whether the eligibility engine is live.** `src/lib/eligibility/engine.ts` is 711 lines, but no producer of `LearnerProgress` exists anywhere under `src/app`. Only `src/lib/eligibility/*`, `tests/`, and `tests/e2e_max/badge_eligibility.spec.ts` reference the type. So A1's *runtime* severity depends on whether `/api/credentials/issue` is actually reachable in production; the *contract* corruption (`badge_catalog.json` + 31 claim contracts asserting the wrong sections) is real either way, and `credential-gates.ts` is definitely wired to the route.
- **Which slug each new section should take, and whether anyone intends to rename the lying slugs.** §B2 proves the two cannot happen in one commit; the plan does not say which it wants.
- **The intended disposition of `course-state/newbie_walkthrough/*/section_NN/`** (§A13) — rewrite (falsifies evidence) or freeze (misattributes it). Both are bad and the plan is silent.
- **Whether `scripts/v3_regression.spec.ts`, `course_complete_gate.py`, `badge_readiness_audit.py` and `export_interaction_catalog.mjs` are run anywhere outside CI** (a release checklist, a pre-merge hook). I confirmed they are absent from `.github/workflows/` and only reachable via `test:all-gates` / `test:course-complete` / `test:e2e-max:catalog` in `package.json`. If nobody runs `test:all-gates`, the artifacts in §A9/§A10 are effectively ungated.
- **Whether git's rename detection will hold** across the renamed section files (§E) — that depends on the final diff and cannot be predicted from the current tree.