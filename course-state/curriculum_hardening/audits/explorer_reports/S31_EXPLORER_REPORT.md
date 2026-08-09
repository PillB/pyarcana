# S31 Explorer Report — Grafos y evidencia relacional

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Live site:** https://pillb.github.io/pyarcana/ (hash `#streaming-data`)  
**Source:** `src/lib/course/sections/s31-streaming-data.ts`  
**Platform section id:** `streaming-data`  
**Index:** 31  

> Scope lock: only Section 31. No product files were edited. Proposed diffs are recommendations for the Fixer, not applied patches.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Title (user-facing) | Grafos y evidencia relacional |
| Short title | Grafos y evidencia |
| Tagline | grafo temporal que responde cómo están conectados con camino reproducible y no convierte centralidad en culpabilidad |
| Estimated hours | 18 |
| Level | Competente a experto |
| Phase | 2 |
| Capstone thread | Inicio **CP-N3-B** (Relationship Investigation Workbench path) |
| Fixture | `CASO-LIM-031` · `run_id=cpn3b-01` · `@example.pe` |
| Subtopics | T1-A/B Modelo · T2-A/B Construcción · T3-A/B Algoritmos · T4-A/B Calidad/viz |
| I Do demos | 8 (`S31-T*-DEMO`) |
| We Do exercises | 24 (guided / independent / transfer × 8 subtopics) |
| You Do | Grafo temporal con caminos de evidencia (esqueleto) |
| Self-check | 5 MCQ |
| Resources | NetworkX (types/tutorial/paths/centrality), Wikipedia graph theory, W3C PROV, Neo4j modeling, SNAP, CS50P, MIT 6.100L |

**Content identity note (critical):** The file name and platform hash are still **`streaming-data` / `s31-streaming-data.ts`**, but the *entire* student path is **entity-relationship evidence graphs** (nodes, multiedges, provenance, paths, centrality limits, redaction). Kafka/Redis Streams are explicitly *not* the path. Live curriculum card correctly shows “Grafos y evidencia”; the legacy id remains a discoverability and meta-leak hazard.

**Predecessor / successor (roadmap):**
- **S30** closes CP-N3-A (probabilistic ER, review queue).
- **S31** should open CP-N3-B: *how are resolved entities connected, with auditable edges?*
- **S34** later packages the Relationship Investigation Workbench (graph + calibrated ranking).

**Sources inspected:** full TypeScript course object (~1923 lines); live site curriculum card for S31; external benchmarks (NetworkX tutorial/centrality docs; investigative ER+graph literature). SPA hash routes do not server-render body text; rendered content is isomorphic to the TS source.

---

## 2. Executive Summary of Quality

### Score: **5.5 / 10**

**Verdict:** Conceptually well-aimed and ethically strong (evidence graph ≠ guilt), with a clean T1→T4 map and useful privacy framing — but **execution quality is below gold-standard early sections**. The student-facing surface is damaged by (1) **legacy/streaming/V3 meta-leaks**, (2) **catastrophic I Do code↔output mismatches on 6 of 8 demos**, (3) **boilerplate paragraph recycling** that destroys progressive disclosure, and (4) **We Do exercises reduced to “add the missing print” defect drills** rather than genuine guided construction. Automated prior audit (`S31_AUDIT.json`, ACCEPT) only checked redaction rank and missed these pedagogical breaks.

| Dimension | Score | Notes |
|---|---|---|
| Domain / ethics alignment | 8.5 | Centralidad ≠ culpa; shared contact ≠ parentesco; no auto-fraude — excellent |
| Roadmap fit (S30→S31→S34) | 8.0 | Correct CP-N3-B start after ER |
| Theory technical correctness | 7.0 | Pure-Python graphs mostly right; betweenness promised not taught; dead code |
| I Do fidelity | 2.5 | **6/8 demos print ≠ declared output** |
| We Do design | 3.5 | 24 items, but almost all are print-alignment defects |
| You Do / portfolio | 4.5 | Thin skeleton; meta note about gates/lanes |
| Meta-leak hygiene | 2.0 | Streaming legado, V3, oráculo, DEFECT, gate lanes |
| Redaction / es-PE quality | 5.0 | Spanglish “only”, lowercase headings, recycled copy |
| Cognitive load / progressive disclosure | 4.0 | Same contracts pasted into every subsection |
| External parity (NetworkX / investigative graphs) | 6.0 | Right topics; weak library bridge; shallow algorithms |

**One-line fix thesis for Fixer:** Strip curriculum-engineering meta, rewrite the opening as a clean bridge from S30 ER → evidence graph, **re-sync every I Do demo to its output**, diversify We Do so starters require real construction (not one missing `print`), and teach one limited centrality metric with interpretation instead of name-dropping betweenness.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / trust-breaking · **P1** high pedagogy · **P2** medium polish · **P3** nice-to-have.

---

### ISSUE-01 · P0 · I Do demos: code output does not match declared `output` (6 of 8)

**Evidence (representative):**

`S31-T1-A-DEMO` code prints:
```text
nodes 4 edges 3
types ['owns', 'share_phone']
ok True
```
Declared output:
```text
n 4 e 3
directed_tx True
weight 99.5
```

