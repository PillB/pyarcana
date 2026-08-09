# S40 Explorer Report — Arquitectura, DDD y decisiones técnicas

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (STORM + Graph + Loop + Harness)  
**Date:** 2026-07-24  
**Scope:** Section 40 only — analysis only; no curriculum edits applied  
**Live:** https://pillb.github.io/pyarcana/#agentic-architecture  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s40-agentic-architecture.ts`  
**Platform id (hash):** `agentic-architecture`  
**Prior automated audit:** `course-state/curriculum_hardening/audits/S40_AUDIT.json` → verdict ACCEPT, high_issue_count 0 (structural redaction only; does not cover pedagogy/meta/youDo)

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 40 |
| Title | Arquitectura, DDD y decisiones técnicas |
| shortTitle | Arquitectura y DDD |
| id / hash | `agentic-architecture` (**legacy id**; content is DDD/architecture, not LLM agent orchestration) |
| Phase / level | phase 3 · Master |
| estimatedHours | 20 |
| Case | `CASO-LIM-040` (Red Andina, Lima sintético) |
| Gate | CP-N4-A (inicio Nivel 4): fronteras explícitas + medida/dueño/consecuencia |
| Theory blocks | 1 mapa + 8 subtemas (T1-A/B … T4-A/B) |
| I Do | 8 demos (`S40-T*-*-DEMO`) |
| We Do | 24 retos (E1 guided / E2 independent / E3 transfer × 8) |
| You Do | Dossier de arquitectura gobernada + starter `readiness` |
| Self-check | 5 MCQ |
| Resources | C4, Fowler BC, Cockburn hexagonal, Azure Arch, AWS ADR, Evans DDD ref, DDIA, Vernon IDDD, CS146S, etc. |

**In scope this run:** full source of `s40-agentic-architecture.ts`, live site navigation (home catalog confirms S40 card: “Arquitectura y DDD” / tagline de mapa de arquitectura), pedagogical benchmarks vs early gold (S02) and vs external architecture/DDD materials, meta-leak hunt, redaction (español peruano), exercise/exam alignment.

**Out of scope:** applying fixes; other sections; product code outside the report deliverables.

---

## 2. Executive Summary of Quality (1–10)

### Score: **6.4 / 10**

**Verdict:** *Contract-complete scaffold with strong resource map and fail-closed lab discipline, undermined by developer meta-leak, corrupted You Do evidence keys, theory/I Do that often does not teach architecture (only boolean gate predicates), and Master-level claim inflated relative to progressive-disclosure depth.*

**What works**
- Clear section map + dictionary (QA scenario, trade-off, BC, ports/adapters, C4, ADR, medida+dueño+consecuencia).
- Explicit disambiguation of content path vs LLM agents (`agent_orchestration_topic: False`) — pedagogically useful once meta wording is cleaned.
- Consistent E1→E2→E3 gradual release: single defect → three routes → fail-closed CONTINUE/breach/uncertainty.
- Domain-honest ethics: no PII, no fraud/parentesco inference, secrets out of repo.
- Resources are best-in-class for the topic (C4, Cockburn, Evans, ADR catalogs, DDIA).
- Self-check items on ports inversion and gate CP-N4-A are well-formed distractors.

**What fails (high impact)**
1. **Meta-text leak** about “Id legacy” / “path V3” in learner-facing theory.
2. **You Do starter** uses **broken slug keys** (`est_mulo`, `relaci_n_triage_reporti`, truncated ADR key) — portfolio checklist is unreadable and unprofessional for a Master capstone.
3. **Theory paragraphs** for T2–T4 share near-identical “Contrato operativo… Error: una frontera ambigua… Criterio de éxito…” stems — high monotony, low concept teaching vs gold S02.
4. **I Do demos misaligned** to subtopic claims (notably T2-A, T3-B, T4-A).
5. **We Do** teaches predicate inversion more than DDD/C4/ADR *practice* — weak transfer for 20h Master architecture dossier.
6. **youDo context** grammar error (“…bloquea el gate” doubled after “El gate se bloquea ante:”).

**Automated ACCEPT vs this report:** `S40_AUDIT.json` only flags structural boilerplate markers. This Explorer pass finds **pedagogical and redaction defects** that ACCEPT does not measure.

---

## 3. Detailed Issue Registry

Severity: **P0** blocker for learner trust / portfolio · **P1** high pedagogy · **P2** medium quality · **P3** polish

### ISSUE-01 — Meta-leak: curriculum versioning / legacy id in learner prose
- **Severity:** P1  
- **Location:** theory map paragraph 4 (`Ruta de S40…`)  
- **Evidence:**  
  > `Id legacy \`agentic-architecture\` se conserva; el path V3 es arquitectura/DDD, no orquestación de agentes LLM.`  
