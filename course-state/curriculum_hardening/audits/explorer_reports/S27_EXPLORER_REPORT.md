# S27 Explorer Report — Estrategia de pruebas con pytest

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Date:** 2026-07-24  
**Scope lock:** Section 27 only (`async-concurrency` / `s27-async-concurrency.ts`)  
**Live:** https://pillb.github.io/pyarcana/ (Sección 27 · Pytest y contratos)  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s27-async-concurrency.ts`  
**Do not apply fixes in this run** — report + proposed diffs only.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 27 |
| Platform section id (hash) | `async-concurrency` |
| Source file | `src/lib/course/sections/s27-async-concurrency.ts` |
| Title (learner-facing) | Estrategia de pruebas con pytest |
| shortTitle (nav/card) | Pytest y contratos |
| Tagline | convertir supuestos de normalización y matching en contratos ejecutables; cada bug reproducido obtiene test de regresión |
| estimatedHours | 19 |
| level | Competente |
| phase (source) | 2 |
| V3 topic (roadmap / live card) | Pytest strategy · contracts for normalize/match · start of CP-N3-A |
| Legacy id collision | File name + `id` still say **async-concurrency**; content is **not** asyncio/concurrency (that topic lives conceptually near S38 “Concurrencia y resiliencia”) |
| Structural inventory | Theory: 1 overview + 8 subtopics (T1–T4 × A/B); iDo: 8 demos; weDo: 24 exercises (E1/E2/E3 × 8); youDo: 1 portfolio block; selfCheck: 5 MCQ; resources: docs/books/courses |
| Capstone thread | Inicia **CP-N3-A** (contratos de normalización/matching); fixture narrative `CASO-LIM-027` / `run_id=cpn3a-01` |
| Prior section (connective) | S26 cierra CP-N2-C (VP RPA + AI Analyst); S27 abre fase de pruebas formales del motor ER |
| Next section | S28 props e integración (puente explícito a `unittest.mock` en resources) |

**In-scope analysis surfaces:** all theory paragraphs/callouts/code+output, iDo steps, weDo instructions/starters/solutions, youDo, selfCheck, resources, jobRelevance, learningOutcomes, live curriculum card text.

**Out of scope:** applying patches; other sections; product UI chrome beyond section content.

---

## 2. Executive Summary of Quality

### Score: **4.8 / 10**

### Verdict
**Structurally complete, pedagogically hollow.** S27 has the gold *skeleton* (9 theory blocks, 8 iDo, 24 weDo, youDo, 5 quiz, solid resource list, correct V3 *topic* of pytest contracts for ER) but fails the gold *meaning* bar in `GOLD_STANDARD_CHECKLIST.md`:

1. **Template soup** — nearly every theory paragraph is padded with the same 2–3 boilerplate tails (pirámide/AAA, “Contrato operativo… CASO-LIM-027…”, “Caso sintético PE… normalize_name/exact_match…”). This is the exact anti-pattern the checklist names: *“Template triplet only: generic Contrato operativo + CASO-LIM with no mechanism teaching.”*
2. **Print theater & dishonest demos** — theory and iDo `code` vs `output` diverge; many exercises are one-token fixes or pure literal prints, not real pytest skill building.
3. **Meta / developer leakage** — legacy-id notes, ledger/checkpoint instructions, “gate V3”, and identical DEFECT/I/O harness text leak into learner-facing surfaces.
4. **pytest without pytest** — discovery/fixtures/parametrize are *described* but almost never shown as real `@pytest.fixture` / `pytest.raises` / CLI runnable modules; demos reimplement discovery with `ast`/`re` theater.
5. **Identity debt** — `id: "async-concurrency"` + filename contradict title, live shortTitle, and V3 path; jobRelevance *admits* this to the learner.

Automated `S27_AUDIT.json` (`verdict: ACCEPT`, mean rank 9.52) and dossier PA ranks of 9.55 are **not trusted** as ground truth for this Explorer pass: they appear length/regex-friendly and do not catch identical tails, code/output mismatch, or meta-leaks. Comparative gap vs early gold (S01 prose density, unique paragraphs, honest code/output) is large.

**Learner risk:** After 19 h of “pytest”, a motivated student can pass quizzes and print-oracles without writing a single real `test_*.py` that pytest would discover—while being confused by async-concurrency branding and internal gate jargon.

---

## 3. Detailed Issue Registry

Severity: **P0** blocker / trust · **P1** high pedagogy · **P2** medium quality · **P3** polish.

---

### ISSUE-01 · Legacy identity mismatch (id / filename vs V3 topic)
- **Severity:** P0 (navigation/SEO/trust) + P2 (file rename is ops)
- **Location:** `id`, filename `s27-async-concurrency.ts`, `jobRelevance`; SECTION_MAP.tsv row 27; live hash `#async-concurrency`
- **Evidence:**  
  - `id: "async-concurrency"` while `title: "Estrategia de pruebas con pytest"`.  
  - `jobRelevance` ends with: *“Id legacy `async-concurrency` se conserva; el path V3 es estrategia de pruebas con pytest, no asyncio concurrente.”*
