# S52 Explorer Report — Curriculum Auditor (STORM + Graph + Loop + Harness)

**Auditor role:** Elite multi-agent Curriculum Auditor, Pedagogical Analyst, Technical Editor  
**Section:** 52 · Platform id `career-strategy`  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s52-career-strategy.ts`  
**Live site:** https://pillb.github.io/pyarcana/ (hash `#career-strategy` / UI card “Sección 52 · Capstone FINAL”)  
**Repo:** https://github.com/PillB/pyarcana  
**Analysis date:** 2026-07-24  
**Scope rule:** Section 52 only — analysis and proposed diffs; no product edits applied.

---

## Pre-round research (pedagogy relevant to this section)

Before deep reading, the following external practices informed the critique (capstone + GRR + portfolio defense):

1. **Gradual Release of Responsibility (I Do / We Do / You Do)** — Focused instruction models a *process*, guided practice scaffolds partial performance, independent work transfers to authentic tasks; “sudden release” fails when demos are theater and You Do is only a checklist. (Fisher & Frey GRR; Pearson & Gallagher origin.)
2. **Capstone design** — High-quality finals require milestones, authentic integration of prior artifacts, defendable trade-offs, and a public evidence package—not only boolean gate drills.
3. **Cognitive load / progressive disclosure** — Repeated identical contract paragraphs across subtopics inflate *extraneous* load; seniors need *germane* load on integration decisions (schema ownership, rollback evidence, demo narrative).
4. **Portfolio integrity** — Claims must be sourced, baselines frozen, personal contribution explicit; rejecting unsupported claims is pedagogically and ethically correct (aligned with course ethics: synthetic data, no auto-fraud).
5. **Gold peers in this course** — S01–S06 pair depth: multi-paragraph explanations, term scaffolding in Spanish, motivational connective tissue, demos that teach a real procedure—not only `print(True)`.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 52 |
| Platform id (hash) | `career-strategy` |
| Title (metadata) | Enterprise Relationship & Operations Intelligence Platform: capstone final |
| shortTitle | Capstone FINAL |
| tagline | CP-FINAL: integración de 12 capstones, demo reproducible, system card y caso de impacto para CV |
| estimatedHours | 80 |
| level | Master |
| phase | 3 |
| Subtopics | S52-T1-A/B, S52-T2-A/B, S52-T3-A/B, S52-T4-A/B (8) |
| Theory blocks | 9 (map + 8 subtopics) |
| iDo | 8 demos (one per subtopic) |
| weDo | 24 steps (E1 guided / E2 independent / E3 transfer × 8) |
| youDo | Single CP-FINAL readiness checklist portfolio |
| selfCheck | 5 MCQs |
| resources | 8 docs + 2 books + 4 courses |
| Case | `CASO-PER-052` (synthetic multi-region Perú) |
| Gate language | 52/52 + 12/12 capstones + CP-FINAL + regresión; **no** compensar CP-N4-C; zero P0/P1 |

**Live UI observation:** Home curriculum card for Sección 52 shows shortTitle “Capstone FINAL”, 80 h, Master, tagline matching CP-FINAL. SPA hash navigation does not dump full lesson HTML to a static fetch; **full content audit is grounded in the registered source** `s52-career-strategy.ts` (same bundle that powers the live site).

**In-scope content nodes:** metadata, learningOutcomes, theory (all paragraphs/code/callouts), iDo, weDo (all 24), youDo, selfCheck, resources.  
**Out of scope:** other sections’ TS, product fixes, deploy.

---

## 2. Executive Summary of Quality

### Score: **6.2 / 10**

### Verdict

S52 is a **structurally complete senior-master *gate frame*** with excellent **ethics fail-closed language**, a clear **T1→T4 route**, **24 DEFECT weDo drills** (valid / adverse / missing), a **5-question selfCheck**, and a **youDo rubric** that correctly refuses theater portfolios. Automated structural audit (`S52_AUDIT.json`) is ACCEPT (mean_visible_rank 9.52, high_issue_count 0).

As a **true 80-hour final capstone that integrates 12 prior capstones into a defendable platform**, the section **under-delivers**:

- Theory subtopics after the map are **template-repeated** (same Entrada/Error/Criterio + CASO-PER-052 paragraph with only the “evidencia esperada” slot swapped).
- iDo demos are **boolean theater** (`print(... True)`), not integration walkthroughs.
- weDo trains **predicate repair**, not assembling APIs, regression suites, or disaster drills.
- youDo is a **4-flag readiness checklist** with a **truncated evidence key**, not a multi-week integration scaffold.
- **Internal inconsistencies** (6 vs 8 artifacts; 6 vs 5 bounded contexts; CASO-LIM vs CASO-PER; legacy id meta-text) erode trust at the graduation gate.
- **Spanish redaction** has broken sentences, uncapitalized headings, and English product names forced into Spanish prose.