- **Pedagogical impact:** Learners see internal migration notes (legacy id, “V3 path”) instead of a clean scope statement. Signals unfinished redaction; confuses hash URL (`#agentic-architecture`) with topic.  
- **Dimension:** Meta-text / developer leakage.

### ISSUE-02 — You Do evidence keys corrupted (accent/slug collapse)
- **Severity:** P0  
- **Location:** `youDo.starterCode`  
- **Evidence:**  
  ```python
  REQUIRED = ['quality_attribute_scenarios_con_fuente_est_mulo_', 'context_map_de_intake_er_relaci_n_triage_reporti', 'c4_de_contexto_y_contenedores', 'dos_adrs_con_alternativas_consecuencias_y_plan_d']
  ```  
  Intended Spanish phrases mangled: `estímulo` → `est_mulo_`, `relación` → `relaci_n`, ADR phrase truncated (`plan_d`).  
- **Pedagogical impact:** Portfolio starter is the first thing a Master student copies into GitHub. Broken keys train bad naming, block mental mapping to requirements list, and undermine CP-N4-A credibility.  
- **Dimension:** Exercise quality · redaction · accessibility.

### ISSUE-03 — You Do context grammar (double “bloquea”)
- **Severity:** P2  
- **Location:** `youDo.context`  
- **Evidence:**  
  > `El gate se bloquea ante: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.`  
- **Pedagogical impact:** Broken Spanish (anacoluto / duplicate finite verb). Damages authority in a Master architecture section.  
- **Dimension:** Grammar (español peruano) · redaction.

### ISSUE-04 — Repeated “Contrato operativo” boilerplate across T2–T4
- **Severity:** P1  
- **Location:** theory paragraphs for T2-A, T2-B, T3-A, T3-B, T4-A, T4-B (and partially T1-A)  
- **Evidence (identical error/success stems):**  
  > `Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.`  
  > `Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.`  
  Shared entry stem:  
  > `Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones.`  
  Only the *Salida de este subtema* clause changes.  
- **Pedagogical impact:** Progressive disclosure collapses into a stamp. Learners skim; cognitive load shifts to boredom, not architecture concepts. Contrasts sharply with S02 gold paragraphs that teach mechanism with concrete counterexamples.  
- **Dimension:** Cognitive load · connective tissue · redaction.

### ISSUE-05 — Mechanism paragraphs too thin for Master DDD
- **Severity:** P1  
- **Location:** first paragraph of each T2–T4 subtopic  
- **Evidence examples:**  
  - T2-A: one sentence on cohesión/coupling.  
  - T3-B: one sentence defining entity/VO/service — no identity lifecycle, no equality-by-value example, no anti-patterns.  
  - T4-A: one sentence on C4 + ADR — no field checklist in prose (only later code dict).  
- **Pedagogical impact:** For 20h Master, external gold (Cockburn hexagonal, Evans reference, C4model.com) expects worked examples of ports, ACL, aggregate boundaries. Here mechanism is a headline; practice is boolean gates. Transfer to real architecture interviews is weak.  
- **Dimension:** Pedagogy · external comparison.

### ISSUE-06 — I Do T2-A demo misaligned with “cohesión/coupling y capas”
- **Severity:** P1  
- **Location:** `iDo` step `S40-T2-A-DEMO`  
- **Evidence:** description claims layers/cohesion; code counts modules:  
  ```python
  def context_sizes(mods: dict) -> tuple:
      return len(mods), mods.get("er", 0), True
  mods = {"intake": 1, "er": 2, "reporting": 1}
  ```  
  Prints `bc_count`, `er_n`, `no_mixed` — **bounded-context sizing**, not layer dependency or coupling.  
  `why` still claims: “deja como evidencia diagrama de dependencias sin salto de capa”.  
- **Pedagogical impact:** I Do is the model. Misalignment teaches wrong schema before We Do (which correctly uses `layers`/`dependencies`).  
- **Dimension:** I Do / We Do fidelity · exercise alignment.

### ISSUE-07 — I Do T3-B and T4-A demos weakly represent claimed concepts
- **Severity:** P2  
- **Location:** `S40-T3-B-DEMO`, `S40-T4-A-DEMO`  
- **Evidence:**  
  - T3-B: `merge_scores` weighted average — “service” is named but **no entity identity, no VO equality, no immutability test**.  
  - T4-A: joins flow steps with `" -> "` and returns `"C4+ADR"` string literal — **no C4 levels, no ADR fields, no consequences**.  
