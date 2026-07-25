# S28 Explorer Report — Pruebas de datos, propiedades e integración

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Passes completed:** surface scan → pedagogical critique → redaction/grammar → meta-leak detection → comparative quality → external benchmark → diff architecture  
**Status:** COMPLETE (analysis only; no curriculum TS edited)

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| **Section index** | 28 |
| **Platform id (hash)** | `llm-agents` (legacy; content is **not** LLM agents) |
| **Live URL** | https://pillb.github.io/pyarcana/#llm-agents |
| **Repo source** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s28-llm-agents.ts` |
| **Title (metadata)** | Pruebas de datos, propiedades e integración |
| **shortTitle (UI)** | Props e integración |
| **tagline** | suite que encuentra errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas |
| **estimatedHours** | 19 |
| **level / phase** | Competente / phase 2 |
| **Fixture branding** | `CASO-LIM-028` · `run_id=cpn3a-dataqa` · `@example.pe` |
| **Adjacent sections** | S27 Pytest y contratos → **S28** → S29 SQL almacén ER |
| **Analysis scope** | Full `section28` object: metadata, theory (9 blocks), iDo (8 demos), weDo (24 exercises), youDo, selfCheck (5 Qs), resources. Live SPA shell confirmed section card; body content audited from source of truth (SPA hash route does not SSR section body to static fetch). |

**Topic map (as declared in theory intro):**

- **T1** Propiedades: invariantes + generación; idempotencia / simetría / metamorphic  
- **T2** Datos: schema/quality contracts; goldens, drift, reconciliación  
- **T3** Dobles: mocks/fakes/stubs; contract tests sin sobre-mocking  
- **T4** Sistema/CI: integración/E2E/testcontainers (concepto); flakes y determinismo  

**Subtopic ids:** `S28-T1-A` … `S28-T4-B` (8 subtopics × 3 We Do kinds = 24 exercises; 8 I Do demos aligned by subtopicId).

---

## 2. Executive Summary of Quality

### Score: **3.8 / 10**

### Key verdict

S28 sits in the **right roadmap slot** (after pytest strategy, before ER warehouse) and names the right professional themes—property/metamorphic testing, schema contracts, goldens, test doubles, integration, flake control. That strategic placement and the safety posture (sin PII real, matching ≠ fraude) are strengths.

The **delivery quality is severely degraded**. Theory paragraphs are dominated by **copy-pasted boilerplate** that repeats the same three fixture/contract sentences under nearly every heading, drowning genuine teaching content. Multiple **I Do demos ship code that cannot produce the declared `output`**, breaking the trust contract of “yo hago”. We Do items are **1-line print oracles** dressed as property/integration work, with English–Spanish hybrid autograder prose, starter/solution print-count mismatch, and at least one “DEFECT” that is not a defect. The section id/filename `llm-agents` and user-facing **legacy V3 meta** leak curriculum-migration internals. Against gold-standard early sections (S01 narrative density, progressive disclosure, dictionary scaffolding) and against external PBT materials (Hypothesis docs, GOOS-style doubles), S28 reads as a **thin, factory-generated shell** of a 19h Competente module.

**Not a zero:** learning outcomes list is coherent; selfCheck items are mostly well-aligned; resources (Hypothesis, sqlite3, unittest.mock, pytest fixtures, Great Expectations, testcontainers) are appropriate; safety callouts are consistent with course ethics.

**Learner impact if unfixed:** high cognitive load from noise, low transfer of property-based skill, broken demos that teach distrust, exercises that grade string printing rather than testing skill, and identity confusion for anyone who bookmarks `#llm-agents` expecting LLM agents (actual agents content is S49).

---

## 3. Detailed Issue Registry

Severity: **P0** blocker / trust-breaker · **P1** high pedagogical damage · **P2** medium quality · **P3** polish

---

### ISSUE-01 — Theory boilerplate copy-paste epidemic
- **Severity:** P0  
- **Locations:** Almost every theory paragraph after the opening block, especially `S28-T1-B` through `S28-T4-B` paragraphs  
- **Evidence (repeated verbatim or near-verbatim):**
  - `"Los tests de datos convierten supuestos de schema y matching en regresiones baratas antes de que el error llegue al revisor humano."`
  - `"Documenta evidencia y límites del fixture \`CASO-LIM-028\` (run_id=cpn3a-dataqa): sin PII real y sin auto-veredicto."`
  - `"Contrato operativo: entrada fixture \`CASO-LIM-028\` (run_id=cpn3a-dataqa) → asserts de schema/propiedad/integración con oráculos estables; fail-closed si dtypes o columnas requeridas rompen el contrato."`
  - `"Caso sintético PE: batch de contactos \`@example.pe\` en CI local; un fallo de golden muestra expected vs actual sin PII real ni etiquetas de fraude."`