**Bottom line:** Keep the gate philosophy; Fixer must deepen pedagogy, de-boilerplate theory, align contracts across theory/iDo/weDo/youDo, remove meta-leaks, and make demos/exercises *feel* like a final platform integration—not only gate JSON.

---

## 3. Detailed Issue Registry

Severity: **P0** = blocks learning trust / correctness of graduation message · **P1** = high pedagogical or consistency damage · **P2** = clarity/redaction · **P3** = polish.

### ISSUE-01 — Meta-leak: legacy id remapping disclosed to learners  
- **Severity:** P1  
- **Location:** theory map, paragraph 4 (`s52-career-strategy.ts` ~L33)  
- **Evidence:**  
  > `Id legacy \`career-strategy\` se reinterpreta: carrera = **portfolio técnico defendible**, no solo soft skills.`  
- **Impact:** Learner-facing text exposes curriculum engineering history (file/id rename). Breaks immersion; confuses identity of the section vs soft-skills “career strategy.”  
- **Dimensions:** meta-leak, narrative flow, consistency  

### ISSUE-02 — Artifact count contradiction (6 in theory/iDo vs 8 in weDo)  
- **Severity:** P0  
- **Location:** T4-B theory code (~L275–283), T4-B iDo (~L445–451), T4-B weDo E1–E3 (~L1488–1601)  
- **Evidence:**  
  - Theory: `return ["architecture.md", "README", "system_card", "LICENSE", "demo_video", "defense_notes"]` → `n 6`  
  - iDo: `artifact_count() -> 6` / `artifacts 6`  
  - weDo: 8 artifacts set `{architecture, README, ADR, system_card, model_card, LICENSE, video, defense}` and `len(...) < 8` defect  
- **Impact:** At graduation, students cannot know which evidence bundle is authoritative. Undermines CP-FINAL reliability.  
- **Dimensions:** consistency, exercise alignment, cognitive load  

### ISSUE-03 — Bounded contexts contradiction (6 in theory vs 5 in weDo)  
- **Severity:** P1  
- **Location:** T2-A theory (~L127–140) vs T2-A weDo (~L769–778)  
- **Evidence:**  
  - Theory: `intake, er, relationship, triage, reporting, copilot` (6)  
  - weDo valid fixture: `{"intake","er","triage","reporting","copilot"}` (5; **no `relationship`**) and instruction “cinco contexts”  
- **Impact:** Contract tests taught in theory ≠ gate predicate in lab. “Relationship” context is central to the platform name.  
- **Dimensions:** consistency, roadmap alignment  

### ISSUE-04 — Case id dual nomenclature CASO-LIM-052 vs CASO-PER-052  
- **Severity:** P2 (borderline P1 for meta feel)  
- **Location:** All 24 weDo starter comment headers (`# CASO-LIM-052 · ...`) while runtime `case_id` is `CASO-PER-052-*`  
- **Evidence:** e.g. `# CASO-LIM-052 · CF-1 stakeholders/jobs` + `case_id: "CASO-PER-052-1A"`  
- **Impact:** Looks like leftover generator template; confuses synthetic case identity for the final national platform story.  
- **Dimensions:** meta-leak (mild), redaction, consistency  

### ISSUE-05 — Theory boilerplate: identical “Contrato operativo” + CASO-PER-052 paragraphs  
- **Severity:** P1  
- **Location:** Nearly every subtopic para 2–3 (T1-A, T2-A/B, T3-A/B, T4-A/B); only “Salida de este subtema: …” changes  
- **Evidence (pattern):**  
  > `Contrato operativo. Entrada: artefactos congelados S1–S51... Error: P0/P1, PII... bloquea graduación. Criterio de éxito: 52/52, 12/12...`  
  > `Aplicación de \`…\` al caso peruano sintético \`CASO-PER-052\`: la Enterprise Relationship... La evidencia esperada es [SLOT]. No contiene PII...`  
- **Impact:** Extraneous cognitive load; zero progressive disclosure of *how* to revalidate CF-1, wire events, or run a disaster tabletop. Compared to S01 gold paragraphs, depth collapses.  
- **Dimensions:** cognitive load, connective tissue, pedagogy, redaction  

### ISSUE-06 — Uncapitalized / telegraphic theory headings  
- **Severity:** P2  
- **Location:** headings L62, L91, L124, L152, L180, L208, L236, L264  
- **Evidence:**  
  - `stakeholders, jobs y success metrics de CF-1`  
  - `cambios, constraints, riesgos y no-go`  
  - `demo y narrativa CV`  