- **Pedagogical impact:** Demos do not “hacer observable” the evidence artifacts promised in `why`.  
- **Dimension:** Pedagogy · progressive disclosure.

### ISSUE-08 — I Do `why` text is templated monologue (8×)
- **Severity:** P2  
- **Location:** all 8 iDo `why` strings  
- **Evidence pattern:**  
  > `Hace observable \`…\` con un caso local pequeño y deja como evidencia …; el demo modela el contrato, no un servicio externo.`  
- **Pedagogical impact:** Voice is developer-generic; fails to narrate *why this line* (I Do ideal). Compared with early sections’ concrete “por qué de cada línea”, transfer suffers.  
- **Dimension:** Connective tissue · I Do fidelity.

### ISSUE-09 — Theory code toys with hardcoded / non-diagnostic predicates
- **Severity:** P2  
- **Location:** e.g. `cohesion_coupling_layers.py`, ports theory, map contract  
- **Evidence:**  
  ```python
  skip_forbidden = order["presentation"] < order["domain"] < order["infrastructure"]
  return layers, True, skip_forbidden  # domain_pure always True
  ```  
  Does not detect presentation→infrastructure skip; only checks list order of names.  
- **Pedagogical impact:** Learners may believe any ordered list = clean architecture. Sets up We Do predicates that are more real than theory demos — inverted scaffolding.  
- **Dimension:** Cognitive load · technical accuracy of teaching artifacts.

### ISSUE-10 — Ports/adapters theory merges port and adapter in one class
- **Severity:** P2  
- **Location:** `ports_adapters_domain_dep.py`  
- **Evidence:** `class CaseRepo` both documents the port and implements in-memory storage; no Protocol/ABC, no failing domain import of `sqlalchemy`.  
- **Pedagogical impact:** Hexagonal gold (Cockburn; AWS hexagonal guidance) stresses **dependency direction** via interfaces. Single class under-teaches DIP; self-check later asks about FastAPI/SQLAlchemy import breach without having shown the contrast in code.  
- **Dimension:** Domain pedagogy · external comparison.

### ISSUE-11 — Trade-off score semantics unexplained (`min_score` better)
- **Severity:** P2  
- **Location:** T1-B theory + exercises  
- **Evidence:**  
  > `score min_score elige async (2.2) sobre sync (3.8)`  
  Grammar awkward; scale direction never defined (cost? risk? weighted penalty?). Magic residual threshold `<= 2` appears only in solutions.  
- **Pedagogical impact:** Quality attributes literature (Azure Architecture Center) uses explicit utility scores and scenario measures. Learners may invert “higher is better” heuristics from ML sections.  
- **Dimension:** Clarity · consistency with prior sections.

### ISSUE-12 — We Do is 24× the same defect pattern (architecture not practiced)
- **Severity:** P1  
- **Location:** entire `weDo.steps`  
- **Evidence:** Every E1: invert boolean on fixture; E2: valid/invalid/missing; E3: CONTINUE/breach/REQUEST_*. Instructions rotate verbs (`Calcula`, `Compara`, `Filtra`, `Modela`, `Audita`…) without changing cognitive task. Feedback strings often **identical across E1/E2/E3** of the same subtopic.  
- **Pedagogical impact:** Excellent for fail-closed decision hygiene; **poor for Master architecture skill**: no drawing C4, no writing ADR prose, no modeling aggregate boundaries, no real port interface. You Do asks for those artifacts without We Do rehearsal — GRR (gradual release) gap.  
- **Dimension:** Exercise quality · I Do / We Do / You Do fidelity.

### ISSUE-13 — Headings lowercase / inconsistent title casing
- **Severity:** P3  
- **Location:** theory subtopic headings  
- **Evidence:** `"requisitos funcionales y quality attributes"`, `"cohesión/coupling y capas"` vs map heading capitalized `"Ruta de S40…"`.  
- **Pedagogical impact:** Visual hierarchy weaker on live UI; mixed EN/ES compound titles feel unfinished.  
- **Dimension:** Redaction · consistency.

### ISSUE-14 — Learning outcomes telegraphic vs early gold
- **Severity:** P3  
- **Location:** `learningOutcomes`  
- **Evidence:** `"Captura FR y quality attributes"` vs S02 full competency statements with action + condition.  
- **Pedagogical impact:** Harder self-assessment of mastery before CP-N4-A.  
- **Dimension:** Roadmap consistency · pedagogy.

### ISSUE-15 — Hash/id vs title mismatch on live surface
- **Severity:** P2  
- **Location:** live URL `#agentic-architecture` vs card “Arquitectura y DDD”; file `s40-agentic-architecture.ts`  
- **Evidence:** Catalog tagline correctly describes architecture map; id string still implies agents. Content correctly sets `agent_orchestration_topic: False`.  
- **Pedagogical impact:** SEO/share/bookmark confusion; learners of S49 “Agentes y tools” may open S40 by id mistake. Related to ISSUE-01 (should be explained in product chrome, not body prose).  
- **Dimension:** Consistency · accessibility.