- **Example node (T1-B, three paragraphs that barely teach metamorphic testing):** first sentence of each paragraph introduces a concept; remainder is fixture noise (source lines ~90–92).  
- **Pedagogical impact:** Violates progressive disclosure and dual-coding of GRR: the learner cannot form a clean schema for “metamorphic vs golden vs fake” because every node has the same edges to the same fixture text. Increases extraneous cognitive load (Sweller) without germane load.  
- **Graph note:** Boilerplate nodes form a complete clique; concept-specific content is a thin leaf.

---

### ISSUE-02 — I Do demo S28-T2-B-DEMO: code ≠ declared output
- **Severity:** P0  
- **Location:** `iDo.steps` · `demoId: "S28-T2-B-DEMO"`  
- **Evidence — code prints:**
  ```python
  print("drift", d)
  print("action", action)
  print("ok", True)
  ```
- **Evidence — declared output:**
  ```
  drift True
  action blocked
  version 1
  ```
- **Actual runtime output would be:** `drift True` / `action blocked` / `ok True`  
- **Pedagogical impact:** Direct violation of “I Do” honesty. Learner who runs the demo sees mismatch with the course UI; undermines oracles teaching (ironically the section’s theme).

---

### ISSUE-03 — I Do demo S28-T4-A-DEMO: code ≠ declared output (catastrophic)
- **Severity:** P0  
- **Location:** `iDo.steps` · `demoId: "S28-T4-A-DEMO"`  
- **Evidence — code:**
  ```python
  c = seed_entities()  # only inserts ('1','Ana')
  print(c.execute("select name from e where id='1'").fetchone()[0])
  print("integration", True)
  print("ok", True)
  ```
- **Evidence — declared output:**
  ```
  pairs [('1', '2')]
  n 1
  ```
- **Actual runtime:** `Ana` / `True` / `True` — no pairs, no second entity, description claims “cuenta pares por nombre igual” but code never builds pairs.  
- **Pedagogical impact:** Demo description, code, and output are three different lessons. Integration teaching fails completely.

---

### ISSUE-04 — I Do demos pedagogically vacuous / always-true “invariants”
- **Severity:** P1  
- **Locations:** e.g. `S28-T1-A-DEMO`: `len(norm(...)) >= 0` is always true for any string; does not teach meaningful invariant design. Several demos print `True` without a failing counterexample story.  
- **Pedagogical impact:** Best practice for property-based testing is to state a **non-trivial property**, show a generator, then show a shrink/failure. Here “I Do” models trivial tautologies. Weak transfer to Hypothesis-style thinking (external gold: Hypothesis docs — properties like roundtrip, idempotence with interesting generators).

---

### ISSUE-05 — We Do: starter vs solution I/O contract broken
- **Severity:** P0 / P1 (systematic)  
- **Locations:** All 24 `weDo.steps`  
- **Evidence pattern:**
  - Instructions: *“Contrato I/O: imprime las líneas exactas del solution output”*  
  - Starters typically emit **3 print lines** (result + debug + `ok True`)  
  - Solutions emit **1 print line** matching `output`  
- **Example `S28-T1-A-E1`:** starter ends with `print(a == b)`, `print('seed_policy', ...)`, `print('ok', True)`; solution only `print(a == b)` → `True`.  
- **Pedagogical impact:** Learner who “fixes the DEFECT” but leaves the diagnostic prints fails the oracle. Or learner deletes everything and hardcodes the output string. Teaches autograder gaming, not testing.

---

### ISSUE-06 — We Do depth far below “Competente / 19h / property + integration”
- **Severity:** P1  
- **Evidence samples:**
  - `S28-T2-B-E3`: print `meta['golden_version']` → `3` (dict get, not golden workflow)  
  - `S28-T3-B-E3`: print `rows_written` → `1` (dict access)  
  - `S28-T4-B-E3`: print the string `'unit→data→integration'` (memorize pipeline label)  
  - `S28-T1-B-E1`: `(a==b)==(b==a)` for identical strings (always True; no real symmetry bug hunt)  
- **Pedagogical impact:** No exercise uses `pytest`, `@given`, Hypothesis strategies, JSON golden files, or multi-assert integration. Section does not practice what S27 introduced (pytest) nor what resources advertise (Hypothesis). GRR “You Do together” stage is missing; We Do is micro-syntax, not guided suite building.

---