- **Pedagogical impact:** Learner (or employer scanning URLs) expects asyncio/concurrency; content is testing. S38 already owns concurrency/resilience. Undermines course coherence.
- **Graph nodes:** `section.id` ↛ `section.title` · edge broken to S38 topic cluster.

---

### ISSUE-02 · Meta-leak: legacy id confession in jobRelevance
- **Severity:** P0 (meta-leak)
- **Location:** `jobRelevance` (learner-visible workplace blurb)
- **Evidence quote:**  
  > Id legacy `async-concurrency` se conserva; el path V3 es estrategia de pruebas con pytest, no asyncio concurrente.
- **Impact:** AI/developer migration note rendered as student copy. Violates redaction bar.

---

### ISSUE-03 · Meta-leak: ledger / checkpoint / gate language in youDo
- **Severity:** P0 (meta-leak)
- **Locations:** `youDo.context`, `youDo.portfolioNote`, `youDo.rubric[0]`
- **Evidence quotes:**  
  - *“No marques section_passed ni edites ledger/seed.”*  
  - *“Otra lane califica PASS; no editar checkpoint/ledger.”*  
  - Rubric criterion: *“Alineación al gate V3 de la sección”* (25%)
- **Impact:** Platform-internal harness instructions and multi-agent “lane” jargon appear as portfolio guidance. Confuses autonomous learners on public GitHub Pages edition.

---

