# S39 Explorer Report — Responsible ML Case Triage y cierre de nivel

**Auditor role:** Multi-agent Curriculum Auditor (Live Site Navigator · Source Code Reader · Pedagogy · Redaction · Meta-Leak · Comparative Quality · Diff Architect · Reporter)  
**Focus:** Section 39 only — do not apply fixes  
**Date:** 2026-07-24  
**Platform section id:** `integrator-phase2`  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s39-integrator-phase2.ts`  
**Live curriculum surface:** https://pillb.github.io/pyarcana/ (hash `#integrator-phase2` / Sección 39 · Case Triage N3)  
**Pre-research anchors:** Gradual Release of Responsibility (I Do / We Do / You Do); cognitive load & progressive disclosure; NIST AI RMF (Map/Measure/Manage + HITL); Google Model Cards (intended use, limitations, human oversight); SRE blameless postmortems; operational metrics vs offline AUC only.

---

## 1. Section Identification & Scope

| Field | Value |
|------|--------|
| Index | 39 |
| id | `integrator-phase2` |
| Title | Responsible ML Case Triage y cierre de nivel |
| shortTitle (live card) | Case Triage N3 |
| Phase / level | phase 2 · Competente a experto |
| Estimated hours | 19 |
| Capstone gate | CP-N3-C + regresión S27–S39 + CF-3 (promoción N3) |
| Case fixture family | `CASO-LIM-039` (+ T1A…T4B, c001/c002) |

**In-scope content inspected (source of truth = section TS; live site confirms curriculum card + method framing):**

- Metadata: `jobRelevance`, 9 `learningOutcomes`, tagline, accent/icon  
- Theory: 1 map block + 8 subtopics (T1-A/B … T4-A/B), each with code + callout  
- I Do: intro + 8 demos (`S39-T*-*-DEMO`)  
- We Do: intro claiming 24 retos; E1 guided / E2 independent / E3 transfer × 8 subtopics  
- You Do: CP-N3-C bundle starter, rubric, portfolioNote  
- Self-check: 5 MCQs with explanations  
- Resources: docs (Model Cards, NIST AI RMF, SRE, sklearn, logging, 12-factor), books, courses  

**Out of scope this run:** editing product TS; sections other than S39; applying diffs.

**Live navigation note:** SPA hash routing did not hydrate full section body in static fetch; curriculum index entry for Sección 39 matches source tagline/title; full pedagogical body audited from authoritative `s39-integrator-phase2.ts` (same module the build ships to GitHub Pages).

---

## 2. Executive Summary of Quality (1–10)

### Score: **7.9 / 10**

**Verdict:** Structurally complete integrator (9 theory blocks, 8/8 iDo, 24/24 weDo, solid You Do bundle, 5 fair MCQs, domain-honest resources) with **excellent responsible-ML ethics** (score ≠ fraude/parentesco, evidence packet mínimo, HITL, human_only, blameless postmortem, operational value metrics). Dragged below gold (≥ 9.5 expert bar) by: (1) **dense authoring-process meta-leak** (“esta autoría”, “lane de autoría/calificación”, `section_passed`, seed/ledger/checkpoint, “V3”, “Id de plataforma se conserva”); (2) **iDo print-theater** (many demos hardcode literals instead of computing from inputs); (3) **template-soup “Contrato operativo”** shells across all eight subtopics; (4) **tagline promises calibración** but code mostly teaches boolean gate predicates, not score calibration; (5) several **E3 starters** only exercise the happy path while solutions assert adversarials off-stage.

Compared with gold peers (S01 narrative depth, progressive disclosure of vocabulary in situ): S39 is stronger on ops/governance contracts and weaker on warm explanatory scaffolding and demo honesty. Prior automated PA rank 9.55 / auditor ACCEPT is **necessary but not sufficient** against the project’s own gold-standard anti-theater rules.

**Keep:** fail-closed tokens, ER-scope guard (`REJECT_ER_SCOPE`), packet completeness, override+audit, secrets/RBAC gates, three demo paths (happy/override/ood_abstain), model/data/system cards, synthetic Lima fintech framing without real PII.