### ISSUE-07 — False or mislabeled defects / concept confusion in exercises
- **Severity:** P1  
- **S28-T3-A-E2:** DEFECT claims `str(d)` is not ISO; for `datetime.date`, `str(date(2026,7,20))` **is already** `2026-07-20` (same as `.isoformat()`). Starter “bug” passes the oracle without fix if only first line matters—or confuses learners who think they must change something meaningful.  
- **S28-T1-B-E2:** Instruction says “Metamorphic: upper no debe cambiar casefold equality” but solution is only `'Ana'.casefold() == 'ANA'.casefold()` — case-insensitive equality, **not** a metamorphic relation under an `upper` transform.  
- **S28-T1-B-E3:** Instruction mixes “idempotente en reorden de args” with symmetry of `==`; terminology muddles T1-B learning outcomes.  
- **Pedagogical impact:** Corrupts concept network: metamorphic ≠ casefold; idempotence ≠ symmetry.

---

### ISSUE-08 — Identity / naming mismatch (`llm-agents` vs content)
- **Severity:** P1 (UX + trust)  
- **Locations:** `id: "llm-agents"`; filename `s28-llm-agents.ts`; live hash `#llm-agents`; `jobRelevance` explains legacy.  
- **Evidence:** Title/tagline are about data/property/integration QA; S49 is the real “Agentes y tools” section.  
- **Pedagogical impact:** SEO/bookmarks/confusion; jobRelevance is forced to spend user-facing words on migration archaeology instead of career motivation.

---

### ISSUE-09 — Meta-leaks of curriculum engineering language (user-facing)
- **Severity:** P1  
- **See §4 Meta-Leak Report** for full inventory.  
- **Pedagogical impact:** Breaks immersion; signals unfinished rewrite; non-Spanish-professional tone.

---

### ISSUE-10 — Hybrid English / Spanglish / title-case redaction failures
- **Severity:** P2  
- **Evidence:**
  - Headings: `"invariantes y generación de casos"`, `"schema y quality contracts"`, `"mocks/fakes de HTTP, DB y reloj"`, `"flakes, determinismo y CI"` (inconsistent capitalization vs S01 Spanish titles)  
  - Exercise boilerplate: `"Datos sintéticos only"`; `"pass string = salida del oráculo"`  
  - Theory: untranslated *metamorphic tests*, *quality contracts*, *over-mocking*, *Testcontainers* without first Spanish gloss in some blocks  
  - Callout titles: `"No auto-accept drift"`, `"Seed fija"` mix  
- **Pedagogical impact:** Course claims “español peruano”; mid-phase Competente still code-switches heavily. Hurts accessibility for learners less comfortable with English jargon (should define once, then optionally keep English term).

---

### ISSUE-11 — Missing connective tissue S27 → S28 → S29
- **Severity:** P1  
- **Evidence:** Intro jumps to “suite de QA del ER” without naming what the learner **already can do in pytest from S27** and what is **new** (properties, goldens, doubles, integration layers). Forward reference to S29 appears only in a callout (“contaminar el almacén ER (S29)”) without a bridge paragraph.  
- **Contrast S01:** explicit dictionary, motivation, and “what you’ll build next” scaffolding.  
- **Pedagogical impact:** Narrative graph edge S27→S28 is weak; learner may re-learn normalize/casefold instead of extending the pytest suite.

---

### ISSUE-12 — Hypothesis and pytest advertised but never practiced
- **Severity:** P1  
- **Evidence:** `resources.docs` lead with Hypothesis; theory says “Hypothesis conceptual”; all code uses raw `random.seed` loops or plain prints; zero `@pytest.mark`, zero `@given`, zero `strategies`. S27 already taught pytest—S28 should **compose** property tests as pytest tests.  
- **External benchmark:** Hypothesis documentation and industry PBT practice teach: state the property, define strategies, run many examples, shrink failures. S28 stops at “seed=42 and a for-loop”.  
- **Pedagogical impact:** Resource–content mismatch; learners leave without transferable PBT skill.

---

### ISSUE-13 — You Do portfolio is a skeleton, not a 19h deliverable
- **Severity:** P1  
- **Evidence:** `youDo.starterCode` is ~10 lines with one `assert` on normalize and `print("qa_starter_ok")`. Objectives list four suite pillars but requirements include opaque items (`UNVERIFIED flakes = 0`, `Alineación QA ER (CP-N3-A)`) without acceptance checklist, file layout, or sample test names. `portfolioNote`: “Otra lane califica; no marcar passed aquí.”  
- **Pedagogical impact:** GRR final release fails: no clear independent performance criteria. Rubric criterion “gate V3” is unintelligible to learners.

---

### ISSUE-14 — Overlap / dilution with S16 and S27 without differentiation
- **Severity:** P2  
- **Evidence:** Schema validation and “fail closed on drift” reappear (S16 calidad); AAA/oracles/fixtures (S27). S28’s unique value should be **properties + goldens + doubles + integration determinism**. Theory does not table “qué ya sabes / qué es nuevo”.  
- **Pedagogical impact:** Sense of plateau; estimated 19h hard to justify.