`S31-T1-B-DEMO` code prints latest rid + flags; output claims `multi 2` / `rids ['r1', 'r2']` / `prov_ok True`.

`S31-T2-A-DEMO` code prints node list from `build_nodes`; output claims `edges 3` / `contact_node ph:9001`.

`S31-T2-B-DEMO` description promises “conservando lista de record_id”; aggregate function **drops** record ids; prints `{'amount': 15.0, 'n': 2}` vs output `sum 15.0` / `ids ['t1','t2']`.

`S31-T3-B-DEMO` prints `('H', 3)` then `hub True` / `ok True`; output is `top_node H degree 3` / `interpretation structure_only` / `guilt_label False`.

`S31-T4-A-DEMO` prints neighbors of S only; description says ego k=1; output claims `ego ['A', 'B', 'S']`.

**Only aligned demos:** `S31-T3-A-DEMO` (BFS path) and `S31-T4-B-DEMO` (redact + evidence).

**Pedagogical impact:** I Do is the model the learner imitates. Mismatched oracle outputs train distrust, break “run and compare,” and sabotage We Do transfer. For Gradual Release of Responsibility, a broken I Do is a **P0**.

---

### ISSUE-02 · P0 · Student-facing meta-leak: streaming legado / V3 / path engineering

**Evidence quotes:**

- `jobRelevance`: *“Id legacy `streaming-data` se conserva; el path V3 es grafos y evidencia relacional, no Kafka/streams.”*
- Theory H1: *“En V3, **S31 no es el path principal de Kafka/Redis Streams**. Ese material se reubica.”*
- Callout title: *“Contenido reubicado conceptualmente”* · content: *“Material legado de streaming de este archivo **no es el camino V3 del estudiante en S31**.”*
- Heading: *“De streaming legado a grafos de evidencia (inicio CP-N3-B)”*
- You Do context: *“Id plataforma streaming-data conservado.”*
- portfolioNote: *“No marca gate PASS; otra lane califica.”*
- Rubric criterion: *“Alineación al gate V3 de la sección”* (25%)

**Pedagogical impact:** Students should never see curriculum migration notes, platform hash archaeology, or multi-lane grading ops. Opens with “what this used to be” instead of “what you will build after S30 ER.” Cognitive load wasted on irrelevant Kafka denial.

---

### ISSUE-03 · P0 · We Do instructions leak harness vocabulary (DEFECT / oráculo / solutionCode)

**Evidence (pattern on ~23/24 exercises):**
> *“…implementa solo el DEFECT indicado… Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; …”*

Starter comments:
```text
# DEFECT: omite print n_nodes; contrato incompleto
# Contrato: corrige el DEFECT; salida alineada a solutionCode
```

**Pedagogical impact:** “Oráculo,” “DEFECT,” and “solutionCode” are **internal autograder/authoring terms**. They frame learning as “fix the missing print line the hidden grader expects,” not “build a graph skill.” English *only* in Spanish copy also degrades es-PE redaction.

---

### ISSUE-04 · P1 · Extreme boilerplate / progressive-disclosure failure in theory

Same phrases reappear nearly every subsection:

| Phrase | Approx. count in theory |
|---|---|
| *“La estructura relacional se usa para *explicar* conexiones… no para etiquetar culpabilidad automática.”* | **8** |
| *“Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031`…”* | **8** |
| *“Caso sintético PE (Lima, Red Andina): contactos `@example.pe`…”* | **7** |
| *“Documenta evidencia y límites del fixture `CASO-LIM-031`…”* | **5** |

**Pedagogical impact:** Violates progressive disclosure and dual-coding economy. After T1-A the ethical mantra is already known; repeating it as filler on *every* paragraph block crowds out new content (typed multigraph schema, hop-limit rationale, infra vs person hubs). Learners skim and miss the *new* sentence buried between copies.

---

### ISSUE-05 · P1 · We Do design is “missing print” theater, not guided construction

**Pattern:** Starter already implements full algorithm; “defect” is omitting one `print` that the solution adds. Examples:

- E1 T1-A: only missing `print("n_nodes", …)`
- E2 T3-B: only missing `print("kind", kind)` while kind is already computed
- E3 T2-B: only missing `print("ok", total == detail_n)`

Transfer-kind exercises often remain the same defect class (add print), not a transfer of the concept to a new schema.

**Pedagogical impact:** Under I/We/You Do, We Do should scaffold partial implementation (TODO functions, broken edge direction, missing provenance field) with hints. Current design yields high completion rate, **low encoding strength**. 24 exercises for 18h looks dense but is shallow.

---

### ISSUE-06 · P1 · Betweenness/closeness name-dropped; only degree proxy implemented; dead code

**Evidence (T3-B theory):**
> *“**Degree / betweenness / closeness** miden **estructura**, no culpa.”*

Code comments *“betweenness simple en grafo chico”* and defines `shortest_paths` then **never uses it**; only degree-normalized proxy prints.

**Pedagogical impact:** Expertise illusion. Learners think they covered three centralities; they practiced one. Dead `shortest_paths` confuses readers who try to map code to prose. Better: teach degree thoroughly + one interpretive exercise; mention betweenness as “más adelante / NetworkX” with a link.

---

### ISSUE-07 · P1 · Resources advertise NetworkX; zero NetworkX in section body

Docs/courses link NetworkX graph types, tutorial, shortest paths, centrality. All theory/I Do/We Do/You Do use raw `dict`/`defaultdict`/`deque`.

**Pedagogical impact:** Not wrong to teach pure Python first, but gold-standard courses (NetworkX tutorial, SNAP materials) show a **bridge**: “here is the algorithm; here is the one-liner in NetworkX for production.” Without bridge, resources feel ornamental and You Do students may never open them.

---

### ISSUE-08 · P1 · You Do under-specified for 18h portfolio claim

Starter is a 25-line BFS skeleton on two nodes. Objectives list multigraph, provenance, aggregation, components, subgraph tests, redaction — **none required as concrete deliverables/files**.

portfolioNote: *“No marca gate PASS; otra lane califica.”* — meta + demotivating.

**Pedagogical impact:** Ambiguous acceptance criteria → portfolio quality variance. Compare gold S02-style You Do which ties deliverables to named gates and case ids with explicit acceptance checks.

---

### ISSUE-09 · P1 · Self-check over-weights ethics, under-weights graph mechanics

5 questions:
1. Centralidad ≠ culpa  
2. Provenance purpose  
3. Aggregate keeps records  
4. Shared phone ≠ parentesco  
5. Path = hypothesis for human review  

**Missing technical recall:** directed vs undirected modeling, multigraph necessity, hop-limit purpose, connected components role, ego-k definition, unit of weight (PEN vs count).

**Pedagogical impact:** Active-recall set does not sample the full LO list. Ethics is excellent but already hammered in theory; quiz should interleave mechanism + ethics.

---

### ISSUE-10 · P2 · Theory code quality nits

- `s31_th_2` imports `datetime, timezone` unused.
- `centrality_limits.py` dead `shortest_paths` function.
- Headings start lowercase inconsistently: *“nodos, aristas, dirección y peso”*, *“multigrafo, tiempo y provenance”*, etc. (S02 gold uses sentence case / Title-like headings).
- Theory T2-A node count print uses `len(nodes) + len(contact values)` while contact values are *not* always added to `nodes` set the same way edges use them — output `nodes 7` is fortuitously correct but logic is opaque.

**Pedagogical impact:** Small trust erosions; less severe than I Do mismatches.

---

### ISSUE-11 · P2 · Connective tissue opens on “not streaming” instead of S30 bridge

Stronger open would be:
> “En S30 resolviste *¿misma entidad?* Ahora en S31 respondes *¿cómo están conectadas?* con aristas auditables…”

Current open leads with Kafka denial (meta) and only later mentions entities/transactions.

**Pedagogical impact:** Narrative continuity break between CP-N3-A and CP-N3-B; student does not feel the capstone climb.

---

### ISSUE-12 · P2 · Inconsistent edge type naming across demos

- Theory: `shared_phone`, `owns`, `transfer`
- I Do T1-A: `share_phone` (no “d”)
- Exercises: `link`, `share`, `tx`, `shared_phone`, `has_email` patterns

**Pedagogical impact:** Schema discipline is a learning outcome (“Define tipos de nodo/arista antes de cargar filas”). Inconsistent teaching materials undermine the tip *“Schema primero.”*

---

### ISSUE-13 · P2 · Spanglish / redaction (es-PE)

Examples:
- *“Datos sintéticos only”* (should be “solo”)
- *“out-strength”*, *“ego”*, *“hop limit”*, *“hub”* without first Spanish gloss in many exercise instructions
- *“pass string = salida del oráculo”*
- Mixed formal/informal imperative tone

**Pedagogical impact:** Course brand is “español peruano profesional.” Early gold sections gloss English terms on first use.

---

### ISSUE-14 · P2 · S31-T3-B-E3 instruction incomplete vs siblings

Most exercises append the long fixture/I-O trailer; E3 of T3-B ends at the technical ask without the CASO-LIM boilerplate (inconsistent, though the boilerplate itself is problematic). Also relies on pre-baked `incident` dict rather than computing degree from edges — weak transfer.

---

### ISSUE-15 · P3 · File/id naming debt

`s31-streaming-data.ts` + id `streaming-data` while title is graphs. Acceptable for platform stability if **never mentioned** to students; currently mentioned often (ISSUE-02). Fixer should keep id if required but **erase student-facing references**.

---

### ISSUE-16 · P3 · Comparative gap vs best-in-class external materials

| External reference | What they do well | Gap in S31 |
|---|---|---|
| NetworkX tutorial | Graph types → build → degree → paths, clear API | No NetworkX bridge; no MultiGraph type |
| NetworkX centrality docs | Precise definitions of degree/betweenness | Names three metrics, teaches one poorly |
| Investigative ER+graph (Senzing/Linkurious/Neo4j ER KG talks) | ER first, then graph for exploration; human-in-the-loop | Ethics good; missing mini case narrative “revisor abre path E1–phone–E2” with screenshots/text storyboard |
| Stanford SNAP | Scale intuition | Only one scale-policy exercise (render vs summarize) |

S31’s differentiator (no auto-guilt) is **better than many fraud-graph blogs** that overclaim. Keep that; raise technical depth and demo integrity.

---

### ISSUE-17 · P1 · I Do T2-B contradicts its own learning claim

Description: *“Agrega montos por par conservando lista de record_id.”*  
Code:
```python
agg = defaultdict(lambda: {"amount": 0.0, "n": 0})
for a, b, amt, _ in rows:  # discards record_id
```
Theory T2-B and callout correctly insist detail must be kept. Demo undoes the lesson.

---

### Positive findings (preserve in Fixer)

1. **Ethical core is excellent** and aligned with course DNA (S11 RelationshipEvidence, S30 scores≠fraude, S34 workbench).
2. **LO list is coherent** for an evidence-graph module.
3. **Theory algorithm codes** (degree, components, BFS path, ego-k, redact) largely match their outputs.
4. **Callouts** (Schema primero, No borrar detalle, Centralidad ≠ culpabilidad, Privacidad en viz) are well chosen when not buried in meta.
5. **24 exercises cover all 8 subtopics** with guided→independent→transfer labels (labels good; depth needs work).
6. **Resource list** is curated and relevant once a body bridge exists.
7. **Privacy redaction** demos (when aligned) are interview-relevant for PE banking/BPO contexts.

---

## 4. Meta-Leak Report

Exact student-visible (or near-visible via jobRelevance/youDo) leaks:

| # | Location | Exact leaked text (or core fragment) | Class |
|---|---|---|---|
| M1 | `jobRelevance` | `Id legacy \`streaming-data\` se conserva; el path V3 es grafos y evidencia relacional, no Kafka/streams.` | Platform archaeology + versioning |
| M2 | theory[0].heading | `De streaming legado a grafos de evidencia (inicio CP-N3-B)` | Legacy curriculum |
| M3 | theory[0].paragraphs[0] | `En V3, **S31 no es el path principal de Kafka/Redis Streams**. Ese material se reubica.` | Version / migration note |
| M4 | theory[0].callout | title `Contenido reubicado conceptualmente` · `Material legado de streaming de este archivo **no es el camino V3 del estudiante en S31**. Target: grafos + evidencia (inicio CP-N3-B).` | Author-to-author note |
| M5 | We Do instructions ×23 | `implementa solo el DEFECT indicado` · `pass string = salida del oráculo` · `solution output` | Autograder meta |
| M6 | We Do starter comments ×24 | `# DEFECT: …` · `# Contrato: corrige el DEFECT; salida alineada a solutionCode` | Authoring harness |
| M7 | youDo.context | `Id plataforma streaming-data conservado.` | Platform id leak |
| M8 | youDo.portfolioNote | `No marca gate PASS; otra lane califica.` | Internal grading pipeline |
| M9 | youDo.rubric[0] | `Alineación al gate V3 de la sección` | Versioned gate jargon |