- **Impact:** Unprofessional surface quality in final section; weaker scannability and Spanish title norms.  
- **Dimensions:** grammar/redaction  

### ISSUE-07 — Broken Spanish in youDo context (and shared gate phrase)  
- **Severity:** P1  
- **Location:** youDo.context (~L1617); also mirrored in theory “Error: … bloquea graduación” strings  
- **Evidence:**  
  > `El gate se bloquea ante: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación.`  
- **Impact:** Double finite verb / run-on; learner cannot parse the gate sentence. Same broken pattern in objectives item 3.  
- **Dimensions:** grammatical correctness (Peruvian Spanish), clarity  

### ISSUE-08 — jobRelevance jammed English product title  
- **Severity:** P2  
- **Location:** metadata jobRelevance (~L15–16)  
- **Evidence:**  
  > `En equipos de plataforma y producto, enterprise relationship & operations intelligence platform: capstone final conecta decisiones técnicas...`  
- **Impact:** Reads as unedited English slug dump; not natural español peruano. Motivation weak vs S01 jobRelevance.  
- **Dimensions:** redaction, motivation, accessibility  

### ISSUE-09 — iDo demos are theater, not integration modeling  
- **Severity:** P1  
- **Location:** all 8 iDo steps (~L293–456)  
- **Evidence (representative):**  
  ```python
  print("cf1_revalidated", True)
  print("metrics", metrics())
  print("synthetic", True)
  ```  
  and T4-A: `print("demo_ok", True); print("cv", True)`  
- **Impact:** Violates GRR focused instruction: students never *see* a CF-1 delta matrix, contract test failure, RPO measurement, or 10-min demo script structure. Senior-master close becomes ritual prints.  
- **Dimensions:** pedagogical structure (I Do fidelity), cognitive load, external comparison  

### ISSUE-10 — weDo monotony vs 80h capstone claim  
- **Severity:** P1  
- **Location:** weDo 24 steps; estimatedHours 80  
- **Evidence:** Every E1/E2/E3 is invert-boolean / missing-key / fail-closed routing on a flat dict—valuable for gate literacy, insufficient for “integración de 12 capstones.”  
- **Impact:** Time estimate and learning outcomes promise platform assembly; practice only trains predicate repair. Capstone best practice (milestones + authentic product) not met.  
- **Dimensions:** exercise quality, cognitive load, external comparison  

### ISSUE-11 — youDo starter is readiness flags only; truncated REQUIRED key  
- **Severity:** P1  
- **Location:** youDo.starterCode (~L1634–1650)  
- **Evidence:**  
  - `REQUIRED = [..., 'readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_perso']` — **truncated** (“personal”)  
  - All four evidence booleans start `False`; no structure for architecture, regression command, or defense notes  
- **Impact:** Students can flip booleans to READY without producing real artifacts; truncated key is a copy-paste defect in the final portfolio.  
- **Dimensions:** exercise/portfolio alignment, correctness  

### ISSUE-12 — SelfCheck error code vs section action vocabulary drift  
- **Severity:** P2  
- **Location:** selfCheck Q2 (~L1671–1674) vs weDo action codes  
- **Evidence:** Q2 teaches `NO_GO_RELEASE`; weDo uses `DECLARE_NO_GO`, `NO_GO_RESILIENCE`, `BLOCK_FINAL_ON_P0_P1`, `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM`, etc. youDo requirements mention `NO_GO_RELEASE` / `INDEPENDENT_REVIEW` while exercises use different strings.  
- **Impact:** Active recall tests a generic code not exercised in labs; weakens transfer.  
- **Dimensions:** exam alignment, consistency  

### ISSUE-13 — Missing connective tissue between T1–T4 (integration narrative)  
- **Severity:** P1  
- **Location:** theory after map; no bridge paragraphs  
- **Evidence:** Map promises “Orden: T1 … → T4 …”; each subtopic restarts with isolated heading + template. No “cómo se ensamblan los 12 capstones,” no dependency graph of CP-N*, no week-by-week 80h plan.  
- **Impact:** Final section fails narrative arc; learner does not know *order of operations* for a real defense.  
- **Dimensions:** connective tissue, progressive disclosure, roadmap  

### ISSUE-14 — Learning outcomes are telegraphic gate bullets  
- **Severity:** P2  
- **Location:** learningOutcomes (~L17–25)  
- **Evidence:** e.g. `"Revalida stakeholders y métricas de CF-1"`, `"Ensambla datos/modelos/RPA/RAG/HITL"` — no measurable verb+evidence phrase quality of early sections.  
- **Impact:** Outcomes do not double as checklist for self-assessment of an 80h project.  
- **Dimensions:** pedagogy, consistency with early gold sections  