---

### ISSUE-15 — SelfCheck option quality uneven
- **Severity:** P2  
- **Evidence:** Q1 options include absurd distractors (“Que la red esté caída”, “Fraude”) that are easily eliminated without understanding metamorphic tests. Q4–Q5 are stronger and aligned. Only 5 questions for 8 subtopics / 19h.  
- **Pedagogical impact:** Weak retrieval practice for T3 doubles and T4 containers; easy quiz may unlock without mastery.

---

### ISSUE-16 — Encoding / timeout / order claims under-delivered in content
- **Severity:** P2  
- **Evidence:** tagline and outcomes promise encoding, timeout, reanudación, orden. Content: one soft mention of encoding in integration output flag `encoding_ok True` (hardcoded); resume exercise is a list comprehension; no timeout test pattern; no Unicode normalization property (NFC/NFD) despite Latam course.  
- **Pedagogical impact:** Marketing of section > instructional content (outcome misalignment).

---

### ISSUE-17 — I Do intro and We Do intro are slogans, not scaffolds
- **Severity:** P3  
- **Evidence:** iDo.intro one sentence; weDo.intro `"24 ejercicios de propiedades, datos, dobles e integración/CI."` — no timeboxing, no “complete guided before independent”, no environment prerequisites.  
- **Pedagogical impact:** Missed GRR framing opportunity (Fisher & Frey gradual release).

---

### ISSUE-18 — Code style / demo inconsistency (casefold vs lower)
- **Severity:** P3  
- **Evidence:** Theory/normalize uses `casefold`; `S28-T1-B-DEMO` uses `.lower()` for Jaccard; exercise DEFECT in T3-B-E1 is “lower solo un lado” while solution switches to casefold both sides—good teaching moment buried without prose explanation of lower vs casefold for Turkish/Unicode edge (edgeCases sometimes mention locale).  
- **Pedagogical impact:** Subtle inconsistency for advanced learners.

---

### ISSUE-19 — jobRelevance is thin vs S01 motivation standard
- **Severity:** P2  
- **Evidence:** One dense sentence + legacy note; no PE workplace scenario for QA of ER pipelines (contrast S01 Interbank/BBVA/Caja framing).  
- **Pedagogical impact:** Low affective engagement at section open.

---

### ISSUE-20 — Callout “Mejor rechazar… (S29)” assumes warehouse not yet built
- **Severity:** P3  
- **Evidence:** T2-A tip points to S29 store; pedagogically OK as foreshadow, but no reciprocal “when you build S29, re-run these contracts”.  
- **Pedagogical impact:** Minor; missed spaced-repetition hook.

---

## 4. Meta-Leak Report

Exact leaked / internal-facing text that should not appear as learner-facing curriculum voice (or must be rewritten as pure learner language).

| # | Exact text (or tight paraphrase with locus) | Location | Type |
|---|-----------------------------------------------|----------|------|
| ML-1 | `Id legacy \`llm-agents\` se conserva; el path V3 es pruebas de datos/propiedades/integración, no agentes LLM.` | `jobRelevance` | Migration / versioning note to maintainers |
| ML-2 | `Alineación al gate V3 de la sección` | `youDo.rubric[0].criterion` | Internal gate nomenclature |
| ML-3 | `Otra lane califica; no marcar passed aquí.` | `youDo.portfolioNote` | Multi-agent / pipeline process instruction |
| ML-4 | `UNVERIFIED flakes = 0 en la suite gate` | `youDo.requirements` | Internal verification flag language |
| ML-5 | Systematic exercise suffix: `Fixture sintético \`CASO-LIM-028\` (run_id=cpn3a-dataqa, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.` | All 24 `weDo.steps[].instruction` | Autograder / harness instructions leaked into learner brief |
| ML-6 | Starter comments `# DEFECT: ...` as primary pedagogical framing | All starters | Defect-injection harness language (acceptable only if briefly learner-framed as “bug intencional a reparar”) |
| ML-7 | Platform id `llm-agents` + file `s28-llm-agents.ts` | Metadata / URL | Legacy product id conflicting with V3 content (user sees hash) |

**Not counted as pure meta-leak (intentional product branding, but overused):** `CASO-LIM-028`, `CP-N3-A`, `run_id=cpn3a-dataqa` — valid case framing if used **once** in intro + You Do, not every paragraph.

**Meta-leak count (distinct user-facing clusters):** **7** (ML-1…ML-7), with ML-5 representing 24 instances of the same cluster.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (applied)