### ISSUE-04 · Massive identical boilerplate tails across theory (template soup)
- **Severity:** P0 (anti-gold / cognitive noise)
- **Locations:** Nearly all theory paragraphs (overview + T1–T4 A/B). Count in source:  
  - **~11×** *“La pirámide y el diseño AAA hacen que normalización/matching sean *contratos* verificables (inicio CP-N3-A), no scripts frágiles.”*  
  - **~10×** *“Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (run_id=cpn3a-01) → node ids estables y asserts con oráculo fijo; fail-closed si un comparador no distingue banda review.”*  
  - **~9×** *“Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@example.pe`; cobertura reporta ramas de negocio, no solo líneas.”*  
  - **~8×** *“Documenta evidencia y límites del fixture `CASO-LIM-027` (run_id=cpn3a-01): sin PII real y sin auto-veredicto.”*
- **Evidence (T1-B P1, after a good AAA definition):**  
  > **AAA** separa preparación… Evita asserts mezclados con setup. **La pirámide y el diseño AAA hacen que…** Documenta evidencia y límites del fixture `CASO-LIM-027`…
- **Impact:** Progressive disclosure collapses; every subtopic “ends the same.” Working memory is polluted with non-local contract text. Gold bar requires unique mechanism + edge per block, not copy-paste tails. PA ranks of 9.55 per paragraph are invalid under expert judgment.

---

### ISSUE-05 · Exercise instruction harness paste (24× identical suffix)
- **Severity:** P1
- **Location:** Every `weDo.steps[*].instruction`
- **Evidence (canonical suffix after one-line task):**  
  > Fixture sintético `CASO-LIM-027` (run_id=cpn3a-01, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.
- **Impact:**  
  - Developer grading harness language (“DEFECT”, “pass string = salida del oráculo”).  
  - Anglicism “only”.  
  - Ethics line repeated 24 times instead of once in section intro.  
  - Instructions exceed length without adding *task-specific* pedagogy.

---

### ISSUE-06 · Theory code/output mismatch — `risk_pyramid.py`
- **Severity:** P0 (honesty / trust)
- **Location:** theory `S27-T1-A` code block
- **Code prints:** list of area names; `top_layer <layer>`; `ok True`  
- **Declared output:**  
  ```
  top normalize_name 20
  layers ['unit', 'unit', 'integration', 'e2e']
  unit_heavy True
  ```
- **Actual runnable output (faithful to code):**  
  ```
  ['normalize_name', 'exact_match', 'sqlite_repo', 'ui_review_queue']
  top_layer unit
  ok True
  ```
- **Impact:** Breaks “run what you see” contract. Learner who executes code cannot reconcile UI output. Violates gold “honest grader oracle / computes the concept.”

---

### ISSUE-07 · iDo code/output mismatch — `risk_rank_demo.py` (S27-T1-A-DEMO)
- **Severity:** P0
- **Location:** `iDo.steps[0]`
- **Code:** three areas only; prints bare list + `top_layer` + `ok True`  
- **Declared output:**  
  ```
  order ['normalize', 'blocking', 'repo_sql', 'review_ui']
  top_layer unit
  pyramid_ok True
  ```
- **Bugs:** invents `review_ui` (not in `areas`); uses keys `order` / `pyramid_ok` not printed by code.
- **Impact:** Same trust failure as ISSUE-06 at demonstration layer (I Do).

---

### ISSUE-08 · Starter vs solution I/O contract conflict (systemic weDo)
- **Severity:** P1
- **Location:** Most weDo starters end with `print('ok', True)` while solutions print only the oracle line(s)
- **Evidence (S27-T1-A-E1):**  
  - Starter: `print(impact + likelihood)` then `print('ok', True)`  
  - Solution output: `20` only  
  - Instruction: “imprime las líneas exactas del solution output”
- **Impact:** Student who “only fixes the DEFECT” still emits an extra line and fails a strict output grader. Harness design is self-contradictory.

---

### ISSUE-09 · Print theater / trivial exercises (not pytest skill)
- **Severity:** P1
- **Locations (examples):**  
  - **S27-T2-B-E2:** print literal `'function'` vs starter `'class'` — no fixture API.  
  - **S27-T4-B-E3:** print policy string `'bug_repro → regression_test'`.  
  - **S27-T2-A-E3:** `print([(' x ', 'x')])` as “parametrize mentalmente”.  
  - **S27-T4-B-E2:** fix dict key order `expected`/`actual`.  
  - **S27-T1-A-E3:** `top_layer == 'unit'` vs `'e2e'`.
- **Impact:** E3 “transfer” often fails gradual release: no transfer of pytest design, only string surgery. Misaligned with learning outcomes (“Usar discovery y assertions de pytest”, “Aislar estado con fixtures y scopes”).

---

### ISSUE-10 · pytest taught by simulation, not by pytest
- **Severity:** P1
- **Locations:** T2-A theory code `discovery_assert.py` (ast discovery); iDo discovery_demo (regex over a string); fixtures demos use plain `deepcopy` functions never decorated `@pytest.fixture`; zero `import pytest` in theory/iDo/weDo runnable snippets.
- **Prose claims:** node ids, assert rewrite, `pytest.raises`, `@pytest.mark.parametrize`, `tmp_path` — without a single minimal real test module.
- **Comparative gap:** Brian Okken / official pytest docs / Real Python start from `def test_…` + `pytest` CLI and real fixtures. S27 stays in “conceptual theater.”
- **Impact:** Outcomes and resources promise pytest competence; practice does not.

---

### ISSUE-11 · Headings redaction (lowercase / mixed EN-ES)
- **Severity:** P2
- **Evidence:**  
  - `riesgos y pirámide de pruebas`  
  - `discovery y assertions`  
  - `fixtures, scopes y aislamiento`  
  - `excepciones, floats, fechas y archivos temporales`  
  - `casos negativos y mensajes`  
  - `branch y risk coverage`  
  - `mutación conceptual, fallas útiles y mantenimiento`  
  vs title-case overview `Estrategia pytest e inicio CP-N3-A` and en-dash AAA heading.
- **Impact:** Inconsistent ES-PE editorial voice; looks machine-generated vs S01 polished headings.

---

### ISSUE-12 · Grammar / Spanglish / tone issues
- **Severity:** P2–P3
- **Examples:**  
  - “Datos sintéticos **only**” (×24 instructions).  
  - Callout title **“Kill the mutant”** (English slogan; body is Spanish — OK for term, but title should be bilingual or ES).  
  - “Parametriza mentalmente” (vague).  
  - “assert blando” (jargon without definition).  
  - jobRelevance / outcomes mix strong technical Spanish with product-speak (“gate”, “lane”).  
  - Overview density is good in *intent* but overstuffed with CAPSTONE IDs before mechanisms.
- **Impact:** Weakens Peruvian-Spanish professional voice bar.

---

### ISSUE-13 · Connective tissue S26 → S27 thin; CP-N3 jump abrupt
- **Severity:** P2
- **Evidence:** Overview jumps straight to CP-N3-A contracts; weak bridge from S26 orchestration/HITL to *why testing is the next skill* (regression of normalize/match after RPA+AI pipeline). No “qué se rompió en N2 y cómo lo atrapa un test” worked story.
- **Impact:** Narrative discontinuity; motivation under-served for 19 h investment.

---

### ISSUE-14 · Cognitive load: too many IDs before mechanisms
- **Severity:** P2
- **Evidence:** First theory screen packs CP-N3-A, CASO-LIM-027, run_id=cpn3a-01, @example.pe, pirámide, AAA, fail-closed, no-fraude before showing a green `pytest` mental model.
- **Impact:** Violates progressive disclosure / pretraining principle: labels before schema.

---

### ISSUE-15 · Self-check overlap (Q3 ≈ Q5)
- **Severity:** P3
- **Evidence:**  
  - Q3: mutas casefold y ningún test falla → contrato débil.  
  - Q5: mutación que no falla ningún test → brecha de oráculo.  
- **Impact:** Redundant active recall; wastes one of five slots (could test fixtures scope, parametrize, or isclose).

---

### ISSUE-16 · youDo starter is assert-script, not pytest suite scaffold
- **Severity:** P2
- **Evidence:** `starterCode` is `normalize_name` / `exact_match` + `if __name__` asserts; objectives ask for “Fixtures function-scope”, “pirámide de riesgo”, “mutación conceptual” without scaffold files (`tests/test_normalize.py`, `conftest.py`).
- **Impact:** Portfolio may never become a real pytest project; rubric 25% “gate V3” is opaque.

---

### ISSUE-17 · Missing explicit `pytest.raises` / parametrize / conftest worked examples
- **Severity:** P1 (curriculum completeness vs claims)
- **Evidence:** Prose names these tools; no theory/iDo block executes them. T3-A discusses `match=` but demos use bare try/except.
- **Impact:** LO “Usar discovery y assertions de pytest” under-delivered.

---

### ISSUE-18 · Floats/dates taught lightly relative to claims
- **Severity:** P3
- **Evidence:** T3-A prose is strong (isclose, fixed dates, tempfile APIs); exercises only lightly touch isclose/tempfile; no freezegun/clock injection demo (optional, but prose says “fija el reloj” without showing how).
- **Impact:** Minor; partial progressive gap.

---

### ISSUE-19 · Comparative quality vs external gold materials
- **Severity:** P1 (positioning)
- **Benchmarks used:**  
  - [pytest official docs](https://docs.pytest.org/en/stable/) — discovery, fixtures, parametrize, assert rewrite.  
  - Brian Okken *Python Testing with pytest* — fixture model as primary skill.  
  - Real Python “Effective Python Testing” — pyramid + AAA with real tests.  
  - MIT 6.100L / CS50P — asserts in projects (weaker on fixtures; still authentic run loops).  
- **Finding:** S27 correctly *selects* topics (pyramid, AAA, fixtures, borders, mutation conceptual) but implements them as narrative + print oracles. External materials spend time in failing/passing real tests. S27 underperforms on authenticity despite better domain framing (ER ethics, synthetic PE contacts).
- **Positive differentiators to preserve:** no-fraude/no-parentesco ethics; risk×layer ranking; mutation-as-contract idea; CASO-LIM synthetic privacy; bridge to S28 mocks.

---

### ISSUE-20 · Phase metadata inconsistency (minor)
- **Severity:** P3
- **Evidence:** `phase: 2` while S26 is `phase: 1` and live “Competente” continues; confirm against roadmap phase table. Not learner-visible as number, but graph inconsistency for tooling.
- **Impact:** Low if intentional (start of N3); document or align.

---

### ISSUE-21 · Theory risk_pyramid ranking logic under-explained
- **Severity:** P3
- **Evidence:** Code multiplies impact×likelihood and sorts; prose good; but no table linking score → test count recommendation (actionable strategy).
- **Impact:** Strategy stays abstract.

---

### ISSUE-22 · Automated audit false green
- **Severity:** P2 (process / graph memory)
- **Evidence:** `audits/S27_AUDIT.json` ACCEPT / 9.52; PA all 9.55 with cloned analysis text; GRAPH_MEMORY_SUMMARY claims S01–S52 gold closed.
- **Impact:** Masks residual theater. Explorer must override with expert judgment (this report).

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Class |
|---|------------------------------|----------|-------|
| M1 | `Id legacy \`async-concurrency\` se conserva; el path V3 es estrategia de pruebas con pytest, no asyncio concurrente.` | `jobRelevance` | Migration note to learner |
| M2 | `No marques section_passed ni edites ledger/seed.` | `youDo.context` | Platform harness / multi-agent |
| M3 | `Otra lane califica PASS; no editar checkpoint/ledger.` | `youDo.portfolioNote` | Multi-agent lane jargon |
| M4 | `Alineación al gate V3 de la sección` (rubric 25%) | `youDo.rubric[0]` | Internal gate label |
| M5 | Repeated `implementa solo el DEFECT indicado` + `pass string = salida del oráculo` | all 24 weDo instructions | Grader author notes |
| M6 | `# DEFECT: …` comments in all starters | weDo starterCode | Acceptable *if* framed as bug hunt; currently coupled with M5 as internal scaffold speak |
| M7 | Filename / `id` `async-concurrency` while content is pytest | module identity | Legacy schema leak (visible in URL hash on live site) |
| M8 | Dense capstone IDs without learner glossary on first screen (`CP-N3-A`, `CASO-LIM-027`, `cpn3a-01`) | theory overview | Product taxonomy leak / overload (borderline; keep IDs but explain once) |