### ISSUE-15 — Disaster exercise theory claims “reloj y evidencia” but code is tabletop string  
- **Severity:** P2  
- **Location:** T3-B theory (~L211–225)  
- **Evidence:** Prose demands RPO/RTO medidos y restore verificado; sample code returns `{"disaster": "tabletop_ok"}` without measured fields; weDo does encode availability/slo/backup_age_h/rpo_h/rollback_min/rto_min.  
- **Impact:** Theory demo under-teaches relative to weDo; iDo still only prints True.  
- **Dimensions:** progressive disclosure, I Do/theory alignment  

### ISSUE-16 — Resources: vague Stanford/Coursera links  
- **Severity:** P3  
- **Location:** resources.courses (~L1745–1749)  
- **Evidence:** `https://web.stanford.edu/` and Coursera query `system design` — not actionable modules for CP-FINAL. MIT 6.100L / CS50P are real but weakly tied to senior platform defense.  
- **Impact:** Low value at Master close; polish only.  
- **Dimensions:** external comparison, usefulness  

### ISSUE-17 — Title / id / shortTitle identity split (learner confusion)  
- **Severity:** P2  
- **Location:** metadata L4–8; live card “Capstone FINAL”  
- **Evidence:** File/id `career-strategy`, long English enterprise title, shortTitle Capstone FINAL, tagline CP-FINAL. Without ISSUE-01’s meta sentence, remapping is unexplained.  
- **Impact:** SEO/nav vs content story diverge; Fixer should either rename cleanly or explain *learner-facing* why “career = defendable portfolio.”  
- **Dimensions:** consistency, accessibility  

### ISSUE-18 — Weak Spanish scaffolding for dense English acronyms  
- **Severity:** P3  
- **Location:** map dictionary helps, but body still dumps RPO/RTO/SLO/HITL/RAG/ADR/C4 without refresh  
- **Evidence:** Map defines many terms well (strength); later subtopics assume retention without hover-friendly restatement like S01.  
- **Impact:** Accessibility for self-paced LATAM learners under 80h stress.  
- **Dimensions:** accessibility, progressive disclosure  

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Classification | Fix direction |
|---|------------------------------|----------|----------------|---------------|
| ML-1 | `Id legacy \`career-strategy\` se reinterpreta: carrera = **portfolio técnico defendible**, no solo soft skills.` | theory map para 4 | **Hard meta-leak** (developer redesign note) | Replace with learner-facing purpose: portfolio defendible ≠ solo soft skills; omit “legacy id.” |
| ML-2 | `# CASO-LIM-052 · …` on all weDo starters | weDo starter comments ×24 | **Template residue / soft meta** | Rename comments to `CASO-PER-052` (or remove LIM lab prefix). |
| ML-3 | Repeated generator slot language `Aplicación de \`…\` al caso peruano sintético` identical across subtopics | theory para 3 × many | **Scaffold voice** (not AI chat, but clearly machine-templated) | Rewrite per-subtopic with unique procedure + one concrete example. |

**No findings of:** “moved from section X”, TODO for Fixer, AI-to-dev chat, “do not show students”, or English editorial notes outside intentional product English names.

**meta_leak_count (hard + soft material):** **3** (ML-1 hard; ML-2/ML-3 soft-template).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Meta-text / developer leakage  
Hard leak ML-1 is unacceptable in a graduation section. Soft LIM vs PER and template “Aplicación de…” degrade polish. Gate jargon (CP-N4-C, CF-1) is **domain curriculum language**, not meta-leak—but needs a one-line learner gloss on first use in S52 (map partially does this).

### 5.2 Grammatical correctness & redaction (español peruano)  
- **Broken sentence** ISSUE-07 is the worst grammar fault.  
- Headings need sentence case (ISSUE-06).  
- jobRelevance needs natural Spanish (ISSUE-08).  
- Tone of ethics messages is strong and consistent with course (no auto-fraud, synthetic only)—**keep**.  
- Mixed EN product names are OK if framed; currently unframed.

### 5.3 Connective tissue & narrative flow  
Map paragraph is the **only** strong narrative node (route T1→T4, dictionary, promotion rules). After that, subgraph nodes are disconnected clones. For a capstone, expected edges:  
`CF-1 delta → no-go → context map → human workflow → verification matrix → DR drill → demo script → evidence bundle → defense`.  
Those edges exist as **labels**, not as **taught procedures**.

### 5.4 Pedagogical structure (I Do / We Do / You Do fidelity)