| Principle | Source / practice | Application to S28 |
|-----------|-------------------|---------------------|
| Gradual Release of Responsibility (I Do / We Do / You Do) | Pearson & Gallagher; Fisher & Frey | Structure exists formally; fidelity is low—I Do demos broken/trivial; We Do not guided suite building; You Do under-specified. |
| Cognitive load / progressive disclosure | Sweller; instructional design | Boilerplate creates massive **extraneous** load; unique concept sentences are short. |
| Property-based testing pedagogy | Hypothesis docs; industry PBT tutorials | Properties listed conceptually; generation is toy RNG; no shrinking, no `@given`, no failure storytelling. |
| Test doubles & contracts | *Growing Object-Oriented Software, Guided by Tests* (in resources) | FakeClock/FakeHTTP sketch is good seed; no interaction vs state distinction practice in We Do. |
| Active recall | Quiz design | 5 questions; several weak distractors. |

### 5.2 I Do / We Do / You Do fidelity

| Phase | Present? | Fidelity | Notes |
|-------|----------|----------|-------|
| **I Do** | Yes (8 demos) | **Poor** | 2 demos with wrong outputs; several tautological; description/code mismatch on integration. |
| **We Do** | Yes (24 = 8×3 guided/independent/transfer) | **Poor–Medium structure / Poor depth** | Kind progression exists in metadata only; cognitive difficulty barely increases (transfer often still one print). |
| **You Do** | Yes (title + skeleton) | **Poor** | No file tree, no required test names, meta rubric. |
| **SelfCheck** | Yes (5) | **Medium** | Conceptually aligned topics; distractors often joke-level. |

### 5.3 Narrative flow & connective tissue

- Opening theory block is the **best** writing in the section (clear T1→T4 order, ER boundary “solo misma entidad”).  
- Immediately after, uniqueness collapses into boilerplate (ISSUE-01).  
- Missing “delta from S27” box.  
- Safety narrative (no fraude labels) is strong and consistent—preserve while cutting noise.

### 5.4 Cognitive load map (graph engineering)

```
[S27 pytest skill] --weak edge--> [S28 property/golden/double]
[CASO-LIM-028 boilerplate] --dense edges--> ALL theory nodes (noise)
[Learning outcome: Hypothesis] --broken edge--> [code: random.seed only]
[I Do T4-A description] --conflict--> [code] --conflict--> [output]
[We Do transfer] --false progression--> [still 1-liner]
```

### 5.5 Redaction (Peruvian Spanish)

- Prefer: “pruebas metamórficas”, “contratos de calidad”, “dobles de prueba”, “fluctuaciones / pruebas inestables (flakes)”, “no aceptar drift automáticamente”.  
- First-use pattern: **español (English term)** then English OK in code.  
- Capitalize headings consistently: e.g. “Invariantes y generación de casos”, “Contratos de schema y calidad”.  
- Remove English fragment `only` → `únicamente` / `solo datos sintéticos`.

### 5.6 Comparison: gold-standard early section (S01)

| Dimension | S01 | S28 |
|-----------|-----|-----|
| Motivation / PE workplace | Rich | Thin + legacy meta |
| Dictionary / progressive terms | Explicit | Absent |
| Paragraph uniqueness | High | Very low |
| Code/output honesty | Generally tight | Multiple breaks |
| Exercise realism | Setup tasks | Print-oracle micro-tasks |
| Hours credibility | High for scope | Low for 19h claim |

### 5.7 Comparison: external best-in-class

| Material | What they do well | S28 gap |
|----------|-------------------|---------|
| Hypothesis official docs | Properties + strategies + examples | Linked but not taught in code |
| PBT industry primers | Idempotence/roundtrip with failing cases | Always-true demos |
| GOOS | Mock at boundaries, real domain logic | Correct slogan; We Do doesn’t build a boundary test |
| Great Expectations | Expectation suites as data contracts | Concept named; no mini-expectation API exercise |
| testcontainers.com | Real dependency in CI | Correctly scoped as concept; OK if sqlite analog is honest—but I Do integration is broken |

### 5.8 What to preserve (do not regress)

1. T1–T4 conceptual order and learning outcomes list.  
2. Safety: synthetic data, no fraude/parentesco auto-labels, fail-closed on contracts.  
3. FakeClock / FakeHTTP sketch direction.  
4. Golden reconcile-requires-approval message.  
5. SelfCheck items on golden drift, over-mocking, flakes (tighten distractors only).  
6. Resource list (keep Hypothesis first).  
7. Callout “Simetría no siempre aplica” — rare high-quality nuance.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals for the Fixer**. Paths relative to repo root. Do **not** apply in Explorer.