**meta_leak_count (distinct classes):** **9** (M1–M9). Individual exercise instances of M5/M6 are mass-replicated (~47 surfaces).

**Not counted as leak (acceptable domain jargon):** CP-N3-B, CASO-LIM-031, run_id, provenance, hop limit (when glossed).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round pedagogical principles applied

- **Gradual Release (I/We/You Do):** model → scaffold → independent transfer.
- **Cognitive load (Sweller):** reduce extraneous load (boilerplate, meta); manage intrinsic load of graph theory with progressive disclosure.
- **Worked examples (Sweller/Cooper):** I Do must be correct and complete; mismatched outputs are anti-examples.
- **Desirable difficulties / active recall:** quizzes and transfer exercises should force retrieval of mechanisms, not only ethics slogans.
- **Schema-first modeling:** aligns with graph data modeling best practice (Neo4j docs, NetworkX MultiGraph).
- **Human-in-the-loop investigation:** ER then graph exploration (industry consensus) — S31 ethics match this; do not auto-label fraud.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Intended | Actual | Gap |
|---|---|---|---|
| I Do | Worked example, runnable, explained | 8 demos; 6 wrong outputs; some contradict “why” | **Broken** |
| We Do | Partial code + hints + solution | Full code minus print; hints thin (“sets.”) | **Label-only scaffolding** |
| You Do | Portfolio-grade mini system | Skeleton BFS | **Under-spec** |
| Autocheck | Sample LOs | 5 ethics-heavy items | **Narrow** |

### 5.3 Cognitive load map

- **Intrinsic:** medium-high (graphs + temporal multiedges + provenance + privacy) — appropriate for “Competente a experto.”
- **Extraneous:** **very high** (meta V3/streaming, repeated contracts, harness jargon, dead code).
- **Germane:** reduced because attention is spent decoding author notes and print contracts.

### 5.4 Narrative flow / connective tissue

Desired arc:
`S30 entity clusters` → `project tables to typed graph` → `preserve multiedge detail` → `paths & components` → `centrality with disclaimer` → `case subgraph + redacted view` → (later S34 ranking).

Actual arc inserts a **curriculum apology** about streaming first. After stripping meta, remaining technical sequence **is** sound.