| Phase | Present? | Fidelity |
|-------|----------|----------|
| Theory / Focus | Yes | Thin after map; dictionary good |
| I Do | 8 demos | **Low** — prints, not modeling |
| We Do E1 guided | 8 | **Medium** — DEFECT repair works for gates |
| We Do E2 independent | 8 | **Medium** — three-way routing good |
| We Do E3 transfer | 8 | **Medium** — CONTINUE/breach/uncertain excellent pattern |
| You Do portfolio | Yes | **Low–Medium** — rubric good, starter theatrical |
| SelfCheck | 5 Qs | **Medium–High** — ethics + gate + portfolio honesty solid; Q2 code drift |

GRR rule violated: **modeling must match independent performance**. Independent performance claimed = full platform; modeled performance = `True` flags.

### 5.5 Cognitive load & progressive disclosure  
- **Intrinsic load** of a final platform is high—appropriate for Master.  
- **Extraneous load** from boilerplate, contradictions (6/8 artifacts, 5/6 contexts), and meta-legacy text is high and **avoidable**.  
- **Germane load** (integration design) is under-stimulated by exercises.  
- 80h estimate without weekly milestones induces anxiety without a path.

### 5.6 Exercise & exam quality  
**Strengths:**  
- Fail-closed triad (valid / adverse / missing) is excellent for safety culture.  
- Action codes (REOPEN_CF1, DECLARE_NO_GO, STOP_INTEGRATION_RELEASE, …) teach decision taxonomy.  
- Q5 on TTR without baseline is gold-standard ethics.  

**Weaknesses:**  
- No exercise builds or stubs a multi-module integration.  
- No regression runner sketch for S1–S52.  
- youDo does not require writing defense_notes or measuring RPO.  
- SelfCheck does not sample T2/T3 technical specifics deeply enough for 80h.

### 5.7 Consistency with roadmap & previous sections  
- Aligns with course ethics spine (synthetic, HITL, no fraud labeling)—**excellent**.  
- CP-FINAL / 12 capstones / CF-5 freeze narrative matches S51→S52 story on the home UI.  
- Id `career-strategy` is a historical mismatch; content is platform capstone—not career coaching.  
- Compared to S01 gold: far less explanatory Spanish depth.

### 5.8 Comparison with external high-quality materials  

| External pattern | S52 status |
|------------------|------------|
| CS50P final project (spec + tests + personal project) | Spec/rubric present; authentic build path thin |
| GRR modeling of full process | iDo fails modeling bar |
| Google SRE DR drills (measured RPO/RTO) | Named correctly; demo code weak; weDo better |
| Portfolio READMEs / C4 / ADRs (linked resources) | Resources good; theory does not walk a minimal C4 |
| Honest metrics storytelling | Strong verbal standard; demo does not show before/after numbers beyond weDo fixtures |

### 5.9 Other domain issues  
- **Motivation:** Senior close should celebrate completion and career-facing portfolio; celebration is buried under gate fear language (necessary but unbalanced).  
- **Accessibility:** Long English title on every CASO application paragraph.  
- **Security/privacy messaging:** Exemplary and must be preserved in any rewrite.

### Graph view (section-local)

```
[Map/Dict] --route--> [T1 CF-1/no-go] --integrate--> [T2 contexts/HITL]
        \--gates--> [T3 verify/DR] --package--> [T4 demo/bundle]
[iDo×8] --weak model--> [weDo×24 predicates] --gap--> [youDo checklist]
[selfCheck] --partial align--> gates/ethics
Contradictions: (artifacts 6≠8), (contexts 6≠5), (LIM≠PER), (legacy id leak)
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — Remove legacy meta-leak; fix map para (ISSUE-01, ML-1)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-        "Orden: T1 revalidación CF-1/no-go → T2 bounded contexts → T3 evals/red team/SLO/disaster → T4 demo/CV/defensa. Teoría medible, iDo con helpers, weDo con **DEFECT** de integración. Id legacy `career-strategy` se reinterpreta: carrera = **portfolio técnico defendible**, no solo soft skills. Stack: **stdlib** + artefactos del curso.",
+        "Orden: T1 revalidación CF-1/no-go → T2 bounded contexts → T3 evals/red team/SLO/disaster → T4 demo/CV/defensa. Teoría medible, iDo con helpers, weDo con **DEFECT** de integración. En este cierre, **carrera profesional** = **portfolio técnico defendible** (demo, métricas, límites y contribución personal), no solo soft skills. Stack: **stdlib** + artefactos del curso.",
```