### Diff group A — Strip theory boilerplate; restore unique teaching prose

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ theory T1-B paragraphs (illustrative rewrite; apply pattern to ALL theory nodes)
-        "**Idempotencia**: aplicar dos veces = una. **Simetría**: `sim(a,b)==sim(b,a)` en comparadores simétricos. Los tests de datos convierten supuestos de schema y matching en regresiones baratas antes de que el error llegue al revisor humano. Documenta evidencia y límites del fixture `CASO-LIM-028` (run_id=cpn3a-dataqa): sin PII real y sin auto-veredicto.",
-        "**Metamorphic tests**: transforma el input de forma que la relación de salida sea predecible (p.ej. añadir espacios no cambia normalize). Contrato operativo: entrada fixture `CASO-LIM-028` (run_id=cpn3a-dataqa) → asserts de schema/propiedad/integración con oráculos estables; fail-closed si dtypes o columnas requeridas rompen el contrato.",
-        "Útiles cuando no hay oráculo absoluto pero sí relación entre salidas. Caso sintético PE: batch de contactos `@example.pe` en CI local; un fallo de golden muestra expected vs actual sin PII real ni etiquetas de fraude. Documenta evidencia y límites del fixture `CASO-LIM-028` (run_id=cpn3a-dataqa): sin PII real y sin auto-veredicto.",
+        "**Idempotencia**: `f(f(x)) == f(x)`. En ER, `normalize` debe ser idempotente: un segundo pase no cambia el texto canónico.",
+        "**Simetría**: si el comparador es simétrico, `sim(a,b) == sim(b,a)`. Documenta excepciones (distancias dirigidas) en el nombre del test.",
+        "**Pruebas metamórficas (metamorphic)**: no conoces el score “correcto”, pero sí una relación. Ejemplo: rellenar espacios no debe cambiar `normalize`; reordenar tokens puede o no ser invariante según tu modelo de nombre. Cuando no hay oráculo absoluto, la relación entre salidas es el oráculo.",
```

**Rule for Fixer:** Keep **one** global mention of `CASO-LIM-028` / privacy in the opening theory block (and You Do). Delete repeated fixture/contract sentences from T1–T4 body paragraphs.

---

### Diff group B — Fix I Do T2-B output

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ S28-T2-B-DEMO output
-          output: `drift True
-action blocked
-version 1`,
+          output: `drift True
+action blocked
+ok True`,
```

---