**Fix first:** learner-facing meta-leak of authoring lanes; iDo computation honesty; rephrase promotion gates for *students* (not content authors); align calibración claim with at least one worked threshold/calibration micro-demo.

---

## 3. Detailed Issue Registry

Severity legend: **P0** = learner-facing process/meta leak or ethical/legal risk · **P1** = pedagogy/contract honesty · **P2** = redaction/clarity · **P3** = polish/consistency.

| ID | Sev | Location | Evidence (quote / summary) | Pedagogical impact |
|----|-----|----------|----------------------------|--------------------|
| I01 | P0 | `jobRelevance` L15 | “…Id de plataforma \`integrator-phase2\` se conserva. … CF-3 calificada en otra lane (esta autoría no escribe PASS en ledger ni seed).” | Student sees CMS/author pipeline jargon; confuses portfolio work with internal ledger. |
| I02 | P0 | `learningOutcomes[8]` L25 | “Documentar CF-3 y gates N3 sin auto-marcar section_passed en la lane de autoría” | Outcome teaches authoring policy, not a workplace skill. |
| I03 | P0 | Theory map P1–P3 + callout L31–60 | “esta autoría no escribe PASS”; “En V3, **S39 cierra…**”; “lane de autoría”; “no edita seed/checkpoint/ledger” | Meta-process dominates first screen of section; raises cognitive load before T1. |
| I04 | P0 | You Do `context` / `requirements` / comments L1942–2040 | “Platform id … conservado”; “section_passed permanece false en esta lane de autoría”; “# No escribas PASS en ledger/seed/checkpoint desde esta lane.” | Portfolio brief contaminated with internal gate machinery. |
| I05 | P0 | Self-check Q2 L2066–2070 | “CF-3 y regresión S27–S39 en esta lane de autoría:” | Active-recall quiz tests curriculum ops, not triage domain. |
| I06 | P1 | iDo demos T1-A, T1-B, T2-A, T2-B, T3-A, T4-A, T4-B | e.g. `print("label_space", "needs_review")`, `print("semver", True)`, `print("layers", 4)`, `print("n_overrides", 1)`, `print("postmortem", True)` | Gold anti-pattern **print theater**: demos assert conclusions without deriving them; weakens I Do as modeling of expertise. |
| I07 | P1 | Tagline L8 vs code | Tagline: “baseline, **calibración**, abstención…” — no exercise computes calibration reliability / reliability diagram / temperature; threshold unused in You Do `triage(..., threshold=...)` | Misaligned expectation: learner expects calibration mechanics from S34 carry-in; gets mode flags only. |
| I08 | P1 | Theory P2 pattern ×8 L68–326 | Identical shell: “Contrato operativo. Entrada: … Salida: … Error: … Criterio de éxito: …” | Template soup; progressive disclosure feels automated; less “mechanism teaching” than S01. |
| I09 | P1 | E3 starters (T2-A-E3, T2-B-E3, T3-A-E3, T3-B-E3, T4-A-E3, T4-B-E3) | Starter often only prints happy path; adversarials live only in solution asserts | Transfer phase under-scaffolded: learner cannot compare three routes in the same run without inventing fixtures. |
| I10 | P1 | S39-T4-B-E3 solution L1919–1920 | Missing `actions` returns `REQUEST_ROOT_CAUSE` (same token as empty root_cause) | Token conflation: diagnostic vocabulary loses precision (fail-closed pedagogy weakened). |
| I11 | P2 | Theory headings L64–322 | Lowercase telegraphic titles (“contratos, versiones y ownership”, “aceptación y demo”) vs title-case elsewhere / S01 | Visual/scan consistency; hurts TOC quality on live UI. |
| I12 | P2 | Registry example L118, L890 | `feature_set` version `"fs-v3"` while teaching **semver** major/minor/patch | Conceptual inconsistency in the same subtopic that teaches bump policy. |
| I13 | P2 | You Do `triage` L1978–1989 | Parameter `threshold` never used; all cases audited as `"queued_for_review"` regardless of score | Dead API surface; bundle does not demonstrate queue vs skip or thresholded prioritization. |
| I14 | P2 | Starter comment blocks | Mix of `# DEFECTO:` and `# DEFECT:` + “salida alineada a solutionCode” | “solutionCode” is schema meta; inconsistent defect labeling is minor noise. |
| I15 | P2 | Rubric L2045 | “Alineación al gate **V3** de la sección (CP-N3-C)” | “V3” is roadmap version, not a criterion a student can self-score. |
| I16 | P2 | Cognitive load | CF-3 / no-auto-PASS / autoría repeated ≥15× across prose, callouts, outcomes, quiz, You Do | Important ethics diluted by process repetition; spare working memory better spent on packet layers & ops modes. |
| I17 | P3 | S39-T1-B-E3 starter L898 | `print(decide(registry), len(registry) - 1)` off-by-one defect is good, but instruction density is very high | Fine for expert level; optional soften for first E3 of ownership topic. |
| I18 | P3 | Model/data/system cards in You Do | Cards are one-line markdown stubs | Acceptable scaffold, but weaker than external model-card best practice (limitations, metrics by slice, monitoring owner). |