**Meta-leak count (distinct classes for sidecar):** **8** (M1–M8). Primary P0 leaks: M1–M4.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round pedagogy (research anchors)

For a pytest strategy section, best practice (Okken, pytest docs, pyramid literature) requires:

1. **Real test modules** early (happy path → fail → fix).  
2. **Fixtures as dependency injection**, not only deepcopy metaphors.  
3. **Parametrize tables** for normalize/match contracts.  
4. **Useful failures** (assert rewrite) experienced once, not only described.  
5. **Mutation / regression** as a *practice loop* after a real green suite.  
6. **Gradual release:** I Do full suite → We Do complete one test/fixture → You Do full package.  
7. **Cognitive load:** one new pytest concept per subtopic; ethics/privacy once, then refer back.

S27 selects the right *curriculum nodes* but implements them as **concept labels + print theater**.

### 5.2 I Do / We Do / You Do fidelity

| Layer | Structural | Pedagogical fidelity |
|-------|------------|----------------------|
| **I Do** | 8 demos, mapped to subtopics, with why | Medium-low: demos compute *related* ideas but rarely model *pytest usage*; two outputs dishonest (ISSUE-06/07) |
| **We Do** | 24 E1/E2/E3 slots filled | Low: E1 often one-operator fix; E3 rarely transfers; harness paste dominates instructions |
| **You Do** | Portfolio prompt + rubric + starter | Medium: goals align with CP-N3-A; starter too thin; meta-leaks; no pytest layout |
| **SelfCheck** | 5 MCQ, fair indices | Medium-high content correctness; Q3/Q5 overlap |