### Diff B — Align evidence bundle to 8 artifacts in theory + iDo (ISSUE-02)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-def evidence_bundle() -> list:
-    return ["architecture.md", "README", "system_card", "LICENSE", "demo_video", "defense_notes"]
+def evidence_bundle() -> list:
+    return [
+        "architecture.md",  # C4
+        "README",
+        "ADR",
+        "system_card",
+        "model_card",
+        "LICENSE",
+        "demo_video",
+        "defense_notes",
+    ]
@@
-n 6
+n 8
@@
-def artifact_count() -> int:
-    return 6
+def artifact_count() -> int:
+    return 8
```

(Also update iDo `output` and any prose “seis” → “ocho” if present.)

### Diff C — Align bounded contexts to six everywhere (ISSUE-03)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-        instruction: "S52-T2-A-E1 · ... debe demostrar cinco contexts, contratos versionados y sin DB compartida. ...
+        instruction: "S52-T2-A-E1 · ... debe demostrar seis contexts (intake, er, relationship, triage, reporting, copilot), contratos versionados y sin DB compartida. ...
@@
-record = {..., "contexts":{"intake","er","triage","reporting","copilot"}, ...}
+record = {..., "contexts":{"intake","er","relationship","triage","reporting","copilot"}, ...}
@@
-meets_contract = {"intake","er","triage","reporting","copilot"} <= record["contexts"] and ...
+meets_contract = {"intake","er","relationship","triage","reporting","copilot"} <= record["contexts"] and ...
```

Apply same set to all T2-A valid fixtures and solution predicates.

### Diff D — CASO-LIM → CASO-PER in comments (ISSUE-04, ML-2)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-# CASO-LIM-052 · CF-1 stakeholders/jobs
+# CASO-PER-052 · CF-1 stakeholders/jobs
```

(replace_all for `# CASO-LIM-052` → `# CASO-PER-052` within this file.)

### Diff E — Fix youDo Spanish + truncated key (ISSUE-07, ISSUE-11)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-    context: "Enterprise Relationship & Operations Intelligence Platform final. Trabaja sobre la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida: producto reproducible, demo, evidencia técnica y defensa de trade-offs. El gate se bloquea ante: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación.",
+    context: "Capstone final de la Enterprise Relationship & Operations Intelligence Platform. Trabaja con datos totalmente sintéticos de varias regiones del Perú. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark. Salida: producto reproducible, demo, evidencia técnica y defensa de trade-offs. El gate **bloquea la graduación** si hay P0/P1 abiertos, PII real, dependencia no reproducible, rollback no probado o afirmación sin evidencia.",
@@
-      "Probar el fallo: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación.",
+      "Probar el fallo: P0/P1, PII real, dependencia no reproducible, rollback no probado o afirmación sin evidencia deben bloquear la graduación.",
@@
-REQUIRED = ['arquitectura_integrada_con_apis_eventos_human_workflow', 'tests_evals_red_team_performance_y_benchmark_antes_despues', 'slo_backup_rollback_y_disaster_exercise', 'readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_perso']
-evidence = {
-    "arquitectura_integrada_con_apis_eventos_human_workflow": False,
-    "tests_evals_red_team_performance_y_benchmark_antes_despues": False,
-    "slo_backup_rollback_y_disaster_exercise": False,
-    "readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_perso": False
-}
+REQUIRED = [
+    "arquitectura_integrada_con_apis_eventos_human_workflow",
+    "tests_evals_red_team_performance_y_benchmark_antes_despues",
+    "slo_backup_rollback_y_disaster_exercise",
+    "readme_adrs_cards_licencia_demo_y_defensa_con_contribucion_personal",
+]
+evidence = {name: False for name in REQUIRED}
```

### Diff F — jobRelevance rewrite (ISSUE-08)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-  jobRelevance:
-    "En equipos de plataforma y producto, enterprise relationship & operations intelligence platform: capstone final conecta decisiones técnicas con evidencia operativa. La práctica entrega producto reproducible, demo, evidencia técnica y defensa de trade-offs y se promueve solo cuando 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
+  jobRelevance:
+    "En equipos de plataforma y producto, el cierre de carrera se juega con un **portfolio defendible**: demo reproducible, system/model cards, métricas con baseline y límites éticos. Esta sección integra tu **Enterprise Relationship & Operations Intelligence Platform** (caso sintético multi-región) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan **sin compensar** CP-N4-C.",
```

### Diff G — Headings sentence case (ISSUE-06)

```diff
-      heading: "stakeholders, jobs y success metrics de CF-1",
+      heading: "Stakeholders, jobs y success metrics de CF-1",
-      heading: "cambios, constraints, riesgos y no-go",
+      heading: "Cambios, constraints, riesgos y no-go",
-      heading: "bounded contexts, APIs y eventos",
+      heading: "Bounded contexts, APIs y eventos",
-      heading: "datos, modelos, RPA, RAG y human workflow",
+      heading: "Datos, modelos, RPA, RAG y human workflow",
-      heading: "tests/evals/red team y performance",
+      heading: "Tests, evals, red team y performance",
-      heading: "SLO, backup, rollback y disaster exercise",
+      heading: "SLO, backup, rollback y disaster exercise",
-      heading: "demo y narrativa CV",
+      heading: "Demo y narrativa de CV",
-      heading: "arquitectura, READMEs, cards, licencia, video y defensa",
+      heading: "Arquitectura, READMEs, cards, licencia, video y defensa",
```