---

## 4. Meta-Leak Report

Exact learner-facing leaks of **authoring / platform / ledger** process language (not domain HITL content). Count of distinct leak sites: **14**.

| # | Exact / near-exact leaked text | Location |
|---|--------------------------------|----------|
| M1 | “Id de plataforma \`integrator-phase2\` se conserva” | `jobRelevance` |
| M2 | “calificada en otra lane (esta autoría no escribe PASS en ledger ni seed)” | `jobRelevance` |
| M3 | “sin auto-marcar section_passed en la lane de autoría” | `learningOutcomes[8]` |
| M4 | “**CF-3:** gate de contratos N3 en **lane separada** (esta autoría no escribe PASS)” | Theory map · diccionario |
| M5 | “En V3, **S39 cierra el nivel 3**” | Theory map · P2 |
| M6 | “Error: reclamar PASS en ledger, seed o checkpoint desde la lane de autoría” | Theory map · P3 |
| M7 | “Esta autoría no escribe section_passed ni edita seed/checkpoint/ledger.” | Callout “Gate CP-N3-C + regresión” |
| M8 | “Esta lane deja el expediente listo; no escribe el PASS de CF-3.” | T4-A application para |
| M9 | “PASS de promoción y CF-3 no se escriben en esta autoría. … section_passed en false hasta la lane de calificación.” | Callout “CF-3 / regresión” |
| M10 | “Platform id \`integrator-phase2\` conservado. **No** marcar section_passed ni editar seed/checkpoint/ledger” | You Do `context` |
| M11 | “section_passed permanece false en esta lane de autoría” | You Do `requirements` |
| M12 | “# No escribas PASS en ledger/seed/checkpoint desde esta lane.” | You Do starter comments |
| M13 | “calificación es lane separada” | `portfolioNote` |
| M14 | “CF-3 y regresión S27–S39 en esta lane de autoría” (+ options about ledger) | Self-check Q2 |
| M15* | “# Contrato: corrige el DEFECT; salida alineada a solutionCode” | Multiple weDo starters (T1-B-E3, T3-A-E2, T3-B-E2, T4-A-E1, T4-A-E2, T4-A-E3, T4-B-E1, T4-B-E2) |

\*M15 is schema/meta for content authors; students should see “corrige el defecto del predicado” without referencing `solutionCode`.

**Not counted as meta-leak (domain-appropriate):** `auto_fraud=False`, HITL override, human_only, synthetic fixtures, CP-N3-C as portfolio gate name (ok if explained as *entregable de portafolio*, not ledger write).

**Recommended rewrite frame for Fixer:** speak to the **estudiante** — “no declares promoción ni marques la sección como aprobada hasta una revisión externa; deja evidencia reproducible (manifest, audit, cards)” — without “autoría”, “lane”, “seed”, “checkpoint”, “ledger”, “V3”, or “platform id se conserva”.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research → section fit

| External practice | S39 coverage | Gap |
|-------------------|--------------|-----|
| NIST AI RMF Map/Measure/Manage + HITL | Ops modes, release checklist, human override | Thin “Measure” instrumentation beyond booleans |
| Model cards (intended use, limitations, oversight) | Three cards + label_space ethics | Cards are stubs; few quantitative caveats |
| SRE blameless postmortems | T4-B + E3 | Good |
| Operational metrics (precision@k, override rate, review time) | Explicit in theory + E2 | Good — better than AUC-only courses |
| Gradual release (I/We/You) | Present structurally | iDo honesty weak; E3 transfer incomplete fixtures |
| Progressive disclosure | Builds on S27–S38 correctly | Glossary good; process meta adds untaught CMS concepts |

### 5.2 Connective tissue & narrative flow

**Strengths**

- Map block states pedagogical order T1→T4 clearly.  
- Explicit assembly story: “No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38…”.  
- Case thread `CASO-LIM-039-*` unifies subtopics (Lima fintech sintético).  
- Cross-link to S35 explanation layers in packet topic.

**Weaknesses**

- Opening is **gate/process-first**, story-second (inverse of S01, which opens with workplace motivation + dictionary of *learner* tools).  
- Eight near-identical “Contrato operativo” paragraphs reduce perceived progression; mechanism sentences are good but middle paragraph feels stamped.  
- Little “why this order of stages” causality beyond listing (e.g. why ER before graph features prevents leakage) — one extra mechanism sentence per stage would lift rank.

### 5.3 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Partial | 8 demos mapped 1:1 to subtopics with `why` — good structure. Many demos are literal prints → fails “models expert computation” bar. Theory code blocks are better (functions + predicates). |
| **We Do** | Strong | E1 defect-fix → E2 three-route assess → E3 fail-closed transfer is textbook GRR. Tokens exact and testable. Instructions ≥150 chars, fixture ids present. |
| **You Do** | Strong with holes | Real e2e bundle (packets, audit.jsonl, cards, manifest sha256, force_failure path). Dead `threshold`, thin cards, process meta in brief. |
| **Self-check** | Good / 1 bad item | Q1, Q3–Q5 domain-solid. Q2 is meta-leak quiz. |

### 5.4 Cognitive load

- **Intrinsic load (appropriate):** multi-stage pipeline, ownership registry, packet layers, ops modes.  
- **Extraneous load (reduce):** autoría/lane/ledger/V3/platform-id; triple restatement of no-PASS; English+Spanish+acronym density without micro-gloss for “ood”, “HITL”, “SSRF” on first use in places.  
- **Germane load (increase):** one worked numeric example of calibrated score → queue rank under capacity constraint; one mini reliability check.

### 5.5 Grammar & redaction (es-PE)

- Prose is largely correct professional Peruvian Spanish with intentional English industry terms (score, owner, rollback, packet).  
- Occasional denseness: “Id de plataforma … se conserva” is not natural learner Spanish.  
- “limeño” / Lima fintech framing is on-brand.  
- No broken grammar of severity P0 found; issues are register/jargon, not orthography.  
- Mixed heading case (I11).  
- “loguea” is colloquial acceptable in PE tech speech; fine.

### 5.6 Exercise & exam alignment

- We Do aligns tightly with theory contracts (stage order, bump major, packet keys, override, secrets, modes, acceptance, cards, postmortem).  
- No separate exam field in schema; selfCheck is the quiz — 5 items OK structurally; replace Q2.  
- You Do rubric weights ethics and CP-N3-C heavily (good for integrator).  
- E1 tasks sometimes too easy (boolean flip) — acceptable guided step if E3 carries weight.

### 5.7 Consistency with roadmap & prior sections

- Matches live curriculum card and `SECTION_MAP.tsv` row 39.  
- Correctly positions as N3 integrator after S38 concurrency.  
- Consistent ethics line with S30–S35 (score ≠ fraude; ER = misma entidad).  
- Legacy id conservation narrative is **consistent with other V3 remaps** but still should not be learner-facing.

### 5.8 Comparison with best-in-class external materials

| Peer | What they do better | What S39 does better |
|------|---------------------|----------------------|
| Google Model Cards / TF RAI | Rich limitations, disaggregated metrics, monitoring owners | Operational queue/HITL tokens students can code |
| NIST AI RMF playbooks | Full governance lifecycle language for orgs | Runnable fail-closed micro-predicates |
| SRE workbook | Deep incident taxonomy | Compact human_only / rollback teaching |
| Coursera/Andrew Ng eval modules | Calibration & metrics math | Explicit anti-auto-fraud product ethics for LATAM ops |
| CS50P / Py4E pedagogy | Warm progressive disclosure, honest demos | Domain ops realism & portfolio e2e |

### 5.9 Accessibility / motivation / other

- Synthetic data only — good.  
- No real PII — good.  
- Motivation for Peruvian fintech ops is present but buried under gate language.  
- You Do English comments in starter mixed with Spanish requirements — acceptable; prefer es-PE for learner comments.  
- `force_failure` path teaches rollback narrative — good resilience transfer from S38.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — Explorer must not apply them. Paths relative to repo root. Hunks may be abbreviated with `...` where surrounding context is unchanged.

### Diff A — Strip authoring meta from jobRelevance + outcome (I01, I02)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@
-  jobRelevance:
-    "En operaciones de riesgo y calidad de datos en fintech, banca y retail en el Perú, cierras **CP-N3-C** con **Responsible ML Case Triage**: intake→ER→relación→features→modelo→cola humana, con cards, monitoreo y control humano. El score solo prioriza revisión; no declara fraude ni parentesco. Id de plataforma `integrator-phase2` se conserva. La promoción de nivel requiere CP-N3-A/B/C, **regresión S27–S39** y **CF-3** calificada en otra lane (esta autoría no escribe PASS en ledger ni seed).",
+  jobRelevance:
+    "En operaciones de riesgo y calidad de datos en fintech, banca y retail en el Perú, cierras el entregable **CP-N3-C** con **Responsible ML Case Triage**: intake→ER→relación→features→modelo→cola humana, con cards, monitoreo y control humano. El score solo prioriza revisión; no declara fraude ni parentesco. Para la promoción de nivel documentas CP-N3-A/B/C, un **smoke de regresión S27–S39** y el expediente **CF-3** listo para revisión externa: dejas evidencia reproducible, sin auto-declarar el cierre del nivel.",
@@
-    { text: "Documentar CF-3 y gates N3 sin auto-marcar section_passed en la lane de autoría" },
+    { text: "Documentar el expediente CF-3 y los gates N3 con evidencia reproducible, sin auto-declarar la promoción de nivel" },
```