Gradual release is **formally present, functionally broken**: responsibility is not released toward authentic pytest authoring.

### 5.3 Cognitive load & progressive disclosure

- **Good:** T1 design → T2 pytest surface → T3 borders → T4 coverage/mutation is a sound sequence.  
- **Bad:** Identical tails re-introduce full CASO/CP-N3 payload in every paragraph (high extraneous load).  
- **Bad:** Teaching fixtures without `@pytest.fixture` forces learners to hold two models (conceptual factory vs real API).  
- **Good ethics:** consistent refusal to equate match with fraude/parentesco — keep this.

### 5.4 Connective tissue & narrative flow

- **S26→S27:** Missing “after you automated the VP, you need regression contracts so normalize doesn’t silently drift.” One bridging paragraph would fix much of ISSUE-13.  
- **Within section:** Opening map (T1–T4) is clear; body does not escalate complexity—each block restarts from same boilerplate.  
- **S27→S28:** Resource note on `unittest.mock` is good; body does not preview property/integration tests.

### 5.5 Exercise & exam quality and alignment

| LO (paraphrased) | Supported by practice? |
|------------------|------------------------|
| Priorizar por riesgo y pirámide | Partial (toy sort only) |
| Tests AAA con oráculos | Partial (few real AAA tests) |
| Discovery y assertions pytest | Weak (simulated) |
| Fixtures y scopes | Weak (deepcopy metaphor; E2 is print literal) |
| Excepciones, floats, fechas, tmp | Partial (isclose/tempfile OK; weak pytest.raises) |
| Casos negativos + mensajes | Partial (good require_email theory; thin exercises) |
| Cobertura por rama/riesgo | Partial (set membership theater) |
| Mutación conceptual | Partial (boolean compare, not suite kill) |

Self-check questions are **conceptually sound** and aligned with ethics; better than many exercises.

### 5.6 Consistency with roadmap / previous sections

- Live card and V3 title match **pytest** topic — good.  
- Legacy id/file remain **async** — bad (systemic across map; S27 is a clear instance).  
- Pattern of `Id legacy … se conserva` also appears in S26 jobRelevance → **systemic meta-leak pattern**, still reportable here as S27 instance.  
- Capstone CP-N3-A start is roadmap-consistent if N3 is testing/ER quality track.

### 5.7 Redaction (ES-PE)

- Core explanations of pirámide, AAA, oráculos, mutación are **usable Spanish** when boilerplate is stripped.  
- Capitalization of headings and Spanglish “only” / English callout titles need editor pass.  
- Tone swings between instructor (“Te muestro…”) and gate bureaucracy (“gate V3”).

### 5.8 Accessibility & motivation

- Motivation for ER contracts is present but drowned.  
- No alt-path for learners without pytest installed (could show `python -m pytest` + fallback assert scripts *explicitly* as two tracks).  
- youDo allows “pytest o scripts de assert” — good accessibility, but then theory should not pretend CLI discovery was practiced.

### 5.9 Graph Engineering snapshot (section-local)

```
[S26 VP close] --weak bridge--> [S27 overview CP-N3-A]
[T1 risk/AAA] --ok--> [T2 discovery/fixtures] --claim--> [pytest APIs]
[pytest APIs] --broken edge--> [demos: ast/re/deepcopy only]
[theory boilerplate] --duplicate edges x10--> [CASO-LIM-027]
[weDo E*] --edge--> [print oracle]  (not --> [pytest node])
[youDo] --meta edge--> [ledger/lane/gate]
[section.id async] --contradicts--> [title pytest]
[S27] --resource--> [S28 mocks] (good forward edge)
```

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in Explorer. Paths relative to repo root. Diffs are representative; Fixer should expand boilerplate purge across all paragraphs.

### Diff A — Remove meta-leak from jobRelevance (ISSUE-01/02)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
   jobRelevance:
-    "Un motor de **entity resolution** solo es confiable si normalización y matching son contratos ejecutables con pytest. S27 inicia CP-N3 con estrategia de pruebas (riesgo×capa, unit/contract, fixtures, mutantes). Id legacy `async-concurrency` se conserva; el path V3 es estrategia de pruebas con pytest, no asyncio concurrente.",
+    "Un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest. En esta sección inicias CP-N3-A: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures y demuestras con mutación conceptual que la suite realmente protege el contrato—sin etiquetar fraude ni parentesco.",
```

### Diff B — Align theory `risk_pyramid.py` output (ISSUE-06)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
-        output: `top normalize_name 20
-layers ['unit', 'unit', 'integration', 'e2e']
-unit_heavy True`,
+        output: `['normalize_name', 'exact_match', 'sqlite_repo', 'ui_review_queue']
+top_layer unit
+ok True`,
```