### 5.5 Grammar & es-PE redaction

- Generally readable professional Spanish mixed with English technical terms.
- Failures: *only*, *oráculo*, *DEFECT*, lowercase multi-word headings, inconsistent glosses.
- No major orthography disasters found in theory sentences; problem is **editorial hygiene and meta**, not basic Spanish grammar.

### 5.6 Exercise & exam alignment to LOs

| LO | Theory | I Do | We Do | You Do | Quiz |
|---|---|---|---|---|---|
| Model nodes/edges weight+direction | Y | broken | print | thin | N |
| Multigraph temporal + provenance | Y | broken | print | thin | Y (1) |
| Build from entities/tx | Y | broken | print | thin | N |
| Aggregate without deleting detail | Y | **contradicts** | print | thin | Y (1) |
| Degree, components, paths | Y | path OK | print | thin | N |
| Centrality with limits | partial | broken | print | thin | Y (1) |
| Subgraphs + tests | Y | broken | print | thin | N |
| Viz privacy + edge evidence | Y | OK | print | thin | Y (2) |

### 5.7 Accessibility / motivation

- Synthetic PE case (Lima, Red Andina) is good motivation **once stated once**.
- Redaction and role-based privacy support real compliance narratives.
- Demotivating meta: “otra lane califica,” Kafka denial.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposed** only. Paths relative to repo root. Fixer may regroup.

### Diff A — Strip meta from jobRelevance + opening theory (ISSUE-02, M1–M4, ISSUE-11)

```diff
--- a/src/lib/course/sections/s31-streaming-data.ts
+++ b/src/lib/course/sections/s31-streaming-data.ts
@@ jobRelevance
-  jobRelevance:
-    "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión. Id legacy `streaming-data` se conserva; el path V3 es grafos y evidencia relacional, no Kafka/streams.",
+  jobRelevance:
+    "En investigación de relaciones entre entidades (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas tipadas, agregados y caminos explicables para la cola de revisión humana. Tras el ER de S30, el grafo responde *cómo están conectadas* las entidades — no *quién es culpable*.",
@@ theory[0]
-      heading: "De streaming legado a grafos de evidencia (inicio CP-N3-B)",
+      heading: "De entidades resueltas a grafo de evidencia (inicio CP-N3-B)",
       paragraphs: [
-        "En V3, **S31 no es el path principal de Kafka/Redis Streams**. Ese material se reubica. Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades con caminos reproducibles y evidencia por arista. La estructura relacional se usa para *explicar* conexiones auditables en investigación, no para etiquetar culpabilidad automática.",
-        "El hilo: contactos, cuentas y transacciones **sintéticas** (`run_id=cpn3b-01`, `@example.pe`). El grafo responde “¿qué aristas existen y con qué fuente?” — no “¿quién es culpable?”. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031` (run_id=cpn3b-01) → grafo con tipos, pesos y provenance; error tipificado si falta `record_id` o el schema de arista.",
-        "Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad**. Privacidad: centralidad y paths no etiquetan fraude ni parentesco. Caso sintético PE (Lima, Red Andina): contactos `@example.pe` y transferencias demo; el revisor ve path + evidencia, nunca un veredicto de fraude o parentesco.",
+        "En S30 respondiste **¿misma entidad?** Aquí **inicias CP-N3-B**: modelar **cómo están conectadas** las entidades resueltas con caminos reproducibles y **evidencia por arista**. El grafo *explica* conexiones auditables; **no** etiqueta fraude ni parentesco.",
+        "Hilo conductor: contactos, cuentas y transferencias **sintéticas** del fixture `CASO-LIM-031` (`run_id=cpn3b-01`, `@example.pe`, Lima / Red Andina). Contrato: filas → grafo con tipos, pesos y provenance; error tipificado si falta `record_id` o el schema de arista.",
+        "Orden: **T1 Modelo** → **T2 Construcción** → **T3 Algoritmos** → **T4 Calidad y privacidad**. El revisor ve **path + evidencia**, nunca un auto-veredicto.",
       ],
       callout: {
         type: "info",
-        title: "Contenido reubicado conceptualmente",
-        content:
-          "Material legado de streaming de este archivo **no es el camino V3 del estudiante en S31**. Target: grafos + evidencia (inicio CP-N3-B).",
+        title: "Puente desde S30",
+        content:
+          "Los ids canónicos del ER alimentan nodos; las transacciones y contactos alimentan aristas. Sin provenance, el grafo es decoración y no sirve al workbench.",
       },