### Diff B — Theory map: learner-facing promotion language (I03, M4–M7)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@
-        "**Diccionario de la sección** (léelo antes de T1). **Responsible ML Case Triage:** flujo intake→ER→grafo→features→score→cola humana. **Evidence packet:** hechos + path + features + incertidumbre (no un número suelto). **Abstención / human_only:** modos que priorizan control humano. **Model/data/system card:** límites y ownership publicados. **CF-3:** gate de contratos N3 en **lane separada** (esta autoría no escribe PASS). **auto_fraud=False:** el score prioriza revisión; nunca declara fraude ni parentesco.",
-        "En V3, **S39 cierra el nivel 3** con el sistema demoable **Responsible ML Case Triage**. No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38 (calidad, ER, grafo, features, ranking, calibración, explicación, monitoreo y colas) en un recorrido que un revisor humano puede auditar de punta a punta con fixtures sintéticos peruanos.",
-        "Contrato de promoción (conceptual, no auto-ejecutado aquí). Entrada: entregables CP-N3-A, CP-N3-B y CP-N3-C, más smoke de regresión S27–S39 y el expediente de **CF-3**. Salida esperada de esta sección: bundle e2e con packets, audit, cards y notas de gate. Error: reclamar PASS en ledger, seed o checkpoint desde la lane de autoría. Criterio: la calificación de promoción y CF-3 ocurre en lane separada; aquí solo dejas evidencia reproducible.",
+        "**Diccionario de la sección** (léelo antes de T1). **Responsible ML Case Triage:** flujo intake→ER→grafo→features→score→cola humana. **Evidence packet:** hechos + path + features + incertidumbre (no un número suelto). **Abstención / human_only:** modos que priorizan control humano. **Model/data/system card:** límites y ownership publicados. **CF-3:** gate de contratos del nivel 3 revisado por un evaluador externo. **auto_fraud=False:** el score prioriza revisión; nunca declara fraude ni parentesco.",
+        "**S39 cierra el nivel 3** con el sistema demoable **Responsible ML Case Triage**. No inventas un producto nuevo: ensamblas lo ya aprendido en S27–S38 (calidad, ER, grafo, features, ranking, calibración, explicación, monitoreo y colas) en un recorrido que un revisor humano puede auditar de punta a punta con fixtures sintéticos peruanos.",
+        "Contrato de promoción (conceptual). Entrada: entregables CP-N3-A, CP-N3-B y CP-N3-C, más smoke de regresión S27–S39 y el expediente de **CF-3**. Salida esperada de esta sección: bundle e2e con packets, audit, cards y notas de gate. Error: auto-declarar promoción sin revisión externa. Criterio: dejas evidencia reproducible; la decisión de cierre del nivel la registra un revisor, no tu script.",
@@
-          "Entregable de S39: triage responsable demoable. Promoción N3 = CP-N3-A/B/C + regresión S27–S39 + CF-3 en lane de calificación. Esta autoría no escribe section_passed ni edita seed/checkpoint/ledger.",
+          "Entregable de S39: triage responsable demoable. Promoción N3 = CP-N3-A/B/C + regresión S27–S39 + CF-3 con revisión externa. Tú dejas el expediente; no auto-declaras el cierre del nivel.",
```

Also update map code keys for learner clarity:

```diff
-        "gates": ["CP-N3-C", "regression_S27_S39", "CF-3_separate_lane"],
-        "auto_fraud": False,
-        "section_passed_written_here": False,
+        "gates": ["CP-N3-C", "regression_S27_S39", "CF-3_external_review"],
+        "auto_fraud": False,
+        "self_declared_promotion": False,
```

### Diff C — Honest iDo demos (I06) — example T1-A + T1-B

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ S39-T1-A-DEMO
-          code: `def pipeline_line() -> str:
-    stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
-    return " > ".join(stages)
-
-print(pipeline_line())
-print("label_space", "needs_review")
-print("auto_fraud", False)`,
+          code: `def build_run(case_id: str, score: float) -> dict:
+    stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]
+    return {
+        "case_id": case_id,
+        "stages": stages,
+        "score": score,
+        "label_space": "needs_review",
+        "auto_fraud": False,
+    }
+
+run = build_run("CASO-LIM-039", 0.66)
+print(" > ".join(run["stages"]))
+print("label_space", run["label_space"])
+print("auto_fraud", run["auto_fraud"])`,
@@ S39-T1-B-DEMO
-          code: `def distinct_owners(reg: dict) -> int:
-    return len(set(reg.values()))
-
-reg = {"er_engine": "dq", "ranker": "ml-risk"}
-print(distinct_owners(reg))
-print("semver", True)
-print("owner_required", True)`,
+          code: `def registry_ok(reg: dict) -> bool:
+    return all(meta.get("owner") for meta in reg.values()) and len(reg) >= 2
+
+reg = {
+    "er_engine": {"ver": "1.2.0", "owner": "dq"},
+    "ranker": {"ver": "2.1.0", "owner": "ml-risk"},
+}
+print(len({m["owner"] for m in reg.values()}))
+print("semver_policy", "major_on_breaking")
+print("owner_required", registry_ok(reg))`,
```