### ISSUE-16 — Self-check thin for 20h Master (n=5)
- **Severity:** P2  
- **Location:** `selfCheck.questions`  
- **Evidence:** Five MCQs; strong on gate/ethics/ports; weak on C4 levels, ADR fields, consumer-driven compatibility, context map relationships.  
- **Pedagogical impact:** Active recall insufficient for spaced retrieval of T3–T4.  
- **Dimension:** Exam quality.

### ISSUE-17 — “Ocho fixtures peruanos sintéticos” overstated
- **Severity:** P3  
- **Location:** `weDo.intro`  
- **Evidence:** Intro claims “ocho fixtures peruanos sintéticos distintos”; fixtures are mostly generic `ops`/`platform`/`CASE-001` without Lima/Andina domain texture (unlike S02 names Quispe/Ñahui).  
- **Pedagogical impact:** Mild authenticity gap vs course brand “casos situados en Perú”.  
- **Dimension:** Motivation · consistency.

### ISSUE-18 — T2-A solution under-specifies “sin salto de capa”
- **Severity:** P2  
- **Location:** We Do T2-A solutions  
- **Evidence:**  
  ```python
  meets_contract = all(edge != ["domain","infrastructure"] for edge in record["dependencies"]) and record["layers"][2] == "domain"
  ```  
  Theory/callouts mention presentation not jumping to repository; valid fixture has presentation→application→domain and infrastructure→domain, but solution **does not forbid** e.g. presentation→infrastructure if present. Invalid only tests domain→infrastructure.  
- **Pedagogical impact:** Partial gate: learners pass without encoding full layer rule.  
- **Dimension:** Exercise alignment · technical accuracy.

### ISSUE-19 — `adapter.endswith(port)` naming heuristic as architecture rule
- **Severity:** P2  
- **Location:** T2-B solutions  
- **Evidence:** `record["adapter"].endswith(record["port"])` (e.g. `MemoryCaseRepository` ends with `CaseRepository`).  
- **Pedagogical impact:** Teaches string suffix convention, not dependency inversion. Fragile and culturally odd for Spanish-speaking teams using other names.  
- **Dimension:** Pedagogy · domain accuracy.

### ISSUE-20 — Map paragraph still instructor-facing (“Orden pedagógico… iDo… weDo E1/E2/E3”)
- **Severity:** P3 (borderline meta)  
- **Location:** theory map P4  
- **Evidence:**  
  > `Orden pedagógico (liberación gradual): T1 … Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3…`  
- **Pedagogical impact:** Acceptable as course navigation if cleaned of “Id legacy”; internal codes `iDo`/`weDo` are platform jargon. S02 has similar map language but with richer learner-facing value.  
- **Dimension:** Meta-text (mild) · connective tissue.

### ISSUE-21 — Job relevance / LO vs exercise gap on “documenta C4 y ADRs”
- **Severity:** P1  
- **Location:** `jobRelevance`, LOs, `youDo.requirements` vs theory/weDo  
- **Evidence:** Outcomes promise C4 + ADRs; We Do never writes an ADR document—only checks presence of field names in a set.  
- **Pedagogical impact:** Portfolio risk: student can flip booleans in lab then invent empty ADR files for You Do without having practiced quality criteria in prose.  
- **Dimension:** Roadmap · exercise alignment.

### ISSUE-22 — Minor Spanish awkwardness and EN/ES mixes
- **Severity:** P3  
- **Location:** scattered  
- **Evidence:** `score min_score elige async`; headings `quality attributes`; `consumer contract de versión previa en verde`.  
- **Pedagogical impact:** Generally understandable; occasional non-native rhythm. Not blocking.  
- **Dimension:** Redaction (español peruano).

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Severity | Notes |
|---|------------------------------|----------|----------|-------|
| M1 | `Id legacy \`agentic-architecture\` se conserva; el path V3 es arquitectura/DDD, no orquestación de agentes LLM.` | theory map, paragraph 4 | **High** | Developer migration note. Learner-facing rewrite: “El identificador de esta sección en la plataforma es histórico; el contenido enseña arquitectura y DDD, no orquestación de agentes LLM (eso se aborda en secciones posteriores).” |
| M2 | `Orden pedagógico … iDo … weDo E1/E2/E3` + path/id sentence | same paragraph | **Low–Med** | Partial product jargon; keep route map, drop “legacy/V3 path” wording. |
| M3 | Code flag `"agent_orchestration_topic": False` | map code sample | **Acceptable** if explained as *alcance del contrato de sección*, not as CMS flag. Currently paired with M1 → reads internal. |