### Diff C — Align iDo `risk_rank_demo.py` output (ISSUE-07)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
-          output: `order ['normalize', 'blocking', 'repo_sql', 'review_ui']
-top_layer unit
-pyramid_ok True`,
+          output: `['normalize', 'blocking', 'repo_sql']
+top_layer unit
+ok True`,
```

### Diff D — Strip youDo meta-leaks (ISSUE-03)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
     context:
-      "Construye una mini suite sobre funciones sintéticas de normalización y exact match (contactos fakes @example.pe, run_id cpn3a-01). Cada supuesto del ER futuro debe ser un test ejecutable. Incluye pirámide de riesgo, AAA, fixtures aisladas, bordes y al menos una prueba de mutación conceptual. No marques section_passed ni edites ledger/seed.",
+      "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (caso `CASO-LIM-027`, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable: mapa de riesgo por capa, tests AAA con oráculos fijos, fixtures con aislamiento function-scope, casos negativos con mensajes útiles, cobertura de ramas de umbral y al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco.",
@@
     portfolioNote:
-      "Paquete de inicio CP-N3-A: suite de contratos pytest (o asserts ejecutables) sobre normalización/matching sintético. Otra lane califica PASS; no editar checkpoint/ledger.",
+      "Entrega de inicio CP-N3-A para tu portafolio: carpeta con código de normalización/matching sintético, tests (pytest preferido), README en español profesional con límites y evidencia de corrida.",
@@
     rubric: [
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Cubre los objetivos de contratos pytest de esta sección (riesgo, AAA, fixtures, bordes, mutación)", weight: "25%" },
```

### Diff E — Example: rewrite one theory paragraph to kill boilerplate (ISSUE-04 pattern)