Apply the same pattern to T2–T4 demos: derive `layers`, `override`, `release_ok`, `ops_mode`, `n_criteria`, `card_types` from data structures, not bare string literals.

### Diff D — You Do: use threshold; drop process meta (I04, I07, I13)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@
-      "Entrega el sistema e2e sintético de triage para `CASO-LIM-039`: ... Platform id `integrator-phase2` conservado. **No** marcar section_passed ni editar seed/checkpoint/ledger; PASS de gates es otra lane.",
+      "Entrega el sistema e2e sintético de triage para `CASO-LIM-039`: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos human_only, demo de aceptación, cards y postmortem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. No auto-fraude ni parentesco automático. Deja evidencia para revisión externa; no auto-declares la promoción de nivel.",
@@
-      "section_passed permanece false en esta lane de autoría",
+      "manifest declara self_declared_promotion=false hasta revisión externa",
@@
 def triage(case: dict, *, threshold: float, human_only: bool) -> EvidencePacket:
     ...
-    score = 0.0 if human_only else min(1.0, 0.35 + 0.45 * bool(case["shared_signal"]))
+    if human_only:
+        score = 0.0
+    else:
+        score = min(1.0, 0.35 + 0.45 * bool(case["shared_signal"]))
     return EvidencePacket(...)