**No findings for:** “moved from section X”, TODO/FIXME, “do not show to students”, AI self-talk, “as an AI”, raw design notes outside the map paragraph.

**Meta-leak count (strict):** **1 high (M1)** + **1 mild (M2)** → report **`meta_leak_count: 2`** (count high+mild user-facing).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (topic pedagogy)

High-quality teaching of this domain typically combines:
- **Quality attribute scenarios** with source/stimulus/environment/response/measure (architecture evaluation practice).
- **Hexagonal / ports & adapters** with dependency arrows toward domain and in-memory adapters for tests (Cockburn; industry writeups).
- **DDD strategic design** (bounded context, context map, ubiquitous language) before tactical entity/VO/service.
- **C4** as communication levels (context → container first; code optional).
- **ADRs** as decision records with context, options, consequences, status, reversibility (AWS ADR guidance; joelparkerhenderson templates).
- **Progressive disclosure / GRR:** model a full artifact → guided partial → independent portfolio.

S40 **names** all of these correctly in dictionary and resources, but **rehearses** mostly boolean contract assessment.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Form present? | Substance |
|-------|---------------|-----------|
| Theory | Yes (8+map) | Dictionary strong; mechanism thin; contract stamp heavy |
| I Do | 8 demos | Several misaligned/toy; why-text template |
| We Do | 24 labs | Strong fail-closed pattern; weak architecture craft |
| You Do | Dossier | Right artifact list; **broken starter keys**; big jump from We Do |
| Self-check | 5 MCQ | OK quality, low coverage |

**GRR gap:** You Do requires C4 + 2 ADRs + context map + QA scenarios + breach path; We Do never produces those artifacts in prose or multi-file structure—only gate predicates.

### 5.3 Cognitive load

- **Intrinsic load (Master architecture):** high domain; appropriate for phase 3.  
- **Extraneous load:** boilerplate repetition, meta-leak, mangled keys, demo mismatch.  
- **Germane load:** under-supported—few worked examples of thinking through a trade-off matrix or context map workshop.

### 5.4 Connective tissue / narrative

- Map → T1→T4 order is sound.  
- Link from S39 CP-N3-C closure is stated once and works.  
- Subtopic applications always say `CASO-LIM-040` but rarely deepen the Red Andina business story (who owns intake vs ER language).  
- vs **S02 gold:** S02 spends full paragraphs on traps (`42` vs `"42"`, phone as str); S40 spends them on gate stamps.

### 5.5 Grammar & español peruano

- Overall intelligible technical Spanish with standard LATAM course mix of English terms (ADR, C4, ports).  
- Errors: ISSUE-03 double “bloquea”; ISSUE-11 “score min_score elige”; ISSUE-02 non-language slug corruption.  
- No major orthography disasters in theory body.

### 5.6 External comparison (brief)

| External gold | S40 match |
|---------------|-----------|
| c4model.com levels | Named; not practiced as diagrams |
| Fowler Bounded Context | Named; ACL demo in I Do T3-A is good seed |
| Cockburn hexagonal | Named; port/adapter code incomplete |
| ADR templates | Linked; fields only as set membership |
| System Design Primer / CS146S | Linked; trade-off scoring underspecified |
| Domain-driven hexagon community materials | Far richer tactical examples than S40 theory |

### 5.7 Consistency with roadmap

- Opening Nivel 4 after S39 triage is correct.  
- S41 FastAPI can consume ports/API evolution themes—good sequencing.  
- Legacy id `agentic-architecture` conflicts with S49 agents branding (content correctly defers agents).

### 5.8 Graph memory (nodes of concern)

```
[Map] --leaks--> [LegacyIdMeta]
[Map] --defines--> [Gate CP-N4-A]
[T1-A QA] --aligned--> [WeDo T1-A] --supports--> [YouDo QA req]
[T2-A Layers] --MISALIGNED--> [IDo T2-A context_sizes]
[T2-B Ports] --weak theory--> [SelfCheck ports] --strong-->
[T3-A BC] --good IDo ACL--> [WeDo set disjoint]
[T4-A C4/ADR] --weak IDo--> [YouDo C4+ADR] --BROKEN keys-->
[WeDo ×24] --pattern--> [FailClosed] --gap--> [Architecture craft]
```

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in this Explorer run. Paths relative to repo root. Line anchors approximate to current `s40-agentic-architecture.ts`.