### Diff H — Sample iDo upgrade for T4-A (ISSUE-09 pattern; Fixer extends to all 8)

```diff
--- a/src/lib/course/sections/s52-career-strategy.ts
+++ b/src/lib/course/sections/s52-career-strategy.ts
@@
-def metrics_first() -> bool:
-    return True
-
-print("demo_ok", True)
-print("cv", True)
-print("metrics_first", metrics_first())
+def demo_script(baseline_ttr: int, result_ttr: int, personal: str) -> dict:
+    """Problema → baseline → decisión → métrica → límite (≤10 min)."""
+    assert result_ttr < baseline_ttr, "sin mejora no hay claim"
+    return {
+        "minutes": 10,
+        "before_after": (baseline_ttr, result_ttr),
+        "personal_contribution": personal,
+        "claims_sourced": True,
+        "synthetic_only": True,
+    }
+
+plan = demo_script(90, 42, "blocking + contract tests en triage API")
+print("demo", plan)
+print("cv_ok", plan["claims_sourced"] and bool(plan["personal_contribution"]))
```

### Diff I — De-boilerplate one subtopic as template for all (ISSUE-05, ISSUE-13)

Conceptual replacement for T1-A paras 2–3 (Fixer replicates pattern per subtopic):

```diff
-        "Contrato operativo. Entrada: artefactos congelados S1–S51, contratos, riesgos, no-go decisions y benchmark. Salida de este subtema: matriz stakeholder/job/métrica con evidencia. Error: P0/P1, PII, dependencia no reproducible, rollback no probado o afirmación sin evidencia bloquea graduación. Criterio de éxito: 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan sin compensar CP-N4-C.",
-        "Aplicación de `stakeholders, jobs y success metrics de CF-1` al caso peruano sintético `CASO-PER-052`: la Enterprise Relationship & Operations Intelligence Platform con datos totalmente sintéticos de varias regiones del Perú. La evidencia esperada es matriz stakeholder/job/métrica con evidencia. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Procedimiento de revalidación CF-1: (1) lista stakeholders vivos y jobs actuales; (2) marca métricas retiradas en un change_log; (3) congela baseline sintético; (4) si falta dueño o baseline, `INTERVIEW_STAKEHOLDER` / `REOPEN_CF1`. No reutilices la matriz de S01 sin delta: el producto final defiende *esta* versión.",
+        "En `CASO-PER-052-1A` (ops, relationship, privacy; jobs≥3; ttr + review_precision; baseline_frozen) la matriz es válida. Un fixture solo con stakeholder `ops` y jobs=0 fuerza `REOPEN_CF1`. Datos sintéticos; ninguna métrica prueba fraude ni parentesco.",
```

Keep a **single** global gate callout on the map (already present) instead of repeating full graduation criteria in every subtopic.

### Diff J — SelfCheck Q2 vocabulary align (ISSUE-12)

```diff
-        question: "Si ocurre la condición de error de S52, ¿qué respuesta preserva seguridad y auditabilidad?",
-        options: ["continuar y ocultar el warning", "emitir NO_GO_RELEASE y conservar evidencia", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
-        correctIndex: 1,
-        explanation: "El contrato falla cerrado con NO_GO_RELEASE; no convierte incertidumbre o breach en éxito.",
+        question: "Si el portfolio reclama mejora de TTR sin baseline congelado ni contribución personal, ¿qué corresponde?",
+        options: [
+          "aprobar porque el video dura 8 minutos",
+          "REJECT_UNSUPPORTED_PORTFOLIO_CLAIM y pedir evidencia",
+          "publicar PII de stakeholders para «auditar»",
+          "omitir LICENSE si el demo impresiona",
+        ],
+        correctIndex: 1,
+        explanation:
+          "S52-T4-A exige mejora vs baseline sintético, claims sourced y contribución personal; sin eso se rechaza el claim, no se aprueba por teatro.",
```

(Alternatively keep a general fail-closed Q but use `DECLARE_NO_GO` / `BLOCK_FINAL_ON_P0_P1` as taught in weDo.)

### Diff K — Theory T3-B sample closer to measured DR (ISSUE-15)