@@
-            append_audit(audit, {"case_id": packet.case_id, "action": "queued_for_review"})
+            action = "queued_for_review" if packet.score >= threshold else "skip_low_priority"
+            append_audit(audit, {"case_id": packet.case_id, "action": action, "score": packet.score})
@@
-        "cf3_lane": "separate_lane",
-        "section_passed": False,
+        "cf3_review": "external",
+        "self_declared_promotion": False,
@@
-# No escribas PASS en ledger/seed/checkpoint desde esta lane.
+# No auto-declares promoción: el revisor externo evalúa el expediente.
@@
-      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. No escribe PASS en ledger/checkpoint; calificación es lane separada.",
+      "Cierre CP-N3-C + artefactos para regresión N3/CF-3. El expediente queda listo para revisión externa; no auto-declares promoción.",
@@
-      { criterion: "Alineación al gate V3 de la sección (CP-N3-C)", weight: "25%" },
+      { criterion: "Alineación al entregable CP-N3-C (triage e2e responsable)", weight: "25%" },
```

### Diff E — Self-check Q2 rewrite (I05)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@
-        question: "CF-3 y regresión S27–S39 en esta lane de autoría:",
-        options: ["Se documentan; PASS lo califica otra lane", "Marcan PASS solos en el ledger", "Se borran al exportar el bundle", "Solo aplican a S01"],
-        correctIndex: 0,
-        explanation:
-          "Dejas smoke de regresión y expediente listos, pero section_passed y el PASS de CF-3/promoción se escriben en una lane de calificación separada, no en la autoría del material.",
+        question: "Sobre regresión S27–S39 y CF-3 en tu entrega de S39:",
+        options: [
+          "Documentas smoke y expediente; la promoción la confirma un revisor externo",
+          "Tu script marca promoción automáticamente si el e2e imprime OK",
+          "Borras el checklist al exportar el bundle",
+          "Solo aplican a la sección 01",
+        ],
+        correctIndex: 0,
+        explanation:
+          "Dejas smoke de regresión y el expediente CF-3 listos. La confirmación de promoción es una revisión externa sobre esa evidencia, no un auto-PASS del script.",
```