### Diff A — ISSUE-01 / M1: remove legacy/V3 meta from map paragraph

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-        "Orden pedagógico (liberación gradual): T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. Teoría con criterio medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de dominio por ejercicio. Id legacy `agentic-architecture` se conserva; el path V3 es arquitectura/DDD, no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.",
+        "Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. En cada subtema verás un criterio medible, una demo que calcula el contrato y laboratorio E1/E2/E3 con un defecto de dominio. **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM (eso viene más adelante). Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.",
```

### Diff B — ISSUE-02: fix You Do REQUIRED / evidence keys

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-    starterCode: `CASE_ID = "CASO-LIM-040"
-REQUIRED = ['quality_attribute_scenarios_con_fuente_est_mulo_', 'context_map_de_intake_er_relaci_n_triage_reporti', 'c4_de_contexto_y_contenedores', 'dos_adrs_con_alternativas_consecuencias_y_plan_d']
-evidence = {
-    "quality_attribute_scenarios_con_fuente_est_mulo_": False,
-    "context_map_de_intake_er_relaci_n_triage_reporti": False,
-    "c4_de_contexto_y_contenedores": False,
-    "dos_adrs_con_alternativas_consecuencias_y_plan_d": False
-}
+    starterCode: `CASE_ID = "CASO-LIM-040"
+REQUIRED = [
+    "qa_scenarios",          # fuente, estímulo, entorno, respuesta, medida, umbral, dueño
+    "context_map",           # intake / ER / relación / triage / reporting / IA
+    "c4_context_container",  # C4 context + container
+    "adrs_x2",               # dos ADRs: alternativas, consecuencias, plan de reversión
+]
+evidence = {
+    "qa_scenarios": False,
+    "context_map": False,
+    "c4_context_container": False,
+    "adrs_x2": False,
+}
```

### Diff C — ISSUE-03: youDo.context grammar

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-    context: "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea ante: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate.",
+    context: "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida.",
```

### Diff D — ISSUE-04 / ISSUE-05 sample: diversify T2-A contract paragraph + deepen mechanism

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
       heading: "cohesión/coupling y capas",
       subtopicId: "S40-T2-A",
       paragraphs: [
-        "Alta cohesión mantiene juntas reglas que cambian por la misma razón; bajo acoplamiento evita que presentación e infraestructura dicten el dominio.",
-        "Contrato operativo. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida de este subtema: diagrama de dependencias sin salto de capa. Error: una frontera ambigua, una dependencia hacia infraestructura o una decisión sin medida bloquea el gate. Criterio de éxito: cada flujo cruza fronteras explícitas y cada trade-off conserva medida, dueño y consecuencia.",
-        "Aplicación de `cohesión/coupling y capas` a `CASO-LIM-040`: la evidencia es un diagrama donde presentación no salta al repositorio y dominio no importa infraestructura.",
+        "Alta cohesión agrupa reglas que cambian por la misma razón (p. ej. scoring de triage junto a su política de abstención). Bajo acoplamiento evita que UI o SQL dicten el lenguaje del dominio: presentación habla con application; domain no importa drivers.",
+        "Contrato de capas para S40-T2-A. Entrada: lista de capas y aristas de dependencia. Salida: grafo sin saltos (presentation↛infrastructure) y sin domain→infrastructure. Error local: `REDRAW_BOUNDARY`. Si falta el grafo: `REVIEW_LAYER_OWNER`.",
+        "En `CASO-LIM-040`, intake UI no llama al almacén ER directamente: pasa por application; el worker de infraestructura implementa el port que el dominio declara.",
       ],
```

*(Apply analogous unique contract stems to T2-B…T4-B — one logical group in Fixer pass.)*