Apply analogously to all subtopics: **one** CASO mention in overview; each T* paragraph unique.

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
       paragraphs: [
-        "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Evita asserts mezclados con setup. La pirámide y el diseño AAA hacen que normalización/matching sean *contratos* verificables (inicio CP-N3-A), no scripts frágiles. Documenta evidencia y límites del fixture `CASO-LIM-027` (run_id=cpn3a-01): sin PII real y sin auto-veredicto.",
-        "Un **oráculo** es la fuente de verdad del assert: valor fijo conocido, propiedad invariante o resultado de un algoritmo de referencia simple. Contrato operativo: entrada casos pytest del fixture `CASO-LIM-027` (run_id=cpn3a-01) → node ids estables y asserts con oráculo fijo; fail-closed si un comparador no distingue banda review.",
-        "Oráculos frágiles (timestamps de reloj real, orden de dicts en JSON sin sort) generan flakes. Prefiere fixtures sintéticas deterministas. Caso sintético PE: módulo `normalize_name`/`exact_match` sobre contactos Lima `@example.pe`; cobertura reporta ramas de negocio, no solo líneas.",
+        "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada o el comparador: pierdes tiempo en CI.",
+        "Un **oráculo** es la fuente de verdad del assert: (1) valor fijo conocido (`\"juan pérez\"`), (2) propiedad invariante (longitud ≥ 0 tras normalizar) o (3) resultado de un algoritmo de referencia simple. En matching, el oráculo **no** es un veredicto de fraude: solo responde si dos cadenas normalizadas son la misma entidad sintética.",
+        "Oráculos frágiles generan *flakes*: reloj real (`datetime.now()`), orden de `set`, JSON sin `sort_keys`. Usa contactos sintéticos deterministas (`ana@example.pe`) y fija fechas literales (`date(2026, 7, 20)`). Si el assert depende del azar, no es contrato.",
```

### Diff F — Shorten weDo instruction template (ISSUE-05); fix starter extra print (ISSUE-08) — example E1

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
         instruction:
-          "S27-T1-A-E1 · Dado impact=5 likelihood=4, imprime score=impact*likelihood. Fixture sintético `CASO-LIM-027` (run_id=cpn3a-01, @example.pe): la entrada es el starter completo; implementa solo el DEFECT indicado sin reescribir datos ni asserts. Contrato I/O: imprime las líneas exactas del solution output (pass string = salida del oráculo). Datos sintéticos only; no etiqueta fraude ni parentesco.",
+          "S27-T1-A-E1 · El score de riesgo es `impact * likelihood`. Con impact=5 y likelihood=4, corrige el starter (hoy suma) e imprime solo el score numérico. Datos sintéticos; no etiquetes fraude ni parentesco.",
@@
           code: `# CASO-LIM-027 · risk = impact*likelihood
 # DEFECT: suma en vez de producto
 impact, likelihood = 5, 4
-print(impact + likelihood)
-print('ok', True)
+print(impact + likelihood)
 `,
```

*(Repeat: remove trailing `print('ok', True)` from all starters; rewrite each instruction to task-specific Spanish without DEFECT/harness jargon—or keep one global weDo intro paragraph with the CASO ethics once.)*

### Diff G — Replace trivial E2 with real fixture-scope concept (ISSUE-09/10 sample)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
         id: "S27-T2-B-E2",
@@
         instruction:
-          "S27-T2-B-E2 · Imprime 'function' como scope por defecto de fixture. …",
+          "S27-T2-B-E2 · Dado un dict de scopes permitidos, imprime el scope por defecto de pytest para fixtures de datos mutables (el más seguro contra contaminación entre tests).",
@@
-          code: `# CASO-LIM-027 · factory function
-# DEFECT: imprime class
-print('class')
-print('ok', True)
-`,
+          code: `# Scope por defecto para datos mutables en tests
+# El starter elige un scope demasiado amplio
+default_scope = 'session'  # defectuoso para listas mutables
+print(default_scope)
+`,
@@
-          code: `print('function')`,
+          code: `default_scope = 'function'
+print(default_scope)`,
```

### Diff H — Add one authentic pytest theory demo (ISSUE-10/17) — insert/replace T2-A code

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
         title: "discovery_assert.py",
-        code: `# simulación didáctica de discovery + assert rewrite (sin invocar pytest CLI)
-import ast
-...
-`,
-        output: `discovered ['test_normalize_spaces', 'test_casefold']
-count 2
-assert_ok True`,
+        code: `# test_normalize.py — forma real que pytest descubre (concepto)
+# Ejecutar en tu máquina: python -m pytest test_normalize.py -q
+
+def normalize_name(s: str) -> str:
+    return " ".join(s.casefold().split())
+
+def test_normalize_spaces():
+    assert normalize_name("  Ana  López ") == "ana lópez"
+
+def test_exact_match():
+    assert normalize_name("ANA") == normalize_name(" ana ")
+
+# En este entorno del curso mostramos el contrato sin CLI:
+assert normalize_name("  Ana  López ") == "ana lópez"
+print("node_ids", ["test_normalize_spaces", "test_exact_match"])
+print("assert_ok", True)
+`,
+        output: `node_ids ['test_normalize_spaces', 'test_exact_match']
+assert_ok True`,
```

### Diff I — Heading capitalization pass (ISSUE-11)

```diff
-      heading: "riesgos y pirámide de pruebas",
+      heading: "Riesgos y pirámide de pruebas",
-      heading: "discovery y assertions",
+      heading: "Discovery y assertions de pytest",
-      heading: "fixtures, scopes y aislamiento",
+      heading: "Fixtures, scopes y aislamiento",
-      heading: "excepciones, floats, fechas y archivos temporales",
+      heading: "Excepciones, floats, fechas y archivos temporales",
-      heading: "casos negativos y mensajes",
+      heading: "Casos negativos y mensajes útiles",
-      heading: "branch y risk coverage",
+      heading: "Cobertura por rama y por riesgo",
-      heading: "mutación conceptual, fallas útiles y mantenimiento",
+      heading: "Mutación conceptual, fallas útiles y mantenimiento",
```

### Diff J — Self-check diversify Q5 (ISSUE-15)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@
       {
-        question: "Una mutación que no falla ningún test indica…",
-        options: ["que el código es perfecto y no hace falta más cobertura", "que pytest discovery está roto", "brecha de oráculo o de casos: hay que añadir regresión", "que hay que borrar los fixtures"],
-        correctIndex: 2,
-        explanation:
-          "Surviving mutants señalan tests débiles; el ciclo bug_repro → regression_test cierra el hueco.",
+        question: "¿Cuál es el scope por defecto de una fixture de pytest y por qué importa en datos mutables?",
+        options: [
+          "session: reutiliza estado entre todos los tests (ideal para mutar listas)",
+          "function: se recrea por test y reduce contaminación entre casos",
+          "package: solo existe en unittest, no en pytest",
+          "module: es el único scope que aísla copias profundas automáticamente",
+        ],
+        correctIndex: 1,
+        explanation:
+          "El default es function-scope: cada test recibe un setup fresco. Mutar un fixture session/module sin cuidado produce flakes de orden.",
       }
```

### Diff K — Bridge paragraph S26→S27 (ISSUE-13) — overview P1 rewrite sketch

```diff
-        "Aquí **inicias CP-N3-A**: convertir supuestos de normalización y matching en **contratos de prueba** con pytest. La pirámide y el diseño AAA …",
+        "En S26 orquestaste el VP con evidencia por estado. Aquí **inicias CP-N3-A**: conviertes los supuestos de normalización y matching que ese pipeline asume en **contratos de prueba** con pytest, para que un cambio futuro no rompa en silencio lo que ya automatizaste. Empiezas por la pirámide y el diseño AAA; el caso sintético es `CASO-LIM-027` (run_id=`cpn3a-01`, contactos `@example.pe`) sin PII real y sin auto-veredicto de fraude.",
```

### Diff L — Identity note for Fixer (ISSUE-01 ops; optional coordinated rename)

```text
# NOT a silent one-line fix — coordinate with routing/SECTION_MAP/progress keys:
# - Prefer keep hash `async-concurrency` ONLY if product requires stable URLs,
#   but then NEVER mention legacy in learner prose (Diff A).
# - Long-term: rename id → `pytest-contracts` (or similar), file → s27-pytest-contracts.ts,
#   update SECTION_MAP.tsv, imports, and any progress migration map.
# Explorer does not apply rename in this pass.
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue(s) | Why first |
|------:|----------|-----------|
| 1 | ISSUE-06, ISSUE-07 | Broken code/output destroys trust immediately |
| 2 | ISSUE-02, ISSUE-03 (M1–M4) | Meta-leaks are non-negotiable redaction failures |
| 3 | ISSUE-04 | Boilerplate purge restores readability and progressive disclosure |
| 4 | ISSUE-08, ISSUE-05 | Exercise harness must be consistent and learner-facing |
| 5 | ISSUE-10, ISSUE-17, ISSUE-09 | Make practice authentic pytest (or honestly downgrade LOs) |
| 6 | ISSUE-16, ISSUE-13, ISSUE-14 | youDo scaffold + narrative bridge + load |
| 7 | ISSUE-11, ISSUE-12, ISSUE-15 | Editorial polish + quiz diversity |
| 8 | ISSUE-01 (rename), ISSUE-19 enrichment, ISSUE-18/20/21 | Identity ops + depth + minor metadata |

**Suggested Fixer success criteria (expert, not regex):**
- No learner-visible “legacy id”, “ledger”, “lane”, “gate V3”, “section_passed”.  
- Zero repeated identical CASO/Contrato operativo tails across subtopics (mention CASO once in overview + once in youDo).  
- Every theory/iDo `output` matches executing `code`.  
- At least 2 demos and 4 exercises use recognizable pytest shapes (`test_*`, fixture injection concept, parametrize table, or `raises`).  
- E3 tasks require transfer (design a case table / kill a mutant with a new assert), not literal print.  
- Target expert rank **≥ 9.0** only after human read of live paragraphs—not length metrics.

---

## 8. Graph Memory Update Notes

Write into shared graph context (do not treat prior “all gold” as true for S27):

```yaml
section: 27
id: async-concurrency
file: s27-async-concurrency.ts
v3_topic: pytest_contracts_cpn3a
explorer_score: 4.8
status: needs_fixer
false_green:
  - S27_AUDIT.json ACCEPT 9.52
  - S27_PARAGRAPHS.md cloned 9.55 ranks
  - GRAPH_MEMORY_SUMMARY S01-S52 gold claim (override residual for S27)
edges:
  broken:
    - id_async ↛ title_pytest
    - prose_pytest_apis ↛ demos_without_pytest
    - theory_code ↛ declared_output (T1-A, iDo T1-A)
  duplicate_nodes:
    - boilerplate_piramide_aaa (×11)
    - boilerplate_contrato_operativo (×10)
    - boilerplate_caso_sintetico_pe (×9)
    - weDo_instruction_harness_suffix (×24)
  meta_leaks: [M1, M2, M3, M4, M5, M6, M7, M8]
  keep_strengths:
    - ethics_no_fraude_no_parentesco
    - risk_x_layer_framing
    - mutation_conceptual_idea
    - resources_pytest_okken_coverage
    - bridge_resource_to_S28_mock
  next_section_handoff: S28 property_integration_tests
fixer_queue_priority: P0_outputs + P0_meta + P0_boilerplate → P1_authentic_pytest → P2_editorial
```

**Note to harness:** Prior automated “gold closed” for S27 is **rejected** by this Explorer pass under `GOLD_STANDARD_CHECKLIST.md` anti-theater rules.

---

## Appendix A — Structural inventory (evidence)

| Component | Count / notes |
|-----------|----------------|
| Theory headings | 9 (1 overview + 8 subtopics) |
| learningOutcomes | 8 |
| iDo demos | 8 (`S27-T*-DEMO`) |
| weDo exercises | 24 (E1 guided / E2 independent / E3 transfer × 8) |
| youDo | 1 with rubric 6 criteria |
| selfCheck | 5 MCQ |
| resources.docs | 7 |
| resources.books | 2 |
| resources.courses | 4 |
| Synthetic privacy | Consistently stated (over-repeated) |
| Real `import pytest` in section snippets | Effectively **0** |

## Appendix B — Pass summary (STORM loops executed)

1. **Surface scan:** Live card = Pytest y contratos; source file name async; full TS read.  
2. **Deep pedagogy:** I/We/You present; authenticity low; load high from tails.  
3. **Redaction/grammar:** Headings, Spanglish, tone.  
4. **Meta-leak:** M1–M8 logged.  
5. **Comparative:** vs S01 gold prose + external pytest materials.  
6. **Loop refine:** Code/output executed mentally; exercise sample audit; issue registry consolidated.

---

This is the complete Explorer report for Section 27. Ready for the Fixer prompt.