### Diff F — E3 starters: three routes visible (I09) — pattern for T3-B-E3

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ S39-T3-B-E3 starter
 def decide(ops: dict):
     # DEFECTO
     return "STAY", "current_model"
 
 happy = {
     "case_id": "CASO-LIM-039-T3B",
     "incident": True,
     "drift_high": False,
     "prev_model_id": "previous_model",
     "prev_thr": "previous",
 }
-print(*decide(happy))
+missing = {**happy, "prev_model_id": None}
+drift_only = {"incident": False, "drift_high": True}
+print(*decide(happy), *decide(missing)[:1], *decide(drift_only))
```

(Adjust expected printed line in instruction/tests to keep a single graded happy path if the harness only scores one line; otherwise grade the triple.)

### Diff G — Token split for empty actions (I10)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ S39-T4-B-E3 solution
-    if not pm.get("actions"):
-        return "REQUEST_ROOT_CAUSE", False
+    if not pm.get("actions"):
+        return "REQUEST_ACTIONS", False
```

Update instruction/tests/hints accordingly.

### Diff H — Semver-consistent feature_set version (I12)

```diff
-    "feature_set": {"ver": "fs-v3", "owner": "ml-platform"},
+    "feature_set": {"ver": "3.0.0", "owner": "ml-platform"},
```