### Diff E — ISSUE-06: replace I Do T2-A demo with layer graph

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-          code: `def context_sizes(mods: dict) -> tuple:
-    return len(mods), mods.get("er", 0), True
-
-mods = {"intake": 1, "er": 2, "reporting": 1}
-bc_count, er_n, no_mixed = context_sizes(mods)
-print("bc_count", bc_count)
-print("er_n", er_n)
-print("no_mixed", no_mixed)`,
-          output: `bc_count 3
-er_n 2
-no_mixed True`,
+          code: `def no_layer_skip(deps: list[tuple[str, str]], layers: list[str]) -> bool:
+    idx = {name: i for i, name in enumerate(layers)}
+    # prohíbe saltar application y prohíbe domain → infrastructure
+    for src, dst in deps:
+        if src == "domain" and dst == "infrastructure":
+            return False
+        if src == "presentation" and dst == "infrastructure":
+            return False
+        if abs(idx[src] - idx[dst]) > 1 and {src, dst} != {"infrastructure", "domain"}:
+            # infrastructure may depend inward on domain (adapter)
+            if not (src == "infrastructure" and dst == "domain"):
+                return False
+    return True
+
+layers = ["presentation", "application", "domain", "infrastructure"]
+deps = [("presentation", "application"), ("application", "domain"), ("infrastructure", "domain")]
+print("layers", layers)
+print("deps_ok", no_layer_skip(deps, layers))
+print("domain_pure", True)`,
+          output: `layers ['presentation', 'application', 'domain', 'infrastructure']
+deps_ok True
+domain_pure True`,
```

Also rewrite matching `why` to describe the dependency check (not “caso local pequeño” template alone).

### Diff F — ISSUE-07: I Do T4-A shows ADR fields

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-          code: `def flow_doc(steps: list) -> tuple:
-    head = " -> ".join(steps[:3])
-    return len(steps), head, "C4+ADR"
-
-n, head, doc = flow_doc(["intake", "validate", "enqueue", "score", "report"])
-print("steps", n)
-print("head", head)
-print("doc", doc)`,
-          output: `steps 5
-head intake -> validate -> enqueue
-doc C4+ADR`,
+          code: `def adr_ready(c4: set[str], fields: set[str], status: str) -> bool:
+    return {"context", "container"} <= c4 and {
+        "decision", "alternatives", "consequences", "rollback"
+    } <= fields and status == "accepted"
+
+print("c4_ok", {"context", "container"} <= {"context", "container"})
+print("adr_ok", adr_ready({"context", "container"},
+    {"context", "decision", "alternatives", "consequences", "rollback"}, "accepted"))
+print("status", "accepted")`,
+          output: `c4_ok True
+adr_ok True
+status accepted`,
```

### Diff G — ISSUE-11: clarify score direction in T1-B

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-        "Aplicación a `CASO-LIM-040-T1B` (Red Andina, sintético): score min_score elige async (2.2) sobre sync (3.8); el residual de complejidad de mensajes lo acepta el owner de plataforma, no el revisor de cola.",
+        "Aplicación a `CASO-LIM-040-T1B` (Red Andina, sintético): el score es un **costo ponderado** (menor es mejor). async=2.2 vence a sync=3.8 bajo `min_score`; el riesgo residual de complejidad de mensajes (umbral ≤2) lo acepta el owner de plataforma, no el revisor de cola.",
```

### Diff H — ISSUE-10: show port Protocol + memory adapter (theory snippet)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@
-        code: `class CaseRepo:
-    """Port: el dominio pide get(case_id); el adapter cumple sin HTTP/SQL real."""
-    def get(self, cid: str) -> dict:
-        return {"status": "open", "case_id": cid}
-
-def open_case(repo: CaseRepo, cid: str) -> str:
-    return repo.get(cid)["status"]
-
-print("status", open_case(CaseRepo(), "CASE-1"))
-print("dep", "domain<-adapters")
-print("port_ok", True)`,
+        code: `from typing import Protocol
+
+class CaseRepo(Protocol):
+    def get(self, cid: str) -> dict: ...
+
+class MemoryCaseRepo:
+    def get(self, cid: str) -> dict:
+        return {"status": "open", "case_id": cid}
+
+def open_case(repo: CaseRepo, cid: str) -> str:
+    # dominio depende del port, no de SQL/HTTP
+    return repo.get(cid)["status"]
+
+print("status", open_case(MemoryCaseRepo(), "CASE-1"))
+print("dep", "domain<-adapters")
+print("port_ok", True)`,
```

### Diff I — ISSUE-18 / ISSUE-19 (We Do rule hardening) — logical intent

```diff
# T2-A meets_contract (illustrative):
-meets_contract = all(edge != ["domain","infrastructure"] for edge in record["dependencies"]) and record["layers"][2] == "domain"
+forbidden = {("domain", "infrastructure"), ("presentation", "infrastructure")}
+meets_contract = (
+    all(tuple(edge) not in forbidden for edge in record["dependencies"])
+    and record["layers"][2] == "domain"
+)

# T2-B meets_contract (illustrative): prefer explicit flags over endswith:
-meets_contract = record["adapter"].endswith(record["port"]) and not record["domain_imports"] and record["contract_tests"] >= 3
+meets_contract = (
+    record.get("implements_port") is True
+    and not record["domain_imports"]
+    and record["contract_tests"] >= 3
+)
```

*(If keeping name heuristic for minimal fixture churn, document it in theory as didactic convention, not industry rule.)*

### Diff J — ISSUE-16: add 2 self-check items (outline)