### Diff group C — Fix I Do T4-A code + output + description alignment

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ S28-T4-A-DEMO
-        description: "Integración sqlite: inserta entidades y cuenta pares por nombre igual.",
+        description: "Integración sqlite en memoria: inserta dos entidades homónimas y cuenta el par candidato (id_a < id_b).",
         code: {
           language: 'python',
           title: "integ_demo.py",
-          code: `import sqlite3
-
-def seed_entities():
-    c = sqlite3.connect(":memory:")
-    c.execute("create table e(id text, name text)")
-    c.execute("insert into e values ('1','Ana')")
-    return c
-
-c = seed_entities()
-print(c.execute("select name from e where id='1'").fetchone()[0])
-print("integration", True)
-print("ok", True)
-`,
-          output: `pairs [('1', '2')]
-n 1`,
+          code: `import sqlite3
+
+con = sqlite3.connect(":memory:")
+con.execute("create table e(id text, name text)")
+con.executemany("insert into e values (?, ?)", [("1", "Ana"), ("2", "Ana")])
+n = con.execute("select count(*) from e").fetchone()[0]
+pairs = con.execute(
+    "select a.id, b.id from e a join e b on a.id < b.id and a.name = b.name"
+).fetchall()
+con.close()
+print("n", n)
+print("pairs", pairs)
+print("integration", True)
+`,
+          output: `n 2
+pairs [('1', '2')]
+integration True`,
```

---

### Diff group D — Remove user-facing legacy / gate meta

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ jobRelevance
-    "El **QA del motor ER** exige propiedades, contratos de schema y pruebas de integración sin flakes: goldens, dobles controlados y SQLite de lab. Id legacy `llm-agents` se conserva; el path V3 es pruebas de datos/propiedades/integración, no agentes LLM.",
+    "El **QA del motor de entity resolution** exige más que tests unitarios felices: propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima, un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión.",

@@ youDo.requirements
-      "UNVERIFIED flakes = 0 en la suite gate",
+      "Cero pruebas inestables (flakes) en la suite que bloquea merge: seed, reloj inyectado y orden estable",

@@ youDo.portfolioNote
-      "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. Otra lane califica; no marcar passed aquí.",
+      "Suite de QA para CP-N3-A: propiedades, contratos de datos e integración determinista. Documenta límites y evidencia; no uses PII real.",

@@ youDo.rubric[0]
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Cubre propiedades, contratos/golden, dobles e integración determinista del ER sintético", weight: "25%" },
```

*(Optional separate migration PR: rename platform id / file from `llm-agents` → e.g. `data-properties-integration` with redirect map—product decision, not pure copy edit.)*

---

### Diff group E — We Do instruction template (learner-facing)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ example S28-T1-A-E1 instruction
-          "S28-T1-A-E1 · Con seed=0, genera un random.random() y verifícalo reproducible en segunda llamada con misma seed (imprime ambos iguales como True). Fixture sintético `CASO-LIM-028` (run_id=cpn3a-dataqa, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
+          "S28-T1-A-E1 · El starter genera dos `random.random()` pero solo fija la semilla una vez. Corrige el código para que, con `seed=0` antes de cada muestra, ambos valores sean iguales. Imprime únicamente `True` o `False` (una línea).",
```

**Systematic Fixer rule:**

1. Short Spanish task sentence.  
2. Starter prints **exactly** the same number of lines as solution `output`.  
3. Comment `# BUG intencional:` optional once; drop autograder English.  
4. Raise depth on transfer exercises (real property or sqlite multi-assert).

---

### Diff group F — Align starter prints with solution (pattern)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ S28-T1-A-E1 starterCode
-          code: `# CASO-LIM-028 · seed reproducible para property/fuzz
-# DEFECT: no vuelve a seedear antes de b
-import random
-random.seed(0); a=random.random()
-b=random.random()
-print(a == b)
-print('seed_policy', 'must_reset')
-print('ok', True)
-`,
+          code: `# BUG intencional: falta volver a seedear antes de b
+import random
+random.seed(0)
+a = random.random()
+b = random.random()  # debería ir precedido de random.seed(0)
+print(a == b)
+`,
```

Apply same “single oracle line” pattern to all 24 exercises **or** expand solutions to multi-line professional test output—**never** mix.

---

### Diff group G — Fix false DEFECT T3-A-E2 (date iso)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ S28-T3-A-E2 — use datetime with non-ISO str, or require explicit isoformat from datetime
-from datetime import date
-d = date(2026, 7, 20)
-print(str(d))
+from datetime import datetime, timezone
+# BUG intencional: str(datetime) no es fecha ISO corta
+d = datetime(2026, 7, 20, 15, 30, tzinfo=timezone.utc)
+print(str(d))
+# solución esperada: print(d.date().isoformat())  → 2026-07-20
```

---

### Diff group H — Strengthen one We Do path to real pytest property (illustrative T1-A transfer)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ S28-T1-A-E3 (transfer) — escalate beyond strip tautology
+// Prefer: pytest function that loops seeded strings and asserts normalize idempotence;
+// print a single summary line: idempotent_ok True
```

*(Full replacement body left to Fixer; Explorer requires depth increase on at least T1 and T4 transfer items.)*

---

### Diff group I — You Do acceptance criteria

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ youDo.requirements (expand)
       "Fixtures sintéticas mínimas",
-      "UNVERIFIED flakes = 0 en la suite gate",
+      "Al menos: (1) test de propiedad/idempotencia con seed, (2) validador de schema con lista de errores, (3) golden con drift bloqueado sin approve, (4) fake de reloj o HTTP, (5) integración sqlite de pares candidatos, (6) sort/seed documentados para CI",
       "Documentación es-PE",
       "Alineación QA ER (CP-N3-A)",
```

Expand `starterCode` to a package layout comment (`tests/test_properties.py`, `tests/test_golden.py`, …).

---

### Diff group J — Connective tissue intro paragraph

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ first theory block — insert after opening sentence
+        "En S27 convertiste normalización y matching en contratos **pytest**. Aquí **amplías la suite**: propiedades y pruebas metamórficas, contratos de datos/goldens, dobles controlados e integración sin flakes. En S29 el almacén SQL consumirá estos mismos contratos como regresión de schema.",
```

---

### Diff group K — Heading redaction (sample)

```diff
-      heading: "invariantes y generación de casos",
+      heading: "Invariantes y generación de casos",
-      heading: "schema y quality contracts",
+      heading: "Contratos de schema y de calidad",
-      heading: "idempotencia, simetría y metamorphic tests",
+      heading: "Idempotencia, simetría y pruebas metamórficas",
-      heading: "mocks/fakes de HTTP, DB y reloj",
+      heading: "Mocks, fakes y reloj inyectado",
-      heading: "contract tests sin sobre-mocking",
+      heading: "Contratos de borde sin sobre-mocking",
-      heading: "integración/E2E y test containers",
+      heading: "Integración, E2E y testcontainers (concepto)",
-      heading: "flakes, determinismo y CI",
+      heading: "Flakes, determinismo y CI",
-      heading: "golden datasets, drift y reconciliación",
+      heading: "Datasets golden, drift y reconciliación",
```

---

### Diff group L — SelfCheck distractor upgrade (sample Q1)

```diff
-        options: ["Solo un número mágico", "Que la red esté caída", "Fraude", "Relaciones predecibles entre entradas transformadas y salidas"],
+        options: [
+          "Que la salida sea siempre un número mágico fijo sin mirar el input",
+          "Que dos ejecuciones con reloj real coincidan siempre en el timestamp",
+          "Que el score de matching autorice una etiqueta de fraude",
+          "Relaciones predecibles entre entradas transformadas y salidas",
+        ],
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Rationale |
|----------|-----------|--------|-----------|
| **1** | ISSUE-02, ISSUE-03 | Fix I Do code/output mismatches | Trust breakers; minutes of work, high impact |
| **2** | ISSUE-01 | Purge theory boilerplate; unique prose per subtopic | Largest cognitive-load win |
| **3** | ISSUE-05, ISSUE-07 | Align starter/solution I/O; fix false defects & mislabeled metamorphic/idempotence | Makes We Do assessable |
| **4** | ISSUE-09 / ML-* | Remove legacy/gate/lane/DEFECT harness voice | Professional learner surface |
| **5** | ISSUE-11, ISSUE-12 | S27 bridge + real pytest/Hypothesis (or honest “sin Hypothesis, con seed”) | Outcome–resource alignment |
| **6** | ISSUE-06, ISSUE-13, ISSUE-16 | Deepen transfer exercises + You Do acceptance + encoding/timeout coverage | Justifies 19h Competente |
| **7** | ISSUE-08 | Plan id/filename rename or permanent redirect strategy | Product/UX |
| **8** | ISSUE-10, ISSUE-15, ISSUE-17–20 | Redaction, quiz, polish | After structural fixes |

**Estimated fixer effort:**  
- P0 trust fixes: small  
- Boilerplate rewrite: medium–large (all theory nodes)  
- Exercise redesign to true PBT/integration: large  
- Id rename: product coordination  

---

## 8. Graph Memory Update Notes

For shared curriculum hardening context / SECTION graph:

```yaml
section: 28
id: llm-agents
file: s28-llm-agents.ts
title: Pruebas de datos, propiedades e integración
explorer_score: 3.8
status: audited_complete
theme_actual: data_property_integration_qa_for_ER
theme_legacy_id: llm-agents  # NOT LLM agents; real agents = S49

edges:
  prerequisite: S27 (pytest strategy, fixtures, AAA)
  successor: S29 (SQL ER warehouse consumes schema contracts)
  related_overlap: S16 (data quality contracts) — differentiate explicitly
  capstone_thread: CP-N3-A / CASO-LIM-028 / cpn3a-dataqa

quality_flags:
  - boilerplate_theory_severe
  - ido_output_mismatch: [S28-T2-B-DEMO, S28-T4-A-DEMO]
  - wedo_print_oracle_shallow
  - starter_solution_linecount_mismatch_systematic
  - meta_leak_legacy_v3_gate_lane
  - hypothesis_linked_not_taught
  - hours_19_not_justified_by_depth

preserve:
  - T1-T4 topic order
  - safety_no_fraud_labels
  - golden_reconcile_requires_approval
  - fake_clock_http_direction
  - resources_list_hypothesis_sqlite_mock_ge_testcontainers
  - selfcheck_core_items_on_golden_overmock_flakes

fixer_entrypoints:
  - src/lib/course/sections/s28-llm-agents.ts  # only file for content fixes
  - optional later: id migration map if renaming llm-agents

issue_count_registered: 20
meta_leak_clusters: 7
```

**Comparative memory:** S28 shares the same factory failure mode as neighboring mid-curriculum sections (boilerplate CASO-LIM + DEFECT We Do). Treat S28 as **template for bulk We Do instruction cleanup** once Fixer pattern is proven.

**External anchors to re-check after fix:**  
- https://hypothesis.readthedocs.io/  
- https://docs.python.org/3/library/sqlite3.html  
- GOOS doubles discipline  
- GRR: model non-trivial property → guided property test in pytest → independent mini-suite  

---

## Pass log (Loop Engineering)

1. **Surface:** Mapped structure 9 theory / 8 iDo / 24 weDo / youDo / 5 quiz / resources.  
2. **Pedagogy:** GRR fidelity low; load high; outcomes overclaim vs exercises.  
3. **Redaction:** Spanglish headings; English harness fragments.  
4. **Meta-leak:** Legacy id, V3 gate, lane grading, DEFECT autograder prose.  
5. **Comparative:** Far below S01; below Hypothesis-led PBT teaching.  
6. **Technical honesty:** Confirmed T2-B and T4-A demo mismatches; date iso false defect.  
7. **Diff architecture:** Groups A–L ready for Fixer.  

No further **significant** unreported issue classes found within S28 scope (residual polish only).

---

This is the complete Explorer report for Section 28. Ready for the Fixer prompt.