(and the parallel registry in T1-B-E3).

### Diff I — Optional: one calibration micro-demo under T2-A or T3-B (I07)

```diff
+// theory or iDo snippet
+def priority_bucket(score: float, thr_hi: float, thr_lo: float) -> str:
+    if score >= thr_hi:
+        return "queue_now"
+    if score >= thr_lo:
+        return "queue_batch"
+    return "skip"
+# thr chosen from validation calibration notes (S34), not from gut feel
```

Pair with one sentence: “Calibración aquí significa que el umbral se eligió para una tasa de cola sostenible, no que el score sea probabilidad de fraude.”

### Diff J — Starter meta comments (M15)

```diff
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
+# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Why first |
|---------|-----------|-----------|
| 1 | I01–I05, M1–M14 | Meta-leak is user-facing and multiplies across jobRelevance, outcomes, theory, You Do, quiz |
| 2 | I06 | iDo honesty is core GRR; low effort, high pedagogical return |
| 3 | I04/I13/I15 You Do + rubric language | Portfolio is what students ship; dead `threshold` is easy fix |
| 4 | I07 + Diff I | Align tagline “calibración” with at least one concrete micro-demo |
| 5 | I09 E3 fixtures | Transfer quality |
| 6 | I08 diversify contract middle paragraphs | Reduce template soup without breaking structure |
| 7 | I10 token split | Precision of fail-closed vocabulary |
| 8 | I11, I12, I14, I18 | Polish |

**Do not regress:** auto_fraud=False discipline; REJECT_ER_SCOPE; packet minimum keys; human override + audit; secrets blocker; human_only priority over drift; three demo paths; blameless postmortem; synthetic-only data.

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY*`, residual ledgers, future Fixer):

```yaml
section: 39
id: integrator-phase2
file: src/lib/course/sections/s39-integrator-phase2.ts
explorer_score: 7.9
prior_auto_rank: 9.55  # treat as non-authoritative vs gold anti-theater rules
structural:
  theory_blocks: 9  # map + 8 subtopics
  iDo: 8
  weDo: 24
  youDo: true
  selfCheck: 5
  resources: strong (NIST, Model Cards, SRE, sklearn)
nodes_flagged:
  - meta_leak_authoring_lane  # P0 cluster
  - meta_leak_platform_id_conservation
  - meta_leak_v3_roadmap_jargon
  - ido_print_theater
  - contrato_operativo_template_soup
  - tagline_calibracion_vs_code_gap
  - youdo_unused_threshold
  - e3_starter_happy_path_only
  - postmortem_token_conflation_REQUEST_ROOT_CAUSE
  - selfcheck_q2_process_not_domain
edges:
  - S39 assembles S27–S38  # keep
  - S39 ethics aligned S30–S35  # keep
  - S39 → S40 architecture handoff  # map of services next
fixer_entrypoints:
  - jobRelevance, learningOutcomes[8], theory map, T4 callouts
  - iDo demos T1–T4
  - youDo starter + portfolioNote + rubric
  - selfCheck questions[1]
 residual_risk_if_unfixed: learner confuses portfolio evidence with CMS ledger; weak I Do modeling
 status_for_fixer: ready
```

**Comparative node:** vs S01 gold — S01 wins narrative warmth & progressive vocab; S39 wins ops/governance density. Target after Fixer: expert rank ≥ 9.5 with **zero** “autoría/lane/ledger/seed/checkpoint/platform id se conserva/V3 gate” in learner-visible strings.

---

## Appendix — Inventory snapshot (for Fixer harness)

| Element | Count / status |
|---------|----------------|
| Theory headings | 9 |
| SubtopicIds | S39-T1-A … S39-T4-B |
| Theory code samples | 9 (all with `output`) |
| Callouts | 9 (info/tip/warning/danger mix) |
| iDo steps | 8 |
| weDo steps | 24 (8× E1+E2+E3) |
| You Do starter | full local bundle |
| Self-check | 5 MCQ |
| External doc links | 8+ |

---

This is the complete Explorer report for Section 39. Ready for the Fixer prompt.