```diff
+      {
+        question: "En C4 para CASO-LIM-040, ¿qué pertenece al nivel container y no al context?",
+        options: [
+          "la persona 'analista de triage' y el sistema 'banco partner'",
+          "api, worker, db y object_store dentro de la plataforma Red Andina",
+          "una línea de código de la clase Money VO",
+          "el logo del producto en Figma",
+        ],
+        correctIndex: 1,
+        explanation: "Context muestra sistemas/personas; container descompone la app en api/worker/db/store.",
+      },
+      {
+        question: "¿Qué campo falta para aceptar un ADR de evolución de API en S40-T4?",
+        options: [
+          "solo el título del ADR",
+          "alternatives + consequences + rollback con status accepted",
+          "un screenshot sin decisión",
+          "la versión de Node aunque el stack sea Python",
+        ],
+        correctIndex: 1,
+        explanation: "ADR aceptado requiere decisión, alternativas, consecuencias y señal de reversión.",
+      },
```

### Diff K — ISSUE-13 headings (sample)

```diff
-      heading: "requisitos funcionales y quality attributes",
+      heading: "Requisitos funcionales y quality attributes",
```

*(Apply Title-case / sentence-case consistently across the eight subtopics.)*

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Rationale |
|----------|-----------|-----------|
| **1 (ship blockers)** | ISSUE-02 (You Do keys), ISSUE-03 (grammar) | Portfolio surface broken / unprofessional |
| **2 (trust / meta)** | ISSUE-01 / M1–M2 | Remove developer leakage before any polish |
| **3 (I Do truth)** | ISSUE-06, ISSUE-07, ISSUE-08 | Demos must match subtopic claims |
| **4 (theory monotony)** | ISSUE-04, ISSUE-05, ISSUE-10, ISSUE-11 | Restore progressive disclosure + DIP teaching |
| **5 (We Do depth)** | ISSUE-12, ISSUE-18, ISSUE-19, ISSUE-21 | At least one craft exercise per T3/T4 (mini ADR or context map table) before You Do jump |
| **6 (assessment)** | ISSUE-16 | Expand self-check to cover C4/ADR/compat |
| **7 (polish)** | ISSUE-13, ISSUE-14, ISSUE-15, ISSUE-17, ISSUE-20, ISSUE-22 | Casing, LOs, id/chrome note, Peruvian texture |

**Suggested Fixer loop budget:** 1 pass for P0–P2 redaction/meta/youDo/IDo; optional 2nd pass for We Do craft exercise injection (higher risk to exercise IDs).

**Do not prioritize:** renaming platform id `agentic-architecture` in this Fixer unless product allows redirect — content disambiguation is enough if M1 is rewritten (ISSUE-15 can stay as known debt).

---

## 8. Graph Memory Update notes

For shared context / future STORM / Fixer agents:

```yaml
section: 40
id: agentic-architecture
file: src/lib/course/sections/s40-agentic-architecture.ts
title: Arquitectura, DDD y decisiones técnicas
gate: CP-N4-A
case: CASO-LIM-040
explorer_score: 6.4
auto_audit: ACCEPT  # S40_AUDIT.json — does not cover meta/youDo/pedagogy depth
meta_leaks:
  - legacy_id_v3_path_sentence  # HIGH
  - orden_pedagogico_ido_wedo   # mild
structural_strengths:
  - map_dictionary_present
  - e1_e2_e3_fail_closed_24
  - resources_gold (C4, Cockburn, Evans, ADR, DDIA)
  - ethics_no_pii_no_fraud_inference
critical_fix_nodes:
  - youDo.starterCode.REQUIRED  # mangled Spanish slugs
  - theory.map.paragraph_legacy_id
  - iDo.S40-T2-A-DEMO  # wrong concept (bc_count)
  - theory.contract_boilerplate_T2_T4
pedagogy_gap:
  - weDo_boolean_only_vs_youDo_architecture_artifacts
  - thin_mechanism_vs_s02_gold
downstream:
  - S41 FastAPI may assume ports/API evolution literacy
  - S49 agents is real agent topic — keep S40 non-agent
fixer_first_touches:
  - youDo keys + context grammar
  - map paragraph meta strip
  - T2-A / T4-A iDo demos
graph_edges_to_add:
  - misalignment: iDo_T2A -> theory_T2A (broken)
  - supports: resources_C4 -> youDo_C4 (weak practice edge)
  - leak: map_paragraph -> developer_migration_note
```

**Comparative baseline:** Early gold **S02** shows multi-paragraph mechanism + concrete counterexamples; S40 map style matches S02’s contract map pattern but subtopics regress into stamps. Phase-3 ACCEPT sections can still fail Explorer depth checks (this section is an instance).

---

## Closing

This is the complete Explorer report for Section 40. Ready for the Fixer prompt.