```

### Diff B — Deduplicate theory boilerplate (ISSUE-04)

**Rule for Fixer:** Keep the ethics sentence **once** in the section intro (or a single callout). In each subtopic, write **only new content**. Replace every repeated block of:
- `La estructura relacional se usa para…`
- full `Contrato operativo: entrada filas…`
- full `Caso sintético PE…`

with topic-specific prose. Example for T1-A paragraph 2–3:

```diff
-        "Dirigido vs no dirigido: transferencias son dirigidas; “comparte dirección” suele modelarse no dirigido o bidireccional simétrico. Contrato operativo: entrada filas sintéticas del fixture `CASO-LIM-031` (run_id=cpn3b-01) → grafo con tipos, pesos y provenance; error tipificado si falta `record_id` o el schema de arista.",
-        "El **peso** es evidencia cuantitativa (**no** veredicto de culpa). Documenta **unidades** (PEN, count, score) en el schema del grafo. Caso PE (Lima, Red Andina): contactos `@example.pe` y transferencias demo; el revisor ve **path + evidencia**, nunca un auto-veredicto de fraude o parentesco.",
+        "Dirigido vs no dirigido: las transferencias son **dirigidas**; “comparte teléfono/dirección” suele modelarse **no dirigido** (o con dos aristas simétricas si tu store lo exige). Elige una convención y documenta.",
+        "El **peso** es evidencia cuantitativa (**no** veredicto). Declara **unidades** en el schema: `PEN`, `count` o `score`. Mezclar unidades en el mismo campo rompe agregaciones y rankings posteriores.",
```

Apply analogous rewrites to T1-B…T4-B (8 subtopics).

### Diff C — Fix all broken I Do demos (ISSUE-01, ISSUE-17)

**Strategy:** Prefer aligning `code` prints to a clean pedagogical output (not the reverse of inventing code for orphan outputs). Examples:

#### C1 · S31-T1-A-DEMO

```diff
           code: `nodes = ["E1", "E2", "A1", "A2"]
 edges = [
     ("E1", "A1", "owns", 1.0, True),
     ("E2", "A2", "owns", 1.0, True),
-    ("E1", "E2", "share_phone", 0.8, False),
+    ("E1", "E2", "shared_phone", 0.8, False),
+    ("A1", "A2", "transfer", 99.5, True),
 ]
 
 def edge_types(edges):
     return sorted({e[2] for e in edges})
 
-print("nodes", len(nodes), "edges", len(edges))
-print("types", edge_types(edges))
-print("ok", True)
+print("n_nodes", len(nodes))
+print("n_edges", len(edges))
+print("types", edge_types(edges))
+print("directed_tx", any(e[2] == "transfer" and e[4] for e in edges))
+print("weight", next(e[3] for e in edges if e[2] == "transfer"))
 `,
-          output: `n 4 e 3
-directed_tx True
-weight 99.5`,
+          output: `n_nodes 4
+n_edges 4
+types ['owns', 'shared_phone', 'transfer']
+directed_tx True
+weight 99.5`,
```

#### C2 · S31-T1-B-DEMO

```diff
           code: `edges = [
     {"pair": ("E1", "E2"), "ts": "2026-03-01", "rid": "r1", "src": "crm"},
     {"pair": ("E1", "E2"), "ts": "2026-01-15", "rid": "r0", "src": "tx"},
 ]
+print("multi", len(edges))
+print("rids", sorted(e["rid"] for e in edges))
+print("prov_ok", all(e.get("rid") and e.get("src") for e in edges))
 `,
-          # remove unused latest_by_pair OR keep and print both multi + latest
-          output: `multi 2
-rids ['r1', 'r2']
-prov_ok True`,
+          output: `multi 2
+rids ['r0', 'r1']
+prov_ok True`,
```
(Note: original output listed `r2` which never exists in data — Fixer must not resurrect ghost ids.)

#### C3 · S31-T2-A-DEMO

```diff
-print(build_nodes(ents, accs, phones))
-print("projection", True)
-print("ok", True)
+nodes = build_nodes(ents, accs, phones)
+print("nodes", nodes)
+print("n_nodes", len(nodes))
+print("shared_phone_value", "900")
 `,
-          output: `edges 3
-contact_node ph:9001
-builders tables_ok`,
+          output: `nodes ['900', 'a1', 'e1', 'e2']
+n_nodes 4
+shared_phone_value 900`,
```

#### C4 · S31-T2-B-DEMO (must keep record_ids)

```diff
 def aggregate_pairs(rows):
-    agg = defaultdict(lambda: {"amount": 0.0, "n": 0})
-    for a, b, amt, _ in rows:
+    agg = defaultdict(lambda: {"amount": 0.0, "n": 0, "ids": []})
+    for a, b, amt, rid in rows:
         k = (a, b)
         agg[k]["amount"] += amt
         agg[k]["n"] += 1
+        agg[k]["ids"].append(rid)
     return dict(agg)
 
-print(aggregate_pairs(rows)[("E1", "E2")])
-print("aggregate", True)
-print("ok", True)
+g = aggregate_pairs(rows)[("E1", "E2")]
+print("sum", g["amount"])
+print("ids", g["ids"])
+print("detail_n", g["n"])
 `,
           output: `sum 15.0
 ids ['t1', 't2']
 detail_n 2`,
```

#### C5 · S31-T3-B-DEMO

```diff
-print(degree_hub(edges))
-print("hub", True)
-print("ok", True)
+hub, d = degree_hub(edges)
+print("top_node", hub, "degree", d)
+print("interpretation", "structure_only")
+print("guilt_label", False)
 `,
           output: `top_node H degree 3
 interpretation structure_only
 guilt_label False`,
```

#### C6 · S31-T4-A-DEMO