```diff
-def resilience(slo: float, backup: str) -> dict:
-    return {"slo": slo, "backup": backup, "disaster": "tabletop_ok"}
-
-print(resilience(0.995, "daily"))
-print("drill", "tabletop_ok")
-print("rto", "documented")
+def resilience(availability: float, slo: float, backup_age_h: int, rpo_h: int, rollback_min: int, rto_min: int, restored: bool) -> dict:
+    ok = (
+        availability >= slo
+        and backup_age_h <= rpo_h
+        and rollback_min <= rto_min
+        and restored
+    )
+    return {"ok": ok, "rpo_h": rpo_h, "rto_min": rto_min, "restore_verified": restored}
+
+print(resilience(0.999, 0.995, 3, 4, 8, 15, True))
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue(s) | Rationale |
|----------|----------|-----------|
| **1** | ISSUE-02 (6 vs 8 artifacts) | Graduation contract contradiction — P0 |
| **2** | ISSUE-03 (5 vs 6 contexts) | Integration contract contradiction — P1 |
| **3** | ISSUE-01 / ML-1 (legacy id) | Meta-leak in map — user-facing trust |
| **4** | ISSUE-07 + ISSUE-11 (youDo grammar + truncated key) | Broken Spanish + broken portfolio starter |
| **5** | ISSUE-04 / ML-2 (CASO-LIM) | Global comment cleanup |
| **6** | ISSUE-05 + ISSUE-13 (boilerplate + connective tissue) | Largest pedagogy lift |
| **7** | ISSUE-09 (iDo theater) | Restore GRR modeling |
| **8** | ISSUE-10 (weDo vs 80h) | Add at least 2–4 integration-flavored labs or milestone checklist weeks (without abandoning fail-closed triad) |
| **9** | ISSUE-06, 08, 12, 14, 15 | Redaction + alignment polish |
| **10** | ISSUE-16, 17, 18 | Resources / identity / acronym accessibility |

**Preserve without dilution:** ethics fail-closed, no PII, no auto-fraud, CP-N4-C non-compensation, 52/52+12/12+CP-FINAL+regression gate, synthetic CASO-PER-052 framing, DEFECT E1/E2/E3 structure, Q5 portfolio honesty.

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY.json` / fleet registry consumers):

```json
{
  "section": 52,
  "id": "career-strategy",
  "file": "s52-career-strategy.ts",
  "explorer_score": 6.2,
  "verdict": "structurally_ACCEPT_pedagogically_thin_capstone",
  "strengths": [
    "ethics_fail_closed_spine",
    "T1_to_T4_route_map_dictionary",
    "weDo_24_DEFECT_valid_adverse_missing",
    "selfCheck_5_portfolio_honesty_Q5",
    "gate_52_12_cpfinal_no_cpn4c_compensate"
  ],
  "critical_edges_broken": [
    "artifacts_theory6_vs_wedo8",
    "contexts_theory6_vs_wedo5",
    "ido_theater_not_modeling_youdo",
    "theory_boilerplate_paras_2_3"
  ],
  "meta_leaks": [
    "legacy_id_career_strategy_reinterpretation",
    "CASO-LIM-052_comment_residue",
    "template_Aplicacion_de_slot"
  ],
  "fixer_must_not_regress": [
    "synthetic_only",
    "no_auto_fraud",
    "HITL_sensitive_decisions",
    "cp_n4c_cannot_compensate"
  ],
  "compare_to_gold": "S01 multi-paragraph Spanish depth + real procedure demos",
  "estimatedHours_vs_practice": "80h claimed vs predicate drills — rebalance or add milestones",
  "status": "explorer_complete"
}
```

**Fleet note:** Late-band S51–S52 was marked DEFECT-gold + senior-master Q5 in GRAPH_MEMORY notes; Explorer confirms **structural gold**, not **capstone pedagogical gold**.

---

## Dimension coverage checklist

| # | Dimension | Covered |
|---|-----------|---------|
| 1 | Meta-text / developer leakage | §4, ISSUE-01/04 |
| 2 | Grammatical correctness & redaction (PE Spanish) | ISSUE-06/07/08 |
| 3 | Connective tissue & narrative flow | ISSUE-13, §5.3 |
| 4 | Pedagogical structure I/We/You Do | §5.4, ISSUE-09/10/11 |
| 5 | Cognitive load & progressive disclosure | ISSUE-05, §5.5 |
| 6 | Exercise & exam quality/alignment | ISSUE-10/11/12, §5.6 |
| 7 | Consistency with roadmap & prior sections | ISSUE-02/03/17, §5.7 |
| 8 | Comparison with best-in-class external materials | §5.8 |
| 9 | Other (clarity, motivation, accessibility) | ISSUE-14/16/18, §5.9 |

---

This is the complete Explorer report for Section 52. Ready for the Fixer prompt.