```diff
-def neighbors(adj, src):
-    return sorted(adj.get(src, []))
+def ego(adj, seed, k=1):
+    seen = {seed}
+    layer = {seed}
+    for _ in range(k):
+        nxt = set()
+        for n in layer:
+            for m in adj[n]:
+                if m not in seen:
+                    seen.add(m)
+                    nxt.add(m)
+        layer = nxt
+    return sorted(seen)
@@
-print(neighbors(adj, "S"))
-print("path_support", True)
-print("ok", True)
+print("ego", ego(adj, "S", 1))
+print("k", 1)
+print("test_ok", True)
 `,
           output: `ego ['A', 'B', 'S']
 k 1
 test_ok True`,
```

### Diff D — Centrality theory: teach one metric honestly (ISSUE-06)

```diff
-        "**Degree / betweenness / closeness** miden **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un dato compartido (call center). …",
+        "**Degree centrality** (grado normalizado) mide **cuántos vecinos** tiene un nodo — es **estructura**, no culpa. Un hub puede ser un procesador de pagos legítimo o un teléfono de call center. *Betweenness* y *closeness* existen (ver NetworkX); en S31 dominas degree + interpretación y dejas las otras para profundizar con la documentación enlazada.",
```

Remove unused `shortest_paths` from `centrality_limits.py`; keep degree norm + `not_guilt True`.

### Diff E — We Do instruction template (ISSUE-03, ISSUE-05, ISSUE-13)

Replace the global trailer with student-facing Spanish, e.g.:

```diff
-          "S31-T1-A-E1 · Crea un dict `nodes` … Fixture sintético `CASO-LIM-031` (run_id=cpn3b-01, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
+          "S31-T1-A-E1 · Completa el modelo mínimo: dict `nodes` (3 ids) y lista `edges` con `src`, `dst`, `etype`, `weight`, `directed`. Imprime `n_nodes`, `n_edges` y cuántas aristas tienen `directed=True`. Usa solo el starter sintético `CASO-LIM-031` (sin PII real; sin etiquetar fraude ni parentesco).",
```

Starter comments:

```diff
-# DEFECT: omite print n_nodes; contrato incompleto
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
+# TODO: imprime también n_nodes para cerrar el contrato de salida
```

**Deeper We Do redesign (preferred for ≥8 exercises):** leave real gaps — e.g. empty `edges = []` with data tables provided; student builds owns/transfer; or invert a directed edge as the bug; or drop `record_id` from one edge and require validation to report `n_bad`. Keep guided/independent/transfer progression real.

### Diff F — You Do student-facing cleanup (ISSUE-08, M7–M9)

```diff
     context:
-      "Construye un grafo sintético entity/account/contact/tx con multiaristas, provenance y consulta de camino reproducible. Centralidad se reporta con disclaimer: no es culpabilidad. ER/matching no implica fraude ni parentesco. Id plataforma streaming-data conservado.",
+      "Construye un grafo sintético entity/account/contact/tx con multiaristas, provenance y consulta de camino reproducible. Reporta centralidad solo con disclaimer de estructura (no es culpabilidad). Hechos de contacto compartido no implican fraude ni parentesco.",
@@
     portfolioNote:
-      "Inicio CP-N3-B: grafo temporal con evidencia. No marca gate PASS; otra lane califica.",
+      "Inicio CP-N3-B: entrega un grafo temporal con evidencia, tests mínimos y una vista de path redactada lista para portafolio.",
     rubric: [
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Modelo de grafo completo (tipos, pesos, provenance, multiedges)", weight: "25%" },
```

Add concrete acceptance checklist to `requirements` or `objectives`:
- `graph.json` o módulo con nodos/aristas tipadas  
- capa detalle + agregada  
- `path(src,dst,max_hops)` reproducible  
- tests: no self-loop basura, provenance, idempotencia  
- `view` con labels redactados + records por hop  
- README es-PE con disclaimer de centralidad  

### Diff G — Self-check expansion (ISSUE-09)

Add 3–5 items (keep total ≤10 for UX), e.g.:

```diff
+      {
+        question: "¿Por qué modelar un multigrafo en transferencias E1→E2?",
+        options: [
+          "Para borrar el detalle y dejar un solo peso",
+          "Para conservar varios hechos/fuente entre el mismo par sin colapsar auditoría",
+          "Porque NetworkX lo exige siempre",
+          "Para etiquetar fraude automáticamente",
+        ],
+        correctIndex: 1,
+        explanation: "Varias aristas = varios hechos auditables; el agregado es capa aparte.",
+      },
+      {
+        question: "Un hop limit en BFS del workbench sirve sobre todo para:",
+        options: [
+          "Garantizar que el camino demuestre fraude",
+          "Acotar costo y ruido de caminos largos poco accionables",
+          "Eliminar la necesidad de provenance",
+          "Convertir el grafo en no dirigido",
+        ],
+        correctIndex: 1,
+        explanation: "Sin límite, caminos largos son caros y poco útiles para revisión.",
+      },
```

### Diff H — Optional NetworkX bridge snippet (ISSUE-07)

After pure-Python path demo, optional theory callout + 6-line example:

```python
# Opcional: mismo camino con NetworkX (producción)
# import networkx as nx
# G = nx.Graph(); G.add_edges_from([("A","B"),("B","C"),("C","D")])
# print(nx.shortest_path(G, "A", "D"))
```

Do **not** require NetworkX in We Do unless environment guarantees the dep.

### Diff I — Cosmetic headings + unused imports (ISSUE-10)

```diff
-      heading: "nodos, aristas, dirección y peso",
+      heading: "Nodos, aristas, dirección y peso",
-      heading: "multigrafo, tiempo y provenance",
+      heading: "Multigrafo, tiempo y provenance",
# … capitalize remaining subtopic headings …
-    from datetime import datetime, timezone
-    # multiaristas E1→E2 con provenance
+    # multiaristas E1→E2 con provenance
```

### Diff J — Schema vocabulary consistency (ISSUE-12)

Normalize etypes across theory, I Do, We Do to a documented set, e.g.:
`owns | transfer | shared_phone | shared_email | has_phone | has_email`.

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue(s) | Effort | Why first |
|---|---|---|---|
| **1** | ISSUE-01 + ISSUE-17 (I Do sync) | M | Restores trust in demos; unblocks learning |
| **2** | ISSUE-02 + Meta M1–M4, M7–M9 (strip streaming/V3/lanes) | S–M | First screen hygiene |
| **3** | ISSUE-03 + M5–M6 (We Do harness language) | M | Student-facing redaction at scale |
| **4** | ISSUE-04 (boilerplate dedupe) | M–L | Progressive disclosure / readability |
| **5** | ISSUE-05 (real We Do gaps, not only prints) | L | Learning quality |
| **6** | ISSUE-08 + Diff F (You Do acceptance) | M | Portfolio value |
| **7** | ISSUE-06 + ISSUE-09 (centrality honesty + quiz) | S–M | LO alignment |
| **8** | ISSUE-07 + ISSUE-10–14 (bridge, polish, schema names) | S–M | Finish quality bar |

**Do not** rename platform id `streaming-data` in this Fixer pass unless product owners approve migration (breaks deep links/progress). **Do** silence it in all student-visible strings.

---

## 8. Graph Memory Update notes

For shared curriculum graph / fixer context:

```yaml
section: 31
id: streaming-data
title: Grafos y evidencia relacional
file: src/lib/course/sections/s31-streaming-data.ts
explorer_score: 5.5
status: needs_fixer
edges:
  predecessor: S30 (ER probabilístico / CP-N3-A close)
  successor_soft: S32 features; S34 Relationship Investigation Workbench
  capstone: CP-N3-B start
preserve:
  - ethics: centrality_not_guilt
  - ethics: shared_contact_not_kinship
  - fixture: CASO-LIM-031 / cpn3b-01 / @example.pe
  - pure_python graph algorithms (degree, CC, BFS, ego-k)
  - privacy redaction patterns
  - resource links (NetworkX, PROV, Neo4j)
fix_clusters:
  - P0_ido_output_mismatch: [T1-A, T1-B, T2-A, T2-B, T3-B, T4-A]
  - P0_meta_streaming_v3: [jobRelevance, theory0, youDo]
  - P0_harness_vocab_wedo: [DEFECT, oráculo, solutionCode]
  - P1_boilerplate_theory: [estructura_relacional×8, contrato_operativo×8]
  - P1_shallow_wedo_print_defects: [24 exercises]
  - P1_betweenness_overclaim: [T3-B]
  - P1_youdo_thin_meta_gates: [portfolioNote, rubric]
graph_nodes_quality:
  theory_algorithms: mostly_green
  ido_demos: mostly_red
  wedo_exercises: yellow_structure_red_depth
  youdo: yellow
  selfcheck: yellow_ethics_green_tech_missing
  meta_leaks: red
notes_for_fixer:
  - Keep platform id streaming-data; never mention to students
  - Open with S30 bridge, not Kafka denial
  - Prefer fixing prints to match honest code over inventing fake outputs
  - T2-B demo must keep record_id list
  - Deduplicate ethics/contract paragraphs; one mantra is enough
```

**Comparative memory:** Relative to S02 gold (rich narrative, matching worked examples, clear out-of-scope without multi-paragraph migration theater), S31 is **topic-mature but redaction- and demo-immature**. Relative to industry ER→graph investigation materials, S31’s refusal to auto-label fraud is a **strength** to preserve.

---

## Explorer pass log (STORM)

1. **Surface scan:** id vs title mismatch; 8 theory blocks; 8 I Do; 24 We Do; You Do; 5 quiz.  
2. **Deep pedagogical critique:** I/We/You broken at demo fidelity and exercise depth; ethics strong.  
3. **Redaction & grammar:** es-PE mostly OK; Spanglish/harness language.  
4. **Meta-leak detection:** 9 classes, mass We Do replication.  
5. **Comparative quality:** vs NetworkX/SNAP/investigative graph practice + internal S02/S30.  
6. **Loop refinement:** enumerated 17 issues; prioritized; drafted apply-ready diffs.

---

This is the complete Explorer report for Section 31. Ready for the Fixer prompt.
